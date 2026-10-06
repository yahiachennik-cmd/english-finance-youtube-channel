"""Forced alignment of a known script against a voiceover (offline, pocketsphinx).

align(wav16k_path, tokens) -> list of (start, end) per token (seconds); None where unknown.
Each token is a display word like "$650B", "Tesla's", "2018". It is turned into spoken words
for the aligner, and the token gets the span of its spoken words.
"""
import os
import re
import wave

ONES = "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split()
TENS = "_ _ twenty thirty forty fifty sixty seventy eighty ninety".split()
# Names missing from the CMU dictionary (ARPAbet). Add more as new subjects appear.
EXTRA_PRON = {
    "elon": "IY L AA N",
    "elon's": "IY L AA N Z",
    "musk's": "M AH S K S",
    "bezos": "B EY Z OW S",
    "bezos's": "B EY Z OW S IH Z",
    "munger": "M AH NG ER",
    "buffett's": "B AH F IH T S",
    "zip2": "Z IH P T UW",
    "paypal": "P EY P AE L",
    "spacex": "S P EY S EH K S",
    "tesla's": "T EH S L AH Z",
}
SCALE = {"K": "thousand", "M": "million", "B": "billion", "T": "trillion"}


def int_words(n):
    if n < 20:
        return [ONES[n]]
    if n < 100:
        return [TENS[n // 10]] + ([ONES[n % 10]] if n % 10 else [])
    if n < 1000:
        return [ONES[n // 100], "hundred"] + (int_words(n % 100) if n % 100 else [])
    for div, name in ((10**12, "trillion"), (10**9, "billion"), (10**6, "million"), (1000, "thousand")):
        if n >= div:
            return int_words(n // div) + [name] + (int_words(n % div) if n % div else [])
    return []


def year_words(n):
    if 2000 <= n <= 2009:
        return int_words(n)
    hi, lo = divmod(n, 100)
    return int_words(hi) + (["hundred"] if lo == 0 else (["oh"] + int_words(lo) if lo < 10 else int_words(lo)))


def spoken(token):
    """Display token -> list of spoken words (lowercase)."""
    t = token.strip()
    m = re.fullmatch(r"[\"'(]*(\$)?([\d,]+(?:\.\d+)?)([KMBT])?(%|x)?[\"'),.!?:;]*(s)?", t)
    if m:
        dollar, num, scale, unit, plural = m.groups()
        num = num.replace(",", "")
        words = []
        if "." in num:
            a, b = num.split(".")
            words = int_words(int(a)) + ["point"] + [ONES[int(c)] for c in b]
        else:
            n = int(num)
            is_year = not dollar and not scale and not unit and 1100 <= n <= 2099 and "," not in m.group(2)
            words = year_words(n) if is_year else int_words(n)
        if scale:
            words.append(SCALE[scale])
        if unit == "%":
            words.append("percent")
        if dollar:
            words.append("dollars")
        return words
    t = t.lower().replace("’", "'")
    t = re.sub(r"[^a-z0-9' -]", "", t).strip("'-")
    return [w for w in re.split(r"[ -]+", t) if w]


def _read_raw(path):
    with wave.open(path, "rb") as w:
        assert w.getframerate() == 16000 and w.getnchannels() == 1
        return w.readframes(w.getnframes())


def _recognize(raw):
    """Free speech recognition with word timestamps (en-us LM)."""
    from pocketsphinx import Decoder

    dec = Decoder(samprate=16000, loglevel="FATAL")
    for w, ph in EXTRA_PRON.items():
        if dec.lookup_word(w) is None:
            dec.add_word(w, ph, True)
    out = []
    # decode in ~20 s windows to keep the search stable
    step = 16000 * 2 * 20
    for off in range(0, len(raw), step):
        chunk = raw[off: off + step + 16000]  # 0.5 s overlap
        base = off / 32000.0
        dec.start_utt()
        dec.process_raw(chunk, full_utt=True)
        dec.end_utt()
        for sg in dec.seg() or []:
            w = re.sub(r"\(\d+\)$", "", sg.word)
            if w.startswith("<") or w.startswith("["):
                continue
            t0, t1 = base + sg.start_frame / 100.0, base + (sg.end_frame + 1) / 100.0
            if out and t0 < out[-1][1] - 0.05:
                continue  # overlap duplicate
            out.append((w.lower(), t0, t1))
    return out


def _whisper(wav16k):
    """Word timestamps with faster-whisper, if a model can be loaded (needs huggingface.co once)."""
    try:
        from faster_whisper import WhisperModel
        model = WhisperModel(os.environ.get("WHISPER_MODEL", "small.en"), device="cpu", compute_type="int8")
    except Exception as e:  # noqa: BLE001
        print("whisper unavailable, using pocketsphinx:", str(e).splitlines()[0][:120])
        return None
    segs, _ = model.transcribe(wav16k, word_timestamps=True, language="en")
    out = []
    for sg in segs:
        for w in sg.words:
            for part in spoken(w.word):
                out.append((part, w.start, w.end))
    print(f"whisper: {len(out)} words")
    return out


def align(wav16k, tokens):
    """Recognise the voice, then match recognised words to the script (fuzzy).

    Robust to small differences between script and recording: unmatched tokens are
    returned as None and later interpolated by fill_gaps().
    """
    import difflib

    rec = _whisper(wav16k)
    if rec is None:
        rec = _recognize(_read_raw(wav16k))
    flat = [(ti, w) for ti, tok in enumerate(tokens) for w in spoken(tok)]
    a = [w for _, w in flat]
    b = [w for w, _, _ in rec]
    out = [None] * len(tokens)
    sm = difflib.SequenceMatcher(None, a, b, autojunk=False)
    for blk in sm.get_matching_blocks():
        for k in range(blk.size):
            ti = flat[blk.a + k][0]
            _, t0, t1 = rec[blk.b + k]
            if out[ti] is None:
                out[ti] = [t0, t1]
            else:
                out[ti][1] = max(out[ti][1], t1)
    return out


def fill_gaps(spans, total):
    """Interpolate times for tokens the aligner could not place."""
    n = len(spans)
    res = [list(s) if s else None for s in spans]
    i = 0
    while i < n:
        if res[i] is None:
            j = i
            while j < n and res[j] is None:
                j += 1
            a = res[i - 1][1] if i > 0 else 0.0
            b = res[j][0] if j < n else total
            step = (b - a) / (j - i + 1)
            for k in range(i, j):
                res[k] = [a + step * (k - i + 0.5), a + step * (k - i + 1)]
            i = j
        else:
            i += 1
    return res


def even_spans(tokens, total, lead=0.3):
    """Fallback: spread tokens over the audio weighted by length."""
    weights = [max(1, len(t)) + 2 for t in tokens]
    tot = sum(weights)
    t, out = lead, []
    usable = max(0.1, total - lead - 0.3)
    for w in weights:
        d = usable * w / tot
        out.append([t, t + d * 0.9])
        t += d
    return out
