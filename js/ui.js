/* ═══ NEBULA FORCE — ui.js: shared dialog window (with choices) + hint ═══ */
const dlg=document.getElementById('dialog');
const dlgWho=dlg.querySelector('.who');
const dlgTxt=dlg.querySelector('.txt');
const dlgMore=dlg.querySelector('.more');
const dlgChoices=dlg.querySelector('.choices');
let dlgLines=[], dlgIdx=0, typing=false, typeTimer=null, afterDialog=null;
let dlgActive=false;
function openDialog(name, lines, after){
  dlgActive=true;
  if(mode==='town') tstate='dialog';
  dlgLines=lines; dlgIdx=0; afterDialog=after||null;
  dlgWho.textContent=name;
  dlgChoices.classList.remove('show'); dlgChoices.innerHTML='';
  dlg.classList.add('show');
  typeLine();
}
function typeLine(){
  const full=dlgLines[dlgIdx];
  typing=true; dlgMore.style.display='none';
  dlgTxt.textContent='';
  let i=0;
  clearInterval(typeTimer);
  typeTimer=setInterval(()=>{
    i++;
    dlgTxt.textContent=full.slice(0,i);
    if(i>=full.length){
      clearInterval(typeTimer);
      typing=false;
      dlgMore.style.display='block';
    }
  },16);
}
function advanceDialog(){
  if(dlgChoices.classList.contains('show')) return;
  if(typing){
    clearInterval(typeTimer);
    dlgTxt.textContent=dlgLines[dlgIdx];
    typing=false; dlgMore.style.display='block';
    return;
  }
  dlgIdx++;
  if(dlgIdx<dlgLines.length){ typeLine(); }
  else{
    dlg.classList.remove('show');
    const cb=afterDialog; afterDialog=null;
    dlgActive=false;
    if(mode==='town') tstate='walk';
    if(cb) cb();
  }
}
function openChoice(name, prompt, options){
  dlgActive=true;
  if(mode==='town') tstate='dialog';
  dlgWho.textContent=name;
  dlgTxt.textContent=prompt;
  dlgMore.style.display='none';
  dlgLines=[prompt]; dlgIdx=0; typing=false; afterDialog=null;
  dlgChoices.innerHTML='';
  for(const o of options){
    const b=document.createElement('button');
    b.className='dlgbtn'; b.textContent=o.label;
    b.onclick=()=>{
      dlgChoices.classList.remove('show'); dlgChoices.innerHTML='';
      dlg.classList.remove('show');
      dlgActive=false;
      if(mode==='town') tstate='walk';
      o.cb&&o.cb();
    };
    dlgChoices.appendChild(b);
  }
  dlgChoices.classList.add('show');
  dlg.classList.add('show');
}
function setHint(t){ const h=document.getElementById('hint'); if(h) h.textContent=t; }
