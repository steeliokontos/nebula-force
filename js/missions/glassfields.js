/* ═══ NEBULA FORCE — missions/glassfields.js: Act 2, Battle 2 — THE GLASS
   FIELDS. Walk a farmer home through an orchard of glass bells that ring
   damage on everyone near them — while the people who came to cut the
   orchard down try to ring it first. Full design: ACT2.md, "BATTLE 2".

   The ONE twist: RESONANT SHARDS. Strike one — any unit, any side — and it
   RINGS: 4 dmg to everything within 2 tiles. Third ring cracks it into
   boulders. Chimers (ringer:true) volley shards on purpose from outside
   their own blast. Escort win: Fen reaches any x=0 tile. Rout win: clear
   the field. Killing Culver only cancels the reinforcements (needBoss
   gate + bossDeathWins:false + routWins:true). ═══ */
SPRITES.cutterrig=SPRITES.rig.map(r=>r.replace(/o/g,'G').replace(/O/g,'N').replace(/r/g,'f'));
SPRITES.chimer=SPRITES.carbineer.map(r=>r.replace(/R/g,'P').replace(/m/g,'c'));
SPRITES.culver=SPRITES.reeve.map(r=>r.replace(/R/g,'O').replace(/m/g,'F'));

let gfFenFate=null; /* 'saved' | 'lost' */
const MISSION_GLASSFIELDS={
  id:'glassfields',
  name:'The Glass Fields',
  lvl:5,
  crashProp:false,
  map:[
    "111000000000000111",
    "100000000000000001",
    "000002000200000000",
    "000000000000000000",
    "000110000110000000",
    "000110000110220000",
    "000000000020202000",
    "000110000110020000",
    "000110000110000000",
    "000000000000000000",
    "000000200000000000",
    "100000000000000001",
    "111000000000000111",
  ],
  deploy:{
    dax:[1,6], gunnar:[2,6], kharn:[2,5], hob:[2,7], jet:[1,4], vesper:[0,5], hale:[1,8],
  },
  enemies:[
    /* the cutters — glass-cutting torches on legs, the designated Fen-hunters */
    {id:'cu1', name:'CUTTER RIG', spr:'cutterrig', cls:'Warden · CUTR', x:16,y:6,  maxhp:16, atk:14, def:3, agi:9, mov:6, huntBonus:200},
    {id:'cu2', name:'CUTTER RIG', spr:'cutterrig', cls:'Warden · CUTR', x:16,y:1,  maxhp:16, atk:14, def:3, agi:9, mov:6, huntBonus:200},
    {id:'cu3', name:'CUTTER RIG', spr:'cutterrig', cls:'Warden · CUTR', x:16,y:11, maxhp:16, atk:14, def:3, agi:9, mov:6, huntBonus:200},
    /* the sweep line */
    {id:'tt1', name:'WARDEN TITHEMAN', spr:'titheman', cls:'Warden · TITH', x:15,y:4, maxhp:20, atk:13, def:5, agi:7, mov:5, huntBonus:40},
    {id:'tt2', name:'WARDEN TITHEMAN', spr:'titheman', cls:'Warden · TITH', x:15,y:8, maxhp:20, atk:13, def:5, agi:7, mov:5, huntBonus:40},
    {id:'tt3', name:'WARDEN TITHEMAN', spr:'titheman', cls:'Warden · TITH', x:16,y:7, maxhp:20, atk:13, def:5, agi:7, mov:5, huntBonus:40},
    /* the bell-ringers — their carbine is the side arm; the orchard is the weapon */
    {id:'ch1', name:'WARDEN CHIMER', spr:'chimer', cls:'Warden · ARTY', x:16,y:3, maxhp:16, atk:11, def:4, agi:6, mov:4, rng:[2,3], ringer:true},
    {id:'ch2', name:'WARDEN CHIMER', spr:'chimer', cls:'Warden · ARTY', x:16,y:9, maxhp:16, atk:11, def:4, agi:6, mov:4, rng:[2,3], ringer:true},
    /* the south-flank racers */
    {id:'sk1', name:'RING SKIMMER', spr:'skimmer', cls:'Warden · FLY', x:17,y:2,  maxhp:16, atk:13, def:4, agi:6, mov:7, fly:true, huntBonus:40},
    {id:'sk2', name:'RING SKIMMER', spr:'skimmer', cls:'Warden · FLY', x:17,y:10, maxhp:16, atk:13, def:4, agi:6, mov:7, fly:true, huntBonus:40},
    /* the middle manager with a quota */
    {id:'cv', name:'SWEEP-MASTER CULVER', spr:'culver', cls:'Warden · BOSS', x:17,y:6, maxhp:34, atk:15, def:7, agi:8, mov:5, rng:[1,2], boss:true},
  ],
  npcs:[
    /* FEN — barricaded at his wrecked rig until the crew reaches him */
    {id:'fen', name:'FEN', spr:'fen', cls:'Vapor-farmer · CIV',
     x:13,y:6, maxhp:24, atk:0, def:3, agi:5, mov:4,
     activateRadius:2, holdFirst:false,
     activateBark:'FEN: "You brought the tin? ...She KNEW. Fine — I\'m moving. Don\'t let them ring the tall one by my rig. I sleep next to that one."',
     fleeTo:{x:0,y:6}, exitCol:0},
  ],
  config:{
    storm:false,      /* Vantorr's sky is quiet — the orchard is the weather */
    bossPhase:false,  /* twist budget spent on the shards */
    bossDeathWins:false, /* Culver dying breaks the sweep, not the battle */
    routWins:true,
    shards:[[4,2],[8,2],[12,2],[6,5],[11,5],[8,7],[14,7],[5,10],[13,10]],
    shardRule:{ringDmg:4, ringRadius:2, ringsToCrumble:3, crumbleTile:1},
    /* WOW — THE LOAD SLIPS: kill Culver and the sweep-crane loses its
       operator. The day's cut singers crash down on the east edge, and his
       manifest lies in the wreck for two rounds — opposite the direction
       the escort is fleeing. A gift with teeth. */
    events:[
      {id:'loadslips', trigger:{onKill:'cv'},
       banner:'▼ THE LOAD SLIPS ▼', color:'#ff9a2a', focus:[16,6], damage:8,
       tiles:[[16,5,1],[16,7,1],[17,6,1]],
       log:'The sweep-crane swings unmanned — the day\u2019s harvest comes down in a long glass avalanche. Something paper flutters into the wreck.',
       loot:{at:[17,6], name:'CULVER\u2019S MANIFEST', credits:60, flag:'culver-manifest',
             msg:'✦ CULVER\u2019S MANIFEST — 60 credits in dock chits, and the cutting ledger: every crate of singing glass hauled DOWN, not off-world.'},
       then:{afterRounds:2, tiles:[[17,6,1]],
             banner:'▼ THE CRATES SETTLE ▼',
             log:'The spilled load grinds itself flat.',
             lostLog:'The manifest is pulped under settling glass. Whatever it proved goes unproven.'}},
    ],
    reinforcements:{count:2, onRound:4, orWhenMinionsLeq:2,
      spawns:[[17,5],[17,7],[17,3],[17,9]],
      unit:{name:'CUTTER RIG', spr:'cutterrig', cls:'Warden · CUTR',
            maxhp:16, atk:14, def:3, agi:9, mov:6, huntBonus:200},
      bark:'CULVER: "Second team, east row. The quota does not care that you\'re tired."'},
  },
  briefing:'THE GLASS FIELDS — walk Fen to the western edge (any x=0 tile). The shards RING when struck: 4 dmg to everyone within 2 tiles, ANY side; the third ring cracks them to rubble. Strike them yourself, or make the wardens regret standing close. One ✦ special each.',
  intro:{
    who:'SWEEP-MASTER CULVER',
    lines:[
      "Sweep line on the rig. The farmer's squatting on eleven verified singers — that's a tithe-week of warehouse glass if we cut clean.",
      "Rules of the orchard, wardens: leave the quiet ones. Quiet glass is inventory. LOUD glass is payroll.",
      "And the farmer? Retire the arrears. The manifest doesn't print a column for objections.",
    ],
  },
  onFirstRing:()=>{
    log(`<span class="s">VESPER: "Wait. The pitch — it answered in ORDER. It's not a song. It's a WORK ORDER."</span>`);
  },
  onNpcDeath:(u)=>{ gfFenFate='lost'; },
  onNpcRescued:(u)=>{ gfFenFate='saved'; },
  loseText:'Dax falls among the singing glass. The orchard keeps ringing, long after there is no one left to hear it.',
  onWin:glassfieldsVictory,
};
function glassfieldsVictory(){
  const saved = gfFenFate==='saved' || (gfFenFate===null && units.some(u=>u.id==='fen'&&u.alive));
  const after=()=>{
    storyStage=4;
    if(saved) fenSaved=true; else fenLost=true;
    setMode('town');
    curMap='vantorr';
    tstate='walk';
    hero.x=28; hero.y=9; hero.dir='left';
    hero.hidden=false; hero.moving=false; hero.prog=0;
    tCamInit=false;
    saveGame('town');
    openDialog('—',[ saved
      ? "That night, the ground over the Understack sings loud enough to hear from the plaza. Nobody sleeps well. In Glasshouse Row, one window burns late — two silhouettes, one lunch tin, nobody talking because nobody needs to."
      : "The tin goes back full. On the ossuary trail, a new bell — small, clear, in a niche cut too recently. The ground sings that night, and it sounds different now.",
      "Meanwhile: NIMA is missing. Pock saw her slip through the cracked Understack gate, 'following the song.' The crack in the northeast wall stands OPEN.",
    ]);
  };
  if(saved){
    openDialog('FEN',[
      "They weren't scavenging. They took the singers and left the quiet standing. Thirty years of orchard, sorted by EAR.",
    ], ()=>{
      openDialog('VESPER',[
        "Transcribing it. It's a schedule. Somebody down there is keeping a schedule ten thousand years old.",
      ], ()=>{
        openDialog('HOB',[
          "Glass that sings, wardens that count. I've hauled stranger cargo. Never dumber.",
        ], ()=>{
          openDialog('DAX',["Come on. Someone's holding your lunch."], after);
        });
      });
    });
  } else {
    openDialog('KHARN',["The cutting is finished. Both kinds."], ()=>{
      openDialog('SISTER HALE',["…I'll take the tin back. Somebody has to."], after);
    });
  }
}
