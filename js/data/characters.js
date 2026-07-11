/* ═══ NEBULA FORCE — data/characters.js
   Single source of truth for the crew. Battles build their rosters from this.
   Balance doctrine (see DESIGN.md): squishies die in 2–3 exposed hits,
   flyers trade initiative (AGI) for reach (MOV), one ✦ special per battle. ═══ */
const CREW_DATA=[
  {id:'dax', name:'DAX', spr:'dax', cls:'Salvager · SDMN',
   maxhp:26, atk:11, def:6, agi:8, mov:5,
   special:{name:'RIFTBREAK', type:'riftbreak', desc:'one strike: ignores DEF, +4 dmg, can\u2019t miss'}},
  {id:'kharn', name:'KHARN', spr:'kharn', cls:'Moon-wolf · WFRV',
   maxhp:24, atk:12, def:4, agi:11, mov:6,
   special:{name:'LUNAR RUSH', type:'rush', desc:'take a second full turn right after this one'}},
  {id:'gunnar', name:'GUNNAR-7', spr:'gunnar', cls:'War-bot · ARMR',
   maxhp:34, atk:10, def:9, agi:4, mov:4,
   special:{name:'BULWARK', type:'bulwark', desc:'+6 DEF; nearby enemies MUST attack Gunnar'}},
  {id:'jet', name:'JET', spr:'jet', cls:'Courier · WING',
   maxhp:20, atk:9, def:4, agi:6, mov:7, fly:true,
   special:{name:'EXTRACTION', type:'swap', desc:'swap places with any ally — free, then still act'}},
  {id:'vesper', name:'VESPER', spr:'vesper', cls:'Psionic · MAGE',
   maxhp:16, atk:4, def:3, agi:7, mov:5, maxmp:12,
   spells:[{name:'NEURAL SHOCK', cost:3, rng:[1,2], kind:'dmg', pow:10}],
   learn:{4:{name:'PSY LANCE', cost:4, rng:[2,3], kind:'dmg', pow:14},
          7:{name:'GRAVITON', cost:6, rng:[1,3], kind:'dmg', pow:19}},
   special:{name:'BLINK', type:'blink', desc:'teleport up to 3 tiles — free, turn continues'}},
  {id:'hale', name:'SISTER HALE', spr:'hale_b', cls:'Nebula priest · HEAL',
   maxhp:18, atk:5, def:4, agi:6, mov:5, maxmp:10,
   spells:[{name:'MEND', cost:3, rng:[0,2], kind:'heal', pow:10}],
   learn:{5:{name:'AURA', cost:5, rng:[0,0], kind:'aura', pow:7},
          8:{name:'MEND II', cost:5, rng:[0,2], kind:'heal', pow:16}},
   special:{name:'CRYO-CALL', type:'cryo', desc:'call one fallen ally back at half HP'}},
  /* Act 2 — joins at Ceril's Crossing (ACT2.md §5). Off-tank: HP/DEF between
     Gunnar and Kharn; a wall with opinions, not a duelist. */
  {id:'hob', name:'HOB', spr:'hob', cls:'Dock wrangler · DRVR',
   maxhp:29, atk:9, def:7, agi:7, mov:5,
   special:{name:'JOLT PROD', type:'jolt', desc:'stun one adjacent enemy — it loses its next turn'}},
  /* Act 2 — the missable one: freed from the tithe-pit (Battle 3). */
  {id:'vye', name:'VYE', spr:'vye', cls:'Halo-diver · SKMR',
   maxhp:24, atk:12, def:4, agi:12, mov:6,
   special:{name:'RING FLARE', type:'flare', desc:'pocket shard flashbulbs — enemies within 2 tiles miss their next attack'}},
  /* Act 2 — the anchor: cut from the puppet web (Battle 4). First ranged-physical ground unit. */
  {id:'bracket', name:'BRACKET', spr:'bracket', cls:'Ringwright · RIG',
   maxhp:36, atk:9, def:9, agi:3, mov:4, rng:[1,2],
   special:{name:'MAG-TETHER', type:'tether', desc:'yank one enemy within 3 tiles adjacent — it cannot move next turn'}},
];
const CREW=['Dax','Kharn','Gunnar-7','Jet','Vesper','Sister Hale','Hob','Vye','Bracket'];
const ID2CREW={dax:'Dax',kharn:'Kharn',gunnar:'Gunnar-7',jet:'Jet',vesper:'Vesper',hale:'Sister Hale',hob:'Hob',vye:'Vye',bracket:'Bracket'};

/* ═══ persistent progression layer (survives between battles this session) ═══ */
const equippedWeapons={};          /* id → {name, atk, strongVs} */
const lostCrew=new Set();          /* missable characters you failed to find */
