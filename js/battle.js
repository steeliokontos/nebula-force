/* ═══ NEBULA FORCE — battle.js: mission-driven tactical battle engine.
   A battle is started with startBattle(mission) — see js/missions/ for the
   mission format. Systems: AGI-variance turn order, free reposition until
   you act, land-effect evasion, one ✦ special per unit per battle,
   XP/leveling with wild rolls + floors, asteroid storm, boss phases,
   optional reinforcements, cinematic scenes (FAST skips them). ═══ */
const BCOLS=18, BROWS=13, BT=48;
const XP_PER_LEVEL=25;
const TERRAIN={
  0:{name:'Regolith', cost:1, le:0},
  1:{name:'Boulders', cost:2, le:0.15},
  2:{name:'Hull debris cover', cost:2, le:0.30},
  3:{name:'Crystal vent', cost:1, le:0, hazard:3},
  4:{name:'Open void', cost:1, le:0, void:true},
  5:{name:'Sealed seam', cost:1, le:0, seam:true},
  6:{name:'Lime sump', cost:2, le:0.10, hazard:2},
  7:{name:'Black goo', cost:1, le:0, void:true},
  8:{name:'Spore thicket', cost:2, le:0.30},
};
let bGrid=[], chasmTiles=[];
const DIRS=[[1,0],[-1,0],[0,1],[0,-1]];
let mission=null;

/* — camera: the screen is a 10×8 window onto the field — */
const WORLD_W=BCOLS*BT, WORLD_H=BROWS*BT;
let camX=0, camY=0, camTX=0, camTY=0;
function clampCam(v,max){ return Math.max(0, Math.min(max, v)); }
function camFocus(wx,wy){
  camTX=clampCam(wx-cv.width/2, WORLD_W-cv.width);
  camTY=clampCam(wy-cv.height/2, WORLD_H-cv.height);
}
function focusUnit(u){ camFocus(u.x*BT+BT/2, u.y*BT+BT/2); }
function focusPair(a,b){ camFocus((a.x+b.x)/2*BT+BT/2, (a.y+b.y)/2*BT+BT/2); }

/* — screen-fit: everything on one screen, no scrolling, any device — */
function fitLayout(){
  const headH=document.querySelector('header').offsetHeight;
  const uiH=document.getElementById('ui').offsetHeight;
  const availW=Math.min(window.innerWidth-12, 720);
  const availH=window.innerHeight-headH-uiH-30;
  const scale=Math.max(.4, Math.min(availW/cv.width, availH/cv.height));
  const w=Math.floor(cv.width*scale);
  document.getElementById('stage').style.width=w+'px';
  document.getElementById('ui').style.maxWidth=Math.max(w,300)+'px';
}
addEventListener('resize',fitLayout);

/* — tile art — */
const batTiles={};
let batTilesMade=false;
function makeBattleTiles(){
  if(batTilesMade) return;
  batTilesMade=true;
  for(let type=0; type<=8; type++){
    batTiles[type]=[];
    for(let v=0; v<2; v++){
      const c=document.createElement('canvas'); c.width=BT; c.height=BT;
      const g2=c.getContext('2d');
      const rnd=mulberry(type*7+v*131+55);
      if(type!==4){
        rr(g2,0,0,16,16, v?'#3c3350':'#38304a');
        for(let i=0;i<8;i++) pxr(g2,(rnd()*16)|0,(rnd()*16)|0, rnd()<.5?'#463a58':'#2e2740');
        for(let i=0;i<3;i++){
          const px2=(rnd()*13)|0, py2=(rnd()*13)|0;
          pxr(g2,px2,py2,'#241d30'); pxr(g2,px2+1,py2,'#241d30');
          pxr(g2,px2,py2-1,'#544868');
        }
      }
      if(type===1){
        const spots=[[3,8,5,5],[9,3,4,4],[7,11,4,3]];
        for(const [sx,sy,w,h] of spots){
          rr(g2,sx,sy,w,h,'#5a4e72');
          rr(g2,sx,sy,w,1,'#786a94');
          rr(g2,sx+w-1,sy+1,1,h-1,'#3a3050');
          pxr(g2,sx+1,sy+h-1,'#2c2440');
        }
        if(v) rr(g2,1,2,3,3,'#5a4e72');
      }
      if(type===2){
        rr(g2,2,4,12,9,'#2a3a44');
        rr(g2,2,4,12,1,'#44586a');
        rr(g2,2,12,12,1,'#18242c');
        rr(g2,2,8,12,1,'#1e2c36');
        pxr(g2,4,6,'#44586a'); pxr(g2,11,10,'#18242c');
        rr(g2,5,2,4,2,'#8a3a30');
        pxr(g2,12,5,'#48e0d0');
      }
      if(type===3){
        for(const [px2,py2,h] of [[5,10,4],[8,8,6],[11,11,3],[3,7,3]]){
          rr(g2,px2,py2-h,2,h,'#2c8a7e');
          rr(g2,px2,py2-h,1,h,'#48e0d0');
          pxr(g2,px2,py2-h,'#a8f8ec');
        }
      }
      if(type===4){
        rr(g2,0,0,16,16,'#04050c');
        for(let i=0;i<4;i++){
          const b=.3+rnd()*.6;
          g2.fillStyle=`rgba(200,220,255,${b})`;
          g2.fillRect(((rnd()*15)|0)*PXS, ((rnd()*15)|0)*PXS, rnd()<.7?2:3, rnd()<.7?2:3);
        }
        g2.fillStyle='rgba(120,80,200,.10)';
        g2.beginPath(); g2.arc(rnd()*BT, rnd()*BT, 14+rnd()*10, 0, 7); g2.fill();
        if(v){ g2.fillStyle='#241d30'; g2.fillRect(0,0,BT,4); }
      }
      if(type===6){ /* lime sump — walkable, stings */
        rr(g2,1,1,14,14,'#1a3a14');
        rr(g2,2,2,12,12,'#2a5a1e');
        for(let i=0;i<6;i++) pxr(g2,(2+rnd()*12)|0,(2+rnd()*12)|0,'#8be04e');
        for(let i=0;i<4;i++) pxr(g2,(2+rnd()*12)|0,(2+rnd()*12)|0,'#48e060');
        pxr(g2,(3+rnd()*10)|0,(3+rnd()*10)|0,'#d8ff9a');
        if(v){ rr(g2,4,7,8,2,'#3a7a28'); }
      }
      if(type===7){ /* black goo — nothing walks it */
        rr(g2,0,0,16,16,'#05070a');
        rr(g2,1,1,14,1,'#101a12');
        for(let i=0;i<3;i++) pxr(g2,(rnd()*15)|0,(rnd()*15)|0,'#12241a');
        pxr(g2,(rnd()*14)|0,(rnd()*14)|0,'#1e4a2e');
        if(v) pxr(g2,(rnd()*14)|0,(rnd()*14)|0,'#8be04e');
      }
      if(type===8){ /* spore thicket — heavy cover */
        rr(g2,0,0,16,16,'#241d30');
        for(const [fx,fy,fh] of [[3,13,6],[6,14,8],[10,13,7],[13,14,5]]){
          rr(g2,fx,fy-fh,1,fh,'#3a6a3a');
          rr(g2,fx-1,fy-fh,3,2,'#6a3aa8');
          pxr(g2,fx,fy-fh-1,'#b47ae8');
        }
        for(let i=0;i<4;i++) pxr(g2,(rnd()*15)|0,(10+rnd()*5)|0,'#2a5a1e');
        if(v) pxr(g2,8,4,'#d8ff9a');
      }
      if(type===5){
        g2.strokeStyle='#241d30'; g2.lineWidth=2.5;
        g2.beginPath(); g2.moveTo(4,40); g2.lineTo(16,26); g2.lineTo(12,12); g2.lineTo(26,4); g2.stroke();
        g2.beginPath(); g2.moveTo(44,10); g2.lineTo(30,22); g2.lineTo(38,38); g2.stroke();
        g2.strokeStyle='rgba(72,224,208,.30)'; g2.lineWidth=1;
        g2.beginPath(); g2.moveTo(5,41); g2.lineTo(17,27); g2.lineTo(13,13); g2.stroke();
        g2.beginPath(); g2.moveTo(43,11); g2.lineTo(31,23); g2.lineTo(39,39); g2.stroke();
      }
      batTiles[type].push(c);
    }
  }
}

/* — units — */
function mkUnit(o){
  const u=Object.assign({
    alive:true, fly:false, rng:[1,1], maxmp:0,
    lvl:1, xp:0, spells:[], learn:{}, special:null, boss:false,
    bulwark:false, regen:0,
    ox:0, oy:0, flash:0, walk:null,
  }, o);
  u.hp=u.maxhp; u.mp=u.maxmp;
  u.base={maxhp:u.maxhp, atk:u.atk, def:u.def, agi:u.agi, maxmp:u.maxmp};
  return u;
}
let units=[];
function buildCrewUnit(cd,x,y){
  const u=mkUnit({
    id:cd.id, name:cd.name, spr:cd.spr, cls:cd.cls, side:'ally',
    x, y,
    maxhp:cd.maxhp, atk:cd.atk, def:cd.def, agi:cd.agi, mov:cd.mov,
    fly:!!cd.fly, maxmp:cd.maxmp||0,
    spells:(cd.spells||[]).map(s2=>Object.assign({},s2)),
    learn:cd.learn||{},
    special:cd.special?Object.assign({used:false},cd.special):null,
  });
  const bn=ID2CREW[u.id];
  if(bn&&hpBonus[bn]){ u.maxhp+=hpBonus[bn]; u.hp=u.maxhp; u.base.maxhp=u.maxhp; }
  if(bn&&defBonus[bn]){ u.def+=defBonus[bn]; u.base.def=u.def; }
  if(bn&&atkBonus[bn]){ u.atk+=atkBonus[bn]; u.base.atk=u.atk; }
  const wpn=equippedWeapons[u.id];
  if(wpn){ u.atk+=wpn.atk; u.base.atk=u.atk; u.weapon=wpn; }
  applyProgress(u); /* levels/XP/spells carried from past victories (save.js) */
  return u;
}
function rosterInit(){
  units=[];
  for(const cd of CREW_DATA){
    const pos=mission.deploy[cd.id];
    if(!pos) continue;
    if(lostCrew.has(cd.id)) continue; /* missed forever */
    units.push(buildCrewUnit(cd,pos[0],pos[1]));
  }
  for(const e of mission.enemies){
    units.push(mkUnit(Object.assign({side:'enemy'},e)));
  }
  /* green units — neutral rescue NPCs (ACT2.md engine need #1) */
  for(const n of (mission.npcs||[])){
    units.push(mkUnit(Object.assign({side:'npc', atk:0, rng:[1,1]}, n)));
  }
}

/* — battle state — */
let queue=[], qi=0, round=1;
let cur=null, bstate='idle';
let moveSet=new Set(), targetSet=new Set(), specialSet=new Set();
let pendingAct=null, pendingSpell=null;
let floaters=[], banners=[], impacts=[], gameOver=false, fastMode=false;
let bfade=1, bsmoke=[];
let warnTiles=[], impactRound=-1, stormAnnounced=false;
let reinforced=false, phase2=false, phasePending=false, kharnRushPending=false;
let casualties=0, cageSprung=false;
const bkey=(x,y)=>y*BCOLS+x;
const inB=(x,y)=>x>=0&&y>=0&&x<BCOLS&&y<BROWS;
const occ=(x,y)=>units.find(u=>u.alive&&u.x===x&&u.y===y);
const mdist=(a,b)=>Math.abs(a.x-b.x)+Math.abs(a.y-b.y);
const aliveOf=s2=>units.filter(u=>u.alive&&u.side===s2);
const effDef=u=>u.def+(u.bulwark?6:0);
const landLE=u=>u.fly?0:TERRAIN[bGrid[u.y][u.x]].le;
const isWarned=(x,y)=>warnTiles.some(t=>t.x===x&&t.y===y);

function log(html){
  const el=document.getElementById('log');
  el.insertAdjacentHTML('beforeend', `<p>${html}</p>`);
  el.scrollTop=el.scrollHeight;
}
const tag=u=>`<span class="${u.side==='ally'?'a':u.side==='npc'?'n':'e'}">${u.name}</span>`;
function floatText(x,y,text,color,big){
  floaters.push({x:x*BT+BT/2, y:y*BT+8, text, color, age:0, big:!!big});
}
function pushBanner(text,color){
  banners.push({text, color:color||'#ffd23a', t:0, dur:fastMode?600:1400});
}

/* — panels — */
function spriteCanvas(name, size, big){
  const rows=SPRITES[name];
  const scale = big ? Math.max(2,Math.floor((size-4)/rows.length)) : 2;
  const c=document.createElement('canvas');
  c.width=16*scale+4; c.height=Math.min(size,rows.length*scale+2);
  const g2=c.getContext('2d');
  drawSprite(g2, name, c.width/2, c.height-1, scale, false, 0);
  return c;
}
function renderCard(u){
  const c=document.getElementById('card');
  if(!u){c.innerHTML='<span style="color:var(--dim);font-size:10px">Tap a unit to inspect · drag the map to look around</span>'; return;}
  const col=u.side==='ally'?'var(--ally)':u.side==='npc'?'#48e060':'var(--enemy)';
  let bars=`<div class="barlabel"><span>HP</span><span>${u.hp}/${u.maxhp}</span></div>
            <div class="bar hp"><i style="width:${u.hp/u.maxhp*100}%"></i></div>`;
  if(u.maxmp>0){
    bars+=`<div class="barlabel"><span>MP</span><span>${u.mp}/${u.maxmp}</span></div>
           <div class="bar mp"><i style="width:${u.mp/u.maxmp*100}%"></i></div>`;
  }
  if(u.side==='ally'){
    bars+=`<div class="bar xp" title="EXP"><i style="width:${u.xp/XP_PER_LEVEL*100}%"></i></div>`;
  }
  let extra=[];
  if(u.special){
    extra.push(u.special.used
      ? `<span class="used">✦ ${u.special.name}</span>`
      : `<span class="sp">✦ ${u.special.name}</span> <span style="color:var(--dim)">— ${u.special.desc}</span>`);
  }
  if(u.weapon) extra.push(`⚔ ${u.weapon.name} +${u.weapon.atk}${u.weapon.strongVs?' · keen vs '+u.weapon.strongVs.toLowerCase():''}`);
  for(const s2 of u.spells) extra.push(`☄ ${s2.name} ${s2.cost}MP r${s2.rng[0]}–${s2.rng[1]}`);
  if(u.regen>0) extra.push(`<span class="rg">♻ +${u.regen} HP/turn</span>`);
  if(u.bulwark) extra.push(`<span class="sp">▣ BULWARK</span>`);
  c.innerHTML=`
    <div class="crow">
      <div class="portrait" id="portrait-slot"></div>
      <div class="mid">
        <div class="name" style="color:${col}">${u.name}${u.side==='ally'?` <span class="lv">LV${u.lvl}</span>`:''}</div>
        ${bars}
      </div>
      <div class="stats">
        ATK <b>${u.atk}</b> DEF <b>${effDef(u)}</b><br>
        AGI <b>${u.agi}</b> MOV <b>${u.mov}</b><br>
        <span style="color:var(--dim);font-size:8px">${u.cls}${u.fly?' · flies':''}</span>
      </div>
    </div>
    <div class="proc">${extra.join(' · ')||'✦ no special'}</div>`;
  document.getElementById('portrait-slot').appendChild(spriteCanvas(u.spr,44,true));
}
function renderActions(){
  const a=document.getElementById('actions');
  a.innerHTML='';
  if((bstate==='move'||bstate==='action')&&cur){
    const atkTargets=targetsInRange(cur,cur.rng,'enemy');
    const bA=document.createElement('button'); bA.textContent='ATTACK';
    bA.disabled=atkTargets.length===0;
    bA.onclick=()=>startTarget('attack');
    a.appendChild(bA);
    for(const s2 of cur.spells){
      const list=spellTargets(cur,s2);
      const bS=document.createElement('button'); bS.textContent=s2.name;
      bS.disabled=cur.mp<s2.cost||list.length===0;
      bS.onclick=()=>startTarget('spell',s2);
      a.appendChild(bS);
    }
    if(cur.special&&!cur.special.used){
      const bX=document.createElement('button'); bX.className='special';
      bX.textContent='✦ '+cur.special.name;
      if(cur.special.type==='cryo') bX.disabled=!units.some(u=>u.side==='ally'&&!u.alive);
      if(cur.special.type==='riftbreak') bX.disabled=atkTargets.length===0;
      bX.onclick=()=>useSpecial();
      a.appendChild(bX);
    }
    if(Object.keys(BATTLE_ITEMS).some(n2=>inventory.includes(n2))){
      const bI=document.createElement('button'); bI.textContent='ITEM';
      bI.onclick=()=>{bstate='item'; renderActions();};
      a.appendChild(bI);
    }
    const cg=mission.config.cage;
    if(cg&&!cageSprung&&cur&&cur.side==='ally'&&Math.abs(cur.x-cg.at[0])+Math.abs(cur.y-cg.at[1])===1){
      const bG=document.createElement('button'); bG.className='special';
      bG.textContent=cg.label||'SPRING THE CAGE';
      bG.onclick=springCage;
      a.appendChild(bG);
    }
    const bW=document.createElement('button'); bW.textContent='WAIT';
    bW.onclick=()=>{moveSet.clear(); endTurn();};
    a.appendChild(bW);
    setHint(`${cur.name} — tap a blue tile to move (free until you act)`);
  } else if(bstate==='item'){
    for(const n2 of Object.keys(BATTLE_ITEMS)){
      const count=inventory.filter(i=>i===n2).length;
      if(!count) continue;
      const it=BATTLE_ITEMS[n2];
      const b=document.createElement('button');
      b.textContent=`${n2} ×${count} (${it.hint})`;
      b.disabled=!it.avail(cur);
      b.onclick=()=>useBattleItem(n2);
      a.appendChild(b);
    }
    const bC=document.createElement('button'); bC.textContent='CANCEL';
    bC.onclick=()=>{bstate='action'; renderActions();};
    a.appendChild(bC);
    setHint('Use an item on '+cur.name+' — this is the turn’s action');
  } else if(bstate==='target'){
    const bC=document.createElement('button'); bC.textContent='CANCEL';
    bC.onclick=()=>{targetSet.clear(); pendingAct=null; pendingSpell=null; bstate='action'; renderActions();};
    a.appendChild(bC);
    setHint('Select a red target');
  } else if(bstate==='blink'||bstate==='swap'){
    const bC=document.createElement('button'); bC.textContent='CANCEL';
    bC.onclick=()=>{specialSet.clear(); bstate='action'; renderActions();};
    a.appendChild(bC);
    setHint(bstate==='blink'?'BLINK — tap a glowing tile (free action)':'EXTRACTION — tap an ally to swap (free action)');
  } else if(bstate==='cryo'){
    for(const u of units.filter(u=>u.side==='ally'&&!u.alive)){
      const b=document.createElement('button'); b.className='special';
      b.textContent='↺ '+u.name;
      b.onclick=()=>doCryo(u);
      a.appendChild(b);
    }
    const bC=document.createElement('button'); bC.textContent='CANCEL';
    bC.onclick=()=>{bstate='action'; renderActions();};
    a.appendChild(bC);
    setHint('CRYO-CALL — choose who returns');
  } else if(bstate==='explore'){
    const bL=document.createElement('button'); bL.textContent='LEAVE AREA';
    bL.onclick=()=>finishFieldExplore();
    a.appendChild(bL);
    setHint('Field clear — tap anywhere to walk Dax · drag to look around');
  } else if(bstate==='exploreAnim'){
    setHint('…');
  } else if(bstate==='enemy'){
    setHint('Enemy phase…');
  } else if(bstate==='anim'||bstate==='event'){
    setHint('…');
  } else {
    setHint('—');
  }
}

/* — movement & pathing — */
function reachSearch(u){
  const best={}, prev={};
  best[bkey(u.x,u.y)]=0;
  const open=[[0,u.x,u.y]];
  while(open.length){
    open.sort((a,b)=>a[0]-b[0]);
    const [c,x,y]=open.shift();
    if(c>best[bkey(x,y)]) continue;
    for(const [dx,dy] of DIRS){
      const nx=x+dx, ny=y+dy;
      if(!inB(nx,ny)) continue;
      const t=TERRAIN[bGrid[ny][nx]];
      if(t.void && !u.fly) continue;
      const o=occ(nx,ny);
      if(o && o.side!==u.side) continue;   /* enemies are walls — body-blocking works */
      const nc=c+(u.fly?1:t.cost);
      if(nc>u.mov) continue;
      const k=bkey(nx,ny);
      if(best[k]===undefined||nc<best[k]){best[k]=nc; prev[k]=bkey(x,y); open.push([nc,nx,ny]);}
    }
  }
  return {best,prev};
}
function reachable(u){
  const {best}=reachSearch(u);
  const set=new Set();
  for(const k in best){
    const x=k%BCOLS, y=(k/BCOLS)|0;
    const o=occ(x,y);
    if(!o||o===u) set.add(Number(k));
  }
  return set;
}
function pathTo(u,tx,ty){
  const {best,prev}=reachSearch(u);
  let k=bkey(tx,ty);
  if(best[k]===undefined) return null;
  const path=[];
  const start=bkey(u.x,u.y);
  while(k!==start){ path.unshift([k%BCOLS,(k/BCOLS)|0]); k=prev[k]; }
  return path;
}
function anyPath(u,tx,ty){
  const prev={}; const start=bkey(u.x,u.y);
  const seen=new Set([start]); const q=[[u.x,u.y]];
  let steps=0;
  while(q.length&&steps++<600){
    const [x,y]=q.shift();
    if(x===tx&&y===ty){
      const path=[]; let k=bkey(x,y);
      while(k!==start){ path.unshift([k%BCOLS,(k/BCOLS)|0]); k=prev[k]; }
      return path;
    }
    for(const [dx,dy] of DIRS){
      const nx=x+dx, ny=y+dy;
      const k=bkey(nx,ny);
      if(seen.has(k)) continue;
      if(!inB(nx,ny)) continue;
      const t=TERRAIN[bGrid[ny][nx]];
      if(t.void&&!u.fly) continue;
      const o=occ(nx,ny);
      if(o&&o.side!==u.side) continue;
      seen.add(k); prev[k]=bkey(x,y); q.push([nx,ny]);
    }
  }
  return null;
}
async function walkUnit(u,tx,ty,msPerTile){
  if(u.x===tx&&u.y===ty) return;
  const path=pathTo(u,tx,ty)||anyPath(u,tx,ty);
  if(!path){ u.x=tx; u.y=ty; u.walk=null; return; }
  const per=fastMode?26:(msPerTile||110);
  for(const [nx,ny] of path){
    const fx=u.x*BT, fy=u.y*BT;
    camFocus(nx*BT+BT/2, ny*BT+BT/2);
    await tween(per, p=>{ u.walk={x:fx+(nx*BT-fx)*p, y:fy+(ny*BT-fy)*p}; });
    u.x=nx; u.y=ny;
  }
  u.walk=null;
}
function targetsInRange(u,rng,side){
  const wantSide = side==='ally' ? u.side : (u.side==='ally'?'enemy':'ally');
  return units.filter(t=>t.alive&&t.side===wantSide)
    .filter(t=>{const d=mdist(u,t); return d>=rng[0]&&d<=rng[1];});
}
function spellTargets(u,s2){
  if(s2.kind==='aura') return aliveOf(u.side).filter(t=>mdist(u,t)<=2&&t.hp<t.maxhp);
  if(s2.kind==='heal'){
    const list=targetsInRange(u,s2.rng,'ally').filter(t=>t.hp<t.maxhp&&t!==u);
    if(s2.rng[0]===0&&u.hp<u.maxhp) list.push(u);
    return list;
  }
  return targetsInRange(u,s2.rng,'enemy');
}

/* — battle items: using one is the unit's ACTION for the turn (no XP).
   Effects live here; the shop in town.js just sells the names. — */
const BATTLE_ITEMS={
  'Ration Pack':{ hint:'+12 HP',
    avail:u=>u.hp<u.maxhp,
    use:u=>{ const amt=Math.min(12,u.maxhp-u.hp); u.hp+=amt;
      floatText(u.x,u.y,'+'+amt,'#48e060');
      log(`${tag(u)} tears open a RATION PACK — recovers <b>${amt}</b> HP.`); }},
  'Repair Spray':{ hint:'+18 HP',
    avail:u=>u.hp<u.maxhp,
    use:u=>{ const amt=Math.min(18,u.maxhp-u.hp); u.hp+=amt;
      floatText(u.x,u.y,'+'+amt,'#48e060');
      log(`${tag(u)} hisses REPAIR SPRAY over the dents — recovers <b>${amt}</b> HP.`); }},
  'Cell Pack':{ hint:'+8 MP',
    avail:u=>u.maxmp>0&&u.mp<u.maxmp,
    use:u=>{ const amt=Math.min(8,u.maxmp-u.mp); u.mp+=amt;
      floatText(u.x,u.y,'+'+amt+' MP','#7ce8ff');
      log(`${tag(u)} slots a fresh CELL PACK — recovers <b>${amt}</b> MP.`); }},
};
function useBattleItem(n2){
  const it=BATTLE_ITEMS[n2];
  const idx=inventory.indexOf(n2);
  if(!it||idx<0||!it.avail(cur)) return;
  inventory.splice(idx,1);
  bstate='anim'; renderActions();
  it.use(cur);
  renderCard(cur);
  moveSet.clear();
  setTimeout(endTurn, fastMode?120:550);
}

/* — combat math — */
function calcDamage(att,dfn,{ignoreDef=false,bonus=0,mult=1}={}){
  let raw=Math.max(1, att.atk-(ignoreDef?0:effDef(dfn)))+bonus;
  if(att.weapon&&att.weapon.strongVs&&dfn.cls&&dfn.cls.indexOf(att.weapon.strongVs)>=0) raw+=2;
  raw*=(0.9+Math.random()*0.2)*mult;
  let crit=false;
  if(Math.random()<0.08){raw*=1.5; crit=true;}
  return {dmg:Math.max(1,Math.round(raw)), crit};
}
function xpFromDmg(dmg){ return Math.min(10, Math.max(2, Math.round(dmg*0.9))); }
function applyDeath(u,credit){
  u.alive=false; u.bulwark=false;
  if(u.side==='npc'){
    log(`<span class="e">${u.name} is cut down.</span>`);
    if(mission.onNpcDeath) mission.onNpcDeath(u);
  } else log(`${tag(u)} is destroyed!`);
  if(u.side==='ally') casualties++;
  if(credit&&credit.side==='ally') giveXP(credit,10);
  if(u.boss&&!gameOver){
    if(units.filter(t=>t.side==='enemy'&&t.boss&&t.alive).length===0) battleWon();
  }
}
async function killUnit(u,credit){
  const px2=u.x*BT+BT/2, fy=u.y*BT+BT-4;
  const pxs=spritePixels(u.spr,PXS);
  const rw=SPRITES[u.spr][0].length;
  for(const p of pxs){
    if(Math.random()<.55) continue;
    impacts.push({type:'part', x:px2-(rw/2)*PXS+p.x, y:fy-SPRITES[u.spr].length*PXS+p.y, col:p.col,
      vx:(Math.random()-.5)*.18, vy:-.05-Math.random()*.14, t:0});
  }
  applyDeath(u,credit);
  if(!fastMode) await wait(450);
}

/* ═══ CINEMATIC BATTLE SCENES (FAST OFF) ═══ */
let scene=null;
const SC={allyX:354, enemyX:126, groundY:296, scale:5};
let sceneBG=null;
function makeSceneBG(){
  if(sceneBG) return;
  sceneBG=document.createElement('canvas');
  sceneBG.width=cv.width; sceneBG.height=cv.height;
  const g=sceneBG.getContext('2d');
  const rnd=mulberry(777);
  const gr=g.createLinearGradient(0,0,0,cv.height);
  gr.addColorStop(0,'#05060f'); gr.addColorStop(.55,'#0b0d24'); gr.addColorStop(1,'#141033');
  g.fillStyle=gr; g.fillRect(0,0,cv.width,cv.height);
  for(let i=0;i<70;i++){
    g.fillStyle=`rgba(210,225,255,${.2+rnd()*.7})`;
    g.fillRect((rnd()*cv.width)|0,(rnd()*cv.height*.7)|0, rnd()<.8?2:3, rnd()<.8?2:3);
  }
  for(const [nx,ny,r2,col] of [[70,55,60,'rgba(120,80,200,.10)'],[390,90,75,'rgba(60,140,200,.08)'],[240,40,45,'rgba(200,80,140,.07)']]){
    g.fillStyle=col;
    g.beginPath(); g.arc(nx,ny,r2,0,7); g.fill();
  }
  g.fillStyle='#241d30';
  for(const [bx,bw,bh] of [[26,100,20],[158,70,14],[268,110,24],[398,84,18]]){
    g.beginPath(); g.ellipse(bx+bw/2,SC.groundY+6,bw/2,bh,0,Math.PI,0); g.fill();
  }
  g.fillStyle='#38304a';
  g.fillRect(0,SC.groundY+4,cv.width,cv.height-SC.groundY-4);
  g.fillStyle='#463a58';
  g.fillRect(0,SC.groundY+4,cv.width,3);
  const rnd2=mulberry(31);
  for(let i=0;i<32;i++){
    g.fillStyle= rnd2()<.5?'#2e2740':'#544868';
    g.fillRect(rnd2()*cv.width, SC.groundY+10+rnd2()*(cv.height-SC.groundY-14), 4,3);
  }
}
function newScene(att,dfn){
  const ally=att.side==='ally'?att:dfn;
  const enemy=att.side==='ally'?dfn:att;
  return {att,dfn,ally,enemy, off:{}, sflash:{}, hide:{}, shake:0, fade:1, pops:[], fx:[], parts:[], banner:null};
}
function scX(u){
  const base=u.side==='ally'?SC.allyX:SC.enemyX;
  const off=scene.off[u.id]||0;
  return base + (u.side==='ally'? -off : off);
}
async function sceneIn(){ await tween(240, p=>{ scene.fade=1-p; }); }
async function sceneOut(){ await tween(240, p=>{ scene.fade=p; }); }
async function sLunge(u,amt,ms){
  const from=scene.off[u.id]||0;
  await tween(ms, p=>{ scene.off[u.id]=from+(amt-from)*ease(p); });
}
function addPop(u,text,color,big){
  scene.pops.push({x:scX(u), y:SC.groundY-SPRITES[u.spr].length*SC.scale-6, text, color, age:0, big:!!big});
}
function slashFX(u,color){ scene.fx.push({type:'slash', x:scX(u), y:SC.groundY-46, t:0, color}); }
function sRingFX(u,color){ scene.fx.push({type:'ring', x:scX(u), y:SC.groundY-SPRITES[u.spr].length*SC.scale/2, t:0, color}); }
function sSparkFX(u,color){
  for(let i=0;i<12;i++){
    scene.fx.push({type:'spark', x:scX(u)+(Math.random()*64-32), y:SC.groundY-Math.random()*90, t:0, vy:-.06-Math.random()*.08, color});
  }
}
async function procCutIn(name){
  scene.banner={text:'✦ '+name+' ✦', t:0};
  await tween(920, p=>{ if(scene.banner) scene.banner.t=p; });
  scene.banner=null;
}
async function sceneDeath(u,credit){
  const rows=SPRITES[u.spr];
  const rw=rows[0].length;
  const fx=scX(u), fy=SC.groundY;
  const ox2=fx-(rw/2)*SC.scale, oy2=fy-rows.length*SC.scale;
  for(const p of spritePixels(u.spr,SC.scale)){
    if(Math.random()<.5) continue;
    scene.parts.push({x:ox2+p.x, y:oy2+p.y, col:p.col, vx:(Math.random()-.5)*.2, vy:-.05-Math.random()*.16, t:0});
  }
  scene.hide[u.id]=true;
  applyDeath(u,credit);
  await wait(650);
}
async function sceneStrike(att,dfn,opts={},label){
  await sLunge(att,140,170);
  const le=landLE(dfn);
  const missed=!opts.sure && Math.random()<(0.08+le);
  if(missed){
    addPop(dfn,'MISS','#aab4d8');
    log(`${tag(att)} attacks ${tag(dfn)} — <span class="d">evaded!${le>0?' (terrain '+Math.round(le*100)+'%)':''}</span>`);
    await sLunge(dfn,-36,110);
    await sLunge(dfn,0,150);
  } else {
    const {dmg,crit}=calcDamage(att,dfn,opts);
    dfn.hp=Math.max(0,dfn.hp-dmg);
    slashFX(dfn, opts.fxColor||(crit?'#ffd23a':'#f0f4ff'));
    scene.sflash[dfn.id]=12;
    scene.shake=crit?12:8;
    addPop(dfn,(crit?'CRIT ':'')+dmg, crit?'#ffd23a':'#ffffff', crit);
    log(`${tag(att)} ${label||'attacks'} ${tag(dfn)} — <b>${dmg}</b> dmg${crit?' <span class="p">CRITICAL!</span>':''}`);
    if(att.side==='ally') giveXP(att, xpFromDmg(dmg));
    checkBossPhase(dfn);
    renderCard(dfn);
    await wait(400);
  }
  await sLunge(att,0,150);
  if(dfn.hp<=0&&dfn.alive) await sceneDeath(dfn,att);
}
async function strike(att,dfn,opts={},label){
  focusPair(att,dfn);
  await lungeMap(att,dfn.x,dfn.y,150);
  const le=landLE(dfn);
  const missed=!opts.sure && Math.random()<(0.08+le);
  if(missed){
    floatText(dfn.x,dfn.y,'MISS','#aab4d8');
    log(`${tag(att)} attacks ${tag(dfn)} — <span class="d">evaded!</span>`);
  } else {
    const {dmg,crit}=calcDamage(att,dfn,opts);
    dfn.hp=Math.max(0,dfn.hp-dmg);
    dfn.flash=12;
    floatText(dfn.x,dfn.y,(crit?'CRIT ':'')+dmg, crit?'#ffd23a':'#ffffff', crit);
    log(`${tag(att)} ${label||'attacks'} ${tag(dfn)} — <b>${dmg}</b> dmg${crit?' <span class="p">CRITICAL!</span>':''}`);
    if(att.side==='ally') giveXP(att, xpFromDmg(dmg));
    checkBossPhase(dfn);
    renderCard(dfn);
  }
  await unlunge(att,160);
  if(dfn.hp<=0&&dfn.alive) await killUnit(dfn,att);
}
async function lungeMap(u,tx,ty,ms){
  const dx=Math.sign(tx-u.x)*14, dy=Math.sign(ty-u.y)*14;
  await tween(fastMode?1:ms, p=>{ u.ox=dx*ease(p); u.oy=dy*ease(p); });
}
async function unlunge(u,ms){
  const fx=u.ox, fy=u.oy;
  await tween(fastMode?1:ms, p=>{ u.ox=fx*(1-ease(p)); u.oy=fy*(1-ease(p)); });
}
async function doAttack(att,dfn,opts={},label,cutin){
  bstate='anim'; renderActions();
  if(fastMode||att.side==='npc'||dfn.side==='npc'){ await strike(att,dfn,opts,label); return; }
  scene=newScene(att,dfn);
  await sceneIn();
  await wait(280);
  if(cutin) await procCutIn(cutin);
  await sceneStrike(att,dfn,opts,label);
  await wait(200);
  await sceneOut();
  scene=null;
}
async function doSpell(att,tgt,s2){
  bstate='anim'; renderActions();
  att.mp-=s2.cost;
  if(s2.kind==='aura'){
    focusUnit(att);
    impacts.push({type:'ring', x:att.x*BT+BT/2, y:att.y*BT+BT/2, t:0, color:'#48e060', max:BT*2.6});
    if(!fastMode) await wait(420);
    let n2=0;
    for(const t of aliveOf(att.side).filter(t=>mdist(att,t)<=2&&t.hp<t.maxhp)){
      const amt=s2.pow+Math.floor(Math.random()*3);
      t.hp=Math.min(t.maxhp,t.hp+amt);
      floatText(t.x,t.y,'+'+amt,'#48e060');
      n2++;
    }
    log(`${tag(att)} casts <span class="p">${s2.name}</span> — healing light washes over ${n2} allies`);
    giveXP(att, Math.min(10, 2*n2+2));
    if(!fastMode) await wait(520);
    return;
  }
  if(fastMode){
    focusPair(att,tgt);
    if(s2.kind==='heal'){
      const amt=s2.pow+Math.floor(Math.random()*3);
      tgt.hp=Math.min(tgt.maxhp,tgt.hp+amt);
      floatText(tgt.x,tgt.y,'+'+amt,'#48e060',true);
      log(`${tag(att)} casts <span class="p">${s2.name}</span> — ${tag(tgt)} recovers <b>${amt}</b> HP`);
      giveXP(att, Math.min(10, Math.max(2, Math.round(amt*0.9)))); /* heal XP = damage XP parity */
    } else {
      const amt=s2.pow+Math.floor(Math.random()*4);
      tgt.hp=Math.max(0,tgt.hp-amt);
      tgt.flash=12;
      floatText(tgt.x,tgt.y,amt,'#b47ae8',true);
      log(`${tag(att)} casts <span class="p">${s2.name}</span> — ${tag(tgt)} takes <b>${amt}</b> psionic dmg`);
      giveXP(att, Math.min(10, Math.max(2, Math.round(amt*0.9))));
      checkBossPhase(tgt);
      if(tgt.hp<=0&&tgt.alive) await killUnit(tgt,att);
    }
    renderCard(tgt);
    return;
  }
  scene=newScene(att,tgt);
  await sceneIn();
  await wait(260);
  sRingFX(att, s2.kind==='heal'?'#48e060':'#b47ae8');
  await wait(420);
  if(s2.kind==='heal'){
    const amt=s2.pow+Math.floor(Math.random()*3);
    tgt.hp=Math.min(tgt.maxhp,tgt.hp+amt);
    sSparkFX(tgt,'#48e060');
    addPop(tgt,'+'+amt,'#48e060',true);
    log(`${tag(att)} casts <span class="p">${s2.name}</span> — ${tag(tgt)} recovers <b>${amt}</b> HP`);
    giveXP(att, Math.min(10, Math.max(2, Math.round(amt*0.9)))); /* heal XP = damage XP parity */
    renderCard(tgt);
    await wait(520);
  } else {
    const amt=s2.pow+Math.floor(Math.random()*4);
    tgt.hp=Math.max(0,tgt.hp-amt);
    sRingFX(tgt,'#b47ae8');
    sRingFX(tgt,'#6a3aa8');
    scene.sflash[tgt.id]=12;
    scene.shake=9;
    addPop(tgt,amt,'#b47ae8',true);
    log(`${tag(att)} casts <span class="p">${s2.name}</span> — ${tag(tgt)} takes <b>${amt}</b> psionic dmg`);
    giveXP(att, Math.min(10, Math.max(2, Math.round(amt*0.9))));
    checkBossPhase(tgt);
    renderCard(tgt);
    await wait(520);
    if(tgt.hp<=0&&tgt.alive) await sceneDeath(tgt,att);
  }
  await sceneOut();
  scene=null;
}
function drawHPWindow(g,u,x,y,w){
  const h=52;
  const grd=g.createLinearGradient(0,y,0,y+h);
  grd.addColorStop(0,'#3448b8'); grd.addColorStop(1,'#16206e');
  g.fillStyle='#08081a';
  roundRect(g,x-2,y-2,w+4,h+4,7); g.fill();
  g.fillStyle=grd;
  roundRect(g,x,y,w,h,5); g.fill();
  g.strokeStyle='#f0f0f4'; g.lineWidth=2.5;
  roundRect(g,x,y,w,h,5); g.stroke();
  g.lineWidth=1;
  g.fillStyle=u.side==='ally'?'#7ce8ff':'#ff7088';
  g.font='8px "Press Start 2P", monospace';
  g.textAlign='left'; g.textBaseline='top';
  g.fillText(u.name.slice(0,20), x+8, y+7);
  g.fillStyle='#c8d4ff';
  g.font='7px "Press Start 2P", monospace';
  g.fillText('HP', x+8, y+22);
  const hpStr=`${u.hp}/${u.maxhp}`;
  g.textAlign='right';
  g.fillText(hpStr, x+w-8, y+22);
  g.textAlign='left';
  g.fillStyle='#08102e';
  g.fillRect(x+8,y+34,w-16,9);
  const frac=Math.max(0,u.hp/u.maxhp);
  g.fillStyle= frac>.4 ? '#48e060' : frac>.2 ? '#ffd23a' : '#ff5470';
  g.fillRect(x+9,y+35,(w-18)*frac,7);
  g.strokeStyle='#c8d4ff88';
  g.strokeRect(x+8.5,y+34.5,w-17,8);
}
function drawScene(now,dt){
  const g=cx;
  g.save();
  if(scene.shake>0){
    g.translate((Math.random()-.5)*scene.shake,(Math.random()-.5)*scene.shake);
    scene.shake*=.86;
    if(scene.shake<.6) scene.shake=0;
  }
  g.drawImage(sceneBG,0,0);
  for(const u of [scene.enemy, scene.ally]){
    if(scene.hide[u.id]) continue;
    const fx=scX(u);
    g.fillStyle='rgba(0,0,0,.45)';
    g.beginPath(); g.ellipse(fx,SC.groundY+7,44,9,0,0,7); g.fill();
  }
  for(const u of [scene.enemy, scene.ally]){
    if(scene.hide[u.id]) continue;
    const fx=scX(u);
    const hop=((now/360+(u.side==='ally'?0:1))|0)%2?0:-3;
    const flyLift=u.fly? -8-3*Math.sin(now/300) : 0;
    drawSprite(g,u.spr,fx,SC.groundY+flyLift,SC.scale,u.side==='ally',hop);
    if(scene.sflash[u.id]>0){
      scene.sflash[u.id]--;
      if(scene.sflash[u.id]%4<2){
        drawSilhouette(g,u.spr,fx,SC.groundY+flyLift,SC.scale,u.side==='ally',hop,'#ffffff',.85);
      }
    }
  }
  for(const f of scene.fx){
    f.t+=dt;
    if(f.type==='slash'){
      const p=Math.min(1,f.t/240);
      if(p<1){
        g.save();
        g.translate(f.x,f.y);
        g.rotate(-.7);
        g.fillStyle=f.color;
        g.globalAlpha=1-p;
        const len=110*p+30;
        g.fillRect(-len/2, -4, len, 8);
        g.fillRect(-len/3, 8, len*.66, 4);
        g.restore();
        g.globalAlpha=1;
      }
    } else if(f.type==='ring'){
      const p=Math.min(1,f.t/520);
      if(p<1){
        g.strokeStyle=f.color;
        g.globalAlpha=(1-p)*.9;
        g.lineWidth=3.5;
        g.beginPath(); g.arc(f.x,f.y, 12+p*66, 0, 7); g.stroke();
        g.beginPath(); g.arc(f.x,f.y, 5+p*40, 0, 7); g.stroke();
        g.globalAlpha=1; g.lineWidth=1;
      }
    } else if(f.type==='spark'){
      const p=Math.min(1,f.t/700);
      if(p<1){
        g.fillStyle=f.color;
        g.globalAlpha=1-p;
        g.fillRect(f.x, f.y+f.vy*f.t*8, 4,4);
        g.globalAlpha=1;
      }
    }
  }
  scene.fx=scene.fx.filter(f=>f.t<(f.type==='spark'?700:f.type==='ring'?520:240));
  for(const p of scene.parts){
    p.t+=dt;
    p.x+=p.vx*dt; p.y+=p.vy*dt; p.vy+=.004*dt;
    g.globalAlpha=Math.max(0,1-p.t/750);
    g.fillStyle=p.col;
    g.fillRect(p.x,p.y,SC.scale-1,SC.scale-1);
  }
  g.globalAlpha=1;
  scene.parts=scene.parts.filter(p=>p.t<750);
  for(const p of scene.pops){
    p.age++;
    const rise=p.age*1.0;
    g.globalAlpha=Math.max(0,1-p.age/60);
    g.font=(p.big?'19px':'14px')+' "Press Start 2P", monospace';
    g.textAlign='center'; g.textBaseline='alphabetic';
    g.fillStyle='#000';
    g.fillText(p.text,p.x+2,p.y-rise+2);
    g.fillStyle=p.color;
    g.fillText(p.text,p.x,p.y-rise);
    g.globalAlpha=1;
  }
  scene.pops=scene.pops.filter(p=>p.age<60);
  drawHPWindow(g, scene.enemy, 10, cv.height-62, 190);
  drawHPWindow(g, scene.ally, cv.width-200, cv.height-62, 190);
  if(scene.banner){
    const t=scene.banner.t;
    const inP=Math.min(1,t/.18);
    const outP=t>.82? (t-.82)/.18 : 0;
    const al=inP*(1-outP);
    g.fillStyle=`rgba(4,5,14,${.72*al})`;
    g.fillRect(0,110,cv.width,86);
    g.fillStyle=`rgba(255,210,58,${.9*al})`;
    g.fillRect(0,110,cv.width,3);
    g.fillRect(0,193,cv.width,3);
    const sc2=.7+ease(inP)*.3;
    g.save();
    g.translate(cv.width/2,153);
    g.scale(sc2,sc2);
    g.globalAlpha=al;
    g.font='15px "Press Start 2P", monospace';
    g.textAlign='center'; g.textBaseline='middle';
    g.fillStyle='#000';
    g.fillText(scene.banner.text,3,3);
    g.fillStyle='#ffd23a';
    g.fillText(scene.banner.text,0,0);
    g.restore();
    g.globalAlpha=1;
  }
  g.restore();
  if(scene.fade>0){
    g.fillStyle=`rgba(3,4,10,${scene.fade})`;
    g.fillRect(0,0,cv.width,cv.height);
  }
}

/* — specials — */
function useSpecial(){
  const sp2=cur.special;
  if(sp2.type==='riftbreak'){ startTarget('riftbreak'); return; }
  if(sp2.type==='jolt'){ startTarget('jolt'); return; }
  if(sp2.type==='rush'){
    sp2.used=true; kharnRushPending=true;
    pushBanner('✦ LUNAR RUSH ✦','#b47ae8');
    log(`<span class="s">✦ ${tag(cur)} howls at the far moons — he will act AGAIN after this turn.</span>`);
    renderCard(cur); renderActions(); return;
  }
  if(sp2.type==='bulwark'){
    sp2.used=true; cur.bulwark=true;
    pushBanner('✦ BULWARK ✦','#b47ae8');
    log(`<span class="s">✦ ${tag(cur)} locks into fortress stance. Nearby enemies can't ignore him.</span>`);
    moveSet.clear(); renderCard(cur);
    endTurn(); return;
  }
  if(sp2.type==='blink'){
    specialSet.clear();
    for(let y=0;y<BROWS;y++)for(let x=0;x<BCOLS;x++){
      const d=Math.abs(x-cur.x)+Math.abs(y-cur.y);
      if(d===0||d>3) continue;
      const t=TERRAIN[bGrid[y][x]];
      if(t.void&&!cur.fly) continue;
      if(occ(x,y)) continue;
      specialSet.add(bkey(x,y));
    }
    bstate='blink'; renderActions(); return;
  }
  if(sp2.type==='swap'){
    specialSet.clear();
    for(const t of aliveOf('ally')) if(t!==cur) specialSet.add(bkey(t.x,t.y));
    bstate='swap'; renderActions(); return;
  }
  if(sp2.type==='cryo'){ bstate='cryo'; renderActions(); return; }
}
/* — the impound cage: one lever, one price (Tithe Night's twist) — */
async function springCage(){
  const cg=mission.config.cage;
  if(!cg||cageSprung) return;
  cageSprung=true;
  bstate='anim'; renderActions();
  const cd=CREW_DATA.find(c=>c.id===cg.unit);
  const u=buildCrewUnit(cd,cg.deployAt[0],cg.deployAt[1]);
  units.push(u);
  queue.push(u);
  impacts.push({type:'ring', x:cg.at[0]*BT+BT/2, y:cg.at[1]*BT+BT/2, t:0, color:'#ffd23a', max:BT*2});
  pushBanner('▸ '+u.name+' JOINS THE LINE ◂','#48e060');
  log(`<span class="s">✦ The cage lock shears. ${tag(u)}: "RELEASED. I'll be filing my objections in PERSON."</span>`);
  focusUnit(u);
  if(!fastMode) await wait(700);
  moveSet.clear();
  await endTurn();
}
async function doCryo(fallen){
  cur.special.used=true;
  bstate='anim'; renderActions();
  let spot=null;
  outer: for(let r2=1;r2<=4;r2++){
    for(let dy=-r2;dy<=r2;dy++)for(let dx=-r2;dx<=r2;dx++){
      if(Math.abs(dx)+Math.abs(dy)!==r2) continue;
      const nx=cur.x+dx, ny=cur.y+dy;
      if(!inB(nx,ny)) continue;
      const t=TERRAIN[bGrid[ny][nx]];
      if(t.void) continue;
      if(occ(nx,ny)) continue;
      spot={x:nx,y:ny}; break outer;
    }
  }
  if(!spot) spot={x:cur.x,y:cur.y};
  fallen.alive=true;
  fallen.hp=Math.ceil(fallen.maxhp/2);
  fallen.x=spot.x; fallen.y=spot.y;
  casualties=Math.max(0,casualties-1);
  pushBanner('✦ CRYO-CALL ✦','#7ce8ff');
  impacts.push({type:'ring', x:spot.x*BT+BT/2, y:spot.y*BT+BT/2, t:0, color:'#7ce8ff', max:BT*2});
  log(`<span class="s">✦ ${tag(cur)} opens the sanctum relay — ${tag(fallen)} steps back out of the cold.</span>`);
  giveXP(cur,8);
  if(!fastMode) await wait(800);
  moveSet.clear();
  endTurn();
}

/* — XP & leveling: wild rolls, hard floors — */
function giveXP(u,amt){
  if(u.side!=='ally'||gameOver) return;
  /* outleveled enemies teach less: past mission level +3, XP halves per 3
     levels of gap. Keeps promotion (L15) landing mid-Act-3, stops runaway
     leaders, makes benched crew catch up fast — see DESIGN.md XP doctrine.
     Every mission declares its lvl (kr7.js template). */
  const gap=u.lvl-(mission.lvl||1);
  if(gap>=4) amt=Math.max(1,Math.round(amt*Math.pow(0.5,(gap-3)/3)));
  u.xp+=amt;
  floatText(u.x,u.y,'+'+amt+' XP','#ffd23a');
  while(u.xp>=XP_PER_LEVEL){
    u.xp-=XP_PER_LEVEL;
    levelUp(u);
  }
  if(cur===u) renderCard(u);
}
function levelUp(u){
  u.lvl++;
  const r=Math.random;
  let hpG = r()<.08?3 : r()<.55?2 : 1;
  let atkG = r()<.08?2 : r()<.5?1 : 0;
  let defG = r()<.45?1 : 0;
  let agiG = r()<.08?2 : r()<.5?1 : 0;
  const hpFloor=u.base.maxhp+2*(u.lvl-1);
  const atkFloor=u.base.atk+Math.floor((u.lvl-1)/2);
  u.maxhp+=hpG; u.hp+=hpG;
  u.atk+=atkG; u.def+=defG; u.agi+=agiG;
  if(u.maxhp<hpFloor){ const b=hpFloor-u.maxhp; u.maxhp+=b; u.hp+=b; hpG+=b; }
  if(u.atk<atkFloor){ atkG+=atkFloor-u.atk; u.atk=atkFloor; }
  /* casters grow +1 max MP every even level — spells stay relevant across
     nine acts instead of flatlining at 3-4 casts per battle forever */
  let mpG=0;
  if(u.maxmp>0&&u.lvl%2===0){ mpG=1; u.maxmp++; u.mp++; }
  pushBanner(`✦ ${u.name} — LV ${u.lvl} ✦`);
  const bits=[`HP +${hpG}`];
  if(atkG) bits.push(`ATK +${atkG}`);
  if(defG) bits.push(`DEF +${defG}`);
  if(agiG) bits.push(`AGI +${agiG}`);
  if(mpG) bits.push(`MP +${mpG}`);
  log(`<span class="p">✦ ${tag(u)} reaches level ${u.lvl}! ${bits.join(' · ')}</span>`);
  const learned=u.learn[u.lvl];
  if(learned){
    u.spells.push(Object.assign({},learned));
    log(`<span class="s">✦ ${tag(u)} learns ${learned.name}!</span>`);
    pushBanner(`☄ ${u.name}: ${learned.name} ☄`,'#b47ae8');
  }
}

/* — events — */
function scheduleAsteroids(){
  warnTiles=[];
  const stormCfg=mission.config.storm;
  if(!stormCfg) return;
  const ok=(x,y)=>inB(x,y)&&bGrid[y][x]!==4;
  const taken=new Set();
  let guard=0, smalls=0;
  const nSmall=stormCfg.smalls!==undefined?stormCfg.smalls:6;
  const nBig=stormCfg.bigs!==undefined?stormCfg.bigs:2;
  while(smalls<nSmall&&guard++<300){
    const x=(Math.random()*BCOLS)|0, y=(Math.random()*BROWS)|0;
    if(!ok(x,y)||taken.has(bkey(x,y))) continue;
    taken.add(bkey(x,y));
    warnTiles.push({x,y,big:false});
    smalls++;
  }
  let bigs=0; guard=0;
  while(bigs<nBig&&guard++<300){
    const x=(Math.random()*(BCOLS-1))|0, y=(Math.random()*(BROWS-1))|0;
    const cells=[[x,y],[x+1,y],[x,y+1],[x+1,y+1]].filter(([a,b])=>ok(a,b));
    if(cells.length<3) continue;
    if(cells.some(([a,b])=>taken.has(bkey(a,b)))) continue;
    for(const [a,b] of cells){ taken.add(bkey(a,b)); warnTiles.push({x:a,y:b,big:true}); }
    bigs++;
  }
  impactRound=round+1;
  if(!stormAnnounced){
    stormAnnounced=true;
    pushBanner('⚠ THE BELT IS FALLING ⚠','#ff7088');
    log(`<span class="ev">⚠ KR-7 has drifted into a debris stream — rocks will fall EVERY round. Marked tiles are struck next round. Big markers are 2×2 heavy impacts. Keep moving.</span>`);
  } else {
    log(`<span class="ev">⚠ New impact warnings light up across the field.</span>`);
  }
}
async function resolveAsteroids(){
  bstate='event'; renderActions();
  camFocus(WORLD_W/2, WORLD_H/2);
  pushBanner('☄ IMPACT ☄','#ff7088');
  log(`<span class="ev">☄ The debris stream hammers the field!</span>`);
  const pending=warnTiles;
  warnTiles=[]; impactRound=-1;
  for(const w of pending){
    impacts.push({type:'boom', x:w.x*BT+BT/2, y:w.y*BT+BT/2, t:0});
    const u=occ(w.x,w.y);
    if(u){
      const dmg=w.big?10:8;
      u.hp=Math.max(0,u.hp-dmg);
      u.flash=12;
      floatText(w.x,w.y,dmg,'#ff7088',true);
      log(`${tag(u)} is struck by ${w.big?'a HEAVY meteor':'falling rock'} — <b>${dmg}</b> dmg`);
      checkBossPhase(u);
      if(u.hp<=0&&u.alive) await killUnit(u,null);
    } else if(Math.random()<(w.big?.45:.3) && bGrid[w.y][w.x]===0){
      bGrid[w.y][w.x]=1; /* new boulder — the field itself changes */
    }
  }
  if(!fastMode) await wait(650);
}
function callReinforcements(){
  reinforced=true;
  const rc=mission.config.reinforcements;
  if(!rc) return;
  let placed=0;
  for(const [x,y] of rc.spawns){
    if(placed>=rc.count) break;
    if(bGrid[y][x]===4||occ(x,y)) continue;
    const u=mkUnit(Object.assign({side:'enemy'}, rc.unit, {id:'rf'+placed, x, y}));
    units.push(u);
    queue.push(u);
    impacts.push({type:'ring', x:x*BT+BT/2, y:y*BT+BT/2, t:0, color:'#ff7088', max:BT*1.5});
    placed++;
  }
  if(placed){
    pushBanner('⚠ REINFORCEMENTS ⚠','#ff7088');
    log(`<span class="ev">⚠ ${rc.bark||'Enemy reinforcements arrive!'} ${placed} more drop in.</span>`);
  }
}
function checkBossPhase(u){
  const bp=mission.config.bossPhase;
  if(!bp) return;
  if(u.boss&&u.alive&&u.hp<=u.maxhp*(bp.at||0.5)&&!phase2) phasePending=true;
}
async function bossPhaseEvent(){
  phasePending=false; phase2=true;
  bstate='event'; renderActions();
  const bp=mission.config.bossPhase;
  const boss=units.find(u=>u.boss);
  camFocus(13.5*BT, 5.5*BT);
  pushBanner(bp.banner||'▼ PHASE TWO ▼','#48e0d0');
  log(`<span class="ev">${bp.logIntro||''}</span>`);
  if(!fastMode) await wait(600);
  if(bp.openChasm){
    for(const [x,y] of chasmTiles){
      bGrid[y][x]=4;
      impacts.push({type:'boom', x:x*BT+BT/2, y:y*BT+BT/2, t:0});
      const u=occ(x,y);
      if(u&&!u.fly){
        let spot=null;
        outer: for(let r2=1;r2<=4;r2++){
          for(let dy=-r2;dy<=r2;dy++)for(let dx=-r2;dx<=r2;dx++){
            if(Math.abs(dx)+Math.abs(dy)!==r2) continue;
            const nx=x+dx, ny=y+dy;
            if(!inB(nx,ny)) continue;
            if(TERRAIN[bGrid[ny][nx]].void) continue;
            if(occ(nx,ny)) continue;
            spot={x:nx,y:ny}; break outer;
          }
        }
        if(spot){ u.x=spot.x; u.y=spot.y; log(`${tag(u)} scrambles clear of the collapsing seam!`); }
      }
    }
  }
  if(boss&&boss.alive){
    boss.regen=bp.regen||0; boss.atk+=(bp.atk||0);
    log(`<span class="ev">${bp.logBuff||''}</span>`);
    renderCard(boss);
  }
  if(!fastMode) await wait(900);
}

/* — turn engine — */
function buildQueue(){
  queue=units.filter(u=>u.alive)
    .map(u=>({u, s:u.agi*(0.8+Math.random()*0.4)}))
    .sort((a,b)=>b.s-a.s)
    .map(o=>o.u);
  qi=0;
  onRoundStart();
}
function onRoundStart(){
  scheduleAsteroids(); /* every round: warn now, impact next round */
}
function checkEnd(){
  const h2=units.find(u=>u.id==='dax');
  if((h2&&!h2.alive) || aliveOf('ally').length===0){ showOverlay(false); return true; }
  return gameOver;
}
function battleWon(){
  gameOver=true; bstate='over';
  harvestProgress(); /* victory locks in levels/XP — BEFORE explore-phase
    POIs mutate units, so weapon pickups don't double-count (save.js) */
  saveGame('battle');
  const lvls=units.filter(u=>u.side==='ally').map(u=>`${u.name.split(' ')[0]} LV${u.lvl}`).join(' · ');
  log(`<span class="round">— VICTORY — ${round} rounds · ${casualties} crew lost · ${lvls}</span>`);
  renderActions();
  if(mission.config.explore){ setTimeout(startFieldExplore, fastMode?400:900); return; }
  setTimeout(mission.onWin||startTempleRise, fastMode?500:1200);
}
/* ═══ FIELD EXPLORATION — the battle ends; the map doesn't ═══ */
function startFieldExplore(){
  const dax=units.find(u=>u.id==='dax'&&u.alive);
  if(!dax){ (mission.onWin||startTempleRise)(); return; }
  bstate='explore';
  cur=dax; moveSet.clear(); targetSet.clear();
  pushBanner('▸ FIELD CLEAR ◂','#48e060');
  log(`<span class="ev">▸ The field is yours. Walk Dax anywhere — search the corners before you LEAVE. Some things out here won't wait forever.</span>`);
  focusUnit(dax);
  renderCard(dax); renderActions();
}
function finishFieldExplore(){
  bstate='over'; renderActions();
  setTimeout(mission.onWin||startTempleRise, 300);
}
function triggerPoi(poi){
  poi.done=true;
  poi.onUse(()=>{ if(bstate!=='over'){ bstate='explore'; renderActions(); } });
}
function showOverlay(win){
  if(win){ battleWon(); return; }
  gameOver=true; bstate='over';
  showOverlayRaw('THE FORCE FALLS',
    (mission.loseText||'Dax has fallen.')+` (round ${round})`, true);
  renderActions();
}
function showOverlayRaw(title, sub, lose){
  const ov=document.getElementById('overlay');
  const t=document.getElementById('ov-title');
  t.textContent=title;
  t.className=lose?'lose':'';
  document.getElementById('ov-sub').textContent=sub;
  ov.classList.add('show');
}
async function endTurn(){
  moveSet.clear(); targetSet.clear(); specialSet.clear();
  pendingAct=null; pendingSpell=null;
  if(cur && cur.alive && !cur.fly && TERRAIN[bGrid[cur.y][cur.x]].hazard){
    const h2=TERRAIN[bGrid[cur.y][cur.x]].hazard;
    cur.hp=Math.max(0,cur.hp-h2);
    floatText(cur.x,cur.y,h2+' VENT','#48e0d0');
    log(`${tag(cur)} takes <b>${h2}</b> dmg <span class="d">(crystal vent)</span>`);
    checkBossPhase(cur);
    if(cur.hp<=0&&cur.alive) await killUnit(cur,null);
    if(!fastMode) await wait(300);
  }
  if(gameOver) return;
  if(checkEnd()) return;
  if(phasePending){ await bossPhaseEvent(); if(checkEnd()) return; }
  if(!reinforced && mission.config.reinforcements){
    const rc=mission.config.reinforcements;
    const boss=units.find(u=>u.boss);
    const minions=units.filter(u=>u.side==='enemy'&&!u.boss&&u.alive).length;
    if(boss&&boss.alive&&(round>=(rc.onRound||3)||minions<=(rc.orWhenMinionsLeq||3))) callReinforcements();
  }
  if(kharnRushPending&&cur&&cur.id==='kharn'&&cur.alive){
    kharnRushPending=false;
    queue.splice(qi+1,0,cur);
  }
  qi++;
  nextTurn();
}
async function nextTurn(){
  if(gameOver) return;
  while(qi<queue.length && !queue[qi].alive) qi++;
  if(qi>=queue.length){
    round++;
    const obj=mission.config.objective;
    if(obj&&obj.type==='survive'&&round>obj.rounds){
      pushBanner(obj.banner||'▸ HELD ◂','#48e060');
      if(obj.winLog) log(`<span class="ev">${obj.winLog}</span>`);
      battleWon(); return;
    }
    log(`<span class="round">— ROUND ${round} —</span>`);
    if(impactRound===round){
      await resolveAsteroids();
      if(gameOver||checkEnd()) return;
    }
    buildQueue();
  }
  cur=queue[qi];
  if(!cur.alive){ qi++; nextTurn(); return; }
  if(cur.stunned){
    cur.stunned=false;
    floatText(cur.x,cur.y,'STUNNED','#ffd23a');
    log(`${tag(cur)} is STUNNED — its turn fizzles out.`);
    qi++; nextTurn(); return;
  }
  if(cur.bulwark){ cur.bulwark=false; log(`${tag(cur)} relaxes out of BULWARK stance.`); }
  if(cur.regen>0&&cur.hp<cur.maxhp){
    cur.hp=Math.min(cur.maxhp,cur.hp+cur.regen);
    floatText(cur.x,cur.y,'+'+cur.regen,'#48e060');
    log(`${tag(cur)} regenerates <b>${cur.regen}</b> HP <span class="d">(astril)</span>`);
  }
  focusUnit(cur);
  renderCard(cur);
  if(cur.side==='enemy'){
    bstate='enemy'; renderActions();
    await aiTurn(cur);
  } else if(cur.side==='npc'){
    bstate='enemy'; renderActions();
    await npcTurn(cur);
  } else {
    moveSet=reachable(cur);
    bstate='move'; renderActions();
  }
}
/* — green units: hold one round, then run for the safe zone — */
async function npcTurn(u){
  await wait(fastMode?100:320);
  if(round<=1){
    log(`<span class="n">${u.name}</span> freezes where she stands.`);
    await endTurn(); return;
  }
  const goal=u.fleeTo||{x:2,y:7};
  const reach=reachable(u);
  reach.add(bkey(u.x,u.y));
  let bt=null;
  for(const k of reach){
    const x=k%BCOLS, y=(k/BCOLS)|0;
    const d=Math.abs(goal.x-x)+Math.abs(goal.y-y);
    const s2=-d*3+tilePenalty(u,x,y);
    if(!bt||s2>bt.s2) bt={x,y,s2};
  }
  if(bt&&(bt.x!==u.x||bt.y!==u.y)){
    log(`<span class="n">${u.name}</span> runs for the pads!`);
    await walkUnit(u,bt.x,bt.y);
  }
  const sz=u.safe;
  if(sz && u.x<=sz.x && u.y>=sz.y0 && u.y<=sz.y1){
    u.alive=false; u.rescued=true;
    impacts.push({type:'ring', x:u.x*BT+BT/2, y:u.y*BT+BT/2, t:0, color:'#48e060', max:BT*1.6});
    pushBanner('▸ '+u.name+' IS SAFE ◂','#48e060');
    if(u.safeBark) log(`<span class="n">${u.safeBark}</span>`);
    if(mission.onNpcRescued) mission.onNpcRescued(u);
  }
  await endTurn();
}

/* — AI: kills first, then the wounded, then the squishy — */
function tilePenalty(u,x,y){
  let p=0;
  if(isWarned(x,y)) p-=35;
  if(!u.fly&&TERRAIN[bGrid[y][x]].hazard) p-=20;
  p+=TERRAIN[bGrid[y][x]].le*18;
  return p;
}
async function aiTurn(u){
  await wait(fastMode?120:380);
  const reach=reachable(u);
  reach.add(bkey(u.x,u.y));
  const gunnar=units.find(t=>t.id==='gunnar');
  const tauntOn=gunnar&&gunnar.alive&&gunnar.bulwark;
  let gunnarHittable=false;
  if(tauntOn){
    for(const k of reach){
      const x=k%BCOLS, y=(k/BCOLS)|0;
      const d=Math.abs(gunnar.x-x)+Math.abs(gunnar.y-y);
      if(d>=u.rng[0]&&d<=u.rng[1]){gunnarHittable=true; break;}
    }
  }
  let best=null;
  for(const k of reach){
    const x=k%BCOLS, y=(k/BCOLS)|0;
    for(const t of aliveOf('ally').concat(aliveOf('npc'))){
      const d=Math.abs(t.x-x)+Math.abs(t.y-y);
      if(d<u.rng[0]||d>u.rng[1]) continue;
      if(tauntOn&&gunnarHittable&&t.id!=='gunnar') continue;
      const est=Math.max(1,u.atk-effDef(t));
      let score=(est>=t.hp?900:0);
      if(t.side==='npc') score+=(u.hunter?40:10); /* greens are hunted — visibly, never scripted */
      score+=(34-t.hp);
      if(t.maxmp>0) score+=22;
      if(effDef(t)<=4) score+=8;
      score-=landLE(t)*45;
      score+=tilePenalty(u,x,y);
      score-=(Math.abs(u.x-x)+Math.abs(u.y-y))*0.5;
      if(!best||score>best.score) best={x,y,t,score};
    }
  }
  if(best){
    await walkUnit(u,best.x,best.y);
    await doAttack(u,best.t);
  } else {
    const foes=aliveOf('ally').concat(aliveOf('npc'));
    let target=null, tscore=-1e9;
    for(const f of foes){
      let s2=-mdist(u,f)*2.2 + (f.maxmp>0?8:0) + (34-f.hp)*0.35;
      if(f.side==='npc') s2+=(u.hunter?40:10);
      if(tauntOn&&f.id!=='gunnar') s2-=100;
      if(s2>tscore){tscore=s2; target=f;}
    }
    let bt=null;
    for(const k of reach){
      const x=k%BCOLS, y=(k/BCOLS)|0;
      const d=Math.abs(target.x-x)+Math.abs(target.y-y);
      const s2=-d*3+tilePenalty(u,x,y);
      if(!bt||s2>bt.s2) bt={x,y,s2};
    }
    if(bt&&(bt.x!==u.x||bt.y!==u.y)){
      log(`${tag(u)} advances…`);
      await walkUnit(u,bt.x,bt.y);
    }
  }
  await endTurn();
}

/* — player input on the grid — */
function startTarget(act,spell){
  pendingAct=act; pendingSpell=spell||null;
  targetSet.clear();
  let list;
  if(act==='attack'||act==='riftbreak') list=targetsInRange(cur,cur.rng,'enemy');
  else if(act==='jolt') list=targetsInRange(cur,[1,1],'enemy');
  else list=spellTargets(cur,spell);
  if(spell&&spell.kind==='aura'){
    moveSet.clear();
    (async()=>{ await doSpell(cur,cur,spell); await endTurn(); })();
    return;
  }
  list.forEach(t=>targetSet.add(bkey(t.x,t.y)));
  bstate='target';
  renderActions();
}
function battleTap(clientX,clientY){
  if(dlgActive||scene) return;
  if(gameOver&&bstate!=='explore') return;
  const r=cv.getBoundingClientRect();
  const s=cv.width/r.width;
  const wx=(clientX-r.left)*s+camX;
  const wy=(clientY-r.top)*s+camY;
  const x=Math.floor(wx/BT), y=Math.floor(wy/BT);
  if(!inB(x,y)) return;
  const k=bkey(x,y);
  const o=occ(x,y);
  if(o) renderCard(o);
  if(bstate==='explore'){
    const dax=units.find(u=>u.id==='dax'&&u.alive);
    if(!dax) return;
    const poi=(mission.pois||[]).find(p=>!p.done&&p.x===x&&p.y===y);
    (async()=>{
      bstate='exploreAnim'; renderActions();
      if(poi){
        if(mdist(dax,poi)>1){
          let best=null;
          for(const [ddx,ddy] of DIRS){
            const ax=poi.x+ddx, ay=poi.y+ddy;
            if(!inB(ax,ay)) continue;
            const t=TERRAIN[bGrid[ay][ax]];
            if(t.void&&!dax.fly) continue;
            const oo=occ(ax,ay);
            if(oo&&oo!==dax) continue;
            const path=anyPath(dax,ax,ay);
            if(path&&(!best||path.length<best.path.length)) best={ax,ay,path};
          }
          if(best) await walkUnit(dax,best.ax,best.ay,85);
        }
        if(mdist(dax,poi)<=1){ triggerPoi(poi); return; }
      } else {
        const t=TERRAIN[bGrid[y][x]];
        const oo=occ(x,y);
        if(!(t.void&&!dax.fly)&&(!oo||oo===dax)) await walkUnit(dax,x,y,85);
      }
      bstate='explore'; renderActions();
    })();
    return;
  }
  if(bstate==='blink'){
    if(specialSet.has(k)){
      cur.special.used=true;
      impacts.push({type:'ring', x:cur.x*BT+BT/2, y:cur.y*BT+BT/2, t:0, color:'#b47ae8', max:BT});
      cur.x=x; cur.y=y;
      impacts.push({type:'ring', x:x*BT+BT/2, y:y*BT+BT/2, t:0, color:'#b47ae8', max:BT*1.3});
      pushBanner('✦ BLINK ✦','#b47ae8');
      log(`<span class="s">✦ ${tag(cur)} folds space and steps through — her turn continues.</span>`);
      specialSet.clear();
      moveSet=reachable(cur);
      focusUnit(cur);
      bstate='action';
      renderCard(cur); renderActions();
    }
    return;
  }
  if(bstate==='swap'){
    if(specialSet.has(k)&&o&&o.side==='ally'){
      cur.special.used=true;
      const tx2=cur.x, ty2=cur.y;
      cur.x=o.x; cur.y=o.y; o.x=tx2; o.y=ty2;
      impacts.push({type:'ring', x:cur.x*BT+BT/2, y:cur.y*BT+BT/2, t:0, color:'#ffd23a', max:BT*1.3});
      impacts.push({type:'ring', x:o.x*BT+BT/2, y:o.y*BT+BT/2, t:0, color:'#ffd23a', max:BT*1.3});
      pushBanner('✦ EXTRACTION ✦','#b47ae8');
      log(`<span class="s">✦ ${tag(cur)} hits the harness release — ${tag(o)} swaps out and Jet can still ACT.</span>`);
      specialSet.clear();
      moveSet=reachable(cur);
      focusUnit(cur);
      bstate='action';
      renderCard(cur); renderActions();
    }
    return;
  }
  if(bstate==='move'||bstate==='action'){
    if(moveSet.has(k)){
      const dest={x,y};
      bstate='anim'; renderActions();
      (async()=>{
        await walkUnit(cur,dest.x,dest.y,85);
        bstate='action';
        focusUnit(cur);
        renderActions(); renderCard(cur);
      })();
      return;
    }
  }
  if(bstate==='target'){
    if(targetSet.has(k)){
      const tgt=occ(x,y);
      if(!tgt) return;
      targetSet.clear();
      moveSet.clear(); /* acting locks your position */
      const act=pendingAct, spell=pendingSpell;
      pendingAct=null; pendingSpell=null;
      (async()=>{
        if(act==='attack') await doAttack(cur,tgt);
        else if(act==='riftbreak'){
          cur.special.used=true;
          log(`<span class="s">✦ ${tag(cur)}'s blade goes translucent — armor means nothing to it.</span>`);
          if(fastMode) pushBanner('✦ RIFTBREAK ✦','#b47ae8');
          await doAttack(cur,tgt,{ignoreDef:true,bonus:4,sure:true,fxColor:'#7ce8ff'},'rift-cuts','RIFTBREAK');
        }
        else if(act==='jolt'){
          cur.special.used=true;
          tgt.stunned=true;
          pushBanner('✦ JOLT PROD ✦','#b47ae8');
          impacts.push({type:'ring', x:tgt.x*BT+BT/2, y:tgt.y*BT+BT/2, t:0, color:'#ffd23a', max:BT*1.2});
          floatText(tgt.x,tgt.y,'STUN','#ffd23a',true);
          log(`<span class="s">✦ ${tag(cur)} jams the prod home — ${tag(tgt)} locks up. That one. Not yet.</span>`);
          if(!fastMode) await wait(500);
        }
        else await doSpell(cur,tgt,spell);
        await endTurn();
      })();
    }
  }
}

/* — rendering — */
let suppressBattleUnits=false;
function drawBattle(now,dt){
  camX+=(camTX-camX)*.14;
  camY+=(camTY-camY)*.14;
  const ox=Math.round(camX), oy=Math.round(camY);
  cx.save();
  cx.translate(-ox,-oy);
  const x0=Math.max(0,(ox/BT)|0), x1=Math.min(BCOLS-1,((ox+cv.width)/BT)|0);
  const y0=Math.max(0,(oy/BT)|0), y1=Math.min(BROWS-1,((oy+cv.height)/BT)|0);
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){
    const type=bGrid[y][x];
    cx.drawImage(batTiles[type][(x+y)%2], x*BT, y*BT);
    if(type===3){
      const a=.10+.10*Math.sin(now/300+x+y);
      cx.fillStyle=`rgba(72,224,208,${a})`;
      cx.fillRect(x*BT,y*BT,BT,BT);
    }
    if(type===5){
      const a=.06+.06*Math.sin(now/500+x*2+y);
      cx.fillStyle=`rgba(72,224,208,${a})`;
      cx.fillRect(x*BT,y*BT,BT,BT);
    }
    if(type===6){
      const a=.08+.08*Math.sin(now/700+x*0.9+y*0.7);
      cx.fillStyle=`rgba(139,224,78,${a})`;
      cx.fillRect(x*BT,y*BT,BT,BT);
    }
    if(type===7&&((now/1300+x*7+y*3)|0)%9===0){
      cx.fillStyle='rgba(139,224,78,.12)';
      cx.fillRect(x*BT+((x*7)%10+2)*PXS,y*BT+((y*11)%10+2)*PXS,2*PXS,PXS);
    }
  }
  if(mission.crashProp!==false){
  cx.save();
  cx.translate(1.5*BT, 12.35*BT);
  cx.rotate(-.2);
  drawSprite(cx,'ship',0,12,2.6,false,0);
  cx.restore();
  if((now|0)%110<18) bsmoke.push({x:1.1*BT+Math.random()*26, y:11.8*BT, r:3, t:0});
  }
  for(const sm of bsmoke){
    sm.t+=dt; sm.y-=.25; sm.x+=.09; sm.r+=.028;
    cx.fillStyle=`rgba(96,96,112,${Math.max(0,.4-sm.t/1500)})`;
    cx.beginPath(); cx.arc(sm.x,sm.y,sm.r,0,7); cx.fill();
  }
  bsmoke=bsmoke.filter(sm=>sm.t<1500);
  for(const w of warnTiles){
    const a=.22+.18*Math.sin(now/140);
    cx.fillStyle=w.big?`rgba(255,120,60,${a+.08})`:`rgba(255,84,112,${a})`;
    cx.fillRect(w.x*BT,w.y*BT,BT,BT);
    cx.strokeStyle=w.big?'rgba(255,180,90,.95)':'rgba(255,112,136,.9)';
    cx.lineWidth=w.big?3:2;
    cx.strokeRect(w.x*BT+3,w.y*BT+3,BT-6,BT-6);
    cx.lineWidth=1;
    cx.fillStyle=w.big?'#ffe0b0':'#ffd0d8';
    cx.font=(w.big?'20px':'14px')+' "Press Start 2P", monospace';
    cx.textAlign='center'; cx.textBaseline='middle';
    cx.fillText('!', w.x*BT+BT/2, w.y*BT+BT/2+1);
  }
  if(bstate==='move'||bstate==='action') for(const k of moveSet){
    const x=k%BCOLS, y=(k/BCOLS)|0;
    cx.fillStyle='rgba(124,232,255,.18)';
    cx.fillRect(x*BT,y*BT,BT,BT);
    cx.strokeStyle='rgba(124,232,255,.4)';
    cx.strokeRect(x*BT+1.5,y*BT+1.5,BT-3,BT-3);
  }
  if(bstate==='blink'||bstate==='swap') for(const k of specialSet){
    const x=k%BCOLS, y=(k/BCOLS)|0;
    const a=.18+.12*Math.sin(now/160);
    cx.fillStyle=`rgba(180,122,232,${a})`;
    cx.fillRect(x*BT,y*BT,BT,BT);
    cx.strokeStyle='rgba(224,200,255,.8)';
    cx.strokeRect(x*BT+1.5,y*BT+1.5,BT-3,BT-3);
  }
  if(bstate==='target') for(const k of targetSet){
    const x=k%BCOLS, y=(k/BCOLS)|0;
    const a=.20+.12*Math.sin(now/180);
    cx.fillStyle=`rgba(255,84,112,${a})`;
    cx.fillRect(x*BT,y*BT,BT,BT);
    cx.strokeStyle='rgba(255,112,136,.8)';
    cx.strokeRect(x*BT+1.5,y*BT+1.5,BT-3,BT-3);
  }
  if(!suppressBattleUnits&&mission&&mission.pois&&(bstate==='explore'||bstate==='exploreAnim')){
    for(const p of mission.pois) if(p.drawPoi) p.drawPoi(cx,p,now);
  }
  const cg2=mission.config.cage;
  if(cg2){
    const cx2=cg2.at[0]*BT, cy2=cg2.at[1]*BT;
    cx.fillStyle='#22283a'; cx.fillRect(cx2+3,cy2+3,BT-6,BT-6);
    if(!cageSprung){
      const cd2=CREW_DATA.find(c=>c.id===cg2.unit);
      if(cd2) drawSprite(cx, cd2.spr, cx2+BT/2, cy2+BT-6, 2, ((now/2400)|0)%2===0, 0, .92);
    }
    cx.fillStyle='#98a0b4';
    for(let bx2=cx2+5;bx2<cx2+BT-4;bx2+=8) cx.fillRect(bx2,cy2+3,2,BT-6);
    cx.fillStyle='#b8c0d4'; cx.fillRect(cx2+3,cy2+3,BT-6,2);
    if(cageSprung){ cx.fillStyle='rgba(255,210,58,.85)'; cx.fillRect(cx2+BT-14,cy2+BT/2,10,3); }
    else if(((now/1200)|0)%3===0){ cx.fillStyle='#e83048'; cx.fillRect(cx2+BT-10,cy2+8,4,4); }
  }
  const draw=suppressBattleUnits?[]:[...units].filter(u=>u.alive).sort((a,b)=>(a.walk?a.walk.y:a.y*BT)-(b.walk?b.walk.y:b.y*BT));
  for(let i=0;i<draw.length;i++){
    const u=draw[i];
    const bx=u.walk?u.walk.x:u.x*BT;
    const by=u.walk?u.walk.y:u.y*BT;
    const px2=bx+BT/2+u.ox, fy=by+BT-4+u.oy;
    const hop=u.walk ? (((now/120)|0)%2?0:-3) : (((now/340+i*0.7)|0)%2 ? 0 : -2);
    cx.fillStyle='rgba(0,0,0,.4)';
    cx.beginPath(); cx.ellipse(px2, fy, 13, 4, 0, 0, 7); cx.fill();
    if(u===cur && !gameOver){
      const pulse=(Math.sin(now/220)+1)/2;
      cx.strokeStyle=`rgba(255,210,58,${.5+.4*pulse})`;
      cx.lineWidth=2.5;
      cx.beginPath(); cx.ellipse(px2,fy,16,6,0,0,7); cx.stroke();
      cx.lineWidth=1;
    }
    if(u.side==='npc'){
      const pulse=(Math.sin(now/300)+1)/2;
      cx.strokeStyle=`rgba(72,224,96,${.45+.35*pulse})`;
      cx.lineWidth=2;
      cx.beginPath(); cx.ellipse(px2,fy,15,5.5,0,0,7); cx.stroke();
      cx.lineWidth=1;
    }
    if(u.bulwark){
      const pulse=(Math.sin(now/260)+1)/2;
      cx.strokeStyle=`rgba(180,122,232,${.4+.4*pulse})`;
      cx.lineWidth=2;
      cx.strokeRect(u.x*BT+2,u.y*BT+2,BT-4,BT-4);
      cx.lineWidth=1;
    }
    const flyLift = u.fly ? -4-2*Math.sin(now/380+i) : 0;
    drawSprite(cx, u.spr, px2, fy+flyLift, PXS, u.side==='enemy', hop);
    if(u.flash>0){
      u.flash--;
      if(u.flash%4<2) drawSilhouette(cx,u.spr,px2,fy+flyLift,PXS,u.side==='enemy',hop,'#ffffff',.85);
    }
    const w=26, hpw=Math.max(1,Math.round(w*u.hp/u.maxhp));
    cx.fillStyle='#000c'; cx.fillRect(px2-w/2-1,fy+3,w+2,5);
    cx.fillStyle=u.hp/u.maxhp>.4?'#48e060':'#ffd23a';
    if(u.hp/u.maxhp<=.2) cx.fillStyle='#ff5470';
    cx.fillRect(px2-w/2,fy+4,hpw,3);
  }
  if(mission.config.night){
    cx.fillStyle='rgba(8,10,44,.30)';
    cx.fillRect(ox,oy,cv.width,cv.height);
  }
  for(const f of impacts){
    f.t+=dt;
    if(f.type==='boom'){
      const p=Math.min(1,f.t/450);
      cx.strokeStyle=`rgba(255,154,42,${1-p})`;
      cx.lineWidth=5;
      cx.beginPath(); cx.arc(f.x,f.y,6+p*44,0,7); cx.stroke();
      cx.strokeStyle=`rgba(255,210,58,${1-p})`;
      cx.lineWidth=2;
      cx.beginPath(); cx.arc(f.x,f.y,3+p*26,0,7); cx.stroke();
      cx.lineWidth=1;
    } else if(f.type==='ring'){
      const p=Math.min(1,f.t/500);
      cx.strokeStyle=f.color;
      cx.globalAlpha=(1-p)*.9;
      cx.lineWidth=3;
      cx.beginPath(); cx.arc(f.x,f.y, 8+p*f.max, 0, 7); cx.stroke();
      cx.globalAlpha=1; cx.lineWidth=1;
    } else if(f.type==='part'){
      f.x+=f.vx*dt; f.y+=f.vy*dt; f.vy+=.0035*dt;
      cx.globalAlpha=Math.max(0,1-f.t/750);
      cx.fillStyle=f.col;
      cx.fillRect(f.x,f.y,PXS-1,PXS-1);
      cx.globalAlpha=1;
    }
  }
  impacts=impacts.filter(f=>f.t<(f.type==='part'?750:f.type==='ring'?500:450));
  for(const f of floaters){
    f.age++;
    cx.globalAlpha=Math.max(0,1-f.age/55);
    cx.font=(f.big?'15px':'11px')+' "Press Start 2P", monospace';
    cx.textAlign='center'; cx.textBaseline='alphabetic';
    cx.fillStyle='#000';
    cx.fillText(f.text, f.x+2, f.y-f.age*.7+2);
    cx.fillStyle=f.color;
    cx.fillText(f.text, f.x, f.y-f.age*.7);
    cx.globalAlpha=1;
  }
  floaters=floaters.filter(f=>f.age<55);
  cx.restore();
  if(suppressBattleUnits) return;
  /* screen-space HUD */
  cx.fillStyle='rgba(4,5,14,.75)';
  cx.fillRect(6,6,150,20);
  cx.strokeStyle='#c8d4ff66';
  cx.strokeRect(6.5,6.5,149,19);
  cx.fillStyle='#c8d4ff';
  cx.font='8px "Press Start 2P", monospace';
  cx.textAlign='left'; cx.textBaseline='middle';
  const hudName = cur ? (cur.side==='ally'?cur.name:cur.side==='npc'?cur.name:'ENEMY') : '—';
  const obj2=mission.config.objective;
  const rlabel = obj2&&obj2.type==='survive' ? `R${round}/${obj2.rounds}` : `R${round}`;
  cx.fillText(`${rlabel} · ${hudName}`, 12, 17);
  for(const b of banners){
    b.t+=dt;
    const p=b.t/b.dur;
    const inP=Math.min(1,p/.15);
    const outP=p>.8?(p-.8)/.2:0;
    const al=inP*(1-outP);
    cx.fillStyle=`rgba(4,5,14,${.74*al})`;
    cx.fillRect(0,150,cv.width,86);
    cx.fillStyle=`rgba(255,210,58,${.9*al})`;
    cx.fillRect(0,150,cv.width,3);
    cx.fillRect(0,233,cv.width,3);
    cx.globalAlpha=al;
    cx.font='13px "Press Start 2P", monospace';
    cx.textAlign='center'; cx.textBaseline='middle';
    cx.fillStyle='#000';
    cx.fillText(b.text, cv.width/2+2, 195);
    cx.fillStyle=b.color;
    cx.fillText(b.text, cv.width/2, 193);
    cx.globalAlpha=1;
  }
  banners=banners.filter(b=>b.t<b.dur);
  if(bfade>0){
    bfade=Math.max(0,bfade-.02);
    cx.fillStyle=`rgba(3,4,10,${bfade})`;
    cx.fillRect(0,0,cv.width,cv.height);
  }
}

/* — battle pan/tap pointer logic, driven from main.js — */
let pdown=false, pStart=null, camStart=null, panned=false, activePid=null;
function battlePointerDown(e){
  pdown=true; panned=false; activePid=e.pointerId;
  pStart={x:e.clientX, y:e.clientY};
  camStart={x:camTX, y:camTY};
  try{ cv.setPointerCapture(e.pointerId); }catch(_){}
}
function battlePointerMove(e){
  if(!pdown||e.pointerId!==activePid||scene) return;
  const dx=e.clientX-pStart.x, dy=e.clientY-pStart.y;
  if(!panned && Math.hypot(dx,dy)>12) panned=true;
  if(panned){
    const r=cv.getBoundingClientRect();
    const s=cv.width/r.width;
    camTX=clampCam(camStart.x-dx*s, WORLD_W-cv.width);
    camTY=clampCam(camStart.y-dy*s, WORLD_H-cv.height);
    camX=camTX; camY=camTY;
  }
}
function battlePointerUp(e){
  if(e.pointerId!==activePid) return;
  const wasPan=panned;
  pdown=false; panned=false; activePid=null;
  if(!wasPan && !dlgActive) battleTap(e.clientX,e.clientY);
}
function battlePointerCancel(){ pdown=false; panned=false; activePid=null; }

/* — entry point — */
function startBattle(m){
  mission=m;
  saveGame('battle'); /* checkpoint: a loss + RESTART resumes at this fight */
  setMode('battle');
  makeBattleTiles();
  makeSceneBG();
  bGrid=m.map.map(r2=>r2.split('').map(Number));
  chasmTiles=[];
  for(let y=0;y<BROWS;y++)for(let x=0;x<BCOLS;x++) if(bGrid[y][x]===5) chasmTiles.push([x,y]);
  queue=[]; qi=0; round=1; cur=null; bstate='idle';
  moveSet=new Set(); targetSet=new Set(); specialSet=new Set();
  pendingAct=null; pendingSpell=null;
  floaters=[]; banners=[]; impacts=[]; gameOver=false;
  bfade=1; bsmoke=[];
  warnTiles=[]; impactRound=-1; stormAnnounced=false;
  reinforced=false; phase2=false; phasePending=false; kharnRushPending=false;
  casualties=0; cageSprung=false; scene=null;
  rosterInit();
  document.getElementById('log').innerHTML='';
  renderCard(null); renderActions();
  fitLayout();
  camFocus(1.5*BT, 6.5*BT);
  camX=camTX; camY=camTY;
  for(const u of units){
    const bn=ID2CREW[u.id];
    if(bn&&hpBonus[bn]) log(`<span class="p">✦ The worm soup\u2019s warmth steels ${tag(u)} (+${hpBonus[bn]} max HP).</span>`);
  }
  log(`<span class="d">${m.briefing}</span>`);
  openDialog(m.intro.who, m.intro.lines, ()=>{
    log(`<span class="round">— ROUND 1 —</span>`);
    buildQueue();
    nextTurn();
  });
}

/* ═══ THE TEMPLE RISES — victory cinematic (screen-space, camera locked) ═══ */
let tev=null, templeCanvas=null;
const TR={rx:288, ry:192}; /* rift center on the locked screen */
function makeTemple(){
  if(templeCanvas) return;
  templeCanvas=document.createElement('canvas');
  templeCanvas.width=190; templeCanvas.height=210;
  const g=templeCanvas.getContext('2d');
  const stone='#1c2334', lit='#324058', edge='#4a5c7e', glow='#48e0d0';
  const steps=[[10,150,170,60],[26,110,138,44],[44,74,102,40],[62,44,66,34],[80,20,30,28]];
  for(const [x,y,w,h] of steps){
    g.fillStyle=stone; g.fillRect(x,y,w,h);
    g.fillStyle=lit; g.fillRect(x,y,w,4);
    g.fillStyle=edge; g.fillRect(x,y,3,h);
    g.fillStyle='#121826'; g.fillRect(x+w-3,y,3,h);
  }
  g.fillStyle='#0a3844'; g.fillRect(88,4,14,20);
  g.fillStyle=glow; g.fillRect(92,0,6,26);
  g.fillStyle='#a8f8ec'; g.fillRect(94,0,2,8);
  g.fillStyle='#04060c'; g.fillRect(80,168,30,42);
  g.fillStyle=glow; g.fillRect(80,168,30,3);
  g.fillStyle='rgba(72,224,208,.35)'; g.fillRect(84,171,22,39);
  for(const [gx,gy] of [[40,160],[150,160],[58,122],[132,122],[76,88],[114,88]]){
    g.fillStyle=glow; g.fillRect(gx,gy,4,4);
    g.fillStyle='rgba(72,224,208,.35)'; g.fillRect(gx-2,gy-2,8,8);
  }
}
function startTempleRise(){
  makeTemple();
  /* lock the camera on the seam */
  camFocus(14*BT, 5.5*BT);
  camX=camTX; camY=camTY;
  TR.rx=14*BT+BT/2-camX; TR.ry=5.5*BT+BT/2-camY;
  cur=null; moveSet.clear(); targetSet.clear(); warnTiles=[];
  bstate='event'; renderActions(); setHint('…');
  const rnd=mulberry(808);
  tev={
    phase:'rumble', t:0, shake:6, riftW:0, riftH:0, rise:0, dust:[],
    cracks:Array.from({length:9},(_,i)=>{
      const a=(i/9)*Math.PI*2+rnd()*.4;
      const segs=[]; let x=TR.rx, y=TR.ry;
      for(let s2=0;s2<6;s2++){
        x+=Math.cos(a)*(14+rnd()*20)+(rnd()-.5)*16;
        y+=Math.sin(a)*(9+rnd()*12)+(rnd()-.5)*11;
        segs.push([x,y]);
      }
      return segs;
    }),
    fallers:[], march:null, cap:'', capT:0, fade:0,
  };
  trCaption("The rock SCREAMS. Every crystal vent on KR-7 flares at once.");
}
function trCaption(t){ tev.cap=t; tev.capT=0; }
function skipTempleRise(){
  if(!tev||tev.phase==='out') return;
  for(const u of units) if(u.side==='enemy') u.alive=false;
  tev.phase='out'; tev.t=0;
}
function updateTempleRise(dt){
  tev.t+=dt; tev.capT+=dt;
  if(tev.phase==='rumble'){
    tev.shake=5+Math.sin(tev.t/60)*3;
    if(tev.t>1300){ tev.phase='crack'; tev.t=0; tev.shake=9; }
  } else if(tev.phase==='crack'){
    if(tev.t>1400){
      tev.phase='open'; tev.t=0;
      trCaption("The whole astril seam lets go at once — the chasm Vash opened was only the first inch.");
    }
  } else if(tev.phase==='open'){
    const p=Math.min(1,tev.t/1600);
    tev.riftW=ease(p)*150; tev.riftH=ease(p)*52;
    tev.shake=10;
    if((tev.t|0)%50<17) tev.dust.push({x:TR.rx+(Math.random()-.5)*tev.riftW*2, y:TR.ry+(Math.random()-.5)*tev.riftH, vy:-.05-Math.random()*.1, t:0});
    if(p>=1){
      tev.phase='rise'; tev.t=0;
      trCaption("Something older than the ore has been waiting under it.");
    }
  } else if(tev.phase==='rise'){
    const p=Math.min(1,tev.t/2300);
    tev.rise=ease(p);
    tev.shake=6*(1-p)+2;
    if(p>=1){
      tev.phase='fall'; tev.t=0;
      initShatter(performance.now());
      tev.fallers=units.filter(u=>u.side==='enemy'&&u.alive)
        .map(u=>({spr:u.spr, x:u.x*BT+BT/2-camX, y:u.y*BT+BT-4-camY, p:0}));
      for(const u of units) if(u.side==='enemy') u.alive=false;
      log(`<span class="ev">The surviving Scrapfangs — skiffs, bruisers and all — drop into the dark like coins into a well.</span>`);
      trCaption("The surviving Scrapfangs drop into the dark like coins into a well.");
    }
  } else if(tev.phase==='fall'){
    for(const f of tev.fallers) f.p=Math.min(1,f.p+dt/1200);
    if(tev.t>1450){
      tev.phase='path'; tev.t=0;
      trCaption("Your crew is left on a ribbon of stone barely a stride wide. It leads one place: the open doorway.");
    }
  } else if(tev.phase==='path'){
    if(tev.t>2000){
      tev.phase='march'; tev.t=0;
      tev.march=aliveOf('ally').map((u,i)=>({spr:u.spr, delay:i*420}));
      trCaption("One by one, the crew steps onto stone that remembers being worshipped.");
    }
  } else if(tev.phase==='march'){
    if(tev.t>2000+((tev.march.length-1)*420)+900){ tev.phase='out'; tev.t=0; }
  } else if(tev.phase==='out'){
    tev.fade=Math.min(1,tev.t/650);
    if(tev.t>950){
      tev=null;
      enterTemple();
    }
  }
  if(tev){
    for(const d of tev.dust){ d.t+=dt; d.y+=d.vy*dt; }
    tev.dust=tev.dust.filter(d=>d.t<1100);
    if(tev.shatter){
      tev.shatter.T+=dt;
      for(const c of tev.shatter.chunks){
        if(tev.shatter.T<c.delay) continue;
        c.age+=dt;
        c.x+=c.vx*dt*(1+c.age/1800);
        c.y+=c.vy*dt*(1+c.age/1800);
        c.rot+=c.vr*dt;
      }
    }
  }
}
function initShatter(now){
  /* freeze the terrain into a snapshot, then break it into drifting shards */
  suppressBattleUnits=true;
  drawBattle(now,0);
  suppressBattleUnits=false;
  const snap=document.createElement('canvas');
  snap.width=cv.width; snap.height=cv.height;
  snap.getContext('2d').drawImage(cv,0,0);
  const rnd=mulberry(606);
  const CS=48, chunks=[];
  const maxD=Math.hypot(cv.width,cv.height)/2;
  for(let sy=0;sy<cv.height;sy+=CS)for(let sx=0;sx<cv.width;sx+=CS){
    const cx2=sx+CS/2, cy2=sy+CS/2;
    /* keep the last solid ground: the rift collar, the path corridor, the crew ledge */
    const dRift=Math.hypot((cx2-TR.rx)/1.35, cy2-TR.ry);
    if(dRift<tev.riftW+42) continue;
    let nearPath=false;
    for(let p=0;p<=1;p+=0.07){
      const [px2,py2]=marchPoint(p);
      if(Math.hypot(cx2-px2,cy2-py2)<40){ nearPath=true; break; }
    }
    if(nearPath) continue;
    if(Math.hypot(cx2-88,cy2-326)<62) continue;
    const d=Math.hypot(cx2-TR.rx, cy2-TR.ry);
    const a=Math.atan2(cy2-TR.ry, cx2-TR.rx)+(rnd()-.5)*.5;
    const sp2=0.018+rnd()*0.022;
    chunks.push({sx,sy, x:sx,y:sy, vx:Math.cos(a)*sp2, vy:Math.sin(a)*sp2,
      rot:0, vr:(rnd()-.5)*0.0009, age:0,
      delay:(1-Math.min(1,d/maxD))*1500+rnd()*450});
  }
  /* the void behind it all */
  const stars=Array.from({length:80},()=>({x:rnd()*cv.width, y:rnd()*cv.height, b:.2+rnd()*.7, s:rnd()<.8?2:3}));
  tev.shatter={snap, chunks, stars, T:0, CS};
}
function drawShatterBackdrop(now){
  const sh=tev.shatter, g=cx;
  const gr=g.createLinearGradient(0,0,0,cv.height);
  gr.addColorStop(0,'#03040c'); gr.addColorStop(1,'#0a0820');
  g.fillStyle=gr; g.fillRect(0,0,cv.width,cv.height);
  for(const s2 of sh.stars){
    g.fillStyle=`rgba(210,225,255,${s2.b*(0.7+0.3*Math.sin(now/700+s2.x))})`;
    g.fillRect(s2.x,s2.y,s2.s,s2.s);
  }
  g.fillStyle='rgba(120,80,200,.06)';
  g.beginPath(); g.arc(cv.width*.3,cv.height*.25,90,0,7); g.fill();
  /* still-anchored ground first, then the drifting shards over the stars */
  const CS=sh.CS;
  for(const c of sh.chunks){
    if(sh.T>=c.delay) continue;
    g.drawImage(sh.snap, c.sx,c.sy,CS,CS, c.sx,c.sy,CS,CS);
    /* pre-break glow seams */
    g.strokeStyle=`rgba(72,224,208,${.25*Math.max(0,1-(c.delay-sh.T)/500)})`;
    g.strokeRect(c.sx+1,c.sy+1,CS-2,CS-2);
  }
  for(const c of sh.chunks){
    if(sh.T<c.delay) continue;
    const al=Math.max(0,1-c.age/3200);
    if(al<=0) continue;
    g.save();
    g.globalAlpha=al;
    g.translate(c.x+CS/2, c.y+CS/2);
    g.rotate(c.rot);
    const sc2=1-Math.min(.35,c.age/9000);
    g.scale(sc2,sc2);
    g.drawImage(sh.snap, c.sx,c.sy,CS,CS, -CS/2,-CS/2,CS,CS);
    g.strokeStyle='rgba(4,6,12,.6)';
    g.strokeRect(-CS/2,-CS/2,CS,CS);
    g.restore();
  }
  g.globalAlpha=1;
  /* the surviving island: rift collar + path + crew ledge, redrawn solid */
  const keep=[];
  for(let sy=0;sy<cv.height;sy+=CS)for(let sx=0;sx<cv.width;sx+=CS){
    if(!sh.chunks.some(c=>c.sx===sx&&c.sy===sy)) keep.push([sx,sy]);
  }
  for(const [sx,sy] of keep) g.drawImage(sh.snap, sx,sy,CS,CS, sx,sy,CS,CS);
  /* ragged island edge: dark bites where the rock tore free */
  g.fillStyle='#05060f';
  const rnd=mulberry(99);
  for(const [sx,sy] of keep){
    const edge = !keep.some(([a,b])=>a===sx-CS&&b===sy) || !keep.some(([a,b])=>a===sx+CS&&b===sy)
              || !keep.some(([a,b])=>a===sx&&b===sy-CS) || !keep.some(([a,b])=>a===sx&&b===sy+CS);
    if(!edge) continue;
    for(let i=0;i<5;i++){
      g.beginPath();
      g.arc(sx+rnd()*CS, sy+rnd()*CS, 4+rnd()*7, 0, 7);
      g.fill();
    }
  }
  /* the crew, huddled on the last ledge until they march */
  const crew=aliveOf('ally');
  crew.forEach((u,i)=>{
    const marching = tev.phase==='march' && tev.march && tev.march[i] && tev.t>=tev.march[i].delay;
    if(marching || tev.phase==='out') return;
    const hx=66+(i%3)*22, hy=316+((i/3)|0)*20;
    const hop=((now/340+i)|0)%2?0:-2;
    drawSprite(g,u.spr,hx,hy,2.4,false,hop);
  });
}
function marchPoint(p){
  /* quadratic path from the crew's side to the doorway */
  const x0=88, y0=326, cx2=200, cy2=298, x1=TR.rx-30, y1=TR.ry+42;
  const q=1-p;
  return [q*q*x0+2*q*p*cx2+p*p*x1, q*q*y0+2*q*p*cy2+p*p*y1];
}
function drawTempleRise(now,dt){
  const g=cx;
  g.save();
  if(tev.shake>0) g.translate((Math.random()-.5)*tev.shake,(Math.random()-.5)*tev.shake);
  if(tev.shatter) drawShatterBackdrop(now);
  else drawBattle(now,dt);
  /* cracks */
  if(tev.phase!=='rumble' && !tev.shatter){
    const cp = tev.phase==='crack' ? Math.min(1,tev.t/1400) : 1;
    g.strokeStyle='#04060c'; g.lineWidth=3.5;
    for(const segs of tev.cracks){
      g.beginPath(); g.moveTo(TR.rx,TR.ry);
      const n2=Math.max(1,Math.floor(segs.length*cp));
      for(let i=0;i<n2;i++) g.lineTo(segs[i][0],segs[i][1]);
      g.stroke();
    }
    g.strokeStyle='rgba(72,224,208,.35)'; g.lineWidth=1.5;
    for(const segs of tev.cracks){
      g.beginPath(); g.moveTo(TR.rx,TR.ry+2);
      const n2=Math.max(1,Math.floor(segs.length*cp));
      for(let i=0;i<n2;i++) g.lineTo(segs[i][0],segs[i][1]+2);
      g.stroke();
    }
    g.lineWidth=1;
  }
  /* rift */
  if(tev.riftW>0){
    g.fillStyle='#04060c';
    g.beginPath(); g.ellipse(TR.rx,TR.ry,tev.riftW,tev.riftH,0,0,7); g.fill();
    g.strokeStyle='rgba(72,224,208,.5)'; g.lineWidth=2;
    g.beginPath(); g.ellipse(TR.rx,TR.ry,tev.riftW,tev.riftH,0,0,7); g.stroke();
    const ig=g.createRadialGradient(TR.rx,TR.ry,4,TR.rx,TR.ry,tev.riftW);
    ig.addColorStop(0,'rgba(72,224,208,.14)'); ig.addColorStop(1,'rgba(72,224,208,0)');
    g.fillStyle=ig;
    g.beginPath(); g.ellipse(TR.rx,TR.ry,tev.riftW,tev.riftH,0,0,7); g.fill();
    g.lineWidth=1;
  }
  /* temple rising */
  if(tev.rise>0){
    const th=templeCanvas.height;
    const ty=TR.ry+12-tev.rise*(th-16);
    g.save();
    g.beginPath(); g.rect(0,0,cv.width,TR.ry+10); g.clip();
    const gl=g.createRadialGradient(TR.rx,ty+40,10,TR.rx,ty+40,160);
    gl.addColorStop(0,'rgba(72,224,208,.22)'); gl.addColorStop(1,'rgba(72,224,208,0)');
    g.fillStyle=gl; g.fillRect(TR.rx-180,ty-60,360,290);
    g.drawImage(templeCanvas, TR.rx-templeCanvas.width/2, ty);
    g.restore();
  }
  /* falling pirates */
  for(const f of (tev.fallers||[])){
    const p=f.p;
    if(p>=1) continue;
    const fx=f.x+(TR.rx-f.x)*ease(p);
    const fy=f.y+(TR.ry-f.y)*ease(p)+p*p*36;
    g.save();
    g.globalAlpha=1-p*.9;
    g.translate(fx,fy);
    g.rotate(p*3.5);
    g.scale(1-p*.6,1-p*.6);
    drawSprite(g,f.spr,0,0,PXS,false,0);
    g.restore();
    g.globalAlpha=1;
  }
  for(const d of tev.dust){
    g.fillStyle=`rgba(120,110,140,${Math.max(0,.5-d.t/1100)})`;
    g.fillRect(d.x,d.y,4,3);
  }
  /* the narrow path */
  if(tev.phase==='path'||tev.phase==='march'||tev.phase==='out'){
    const pp=tev.phase==='path'?Math.min(1,tev.t/900):1;
    g.strokeStyle='#463a58'; g.lineWidth=9;
    g.beginPath(); g.moveTo(88,326);
    g.quadraticCurveTo(200,298,TR.rx-30,TR.ry+42);
    g.stroke();
    g.strokeStyle='#584a6c'; g.lineWidth=4;
    g.setLineDash([10,7]); g.lineDashOffset=-(pp*140);
    g.beginPath(); g.moveTo(88,326);
    g.quadraticCurveTo(200,298,TR.rx-30,TR.ry+42);
    g.stroke();
    g.setLineDash([]); g.lineWidth=1;
  }
  /* the crew marches in */
  if(tev.phase==='march'&&tev.march){
    for(const m of tev.march){
      const mt=tev.t-m.delay;
      if(mt<0) continue;
      const p=Math.min(1,mt/2000);
      const [mx,my]=marchPoint(p);
      const hop=((now/220)|0)%2?0:-2;
      const sc=2.4*(1-p*.35);
      g.globalAlpha=p>.9?Math.max(0,1-(p-.9)*10):1;
      drawSprite(g,m.spr,mx,my,sc,false,hop);
      g.globalAlpha=1;
    }
  }
  g.restore();
  /* caption */
  if(tev.cap){
    g.fillStyle='rgba(4,5,14,.82)';
    g.fillRect(0,cv.height-64,cv.width,64);
    g.fillStyle='#48e0d0';
    g.fillRect(0,cv.height-64,cv.width,3);
    g.fillStyle='#e8ecff';
    g.font='11px "IBM Plex Mono", monospace';
    g.textAlign='left'; g.textBaseline='top';
    wrapText(g, tev.cap.slice(0, Math.floor(tev.capT/14)), 14, cv.height-52, cv.width-28, 15);
  }
  g.fillStyle='rgba(154,166,216,.8)';
  g.font='8px "Press Start 2P", monospace';
  g.textAlign='right'; g.textBaseline='top';
  g.fillText('SKIP ▸', cv.width-10, 10);
  if(tev.fade>0){
    g.fillStyle=`rgba(3,4,10,${tev.fade})`;
    g.fillRect(0,0,cv.width,cv.height);
  }
}
