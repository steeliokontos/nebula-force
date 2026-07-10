/* ═══ NEBULA FORCE — missions/sump.js: BATTLE ONE — the Eastern Sump.
   Party of three (Dax, Sister Hale, Gunnar-7) vs the things the quakes woke.
   Victory recovers JET, downed courier. No storm here — the terrain IS the
   event: lime sump stings (2 dmg end of turn), black goo is impassable,
   spore thickets are heavy cover.
   Legend: 0 crater ground · 1 crater rim · 8 spore thicket
   6 lime sump (cost 2, stings) · 7 black goo (impassable) ═══ */
SPRITES.crawler=SPRITES.gloop.map(r=>r.replace(/e/g,'e').replace(/E/g,'D'));
SPRITES.spitter=SPRITES.drone.map(r=>r.replace(/g/g,'E').replace(/G/g,'D').replace(/r/g,'e'));
SPRITES.maw=SPRITES.rig.map(r=>r.replace(/g/g,'D').replace(/G/g,'E').replace(/o/g,'e').replace(/O/g,'E'));

const MISSION_SUMP={
  id:'sump',
  name:'The Eastern Sump',
  lvl:1, /* XP decay yardstick — see kr7.js */
  crashProp:false,
  map:[
    "000018000660000110",
    "000110086667700010",
    "000100066677700000",
    "000006667777660800",
    "080006677777666000",
    "000066777777766600",
    "000006677777660000",
    "100000667776600081",
    "100800066666000011",
    "000000806600000000",
    "001100000000801100",
    "000110080000011000",
    "000000000000000000",
  ],
  deploy:{ dax:[1,6], hale:[1,8], gunnar:[2,7] },
  enemies:[
    {id:'c1', name:'SUMP CRAWLER', spr:'crawler', cls:'Fauna', x:7,y:2,  maxhp:14, atk:9, def:2, agi:6, mov:4},
    {id:'c2', name:'SUMP CRAWLER', spr:'crawler', cls:'Fauna', x:8,y:9,  maxhp:14, atk:9, def:2, agi:6, mov:4},
    {id:'c3', name:'SUMP CRAWLER', spr:'crawler', cls:'Fauna', x:11,y:4, maxhp:14, atk:9, def:2, agi:6, mov:4},
    {id:'c4', name:'SUMP CRAWLER', spr:'crawler', cls:'Fauna', x:12,y:10,maxhp:14, atk:9, def:2, agi:6, mov:4},
    {id:'c5', name:'SUMP CRAWLER', spr:'crawler', cls:'Fauna', x:6,y:11, maxhp:14, atk:9, def:2, agi:6, mov:4},
    {id:'c6', name:'SUMP CRAWLER', spr:'crawler', cls:'Fauna', x:10,y:11,maxhp:14, atk:9, def:2, agi:6, mov:4},
    {id:'t1', name:'SPORE SPITTER', spr:'spitter', cls:'Flora · ARTY', x:10,y:1, maxhp:10, atk:8, def:1, agi:5, mov:3, rng:[2,3]},
    {id:'t2', name:'SPORE SPITTER', spr:'spitter', cls:'Flora · ARTY', x:13,y:8, maxhp:10, atk:8, def:1, agi:5, mov:3, rng:[2,3]},
    {id:'mw', name:'THE SUMP MAW', spr:'maw', cls:'Apex · BOSS', x:15,y:5, maxhp:36, atk:11, def:4, agi:4, mov:3, rng:[1,1], boss:true},
  ],
  config:{ storm:false, reinforcements:false, bossPhase:false, explore:true },
  pois:[
    {id:'stump', x:7, y:0, done:false,
     drawPoi:(g,p,now)=>{
       const dx=p.x*48, dy=p.y*48;
       g.fillStyle='#3a2c1a'; g.fillRect(dx+12,dy+16,24,22);
       g.fillStyle='#5a4426'; g.fillRect(dx+10,dy+12,28,8);
       g.fillStyle='#2a1f10';
       g.beginPath(); g.arc(dx+24,dy+16,9,0,7); g.stroke();
       g.strokeStyle='#7a5c34'; g.beginPath(); g.arc(dx+24,dy+16,5,0,7); g.stroke();
       if(!p.done){
         g.fillStyle=`rgba(255,210,58,${.5+.4*Math.sin(now/260)})`;
         g.fillRect(dx+22,dy+14,4,4);
       }
     },
     onUse:(cb)=>{
       equippedWeapons.dax={name:'SUMP-CURED MACHETE', atk:2, strongVs:'Fauna'};
       const dax=units.find(u=>u.id==='dax');
       if(dax){ dax.atk+=2; dax.weapon=equippedWeapons.dax; renderCard(dax); }
       openDialog('—',[
         "The stump is hollow — and something glints in the rot. A machete, blade cured black by years in the lime. Whoever hid it here isn't coming back for it.",
         "✦ Obtained SUMP-CURED MACHETE! (Dax: ATK +2, keen against Fauna.) Weapons matter now: the right blade against the right enemy is worth an extra bite.",
       ], cb);
     }},
    {id:'legs', x:16, y:11, done:false,
     drawPoi:(g,p,now)=>{
       const dx=p.x*48, dy=p.y*48;
       const wig=Math.sin(now/170)>0.6?1.5:0;
       g.fillStyle='#1a2810'; g.beginPath(); g.ellipse(dx+24,dy+34,17,8,0,0,7); g.fill();
       g.save(); g.translate(dx+18,dy+28); g.rotate(-.45+wig*.05);
       g.fillStyle='#22408a'; g.fillRect(-3,-16,6,17);
       g.fillStyle='#0c0c16'; g.fillRect(-4,-21,8,6);
       g.restore();
       g.save(); g.translate(dx+30,dy+29); g.rotate(.5-wig*.04);
       g.fillStyle='#22408a'; g.fillRect(-3,-14,6,15);
       g.fillStyle='#0c0c16'; g.fillRect(-4,-19,8,6);
       g.restore();
     },
     onUse:(cb)=>{
       sumpJetFound=true;
       openDialog('—',[
         "The legs KICK. Muffled, furious swearing rises out of the mud in at least three languages.",
         "It takes Dax, both hands, and one deeply undignified sound to pull the courier free of the sump's grip.",
       ], ()=>{
         openDialog('JET',[
           "—and THAT'S why you never trust a downdraft over a bog. Took a delivery run, took a bath, took a HEADFIRST NAP IN THE MUD apparently.",
           "Every nav-sensor for ten klicks went insane the same night Okari's line died — mine mid-flight. Something under this colony is BROADCASTING, and I want a word with it.",
           "You dug me out of a monster's pantry with your bare hands. Wherever you're going, I'm flying there. ✦ JET joins the force!",
         ], cb);
       });
     }},
  ],
  briefing:'The Eastern Sump — three of you, and the bog is not neutral. Lime pools STING (2 dmg at turn end). Black goo is bottomless. Thickets hide you (30% evade). Kill the Maw.',
  intro:{
    who:'GUNNAR-7',
    lines:[
      "Escort protocol active. Foreman Okari's exact words were: 'find whatever is eating my seismic sensors, and un-eat them.'",
      "SISTER HALE: Something's alive out there past the crawlers. A heartbeat. Small. Fast. ...Frightened.",
      "DAX: Then we cut through. Stay out of the lime, stay behind Gunnar, and if it has more teeth than legs — it's mine.",
    ],
  },
  loseText:'Dax has fallen in the Eastern Sump. The colony never learns what was waiting out there.',
  onWin:sumpVictory,
};

let sumpJetFound=false;
function sumpVictory(){
  if(sumpJetFound){
    openDialog('—',[
      "The Maw deflates into the black goo with a sound Rustharbor will be imitating at parties for years. Jet limps along behind, dripping, already talking about torque ratios.",
      "✦ Whatever is broadcasting, it's loudest to the WEST — under shaft nine. Okari wants it looked at, and the wolf on the ridge hasn't stopped staring at that adit all week.",
    ], ()=>{
      storyStage=1;
      openDialog('OKARI (comms)',["Sensors confirmed dead, Maw confirmed deader. Payment's logged. Get back here."], ()=>{
        setMode('town');
        curMap='town';
        tstate='walk';
        hero.x=31; hero.y=20; hero.dir='left';
        hero.hidden=false; hero.moving=false; hero.prog=0;
        tCamInit=false;
      });
    });
    return;
  }
  /* you left without looking hard enough */
  lostCrew.add('jet');
  openDialog('—',[
    "The Maw deflates into the black goo. The crew turns for home, and the sump closes up behind them like a held breath.",
    "In the far reeds — half-heard, then not heard at all — something that might have been a voice.",
  ], ()=>{
    storyStage=1;
    openDialog('—',["Days later, a notice goes up in the Rustharbor plaza: COURIER MISSING, LAST SEEN OVER THE EASTERN SUMP. REWARD. Nobody ever claims it."], ()=>{
      setMode('town');
      curMap='town';
      tstate='walk';
      hero.x=31; hero.y=20; hero.dir='left';
      hero.hidden=false; hero.moving=false; hero.prog=0;
      tCamInit=false;
    });
  });
}
