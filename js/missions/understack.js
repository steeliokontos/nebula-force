/* ═══ NEBULA FORCE — missions/understack.js: Act 2, Battle 4 — THE
   UNDERSTACK. Beneath the Crossing: Keldrin's dig foreman puppets dug-up
   Precursor custodians through a resonator web. The winning move is to cut
   the strings, not smash the puppets. Full design: ACT2.md, "BATTLE 4".

   The ONE twist: MERCY AS TACTICS. Each pylon drives one custodian; break
   the pylon (2 hits, can't fight back) and the puppet goes inert where it
   stands — a spared custodian is a wall exactly where a wall was useful.
   One of the three, random each attempt, is BRACKET: cut HIS string and he
   turns ally mid-battle. His shell is a knockdown, never a kill. ═══ */
SPRITES.custodian=SPRITES.bracket.map(r=>r.replace(/c/g,'r').replace(/H/g,'G'));
SPRITES.digwarden=SPRITES.titheman.map(r=>r.replace(/R/g,'O'));
SPRITES.sawrig=SPRITES.carbineer.map(r=>r.replace(/R/g,'F').replace(/m/g,'f'));
SPRITES.vesk=SPRITES.reeve.map(r=>r.replace(/R/g,'X').replace(/m/g,'p'));

let usNimaFate=null;
const MISSION_UNDERSTACK={
  id:'understack',
  name:'The Understack',
  lvl:6,
  crashProp:false,
  map:[
    "444444444444444444",
    "400000000200000004",
    "401000040003000104",
    "400010040000032004",
    "400002040010000014",
    "400000040200000104",
    "400000005000003004",
    "400000005020000004",
    "400010040000300004",
    "440000040000001444",
    "444440040003002044",
    "444444444000010444",
    "444444444444444444",
  ],
  deploy:{
    dax:[2,6], gunnar:[3,6], hob:[3,7], kharn:[3,5], vesper:[1,6], hale:[2,7], jet:[2,5], vye:[2,8],
  },
  enemies:[
    {id:'w1', name:'DIG-WARDEN', spr:'digwarden', cls:'Warden · DIG', x:9,y:6, maxhp:22, atk:14, def:5, agi:7, mov:5, huntBonus:0},
    {id:'w2', name:'DIG-WARDEN', spr:'digwarden', cls:'Warden · DIG', x:9,y:8, maxhp:22, atk:14, def:5, agi:7, mov:5, huntBonus:0},
    /* the cage-hands: the little singer goes in the soft crate */
    {id:'h1', name:'CAGE-HAND', spr:'digwarden', cls:'Warden · DIG', x:16,y:2, maxhp:22, atk:14, def:5, agi:5, mov:5, huntBonus:45},
    {id:'h2', name:'CAGE-HAND', spr:'digwarden', cls:'Warden · DIG', x:16,y:8, maxhp:22, atk:14, def:5, agi:5, mov:5, huntBonus:45},
    {id:'r1', name:'SHARD-SAW RIG', spr:'sawrig', cls:'Warden · ARTY', x:12,y:5, maxhp:18, atk:13, def:4, agi:6, mov:3, rng:[2,3], huntBonus:0},
    {id:'r2', name:'SHARD-SAW RIG', spr:'sawrig', cls:'Warden · ARTY', x:11,y:8, maxhp:18, atk:13, def:4, agi:6, mov:3, rng:[2,3], huntBonus:0},
    /* the bound custodians — over-doctrine tough THROUGH the shell; two hits through the pylon */
    {id:'c1', name:'BOUND CUSTODIAN', spr:'custodian', cls:'Precursor · HVY', x:11,y:3, maxhp:30, atk:16, def:8, agi:4, mov:4, rng:[1,2], huntBonus:0},
    {id:'c2', name:'BOUND CUSTODIAN', spr:'custodian', cls:'Precursor · HVY', x:12,y:7, maxhp:30, atk:16, def:8, agi:4, mov:4, rng:[1,2], huntBonus:0},
    {id:'c3', name:'BOUND CUSTODIAN', spr:'custodian', cls:'Precursor · HVY', x:9,y:10, maxhp:30, atk:16, def:8, agi:4, mov:4, rng:[1,2], huntBonus:0},
    /* the resonator pylons — the custodians' REAL health bars */
    {id:'p1', name:'RESONATOR PYLON', spr:'pylon', cls:'Web · OBJ', x:12,y:2,  maxhp:18, atk:0, def:2, agi:1, mov:0, passive:true, huntBonus:0},
    {id:'p2', name:'RESONATOR PYLON', spr:'pylon', cls:'Web · OBJ', x:13,y:7,  maxhp:18, atk:0, def:2, agi:1, mov:0, passive:true, huntBonus:0},
    {id:'p3', name:'RESONATOR PYLON', spr:'pylon', cls:'Web · OBJ', x:10,y:10, maxhp:18, atk:0, def:2, agi:1, mov:0, passive:true, huntBonus:0},
    {id:'vk', name:'FOREMAN HULE VESK', spr:'vesk', cls:'Warden · BOSS', x:16,y:6, maxhp:62, atk:15, def:7, agi:6, mov:4, rng:[1,2], boss:true, huntBonus:0, guard:true, aggro:5},
  ],
  npcs:[
    {id:'nima', name:'NIMA', spr:'kid', cls:'Shard kid · CIV',
     x:14,y:4, maxhp:16, atk:0, def:3, agi:8, mov:4,
     holdFirst:false, clingRange:1, fleeTo:{x:2,y:6},
     nonlethal:true,
     downLog:'The net arcs. Nima folds up small, eyes full of ring-light. She is breathing. She is not singing.'},
  ],
  config:{
    storm:false,
    web:{links:{p1:'c1', p2:'c2', p3:'c3'}, bracketSlot:'random', onBossDeath:'freeAll'},
    reinforcements:{count:2, onRound:4, orWhenMinionsLeq:3,
      spawns:[[16,5],[16,7]],
      unit:{name:'DIG-WARDEN', spr:'digwarden', cls:'Warden · DIG',
            maxhp:22, atk:14, def:5, agi:7, mov:5, huntBonus:0},
      bark:'FOREMAN VESK: "Relief shift, down the ladder! You\'re all on overtime!"'},
    bossPhase:{
      at:0.5, regen:3, atk:2, openChasm:true,
      banner:'▼ THE WEB SCREAMS ▼',
      logIntro:'▼ Vesk cranks the hand-resonator past its stop — the strained gallery floor lets go.',
      logBuff:'▼ The web feeds back through him. ATK +2, +3 HP/turn. Cut him off before he re-tunes.',
    },
  },
  briefing:'THE UNDERSTACK — kill Foreman Vesk. The pylons drive the custodians: break a pylon (2 hits, it can\'t fight back) and its puppet stops where it stands. NIMA is down here, and the cage-hands have written orders. One ✦ special each.',
  intro:{
    who:'FOREMAN HULE VESK',
    lines:[
      "Stop drilling. STOP DRILLING. …Visitors. Nobody invoiced visitors.",
      "You're standing in the Ringwarden's basement, friends. Everything down here is on a manifest — the glass, the diggers, the antiques. The ECHO is billable. You? You're a discrepancy.",
      "Wardens: the little singer goes in the soft crate — upstairs wants her tuneable. The rest are arrears. Wake the antiques and have them carry the pieces out.",
      "KHARN (low): It hunts nothing. It is CARRYING things. …I will not enjoy this.",
    ],
  },
  onNpcDown:(u)=>{ if(u.id==='nima') usNimaFate='struck'; },
  loseText:'Dax falls in the Understack. Overhead, unaware, the Crossing keeps humming the tune that dug its own grave.',
  onWin:understackVictory,
};
function understackVictory(){
  const nimaOK = usNimaFate!=='struck' && units.some(u=>u.id==='nima'&&u.alive&&!u.inert);
  /* spared = both non-Bracket shells never truly wrecked */
  let spared=true;
  for(const cid of ['c1','c2','c3']){
    if(webState&&cid===webState.bracket) continue;
    const c=units.find(u=>u.id===cid);
    if(!c||(!c.alive&&!c.inert)) spared=false;
  }
  openDialog('FOREMAN VESK (dying)',[
    "Fourteen years of manifests. Balanced to the gram. …He never learned my name, you know. I invoiced him WEEKLY.",
  ], ()=>{
    const joinLines = webState&&webState.bracketConverted
      ? ["SHELL: intact. CHAINS: broken by intention, not accident. This is new. Ten thousand years, and it is new.","TASK: follow. Self-assigned. It is good to be assigned. It is better to be asked. ✦ BRACKET joins the force."]
      : webState&&webState.bracketDowned
      ? ["DAMAGE REPORT: dents, seventeen. GRIEVANCE: filed. RESOLUTION: I will walk it off in your service.","You free things the way you salvage things — loudly. Logged. Next to the thanks. ✦ BRACKET joins the force."]
      : ["SHELL: intact. The web died with the foreman's baton, and the quiet is ACCEPTABLE.","TASK: follow. Self-assigned. It is good to be assigned. It is better to be asked. ✦ BRACKET joins the force."];
    openDialog('BRACKET', joinLines, ()=>{
      bracketJoined=true;
      CREW_PROG.bracket=CREW_PROG.bracket||{lvl:6,xp:0,hp:0,atk:0,def:0,agi:0,mp:0,spells:[]};
      if(nimaOK) nimaSaved=true; else nimaStruck=true;
      if(spared) custodiansSpared=true;
      const after=()=>{
        storyStage=5;
        setMode('town');
        curMap='vantorr';
        tstate='walk';
        hero.x=27; hero.y=1; hero.dir='down';
        hero.hidden=false; hero.moving=false; hero.prog=0;
        tCamInit=false;
        saveGame('town');
        openDialog('—',[
          "Above ground, the Crossing has stopped pretending to sleep. Keldrin has stopped pretending to be a tax man — the crown is BLAZING on the ossuary trail, keying the node chamber open by force.",
          "Ceril stands the dock crews down. Bale bakes through the night, because somebody has to. Lunett sings the hall empty.",
          "Talk to CERIL when the crew is ready. Then the trail. Then the Ringwarden.",
        ]);
      };
      if(spared&&nimaOK){
        openDialog('—',[
          "The freed custodians pry open a Precursor service cache with the patience of things that have waited ten thousand years to be useful on purpose. ✦ 120 credits + 2 REPAIR SPRAY.",
        ], ()=>{
          credits+=120; inventory.push('Repair Spray','Repair Spray');
          openDialog('SISTER HALE',[
            "Nima sings one clean phrase — and the node door opens like an eye going wide.",
            "Ten thousand years, and it still knows a kind voice when it hears one.",
          ], after);
        });
      } else if(nimaOK){
        openDialog('SISTER HALE',[
          "Nima sings one clean phrase — and the node door opens like an eye going wide.",
          "Ten thousand years, and it still knows a kind voice when it hears one.",
        ], after);
      } else {
        openDialog('VESPER',[
          "Hale carries her up the spoil-road. Nobody talks. Dax sets Vesk's own blasting charges against the node door.",
          "It should've been a song.",
        ], after);
      }
    });
  });
}
