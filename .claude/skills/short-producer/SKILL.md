---
name: short-producer
description: End-to-end pre-production for the English business & money Shorts channel. Given any public figure (billionaire, investor, founder) or topic, research verified facts from primary sources, build a subject dossier, pick a money angle, write the English script as video/projects/<id>/script.json with per-scene sources, find licensed photos/clips, and hand the owner the voiceover text. Use whenever the owner names a person or topic to make a video about ("نديرو فيديو على Buffett", "next: Bezos", "make a short about ..."). After the voice arrives, hand off to money-shorts-editor.
---

# Short Producer (research → script → media → voice text)

The owner gives a **name** (or topic). This skill does everything up to the voiceover; the
`money-shorts-editor` skill does the edit after the voice arrives. Always follow
`docs/sources-and-media-policy.md` — it is non-negotiable.

## Step 1 — Dossier (once per person, reused for every Short about them)
File: `research/<person-slug>/dossier.md`. If it exists, read it and extend it; never redo verified work.

1. Research with **WebSearch** (WebFetch is often blocked by the sandbox network; when a primary
   document can't be opened, confirm the fact from ≥ 2 independent search results that quote it and
   say so in the "verified via" column).
2. Source priority: SEC filings / annual reports / shareholder letters / court records → the person's
   own book or full recorded interview (with date) → Reuters, Bloomberg, WSJ, FT, AP, CNBC → academic.
   Wikipedia only to find the original source, never as the source.
3. Record each fact in the table:

| # | Claim (exact wording usable on screen) | Number / date | Source title | URL | Tier | Verified via |
|---|---|---|---|---|---|---|

4. Add a **"Do not say"** list: popular myths, disputed numbers, viral fake quotes, legally sensitive
   claims (ongoing lawsuits → state only the documented facts with dates).
5. Add **"Money angles"**: 5–10 Short ideas, each = one money mechanism + one applicable lesson
   (never biography). Mark which facts each idea needs.

## Step 2 — Pick the angle
Choose the strongest idea not yet produced (check `video/projects/`). Prefer: a shocking number in the
first 2 seconds, a clear mechanism, a lesson a normal viewer can apply this week.

## Writing style (owner's rules — always apply)
**Voice:** casual, punchy **American English** — how a top US money/business Shorts creator talks to a
friend. Easy for UK/AU viewers too, so avoid heavy slang and US-only references that need explaining.
Not formal, not corporate, not "In this video we will...". Contractions always (it's, he'd, that's).
Short sentences. Concrete numbers. You-focused ("you", "your paycheck").
Fine: "here's the catch", "guess what", "that's insane", "think about that", "grew like crazy".
Avoid: "utilize", "moreover", "in conclusion", "delve", "it is important to note", clickbait lies.

**Hook (first 1–2 s, ≤ 10 words) — must be very strong.** Pick one pattern and make it specific:
- Shocking number: "Tesla paid Elon Musk a salary of... zero dollars."
- Contradiction: "Warren Buffett's biggest mistake made him billions."
- Direct question at the viewer: "Would you work for $0 a year?"
- Secret / behind the scenes: "This one clause made Bezos richer than his salary ever could."
- Stakes: "In 2008, Elon Musk was weeks away from losing everything."
The hook must be true and sourced (or a question). Never start with the person's name + biography.

**Retention (keep them watching to the end):**
- Open a loop early and close it late: "So how did he actually get paid? Here's the catch."
- Re-hook every 5–8 s with a turn: "But here's the thing...", "Guess what?", "And it gets crazier."
- Every line must earn the next one; cut any sentence that doesn't add a number, a turn or the lesson.
- Payoff = the lesson, stated simply, applicable to a normal person this week.

**Ending — fixed structure for every video:**
1. **Engagement question (CTA 1, comments)** tied to this video's lesson — a yes/no or "which one"
   question people can answer in 2 words: "Would you take $0 salary for a bigger slice? Tell me below."
2. **Share prompt (CTA 2)**: "Send this to a friend who [specific situation]." (vary the situation)
3. Outro scene: "Follow for more billionaire money lessons." (`{"type": "outro"}`)
CTA 1 + 2 use the `cta` visual (comment + share icons). Keep the whole ending ≤ 6 s.
CTA scenes are `"opinion": true` (no source needed).

## Step 3 — Script (`video/projects/<id>/script.json`)
- `<id>` = `<person>-<angle>` in kebab-case, e.g. `buffett-first-stock`.
- 25–50 s → **75–125 spoken words** (incl. ~20 words of CTA). 9–14 scenes. One sentence ≤ 8 words per scene.
- Shape: **Hook** → **open loop** → **mechanism** → **proof** (sourced number/date) → **re-hook** →
  **lesson** (`"opinion": true`) → **CTA comment** → **CTA share** → **outro** (see Writing style).
- Every factual scene: `"source": ["<id>"]` pointing to `"sources": [{id, title, url}]` copied from the
  dossier. Wording must match the source exactly in meaning (options ≠ shares, revenue ≠ profit,
  net worth always with a date, "about" for rounded numbers).
- Write numbers the way they should be **spoken and shown**: `$59B`, `12`, `2018`.
- Plan the visuals (see `money-shorts-editor` table). Vary them between videos: don't reuse the same
  sequence of types twice in a row; use `at` triggers on the key words.
- Run the gate: `cd video && python3 tools/make_short.py projects/<id> --tts --no-render`
  → must pass with no "FACT-CHECK GATE" errors.

## Step 4 — Media (optional but recommended: 1–3 per Short)
- Allowed: Wikimedia Commons (CC BY / CC BY-SA / public domain), NASA & US-government (public domain),
  YouTube videos licensed **CC BY**. Nothing else without written permission. No AI deepfakes.
- Find candidates with WebSearch (e.g. `site:commons.wikimedia.org "Warren Buffett" jpg`).
- Record each in `video/projects/<id>/media.json`:
  `[{"file": "images/buffett-2015.jpg", "page": "<commons page url>", "author": "...", "license": "CC BY-SA 4.0", "credit": "Photo: <author>, CC BY-SA 4.0, via Wikimedia Commons"}]`
- Download into `video/public/images/` or `video/public/clips/` with curl. **If the network blocks it**
  (current sandbox blocks wikimedia/nasa), give the owner the list of page links to download and upload
  in chat (or ask them to allow `commons.wikimedia.org`, `upload.wikimedia.org`, `images-assets.nasa.gov`).
- Use via `person` (`image`) or `clip` (`src`) visuals with `credit`. Clips ≤ 4 s, total ≤ 20% of the Short.

## Step 5 — Deliver to the owner (in Arabic, short)
1. The angle in one line + why it will hook.
2. **Voiceover text** in one plain English paragraph (no asterisks), ready to record.
   Recording tips: quiet room, phone close, natural energetic pace, one take is fine, small slips OK.
3. Sources list (markdown links) — owner can check anything.
4. Media the owner must download (if any).
5. Optional: a `--tts` preview render so the owner sees the visuals before recording.

## Step 6 — After the voice arrives
Save as `video/projects/<id>/voice.<ext>` → follow `money-shorts-editor` → send the MP4 +
`description.txt` (sources, credits, disclaimer) for the YouTube description. Update the dossier's
"Money angles" (mark produced) and `docs/roadmap.md`.
