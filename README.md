# NEBULA FORCE — Act 1

A Shining Force–inspired tactical space RPG. Plays in any browser, phone or
desktop. No app store, no install, no coding required to work on it.

## Play it right now
Open `dist/nebula-force-act1.html` — that single file is the whole game
(same format as the prototypes from our chats). Everything else in this
folder is the same game split into clean pieces so it can grow.

## One-time setup to get your own game URL (about 15 minutes)
This puts the game on the internet for free so it runs on your iPhone (and
anyone else's) straight from Safari.

1. **Make a GitHub account** at github.com (free).
2. **Create a new repository** — click "+" → "New repository". Name it
   `nebula-force`, set it to Public, click Create.
3. **Upload this folder** — on the repo page, "uploading an existing file" →
   drag in everything inside this folder (index.html, the css/js/icons folders,
   manifest.json, the .md files) → Commit.
4. **Turn on GitHub Pages** — repo Settings → Pages → under "Branch" pick
   `main` and `/ (root)` → Save. After a minute or two your game is live at:
   `https://YOUR-USERNAME.github.io/nebula-force/`
5. **Put it on your home screen** — open that URL in Safari on your iPhone →
   Share button → "Add to Home Screen". It gets an icon and launches
   fullscreen like a real app. Your partners can do the same with the link.

## Working on the game with Claude Code
Claude Code is Anthropic's tool that lets Claude edit these files directly on
your computer — you keep talking in plain English exactly like our chats, and
it makes the changes, remembers the project via CLAUDE.md, and can push
updates to your live URL.

- Install & setup guide: https://docs.claude.com/en/docs/claude-code/overview
  (follow the official steps there — they stay current).
- Once installed, open a terminal in this folder and run `claude`. Good first
  messages to try:
  - "Read CLAUDE.md and DESIGN.md, then tell me the state of the project."
  - "Add a save system so my levels and credits persist."
  - "Create battle two: a boarding action on a Scrapfang freighter, reinforcements ON."
- After Claude Code makes changes, ask it to "rebuild the single file and
  push to GitHub" — your live URL updates automatically.

## What's in here
- `index.html` + `css/` + `js/` — the modular game (this is what gets edited)
- `js/missions/kr7.js` — the Act 1 battle; copy it to make new battles
- `js/data/characters.js` — all crew stats in one place
- `CLAUDE.md` — instructions any Claude session reads first
- `DESIGN.md` — the design bible: story, cast, balance rules, roadmap
- `dist/` — the bundled one-file build (regenerate: `python3 tools/build_single.py`)
- `legacy/` — older standalone prototypes, kept for reference
