/* ═══ NEBULA FORCE — main.js: mode manager, input routing, story flow, boot.
   Act 1 flow: Rustharbor (town) → launch → space crash → KR-7 battle
   → victory → temple corridor (town engine) → the entity → END OF ACT 1. ═══ */
let mode='town'; /* town | space | battle | entity */
function setMode(m){
  mode=m;
  document.body.className='mode-'+m;
  const sub=document.getElementById('subline');
  if(sub){
    sub.textContent = m==='town' ? (curMap==='vantorr'||curMap==='ledger'||curMap==='hall'
        ? "Vantorr · Ceril's Crossing · talk to everyone · search everything"
        : 'Rustharbor Colony · talk to everyone · search everything')
      : m==='battle' ? ((typeof mission!=='undefined'&&mission)? mission.name+' · protect Dax' : 'battle')
      : m==='space' ? 'the belt'
      : m==='return' ? 'the long way home' : '';
  }
  fitLayout();
  setTimeout(fitLayout,60);
}

/* victory now flows through the temple-rise cinematic in battle.js */

/* — unified input routing — */
addEventListener('keydown',e=>{
  const k=e.key.toLowerCase();
  if(dlgActive&&(k==='enter'||k===' '||k==='e')){ advanceDialog(); e.preventDefault(); return; }
  if(mode==='entity'&&(k==='enter'||k===' ')){ entAdvance(); e.preventDefault(); return; }
  if(mode==='return'&&(k==='enter'||k===' ')){ if(iv) ivAdvance(); else rfAdvance(); e.preventDefault(); return; }
  if(mode==='space'&&(k==='enter'||k===' ')){ skipSpace(); e.preventDefault(); return; }
  if(mode==='town'){
    if(k==='arrowup'||k==='w'){held.up=true; e.preventDefault();}
    if(k==='arrowdown'||k==='s'){held.down=true; e.preventDefault();}
    if(k==='arrowleft'||k==='a'){held.left=true; e.preventDefault();}
    if(k==='arrowright'||k==='d'){held.right=true; e.preventDefault();}
    if(k==='enter'||k===' '||k==='e'){interact(); e.preventDefault();}
    if(k==='i'){ if(tstate==='walk') openItems(); e.preventDefault(); }
  }
});
addEventListener('keyup',e=>{
  const k=e.key.toLowerCase();
  if(k==='arrowup'||k==='w')held.up=false;
  if(k==='arrowdown'||k==='s')held.down=false;
  if(k==='arrowleft'||k==='a')held.left=false;
  if(k==='arrowright'||k==='d')held.right=false;
});
addEventListener('contextmenu',e=>{e.preventDefault();});
/* kill pull-to-refresh / drag-to-dismiss: block raw touch scrolling everywhere
   except elements that legitimately scroll */
for(const ev of ['touchstart','touchmove']){
  document.addEventListener(ev, e=>{
    /* let real buttons receive taps — preventDefault on touchstart kills the
       synthesized click on iOS, which silently broke LAUNCH / RESTART / FAST */
    if(e.target.closest('button')||e.target.closest('#log')||e.target.closest('#actions')||e.target.closest('#shop')||e.target.closest('#items')) return;
    e.preventDefault();
  }, {passive:false});
}
cv.addEventListener('pointerdown',e=>{
  e.preventDefault();
  if(dlgActive){ advanceDialog(); return; }
  if(mode==='battle'){ if(tev){ skipTempleRise(); return; } battlePointerDown(e); return; }
  if(mode==='return'){ if(iv) ivAdvance(); else rfAdvance(); return; }
  if(mode==='space'){ skipSpace(); return; }
  if(mode==='entity'){ entAdvance(); return; }
});
cv.addEventListener('pointermove',e=>{ if(mode==='battle') battlePointerMove(e); });
cv.addEventListener('pointerup',e=>{ if(mode==='battle') battlePointerUp(e); });
cv.addEventListener('pointercancel',e=>{ if(mode==='battle') battlePointerCancel(e); });
/* town controls */
document.querySelectorAll('#dpad .pbtn[data-d]').forEach(b=>{
  const d=b.dataset.d;
  const on=e=>{e.preventDefault(); if(b.setPointerCapture&&e.pointerId!==undefined){try{b.setPointerCapture(e.pointerId);}catch(_){}} held[d]=true;};
  const off=e=>{e.preventDefault(); held[d]=false;};
  b.addEventListener('pointerdown',on);
  b.addEventListener('pointerup',off);
  b.addEventListener('pointerleave',off);
  b.addEventListener('pointercancel',off);
});
document.getElementById('abtn').addEventListener('pointerdown',e=>{
  e.preventDefault();
  if(mode!=='town') return;
  interact();
});
document.getElementById('items-btn').addEventListener('pointerdown',e=>{
  e.preventDefault();
  if(mode!=='town') return;
  if(tstate==='walk') openItems();
  else if(tstate==='items'){itemsEl.classList.remove('show'); tstate='walk';}
});
document.getElementById('fastbtn').onclick=function(){
  fastMode=!fastMode;
  this.textContent='FAST '+(fastMode?'ON':'OFF');
  this.classList.toggle('on',fastMode);
};

/* — main loop — */
let lastT=performance.now();
function frame(now){
  const dt=Math.min(50, now-lastT); lastT=now;
  animPhase=((now/300)|0)%2;
  cx.clearRect(0,0,cv.width,cv.height);
  if(mode==='town'){
    drawTown(now,dt);
    saveTick(now); /* throttled autosave while walking (save.js) */
  } else if(mode==='space'){
    if(sp){ updateSpace(dt,now); if(sp) drawSpace(now); }
  } else if(mode==='battle'){
    if(scene) drawScene(now,dt);
    else if(tev){ updateTempleRise(dt); if(tev) drawTempleRise(now,dt); }
    else drawBattle(now,dt);
  } else if(mode==='return'){
    if(iv){ updateIntro(dt); if(iv) drawIntro(now); }
    else if(rf){ updateReturn(dt,now); if(rf) drawReturn(now); }
  } else if(mode==='entity'){
    if(ent) drawEntity(now,dt);
  }
  requestAnimationFrame(frame);
}

/* — boot — */
makeTownTiles();
makeAsteroid();
saveBoot(); /* CONTINUE / NEW GAME if a save exists, else the opening movie */
requestAnimationFrame(frame);
