/* ═══ NEBULA FORCE — cutscenes.js: space ambush/crash + the Precursor entity.
   Ported from Act 1, rescaled from 576×480 to the shared 480×384 window. ═══ */
let sp=null;
let asteroidCanvas=null;
let entityFired=false;
function makeAsteroid(){
  asteroidCanvas=document.createElement('canvas');
  asteroidCanvas.width=260; asteroidCanvas.height=220;
  const g=asteroidCanvas.getContext('2d');
  const rnd=mulberry(4242);
  const cxp=130, cyp=110;
  g.fillStyle='#3a3048';
  g.beginPath();
  const pts=14;
  for(let i=0;i<=pts;i++){
    const a=i/pts*Math.PI*2;
    const r=84+rnd()*26;
    const x=cxp+Math.cos(a)*r, y=cyp+Math.sin(a)*r*.82;
    if(i===0) g.moveTo(x,y); else g.lineTo(x,y);
  }
  g.closePath(); g.fill();
  g.save(); g.clip();
  g.fillStyle='#544868';
  g.beginPath(); g.ellipse(cxp-30,cyp-30,110,92,0,0,7); g.fill();
  g.fillStyle='#3a3048';
  g.beginPath(); g.ellipse(cxp+14,cyp+14,108,90,0,0,7); g.fill();
  for(let i=0;i<9;i++){
    const x=cxp+(rnd()-.5)*140, y=cyp+(rnd()-.5)*120, r=6+rnd()*14;
    g.fillStyle='#2a2338';
    g.beginPath(); g.arc(x,y,r,0,7); g.fill();
    g.fillStyle='#4a3f5e';
    g.beginPath(); g.arc(x-r*.25,y-r*.25,r*.75,0,7); g.fill();
    g.fillStyle='#241d30';
    g.beginPath(); g.arc(x+r*.12,y+r*.12,r*.55,0,7); g.fill();
  }
  for(let i=0;i<6;i++){
    g.fillStyle='#48e0d0';
    g.fillRect(cxp+(rnd()-.5)*130, cyp+(rnd()-.5)*110, 3,3);
  }
  g.restore();
}
function startSpace(){
  setMode('space');
  const rnd=mulberry(99);
  sp={
    phase:'cruise', t:0, total:0,
    stars:[0,1,2].map(l=>Array.from({length:24},()=>({x:rnd()*cv.width,y:rnd()*cv.height,l}))),
    shipX:126, shipY:170, rot:0,
    drones:[], bolts:[], sparks:[], smoke:[], boomT:-1,
    flash:0, shake:0, astScale:.12, fade:0, cap:'', capT:0,
  };
}
function spCaption(text){ sp.cap=text; sp.capT=0; }
function skipSpace(){
  if(!sp||sp.phase==='out') return;
  sp.phase='out'; sp.t=0; sp.fade=0;
}
function updateSpace(dt,now){
  sp.t+=dt; sp.total+=dt; sp.capT+=dt;
  const spd=(sp.phase==='crash'?2.4:1)*dt*.06;
  for(const layer of sp.stars)for(const s2 of layer){
    s2.x-=spd*(s2.l+1);
    if(s2.x<-4){ s2.x=cv.width+4; s2.y=Math.random()*cv.height; }
  }
  if(sp.phase==='cruise'){
    if(sp.t<50) spCaption("RIGA (comms): Clear of the crater. Shaft nine's on the far side of the belt — sit tight.");
    sp.shipY=170+Math.sin(now/600)*8;
    if(sp.t>2400){
      sp.phase='ambush'; sp.t=0;
      spCaption("PROXIMITY ALERT — unidentified craft closing fast.");
      for(let i=0;i<3;i++){
        sp.drones.push({x:cv.width+60+i*80, y:64+i*92, ph:Math.random()*6, fire:400+i*260});
      }
    }
  } else if(sp.phase==='ambush'){
    sp.shipY=170+Math.sin(now/500)*10;
    for(const d of sp.drones){
      d.x+= (d.x>326? -dt*.16 : Math.sin(now/300+d.ph)*dt*.03);
      d.y+= Math.sin(now/260+d.ph)*dt*.05;
      d.fire-=dt;
      if(d.fire<=0){
        d.fire=520+Math.random()*300;
        sp.bolts.push({x:d.x-20,y:d.y, vx:-.42, vy:(sp.shipY-d.y)/900});
      }
    }
    for(const b of sp.bolts){
      b.x+=b.vx*dt; b.y+=b.vy*dt;
      if(b.x<sp.shipX+52 && b.x>sp.shipX-52 && Math.abs(b.y-sp.shipY)<26 && !b.hit){
        b.hit=true;
        sp.shake=8;
        for(let i=0;i<7;i++) sp.sparks.push({x:b.x,y:b.y,vx:(Math.random()-.2)*.2,vy:(Math.random()-.5)*.25,t:0});
      }
    }
    sp.bolts=sp.bolts.filter(b=>!b.hit&&b.x>-20);
    if(sp.t>2800){
      sp.phase='hit'; sp.t=0; sp.boomT=0;
      sp.flash=1; sp.shake=18;
      spCaption("RIGA (comms): Engine two is GONE — you're venting! Get her down somewhere, ANYWHERE—");
    }
  } else if(sp.phase==='hit'){
    sp.rot=Math.min(.28, sp.rot+dt*.0002);
    sp.shipY+=dt*.02;
    if(sp.boomT>=0) sp.boomT+=dt;
    if((now|0)%70<20) sp.smoke.push({x:sp.shipX-40,y:sp.shipY+8,r:4,t:0});
    for(const d of sp.drones){ d.x+=dt*.3; d.y-=dt*.08; }
    if(sp.t>1700){
      sp.phase='crash'; sp.t=0;
      spCaption("DAX: Brace! Putting her down on that rock—");
    }
  } else if(sp.phase==='crash'){
    const p=Math.min(1,sp.t/2600);
    sp.astScale=.12+p*p*3.2;
    sp.rot=.28+p*.3;
    sp.shipX=126+p*118;
    sp.shipY=170+p*108;
    if((now|0)%60<20) sp.smoke.push({x:sp.shipX-40,y:sp.shipY,r:4,t:0});
    if(p>=1){
      sp.phase='impact'; sp.t=0; sp.flash=1; sp.shake=26;
    }
  } else if(sp.phase==='impact'){
    if(sp.t>420){ sp.phase='out'; sp.t=0; }
  } else if(sp.phase==='out'){
    sp.fade=Math.min(1,sp.t/650);
    if(sp.t>900){
      sp=null;
      startBattle(MISSION_KR7);
      return;
    }
  }
  for(const s2 of sp.sparks){ s2.t+=dt; s2.x+=s2.vx*dt; s2.y+=s2.vy*dt; }
  sp.sparks=sp.sparks.filter(s2=>s2.t<500);
  for(const sm of sp.smoke){ sm.t+=dt; sm.x-=dt*.06; sm.y-=dt*.015; sm.r+=dt*.012; }
  sp.smoke=sp.smoke.filter(sm=>sm.t<1600);
  sp.flash=Math.max(0,sp.flash-dt/380);
  sp.shake=Math.max(0,sp.shake-dt/40);
}
function drawSpace(now){
  const g=cx;
  g.save();
  if(sp.shake>0) g.translate((Math.random()-.5)*sp.shake,(Math.random()-.5)*sp.shake);
  const gr=g.createLinearGradient(0,0,0,cv.height);
  gr.addColorStop(0,'#04050f'); gr.addColorStop(1,'#0c0a22');
  g.fillStyle=gr; g.fillRect(-30,-30,cv.width+60,cv.height+60);
  for(const layer of sp.stars)for(const s2 of layer){
    g.fillStyle=`rgba(210,225,255,${.25+s2.l*.3})`;
    const len=(sp.phase==='crash'?6+s2.l*6:0);
    g.fillRect(s2.x,s2.y,2+len,2);
  }
  if(sp.phase==='crash'||sp.phase==='impact'||sp.phase==='hit'){
    const sc=sp.astScale;
    const ax=cv.width*.72, ay=cv.height*.66;
    g.save();
    g.translate(ax,ay);
    g.scale(sc,sc);
    g.drawImage(asteroidCanvas,-130,-110);
    g.restore();
  }
  for(const sm of sp.smoke){
    g.fillStyle=`rgba(90,90,105,${Math.max(0,.5-sm.t/1600)})`;
    g.beginPath(); g.arc(sm.x,sm.y,sm.r,0,7); g.fill();
  }
  g.save();
  g.translate(sp.shipX,sp.shipY);
  g.rotate(sp.rot);
  if(sp.phase==='cruise'||sp.phase==='ambush'){
    const fl=10+Math.sin(now/40)*4;
    g.fillStyle=animPhase?'#ffd23a':'#ff9a2a';
    g.fillRect(-58-fl,-5,fl+6,10);
    g.fillStyle='rgba(255,154,42,.35)';
    g.fillRect(-66-fl,-8,fl+10,16);
  }
  if(sp.phase==='hit'||sp.phase==='crash'){
    const fl=6+Math.sin(now/30)*4;
    g.fillStyle=animPhase?'#ff9a2a':'#e83048';
    g.fillRect(-50,-2,fl+8,8);
  }
  drawSprite(g,'ship',0,28,4,false,0);
  g.restore();
  if(sp.boomT>=0&&sp.boomT<600){
    const p=sp.boomT/600;
    g.strokeStyle=`rgba(255,154,42,${1-p})`;
    g.lineWidth=6;
    g.beginPath(); g.arc(sp.shipX-40,sp.shipY+4,10+p*70,0,7); g.stroke();
    g.strokeStyle=`rgba(255,210,58,${1-p})`;
    g.lineWidth=3;
    g.beginPath(); g.arc(sp.shipX-40,sp.shipY+4,4+p*44,0,7); g.stroke();
    g.lineWidth=1;
  }
  for(const d of sp.drones){
    drawSprite(g,'drone',d.x,d.y+24,3,false,Math.sin(now/200+d.ph)*3);
  }
  for(const b of sp.bolts){
    g.fillStyle=animPhase?'#ff6070':'#e83048';
    g.fillRect(b.x,b.y-2,14,4);
  }
  for(const s2 of sp.sparks){
    g.fillStyle=`rgba(255,210,58,${1-s2.t/500})`;
    g.fillRect(s2.x,s2.y,4,4);
  }
  if(sp.phase==='hit'||sp.phase==='crash'){
    const a=.10+.08*Math.sin(now/160);
    g.fillStyle=`rgba(232,48,72,${a})`;
    g.fillRect(-30,-30,cv.width+60,26+30);
    g.fillRect(-30,cv.height+4,cv.width+60,30);
  }
  g.restore();
  if(sp.flash>0){
    g.fillStyle=`rgba(255,246,230,${sp.flash})`;
    g.fillRect(0,0,cv.width,cv.height);
  }
  if(sp.cap){
    g.fillStyle='rgba(4,5,14,.82)';
    g.fillRect(0,cv.height-70,cv.width,70);
    g.fillStyle='#ffd23a';
    g.fillRect(0,cv.height-70,cv.width,3);
    g.fillStyle='#e8ecff';
    g.font='11px "IBM Plex Mono", monospace';
    g.textAlign='left'; g.textBaseline='top';
    const shown=sp.cap.slice(0, Math.floor(sp.capT/14));
    wrapText(g, shown, 14, cv.height-56, cv.width-28, 16);
  }
  g.fillStyle='rgba(154,166,216,.8)';
  g.font='8px "Press Start 2P", monospace';
  g.textAlign='right'; g.textBaseline='top';
  g.fillText('SKIP ▸', cv.width-10, 10);
  if(sp.fade>0){
    g.fillStyle=`rgba(3,4,10,${sp.fade})`;
    g.fillRect(0,0,cv.width,cv.height);
  }
}

/* ═══ THE ENTITY ═══ */
const ENT_LINES=[
  "The altar wakes. Light without heat. A voice without sound.",
  "?????: Do not be afraid. Fear is a luxury of creatures who believe they have time.",
  "?????: We speak to you across ten thousand years — from a future that is already dying. Reaching this far back cost us... more than you have words for.",
  "?????: A hunger is crossing the dark between galaxies. It does not conquer. It UNWRITES. Where it passes, every 'was' and every 'will be' simply... stops.",
  "?????: The relic in your pack is the first of five. Our ancestors — the ones you call the Precursors — scattered them so no single hand could wield what they lock away.",
  "?????: Gather them. Before the hunger does. It is already listening for their song... and child — you have made the song LOUDER.",
  "The light folds away. The crystals dim, one by one, like eyes closing. Somewhere above the temple, the stars feel colder than they did an hour ago.",
];
let ent=null;
function startEntity(){
  setMode('entity');
  ent={line:0, capT:0, out:false, fade:0, t:0};
}
function entAdvance(){
  if(!ent||ent.out) return;
  const full=ENT_LINES[ent.line];
  if(Math.floor(ent.capT/16)<full.length){ ent.capT=full.length*16; return; }
  ent.line++;
  ent.capT=0;
  if(ent.line>=ENT_LINES.length){ ent.out=true; ent.t=0; }
}
function drawEntity(now,dt){
  ent.t+=dt; ent.capT+=dt;
  const g=cx;
  g.fillStyle='#020309'; g.fillRect(0,0,cv.width,cv.height);
  g.save();
  g.translate(cv.width/2, 160);
  for(let i=0;i<7;i++){
    const r2=28+i*28+Math.sin(now/700+i)*5;
    g.strokeStyle=`rgba(72,180,224,${.16-.018*i})`;
    g.lineWidth=2;
    g.beginPath();
    g.ellipse(0,0,r2,r2*.42, now/4000*(i%2?1:-1), 0, 7);
    g.stroke();
  }
  g.restore();
  g.fillStyle='#1c2334'; g.fillRect(cv.width/2-60,300,120,22);
  g.fillStyle='#324058'; g.fillRect(cv.width/2-60,300,120,4);
  g.fillStyle='#0a3844'; g.fillRect(cv.width/2-9,278,18,24);
  g.fillStyle='#48e0d0'; g.fillRect(cv.width/2-3,272,6,30);
  const appear=Math.min(1,ent.t/1400);
  const fy=266+Math.sin(now/800)*7;
  const rg=g.createRadialGradient(cv.width/2,fy-70,8,cv.width/2,fy-70,130);
  rg.addColorStop(0,`rgba(124,232,255,${.30*appear})`);
  rg.addColorStop(1,'rgba(124,232,255,0)');
  g.fillStyle=rg; g.fillRect(cv.width/2-140,fy-210,280,280);
  drawGlowOutline(g,'entity',cv.width/2,fy,7,false,0,'#7ce8ff',.20*appear);
  drawSprite(g,'entity',cv.width/2,fy,7,false,0,appear*.94);
  const sy2=(now/9)%cv.height;
  g.fillStyle='rgba(124,232,255,.06)';
  g.fillRect(0,sy2,cv.width,3);
  const full=ENT_LINES[Math.min(ent.line,ENT_LINES.length-1)];
  if(!ent.out){
    g.fillStyle='rgba(4,5,14,.85)';
    g.fillRect(0,cv.height-84,cv.width,84);
    g.fillStyle='#7ce8ff';
    g.fillRect(0,cv.height-84,cv.width,3);
    g.fillStyle='#e8ecff';
    g.font='11px "IBM Plex Mono", monospace';
    g.textAlign='left'; g.textBaseline='top';
    const shown=full.slice(0, Math.floor(ent.capT/16));
    wrapText(g, shown, 14, cv.height-70, cv.width-28, 16);
    if(shown.length>=full.length){
      g.fillStyle=`rgba(255,210,58,${(Math.sin(now/240)+1)/2})`;
      g.font='11px "Press Start 2P", monospace';
      g.textAlign='right';
      g.fillText('▼', cv.width-12, cv.height-20);
    }
  } else {
    /* the entity's exit: everything folds into white */
    if(ent.t<1200){
      g.fillStyle=`rgba(255,255,255,${Math.min(1,ent.t/1200)})`;
      g.fillRect(0,0,cv.width,cv.height);
    } else if(ent.t<2900){
      /* hold on shimmering white — light with a pulse in it */
      g.fillStyle='#ffffff'; g.fillRect(0,0,cv.width,cv.height);
      for(let i=0;i<6;i++){
        const by=((now/22)*(1+i*0.35)+i*140)%(cv.height+120)-60;
        g.fillStyle=`rgba(200,232,255,${.10+.08*Math.sin(now/180+i)})`;
        g.fillRect(0,by,cv.width,26+i*6);
      }
      g.fillStyle=`rgba(124,232,255,${.05+.05*Math.sin(now/90)})`;
      g.fillRect(0,0,cv.width,cv.height);
    } else if(ent.t<3300){
      g.fillStyle='#000'; g.fillRect(0,0,cv.width,cv.height);
    } else {
      ent=null;
      startReturnFlight();
    }
  }
}

/* ═══ THE RETURN — unbroken sky, a crew full of memories, a new heading ═══ */
const RF_LINES=[
  "RIGA (comms, crackling): …transponder says you're STILL on approach to shaft nine. You never left my scope. Where have you BEEN for the last—  …hello?",
  "JET: Okay. Hands up. Who else remembers dying a little?",
  "GUNNAR-7: Hull integrity one hundred percent. Combat log: present. Damage: absent. This is upsetting my file system.",
  "VESPER: It didn't send us back. It folded the bad part closed. The fight still happened — just… somewhere it keeps.",
  "KHARN: The wound is gone. The memory isn't. That is how a scar is SUPPOSED to work, little psion. I like this entity.",
  "SISTER HALE: Five relics. A hunger that unwrites. And one shuttle full of witnesses. The Verdanth would call that a calling.",
  "DAX: Then we answer it. Riga — log a new heading. Past the belt. Past everything.",
  "The relic in Dax's pack sings one clear, bright note — and the stars begin to stretch.",
];
let rf=null;
function startReturnFlight(){
  setMode('return');
  const rnd=mulberry(313);
  rf={
    lines:RF_LINES.filter(l=>!(lostCrew.has('jet')&&l.indexOf('JET:')===0)),
    phase:'talk', line:0, capT:0, t:0,
    stars:[0,1,2].map(l=>Array.from({length:24},()=>({x:rnd()*cv.width,y:rnd()*cv.height,l}))),
    shipX:150, shipY:180,
    warpFlash:0, planetR:0, fade:0,
  };
}
function rfAdvance(){
  if(!rf||rf.phase!=='talk') return;
  const full=rf.lines[rf.line];
  if(Math.floor(rf.capT/15)<full.length){ rf.capT=full.length*15; return; }
  rf.line++;
  rf.capT=0;
  if(rf.line>=rf.lines.length){ rf.phase='warp'; rf.t=0; }
}
function updateReturn(dt,now){
  rf.t+=dt; rf.capT+=dt;
  const warp=rf.phase==='warp';
  const spd=(warp? 2+rf.t/220 : 1)*dt*.06;
  for(const layer of rf.stars)for(const s2 of layer){
    s2.x-=spd*(s2.l+1);
    if(s2.x<-60){ s2.x=cv.width+10; s2.y=Math.random()*cv.height; }
  }
  if(rf.phase==='talk'){
    rf.shipY=180+Math.sin(now/620)*7;
  } else if(rf.phase==='warp'){
    rf.shipY=180;
    if(rf.t>1500){ rf.warpFlash=1; }
    if(rf.t>1750){ rf.phase='arrive'; rf.t=0; }
  } else if(rf.phase==='arrive'){
    rf.warpFlash=Math.max(0,rf.warpFlash-dt/500);
    const p=Math.min(1,rf.t/3000);
    rf.planetR=8+ease(p)*118;
    rf.shipX=150+ease(p)*60;
    if(rf.t>3400){ rf.phase='land'; rf.t=0; }
  } else if(rf.phase==='land'){
    rf.fade=Math.min(1,rf.t/750);
    if(rf.t>1050){ rf=null; enterVantorr(); }
  }
}
function drawReturn(now){
  const g=cx;
  const gr=g.createLinearGradient(0,0,0,cv.height);
  gr.addColorStop(0,'#04050f'); gr.addColorStop(1,'#0c0a22');
  g.fillStyle=gr; g.fillRect(0,0,cv.width,cv.height);
  const warp=rf.phase==='warp';
  for(const layer of rf.stars)for(const s2 of layer){
    g.fillStyle=`rgba(210,225,255,${.25+s2.l*.3})`;
    const len=warp? Math.min(90,4+(rf.t/28)*(s2.l+1)) : 0;
    g.fillRect(s2.x,s2.y,2+len,2);
  }
  /* the ringlit world */
  if(rf.phase==='arrive'||rf.phase==='land'){
    const px2=cv.width*.68, py2=cv.height*.44, R=rf.planetR;
    const rg=g.createRadialGradient(px2-R*.3,py2-R*.3,R*.15,px2,py2,R);
    rg.addColorStop(0,'#ffb35a'); rg.addColorStop(.55,'#e87830'); rg.addColorStop(1,'#8a3a12');
    /* rings behind */
    const ringCols=['#48e0d0','#ff5ad2','#b8ff4a'];
    g.save(); g.translate(px2,py2); g.rotate(-.32);
    for(let i=0;i<3;i++){
      g.strokeStyle=ringCols[i];
      g.globalAlpha=.85;
      g.lineWidth=Math.max(1.5,R*.045);
      g.beginPath(); g.ellipse(0,0,R*(1.45+i*.22),R*(.42+i*.07),0,Math.PI*0.03,Math.PI*0.97,true); g.stroke();
    }
    g.restore(); g.globalAlpha=1;
    g.fillStyle=rg;
    g.beginPath(); g.arc(px2,py2,R,0,7); g.fill();
    g.fillStyle='rgba(4,5,15,.45)';
    g.beginPath(); g.arc(px2+R*.34,py2+R*.2,R,0,7); g.fill();
    /* rings in front */
    g.save(); g.translate(px2,py2); g.rotate(-.32);
    for(let i=0;i<3;i++){
      g.strokeStyle=ringCols[i];
      g.globalAlpha=.95;
      g.lineWidth=Math.max(1.5,R*.045);
      g.beginPath(); g.ellipse(0,0,R*(1.45+i*.22),R*(.42+i*.07),0,-Math.PI*0.03,Math.PI*0.03); g.stroke();
      g.beginPath(); g.ellipse(0,0,R*(1.45+i*.22),R*(.42+i*.07),0,Math.PI*0.97,Math.PI*1.03); g.stroke();
    }
    g.restore(); g.globalAlpha=1;
  }
  /* the shuttle, whole and unburnt */
  g.save();
  g.translate(rf.shipX,rf.shipY);
  const fl=10+Math.sin(now/40)*4;
  g.fillStyle=animPhase?'#ffd23a':'#ff9a2a';
  g.fillRect(-58-fl,-5,fl+6,10);
  g.fillStyle='rgba(255,154,42,.35)';
  g.fillRect(-66-fl,-8,fl+10,16);
  drawSprite(g,'ship',0,28,4,false,0);
  g.restore();
  if(rf.warpFlash>0){
    g.fillStyle=`rgba(240,250,255,${rf.warpFlash})`;
    g.fillRect(0,0,cv.width,cv.height);
  }
  /* captions */
  let cap=null;
  if(rf.phase==='talk') cap=rf.lines[Math.min(rf.line,rf.lines.length-1)];
  else if(rf.phase==='arrive'&&rf.t>900) cap="Vantorr — the ringlit world. Three broken halos, still glowing after ten thousand years. Portside beacon: Ceril's Crossing.";
  if(cap){
    g.fillStyle='rgba(4,5,14,.82)';
    g.fillRect(0,cv.height-70,cv.width,70);
    g.fillStyle='#ffd23a';
    g.fillRect(0,cv.height-70,cv.width,3);
    g.fillStyle='#e8ecff';
    g.font='11px "IBM Plex Mono", monospace';
    g.textAlign='left'; g.textBaseline='top';
    const shown=rf.phase==='talk'?cap.slice(0, Math.floor(rf.capT/15)):cap;
    wrapText(g, shown, 14, cv.height-58, cv.width-28, 15);
    if(rf.phase==='talk'&&shown.length>=cap.length){
      g.fillStyle=`rgba(255,210,58,${(Math.sin(now/240)+1)/2})`;
      g.font='10px "Press Start 2P", monospace';
      g.textAlign='right';
      g.fillText('▼', cv.width-12, cv.height-18);
    }
  }
  if(rf.fade>0){
    g.fillStyle=`rgba(3,4,10,${rf.fade})`;
    g.fillRect(0,0,cv.width,cv.height);
  }
}

/* ═══ OPENING — Penal Station VK-9. A man, a robot, a nine-year promise. ═══ */
const IN_LINES=[
  "PENAL STATION VK-9. Charge: salvage-rights fraud. Sentence: nine years. Served: all nine.",
  "GATE WARDEN: Personal effects — one jacket, one empty pack. Transport request: denied, nobody visits VK-9. ...Correction. Incoming vessel. Nobody EVER visits VK-9.",
  "GUNNAR-7: UNIT REACTIVATED. Suspended animation elapsed: nine years, fourteen days. Reason for suspension: you said 'wait for me.' Query: what took so long.",
  "DAX: ...You waited. You put yourself in a crate for nine years, you glorious rusted idiot, and you WAITED.",
  "GUNNAR-7: Also acquired during interval, at auction, with nine years of accrued interest: FLIGHT MODE. Warranty void. Boarding is now.",
  "DAX: New rules, Gunnar. No crews we can't trust. No jobs we can't walk away from. We find honest work and we keep our heads down—",
  "GUNNAR-7: Destination: Rustharbor Colony. Distinguishing features: nobody asks what you did. Current job postings: one. It is digging.",
  "DAX: Digging. Perfect. How much trouble can one hole in a rock possibly be?",
];
let iv=null;
function startIntro(){
  setMode('return'); /* reuse the cinematic mode plumbing */
  const rnd=mulberry(191);
  iv={kind:'intro', line:0, capT:0, t:0,
    stars:[0,1,2].map(l=>Array.from({length:22},()=>({x:rnd()*cv.width,y:rnd()*cv.height,l}))),
    flash:0, fade:0};
  rf=null;
}
function ivStage(){ return iv.line<=1?'gate' : iv.line<=3?'reunion' : iv.line===4?'transform' : iv.line<=6?'flight' : 'approach'; }
function ivAdvance(){
  if(!iv) return;
  const full=IN_LINES[Math.min(iv.line,IN_LINES.length-1)];
  if(iv.line<IN_LINES.length && Math.floor(iv.capT/15)<full.length){ iv.capT=full.length*15; return; }
  iv.line++; iv.capT=0;
  if(iv.line===5) iv.flash=1;
  if(iv.line>=IN_LINES.length) iv.done=performance.now();
}
function updateIntro(dt){
  iv.t+=dt; iv.capT+=dt;
  iv.flash=Math.max(0,iv.flash-dt/450);
  const st=ivStage();
  const spd=(st==='flight'||st==='approach')?dt*.06:dt*.008;
  for(const layer of iv.stars)for(const s2 of layer){
    s2.x-=spd*(s2.l+1);
    if(s2.x<-10){ s2.x=cv.width+8; s2.y=Math.random()*cv.height; }
  }
  if(iv.done){
    iv.fade=Math.min(1,(performance.now()-iv.done)/800);
    if(iv.fade>=1){
      iv=null;
      startArrival(); /* ship sets down on the pad; the camera walks you to Okari */
    }
  }
}
function drawIntro(now){
  const g=cx;
  const st=ivStage();
  const gr=g.createLinearGradient(0,0,0,cv.height);
  gr.addColorStop(0,'#04050f'); gr.addColorStop(1, st==='gate'?'#12081a':'#0c0a22');
  g.fillStyle=gr; g.fillRect(0,0,cv.width,cv.height);
  for(const layer of iv.stars)for(const s2 of layer){
    g.fillStyle=`rgba(210,225,255,${.2+s2.l*.28})`;
    const len=(st==='flight'||st==='approach')? 3+(s2.l*4) : 0;
    g.fillRect(s2.x,s2.y,2+len,2);
  }
  if(st==='gate'||st==='reunion'||st==='transform'){
    /* Penal Station VK-9 — a wall of cold light and one open gate */
    const gx=cv.width-170;
    g.fillStyle='#0e1018';
    g.fillRect(gx,40,170,260);
    g.fillStyle='#161a26';
    for(let i=0;i<5;i++) g.fillRect(gx+12+i*32,54,20,232);
    for(let i=0;i<5;i++)for(let j2=0;j2<9;j2++){
      g.fillStyle=((i*3+j2+((now/900)|0))%7===0)?'#e83048':'#232a3c';
      g.fillRect(gx+16+i*32,62+j2*25,10,6);
    }
    g.fillStyle='#04050c';
    g.fillRect(gx-2,222,44,78);
    g.strokeStyle='#e83048';
    g.strokeRect(gx-2,222,44,78);
    g.fillStyle='#e83048';
    g.font='7px "Press Start 2P", monospace';
    g.textAlign='left'; g.fillText('VK-9', gx+6, 216);
    /* Dax outside the gate */
    const groundY=300;
    g.fillStyle='#12141f';
    g.fillRect(0,groundY,cv.width,cv.height-groundY);
    const hop=((now/400)|0)%2?0:-1;
    drawSprite(g,'dax', gx-56, groundY, 3.4, false, 0);
    if(st==='gate'&&iv.line===1){
      /* running lights of something approaching, top-left */
      const p=(now/900)%1;
      g.fillStyle='#ffd23a';
      g.fillRect(40+p*60, 46+p*30, 4,4);
      g.fillStyle='#48e0d0';
      g.fillRect(30+p*60, 52+p*30, 3,3);
    }
    if(st==='reunion'||st==='transform'){
      /* Gunnar down, or already down */
      const descend = iv.line===2 ? Math.min(1, iv.capT/1400) : 1;
      const gy=groundY-(1-ease(descend))*220;
      if(descend<1){
        g.fillStyle=animPhase?'#ffd23a':'#ff9a2a';
        g.fillRect(gx-118, gy+4, 8, 14);
        g.fillRect(gx-98, gy+4, 8, 14);
      }
      drawSprite(g,'gunnar', gx-104, gy, 3.4, true, descend<1?0:hop);
    }
    if(st==='transform'){
      /* the shimmer of a robot who bought himself wings */
      const ring=(iv.capT%900)/900;
      g.strokeStyle=`rgba(72,224,208,${.8*(1-ring)})`;
      g.lineWidth=3;
      g.beginPath(); g.arc(gx-104, groundY-24, 8+ring*46, 0, 7); g.stroke();
      g.lineWidth=1;
    }
  }
  if(st==='flight'||st==='approach'){
    /* Gunnar, flight mode: a small proud ship with a green hull-light */
    const sy=170+Math.sin(now/540)*8;
    g.save();
    g.translate(150,sy);
    const fl=8+Math.sin(now/45)*3;
    g.fillStyle=animPhase?'#ffd23a':'#ff9a2a';
    g.fillRect(-46-fl,-4,fl+5,8);
    drawSprite(g,'ship',0,22,3,false,0);
    g.fillStyle='#48e060';
    g.fillRect(10,-14,4,4);
    g.restore();
    if(st==='approach'){
      /* Rustharbor: a cratered brown rock with terrace lights */
      const p=Math.min(1, iv.capT/2600);
      const R=20+ease(p)*95;
      const px2=cv.width*.72, py2=cv.height*.42;
      const rg=g.createRadialGradient(px2-R*.3,py2-R*.3,R*.2,px2,py2,R);
      rg.addColorStop(0,'#8a6a4a'); rg.addColorStop(.6,'#5e4630'); rg.addColorStop(1,'#2e2014');
      g.fillStyle=rg;
      g.beginPath(); g.arc(px2,py2,R,0,7); g.fill();
      g.fillStyle='rgba(20,14,8,.7)';
      for(const [cx3,cy3,cr] of [[-.4,-.2,.18],[.3,.35,.14],[.1,-.45,.11],[-.15,.4,.1]]){
        g.beginPath(); g.arc(px2+cx3*R, py2+cy3*R, cr*R, 0, 7); g.fill();
      }
      if(R>60){
        g.fillStyle='#ffd23a';
        for(let i=0;i<7;i++) g.fillRect(px2-R*.25+i*R*.08, py2+R*.05+(i%2)*3, 2, 2);
      }
    }
  }
  if(iv.flash>0){
    g.fillStyle=`rgba(240,250,255,${iv.flash})`;
    g.fillRect(0,0,cv.width,cv.height);
  }
  /* caption */
  const line=IN_LINES[Math.min(iv.line,IN_LINES.length-1)];
  if(iv.line<IN_LINES.length){
    g.fillStyle='rgba(4,5,14,.84)';
    g.fillRect(0,cv.height-70,cv.width,70);
    g.fillStyle='#ffd23a';
    g.fillRect(0,cv.height-70,cv.width,3);
    g.fillStyle='#e8ecff';
    g.font='11px "IBM Plex Mono", monospace';
    g.textAlign='left'; g.textBaseline='top';
    const shown=line.slice(0, Math.floor(iv.capT/15));
    wrapText(g, shown, 14, cv.height-58, cv.width-28, 15);
    if(shown.length>=line.length){
      g.fillStyle=`rgba(255,210,58,${(Math.sin(now/240)+1)/2})`;
      g.font='10px "Press Start 2P", monospace';
      g.textAlign='right';
      g.fillText('▼', cv.width-12, cv.height-18);
    }
  }
  g.fillStyle='rgba(154,166,216,.7)';
  g.font='7px "Press Start 2P", monospace';
  g.textAlign='right'; g.textBaseline='top';
  g.fillText('TAP ▸', cv.width-8, 8);
  if(iv.fade>0){
    g.fillStyle=`rgba(3,4,10,${iv.fade})`;
    g.fillRect(0,0,cv.width,cv.height);
  }
}
