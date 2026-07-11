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
  a:'#5a8ae8', i:'#9a6234',
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
dax_down:["......kkkk......",".....kiihhk.....","....kihhhhhk....","....kssssssk....","....kskssksk....","....kssssssk....",".....ksssSk.....","......kssk......",".....kabbbk.....","....kabmmbBk....","...kbsabbBsbk...","...kbsbbbBsbk...","....kbbbbBbk....",".....kbBBbk.....",".....kbbbBk.....",".....kbkkbk.....",".....kBk.kBk....",".....kBk.kBk....",".....kBk.kBk....",".....kkk.kkk...."],
dax_up:["......kkkk......",".....kiihhk.....","....kiihhhhk....","....kihhhhhk....","....khhhhhhk....","....khhhhhhk....",".....khhhhk.....","......khhk......",".....kabbbk.....","....kabbbbBk....","...kbsbbbBsbk...","...kbsbbbBsbk...","....kbbbbBbk....",".....kbBBbk.....",".....kbbbBk.....",".....kbkkbk.....",".....kBk.kBk....",".....kBk.kBk....",".....kBk.kBk....",".....kkk.kkk...."],
dax_side:["......kkkk......",".....kiihhk.....",".....kihhhhk....",".....khsssk.....",".....khsksk.....",".....khsssk.....","......ksssk.....",".......ksk......",".....kabbbk.....",".....kambbk.....","....ksbbbBk.....","....ksbbbBk.....",".....kbbbBk.....",".....kbBbk......",".....kbbbk......",".....kbkbk......",".....kBkBk......",".....kBkBk......",".....kBkkBk.....",".....kkk.kk....."],
/* — battle crew — */
dax:["......kkkk......",".....kHhhhk.....",".....khhhhk.....",".....kssssk.....",".....ksksks.....",".....kssssk.....","......kssk......","..c..kbbbbk.....","..m.kbbbbbbk....","..mkbsbbbbsbv...",".kwk.kbbbbk.m...","..k..kbFFbk.....",".....kbkkbk.....",".....kBk.kBk....",".....kBk.kBk....",".....kkk.kkk...."],
kharn:["...kk......kk...","..kGGk....kGGk..","..kGGGk..kGGGk..","...kGGGkkGGGk...","...kgGGGGGGgk...","..kGGrrGGrrGGk..","..kGGrrGGrrGGk..","...kGGrRGGGGk...","...kGNNGGNNGk...","....kGGNNGGk....","..kgGGGGGGGGgk..",".kGGGkGccGkGGGk.","kGGGk.kccGk.GGGk","kGvGk.kGGk.kGvGk","kvwvk.kvvk.kvwvk",".kwk..kGGk..kwk.","......kGGk......",".....kGkkGk.....",".....kGk.kGk....",".....kkk.kkk...."],
gunnar:["....kkkkkkk.....","...kGGGgGGGk....","...kGcGGGcGk....","...kGGGGGGGk....","....kkkkkkk.....","..kkkoooookk....",".kFkoooooookGF..",".kGkoOooOookGk..",".kGkoooccookGk..",".kkkoooooookkk..","..k.kNoooNk.k...","....kkkkkkk.....","...kGGk.kGGk....","...kGGk.kGGk....","...kGGk.kGGk....","...kkkk.kkkk...."],
jet:["......kkkk......",".....kooook.....",".....kmccck.....",".....kssssk.....","......kssk......","..kk.kbbbbk.kk..",".krGkbbbbbbkGFk.",".kGGksbbbbskGGk.",".kkkk.kbbk.kkkk.","..rf...kbk..fF..","..Ff..kbBbk..Ff.","......kbfbk.....",".....kBk.kBk....",".....kBk.kBk....",".....kkk.kkk....","................"],
vesper:["................","................","......kkkk......",".....kXPXXk.....","....kXXXXXXk....","....kssssssk....","....kspsspsk....","....kssssssk....",".....kssssk.....","....kPpppPk.....","...kPpppppPk....","...csPppppsk....","....kPpFpPk.....","....kFpppFk.....",".....kk.kk......","................"],
hale_b:["......kkkk......",".....kwwwwk.....","....kwwwwwwk..c.","....kwkssskk.kyk","....kwksksk...y.","....kwkssskk..y.",".....kwwwk....y.","....kwwwwwk.kyk.","...kwcwwwcwk.y..","...kwwwwwwwk.y..","...kswwwwwsk.y..","....kwwwwwk..y..","....kwwwwwk.....","....kwwwwwk.....","...kwwwwwwwk....","...kkkkkkkkk...."],
/* — town npcs — */
elder:["......kkkk......",".....kwwHHk.....",".....kHHHHk.....",".....kssssk.....",".....ksksks.....",".....kssssk.....","...k..kssSk.....","..kyk.ktttk.....","..ky.ktttttTk...","..kykstttTtsk...","..ky..ktttTk....","..ky..ktTTtk....","..ky..kttTk.....","..ky..ktttTk....","..ky..ktttTk....","..ky..ktttTk....","......ktttTk....",".....ktttttTk...",".....ktttttTk...",".....kkkkkkkk..."],
keeper:["......kkkk......",".....kooOOk.....",".....kOOOOk.....",".....kssssk.....",".....ksksks.....",".....kssssk.....","......kssk......",".....kwwwvk.....","....kwwwwwvk....","...ksgwwwvgsk...","...ksgwwwvgsk...","....kwwwwwvk....",".....kwwwvk.....",".....kwwwvk.....",".....kwkkwk.....",".....kGk.kGk....",".....kGk.kGk....",".....kGk.kGk....",".....kGk.kGk....",".....kkk.kkk...."],
kid:["................","................","................","................","......kkkk......",".....kiihhk.....","....kihhhhhk....","....kssssssk....","....ksksskssk...","....kssssssk....",".....kssssk.....","....keeeeEk.....","...keeeeeeEk....","...kseeeeEsk....","....keeeeEk.....","....kEeeeEk.....","....keeeEEk.....",".....kk.kk......",".....kk.kk......",".....kk.kk......"],
mech:["......kkkk......",".....khhhhk.....",".....kcccck.....",".....kssssk.....","......kssk......",".....koooOk.....","....koooooOok...","...ksoooooOsk...","...ksoooooOsk...","....kooooooOk...",".....koOOok.....",".....koooOk.....",".....kokkok.....",".....kOk.kOk....",".....kOk.kOk....",".....kOk.kOk....",".....kOk.kOk....",".....kkk.kkk....","................","................"],
hale:["......kkkk......",".....kwwwwk.....","....kwwwwwvk..m.","....kwkssskk.kyk","....kwksksk...y.","....kwkssskk..y.",".....kwwwk....y.","....kywwwyk...y.","...kwcwwwcwk..y.","...kwwwwwwvk..y.","...kswwwwvsk..y.","....kwwywvk...y.","....kwwywvk...y.","....kwwwwvk...y.","....kwwwwvk.....","....kwwwwvk.....","....kwwwwvk.....","...kwwwwwwvk....","...kywwwwwyk....","...kkkkkkkkk...."],
chef:[".k..........k...",".ek.........ke..","..ek..kkkk..ke..","...kkeeeeeekk...","...keeeeeeeek...","..keekkeekkeek..","..keekkeekkeek..","...keeeeeeeek...","....keeEEeek....","..kekeeeeeekek..",".keekwwwwwwkeek.","keek.kwwwwk.keek","keek.kwwwwk.keek",".kk..kwwwwk..kk.","..kekwwwwwwkek..",".keek.kwwk.keek.",".kk...kEEk...kk.",".....kEk.kEk....",".....kEk.kEk....",".....kkk.kkk...."],
gloop:["................","................","................","................","................","......kkkk......","....kkeeeekk....","...keeeeeeeek...","..keekkeekkeek..","..keekkeekkeek..",".keeeeeeeeeeeek.",".keeeDeeeeDeeek.",".keeeeeeeeeeeek.","keeeeeDeeDeeeeek","keDeeeeeeeeeeDek","keeeeeeDeeeeeeek",".keeeeeeeeeeeek.","..keeeeeeeeeek..","...kkkkkkkkkk...","................"],
/* — enemies — */
drone:["................","....k.kkkk.k....","....kkvvvvkk....","......kkkk......",".....kGGGGk.....","....kGGGGGGk....","...kGGrrGGGk....","...kGGrrGGGk....","....kGGGGGGk....",".....kGGGGk.....","......kkkk......",".....k....k.....","....k......k....","................","................","................"],
rig:["..kkkkkkkkkk....",".kGGGGGGGGGGk...",".kGrrGGGGrrGk...",".kGGGGGGGGGGk...",".kkkkkkkkkkkk...",".koooooooook....","kGkoooooookGk...","kGkoOOooOOokGk..","kGkoooooookGk...","kkkoooooookkk...","..koooooook.....","..kkkkkkkkk.....",".kGGk...kGGk....",".kGGk...kGGk....","kvGGkv..kGGvk...",".kkkk...kkkk...."],
spiker:["................","......kppk......",".....kpPPpk.....",".....kpPPpk.....","......kppk......",".....kGGGGk.....","....kGGGGGGk....","...kGrGGGGrGk...","...kGGGGGGGGk...","....kGGGGGGk....",".....kGGGGk.....","....kGk..kGk....","...kGk....kGk...","..kGk......kGk..","................","................"],
overseer:["....kkkkkkk.....","...kxxxxxxxk....","..kxxxxxxxxxk...","..kxxpppppxxk...","..kxppPPPppxk...","..kxpPrrrPpxk...","..kxppPPPppxk...","..kxxpppppxxk...","..kxxxxxxxxxk...","..kxxxxxxxxxk...","..kxkxxxxxkxk...","..kx.kxxxk.xk...",".....kxxxk......",".....kxxxk......","....kxxxxxk.....","....kkkkkkk....."],
/* — Act 2: Ceril's Crossing cast (all-new — town-1 sprites are never reused) — */
hob:["......kkkk......",".....khkhkk.....","....khhhhhhk....","....kssssssk....","....kskssksk....","....kssssssk....",".....ksssSk.....","......kssk......",".....kfooOk.....","....koosoOOk....","...ksoooooOsk...","...kso.ooOOsk...","....kooooOok....",".....koyyOk.....",".....koooOk.....",".....kokkok.....",".....kNk.kNk....",".....kNk.kNk....",".....kNkkkNk....",".....kkk.kkk...."],
dasha:["......kkkk......",".....kxxxxk.....","....kxxxxxxk....","....kssssssk....","....kskssksk....","....kssssssk....",".....ksssSk.....","......kssk......",".....kaccck.....","....kaccccck....","...kscttttcsk...","...kscttttcsk...","....kcccccck....",".....kcBBck.....",".....kcccck.....",".....kckkck.....",".....kxk.kxk....",".....kxk.kxk....",".....kxk.kxk....",".....kkk.kkk...."],
kep:["......kkkk......",".....kGGGGk.....",".....kmmmmk.....",".....kssssk.....","......kssk......",".....kyyytk.....","....kyyyyyTk....","...ksyRRRyTsk...","...ksyRyRyTsk...","....kyyyyyTk....",".....kyyyTk.....",".....kyyyTk.....",".....kykkyk.....",".....kNk.kNk....",".....kNk.kNk....",".....kNk.kNk....",".....kNk.kNk....",".....kkk.kkk....","................","................"],
bale:["......kkkk......",".....kvvvvk.....",".....kssssk.....",".....ksxsxk.....",".....kssssk.....","......kssk......","....kttttttk....","...ktwwwwwwtk...","..kstwwwwwwtsk..","..kstwwwwwvtsk..","...ktwwwwwvtk...","....kwwwwwvk....","....kwwwwwvk....","....kwwwwwvk....","....kwkkkwk.....",".....kTk.kTk....",".....kTk.kTk....",".....kTk.kTk....",".....kkk.kkk....","................"],
lunett:["......kkkk......",".....kBmBBk.....","....kBBBBBBk....","....kBssssBk....","....kBskskBk....","....kBssssBk....",".....kssssk.....","....kbbbbbk.....","...kbbmbbmbk....","...ksbbbbbsk....","...ksbbbbBsk....","....kbbbbBk.....","....kbmbbBk.....","....kbbbbBk.....","....kbbbbBk.....","....kbbbbBk.....","....kbbbbBk.....","...kbbbbbbBk....","...kBbbbbbBk....","...kkkkkkkkk...."],
mirrit:["......kkkk......",".....keeeek.....","....khhhhhhk....","....kssssssk....","....kskssksk....","....kssssssk....",".....ksssSk.....","......kssk......",".....keeeEk.....","....keeteeEk....","...kseeteeEsk...","...kseeteeEsk...","....keeeeeEk....",".....keeeEk.....",".....keeeEk.....",".....kekkek.....",".....kEk.kEk....",".....kEk.kEk....",".....kEk.kEk....",".....kkk.kkk...."],
sol:["................","................","......kkkk......",".....kppppk.....","....kpHHHHpk....","....kpssssppk...","....kpsksk.pk...","....kpssssk.....",".....kpsspk.....","....kpppppk.....","...kpppppppk....","...ksppppppsk...","....kpppppPk....","....kpppppPk....","....kpppppPk....","....kpppppPk....","...kpppppppPk...","...kkkkkkkkkk...","................","................"],
thess:["......kkkk......",".....kOhhhk.....","....kOOmmOOk....","....kssssssk....","....kskssksk....","....kssssssk....",".....ksssSk.....","......kssk......",".....koootk.....","....kotoootk....","...ksotooOtsk...","...ksotooOtsk...","....kotooOtk....",".....kooOOk.....",".....koooOk.....",".....koooOk.....",".....kokkok.....",".....kTk.kTk....",".....kTk.kTk....",".....kkk.kkk...."],
meres:["......kkkk......",".....kHHHHk.....","....kHHHHHHk....","....kssssssk....","....kskssksk....","....kssssssk....",".....ksssSk.....","......kssk......",".....kvcvvk.....","....kvvcvvvk....","...ksvvcvvvsk...","...ksvvcvvusk...","....kvvcvvuk....",".....kvcvuk.....",".....kvcvuk.....",".....kvcvuk.....",".....kvvvuk.....","....kvvvvvuk....","....kuvvvvuk....","....kkkkkkkk...."],
tuck:["......kkkk......",".....kFFFFk.....",".....kkskkk.....",".....kssssk.....","......kssk......",".....kFffFk.....","....kFffffFk....","...ksFffffFsk...","...ksFfNNfFsk...","....kFffffFk....",".....kfNNfk.....",".....kffffk.....",".....kfkkfk.....",".....kNk.kNk....",".....kNk.kNk....",".....kNk.kNk....",".....kNk.kNk....",".....kkk.kkk....","................","................"],
pock:["................","................","................","....kkkkk.......","....koooook.....",".....khhhhk.....","....kssssssk....","....ksksskssk...","....kssssssk....",".....kssssk.....","....kttttTk.....","...kttttttTk....","...ksttyttsk....","....kttttTk.....","....ktttTTk.....","....kttttTk.....",".....kk.kk......",".....kk.kk......",".....kk.kk......","................"],
cask:["......kkkk......",".....khhssk.....",".....kssssk.....",".....ksxssk.....","......kssk......","....kRRRRRRk....","...kRRRRRRRRk...","..ksRRwwwwRRsk..","..ksRRwwwwRRsk..","...kRRwwwwRRk...","....kRwwwwRk....","....kRwwwvRk....","....kRwwwvRk....","....kwkkkwk.....",".....kNk.kNk....",".....kNk.kNk....",".....kkk.kkk....","................","................","................"],
brand:["......kkkk......",".....khGGGk.....",".....kssssk.....",".....ksxsxk.....",".....kssssk.....","......kssk......",".....kGNNNk.....","....kGNNNNNk....","...ksGNNNNNsk...","...ksGNNNNNsk...","....kGNNNNNk....",".....kNNNNk.....",".....kNNNNk.....",".....kNkkNk.....",".....kNk.kNk....",".....kNk.kNk....",".....kNk.kNk....",".....kkk.kkk....","................","................"],
dray:["................","..kk........kk..",".khhk......khhk.","..khhkkkkkkhhk..",".khhhhhhhhhhhhk.","khThhhhhhhhhThk.","khhhhhhhhhhhhhk.","khkhhhhhhhhkhhk.",".kThhhhhhhhTk...","..khkhhkhhkhk...","..kTk.kTk.kTk...","..kkk.kkk.kkk..."],
fen:["......kkkk......",".....kTTTTk.....","....kTTTTTTk....","....kssssssk....","....kskssksk....","....kssssssk....",".....ksssSk.....","......kssk......",".....kttttk.....","....kttettEk....","...ksttetetsk...","...ksttetetsk...","....ktttttEk....",".....ktttEk.....",".....ktttEk.....",".....ktkktk.....",".....kEk.kEk....",".....kEk.kEk....",".....kEk.kEk....",".....kkk.kkk...."],
vye:["......kkkk......",".....kvvhvk.....","....kvvvvvvk....","....kssssssk....","....kskssksk....","....kssssssk....",".....ksssSk.....","......kssk......",".....kNGGNk.....","....kNGGGGNk....","...ksNGcGGNsk...","...ksNGGGGNsk...","....kNGyyGNk....",".....kNGGNk.....",".....kNGGNk.....",".....kNkkNk.....",".....kGk.kGk....",".....kGk.kGk....",".....kGkkkGk....",".....kkk.kkk...."],
bracket:["................","....kkkkkkkk....","...kHHHHHHHHk...","...kHccHHccHk...","...kHHHHHHHHk...","..kgHHHHHHHHgk..","..kgkkkkkkkkgk..","..kgHgggggHggk..",".ksgHgggggHggsk.",".ksgHgHHgHHggsk.","..kgHgggggHggk..","..kgHHHHHHHHgk..","...kkHHHHHHkk...","...kHHk..kHHk...","...kHHk..kHHk...","...kkkk..kkkk..."],
keldrin:["....kcmcmck.....","....kmcmcmk.....",".....kNNNNk.....","....kNssssNk....","....kNskskNk....","....kNssssNk....",".....kssssk.....","....kRRRRRk.....","...kRNNNNNRk....","..kRsNNNNNsRk...","..kRsNNcNNsRk...","..kRNNNNNNNRk...","..kRNNNNNNNRk...","...kRNNNNNRk....","...kRNNNNNRk....","...kRNNNNNRk....","...kRNkkkNRk....","....kNk.kNk.....","....kNk.kNk.....","....kkk.kkk....."],
glassguard:["....kkkkkkkk....","...kbccccccbk...","...kcbbbbbbck...","..kcbHHHHHHbck..","..kcbHccccHbck..","..kcbHHHHHHbck..",".kbcbHHHHHHbcbk.",".kbcbkkkkkkbcbk.",".kbcbbbbbbbbcbk.",".kbccbbbbbbccbk.","..kcbbbbbbbbck..","..kkbbbbbbbbkk..","...kbbk..kbbk...","...kbbk..kbbk...","...kkkk..kkkk...","................"],
pylon:["......kppk......",".....kpXXpk.....",".....krXXrk.....",".....kpXXpk.....","......kXXk......","......kXXk......","......kXXk......",".....kXXXXk.....","......kXXk......","......kXXk......","......kXXk......",".....kXXXXk.....","....kXXXXXXk....","....kkkkkkkk...."],
/* — Act 2 enemies: the wardens (visored, sashed, procedural) — */
titheman:["......kkkk......",".....kNNNNk.....","....kNmmmmNk....","....kNNNNNNk....","......kGGk......","....kGGGGGGk....","...kGGRRGGGGk...","..ksGGRRGGGGsk..","..ksGGRRGGGGsk..","...kGGGGGGGGk...","....kGGGGGGk....",".....kGGGGk.....",".....kGkkGk.....",".....kNk.kNk....",".....kNk.kNk....",".....kNk.kNk....",".....kNk.kNk....",".....kkk.kkk....","................","................"],
carbineer:["......kkkk......",".....kNNNNk.....","....kNmmmmNk....","....kNNNNNNk....","......kGGk......","..k..kGGGGk.....","..kk kGGGGGk....","..kGkGGRRGGk....","..kGkGGRRGGsk...","..kGksGGGGGk....","..kGk.kGGGGk....","..kGk.kGGGk.....","..kk..kGkGk.....","......kNkNk.....","......kNkkNk....","......kNk.kNk...","......kNk.kNk...","......kkk.kkk...","................","................"],
skimmer:["................","......kkkk......",".....kNNNNk.....","....kNmmmmNk....","....kNNNNNNk....","......kGGk......","....kGGGGGGk....","...ksGRRGGGsk...","...ksGRRGGGsk...","....kGGGGGGk....",".....kGGGGk.....","..kkkkkkkkkkkk..",".kccGGGGGGGGcck.","..kkkkkkkkkkkk..","......k..k......","................"],
reeve:["......kkkk......",".....kNRRNk.....","....kNRmmRNk....","....kNNmmNNk....","....kNNNNNNk....","......kGGk......","....kGGGGGGk....","...kGGGRRGGGk...","..ksGGGRRGGGsk..","..ksGGGRRGGGsk..","..kGGGGRRGGGGk..","...kGGGGGGGGk...","....kGGGGGGk....",".....kGGGGk.....",".....kGRRGk.....",".....kGkkGk.....",".....kNk.kNk....",".....kNk.kNk....",".....kNk.kNk....",".....kkk.kkk...."],
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
