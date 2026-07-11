/* ═══ NEBULA FORCE — missions/tithepit.js: Act 2, Battle 3 — THE TITHE-PIT.
   OPTIONAL paralogue. Window: storyStage 4 only, requires ledgerSaved +
   talking to Brand; closed forever when Battle 4 begins.
   Full design: ACT2.md, "BATTLE 3 — THE TITHE-PIT".

   The ONE twist: the RETIREMENT SCHEDULE — a visible execution clock made
   of units. Two CAGE-JACK rigs execute cages in a posted order (Vye's file
   moved to the top by amendment). Kill the executor and the gate guard is
   reassigned (opening the gate); kill both and the schedule halts —
   carbines aren't rated for cage duty. Win by seizing the gatehouse board
   (16,2) or dropping Pit-Boss Hasp. ═══ */
SPRITES.cagejack=SPRITES.rig.map(r=>r.replace(/o/g,'N').replace(/O/g,'x').replace(/r/g,'F'));
SPRITES.picket=SPRITES.carbineer.map(r=>r.replace(/R/g,'y'));
SPRITES.hasp=SPRITES.reeve.map(r=>r.replace(/R/g,'y').replace(/m/g,'F'));

let tpFreed=0, tpVyeFate=null;
const MISSION_TITHEPIT={
  id:'tithepit',
  name:'The Tithe-Pit',
  lvl:5,
  crashProp:false,
  map:[
    "111111111111111111",
    "100010010010000101",
    "103003003003030101",
    "100020000000201001",
    "100044444444000021",
    "102044444444010001",
    "100044444444000201",
    "100044444444001001",
    "100004444440020001",
    "100000020000000001",
    "102001000200100201",
    "100000000000000001",
    "111111111111111111",
  ],
  deploy:{
    dax:[1,6], kharn:[1,5], gunnar:[2,6], jet:[1,4], vesper:[1,7], hale:[2,7], hob:[1,8],
  },
  enemies:[
    {id:'jkA', name:'CAGE-JACK A', spr:'cagejack', cls:'Warden · HVY', x:12,y:3, maxhp:26, atk:16, def:7, agi:4, mov:4, huntBonus:0},
    {id:'jkB', name:'CAGE-JACK B', spr:'cagejack', cls:'Warden · HVY', x:16,y:3, maxhp:26, atk:16, def:7, agi:4, mov:4, huntBonus:0, guard:true, group:'gate', aggro:2},
    {id:'nt1', name:'WARDEN TITHEMAN', spr:'titheman', cls:'Warden · TITH', x:6,y:3,  maxhp:19, atk:14, def:5, agi:7, mov:5, huntBonus:0},
    {id:'nt2', name:'WARDEN TITHEMAN', spr:'titheman', cls:'Warden · TITH', x:10,y:3, maxhp:19, atk:14, def:5, agi:7, mov:5, huntBonus:0},
    {id:'st1', name:'WARDEN TITHEMAN', spr:'titheman', cls:'Warden · TITH', x:9,y:9,  maxhp:19, atk:14, def:5, agi:7, mov:5, huntBonus:0, guard:true, group:'road', aggro:4},
    {id:'st2', name:'WARDEN TITHEMAN', spr:'titheman', cls:'Warden · TITH', x:12,y:9, maxhp:19, atk:14, def:5, agi:7, mov:5, huntBonus:0, guard:true, group:'road', aggro:4},
    {id:'pk1', name:'WARDEN PICKET', spr:'picket', cls:'Warden · ARTY', x:14,y:6, maxhp:16, atk:13, def:4, agi:6, mov:4, rng:[2,3], huntBonus:0, guard:true, group:'gate', aggro:5},
    {id:'pk2', name:'WARDEN PICKET', spr:'picket', cls:'Warden · ARTY', x:9,y:10, maxhp:16, atk:13, def:4, agi:6, mov:4, rng:[2,3], huntBonus:0, guard:true, group:'road', aggro:5},
    {id:'sf1', name:'WARDEN SKIFF', spr:'skimmer', cls:'Warden · FLY', x:8,y:5, maxhp:16, atk:13, def:4, agi:7, mov:6, fly:true, huntBonus:0},
    {id:'hp', name:'PIT-BOSS HASP', spr:'hasp', cls:'Warden · BOSS', x:16,y:1, maxhp:32, atk:11, def:6, agi:5, mov:0, boss:true, huntBonus:0},
  ],
  /* the cage row — furniture with people in it. MEND heals a cage (+1 swing). */
  npcs:[
    {id:'c1', name:'CAGE ONE — ORO\'S STALLHAND', spr:'dasha', cls:'npc · CAGE', x:2,y:1,  maxhp:24, atk:0, def:2, agi:1, mov:0},
    {id:'c2', name:'CAGE TWO — CASK\'S SUPPLIER', spr:'cask',  cls:'npc · CAGE', x:5,y:1,  maxhp:24, atk:0, def:2, agi:1, mov:0},
    {id:'c3', name:'CAGE THREE — THE GUIDE',      spr:'vye',   cls:'npc · CAGE', x:8,y:1,  maxhp:24, atk:0, def:2, agi:1, mov:0},
    {id:'c4', name:'CAGE FOUR — ARREARS LABORER', spr:'fen',   cls:'npc · CAGE', x:11,y:1, maxhp:24, atk:0, def:2, agi:1, mov:0},
    {id:'c5', name:'CAGE FIVE — ARREARS LABORER', spr:'pock',  cls:'npc · CAGE', x:13,y:1, maxhp:24, atk:0, def:2, agi:1, mov:0},
  ],
  config:{
    storm:false,
    bossPhase:false, /* Hasp's phase is the schedule; he delegates */
    seize:{x:16, y:2, label:'GATEHOUSE BOARD'},
    purge:{
      startRound:2,
      order:['c3','c1','c2','c4','c5'], /* the amendment: the guide's file first */
      executors:['jkA','jkB'],
      reassignDelay:1,
      banners:{post:'▼ RETIREMENT SCHEDULE POSTED ▼', retire:'▼ CAGE — RETIRED ▼'},
      reassignBark:'HASP: "A-unit is DOWN?? B-unit — leave the gate. The row is yours. The schedule HOLDS."',
      haltBark:'HASP: "You want me to rate a CARBINE for cage duty? No. Rated equipment only. ...Schedule\'s suspended. This goes in the log."',
    },
    reinforcements:{count:2, onRound:5, orWhenMinionsLeq:2,
      spawns:[[12,11],[14,11],[16,11]],
      unit:{name:'WARDEN TITHEMAN', spr:'titheman', cls:'Warden · TITH',
            maxhp:19, atk:14, def:5, agi:7, mov:5, huntBonus:0},
      bark:'HASP: "Day shift! You\'re on the clock early. Arrears rates."'},
  },
  briefing:'THE TITHE-PIT — seize the gatehouse board (the gold G) or drop the pit-boss. The schedule retires one cage at a time; the jacks ignore you and hit furniture. It is faster than you think. MEND works on cages. One ✦ special each.',
  intro:{
    who:'PIT-BOSS HASP',
    lines:[
      "Visitors. Sign the manifest or be ON it.",
      "Wardens — we are BEHIND. Nine units of arrears and a schedule that does not care about weather, feelings, or salvagers.",
      "Amendment, crown office: the guide's file moves to the top. Cage three. She showed our skiff a shortcut once. The shortcut was DOWN.",
    ],
  },
  onNpcDeath:(u)=>{
    pushBanner('▼ '+u.name.split(' — ')[0]+' — RETIRED ▼','#ff7088');
    if(u.id==='c3'){
      tpVyeFate='lost';
      lostCrew.add('vye');
      log(`<span class="e">The pit is quieter by one voice. Somebody knew the rings like a road. The road's shorter now.</span>`);
    } else {
      log(`<span class="e">The pit is quieter by one voice.</span>`);
    }
  },
  onSeize:()=>{
    for(const u of units){ if(u.side==='npc'&&u.alive){ u.inert=true; } }
  },
  loseText:'Dax has fallen in the tithe-pit. The schedule, unwatched, runs to its end.',
  onWin:tithepitVictory,
};
function tithepitVictory(){
  tithepitDone=true;
  tpFreed=0;
  let vyeAlive=false;
  for(const u of units){
    if(u.side!=='npc') continue;
    if(u.alive||u.inert){ if(u.id==='c3') vyeAlive=true; else tpFreed++; }
  }
  searched['pit-freed']=tpFreed;
  openDialog('DAX',[
    "Board's ours. Every latch on the row — open them.",
  ], ()=>{
    openDialog('KHARN',[
      "The little boss left his clipboard. It has… columns for this.",
    ], ()=>{
      openDialog('DAX',[
        "Burn it. …No. Keep the last page. Names go home with people attached.",
      ], ()=>{
        const after=()=>{
          storyStage=4; /* window stays open only until the Understack */
          setMode('town');
          curMap='vantorr';
          tstate='walk';
          hero.x=28; hero.y=9; hero.dir='left';
          hero.hidden=false; hero.moving=false; hero.prog=0;
          tCamInit=false;
          saveGame('town');
          openDialog('—',[
            tpFreed>0
              ? `By morning, ${tpFreed===4?'every':'the'} freed prisoner${tpFreed===1?' has':'s have'} walked the canyon home. Shuttered stalls come back to life one at a time — the Crossing's economy, walking home on its own feet.`
              : "The freed pit stands empty behind you. Nobody walked home. The Crossing's stalls stay shuttered, and everyone knows why.",
            "The Understack crack still stands open in the northeast wall. Nima is still down there.",
          ]);
        };
        if(vyeAlive){
          vyeJoined=true;
          CREW_PROG.vye=CREW_PROG.vye||{lvl:5,xp:0,hp:0,atk:0,def:0,agi:0,mp:0,spells:[]};
          openDialog('VYE',[
            "You opened the cage. I noticed. I'm the part of the salvage that walks off on its own. ✦ VYE joins the force.",
          ], after);
        } else {
          openDialog('SISTER HALE',[
            "…", "Somebody knew the rings like a road.",
          ], after);
        }
      });
    });
  });
}
