#!/usr/bin/env python3
"""Build one Short: voice + script.json -> word timings -> Remotion props -> MP4.

Usage:
  python3 tools/make_short.py projects/<id>            # uses projects/<id>/voice.(wav|mp3|m4a|...)
  python3 tools/make_short.py projects/<id> --tts      # placeholder robot voice (espeak-ng) for style tests
  python3 tools/make_short.py projects/<id> --no-render
"""
import argparse
import glob
import json
import os
import re
import shutil
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)  # video/
sys.path.insert(0, HERE)
from align import align, fill_gaps, even_spans  # noqa: E402

FPS = 30
TAIL = 0.9  # seconds kept after the last spoken word
BROWSER_CANDIDATES = glob.glob("/opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell")


def sh(cmd):
    subprocess.run(cmd, check=True)


def duration(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path],
        capture_output=True, text=True, check=True).stdout
    return float(out.strip())


def tokenize(text):
    """'For years *Elon Musk* was paid' -> [(word, highlighted), ...]"""
    toks, hl = [], False
    for raw in text.split():
        start = raw.startswith("*")
        end = raw.rstrip(".,!?:;\"'").endswith("*")
        if start:
            hl = True
        word = raw.replace("*", "")
        toks.append((word, hl))
        if end:
            hl = False
    return toks


def norm(w):
    return re.sub(r"[^a-z0-9]", "", w.lower())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("project")
    ap.add_argument("--tts", action="store_true", help="generate a placeholder voice with espeak-ng")
    ap.add_argument("--no-render", action="store_true")
    ap.add_argument("--even", action="store_true", help="skip alignment, spread words evenly")
    ap.add_argument("--bg", help="background variant: royal | aurora | market | navy (overrides script.json)")
    a = ap.parse_args()

    proj = os.path.abspath(a.project)
    pid = os.path.basename(proj.rstrip("/"))
    spec = json.load(open(os.path.join(proj, "script.json")))
    brand = json.load(open(os.path.join(ROOT, "brand.json")))
    scenes = spec["scenes"]

    pub = os.path.join(ROOT, "public", "projects", pid)
    os.makedirs(pub, exist_ok=True)
    work = os.path.join(proj, ".work")
    os.makedirs(work, exist_ok=True)

    # ---- tokens
    per_scene = [tokenize(s["text"]) for s in scenes]
    tokens = [w for sc in per_scene for w, _ in sc]

    # ---- voice
    voice_src = None
    tts_spans = None
    if a.tts:
        # one clip per scene so scene boundaries are exact; words spread inside each clip
        parts, tts_spans, t = [], [], 0.0
        gap = 0.22
        for i, (sc, toks) in enumerate(zip(scenes, per_scene)):
            clip = os.path.join(work, f"tts_{i:02d}.wav")
            sh(["espeak-ng", "-v", "en-us+m3", "-s", "160", "-p", "40", "-w", clip, sc["text"].replace("*", "")])
            sh(["ffmpeg", "-y", "-v", "error", "-i", clip, "-af",
                "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse",
                "-ar", "22050", "-ac", "1", clip + ".trim.wav"])
            d = duration(clip + ".trim.wav")
            for sp in even_spans([w for w, _ in toks], d, lead=0.0):
                tts_spans.append([t + sp[0], t + sp[1]])
            parts.append(clip + ".trim.wav")
            t += d + gap
        lst = os.path.join(work, "tts_list.txt")
        sil = os.path.join(work, "gap.wav")
        sh(["ffmpeg", "-y", "-v", "error", "-f", "lavfi", "-i", "anullsrc=r=22050:cl=mono", "-t", str(gap), sil])
        with open(lst, "w") as fh:
            for pth in parts:
                fh.write(f"file '{pth}'\nfile '{sil}'\n")
        voice_src = os.path.join(work, "tts.wav")
        sh(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", lst, voice_src])
    else:
        cands = [p for p in glob.glob(os.path.join(proj, "voice.*"))]
        if not cands:
            sys.exit(f"No voice file in {proj} (expected voice.wav / voice.mp3 / voice.m4a ...). Use --tts for a placeholder.")
        voice_src = cands[0]

    voice_out = os.path.join(pub, "voice.wav")
    # clean + loudness-normalise the voice for Shorts (-14 LUFS), 48 kHz stereo
    sh(["ffmpeg", "-y", "-v", "error", "-i", voice_src, "-af",
        "highpass=f=70,afftdn=nf=-25,loudnorm=I=-14:TP=-1.5:LRA=9", "-ar", "48000", "-ac", "2", voice_out])
    wav16 = os.path.join(work, "voice16k.wav")
    sh(["ffmpeg", "-y", "-v", "error", "-i", voice_src, "-ar", "16000", "-ac", "1", "-sample_fmt", "s16", wav16])
    vdur = duration(voice_out)

    # ---- word timings
    spans = tts_spans
    if spans is None and not a.even:
        try:
            raw = align(wav16, tokens)
            got = sum(1 for s in raw if s)
            print(f"aligned {got}/{len(tokens)} words")
            if got >= len(tokens) * 0.6:
                spans = fill_gaps(raw, vdur)
        except Exception as e:  # noqa: BLE001
            print("alignment failed, falling back to even timing:", e)
    if spans is None:
        spans = even_spans(tokens, vdur)
    json.dump({"tokens": tokens, "spans": spans}, open(os.path.join(work, "timings.json"), "w"), indent=1)

    # ---- captions
    captions, k = [], 0
    scene_words = []
    for sc in per_scene:
        ws = []
        for w, hl in sc:
            s, e = spans[k]
            ws.append({"text": w, "start": round(s, 3), "end": round(e, 3), "hl": hl})
            k += 1
        scene_words.append(ws)
    end_all = vdur + TAIL
    for i, ws in enumerate(scene_words):
        start = ws[0]["start"]
        end = scene_words[i + 1][0]["start"] if i + 1 < len(scene_words) else end_all
        captions.append({"start": round(start, 3), "end": round(end, 3), "words": ws,
                         "hide": scenes[i].get("visual", {}) and isinstance(scenes[i].get("visual"), dict)
                         and scenes[i]["visual"].get("type") == "outro"})

    # ---- visuals ("keep" extends the previous visual through this scene)
    visuals = []
    for i, sc in enumerate(scenes):
        v = sc.get("visual", "keep")
        s0 = captions[i]["start"] if i else 0.0
        if v == "keep" and visuals:
            visuals[-1]["end"] = captions[i]["end"]
            visuals[-1]["_scenes"].append(i)
            continue
        v = dict(v)
        v.update({"start": round(max(0.0, s0 - 0.1), 3), "end": captions[i]["end"], "_scenes": [i]})
        visuals.append(v)
    visuals[-1]["end"] = end_all

    # resolve "at": "<word>" triggers -> seconds relative to visual start
    def resolve(vis, val):
        if not isinstance(val, str):
            return val
        target = norm(val)
        for si in vis["_scenes"]:
            for w in scene_words[si]:
                if norm(w["text"]).startswith(target):
                    return round(max(0.0, w["start"] - vis["start"] - 0.05), 3)
        print(f"  warning: trigger word '{val}' not found in visual {vis['type']}")
        return None

    def walk(vis, obj):
        if isinstance(obj, dict):
            for key, val in list(obj.items()):
                if key in ("at", "markAt", "winnerAt", "labelAt", "subAt", "sourceAt"):
                    obj[key] = resolve(vis, val)
                else:
                    walk(vis, val)
        elif isinstance(obj, list):
            for x in obj:
                walk(vis, x)

    for vis in visuals:
        walk(vis, vis)
        vis.pop("_scenes")

    # captions marked hide (outro) are dropped: the outro has its own typography
    captions = [c for c in captions if not c.pop("hide")]

    # ---- music
    music = None
    if spec.get("music") is not False:
        tracks = sorted(glob.glob(os.path.join(ROOT, "public", "music", "*.*")))
        if spec.get("music"):
            music = "music/" + spec["music"]
        elif tracks:
            music = "music/" + os.path.basename(tracks[0])

    props = {
        "fps": FPS,
        "durationInFrames": int(round(end_all * FPS)),
        "voice": f"projects/{pid}/voice.wav",
        "music": music,
        "musicVolume": spec.get("musicVolume", 0.13),
        "captions": captions,
        "visuals": visuals,
        "brand": brand,
        "background": a.bg or spec.get("background") or brand.get("background", "royal"),
    }
    props_path = os.path.join(pub, "props.json")
    json.dump(props, open(props_path, "w"), indent=1)
    print(f"props -> {props_path}  ({end_all:.1f}s)")

    if a.no_render:
        return
    os.makedirs(os.path.join(ROOT, "out"), exist_ok=True)
    out = os.path.join(ROOT, "out", f"{pid}{'-' + a.bg if a.bg else ''}.mp4")
    env = dict(os.environ)
    if BROWSER_CANDIDATES and "REMOTION_BROWSER" not in env:
        env["REMOTION_BROWSER"] = BROWSER_CANDIDATES[0]
    subprocess.run(["npx", "remotion", "render", "src/index.ts", "Short", out, f"--props={props_path}",
                    "--codec=h264", "--crf=18", "--audio-bitrate=192k", "--log=warn"], cwd=ROOT, env=env, check=True)
    print("done ->", out)


if __name__ == "__main__":
    main()
