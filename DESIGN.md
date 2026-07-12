# DESIGN.md — Nebula Force design bible

Everything decided so far. Future sessions: read this before proposing changes.

## The pitch
A Shining Force–style tactical RPG in space. Nine acts (expanded from the
original five — the relic count stays five; the extra acts are room for the
chase to breathe, detours, and the hunger arriving in stages). A salvager on
a backwater colony digs up a Precursor relic — the first of five — and learns
from a dying future that an extra-galactic hunger is coming that UNWRITES
reality. Gather the relics before it does.

## Story spine (9 acts)
- **Act 1 (built):** OPENING MOVIE — Dax released from Penal Station VK-9
  after nine years (salvage-rights fraud); GUNNAR-7, his robot companion, put
  himself in suspended animation for the whole sentence, bought a FLIGHT MODE
  at auction, and flies him to Rustharbor to start over → Okari's job (crew
  required) → Sister Hale recruited at the shrine (duty to serve, wants him
  safe; SHE GUARDS A SECRET beneath the shrine — planted for later acts) →
  BATTLE 1: the Eastern Sump (Dax + Hale + Gunnar vs sump fauna and the
  Maw; recover JET) → BATTLE 2: Shaft Nine (Kharn joins at the adit;
  tunnel fight vs rogue mining machines with vermin reinforcements vs
  EXCAVATOR PRIME; recover VESPER; DAX PULLS THE PRECURSOR RELIC from the seam face — the deep song was calling HIM since landing) → launch (gated until crew is whole) →
  Scrapfang ambush → crash on asteroid KR-7 → claim war vs Capt. Vash
  Reeve → the world shatters, the temple rises → the entity's warning →
  the fold home → Vantorr. One relic found, four to go.
  Recruitment doctrine: the force is FOUND, not issued — every act should
  gate at least one battle behind an under-strength roster.
- **Act 3 (designed, not built — ACT3.md is the bible):** "The Long Quiet"
  (working title). No new planet: the crew is pulled from the fold and
  swallowed by the SETTLEMENT, a city-sized collection vessel whose
  nameless owner has spent generations "buying quiet" — paying worlds to
  silence their relics so the hunger arrives unheard. The whole act happens
  aboard; relic three is already in the ship's vault, bought legally, and
  the chase becomes a heist. Signal Lens payoff act (masquerade reveal).
- **Acts 2–9 (outlined):** chase the remaining four relics across the galaxy
  (not every act finds one — some acts are the cost of the chase);
  13–15 recruitable characters total; two anchor characters: **Vesper**
  (psionic, already in) and **Bracket** (not yet introduced). The hunger
  gets closer each act; the relics' song gets louder the more are gathered.
  Promotion at L15 lands mid-campaign (~acts 4–6) — see the XP doctrine
  in the roadmap notes.

## Cast (current crew)
| id | Name | Class | HP/ATK/DEF/AGI/MOV | ✦ Special (once per battle) |
|---|---|---|---|---|
| dax | DAX | Ex-convict salvager, nine years VK-9 (leader; if he falls, battle lost) | 26/11/6/8/5 | RIFTBREAK — ignores DEF, +4, can't miss |
| kharn | KHARN | Moon-wolf | 24/12/4/11/6 | LUNAR RUSH — immediate second full turn |
| gunnar | GUNNAR-7 | Dax's loyal war-bot (waited 9 yrs in suspended animation; has a personal FLIGHT MODE) | 34/10/9/4/4 | BULWARK — +6 DEF, taunts nearby enemies until his next turn |
| jet | JET | Flying courier | 20/9/4/6/7 fly | EXTRACTION — swap with any ally, free, still acts |
| vesper | VESPER | Mage | 16/4/3/7/5, 12 MP | BLINK — teleport ≤3 tiles, free, turn continues |
| hale | SISTER HALE | Healer, sworn to see Dax's road arrive safely; keeps a secret under the ridge shrine | 18/5/4/6/5, 10 MP | CRYO-CALL — revive one fallen ally at half HP |

Spell learnsets — SLOW BY DESIGN, one every few levels so each lands as an
event: Vesper L4 PSY LANCE (r2–3, 14), L7 GRAVITON (r1–3, 19). Hale L5 AURA
(heal 7 to allies within 2), L8 MEND II (16).
FIELD EXPLORATION: missions with config.explore let the player walk Dax
around the cleared battlefield before leaving (LEAVE AREA button). POIs are
defined per-mission (draw + handler). Sump POIs: a hollow stump holding the
SUMP-CURED MACHETE (Dax ATK+2, keen vs Fauna — first weapon; weapons live in
equippedWeapons{} and grant flat ATK plus +2 vs a matching enemy class), and
JET, legs-up in the mud in the far corner — MISSABLE. Leave without him and
lostCrew gets him forever (a plaza notice twists the knife). Missable
recruits are a recurring, deliberate cruelty: search everything, always.
Town NPCs of note: Foreman Okari, Venn (walk-in shop east of the plaza, sells a mysterious Dormant Spore), Pip, Riga (launch), Gloop (sentient sludge), Mother Skitterly
(worm soup quest: talk 3× → soup → permanent +3 max HP to one crew member).

## Promotions (L15) — normal + SECRET
Every character can promote from L15 (SF-style: new class name, level
resets to 1, stats carry). **Promotion is a CHOICE, never automatic** —
offered at L15, declinable, returnable-to. Unpromoted level cap is L20:
delaying past 15 buys extra stat rolls that carry over, at the price of
fighting harder acts under-classed. The XP decay prices this correctly on
its own: grinding 15→20 against old missions is throttled to a trickle,
but pressing forward unpromoted stays rewarding because mission levels
(~3/act) catch back up. Post-promotion, the reset to L1 re-opens the XP
faucet — veterans zoom through their early promoted levels. At the L20
cap, XP stops accumulating (build this guard with the promotion system).
A few characters ALSO have a secret promotion, unlocked by a specific
held item or completed chain quest at the moment of promotion. Secret
promotions are never hinted at directly — missable-cruelty doctrine
applies in full. Choosing to delay promotion is itself the final leg of
some secrets (see the Compassion Chain: Dax must still be unpromoted
when the artifact arrives in early Act 4).

**The Compassion Chain (Dax: HERO → ASCEN) — decided, spans acts 1–4:**
1. Act 1: Worm Soup (Mother Skitterly's quest — already in the game). It
   begs to be eaten (+3 max HP, USE button right there). Keeping it is a
   leap of faith with a real cost. Eating it silently locks the chain.
2. Act 2: CRUSTY BREAD — earned by a secret action (TBD in the Act 2
   build). Same tension: usable for +2 DEF to one character, or hoarded.
3. Act 3: a MYSTERIOUS TREAT — given by someone/something secret. Two
   proposals on file, Erik picks ONE: the hidden bilge goo pool aboard the
   Settlement gives it (ACT3.md §4a — braids this chain into the goo
   trail below), or a saved Nima gives it (ACT2.md Open Question #3 —
   crueler; dies with `nimaStruck`).
4. Early Act 4: a STARVING MAN asks if you have food. Each quest food you
   give: "thanks... I was starving." Give all three (talk 3×, holding all
   three unused) → he transforms — an alien entity testing the human race
   for compassion. You passed: he grants the ANCIENT ALIEN ARTIFACT.
5. If Dax holds the artifact when he promotes at L15: **ASCEN** class
   instead of HERO. (If he already promoted before Act 4 — the artifact
   missed its moment. Timing is part of the test.)

Partial gives are absorbed with a thank-you and nothing else — feeding
him two of three wastes them. The chain rewards hoarding, generosity, and
patience in that order, which is the joke and the point.

Engine note for the promotion build: promotion data lives per-character in
characters.js — normal class plus optional secret variants, each with a
condition checked at the moment of promotion (e.g. item in inventory).

**THE NEIGHBOR (the goo trail) — campaign secret, spans acts 1→9. Decided
in outline; the ending is deliberately not nailed down yet:**
Every act's main town hides ONE goo pool, each harder to find than the
last — Rustharbor's sits in the open with Gloop beside it; the Settlement's
takes a three-step unmarked trail into the bilge (ACT3.md §4a); later acts
escalate from there. Touching a pool sets a per-pool flag (`gooPools`
object, persisted in save.js — NOT built yet). The goo is one organism —
one *neighbor* — keeping pace with the crew across worlds; the Dormant
Spore reactions and "something waves back" have been the tell since Act 1.
No dialog ever confirms any of this before Act 9.

**The payoff:** touch ALL pools before the end of the Act 9 opening and
the neighbor finishes the wave it started in Rustharbor — leading to a
**secret promotion** for one character (uses the secret-variant promotion
system above). Recipient candidates, no ruling yet: (a) Kharn — the goo
has never once pretended around the moon-wolf; (b) whoever the player has
standing at the final pool; (c) Gloop himself joins, and the promotion is
his. Erik decides by ~Act 6 so seeds can point the right way.

Build status: Act 1 pool exists in the live game but sets no flag
(retrofit the flag when the trail system is built, and give the pool-touch
a small once-only moment worth remembering). Act 2 (Vantorr) has NO pool —
open question: retrofit a hidden cistern under the Hymn Hall, or canonize
that some worlds don't have one and shorten the trail (ACT3.md Open
Question #4). Rule of thumb for the trail: pools stay touchable wherever
the town stays revisitable; pools on places that leave the campaign (the
Settlement) are missable forever, which is the doctrine working as
intended.

## Balance doctrine (Erik's rules — keep these)
1. **No health sponges.** Enemies die in 2–3 focused hits; fights end because
   of decisions, not attrition.
2. **Squishies are genuinely killable**: 2–3 exposed enemy hits kill Vesper/Hale.
   Losing crew here and there is expected; that's what CRYO-CALL is for.
3. **Wings buy MOV, not initiative** — flyers have low AGI; ground fighters
   usually act first (Dax before Jet).
4. **Turn order = AGI × rand(0.8–1.2), reshuffled every round, hidden from
   the player.** Surprises are a feature.
5. **Free repositioning until you act** — moving is exploratory; attacking/
   casting locks you in.
6. **Every fight must be unique**: per-mission events (storm, reinforcements,
   boss phases), plus random elements so replays differ. Maps big enough
   (18×13, 10×8 camera) that formations and body-blocking matter.
7. **Enemies are walls in pathing** — plugging chokepoints with Gunnar works;
   the AI hunts kills first, then the wounded, then MP-bar units (mage/healer).
8. **Level-ups are wild, not rubber-banded**: per stat rolls (HP +1–2, 8% +3;
   ATK/AGI 50% +1, 8% +2; DEF 45% +1) with hard floors so no character can
   roll into the trash tier (HP ≥ base+2/level, ATK catch-up every 2 levels).
   25 XP per level, earned mid-battle (damage ≈ dmg×0.9 capped 10, kill +10,
   heals give XP too).
9. **Boss regen only in phase 2 and only beatable-by-focus** (Vash: 48 HP,
   +3/turn regen, party focused output 20–25/round → pressure, not a slog).
10. **XP doctrine (calibrated by simulation for 9 acts, promotion L15
   mid-Act-3 / start of Act 4, ~60% of the game promoted):**
   - Every mission declares `lvl` ≈ 3×(act−1)+battle# (kr7.js template).
   - Past mission level +3, XP halves per 3 levels of gap (giveXP). This is
     the whole economy's governor: it stops runaway leaders, lets benched
     crew catch up fast, and makes boss-regen farming / battle-replay
     grinding self-limiting instead of forbidden.
   - Heal XP pays at damage parity (×0.9, cap 10); AURA cap 10. Healers
     level ~1 act behind the pack — intended, not a bug.
   - Casters gain +1 max MP every even level, so spell counts grow with the
     campaign instead of flatlining at 3–4 casts per battle.
   - XP from LOST battles is discarded (save.js harvests only on victory) —
     dying must never make the force stronger.
   - Promotion at L15 is SF-style: new class, level resets to 1, stats
     carry. The decay then naturally re-opens the XP faucet post-promotion.

## Battle systems (implemented in js/battle.js)
- Terrain: boulders (cost 2, 15% evade), debris (cost 2, 30% evade), crystal
  vents (3 dmg on turn end, ground only), void (flyers only), sealed seam
  (becomes void at boss phase). Land effect is EVASION, Shining Force style.
- Asteroid storm: EVERY round schedules 6 single-tile (8 dmg) + 2 heavy 2×2
  (10 dmg) telegraphed strikes that land at the top of the next round. Heavies
  leave boulders 45% of the time — the map deforms over a fight. AI avoids
  warned tiles.
- Reinforcements: built, per-mission flag (OFF for KR-7 — it's hard enough).
- Boss phase at 50%: chasm opens, +2 ATK, +3 regen, units scramble clear.
- Cinematic side-view battle scenes (lunges, slashes, HP windows, cut-in
  banners, pixel-shatter deaths); FAST toggle resolves on-map instead.
- Units walk their computed paths tile-by-tile; camera follows the action;
  drag to pan; tap-vs-drag threshold 12px.
- Crit 8% ×1.5; damage = max(1, ATK−DEF) ± 10%.

## Enemy AI doctrine (Erik's rules)
Shining Force fights are about ENGAGING, not being chased — but VARIETY IS
THE SPICE OF LIFE: not every battle groups up. The per-battle question is
"what mix makes THIS fight require thought?" The toolbox:
- **Hunters (default)** — no flags: the unit comes for you from round one.
  Whole battles can be hunters (Shaft Nine; Tithe Night's raid SHOULD press).
- **Guard pockets** — `guard:true` + `group` name + `aggro` radius: the
  pocket holds until an ally strays inside the radius, anyone in the group
  takes damage (even a miss counts as engagement), or a rock lands on them —
  then the whole pocket commits, permanently. Holding guards still strike
  anything that wanders into reach; holding tenders keep their pack healed.
- **Tripwires** — `tripwire:{x0,y0,x1,y1}` on a guard: crossing that map
  region wakes the group no matter how far its units stand. Use for "you
  pushed past the midline and the reserves noticed."
- **Reach variety** — `rng[min,max]` manhattan, `shape:'knight'` (L-strikes,
  the safe square isn't where you think), `shape:'cross'` (straight lines).
- **Enemy healers** — `heals:{pow,rng}`: "kill the nurse first" becomes a
  real decision. Put one in a pocket, not in every pocket.
- **Map events** — `config.events`: tripwire zones or round timers that
  reshape the field mid-battle (cave-ins, floods, breaches): terrain
  rewrites with damage where it lands, mini-cinematic presentation (camera
  pull, banner, booms), and optionally a LOOT WINDOW — a chest the slide
  uncovers that a follow-up event re-buries N rounds later. Miss it and
  it's gone forever (missable-cruelty doctrine, battlefield edition).
  Reference: shaft9.js cave-in (Seam-Glass Fang, 2-round window).
Pick two or three tools per battle, never the same two as the last battle.
Current spread: Sump = 2 hunters + 3 pockets w/ healer + knight-shape; KR-7 =
hunting skiffs/boss + holding artillery/line; Shaft Nine = all hunters (the
vermin swarm SHOULD feel mindless); Tithe Night = advancing raid vs. the
clock. Built in battle.js (aggroGroup/inStrike/doHealAI/tripwire).

## Art & tone
16×16-ish text-grid pixel sprites, Shining Force blue gradient windows
(#3448b8→#16206e) with white/ink borders, gold accent #ffd23a, teal Precursor
glow #48e0d0, purple for specials #b47ae8. Fonts: Press Start 2P (display),
IBM Plex Mono (body). Writing tone: warm, wry, a little melancholy — worm
soup jokes next to cosmic dread.

## Act 1 → Act 2 bridge (built)
Victory → TEMPLE RISES cinematic (cracks, rift, temple ascends, surviving
Scrapfangs fall in, crew marches the narrow path) → temple corridor → entity
→ whiteout shimmer → black → RETURN FLIGHT: ship unharmed, crew remembers
everything (nobody wounded, everyone changed), Riga's scope says they never
left → hyperwarp → VANTORR, the ringlit world (orange planet, three neon
halo rings: cyan/magenta/lime) → landing at CERIL'S CROSSING, a bazaar grown
around a fallen ring-shard that pulses the relic's hymn (relic-two hook).
Act 2 NPCs so far: Ceril (dockmaster), Nima (shard kid), Oro (peddler).
Rustharbor Worldsmith pass: town widened to 33 cols; miners' bunkhouse (west),
Harrow's home + laundry line (east), Venn's awning-shop, moss racks by the goo;
NPCs Dossa/Harrow/Yims/Pelt(security bot)/Tiln; dust-skitter critters; living
landmarks (goo heaves + hesitating bubbles + crust lip + the shape beneath —
all faster/brighter while carrying the Dormant Spore; water shorelines/ripples;
waterfall splash; shrine motes).

## Roadmap (rough priority)
1. ~~Save system~~ DONE (js/save.js): credits, inventory, hpBonus, story flags,
   weapons, lost crew, and per-character levels/XP/spells all persist.
   Autosaves in town + at battle start; loss resumes at the battle.
2. ~~Battle items~~ DONE: Ration Pack (+12 HP) / Repair Spray (+18 HP) /
   Cell Pack (+8 MP) usable as the turn's action via the ITEM button
   (BATTLE_ITEMS in battle.js — effects tunable there).
3. Ceril's Crossing buildout (Worldsmith pass) + battle #2 on Vantorr
   (Encounter Architect; reinforcements ON, new twist).
4. New recruits (next: Bracket) + promotion system at L15.
5. Unique sprites for Dossa/Harrow/Yims/Tiln/Oro (currently recolors/reuse).
6. Music/SFX (Tone.js candidate).
