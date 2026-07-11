/* ═══ NEBULA FORCE — save.js: persistent progression + localStorage saves.
   Two jobs, one file:
   1. CREW_PROG — levels/XP/stat gains/learned spells now SURVIVE between
      battles. rosterInit (battle.js) applies it; battleWon harvests it.
      Gains are stored relative to base stats so worm soup (hpBonus) and
      weapons (equippedWeapons) never double-count.
   2. localStorage autosave — the whole journey survives closing the app.
      Saved while walking in any town map (throttled), and at the start of
      every battle. Losing a battle → RESTART reloads the page → CONTINUE
      resumes at the start of that battle with everything you had walking in.
      XP earned in a LOST battle is gone (harvest happens only on victory) —
      dying must never be a way to grow stronger.
   Loads after the mission files (script order in index.html) so
   missionById can reference the MISSION_ consts directly. ═══ */

let CREW_PROG={};      /* id → {lvl, xp, hp, atk, def, agi, spells[]} — gains, not totals */
const SAVE_KEY='nebula-force-save-v1';
let saveLastT=0;

/* every mission that can be resumed after a loss must be listed here —
   step 5 of "how to add a new battle" in CLAUDE.md */
function missionById(id){
  switch(id){
    case 'sump':   return MISSION_SUMP;
    case 'shaft9': return MISSION_SHAFT9;
    case 'kr7':    return MISSION_KR7;
    case 'tithe':  return MISSION_TITHE;
    case 'glassfields': return MISSION_GLASSFIELDS;
    case 'tithepit':    return MISSION_TITHEPIT;
    case 'understack':  return MISSION_UNDERSTACK;
    case 'ringwarden':  return MISSION_RINGWARDEN;
  }
  return null;
}

/* — harvest: copy what a won battle grew back into CREW_PROG —
   called from battleWon() for every ally, fallen or standing (the fallen
   return after the fight, Shining Force style). u.base already includes
   hpBonus + weapon ATK (rosterInit sets it), so these deltas are pure
   level-up gains. */
function harvestProgress(){
  for(const u of units){
    if(u.side!=='ally') continue;
    CREW_PROG[u.id]={
      lvl:u.lvl, xp:u.xp,
      hp:u.maxhp-u.base.maxhp, atk:u.atk-u.base.atk,
      def:u.def-u.base.def,   agi:u.agi-u.base.agi,
      mp:u.maxmp-(u.base.maxmp||u.maxmp),
      spells:u.spells.map(s2=>Object.assign({},s2)),
    };
  }
}

/* — apply saved progression to a freshly built roster unit (rosterInit) — */
function applyProgress(u){
  const pg=CREW_PROG[u.id];
  if(!pg) return;
  u.lvl=pg.lvl; u.xp=pg.xp;
  u.maxhp+=pg.hp; u.atk+=pg.atk; u.def+=pg.def; u.agi+=pg.agi;
  u.maxmp+=pg.mp||0;
  u.hp=u.maxhp; u.mp=u.maxmp;
  if(pg.spells&&pg.spells.length) u.spells=pg.spells.map(s2=>Object.assign({},s2));
}

/* — write the whole journey to localStorage —
   kind 'town': checkpoint = standing here in this map.
   kind 'battle': checkpoint = the start of the current mission. */
function saveGame(kind){
  const cp = kind==='battle'
    ? {type:'battle', mission:mission.id}
    : {type:'town', map:curMap, x:hero.x, y:hero.y, dir:hero.dir};
  const s={
    v:1, cp,
    storyStage, metOkari, haleJoined, entityFired, chefTalks, sumpJetFound,
    credits, inventory, hpBonus, searched,
    weapons:equippedWeapons, lost:[...lostCrew], prog:CREW_PROG,
    /* Act 2 */
    cerilBriefed, hobJoined, dashaAsked, dashaSaved, dashaLost, ledgerSaved,
    fenAsked, defBonus, atkBonus,
    fenSaved, fenLost, brandTalked, tithepitDone, nimaSaved, nimaStruck,
    bracketJoined, vyeJoined, custodiansSpared, relicTwo, cerilStage5,
  };
  try{ localStorage.setItem(SAVE_KEY, JSON.stringify(s)); }catch(_){/* storage full/blocked: play on unsaved */}
}
function loadGame(){
  try{
    const raw=localStorage.getItem(SAVE_KEY);
    if(!raw) return null;
    const s=JSON.parse(raw);
    return (s&&s.v===1&&s.cp)?s:null;
  }catch(_){ return null; }
}
function clearSave(){ try{ localStorage.removeItem(SAVE_KEY); }catch(_){} }

/* — throttled autosave, called every town frame from main.js —
   only while actually walking (never mid-dialog: dialog callbacks are
   closures that can't be saved) and only every few seconds. */
function saveTick(now){
  if(mode!=='town'||tstate!=='walk'||dlgActive) return;
  if(now-saveLastT<2500) return;
  saveLastT=now;
  saveGame('town');
}

/* — restore a saved journey (the CONTINUE path at boot) — */
function applySave(s){
  storyStage=s.storyStage; metOkari=s.metOkari; haleJoined=s.haleJoined;
  entityFired=s.entityFired; chefTalks=s.chefTalks; sumpJetFound=s.sumpJetFound;
  credits=s.credits; inventory=s.inventory||[];
  hpBonus=s.hpBonus||{}; searched=s.searched||{};
  cerilBriefed=!!s.cerilBriefed; hobJoined=!!s.hobJoined; dashaAsked=!!s.dashaAsked;
  dashaSaved=!!s.dashaSaved; dashaLost=!!s.dashaLost; ledgerSaved=!!s.ledgerSaved;
  fenAsked=!!s.fenAsked;
  fenSaved=!!s.fenSaved; fenLost=!!s.fenLost; brandTalked=!!s.brandTalked;
  tithepitDone=!!s.tithepitDone; nimaSaved=!!s.nimaSaved; nimaStruck=!!s.nimaStruck;
  bracketJoined=!!s.bracketJoined; vyeJoined=!!s.vyeJoined;
  custodiansSpared=!!s.custodiansSpared; relicTwo=!!s.relicTwo; cerilStage5=!!s.cerilStage5;
  defBonus=s.defBonus||{}; atkBonus=s.atkBonus||{};
  CREW_PROG=s.prog||{};
  for(const k of Object.keys(equippedWeapons)) delete equippedWeapons[k];
  Object.assign(equippedWeapons, s.weapons||{});
  lostCrew.clear();
  for(const id of s.lost||[]) lostCrew.add(id);
  if(s.cp.type==='battle'){
    const m=missionById(s.cp.mission);
    if(m){ startBattle(m); return; }
    /* unknown mission id (old save vs newer build): fall back to town */
    s.cp={type:'town', map:'town', x:14, y:12, dir:'down'};
  }
  curMap=MAPS[s.cp.map]?s.cp.map:'town';
  setMode('town'); /* after curMap so the subline names the right town */
  tstate='walk';
  hero.x=s.cp.x; hero.y=s.cp.y; hero.dir=s.cp.dir||'down';
  hero.hidden=false; hero.moving=false; hero.prog=0;
  tCamInit=false;
}

/* — boot: CONTINUE / NEW GAME if a save exists, else straight to the intro —
   replaces the unconditional startIntro() in main.js. */
function saveBoot(){
  const s=loadGame();
  if(!s){ startIntro(); return; }
  openChoice('NEBULA FORCE','A journey is already underway.',[
    {label:'▶ CONTINUE', cb:()=>applySave(s)},
    {label:'NEW GAME', cb:()=>{
      openChoice('NEBULA FORCE','Erase the saved journey and start over? This cannot be undone.',[
        {label:'KEEP MY SAVE', cb:saveBoot},
        {label:'ERASE — NEW GAME', cb:()=>{ clearSave(); CREW_PROG={}; startIntro(); }},
      ]);
    }},
  ]);
}
