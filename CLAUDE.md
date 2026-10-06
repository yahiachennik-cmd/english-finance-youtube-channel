# Project context: English Finance YouTube Channel

## What this is
Workspace for a **faceless, AI-assisted** YouTube channel in **business & money**.
Holds strategy docs, video scripts, and the project's video-editing skill.

## Audience & monetization
- English speakers in the **US, UK, Australia** (Tier-1 ad markets).
- Revenue: AdSense (YPP), affiliates, digital products.

## Niche & angle
How billionaires and top business people **think about and make money**
(Elon Musk, Warren Buffett, Charlie Munger, Jeff Bezos, ...).
- **Rule:** never a biography. Every video answers *how they think about money / how they
  made it* and ends with a lesson the viewer can apply. The money angle drives CPM.

## Format (current phase)
- **Shorts only** at first: 15–60 s, vertical 9:16 (1080x1920).
- YPP via Shorts: 1,000 subs + 10M Shorts views in 90 days. Shorts RPM is low;
  long-form on the same topics comes later and is the main revenue.
- First subject: Elon Musk (Zip2, PayPal, 2008 crisis, $0 Tesla salary, wealth in stock not cash).

## Workflow
0. The owner names a person/topic → skill `short-producer` (`.claude/skills/short-producer/SKILL.md`):
   research dossier in `research/<person>/`, sourced script, licensed media, voiceover text.
1. Scripts written in English (Claude drafts).
2. The owner records and sends the voiceover audio.
3. Editing: skill `money-shorts-editor` (`.claude/skills/money-shorts-editor/SKILL.md`) — Remotion
   motion graphics in `video/`, word-synced captions, royal blue + gold house style.

## Rules
- The owner writes in Algerian Arabic (Darija) — reply in Arabic. All channel content is English.
- YouTube "inauthentic content" policy: no repetitive/templated AI output. Each video needs an
  original script, real analysis, and the channel's own editing style.
- **Every factual claim must be backed by a primary or top-tier source** (SEC filings, annual
  reports, shareholder letters, court records, Reuters/Bloomberg/WSJ/FT/AP). No unsourced numbers, no
  viral "quotes" without an original source. See `docs/sources-and-media-policy.md`.
- Public figures' photos/clips are NOT free to use: only CC / public-domain media with credit, clips ≤ 4 s,
  ≤ 20% of a video, never AI deepfakes of real people.
- Disclaimer on finance content ("general information, not financial advice"); disclose affiliate links.
- Never promise returns or give personalised investment advice.

## Layout
- `docs/` — strategy, roadmap, specs
- `research/<person>/dossier.md` — verified facts + sources + video ideas per person (reused across Shorts)
- `video/` — Remotion project; one folder per Short in `video/projects/<id>/` (script.json + voice)
- `.claude/skills/` — project skills (editing skill goes here)
