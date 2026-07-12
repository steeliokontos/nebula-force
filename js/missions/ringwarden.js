/* ═══ NEBULA FORCE — missions/ringwarden.js: Act 2, Battle 5 — THE
   RINGWARDEN. The node chamber: Voss Keldrin stops being a tax office and
   keys the halo itself. Full design: ACT2.md, "BATTLE 5".

   The ONE twist: THE THREE KEYS. Every round the node turns one key, fixed
   order CYAN→MAGENTA→LIME from a random start, both sides:
   CYAN reaches (+1 max range on reach>=2) · MAGENTA seals (heals halved,
   including his crown-regen) · LIME wakes the lanes (conduit tiles sting 3).
   The finale is the one fight with nothing to protect but each other. ═══ */
SPRITES.oathed=SPRITES.titheman.map(r=>r.replace(/R/g,'B'));
SPRITES.lancer=SPRITES.carbineer.map(r=>r.replace(/R/g,'B').replace(/m/g,'c'));

const MISSION_RINGWARDEN={
  id:'ringwarden',
  name:'The Ringwarden',
  lvl:7,
  crashProp:false,
  map:[
    "441000000000044014",
    "410000000000000004",
    "400000044000200004",
    "100000044000000001",
    "000200244000000301",
    "100000000030099991",
    "000999999999999990",
    "100000000030099991",
    "000000244000000301",
    "100000044000000001",
    "400000044000200004",
    "410001000000100004",
    "441000000100044014",
  ],
  deploy:{
    dax:[2,6], kharn:[2,4], gunnar:[3,5], hob:[3,7], vesper:[1,6], hale:[1,7],
    bracket:[3,6], jet:[2,8], vye:[1,5],
  },
  enemies:[
    {id:'gg1', name:'GLASSGUARD', spr:'glassguard', cls:'Warden · WALL', x:7,y:5, maxhp:26, atk:14, def:10, agi:4, mov:3, guard:true, group:'gate', aggro:2},
    {id:'gg2', name:'GLASSGUARD', spr:'glassguard', cls:'Warden · WALL', x:7,y:7, maxhp:26, atk:14, def:10, agi:4, mov:3, guard:true, group:'gate', aggro:2},
    {id:'ln1', name:'WARDEN LANCER', spr:'lancer', cls:'Warden · ARTY', x:12,y:5, maxhp:22, atk:15, def:5, agi:7, mov:4, rng:[2,3], guard:true, group:'gate', aggro:5},
    {id:'ln2', name:'WARDEN LANCER', spr:'lancer', cls:'Warden · ARTY', x:12,y:7, maxhp:22, atk:15, def:5, agi:7, mov:4, rng:[2,3], guard:true, group:'gate', aggro:5},
    {id:'ow1', name:'OATHED WARDEN', spr:'oathed', cls:'Warden · OATH', x:10,y:1,  maxhp:26, atk:16, def:6, agi:8, mov:5},
    {id:'ow2', name:'OATHED WARDEN', spr:'oathed', cls:'Warden · OATH', x:13,y:1,  maxhp:26, atk:16, def:6, agi:8, mov:5},
    {id:'ow3', name:'OATHED WARDEN', spr:'oathed', cls:'Warden · OATH', x:10,y:11, maxhp:26, atk:16, def:6, agi:8, mov:5, guard:true, group:'south', aggro:5},
    {id:'ow4', name:'OATHED WARDEN', spr:'oathed', cls:'Warden · OATH', x:13,y:11, maxhp:26, atk:16, def:6, agi:8, mov:5, guard:true, group:'south', aggro:5},
    {id:'ky1', name:'SKYCUTTER', spr:'skimmer', cls:'Warden · FLY', x:9,y:3, maxhp:22, atk:15, def:4, agi:7, mov:6, fly:true},
    {id:'ky2', name:'SKYCUTTER', spr:'skimmer', cls:'Warden · FLY', x:9,y:9, maxhp:22, atk:15, def:4, agi:7, mov:6, fly:true},
    {id:'kd', name:'VOSS KELDRIN, THE RINGWARDEN', spr:'keldrin', cls:'Ringwarden · BOSS', x:16,y:6, maxhp:68, atk:17, def:8, agi:8, mov:4, rng:[1,2], boss:true},
  ],
  config:{
    storm:false, /* indoors — the first quiet sky since KR-7; the chamber IS the event */
    /* WOW — THE NODE HOLDS ITS BREATH: the round after the crown answers,
       no key turns. One bar of rest to stage the assault — but no magenta
       means his fresh regen runs whole in the silence. */
    ringCycle:{order:['cyan','magenta','lime'], randomStart:true, restOnPhase:true},
    reinforcements:{count:2, onRound:5, orWhenMinionsLeq:4,
      spawns:[[5,1],[5,11],[9,1],[9,11]],
      unit:{name:'OATHED WARDEN', spr:'oathed', cls:'Warden · OATH',
            maxhp:26, atk:16, def:6, agi:8, mov:5},
      bark:'KELDRIN: "The choir is NOT excused."'},
    bossPhase:{
      at:0.5, regen:4, atk:2, openChasm:false,
      banner:'▼ THE CROWN ANSWERS ▼',
      logIntro:'▼ Keldrin claws at the crown — and stops fighting it. The light goes THROUGH him.',
      logBuff:'▼ Something far away is holding him upright. ATK +2, +4 HP/turn. It is not generous — halve it on MAGENTA and put him down.',
    },
    events:[
      {id:'crownspeaks', trigger:{round:2}, cond:()=>bracketJoined,
       banner:'▼ THE CROWN SPEAKS ▼', color:'#ff5ad2',
       tiles:[],
       log:'"UNIT BRACKET: RESUME ASSIGNMENT." — BRACKET: "TASK: declined. I am assigned."'},
    ],
  },
  briefing:'THE NODE CHAMBER — protect Dax, bring down the Ringwarden. The node turns one key per round: CYAN reaches (+1 range), MAGENTA seals (heals halved — HIS regen too), LIME wakes the lanes (lit conduits sting 3). Watch the light. One ✦ special each.',
  intro:{
    who:'VOSS KELDRIN',
    lines:[
      "Ten years of collections. Chit by chit, week by week, and the instrument never once said THANK you. So tonight I stop collecting FOR it.",
      "Do you know what a ring is, salvager? An instrument that cannot stop playing. I used to ask it to play quieter. Now I only ask it to play what I'm OWED.",
      "It was supposed to be a LEDGER. A ledger of lights. It just wants someone to HOLD it — and I am so tired of holding it. Wardens: the tally stands at everything. Collect.",
    ],
  },
  loseText:'Dax falls beneath the node chamber. Overhead the rings play on — cyan, magenta, lime — for no one at all.',
  onWin:ringwardenVictory,
};
function ringwardenVictory(){
  openDialog('KELDRIN',[
    "Take it. TAKE it. It never stops — nine years, it never once—",
  ], ()=>{
    openDialog('DAX',[
      "Ten. And I did nine somewhere worse, standing up.",
      "The crown CRACKS down the middle. The light in it goes out the way a held breath goes out.",
    ], ()=>{
      openDialog('—',[
        "The cradle opens. The HALO HEART comes free into Dax's hand — and the relic in his pack ANSWERS.",
        "One chord. Every window in the Crossing, far above, goes ring-colored for a breath.",
        "Through the dying crown — not to Keldrin, not to anyone in the room — one line, patient, with no distance left in it:",
        "“WE HEAR YOU SINGING. SING ON.”",
        "Then nothing. The rings overhead go back to being weather.",
      ], ()=>{
        openDialog('KHARN',[
          "It is quiet. (His ears stay flat against the dead crown.)",
        ], ()=>{
          openDialog('DAX',["No. It's listening."], ()=>{
            relicTwo=true;
            storyStage=6;
            inventory.push('Halo Heart');
            setMode('town');
            curMap='vantorr';
            tstate='walk';
            hero.x=15; hero.y=7; hero.dir='up';
            hero.hidden=false; hero.moving=false; hero.prog=0;
            tCamInit=false;
            saveGame('town');
            openDialog('—',[
              "RING-RISE. The Crossing throws the festival it has owed itself for ten years. Every stall open, every window lit, the Hymn Hall singing something that is finally just a song.",
              "Keldrin lives — small again, crownless, left to the town he taxed. Ceril has begun un-paying him ten years of tithe receipts. One refund at a time. Slowly. In public.",
              nimaSaved? "Nima conducts the ring-mice from the shard plinth. They do not cooperate. It's the best show on four worlds."
                       : "At the plinth, a chair is set out where Nima used to sing. The shard glows a little brighter over it. Nobody moves the chair.",
              "✦ ACT 2 COMPLETE — two relics found, three to go. Somewhere very far away, something has stopped humming and started LISTENING. (Act 3 arrives in a future build.)",
            ]);
          });
        });
      });
    });
  });
}
