# ACT3.md — Nebula Force, Act Three: "The Long Quiet" (working title)

Design bible for Act 3. Written to be buildable in the existing engine
(town.js map/NPC/LOOTS/flag patterns, kr7.js mission template, save.js flag
persistence, the Act 2 objective toolkit). Everything here obeys CLAUDE.md
and DESIGN.md; new engine capabilities are called out in Engine Needs.
Battle rosters and threat math are deliberately absent — the Encounter
Architect designs the battles from the premises in section 6 when the act
is built. Erik redlines this document first; nothing below is code yet.

Working names throughout are flagged ⚑ — see Open Questions.

---

## 1. Logline & tone

Act 2 ended with a festival and one line from something very far away:
*"WE HEAR YOU SINGING. SING ON."* Act 3 opens with the bill for having
been heard.

The crew folds out of Vantorr following two clues that point the same
direction — the last page of Dasha's ledger (ten years of tithe money
flowing off-world to a buyer with no name, only a mark) and the one entry
of Bracket's maintenance route that came back legible. They never arrive.
Mid-fold, the song around the shuttle goes out like a lamp, and the crew
is pulled into the hold of the SETTLEMENT ⚑ — a city-sized collection
vessel that has spent generations making quiet rounds of backwater worlds,
buying silence the way Keldrin bought obedience. The whole act happens
aboard. There is no "another planet." The travel *is* the place.

The Settlement is a town that doesn't know it's a cage: cabin rents,
company scrip, a market gallery where a dozen bought worlds' worth of
passengers live whole lives without weather. Third-generation ship-born
kids collect "sky pictures." An old woman sings her homeworld's lullaby
deliberately wrong so it can't be repossessed. Humming in the corridors
draws a fine. The crew's problems stay human-sized — a purser who mis-files
people to save them, a fine-collector scheduled for "renegotiation" — while
the act's three reveals detonate underneath, one per third:

1. **The chord gave them away.** The Act 2 victory — both relics singing
   once — is how the Settlement found the fold. The player's proudest
   moment was a homing beacon.
2. **The buyer isn't hoarding. He's soundproofing.** Buying quiet means
   buying *silence*: paying worlds to stop their relics singing, so that
   what is coming arrives unheard. The tithe was never taxes.
3. **Relic three is already aboard** — bought fair and square, from a world
   that took the money. The chase becomes a heist inside a ship the crew
   cannot leave.

Tone: Act 1 was a dirt town, Act 2 was a ring town, Act 3 is a company
town with rivets. Warm, wry, a little melancholy — worm-soup jokes next to
cosmic dread, except here it's contraband humming. The dread surfaces
exactly once per third, one line each, then goes back under the deck
plates.

---

## 2. Story spine

Act 2 ended at `storyStage 6` (festival, `relicTwo`). Act 3 continues the
same counter through stage 10. Crew levels run ~7–11; mission levels
follow the XP doctrine formula `lvl ≈ 3×(act−1)+battle#` → 7, 8, 9, 10, 11.

### Beat-by-beat

- **Bridge (Vantorr, stage 6):** Ceril's send-off at the pad the crew
  landed on. Dasha (or Brand, if `dashaLost`) hands over the ledger page:
  the buyer's mark — a bell with a bar through it ⚑, a silenced bell.
  Bracket announces his one legible route entry: a heading, not a name.
  The two point the same way. Launch → fold.
- **THE INTERDICTION (cutscenes.js, new mode):** the fold goes quiet
  around the shuttle — Vesper hears it first ("The song didn't stop.
  Something is *holding its mouth closed*."). The Settlement swallows
  them whole. No battle; the ship doesn't fight, it *processes*.
- **Intake (stage 6, aboard):** the crew is processed as passengers.
  Gunnar is power-clamped as unlicensed tonnage (Tuck would sympathize).
  Bracket is seized outright — "recovered Precursor asset, deck nine,
  pending appraisal." The shuttle is impounded. And then THE FACTOR ⚑
  makes his first move, which is the act's thesis: **a genuinely generous
  offer.** Full price for the two relics, passage anywhere, debts of every
  passenger the crew names paid off — for their quiet. No threat anywhere
  in the room. Refusing is what triggers the act. ⚑ (smile idea: the
  player can ACCEPT — one sad epilogue card, "the galaxy stayed very
  quiet after that," then the game rewinds to the choice.)
- **Gallery walkabout:** meet the town. Talk to under-purser QUILL ⚑
  [`quillMet`] — she's been mis-filing people to save them from
  renegotiation and she is nearly out of margin. Curfew falls (nightFall
  pattern) → **BATTLE 1: THE INTAKE** (lvl 7, MAINLINE, under-strength:
  no Bracket, no Gunnar — the act's under-strength gate, per doctrine).
  Win → stage 7. The crew is loose in the ship; the Factor raises the
  crew's line-item on the manifest from DISCREPANCY to ARREARS.
- **Stage 7:** the Gallery opens fully — shop, quests, the bilge trail
  (section 4a) all live. A repossession notice posts at the board:
  Gunnar's scrap date, Bracket's appraisal date, same shift. →
  **BATTLE 2: THE CATALOGUE** (lvl 8, MAINLINE — recover Gunnar and
  Bracket from the appraisal deck; QUILL's rescue beat rides this battle).
  Win → stage 8, full roster back, `quillJoined`.
- **Stage 8:** optional window opens (tithepit pattern): **BATTLE 3:
  THE MENAGERIE** (lvl 9, OPTIONAL paralogue — the hold where collected
  *living* acquisitions are kept; gated on the True Faces quest having
  started; window closes forever when Battle 4 begins). Missable recruit
  SEAM ⚑ lives here. Bracket's heaviest beat lives here too: a rack of
  custodian shells, catalogued. His coworkers.
- **BATTLE 4: THE VAULT** (lvl 10, MAINLINE): the heist. Seize the vault
  cradle; relic three comes free — and every bought silence on the ship
  breaks at once. The relics chord. The whole Gallery hears ten thousand
  years of withheld song through the deck plates. Win → stage 9,
  `relicThree`. There is no hiding after this; the Quiet unmask.
- **BATTLE 5: THE BRIDGE** (lvl 11, MAINLINE finale): the Factor, the
  bridge choir, and the truth about what he sold to get this job. Win →
  stage 10. Epilogue: the passengers inherit the Settlement — a free
  city-ship, the first town the crew saved that can *follow them*. It
  points its bow at the sky pictures. ⚑ (Act 4 bridge: the freed ship as
  recurring hub? Erik's call, see Open Questions.)

### Battle index

| # | Name | Type | lvl | Objective shape | Roster note |
|---|------|------|-----|-----------------|-------------|
| 1 | THE INTAKE | MAINLINE | 7 | breakout (seize the passenger-door override) | UNDER-STRENGTH: no Gunnar, no Bracket |
| 2 | THE CATALOGUE | MAINLINE | 8 | recover two crated crew mid-map (cage-lever pattern ×2) + rescue green unit | Gunnar/Bracket return mid-battle |
| 3 | THE MENAGERIE | OPTIONAL | 9 | free the collection (multi-cage, nonlethal doctrine) | window: stage 8 only; SEAM here |
| 4 | THE VAULT | MAINLINE | 10 | seize the cradle before lockdown (purge-clock pattern inverted: the clock is on the PLAYER) | full roster |
| 5 | THE BRIDGE | MAINLINE finale | 11 | drop the Factor / silence the choir | phased boss |

---

## 3. The Settlement — the ship as town

One town map (`'settlement'`, ~30×16 like Vantorr) plus interiors, all on
the town engine. The Gallery is the spine: a market street with a hull for
a sky. Where Rustharbor had a crater rim and Vantorr had ringlight, the
Settlement has PORTHOLES — little discs of honest starlight that the kids
treat as landmarks. New tileset work in `makeTownTiles`: deck plate,
riveted hull wall, porthole (animated star-drift), stall canvas re-used,
ballast grates (the bilge trail), the notice board.

Districts:
- **INTAKE** (west): the hangar where the shuttle sits impounded behind a
  tape line the crew is invited to respect. Launch-pad symmetry: every act
  begins and ends at a pad.
- **THE GALLERY** (center): market spine. Shop, stalls, the notice board
  where the Factor posts repossessions in beautiful handwriting.
- **THE STACKS** (east): three generations of cabins. Laundry lines
  indoors — a callback with a wrongness to it (no wind).
- **THE CHAPEL OF ACCOUNT** ⚑ (interior): the anti–Hymn Hall. A hall built
  for singing where singing is fined; the pews face a posted rate sheet.
  The act's donation-bowl-shaped secret does NOT live here — it lives in
  the bilge (4a). The chapel is the decoy the player checks first, on
  purpose.
- **THE BILGE** (hidden interior, 4a): where the act's real secret sleeps.

Shop: **THE COMMISSARY** (keeper: TALLY ⚑) — per-map stock pattern from
Act 2. Prices posted in hush-chits with a credits column added "for the
duration of your stay." Mystery item slot (Dormant Spore / Glass Charm
pattern): one item, overpriced, unexplained ⚑.

NPC sketch (~14 named; worldsmith pass after build, as always):
- **QUILL** — under-purser, recruit (section 5).
- **VESTA** ⚑ — the fine-collector who hums when nobody's listening and
  under-fines families with kids. The Factor schedules her renegotiation;
  she is Battle 2's green unit (rescue template #3, Dasha's echo aboard).
- **MOTHER LULE** ⚑ — sings her homeworld's lullaby deliberately wrong
  (quest 4f, carries the act's seed).
- **The sky-picture kids** — three ship-born kids, Pock's-census energy
  (quest 4e).
- **VENN'S SUNDRIES, BERTH 9** — an awning stall, same stripes, same sign:
  EST. LAST MONTH. TRUSTED FOR GENERATIONS. Nobody aboard remembers it
  arriving. Venn's "cousin" runs it ⚑. Sells this act's mystery item.
  (Running gag goes campaign-length; the gag IS the mystery.)
- **The Quiet** — masked ship-wardens who never speak. Fine slips, bows,
  perfect courtesy. Some of them are not people (section 7).
- Plus: a porthole-polisher, a scrip-changer, a retired cutter-rig
  operator who recognizes warden make ("I built that model's saw arm.
  Don't tell me what it was FOR, son."), cabin elders from three different
  bought worlds who argue about whose silence cost more.

---

## 4. Quest chains

### 4a. THE BILGE POOL (the act's planted secret — NON-NEGOTIABLE)

The Quiet Bowl of Act 3, and the campaign's goo-trail stop (see section 8
and DESIGN.md "THE NEIGHBOR"). Hard to find by design — three unmarked
steps, no quest marker, no NPC says "go check the bilge":

- **Clue 1 (unmarked examine):** the Stacks water tap. "The ballast water
  runs a half-second green before it runs clear. Everyone aboard has
  stopped noticing."
- **Clue 2 (unmarked examine):** a ballast grate in the Gallery floor.
  Pipe-mice (the ship's ring-mouse cousins) crowd it, all facing DOWN.
  (Pock's census taught the player that vermin know first. That lesson
  was two acts of tutorial for this moment.)
- **The hatch:** behind the indoor laundry racks in the Stacks — only
  after both clue flags — a maintenance hatch examine changes from "It's
  sealed" to "It's been opened recently. From below." Ladder down.
- **THE BILGE:** a small dark interior map. A pool of luminous green
  sludge that has absolutely no business being on a starship. It does not
  pretend. The surface leans toward the crew *immediately* — it
  recognizes them. If the Dormant Spore is in the pack, the whole pool
  stands up an inch and sits back down.
- **Touching the pool** (interact, once): no dialog box explains anything.
  Three beats of text, then it gives — pushes gently onto the deck at
  their feet — the **MYSTERIOUS TREAT** ⚑ (Compassion Chain item #3;
  working name AMBER DROP, a bead of goo-amber, warm as a heartbeat;
  USE: +2 AGI one character, permanent — architect ratifies the number).
  Sets `gooPools.settlement` (new save object, section 8). The pool then
  goes still for the rest of the act, except: it always faces the hero.

Design intent: the player who finds this gets the treat chain AND the
trail stop in one secret spot — two arcs, one location. The player who
misses it loses the Compassion Chain (unless Erik rules an alternate
giver — Open Questions #2) but can still finish the goo trail in a later
act ONLY if the trail rule is "all pools before Act 9," not "each pool in
its own act." Recommended rule: pools stay touchable forever where the
town remains revisitable, but the Settlement leaves the campaign after
Act 3 — so this one is genuinely missable. Missable-cruelty doctrine says
that's correct. Erik ratifies.

### 4b. THE RENEGOTIATION (rescue template #3 — Vesta, Battle 2)

- **Trigger:** stage 7. Vesta's fine ledger is short — deliberately,
  humanely, for years — and an audit found it. The notice board posts her
  renegotiation for the same shift as Gunnar's scrap date.
- **Steps:** Battle 2 — Vesta is a hunted green unit on the appraisal
  deck (Dasha's exact debut mechanic, third use, now aboard the enemy's
  own ship; the player knows the drill and the drill is harder here).
- **Reward (saved):** `vestaSaved`. Her ledger of under-fines becomes the
  Gallery's quiet thank-you: shop discount at the Commissary (ledgerSaved
  pattern), and one hummed bar of music in a corridor, unfined, which is
  the loudest sound in the act's first half.
- **Consequence:** `vestaLost`. The battle stays winnable. Fines double in
  the Gallery for the rest of the act. Nobody hums anywhere, ever again.

### 4c. THE TRUE FACES (Signal Lens payoff — fenSaved-gated)

This act is the Signal Lens's owner-act (ACT2.md Open Question #6:
resolved here, pending Erik's blessing).

- **Trigger:** stage 7, only if the crew holds the SIGNAL LENS
  (`fenSaved`). Vesper, in the Gallery: the Lens in Dax's pack has gone
  warm. "Fen's grandfather dove the halo with this. It shows the true
  shape of a thing — if the light's honest. The light in here is VERY
  honest. It's starlight."
- **Steps:** three unmarked Lens-examines at portholes (LOOTS pattern,
  Lens-gated): each shows a Quiet warden's reflection with a SEAM in it —
  the mask under the mask. Third one → the quest names the truth: some of
  the Quiet are not wearing masks. The masks are wearing them.
- **Reward:** foreknowledge (the finale's unmasking lands as confirmation
  for Lens players, ambush for everyone else — both are good scenes), plus
  the gate for SEAM (section 5), plus `trueFacesKnown` (dialog branches in
  battles 4–5).
- **Without the Lens (`fenLost`):** the quest never exists. The finale's
  reveal arrives with no warning. That door closes without ever being
  seen — exactly as ACT2.md promised.

### 4d. THE THIRD RELIC (MAINLINE chain)

- The vault chain IS the act: intake → catalogue → (menagerie) → vault →
  bridge, per the spine. Relic three's working name: **THE STILL TONGUE**
  ⚑ (a relic bought for silence should be named for it; alternatives:
  the Clapper, the Held Note). It is the only relic the crew ever
  acquires that was *legally purchased* by its previous owner, and
  Bracket's route entry for its original site reads, in full:
  `SITE: PAID. SERVICE: DECLINED. — the only entry that ever resolved
  ANGRY.`
- On seizure: both held relics chord with it — the un-quieting. The act's
  second dread-line happens here, not at the finale.

### 4e. SKY PICTURES (worm-soup register, small)

- **Trigger:** the ship-born kids. They trade drawings of the sky none of
  them have stood under. Their masterpiece is missing one color they have
  no name for — they've only ever seen it through the one porthole that
  faces the fold.
- **Steps:** three unmarked porthole examines at fold-facing glass; return.
- **Reward:** the kids' hoard — 30 in mixed scrip, plus **FOLD PENCIL** ⚑
  (USE: +1 AGI, one character, permanent — soup-pattern tiny permanent,
  architect ratifies). The masterpiece gets its color. It goes up on the
  notice board, over the repossessions.

### 4f. THE WRONG LULLABY (worm-soup register, small — carries a seed)

- **Trigger:** Mother Lule sings her lullaby wrong on purpose — "sung
  right, it's an ASSET. Sung wrong, it's just mine."
- **Steps:** find the right version — a scrip-changer's grandmother's
  variant, a cargo manifest that lists the lullaby (seriously) as a
  purchased item, and the honest version scratched inside a cabin bunk
  by a first-generation passenger who never got to go home.
- **Reward:** Lule sings it RIGHT, once, in the Chapel of Account, at
  dusk, unfined (Vesta looks away; if `vestaLost`, a Quiet warden fines
  her mid-verse and the scene is worse and better). Cell Pack. `searched['lullaby-found']`.
- **The seed (never flagged as one):** the honest verse counts the sky:
  *"...and the fourth walks far, and the fourth walks home."* Lule,
  frowning: "Every world's cradle song counts three rings. Whose sky has
  FOUR?" Nobody in the scene reacts further. (Feeds ACT2.md Open Question
  #7 — the Fourth Ring, payoff ~Act 5. Second seed, same shape, different
  world: the player who's paying attention now knows it wasn't a Vantorr
  transcription error.)

---

## 5. The recruits of Act 3

Campaign doctrine: 13–15 total; we stand at 9 (8 if Vye was missed). Act 3
adds two — one guaranteed, one missable, per the found-not-issued rule.

### QUILL ⚑ — guaranteed. The clerk who defected on paper first.

Under-purser of the Settlement, third-generation ship-born, never stood
under a sky. Has spent four years quietly mis-filing people whose
renegotiations she couldn't stomach — Dasha's soul in the Factor's
uniform. Joins after Battle 2 (`quillJoined`), when the mis-filed margin
finally runs out and the only file left to falsify is her own.
- Class sketch: Clerk · SCRIV. Support/utility, low ATK.
- Special sketch ⚑: **AUDIT** — mark one enemy: its next action is
  pre-announced (intent telegraph) and the first attack against it gains
  a bonus. "Everything it's about to do is already in the file."
  (Architect doctrine-proofs; concept needs Erik's yes/no first.)
- Anchor beats: she has catalogued the vault her whole career and never
  once been told what's in it. She finds out with the player.

### SEAM ⚑ — missable. The mask that wants to keep the face.

One of the Quiet — a masquerading parasite that was issued a dead
passenger's face decades ago and has been quietly *maintaining* it ever
since: visiting the family shrine, keeping the window box alive, learning
the lullaby wrong the way Lule sings it. The hunger's species, defected
one face at a time. Double-gated, maximum missable-cruelty (Erik ratifies
the cruelty): requires the SIGNAL LENS (`fenSaved` — an Act 2 choice) AND
mercy in the optional Menagerie (Battle 3: SEAM is encountered as an
enemy-coded unit the Lens shows true; nonlethal knockdown or deliberate
sparing converts, kill forecloses). Fen's grandfather's lens, two acts
later, is what lets one of the enemy stop being the enemy.
- Class sketch: Facsimile · VEIL. Skirmisher.
- Special sketch ⚑: **BORROWED FACE** — copy an adjacent ally's basic
  attack profile for one turn. (Architect doctrine-proofs.)
- If missed: in the finale, one Quiet warden hesitates before the killing
  order, for exactly one beat, and no one ever knows why.

### Anchor upkeep (no new mechanics, mandatory beats)

- **BRACKET in the Menagerie:** the catalogued custodian shells are units
  he has names for. Task queue grief: "UNIT 6: serviced its site 9,400
  years. STATUS: inventory. …TASK: object. Filing under: objection."
- **VESPER at the vault:** she hears relic three two full battles before
  anyone else, and it is the first relic that sounds *ashamed*.
- **Route decay (per doctrine):** recovering relic three resolves LESS of
  Bracket's route than the Halo Heart did — one entry flickers legible,
  then decays to noise while the crew watches. The chase must feel like
  it's losing signal. (Pacing ration is Erik's — ACT2.md OQ #10.)

---

## 6. Battle premises for the Encounter Architect

Per-battle one-twist doctrine holds. Premises only; the architect designs
from here at build time, threat math and all.

- **1 · THE INTAKE (lvl 7, MAINLINE, under-strength):** break out of the
  intake pens and seize the passenger-door override. Twist premise: the
  ship processes intruders — repossession rigs treat downed crew as
  CARGO (drag-toward-the-pens instead of kills; a downed ally can be
  stolen off the map edge for the act's first real loss-pressure without
  death). No Gunnar, no Bracket.
- **2 · THE CATALOGUE (lvl 8, MAINLINE):** the appraisal deck. Two crated
  crew (Gunnar, Bracket) as dual cage-levers that RETURN FIRE-POWER
  mid-battle when sprung (impound-cage pattern, doubled and weaponized);
  Vesta as hunted green unit. Twist premise: the appraiser keeps
  re-pricing the battle — visible bounty numbers over crew heads that
  change enemy targeting priorities round to round.
- **3 · THE MENAGERIE (lvl 9, OPTIONAL):** free the living collection.
  Multi-cage + nonlethal doctrine battle; the collection itself is
  half the map's terrain (things in tanks that react when fights pass
  them). SEAM encounter per section 5. Window: stage 8 only.
- **4 · THE VAULT (lvl 10, MAINLINE):** the heist. Seize the cradle;
  the purge-schedule pattern inverted — the LOCKDOWN clock runs against
  the player (blast doors sealing zones one by one, posted order).
  Twist premise: the moment the relic is seized, the battle's second
  half begins in broken silence — every bought quiet aboard snaps, and
  the map audibly changes sides (passenger deck-noise as a mechanic:
  the Quiet lose their courtesy).
- **5 · THE BRIDGE (lvl 11, MAINLINE finale):** the Factor and the bridge
  choir. Phased boss per doctrine; the choir unmasks per `trueFacesKnown`.
  Twist premise reserved for the architect — the finale gets designed
  last, with the whole act's toolkit on the table.

### Engine needs (act-level; battles will add their own)

- New town map `'settlement'` + interiors (bilge, chapel, menagerie-adjacent
  gallery dressing) + metal-deck tiles in `makeTownTiles` (deck plate,
  hull, animated porthole star-drift, ballast grate).
- Interdiction cutscene mode in cutscenes.js (fold-quiet → swallow).
- `gooPools` save object + pool-touch interact pattern (section 8).
- Compassion Chain item #3 (treat item + USE wiring, soup/bread pattern).
- Lens-gated examine variant (LOOTS pattern + `fenSaved` condition +
  distinct dialog frame for "seen through the Lens").
- Battle-side: drag-as-cargo state, live bounty retargeting, lockdown
  zone-sealing — architect scopes these against battle.js at build time.

---

## 7. Antagonists of Act 3

### THE FACTOR ⚑ — the buyer with no name, only a mark

The mark is a silenced bell ⚑ — a bell with a bar through it — and it has
been in the game since Act 2 without the player knowing (Dasha's ledger).
The Factor never threatens; he *prices*. Every scene he's in, he is the
most reasonable person in the room, and the horror is that his offers are
real: he genuinely pays, the debts genuinely clear, the worlds that took
his money genuinely prosper — quietly. His tragedy, revealed on the
bridge: the first quiet he ever bought was his own. He cannot hear music
at all. Not metaphorically — the game has spent two acts making music
mean everything, and the campaign's Act 3 villain experiences the relics,
the hymns, the lullabies, all of it, as *silence with paperwork*. He is
not feeding the hunger out of loyalty. He simply cannot hear what
everyone is so upset about losing.

### THE QUIET — the choir that collects

Masked wardens, perfect courtesy, fine slips in beautiful handwriting.
Enemy roster spine for all five battles (the act's warden-family
equivalent, distinct silhouette family for the architect). Some are
people who took the job. Some are the hunger's parasites wearing kept
faces — the masquerade ACT2.md promised the Signal Lens for. The split
between the two is the finale's unmasking, and SEAM is the one that
chose a third option.

---

## 8. THE NEIGHBOR — the goo trail (campaign arc, acts 1→9)

Full campaign rules live in DESIGN.md (this section summarizes; DESIGN.md
is authoritative). The short version: every main town hides one goo pool,
each harder to find than the last. Touching a pool sets a per-pool flag
(`gooPools`, persisted in save.js). Touch them ALL before the end of the
Act 9 opening and something that has been waving back since Rustharbor
finally finishes the wave — leading to a **secret promotion** for one
character ⚑ (recipient and class deliberately not nailed down yet; see
DESIGN.md for candidates).

Act 3's stop is the bilge pool (4a). Status of the trail as of this act:
- Act 1, Rustharbor: the pool EXISTS in the live game (Gloop's pit, the
  shape beneath, the Dormant Spore reaction) but sets no flag yet —
  retrofit the flag when the trail system is built.
- Act 2, Vantorr: NO pool exists. Open question: retrofit a hidden one
  (recommended: a cistern under the Hymn Hall — the slab has always
  hummed like it was resonating over water) or canonize that some worlds
  don't have one and shorten the trail. Erik rules (Open Questions #4).
- Act 3, the Settlement: the bilge pool, this act, missable forever when
  the act ends (the ship leaves the campaign… unless it becomes the hub).
- Acts 4–8: one per act-town, escalating obscurity, designed per-act.
- Act 9: the payoff, shape TBD on purpose.

How is there a pool on a STARSHIP? That question is the arc. The goo is
one organism — or one *neighbor* — and it has been keeping pace with the
crew since a moss rack leaned toward a pit in Rustharbor. The Dormant
Spore reactions have been the tell since Act 1. No dialog ever confirms
this before Act 9.

---

## 9. Open questions for Erik

1. **Names, the batch ⚑:** act title (THE LONG QUIET / THE SETTLEMENT /
   THE COLLECTION); ship name (SETTLEMENT / REMITTANCE); villain (THE
   FACTOR); relic three (THE STILL TONGUE / THE CLAPPER / THE HELD NOTE);
   recruits (QUILL, SEAM); NPCs (VESTA, MOTHER LULE, TALLY); the treat
   (AMBER DROP); the mark (silenced bell). All working names — redline
   freely before any dialog is written.
2. **The MYSTERIOUS TREAT giver.** This document proposes the bilge pool
   gives it (braiding the Compassion Chain into the goo trail at one
   secret location). ACT2.md OQ #3 proposed a saved Nima instead. The goo
   version survives `nimaStruck` and keeps Nima's rescue emotional rather
   than load-bearing; the Nima version is crueler and more personal.
   Pick one — the loser gets nothing, per the chain's own doctrine.
3. **Treat effect.** +2 AGI working number (chain pattern: soup +3 HP,
   bread +2 DEF, so a third stat). Architect ratifies the number; you
   ratify the stat.
4. **The Vantorr retrofit pool** (Hymn Hall cistern). Yes/no. If no, the
   trail rule becomes "every pool that exists," count 8-ish, and DESIGN.md
   gets updated to match.
5. **Secret promotion recipient.** Candidates, no ruling implied:
   (a) KHARN — the moon-wolf the goo has never once pretended around;
   (b) whoever the player has standing at the Act 9 pool — player's
   choice as design; (c) GLOOP himself — the trail ends with the neighbor
   joining the force, and the "promotion" is his. Or something wilder.
   Decide by ~Act 6 so seeds can point the right way.
6. **The ACCEPT-the-offer gag** (fake epilogue card, then rewind). In or
   out? It's one screen of cost and my favorite kind of smile moment,
   but it briefly takes the wheel from the player.
7. **SEAM's double gate** (fenSaved AND Menagerie mercy). This is the
   cruelest missable yet — crueler than Vye. Confirm the doctrine holds
   at this altitude or soften to single-gate (Lens only).
8. **The Settlement's future.** Freed city-ship as a recurring hub for
   acts 4+ (a town that travels WITH the crew — solves "new town every
   act" fatigue eventually) vs. it sails off into epilogue. Affects
   whether the bilge pool is truly missable, so it interacts with #4
   and the trail count.
9. **Battle 1's cargo-drag twist** (downed crew stolen off-map as cargo
   instead of dying). Flavorful loss-pressure, but it's a new fail-state
   the game has never had — needs your comfort check before the
   architect builds on it.

---

## Encounter Architect placeholder

Full battle designs (rosters, maps, threat math, configs, dialog, watch
lists) are produced per-battle at build time from section 6, exactly as
ACT2.md's were. Do not design battles from this file alone.
