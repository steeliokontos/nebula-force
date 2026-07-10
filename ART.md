# ART.md — Nebula Force pixel-art style guide

How the game's art works and the rules that keep it looking good. Written for
Erik (plain English) and for any Claude session doing art. Companion to the
"Art is code" rule in CLAUDE.md: sprites are text grids in `js/core.js`
(`SPRITES`, colors from `PAL`), tiles are drawn by code in `makeTownTiles`
(town.js) / `makeBattleTiles` (battle.js).

## The seven rules

1. **One light source, top-left.** Everything in the world is lit from the
   upper left: highlights go on top edges and left sides, shadows on bottom
   edges and right sides. Tiles already do this (every wall has a bright top
   line and a dark bottom line); sprites now do it too (Dax's left shoulder is
   light blue, his right side dark blue). If one object breaks this rule it
   looks pasted-on.

2. **Every material is a ramp, not a color.** A "material" (jacket, roof,
   robe) should have 2–4 steps of the SAME hue: highlight, base, shade.
   Never shade by adding black — pick a darker, slightly cooler version of the
   color, and highlight with a lighter, slightly warmer one. The palette in
   core.js is organized this way (`b/B` jacket blues, `s/S` skin, `t/T` cloth,
   `e/E/D` greens, `o/O` oranges). Add new letters to `PAL` when a material
   needs a step it doesn't have (`a` light blue and `i` light brown were added
   for exactly this).

3. **Cluster, don't sprinkle.** Texture made of lone scattered pixels reads
   as static noise. Texture made of little 2–3 pixel clumps, short dashes,
   and the occasional bigger feature (a crack, a pebble pair) reads as
   material. Compare the ground before/after this pass.

4. **Big shapes must connect across tiles.** A tile repeats, so ask "what
   does a ROW of these look like?" The old path tile had a border on all four
   sides — a walkway made of it looked like separate floating slabs. The old
   roof-peak tile had its own little triangle — a roof made of it looked like
   teeth. Both were fixed by letting the shape run edge-to-edge so neighbors
   merge into one road, one roofline. Borders belong only on things that ARE
   one tile big (a crate, a door).

5. **Spend contrast where the player should look.** The ground and walls are
   deliberately low-contrast and gray-purple so that characters (bright,
   outlined) and interactive things (glowing door keypads, the save antenna,
   lamp-moss) pop. If everything is loud, nothing is. Brightest colors =
   things you can touch or should notice.

6. **Silhouette first.** Every sprite has a solid dark `k` outline and is
   drawn to be recognizable as a pure black shape — big head, readable
   pose, one signature feature (Hale's staff, Kharn's ears, Okari's cane).
   Detail inside the outline is the last 10%, not the first.

7. **Animation is added at draw time, not baked into tiles.** Tiles are
   static images; all shimmer, ripples, flags, flickering windows and goo
   bubbles are painted over them each frame in `drawTown` using `now` /
   `animPhase`. Keep it that way — it means one tile image, endless motion.
   Note that palette letters in `ANIM` (`m c F f r`) BLINK in sprites — never
   use them for plain shading (an orange `f` highlight on a shoulder would
   flicker).

## Practical bits

- **Editing sprites:** each sprite is an array of equal-length strings, one
  character per pixel, `.` = transparent, letters = `PAL` colors. Town
  characters are 16 wide, 20 tall, drawn at 3× (48px). After editing, every
  row must still be exactly as long as the others — a one-character slip
  shifts the whole row.
- **Seeing your work:** `NODE_PATH=/opt/node22/lib/node_modules node
  tools/preview.js <outdir>` screenshots the real game — five town camera
  spots, a sheet of every sprite (both animation phases), and a sheet of
  every town tile. Look at before/after images; never ship art blind.
- **After any art change:** run the concat syntax check from CLAUDE.md, then
  `python3 tools/build_single.py`.
- **Derived sprites:** `colA`/`colB` colonists are recolors of `keeper`/`mech`
  made with letter-swaps at the bottom of the tile section in town.js — if
  you add new palette letters to those two sprites, add a swap for them there
  too, or the colonists will wear the wrong color.
