---
name: money-shorts-editor
description: Edit a vertical YouTube Short for the English business & money channel in the house motion-graphics style (royal blue + gold, word-by-word captions, animated icons/counters/charts/cards, branded outro). Use whenever the user sends a voiceover to turn into a Short, asks to "edit / montage / render" a video, wants a style test, or wants to add a new visual type. Built on Remotion in `video/`.
---

# Money Shorts Editor

Turns **script + voiceover** into a finished 1080×1920 MP4 in the channel's style.
The style is a re-creation (from scratch) of the motion-graphics look of the owner's earlier
channel «الأول», adapted to English and to money/billionaire topics. Reference analysis:
`docs/old-style-analysis.md`.

## The style (do not drift from it)
- **Background — "Royal" (approved by the owner, channel default):** royal-blue radial gradient
  (#2a63e0 → #061447), soft light orbs drifting slowly, faint grid, drifting gold particles, gold glow
  bottom-right, optional rotating sunburst rays (`burst: true`) for hook/climax/outro.
  Deliberately bluer than «الأول»'s navy so the two channels don't look alike. Other variants exist
  for experiments only (`--bg aurora|market|navy`); don't use them in published videos unless the owner asks.
- **Caption:** top of screen (~y=210), Montserrat Black 76px, built **word by word in sync with the
  voice**; key words wrapped in `*...*` render **gold with glow**. One short sentence per scene (≤ 8 words ideal).
- **Centre visual:** one idea per scene — gold icon badge, counter, line chart, bars, gold glass list
  buttons with ✓/✗ marks, two-card compare with a winner, person card, timeline, quote.
- **Motion:** spring pop-ins, path drawing, count-ups, highlight-and-dim, blur-out exits, light flash
  (`flash: true`) on big beats, soft whoosh on every visual change.
- **Script shape:** Hook (0–3 s, shocking number or question) → the money mechanism → proof (real
  number / filing / date) → the lesson the viewer can apply → outro CTA. 20–45 s.
- **Outro:** brand from `video/brand.json` assembling from particles + tagline + follow button.

## Files
```
video/
  brand.json                 channel name, handle, tagline, CTA, background (placeholder: MONEY MINDS)
  projects/<id>/script.json  the scenes (authoring format below)
  projects/<id>/voice.*      owner's voiceover (wav/mp3/m4a/ogg/...)
  tools/make_short.py        pipeline: voice clean-up → word timings → props → render
  tools/align.py             timings: faster-whisper if a model loads, else pocketsphinx; fuzzy-matched to the script
  src/                       Remotion composition (Short.tsx, Background, Captions, visuals/*)
  public/music/              background tracks (first file used unless script.json sets "music")
  public/sfx/whoosh.wav      transition sound
  out/<id>.mp4               result (git-ignored)
```

## Workflow
1. **Setup (once per container):**
   ```bash
   cd video && npm install
   pip install pocketsphinx faster-whisper
   apt-get install -y espeak-ng        # only for --tts placeholder voices
   ```
2. **Write `projects/<id>/script.json`** (English, facts sourced — put sources in `"sources"`).
3. **Owner records the voiceover** reading the scene texts in order → save as `projects/<id>/voice.<ext>`.
   Small deviations from the script are fine (fuzzy matching); big rewrites → update script.json first.
4. **Render:** `cd video && python3 tools/make_short.py projects/<id>`
   - `--tts` → robot placeholder voice (style tests only, never publish)
   - `--no-render` → only build `public/projects/<id>/props.json` (then `npx remotion studio` to preview)
   - `--even` → skip alignment, spread words evenly (emergency fallback)
5. **QA before sending:** contact sheet
   `ffmpeg -i out/<id>.mp4 -vf "fps=1,scale=270:-1,tile=8x4" -frames:v 1 out/contact.png` and look at it;
   check captions never overlap the visual, no element leaves the frame, every scene has a visual,
   loudness ≈ -14…-17 LUFS (`ffmpeg -i out/<id>.mp4 -af ebur128 -f null -`).
6. Send the MP4 to the owner with a 2-line summary. Iterate on feedback.

## Sources gate (mandatory)
`make_short.py` refuses to render if any non-outro scene lacks a `source` that matches an id in
`"sources"`. Lesson/opinion scenes must be marked `"opinion": true`. Use primary documents first
(SEC filings, shareholder letters, court records), then Reuters/Bloomberg/WSJ/FT/AP. Verify every
number with WebSearch before writing it; rephrase to exactly what the source says. Full policy:
`docs/sources-and-media-policy.md`. The pipeline also writes `projects/<id>/description.txt`
(sources + media credits + disclaimer) for the YouTube description.

## script.json format
```json
{
  "title": "Elon Musk's Salary at Tesla Was $0. Here's Why.",
  "sources": [{"id": "proxy2018", "title": "Tesla 2018 Proxy Statement (DEF 14A)", "url": "https://www.sec.gov/..."}],
  "music": "track.mp3",          // optional, file in public/music; false = no music
  "musicVolume": 0.13,           // optional
  "scenes": [
    {"text": "Elon Musk's salary at Tesla? *Zero dollars.*",
     "source": ["proxy2018"],
     "visual": {"type": "counter", "from": 1000000, "to": 0, "prefix": "$", "label": "Tesla salary", "burst": true}},
    {"text": "and *only if* Tesla hit huge targets.", "source": "proxy2018", "visual": "keep"},
    {"text": "Stop only earning. *Start owning.*", "opinion": true, "visual": {"type": "icon", "icon": "Key"}},
    {"text": "Follow for more billionaire money lessons.", "visual": {"type": "outro"}}
  ]
}
```
- `*word*` / `*several words*` → gold highlight.
- `"visual": "keep"` → previous visual stays on screen through this scene (caption changes only).
- Any `at` / `markAt` / `winnerAt` / `labelAt` / `subAt` / `sourceAt` can be a **word from the
  visual's scenes** (e.g. `"at": "ownership"`) → the element appears exactly when that word is spoken.
  Numbers are matched without `$` (`"650b"` matches `$650B`).
- Every visual accepts `flash: true` and `burst: true`.
- The last scene should be `{"type": "outro"}` (its caption is hidden; the outro has its own text).

## Visual types
| type | fields |
|---|---|
| `icon` | `icon` (lucide-react name, e.g. Crown, TrendingUp, Ban, Key, Banknote, PieChart, Clock, Target), `label?`, `pills?:[{text, icon?, at?}]` |
| `counter` | `to`, `from?`, `prefix?`, `suffix?`, `decimals?`, `dur?`, `color?: gold/red/green`, `label?`, `labelIcon?`, `sub?` |
| `chart` | `points:number[]`, `color?`, `yLabel?`, `xLabel?`, `dur?`, `markers?:[{index, text, at?}]` |
| `bars` | `bars:[{label, value, display?, at?, color?}]`, `prefix?`, `suffix?`, `icon?` |
| `list` | `items:[{text, icon?, at?, mark?: check/cross, markAt?}]`, `highlight?:{index, at}` (≤ 4 items) |
| `compare` | `left/right:{title, icon?, value?, sub?, at?}`, `winner?: left/right`, `winnerAt?`, `loserMark?: "cross"` |
| `person` | `name`, `role?`, `image?` (in `public/images`), `credit`, `badge?:{text, at?}`, `source?:{title, sub}` |
| `timeline` | `events:[{year, text, at?, color?}]` (≤ 5) |
| `quote` | `text`, `author` (only verbatim quotes from a cited original source) |
| `clip` | `src` (`clips/x.mp4` or `images/x.jpg` in `public/`), `credit` (required), `startFrom?`, `caption?` — licensed media only, ≤ 4 s |
| `outro` | — (uses brand.json) |

To add a type: create `src/visuals/<Name>.tsx` (props `{v, f}`, `f` = frames since the visual
started; use `pop`/`prog`/`enter` from `src/anim.ts`, colours from `src/theme.ts`, wrap in `<Center>`),
register it in `src/visuals/index.tsx`, document it in this table.

## Rules
- **Never a biography.** Each Short = how they think about / made money + one applicable lesson.
- **Facts must be real and sourced** (filings, dates, numbers). No invented quotes.
- **Images/clips of real people:** being famous does not make their photos free. Only Wikimedia
  Commons CC / public domain / NASA / CC-BY YouTube, with `credit` filled; clips ≤ 4 s and ≤ 20% of the
  video; never AI deepfakes. Without an image the person card shows gold initials — that is fine.
- **Music:** only royalty-free tracks the owner is allowed to use (YouTube Audio Library etc.).
  `public/music/ambient-placeholder.mp3` is a generated placeholder.
- Vary visuals between videos (different types/order/icons) so no two Shorts look templated —
  YouTube's inauthentic-content policy.
- Finance content: general information only, never personalised advice or promised returns.

## Environment notes (cloud sandbox)
- Rendering uses the pre-installed Chromium headless shell (auto-detected under `/opt/pw-browsers`,
  override with `REMOTION_BROWSER`). ~2 min for a 30 s Short.
- Whisper models download from `huggingface.co`; if that host is blocked the pipeline falls back to
  pocketsphinx (weaker; word timing then partly interpolated). Allow `huggingface.co` in the
  environment's network settings for best caption sync.
