/* ═══ NEBULA FORCE — town.js: Rustharbor, worm house, temple interior,
   shop & pack, NPCs, launch cutscene. Ported from the Act 1 prototype;
   renders through the shared 480×384 camera window (10×8 tiles). ═══ */
const TS=48;
const TOWN_RAW=[
"KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK",
"K,,,,,,,,,,,,,,,~~,,,,,,,,,,,,,,K",
"K,,,,,,,,,,,,,,,~~,,,,,,A,,,,,,,K",
"K,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,K",
"KKKKKKKKKKKKK//K||K//KKKKKKKKKKKK",
"KKKKKKKKKKKKK//K||K//KKKKKKKKKKKK",
"K,,,,,^^^^,,,,,,~~,,,^^^^^,,,,,,K",
"K,,,,,RRRR,,,,,,~~,,,RRRRR,,,RRRK",
",,,,,,EEEE,,,,,,,,,,,EEEEE,,,EEEK",
"K,,,,,#WD#,,,,,,,,,,,#WDW#,,,#D#K",
"K,,,,,,,=,,,,,,,,,,,,,,=,,,,l,,,K",
"K,,,,===================,,,,111,K",
"K,,,,=,,,,,,,,,,,,,,,,,=,,,,222,K",
"K,,,,=,,,,,,,,,,,,L,,,,=,,,,#d#,K",
"K,,,,=,,,,,,,,,,,,,,,,,=,,,,,,,,K",
"KKKKKKKKKK//KKKKKKKKKKKKKK//KKKKK",
"KKKKKKKKKK//KKKKKKKKKKKKKK//KKKKK",
"KRRRB,,,,,,,,11111,,B,,,,,,,,,,,K",
"KEEE,PPP,,,,,22222,,,,,,,,,,,MM,K",
"K#D#,PPP,,,,,#WdW#,,,,,!!!!,,MM,K",
"K,,,,PPP,,C,,,,,,,,,,,,!!!!,,,,,,",
"KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK",
];
const TEMPLE_RAW=[
"YYYYYYY",
"YYYOYYY",
"YczzzcY",
"YzzzzzY",
"YczzzcY",
"YzzzzzY",
"YczzzcY",
"YzzzzzY",
"YczzzcY",
"YzzzzzY",
"YYzzzYY",
"YYYYYYY",
];
const WORM_RAW=[
"jjjjjjjjjjjj",
"juu......BCj",
"j..........j",
"j...tt.....j",
"j..........j",
"j..........j",
"j..........j",
"j..........j",
"jjjjjxxjjjjj",
];
const SHOP_RAW=[
"jjjjjjjjjj",
"juBB..TTVj",
"j......T.j",
"j.CC.....j",
"j........j",
"jjjjxxjjjj",
];
/* Ceril's Crossing — 30×16. Five districts (ACT2.md geography):
   Glasshouse Row (NW) · Hymn Hall (NE) · Shard Market (center, stalls 'a'
   open to 'r' at storyStage 3) · bakery (W-mid) · The Crossing Ledger shop
   (E-mid) · Dockyard (S: pads, crane 'n', impound cage 'i', dray pens 'y')
   · east canyon exit (y9) past the ossuary 'v' · sealed Understack crack 'e'. */
const VAN_RAW=[
"QQQQQQQQQQQQQQQQQQQQQQQQQQQeQQ",
"QggwggwggwggwgQqqqqGGGGGGGGqQQ",
"QgDggggDggggDgQqqqqGGGdGGGGqQQ",
"QqqqqqqqqqqqqqqqmqqqqqqqqqqqQQ",
"QqqqqqqqqqqqqqqqqqqqqqqqqqqqvQ",
"QqqFFFFFqqqaqaqSqaqaqqqqqqqqQQ",
"Qqqooo#oqqqqqqqqqqqqqFFFFFqqvQ",
"Qqqqqqqqqqqqqqqqqqqqq##d##qqQQ",
"QqqqqqqqqqqqqqqqqqqqqqqqqqqqQQ",
"Qqqqqqqqqqqqqqqqqqqqqqqqqqqqqq",
"Qqq#D#qqqqnnqqqqqqqqqqqqqqqqQQ",
"QqqqqqqqqqqqqiqqqyyyyqqqqqqqQQ",
"QqppppqqqqqqqqqqqyqqyqqqqqqqQQ",
"QqppppqqqqqqqqqqqyyyyqqqqqqqQQ",
"QqqqqqqqqqqqqqqqqqqqqqqqqqqqQQ",
"QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ",
];
const LEDGER_RAW=[
"jjjjjjjjjj",
"juCC..TT.j",
"j......T.j",
"j.BB.....j",
"j........j",
"jjjjxxjjjj",
];
const HALL_RAW=[
"GGGGGGGGG",
"GGzztzzGG",
"GzzzzzzzG",
"GzbbzbbzG",
"GzzzzzzzG",
"GzbbzbbzG",
"GGGGxGGGG",
];
function parseMap(raw,w,border){
  return raw.map(r=>{ let s=r.slice(0,w); while(s.length<w) s+=border; return s.split(''); });
}
const MAPS={
  town:{grid:parseMap(TOWN_RAW,33,'K'), w:33, h:22},
  vantorr:{grid:parseMap(VAN_RAW,30,'Q'), w:30, h:16},
  worm:{grid:parseMap(WORM_RAW,12,'j'), w:12, h:9},
  shopint:{grid:parseMap(SHOP_RAW,10,'j'), w:10, h:6},
  ledger:{grid:parseMap(LEDGER_RAW,10,'j'), w:10, h:6},
  hall:{grid:parseMap(HALL_RAW,9,'G'), w:9, h:7},
  temple:{grid:parseMap(TEMPLE_RAW,7,'Y'), w:7, h:12},
};
let curMap='town';
const WALK=new Set([',','=','/','P','.','x','z','q','p']);
const tileAt=(x,y)=>{
  const M=MAPS[curMap];
  return (x<0||y<0||x>=M.w||y>=M.h) ? (curMap==='town'?'K':curMap==='temple'?'Y':curMap==='vantorr'?'Q':curMap==='hall'?'G':'j') : M.grid[y][x];
};
function levelOf(y){ return y<=3?2 : (y<=14?1:0); }
const HOUSE_DOOR={x:15,y:19};
const HOUSE_SPAWN={x:5,y:7};
const SHOP_DOOR={x:29,y:13};
const SHOP_SPAWN={x:5,y:4};
const EXIT_RETURN={x:15,y:20};

const townTiles={};
function baseGround(g2,rnd){
  rr(g2,0,0,16,16,'#3a3048');
  /* clustered mottling reads as packed regolith; lone pixels read as noise */
  for(let i=0;i<7;i++){
    const x=(rnd()*14)|0, y=(rnd()*15)|0, c=rnd()<.5?'#463a58':'#2e2740';
    rr(g2,x,y,rnd()<.4?2:1,1,c);
    if(rnd()<.4) pxr(g2,x,y+1,c);
  }
  for(let i=0;i<3;i++) pxr(g2,(rnd()*16)|0,(rnd()*16)|0,'#584a6c');
  if(rnd()<.55){ /* hairline crack */
    let x=(rnd()*10+3)|0, y=(rnd()*8+2)|0;
    for(let s=0;s<5;s++){ pxr(g2,x,y,'#2a2438'); y++; if(rnd()<.4) x+=rnd()<.5?-1:1; }
  }
  if(rnd()<.35){ /* lit pebble */
    const x=(rnd()*13+1)|0, y=(rnd()*13+1)|0;
    pxr(g2,x,y,'#524660'); pxr(g2,x+1,y+1,'#2e2740');
  }
}
function makeTownTiles(){
  const types=[',','=','#','R','E','^','1','2','D','d','W','C','B','A','T','~','P','K','/','|','L','!','j','.','u','t','x','Y','z','O','c','V','l','M','q','Q','S','a','p',
    'r','F','g','w','G','o','n','i','y','e','m','v','b'];
  for(const ch of types){
    townTiles[ch]=[];
    for(let v=0; v<2; v++){
      const c=document.createElement('canvas'); c.width=TS; c.height=TS;
      const g2=c.getContext('2d');
      const rnd=mulberry(ch.charCodeAt(0)*17+v*131+9);
      switch(ch){
        case ',': baseGround(g2,rnd); break;
        case '=': /* deck plating — fills the tile so runs read as one walkway */
          rr(g2,0,0,16,16,'#2e3c66');
          rr(g2,0,0,16,1,'#44548a'); rr(g2,0,15,16,1,'#20294a');
          rr(g2,0,8,16,1,'#26325a'); rr(g2,8,0,1,16,'#26325a');
          pxr(g2,2,2,'#4a5c94'); pxr(g2,13,2,'#4a5c94');
          pxr(g2,2,13,'#4a5c94'); pxr(g2,13,13,'#4a5c94');
          for(let i=0;i<4;i++) pxr(g2,(rnd()*15)|0,(rnd()*14+1)|0,'#26325a');
          if(v){ rr(g2,4,5,3,1,'#20294a'); rr(g2,10,11,2,1,'#44548a'); }
          break;
        case 'K':
          rr(g2,0,0,16,16,'#2c2238');
          rr(g2,0,0,16,1,'#5a4a6a'); rr(g2,0,1,16,1,'#463a58');
          for(let yy=4; yy<16; yy+=4){
            rr(g2,0,yy,16,1,'#221a2c');
            rr(g2,(rnd()*10)|0,yy+1,(rnd()*4+2)|0,1,'#4a3f5e');
            for(let i=0;i<3;i++) pxr(g2,(rnd()*15)|0,yy+1+((rnd()*2)|0),'#3a2f4a');
          }
          for(let i=0;i<5;i++) pxr(g2,(rnd()*16)|0,(rnd()*16)|0,'#1c1626');
          if(v){ rr(g2,3,6,2,3,'#463a58'); rr(g2,11,10,2,3,'#221a2c'); }
          break;
        case '/':
          rr(g2,0,0,16,16,'#2c2238');
          for(let s2=0;s2<4;s2++){
            const yy=s2*4;
            rr(g2,1,yy,14,2,'#4a5470');
            rr(g2,1,yy,14,1,'#6e7890');
            rr(g2,1,yy+2,14,2,'#1c1626');
          }
          rr(g2,0,0,1,16,'#3a4054'); rr(g2,15,0,1,16,'#3a4054');
          break;
        case '|':
          rr(g2,0,0,16,16,'#0a3844');
          rr(g2,0,0,2,16,'#144e5c'); rr(g2,14,0,2,16,'#144e5c');
          break;
        case '#':
          rr(g2,0,0,16,16,'#4a5470');
          rr(g2,0,0,16,2,'#2e3550');
          rr(g2,0,2,16,1,'#5e6a8c');
          rr(g2,0,15,16,1,'#343c54');
          rr(g2,0,8,16,1,'#3a4460');
          pxr(g2,1,4,'#5e6a8c'); pxr(g2,14,4,'#5e6a8c');
          if(v){ rr(g2,6,10,4,3,'#3a4460'); rr(g2,6,10,4,1,'#5e6a8c'); }
          break;
        case '^': /* roof ridge cap — full-width bands so a row reads as one roofline */
          baseGround(g2,rnd);
          rr(g2,1,2,14,1,'#e88a72');
          rr(g2,0,3,16,2,'#c86a58');
          rr(g2,0,5,16,3,'#a84e40');
          rr(g2,0,8,16,4,'#96453a');
          rr(g2,0,12,16,4,'#8a3a30');
          pxr(g2,0,3,'#a84e40'); pxr(g2,15,3,'#a84e40');
          for(let yy=7;yy<16;yy+=4) for(let i=0;i<3;i++) pxr(g2,(rnd()*15)|0,yy+((rnd()*2)|0),'#7e3428');
          if(v){ rr(g2,11,0,1,3,'#343c54'); pxr(g2,11,0,'#e83048'); }
          break;
        case 'R':
          rr(g2,0,0,16,16, v?'#8a3a30':'#7e3428');
          rr(g2,0,0,16,1,'#a84e40');
          for(let yy=3; yy<16; yy+=4) rr(g2,0,yy,16,1,'#5e241c');
          for(let i=0;i<3;i++) pxr(g2,(rnd()*15)|0,(rnd()*15)|0,'#96453a');
          break;
        case 'E':
          rr(g2,0,0,16,12,'#6e2a20');
          for(let yy=1; yy<12; yy+=4) rr(g2,0,yy,16,1,'#521e16');
          rr(g2,0,12,16,2,'#3a1410');
          rr(g2,0,14,16,2,'#28100c');
          for(let xx=1;xx<16;xx+=5) pxr(g2,xx,12,'#521e16');
          break;
        case '1': /* teal roof ridge cap — same geometry as '^' */
          baseGround(g2,rnd);
          rr(g2,1,2,14,1,'#6ed0be');
          rr(g2,0,3,16,2,'#4ab0a0');
          rr(g2,0,5,16,3,'#369286');
          rr(g2,0,8,16,4,'#2c7e72');
          rr(g2,0,12,16,4,'#256e64');
          pxr(g2,0,3,'#369286'); pxr(g2,15,3,'#369286');
          for(let yy=7;yy<16;yy+=4) for(let i=0;i<3;i++) pxr(g2,(rnd()*15)|0,yy+((rnd()*2)|0),'#1e5e56');
          if(v){ rr(g2,3,0,2,3,'#2c7e72'); pxr(g2,3,0,'#6ed0be'); }
          break;
        case '2':
          rr(g2,0,0,16,12,'#1e5e56');
          for(let yy=1; yy<12; yy+=4) rr(g2,0,yy,16,1,'#154840');
          rr(g2,0,12,16,2,'#0e352f');
          rr(g2,0,14,16,2,'#092723');
          for(let xx=1;xx<16;xx+=5) pxr(g2,xx,12,'#154840');
          break;
        case 'D':
          rr(g2,0,0,16,16,'#4a5470');
          rr(g2,0,0,16,2,'#2e3550');
          rr(g2,3,2,10,14,'#241c30');
          rr(g2,3,2,10,1,'#6a5c88'); rr(g2,3,2,1,14,'#3a3050');
          pxr(g2,11,9,'#ffd23a');
          rr(g2,5,4,6,2,'#3a3050');
          break;
        case 'd':
          rr(g2,0,0,16,16,'#4a5470');
          rr(g2,0,0,16,2,'#0e352f');
          rr(g2,3,2,10,14,'#1a3028');
          rr(g2,3,2,10,1,'#4ab0a0'); rr(g2,3,2,1,14,'#12241e');
          pxr(g2,11,9,'#ffd23a');
          rr(g2,4,14,8,2,'#ffb34766');
          rr(g2,6,4,4,3,'#2c7e72');
          break;
        case 'W':
          rr(g2,0,0,16,16,'#4a5470');
          rr(g2,0,0,16,2,'#2e3550');
          rr(g2,3,4,10,8,'#0a2830');
          rr(g2,3,4,10,1,'#5e6a8c'); rr(g2,3,12,10,1,'#343c54');
          rr(g2,7,4,1,8,'#343c54');
          rr(g2,0,15,16,1,'#343c54');
          break;
        case 'C':
          baseGround(g2,rnd);
          rr(g2,2,3,12,11,'#8a6a3a');
          rr(g2,2,3,12,1,'#b08a4e'); rr(g2,2,13,12,1,'#5e4626');
          rr(g2,2,3,1,11,'#a07c44'); rr(g2,13,3,1,11,'#5e4626');
          rr(g2,2,8,12,1,'#5e4626');
          pxr(g2,4,5,'#b08a4e'); pxr(g2,11,11,'#5e4626');
          break;
        case 'B':
          baseGround(g2,rnd);
          rr(g2,4,2,8,12,'#5a6278');
          rr(g2,4,2,8,1,'#7e88a0'); rr(g2,4,13,8,1,'#3a4054');
          rr(g2,3,4,10,1,'#98a0b4'); rr(g2,3,10,10,1,'#98a0b4');
          rr(g2,6,3,1,10,'#6e7890');
          break;
        case 'A':
          baseGround(g2,rnd);
          rr(g2,4,8,8,6,'#6a7290');
          rr(g2,4,8,8,1,'#8e96b0');
          rr(g2,6,4,4,4,'#3a3050');
          rr(g2,7,2,2,3,'#48e0d0');
          pxr(g2,7,2,'#a8f8ec');
          break;
        case 'T':
          baseGround(g2,rnd);
          rr(g2,0,5,16,7,'#8a6a3a');
          rr(g2,0,5,16,1,'#b08a4e'); rr(g2,0,11,16,1,'#5e4626');
          rr(g2,0,2,16,2,'#c84838');
          rr(g2,0,2,16,1,'#e86a52');
          pxr(g2,3,7,'#b08a4e'); pxr(g2,12,9,'#5e4626');
          break;
        case '~':
          rr(g2,0,0,16,16,'#0a3844');
          rr(g2,0,0,16,1,'#144e5c');
          for(let i=0;i<4;i++) rr(g2,(rnd()*12)|0,(rnd()*12+2)|0,3,1,'#0e4452');
          for(let i=0;i<3;i++) rr(g2,(rnd()*13)|0,(rnd()*12+3)|0,2,1,'#082c36');
          break;
        case '!':
          rr(g2,0,0,16,16,'#1a3a12');
          rr(g2,0,0,16,1,'#2c5a1e');
          for(let i=0;i<4;i++) pxr(g2,(rnd()*15)|0,(rnd()*15)|0,'#2c5a1e');
          pxr(g2,3,4,'#48e060'); pxr(g2,11,9,'#48e060');
          break;
        case 'P':
          rr(g2,0,0,16,16,'#3a4054');
          rr(g2,0,0,16,1,'#4e5670'); rr(g2,0,15,16,1,'#2a2f40');
          for(let i=0;i<16;i+=4){ rr(g2,i,7,2,2,'#c8a020'); }
          pxr(g2,2,2,'#5a6278'); pxr(g2,13,13,'#5a6278');
          break;
        case 'L':
          baseGround(g2,rnd);
          rr(g2,7,3,2,11,'#3a4054');
          rr(g2,5,1,6,3,'#4a5470');
          rr(g2,6,2,4,1,'#ffd23a');
          break;
        case 'j':
          rr(g2,0,0,16,16,'#3a3450');
          rr(g2,0,0,16,1,'#524a6e');
          rr(g2,0,10,16,1,'#2c2740');
          rr(g2,0,15,16,1,'#241f36');
          if(v){ rr(g2,4,3,8,4,'#2c2740'); rr(g2,4,3,8,1,'#524a6e');
                 pxr(g2,6,4,'#c8a050'); pxr(g2,9,5,'#48e0d0'); }
          break;
        case '.':
          rr(g2,0,0,16,16,'#4a3a30');
          for(let yy=0; yy<16; yy+=4){
            rr(g2,0,yy,16,1,'#3a2c24');
            pxr(g2,(rnd()*15)|0,yy+2,'#5a4838');
          }
          break;
        case 'u':
          rr(g2,0,0,16,16,'#4a3a30');
          for(let yy=0; yy<16; yy+=4) rr(g2,0,yy,16,1,'#3a2c24');
          rr(g2,2,4,12,11,'#3a4054');
          rr(g2,2,4,12,1,'#5a6278');
          rr(g2,4,1,8,4,'#2a2f40');
          rr(g2,4,1,8,1,'#5a6278');
          rr(g2,5,2,6,1,'#1a5a28');
          rr(g2,3,9,4,3,'#e87830');
          rr(g2,3,9,4,1,'#ffd23a');
          break;
        case 't':
          rr(g2,0,0,16,16,'#4a3a30');
          for(let yy=0; yy<16; yy+=4) rr(g2,0,yy,16,1,'#3a2c24');
          rr(g2,1,4,14,8,'#8a6a3a');
          rr(g2,1,4,14,1,'#b08a4e');
          rr(g2,1,12,2,3,'#5e4626'); rr(g2,13,12,2,3,'#5e4626');
          rr(g2,4,6,3,2,'#d8c8a8'); rr(g2,9,7,3,2,'#d8c8a8');
          pxr(g2,5,6,'#1a5a28'); pxr(g2,10,7,'#1a5a28');
          break;
        case 'x':
          rr(g2,0,0,16,16,'#4a3a30');
          for(let yy=0; yy<16; yy+=4) rr(g2,0,yy,16,1,'#3a2c24');
          rr(g2,2,2,12,12,'#6e2a20');
          rr(g2,3,3,10,10,'#8a3a30');
          rr(g2,5,7,6,2,'#c8a050');
          break;
        case 'Y':
          rr(g2,0,0,16,16,'#1c2334');
          rr(g2,0,0,16,1,'#324058');
          for(let yy=4; yy<16; yy+=4){
            rr(g2,0,yy,16,1,'#121826');
            for(let i=0;i<2;i++) pxr(g2,(rnd()*15)|0,yy+1+((rnd()*2)|0),'#26314a');
          }
          if(v){ pxr(g2,4,6,'#48e0d0'); pxr(g2,11,10,'#3a8a94'); }
          break;
        case 'z':
          rr(g2,0,0,16,16,'#232c42');
          rr(g2,0,0,16,1,'#182034'); rr(g2,0,0,1,16,'#182034');
          rr(g2,15,0,1,16,'#2e3a56'); rr(g2,0,15,16,1,'#2e3a56');
          pxr(g2,3,3,'#2e3a56'); pxr(g2,12,12,'#182034');
          if(v) pxr(g2,8,7,'#3a8a94');
          break;
        case 'O':
          rr(g2,0,0,16,16,'#1c2334');
          rr(g2,2,10,12,5,'#324058');
          rr(g2,2,10,12,1,'#4a5c7e');
          rr(g2,4,6,8,4,'#26314a');
          rr(g2,4,6,8,1,'#4a5c7e');
          rr(g2,6,2,4,4,'#0a3844');
          rr(g2,7,1,2,5,'#48e0d0');
          pxr(g2,7,1,'#a8f8ec');
          pxr(g2,3,8,'#48e0d0'); pxr(g2,12,8,'#48e0d0');
          break;
        case 'c':
          rr(g2,0,0,16,16,'#1c2334');
          rr(g2,0,0,16,1,'#324058');
          for(let yy=4; yy<16; yy+=4) rr(g2,0,yy,16,1,'#121826');
          rr(g2,6,4,4,8,'#0a3844');
          rr(g2,7,3,2,9,'#2c8a7e');
          rr(g2,7,3,1,9,'#48e0d0');
          pxr(g2,7,3,'#a8f8ec');
          pxr(g2,8,12,'#48e0d0');
          break;
        case 'V': /* Venn's awning — striped canopy with hanging goods */
          baseGround(g2,rnd);
          rr(g2,1,7,1,7,'#5e4626'); rr(g2,14,7,1,7,'#5e4626');
          for(let i=0;i<16;i+=4){
            rr(g2,i,2,2,4, '#ffd23a'); rr(g2,i+2,2,2,4,'#22408a');
          }
          rr(g2,0,2,16,1,'#f0f0f4');
          for(let i=1;i<16;i+=2) pxr(g2,i,6, i%4?'#c8a020':'#182a6a');
          pxr(g2,3,8,'#48e0d0'); pxr(g2,7,9,'#e83048'); pxr(g2,11,8,'#c8a050');
          rr(g2,5,0,6,2,'#101a5e'); rr(g2,6,0,4,1,'#ffd23a');
          break;
        case 'l': /* laundry line — posts, line, patched suit-liners */
          baseGround(g2,rnd);
          rr(g2,2,5,1,9,'#5e4626'); rr(g2,13,5,1,9,'#5e4626');
          rr(g2,2,5,12,1,'#a8b0c4');
          rr(g2,4,6,3,4,'#3a68c8'); pxr(g2,5,8,'#22408a');
          rr(g2,9,6,3,4,'#d8dce8'); pxr(g2,10,8,'#a8b0c4');
          break;
        case 'M': /* lamp-moss racks */
          baseGround(g2,rnd);
          rr(g2,1,4,14,2,'#3a2c24'); rr(g2,1,9,14,2,'#3a2c24');
          rr(g2,2,6,1,8,'#28201a'); rr(g2,13,6,1,8,'#28201a');
          for(const [mx,my] of [[3,4],[6,5],[9,4],[12,5],[4,9],[8,10],[11,9]]) pxr(g2,mx,my,'#48e060');
          pxr(g2,7,4,'#8be04e');
          break;
        case 'q': /* Vantorr regolith — ringlit orange */
          rr(g2,0,0,16,16,'#6e3a1c');
          for(let i=0;i<9;i++) pxr(g2,(rnd()*16)|0,(rnd()*16)|0, rnd()<.5?'#8a4e28':'#5a2e14');
          for(let i=0;i<2;i++) pxr(g2,(rnd()*16)|0,(rnd()*16)|0,'#b06a34');
          if(v) pxr(g2,(rnd()*16)|0,(rnd()*16)|0,'#48e0d0');
          break;
        case 'Q': /* Vantorr canyon wall — banded, ring-stained */
          rr(g2,0,0,16,16,'#4a2412');
          rr(g2,0,0,16,1,'#8a4e28'); rr(g2,0,1,16,1,'#6e3a1c');
          for(let yy=4; yy<16; yy+=4){
            rr(g2,0,yy,16,1,'#341808');
            for(let i=0;i<3;i++) pxr(g2,(rnd()*15)|0,yy+1+((rnd()*2)|0),'#5e3016');
          }
          if(v){ pxr(g2,4,6,'#48e0d0'); pxr(g2,11,10,'#ff5ad2'); pxr(g2,7,13,'#b8ff4a'); }
          break;
        case 'S': /* the ring-shard — fallen halo glass on a plinth */
          rr(g2,0,0,16,16,'#6e3a1c');
          for(let i=0;i<6;i++) pxr(g2,(rnd()*16)|0,(rnd()*16)|0,'#5a2e14');
          rr(g2,3,12,10,3,'#5a6278'); rr(g2,3,12,10,1,'#7e88a0');
          rr(g2,6,2,4,10,'#0a3844');
          rr(g2,7,1,2,11,'#d8f8f4');
          pxr(g2,7,2,'#48e0d0'); pxr(g2,8,4,'#ff5ad2'); pxr(g2,7,6,'#b8ff4a'); pxr(g2,8,8,'#48e0d0');
          pxr(g2,7,0,'#ffffff');
          break;
        case 'a': /* shuttered market stall */
          rr(g2,0,0,16,16,'#6e3a1c');
          for(let i=0;i<5;i++) pxr(g2,(rnd()*16)|0,(rnd()*16)|0,'#5a2e14');
          for(let i=0;i<16;i+=4){ rr(g2,i,2,2,3,'#ff5ad2'); rr(g2,i+2,2,2,3,'#8a1458'); }
          rr(g2,0,2,16,1,'#f0f0f4');
          rr(g2,2,6,1,8,'#3a2c24'); rr(g2,13,6,1,8,'#3a2c24');
          rr(g2,3,8,10,6,'#8a6a3a'); rr(g2,3,8,10,1,'#b08a4e');
          rr(g2,5,10,6,2,'#5e4626');
          break;
        case 'p': /* Vantorr landing pad */
          rr(g2,0,0,16,16,'#3a4054');
          rr(g2,0,0,16,1,'#4e5670'); rr(g2,0,15,16,1,'#2a2f40');
          for(let i=0;i<16;i+=4){ rr(g2,i,7,2,2,'#ff9a2a'); }
          pxr(g2,2,2,'#5a6278'); pxr(g2,13,13,'#5a6278');
          break;
        /* ═══ Act 2 — Ceril's Crossing tile set ═══ */
        case 'r': /* OPEN market stall — awning up, wares out */
          rr(g2,0,0,16,16,'#6e3a1c');
          for(let i=0;i<5;i++) pxr(g2,(rnd()*16)|0,(rnd()*16)|0,'#5a2e14');
          for(let i=0;i<16;i+=4){ rr(g2,i,1,2,3,'#ff5ad2'); rr(g2,i+2,1,2,3,'#48e0d0'); }
          rr(g2,0,1,16,1,'#f0f0f4');
          rr(g2,2,5,1,9,'#3a2c24'); rr(g2,13,5,1,9,'#3a2c24');
          rr(g2,3,7,10,5,'#8a6a3a'); rr(g2,3,7,10,1,'#b08a4e');
          pxr(g2,4,8,'#48e0d0'); pxr(g2,6,9,'#b8ff4a'); pxr(g2,9,8,'#ff5ad2'); pxr(g2,11,9,'#ffd23a');
          if(v){ pxr(g2,5,10,'#e83048'); pxr(g2,10,10,'#c8a050'); }
          break;
        case 'F': /* adobe roof — banded ochre, rim-lit */
          rr(g2,0,0,16,16,'#8a4e28');
          rr(g2,0,0,16,1,'#c87840'); rr(g2,0,1,16,1,'#a86234');
          for(let yy=5; yy<16; yy+=5) rr(g2,0,yy,16,1,'#6e3a1c');
          for(let i=0;i<4;i++) pxr(g2,(rnd()*15)|0,(rnd()*14+1)|0,'#9a5a2e');
          if(v) rr(g2,(rnd()*10+2)|0,7,3,1,'#c87840');
          break;
        case 'g': /* glasshouse wall — adobe framing salvaged ring-glass panes */
          rr(g2,0,0,16,16,'#7e4422');
          rr(g2,0,0,16,1,'#a86234');
          rr(g2,2,4,12,9,'#183038');
          rr(g2,2,4,12,1,'#48e0d0');
          rr(g2,8,4,1,9,'#0e2028'); rr(g2,2,8,12,1,'#0e2028');
          pxr(g2,4,6, v?'#2c8a7e':'#1e5e56'); pxr(g2,11,10, v?'#8a3a68':'#5e2848');
          rr(g2,0,14,16,2,'#5e3016');
          break;
        case 'w': /* glass window strip — flickers ring colors at runtime */
          rr(g2,0,0,16,16,'#7e4422');
          rr(g2,0,0,16,1,'#a86234');
          rr(g2,3,3,10,11,'#0e2028');
          rr(g2,3,3,10,1,'#48e0d0'); rr(g2,3,13,10,1,'#0a161c');
          rr(g2,0,14,16,2,'#5e3016');
          break;
        case 'G': /* Hymn Hall slab — one curved piece of fallen ring */
          rr(g2,0,0,16,16,'#8a94ac');
          rr(g2,0,0,16,1,'#c2ccdf'); rr(g2,0,1,16,1,'#a4aec6');
          for(let yy=5; yy<16; yy+=5) rr(g2,0,yy,16,1,'#6a7490');
          pxr(g2,(rnd()*14+1)|0,(rnd()*10+3)|0,'#b6c0d8');
          if(v){ pxr(g2,4,7,'#48e0d0'); pxr(g2,11,11,'#ff5ad2'); }
          rr(g2,0,15,16,1,'#525c76');
          break;
        case 'o': /* Old Bale's seam-oven mouth — glows at runtime */
          rr(g2,0,0,16,16,'#7e4422');
          rr(g2,0,0,16,1,'#a86234');
          rr(g2,3,5,10,10,'#382012');
          rr(g2,4,7,8,8,'#180a06');
          rr(g2,5,11,6,4,'#7e2810');
          rr(g2,6,12,4,3,'#c85018');
          rr(g2,3,5,10,1,'#5e3016');
          break;
        case 'n': /* Tuck's crane — gantry base, hook swings at runtime */
          rr(g2,0,0,16,16,'#6e3a1c');
          for(let i=0;i<4;i++) pxr(g2,(rnd()*16)|0,(rnd()*16)|0,'#5a2e14');
          rr(g2,2,10,12,4,'#3a4054');
          rr(g2,2,10,12,1,'#5a6278');
          rr(g2,6,1,4,10,'#4e5670');
          rr(g2,6,1,4,1,'#7e88a0'); rr(g2,6,1,1,10,'#5e6a8c');
          for(let yy=2;yy<10;yy+=3) rr(g2,7,yy,2,1,'#2a2f40');
          pxr(g2,3,11,'#ffd23a'); pxr(g2,12,11,'#ffd23a');
          break;
        case 'i': /* the impound cage — rated for ore, holding a war-bot's dignity */
          rr(g2,0,0,16,16,'#3a4054');
          rr(g2,0,0,16,1,'#4e5670'); rr(g2,0,15,16,1,'#2a2f40');
          rr(g2,1,1,14,14,'#22283a');
          for(let xx=2;xx<15;xx+=3) rr(g2,xx,1,1,14,'#98a0b4');
          rr(g2,1,1,14,1,'#b8c0d4'); rr(g2,1,14,14,1,'#5a6278');
          pxr(g2,13,7,'#e83048');
          break;
        case 'y': /* dray pens — rough rails, straw, hoof-churned ground */
          rr(g2,0,0,16,16,'#6e3a1c');
          for(let i=0;i<6;i++) pxr(g2,(rnd()*16)|0,(rnd()*16)|0, rnd()<.5?'#8a5a28':'#5a2e14');
          for(let i=0;i<4;i++) pxr(g2,(rnd()*14+1)|0,(rnd()*14+1)|0,'#c8a050');
          rr(g2,0,3,16,2,'#5e4626'); rr(g2,0,3,16,1,'#8a6a3a');
          rr(g2,0,10,16,2,'#5e4626'); rr(g2,0,10,16,1,'#8a6a3a');
          if(v){ rr(g2,7,0,2,16,'#4a3820'); }
          break;
        case 'e': /* the sealed Understack crack — a hairline that sings at night */
          rr(g2,0,0,16,16,'#4a2412');
          rr(g2,0,0,16,1,'#8a4e28'); rr(g2,0,1,16,1,'#6e3a1c');
          for(let yy=4; yy<16; yy+=4) rr(g2,0,yy,16,1,'#341808');
          let ex=7;
          for(let yy=3;yy<16;yy++){ pxr(g2,ex,yy,'#180c04'); if(yy%3===0) ex+=(rnd()<.5?-1:1); }
          pxr(g2,7,6,'#2c8a7e'); pxr(g2,8,11,'#1e5e56');
          break;
        case 'm': /* Meres's vapor-well — the Crossing's water */
          rr(g2,0,0,16,16,'#6e3a1c');
          for(let i=0;i<4;i++) pxr(g2,(rnd()*16)|0,(rnd()*16)|0,'#5a2e14');
          rr(g2,3,5,10,8,'#7e88a0');
          rr(g2,3,5,10,1,'#a8b2c8'); rr(g2,3,12,10,1,'#525c76');
          rr(g2,5,7,6,4,'#0a3844');
          rr(g2,5,7,6,1,'#144e5c');
          rr(g2,7,1,2,5,'#5e4626'); rr(g2,4,2,8,1,'#5e4626');
          break;
        case 'v': /* ossuary niches — every grave holds a small glass bell */
          rr(g2,0,0,16,16,'#4a2412');
          rr(g2,0,0,16,1,'#8a4e28'); rr(g2,0,1,16,1,'#6e3a1c');
          for(const [nx2,ny2] of [[3,4],[9,4],[3,10],[9,10]]){
            rr(g2,nx2,ny2,4,5,'#2a1408');
            rr(g2,nx2,ny2,4,1,'#180c04');
            pxr(g2,nx2+1,ny2+2,'#8ad8cc'); pxr(g2,nx2+2,ny2+3,'#48e0d0');
          }
          break;
        case 'b': /* hall bench — worn smooth by ten generations of singers */
          rr(g2,0,0,16,16,'#232c42');
          rr(g2,0,0,16,1,'#182034'); rr(g2,0,0,1,16,'#182034');
          rr(g2,15,0,1,16,'#2e3a56'); rr(g2,0,15,16,1,'#2e3a56');
          rr(g2,2,5,12,6,'#8a6a3a');
          rr(g2,2,5,12,1,'#b08a4e'); rr(g2,2,10,12,1,'#5e4626');
          rr(g2,3,11,2,3,'#5e4626'); rr(g2,11,11,2,3,'#5e4626');
          pxr(g2,5,7,'#b08a4e'); pxr(g2,10,8,'#5e4626');
          break;
      }
      townTiles[ch].push(c);
    }
  }
}

/* worldsmith: colonist recolors + a small critter, derived at runtime */
SPRITES.colA=SPRITES.keeper.map(r=>r.replace(/w/g,'t').replace(/g/g,'T').replace(/O/g,'y').replace(/v/g,'T').replace(/o/g,'t'));
SPRITES.colB=SPRITES.mech.map(r=>r.replace(/o/g,'g').replace(/O/g,'G').replace(/h/g,'H').replace(/c/g,'m'));
SPRITES.ringmouse=["........","..k..k..",".kTTTTk.","kTtTTtTk",".kTTTTk.","..k..k.."];
SPRITES.critter=["........","..k..k..",".kGGGGk.","kGvGGvGk",".kGGGGk.","..k..k.."];
let storyStage=0, metOkari=false, haleJoined=false; /* 0: sump quest · 1: shaft quest · 2: launch unlocked */
const hero={x:14,y:12, px:0, py:0, dir:'down', moving:false, mx:0,my:0, prog:0, hidden:false};
let credits=55;
let inventory=[];
let hpBonus={};
let searched={};
let chefTalks=0;
let tstate='walk';
const npcs=[
  {id:'elder', map:'town', name:'FOREMAN OKARI', spr:'elder', x:13,y:12, dir:'down', wander:true, home:[13,12],
   lines:()=>{
    if(storyStage>=2) return ["The relic, the crew, the fueled shuttle. You did more in a week than my last three shift bosses did in a decade.","Go, before I invent a reason to keep you. And salvager — the record says nine years. This colony's memory says one good week. Rustharbor math."];
    if(storyStage===1) return ["The sump job's paid and logged. But shaft nine — MY shaft nine — has been singing all night, and the wolf on the ridge keeps looking west.","There's a bonus in it. Take the west adit. Take the wolf."];
    if(!metOkari){
      metOkari=true;
      return [
        "New face. Fresh off... hm. VK-9 release jacket. Relax — half this colony wore one once. Rustharbor doesn't ask.",
        "Work? As it happens: my sensor line in the eastern sump went dark last night, and the last tech I sent out there came back at a dead sprint, minus his boots.",
        "I pay in credits and in not asking questions. ONE condition: you don't go alone. Assemble a crew first. Start at the ridge shrine — the Sister up there has patched every digger on this rock, and she's been waiting for a reason to leave it.",
      ];
    }
    if(!haleJoined) return ["The shrine's up the ridge stairs, east side. Tell Sister Hale that Okari finally found her a reason."];
    return ["Crew's a crew. Sensors are east, past the moss racks, follow the trail off the terrace. Bring back whatever's left of them — or at least of the tech's boots."];
   }},
  {id:'keeper', map:'shopint', name:'VENN', spr:'keeper', x:7,y:1, dir:'down', wander:false, shop:true,
   lines:()=>["Welcome, welcome! Salvage-grade goods at colony prices."]},
  {id:'kid', map:'town', name:'PIP', spr:'kid', x:17,y:10, dir:'down', wander:true, home:[17,10],
   lines:()=>{
     const l=[
      "Foreman Okari climbs all the way up to the ridge every payday. Comes back down SMILING. He never smiles. Grown-ups are so weird.",
      "Venn's got a weird egg-thing on the shelf. He says it fell off a hauler. It's WARM.",
      "The bug lady in the teal house cooks WORMS. Tomo says it smells amazing. Tomo is weird.",
      "The wolf-man stands up on the ridge ALL DAY. Staring at the sky. I dared Tomo to poke him. Tomo said no.",
     ];
     return [l[pipLine++ % l.length]];
   }},
  {id:'mech', map:'town', name:'RIGA', spr:'mech', x:9,y:18, dir:'down', wander:true, home:[9,18], lines:null},
  {id:'hale', map:'town', name:'SISTER HALE', spr:'hale', x:23,y:2, dir:'right', wander:false,
   lines:()=>{
    if(haleJoined) return ["Lead on, Dax of the empty pack. I will be right behind you. That is rather the point of me."];
    if(metOkari){
      haleJoined=true;
      return [
        "Okari sent you. Good — he's been threatening to for a year.",
        "I know what you are. The jacket, the way you count exits. My order does not care where a road began; we are sworn to walk beside it and see that it arrives SAFELY. That is my duty, and you are now my duty.",
        "And... there is another reason I keep this shrine, salvager. One day — not today — you will need to know what sleeps beneath it. Until then: I heal, I watch, I serve.",
        "✦ SISTER HALE joins the force. The Maw of the eastern sump will not enjoy this.",
      ];
    }
    return ["You climbed all this way. Most colony folk never visit the ridge shrine anymore. If you're looking for a new life — and you are, I can always tell — the foreman below is looking for hands."];
   }},
  {id:'kharn', map:'town', name:'KHARN', spr:'kharn', x:6,y:2, dir:'down', wander:false, glow:true,
   lines:()=>[
    "...",
    "From this ridge I can smell the whole crater. The shaft. The goo pit. The thing beneath it all.",
    "I smelled it once before — the night my pack's sky burned. When you go down, salvager... I go too. Not for you. For them.",
   ]},
  {id:'gloop', map:'town', name:'GLOOP', spr:'gloop', x:21,y:20, dir:'right', wander:false,
   lines:()=>[
    "glub... GLUB. warm-walker. you carry old warmth in your pack...",
    "this pool is old. older than the colony. it dreams, sometimes, of its sisters. far pools. glub.",
    "the sludge remembers what walkers forget. that is all. that is plenty. go away now. affectionately. glub.",
   ]},
  {id:'chef', map:'worm', name:'MOTHER SKITTERLY', spr:'chef', x:2,y:2, dir:'down', wander:false, lines:null},
  /* — worldsmith: background colonists — */
  {id:'dossa', map:'town', name:'DOSSA', spr:'colB', x:16,y:13, dir:'down', wander:true, home:[16,13],
   lines:()=>[
    "Survey clerk, third seismic office. Which is me, a tripod, and a chair.",
    "Four point one, four point four, four point NINE. The quakes are improving my data and ruining my sleep, and I can't decide how I feel.",
   ]},
  {id:'harrow', map:'town', name:'HARROW', spr:'colA', x:29,y:10, dir:'down', wander:false,
   lines:()=>[
    "Forty years in shaft nine. Back then the deep stacks were quiet. Polite, even.",
    "You could set your hand on the old machines and feel nothing at all. I used to think that was boring.",
    "...Enjoy the ridge air, salvager. It's still free.",
   ]},
  {id:'yims', map:'town', name:'YIMS', spr:'colB', x:18,y:7, dir:'left', wander:false,
   lines:()=>[
    "Coolant channel maintenance. Glamorous, I know.",
    "Tuesday the water flowed UPHILL for one second. One full second. Nobody logs my reports. Nobody logs Yims.",
   ]},
  {id:'pelt', map:'town', name:'PELT', spr:'gunnar', x:8,y:18, dir:'left', wander:false,
   lines:()=>[
    "LANDING YARD SECURITY. Please present threat.",
    "...No threat presented in 214 days. Have processed 3,102 shuttle manifests instead. Unit is fine. Unit is FINE.",
   ]},
  {id:'tiln', map:'town', name:'TILN', spr:'colA', x:28,y:19, dir:'right', wander:false,
   lines:()=>[
    "Lamp-moss. Grows best in the pit-glow. Don't make it weird.",
    "The goo is a NEIGHBOR, not a hazard. I wave every morning. Sometimes... something waves back. Anyway! Moss.",
   ]},
  /* ═══ Vantorr: Ceril's Crossing — Act 2 cast (ACT2.md §3) ═══ */
  {id:'ceril', map:'vantorr', name:'CERIL', spr:'elder', x:2,y:10, dir:'right', wander:false,
   lines:()=>{
    if(storyStage>=6) return [
      "RING-RISE, salvager. Ten years the Crossing owed itself this party, and YOU get the first cup of whatever Cask is calling that.",
      "Keldrin? Alive. Small. Crownless. I've begun un-paying him ten years of tithe receipts — one refund at a time, slowly, in public. Rustharbor math says grudges compound. So does gratitude.",
      "Two relics in your pack and a heading in your bot's head. When you fly, the Crossing flies a little with you. Dockmaster's blessing. It's worth exactly one berth, ANY dock, forever.",
    ];
    if(storyStage===5){
      cerilStage5=true;
      return [
        "The crews are stood down. Bale's baking through the night — somebody has to. Lunett sang the hall empty an hour ago.",
        "He's up the ossuary trail, keying the node with that crown. Not a tax man anymore. Maybe he never was — maybe he was always just the man HOLDING the thing.",
        "Go up the east trail when the crew is ready. Bring them all home. That's the whole harbor fee.",
      ];
    }
    if(storyStage===4){
      return [
        dashaLost? "The wardens went underground — literally. The dig under the east quarter never stops now. The well drops, the mice run west, and Nima's gone through the crack after that SONG."
                 : "Dasha's ledger says ten years of tithe went DOWN, not off-world. The dig under the east quarter never stops now. And Nima's gone through the crack after that song.",
        ledgerSaved&&!tithepitDone&&!brandTalked? "One more thing. The deserter by the east trail — Brand. He'll talk to someone carrying PROOF. Dasha's book is proof. There are people in a hole out there, salvager." : "The crack in the northeast wall stands open. Whatever you're going to do about it... the town would rather not know until it's done.",
      ];
    }
    if(storyStage>=3){
      if(dashaLost) return [
        "First tithe night in ten years the Crossing kept its own. The dock crews are calling it a holiday. I'm calling it a Tuesday — morale's cheaper that way.",
        "The wardens pulled back to the ring-fall fields, east canyon. They're not scavenging out there, salvager. They never scavenge. They HARVEST.",
        "...The tollhouse ledger's closed this week. Clerical reasons. Don't ask again.",
      ];
      return [
        "First tithe night in ten years the Crossing kept its own. Dasha's already re-filed the whole raid under 'DAMAGES, THEIRS'.",
        "Your bot's released — I lost the tariff paperwork. Tragic. Ten years a dockmaster, you learn exactly which papers know how to swim.",
        "The wardens pulled back east, to the ring-fall fields. Mirrit up in Glasshouse Row was asking for you — her partner took the vapor rig out before the raid. Nobody's come back down that trail.",
      ];
    }
    if(!cerilBriefed){
      cerilBriefed=true; dashaAsked=true;
      return [
        "Welcome to Ceril's Crossing. Dockmaster Ceril. The Crossing came first; I renamed myself. Long story, decent story.",
        "You picked a bad week. Tithe week. The Ringwarden's collectors sweep through, the stalls shutter, and everyone finds somewhere else to look. We pay, they leave. The math holds.",
        "Which brings me to the bad news stapled to your gangway: your shuttle's cited for 'mass tariff arrears' and your war-bot is impounded at the crane scales. Tuck's crane can't legally release him. He has FEELINGS about the word 'cargo'.",
        "I can lose paperwork, but not during tithe week — too many uniforms doing arithmetic. Sit tight a night. You're short hands anyway — and the best pair on this dock works my dray pens for IOUs. Southeast. Can't miss the swearing.",
        "One favor while you're stuck here. My tally-clerk Dasha works late on tithe nights. See her home before the wardens make their rounds. Humor an old dockmaster.",
      ];
    }
    if(!hobJoined) return ["The pens are southeast, past the crane. Follow the sound of a quarter-ton animal winning an argument."];
    return ["Nothing to do now but wait out the night. Your shuttle's the only bed you own, salvager — I'd use it. The wardens bill at dawn."];
   }},
  {id:'dasha', map:'vantorr', name:'DASHA', spr:'dasha', x:6,y:10, dir:'left', wander:false,
   when:()=>!dashaLost,
   lines:()=>{
    if(storyStage>=3) return [
      "...Thank you. For the dock. Ceril says you're trouble. I'm entering you as an asset.",
      "Ten years of tithe, every chit of it, in one book. The last page doesn't add up, salvager — the money doesn't stay with the Ringwarden. It goes UP. Off-world. To a mark with no name.",
    ];
    return [
      "Ceril's tally-clerk. Dasha. If you're here to argue a tariff: the book wins. The book always wins.",
      "I can carry a ledger through a dark dock, salvager. Done it ten years. ...Why, what have you heard?",
    ];
   }},
  {id:'tuck', map:'vantorr', name:'TUCK', spr:'tuck', x:9,y:11, dir:'right', wander:false,
   lines:()=>{
    if(storyStage>=3) return [
      "Crane's re-rated. New tonnage class. 'War-bot, ambulatory, one (1), with opinions.' Don't tell him I did it. Don't tell ANYONE I did it.",
      "He recited his serial number at me for six hours. I grieve every gram over manifest, friend, but that machine grieves in PARAGRAPHS.",
    ];
    return [
      "Crane operator. Twenty years, zero dropped loads, one impounded war-bot currently reciting legal precedent at my scales.",
      "Your robot is three permits and a prayer, friend. The cage stays shut till the paperwork says otherwise. I don't make the rules. I just weigh them.",
    ];
   }},
  {id:'hob', map:'vantorr', name:'HOB', spr:'hob', x:16,y:12, dir:'right', wander:false,
   when:()=>!hobJoined,
   lines:()=>{
    if(!cerilBriefed) return [
      "Busy. The dray smelled a warden skiff an hour ago and she's still got opinions about it.",
      "Shhh. Shh. ...Not you. Her. You can talk all you want.",
    ];
    hobJoined=true;
    CREW_PROG.hob=CREW_PROG.hob||{lvl:3,xp:0,hp:0,atk:0,def:0,agi:0,mp:0,spells:[]};
    return [
      "Easy. EASY. ...There she is. Breathing even. A skiff spooks a loaded dray and suddenly everybody remembers dock wranglers exist.",
      "Hob. Twenty years working Ceril's pads. Paid, the last three tithe-weeks, in IOUs — the wardens skim the dock ledger before wages do. Know what an IOU spends like? Paper. Tastes like it too, by week two.",
      "You're the crew with the impounded war-bot and the citation stapled to your ramp. I've watched you walk this dock all day. You count exits. I respect that in a person.",
      "Ship crew gets paid in credits. Dock crew gets paid in promises. Congratulations — you're short a dockhand and I'm short a ship. ✦ HOB joins the force.",
    ];
   }},
  {id:'dray', map:'vantorr', name:'THE DRAY', spr:'dray', x:18,y:12, dir:'left', wander:true, home:[18,12],
   lines:()=>hobJoined
    ?["The dray looks past you, down the dock, the way she's looked all day. The pens keep waiting for footsteps that moved on. She'll take the apple anyway."]
    :["A cargo-dray: a quarter ton of shag, patience, and strong opinions about warden skiffs. She sniffs your pack — the relic makes her ears go flat. Huh."]},
  {id:'kep', map:'ledger', name:'KEP', spr:'kep', x:8,y:1, dir:'down', wander:false, shop:true,
   lines:()=>{
    if(ledgerSaved) return ["Dasha vouches. The book respects the book — twenty percent off, and I want it noted I did NOT smile just now."];
    return ["The Crossing Ledger. Everything's in the book: price, provenance, and what your neighbor paid so don't try it.","That's the price. The book says the price. Argue with the book."];
   }},
  {id:'bale', map:'vantorr', name:'OLD BALE', spr:'bale', x:4,y:7, dir:'down', wander:false,
   lines:()=>{
    if((searched['bowl-given']||0)>=3&&!searched['bread-given']){
      searched['bread-given']=true;
      inventory.push('Crusty Bread');
      return [
        "...Hold still.",
        "Bowl says someone's been kind. The bowl talks to me. Always has — who do you think empties it?",
        "Take the heel. It's the part that keeps. ✦ Got CRUSTY BREAD.",
      ];
    }
    return [
      "Old Bale. Baker. The oven rides a hot glass seam — thirty years staring into it, and these days the light stares back a little.",
      "First loaf of every batch goes on the sill. For the rings. That's not religion, friend — that's seniority.",
    ];
   }},
  {id:'meres', map:'vantorr', name:'MERES', spr:'meres', x:17,y:3, dir:'left', wander:false,
   lines:()=>[
    "Keeper of the vapor-well. One cup a head at dusk, two if you worked the pads. The well decides, I just pour.",
    "Level's been dropping since the digging started under the east quarter. A well doesn't lie, salvager. Ground with a hole in it sounds exactly like this one's started to.",
   ]},
  {id:'mirrit', map:'vantorr', name:'MIRRIT', spr:'mirrit', x:4,y:3, dir:'down', wander:false,
   lines:()=>{
    if(fenSaved) return [
      "He's home. He says he wasn't worried. The tin came back empty, so I wasn't either.",
      storyStage>=6? "We watch the festival from the glasshouse roof. The panes catch all three ring-colors at once. Fen says it's the second prettiest thing on four worlds, and then he looks at me. Twenty years and he still DOES that." : "He's already talking about one more haul. ALWAYS one more haul. …Thank you. Both of us. All of it.",
    ];
    if(fenLost) return [
      "The tin came back full.",
      "…The glasshouse grows vapor-fruit best in the dark, did you know. So it's fine. The dark is fine.",
    ];
    if(storyStage>=3){
      if(!fenAsked){
        fenAsked=true;
        return [
          "You're the crew from the dock. Good. I don't have anyone else to say this to and I'm only saying it once.",
          "My partner Fen took the vapor rig into the ring-fall fields before the raid. The wardens sweep the fields after every tithe night. He hasn't come back down the trail.",
          "Here — his lunch tin. He'll say he wasn't worried. Give him this so he knows I wasn't either.",
        ];
      }
      return ["The east canyon, past the ossuary. The fields sing when the wind's right. Fen says it's the prettiest sound on four worlds. ...Go when you're ready. Please."];
    }
    return ["Glasshouse row. We farm vapor and grow panes off the ring-fall. My partner's out at the fields with the rig — one more haul before tithe week. Always one more haul."];
   }},
  {id:'lunett', map:'hall', name:'LUNETT', spr:'lunett', x:2,y:1, dir:'right', wander:false,
   lines:()=>[
    "Welcome to the Hymn Hall. One slab, one song, ten generations of singers. We don't know what the words mean. We sing them anyway — SOMETHING remembers.",
    "The bowl feeds whoever's hungriest that week. It always has. Don't ask me how it knows.",
    "The liturgy's third verse was lost before my grandmother's grandmother. It bothers me like a missing tooth. Widow Sol half-remembers it, she claims. Sol claims a lot of things.",
   ]},
  {id:'sol', map:'vantorr', name:'WIDOW SOL', spr:'sol', x:11,y:3, dir:'down', wander:false,
   lines:()=>[
    "Keeper of the ossuary trail. Every niche gets a glass bell, every bell gets a name. Quiet work. Good work.",
    "My grandmother sang the lost verse to the bells, you know. 'Four hands to tune it, four rings to ring it.' ...Four. Yes. That's how it went.",
    "Hm? No, dear, the sky has three. It's a SONG. Songs exaggerate. Ask anyone.",
   ]},
  {id:'pock', map:'vantorr', name:'POCK', spr:'pock', x:12,y:7, dir:'down', wander:true, home:[12,7],
   lines:()=>{
    if(searched['census-done']) return [
      "Census update: the mice are STILL moving west. All of them. Away from the east quarter. I put it in my report.",
      "Nobody reads my report. Kids notice first, you know. We're closer to the ground.",
    ];
    if(searched['census-started']){
      const n2=(searched['mice-1']?1:0)+(searched['mice-2']?1:0)+(searched['mice-3']?1:0);
      if(n2>=3){
        searched['census-done']=true;
        return [
          "THREE confirmed sites?! Fieldwork DOES count double when you're tall. Census conclusion: every ring-mouse in the Crossing is moving AWAY from the east quarter. That's not foraging. That's EVACUATING.",
          "...Also they've been hoarding. Under the shard plinth, in the crack. It's all shinies down there. As lead investigator I authorize you to check it. I'd do it myself but my arm doesn't fit.",
        ];
      }
      return [`Sites confirmed: ${n2} of 3. Check where food falls and nobody sweeps: the bakery alley, under the shard plinth, up in the crane housing. FIELDWORK, deputy.`];
    }
    searched['census-started']=true;
    return [
      "Halt. Official business. I'm conducting a census of the ring-mice and I require tall personnel. Fieldwork counts double if you're tall.",
      "Three known sites: the bakery alley, the crack under the shard plinth, and the crane housing. Count noses. Report back. This is IMPORTANT.",
    ];
   }},
  {id:'cask', map:'vantorr', name:'CASK', spr:'cask', x:8,y:3, dir:'down', wander:false,
   lines:()=>[
    "Cask. I run the still. Ringshine — brewed off lamp-lichen, aged in whatever the wardens didn't count. The town runs on water, credit, and me.",
    "The wardens tithe my still twice, you know. TWICE. Because they like it. There's a compliment buried in that extortion and some nights I almost dig it up.",
   ]},
  {id:'thess', map:'vantorr', name:'PILGRIM THESS', spr:'thess', x:17,y:6, dir:'left', wander:false,
   lines:()=>[
    "Pilgrim Thess. Crossed three systems to hear the famous shard. ...I expected it to be taller.",
    "I've heard 'miracle tax' stories on four worlds now, and it's always the same grift: a man finds old machinery, calls it divinity, and charges the faithful admission. Your Ringwarden isn't a god, locals. He's a LANDLORD with a light show.",
    "...What? I said it LOUDLY on purpose. Somebody here has to.",
   ]},
  {id:'brand', map:'vantorr', name:'BRAND', spr:'brand', x:27,y:9, dir:'left', wander:false,
   when:()=>storyStage>=4,
   lines:()=>{
    if(tithepitDone) return [
      "You emptied it. The pit. I filed ten years of paper into that hole and you emptied it in a NIGHT.",
      vyeJoined? "The guide walked out with you. Good. She's the only one who ever cost them anything going IN." : "…The guide's cage. I saw the manifest. I'm sorry. She was the only one who ever cost them anything going in.",
    ];
    if(storyStage>=5&&!tithepitDone) return ["Too late for the pit. The wardens purged it the hour the Understack fell. Paper burns FAST when it's evidence.","…You hear it too, don't you. The crown. It never shuts up. Lately it's started ANSWERING."];
    if(ledgerSaved){
      brandTalked=true;
      return [
        "You're the dock crew. Keep your voice down. I wore the sash ten years — I deserted the night I saw where the tithe PRISONERS go.",
        "Dasha's book survived? Then there's proof. Page numbers the wardens want burned. The pit is real, salvager — a quarry-prison with a clipboard, and the clipboard has a SCHEDULE.",
        "I've marked the side adit on the east trail. Go before the Understack business breaks open — once it does, they purge the pit and everyone in it. That's procedure. Everything they do is procedure.",
      ];
    }
    return ["A gaunt man in half a warden uniform, the sash torn off. He watches the trail and says nothing. Whatever would make him talk... you don't have it."];
   }},
  {id:'nima', map:'vantorr', name:'NIMA', spr:'kid', x:14,y:6, dir:'up', wander:false,
   when:()=>!(storyStage===4&&!nimaSaved&&!nimaStruck), /* she's gone through the crack */
   lines:()=>{
    if(nimaStruck) return ["…","(She watches the shard with eyes full of ring-light. She doesn't sing anymore. The shard glows a little brighter when she's near, like it's leaning down.)"];
    if(nimaSaved&&storyStage>=6) return [
      "I conducted the WHOLE festival from the plinth! The ring-mice were terrible. Musically. As musicians.",
      "The song's different now. It's not calling anymore. It's just... singing. That's better. That's so much better.",
    ];
    if(nimaSaved) return ["It knew a kind voice! I TOLD you it just wanted someone to sing back properly.","Pock says I'm grounded from following songs. Pock is not the boss of me. ...I'm still a LITTLE grounded."];
    if(storyStage>=3) return [
      "The big glass sang ALL NIGHT during the raid. Nobody else heard it under the shooting. I heard it. It was scared too.",
      "It's louder now. Every day a little louder. ...Isn't it prettier?",
    ];
    return [
      "The big glass hums a song at night. Everyone says it's the wind.",
      "...You're humming it too. You didn't notice? You're doing it RIGHT NOW.",
    ];
   }},
  {id:'oro', map:'vantorr', name:'ORO', spr:'colB', x:18,y:5, dir:'down', wander:false,
   lines:()=>{
    if(storyStage>=6) return [
      "THE STALL. IS. OPEN. Ten years of 'after the festival', and the festival CAME.",
      "Ring-glass! Slightly used! Historically significant as of YESTERDAY! Commemorative shards of the actual battle — I swept them up MYSELF!",
    ];
    return [
      "Ring-glass! Cut this morning! Colors that don't have names yet!",
      "...Stall opens after the festival. Which is after the OTHER festival. Come back. Bring credits. Bring FRIENDS with credits.",
    ];
   }},
  /* Fen, home — gives the Signal Lens (Act 3+ seed) */
  {id:'fen', map:'vantorr', name:'FEN', spr:'fen', x:3,y:3, dir:'down', wander:false,
   when:()=>fenSaved&&storyStage>=4,
   lines:()=>{
    if(!searched['signal-lens']){
      searched['signal-lens']=true;
      inventory.push('Signal Lens');
      return [
        "The crew that walked me out of my own orchard. Mirrit fed you yet? She will. Resistance is impolite and also futile.",
        "Here — my grandfather's. A halo-diver's SIGNAL LENS. \u201cShows you the true shape of a thing, if the light's honest.\u201d Never worked for me. Maybe I never looked at anything untrue enough.",
        "✦ Got SIGNAL LENS. It's inert. It's heavy. Fen looks lighter without it.",
      ];
    }
    return ["The orchard regrows from the quiet ones. Thirty years to a full stand of singers. I'll be seventy. The wardens will be a story we bore the kids with. Good trade."];
   }},
];
/* ═══ Act 2 state (persisted in save.js) ═══ */
let cerilBriefed=false, hobJoined=false, dashaAsked=false;
let dashaSaved=false, dashaLost=false, ledgerSaved=false, fenAsked=false;
let fenSaved=false, fenLost=false, brandTalked=false, tithepitDone=false;
let nimaSaved=false, nimaStruck=false, bracketJoined=false, vyeJoined=false;
let custodiansSpared=false, relicTwo=false, cerilStage5=false;
let defBonus={}, atkBonus={};   /* Crusty Bread / Glass Burr — parallel to hpBonus */
let shardSyncT=0;
/* worldsmith: ambient critters — dust-skitters (Rustharbor) + ring-mice
   (the Crossing; they hoard glittering crumbs, and Pock is counting them) */
const critters=[
  {map:'town', spr:'critter', x:15,y:13, tx:15,ty:13, zone:[6,12,24,14], pause:0},
  {map:'town', spr:'critter', x:12,y:18, tx:12,ty:18, zone:[6,17,26,20], pause:0},
  {map:'town', spr:'critter', x:10,y:2,  tx:10,ty:2,  zone:[5,1,23,3],  pause:0},
  {map:'vantorr', spr:'ringmouse', x:9,y:8,  tx:9,ty:8,  zone:[2,7,13,9],  pause:0},
  {map:'vantorr', spr:'ringmouse', x:13,y:8, tx:13,ty:8, zone:[10,6,16,9], pause:0},
  {map:'vantorr', spr:'ringmouse', x:7,y:4,  tx:7,ty:4,  zone:[2,3,12,4],  pause:0},
];
let ripples=[], rippleT=0, gooShapeT=8000, gooShape=null, gooRect=null;
function findGooRect(){
  if(gooRect) return gooRect;
  const M=MAPS.town; let x0=99,y0=99,x1=-1,y1=-1;
  for(let y=0;y<M.h;y++)for(let x=0;x<M.w;x++) if(M.grid[y][x]==='!'){
    x0=Math.min(x0,x); y0=Math.min(y0,y); x1=Math.max(x1,x); y1=Math.max(y1,y);
  }
  gooRect={x0,y0,x1,y1};
  return gooRect;
}
function updateCritters(dt){
  for(const c of critters){
    if(c.map!==curMap) continue;
    if(c.pause>0){ c.pause-=dt; continue; }
    const dx=c.tx-c.x, dy=c.ty-c.y;
    const d=Math.hypot(dx,dy);
    if(d<0.05){
      c.pause=600+Math.random()*2200;
      for(let tries=0;tries<12;tries++){
        const nx=c.zone[0]+Math.random()*(c.zone[2]-c.zone[0]);
        const ny=c.zone[1]+Math.random()*(c.zone[3]-c.zone[1]);
        if(WALK.has(tileAt(Math.round(nx),Math.round(ny)))){ c.tx=nx; c.ty=ny; break; }
      }
    } else {
      c.x+=dx/d*dt*0.0022; c.y+=dy/d*dt*0.0022;
    }
  }
}
let pipLine=0;
const LOOTS={
  town:{
    '4,17':{msg:'Behind the barrel, a miner\u2019s pouch — found 25 credits!', credits:25},
    '20,17':{msg:'Found 15 credits in an old coolant can!', credits:15},
    '10,20':{msg:'Found a REPAIR SPRAY inside!', item:'Repair Spray'},
  },
  worm:{
    '9,1':{msg:'Pickled somethings. Best left pickled.'},
    '10,1':{msg:'Found a RATION PACK! (It smells faintly of worms now.)', item:'Ration Pack'},
  },
};
const SHRINE={x:24,y:2};
/* worldsmith: coordinate-keyed flavor examines (no loot, just lives) */
const FLAVOR={
  vantorr:{
    '4,10':"The tollhouse desk, seen through the doorway: two chairs. Ceril's, worn shiny — and a second one, squared to the desk, waiting for the late shift.",
    '2,2':"Mirrit and Fen's door. Two names on the plate. The second name's paint is fresher — it gets redone every year, you'd guess.",
    '7,2':"Cask's door. The still behind it thumps like a slow heart, and the whole doorframe smells faintly of licorice and crime.",
    '12,2':"Widow Sol's door. A wind-string of glass chimes hangs over it: cyan, magenta, lime. And one colorless bell she never explains.",
    '4,4':"An old mural of the sky, painted on the adobe. You count the rings twice. You get a different number each time.",
    '3,6':"Bale's window sill. One loaf, still warm, set out facing the rings. It's always the first of the batch. Nobody in town would dream of touching it.",
    '4,14':"The dock edge drops into the canyon dark. Somewhere below, wind threads old machinery, and the machinery hums back. Everything on this world sings SOMETHING.",
    '27,2':"Directly above: the sealed crack in the canyon wall. Ring-mice used to nest along this stretch. Used to.",
  },
  town:{
    '17,14':"A hopscotch grid chalked into the plaza stone. The final square just says 'SPACE'.",
    '16,3':"A coolant grate. Something below it is humming along with the flow — slightly flat.",
    '2,20':"The bunkhouse door. A sign: SHIFT FOUR SLEEPS DAYS. A second sign: YES, STILL. A third sign has only a drawing of a fist.",
    '31,20':"A trampled trail leads east into the sump. Something heavy has been dragging itself along it. Recently. Both directions.",
    '29,14':"A hand-lettered sign over the door: VENN'S SUNDRIES. Under it, smaller: NO REFUNDS. Under THAT, smaller still: OR EXCHANGES. WE'VE DISCUSSED THIS.",
    '1,8':"SHAFT NINE — the west adit. The elevator cage is up, the lights are on, and nobody sent for either.",
  },
};
const KEP_STOCK=[
  {name:'Ration Pack', price:20, desc:'Restores HP in the field.'},
  {name:'Repair Spray', price:30, desc:'Patches armor and bots alike.'},
  {name:'Cell Pack', price:25, desc:'Restores a caster\u2019s MP.'},
  {name:'Glass Charm', price:90, desc:'\u201cKeeps the hymn out of your dreams.\u201d That\u2019s the pitch. Kep doesn\u2019t write the pitches.'},
];
let activeShop={stock:null, keeper:'VENN'};
const SHOP_STOCK=[
  {name:'Ration Pack', price:20, desc:'Restores HP in the field.'},
  {name:'Repair Spray', price:30, desc:'Patches armor and bots alike.'},
  {name:'Cell Pack', price:25, desc:'Restores a caster\u2019s MP.'},
  {name:'Dormant Spore', price:120, desc:'A leathery sphere. Faintly warm. Venn won\u2019t say where it came from.'},
];
function renderHUD(){
  const sc=document.getElementById('shop-cr');
  if(sc && shopEl.classList.contains('show')) sc.textContent='₡ '+credits;
  const ic=document.getElementById('items-cr');
  if(ic && itemsEl.classList.contains('show')) ic.textContent='₡ '+credits;
}
/* shop */
const shopEl=document.getElementById('shop');
function openShop(){
  tstate='shop';
  document.getElementById('shop-cr').textContent='₡ '+credits;
  const list=document.getElementById('shop-list');
  list.innerHTML='';
  const stock=activeShop.stock||SHOP_STOCK;
  const disc=activeShop.keeper==='KEP'&&ledgerSaved;
  for(const it of stock){
    const oneOff = it.name==='Dormant Spore'||it.name==='Glass Charm';
    const owned = oneOff && inventory.includes(it.name);
    const price = disc? Math.ceil(it.price*0.8) : it.price;
    const b=document.createElement('button');
    b.className='shopitem';
    b.innerHTML=`<span>${owned?'<s>'+it.name+'</s> (sold)':it.name}<small>${it.desc}</small></span><span class="pr">₡${price}</span>`;
    b.disabled=owned;
    b.onclick=()=>buyItem(Object.assign({},it,{price}));
    list.appendChild(b);
  }
  const ex=document.createElement('button');
  ex.className='shopitem exit';
  ex.innerHTML='<span>Leave shop</span>';
  ex.onclick=()=>{shopEl.classList.remove('show'); tstate='walk';};
  list.appendChild(ex);
  shopEl.classList.add('show');
}
function buyItem(it){
  if(credits<it.price){
    shopEl.classList.remove('show');
    if(activeShop.keeper==='KEP') openDialog('KEP',["The book says you can't afford it. The book is never wrong and never sorry."]);
    else openDialog('VENN',["Credits first, salvage after. That's the whole economy, friend."]);
    return;
  }
  credits-=it.price;
  inventory.push(it.name);
  renderHUD();
  shopEl.classList.remove('show');
  if(it.name==='Glass Charm'){
    openDialog('KEP',[
      "The charm. Huh. Third one I've sold in ten years.",
      "For the record: I don't know if it works. The woman who cuts them sleeps like a stone and hums in her sleep, so make of that what you will.",
    ]);
    return;
  }
  if(activeShop.keeper==='KEP'){
    openDialog('KEP',["Entered. Paid. Witnessed. The book thanks you \u2014 I'm merely its spokesman."]);
    return;
  }
  if(it.name==='Dormant Spore'){
    openDialog('VENN',[
      "...You're actually buying it? Huh.",
      "Hauler crew swore it hummed when they crossed the radiation belt. Kept it in a lead box after that.",
      "No refunds. And, uh... maybe don't keep it near your bunk.",
    ]);
  } else {
    openDialog('VENN',["Pleasure doing business!"]);
  }
}
/* items */
const itemsEl=document.getElementById('items');
function openItems(){
  if(tstate!=='walk'||mode!=='town') return;
  tstate='items';
  document.getElementById('items-cr').textContent='₡ '+credits;
  const list=document.getElementById('items-list');
  list.innerHTML='';
  if(!inventory.length){
    list.innerHTML='<div style="font-size:12px; padding:6px 8px; color:var(--dim)">Your pack is empty.</div>';
  }
  for(const it of inventory){
    const b=document.createElement('button');
    b.className='shopitem';
    let note='';
    if(it==='Worm Soup') note='Rich, mineral, faintly wriggling. Still warm — somehow.';
    else if(it==='Crusty Bread') note='Dense as a brick, warm as a promise. It keeps.';
    else if(it==='Glass Burr') note='A whetstone of ring-glass. It sings against a blade.';
    else if(it==='Glass Charm') note='Cool to the touch. You have, in fairness, been sleeping fine.';
    else if(it==='Signal Lens') note='Shows the true shape of a thing, if the light\u2019s honest. Inert. For now.';
    else if(it==='Halo Heart') note='The second relic. It harmonizes with the first, quietly, all the time now.';
    else if(it==='Dormant Spore') note='Warm. Slightly warmer than yesterday, if you\u2019re honest.';
    else if(it==='Ration Pack') note='In battle: your action, +12 HP.';
    else if(it==='Repair Spray') note='In battle: your action, +18 HP.';
    else if(it==='Cell Pack') note='In battle: your action, +8 MP.';
    else note='Best saved for the field.';
    const usable = it==='Worm Soup'||it==='Crusty Bread'||it==='Glass Burr';
    b.innerHTML=`<span>${it}<small>${note}</small></span><span class="pr">${usable?'USE ▸':''}</span>`;
    b.onclick=()=>{
      if(it==='Worm Soup') pickSoupTarget();
      else if(it==='Crusty Bread') pickBuffTarget('Crusty Bread', defBonus, 2, 'DEF', n2=>`${n2} eats the heel slowly, crust first. It tastes like being LOOKED AFTER. DEF permanently +2!`);
      else if(it==='Glass Burr') pickBuffTarget('Glass Burr', atkBonus, 1, 'ATK', n2=>`${n2} draws a blade across the burr — one pass, one clear ringing note. ATK permanently +1!`);
    };
    list.appendChild(b);
  }
  if(Object.keys(hpBonus).length){
    const d=document.createElement('div');
    d.style.cssText='font-size:11px;padding:6px 8px;color:#8be04e;border-top:1px dashed #c8d4ff55;margin-top:4px;text-shadow:1px 1px 0 #000;';
    d.textContent=Object.entries(hpBonus).map(([n2,v])=>n2+' +'+v+' max HP').join(' · ');
    list.appendChild(d);
  }
  const ex=document.createElement('button');
  ex.className='shopitem exit';
  ex.innerHTML='<span>Close pack</span>';
  ex.onclick=()=>{itemsEl.classList.remove('show'); tstate='walk';};
  list.appendChild(ex);
  itemsEl.classList.add('show');
}
function pickSoupTarget(){
  const list=document.getElementById('items-list');
  list.innerHTML='<div style="font-size:12px; padding:2px 8px 8px; color:var(--dim)">Who slurps the worm soup?</div>';
  for(const n2 of CREW){
    if(n2==='Hob'&&!hobJoined) continue;
    if(n2==='Vye'&&!vyeJoined) continue;
    if(n2==='Bracket'&&!bracketJoined) continue;
    const b=document.createElement('button');
    b.className='shopitem';
    b.innerHTML=`<span>${n2}</span><span class="pr">▸</span>`;
    b.onclick=()=>{
      inventory=inventory.filter(i=>i!=='Worm Soup');
      hpBonus[n2]=(hpBonus[n2]||0)+3;
      renderHUD();
      itemsEl.classList.remove('show');
      openDialog('—',[
        `${n2} slurps the worm soup. It is... genuinely delicious?`,
        `A deep mineral warmth settles into ${n2}'s bones — and stays there. MAX HP permanently +3!`,
      ]);
    };
    list.appendChild(b);
  }
  const ex=document.createElement('button');
  ex.className='shopitem exit';
  ex.innerHTML='<span>Never mind — keep the soup</span>';
  ex.onclick=()=>{itemsEl.classList.remove('show'); tstate='walk';};
  list.appendChild(ex);
}
function pickBuffTarget(itemName, bonusMap, amt, statName, msgFn){
  const list=document.getElementById('items-list');
  list.innerHTML=`<div style="font-size:12px; padding:2px 8px 8px; color:var(--dim)">Who uses the ${itemName.toLowerCase()}?</div>`;
  for(const n2 of CREW){
    if(n2==='Hob'&&!hobJoined) continue;
    if(n2==='Vye'&&!vyeJoined) continue;
    if(n2==='Bracket'&&!bracketJoined) continue;
    const b=document.createElement('button');
    b.className='shopitem';
    b.innerHTML=`<span>${n2}</span><span class="pr">▸</span>`;
    b.onclick=()=>{
      let removed=false;
      inventory=inventory.filter(i=>{ if(!removed&&i===itemName){removed=true; return false;} return true; });
      bonusMap[n2]=(bonusMap[n2]||0)+amt;
      renderHUD();
      itemsEl.classList.remove('show'); tstate='walk';
      openDialog('—',[msgFn(n2)]);
    };
    list.appendChild(b);
  }
  const ex=document.createElement('button');
  ex.className='shopitem exit';
  ex.innerHTML='<span>Never mind</span>';
  ex.onclick=()=>{itemsEl.classList.remove('show'); tstate='walk';};
  list.appendChild(ex);
}
/* transitions */
let tfade=0, tfadeDir=0, afterFade=null;
function startFade(cb){ tfadeDir=1; afterFade=cb; }
function enterShop(){
  curMap='shopint'; tstate='walk';
  hero.x=SHOP_SPAWN.x; hero.y=SHOP_SPAWN.y; hero.dir='up';
  hero.moving=false; hero.prog=0; tCamInit=false;
}
function exitShop(){
  curMap='town'; tstate='walk';
  hero.x=SHOP_DOOR.x; hero.y=SHOP_DOOR.y+1; hero.dir='down';
  hero.moving=false; hero.prog=0; tCamInit=false;
}
function enterHouse(){
  startFade(()=>{
    curMap='worm';
    hero.x=HOUSE_SPAWN.x; hero.y=HOUSE_SPAWN.y; hero.dir='up';
    hero.moving=false; hero.prog=0;
  });
}
function exitHouse(){
  startFade(()=>{
    curMap='town';
    hero.x=EXIT_RETURN.x; hero.y=EXIT_RETURN.y; hero.dir='down';
    hero.moving=false; hero.prog=0;
  });
}
function enterLedger(){
  startFade(()=>{
    curMap='ledger'; tstate='walk';
    hero.x=4; hero.y=4; hero.dir='up';
    hero.moving=false; hero.prog=0;
  });
}
function exitLedger(){
  startFade(()=>{
    curMap='vantorr'; tstate='walk';
    hero.x=23; hero.y=8; hero.dir='down';
    hero.moving=false; hero.prog=0;
  });
}
let bowlGaveThisVisit=false;
function enterHall(){
  startFade(()=>{
    curMap='hall'; tstate='walk';
    bowlGaveThisVisit=false;
    hero.x=4; hero.y=5; hero.dir='up';
    hero.moving=false; hero.prog=0;
  });
}
function exitHall(){
  startFade(()=>{
    curMap='vantorr'; tstate='walk';
    hero.x=22; hero.y=3; hero.dir='down';
    hero.moving=false; hero.prog=0;
  });
}
function enterTemple(){
  setMode('town');
  curMap='temple';
  tstate='walk';
  hero.x=3; hero.y=9; hero.dir='up';
  hero.hidden=false; hero.moving=false; hero.prog=0;
  tCamInit=false;
  openDialog('—',[
    "Cold blue light. Air that has never been breathed.",
    "The corridor stones hum the relic's hymn — perfectly, patiently in tune. At the far end, something waits on a raised dais.",
  ]);
}
function enterVantorr(){
  setMode('town');
  curMap='vantorr';
  tstate='walk';
  hero.x=7; hero.y=12; hero.dir='right';
  hero.hidden=false; hero.moving=false; hero.prog=0;
  tCamInit=false;
  const sub=document.getElementById('subline');
  if(sub) sub.textContent="Vantorr · Ceril's Crossing · ACT 2";
  openDialog('—',[
    "Ceril's Crossing — a bazaar grown up around a fallen shard of the halo, still glowing after ten thousand years.",
    "Above the canyon walls, three broken rings arc across an orange sky. The relic in Dax's pack has gone quiet — the way a singer goes quiet to listen.",
    "It's tithe week. Half the stalls are shuttered, the dock is too quiet, and there's a citation stapled to the shuttle before the engines even cool.",
  ], ()=>{
    openDialog('VESPER',[
      "...Dax. The shard. Do you hear it? No — of course you don't. It's not sound, it's PRESSURE. Like a choir leaning on the inside of my skull.",
      "I'll be fine. I just need to sit down. Possibly on another planet.",
    ], ()=>{
      openDialog('GUNNAR-7',["ALERT: uniformed personnel approaching with CLIPBOARDS. In my experience nothing good has ever approached with a clipboard.","ACT 2 — THE RINGLIT WORLD. Talk to everyone. Search everything."]);
    });
  });
}
function talkChef(){
  chefTalks++;
  if(chefTalks===1){
    openDialog('MOTHER SKITTERLY',[
      "Glk! A customer? No, no — a GUEST. Sit! Smell! The worms render slow, warm-walker.",
      "Thousand-year worms, from the deep stacks. They graze on the old machines' rust. Very mineral. Very good for the shell. You have no shell. Tragic.",
    ]);
  } else if(chefTalks===2){
    openDialog('MOTHER SKITTERLY',[
      "Back again? The pot likes an audience. It thickens faster when watched. This is science.",
      "My grandmother stirred this pot. Her grandmother stirred this pot. The pot... remembers. Glk-glk!",
    ]);
  } else if(chefTalks===3 && !searched['soup-given']){
    searched['soup-given']=true;
    inventory.push('Worm Soup');
    renderHUD();
    openDialog('MOTHER SKITTERLY',[
      "THREE visits! Patience like a grub! You have earned a taste, warm-walker.",
      "Here — WORM SOUP, ladled at the perfect roll. Got ✦ WORM SOUP!",
      "Fresh from the pot, it does what soup has always done — only more so. Glk. What it does later... that is between you and the soup.",
    ]);
  } else {
    if(inventory.includes('Worm Soup')){
      openDialog('MOTHER SKITTERLY',["Still carrying it? Glk-glk. Soup keeps its own calendar, warm-walker. I will say nothing more. The pot dislikes gossip."]);
    } else if(searched['soup-given']){
      openDialog('MOTHER SKITTERLY',["Strong bones now, yes? The worms approve. The worms that remain, anyway."]);
    } else {
      openDialog('MOTHER SKITTERLY',["The pot thickens. Come back and keep an old bug company, glk."]);
    }
  }
}
function talkRiga(){
  if(storyStage<2){
    openDialog('RIGA',[
      storyStage===0
        ? "Launch? With WHAT crew? You, a healer, and a war-bot older than the crater? Okari's sensor line in the eastern sump went dark last night — go make yourself useful and come back with more friends."
        : "Closer. But I'm not burning fuel until shaft nine stops singing. Take the west adit — and take the wolf, he's been pacing my landing yard like it owes him money.",
    ]);
    return;
  }

  openDialog('RIGA',[
    "Shuttle's on standby in orbit — one ping and she drops onto the pad.",
    "Fair warning: shaft nine's on the far side of the belt. Rough neighborhood lately. No strolling back up here for a while.",
  ],()=>{
    openChoice('RIGA','Call the shuttle down and launch for shaft nine?',[
      {label:'▶ LAUNCH', cb:startLaunch},
      {label:'NOT YET', cb:()=>{}},
    ]);
  });
}
/* launch cutscene */
let cut=null;
const PAD_CENTER={x:6,y:19};
function startLaunch(){
  tstate='cutscene';
  cut={phase:'fly-in', t:0, ship:{x:0,y:0}, dust:[], path:null};
}
function bfsPath(sx,sy,tx2,ty2){
  const M=MAPS[curMap];
  const prev={}; const q=[[sx,sy]]; const seen=new Set([sx+','+sy]);
  while(q.length){
    const [x,y]=q.shift();
    if(x===tx2&&y===ty2){
      const path=[]; let k=x+','+y;
      while(prev[k]){ const [px2,py2]=k.split(',').map(Number); path.unshift([px2,py2]); k=prev[k]; }
      return path;
    }
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
      const nx=x+dx, ny=y+dy;
      const kk=nx+','+ny;
      if(seen.has(kk)) continue;
      if(nx<0||ny<0||nx>=M.w||ny>=M.h) continue;
      if(!WALK.has(M.grid[ny][nx])) continue;
      if(npcs.some(n2=>n2.map===curMap&&(!n2.when||n2.when())&&n2.x===nx&&n2.y===ny)) continue;
      seen.add(kk); prev[kk]=x+','+y; q.push([nx,ny]);
    }
  }
  return [];
}
/* ═══ ARRIVAL — the opening: the shuttle sets down on the landing pad and
   Dax walks up the terrace stairs straight into Foreman Okari. No wander
   loop: the first conversation finds YOU. ═══ */
function startArrival(){
  setMode('town');
  curMap='town'; tstate='cutscene';
  hero.x=PAD_CENTER.x; hero.y=PAD_CENTER.y+1;
  hero.px=hero.x*TS; hero.py=hero.y*TS;
  hero.hidden=true; hero.moving=false; hero.prog=0; hero.dir='up';
  tCamInit=false;
  cut={kind:'arrive', phase:'fly-in', t:0, ship:{x:0,y:0}, dust:[], path:null};
}
function updateArrival(dt){
  const padPx=PAD_CENTER.x*TS+TS/2, padPy=PAD_CENTER.y*TS+TS/2;
  cut.t+=dt;
  if(cut.phase==='fly-in'){
    const p=Math.min(1,cut.t/2100);
    const e=ease(p);
    cut.ship.x = padPx + (1-e)*620;
    cut.ship.y = padPy - 6 - (1-e)*380;
    if(p>=1){
      cut.phase='dust'; cut.t=0;
      for(let i=0;i<10;i++) cut.dust.push({a:Math.random()*6.28, r:6+Math.random()*8, sp:.05+Math.random()*.08, life:0});
    }
  } else if(cut.phase==='dust'){
    if(cut.t>600){
      cut.phase='narrate'; cut.t=0;
      hero.hidden=false;
      openDialog('RUSTHARBOR',[
        "Rustharbor Colony — three terraces carved into an old impact crater. Population: miners, moss farmers, and people who came here to be nobody in particular.",
        "You have: one jacket, one empty pack, one magnificent robot, and zero credits.",
      ], ()=>{
        tstate='cutscene'; /* the dialog close reset us to walk — stay cinematic */
        cut.phase='walkup'; cut.t=0;
        cut.path=bfsPath(hero.x,hero.y,14,12); /* the plaza, beside the foreman */
      });
    }
  } else if(cut.phase==='walkup'){
    if(!hero.moving){
      if(cut.path&&cut.path.length){
        const [nx,ny]=cut.path.shift();
        hero.dir = nx>hero.x?'right':nx<hero.x?'left':ny>hero.y?'down':'up';
        hero.moving=true; hero.mx=nx-hero.x; hero.my=ny-hero.y; hero.prog=0;
      } else {
        cut.phase='greet'; cut.t=0;
        hero.dir='left';
        const ok=npcs.find(n2=>n2.id==='elder');
        if(ok){ ok.x=13; ok.y=12; ok.dir='right'; } /* the foreman meets you */
        openDialog('FOREMAN OKARI', ok?ok.lines():["Work? See the shrine on the ridge."], ()=>{
          cut=null; tstate='walk';
        });
      }
    }
  }
}
function updateLaunch(dt){
  if(cut&&cut.kind==='arrive'){ updateArrival(dt); return; }
  const padPx=PAD_CENTER.x*TS+TS/2, padPy=PAD_CENTER.y*TS+TS/2;
  cut.t+=dt;
  if(cut.phase==='fly-in'){
    const T1=2100;
    const p=Math.min(1,cut.t/T1);
    const e=ease(p);
    cut.ship.x = padPx + (1-e)*620;
    cut.ship.y = padPy - 6 - (1-e)*380;
    if(p>=1){
      cut.phase='dust'; cut.t=0;
      for(let i=0;i<10;i++) cut.dust.push({a:Math.random()*6.28, r:6+Math.random()*8, sp:.05+Math.random()*.08, life:0});
    }
  } else if(cut.phase==='dust'){
    if(cut.t>500){
      cut.phase='walk'; cut.t=0;
      cut.path=bfsPath(hero.x,hero.y,PAD_CENTER.x,PAD_CENTER.y+1);
    }
  } else if(cut.phase==='walk'){
    if(!hero.moving){
      if(cut.path&&cut.path.length){
        const [nx,ny]=cut.path.shift();
        hero.dir = nx>hero.x?'right':nx<hero.x?'left':ny>hero.y?'down':'up';
        hero.moving=true; hero.mx=nx-hero.x; hero.my=ny-hero.y; hero.prog=0;
      } else {
        cut.phase='board'; cut.t=0; hero.dir='up';
      }
    }
  } else if(cut.phase==='board'){
    if(cut.t>700){ hero.hidden=true; cut.phase='hold'; cut.t=0; }
  } else if(cut.phase==='hold'){
    if(cut.t>500){ cut.phase='lift'; cut.t=0; }
  } else if(cut.phase==='lift'){
    const T2=1900;
    const p=Math.min(1,cut.t/T2);
    const e=p*p;
    cut.ship.x = padPx + e*760;
    cut.ship.y = padPy - 6 - e*460 - Math.sin(p*3)*6;
    if(p>=1){ cut.phase='fadeout'; cut.t=0; }
  } else if(cut.phase==='fadeout'){
    if(cut.t>700){ cut.phase='done'; startSpace(); }
  }
}
/* interaction */
const DIRV={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};
function checkTrailExits(){
  if(tstate!=='walk'||dlgActive) return;
  if(curMap==='vantorr'){
    if(hero.x>=29&&hero.y===9){
      hero.x=28; hero.moving=false; hero.prog=0;
      if(storyStage===2){
        openDialog('—',["The east canyon trail, past the ossuary bells. A warden checkpoint bars the narrows — tithe week. \u201cThe fields are CLOSED for assessment,\u201d the sign says. The warden under the sign doesn't even look up."]);
      } else if(storyStage===3){
        openDialog('—',[
          "The east canyon opens toward the ring-fall fields. When the wind turns, the whole horizon RINGS — thousands of glass bells nobody hung.",
          "Somewhere out there: Fen's crashed vapor rig, and the warden sweep working toward it, cutting only the glass that SINGS.",
        ], ()=>startBattle(MISSION_GLASSFIELDS));
      } else if(storyStage===4){
        if(brandTalked&&!tithepitDone){
          openChoice('THE OSSUARY TRAIL','Brand\u2019s mark on the canyon wall points to a side adit — the tithe-pit. The schedule down there doesn\u2019t wait.',[
            {label:'▸ THE TITHE-PIT', cb:()=>openDialog('BRAND',[
              "Through here. Quiet on the ramps — the pit-boss posts a SCHEDULE, and you do not want to see what it's a schedule OF.",
              "The guide's cage is the third one. If you do nothing else down there... the third one.",
            ], ()=>startBattle(MISSION_TITHEPIT))},
            {label:'NOT YET', cb:null},
          ]);
        } else if(tithepitDone){
          openDialog('—',["The fields lie quiet, cut and counted. The pit stands open and empty behind its broken gate. Whatever is left of this act is UNDER the town now — the crack in the northeast wall."]);
        } else {
          openDialog('—',["The fields lie quiet now. Further up the trail, a side adit — and a man in half a warden uniform watching it. He might talk. He'd need a REASON to."]);
        }
      } else if(storyStage===5){
        if(!cerilStage5){
          openDialog('—',["The ossuary trail climbs toward a crown-colored glare on the ridge. Ceril is standing the dock crews down — talk to him before the crew marches. Some walks you only take once."]);
        } else {
          openDialog('—',[
            "The trail past the ossuary. Every bell is ringing, very softly, all together — the way glass does when something enormous is being sung one canyon over.",
            "At the top: the node chamber, the cradle, and the man wearing the halo's crown.",
          ], ()=>startBattle(MISSION_RINGWARDEN));
        }
      } else {
        openDialog('—',["The canyon trail, after. The bells ring for the festival now. Nobody is counting anything out here anymore."]);
      }
      return;
    }
    return;
  }
  if(curMap!=='town') return;
  if(hero.x>=32&&hero.y===20){
    hero.x=31; hero.moving=false; hero.prog=0;
    if(storyStage===0){
      if(!metOkari){
        openDialog('—',["The trail drops into the Eastern Sump. You have no crew, no credits, and no reason to wade into a bog for free. Someone in town must be hiring — the foreman, probably."]);
      } else if(!haleJoined){
        openDialog('GUNNAR-7',["Objection. Okari's condition was A CREW. Current roster: one ex-convict, one magnificent robot. The Sister at the ridge shrine first."]);
      } else {
        openDialog('—',[
          "The trail drops off the terrace into the Eastern Sump — lime pools, black goo, and a smell with OPINIONS.",
          "Somewhere out there, Okari's sensors went dark. Somewhere closer, something is breathing.",
        ], ()=>startBattle(MISSION_SUMP));
      }
    } else {
      openDialog('—',["The sump is quiet now. Whatever the Maw was keeping out of the colony... the colony can worry about that later."]);
    }
    return;
  }
  if(hero.x<=0&&hero.y===8){
    hero.x=1; hero.moving=false; hero.prog=0;
    if(storyStage===0){
      openDialog('—',["Shaft nine's elevator cage rattles like teeth. Kharn stands at the adit, listening. 'Not yet, salvager. The sump first — I do not take a healer and a half-crew into THAT sound.'"]);
    } else if(storyStage===1){
      openDialog('—',[
        "The elevator cage drops into shaft nine. The deeper it goes, the more the dark sounds like machinery arguing with itself.",
        "Kharn steps in beside you without being asked, blade already loose.",
      ], ()=>startBattle(MISSION_SHAFT9));
    } else {
      openDialog('—',["Shaft nine stands silent — honestly silent, for the first time in weeks. Vesper doesn't look at it."]);
    }
    return;
  }
}
/* ═══ THE QUIET BOWL — the act's planted secret. Never explained. ═══ */
function bowlInteract(){
  const given=searched['bowl-given']||0;
  const contents = given>=3 ? "It holds two bent chits, a button, and whatever kindness looks like when it's counted."
    : "It holds two bent chits and a button.";
  openDialog('—',["A wooden bowl, older than the benches. "+contents], ()=>{
    openChoice('THE TITHE BOWL','Leave something?',[
      {label:'LEAVE 10₡', cb:()=>{
        if(credits<10){ openDialog('—',["You reach for chits you don't have. The bowl doesn't judge. The bowl has seen weeks like yours."]); return; }
        credits-=10; renderHUD();
        if(!bowlGaveThisVisit){
          bowlGaveThisVisit=true;
          searched['bowl-given']=(searched['bowl-given']||0)+1;
        }
        openDialog('—',["The chits settle among the button and the bent ones. Nothing happens. Nobody saw."]);
      }},
      {label:'NOT TODAY', cb:null},
    ]);
  });
}
/* ═══ TITHE NIGHT falls — the Act 2 Battle 1 trigger ═══ */
function nightFall(){
  startFade(()=>{
    hero.hidden=true;
    openDialog('—',[
      "The dock lamps brown out one by one. Someone scheduled this.",
      "Boots on plating. Many. Early. A loudhailer crackles across the dark dock, bored and official:",
      "\u201cBY ORDER OF THE RINGWARDEN: this dock is cited for arrears. Stand clear of your property while it stops being yours.\u201d",
      "Hob is already pulling on her gloves. \u201cThey're not collecting. They're STRIPPING the dock. Wake everyone \u2014 and somebody tell the clerk to RUN.\u201d",
    ], ()=>{
      hero.hidden=false;
      startBattle(MISSION_TITHE);
    });
  });
}
function interact(){
  if(mode!=='town') return;
  if(dlgActive){ advanceDialog(); return; }
  if(tstate!=='walk') return;
  const [dx,dy]=DIRV[hero.dir];
  const tx2=hero.x+dx, ty2=hero.y+dy;
  const n2=npcs.find(n3=>n3.map===curMap&&(!n3.when||n3.when())&&n3.x===tx2&&n3.y===ty2);
  if(n2){
    n2.dir = hero.dir==='up'?'down':hero.dir==='down'?'up':hero.dir==='left'?'right':'left';
    if(n2.id==='chef'){ talkChef(); return; }
    if(n2.id==='mech'){ talkRiga(); return; }
    if(n2.shop){
      activeShop = n2.id==='kep' ? {stock:KEP_STOCK, keeper:'KEP'} : {stock:SHOP_STOCK, keeper:'VENN'};
      openDialog(n2.name, n2.lines(), openShop);
    }
    else{ openDialog(n2.name, n2.lines()); }
    return;
  }
  const ch=tileAt(tx2,ty2);
  const kkey=tx2+','+ty2;
  if(curMap==='town'&&ch==='A'){
    if(hero.dir==='down' && hero.y===SHRINE.y-1 && hero.x===SHRINE.x){
      if(!searched['shrine-stash']){
        searched['shrine-stash']=true;
        credits+=80; renderHUD();
        openDialog('—',["Wedged in a gap behind the shrine... a pouch of credit chits! Found 80 credits!"]);
      } else {
        openDialog('—',["Just the shrine's cold backside. The gap is empty now."]);
      }
    } else {
      openDialog('—',["An ancient shrine. The crystal hums faintly — the same pitch as the relic in your pack."]);
    }
    return;
  }
  /* ═══ Ceril's Crossing interactions ═══ */
  if(curMap==='hall'&&ch==='t'){ bowlInteract(); return; }
  if(curMap==='vantorr'){
    /* the shuttle: rest = the night trigger (ACT2.md, storyStage 2) */
    if(ch==='p'||tileAt(hero.x,hero.y)==='p'){
      if(storyStage>=3){ openDialog('—',["The shuttle ticks as it cools. Gunnar-7 has re-catalogued the hold twice out of spite. It's starting to feel like home, which worries everyone."]); return; }
      if(!cerilBriefed){ openDialog('—',["A warden citation is stapled to the gangway: MASS TARIFF ARREARS — DO NOT DEPART. Stapled. To a starship. The dockmaster's tollhouse is just north of the pads."]); return; }
      if(!hobJoined){ openDialog('SISTER HALE',["Vesper's resting in the hold — the shard's hymn presses on her hard, poor thing, and Gunnar is... filing objections from his cage.","We are down two, Dax. If there's a spare pair of hands on this dock, find them before nightfall. The dockmaster mentioned the dray pens."]); return; }
      openChoice('THE SHUTTLE','Tithe night falls within the hour. Turn in aboard the shuttle?',[
        {label:'▸ TURN IN', cb:nightFall},
        {label:'NOT YET', cb:null},
      ]);
      return;
    }
    /* ring-mouse census fieldwork (Pock's three sites) */
    if(searched['census-started']&&!searched['census-done']){
      const spot = kkey==='8,6'?'mice-1' : kkey==='15,6'?'mice-2' : (kkey==='10,10'||kkey==='11,10')?'mice-3' : null;
      if(spot&&!searched[spot]){
        searched[spot]=true;
        const msgs={
          'mice-1':"Behind the bakery: a crumb-cache the size of a helmet. Ring-mice everywhere — all packing, all headed WEST. Noses counted: lots.",
          'mice-2':"The crack under the shard plinth. Warm air rises out of it, and a queue of ring-mice files out of the dark, single-file, carrying their shinies. Moving west. All of them.",
          'mice-3':"Up in the crane housing: a nest, freshly abandoned. Dry grass still warm. Whatever the mice know, they knew it here first.",
        };
        openDialog('—',[msgs[spot]+" (Pock will want this reported.)"]);
        return;
      }
    }
    if(kkey==='15,6'&&searched['census-done']&&!searched['mice-hoard']){
      searched['mice-hoard']=true;
      credits+=30; inventory.push('Glass Burr'); renderHUD();
      openDialog('—',[
        "You reach into the plinth crack, past ten generations of mouse. The hoard: 30 credits in 'borrowed' chits... and a whetstone of pure ring-glass. ✦ Got GLASS BURR.",
        "Somewhere behind you, Pock makes a noise only dogs should hear.",
      ]);
      return;
    }
    if(ch==='i'){
      if(storyStage<3) openDialog('GUNNAR-7',["GUNNAR-7 stands very still inside a cage rated for ore. The cage is fine. His dignity is not.","\u201cI have prepared REMARKS,\u201d he says. \u201cForty minutes of remarks. The proctor will hear ALL of them.\u201d"]);
      else openDialog('—',["The impound cage stands empty. Someone has scratched a serial number into the bars from the INSIDE, followed by the word: NEVER."]);
      return;
    }
    if(ch==='n'){ openDialog('—',["Tuck's crane. The hook swings its slow patient arc over the pads. A hand-painted plate on the base reads: CAPACITY 40T. FEELINGS: 0T."]); return; }
    if(ch==='y'){
      if(hobJoined) openDialog('—',["The dray pens. Feed's been measured out to the gram by someone who isn't here anymore. The drays keep looking down the dock, the way she went."]);
      else openDialog('—',["The dray pens — rails chewed, straw churned, one water trough dented into a shape best described as 'argument'."]);
      return;
    }
    if(ch==='e'){
      if(storyStage<4){
        openDialog('—',["A hairline crack in the canyon wall, sealed generations ago with dock-grade plate. Tonight the plate is warm.","If you hold your breath, the crack is humming. The same tune as everything else on this world — one note lower."]);
      } else if(storyStage===4){
        openChoice('THE UNDERSTACK','The plate hangs torn open. Nima\u2019s chalk doodles stop at the threshold. The song comes UP out of the dark. Go down?',[
          {label:'▸ DESCEND', cb:()=>{
            if(!vyeJoined&&!tithepitDone) lostCrew.add('vye'); /* the wardens purge the pit once the Understack falls */
            openDialog('—',[
              "The service stair drops through ten thousand years of fill. Below: dig-lights, drill-song, and something older keeping time.",
              "POCK (behind you, small): \u201cShe went DOWN there. Following the song. You bring her back, deputy. That's an ORDER.\u201d",
            ], ()=>startBattle(MISSION_UNDERSTACK));
          }},
          {label:'NOT YET', cb:null},
        ]);
      } else if(storyStage===5){
        openDialog('—',["The way down stands open, dark and quiet. The fight isn't below anymore. It's up the ossuary trail, wearing a crown."]);
      } else {
        openDialog('—',[custodiansSpared
          ? "Two freed custodians stand watch at the crack, patient as furniture. They have appointed themselves. Tuck down at the docks says they take their job 'extremely seriously and also zero percent seriously'. They wave at children."
          : "The crack stands open and empty. Cold air rises out of the Understack, carrying nothing at all."]);
      }
      return;
    }
    if(ch==='m'){ openDialog('—',["The vapor-well. The mist ribbon leans toward you as you stand here — Meres swears it does that to everyone. The waterline mark on the stone is a hand's width above the water."]); return; }
    if(ch==='G'){ openDialog('—',["The Hymn Hall: one curved slab of fallen ring, raised whole. Every few breaths a ripple of light runs its length, like a note traveling somewhere patient."]); return; }
    if(ch==='g'||ch==='w'){ openDialog('—',["A wall of salvaged ring-glass panes. Cyan, magenta, lime — the sky's colors, paying rent."]); return; }
    if(ch==='r'){ openDialog('—',["The stall is OPEN — first time in weeks, the seller says, to anyone, repeatedly. Ring-glass trinkets, vapor-fruit, hand-bells. The Crossing, breathing again."]); return; }
    if(ch==='v'){
      const newBells=(dashaLost?1:0)+(fenLost?1:0)+(tithepitDone?Math.max(0,4-(searched['pit-freed']||0)):0);
      openDialog('—',["Niche-graves cut into the canyon wall, each holding a small glass bell. When the wind threads the canyon just right, the dead ring softly. Widow Sol tunes them."
        .concat(newBells>0?` …${newBells===1?'One niche is':newBells+' niches are'} cut too recently. The glass in ${newBells===1?'it':'them'} is still bright.`:'')]);
      return;
    }
    if(ch==='F'){ openDialog('—',["Sun-baked adobe, patched with crate lids and optimism."]); return; }
  }
  if(curMap==='hall'&&ch==='b'){ openDialog('—',["A bench worn smooth by ten generations of singers. Someone has carved a tiny fourth ring into the corner. Someone else has tried to sand it off."]); return; }
  const L=(LOOTS[curMap]||{})[kkey];
  if(L){
    const skey=curMap+':'+kkey;
    if(searched[skey]){ openDialog('—',["Nothing else here."]); return; }
    searched[skey]=true;
    if(L.credits){credits+=L.credits;}
    if(L.item){inventory.push(L.item);}
    renderHUD();
    openDialog('—',[L.msg]);
    return;
  }
  if(ch==='C'||ch==='B'){ openDialog('—',["Nothing inside."]); return; }
  if(ch==='d'){
    if(curMap==='vantorr'){ if(ty2===2) enterHall(); else enterLedger(); return; }
    if(tx2===SHOP_DOOR.x&&ty2===SHOP_DOOR.y){ enterShop(); } else { enterHouse(); }
    return;
  }
  if(ch==='D'){
    const fl=FLAVOR[curMap]&&FLAVOR[curMap][kkey];
    if(fl){ openDialog('—',[fl]); return; }
    openDialog('—',[curMap==='vantorr'?"Sealed for tithe week. The Crossing locks what it loves.":"Locked. Colony folk keep their doors sealed since the quakes started."]);
    return;
  }
  if(ch==='W'){ openDialog('—',["Lights on inside. Someone's watching a drama-feed."]); return; }
  if(ch==='~'||ch==='|'){ openDialog('—',["Coolant runoff from the ridge reservoir. It glows a little. Best not to touch it."]); return; }
  if(ch==='!'){
    if(inventory.includes('Dormant Spore')) openDialog('—',["The sludge is not pretending today. The whole surface leans toward you. No — toward your PACK. The spore in it is warm as a heartbeat."]);
    else openDialog('—',["A pit of luminous green sludge. Something large shifts under the surface, then pretends it didn't."]);
    return;
  }
  if(ch==='V'){ openDialog('—',["Venn's new awning. The sign reads: VENN'S SUNDRIES — EST. LAST MONTH. TRUSTED FOR GENERATIONS."]); return; }
  if(ch==='l'){ openDialog('—',["Suit-liners flap on the line. Somebody patched every knee twice. Somebody keeps kneeling."]); return; }
  if(ch==='M'){ openDialog('—',["Lamp-moss racks, glowing faintly green. Each frond leans toward the goo pit like an audience."]); return; }
  if(ch==='S'){ openDialog('—',["The ring-shard. It pulses cyan, magenta, lime... in the exact rhythm of the relic's hymn. Somewhere on this world, relic two is listening."]); return; }
  if(ch==='a'){ openDialog('—',["A market stall, shuttered. A hand-painted sign: BACK AFTER FESTIVAL. Under it, older paint: BACK AFTER HARVEST. Under that: BACK."]); return; }
  if(ch==='Q'){ openDialog('—',["Ring-light pools in the canyon striations — cyan, magenta, lime, laid down in bands like the stone was painted by the sky."]); return; }
  if(ch==='p'){ openDialog('—',["The shuttle ticks as it cools. Not a scratch on her. That is somehow the eeriest part."]); return; }
  const FL=FLAVOR[curMap]&&FLAVOR[curMap][kkey];
  if(FL){ openDialog('—',[FL]); return; }
  if(ch==='c'){ openDialog('—',["A crystal sconce, older than any charted civilization. Its light pulses in time with the relic in your pack."]); return; }
  if(ch==='Y'){ openDialog('—',["Seamless stone. No tool marks. No dust. Ten millennia and no dust."]); return; }
  if(ch==='T'){ /* counter — talk across it to whoever stands behind */
    const n3=npcs.find(n4=>n4.map===curMap&&(!n4.when||n4.when())&&Math.abs(n4.x-tx2)<=1&&Math.abs(n4.y-ty2)<=1);
    if(n3){
      n3.dir = hero.dir==='up'?'down':hero.dir==='down'?'up':hero.dir==='left'?'right':'left';
      if(n3.shop){
        activeShop = n3.id==='kep' ? {stock:KEP_STOCK, keeper:'KEP'} : {stock:SHOP_STOCK, keeper:'VENN'};
        openDialog(n3.name, n3.lines(), openShop);
      }
      else openDialog(n3.name, n3.lines());
      return;
    }
    openDialog('—',["Venn's counter, polished to a suspicious shine."]); return;
  }
  if(ch==='u'){ openDialog('—',["A pot of worms rolls in a slow, dignified boil. It smells... genuinely wonderful? You feel confused about this."]); return; }
  if(ch==='t'){ openDialog('—',["Two bowls, pre-set. One of them has a place card. It says 'GUEST'. It has said that for forty years."]); return; }
  if(ch==='L'){ openDialog('—',["A plaza lamp. Moths from three different planets orbit it."]); return; }
  if(ch==='K'&&(hero.dir==='up'||hero.dir==='down')){ openDialog('—',["A sheer crater wall. You'd need the stairs."]); return; }
  if(curMap==='town'&&(ch==='P'||tileAt(hero.x,hero.y)==='P')){ talkRiga(); return; }
}
/* town movement */
const held={};
function tryMove(dir){
  if(hero.moving||tstate!=='walk'||mode!=='town') return;
  hero.dir=dir;
  const [dx,dy]=DIRV[dir];
  const nx=hero.x+dx, ny=hero.y+dy;
  const ch=tileAt(nx,ny);
  if(curMap==='town'&&ch==='d'){
    if(nx===SHOP_DOOR.x&&ny===SHOP_DOOR.y) enterShop(); else enterHouse();
    return;
  }
  if(curMap==='vantorr'&&ch==='d'){
    if(ny===2) enterHall(); else enterLedger();
    return;
  }
  if(!WALK.has(ch)) return;
  if(npcs.some(n2=>n2.map===curMap&&(!n2.when||n2.when())&&n2.x===nx&&n2.y===ny)) return;
  hero.moving=true; hero.mx=dx; hero.my=dy; hero.prog=0;
}
function updateHero(dt){
  if(hero.moving){
    const speed = (tileAt(hero.x,hero.y)==='/'||tileAt(hero.x+hero.mx,hero.y+hero.my)==='/') ? 240 : 170;
    hero.prog+=dt/speed;
    if(hero.prog>=1){
      hero.x+=hero.mx; hero.y+=hero.my;
      hero.moving=false; hero.prog=0;
      if(curMap==='worm'&&tileAt(hero.x,hero.y)==='x'){ exitHouse(); }
      else if(curMap==='shopint'&&tileAt(hero.x,hero.y)==='x'){ exitShop(); }
      else if(curMap==='ledger'&&tileAt(hero.x,hero.y)==='x'){ exitLedger(); }
      else if(curMap==='hall'&&tileAt(hero.x,hero.y)==='x'){ exitHall(); }
      if(curMap==='temple'&&hero.x===3&&hero.y===2&&!entityFired){ entityFired=true; startEntity(); }
    }
  }
  if(!hero.moving && tstate==='walk'){
    if(held.up) tryMove('up');
    else if(held.down) tryMove('down');
    else if(held.left) tryMove('left');
    else if(held.right) tryMove('right');
  }
  hero.px=(hero.x+(hero.moving?hero.mx*hero.prog:0))*TS;
  hero.py=(hero.y+(hero.moving?hero.my*hero.prog:0))*TS;
}
let npcTimer=0;
function updateNPCs(dt){
  npcTimer-=dt;
  if(npcTimer<=0){
    npcTimer=900+Math.random()*900;
    if(tstate!=='walk') return;
    for(const n2 of npcs){
      if(n2.map!==curMap||!n2.wander||Math.random()<.5) continue;
      const dirs=['up','down','left','right'];
      const d=dirs[(Math.random()*4)|0];
      const [dx,dy]=DIRV[d];
      const nx=n2.x+dx, ny=n2.y+dy;
      if(Math.abs(nx-n2.home[0])>2||Math.abs(ny-n2.home[1])>2) continue;
      const ch=tileAt(nx,ny);
      if(!WALK.has(ch)||ch==='/') continue;
      if(nx===hero.x&&ny===hero.y) continue;
      if(npcs.some(o=>o!==n2&&o.map===curMap&&(!o.when||o.when())&&o.x===nx&&o.y===ny)) continue;
      n2.x=nx; n2.y=ny; n2.dir=d;
    }
  }
}
/* town render — 10×8 tile window on the shared canvas */
const VW=10, VH=8;
let tCamX=0, tCamY=0, tCamInit=false;
function heroSprite(){
  if(hero.dir==='up') return ['dax_up',false];
  if(hero.dir==='down') return ['dax_down',false];
  return ['dax_side', hero.dir==='left'];
}
function windowMode(x,y){ return (x*31+y*17)%3; }
function drawTown(now,dt){
  if(tstate!=='cutscene'){ updateHero(dt); updateNPCs(dt); }
  else { updateHero(dt); updateLaunch(dt); }
  const M=MAPS[curMap];
  let fx2=hero.px+TS/2, fy2=hero.py+TS/2;
  if(tstate==='cutscene'&&cut&&cut.kind!=='arrive'){
    fx2=PAD_CENTER.x*TS+TS/2+60; fy2=PAD_CENTER.y*TS+TS/2-40;
  }
  let tx2=Math.max(0,Math.min(Math.max(0,M.w*TS-VW*TS), fx2-VW*TS/2));
  let ty2=Math.max(0,Math.min(Math.max(0,M.h*TS-VH*TS), fy2-VH*TS/2));
  if(!tCamInit){ tCamX=tx2; tCamY=ty2; tCamInit=true; }
  tCamX+=(tx2-tCamX)*.12; tCamY+=(ty2-tCamY)*.12;
  const x0=Math.floor(tCamX/TS), y0=Math.floor(tCamY/TS);
  for(let y=y0;y<=y0+VH;y++){
    for(let x=x0;x<=x0+VW;x++){
      if(x<0||y<0||x>=M.w||y>=M.h) continue;
      let ch=M.grid[y][x];
      /* the market healing: shuttered stalls open when the tithe breaks */
      if(ch==='a'&&curMap==='vantorr'&&storyStage>=3) ch='r';
      const cache=townTiles[ch]||townTiles[curMap==='town'?',':'.'];
      const dx=x*TS-tCamX, dy=y*TS-tCamY;
      cx.drawImage(cache[(x+y)%2], dx, dy);
      if(curMap==='town'&&!'K/|'.includes(ch)){
        const lv=levelOf(y);
        if(lv===0){ cx.fillStyle='rgba(4,6,20,.22)'; cx.fillRect(dx,dy,TS,TS); }
        else if(lv===2){ cx.fillStyle='rgba(255,214,140,.05)'; cx.fillRect(dx,dy,TS,TS); }
      }
      if(ch==='W'){
        const md=windowMode(x,y);
        if(md===0){
          cx.fillStyle='#1e6a5a';
          cx.fillRect(dx+4*PXS, dy+5*PXS, 3*PXS, 6*PXS);
        } else if(md===1){
          const a=.45+.35*Math.sin(now/700 + x*2.3 + y*1.7);
          cx.fillStyle=`rgba(72,180,200,${a})`;
          cx.fillRect(dx+4*PXS, dy+5*PXS, 8*PXS, 6*PXS);
        } else {
          const flick=(Math.sin(now/97+x*7)+Math.sin(now/233+y*13))>1.55;
          cx.fillStyle=flick?'#3ab0c8':'#0e3038';
          cx.fillRect(dx+8*PXS, dy+5*PXS, 4*PXS, 6*PXS);
          cx.fillStyle='#0e3038';
          cx.fillRect(dx+4*PXS, dy+5*PXS, 3*PXS, 6*PXS);
        }
      }
      if(ch==='~'){
        const ph=Math.sin(now/400+x+y);
        cx.fillStyle=`rgba(72,224,208,${.12+.08*ph})`;
        cx.fillRect(dx,dy,TS,TS);
        cx.fillStyle='#48e0d0';
        cx.fillRect(dx+((3+(animPhase?4:0))*PXS), dy+(5*PXS), 2*PXS, PXS);
        cx.fillRect(dx+(9*PXS), dy+((10+(animPhase?1:0))*PXS), 2*PXS, PXS);
      }
      if(ch==='|'){
        if(tileAt(x,y+1)!=='|'){ /* base of the chute: splash & mist */
          for(let i=0;i<3;i++){
            const sx3=(2+((now/70+i*37+x*11)|0)%12)*PXS;
            cx.fillStyle='rgba(230,255,252,.8)';
            cx.fillRect(dx+sx3, dy+(13+((now/110+i)|0)%3)*PXS, PXS, PXS);
          }
          cx.fillStyle=`rgba(200,245,240,${.10+.06*Math.sin(now/300+x)})`;
          cx.beginPath(); cx.arc(dx+TS/2, dy+TS-4, 14+3*Math.sin(now/400), 0, 7); cx.fill();
        }
        const off=((now/90)|0)%8;
        cx.fillStyle='rgba(72,224,208,.55)';
        for(let s2=0;s2<3;s2++){
          const sx2=(3+s2*4)*PXS;
          const sy2=(((off+s2*3)%8)*2)*PXS;
          cx.fillRect(dx+sx2, dy+sy2, PXS, 4*PXS);
        }
        cx.fillStyle='rgba(200,255,250,.35)';
        cx.fillRect(dx+7*PXS, dy+(((off+5)%8)*2)*PXS, PXS, 3*PXS);
      }
      if(ch==='!'){
        /* the pit HEAVES — one slow spatial pulse, faster if the spore is near */
        const sporeNear=inventory.includes('Dormant Spore');
        const rate=sporeNear?750:1400;
        const heave=Math.sin(now/rate + x*0.9 + y*0.7);
        cx.fillStyle=`rgba(140,255,120,${.07+.09*Math.max(0,heave)})`;
        cx.fillRect(dx,dy,TS,TS);
        cx.fillStyle=`rgba(10,26,8,${.10+.08*Math.max(0,-heave)})`;
        cx.fillRect(dx,dy,TS,TS);
        /* a bubble rises, HESITATES, then pops */
        const cyc=((now/2400)+((x*13+y*7)%8)/8)%1;
        const bx=((x*13+y*7)%12)+2;
        let bY;
        if(cyc<.45) bY=15-cyc/.45*8;          /* rise */
        else if(cyc<.7) bY=7+Math.sin(now/90)*.4; /* hesitate */
        else if(cyc<.8) bY=7-(cyc-.7)/.1*3;   /* pop upward */
        else bY=null;
        if(bY!==null){
          cx.fillStyle= cyc<.7 ? 'rgba(140,255,140,.75)' : 'rgba(220,255,200,.9)';
          cx.fillRect(dx+bx*PXS, dy+bY*PXS, PXS, PXS);
          if(cyc>=.7) cx.fillRect(dx+(bx-1)*PXS, dy+(bY-1)*PXS, 3*PXS, PXS);
        }
        if(sporeNear && ((now/900)|0)%5===((x+y)%5)){
          cx.fillStyle='rgba(180,255,150,.18)';
          cx.fillRect(dx,dy,TS,TS);
        }
      }
      if(ch==='A'){
        const g=.3+.2*Math.sin(now/350);
        cx.fillStyle=`rgba(72,224,208,${g})`;
        cx.fillRect(dx+7*PXS, dy+2*PXS, 2*PXS, 3*PXS);
        for(let i=0;i<3;i++){
          const a2=now/1400+i*2.1;
          cx.fillStyle=`rgba(168,248,236,${.5+.3*Math.sin(now/300+i)})`;
          cx.fillRect(dx+TS/2+Math.cos(a2)*12-1, dy+3*PXS+Math.sin(a2)*7-1, 2, 2);
        }
      }
      if(ch==='S'){ /* the ring-shard cycles through halo colors */
        const cols=['#48e0d0','#ff5ad2','#b8ff4a'];
        const ph2=(now/1100)%3;
        const c1=cols[ph2|0], mix=ph2%1;
        cx.globalAlpha=.28+.14*Math.sin(now/220);
        cx.fillStyle=c1;
        cx.beginPath(); cx.arc(dx+TS/2, dy+TS*.35, TS*(.8+.15*mix), 0, 7); cx.fill();
        cx.globalAlpha=1;
        cx.fillStyle=cols[((ph2|0)+1)%3];
        cx.fillRect(dx+7*PXS, dy+(1+((now/160)|0)%5)*PXS, PXS, PXS);
      }
      if(ch==='M'&&animPhase){
        cx.fillStyle='rgba(139,224,78,.5)';
        cx.fillRect(dx+((x*7)%12+2)*PXS, dy+4*PXS, PXS, PXS);
      }
      if(ch==='l'&&animPhase){
        cx.fillStyle='rgba(216,220,232,.55)';
        cx.fillRect(dx+11*PXS, dy+6*PXS, PXS, 3*PXS);
        cx.fillStyle='rgba(58,104,200,.55)';
        cx.fillRect(dx+6*PXS, dy+6*PXS, PXS, 3*PXS);
      }
      if(ch==='^'&&(x*7+y)%3===0&&animPhase){
        cx.fillStyle='#ff6070';
        cx.fillRect(dx+11*PXS, dy, PXS, PXS);
      }
      if(ch==='u'){
        const bt=((now/120)|0)%6;
        cx.fillStyle='#48e060';
        cx.fillRect(dx+(5+((now/200|0)%4))*PXS, dy+2*PXS, PXS, PXS);
        cx.fillStyle=`rgba(232,236,255,${.25-.03*bt})`;
        cx.fillRect(dx+(6+(animPhase?1:0))*PXS, dy-(bt)*PXS, 2*PXS, 2*PXS);
        const g=.15+.08*Math.sin(now/260);
        cx.fillStyle=`rgba(255,150,60,${g})`;
        cx.fillRect(dx+3*PXS, dy+9*PXS, 4*PXS, 3*PXS);
      }
      if(ch==='L'){
        const g=.10+.05*Math.sin(now/300);
        cx.fillStyle=`rgba(255,210,58,${g})`;
        cx.beginPath(); cx.arc(dx+TS/2, dy+TS/2, TS*.9, 0, 7); cx.fill();
        cx.fillStyle=animPhase?'#ffd23a':'#ffb347';
        cx.fillRect(dx+6*PXS, dy+2*PXS, 4*PXS, PXS);
      }
      if(ch==='P'&&animPhase){
        cx.fillStyle='#ffd23a';
        cx.fillRect(dx+7*PXS, dy+7*PXS, 2*PXS, 2*PXS);
      }
      if(ch==='d'){
        const g=.15+.10*Math.sin(now/420);
        cx.fillStyle=`rgba(255,179,71,${g})`;
        cx.fillRect(dx+3*PXS, dy+12*PXS, 10*PXS, 4*PXS);
      }
      if(ch==='c'){
        const g=.18+.14*Math.sin(now/430+x*2+y);
        cx.fillStyle=`rgba(72,224,208,${g})`;
        cx.beginPath(); cx.arc(dx+TS/2, dy+TS/2, TS*.7, 0, 7); cx.fill();
      }
      if(ch==='O'){
        const g=.22+.16*Math.sin(now/360);
        cx.fillStyle=`rgba(72,224,208,${g})`;
        cx.beginPath(); cx.arc(dx+TS/2, dy+TS*.3, TS*.9, 0, 7); cx.fill();
      }
      /* ═══ Act 2: Ceril's Crossing living tiles ═══ */
      if(ch==='w'&&!(curMap==='vantorr'&&fenLost&&x===3&&y===1)){ /* ring-glass windows flicker — except the one that went dark */
        const cols=['72,224,208','255,90,210','184,255,74'];
        const pick=cols[(x*3+y+((now/1600)|0))%3];
        const a=.16+.14*Math.sin(now/620+x*2.1+y*1.3);
        cx.fillStyle=`rgba(${pick},${a})`;
        cx.fillRect(dx+3*PXS, dy+3*PXS, 10*PXS, 11*PXS);
      }
      if(ch==='G'&&curMap==='vantorr'){ /* a note travels the hall slab every ~20s */
        const ph=((now/50)%400)-x*8;
        if(ph>0&&ph<16){
          cx.fillStyle=`rgba(180,240,255,${.14*(1-Math.abs(ph-8)/8)})`;
          cx.fillRect(dx,dy,TS,TS);
        }
      }
      if(ch==='o'){ /* the seam-oven breathes at the hymn's tempo */
        const g=.25+.22*Math.max(0,Math.sin(now/430));
        cx.fillStyle=`rgba(255,120,40,${g})`;
        cx.fillRect(dx+4*PXS, dy+7*PXS, 8*PXS, 8*PXS);
        if(((now/700)|0)%4===0){
          cx.fillStyle='rgba(255,210,120,.8)';
          cx.fillRect(dx+(6+((now/90)|0)%4)*PXS, dy+(10-((now/130)|0)%4)*PXS, PXS, PXS);
        }
      }
      if(ch==='n'&&tileAt(x-1,y)!=='n'){ /* the crane hook, slow-swinging */
        const sw=Math.sin(now/1100)*9;
        const hx=dx+TS+sw, hy=dy-8;
        cx.strokeStyle='#8a94ac'; cx.lineWidth=2;
        cx.beginPath(); cx.moveTo(dx+TS,dy-26); cx.lineTo(hx,hy); cx.stroke();
        cx.lineWidth=1;
        cx.fillStyle='#5a6278'; cx.fillRect(hx-3,hy,6,7);
        cx.fillStyle='#ffd23a'; cx.fillRect(hx-1,hy+7,2,3);
      }
      if(ch==='i'){ /* GUNNAR-7, impounded. The cage is fine. His dignity is not. */
        if(storyStage<3){
          drawSprite(cx,'gunnar', dx+TS/2, dy+TS-6, 2, ((now/2600)|0)%2===0, 0, .95);
          cx.fillStyle='#98a0b4';
          for(let xx=2;xx<15;xx+=3) cx.fillRect(dx+xx*PXS, dy+PXS, PXS-1, 14*PXS);
          if(((now/1500)|0)%3===0){
            cx.fillStyle='rgba(232,48,72,.9)';
            cx.fillRect(dx+13*PXS, dy+7*PXS, PXS, PXS);
          }
        }
      }
      if(ch==='e'){ /* the sealed crack hums, faintly, patiently */
        const g=.10+.10*Math.sin(now/900);
        cx.fillStyle=`rgba(72,224,208,${g})`;
        cx.fillRect(dx+6*PXS, dy+3*PXS, 3*PXS, 13*PXS);
      }
      if(ch==='m'){ /* vapor-well mist */
        for(let i=0;i<3;i++){
          const p=((now/1900)+i*0.33)%1;
          cx.fillStyle=`rgba(220,240,244,${.30*(1-p)})`;
          cx.fillRect(dx+(6+Math.sin(p*7+i*2)*2.5)*PXS, dy+(7-p*9)*PXS, 2*PXS, 2*PXS);
        }
      }
      if(ch==='v'&&((now/1100+x*3)|0)%5===0){ /* a bell catches the ring-light */
        cx.fillStyle='rgba(168,248,236,.8)';
        cx.fillRect(dx+((x%2)?4:10)*PXS, dy+((y%2)?6:12)*PXS, PXS, PXS);
      }
    }
  }
  /* ═══ worldsmith ambient pass: living edges, ripples, the shape in the goo ═══ */
  if(curMap==='town'){
    for(let y=y0;y<=y0+VH;y++)for(let x=x0;x<=x0+VW;x++){
      if(x<0||y<0||x>=MAPS.town.w||y>=MAPS.town.h) continue;
      const ch=MAPS.town.grid[y][x];
      const dx=x*TS-tCamX, dy=y*TS-tCamY;
      if(ch==='~'){
        /* irregular shoreline: foam scallops + wet rock where water meets land */
        const rnd=mulberry(x*911+y*577);
        for(const [nx2,ny2,side] of [[x-1,y,0],[x+1,y,1],[x,y-1,2],[x,y+1,3]]){
          const nch=tileAt(nx2,ny2);
          if(nch==='~'||nch==='|') continue;
          const foam=`rgba(200,245,240,${.35+.2*Math.sin(now/500+x+y)})`;
          for(let i2=0;i2<3;i2++){
            const off=(rnd()*12+2)|0;
            cx.fillStyle=foam;
            if(side===0) cx.fillRect(dx, dy+off*PXS, PXS, 2*PXS);
            if(side===1) cx.fillRect(dx+15*PXS, dy+off*PXS, PXS, 2*PXS);
            if(side===2) cx.fillRect(dx+off*PXS, dy, 2*PXS, PXS);
            if(side===3) cx.fillRect(dx+off*PXS, dy+15*PXS, 2*PXS, PXS);
          }
        }
        /* depth: darker heart, luminous rim */
        cx.fillStyle='rgba(6,30,38,.28)';
        cx.fillRect(dx+4*PXS, dy+4*PXS, 8*PXS, 8*PXS);
      }
      if(ch==='!'){
        /* dark dithered crust lip creeping over the ground */
        const rnd=mulberry(x*457+y*811);
        for(const [nx2,ny2,side] of [[x-1,y,0],[x+1,y,1],[x,y-1,2],[x,y+1,3]]){
          if(tileAt(nx2,ny2)==='!') continue;
          cx.fillStyle='rgba(10,26,8,.85)';
          for(let i2=0;i2<4;i2++){
            const off=(rnd()*13+1)|0;
            if(side===0) cx.fillRect(dx-((rnd()*2)|0)*PXS, dy+off*PXS, 2*PXS, PXS);
            if(side===1) cx.fillRect(dx+(14+((rnd()*2)|0))*PXS, dy+off*PXS, 2*PXS, PXS);
            if(side===2) cx.fillRect(dx+off*PXS, dy-((rnd()*2)|0)*PXS, PXS, 2*PXS);
            if(side===3) cx.fillRect(dx+off*PXS, dy+(14+((rnd()*2)|0))*PXS, PXS, 2*PXS);
          }
        }
        /* bright sickly heart under the crust */
        const R2=findGooRect();
        const cxp=((R2.x0+R2.x1)/2+.5)*TS-tCamX, cyp=((R2.y0+R2.y1)/2+.5)*TS-tCamY;
        const d2=Math.hypot(dx+TS/2-cxp, dy+TS/2-cyp);
        if(d2<TS*1.6){
          cx.fillStyle=`rgba(190,255,140,${(.14+.08*Math.sin(now/700))*(1-d2/(TS*1.6))})`;
          cx.fillRect(dx,dy,TS,TS);
        }
      }
    }
    /* ripple rings on open water */
    rippleT-=dt;
    if(rippleT<=0){
      rippleT=650+Math.random()*700;
      const spots=[];
      for(let y=y0;y<=y0+VH;y++)for(let x=x0;x<=x0+VW;x++)
        if(x>=0&&y>=0&&x<MAPS.town.w&&y<MAPS.town.h&&MAPS.town.grid[y][x]==='~') spots.push([x,y]);
      if(spots.length){
        const [rx2,ry2]=spots[(Math.random()*spots.length)|0];
        ripples.push({x:rx2*TS+TS/2, y:ry2*TS+TS/2, t:0});
      }
    }
    for(const r2 of ripples){
      r2.t+=dt;
      const p=r2.t/1300;
      if(p<1){
        cx.strokeStyle=`rgba(160,240,232,${.45*(1-p)})`;
        cx.lineWidth=1.5;
        cx.beginPath(); cx.arc(r2.x-tCamX, r2.y-tCamY, 3+p*16, 0, 7); cx.stroke();
      }
    }
    ripples=ripples.filter(r2=>r2.t<1300);
    cx.lineWidth=1;
    /* the shape in the goo — a dark drift you almost saw */
    gooShapeT-=dt*(inventory.includes('Dormant Spore')?2.2:1);
    if(gooShapeT<=0){
      const R2=findGooRect();
      gooShape={t:0, y:(R2.y0+.5+Math.random()*(R2.y1-R2.y0))*TS, x0:R2.x0*TS, x1:(R2.x1+1)*TS, dir:Math.random()<.5?1:-1};
      gooShapeT=20000+Math.random()*20000;
    }
    if(gooShape){
      gooShape.t+=dt;
      const p=gooShape.t/3200;
      if(p>=1) gooShape=null;
      else{
        const sx=gooShape.dir>0? gooShape.x0+(gooShape.x1-gooShape.x0)*p : gooShape.x1-(gooShape.x1-gooShape.x0)*p;
        const a=Math.sin(p*Math.PI)*.4;
        cx.fillStyle=`rgba(6,18,6,${a})`;
        cx.beginPath(); cx.ellipse(sx-tCamX, gooShape.y-tCamY+Math.sin(p*9)*3, 20, 7, 0, 0, 7); cx.fill();
      }
    }
    /* chalk hopscotch, drawn where its examine lives */
    {
      const hx=17*TS-tCamX, hy=14*TS-tCamY;
      if(hx>-TS&&hx<cv.width&&hy>-TS&&hy<cv.height){
        cx.strokeStyle='rgba(240,240,244,.35)';
        for(let i2=0;i2<3;i2++) cx.strokeRect(hx+14, hy+8+i2*11, 13, 10);
        cx.strokeRect(hx+29, hy+19, 13, 10);
      }
    }
  }
  if(curMap==='vantorr'){
    /* the broken halo across the sky, glowing over the canyon rim */
    const ringCols=['#48e0d0','#ff5ad2','#b8ff4a'];
    for(let i=0;i<3;i++){
      cx.strokeStyle=ringCols[i];
      cx.globalAlpha=.20+.08*Math.sin(now/900+i*2);
      cx.lineWidth=5-i;
      cx.beginPath();
      cx.arc(cv.width*.5, cv.height*1.9+i*30, cv.height*1.86, Math.PI*1.28, Math.PI*1.72);
      cx.stroke();
    }
    cx.globalAlpha=1; cx.lineWidth=1;
    cx.fillStyle='rgba(255,150,60,.05)';
    cx.fillRect(0,0,cv.width,cv.height);
    /* the shuttle, parked and cooling */
    drawSprite(cx,'ship', 3.5*TS-tCamX, 13.3*TS-tCamY, 2.4, false, 0);
    if(((now/500)|0)%3===0){
      cx.fillStyle='rgba(180,180,200,.25)';
      cx.beginPath(); cx.arc(3.9*TS-tCamX, 12.3*TS-tCamY, 3+((now/120)%6), 0, 7); cx.fill();
    }
    /* the shard syncs with the pack — stand close long enough and it answers.
       never explained. */
    if(tstate==='walk'&&Math.abs(hero.x-15)+Math.abs(hero.y-5)<=1) shardSyncT+=dt; else shardSyncT=0;
    if(shardSyncT>10000){
      const sx=15*TS+TS/2-tCamX, sy=5*TS+TS*.3-tCamY;
      const p=((shardSyncT-10000)%2400)/2400;
      if(p<.5){
        cx.strokeStyle=`rgba(255,255,255,${.7*(1-p*2)})`;
        cx.lineWidth=2;
        cx.beginPath(); cx.arc(sx,sy, 6+p*90, 0, 7); cx.stroke();
        cx.lineWidth=1;
      }
    }
  }
  if(curMap==='temple'){
    const vg=cx.createRadialGradient(cv.width/2,cv.height/2,80,cv.width/2,cv.height/2,300);
    vg.addColorStop(0,'rgba(0,0,0,0)');
    vg.addColorStop(1,'rgba(2,4,12,.65)');
    cx.fillStyle=vg; cx.fillRect(0,0,cv.width,cv.height);
    for(let i=0;i<10;i++){
      const mx=(i*97+((now/40)|0)*(1+i%3))%cv.width;
      const my=(i*173+Math.sin(now/900+i)*40+cv.height)%cv.height;
      cx.fillStyle=`rgba(120,220,230,${.12+.08*Math.sin(now/500+i)})`;
      cx.fillRect(mx,my,2,2);
    }
  }
  updateCritters(dt);
  checkTrailExits();
  for(const c of critters){
    if(c.map!==curMap) continue;
    const fx=c.x*TS+TS/2-tCamX, fy=c.y*TS+TS/2-tCamY;
    if(fx<-TS||fx>cv.width+TS||fy<-TS||fy>cv.height+TS) continue;
    const scuttle=c.pause>0?0:((now/90)|0)%2;
    drawSprite(cx,c.spr||'critter',fx,fy,2,c.tx<c.x,scuttle?-1:0);
  }
  const ents=[...npcs.filter(n2=>n2.map===curMap&&(!n2.when||n2.when())).map(n2=>({t:'npc',n:n2, fy:n2.y*TS+TS-2}))];
  if(!hero.hidden) ents.push({t:'hero', fy:hero.py+TS-2});
  ents.sort((a,b)=>a.fy-b.fy);
  for(const e of ents){
    if(e.t==='npc'){
      const n2=e.n;
      const fx=n2.x*TS+TS/2-tCamX, fy=n2.y*TS+TS-2-tCamY;
      cx.fillStyle='rgba(0,0,0,.35)';
      cx.beginPath(); cx.ellipse(fx,fy-2,13,4,0,0,7); cx.fill();
      const hop=((now/420+n2.x)|0)%2?0:-1;
      if(n2.glow){
        const a=.16+.10*Math.sin(now/480);
        drawGlowOutline(cx,n2.spr,fx,fy,PXS,n2.dir==='left',hop,'#48e0d0',a);
      }
      drawSprite(cx,n2.spr,fx,fy,PXS,n2.dir==='left',hop);
    } else {
      const fx=hero.px+TS/2-tCamX, fy=hero.py+TS-2-tCamY;
      cx.fillStyle='rgba(0,0,0,.4)';
      cx.beginPath(); cx.ellipse(fx,fy-2,13,4,0,0,7); cx.fill();
      const [spr,flip]=heroSprite();
      const step=hero.moving ? (((hero.prog*2)|0)%2?-2:0) : (((now/420)|0)%2?0:-1);
      const walkFlip=(spr!=='dax_side') && hero.moving && ((hero.prog*2)|0)%2===1;
      const useFlip = spr==='dax_side' ? flip : walkFlip;
      let alpha;
      if(tstate==='cutscene'&&cut&&cut.phase==='board') alpha=Math.max(0,1-cut.t/700);
      drawSprite(cx,spr,fx,fy,PXS,useFlip,step,alpha);
    }
  }
  /* launch ship */
  if(tstate==='cutscene'&&cut&&cut.phase!=='done'){
    const sx=cut.ship.x-tCamX, sy=cut.ship.y-tCamY;
    const padPy2=PAD_CENTER.y*TS+TS/2-tCamY;
    const height=Math.max(0,(padPy2+16)-(sy+21));
    const sh=Math.max(.15,1-height/420);
    cx.fillStyle=`rgba(0,0,0,${.45*sh})`;
    cx.beginPath();
    cx.ellipse(PAD_CENTER.x*TS+TS/2-tCamX, padPy2+16, 40*sh, 9*sh, 0, 0, 7);
    cx.fill();
    if(cut.phase==='fly-in'||cut.phase==='lift'){
      const fl=6+Math.sin(now/50)*3;
      cx.fillStyle=animPhase?'#ffd23a':'#ff9a2a';
      cx.fillRect(sx-4, sy+18, 8, fl);
      cx.fillStyle='rgba(255,154,42,.4)';
      cx.fillRect(sx-7, sy+18, 14, fl+5);
    }
    drawSprite(cx,'ship',sx,sy+21,PXS,false,0);
    if(cut.dust.length){
      for(const d of cut.dust){
        d.life+=dt; d.r+=d.sp*dt;
        const a=Math.max(0,.5-d.life/900);
        if(a<=0) continue;
        cx.fillStyle=`rgba(120,100,140,${a})`;
        const px2=PAD_CENTER.x*TS+TS/2-tCamX+Math.cos(d.a)*d.r;
        const py2=PAD_CENTER.y*TS+TS+8-tCamY+Math.sin(d.a)*d.r*.35;
        cx.fillRect(px2,py2,5,3);
      }
      cut.dust=cut.dust.filter(d=>d.life<900);
    }
    if(cut.phase==='fadeout'){
      cx.fillStyle=`rgba(3,4,10,${Math.min(1,cut.t/700)})`;
      cx.fillRect(0,0,cv.width,cv.height);
    }
  }
  if(tfadeDir!==0){
    tfade+=tfadeDir*dt/220;
    if(tfade>=1){ tfade=1; tfadeDir=-1; afterFade&&afterFade(); afterFade=null; tCamInit=false; }
    if(tfade<=0){ tfade=0; tfadeDir=0; }
  }
  if(tfade>0){
    cx.fillStyle=`rgba(3,4,10,${tfade})`;
    cx.fillRect(0,0,cv.width,cv.height);
  }
}
