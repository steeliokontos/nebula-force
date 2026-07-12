# CLAUDE.md — Nebula Force

Instructions for Claude (Claude Code or any session) working on this project.
The owner, Erik, is a designer, not a coder: explain changes in plain English,
never ask him to edit code by hand, and keep everything runnable by just
opening `index.html` or the bundled file in a browser.

## What this is
A Shining Force–inspired turn-based tactical RPG with a space setting,
built as vanilla HTML/CSS/JS. No frameworks, no build step, no npm.
Plays in mobile Safari/Chrome; installable to the iPhone home screen via the
PWA manifest. Hosted on GitHub Pages (see README.md).

## Hard constraints — do not break these
- **Vanilla JS, plain `<script>` tags, shared global scope.** Files load in the
  order listed in `index.html`. No ES modules, no bundler, no TypeScript.
- **All globals must be unique across files.** Before adding a top-level
  `let`/`const`, check it isn't declared in another file. Verify with:
  `cat js/core.js js/ui.js js/data/characters.js js/town.js js/cutscenes.js js/battle.js js/missions/*.js js/main.js > /tmp/all.js && node --check /tmp/all.js`
- **One shared 480×384 canvas** (`#view`). Every mode draws into it; the town
  and battle both use scrolling cameras. Do not resize the canvas — `fitLayout()`
  scales it via CSS to fit any screen with the UI, no vertical page scroll ever.
- **One-screen mobile layout.** Anything added to the UI must fit the fixed-height
  stacks (`#ui-battle`, `#ui-town`). Never introduce page scrolling.
- **Touch gestures are locked down** (pull-to-refresh blocked). Elements that
  need to scroll must be whitelisted in main.js's touchmove guard and given a
  `touch-action` in CSS.
- **Art is code.** All sprites are text grids in `js/core.js` (`SPRITES`), colors
  from `PAL`. Tiles are procedurally drawn in `makeTownTiles`/`makeBattleTiles`.
  Keep new art in this system; do not add image assets for sprites.
- **After any change:** run the concat check above, then
  `python3 tools/build_single.py` to refresh the shareable single-file build.

## File map
- `index.html` — shell, PWA meta, script order (order matters!)
- `css/style.css` — Shining-Force-blue windows; mode-switched UI stacks
- `js/core.js` — palette, all sprites, draw helpers, shared canvas, PXS/pxr/rr
- `js/ui.js` — shared dialog window (typewriter + choices), setHint
- `js/data/characters.js` — THE source of truth for crew stats/specials/learnsets
- `js/town.js` — Rustharbor + worm house + temple interior maps, NPCs, shop,
  pack/worm-soup quest, launch cutscene, town camera (tCamX/tCamY)
- `js/cutscenes.js` — space ambush/crash, the Precursor entity finale
- `js/battle.js` — the tactical engine (see DESIGN.md for full spec)
- `js/missions/kr7.js` — Act 1 battle config; **the template for all future battles**
- `js/missions/tithe.js` — Act 2 battle 1 (Tithe Night): survive-N objective,
  green rescue unit (Dasha), player-sprung ally cage, night tint — the
  engine features for all of these live in battle.js and are config-driven
- `js/missions/glassfields.js` — Act 2 battle 2: escort objective (Fen),
  resonant shards (strike = ring, 4 dmg r2, 3 rings crumble), ringer AI
- `js/missions/tithepit.js` — Act 2 battle 3 (OPTIONAL, gated on ledgerSaved
  + Brand talk, window closes at battle 4): purge schedule, seize objective,
  healable cage NPCs, missable recruit VYE (RING FLARE)
- `js/missions/understack.js` — Act 2 battle 4: puppet web (pylon →
  custodian links), mid-battle enemy→ally conversion (BRACKET, MAG-TETHER),
  nonlethal knockdowns, Nima green unit
- `js/missions/ringwarden.js` — Act 2 battle 5 (finale): ringCycle keys
  (CYAN reach / MAGENTA seal / LIME conduit sting), terrain type 9, phased
  Keldrin, act epilogue → storyStage 6 + relicTwo
- `js/save.js` — persistent progression (CREW_PROG: levels/XP/spells survive
  between battles) + localStorage autosave; CONTINUE/NEW GAME boot prompt
- `js/main.js` — mode manager (`setMode`), all input routing, story flow, boot
- `tools/build_single.py` — bundles everything into `dist/nebula-force-act1.html`
- `tools/preview.js` — screenshots the live game (town spots + sprite/tile
  sheets) so art changes can be checked visually; art rules live in ART.md
- `legacy/` — older standalone prototypes kept for reference

## How to add a new battle
1. Copy `js/missions/kr7.js` → `js/missions/<name>.js`, rename the const.
2. Edit map rows (legend at top of kr7.js), enemy list, `config`
   (storm / reinforcements / bossPhase are all per-mission switches), dialog.
3. Add its `<script>` tag to `index.html` before `save.js`.
4. Call `startBattle(MISSION_<NAME>)` from the story flow in `main.js`.
5. Add the mission to `missionById` in `js/save.js` so a loss can resume there.

## How to add a recruit
Add an entry to `CREW_DATA` (stats, one `special`, optional `spells` + `learn`),
a sprite to `SPRITES`, and a `deploy` position in the mission. Battle roster
builds automatically. Keep the balance doctrine in DESIGN.md.

## Story flow (Act 1 → Act 2)
startIntro (opening movie: VK-9 release → Gunnar flight mode → arrival)
→ town(Rustharbor, storyStage 0; talk Okari [metOkari] → talk Hale [haleJoined]) → east exit (32,20) → MISSION_SUMP
(Dax/Hale/Gunnar; win recruits Jet, storyStage 1) → west exit (0,8) →
MISSION_SHAFT9 (adds Kharn; win recruits Vesper+Kharn, storyStage 2)
→ talkRiga (gated on storyStage 2) → startLaunch → startSpace → startBattle(MISSION_KR7)
→ battleWon → startTempleRise (cinematic, battle.js) → enterTemple
→ altar (3,2) → startEntity → whiteout → startReturnFlight (cutscenes.js,
mode 'return': crew talk → hyperwarp → Vantorr approach) → enterVantorr
(town engine, 'vantorr' map — Ceril's Crossing, 30×16 bazaar, ACT2.md is
the design bible). Act 2 flow: talk Ceril [cerilBriefed] → talk Hob at the
dray pens [hobJoined, she joins at L3] → interact with the shuttle → night
falls → MISSION_TITHE (under-strength: Gunnar caged on-map, Vesper benched;
Dasha is a hunted green unit; win → storyStage 3, dashaSaved/dashaLost +
ledgerSaved flags, market opens). Interiors: 'ledger' (Kep's shop, per-map
stock + ledgerSaved discount) and 'hall' (Hymn Hall — the tithe bowl secret:
3 donations → Bale gives Crusty Bread, +2 DEF via defBonus). Pock's
ring-mouse census → Glass Burr (+1 ATK via atkBonus). East exit at (29,9)
→ MISSION_GLASSFIELDS (stage 3; win → stage 4, fenSaved/fenLost, Fen gives
SIGNAL LENS). Stage 4: Brand (ossuary, needs ledgerSaved) [brandTalked] →
east exit choice → MISSION_TITHEPIT (optional; c3 cage = Vye; entering the
Understack first sets lostCrew 'vye'); Understack crack 'e' at (27,0) →
MISSION_UNDERSTACK (win → stage 5, bracketJoined, nimaSaved/nimaStruck,
custodiansSpared). Stage 5: talk Ceril [cerilStage5] → east exit →
MISSION_RINGWARDEN (win → stage 6, relicTwo, Halo Heart, festival town
state, Oro's stall payoff). Act 3 not built.


## Agents (agents/*.md)
Three role prompts live in `agents/`. In Claude Code, register them as subagents
(copy into `.claude/agents/` — check current docs for the exact mechanism).
In a plain chat session, Erik says "run the worldsmith on <location>" or
"architect: <battle premise>" and the session adopts that file as its
operating instructions.
- **worldsmith.md** — adds ambient life/texture to existing locations.
  Strictly additive flavor; never mechanics, items, or balance.
- **encounter-architect.md** — designs complete battles from a one-line
  premise: design memo (with threat math) for approval, then the mission file.
- **battle-polisher.md** — the second set of eyes on FINISHED battles:
  returns 3–5 approval-gated suggestions (flavor / theme / smile moments,
  plus at least one WOW swing at the battle itself — its one license to
  propose mechanics/set-pieces), never edits during analysis, never tunes
  balance (numbers in a WOW are flagged for the architect).
All must obey CLAUDE.md + DESIGN.md; all end by running the concat check
and rebuilding the single file (the polisher only after Erik approves items).

## Known gaps / roadmap (see DESIGN.md for detail)
- ~~No save system~~ BUILT (js/save.js): levels/XP/spells persist between
  battles (CREW_PROG), the journey autosaves to localStorage while walking
  in town and at every battle start, and losing a fight resumes AT that
  fight via CONTINUE. XP earned in a lost battle is deliberately discarded
  (dying must never make the force stronger). Won battles can be re-entered
  by quitting during the victory dialogs — that's Egress-style grinding,
  allowed on purpose.
- ~~Field items unusable~~ BUILT: Ration Pack / Repair Spray / Cell Pack are
  battle actions now (ITEM button; effects in BATTLE_ITEMS, battle.js).
- XP doctrine is live (DESIGN.md rule 10): every mission MUST declare `lvl`
  (see kr7.js), XP decays when crew outlevel the mission, heal XP pays at
  damage parity, casters gain +1 max MP on even levels.
- ~~Act 2 battles~~ ALL FIVE BUILT (tithe, glassfields, tithepit,
  understack, ringwarden) with recruits Hob, Vye (missable), Bracket.
- Acts 3–9, more recruits, promotion at L15
  (SF-style: new class, reset to L1, stats carry — not built yet).
