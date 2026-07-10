# ACT2.md — Nebula Force, Act Two: "The Ringlit World"

Design bible for Act 2. Written to be buildable in the existing engine
(town.js map/NPC/LOOTS/flag patterns, kr7.js mission template, save.js flag
persistence). Everything here obeys CLAUDE.md and DESIGN.md; where a design
needs a NEW engine capability, it is called out in the Engine Needs section
so implementation sessions can scope it. Battle rosters and threat math are
deliberately absent — see the Encounter Architect placeholder at the end.

---

## 1. Logline & tone

Act 1 ended with reality cracking open and a ten-thousand-year-old entity
speaking directly into the crew's bones. Act 2 is about dock fees.

The crew lands at Ceril's Crossing carrying one Precursor relic and a memory
nobody else shares — and immediately discovers that Vantorr does not care.
Vantorr has water rationing, tithe collectors, a crane operator with opinions
about Gunnar's tonnage, and a baker going blind at his oven. A local strongman
called the Ringwarden squeezes the Crossing with miracles he performs using
stolen ancient machinery, and everyone pays him because paying is cheaper
than hoping. The cosmic story never leaves — the relic in Dax's pack has gone
quiet *the way a singer goes quiet to listen*, because the second relic is
here, buried under all this scrap and bread and laundry — but for most of the
act the crew's problems are human-sized: protect a clerk, walk a farmer home,
figure out who's been shorting the offering bowl. The dread hums underneath.
It only surfaces at the end, for exactly one line, and then the act is over.

Tone: warm, wry, a little melancholy. Worm soup jokes next to cosmic dread —
except here it's crusty bread.

---

## 2. Story spine

Act 1 ended at `storyStage 2` with `enterVantorr()` (already built). Act 2
continues the same counter. Crew levels run ~4–8 across the act; mission
levels follow the XP doctrine formula `lvl ≈ 3×(act−1)+battle#`.

**The relic-two arc (the spine's spine):** the fallen ring-shard in the plaza
pulses the relic's hymn. The hymn is a *maintenance signal* — the three halo
rings are one enormous Precursor instrument, and the second relic (working
name: the **HALO HEART**) is its tuning core, buried in the Understack
beneath the Crossing. The Ringwarden has been strip-mining ring-glass and
keying the halo with a stolen artifact, which is why the hymn is getting
louder — and why, far away, something has started to *hear it*. Every
mainline beat advances this: the shard hums → Vesper gets hymn-sick → the
Glass Fields resonate → the Understack cracks open → the Heart is claimed
and the act's last line lands the dread.

### Beat-by-beat

**storyStage 2 — ARRIVAL (built) → open the act**
- `enterVantorr` plays (built). The Crossing is half-shuttered: it's a
  *tithe week*. Vesper is pale and quiet — the shard's hymn presses on her
  psionics (this is story, and it also writes her out of Battle 1's roster).
- Talk to CERIL (gate, Okari-pattern): he lays out the situation — the
  Ringwarden's tithe, the impound notice on the shuttle, and Gunnar-7 seized
  at the crane scales for "mass tariff arrears" (Tuck's crane can't legally
  release a war-bot; Gunnar is FURIOUS about the word "cargo"). Sets flag
  `cerilBriefed`. Ceril's ask, in passing, plants the act's signature
  mechanic: *"One favor while you're stuck here. My tally-clerk Dasha works
  late on tithe nights. See her home before the wardens make their rounds.
  Humor an old dockmaster."* Sets `dashaAsked`.
- **The dray beat — HOB joins (guaranteed, pre-Battle-1):** crossing the
  dockyard after the briefing, a position trigger (trail-exit pattern) fires
  the act's first scene of pure Crossing life: a warden skiff passes low,
  Oro's half-feral cargo-dray bolts with its load, and a wiry dockhand —
  HOB — is dragged past hanging one-armed off the harness, swearing in
  freight-code. Micro-quest, two steps, unmissable but never *issued*:
  stand in the lane the dray is dragging toward and interact (the dray is
  an NPC entity hopping between fixed tiles, Hale-pattern plus one physical
  step), then talk to Hob. She gets the beast breathing evenly, looks the
  crew over, does the arithmetic on three tithe-weeks of IOU wages — and
  hires HERSELF. Sets `hobJoined`. She is the Crossing's stake in the crew,
  and she raises Battle 1's floor for any player who lost Jet in the sump.
  See Recruits.
- The player can explore, shop, meet the town. Whenever they attempt to
  sleep it off / return to the shuttle pad (interact with the shuttle after
  `cerilBriefed` + `hobJoined`), night falls: the wardens raid the dock
  early. → **BATTLE 1: TITHE NIGHT** (MAINLINE, lvl 4, under-strength
  roster: Dax, Kharn, Hale, Hob — plus Jet if he was found in Act 1;
  Gunnar impounded, Vesper hymn-sick; the floor is 4 deployable, never 3).
  Dasha is on the map as a green unit whether or not you walked her home;
  if you never talked to Ceril's follow-up, you simply weren't warned.
- Win → `storyStage 3`. Gunnar released (Ceril "loses" the tariff paperwork).
  Outcome flags: `dashaSaved` or `dashaLost`; if saved, she keeps the tithe
  ledger — `ledgerSaved`.

**storyStage 3 — THE CROSSING OPENS**
- Market wakes up. Shop (The Crossing Ledger) fully stocked. Vesper is on her
  feet but changed: she can *transcribe* fragments of the hymn now.
- MIRRIT (glasshouse row) stops the crew: her partner FEN took the vapor rig
  into the ring-fall fields before the raid and hasn't come back; the wardens
  sweep the fields for "salvage tithe" after every raid. Sets `fenAsked`.
  This is the act's flagship rescue chain (see Quest Chains).
- East canyon exit (Rustharbor trail-exit pattern) → **BATTLE 2: THE GLASS
  FIELDS** (MAINLINE, lvl 5, full roster). Fen is a green unit at his
  crashed rig; wardens actively hunt him.
- Win → `storyStage 4`. Flags `fenSaved`/`fenLost`. The battle's end reveals
  the wardens weren't scavenging — they were *harvesting resonant glass* and
  hauling it beneath the Crossing. The ground over the Understack has begun
  to sing audibly at night.

**storyStage 4 — THE PIT AND THE UNDERSTACK** *(optional-battle window)*
- BRAND, a warden deserter hiding by the ossuary trail, will now talk — but
  only if `ledgerSaved` (Dasha's ledger proves where the tithe prisoners
  went; without it Brand stays a scared rumor). Talk to Brand with the ledger
  → unlocks **BATTLE 3: THE TITHE-PIT** (OPTIONAL, paralogue, lvl 5).
  Fire-Emblem-style: skippable forever, real reward, and the missable
  recruit VYE is inside (see Recruits). The XP decay makes this safe for
  pacing — a player who does it isn't overleveled for Battle 4.
- Meanwhile the mainline pressure builds: NIMA has gone missing. Pock saw
  her slip through the cracked Understack gate "following the song." The
  Understack gate (NE of the map, sealed tile until now) opens.
  Entering → **BATTLE 4: THE UNDERSTACK** (MAINLINE, lvl 6). Entering Battle
  4 *closes the Battle 3 window permanently* (the wardens purge the pit once
  the Understack falls — Brand's dialog twists the knife if you come back).
- Battle 4: Keldrin's dig crews and *puppeted Precursor custodians* under a
  resonator web; Nima on the map as a green unit the enemy is ordered to
  take. Freeing the custodians frees BRACKET (anchor recruit).
- Win → `storyStage 5`. Flags: `bracketJoined`, `nimaSaved`/`nimaStruck`.

**storyStage 5 — THE RINGWARDEN**
- The Understack fight cracked the node chamber; Keldrin stops pretending to
  be a tax man and goes to take the Halo Heart himself, crown blazing. The
  town beat before the finale is quiet and human: Ceril stands the dock
  crews down, Bale bakes through the night "because somebody has to," Lunett
  sings the hall empty. Talk to Ceril (gate, `talkRiga` pattern) → march up
  the ossuary trail → **BATTLE 5: THE RINGWARDEN** (MAINLINE, lvl 7).
- Win → the crown breaks, the Halo Heart comes free into Dax's hand — and
  both relics sing one chord, once. Through the dying crown, for a single
  line, something very far away *answers*. Then silence, festival, epilogue.
  `storyStage 6` = Act 2 complete; `relicTwo` set. Two relics found, three
  to go. Act 3 bridge, two threads braided: Dasha's ledger (or Brand's
  testimony) names where the tithe money actually went — off-world, to
  someone who was *buying quiet* — and with the Heart recovered, one more
  entry on Bracket's ancient maintenance route resolves legible (see
  Recruits): a heading. The ledger says who to fear; the route says where
  to fly.

### Battle index

| # | Name | Type | lvl | Objective shape | Roster note |
|---|------|------|-----|-----------------|-------------|
| 1 | Tithe Night | MAINLINE | 4 | Defend / survive N rounds | UNDER-STRENGTH: Dax, Kharn, Hale, Hob (+Jet if found in Act 1) |
| 2 | The Glass Fields | MAINLINE | 5 | Escort green unit to exit | full roster |
| 3 | The Tithe-Pit | OPTIONAL | 5 | Seize the gate / free cages | full roster; window closes at Battle 4 |
| 4 | The Understack | MAINLINE | 6 | Kill-boss + destructible side objective | full roster (+Bracket mid/post-battle) |
| 5 | The Ringwarden | MAINLINE | 7 | Kill-boss, phased | full roster |

---

## 3. Ceril's Crossing — the full town

### Geography (tile-engine buildable)

Expand `VAN_RAW` from the 18×12 placeholder to roughly **30×16** (Rustharbor
is 33×22, so this is comfortably within pattern). The canyon walls (`Q`)
frame everything; the three halo rings keep their existing sky-draw. Five
districts, laid so the walk between them makes sense (worldsmith spatial
doctrine — people live near their work):

1. **The Dockyard (SW)** — the existing landing pads (`p`), plus Ceril's
   tollhouse (a small interior, door/spawn pair like Venn's shop), Tuck's
   crane (new tile: a gantry the eye rests on — slow-swinging hook, worldsmith
   motion pass), the dray pens where HOB works the cargo-beasts (the site of
   her recruitment beat — see Recruits; after she joins, the pens' examine
   text quietly notes the drays keep looking for her), and the impound cage
   where Gunnar spends early Act 2 (examine text gold: *"GUNNAR-7 stands
   very still inside a cage rated for ore. The cage is fine. His dignity is
   not."*).
2. **The Shard Market (center)** — the ring-shard plinth (`S`, existing
   living landmark: color-cycling glow) ringed by stalls (`a`), Oro's stall,
   and **The Crossing Ledger** (the shop; interior map like `shopint`).
   Tithe week = half the stalls shuttered at act open; they visibly open as
   storyStage rises (swap `a` shuttered variant → open variant — cheap,
   readable "the town is healing" signal).
3. **Glasshouse Row (N)** — homes with walls of salvaged ring-glass panes
   (new wall tile that catches the ring colors; windows flicker in cyan/
   magenta/lime instead of Rustharbor teal). Mirrit & Fen's house, Widow
   Sol's house, Cask's still (steam ribbon, worldsmith motion). Glass
   windchimes on a line — Vantorr's answer to Harrow's laundry.
4. **The Hymn Hall (NE-center)** — a chapel built from a single curved slab
   of fallen ring, interior map (small, like `worm`): benches, Lunett's
   lectern, and the **tithe bowl** (see the Crusty Bread chain). Wall draw:
   a slow light-ripple runs the slab's length every ~20s, like a note
   traveling. The hall's congregation sings a liturgy nobody remembers the
   meaning of — it is, verbatim, a Precursor maintenance chant (the
   transplanted-culture beat: these people were brought here to tend the
   rings, ten thousand years ago, and forgot).
5. **The Understack gate & Ossuary Trail (NE / E)** — the sealed crack that
   opens at storyStage 4 (tile swap, like the shaft-nine adit examines), and
   the east canyon exit to the ring-fall fields (Battle 2/3/5 trail-exit,
   Rustharbor `checkTrailExits` pattern). Along the trail: the ossuary —
   niche-graves cut in the canyon wall, each holding a small glass bell.
   If `fenLost`, a new bell appears here. Permanently.

**The bakery** sits between the market and Glasshouse Row: Old Bale's
seam-oven is built directly over a hot ring-glass vein (living landmark:
heat-shimmer above the roof, ember-glow pulsing through the oven mouth at
the hymn's tempo — nobody in town has noticed the tempo. The player might.)

**Ambient life (worldsmith register):** ring-mice critters (existing critter
system, zones around the bakery alley and the plinth — they hoard glittering
crumbs); vapor-well mist ribbon that leans toward whoever stands closest;
dust-devils crossing the dockyard; the shard's glow occasionally *syncing*
with the pack (if the player stands adjacent 10+ seconds, one extra pulse —
never explained). The recurring gag (one per town): **the Fourth Ring
argument.** Half the town insists there used to be four rings; the other
half says there were always three; examine texts quietly refuse to settle it
("An old mural of the sky. You count the rings twice. You get a different
number each time."). This gag is load-bearing — see Seeds.

### The shop — THE CROSSING LEDGER (keeper: KEP)

Venn-pattern walk-in, interior map, `SHOP_STOCK` per-map variant (small
engine need). Stock:

| Item | Price | Note |
|------|------:|------|
| Ration Pack | 20₡ | as Act 1 |
| Repair Spray | 30₡ | as Act 1 |
| Cell Pack | 25₡ | as Act 1 |
| Glass Charm | 90₡ | "Keeps the hymn out of your dreams. That's the pitch. I don't write the pitches." — Dormant-Spore-pattern mystery item; does nothing in Act 2. Erik decides its payoff (Open Questions). |

Kep's voice: a ledger-keeper who treats every sale as a favor to the ledger,
not the customer. *"That's twenty. The book says twenty. Argue with the book."*

### Named NPCs (16 — three deepened, thirteen new)

Existing three — DEEPEN, never replace (their current lines stay as the
storyStage-2 layer; new lines branch on storyStage, Okari-pattern):

1. **CERIL** — dockmaster who renamed himself after the Crossing. Act 2's
   Okari: quest hub, tithe politics, the Dasha ask. Arc: wry appeasement
   ("We pay, they leave. The math holds.") → backbone ("The math changed.").
   Post-act, he starts un-paying ten years of tithe receipts, one refund at
   a time.
2. **NIMA** — the shard kid. She doesn't just hear the hymn, she can *sing
   it back on pitch* — she's the closest thing the tender-bloodline has to a
   living key. Wanders closer to the shard as the act progresses (literally
   move her `x,y` per storyStage). Goes missing before Battle 4. If saved:
   she's the town's quiet miracle. If `nimaStruck`: she survives, glassblind
   and silent, and the Crossing dims (her dialog becomes "…").
3. **ORO** — peddler whose stall "opens after the festival." Running gag
   pays off: the act ENDS with the Ring-rise festival, and in the epilogue
   Oro's stall is finally, gloriously open — selling commemorative shards of
   the battle you just fought. *"Ring-glass! Slightly used! Historically
   significant as of YESTERDAY!"*

New thirteen:

4. **KEP** — shopkeeper, The Crossing Ledger. One-line: believes in ledgers
   the way Lunett believes in hymns. Hook: knows exactly how much everyone
   in town owes everyone else. Quest role: shop; posts the Battle 3 rumor if
   `ledgerSaved` ("Dasha's book has PAGE NUMBERS the wardens want burned.").
5. **OLD BALE** — baker, going glassblind from thirty years at the seam-oven.
   One-line: feeds the town first, himself eventually. Hook: leaves the
   first loaf of every batch on the sill "for the rings — that's not
   religion, that's seniority." Quest role: the Crusty Bread (he is the
   payoff, never the signpost).
6. **DASHA** — Ceril's tally-clerk. One-line: young, precise, keeps the only
   honest count of ten years of tithe. Hook: "Numbers don't lie. That's why
   the wardens hate mine." Quest role: green unit in Battle 1; her ledger
   unlocks Battle 3 and seeds Act 3.
7. **TUCK** — crane operator. One-line: grieves every gram over manifest.
   Hook: an entire comic feud with Gunnar's tonnage ("Your robot is three
   permits and a prayer, friend."). Quest role: flavor; post-Battle-1 he
   quietly re-rates the crane so Gunnar is legal. Never admits it.
8. **MERES** — keeper of the vapor-well (the Crossing's water). One-line:
   doles out water like absolution. Hook: the well's level has been dropping
   since the digging started — first hard evidence the Understack is being
   hollowed. Quest role: worldbuilding pointer to Battle 4.
9. **MIRRIT** — glasshouse farmer, Fen's partner. One-line: patches every
   knee twice; someone keeps kneeling. Hook/quest role: the flagship rescue
   ask (Battle 2). Her dialog is the emotional readout of `fenSaved`/`fenLost`
   for the rest of the game.
10. **FEN** — vapor-farmer, Mirrit's partner. One-line: went out for one
    more haul before tithe week; always one more haul. Quest role: green
    unit, Battle 2. If saved, he's in town from storyStage 4 and gives the
    SIGNAL LENS (see Seeds).
11. **LUNETT** — cantor of the Hymn Hall. One-line: leads a liturgy she
    knows is older than her god and sings it anyway. Hook: the hymn's third
    verse was lost generations ago and it "bothers her like a missing
    tooth." Quest role: the Missing Verse chain; guardian of the tithe bowl.
12. **WIDOW SOL** — keeper of the ossuary trail. One-line: remembers the
    last time the rings "spoke" — she was six. Hook: half-remembers the
    lost verse her grandmother sang. Quest role: Missing Verse step 2;
    delivers the fourth-ring seed with total unconcern.
13. **POCK** — kid, Nima's rival-slash-lieutenant. One-line: is conducting
    a census of the ring-mice and will report his findings to anyone who
    stands still. Hook: mice are "evacuating" the Understack side of town —
    kids notice first. Quest role: Ring-Mouse Census; witness who saw Nima
    enter the crack.
14. **CASK** — runs the still; brews "ringshine" from lamp-lichen. One-line:
    the town's unlicensed morale officer. Hook: the wardens tithe his still
    twice because they like it. Quest role: flavor; one free round for the
    crew the night before Battle 5 (pure scene, no mechanics).
15. **BRAND** — warden deserter hiding by the ossuary. One-line: took the
    Ringwarden's coin until he saw where the prisoners go. Hook: flinches at
    the hymn — "You hear it too? He hears it MOST. That crown never shuts
    up." Quest role: unlocks Battle 3 (needs `ledgerSaved`); first-hand
    testimony that the crown *talks*.
16. **PILGRIM THESS** — off-worlder who crossed three systems to hear the
    shard. One-line: profoundly unimpressed sightseer ("I expected it to be
    taller."). Hook: the skeptical-outsider voice the banter doctrine wants;
    she's heard "miracle tax" stories on four worlds and names the
    Ringwarden's grift for what it is, loudly, in the market. Quest role:
    none. She exists so someone in town says the quiet part.

---

## 4. Quest chains

All flags persist via the existing save (`searched{}` for keyed
booleans/counters, or named fields added to save.js like `sumpJetFound`).

### 4a. THE QUIET BOWL → CRUSTY BREAD (the act's planted secret — NON-NEGOTIABLE)

Compassion Chain step 2 (DESIGN.md). The player must never be told.

- **The bowl:** the Hymn Hall holds a tithe bowl. Examine: *"A wooden bowl,
  older than the benches. It holds two bent chits and a button."* Then a
  choice, phrased as flavor, promising nothing: **Leave something? [ 10₡ /
  Not today ]**. Lunett never asks. Nobody asks. The only breadcrumb in the
  whole town is Lunett's ambient line, unconnected to any prompt: *"The bowl
  feeds whoever's hungriest that week. It always has. Don't ask me how it
  knows."*
- **The secret action:** donate on **three separate visits** (counter
  `searched['bowl-given']`; multiple donations in one visit count once —
  patience is the point, same as Skitterly's three visits).
- **The payoff:** the NEXT time the player enters the bakery (or talks to
  Bale), Bale wordlessly presses a heel-loaf into Dax's hands:
  - BALE: "Bowl says someone's been kind. The bowl talks to me. Always has —
    who do you think empties it?"
  - BALE: "Take the heel. It's the part that keeps."
  - *(✦ Got CRUSTY BREAD.)*
- **The item:** pack note (Worm-Soup register, zero guidance): *"Dense as a
  brick, warm as a promise. It keeps."* USE → pick a crew member → permanent
  **+2 DEF** (`defBonus{}`, parallel to `hpBonus{}` — engine need, small).
  Eating it silently ends the Compassion Chain. Hoarding it — never
  suggested, never hinted — carries it toward the starving man in Act 4.
- **Flags:** `searched['bowl-given']` (counter), `searched['bread-given']`
  (bool), inventory `'Crusty Bread'`.
- **Later acts:** locks/opens nothing in Act 2 itself. Chain state is simply:
  does `'Crusty Bread'` (and `'Worm Soup'`) still sit in `inventory` when the
  Act 4 starving man asks. The donated credits are gone forever either way —
  the bowl was also a small test all by itself.

### 4b. THE LONG WALK HOME (rescue template #1 — Dasha, Battle 1)

- **Trigger:** Ceril's briefing (`cerilBriefed`) includes the throwaway ask
  (`dashaAsked`). Talking to Dasha herself beforehand earns dry foreshadowing:
  *"I can carry a ledger through a dark dock, salvager. Done it ten years.
  ...Why, what have you heard?"*
- **Steps:** Battle 1 begins with Dasha on the map, a green unit clutching
  the tithe ledger. The wardens' raid has a written objective — Keldrin's
  intro dialog orders the ledger burned and "the clerk taught arithmetic."
  Enemies actively route toward her.
- **Reward (saved):** `dashaSaved` + `ledgerSaved`. Ceril's trust (dialog),
  20% shop discount at the Ledger (Kep: "Dasha vouches. The book respects
  the book."), and Battle 3 becomes unlockable.
- **Consequence (failed/ignored):** `dashaLost`. She is cut down on the map.
  The battle remains winnable. Ceril's dialog changes for the rest of the
  game — he never says her name again, and the tollhouse desk keeps a second
  chair nobody sits in. Battle 3 is locked forever (the only proof of the
  pit burned with the ledger). No shop discount. A bell in the ossuary.
- **Later acts:** `ledgerSaved` is the Act 3 hook — the ledger's last page
  shows the tithe flowing OFF-WORLD to a buyer with no name, only a mark.

### 4c. THE VAPOR RIG (rescue template #2 — Fen, Battle 2)

- **Trigger:** storyStage 3, Mirrit in Glasshouse Row (`fenAsked`). She
  doesn't beg; she hands the crew his lunch tin. *"He'll say he wasn't
  worried. Give him this so he knows I wasn't either."*
- **Steps:** Battle 2 — Fen is a green unit barricaded at his crashed vapor
  rig, mid-map, in the wardens' sweep path. Objective is to escort him to
  the exit edge; he moves on his own turn (slow), and enemies prioritize him.
- **Reward (saved):** `fenSaved`. Scene at the glasshouse (the lunch tin,
  wordless, devastating). Fen gives the **SIGNAL LENS** — his grandfather's
  halo-diver relic, "shows you the true shape of a thing, if the light's
  honest." Inert in Act 2. See Seeds.
- **Consequence:** `fenLost`. Battle still winnable. Mirrit's house goes
  dark (window tile swap). Her dialog for the rest of the game is two lines
  and neither is angry, which is worse. New bell on the ossuary trail. No
  Signal Lens — that door in a later act closes without ever being seen.
- **Later acts:** the Signal Lens is planted for an Act 3+ secret — a lens
  that shows true faces, in a campaign that has masquerading parasites
  coming. (Erik: see Open Questions.)

### 4d. THE HALO HEART (relic-two MAINLINE chain)

- **Trigger:** automatic — the act IS this chain. Steps, matching the spine:
  1. The shard (examine, existing text) + Nima's hymn dialog. Vesper
     hymn-sick (writes her out of Battle 1, storyStage 2).
  2. Post-Battle 2 reveal: the wardens harvest *resonant* glass only.
     Vesper, transcribing: "It's not a song. It's a WORK ORDER."
  3. Meres's well dropping + Pock's mice evacuating → the Understack is
     hollow and getting hollower.
  4. Nima follows the song through the crack (`nimaFollowed`) → Battle 4.
     The custodians, the resonator web, Bracket freed.
  5. Battle 5: Keldrin keys the node with the crown; the crew takes the
     **HALO HEART** off him. Both relics chord once. The answer from far
     away. `relicTwo`.
- **Flags:** storyStage 2→6 as gated in the spine; `nimaFollowed`,
  `nimaSaved`/`nimaStruck`, `bracketJoined`, `relicTwo`.
- **Later acts:** the relics now harmonize — the hymn gets LOUDER each act
  per DESIGN.md. The "answer" heard through the crown is the hunger's first
  on-screen acknowledgment that it can hear them looking for the relics.

### 4e. THE RING-MOUSE CENSUS (worm-soup register, small)

- **Trigger:** talk to Pock. He deputizes the crew into his census
  ("Fieldwork counts double if you're tall.").
- **Steps:** three unmarked examine spots (bakery alley crumb-cache, a crack
  under the shard plinth, a nest in the dockyard crane housing — LOOTS/FLAVOR
  pattern), then report back. Pock's data confirms: the mice are all moving
  AWAY from the Understack side. Kids notice first; nobody believes kids.
- **Reward:** the mice's hoard at the plinth crack: 30₡ in "borrowed" chits,
  plus **GLASS BURR** — a whetstone of ring-glass. USE: +1 ATK, one
  character, permanent (soup-pattern tiny permanent). Pock keeps the button.
- **Later acts:** none. Some quests are just a kid and his mice. (This is
  the act's pressure valve, and Pock's census sheet is the wry canary for
  Battle 4.)

### 4f. THE MISSING VERSE (worm-soup register, small — carries a seed)

- **Trigger:** Lunett's missing-third-verse hook.
- **Steps:** Lunett → Widow Sol (remembers half; her grandmother "sang it to
  the bells") → examine the oldest ossuary niche (unmarked): the verse is
  scratched inside the bell-alcove in old script. Return to Lunett.
- **Reward:** the hall sings the whole hymn once, complete, at dusk — the
  shard flares in answer, every window in town goes ring-colored for three
  seconds. Lunett gives a Cell Pack ("The hall pays its debts in what it
  has."). `searched['verse-found']`.
- **The seed (never flagged as one):** the recovered verse translates the
  liturgy's refrain that everyone already sings. Lunett, frowning at her own
  handwriting: *"Four hands to tune it. Four rings to ring it. ...That's
  wrong. That's — everyone knows there's three."* Nobody in the scene reacts
  further. See Seeds.

---

## 5. The three recruits of Act 2

Roster math: 6 crew after Act 1 (5 if Jet was left in the sump); Act 2 adds
**three** — one guaranteed local at arrival (Hob), one anchor (Bracket), one
missable (Vye) — for 9 by act's end with everything found, 7–8 for the
careless. DESIGN.md's 13–15 by campaign end across 8 remaining acts still
holds: later acts thin back to one or two finds each. The force is FOUND,
not issued — all three are pulled out of the act's daily life or wreckage,
and Battle 1 is this act's under-strength gate: Gunnar impounded, Vesper
hymn-sick, floor of 4 deployable. Hob exists partly BECAUSE of that floor —
a player who lost Jet in Act 1 would otherwise walk into the act's opening
gimmick with 3 units, which is punishment past the doctrine's line. Hob
raises the floor without softening the Jet consequence (Jet players still
field 5 and keep their flyer; flight stays a losable luxury).

### HOB — the Crossing's own. Guaranteed, joins at arrival, before Battle 1.

A **dock wrangler**: the leathery, wire-strong woman who handles Ceril's
Crossing's cargo-drays — the shaggy, half-feral pack-beasts that haul
everything the crane won't. Twenty years working the pads; paid, for the
last three tithe-weeks, in IOUs, because the wardens skim the dock ledger
before wages do. She is the act's grit made person: someone with callused
hands, a numbers problem, and no illusions about miracles — and when she
walks up the shuttle ramp, Ceril's Crossing stops being a place the crew is
stuck in and becomes a place standing on the roster.

- **Found (a dock-side beat, never a consolation prize):** the dray beat,
  storyStage 2 (see spine) — a warden skiff spooks a loaded dray; the
  player physically blocks its lane and Hob talks it down. No reward
  screen, no fanfare: she checks the beast's eyes, checks the crew's, and
  makes a decision that is visibly HERS. *"Three tithe-weeks of IOUs. Know
  what an IOU spends like? Paper. Tastes like it too, by week two."* Then,
  at the ramp: *"Ship crew gets paid in credits. Dock crew gets paid in
  promises. Congratulations — you're short a dockhand and I'm short a
  ship. ✦ HOB joins the force."* Sets `hobJoined`; gates Battle 1's night
  trigger so she can never be missed.
- **Voice:** freight-code pragmatism, zero reverence. The rings are "the
  landlord's chandelier." The relic is "cargo that hums — I've hauled
  worse." She is the crew's flattest skeptic (Thess says the quiet part in
  the market; Hob says it on the battlefield), which makes the one time
  per act she goes quiet — hearing the hymn under the Understack — land
  like a dropped crate.
- **Class/role:** Dock wrangler · DRVR. Grounded melee utility / off-tank:
  solid HP and DEF (below Gunnar, above Kharn), modest ATK, mid AGI, MOV 5,
  rng 1. Not a flyer, not a healer, not a duelist — the crew's second body
  for the body-blocking doctrine, so Battle 1's chokepoints work even
  without Gunnar. Architect tunes; doctrine floors apply.
- **Special (unique, no duplicates):** **JOLT PROD** — once per battle, her
  beast-handling stun-prod: one adjacent enemy is STUNNED and loses its
  next turn. Nothing in the roster denies a whole turn (Bulwark redirects,
  Ring Flare blanks attacks, Mag-Tether pins movement) — Jolt Prod is the
  "that one, not yet" button, and it is exactly what a woman who stops
  quarter-ton animals mid-charge would carry.
- **Missable?** No — by owner decree. She is the floor under the act's
  under-strength gimmick and the town's stake in the campaign. The drays
  miss her forever, though. The pens say so.

### BRACKET — the anchor. Debuts HERE. (Owner-decided: canon.)

Bracket is a **Precursor custodian** — a squat, patient maintenance rig that
has been walking the halo's service routes for ten thousand years, doing
scheduled upkeep for masters who never came back. The Ringwarden's crown is
a severed custodian *governance ring* — the very thing that used to give
Bracket work orders — which is why Keldrin can puppet custodians, and why
Bracket, the one custodian that keeps slipping the leash, is both the act's
living casualty of the villain's tech and the crew's first native speaker of
Precursor anything. An anchor character (DESIGN.md pairs him with Vesper as
the campaign's two anchors) because between them — the girl the relics chose
and the machine the relic-builders built — they ARE the cosmic storyline,
standing in the same party as five people who mostly worry about fuel money.

- **Why he matters to the relic arc long-term (the anchor's cargo):**
  Bracket's task queue still holds his original standing order — a
  Precursor **maintenance route of five sites**, the infrastructure the
  five relics rest in. Ten millennia of memory-rot have corrupted the list:
  four entries are noise, but with the Halo Heart recovered (his own site,
  serviced at last, ten thousand years overdue) **one more entry
  resolves legible** — the Act 3 destination. The design intent for the
  campaign: the route is the chase's slow-burning map, and it decays
  faster than it resolves — each act's relic clarifies less of the list
  than the crew hopes, which keeps the hunt desperate instead of guided.
  Vesper hears where the relics ARE; Bracket remembers what they're FOR.
  Neither is complete without the other. That's what anchor means.
- **Found (the force is FOUND, not issued):** Battle 4, the Understack —
  dug out of the fill by Keldrin's own crews and strung up under the
  resonator web as a puppet. He is on the map from round one, a heavy unit
  fighting AGAINST the crew — and the battle's side objective (smash the
  pylons) is, unannounced, his rescue. When his pylon falls he turns green
  mid-battle and finishes the fight beside you; his first free act is to
  complete the maintenance task he was digging toward when the masters
  stopped answering. The crew doesn't recruit him. They cut his strings
  and he *chooses* the only people in ten thousand years who broke a
  machine's chains instead of holding them. (Mid-battle conversion is the
  canon version and worth its engine cost — see Engine Needs #4; the
  victory-chain join is the fallback if scoping demands it, with the same
  scene beats.)
- **Voice:** Gunnar's opposite. Gunnar is loyalty with a rifle; Bracket is
  *diligence with no one left to be diligent for.* Speaks in work-order
  fragments that keep landing as accidental poetry. "TASK: unfinished.
  TASKS: all. It is good to be assigned."
- **Class/role:** Ringwright · RIG. The roster's first ranged-physical
  ground unit (rivet driver, rng 1–2) — a gap no one fills. Durable-support
  stat line (roughly Gunnar-adjacent HP/DEF, lower ATK, low AGI, MOV 4 —
  architect tunes, doctrine floors apply).
- **Special (unique, no duplicates):** **MAG-TETHER** — once per battle,
  yank one enemy within 3 tiles into the tile adjacent to Bracket and pin it
  (it cannot move on its next turn). No existing special moves an ENEMY;
  it's body-blocking doctrine turned into a button, and it makes the tank
  pairing (Gunnar holds the door, Bracket drags people to it) the act's new
  toy.
- **Missable?** No. Anchors don't miss the bus. (Nima can be lost in the
  same battle; the cruelty budget is spent.)

### VYE — the missable one (missable-cruelty doctrine, double cruelty)

A **halo-diver**: the Crossing's transplanted tender-bloodline used to
rappel the broken ring arcs to cut glass; Vye is the last one still licensed
by nothing but nerve. The wardens pressed her as a guide to the tithe-pit's
glass seams; she's been in a cage since she guided them somewhere on purpose
that cost them a skiff.

- **Found:** Battle 3, THE TITHE-PIT — the OPTIONAL battle. She is one of
  the caged green units, and the only cage the wardens actively move to
  "retire" when the raid starts (the pit-boss's orders are specific: the
  guide knows too much). Survives the battle → joins at the victory chain,
  no speech, just: "You opened the cage. I noticed. I'm the part of the
  salvage that walks off on its own."
- **Doubly missable:** never talk to Brand, never save the ledger, or simply
  proceed to Battle 4 → the window closes, `lostCrew.add('vye')`, and Brand's
  later dialog mentions, once, what the purge left. Fight the battle and let
  her cage fall → same set, on-screen. Search everything. Save everyone.
  Always.
- **Class/role:** Halo-diver · SKMR — a glass-cutter skirmisher: fast,
  fragile, high single-target ATK, MOV 6 ground (Kharn-fast but a killer,
  not a duelist — Kharn's HP/AGI profile stays unique).
- **Special (unique):** **RING FLARE** — once per battle, a pocket shard
  flashbulbs: every enemy within 2 tiles auto-misses its next attack. Not
  BLINK (escape), not BULWARK (redirect) — it's the roster's first *deny*
  button, and it exists to make someone survive a turn they had no right to.
- **Balance note for the architect:** no duplicate specials confirmed —
  riftbreak / rush / bulwark / swap / blink / cryo / jolt-prod / mag-tether /
  ring-flare are nine distinct verbs (self-strike, self-tempo, redirect,
  reposition-ally, reposition-self, revive, stun, reposition-enemy,
  attack-blank).

---

## 6. Battle premises for the Encounter Architect

One paragraph each: premise, required story beats, rescue-NPCs (and who they
are in town), objective SHAPE, one twist suggestion. No math, no rosters —
that's the architect's job (see placeholder section at the end). Vary
objectives per the Fire Emblem brief: defend, escort, seize, kill-boss ×2
(one with a side objective, one phased).

### Battle 1 — TITHE NIGHT (MAINLINE, lvl 4)

Night raid on the dockyard. The wardens come early and in force — not to
collect the tithe but to impound the shuttle and burn Dasha's ledger, because
this month the Ringwarden isn't taxing the Crossing, he's *asset-stripping*
it. The crew fights at four: Dax, Kharn, Jet, Hale, between the pads and the
tollhouse, with Gunnar bellowing useless legal objections from inside the
impound cage and Vesper hymn-sick in the shuttle. **Story beats:** the
wardens introduced as competent, uniformed, bored — a tax office with
carbines; Keldrin heard (comms/intro dialog) but not seen, theatrical and
specific ("Burn the book. Books are how little places convince themselves
they're owed things."); the crew wins by holding, not conquering — the act's
humble register set in fight one. **Rescue-NPC:** DASHA (Ceril's tally-clerk,
the throwaway favor from the town hub) — green unit, actively hunted, the
mechanic's debut. **Objective shape:** DEFEND/SURVIVE — hold out N rounds
until Ceril cycles the dock shields; enemy waves via the existing
reinforcement config (reinforcements ON, per the roadmap note for Vantorr's
battle). **One twist suggestion:** the impound cage is ON the map — a
searched-flag interact mid-battle (adjacent unit spends its action) springs
Gunnar as a late-joining deploy. The under-strength roster hides a lever the
player can pull with their hands full.

### Battle 2 — THE GLASS FIELDS (MAINLINE, lvl 5)

The ring-fall fields east of the canyon: centuries of fallen halo shards
standing in the regolith like a glass orchard, humming in the wind. Fen's
vapor rig is wrecked mid-field, and a warden salvage sweep is working toward
it, cutting the *singing* shards only — first visible proof the tithe was
never about money. **Story beats:** the fields are beautiful and wrong
(hymn audible as visual pulse rippling shard to shard); the crew realizes
the wardens harvest by resonance; Vesper names it — "It's not a song. It's
a WORK ORDER." **Rescue-NPC:** FEN (Mirrit's partner, Glasshouse Row —
player carries his lunch tin) barricaded at the rig; wardens prioritize him;
he has his own slow move toward safety once reached. **Objective shape:**
ESCORT — get Fen from the rig to the map's home edge; boss optional-kill
sweetener. **One twist suggestion:** resonant shards as interactive terrain
— striking one (attack action on a tile-object) rings every unit within 2
tiles for chip damage, friend or foe. The escort route becomes an argument
about which chimes you can afford to ring, and enemy ARTY will happily play
the orchard against you.

### Battle 3 — THE TITHE-PIT (OPTIONAL paralogue, lvl 5 — window: storyStage 4 only)

The wardens' quarry-prison in the canyon: cages of "tithe debtors" who are
actually a labor pool for the Understack dig, plus everything ten years of
extraction bought. Unlocked only by `ledgerSaved` + talking to BRAND; erased
from the act (with everyone in it) once Battle 4 begins. **Story beats:**
the grubby machinery behind Keldrin's miracles — no cosmic anything, just
cages, quotas, and a pit-boss with a clipboard; Brand's intel proves wardens
desert when the crown's "voice" gets loud; the prisoners freed here repopulate
the Crossing's shuttered stalls (visible town change — the act's economy
literally walks home). **Rescue-NPCs:** multiple caged green units —
townsfolk the player has already met by name if they've been talking (a
stall-keeper Oro vouches for, Cask's supplier) — and VYE, the missable
recruit, in the one cage the enemy moves to destroy first. **Objective
shape:** SEIZE — take the gate-house tile (opens the cages) before the
purge order works down the cage row; kill-everything optional after.
**One twist suggestion:** the pit-boss doesn't fight — he *runs a schedule*:
each round, one more cage is "retired" in fixed order the player can read on
the map (the clipboard made lethal). Speed is the whole fight; XP decay has
already made grinding it pointless, which frees the design to be pure tempo.

### Battle 4 — THE UNDERSTACK (MAINLINE, lvl 6)

Beneath the Crossing: the hollowed service-vault of the halo, ribbed with
Precursor structure the dig has stripped naked, lit by the resonator web
Keldrin's foreman uses to puppet dug-up custodian rigs. Nima is somewhere in
here, following the song home. **Story beats:** first sight of TRUE Precursor
interior since the temple (visual callback: the `Y`/`z` austerity under the
scrap); the custodians are victims, not monsters — they wake confused,
mid-task, asking for work orders (Kharn: "It hunts nothing. It is CARRYING
things. ...I will not enjoy this."); smash the web, free BRACKET; Nima saved
sings the counter-phrase that unseals the node chamber — Nima lost means the
chamber is BLASTED open instead and the act's ending is a shade darker
(same door, worse key). **Rescue-NPC:** NIMA (the shard kid, deepened since
storyStage 2 — the player has watched her drift plinth-ward all act). The
foreman's orders are explicit: the child who sings true goes in a cage to
the Ringwarden. Enemies move to take her; her fail-state is `nimaStruck`
(ring-struck, glassblind — alive, silenced; see Open Questions re: kids
dying on screen). **Objective shape:** KILL-BOSS (the dig foreman) with a
destructible side objective (resonator pylons; each downed pylon frees the
custodians it was driving). **One twist suggestion:** puppeted custodians
are heavy hitters the player is quietly better off NOT killing — every
custodian standing when its pylon dies goes inert (and one of them is
Bracket). Mercy as tactics: the first fight in the campaign where the
optimal line is to break the *strings*, not the puppets.

### Battle 5 — THE RINGWARDEN (MAINLINE finale, lvl 7)

The node chamber: a cathedral-sized hollow where the halo's tuning core —
the second relic — hangs in its ten-thousand-year cradle, and Voss Keldrin
finally stops being a tax office. Crown blazing, he keys the node itself:
the rings overhead visibly answer through the chamber's roof-crack, cyan,
magenta, lime. **Story beats:** Keldrin's mask off — under the theatrics
he's terrified of the thing on his head and cannot stop wearing it ("It was
supposed to be a LEDGER. A ledger of lights. It just wants someone to HOLD
it and I am so tired of holding it."); the crown breaks, the Heart comes
free, both relics chord ONCE — and through the dying crown, one line
answers from very far away. The entity's Act 1 warning stops being
abstract. Then: festival, epilogue, Act 3 bridge. **Rescue-NPCs:** none —
the finale is the one fight with nothing to protect but each other (and the
act has earned the clean duel). If `bracketJoined`, Bracket's presence is
story-loud: the crown tries to ORDER him, once, and fails. **Objective
shape:** KILL-BOSS, phased (existing bossPhase tech, pushed: see twist).
**One twist suggestion:** the node cycles the chamber through the three
ring-colors on a visible schedule, and each "key" changes one battlefield
rule while it holds (the architect picks three cheap, legible effects —
e.g. cyan: all ranged +1 reach; magenta: all healing halved; lime: ground
tiles hazard-tick). Keldrin's phases ride the cycle he no longer controls —
the instrument plays the player AND the boss, which is the whole moral of
the act in mechanics form.

### Engine needs

New capabilities this act's design requires, in scope order (everything not
listed runs on existing tech — mission config, reinforcements, bossPhase,
POIs, tile swaps, searched-flags, lines() branching, lostCrew):

1. **Neutral green units on battle maps** (the signature mechanic — the one
   must-build): a third side `'npc'` — rendered, killable, AI-targetable
   (enemy targeting must weight them like the "hunts kills first" doctrine
   so they are genuinely, visibly hunted), simple self-behavior (hold / flee
   toward a tile on their own turn), per-unit death and rescue hooks feeding
   flags. Battles must stay winnable when they die.
2. **Objective types beyond kill-boss:** `checkEnd()` currently knows only
   boss-death (win) and Dax-death (loss). Needed: survive-N-rounds (B1),
   escort-unit-to-edge (B2), seize-tile (B3), as per-mission config.
3. **Destructible map objects** (B2 shards, B4 pylons): cheapest path is
   stationary 0-MOV "enemy" units with an `onKill` hook per unit — mostly
   existing tech plus the hook.
4. **Mid-battle side conversion** (Bracket turning green→ally in B4): the
   canon version of an anchor character's debut — build it. Victory-chain
   join remains the documented fallback only if scoping forces it.
5. **`defBonus{}`** parallel to `hpBonus{}` (Crusty Bread, +2 DEF) applied
   in rosterInit — small.
6. **Per-map shop stock + generalized door/spawn table** (the Ledger, the
   tollhouse, bakery, Hymn Hall interiors; Vantorr trail-exits): the
   patterns exist for Rustharbor but are hardcoded singletons — needs a
   keyed-by-map generalization pass.
7. **Late-join deploy mid-battle** (B1 cage lever springing Gunnar): the
   reinforcement spawner pointed at an ally — near-existing.
8. **Cosmetic, cuttable:** night tint for B1; storyStage-driven tile swaps
   in town (shuttered→open stalls, Understack crack, Mirrit's dark window).

---

## 7. Antagonists of Act 2

**VOSS KELDRIN, "the Ringwarden."** Ten years ago a scrap-diver cracked a
dead custodian foreman-unit out of the Understack fill and pried the
**governance ring** off its head — a Precursor circlet that issues work
orders to custodian machines and can *key* ring-glass: light it, ring it,
move it. Keldrin put it on. To the Crossing — a transplanted people who
forgot they were brought here as the halo's tenders, whose liturgy is a
maintenance chant with the serial numbers sanded off — a man who could make
the rings answer looked exactly like what their forgotten religion had a
hole shaped for. He never claimed godhood outright; he just stopped
correcting people, and then he started charging. That's the whole Stargate
move, translated: a small man wearing stolen ancient infrastructure as
divinity, ruling a culture that can't remember that the "miracles" are
someone else's plumbing.

**The organization:** the wardens — a tithe bureaucracy with carbines.
Uniformed, scheduled, unloved. Their menace is that they're *procedural*:
raids have paperwork, cages have quotas, executions are called "retirement
of arrears." The act's fights escalate through their org chart (raid squad →
field sweep → pit-boss → dig foreman → Keldrin) without ever needing them to
be monsters. New enemy classes are the architect's call; the flavor palette
is: tithemen, glass-cutter rigs, repurposed custodians.

**What the stolen tech actually does (and what he thinks it does):** Keldrin
believes the crown is a master key — lights, machines, obedience. It is
actually a *subordinate's* badge: a device for RECEIVING instructions and
relaying them. For ten years he has been broadcasting "I am here, I am
working, the instrument is active" up a chain of command that no longer
exists — hollowing the Understack for glass to sell, and each cut making the
halo's idle-song (the hymn) louder, less shielded, easier to hear from
*outside*. The rings were built, in part, to keep this world quietly tuned.
He has been dismantling the mute.

**The thin thread to the hunger (one thread, kept thin):** Brand deserted
because the crown "never shuts up" — lately it has started *answering*.
Keldrin hears it most: something on the far end of the dead channel has
begun returning his decade of hails, patient and enormous and getting
closer to intelligible. He tells himself it's the rings. In the finale, the
moment the crown breaks, everyone hears the answer once — a single line,
and then nothing. The wardens were a local, gritty, human-sized problem;
they were also, unknowingly, ten years of dinner bell. That is the act's
entire cosmic payload: the hunger didn't come to Vantorr. It just heard
Vantorr, once, because a small greedy man wouldn't take the crown off.

Keldrin's voice, for the record (theatrical and specific, Vash-doctrine —
he talks about acoustics and accounting, never about evil): *"Do you know
what a ring is, salvager? An instrument that cannot stop playing. I don't
tax these people. I charge admission."*

---

## 8. Open questions for Erik

1. **Relic two's name.** Working name HALO HEART; alternatives: the Tuning
   Heart, the Chord, the Clave. Your call before dialog gets written.
2. **Nima's fail-state.** Designed as `nimaStruck` (ring-struck, glassblind,
   silenced) rather than death — killing a kid on-map may be past the tone
   line. Confirm, or harden it.
3. **Nima as the Act 3 MYSTERIOUS TREAT giver.** DESIGN.md leaves the Act 3
   Compassion Chain item "given by someone/something secret (TBD)." Proposal:
   a saved Nima gives it (making saving her secretly load-bearing — peak
   missable-cruelty). If `nimaStruck`, the treat needs an alternate secret
   source or the chain quietly dies — your ruling on how cruel the chain
   may be.
4. **Dasha's fail-state.** Currently: cut down, permanent, locks Battle 3.
   Softer alternative: taken, and Battle 3 becomes her rescue — but that
   rewards failure with content, which the consequence doctrine dislikes.
5. **The Glass Charm** (shop mystery item, 90₡): Dormant-Spore-pattern
   long-game item. What does it eventually do, and in which act? (One idea:
   it genuinely keeps the hymn out of dreams — carrying it MUTES a future
   relic-whisper the player would rather have heard. A trap disguised as
   comfort.)
6. **The Signal Lens payoff act.** Planted for a masquerade-reveal in Act
   3+; needs an owner-act before the Act 3 design starts.
7. **The Fourth Ring.** The verse says four rings, the sky shows three, the
   town argues. Proposal: the fourth ring left — a mobile Precursor
   structure, payoff around Act 5. Blessing needed before more seeds
   reference it.
8. **Festival epilogue scope.** Full playable town-state (stalls open, Oro
   selling, one-night dialog pass for all 16 NPCs) vs. a cutscene. The
   playable version is a worldsmith pass all its own.
9. **Vye's kit.** RING FLARE (area attack-denial) is tuned as a design
   idea, not doctrine-proofed math — flag for the architect, but the
   concept needs your yes/no first.
10. **Bracket's route pacing** (his debut in Act 2 is settled — this is
    downstream): how fast may the maintenance route resolve across acts
    3–9 without turning the chase into a checklist? Design intent above is
    "decays faster than it resolves"; the per-act ration is yours.

---

## The Battles — full designs (Encounter Architect)

The five Encounter Architect memos, consolidated. Everything below is a
DESIGN document — no code ships from this section; each battle becomes a
`js/missions/*.js` file (kr7.js template) only after Erik approves it, in
play order: tithe → glassfields → tithepit → understack → ringwarden.
All five obey CLAUDE.md, the DESIGN.md balance doctrine (rules 1–10), and
the premises in section 6 above.

**Consolidation notes — what changed between the raw memos and this section:**

- **Hob's base line — ONE proposal (goes to characters.js only with Erik's
  yes):** `HP 29 · ATK 9 · DEF 7 · AGI 7 · MOV 5 · rng 1`, special **JOLT
  PROD** (stun one adjacent enemy for its entire next turn, once per
  battle), joining at **L3** — one level under Battle 1's lvl 4, the
  fresh-recruit convention. The five memos drifted between ATK 9–10 and
  join levels L1–L4; no kill threshold moves either way, and the projected
  rows below are normalized to this line.
- **Enemy names normalized to one warden org chart.** Line troopers are
  **WARDEN TITHEMEN** wherever they appear (Battle 3's memo called its
  melee trooper "Titheman Carbineer," which collided with Battle 1's
  *ranged* CARBINEER — renamed). Each battle's ranged/artillery unit keeps
  a unique name (CARBINEER → CHIMER → PICKET → SHARD-SAW RIG → LANCER;
  Battle 4's memo said "Glass-Cutter Rig," which collided with Battle 2's
  *melee* CUTTER RIG — renamed to SHARD-SAW RIG), as does each flier
  (SKIMMER → RING SKIMMER → SKIFF → SKYCUTTER).
- **Battle 1's boss renamed PROCTOR HASK → PROCTOR REEVE.** One letter away
  from Battle 3's PIT-BOSS HASP was a readability collision; Hasp keeps his
  name (a hasp is a cage latch — the pun is load-bearing).
- **Bracket's Battle 5 row** now derives from Battle 4's locked join line
  (ally at L6: 36 HP / 9 ATK / 9 DEF / 3 AGI, MOV 4, rng 1–2) instead of
  the earlier memo's placeholder assumption.
- Projected crew stats in the per-battle tables are expectations, not
  ledger entries; ±1–2 points of drift between battles was left alone
  wherever it moves no kill math.
- Each memo's per-battle engine-needs list has been folded into the single
  **Engine needs — build order** subsection at the end; per-battle open
  questions are merged into **Open questions for Erik** after it.

**VARIETY CHECK (one line):** five objectives — defend-the-clock (B1),
escort (B2), seize-against-a-schedule (B3), kill-boss with a mercy
side-system (B4), phased kill-boss duel (B5) — and five twists — the
impound-cage lever, strikeable ringing shards, a readable execution
schedule, cut-the-strings-not-the-puppets, and cycling rule-keys — are all
distinct from each other AND from Act 1's three battles (Sump: open fauna
hunt + missable-recruit search; Shaft Nine: tunnel rout + reinforcement
waves + machine boss; KR-7: storm + boss-phase chasm).

---

### BATTLE 1 — TITHE NIGHT (MAINLINE, lvl 4)

*Mission id: `tithe` → `js/missions/tithe.js`, `MISSION_TITHE`.*

#### Premise & fantasy

Hold a dark dockyard for seven rounds against a tax office with carbines,
short two crew members, while the clerk who kept the only honest count of
ten years of tithe runs the gauntlet with the ledger under her arm.

Every beat of the section-6 premise honored:
- Night raid: the wardens come early and in force — not to collect but to
  **asset-strip**: impound the shuttle, burn Dasha's ledger.
- Under-strength roster: **Dax, Kharn, Hale, Hob** (+ **Jet** if found in
  Act 1). Gunnar impounded (bellowing legal objections from the cage ON the
  map), Vesper hymn-sick in the shuttle. Floor is 4 deployable, never 3.
- Wardens introduced as competent, uniformed, bored — procedural menace.
- Keldrin heard (comms) but never seen. The "burn the book" line lands here.
- The crew wins by **holding, not conquering** — the act's humble register.
- Dasha is a green unit whether or not the player took Ceril's ask.

#### The ONE twist — the impound cage

**The impound cage is on the map.** Any ally standing adjacent can spend
their full action to spring it: GUNNAR-7 deploys beside the cage next to
the SW corner, joins the fight from his next turn. That's it — one lever,
one price.

Why it forces a decision the last battle didn't: KR-7 was "spend every
action killing." Tithe Night's opening rounds have three competing demands —
plug the choke, screen Dasha, spring Gunnar — and only four units. Springing
Gunnar costs an action *exactly when Dasha is being run down*, and he
deploys in the far SW corner (MOV 4), so he arrives at the line right at the
pressure peak (rounds 4–5) *only if you paid early*. The under-strength
roster hides a fifth body, but pulling the lever with your hands full is the
whole fight in miniature.

**One-twist accounting (doctrine honesty):** this battle also debuts two
pieces of act-level infrastructure — the **survive-N-rounds objective** and
the **green-unit system** (Dasha). Both are mandated by this document as the
act's objective variety and signature mechanic; they recur in Battles 2–4
and are built as engine features, not this battle's twist. The battle's
*signature idea* — the thing you'd tell a friend about — is the cage. If
Erik wants the strictest possible read of one-twist, the cage can degrade to
a scripted round-4 release (Ceril "loses" the paperwork mid-battle), but the
lever version is recommended: it converts story (Gunnar's impound) into a
decision. (Open question 2, below.)

#### Objective & win/lose

- **WIN (primary):** survive to the **start of round 8** ("hold 7 rounds") —
  Ceril cycles the dock shields; wardens can't bill what they can't board.
- **WIN (aggressive alternate, free from existing engine):** kill **PROCTOR
  REEVE** (`boss:true`) — the raid's spine breaks and the wardens withdraw.
  He arrives at the line ~round 4 and is killable in ~2 focused rounds, but
  focusing him means peeling both hitters off the wall. Real choice, priced.
- **LOSE:** Dax falls, or the whole force falls (existing `checkEnd`).
- **NOT a loss:** Dasha dying. The battle stays winnable; the consequences
  are permanent flags (`dashaLost`, Battle 3 locked forever, the bell, the
  second chair). Losing her must sting in story, never in `checkEnd`.

#### Why it's fun

- Four units, three jobs, seven rounds: the fight is a resource argument,
  not a kill list. Every round you're short exactly one body — and there's
  a body in a cage, priced at one action.
- Hob's debut IS the geometry: the map has one 2-wide gap and she is the
  first character built to stand in it. Jolt Prod ("that one, not yet") gets
  a teaching moment whether she spends it on the choke or on a skimmer one
  tile from Dasha.
- The defend timer inverts KR-7's psychology: the clock is your FRIEND.
  Turtling is legal, priced in Dasha, in flags, in a locked battle. The game
  never says this out loud. The town says it afterward, forever.
- Jet players get a genuinely different fight (south void chute, EXTRACTION
  as a Dasha-saver) without Jet-less players facing a different *difficulty*
  — Jet converts "tight" into "comfortable," per the losable-luxury doctrine.

#### Threat math

**Party projection at entry (mission lvl 4).** Per projection doctrine:
base + per-level expected gains (E[HP]≈1.67 but the HP floor
`base+2(lvl−1)` binds, so HP ≈ base+2/level; E[ATK]≈0.62, E[DEF]≈0.45,
E[AGI]≈0.62). Entry levels from the Act 1→2 simulation: Dax L8, Kharn L6,
Jet L5, Hale L3 (band 2–4; low-end L2 checked below). Hob joins fresh on
the ratified base line.

| Unit | Lvl | HP | ATK | DEF | AGI | MOV | Notes |
|---|---|---|---|---|---|---|---|
| DAX | 8 | 40 | 15 | 9 | 12 | 5 | 26+2·7 / 11+0.62·7 / 6+0.45·7 / 8+0.62·7 |
| KHARN | 6 | 34 | 15 | 6 | 14 | 6 | 24+10 / 12+3.1 / 4+2.3 / 11+3.1 |
| HALE | 3 | 22 | 6 | 5 | 7 | 5 | 18+4 / 5+1.2 / 4+0.9 / 6+1.2 · MP 11 (10 +1 at L2) · MEND 10 |
| HOB (ratified proposal) | 3 | **29** | **9** | **7** | **7** | **5** | base line at join; justification below |
| JET (if found) | 5 | 28 | 11 | 6 | 8 | 7 fly | 20+8 / 9+2.5 / 4+1.8 / 6+2.5 |
| (GUNNAR, if sprung) | 6 | 44 | 13 | 11 | 7 | 4 | 34+10 / 10+3.1 / 9+2.3 / 4+3.1 |
| (VESPER, benched — reference only) | 3 | 20 | — | 4 | — | — | 16+4 / 3+0.9 |

**Hob's base line, justified battle-side** (the consolidation note above is
the single proposal; architect proposes, owner disposes):
- HP 29 / DEF 7: dead midpoints of Gunnar (34/9) and Kharn (24/4), per the
  brief. Titheman hits her for 6 → ~5 hits to drop; she holds the gap ~2.5
  rounds unhealed, ~indefinitely under MEND. Off-tank achieved.
- ATK 9: modest, below Gunnar's 10 — she finishes wounded enemies (4 hits
  to kill a titheman solo) but never out-damages the hitters. She's a wall
  with opinions, not a duelist.
- AGI 7: mid — usually acts after Kharn/Dax, before Gunnar; her turn tends
  to come after the player knows where the leak is.
- MOV 5, rng 1: keeps pace with Dax; grounded.

**Party focused damage per round** (dmg = max(1, ATK−DEF) ±10%). At the
4-unit floor, realistic focus = Dax + Kharn (+Hob chip; Hale heals):

- vs DEF 4 (titheman): Dax 11 + Kharn 11 + Hob 5 = **27/round**
- vs DEF 3 (carbineer/skimmer): 12 + 12 + 6 = **30/round**
- vs DEF 6 (Proctor Reeve): 9 + 9 + 3 = **21/round**
- +Jet (5-unit): +7–8/round. +Gunnar (sprung): +7–9/round.

Doctrine rule 1 check: hitters two-shot every regular (16 HP ≤ 22, 14 ≤ 24).
No sponges. Reeve (30 HP) dies to ~4 focused hits ≈ 1.5–2 rounds of full
commitment — a miniboss, not a slog (Vash was 48 with regen; Reeve has
neither).

**Enemy pressure per round (where the fight peaks).** Enemy damage vs the
intended wall (Hob DEF 7 / Dax DEF 9 holding the gap mouths, Hale one tile
back, greens covered):

| Round | What's in contact | Potential dmg | Realistic (choke-limited) |
|---|---|---|---|
| 1 | nothing (approach) | 0 | 0 |
| 2 | 2 skimmers on Dasha (or interposers) | 18 vs Dasha (×0.7 evade ≈ 12.6 vs her 14 HP) | she survives R2 in expectation, dies R3 if wholly ignored |
| 3 | 3 tithemen reach the gap, skimmer leftovers | ~20 | 12–16 (2-wide gap = max 2 melee on the wall + 1 clamber) |
| **4–5 (PEAK)** | 3 tithemen + 2 carbineers (rng 2–3 firing over the wall) + Reeve + skimmer | ~33 | **20–24/round** |
| 6–7 | survivors + reinforcement wave (3 tithemen, spawned R4, arrive R6–7) | ~24 | 14–20, decaying as the player kills |

Sustainability at the 4-floor: party pool 125 HP (40+34+22+29), plus Hale
MEND 10 × 3 casts (MP 11) = 30, plus 2 Ration Packs (+24) from the Act 1
kit, plus Gunnar's 44 if sprung ≈ **220+ effective HP** against ~90–110
realized enemy damage over 7 rounds *if the choke holds*. Tight, honest,
holdable. Broken formation (fighting on the open apron) roughly doubles
incoming contact — the map is the tutorial.

At 5 units (Jet): +28 pool, +8 dmg/round, EXTRACTION un-kills one mistake.
The same fight reads "properly pressured" instead of "knife's edge."

Low-end Hale check (L2: 20 HP, DEF 4–5): titheman 8–9/hit → dies in 3
exposed hits (2 + crit). Doctrine rule 2 satisfied at the band's floor, not
just its middle.

#### Enemy roster

The wardens: a tithe bureaucracy with carbines. Raid squad tier of the act's
org chart (squad → sweep → pit-boss → foreman → Keldrin). All-new classes —
Act 2's enemy palette debuts here. Sprites: text-grid, PAL colors, uniformed
silhouettes (visored helm, sash of tally-chits); each class fills a role no
Act 1 enemy held (see uniqueness, below) and each has a counter the player
already owns (choke/bodies, reach-denial via cover, kill-priority).

| Name | Ct | HP | ATK | DEF | AGI | MOV | rng | Class | boss | Hits to kill it (Dax/Kharn) | Hits it needs: Vesper* / Hale / Dasha |
|---|---|---|---|---|---|---|---|---|---|---|---|
| WARDEN TITHEMAN | 3 (+3 reinf.) | 16 | 13 | 4 | 7 | 5 | 1 | Warden · TITH | — | **2** (11×2=22) | 3 / 3 / 2 |
| WARDEN CARBINEER | 2 | 14 | 12 | 3 | 6 | 4 | 2–3 | Warden · CARB | — | **2** (12×2=24) | 3 / 4 (pair volleys = 2 rounds) / 2 |
| WARDEN SKIMMER | 2 | 14 | 11 | 3 | 8 | 6 fly | 1 | Warden · SKIF | — | **2** (12×2=24) | 3 / 4 / **2** |
| PROCTOR REEVE | 1 | 30 | 14 | 6 | 6 | 4 | 1–2 | Warden · BOSS | ✦ | **4** focused (9×4=36); Dax+Kharn ≈ 2 rounds | 2 / 3 / 2 |

*Vesper is benched (hymn-sick); her column is the doctrine yardstick at her
L3 projection (20 HP, DEF 4). Hale (22/5) is the deployed squishy.

**Every number justified:**
- **Titheman HP 16:** two-shot by either projected hitter (rule 1); Hob
  needs 4 — correct, she's the wall. **ATK 13:** kills projected Hale in 3
  exposed hits (8/hit vs 22), floor-Hale in 3 (9 vs 20), Vesper-projection
  in 3 (9 vs 20) — rule 2 exactly; vs the wall it's chip (Hob 6, Dax 4),
  which is what makes holding the gap *feel* like armor. One point above
  Act-1-boss Vash (12) is right: the crew is 4–6 levels on. **MOV 5, AGI 7:**
  regular infantry; reaches the gap round 3 from the east gate — the player
  gets two setup rounds. **rng 1.**
- **Carbineer HP 14 / DEF 3:** dies in 2 to either hitter, 2 to Jet — flyer
  players get a job (carbineer-hunting over the wall). **ATK 12, rng 2–3:**
  the anti-turtle tool — fires over the crate wall at Hale (+22 AI score for
  her MP bar, per the engine's targeting) and at Dasha (10/hit → 2 hits).
  Sized as a PAIR: 2×7 = 14/round vs Hale ≈ dead in 2 exposed rounds; solo
  it's 4 hits, deliberately under titheman, because reach is already its
  payment. **MOV 4:** sets up rounds 3–4; can't chase.
- **Skimmer HP 14 / DEF 3 / MOV 6 fly / AGI 8:** the Dasha-hunters and
  flank-runners (north apron, south void chute). Doctrine rule 3: wings buy
  MOV, not initiative — AGI 8 keeps them under Kharn's 14 and Dax's 12, so
  the player usually gets to react *before* the pounce lands. **ATK 11:**
  9/hit vs Dasha → exactly 2 hits (the teaching number, see the Dasha spec);
  7/hit vs Vesper-projection → 3 (rule 2); weak vs the wall — they are
  couriers of consequence, not line-breakers.
- **Proctor Reeve HP 30 / DEF 6:** killable inside the timer by committing
  both hitters for ~2 rounds (21/round focused) — the rout path is real but
  costs the wall its teeth; NOT killable by absent-minded chip, so the
  survive objective stays the default read. **ATK 14 / rng 1–2:** kills
  Hale in 3, Vesper-projection in 2, dents Hob for 7 — when he arrives
  (round 4–5, MOV 4 from the rear), the line *feels* it. No regen, no
  phase, no chasm — he is a middle manager, and the fight never pretends
  otherwise. **boss:true** so the existing engine grants the rout-win free.
- **Reinforcement tithemen ×3:** same block as line tithemen (no new
  numbers to learn at night, in a war, on purpose) — see config below.

Total: 8 on-map + 3 reinforcements = 11 enemies. At 27–30 focused dmg/round
the player *could* rout everything by ~round 6–7 — kills and timer converge,
so aggressive and defensive players finish within a round of each other.

#### Map — 18×13 dockyard at night

Legend (kr7.js digits, existing terrain ONLY — no new tile types):
`0` dock plating (regolith) · `1` cargo crates (boulders: cost 2, 15% evade)
· `2` stacked freight (debris cover: cost 2, 30% evade) · `3` ruptured
charge conduit (crystal vent: 3 dmg on turn end, ground only) · `4` dock-edge
drop (void: flyers only). Reflavor is briefing-text only; art untouched.

```
     x0.............x17
y00  011000000000000110
y01  000000000000000000   ← OPEN FLANK: crane apron (skimmer highway)
y02  000002003000020000   ← conduit (8,2) = the flank-intercept tile
y03  000000100000000000   ┐
y04  000020100020000020   │ crate wall x6
y05  000000100000002000   │
y06  000020000000000000   ← GAP (6,6)  ┐ the chokepoint
y07  000003000000000000   ← GAP (6,7)  ┘ conduit (5,7) = west mouth
y08  000020100022000000   ← DASHA starts (11,8), on freight cover
y09  000000100000002000   │
y10  010000110000000000   ┘ cage row — IMPOUND CAGE at (1,10)
y11  440001000010000044   ← south walkway (crated speedbumps)
y12  444400444004444444   ← dock-edge drop: the flyer chute
```

**Prose key (terrain is an argument):**
- **Chokepoint:** the crate wall runs x6 from y3–y10 with a 2-tile gap at
  (6,6)/(6,7) — the only cheap ground route from the east gate to the pads.
  Hob + one other body seal it. Crates are cost-2, not impassable, so
  patient wardens CAN clamber (slow, and units-as-walls still applies) —
  the wall leaks under neglect instead of trivializing the fight.
- **Hazards where the player WANTS to stand:** (5,7) — the ideal second
  block tile at the gap's west mouth — is a ruptured conduit (3 dmg/turn).
  So is (8,2), the perfect north-flank intercept square. Holding the best
  ground costs HP per round; Hale's MEND economy is the tax office you like.
- **Open flank #1 (north):** rows y0–y1, the crane apron — 15 tiles of open
  run around the top of the wall. Skimmers and late tithemen loop it.
- **Open flank #2 (south, flyers/patient only):** the y11 walkway is crated
  at x5/x10; y12 is void with two mooring islands — a chute Jet and the
  skimmers cross freely. Jet players own a lane; Jet-less players must watch
  it.
- **Defender comfort:** freight cover at (4,6)/(4,8) — 30% evade one step
  BEHIND the mouths: safety is one tile back from where the blocking works.
- **Deploy (shuttle pad, W):** dax (2,6) · kharn (3,5) · hob (3,7) ·
  hale (2,7) · jet (2,4) if found. Gunnar/Vesper omitted from `deploy`
  (benching = existing tech).
- **IMPOUND CAGE (annotation, not a digit):** interact at (1,10); Gunnar
  deploys at (2,10). 8–9 tiles from the gap at MOV 4 → sprung on round 1–2
  he reaches the line at the round-4–5 peak.
- **Enemy start:** tithemen (16,5),(16,7),(15,9) · carbineers (17,4),(17,8)
  · skimmers (15,1) N and (16,10) SE · Reeve (17,6) rear. Approach staggers
  the waves with zero scripting: contact R2 (skimmers), R3 (tithemen), R3–4
  (carbineers in range), R4–5 (Reeve).

#### Rescue-NPC spec — DASHA (the signature mechanic's debut)

The teaching goal, verbatim from the act bible: enemies hunt green units —
learn it here, gently but honestly.

- **Unit:** DASHA, Ceril's tally-clerk. `side:'npc'` (green). **HP 14,
  DEF 2, AGI 5, MOV 4, no attack.** Justification: 14/2 = exactly **2 hits
  from anything** on this map (skimmer 9×2=18, titheman 11×2, carbineer
  10×2) — greens die honestly or not at all; AGI 5 = she usually moves
  after the skimmers (the player watches the threat develop, then sees her
  react); MOV 4 = slower than every rescuer.
- **Start tile:** (11,8) — the tollhouse steps, on freight cover (30%
  evade: her only armor, and it's terrain, teaching land-effect for free).
  Wrong side of the chokepoint, because Ceril's favor means going OUT.
- **Behavior:** round 1 — holds (frozen, clutching the ledger; one log
  line). Rounds 2+ — flees 4 tiles/turn toward the shuttle pad. On reaching
  the pad zone (x≤3, y5–9): despawns to safety, "the ledger's safe" bark.
  She runs the gauntlet THROUGH the player's choke rounds 2–4 — the whole
  defense watches her sprint past.
- **Hunt-priority, quantified (engine spec):** greens enter the existing
  targeting loop scored like allies, plus a flat **+40 directive bonus on
  units flagged `hunter:true`** (both skimmers) and **+10 on everyone else**.
  Calibration against the live scorer (battle.js ~1262): +40 outbids Hale's
  MP-bar bonus (+22) and low-HP scoring, but NOT a guaranteed kill (+900) —
  hunters chase the clerk unless you hand them something they can kill this
  turn, and the raid at large mildly prefers her. Visibly hunted; never
  scripted.
- **Threatened but savable, the arithmetic:** both skimmers reach adjacency
  on **round 2** (from (15,1): 11 tiles at MOV 6 fly; from (16,10): 7).
  Expected round-2 damage 2×9×0.7 evade = **12.6 vs 14 HP** — she survives
  round 2 in expectation and **dies round 3 if wholly ignored**. Saves that
  work, all reachable at the 4-floor: Kharn (MOV 6) interposes/kills by
  round 2; Hob's JOLT PROD deletes a hunter's entire turn; one dead skimmer
  (2 hits) halves the threat; Jet does it with change. Interposition must
  be physical or lethal — proximity alone doesn't outbid +40. That IS the
  lesson.
- **Reward on save:** flags `dashaSaved` + `ledgerSaved` (harvested on
  victory only, per save doctrine). Downstream per sections 2/4b: Ceril's
  trust, 20% shop discount at the Ledger, Battle 3 (Tithe-Pit + the missable
  recruit Vye) becomes unlockable, Act 3 ledger hook.
- **Permanent consequence on loss:** `dashaLost`. Cut down on-map (the
  ledger burns — one caption). Battle continues, fully winnable. Forever:
  Ceril never says her name again, the tollhouse keeps a second chair
  nobody sits in, Battle 3 locked (Vye unreachable — the cruelty compounds
  silently), no discount, a new bell on the ossuary trail.

#### Config (existing switches + new keys)

Existing switches:
- **storm: OFF.** It's a dockyard under a roof of rings, not an asteroid
  belt. (Uniqueness: KR-7 owns the storm.)
- **bossPhase: OFF.** Reeve is a middle manager; no seam, no regen, no
  second wind. The act saves phases for Keldrin (Battle 5).
- **reinforcements: ON** (roadmap requirement for Vantorr's battle) —
  existing one-shot config, one unit type, exactly as built:

```
reinforcements:{ count:3, onRound:4, orWhenMinionsLeq:3,
  spawns:[[17,5],[17,7],[17,3],[17,9]],
  unit:{ name:'WARDEN TITHEMAN', spr:'titheman', cls:'Warden · TITH',
         maxhp:16, atk:13, def:4, agi:7, mov:5 },
  bark:'LOUDHAILER: "Second shift. The Ringwarden thanks you for your patience."' }
```
  Trigger note: the engine requires a live boss — Reeve qualifies; if the
  player somehow kills him before round 4 they've already won (rout). The
  `orWhenMinionsLeq:3` clause means aggressive players PULL the second
  shift early — replay texture for free.

NEW config this battle needs (all consolidated in Engine Needs — build
order, below): `objective:{type:'survive', rounds:7}` ·
`npcs:[{...dasha, hunterBonus}]` ·
`cage:{at:[1,10], deployAt:[2,10], unit:'gunnar', label:'SPRING THE CAGE'}`
· `night:true` (cosmetic, cuttable).

#### Dialog sketches (warm, wry, melancholy)

**Briefing:** `TITHE NIGHT — hold the dock 7 rounds until Ceril cycles the
shields (or break the Proctor). DASHA (green) is hunted — block for her or
clear her path. The impound cage can be sprung: one action, adjacent.`

**Intro:**
- *Caption: Tithe week. The dock lamps brown out one by one. Someone
  scheduled this.*
- LOUDHAILER: "By order of the Ringwarden: this dock is cited for arrears.
  Stand clear of your property while it stops being yours."
- KELDRIN (comms, unseen): "Burn the book. Books are how little places
  convince themselves they're owed things."
- KELDRIN: "And the clerk — teach her arithmetic. Ours."
- GUNNAR-7 (from the cage): "I AM NOT CARGO. My serial number PREDATES your
  charter. I have prepared REMARKS."
- HOB: "Wardens bill by the hour. Hold the gap and let 'em go broke."
- DASHA (on map): "Ten years I've walked this dock in the dark. …It was
  never this dark."

**Mid-battle barks:**
- Cage sprung — GUNNAR-7: "RELEASED. I'll be filing my objections in
  PERSON." *(banner: ▸ GUNNAR-7 JOINS THE LINE ◂)*
- Dasha reaches the pad: "Every page accounted for. Including yours,
  Proctor." / log: *The ledger — and the ledger-keeper — are safe.*
- Dasha falls: *Caption: The ledger burns quickly. It was mostly honesty
  and paper.* (then silence; no music sting — the quiet IS the sting)
- Reeve engages: "I assess. I collect. I do not negotiate with salvage."
- Round 6: CERIL (comms): "Shields at half-cycle. Whatever you're doing —
  keep being expensive."

**Win (survive):** banner *▸ THE SHIELDS CYCLE ◂* — CERIL: "Wardens don't
bill what they can't board. First tithe night in ten years the Crossing
kept its own." Branches: `dashaSaved` → DASHA: "…Thank you. Ceril says
you're trouble. I'm entering you as an asset." · `dashaLost` → CERIL says
nothing about her at all, which says everything. Then KELDRIN (comms,
mild): "An account in arrears, then. I'll have you scheduled."
**Win (rout):** REEVE, withdrawing: "This stop is… rescheduled." — Keldrin's
comms line unchanged; he was never really here.

**loseText:** `The dock falls with Dax. By morning the Crossing pays what
it's told, and nobody is left counting.`

#### Mission lvl & XP feed

- **`lvl: 4`** (formula: 3×(act−1)+battle# = 3+1). The decay yardstick.
- **Who this battle feeds (by design):** **HOB** (L3, −1 gap, faucet wide
  open — the fresh recruit catches up exactly as the doctrine intends) and
  **HALE** (L2–4, full rate + heal-parity XP; a defend mission is a healing
  mission — her best XP night of the act). **KHARN** (L6, +2 gap) and
  **JET** (L5) earn full rate. **DAX** (L8–9, +4–5 gap) is throttled to
  ×0.5 by the decay — the leader babysits the line while the laggards level.
  Working exactly as rule 10 intends; no numbers touched.

#### FE / Stargate flavor notes

- **FE register:** a classic early-game defend chapter — hold the choke N
  turns, green unit in the AI's teeth, reinforcements from the gate you're
  not watching. Dasha is the FE villager who WILL die if you shrug, priced
  in permanent flags instead of a game over. The paralogue gate
  (`ledgerSaved` → Battle 3) is FE structure: tonight's small mercy is next
  week's whole chapter.
- **Stargate register (feel only, all terms original):** the wardens are a
  false god's *bureaucracy* — uniformed collection for a man whose miracles
  are someone else's plumbing. Menace by paperwork: raids have citations,
  the loudhailer reads them, and the god never appears — Keldrin is a voice
  over comms taxing people who half-worship him. The crew's counterplay is
  the franchise-feel too: no chosen ones, just competent people holding a
  door until the shields come up.
- **Voice doctrine check:** Keldrin is theatrical and SPECIFIC — he talks
  about books and scheduling, never about power (Vash talked retirement).
  Reeve talks like an invoice. Nothing recognizable from any franchise.

#### Replay variance & uniqueness check

**Variance:** AGI×rand(0.8–1.2) turn shuffle (doctrine); skimmers re-target
live (hunter bonus loses to a guaranteed kill — a wounded, exposed ally can
pull a hunter OFF Dasha mid-run: emergent, unscripted); reinforcements fire
on round 4 OR minions≤3 — aggression changes the wave's timing; cage timing
is a player-authored variable (round-1 spring vs. never); rout vs. timer
converge within a round of each other; Dasha's own pathing threads a live
battlefield differently every run.

**Uniqueness (one line per prior mission):**
- *Eastern Sump:* fauna hunt + explore/missable-recruit search — no timer,
  no NPC, no defend. No overlap.
- *Shaft Nine:* tunnel rout + vermin reinforcements + machine boss — kill
  objective, no greens, no ally lever. Reinforcements recur here but as the
  anti-turtle beat of a DEFEND, not a kill-mission wave. No overlap.
- *KR-7:* storm + boss phase + chasm, kill-boss — Tithe Night runs storm
  OFF, phase OFF, and wins by the clock. No overlap.
- Firsts: first survive-timer, first green unit, first player-triggered
  ally deploy, first fight the crew wins by *holding*.

#### Playtest watchlist

1. **Dasha's round-3 death window** — too many "she died and I never had a
   chance": raise HP 14→16 (3 skimmer hits) or delay one skimmer spawn 2
   tiles east. Too safe: drop her freight-cover start tile to plain.
2. **The 4-floor peak (rounds 4–5)** — "too brutal" at 4 units: carbineers
   2→1 (+1 reinforcement titheman); "too easy" at 5: carbineer ATK 12→13
   or reinforcements onRound 4→3.
3. **Cage economics** — if every playtest springs Gunnar round 1 and
   cruises: move the cage to (1,11) (one round further) or Reeve +4 HP.
   If nobody springs him: he wasn't bellowing loudly enough — add a
   per-round log bark, not a stat change.

---

### BATTLE 2 — THE GLASS FIELDS (MAINLINE, lvl 5)

*Mission id: `glassfields` → `js/missions/glassfields.js`. Mission lvl 5
(doctrine formula: 3×(act−1)+battle# = 3×1+2 = 5).*

#### Premise & fantasy

Walk a farmer home through an orchard of glass bells that ring damage on
everyone near them — while the people who came to cut the orchard down try
to ring it first.

The section-6 premise honored: the ring-fall fields east of the canyon —
centuries of fallen halo shards standing in the regolith, humming. Fen's
vapor rig is wrecked mid-field; a warden salvage sweep is working toward it,
cutting only the *singing* shards — the first visible proof the tithe was
never about money. Full roster returns: Gunnar out of impound, Vesper back
on her feet (+ Hob; + Jet if he was found in Act 1). Story beats: the fields
beautiful and wrong (hymn as visible pulse), the resonance-harvest reveal,
and Vesper's line — "It's not a song. It's a WORK ORDER."

#### The ONE twist — resonant shards

Nine standing shards dot the field as attackable objects. **One rule:**

> Strike a shard — any unit, any side, melee or ranged — and it RINGS:
> every unit within 2 tiles (Manhattan) takes 4 damage, friend, foe, or Fen.
> The third ring cracks it: the shard crumbles into boulders (cost 2, 15%
> evade). No HP, no DEF, no damage roll — hitting a bell IS ringing it.

Why this forces a decision Battle 1 didn't: Tithe Night was about *holding
tiles*; the shards make every tile's value conditional. The only cover on
the field (debris, 30% evade) sits **inside ring radii** — the place you
want to stand is the place the enemy can make expensive. The warden CHIMERS
(ARTY, rng 2–3) will deliberately ring shards to splash your escort cluster,
and at range 3 they stand *outside* the radius they detonate — ranged
ringing is free, melee ringing chips yourself. Which hands the player a
mirrored tool: Vesper's PSY LANCE (rng 2–3) and Jet's reach make the crew's
own safe ringers. You can spend actions exhausting a shard on your schedule
(three rings while nobody friendly is near — expensive, thorough), ring it
once when three wardens crowd it (4 dmg turns their 16–20 HP frames into
one-hit kills), or route around the orchard entirely through the open south
flank the skimmers own. The escort route becomes exactly what the premise
asked for: an argument about which chimes you can afford to ring.

Twist budget check: storm OFF (Vantorr's sky is quiet — the orchard replaces
the asteroid storm as ambient pressure), bossPhase OFF. Reinforcements reuse
the existing switch. Exactly one new idea on the field.

#### Objective & win/lose

- **WIN (primary):** Fen reaches the home edge (any x=0 tile). Battle ends
  immediately — enemies left standing are XP left on the table (a real
  choice).
- **WIN (fallback):** all wardens destroyed. If Fen dies the battle stays
  winnable by rout, per the green-unit doctrine.
- **LOSE:** Dax falls (standard).
- **Sweetener:** killing SWEEP-MASTER CULVER cancels the round-4
  reinforcement wave (this is *existing engine behavior* —
  `callReinforcements` only fires while the boss lives, battle.js ~1192)
  and drops his manifest: 60₡ strongbox + `searched['culver-manifest']`
  (dialog-only flag: the manifest shows the cut glass is hauled DOWN, not
  off-world — feeds the storyStage-4 reveal).

#### Why it's fun

- The fight has a *shape*: rush east to reach Fen (rounds 1–2), turn the
  sweep at the waist chokepoint (rounds 3–4), fighting withdrawal west with
  fresh cutters chasing (rounds 5–6). Three phases, one map, no scripting.
- Every crew special has a visible job: JOLT PROD stuns the first cutter on
  Fen (≈11 HP saved — a full third of his bar), BULWARK holds the waist,
  BLINK+LANCE counter-rings the Chimers, EXTRACTION un-overextends an
  escort, LUNAR RUSH double-taps cutters, RIFTBREAK deletes a third of
  Culver, CRYO-CALL is escort insurance.
- Vesper's re-entry battle (she missed Tithe Night hymn-sick) is also her XP
  feast and her story beat — the psionic is the one who reads the orchard.

#### Threat math

**Party projection at entry (mission lvl 5).** Method per doctrine: base
stats (characters.js) + expected per-level gains E[HP]≈1.67 (floor
base+2·(L−1) dominates → use floor), E[ATK]≈0.62, E[DEF]≈0.45, E[AGI]≈0.62;
ATK floor base+⌊(L−1)/2⌋. Levels: crew entered Act 2 at L4–9 (Dax top,
Vesper/Hale bottom), Battle 1 (lvl 4) added ~1 level to its five deployers;
Gunnar (impounded) and Vesper (hymn-sick) sat it out.

| Unit | Lvl | HP | ATK | DEF | AGI | MOV | Notes |
|---|---|---|---|---|---|---|---|
| DAX | 9 | 42 | 16 (+2 machete = **18**) | 10 | 13 | 5 | RIFTBREAK |
| KHARN | 7 | 36 | 16 | 7 | 15 | 6 | LUNAR RUSH |
| GUNNAR-7 | 6 | 44 | 13 | 11 | 7 | 4 | BULWARK; missed B1 |
| JET (if alive) | 6 | 30 | 12 | 6 | 9 | 7 fly | EXTRACTION |
| VESPER | 4 | 22 | 6 | 4 | 9 | 5 | 14 MP; SHOCK 10, **PSY LANCE 14–17 (rng 2–3, ignores DEF)**; missed B1 |
| SISTER HALE | 4 | 24 | 7 | 5 | 8 | 5 | 12 MP; MEND 10 |
| HOB | 4 | 31 | 10 | 7 | 8 | 5 | JOLT PROD; ratified base + 1 level from B1 |

Hob fights on the ratified base proposal (see consolidation notes) plus one
level of Battle 1 XP. **Party HP pool: 229 with Jet, 199 without.**

**Focused damage per round** (dmg = max(1, ATK−DEF) ±10%, crit 8% ×1.5;
spells flat). Vs a DEF-5 warden: Dax 13 · Kharn 11 (×2 once, via RUSH) ·
Gunnar 8 · Jet 7 · Hob 5 · Vesper LANCE 14–17 · Hale 2.
**Theoretical total ≈ 58–60/round. Practical escort-split output ≈
32–40/round** (half the force screens Fen). Enemy HP pool 206 on-map (+32
reinforcements) → rout in ~6–7 rounds; escort exit lands round 5–6.
**Escorting is the faster win — by design.**

**Enemy pressure per round vs the pool:**
- **R1:** one eager cutter reaches the rig; ~7 expected on Fen (30% rig
  evade).
- **R2:** all 3 cutters converge on Fen (~14–21 on him); skimmers cross the
  south flank; Chimers walk up. ~20–28 total.
- **R3–4 — PEAK:** tithemen + Culver hit the waist, skimmers reach the
  backline, Chimers ring shards (4 × 2–3 units), cutters finish or die.
  Potential ≈ 55–70/round; mitigated by Bulwark, 30% cover, body-blocks, and
  Jolt Prod ≈ **25–35/round vs a 229 pool + MEND 10–12/round + 3 battle
  items** → the player loses ~12% of pool per peak round. Doctrine-compliant
  pressure: mistakes cost a squishy, not the battle. Round 4 adds 2 cutters
  at the east edge chasing the escort — the anti-turtle clock.
- **R5–7:** decay; escort exits or the rout completes.

**Culver TTK under focus:** DEF 7 → Dax 11, Kharn 9, Vesper 14–17, Jet 5,
Gunnar 6, Hob 3 per hit. Committed alpha (Dax + Kharn×2 via RUSH + LANCE) =
**43 ≥ 34 HP: one all-in round late-battle, 2 rounds realistically** — 3–4
focused hits, no regen, no phase. Killing him before round 4 cancels the
reinforcements; that diversion while the escort clock runs is the entire
optional-objective decision.

#### Enemy roster

| Name | Ct | HP | ATK | DEF | AGI | MOV | rng | Class | Boss | Hits to kill it | Hits to kill Vesper (22 HP, DEF 4) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| WARDEN TITHEMAN | 3 | 20 | 13 | 5 | 7 | 5 | 1 | Warden · TITH | — | Dax 2 · Kharn 2 · Gunnar 3 | 3 (dmg 9) — **2 + one shard ring** |
| CUTTER RIG | 3 (+2 reinf.) | 16 | 14 | 3 | 9 | 6 | 1 | Warden · CUTR | — | Dax 2 (crit 1) · Kharn 2 · LANCE 1–2 | 3 (dmg 10) |
| WARDEN CHIMER | 2 | 16 | 11 | 4 | 6 | 4 | 2–3 | Warden · ARTY | — | Dax 2 · LANCE 1–2 | 4 ranged (dmg 7) — but its rings make it 3 |
| RING SKIMMER | 2 | 16 | 13 | 4 | 6 | 7 fly | 1 | Warden · FLY | — | Dax 2 · Jet 2 | 3 (dmg 9) |
| SWEEP-MASTER CULVER | 1 | 34 | 15 | 7 | 8 | 5 | 1–2 | Warden · BOSS | ✦ | 3–4 focused (Dax 11/hit); 1 committed round w/ specials | **2** (dmg 11) |

**Every number justified:**
- **Titheman 20/13/5** — the line standard, grown from B1's 16/13/4 for a
  lvl-5 mission. HP 20: dies in 2 hits from either leader (13+13, 11+11),
  3 from mid crew — rule 1 exact. ATK 13: 9/hit on Vesper → 3 exposed hits,
  or 2 + a 4-dmg ring (9+9+4=22) — rule 2 exact, and it welds the twist
  into the kill math. Vs Gunnar (DEF 11) it deals 2 — the wall works. DEF 5
  keeps Hob at 4 hits (she screens, she doesn't sweep).
- **Cutter Rig 16/14/3** — glass-cutting torch on legs; the designated Fen
  hunters. Glass HP/DEF (any crew member 2-hits it, a Dax crit or good
  LANCE one-shots) buys the highest line ATK: 11/hit on Fen (DEF 3) → the
  escort threat clock below. MOV 6 = they arrive before the crew can.
  AGI 9 = they often act before Fen (AGI 5) — hits land before he can flee.
- **Chimer 16/11/4, rng 2–3** — the kr7 Spiker chassis (16/9/4/6, MOV 4,
  rng 2–3) at +2 ATK for a lvl-5 mission. Its carbine is the side arm; its
  real weapon is the orchard (AI rule in Engine Needs). Fragile on purpose —
  the player's counterplay is "kill the bell-ringer," and 16 HP makes that
  one good turn.
- **Skimmer 16/13/4, MOV 7 fly** — the kr7 Skiff grown up (+2 HP, +4 ATK
  for lvl 5, wings per doctrine rule 3: MOV up, AGI 6 stays low). Exists to
  punish an unguarded backline via the south flank: 8/hit on Hale → 3
  exposed hits kills her.
- **Culver 34/15/7** — ATK 15 makes him the scariest single unit (2-hits
  Vesper, 11/hit); HP 34 vs the party's 43-point committed alpha means he
  dies to one spent-specials round or two focused ones — pressure, not a
  sponge (rule 9: no regen outside phase tech, and there is no phase here).
  MOV 5 rng 1–2: he walks with the sweep, he doesn't snipe.

Enemy count: 11 on-map + 2 reinforcements vs 7 crew (6 without Jet) — one
step up from kr7's 9 vs 6, paid for by the escort splitting the enemy's
attention too (cutters ignore the crew).

#### Map — 18×13, kr7 digit legend

Legend: `0` regolith · `1` boulders (cost 2, 15% evade) · `2` debris cover
(cost 2, 30% evade) · `S` = **resonant shard** object standing on regolith ·
`F` = Fen's start (wrecked rig, debris tile).

```
        x0.......x5........x11......x17
y0      1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 1 1 1
y1      1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1
y2      0 0 0 0 S 2 0 0 S 2 0 0 S 0 0 0 0 0
y3      0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
y4      0 0 0 1 1 0 0 0 0 1 1 0 0 0 0 0 0 0
y5      0 0 0 1 1 0 S 0 0 1 1 S 2 2 0 0 0 0
y6      0 0 0 0 0 0 0 0 0 0 2 0 2 F 0 0 0 0
y7      0 0 0 1 1 0 0 0 S 1 1 0 0 2 S 0 0 0
y8      0 0 0 1 1 0 0 0 0 1 1 0 0 0 0 0 0 0
y9      0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
y10     0 0 0 0 0 S 2 0 0 0 0 0 0 S 0 0 0 0
y11     1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1
y12     1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 1 1 1
```

As mission-file rows (S/F resolve to `0`/`2` terrain; shards/Fen are
objects):

```
111000000000000111
100000000000000001
000002000200000000   ← shards at (4,2)(8,2)(12,2)
000000000000000000
000110000110000000
000110000110220000   ← shards at (6,5)(11,5)
000000000020202000   ← Fen at (13,6); waist cover (10,6)
000110000110020000   ← shards at (8,7)(14,7)
000110000110000000
000000000000000000
000000200000000000   ← shards at (5,10)(13,10)
100000000000000001
111000000000000111
```

**Prose key:**
- **Home edge / deploy (W, x0–2, y4–8):** dax(1,6) gunnar(2,6) kharn(2,5)
  hob(2,7) jet(1,4) vesper(0,6) hale(1,8). Fen wins by reaching any x=0
  tile.
- **Two chokepoints:** boulder ridges at x3–4 and x9–10 (y4–5, y7–8) with
  one-tile-tall gaps at y6 — the waist. The east gap (9–10, y6) is the
  fight's crux: its lone cover tile (10,6) sits inside the ring radii of
  **two** shards, (11,5) and (8,7). The 30% evade tile you want is the tile
  the Chimers can tax — hazards where the player wants to stand, literally.
- **Open flank (S, y9–11):** a clean, coverless, nearly shardless lane the
  full width of the map. Skimmers (MOV 7 fly) and the round-4 reinforcement
  cutters race it; the player can run Fen down it too — longer and naked.
- **North orchard (y1–3):** densest shard row with cover pockets (5,2),(9,2)
  inside ring radii — the tempting shortcut.
- **The rig (x11–13, y5–7):** debris cluster, Fen barricaded at (13,6) with
  30% evade. Shard (14,7) is 2 tiles from him — a Chimer can chip Fen inside
  his own barricade. The safety is pre-cracked.
- **Shards (9):** (4,2) (8,2) (12,2) (6,5) (11,5) (8,7) (14,7) (5,10)
  (13,10). Rung shards that crumble leave boulders — the field deforms
  differently every run (replay variance, and it replaces the storm's
  map-churn role).
- **Enemy spawns:** cutters (16,6) (16,1) (16,11) · tithemen (15,4) (15,8)
  (16,7) · chimers (16,3) (16,9) · skimmers (17,2) (17,10) · Culver (17,6).
  Reinforcement spawn tiles: (17,5) (17,7) (17,3) (17,9).

#### Rescue-NPC spec — FEN

**Stats:** HP 24 · ATK — (never attacks) · DEF 3 · AGI 5 · MOV 4 · side
`npc` (green). HP 24 justified below; MOV 4 = one under crew baseline, so
escorting means actively screening, not strolling (13+ tiles to home = 4
clean walking turns); AGI 5 = he usually acts *after* the wardens, so hits
land before he can flee — the screening has to be real.

**Behavior:**
1. **Barricaded (start):** holds at the rig (13,6), debris evade 30%. Does
   not move. Attackable.
2. **Activation:** the first time a crew unit ends its turn within 2 tiles
   of Fen, he activates (one bark, see dialog).
3. **Active:** on his own turn he moves MOV 4 toward the home edge (min-cost
   path to x=0), preferring tiles adjacent to crew units, avoiding tiles
   inside shard ring radii when an equal-cost tile exists, never ending
   adjacent to an enemy if any legal tile avoids it. He never attacks.
4. **Death:** `fenLost`; battle continues, rout still wins.

**What kills him (quantified):** cutters deal 11/hit (14−3); tithemen 10;
rings 4. **Three hits kill him, or two hits plus one ring** (11+11+4 = 26 ≥
24). That "+ring" clause is why the Chimers are terrifying without ever
aiming at him directly.

**Threat clock (why smart play saves him):** the eager cutter (16,6) is
adjacent round 1 (3-tile walk) — expected ~7 on Fen through his 30% evade.
All three cutters engage by round 2 (~14–21 more). **Unopposed, Fen dies
round 3, round 4 with average evade luck.** Crew reach: Jet (MOV 7 fly) and
Kharn (MOV 6) contest the rig on round 2; Vesper lances a 16-HP cutter off
the board from cover; Hob arrives round 3 — her JOLT PROD on a cutter is
worth exactly one hit ≈ 11 HP ≈ 46% of Fen's bar. Removing ~1.5 cutters by
end of round 2 keeps Fen above 10 HP at activation. **Save margin ≈ one full
round of deliberate play — threatened but savable; lost to autopilot.**

**Enemy hunt-priority (quantified, extends the existing aiTurn scoring —
kill=900, wounded=34−hp, MP-bar=+22, low-DEF=+8):**
- **Cutter Rigs: Fen bias +200.** They beeline through body-bait and ignore
  squishier crew; only a guaranteed kill (+900) outranks the quota.
- **Tithemen / Skimmers: Fen bias +40** — above the mage bonus (+22): they
  take him opportunistically but peel to finish wounded crew.
- **Chimers:** ring-scoring (see Engine Needs) counts Fen as two crew.
- **Culver:** standard targeting — he hunts the crew, not the farmer;
  killing Dax ends the battle and he knows it.

**Reward on save:** `fenSaved`. The lunch tin goes home. Town consequences
per section 4c: the glasshouse scene, and from storyStage 4 Fen gives the
SIGNAL LENS (inert heirloom, Act 3+ seed). Win dialog plays the warm
variant.

**Permanent consequence on loss:** `fenLost`. Mirrit's window goes dark
(tile swap) for the rest of the game; her dialog drops to two lines, neither
angry; a new glass bell appears on the ossuary trail, forever; the Signal
Lens door closes unseen. Win dialog plays the bleak variant ("The tin goes
back full.").

#### Config (existing switches + new keys)

```
lvl: 5,
config:{
  storm:false,                      // Vantorr's sky is quiet — the orchard is the weather
  bossPhase:false,                  // twist budget spent on the shards
  reinforcements:{                  // existing switch, existing semantics
    count:2, onRound:4, orWhenMinionsLeq:2,
    spawns:[[17,5],[17,7],[17,3],[17,9]],
    unit:{ CUTTER RIG statline },
    bark:'CULVER: "Second team, east row. The quota does not care that you\'re tired."'
    // NOTE: engine already cancels this if Culver dies first (boss-alive gate)
  },
  // NEW (see Engine Needs — build order):
  escort:{ unitId:'fen', exitCol:0, activateRadius:2 },
  shards:[[4,2],[8,2],[12,2],[6,5],[11,5],[8,7],[14,7],[5,10],[13,10]],
  shardRule:{ ringDmg:4, ringRadius:2, ringsToCrumble:3, crumbleTile:1 },
}
```

#### Dialog sketches (warm, wry, melancholy)

**Briefing:** "THE GLASS FIELDS — walk Fen to the western edge. The shards
RING when struck: 4 dmg to everyone within 2 tiles, any side. Third ring
cracks them. One ✦ special each. Drag to scout the orchard first."

**Intro — SWEEP-MASTER CULVER** (theatrical and specific; acoustics and
accounting, never evil):
1. "Sweep line on the rig. The farmer's squatting on eleven verified
   singers — that's a tithe-week of warehouse glass if we cut clean."
2. "Rules of the orchard, wardens: leave the quiet ones. Quiet glass is
   inventory. LOUD glass is payroll."
3. "And the farmer? Retire the arrears. The manifest doesn't print a column
   for objections."

**Fen — activation bark:** "You brought the tin? ...She KNEW. Fine — I'm
moving. Don't let them ring the tall one by my rig. I sleep next to that
one."

**Scripted bark, first shard rung (either side):** VESPER: "Wait. The
pitch — it answered in ORDER. It's not a song. It's a WORK ORDER." *(the
required story beat; repeated in the win chain so no player misses it)*

**Win — fenSaved:**
- FEN: "They weren't scavenging. They took the singers and left the quiet
  standing. Thirty years of orchard, sorted by EAR."
- VESPER: "Transcribing it. It's a schedule. Somebody down there is keeping
  a schedule ten thousand years old."
- HOB: "Glass that sings, wardens that count. I've hauled stranger cargo.
  Never dumber."
- DAX: "Come on. Someone's holding your lunch."
- *(caption)* That night, the ground over the Understack sings loud enough
  to hear from the plaza. Nobody sleeps well.

**Win — fenLost:**
- KHARN: "The cutting is finished. Both kinds."
- HALE: "…I'll take the tin back. Somebody has to."
- *(caption)* The tin goes back full. On the ossuary trail, a new bell —
  small, clear, in a niche cut too recently. The ground sings that night,
  and it sounds different now.

**Lose:** "Dax falls among the singing glass. The orchard keeps ringing,
long after there is no one left to hear it."

#### Mission lvl & XP feed

`lvl: 5`. Gap math at entry: **Vesper (L4), Hale (L4), Hob (L4) feed at
full rate** — this battle is deliberately Vesper's feast (LANCE one-shots
16-HP frames; her re-entry from hymn-sickness aligns story and economy) and
Hale's heal-parity payday (escorts bleed, MEND pays ×0.9). Jet (L6), Gunnar
(L6), Kharn (L7) full rate. **Dax (L9, gap 4) pays the outlevel tax:
×0.79.** Total table ≈ 214 damage-XP + 130 kill-XP + ~35 heal-XP ≈ 380 XP →
roughly +2 levels each across 7 deployers; crew exits toward L5–7 (leaders
9–10), on the act's L9–12 exit trajectory.

#### FE / Stargate flavor notes

- **FE:** the classic green-unit escort chapter — the NPC with his own turn,
  the enemy with written orders to kill him, the map that punishes both
  turtling (round-4 chasers) and rushing (the ring radii). Shards are FE
  terrain-as-argument: the cover tile that is also the kill zone.
- **Stargate:** the wardens are the false god's foot-soldiery as *tax
  office* — the sweep is the first scene where the audience sees the
  "miracle" is industrial harvesting of someone else's infrastructure.
  Culver is the competent mid-season field commander on a quota, not a
  zealot; the horror is the paperwork. The orchard itself is the
  transplanted-culture reveal in terrain form: the congregation's hymn,
  growing wild in a field.

#### Replay variance & uniqueness check

**Variance per run:** which shards get rung/crumbled reshapes the field into
different rubble each time; turn-order variance (AGI ×0.8–1.2) decides
whether the eager cutter strikes before Jet arrives; the reinforcement
trigger fires on round 4 OR minions ≤2 — fast players meet the second sweep
early; Jet's existence is itself roster variance; three viable routes
(orchard / waist / south flank) with different chime bills.

**Uniqueness, one line per prior mission:**
- SUMP: fauna brawl + missable pickup — no escort, no interactive hazards.
- SHAFT 9: tunnel kill-boss with vermin waves — indoors, no green unit.
- KR-7: storm + boss-phase chasm — here both are OFF; the hazard is player-
  and-enemy-triggered, not scheduled.
- B1 TITHE NIGHT: defend-in-place with a static green unit and a cage
  lever — B2 inverts it into movement: the green unit crosses the whole map
  and the "lever" is nine bells anyone can pull.

#### Playtest watchlist

1. **Fen's clock** — dies before round 3 too often → cutter ATK 14→13 or
   Fen HP 24→26; never threatened → eager cutter starts at (15,6).
2. **Ring damage 4** — if nobody ever stands near shards, drop to 3 (vent
   parity); if the orchard is ignorable, raise Chimer count to 3, not the
   dmg.
3. **Culver ATK 15** — if Vesper deaths feel cheap rather than earned,
   15→14 (keeps 2-hit kill only with a crit).

---

### BATTLE 3 — THE TITHE-PIT (OPTIONAL paralogue, lvl 5)

*Mission id: `tithepit` → `js/missions/tithepit.js`. Window: storyStage 4
only, requires `ledgerSaved` + talking to Brand; closed forever when
Battle 4 begins.*

#### Premise & fantasy

The grubby machinery behind Keldrin's miracles is a quarry-prison with a
clipboard, and the clipboard has a schedule — beat the schedule.

The wardens' tithe-pit in the canyon: cages of "tithe debtors" who are
really the Understack dig's labor pool. The pit-boss doesn't fight; he
administrates. When the crew drops in through Brand's adit, he posts a
**retirement schedule** — cages destroyed in a fixed, readable order — and
the amendment from the crown office moves one file to the top: the
halo-diver guide who cost them a skiff. That's VYE, the act's missable
recruit, and this is her double cruelty: skip this battle and she's gone;
fight it too slowly and she's gone anyway.

No cosmic anything on screen. That absence IS the reveal — ten years of
miracles bought with cages and quotas.

#### The ONE twist — the retirement schedule

A visible execution clock made of units.

- Five cages line the pit's north wall, numbered on the map in retirement
  order.
- Two CAGE-JACK rigs (repurposed loaders with hydraulic rams — "the
  clipboard made lethal") execute the schedule: the assigned jack walks to
  the current cage and swings until it's scrap, then moves to the next. Its
  targeting is scripted — it ignores the crew completely.
- The player can derail the clock four legible ways, all with tools they
  already own:
  1. **Kill the executor** (3 focused hits) — but the pit-boss then
     *reassigns* the other jack, which is guarding the gatehouse ramp.
     Killing the executioner opens the gate. That's the fight's central
     trade.
  2. **Kill both jacks** — the schedule halts permanently (bureaucracy as
     mercy: carbines aren't "rated for cage duty").
  3. **Stall it** — Hale MENDs the cage (+1 swing needed), Hob JOLT-PRODs
     the jack (skips a turn), Gunnar BULWARKs adjacent (taunt forces the
     swing onto him).
  4. **End it** — seize the gatehouse tile or kill the pit-boss; either
     stops everything and springs every surviving cage.

Why it forces a decision the last battle didn't: Battle 1's clock was
*defensive* (survive N rounds, stand still); Battle 2's green unit *moved
with you* (escort). Battle 3 flips the clock's polarity — the timer runs on
THEIR side of the map, and every round spent protecting the row is a round
not spent taking the gate that ends the threat. Speed is the whole fight;
the XP decay has already made grinding it pointless, so the design gets to
be pure tempo.

#### Objective & win/lose

- **WIN (primary — SEIZE):** any ally unit reaches tile **G (16,2)**, the
  gatehouse release board. All surviving cages spring open; wardens scatter;
  the pit-boss "retires himself" if still alive.
- **WIN (secondary):** kill PIT-BOSS HASP (`boss:true`, existing
  boss-death → victory path). The schedule dies with the scheduler. (He
  stands one tile past G behind a one-wide approach; in practice this road
  passes through the seize anyway — but Vesper can snipe him with PSY LANCE
  from range 3, a slow, funny, legitimate alternate.)
- **LOSE:** Dax falls (standard, existing `checkEnd`).
- **NOT a loss:** any or all cages destroyed. The battle stays winnable with
  the whole row dead — the town just gets darker, permanently.

#### Why it's fun

- Every crew member's kit answers the clock differently (lance the jack /
  prod the jack / taunt the jack / heal the cage / fly the pit / plug the
  shelf) — the schedule is a puzzle the existing toolbox already solves five
  ways, which is the best kind of twist.
- The enemy's action economy is honest: two of their heaviest units spend
  their turns hitting furniture. The player is never facing full enemy DPS —
  they're racing it.
- The reassignment rule makes the obvious heroic play (kill the
  executioner!) also the strategic play (the gate guard leaves) — generosity
  and greed point the same direction, then the reinforcement wave punishes
  you for enjoying it.
- Partial failure has a gradient: you can win, recruit Vye, and still watch
  cage one die because you were slow. Optional battles are where consequence
  doctrine gets to bite hardest.

#### Threat math

**Party projection at entry (Battle-3 window: after B1 lvl-4 and B2 lvl-5).**
Projection rule (per doctrine): base stats + expected gains/level —
E[HP]≈1.67 with hard floor HP ≥ base+2(lvl−1) (the floor binds, so HP ≈
base+2/level), E[ATK]≈0.62 (floor +1 per 2 levels), E[DEF]≈0.45,
E[AGI]≈0.62. Casters +1 max MP per even level. Levels assume Act-1 exit Dax
~8, Vesper/Hale ~3, others between; B1 fed Dax/Kharn/Hale/Hob(/Jet), B2 fed
everyone, decay already throttling Dax.

| Unit | Lvl | HP | ATK | DEF | AGI | Notes |
|---|---|---|---|---|---|---|
| Dax | 9 | 42 | 16 (18 w/ machete) | 10 | 13 | 26+2·8 HP; 11+0.62·8≈16 ATK |
| Kharn | 8 | 38 | 16 | 7 | 15 | 24+14; 12+4.3 |
| Gunnar | 7 | 46 | 14 | 12 | 8 | impounded B1, fought B2 |
| Jet (if found) | 7 | 32 | 13 | 7 | 10 | fly, MOV 7 |
| Vesper | 5 | 24 | 6 | 5 | 9 | MP 14; PSY LANCE (L4): pow 14, rng 2–3, **flat** (spells ignore DEF in engine) → 14–17/cast |
| Hale | 5 | 26 | 7 | 6 | 8 | MP 12; MEND 10–12; AURA (L5) |
| Hob | 5 | 31 | 10 | 7–8 | 8 | ratified base (join L3) + B1 + B2 |

Party HP pool (7 units): **≈ 239**. Hob fights on the ratified base
proposal (see consolidation notes) plus two battles of full-rate XP.

**Party focused damage per round** (attack dmg = max(1, ATK−DEF) ±10%;
spells flat). Vs a DEF-5 line enemy: Dax 11–13, Kharn 11, Gunnar 9, Jet 8,
Hob 5, PSY LANCE 14–17. **Full-focus ceiling ≈ 45–50/round; realistic split
across three fronts ≈ 15–20 per front.** Enemy HP is sized so 2–3 hits from
the hitters kill anything non-boss (doctrine 1).

**Enemy ATK sizing (doctrine 2: 2–3 exposed hits kill Vesper/Hale):**
Vesper projected 24 HP / DEF 5 → 3-hit kill needs ≥ 8 dmg/hit → ATK ≥ 13.
Hale 26 HP / DEF 6 → 3-hit kill needs ≥ 9 → ATK ≥ 15 from the heavies. So:
line troops ATK 14 (Vesper in 3, Hale in 3–4), cage-jacks ATK 16 (Vesper in
3, 2 with a crit; Hale in 3). No enemy 2-shots Vesper without a crit —
lvl-5 paralogue, not a meat grinder.

**Pressure curve:**
- **R1:** alarm; schedule posts (banner); north carbineers advance; jacks
  idle one round ("the amendment comes down the wire") — the player's one
  free round of reading.
- **R2:** jack A moves to Vye's cage; skiff harasses the pit crossing; south
  squad angles in.
- **R3:** first swing on cage 3 (banner: RETIREMENT 1/2). Player
  interceptors arrive (Jet r2, Kharn r3, first lance r3).
- **R4–5 — PEAK:** second swing due (cage dies end r4 unimpeded); both
  pickets + south tithemen converge; reinforcements land r5 on the haul
  road. Enemy output vs crew ≈ 33–40/round ≈ 14–17% of the 239 pool —
  sustainable ~5 rounds with Hale healing, which is exactly the seize
  window.
- **R6–8:** reassignment drama (if jack A died), ramp assault, seize.
  Full-row save requires the gate/boss/both-jacks by ~r6–7. A dawdler
  watches cages die at r4, ~r7, ~r9, ~r11, ~r13 — each one on a clock they
  could read.

**Boss TTK sanity:** Hasp 32 HP / DEF 6, no regen, no phase — Dax+Kharn
focus ≈ 20/round → dead in 2 adjacent rounds; his cost is *reaching* him,
not fighting him.

#### Enemy roster (10 on map + 2 reinforcements)

Sprites: wardens reuse the Act-2 warden sprite set introduced by Battle 1;
CAGE-JACK reuses the `rig` chassis (Scrapfang Bruiser) in warden colors —
no new sprite hard-need (one recolor pass). No new enemy *role* without a
counter the player owns: every unit below dies to existing verbs.

| Name | Ct | HP | ATK | DEF | AGI | MOV | rng | Class | Boss | Hits to kill it | Hits to kill Vesper | Justification |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| WARDEN TITHEMAN | 4 (+2 rf) | 19 | 14 | 5 | 7 | 5 | 1 | Warden · TITH | – | 2 (Dax 11–13) – 3 (Jet 8) | 3 (9/hit) | Line trooper: HP so Dax+anyone kills in one focused exchange; ATK 14 = Vesper 3-hit floor |
| WARDEN PICKET | 2 | 16 | 13 | 4 | 6 | 4 | 2–3 | Warden · ARTY | – | 2 (Dax 12) | 3 (8/hit) | ARTY must die fast once reached (KR-7 Spiker precedent 16 HP); covers the open flank |
| WARDEN SKIFF | 1 | 16 | 13 | 4 | 7 | 6 fly | 1 | Warden · FLY | – | 2 (Dax 12) | 3 (8/hit) | Contests the void-pit so Jet's flank isn't free; harasses cage defenders standing on vents |
| CAGE-JACK (A: executor, B: gate guard) | 2 | 26 | 16 | 7 | 4 | 4 | 1 | Warden · HVY | – | 3 (Dax 9 / Kharn 9) or 2 PSY LANCE (14–17 flat) | 3 (11/hit; 2 w/ crit) | HP 26 = 3 focused hits (doctrine 1) and exactly killable inside the rescue window; ATK 16 = heavy **and** 2-swings-per-cage vs cage spec; AGI 4 = swings late in the round, interceptors usually act first |
| PIT-BOSS HASP | 1 | 32 | 11 | 6 | 5 | **0** | 1 | Warden · BOSS | ✓ | 4 (Dax 10) ≈ 2 rounds focused | 4 (6/hit — a deskman) | He runs a schedule, he doesn't fight (premise): MOV 0, poke-only ATK. HP low for a boss because killing him is a *win road*, not a duel — the map distance is his real HP |
| **CAGE ×5** (green objects) | 5 | 24 | – | 2 | – | 0 | – | npc · CAGE | – | n/a (ally-healable) | n/a | HP 24 / DEF 2 vs jack's 16 ATK → 14/swing → **always exactly 2 swings, crit-proof**: max non-crit 15.4, max crit 14·1.5·1.1 = 23.1 < 24. One MEND (10–12) forces a third swing. Deliberately RNG-proof — the clock never cheats in either direction |

Total XP pool ≈ 12 kills ×10 + ~246 enemy HP of damage XP (×0.9, cap
10/action) + heal XP ≈ **350–420 XP** → ~2 levels for the low-level crew
who do the work.

#### Map — 18×13, kr7.js digit legend

Legend (existing TERRAIN only): `0` regolith · `1` boulders/canyon wall
(cost 2, 15% evade) · `2` debris/machinery (cost 2, 30% evade) · `3`
crystal vent → skinned as **live glass seam** (3 dmg turn end, ground only)
· `4` open void → **the excavation pit** (flyers only).

```
111111111111111111    y0
100010010010000101    y1   cages C1(2,1) C2(5,1) C3(8,1)=VYE C4(11,1) C5(13,1) · HASP(16,1)
103003003003030101    y2   glass seams under each cage · G=(16,2) gatehouse board
100020000000201001    y3   north corridor · shelf gate (12–13,3) · ramp mouth (15–16,3)
100044444444000021    y4   pit begins · east shelf x12–16
102044444444010001    y5   deploy column west · SKIFF (8,5) over the pit
100044444444000201    y6
100044444444001001    y7
100004444440020001    y8   pit tapers
100000020000000001    y9   south rim road
102001000200100201    y10  spoil heaps + debris = broken cover on the road
100000000000000001    y11  open haul road · reinforcement spawns (12,11)(14,11)(16,11)
111111111111111111    y12
```

**Prose key:**
- **Deploy (west adit, Brand's way in):** dax(1,6) kharn(1,5) gunnar(2,6)
  jet(1,4) vesper(1,7) hale(2,7) hob(1,8). Full roster, 7 deployable (6
  without Jet).
- **The cage row (y1):** five cages in wall niches, wall stubs (x4,7,10)
  breaking the corridor into defensible pockets. The two safe tiles flanking
  each cage are narrow; the third adjacent tile is a **glass seam vent — the
  hazard sits exactly where a defender wants to stand** (3 chip dmg/turn to
  hold the line; the AI's tilePenalty already makes enemies avoid them, so
  vents tax the player's defense, not the enemy's offense).
- **The pit (4-void, center):** flyer-only shortcut — Jet crosses to the
  cage row in 2 turns. The WARDEN SKIFF lives over it so the shortcut is
  contested, not free.
- **Chokepoint 1 — the ramp mouth (15,3)–(16,3):** the only way onto the
  gatehouse platform; approach to G runs (16,3)→(16,2), one tile wide at the
  end. Jack B stands in it. Gunnar can plug it *from the outside* during the
  mop-up, or the crew punches through.
- **Chokepoint 2 — the shelf gate (12,3)+(13,3):** debris + open tile
  between the east shelf and the cage row; a reassigned jack B must transit
  here to reach the cages. **Gunnar at (13,3) with BULWARK dominates it** —
  the taunt forces the jack's swings onto him, which is the doctrine's
  body-blocking made into a rescue.
- **Open flank — the south haul road (y9–11):** wide, fast, broken cover
  only. The pickets rake it from the heaps, the south tithemen sweep it,
  and reinforcements land on it at round 5. It's the quick route to the
  gate and the expensive one — exactly the AI-exploitable lane doctrine 6
  wants.
- **Enemy starts:** jkA(12,3) jkB(16,3) HASP(16,1) · tithemen (6,3)(10,3)
  north patrol, (9,9)(12,9) south sweep · pickets (14,6) covering
  shelf/ramp, (9,10) covering the road · skiff (8,5).

#### Rescue-NPC spec — VYE and the cage row

**Vye's cage (C3 — the amendment):**
- **Start tile:** cage 3 at **(8,1)**, dead center of the row, visible from
  deploy in one camera drag. VYE is inside; the cage is the unit (side
  `npc`, HP 24, DEF 2, MOV 0). Behavior: none — it's furniture with a
  person in it. Ally spells may target it (MEND/MEND II heal it; heal XP
  pays at parity per existing rule).
- **Hunt-priority weighting (quantified):** cages have **weight 0 for every
  enemy except the assigned executor**, for whom the scheduled cage is an
  **absolute override** (in aiTurn score terms: +2000, unconditional — it
  never considers crew targets, never retargets from taunt EXCEPT Bulwark's
  forced-attack rule, which is exactly the counterplay). All other enemies
  path around cages as walls. One clock, no chaos.
- **The threat, round-precise (unimpeded):** jack A idles r1 (posting),
  reaches C3-adjacent during r2 (path ≈ 7 tiles, MOV 4, prefers the
  non-vent tile (9,1)), **swing 1 in r3, swing 2 in r4 → Vye retired end of
  round 4.** Reachable by exactly 1 enemy at r2; dies in exactly 2 hits;
  crit-proof both ways.
- **Threatened but savable — the counters, costed:**
  - *Kill jack A (26 HP) by his r4 swing:* Jet adjacent r2 (6/hit ×3 turns =
    18) + Kharn r3 (9 ×2 = 18) = 36 ≥ 26 with margin; or PSY LANCE r3+r4
    (28–34 alone, 2 casts of Vesper's 3). Committing 2 units saves her;
    committing 3 saves her comfortably.
  - *Stall:* Hale MEND on the cage (+1 swing → deadline r5); Hob JOLT PROD
    on the jack (skip a swing → +1 round); Gunnar BULWARK if he can reach
    (he can't by r4 — MOV 4, ~13 tiles — his honest job is the shelf gate
    later).
  - Jack AGI 4 means interceptors (Kharn 15, Jet 10, Vesper 9) usually act
    before his swing each round — turn-order variance can steal or gift a
    swing (doctrine 4: surprises are a feature).
- **Reward on save (cage alive at victory):** ✦ VYE joins at the victory
  chain — no speech, per section 5: "You opened the cage. I noticed. I'm
  the part of the salvage that walks off on its own." Flag `vyeJoined`
  (save.js). Her kit (Halo-diver · SKMR, RING FLARE) is Erik-gated per Open
  Question 9 — not this design's to tune.
- **Permanent consequence on loss:** the moment C3 dies: banner `▼ CAGE
  THREE — RETIRED ▼`, log line, `lostCrew.add('vye')` on the spot (battle
  continues). Victory scene plays over an empty cage three; Brand's
  post-act dialog mentions, once, what the purge left. And the outer
  cruelty stands: never unlocking or never fighting this battle sets
  `lostCrew.add('vye')` when Battle 4 begins. Search everything. Save
  everyone. Always.

**The other four cages (the gradient):** C1, C2, C4, C5 hold townsfolk the
player has met by name if they've been talking: the stall-keeper Oro
vouches for, Cask's supplier, two Understack "arrears" laborers. Schedule
after the amendment: **C3 → C1 → C2 → C4 → C5** (unimpeded: r4, ~r7, ~r9,
~r11, ~r13 — travel time between cages is the mercy). Each surviving cage
at victory increments `searched['pit-freed']` (0–4): freed prisoners
visibly repopulate the Crossing's shuttered stalls (the act's economy walks
home — tile-swap already scoped in section 3). Each lost cage: that stall
stays shuttered forever + one changed line from the vouching NPC.
(Optional, Erik's call: one small glass bell per lost cage on the ossuary
trail, consistent with the Fen/Dasha bell doctrine — see Open Questions.)

#### Config (existing switches + new keys)

Existing switches:
- `lvl: 5` (XP-decay yardstick).
- `storm: false` — the battle already has a clock; two clocks compete for
  attention, and one-twist doctrine says no.
- `bossPhase: false` — Hasp's "phase" is the schedule; he never powers up,
  he delegates.
- `reinforcements: {count:2, onRound:5, orWhenMinionsLeq:2,
  spawns:[[12,11],[14,11],[16,11]], unit: WARDEN TITHEMAN, bark:'HASP:
  "Day shift! You're on the clock early. Arrears rates."'}` — lands on the
  open south flank; existing trigger requires the boss alive, which holds
  (Hasp dying = victory). Punishes turtling at exactly the pressure peak.
- `explore: true` — post-battle field walk: the pay-office strongbox (90₡)
  and a confiscated-gear rack (1 Repair Spray). Modest on purpose; Vye is
  the reward.

NEW config this battle needs (the twist, expressed as data — see Engine
Needs — build order):
```
purge: {
  startRound: 2,
  order: ['c3','c1','c2','c4','c5'],          // the amendment: the guide's file first
  executors: ['jkA','jkB'],                    // jkB is reassigned only if jkA dies
  reassignDelay: 1,                            // one round of "wire lag" — a savable beat
  haltWhenNoExecutors: true,                   // carbines aren't rated for cage duty
  banners: { post:'▼ RETIREMENT SCHEDULE POSTED ▼', retire:'▼ CAGE %N — RETIRED ▼' }
}
seize: { x:16, y:2, label:'GATEHOUSE BOARD' }  // any ally on tile → victory
```

#### Dialog sketches (warm, wry, melancholy; villain theatrical and specific)

**Briefing:** `THE TITHE-PIT — seize the gatehouse board (16,2) or drop the
pit-boss. The schedule retires one cage at a time. It is faster than you
think.`

**Intro — PIT-BOSS HASP** (he talks quotas, never evil):
- "Visitors. Sign the manifest or be ON it."
- "Wardens — we are BEHIND. Nine units of arrears and a schedule that does
  not care about weather, feelings, or salvagers."
- "Amendment, crown office: the guide's file moves to the top. Cage three.
  She showed our skiff a shortcut once. The shortcut was DOWN."
- *(▼ RETIREMENT SCHEDULE POSTED ▼ — numbered markers appear over the cage
  row)*

**Mid-battle barks:**
- Jack A destroyed: HASP: "A-unit is DOWN?? B-unit — leave the gate. The
  row is yours. The schedule HOLDS."
- Both jacks destroyed: HASP: "You want me to rate a CARBINE for cage duty?
  No. Rated equipment only. ...Schedule's suspended. This goes in the log."
- A cage lost: "▼ CAGE %N — RETIRED. The pit is quieter by one voice. ▼"

**Win (seize):**
- DAX: "Board's ours. Every latch on the row — open them."
- KHARN: "The little boss left his clipboard. It has… columns for this."
- DAX: "Burn it. …No. Keep the last page. Names go home with people
  attached."
- HALE: "They'll want water and a road. Both are back the way we came."
- *(if Vye saved)* VYE: "You opened the cage. I noticed. I'm the part of
  the salvage that walks off on its own." ✦ VYE joins the force.
- *(if Vye lost)* HALE, at the empty third cage, quietly: "Somebody knew
  the rings like a road. The road's shorter now."

**Lose:** `Dax has fallen in the tithe-pit. The schedule, unwatched, runs
to its end.`

#### Mission lvl & XP feed

`lvl: 5`. **Optional battles concentrate XP on whoever deploys** — there is
no bench splash; this paralogue is the act's designed catch-up valve. Decay
math at entry (decay begins at gap ≥ 4): Dax L9 → ×0.79, L10 → ×0.63; Kharn
L8 (gap 3) → full, barely. Vesper (L5), Hale (L5), Hob (L5), Jet (L7) →
full rate, and the mechanics feed them structurally: Vesper's flat-damage
lances are the best jack-killer, Hale earns parity XP healing cages, Hob's
prod is a clock verb, Jet owns the pit crossing. Recommended note to the
player-facing brief: none — let them discover that bringing the kids pays.
~350–420 XP pool ≈ 2 levels for the low crew.

#### FE / Stargate flavor notes

- **FE paralogue grammar:** optional, window-gated, permanently missable
  recruit inside, and a timer objective where green deaths are partial
  failures the game remembers — the "you were three turns late and the town
  knows it" feeling. **The seize verb** is the FE castle-gate made native:
  one tile, garrisoned, worth more than every kill on the map.
- **Stargate register:** the false god's economy, seen from below — the
  miracle tax is forced labor with paperwork; the wardens are an occupying
  priesthood's foot soldiers with timecards. Nothing cosmic appears on
  screen, and that's the point: you came for relics and found a payroll.
- **Tone lock:** the funniest line in the fight (carbines aren't rated for
  cage duty) is also the most merciful mechanic, and the saddest (the empty
  third cage) costs the player nothing but the truth. Worm-soup register,
  bureaucracy edition.

#### Replay variance & uniqueness check

**Variance:** turn-order variance (AGI ×0.8–1.2) decides whether the jack's
swing lands before your interceptor every single round — the r3–r4 rescue
never scripts the same; reinforcements arrive by round OR minion-count —
an aggressive player pulls them early; the reassignment chain depends
entirely on what the player kills and when (schedule runs A→B→halt, each
configuration opening a different gate window); which cages survive (0–5)
rewrites the town afterward — five different homecomings; the skiff's
harassment and AI kill-hunting re-target per run.

**Uniqueness, one line per prior mission:**
- **Sump (A1B1):** fauna brawl + post-battle explore-rescue — no clock, no
  green units, no seize.
- **Shaft Nine (A1B2):** tunnel fight + vermin reinforcements + machine
  boss — reinforcements were the event; here they're a garnish and the
  clock is the event.
- **KR-7 (A1B3):** storm + boss phase/chasm — both OFF here; Hasp is the
  anti-Vash: a boss whose power is a clipboard, not a phase.
- **Tithe Night (A2B1):** survive-N defensive clock, one hunted green
  unit — B3 inverts the clock (offense race) and rows the green units up as
  the objective itself.
- **Glass Fields (A2B2):** escort a moving green unit through resonant
  terrain — B3's green units cannot move; the map is the victim and the
  verb is seize.

#### Playtest watchlist

1. **Jack A's path length (7 tiles) / idle round** — if first-run players
   consistently lose Vye blind, move jkA to (13,4) (+1 round); if she's
   never in danger, start at (11,3) (−1).
2. **Cage HP 24** — the crit-proof invariant must survive any jack ATK
   retune (keep HP > 1.65 × (jackATK−2)).
3. **Reinforcement round 5** — if the south flank folds the rescue, push to
   round 6; if turtling wins, add `orWhenMinionsLeq:3`.
4. **Hasp HP 32** — if the lance-snipe road trivializes (Vesper kills him
   r5–6 from (16,4)), raise to 38; do NOT give him regen (doctrine 9: regen
   is phase-2 tech, and he has no phase).

---

### BATTLE 4 — THE UNDERSTACK (MAINLINE, lvl 6)

*Mission id: `understack` → `js/missions/understack.js`.*

#### Premise & fantasy

Beneath the Crossing, the crew fights Keldrin's dig foreman inside the
halo's stripped service-vault, where dug-up Precursor custodians are being
puppeted through a resonator web — and the winning move is to cut the
strings, not smash the puppets.

The player has spent three battles learning that wardens are procedural
muscle. This is the fight where the procedure meets the thing it was
strip-mining: ten-thousand-year-old maintenance machines, woken mid-task,
overdriven as attack dogs. Kharn says it in round one: *"It hunts nothing.
It is CARRYING things. …I will not enjoy this."* The fight is built so the
player gets to agree with him — and profit from it.

#### The ONE twist — mercy as tactics (the puppet web)

Three **RESONATOR PYLONS** stand on the map as destructible objects. Each
pylon drives exactly one **BOUND CUSTODIAN** — a heavy enemy that is
over-doctrine tough on purpose (4 focused hits through DEF 8). Break a
custodian's pylon (2 focused hits, DEF 2, it can't fight back) and the
custodian **goes inert on the spot** — out of the fight, and it stays on
its tile as an untargetable obstacle (mercy literally builds a wall where
it stood). One of the three custodians, randomized per attempt, is
**BRACKET**: when HIS pylon falls he turns green mid-battle and finishes
the fight beside the crew.

Why this forces a decision no previous battle did: every earlier fight's
answer to a scary unit was "focus it down." Here the efficient
neutralization is a *different target in a worse position* — the pylons sit
in vent-tiled galleries under rig fire. The player chooses between
attrition they understand (grind a 30 HP / DEF 8 wall while it deals 11s)
and a positional gamble that removes the same threat for half the turns.
The moral line and the optimal line coincide, and the player who finds it
feels clever, not lectured. No second mechanic is added; the boss phase,
reinforcements, and chasm are all existing switches used as dressing.

#### Objective & win/lose

- **WIN:** kill FOREMAN HULE VESK (standard kill-boss — existing tech).
- **LOSE:** Dax falls (standard).
- Pylons, custodians, and Nima never gate victory — the battle stays
  winnable no matter what the player breaks or loses (doctrine: NPC deaths
  are consequences, not fail states).
- **Bracket is NON-MISSABLE (owner decree):** downing his shell is a
  KNOCKDOWN, never destruction. He joins on victory in every branch. If the
  boss dies while pylons still stand, the web dies with Vesk's
  hand-resonator and all surviving custodians are freed at victory (counts
  as "freed" for Bracket's join line only if his shell was never downed).

#### Why it's fun

Three clocks run at once and they pull in different directions: Nima has
~3 rounds before the cage-hands take her (west/northeast), the custodian
galleries bleed you while their pylons stand (center/south), and the
foreman waits behind a relief shift at the node door (east). You cannot do
all three first. Jolt Prod, Bulwark, and (mid-fight) Mag-Tether are all
body-doctrine buttons and this map is built of doors for them.

#### Threat math

**Party projection at entry.** Projection rule (per doctrine): expected
per-level gains E[HP]≈1.67 (but the HP floor `base+2(lvl−1)` binds on
average, so HP ≈ base+2·(lvl−1)), E[ATK]≈0.62, E[DEF]≈0.45, E[AGI]≈0.62;
floors HP ≥ base+2(lvl−1), ATK ≥ base+⌊(lvl−1)/2⌋. Entry levels: crew
entered Act 2 at ~L4–9 (Dax top). By Battle 4 they have fought lvl-4,
lvl-5, and (optionally) lvl-5 missions; decay throttled the veterans, full
XP fed the low end. Projected entry:

| Unit | Lvl | HP | ATK | DEF | AGI | Notes |
|---|---|---|---|---|---|---|
| DAX | 10 | 26+18=**44** | 11+5.6≈**16** (18 w/ machete) | 6+4.1≈**10** | 8+5.6≈**14** | decayed XP kept him from running away |
| KHARN | 8 | 24+14=**38** | 12+4.3≈**16** | 4+3.2=**7** | 11+4.3≈**15** | |
| GUNNAR-7 | 7 | 34+12=**46** | 10+3.7≈**14** | 9+2.7≈**12** | 4+3.7≈**8** | missed B1 (impounded) |
| JET (if found) | 7 | 20+12=**32** | 9+3.7≈**13** | 4+2.7=**7** | 6+3.7≈**10** | fly, MOV 7 |
| VESPER | 6 | 16+10=**26** | 4+3.1=**7** | 3+2.3=**5** | 7+3.1=**10** | 15 MP; PSY LANCE (pow 14); GRAVITON at L7 may land mid-battle |
| HALE | 5 | 18+8=**26** | 5+2.5=**7** | 4+1.8=**6** | 6+2.5=**9** | 12 MP; AURA learned at L5 |
| HOB | 6 | 29+6=**35** | 9+1.9≈**11** | 7+1.4≈**8** | 7+1.9≈**9** | ratified base, joined L3; three battles of full XP |
| VYE (optional) | ~5 | — | — | — | — | B3 recruit; bonus striker, not counted in core math |

**Focused damage per round** (guaranteed six; one target zone, Hale
healing): vs DEF 5 — Dax 11 (13 w/ machete) + Kharn 11 + Gunnar 9 + Hob 6 +
Vesper PSY LANCE 14 = **~51 theoretical, ~30–38 realistic** (3–4 units can
actually converge on one tile cluster per round). This is the yardstick
every enemy HP below is sized from.

Party HP pool: 44+38+46+26+26+35 = **215** (247 with Jet).

**Enemy pressure.** Realistic peak (rounds 2–4, the gallery crossing): ~5–6
enemies in contact — 2 wardens vs the line (vs Gunnar DEF 12: 2 dmg — the
body-block doctrine visibly works; vs Hob DEF 8: 6), 2 custodians (11 vs
Kharn, 8 vs Hob, 4 vs Gunnar), 2 saw-rigs shard-volleying the MP bars (+22
AI score: 9 vs Vesper, 8 vs Hale). Expected incoming ≈ **28–36 dmg/round ≈
13–17% of pool** — sustainable behind Hale (AURA 7×N + MEND 10 restores
~14–17/round) but any squishy caught in custodian reach dies on doctrine
schedule (see roster table). Pressure PEAKS rounds 2–4, breaks when the
second pylon dies (each freed custodian removes ~11 dmg/round from the
field), then re-spikes briefly at the round-4 relief shift (2 wardens, +18
theoretical).

**The twist's economics (must be true or the battle lies):**

| Path | Target | Focused hits | Unit-turns spent | Return |
|---|---|---|---|---|
| Smash the puppet | Custodian 30 HP / DEF 8 | Dax-grade hit = 8 dmg → **4 hits** | ~4 (≥2 rounds of a flank) | threat removed; wreckage; more XP |
| Cut the string | Pylon 18 HP / DEF 2 | Dax 14 / Vesper lance 14 / Jet 11 → **2 hits** | 2 (and the pylon never hits back) | same threat removed **same instant**, inert shell = free wall, Bracket freed if it's his |

Cost of the mercy path is positional, not attritional: pylon-adjacent tiles
are crystal vents (3 chip at turn end, flyers immune — Jet is the premier
string-cutter and the squishiest thing near a custodian) and both pylon
galleries sit inside saw-rig range. Mercy saves ~2+ unit-turns per
custodian and the player pays for it in exposure, not HP-grind.

**Boss TTK under focus.** Vesk 62 HP / DEF 7: Dax 9 (11 w/ machete), Kharn
9, Gunnar 7, Hob 4, Vesper lance 14, Bracket 2 + tether. Realistic focus ≈
30–32/round; phase 2 (at 50%) adds regen 3 → net ~27–29/round → **TTK ≈ 2.2
focused rounds** after contact (engaged ~round 5–6, dead ~round 7–8). Total
battle length ~7–9 rounds. Pressure, not a slog (rule 9 ✓).

**Squishy lethality check (rule 2).** Vesper 26 HP / DEF 5: custodian 11 →
**3 hits** (2 + one vent tick), boss 10 (12 in phase 2) → **3 (2–3)**,
warden 9 → **3**, saw-rig 8 → 4 (3 with crit). Hale 26/6: custodian 10 → 3,
warden 8 → 4. Exposed squishies die in 2–3 hits from anything heavy. ✓

#### Enemy roster

All "kill it" columns use the Dax-grade hit (ATK 16) as the yardstick;
"kills Vesper" uses her projected 26 HP / DEF 5.

| Name | # | HP | ATK | DEF | AGI | MOV | rng | Class | Boss | Hits to kill it | Hits to kill Vesper |
|---|---|---|---|---|---|---|---|---|---|---|---|
| DIG-WARDEN | 2 | 22 | 14 | 5 | 7 | 5 | 1 | Warden · DIG | — | 2 (16−5=11) | 3 (14−5=9) |
| CAGE-HAND | 2 | 22 | 14 | 5 | 5 | 5 | 1 | Warden · DIG | — | 2 | 3 |
| SHARD-SAW RIG | 2 | 18 | 13 | 4 | 6 | 3 | 2–3 | Warden · ARTY | — | 2 (16−4=12) | 4 (3 w/ crit) |
| BOUND CUSTODIAN | 3 | 30 | 16 | 8 | 4 | 4 | 1–2 | Precursor · HVY | — | **4 via shell / 2 via its pylon** | 3 (16−5=11; 2 + vent) |
| RESONATOR PYLON | 3 | 18 | — | 2 | 1 | 0 | — | Web · OBJ | — | 2 (16−2=14; 1 PSY LANCE + any poke) | n/a (never attacks) |
| FOREMAN HULE VESK | 1 | 62 | 15 (17 p2) | 7 | 6 | 4 | 1–2 | Warden · BOSS | ✦ | ~7 solo / 2.2 focused rounds | 3 (2–3 in phase 2) |

**Every number justified:**

- **DIG-WARDEN 22/14/5/7/5.** HP 22 = exactly 2 Dax/Kharn hits (rule 1).
  ATK 14 makes 3 exposed hits kill Vesper (rule 2) while doing only 2 to a
  Bulwarked Gunnar — the choke doctrine stays visible. MOV 5 / AGI 7:
  competent, uniformed, bored — a step up from Act 1 mooks (skiff ATK 9 at
  lvl 2 → 14 at lvl 6 tracks the party's +5 ATK growth over the same span).
- **CAGE-HAND = same statline, AGI 5.** Deliberately slower than Nima
  (AGI 8): 5×1.2 = 6.0 < 8×0.8 = 6.4, so she is *guaranteed* to flee before
  they move — the chase reads fair, never coin-flippy. Their identity is
  the hunt order, not stats (see the Nima spec for their +45 targeting
  weight).
- **SHARD-SAW RIG 18/13/4/6/3, rng 2–3.** The mission's ARTY (every battle
  needs a reason not to bunch up). HP 18 = 2 hits. ATK 13 → 8 on Vesper: a
  rig alone won't delete her, a rig plus anything will — they exist to tax
  the pylon galleries, not to one-shot. MOV 3: emplaced saws, easily
  outflanked via the north lane.
- **BOUND CUSTODIAN 30/16/8/4/4, rng 1–2.** DELIBERATELY over-doctrine (4
  focused hits) — this is the twist, not a health sponge violation: its
  *real* health bar is the 18 HP pylon on the wall, and the intended path
  kills it in 2. ATK 16 (the act's hardest regular hit — kills Vesper in 3,
  scares everyone) is justified in-fiction: the web overdrives
  ten-thousand-year-old chassis past design spec, which is also why Vesk
  doesn't care if they break. rng 1–2 = rivet-driver arms (same chassis as
  Bracket's class — consistency). AGI 4 / MOV 4: ancient knees; the player
  can kite them, which keeps "just fight all three" survivable-but-slow
  rather than lethal.
- **RESONATOR PYLON 18/—/2/1/0.** HP 18 / DEF 2 = 2 hits from any striker,
  or one PSY LANCE (14) + one poke — the mercy path must be cheap or the
  twist is a trap. MOV 0, no attack (engine-safe: rng never reaches, AI
  idles). AGI 1: clutters no turn. Kill XP +10 keeps string-cutting paid.
- **FOREMAN HULE VESK 62/15/7/6/4, rng 1–2.** HP 62 = ~2.2 focused rounds
  net of phase-2 regen 3 (rule 9: beatable by focus — Vash was 48 at lvl 2;
  62 at lvl 6 is the same ~2-round TTK against the grown party, not a
  scale-up). ATK 15 → 17 in phase 2: kills Vesper in 3 → 2–3, threatens
  Kharn (11/round) but not Gunnar (5). rng 1–2 = the hand-resonator (a
  crude, down-tuned copy of the crown's keying — org-chart continuity:
  pit-boss had a clipboard, foreman has a baton, Keldrin has the crown).

Total 13 units (pylons never act) vs kr7's 9 — turn overhead comparable.

#### Map — 18×13 (kr7.js digit legend)

Legend: `0` vault floor · `1` dig rubble (cost 2, 15% evade) · `2` scaffold/
crate cover (cost 2, 30% evade) · `3` singing glass vein (crystal vent: 3
dmg at turn end, ground only) · `4` excavation drop (void, flyers only) ·
`5` strained gallery floor (sealed seam → void at boss phase).

```
444444444444444444   y0
400000000200000004   y1   ← NORTH LANE (open flank)
401000040003000104   y2   ← P1 gallery (pylon 12,2 · vent 11,2)
400010040000032004   y3   ← C1 at 11,3 · vent 13,3
400002040010000014   y4   ← NIMA starts 14,4; her flight lane
400000040200000104   y5   ← deploy ledge east edge · R1 at 12,5
400000005000003004   y6   ← THE BRIDGE (x7) · seam 8,6 · vent 14,6 · BOSS 16,6
400000005020000004   y7   ← bridge row 2 · seam 8,7 · P2 13,7 · C2 12,7
400010040000300004   y8   ← vent 12,8 · R2 at 11,8
440000040000001444   y9   ← south causeway approach
444440040003002044   y10  ← P3 10,10 · C3 9,10 · vent 11,10
444444444000010444   y11  ← south rim walkway
444444444444444444   y12
```

**Prose key.** The crew enters from the western crack (deploy ledge, x1–3,
y5–8: dax 2,6 · gunnar 3,6 · hob 3,7 · kharn 3,5 · vesper 1,6 · hale 2,7 ·
jet 2,5 · vye 2,8). A void excavation trench runs down x7, split twice:

- **The chokepoint:** the two-tile land bridge at x7, y6–7 — the only
  central ground crossing. Gunnar (or Hob) plugs it while the wardens W1
  (9,6) and W2 (9,8) hold the far mouth. The seam tiles just east of it
  (8,6 / 8,7) collapse at boss phase — the bridge dead-ends into void
  mid-fight, cutting the retreat of anyone who crossed and forcing
  latecomers north.
- **The open flank:** the north lane (y1) crosses the trench top — fast,
  uncovered, and where the AI's flankers and the player's Kharn/Jet race in
  opposite directions.
- **Hazards where you WANT to stand:** every pylon's best attack tiles are
  crystal vents — 11,2 (P1), 12,8 and 14,6 (P2 approaches), 11,10 (P3).
  String-cutters tithe 3 HP per turn-end; Jet flies over it and pays in
  fragility instead.
- **The south causeway** (y9–11, reached only through the east gallery)
  dead-ends at P3/C3 — the mercy path's farthest, riskiest errand, under
  R2's arc from 11,8.
- Vesk (16,6) waits at the node door; reinforcement spawns (16,5)/(16,7)
  flank him. The far east is HIS ground — the player comes to him last.

#### Rescue-NPC spec — NIMA, the shard kid

- **Unit:** side `npc` (green). `HP 16, DEF 3, AGI 8, MOV 4`, no attack.
  Starts **(14,4)** — she followed the song deep; the fight starts because
  the crew did too.
- **Behavior:** FLEE — on her turn she paths toward the deploy ledge tile
  **(2,6)** at MOV 4 (her route: west along y4, around the rubble at 10,4,
  down through the seam tiles, across the bridge — ~4 unaided turns). When
  adjacent to any ally she HOLDS (clings) instead of moving.
- **Hunt-priority weighting (quantified):** the two CAGE-HANDS score Nima
  at **+45 flat** in the aiTurn target loop (on top of the standard terms).
  Worked example at full HP: score vs Nima = (34−16)+45 = **63**; score vs
  a typical bruised MP-bar crew target = (34−26)+22 = **30** — cage-hands
  pick her roughly 2:1 over anything except a 900-score kill-secure on a
  crew member. DIG-WARDENS, saw-rigs, and custodians weight her at **0**
  (the humans do the dirty work; the puppets fight the armed intruders;
  nobody shells a child with a shard saw — tone line).
- **Threatened but savable (the doctrine numbers):** cage-hands start at
  (16,2) and (16,8). Her guaranteed-first AGI means she always moves before
  them. H1's first possible hit is **round 2** (round 1 the gap is 7 >
  MOV+rng 6); H2 intercepts at the bridge mouth ~round 3. She dies in **2
  hits** (14−3=11 vs 16 HP) → earliest fail-state is **end of round 3** if
  the crew does nothing. Counterplay arrives on time: Jet (fly, MOV 7)
  reaches her lane on round 2, Kharn (MOV 6, north lane) round 2 — one
  body-block plus 2 focused hits on a 22 HP cage-hand ends the chase.
  EXTRACTION cannot swap her (ally-only) — deliberate; the rescue must be
  positional.
- **Fail-state (owner decree — never on-screen child death):** her HP
  reaching 0 from ANY source = **`nimaStruck`** — the shard-net arcs, the
  web answers, and she drops, ring-struck: alive, glassblind, silenced. Her
  sprite sits collapsed (untargetable) for the rest of the battle. The
  battle log says exactly one line and moves on.
- **Reward on save (alive at victory):** `nimaSaved`. She sings the
  counter-phrase; the node chamber unseals *gently* — the act's ending
  keeps its light. Town: she's the quiet miracle. (Planted per Open
  Question 3: a saved Nima is positioned to be the Act 3 MYSTERIOUS TREAT
  giver — Erik's ruling pending; nothing in this battle hard-commits it.)
- **Permanent consequence on loss:** `nimaStruck` persists. The chamber is
  BLASTED open in the win dialog (same door, worse key), the act's ending
  runs a shade darker, her town dialog becomes "…", and the Crossing dims.
  The battle remains fully winnable.

#### BRACKET — the conversion, the knockdown, the two join lines

- **Slot:** one of the three BOUND CUSTODIANS is Bracket, **randomized at
  battle start** (`bracketSlot:'random'`) — replay variance, and it means
  the mercy incentive covers all three shells (you can't spare "just the
  recruit").
- **Conversion (canon, mid-battle):** the instant HIS pylon dies while his
  shell stands, he turns **green→ally** on the spot, keeps his tile, joins
  the queue next round. Banner: `✦ STRINGS CUT ✦`.
- **Ally statline (joins at L6, the mission level):** `maxhp:36, atk:9,
  def:9, agi:3, mov:4, rng:[1,2]` — Ringwright · RIG, special
  **MAG-TETHER** (once per battle: yank one enemy within 3 tiles adjacent
  and pin it — it cannot move on its next turn). Gunnar-adjacent HP/DEF,
  lower ATK, low AGI, MOV 4, per section 5. The ATK drop from his puppet
  form (16→9) is story-true: freed, he throttles back to design spec — the
  web was burning the shells out, which is why smashing them was always the
  villain's plan for them too. *(This line is LOCKED — Battle 5's Bracket
  projection derives from it.)*
- **Knockdown, not destruction (NON-NEGOTIABLE owner constraint):**
  Bracket's shell carries a `nonlethal` flag — at 0 HP it COLLAPSES (no
  pixel-shatter death, no kill animation): sprite slumps, out of the queue,
  untargetable. Normal kill XP is paid (the player must never be punished
  for not knowing). He still joins at victory in every branch.
- **The other two custodians:** downed before their pylon breaks = wrecked
  (normal death). Standing when their pylon breaks (or when Vesk dies) =
  freed → **inert**: out of the queue, untargetable, but LEFT ON THE TILE
  as an obstacle — a spared custodian is a wall exactly where a wall was
  useful.
- **Spare reward:** if both non-Bracket shells end the battle un-wrecked →
  `custodiansSpared`: in the victory chain the freed custodians pry open a
  Precursor service cache — **120₡ + 2 Repair Spray** — and afterward stand
  watch at the Understack gate (town examine texture). Modest on purpose;
  the tactical economics already pay for mercy.

#### Config (existing switches + new keys)

```
lvl: 6,                      // XP decay yardstick — Act 2, battle 4
config:{
  storm: false,              // interior vault — no sky. Variance comes from
                             // the random Bracket slot + reinforcement timing.
  reinforcements:{           // existing switch — "the relief shift"
    count:2, onRound:4, orWhenMinionsLeq:3,
    spawns:[[16,5],[16,7]],
    unit:{ DIG-WARDEN statline },
    bark:'FOREMAN VESK: "Relief shift, down the ladder! You\'re all on overtime!"'
  },
  bossPhase:{                // existing switch — chasm reused as dressing only
    at:0.5, regen:3, atk:2, openChasm:true,   // seams 8,6 / 8,7 → void
    banner:'▼ THE WEB SCREAMS ▼',
    logIntro:'▼ Vesk cranks the hand-resonator past its stop — the strained gallery floor lets go.',
    logBuff:'▼ The web feeds back through him. ATK +2, +3 HP/turn. Cut him off before he re-tunes.',
  },
  // ——— NEW (this battle) ———
  npcs:[{ id:'nima', x:14, y:4, maxhp:16, def:3, agi:8, mov:4,
          behavior:'flee', fleeTo:[2,6], clingRange:1,
          onDown:'nimaStruck', huntWeight:45, huntedBy:['h1','h2'] }],
  web:{ links:{p1:'c1', p2:'c2', p3:'c3'},   // pylon → custodian
        bracketSlot:'random',                // c1/c2/c3, rolled at start
        onBossDeath:'freeAll' },             // web dies with the resonator
}
```

#### Dialog sketches (warm, wry, melancholy)

**Briefing:** `THE UNDERSTACK — kill Foreman Vesk. The pylons drive the
custodians: break a pylon and its puppet stops. Nima is down here. One ✦
special per crew member.`

**Intro — FOREMAN HULE VESK** (theatrical and specific; he talks tonnage
and acoustics, never evil):
1. "Stop drilling. STOP DRILLING. …Visitors. Nobody invoiced visitors."
2. "You're standing in the Ringwarden's basement, friends. Everything down
   here is on a manifest — the glass, the diggers, the antiques. The ECHO
   is billable. You? You're a discrepancy."
3. "Wardens: the little singer goes in the soft crate — upstairs wants her
   tuneable. The rest are arrears. Wake the antiques and have them carry
   the pieces out."

**Round-1 log (first custodian swing):** KHARN: "It hunts nothing. It is
CARRYING things. …I will not enjoy this."

**First pylon falls (log):** `▸ The pylon dies mid-note. The custodian
sags — sets down an armful of rubble it has been holding for ten thousand
years — and is still.`

**Bracket's pylon falls (mid-battle scene):**
- BRACKET: "ORDER SOURCE: lost. …Lost is acceptable. Lost is QUIET."
- BRACKET: "TASK: assist the string-cutters. Assigning self. It is good to
  be assigned."
- `✦ BRACKET fights beside you.`

**Nima struck (log, one line, move on):** `▸ The net arcs. Nima folds up
small, eyes full of ring-light. She is breathing. She is not singing.`

**Win — Vesk (dying, wry-melancholy):** "Fourteen years of manifests.
Balanced to the gram. …He never learned my name, you know. I invoiced him
WEEKLY."

**Win — Bracket joins, freed gently (shell intact):**
- BRACKET: "SHELL: intact. CHAINS: broken by intention, not accident. This
  is new. Ten thousand years, and it is new."
- BRACKET: "TASK: follow. Self-assigned. It is good to be assigned. It is
  better to be asked." `✦ BRACKET joins the force.`

**Win — Bracket joins, shell smashed (grievance log, still joins):**
- BRACKET: "DAMAGE REPORT: dents, seventeen. GRIEVANCE: filed. RESOLUTION:
  I will walk it off in your service."
- BRACKET: "You free things the way you salvage things — loudly. Logged.
  Next to the thanks." `✦ BRACKET joins the force.`

**Win — Nima saved:** she doesn't speak; she sings one clean phrase and the
node door opens like an eye going wide. HALE: "Ten thousand years, and it
still knows a kind voice when it hears one."

**Win — Nima struck:** Hale carries her up the spoil-road; nobody talks.
Dax sets Vesk's own blasting charges against the node door. VESPER: "It
should've been a song."

**Lose text:** `Dax falls in the Understack. Overhead, unaware, the
Crossing keeps humming the tune that dug its own grave.`

#### Mission lvl & XP feed

- **`lvl: 6`** (Act-2 battles run 4/5/5/6/7; 6 is the assigned yardstick
  from the battle index).
- **Who it feeds:** full XP to **Vesper (L6)**, **Hale (L5)**, **Hob
  (L6)**, **Kharn (L8)**, and Gunnar/Jet (L7). Dax (L10, gap 4) earns
  ~79% — the governor working as designed. This is deliberately Vesper's
  and Hale's battle: pylons are PSY LANCE math (14 vs 18 HP), custodian
  chip damage is sustained heal-parity income (AURA cap 10 ×2–3 targets),
  and Vesper likely hits **L7 mid-battle — GRAVITON lands as an event**
  during the boss push. Bracket joins at L6 and earns from the fight's back
  half.

#### FE / Stargate flavor notes

- **Fire Emblem:** the classic "the strongest enemy on the map is the one
  you mustn't kill" recruit tension, but solved the Nebula Force way — no
  talk-command, no unit-whisperer: you recruit Bracket with *terrain
  destruction*, which is body-doctrine to the bone. Nima is the
  protect-the-green-unit set piece; the cage-hands' explicit written orders
  are the FE "named enemies with a job" trick that makes AI weighting read
  as characterization.
- **Stargate:** the whole act is small-man-wearing-god-plumbing; this
  battle is the boiler room of the lie. The custodians are the abandoned
  maintenance staff of the "gods" — the miracle's janitors, still clocking
  in. The foreman is the guy who found the staff room and started renting
  out the staff. Breaking the strings instead of the puppets is the act's
  thesis scaled down to one fight: the machinery was never the enemy; the
  hand on the dial was.
- **Tone guard:** the fail state is glassblindness, not death; no child
  takes a battle-scene hit animation — the net arcs off-frame in one log
  line.

#### Replay variance & uniqueness check

**Variance:** Bracket's slot rerolls each attempt (the mercy order
changes — which gallery you hit first matters differently every run);
reinforcements fire on round 4 OR minions ≤3 (aggressive play pulls them
early); hidden turn-order variance decides whether the cage-hands or Nima's
rescuers win their races; two viable openings (bridge push vs north-lane
flank) with the phase-2 collapse punishing them differently.

**Uniqueness, one line per prior mission:**
- **Sump (A1-B1):** open-field fauna kill-boss — no objects, no NPCs, no
  web.
- **Shaft Nine (A1-B2):** wave-pressure tunnel fight — the Understack's
  signature is target-selection economics, not reinforcement attrition.
- **KR-7 (A1-B3):** storm + chasm spectacle — no storm here; the chasm
  returns only as phase dressing on a fight about strings.
- **Tithe Night (A2-B1):** survive-N-rounds with the green-unit debut —
  this is kill-boss; Nima FLEES cross-map (Dasha held a post), and the new
  idea is mercy-economics, not endurance.
- **Glass Fields (A2-B2):** escort through neutral chime-terrain — pylons
  are enemy-side OBJECTS that drive units; nothing escorts, strings break.
- **Tithe-Pit (A2-B3):** seize-the-gate against a schedule — no timer here;
  the Understack's pressure is spatial (three galleries), not temporal.

#### Playtest watchlist

1. **Custodian DEF 8** — if players report "I just killed them all and it
   was fine," raise to 9 (5 focused hits) or drop pylon HP to 14; if "the
   custodians felt unkillable and I panicked," lower their ATK to 15 first,
   DEF second — the fear should stay, the wall shouldn't.
2. **Cage-hand start tiles (16,2)/(16,8)** — the Nima clock. Struck too
   often: move H2 to (16,9) (+1 round). Trivially saved: swap H1 to (15,2).
   Tune tiles before stats; her HP 16 / their AGI 5 are load-bearing
   guarantees (2-hit fail, she always flees first).
3. **Vesk HP 62 / regen 3** — TTK is tuned at 2.2 focused rounds; if the
   relief shift makes the last stand grindy, cut reinforcements to count:1
   before touching his HP.

---

### BATTLE 5 — THE RINGWARDEN (MAINLINE finale, lvl 7)

*Mission id: `ringwarden` → `js/missions/ringwarden.js`. Kill-boss, phased.*

#### Premise & fantasy

Voss Keldrin stops being a tax office and keys the halo itself — and the
crew fights him inside a ten-thousand-year-old instrument that is now
playing BOTH of them, on a schedule everyone can read and nobody controls.

The node chamber: a cathedral hollow beneath the Crossing, cracked open in
Battle 4. The Halo Heart hangs in its cradle above the east dais. The three
rings answer through the roof-crack — cyan, magenta, lime — and every round
the node turns one key. Keldrin rides the cycle because he must; the crew
learns it because they can. That's the fight: the boss has power he can't
put down, the player has a song they can count.

#### The ONE twist — the three keys (ring-cycle rounds)

Every round, at the round banner, the node turns one key. Fixed order —
**CYAN → MAGENTA → LIME → repeat** — it's an instrument; notes come in
sequence. The **starting key is random per playthrough** (replay variance).
The current key is shown three ways, zero bookkeeping: the round banner
(`▼ CYAN KEY ▼`), a full-chamber tint, and the conduit tiles on the floor
glowing that color. The log adds one line: *"The node turns CYAN. MAGENTA
follows."* After two rounds the player knows the whole song.

Each key changes exactly ONE battlefield rule, for that round, **for both
sides** — the instrument plays the player AND the boss, which is the act's
moral in mechanics form:

| Key | Rule | Reads as | The decision it forces |
|---|---|---|---|
| **CYAN — the Reaching Key** | Every ranged attack and spell gains +1 max range (units/spells with max rng ≥ 2; melee rng 1 unaffected) | "Everything shoots farther" | Lancers hit at 4, Keldrin's arcs at 3 — hug cover and close, OR unload: Vesper's GRAVITON reaches 4, Bracket's rivets reach 3. Cyan is the artillery duel round. |
| **MAGENTA — the Sealing Key** | ALL healing halved, round up: MEND/MEND II, AURA, battle items, and **boss regen**. (CRYO-CALL exempt — it's a revive, not a heal.) | "Heal numbers come up half" | Don't plan to out-heal a magenta round — but Keldrin's crown-regen is halved too. Magenta is the burst-the-boss round. |
| **LIME — the Waking Key** | The glass conduit tiles (new terrain, the lit lanes on the floor — see map) sting: 3 dmg at turn end to any ground unit standing on one (flyers immune, same code path as vents) | "The bright lanes bite" | The conduits are the best ground in the room — the direct lane, the gate bridge, the entire firing ring around the dais. Every third round that ground is priced. Clear it, pay it, or time your push. |

Why it's different from the last battle (and every battle): B4's twist was
mercy-as-tactics (break strings, not puppets); B3's was a doom-schedule the
player races; B2's was terrain the player strikes. The Keys are a **rule
clock**: nothing to attack, nothing to save, nothing to outrun — a rhythm
to plan around. It's the first mission where the *tempo itself* is the
terrain.

Numbers justification: +1 range is the smallest legible reach change and
needs no new UI (existing range highlight just draws bigger).
Heal-halving is visible in the numbers the game already floats. The lime
tick of **3** matches the crystal-vent hazard the player has known since
Act 1 — a known price on a new schedule, tuned to sting (3 ≈ 11% of
Vesper's 28 HP) without forbidding the lane.

#### Objective & win/lose

- **WIN:** kill-boss — Voss Keldrin dies, the battle is won (existing
  `boss:true` win check).
- **LOSE:** Dax falls (existing check).
- No green units, no side objective, no timer — the act has spent four
  battles protecting people; the finale is the one fight with nothing to
  protect but each other (section 6, explicit). The clean duel is earned.

#### Why it's fun (the decisions, named)

1. **The gate puzzle:** three lanes, two walls, and four answers the player
   already owns (spell it down, Riftbreak it, MAG-TETHER it out of its own
   doorway, or fly past) — plus a fifth if they're patient: lime softens
   it.
2. **The song:** a 3-beat plan the player composes — shelter on cyan, burst
   on magenta, clear the lanes on lime — against a boss whose regen and
   reach ride the same beats. Learnable in 2 rounds, mastered by round 5.
3. **Two pressure peaks the player can see coming** (gate crush R3, phase +
   backstab R5–6) and one they schedule themselves (the dais assault, on
   whichever key they choose).
4. **Every special has a stage:** Bulwark holds the bridge, Tether feeds
   it, Jolt Prod buys the healer one round, Extraction/Blink steal tile
   (17,6), Ring Flare blanks a cyan volley, Cryo-Call pays for the mistake,
   Rush + Riftbreak close the show.

#### Threat math

**Projected roster at Battle 5 entry.** Per the projection doctrine: base
stats from `characters.js` + E[HP]≈1.67 (HP floor base+2·(lvl−1) dominates,
so HP ≈ base+2·(lvl−1)), E[ATK]≈0.62, E[DEF]≈0.45, E[AGI]≈0.62 per level.
Act 2 exit band is L9–12; entering the finale:

| Unit | Lvl | HP | ATK | DEF | AGI | Notes |
|---|---|---|---|---|---|---|
| DAX | 10 | 44 | 17 (19 w/ machete) | 10 | 14 | RIFTBREAK ≈ 21–23 sure-hit once |
| KHARN | 9 | 40 | 17 | 8 | 16 | LUNAR RUSH = one extra full turn |
| GUNNAR-7 | 9 | 50 | 15 | 13 | 9 | BULWARK holds the gate |
| JET (if found) | 8 | 34 | 13 | 7 | 10 | fly — ignores the void pits |
| VESPER | 7 | 28 | — | 6 | 11 | ~14 MP → 2× GRAVITON (19–22, ignores DEF) or 3× PSY LANCE (14–17) |
| SISTER HALE | 7 | 30 | 9 | 7 | 10 | ~12 MP; MEND 10–12, AURA 7×n |
| HOB | 7 | 37 | 11 | 9 | 9 | ratified base (join L3) — see consolidation notes. JOLT PROD = deny one enemy turn once |
| BRACKET | 7 | 38 | 10 | 9 | 4 | rng 1–2, MOV 4 — derived from B4's LOCKED join line (L6: 36/9/9/3) + one level |
| VYE (if found) | 7 | ~24 | ~14 | ~5 | ~12 | MOV 6 skirmisher; RING FLARE denies attacks once (kit pending Open Question 9) |

Guaranteed 7 deploy (no Jet, no Vye): **party HP pool 267** (325 with
both).

**Party focused output (sizes the boss).** Per-hit dmg = max(1, ATK−DEF)·
(0.9–1.1). Vs boss DEF 8: Dax 9 (11 w/ machete), Kharn 9, Gunnar 7, Hob 3,
Bracket 2 (from range 2, safely), Vesper GRAVITON ~20.5 flat. A realistic
engaged focus round (Dax+Kharn+Gunnar+one cast) ≈ **32–38 dmg/round**;
specials ceiling (Riftbreak 21 + Rush extra turn + Graviton 22) ≈ **50+ one
time**. This is the Act 1 doctrine number (20–25) grown one act —
recomputed, not trusted.

**Boss TTK under focus (doctrine rule 9).** Keldrin **68 HP, DEF 8; phase 2
at 50%: +2 ATK, regen 4** (regen only in phase 2, per rule 9 — and MAGENTA
halves it to 2, so effective regen is 4/4/2 across the song ≈ 3.3/round).

- Engage ~round 3–4 (gate cleared). Round A: 68 − ~32 → ~36 → **phase
  fires**.
- Round B: 36 + 4 − ~32 → ~8. Round C: dead. **TTK ≈ 3 focused rounds**; a
  specials burst compresses to 2.
- Slow-grind check: even a weak 2-attacker dribble (~18/round) nets
  +14/round over regen → ~5–6 rounds, never stuck. Regen 4 is under ANY two
  melee hits. Pressure, not slog. ✓

**Enemy damage per round vs the pool (when pressure peaks).** Realistic
connect rates (8% base miss + land effect, gate limits contact to ~5–6
enemies at once):

- **R1:** approach, no contact (nearest enemies 5–7 tiles). Player reads
  key #1.
- **R2:** skycutters cross the voids into the flanks (~2×9 vs mid/backline)
  + glassguards meet the van (~2×3 vs tanks) ≈ **24 dmg**.
- **R3 — PEAK ONE:** gallery wardens arrive (4×7 avg vs mixed DEF) +
  lancers in range (2×9, +1 reach if cyan) + skycutters ≈ **45–55
  potential**, ~17–20% of the 267 pool. Hale sustains 10–14/round + items —
  a deficit that forces triage, exactly doctrine rule 2's "losses are a
  cost, not a failure."
- **R5–6 — PEAK TWO:** phase 2. Keldrin at ATK 19 (11–13 per hit on
  squishies, 2–6 on tanks) + 2 reinforcement wardens dropping BEHIND the
  line onto the backline + surviving lancers ≈ **~40 on a thinned pool**,
  and if it lands on a magenta round your heals are half. That's the
  designed darkest moment; the song says which round it will be.

**Exposed-squishy check (doctrine rule 2).** Vesper 28 HP / DEF 6: warden
hit 10 → **dead in 3**; Keldrin 11–13 → **dead in 2–3**; lancer + lancer +
skycutter all reaching her on a cyan round = 27 avg → one bad round. Hale
30/7: 3–4 line hits, 3 from the boss. On doctrine (finale squishies have
grown; the boss and focus-fire keep them honestly killable — and lancer AI
already scores +22 for MP bars).

#### Enemy roster (every number justified)

New enemy TYPE this battle: **GLASSGUARD** — custodian-chassis shells
Keldrin's smiths armored in ring-glass. Empty. No mind, no strings — so no
conflict with B4's mercy theme; nothing is being puppeted, and nothing is
owed mercy. Role no existing enemy fills: a true high-DEF wall (Act 1's
bruisers were DEF 6). Counter the player already owns: three DEF-ignores
(RIFTBREAK, PSY LANCE, GRAVITON) plus MAG-TETHER, which yanks the wall out
of its own doorway. Needs one new text-grid sprite (PAL colors: glass teals
over warden slate). Wardens/lancers/skycutters reuse-recolor the Act 2
warden sprite family from B1–B4 (dependency flagged in Engine Needs).

| Enemy | # | HP | ATK | DEF | AGI | MOV | rng | Class | Boss | Hits to kill IT | Hits to kill VESPER |
|---|---|---|---|---|---|---|---|---|---|---|---|
| OATHED WARDEN | 4 (+2 reinf.) | 26 | 16 | 6 | 8 | 5 | 1 | Warden · OATH | — | 2–3 (Dax/Kharn 11/hit) | 3 (10/hit) |
| WARDEN LANCER | 2 | 22 | 15 | 5 | 7 | 4 | 2–3 (2–4 cyan) | Warden · ARTY | — | 2 (12/hit) | 3–4 (9/hit) |
| SKYCUTTER | 2 | 22 | 15 | 4 | 7 | 6 fly | 1 | Warden · FLY | — | 2 (13/hit) | 3–4 (9/hit) |
| GLASSGUARD | 2 | 26 | 14 | 10 | 4 | 3 | 1 | Warden · WALL | — | 2 with a keyed answer (Graviton ~20 + any hit; Riftbreak 21+7); 3–4 by plain iron | 4 (8/hit — but MOV 3 rarely reaches her) |
| VOSS KELDRIN, THE RINGWARDEN | 1 | 68 | 17 (19 p2) | 8 | 8 | 4 | 1–2 (1–3 cyan) | Ringwarden · BOSS | ✦ | ~3 focused rounds (see TTK) | 3 → 2–3 in phase 2 |

**Justifications, row by row:**
- **Oathed Warden (the ones who stayed when Brand ran):** ATK 16 = kills
  Vesper in exactly 3 exposed hits (rule 2) while reading as 3 dmg vs
  Gunnar's DEF 13 — the tank tanks. HP 26 = 2–3 focused hits at party ATK
  17 (rule 1). AGI 8 < most crew (crew acts first, doctrine 3/4). MOV 5
  makes the north gallery flank a real 2-round threat.
- **Warden Lancer:** the reach threat that makes CYAN scary. ATK 15 (9 vs
  Vesper — they focus-fire MP bars per existing AI). HP 22/DEF 5 = 2
  focused hits: artillery dies fast when reached, so reaching it is the
  play.
- **Skycutter:** the open-flank exploiter — flies the void pits straight at
  the backline round 2. Stats one notch under kr7-era skiffs' role: dies in
  2, kills Vesper in 3–4, AGI 7 < Kharn 16 (wings buy MOV, not initiative).
- **Glassguard:** the gate puzzle. DEF 10 means plain iron does 4–7; the
  point is to make the player spend a key answer (spell, Riftbreak, tether,
  or a lime tick softening it). Only 2 exist and both stand at the
  chokepoint — a wall, not a sponge (rule 1 honored via the 2-hit spell
  line). ATK 14 = 1 dmg vs bulwarked Gunnar: Gunnar mocks them, correctly.
  MOV 3: once the gate falls they never catch the war.
- **Keldrin:** HP 68 = 3 focused rounds at projected output (rule 9 shape:
  Vash was 48 vs 20–25/round; Keldrin is 68 vs 32–38). DEF 8 keeps every
  crew member ≥ 1 dmg and the mid-liners meaningful. ATK 17→19 = the 2–3
  exposed-hit killer of squishies the finale deserves. rng 1–2
  (crown-keyed glass arcs) so he threatens a ring, and CYAN stretches him
  to 3 — the boss is scariest on the round the player can predict. AGI 8:
  mid-queue, reshuffled — sometimes he plays before your healer. MOV 4: he
  leaves the dais and marches down his own conduit, lit by each key in
  turn (the AI will do this on its own; it is also correct drama).

Enemy total: 11 on map + 2 reinforcements = 13 vs 7–9 crew (kr7 ran 9 v 6).

#### Map — THE NODE CHAMBER (18×13)

Legend (kr7 style): `0` chamber floor · `1` glass rubble (cost 2, 15%
evade) · `2` dig machinery cover (cost 2, 30% evade) · `3` resonant vent
(3 dmg turn end) · `4` void — the Understack drop / floor lost in B4
(flyers only) · `9` **GLASS CONDUIT (NEW):** cost 1, 10% evade, lit in the
current key's color; 3 dmg at turn end during LIME only.

```
        x0.......x5........x11......x17
  y0    4 4 1 0 0 0 0 0 0 0 0 0 0 4 4 0 1 4     ← north gallery (OPEN FLANK)
  y1    4 1 0 0 0 0 0 0 0 0 W 0 0 W 0 0 0 4
  y2    4 0 0 0 0 0 0 4 4 0 0 0 2 0 0 0 0 4
  y3    1 0 0 0 0 0 0 4 4 K 0 0 0 0 0 0 0 1     ← north void pit x7–8
  y4    0 0 k 2 0 0 2 4 4 0 0 0 0 0 0 3 0 1
  y5    1 v 0 G 0 0 0 g 0 0 3 0 L 9 9 9 9 1     ← GATE row (x7–8)
  y6    0 V D B 9 9 9 9 9 9 9 9 9 9 9 9 O 0     ← conduit nave → dais → BOSS
  y7    1 H 0 h 0 0 0 g 0 0 3 0 L 9 9 9 9 1     ← GATE row (x7–8)
  y8    0 0 j 0 0 0 2 4 4 0 0 0 0 0 0 3 0 1
  y9    1 0 0 0 0 0 0 4 4 K 0 0 0 0 0 0 0 1     ← south void pit x7–8
  y10   4 0 0 0 0 0 0 4 4 0 0 0 2 0 0 0 0 4
  y11   4 1 0 0 0 1 0 0 0 0 W 0 0 W 0 0 0 4     ← south gallery (rubbled, slow)
  y12   4 4 1 0 0 0 0 0 0 1 0 0 0 4 4 0 1 4
```

Raw rows (mission-file ready, 18 chars each — unit letters above are
overlays on these tiles):

```
441000000000044014
410000000000000004
400000044000200004
100000044000000001
000200244000000301
100000000030099991
000999999999999990
100000000030099991
000000244000000301
100000044000000001
400000044000200004
410001000000100004
441000000100044014
```

**Deploy table (west):** dax (2,6) · kharn (2,4) · gunnar (3,5) · hob (3,7)
· vesper (1,6) · hale (1,7) · bracket (3,6, if `bracketJoined` — a machine
standing on the service line his masters laid) · jet (2,8, if found) ·
vye (1,5, if found).

**Enemies:** g GLASSGUARD (7,5) and (7,7) — plugging two of the gate's
three lanes · L LANCER (12,5) and (12,7) — covering the gate exit · W
OATHED WARDEN (10,1), (13,1) north gallery, (10,11), (13,11) south gallery
· K SKYCUTTER (9,3), (9,9) — perched over the void pits · O VOSS KELDRIN
(16,6), on his own conduit, under the Heart.

**Prose key — the terrain argument:**
- **Chokepoint:** the void pits (x7–8, y2–4 and y8–10 — floor that fell
  into the Understack when B4 cracked the chamber) pinch the nave to a
  **3-wide land bridge at x7–8, y5–7**, and the middle lane of that bridge
  is conduit. Two glassguards stand in it. Gunnar + Hob + Bracket are
  exactly three bodies: holding the bridge is a formation the roster
  teaches. On LIME rounds the bridge's center lane bites — the chokepoint
  you want is priced every third round.
- **Open flank:** the **north gallery (y0–1)** runs the full width with
  zero cover — fast, naked ground. Two wardens start on it and the AI will
  run it at your deploy zone; skycutters simply cross the pits. The south
  gallery mirrors it but is rubbled (cost 2) — the slow flank.
- **Hazards where the player WANTS to stand:** the vents at (10,5)/(10,7)
  are the first covered-arc rally tiles east of the gate — the natural
  regroup spots. The vents at (15,4)/(15,8) and the entire conduit firing
  ring around the dais — (13–14, y5/y7), (14,6), (15,5)–(15,7), and three
  of the boss's four melee tiles — are the best attacking ground in the
  room, free two rounds in three, 3-a-turn on lime. (17,6), behind the
  boss, is the one free melee tile: Jet's EXTRACTION or Vesper's BLINK
  earns it.
- **Keldrin's dais (x15–17, y5–7):** conduit-ringed, vent-flanked, the
  Heart drawn hanging above (cosmetic). He takes lime ticks standing in his
  own light — the instrument plays the boss, literally; the AI will flinch
  him off the lanes on lime rounds, which reads as exactly what it is.

#### Rescue-NPC spec

**None — deliberate and per the premise.** Section 6, Battle 5: *"the
finale is the one fight with nothing to protect but each other."* Four
battles of green units (Dasha, Fen, the cages, Nima) earn the clean duel; a
fifth escort would dilute the act's structure and the finale's focus. The
only "protection" mechanic present is the roster itself (CRYO-CALL, RING
FLARE, JOLT PROD — the player protects the crew).

#### Config (existing switches + the one new ask)

```js
config:{
  storm:false,              // indoors — the first quiet sky since KR-7; the chamber IS the event
  ringCycle:{               // *** NEW ENGINE FEATURE — the twist (see Engine Needs) ***
    order:['cyan','magenta','lime'],
    randomStart:true,       // replay variance: which key opens the song
    // cyan: +1 max rng (units & spells with max rng>=2), both sides
    // magenta: all heals halved incl. items & regen (CRYO-CALL exempt), both sides
    // lime: TERRAIN[9].hazard = 3 for the round (both sides; flyers immune)
  },
  reinforcements:{          // existing tech — phase-2 pressure from BEHIND the line
    count:2, onRound:5, orWhenMinionsLeq:4,
    spawns:[[5,1],[5,11],[9,1],[9,11]],
    unit:{name:'OATHED WARDEN', spr:'warden', cls:'Warden · OATH',
          maxhp:26, atk:16, def:6, agi:8, mov:5},
    bark:'KELDRIN: "The choir is NOT excused."'},
  bossPhase:{               // existing tech — NO chasm (that was KR-7's signature)
    at:0.5, regen:4, atk:2, openChasm:false,
    banner:'▼ THE CROWN ANSWERS ▼',
    logIntro:'▼ Keldrin claws at the crown — and stops fighting it. The light goes THROUGH him.',
    logBuff:'▼ Something far away is holding him upright. ATK +2, +4 HP/turn. It is not generous — halve it on MAGENTA and put him down.',
  },
},
```

Timing note: `onRound:5` lands the reinforcements at the projected phase-2
round; `orWhenMinionsLeq:4` catches speedrunners early. Spawns drop wardens
in the galleries **west of the gate** — behind the player's push, on the
healer. Regen 4 vs 32–38 focus obeys rule 9 (and MAGENTA's halving gives
the player a rhythm answer to it, which no previous boss offered).

If `bracketJoined`, one scripted, mechanics-free beat at round 2 (see
Engine Needs): banner `▼ THE CROWN SPEAKS ▼`, log: *"UNIT BRACKET: RESUME
ASSIGNMENT."* / BRACKET: *"TASK: declined. I am assigned."* — the crown
tries to order him, once, and fails, per section 6.

#### Dialog sketches (warm, wry, melancholy — Vash doctrine: acoustics and accounting, never evil)

**Briefing:** `Node chamber — protect Dax, bring down the Ringwarden. The
node turns one key per round: CYAN reaches, MAGENTA seals, LIME wakes the
lanes. Watch the light. One ✦ special each.`

**Intro (VOSS KELDRIN):**
1. "Ten years of collections. Chit by chit, week by week, and the
   instrument never once said THANK you. So tonight I stop collecting FOR
   it."
2. "Do you know what a ring is, salvager? An instrument that cannot stop
   playing. I used to ask it to play quieter. Now I only ask it to play
   what I'm OWED."
3. "It was supposed to be a LEDGER. A ledger of lights. It just wants
   someone to HOLD it — and I am so tired of holding it. Wardens: the tally
   stands at everything. Collect."

**Phase 2:** config lines above — the crown holds HIM up now.

**Win sequence (post-battle cutscene, main.js/cutscenes.js — sketch):**
- Keldrin, on his knees, the crown guttering: "Take it. TAKE it. It never
  stops — nine years, it never once—" *(Dax, quietly: "Ten. And I did nine
  somewhere worse, standing up.")* The crown CRACKS down the middle.
- The cradle opens. The HALO HEART comes free into Dax's hand — and the
  relic in his pack answers. **One chord.** Every window in the Crossing,
  far above, goes ring-colored for a breath.
- Through the dying crown — not to Keldrin, not to anyone in the room — one
  line, patient, with no distance left in it: **"WE HEAR YOU SINGING. SING
  ON."** Then nothing. The rings overhead go back to being weather.
- KHARN, ears flat, sniffing the dead crown: "It is quiet." DAX: "No.
  It's listening." *(→ festival, epilogue, `relicTwo`, `storyStage 6`.)*
- Keldrin lives — small again, crownless, left to the town he taxed. Ceril
  gets to un-pay him one receipt at a time. (Erik's call — see Open
  Questions; the map kill can read as the CROWN's death.)

**Lose text:** `Dax falls beneath the node chamber. Overhead the rings play
on — cyan, magenta, lime — for no one at all.`

#### Mission lvl & XP feed

**`lvl: 7`** — the doctrine formula gives 3×1+5 = 8; the battle index fixes
Battle 5 at **7** (the act runs lvl 4–7), and 7 is correct against the
projection: decay (gap ≥ 4) starts at L11, so **every projected crew member
earns full XP here** — this battle feeds the whole force, and especially
the catch-up tier: **Vesper, Hale, Hob, Bracket, Vye (L6–7)** level fastest
(benched-crew catch-up doctrine); Kharn/Gunnar (L9) and Dax (L10, gap 3)
still draw full rate. Likely on-screen event: Vesper reaching **L7 →
GRAVITON mid-battle**, in the fight where it matters most. A boss-regen
farmer gets throttled by the same decay within a level or two —
self-limiting, as designed.

#### Replay variance & uniqueness check

**Variance:** random starting key — three different openings (lime-start
prices the approach lanes immediately; cyan-start lets the lancers reach
the gate's west mouth round 2; magenta-start is a quiet first verse and a
louder third); turn order = AGI × rand(0.8–1.2) every round — Keldrin at
AGI 8 sometimes plays before your healer; reinforcements arrive round 5 OR
at ≤4 minions — fast players pull them early; roster composition varies —
Jet (Act 1 cruelty), Vye (B3 window), Bracket (B4) change the whole
approach (no flyer = the pits are real walls); AI target selection + the
8%-crit economy do the rest.

**Uniqueness, one line per previous mission:**
- **Sump (A1B1):** open fauna swarm, recover-Jet field — B5 is an indoor
  phased boss duel with a rule clock; nothing shared.
- **Shaft Nine (A1B2):** tunnel waves vs Excavator Prime — B5's
  reinforcements are one flanking drop, not waves, and the twist is tempo,
  not attrition.
- **KR-7 (A1B3):** storm + chasm boss phase — B5 has NO storm, NO chasm;
  its phase is regen/ATK only and the sky is deliberately silent.
- **Tithe Night (A2B1):** survive-N + green unit + cage lever — B5 has no
  timer, no green unit, no lever.
- **Glass Fields (A2B2):** escort + player-struck resonant shards — B5's
  conduits are a clock nobody controls, not objects anybody strikes.
- **Tithe-Pit (A2B3):** seize + one-way doom schedule — the Keys are a
  *repeating, both-sides* rule cycle, not a countdown the player races.
- **Understack (A2B4):** kill-boss + destructible pylons + conversion — B5
  has no destructibles and no conversion; pure duel, new verb (rhythm).

#### Playtest watchlist

1. **Keldrin HP 68** — "boss dies too fast" → 74; "slog" → 60. Keep regen
   4.
2. **Glassguard DEF 10** — if the gate stalls joylessly → 9; if it
   evaporates → HP 30.
3. **Lime tick 3** — if players refuse the lanes outright → 2; if they
   ignore it → leave it, that's respect, not failure.
4. **Reinforcement round 5** — if peak two lands after the boss dies → 4.

---

### Engine needs — build order

The narrative section's eight engine needs and the five battles' per-memo
lists, merged into ONE de-duplicated list, ordered so each battle's
dependencies land before its mission file (B1 ships after items 1–5; B2
after 6–7; B3 after 8; B4 after 9; B5 after 10). Everything not listed runs
on existing tech: mission config, reinforcements, bossPhase, POIs, tile
swaps, searched-flags, lines() branching, lostCrew. Per architect doctrine
these are feature requests for implementation sessions — no memo edits
battle.js itself.

1. **Green `npc` side + hunt AI + rescue hooks** (B1·B2·B3·B4 — the act's
   must-build, and everything else leans on it): a third side rendered
   green, killable, entering the existing aiTurn targeting with per-enemy
   hunt weights (+40 hunter / +10 default in B1; +200 cutters in B2; +45
   cage-hands in B4; absolute +2000 executor override in B3), simple
   self-behaviors (hold, flee-toward-tile with cling radius and
   despawn-on-arrival), a static MOV-0 heal-targetable variant (cages —
   MEND works on them, heal XP at parity), and onDeath/onSafe/onDown hooks
   that set flags — battles stay winnable no matter what happens to greens.
2. **Hob in CREW_DATA + `stun` special type + sprite** (B1 onward): the
   ratified base line from the consolidation notes; JOLT PROD = one
   adjacent enemy loses its entire next turn, once per battle.
3. **New objective types in `checkEnd()`** (B1/B2/B3): `survive` N rounds,
   `escort` unit-to-exit-column (escort dead → rout-only fallback), and
   `seize` tile — all per-mission config; existing boss-death win and
   Dax-death loss unchanged.
4. **Cage-lever late-join deploy** (B1): an action-costing interact on a
   marked tile that spawns a named benched ally (the reinforcement spawner
   pointed at an ally, plus a label and bark).
5. **Act 2 warden sprite family** (B1 debuts it; B2–B5 recolor/reuse): new
   text grids for the titheman + Proctor Reeve (B1), Culver + the shard
   object (B2), Keldrin + the glassguard (B5); everything else is a recolor
   pass on existing chassis (drone→skimmer/skycutter, spiker→chimer/picket/
   lancer, rig→cutter/cage-jack/saw-rig).
6. **Destructible objects with `onKill`/link hooks** (B2 shards, B4
   pylons): stationary attack-less MOV-0 units as objects; shards carry the
   ring rule (ANY strike = 4 dmg to all sides within Manhattan 2, third
   ring crumbles the shard to boulder terrain — a ring counter, no HP
   rolls); pylons die normally in 2 hits and fire a `web.links` hook
   (linked custodian goes inert or converts).
7. **Chimer shard-play AI rule** (B2, small aiTurn extension on top of #6):
   a Chimer may strike a shard from outside its own ring radius when
   ring-value = 4×(crew in radius, Fen counts double) − 4×(wardens in
   radius) ≥ 8.
8. **Purge schedule config** (B3 — its one twist): `config.purge` —
   scripted executor targeting override (absolute priority on the current
   scheduled cage; Bulwark's forced-attack still supersedes), ordered cage
   list, 1-round reassignment lag when an executor dies, permanent halt
   when both are dead, banners/barks plus numbered order markers drawn over
   the cages (floatText/banner reuse).
9. **Mid-battle side conversion + `nonlethal` + inert states** (B4 — canon
   for Bracket, owner decree): enemy→ally flip in place joining the queue
   next round (victory-chain join is the documented fallback only if
   scoping forces it); `nonlethal` flag = at 0 HP the unit collapses (no
   death animation, out of queue, untargetable, kill XP still paid); inert
   state = out of the queue but still blocks pathing (the existing
   units-are-walls rule makes this nearly free); `bracketSlot:'random'` +
   `onBossDeath:'freeAll'` config plumbing.
10. **`ringCycle` config + terrain type 9 (glass conduit)** (B5 — its one
    twist): a per-round key cycling a fixed CYAN→MAGENTA→LIME order from a
    random start, announced by round banner + chamber tint + conduit-tile
    glow + one log line; effects — cyan: +1 max range for units/spells with
    max rng ≥ 2 (both sides); magenta: all heals halved rounding up (spells,
    AURA, items, regen; CRYO-CALL exempt); lime: terrain type 9's hazard set
    to 3 for the round (existing vent code path; existing AI tilePenalty
    then avoids the lanes on lime automatically). Terrain 9: cost 1, 10%
    evade, procedural tile art with a lit center seam in the current key's
    color (`makeBattleTiles` + a per-frame tint like the shard plinth's).
11. **save.js / main.js wiring** (all five): flags (`dashaSaved`/
    `ledgerSaved`/`dashaLost`, `fenSaved`/`fenLost`, `vyeJoined` +
    `lostCrew 'vye'` including the window-close path, `nimaSaved`/
    `nimaStruck`, `bracketJoined`, `custodiansSpared`,
    `searched['pit-freed']`, `searched['culver-manifest']`); `missionById`
    entries for all five missions (loss-resume); the Battle 3 window gate
    (storyStage 4 + `ledgerSaved` + Brand talk opens it, Battle 4 entry
    closes it); recruit-join-at-victory hook (Vye → roster); conditional
    deploy slots keyed on flags (bracket/vye/jet in B5 — Jet's pattern
    exists, extend to flags).
12. **Scripted one-off beats + cosmetics (all cuttable):** B1 `night:true`
    dark tint; B5 round-2 "the crown orders Bracket, fails" banner+log
    (storm-announce pattern, gated on `bracketJoined`); B5 post-battle
    crown-break / chord / answer / festival sequence (cutscenes.js +
    main.js `onWin` — out-of-battle work, listed for scoping); storyStage
    tile swaps in town (shuttered→open stalls, Understack crack, Mirrit's
    dark window, pit-freed stalls).
13. **Town infrastructure (parallel track, from the narrative sections):**
    `defBonus{}` parallel to `hpBonus{}` (Crusty Bread +2 DEF, applied in
    rosterInit — small); per-map shop stock + generalized door/spawn tables
    (the Ledger, tollhouse, bakery, Hymn Hall interiors; Vantorr
    trail-exits — the Rustharbor patterns exist but are hardcoded
    singletons).

### Open questions for Erik (battle consolidation)

Merged from the five memos; items 1–6 are new, 7 cross-references the main
Open Questions list in section 8.

1. **Ratify Hob's base line:** HP 29 / ATK 9 / DEF 7 / AGI 7 / MOV 5 /
   rng 1, joining at L3. (The memos drifted ATK 9–10 and join level L1–L4;
   this consolidation normalized to the line above — no kill math moves
   either way, but characters.js needs one answer.)
2. **Battle 1 twist strictness:** the player-pulled cage lever
   (recommended) vs a scripted round-4 Gunnar release, if you want the
   strictest possible one-twist reading.
3. **Sign off the consolidation renames:** PROCTOR REEVE (was Hask — one
   letter from Hasp), WARDEN TITHEMAN for Battle 3's line trooper (was
   "Titheman Carbineer"), SHARD-SAW RIG for Battle 4's artillery (was
   "Glass-Cutter Rig").
4. **Vye's kit blocks the Battle 3 mission file:** RING FLARE yes/no and
   her statline (this is main-list Open Question 9 — it is now on the
   critical path).
5. **Lost-cage bells (Battle 3):** one small glass bell on the ossuary
   trail per lost cage, consistent with the Dasha/Fen bell doctrine —
   yes/no.
6. **Keldrin's fate (Battle 5):** lives crownless in the town he taxed
   (Ceril un-pays him one receipt at a time) vs dies with the crown — the
   win cutscene is written so the map kill can read as the CROWN's death;
   your call before the epilogue dialog is written.
7. **Already on the main list, now load-bearing for these designs:**
   Dasha's fail-state hardness (OQ 4 — Battle 1 is built to the hard
   version), Nima as the Act 3 treat giver (OQ 3 — Battle 4 plants it
   without committing), festival epilogue scope (OQ 8 — Battle 5's win
   sequence feeds straight into it).
