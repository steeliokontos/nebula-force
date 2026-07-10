/* ═══ NEBULA FORCE — missions/shaft9.js: BATTLE TWO — into Shaft Nine.
   Five fighters (Kharn joins at the mouth) vs the mine's own machines gone
   wrong. Twist: REINFORCEMENTS — vermin pour from the side tunnels.
   Victory recovers VESPER and unlocks the launch.
   Legend: 0 tunnel floor · 1 rubble · 2 support debris (cover)
   3 gas vent (3 dmg) · 4 pit (impassable) ═══ */
SPRITES.vermin=SPRITES.drone.map(r=>r.replace(/g/g,'N').replace(/G/g,'x').replace(/r/g,'f'));
SPRITES.drillrig=SPRITES.rig.map(r=>r.replace(/o/g,'y').replace(/O/g,'T'));
SPRITES.sparker=SPRITES.spiker.map(r=>r.replace(/r/g,'f').replace(/R/g,'O'));

const MISSION_SHAFT9={
  id:'shaft9',
  name:'Shaft Nine',
  lvl:1, /* XP decay yardstick — see kr7.js */
  crashProp:false,
  map:[
    "444414000004444444",
    "444100002000144444",
    "441000300000014444",
    "410002000010000444",
    "400000000010200044",
    "441100044410000044",
    "444000044440030044",
    "410000044400000144",
    "400200000000200444",
    "410000300100000444",
    "441000000100020444",
    "444410000000004444",
    "444444100014444444",
  ],
  deploy:{ dax:[1,4], kharn:[2,3], gunnar:[2,5], jet:[1,3], hale:[1,5] },
  enemies:[
    {id:'v1', name:'GNASHER VERMIN', spr:'vermin', cls:'Vermin', x:8,y:2,  maxhp:13, atk:9,  def:2, agi:7, mov:5},
    {id:'v2', name:'GNASHER VERMIN', spr:'vermin', cls:'Vermin', x:7,y:9,  maxhp:13, atk:9,  def:2, agi:7, mov:5},
    {id:'v3', name:'GNASHER VERMIN', spr:'vermin', cls:'Vermin', x:11,y:4, maxhp:13, atk:9,  def:2, agi:7, mov:5},
    {id:'v4', name:'GNASHER VERMIN', spr:'vermin', cls:'Vermin', x:12,y:9, maxhp:13, atk:9,  def:2, agi:7, mov:5},
    {id:'d1', name:'ROGUE DRILL-RIG', spr:'drillrig', cls:'Machine · HVY', x:10,y:6, maxhp:20, atk:10, def:6, agi:3, mov:3},
    {id:'d2', name:'ROGUE DRILL-RIG', spr:'drillrig', cls:'Machine · HVY', x:13,y:3, maxhp:20, atk:10, def:6, agi:3, mov:3},
    {id:'k1', name:'ARC SPARKER', spr:'sparker', cls:'Machine · ARTY', x:14,y:8, maxhp:14, atk:9, def:3, agi:5, mov:3, rng:[2,3]},
    {id:'k2', name:'ARC SPARKER', spr:'sparker', cls:'Machine · ARTY', x:12,y:1, maxhp:14, atk:9, def:3, agi:5, mov:3, rng:[2,3]},
    {id:'xp', name:'EXCAVATOR PRIME', spr:'overseer', cls:'Machine · BOSS', x:15,y:9, maxhp:40, atk:11, def:7, agi:5, mov:3, rng:[1,2], boss:true},
  ],
  config:{
    storm:false,
    reinforcements:{count:2, onRound:3, orWhenMinionsLeq:3,
      spawns:[[8,0],[16,3],[15,11],[5,12]],
      unit:{name:'GNASHER VERMIN', spr:'vermin', cls:'Vermin', maxhp:13, atk:9, def:2, agi:7, mov:5},
      bark:'The tunnels SEETHE —'},
    bossPhase:false,
  },
  briefing:'Shaft Nine — the deep machines woke up wrong. Narrow tunnels: plug them with Gunnar. Vermin keep coming from the dark until EXCAVATOR PRIME dies. Gas vents burn (3 dmg).',
  intro:{
    who:'KHARN',
    lines:[
      "I have guarded caravans across four moons, salvager, and I know the sound a mine should make. This one is CHEWING.",
      "There is a small voice under the chewing. It has been calling for three nights. Your foreman hears equipment failure. I hear a cub in a trap.",
      "My blade-price for this job: nothing. Some hunts you take for the hunt. LEAD.",
    ],
  },
  loseText:'Dax has fallen in Shaft Nine. The small voice in the deep calls for three more nights. Then it stops.',
  onWin:shaftVictory,
};

function shaftVictory(){
  openDialog('—',[
    "EXCAVATOR PRIME grinds to a halt mid-swing — and every machine in the shaft stops with it, like a held breath finally let go.",
    "In the silence: the small voice. Behind a collapsed conveyor, in a nest of emergency blankets and stolen ration wrappers, a kid with violet eyes is holding a chunk of ore that glows in a slow, patient rhythm.",
  ], ()=>{
    openDialog('VESPER',[
      "You're the one it's been waiting for. The deep seam started singing the day YOU landed — that's why the machines went strange. They were trying to sing along.",
      "My rock is just an echo of it. The real one is down there, at the seam face. It wants to be CARRIED, and it has decided you're the one carrying it. I'd argue, but it doesn't listen to me either.",
      "I'm Vesper. I'm coming with you, because wherever that stone goes, the singing goes — and I can't sleep here anymore. Don't ask where my parents are. The rock doesn't know either.",
    ], ()=>{
      openDialog('KHARN',[
        "The cub walks out on her own feet, carrying her own stone. Good.",
        "Salvager — my contract stands. Nothing. Wherever that pack of yours is going, the hunt is clearly THERE. KHARN joins the force.",
      ], ()=>{
        openDialog('—',[
          "At the seam face, exactly where Vesper pointed: a fist of not-quite-stone, warm as a heartbeat, patterned like circuitry that predates circuits.",
          "It comes free into Dax's hand almost eagerly. The moment it does, every quake-tremor in the colony stops — like a child picked up at last.",
          "✦ Obtained the PRECURSOR RELIC. It hums in the pack, low and constant. It is not going to stop.",
        ], ()=>{
        storyStage=2;
        openDialog('—',["✦ VESPER and KHARN joined the crew! The force stands six strong. Riga is fueled at the landing yard — and the relic in your pack is very interested in the sky."], ()=>{
          setMode('town');
          curMap='town';
          tstate='walk';
          hero.x=1; hero.y=8; hero.dir='right';
          hero.hidden=false; hero.moving=false; hero.prog=0;
          tCamInit=false;
        });
        });
      });
    });
  });
}
