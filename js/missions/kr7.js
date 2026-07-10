/* ═══ NEBULA FORCE — missions/kr7.js: Act 1 battle, the Scrapfang claim war.
   THIS FILE IS THE TEMPLATE FOR EVERY FUTURE BATTLE.
   To make a new battle: copy this file, change the map / enemies / config /
   dialog, add a <script> tag for it in index.html, and call
   startBattle(YOUR_MISSION) from the story flow in main.js.

   Map legend: 0 regolith · 1 boulders (cost 2, 15% evade)
   2 debris cover (cost 2, 30% evade) · 3 crystal vent (3 dmg on turn end)
   4 open void (flyers only) · 5 sealed seam (opens into void at boss phase) ═══ */
const MISSION_KR7={
  id:'kr7',
  name:'KR-7 Claim War',
  /* mission level — the XP decay yardstick (battle.js giveXP). Crew more
     than 3 levels above this earn sharply less here. Rule of thumb from
     the XP doctrine in DESIGN.md: lvl ≈ 3 × (act − 1) + battle number. */
  lvl:2,
  map:[
    "444400000110000444",
    "440002000110000044",
    "400000000010200004",
    "000010000000055004",
    "000010030000055204",
    "000000000100000000",
    "000000000100000000",
    "000030000100055000",
    "000010000000055004",
    "000010000020000004",
    "400000000010000044",
    "440020000010030444",
    "444400000000004444",
  ],
  /* where each crew member starts (omit an id to bench them) */
  deploy:{
    dax:[1,6], kharn:[2,5], gunnar:[2,7], jet:[1,4], vesper:[0,6], hale:[1,8],
  },
  enemies:[
    {id:'s1', name:'SCRAPFANG SKIFF', spr:'drone', cls:'Scrapfang · FLY', x:11,y:1,  maxhp:14, atk:9,  def:3, agi:6, mov:6, fly:true},
    {id:'s2', name:'SCRAPFANG SKIFF', spr:'drone', cls:'Scrapfang · FLY', x:12,y:8,  maxhp:14, atk:9,  def:3, agi:6, mov:6, fly:true},
    {id:'s3', name:'SCRAPFANG SKIFF', spr:'drone', cls:'Scrapfang · FLY', x:11,y:11, maxhp:14, atk:9,  def:3, agi:6, mov:6, fly:true},
    {id:'s4', name:'SCRAPFANG SKIFF', spr:'drone', cls:'Scrapfang · FLY', x:13,y:5,  maxhp:14, atk:9,  def:3, agi:6, mov:6, fly:true},
    {id:'p1', name:'SCRAPFANG SPIKER', spr:'spiker', cls:'Scrapfang · ARTY', x:14,y:2,  maxhp:16, atk:9, def:4, agi:6, mov:4, rng:[2,3]},
    {id:'p2', name:'SCRAPFANG SPIKER', spr:'spiker', cls:'Scrapfang · ARTY', x:14,y:10, maxhp:16, atk:9, def:4, agi:6, mov:4, rng:[2,3]},
    {id:'b1', name:'SCRAPFANG BRUISER', spr:'rig', cls:'Scrapfang · HVY', x:12,y:5, maxhp:24, atk:11, def:6, agi:4, mov:4},
    {id:'b2', name:'SCRAPFANG BRUISER', spr:'rig', cls:'Scrapfang · HVY', x:12,y:7, maxhp:24, atk:11, def:6, agi:4, mov:4},
    {id:'ov', name:'CAPT. VASH REEVE', spr:'overseer', cls:'Scrapfang · BOSS', x:16,y:6, maxhp:48, atk:12, def:6, agi:7, mov:4, rng:[1,2], boss:true},
  ],
  config:{
    /* asteroid storm every round: N single strikes (8 dmg) + N 2×2 heavies (10 dmg) */
    storm:{smalls:6, bigs:2},
    /* reinforcement tech is built but OFF for this mission — flip to use later:
       reinforcements:{count:2, onRound:3, orWhenMinionsLeq:3,
         spawns:[[17,5],[17,7],[17,4],[17,8]],
         unit:{name:'SCRAPFANG SKIFF', spr:'drone', cls:'Scrapfang · FLY',
               maxhp:14, atk:9, def:3, agi:6, mov:6, fly:true},
         bark:'VASH REEVE: "All wings — get down here!"'} */
    reinforcements:false,
    /* boss hits 50% HP → the seam splits (5-tiles become void), +2 ATK, 3 regen */
    bossPhase:{
      at:0.5, regen:3, atk:2, openChasm:true,
      banner:'▼ THE SEAM SPLITS ▼',
      logIntro:'▼ Vash Reeve slams a fist into the rock — the sealed astril seam TEARS OPEN.',
      logBuff:'▼ He breathes the ore-light in. ATK +2, +3 HP/turn. Bring him down before he outlasts you.',
    },
  },
  briefing:'KR-7 — protect Dax, kill Vash Reeve. One ✦ special per crew member. FAST skips battle scenes. Drag the map to scout.',
  intro:{
    who:'CAPT. VASH REEVE',
    lines:[
      "Still breathing? On MY rock? The belt must be getting sentimental.",
      "Feel the sky shaking, groundlings? Whole debris stream's coming down on this seam. You picked a GREAT day to crash.",
      "Scrapfangs — the wounded ones first. Then the witch. Then the one in white. Leave the leader for me.",
    ],
  },
  loseText:'Dax has fallen on asteroid KR-7. The timeline closes around this moment.',
};
