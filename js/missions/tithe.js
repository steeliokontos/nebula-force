/* ═══ NEBULA FORCE — missions/tithe.js: Act 2, Battle 1 — TITHE NIGHT.
   Hold a dark dockyard for seven rounds against a tax office with carbines,
   short two crew members, while the clerk who kept the only honest count of
   ten years of tithe runs the gauntlet with the ledger under her arm.
   Full design: ACT2.md, "BATTLE 1 — TITHE NIGHT".

   Firsts: survive-timer objective · green (neutral) unit · player-sprung
   ally cage · night. Storm OFF, bossPhase OFF (Reeve is a middle manager).

   Map legend (existing terrain, reflavored in the briefing only):
   0 dock plating · 1 cargo crates (cost 2, 15% evade) · 2 stacked freight
   (cost 2, 30% evade) · 3 ruptured charge conduit (3 dmg on turn end,
   ground only) · 4 dock-edge drop (flyers only). ═══ */
let titheDashaFate=null; /* 'saved' | 'lost' — read by titheVictory */
const MISSION_TITHE={
  id:'tithe',
  name:'Tithe Night',
  lvl:4, /* XP doctrine: 3×(act−1)+battle# */
  crashProp:false,
  map:[
    "011000000000000110",
    "000000000000000000",
    "000002003000020000",
    "000000100000000000",
    "000020100020000020",
    "000000100000002000",
    "000020000000000000",
    "000003000000000000",
    "000020100022000000",
    "000000100000002000",
    "010000110000000000",
    "440001000010000044",
    "444400444004444444",
  ],
  /* UNDER-STRENGTH: Gunnar impounded (the cage), Vesper hymn-sick (benched).
     Floor is 4 deployable; Jet makes 5 if he was found in Act 1. */
  deploy:{
    dax:[2,6], kharn:[3,5], hob:[3,7], hale:[2,7], jet:[2,4],
  },
  enemies:[
    {id:'t1', name:'WARDEN TITHEMAN',  spr:'titheman',  cls:'Warden · TITH', x:16,y:5,  maxhp:16, atk:13, def:4, agi:7, mov:5},
    {id:'t2', name:'WARDEN TITHEMAN',  spr:'titheman',  cls:'Warden · TITH', x:16,y:7,  maxhp:16, atk:13, def:4, agi:7, mov:5},
    {id:'t3', name:'WARDEN TITHEMAN',  spr:'titheman',  cls:'Warden · TITH', x:15,y:9,  maxhp:16, atk:13, def:4, agi:7, mov:5},
    {id:'c1', name:'WARDEN CARBINEER', spr:'carbineer', cls:'Warden · CARB', x:17,y:4,  maxhp:14, atk:12, def:3, agi:6, mov:4, rng:[2,3]},
    {id:'c2', name:'WARDEN CARBINEER', spr:'carbineer', cls:'Warden · CARB', x:17,y:8,  maxhp:14, atk:12, def:3, agi:6, mov:4, rng:[2,3]},
    {id:'k1', name:'WARDEN SKIMMER',   spr:'skimmer',   cls:'Warden · SKIF', x:15,y:1,  maxhp:14, atk:11, def:3, agi:8, mov:6, fly:true, hunter:true},
    {id:'k2', name:'WARDEN SKIMMER',   spr:'skimmer',   cls:'Warden · SKIF', x:16,y:10, maxhp:14, atk:11, def:3, agi:8, mov:6, fly:true, hunter:true},
    {id:'rv', name:'PROCTOR REEVE',    spr:'reeve',     cls:'Warden · BOSS', x:17,y:6,  maxhp:30, atk:14, def:6, agi:6, mov:4, rng:[1,2], boss:true},
  ],
  /* DASHA — the green-unit debut. Hunted (+40 on the skimmers), threatened
     but savable: the skimmers reach her round 2, she dies round 3 if wholly
     ignored. Losing her is never a game-over; it is permanent. */
  npcs:[
    {id:'dasha', name:'DASHA', spr:'dasha', cls:'Tally-clerk · CIV',
     x:11,y:8, maxhp:14, atk:0, def:2, agi:5, mov:4,
     fleeTo:{x:2,y:7}, safe:{x:3,y0:5,y1:9},
     safeBark:'DASHA: "Every page accounted for. Including yours, Proctor."'},
  ],
  config:{
    storm:false,       /* KR-7 owns the storm */
    bossPhase:false,   /* no seam, no regen — he is a middle manager */
    night:true,
    objective:{type:'survive', rounds:7,
      banner:'▸ THE SHIELDS CYCLE ◂',
      winLog:'Ceril cycles the dock shields — the wardens can’t bill what they can’t board.'},
    cage:{at:[1,10], deployAt:[2,10], unit:'gunnar', label:'SPRING THE CAGE'},
    reinforcements:{count:3, onRound:4, orWhenMinionsLeq:3,
      spawns:[[17,5],[17,7],[17,3],[17,9]],
      unit:{name:'WARDEN TITHEMAN', spr:'titheman', cls:'Warden · TITH',
            maxhp:16, atk:13, def:4, agi:7, mov:5},
      bark:'LOUDHAILER: "Second shift. The Ringwarden thanks you for your patience."'},
  },
  briefing:'TITHE NIGHT — hold the dock 7 rounds until Ceril cycles the shields (or break the Proctor). DASHA (green) is hunted — block for her or clear her path. The impound cage can be sprung: one action, standing beside it.',
  intro:{
    who:'—',
    lines:[
      "Tithe week. The dock lamps brown out one by one. Someone scheduled this.",
      "KELDRIN (comms, unseen): “Burn the book. Books are how little places convince themselves they're owed things. And the clerk — teach her arithmetic. Ours.”",
      "GUNNAR-7 (from the cage): “I AM NOT CARGO. My serial number PREDATES your charter. I have prepared REMARKS.”",
      "HOB: “Wardens bill by the hour. Hold the gap and let 'em go broke.”",
      "DASHA (across the dock): “Ten years I've walked this dock in the dark. ...It was never this dark.”",
    ],
  },
  onNpcDeath:(u)=>{
    titheDashaFate='lost';
    log(`<span class="ev">The ledger burns quickly. It was mostly honesty and paper.</span>`);
  },
  onNpcRescued:(u)=>{
    titheDashaFate='saved';
    log(`<span class="ev">The ledger — and the ledger-keeper — are safe.</span>`);
  },
  loseText:'The dock falls with Dax. By morning the Crossing pays what it’s told, and nobody is left counting.',
  onWin:titheVictory,
};
function titheVictory(){
  const saved = titheDashaFate==='saved' || (titheDashaFate===null); /* never threatened = she slipped out */
  openDialog('CERIL (comms)',[
    "Wardens don't bill what they can't board. First tithe night in ten years the Crossing kept its own.",
    "Your bot's release paperwork just… blew off my desk. Into a shredder. Ten years a dockmaster, you learn which papers can swim.",
  ], ()=>{
    const after=()=>{
      openDialog('KELDRIN (comms)',[
        "An account in arrears, then. I'll have you scheduled.",
        "Do you know what a ring is, salvager? An instrument that cannot stop playing. I don't tax these people. I charge admission.",
      ], ()=>{
        storyStage=3;
        if(saved){ dashaSaved=true; ledgerSaved=true; }
        else { dashaLost=true; }
        setMode('town');
        curMap='vantorr';
        tstate='walk';
        hero.x=7; hero.y=12; hero.dir='right';
        hero.hidden=false; hero.moving=false; hero.prog=0;
        tCamInit=false;
        saveGame('town');
        openDialog('—',[
          "Morning over Ceril's Crossing. The stalls are opening — all of them, at once, like the town is exhaling ten years of held breath.",
          "GUNNAR-7 stands at the top of the gangway and recites, quietly, all forty minutes of his prepared remarks. To the sunrise. Somebody has to hear them.",
          saved? "In the tollhouse, Dasha is already re-filing the raid under DAMAGES, THEIRS. The wardens pulled back east — to the ring-fall fields. Mirrit, up in Glasshouse Row, is waiting by her door."
               : "In the tollhouse, Ceril squares a second chair to the desk, the one nobody will sit in now, and says nothing at all. The wardens pulled back east — to the ring-fall fields.",
        ]);
      });
    };
    if(saved) openDialog('DASHA',["…Thank you. Ceril says you're trouble. I'm entering you as an asset."], after);
    else after();
  });
}
