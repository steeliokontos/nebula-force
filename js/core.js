/* ═══ NEBULA FORCE — core.js: palette, sprites, shared helpers ═══ */
const PAL={
  k:'#0c0c16', w:'#f8f8f0', v:'#d8dce8', u:'#a8b0c4',
  s:'#e8b088', S:'#c08860',
  h:'#7a4a22', H:'#b8b8c0',
  b:'#3a68c8', B:'#22408a',
  m:'#7ce8ff',
  g:'#98a0b4', G:'#5a6278', N:'#3a4054', n:'#6e7890',
  f:'#ff9a2a', F:'#ffd23a',
  r:'#e83048', R:'#8a1428',
  p:'#b47ae8', P:'#6a3aa8', X:'#40206a',
  o:'#e87830', O:'#a84e18',
  c:'#48e0d0',
  y:'#c8a050',
  x:'#1a1830',
  e:'#48e060', E:'#2a8a3a', D:'#1a5a28',
  t:'#d8c8a8', T:'#a89068',
};
const ANIM={
  m:['#7ce8ff','#c8f6ff'],
  c:['#48e0d0','#90f8ec'],
  F:['#ffd23a','#ff9a2a'],
  f:['#ff9a2a','#ffd23a'],
  r:['#e83048','#ff6878'],
};
const SPRITES={
/* — town hero (3 facings, 20 tall) — */
dax_down:["......kkkk......",".....khhhhk.....","....khhhhhhk....","....kssssssk....","....kskssksk....","....kssssssk....",".....kssssk.....","......kssk......",".....kbbbbk.....","....kbbmmbbk....","...kbsbbbbsbk...","...kbsbbbbsbk...","....kbbbbbbk....",".....kbBBbk.....",".....kbbbbk.....",".....kbkkbk.....",".....kBk.kBk....",".....kBk.kBk....",".....kBk.kBk....",".....kkk.kkk...."],
dax_up:["......kkkk......",".....khhhhk.....","....khhhhhhk....","....khhhhhhk....","....khhhhhhk....","....khhhhhhk....",".....khhhhk.....","......khhk......",".....kbbbbk.....","....kbbbbbbk....","...kbsbbbbsbk...","...kbsbbbbsbk...","....kbbbbbbk....",".....kbBBbk.....",".....kbbbbk.....",".....kbkkbk.....",".....kBk.kBk....",".....kBk.kBk....",".....kBk.kBk....",".....kkk.kkk...."],
dax_side:["......kkkk......",".....khhhhk.....",".....khhhhhk....",".....khsssk.....",".....khsksk.....",".....khsssk.....","......ksssk.....",".......ksk......",".....kbbbbk.....",".....kbmbbk.....","....ksbbbbk.....","....ksbbbbk.....",".....kbbbbk.....",".....kbBbk......",".....kbbbk......",".....kbkbk......",".....kBkBk......",".....kBkBk......",".....kBkkBk.....",".....kkk.kk....."],
/* — battle crew — */
dax:["......kkkk......",".....kHhhhk.....",".....khhhhk.....",".....kssssk.....",".....ksksks.....",".....kssssk.....","......kssk......","..c..kbbbbk.....","..m.kbbbbbbk....","..mkbsbbbbsbv...",".kwk.kbbbbk.m...","..k..kbFFbk.....",".....kbkkbk.....",".....kBk.kBk....",".....kBk.kBk....",".....kkk.kkk...."],
kharn:["...kk......kk...","..kGGk....kGGk..","..kGGGk..kGGGk..","...kGGGkkGGGk...","...kgGGGGGGgk...","..kGGrrGGrrGGk..","..kGGrrGGrrGGk..","...kGGrRGGGGk...","...kGNNGGNNGk...","....kGGNNGGk....","..kgGGGGGGGGgk..",".kGGGkGccGkGGGk.","kGGGk.kccGk.GGGk","kGvGk.kGGk.kGvGk","kvwvk.kvvk.kvwvk",".kwk..kGGk..kwk.","......kGGk......",".....kGkkGk.....",".....kGk.kGk....",".....kkk.kkk...."],
gunnar:["....kkkkkkk.....","...kGGGgGGGk....","...kGcGGGcGk....","...kGGGGGGGk....","....kkkkkkk.....","..kkkoooookk....",".kFkoooooookGF..",".kGkoOooOookGk..",".kGkoooccookGk..",".kkkoooooookkk..","..k.kNoooNk.k...","....kkkkkkk.....","...kGGk.kGGk....","...kGGk.kGGk....","...kGGk.kGGk....","...kkkk.kkkk...."],
jet:["......kkkk......",".....kooook.....",".....kmccck.....",".....kssssk.....","......kssk......","..kk.kbbbbk.kk..",".krGkbbbbbbkGFk.",".kGGksbbbbskGGk.",".kkkk.kbbk.kkkk.","..rf...kbk..fF..","..Ff..kbBbk..Ff.","......kbfbk.....",".....kBk.kBk....",".....kBk.kBk....",".....kkk.kkk....","................"],
vesper:["................","................","......kkkk......",".....kXPXXk.....","....kXXXXXXk....","....kssssssk....","....kspsspsk....","....kssssssk....",".....kssssk.....","....kPpppPk.....","...kPpppppPk....","...csPppppsk....","....kPpFpPk.....","....kFpppFk.....",".....kk.kk......","................"],
hale_b:["......kkkk......",".....kwwwwk.....","....kwwwwwwk..c.","....kwkssskk.kyk","....kwksksk...y.","....kwkssskk..y.",".....kwwwk....y.","....kwwwwwk.kyk.","...kwcwwwcwk.y..","...kwwwwwwwk.y..","...kswwwwwsk.y..","....kwwwwwk..y..","....kwwwwwk.....","....kwwwwwk.....","...kwwwwwwwk....","...kkkkkkkkk...."],
/* — town npcs — */
elder:["......kkkk......",".....kHHHHk.....",".....kHHHHk.....",".....kssssk.....",".....ksksks.....",".....kssssk.....","...k..kssk......","..kyk.ktttk.....","..ky.kttttttk...","..kykstttttsk...","..ky..kttttk....","..ky..ktTTtk....","..ky..ktttk.....","..ky..kttttk....","..ky..kttttk....","..ky..kttttk....","......kttttk....",".....kttttttk...",".....kttttttk...",".....kkkkkkkk..."],
keeper:["......kkkk......",".....kOOOOk.....",".....kOOOOk.....",".....kssssk.....",".....ksksks.....",".....kssssk.....","......kssk......",".....kwwwwk.....","....kwwwwwwk....","...ksgwwwwgsk...","...ksgwwwwgsk...","....kwwwwwwk....",".....kwwwwk.....",".....kwwwwk.....",".....kwkkwk.....",".....kGk.kGk....",".....kGk.kGk....",".....kGk.kGk....",".....kGk.kGk....",".....kkk.kkk...."],
kid:["................","................","................","................","......kkkk......",".....khhhhk.....","....khhhhhhk....","....kssssssk....","....ksksskssk...","....kssssssk....",".....kssssk.....","....keeeeek.....","...keeeeeeek....","...kseeeeesk....","....keeeeek.....","....kEeeeEk.....","....keeeeek.....",".....kk.kk......",".....kk.kk......",".....kk.kk......"],
mech:["......kkkk......",".....khhhhk.....",".....kcccck.....",".....kssssk.....","......kssk......",".....kooook.....","....koooooook...","...ksoooooosk...","...ksoooooosk...","....koooooook...",".....koOOok.....",".....kooook.....",".....kokkok.....",".....kOk.kOk....",".....kOk.kOk....",".....kOk.kOk....",".....kOk.kOk....",".....kkk.kkk....","................","................"],
hale:["......kkkk......",".....kwwwwk.....","....kwwwwwwk..m.","....kwkssskk.kyk","....kwksksk...y.","....kwkssskk..y.",".....kwwwk....y.","....kywwwyk...y.","...kwcwwwcwk..y.","...kwwwwwwwk..y.","...kswwwwwsk..y.","....kwwywwk...y.","....kwwywwk...y.","....kwwwwwk...y.","....kwwwwwk.....","....kwwwwwk.....","....kwwwwwk.....","...kwwwwwwwk....","...kywwwwwyk....","...kkkkkkkkk...."],
chef:[".k..........k...",".ek.........ke..","..ek..kkkk..ke..","...kkeeeeeekk...","...keeeeeeeek...","..keekkeekkeek..","..keekkeekkeek..","...keeeeeeeek...","....keeEEeek....","..kekeeeeeekek..",".keekwwwwwwkeek.","keek.kwwwwk.keek","keek.kwwwwk.keek",".kk..kwwwwk..kk.","..kekwwwwwwkek..",".keek.kwwk.keek.",".kk...kEEk...kk.",".....kEk.kEk....",".....kEk.kEk....",".....kkk.kkk...."],
gloop:["................","................","................","................","................","......kkkk......","....kkeeeekk....","...keeeeeeeek...","..keekkeekkeek..","..keekkeekkeek..",".keeeeeeeeeeeek.",".keeeDeeeeDeeek.",".keeeeeeeeeeeek.","keeeeeDeeDeeeeek","keDeeeeeeeeeeDek","keeeeeeDeeeeeeek",".keeeeeeeeeeeek.","..keeeeeeeeeek..","...kkkkkkkkkk...","................"],
/* — enemies — */
drone:["................","....k.kkkk.k....","....kkvvvvkk....","......kkkk......",".....kGGGGk.....","....kGGGGGGk....","...kGGrrGGGk....","...kGGrrGGGk....","....kGGGGGGk....",".....kGGGGk.....","......kkkk......",".....k....k.....","....k......k....","................","................","................"],
rig:["..kkkkkkkkkk....",".kGGGGGGGGGGk...",".kGrrGGGGrrGk...",".kGGGGGGGGGGk...",".kkkkkkkkkkkk...",".koooooooook....","kGkoooooookGk...","kGkoOOooOOokGk..","kGkoooooookGk...","kkkoooooookkk...","..koooooook.....","..kkkkkkkkk.....",".kGGk...kGGk....",".kGGk...kGGk....","kvGGkv..kGGvk...",".kkkk...kkkk...."],
spiker:["................","......kppk......",".....kpPPpk.....",".....kpPPpk.....","......kppk......",".....kGGGGk.....","....kGGGGGGk....","...kGrGGGGrGk...","...kGGGGGGGGk...","....kGGGGGGk....",".....kGGGGk.....","....kGk..kGk....","...kGk....kGk...","..kGk......kGk..","................","................"],
overseer:["....kkkkkkk.....","...kxxxxxxxk....","..kxxxxxxxxxk...","..kxxpppppxxk...","..kxppPPPppxk...","..kxpPrrrPpxk...","..kxppPPPppxk...","..kxxpppppxxk...","..kxxxxxxxxxk...","..kxxxxxxxxxk...","..kxkxxxxxkxk...","..kx.kxxxk.xk...",".....kxxxk......",".....kxxxk......","....kxxxxxk.....","....kkkkkkk....."],
/* — cinematics — */
entity:[".....mmmmmm.....","....mwwwwwwm....","...mwwwwwwwwm...","...mwwcwwcwwm...","...mwwwwwwwwm...","....mwwwwwwm....",".....mwwwwm.....","....mmwwwwmm....","...mwwwwwwwwm...","..mwwwwwwwwwwm..","..mwwwwwwwwwwm..","..mwwwmwwmwwwm..","...mwwmwwmwwm...","...mwwm..mwwm...","....mwm..mwm....","....mwm..mwm....",".....mm..mm.....","......m..m......","......m..m......",".......mm......."],
ship:["...........kkkkkk...........",".........kkGGGGGGkk.........",".......kkGGGGGGGGGGkk.......","......kGGGGccccccGGGGk......",".....kGGGGGccccccGGGGGk.....","....kGGGGGGGGGGGGGGGGGGk....","..kkGGGGGGGGGGGGGGGGGGGGkk..",".kGGGGnnGGGGGGGGGGGGnnGGGGk.","kGGGGGnnGGGGGGGGGGGGnnGGGGGk","kGgggGGGGGGGggGGGGGGGGgggGGk",".kkGGGGGkkkkggkkkkGGGGGGkk..","...kkkkkk..kggk..kkkkkkk....","...........kffk.............","...........kFfk............."],
};
let animPhase=0;
function drawSprite(ctx2,name,footX,footY,scale,flip,bob,alpha){
  const rows=SPRITES[name]; if(!rows) return;
  const rw=rows[0].length;
  const ox=footX-(rw/2)*scale;
  const oy=footY-rows.length*scale+(bob||0);
  if(alpha!==undefined) ctx2.globalAlpha=alpha;
  for(let y=0;y<rows.length;y++){
    const r=rows[y];
    for(let x=0;x<rw;x++){
      const ch=r[x];
      if(!ch||ch==='.'||ch===' ') continue;
      let col=PAL[ch];
      if(ANIM[ch]) col=ANIM[ch][animPhase];
      if(!col) continue;
      const dx=flip?(rw-1-x):x;
      ctx2.fillStyle=col;
      ctx2.fillRect(ox+dx*scale, oy+y*scale, scale, scale);
    }
  }
  if(alpha!==undefined) ctx2.globalAlpha=1;
}
const silCache={};
function silhouette(name,color,scale){
  const key=name+'|'+color+'|'+scale;
  if(silCache[key]) return silCache[key];
  const rows=SPRITES[name];
  const rw=rows[0].length;
  const c=document.createElement('canvas');
  c.width=rw*scale; c.height=rows.length*scale;
  const g2=c.getContext('2d');
  for(let y=0;y<rows.length;y++)for(let x=0;x<rw;x++){
    const ch=rows[y][x];
    if(!ch||ch==='.'||ch===' ') continue;
    g2.fillStyle=color;
    g2.fillRect(x*scale,y*scale,scale,scale);
  }
  silCache[key]=c;
  return c;
}
function drawSilhouette(ctx2,name,footX,footY,scale,flip,bob,color,alpha){
  const rows=SPRITES[name];
  const rw=rows[0].length;
  const sil=silhouette(name,color,scale);
  const ox=footX-(rw/2)*scale;
  const oy=footY-rows.length*scale+(bob||0);
  ctx2.save();
  if(alpha!==undefined) ctx2.globalAlpha=alpha;
  if(flip){
    ctx2.translate(ox+rw*scale/2,0);
    ctx2.scale(-1,1);
    ctx2.drawImage(sil,-rw*scale/2,oy);
  } else { ctx2.drawImage(sil,ox,oy); }
  ctx2.restore();
}
function drawGlowOutline(ctx2,name,footX,footY,scale,flip,bob,color,alpha){
  ctx2.save();
  ctx2.globalAlpha=alpha;
  ctx2.globalCompositeOperation='lighter';
  const o=Math.max(2,scale-1);
  for(const [dx,dy] of [[-o,0],[o,0],[0,-o],[0,o],[-o,-o],[o,-o],[-o,o],[o,o]]){
    drawSilhouette(ctx2,name,footX+dx,footY+dy,scale,flip,bob,color,alpha);
  }
  ctx2.restore();
  ctx2.globalAlpha=1;
}
function spritePixels(name,scale){
  const rows=SPRITES[name]; const out=[];
  const rw=rows[0].length;
  for(let y=0;y<rows.length;y++)for(let x=0;x<rw;x++){
    const ch=rows[y][x];
    if(!ch||ch==='.'||ch===' ') continue;
    out.push({x:x*scale,y:y*scale,col:PAL[ch]||'#888'});
  }
  return out;
}
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;}}
const wait=ms=>new Promise(r=>setTimeout(r,ms));
function ease(p){return 1-Math.pow(1-p,3);}
async function tween(ms,fn){
  const t0=performance.now();
  for(;;){
    const p=Math.min(1,(performance.now()-t0)/ms);
    fn(p);
    if(p>=1) return;
    await wait(16);
  }
}
function roundRect(g,x,y,w,h,r){
  g.beginPath();
  g.moveTo(x+r,y); g.lineTo(x+w-r,y); g.arcTo(x+w,y,x+w,y+r,r);
  g.lineTo(x+w,y+h-r); g.arcTo(x+w,y+h,x+w-r,y+h,r);
  g.lineTo(x+r,y+h); g.arcTo(x,y+h,x,y+h-r,r);
  g.lineTo(x,y+r); g.arcTo(x,y,x+r,y,r);
  g.closePath();
}
function wrapText(g,text,x,y,maxW,lh){
  const words=text.split(' ');
  let line='', yy=y;
  for(const w of words){
    const test=line? line+' '+w : w;
    if(g.measureText(test).width>maxW){
      g.fillText(line,x,yy); yy+=lh; line=w;
    } else line=test;
  }
  g.fillText(line,x,yy);
}
/* single shared canvas — every mode renders into a 480×384 window */
const cv=document.getElementById('view'), cx=cv.getContext('2d');
/* pixel-cell painters used by all tile generators (16×16 cells, PXS px each) */
const PXS=3;
function pxr(g2,x,y,c){g2.fillStyle=c; g2.fillRect(x*PXS,y*PXS,PXS,PXS);}
function rr(g2,x,y,w,h,c){g2.fillStyle=c; g2.fillRect(x*PXS,y*PXS,w*PXS,h*PXS);}
