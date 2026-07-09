# DESIGN.md — Nebula Force design bible

Everything decided so far. Future sessions: read this before proposing changes.

## The pitch
A Shining Force–style tactical RPG in space. Five acts. A salvager on a
backwater colony digs up a Precursor relic — the first of five — and learns
from a dying future that an extra-galactic hunger is coming that UNWRITES
reality. Gather the relics before it does.

## Story spine (5 acts)
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
- **Acts 2–5 (outlined):** chase the remaining relics across the galaxy;
  13–15 recruitable characters total; two anchor characters: **Vesper**
  (psionic, already in) and **Bracket** (not yet introduced). The hunger
  gets closer each act; the relics' song gets louder the more are gathered.

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
1. Save system (localStorage on Pages): credits, inventory, hpBonus, levels/XP.
2. Battle items (use Ration Pack / Cell Pack / Repair Spray as a turn action).
3. Ceril's Crossing buildout (Worldsmith pass) + battle #2 on Vantorr
   (Encounter Architect; reinforcements ON, new twist).
4. New recruits (next: Bracket) + promotion system at ~L10.
5. Unique sprites for Dossa/Harrow/Yims/Tiln/Oro (currently recolors/reuse).
6. Music/SFX (Tone.js candidate).
