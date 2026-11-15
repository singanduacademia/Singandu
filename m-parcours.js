// m-parcours.js : choix du parcours, chemin d'apprentissage, leçons et QCM à correction immédiate
(function(){
let P={parcours:null,domaine:'',lecons:{}},loaded=false,L=null,qi=0,sc=0,open=false;
const root=()=>$('#ap');
const KEY=()=>'sa_prog_'+(me?me.uid:'x');
const prenom=()=>(((typeof user==='string'&&user)||(me&&me.displayName)||'').split(' ')[0])||'';
const ALL=[];CONTENU.niveaux.forEach(n=>n.chapitres.forEach(c=>c.lecons.forEach(l=>ALL.push(l))));
const OK=['Très bien !','Exactement !','Bravo, continuons.','C’est ça !'];
const LET='ABCD';

/* ---- Progression : enregistrée dans le compte, avec copie sur le téléphone ---- */
async function load(){P={parcours:null,domaine:'',lecons:{}};
let loc=null;try{loc=JSON.parse(localStorage.getItem(KEY())||'null')}catch(e){}
try{const d=await db.collection('progression').doc(me.uid).get();if(d.exists){const x=d.data();P={parcours:x.parcours||null,domaine:x.domaine||'',lecons:x.lecons||{}}}else if(loc)P=Object.assign(P,loc)}
catch(e){if(loc)P=Object.assign(P,loc)}
loaded=true}
function save(){try{localStorage.setItem(KEY(),JSON.stringify(P))}catch(e){}
try{db.collection('progression').doc(me.uid).set({parcours:P.parcours,domaine:P.domaine,lecons:P.lecons,maj:TS()},{merge:true}).catch(()=>{})}catch(e){}}

/* ---- Écran 1 : choix du parcours ---- */
function choix(change){
root().innerHTML=`<div class="apw"><h2>Bonjour ${esc(prenom())}, bienvenue sur Singandu Academia</h2>
<p class="mu">Nous ferons de notre mieux pour adapter votre apprentissage à vos objectifs.</p>
<p><b>Souhaitez-vous apprendre l’informatique générale à 100 %, ou préférez-vous que nous utilisions des exemples liés à votre domaine d’origine ?</b></p>
<button class="opt" data-c="general" type="button"><b>Informatique générale à 100 %</b><small>Vous apprenez l’informatique pour elle-même.</small></button>
<button class="opt" data-c="domaine" type="button"><b>Informatique adaptée à mon domaine</b><small>Mêmes compétences, avec des exemples liés à votre domaine.</small></button>
<div id="apd" hidden><label>Votre domaine<select id="apS"><option value="">Choisissez votre domaine</option>${Object.keys(DOMAINES).map(d=>`<option>${esc(d)}</option>`).join('')}</select></label><div id="apV"></div></div>
${change?'<p class="mu">Votre historique est conservé si vous changez de parcours.</p>':''}</div>`}
function apercu(){const d=$('#apS').value,v=$('#apV');if(!d){v.innerHTML='';return}
v.innerHTML=`<div class="apx"><b>Vous avez choisi : ${esc(d)}.</b><p>Par exemple, nous pourrons ${esc(DOMAINES[d].ex)}</p><p class="mu">Exemple illustratif : Singandu Academia enseigne l’informatique, pas le métier lui-même.</p><p>Souhaitez-vous continuer avec cette approche ?</p><div class="modes"><button type="button" data-ok="1">Oui, continuer</button><button type="button" class="ghost" data-gen="1">Non, informatique générale</button></div></div>`}

/* ---- Écran 2 : le chemin ---- */
function chemin(){
const done=ALL.filter(l=>P.lecons[l.id]).length,pc=Math.round(done/ALL.length*100);
const lib=P.parcours==='domaine'?'Informatique adaptée : '+esc(P.domaine):'Informatique générale';
let h=`<div class="apw"><div class="aph"><div><small>Votre parcours</small><b>${lib}</b></div><button class="ghost sm" type="button" data-chg="1">Changer</button></div>
<div class="apf"><h2>${esc(CONTENU.titre)}</h2><p class="mu">${esc(CONTENU.desc)}</p><div class="bar"><i style="width:${pc}%"></i></div><small class="mu">${done} leçon${done>1?'s':''} terminée${done>1?'s':''} sur ${ALL.length}</small></div>`;
let i=0;CONTENU.niveaux.forEach(n=>{h+=`<h3 class="apn">${esc(n.titre)}</h3>`;n.chapitres.forEach(c=>{h+=`<p class="apc">${esc(c.titre)}</p><div class="chm">`;
c.lecons.forEach(l=>{const d=P.lecons[l.id],prev=i===0||P.lecons[ALL[i-1].id],st=d?'done':prev?'cur':'lock';
h+=`<button class="nd ${st} p${i%4}" type="button" data-l="${l.id}" ${st==='lock'?'disabled':''}><span class="nc">${d?'✓':st==='lock'?'🔒':i+1}</span><span class="nt"><b>${esc(l.titre)}</b><small>${d?'Terminée · '+d.s+'/'+d.n:st==='lock'?'Terminez la leçon précédente':l.q.length+' questions'}</small></span></button>`;i++});h+='</div>'})});
root().innerHTML=h+'</div>'}
function render(){if(!root()||!me)return;if(!P.parcours)choix(false);else chemin()}

/* ---- Leçon en plein écran ---- */
function ov(){let o=$('#lsn');if(!o){o=document.createElement('div');o.id='lsn';o.className='lsn';document.body.appendChild(o)}o.hidden=false;return o}
function head(t,pct){return `<div class="lsh"><button class="lsx" type="button" data-x="1" aria-label="Fermer"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button><div class="lst"><b>${esc(t)}</b>${pct!=null?`<div class="bar"><i style="width:${pct}%"></i></div>`:''}</div></div>`}
function lecon(id){L=ALL.find(l=>l.id===id);if(!L)return;qi=0;sc=0;open=true;try{history.pushState({ls:1},'')}catch(e){}
const idx=ALL.indexOf(L),ctx=P.parcours==='domaine'&&DOMAINES[P.domaine]?DOMAINES[P.domaine].c[idx]:'';
ov().innerHTML=head(L.titre)+`<div class="lsb">${L.p.map(x=>`<p>${esc(x)}</p>`).join('')}<div class="apx"><b>À retenir</b><p>${esc(L.r)}</p></div>${ctx?`<div class="apx dom"><b>Dans votre domaine (${esc(P.domaine)})</b><p>${esc(ctx)}</p></div>`:''}</div><div class="lsf"><button type="button" data-go="1">Passer aux exercices</button></div>`}
function quest(){const q=L.q[qi];
ov().innerHTML=head(L.titre,Math.round(qi/L.q.length*100))+`<div class="lsb"><small class="mu">Question ${qi+1} sur ${L.q.length}</small><h3 class="qq">${esc(q.q)}</h3>${q.o.map((t,i)=>`<button class="qo" type="button" data-a="${i}"><span>${LET[i]}</span>${esc(t)}</button>`).join('')}<div id="qfb"></div></div><div class="lsf" id="lf" hidden></div>`}
function repondre(i){const q=L.q[qi],bt=$$('.qo');if(bt[0].disabled)return;bt.forEach(b=>b.disabled=true);
const bon=i===q.a;if(bon)sc++;bt[q.a].classList.add('ok');if(!bon)bt[i].classList.add('ko');
$("#qfb").innerHTML=bon?`<div class="fb ok"><b>${OK[qi%OK.length]}</b></div>`:`<div class="fb ko"><b>Ce n’est pas la bonne réponse.</b> La bonne réponse est ${LET[q.a]}.<div class="modes"><button type="button" class="ghost" data-why="1">Voulez-vous comprendre pourquoi ?</button></div><div id="why"></div></div>`;
const f=$('#lf');f.hidden=false;f.innerHTML=`<button type="button" data-next="1">${qi+1<L.q.length?'Continuer':'Voir mon résultat'}</button>`;f.scrollIntoView&&0}
function fin(){const n=L.q.length,best=P.lecons[L.id];if(!best||sc>=best.s)P.lecons[L.id]={s:sc,n,t:Date.now()};save();
const idx=ALL.indexOf(L),nxt=ALL[idx+1],msg=sc===n?'Parfait, vous maîtrisez cette leçon !':sc>=n*.75?'Très bien, vous avez bien compris l’essentiel.':'Bon début. Reprenez la leçon pour mieux retenir les points difficiles.';
ov().innerHTML=head(L.titre,100)+`<div class="lsb fin"><div class="bg">${sc}/${n}</div><h3>Leçon terminée ✓</h3><p>${msg}</p></div><div class="lsf"><button type="button" data-back="1">${nxt?'Retour au parcours':'Terminer'}</button><button type="button" class="ghost" data-again="1">Refaire les exercices</button></div>`}
function fermer(fromPop){const o=$('#lsn');if(o)o.hidden=true;if(open){open=false;if(!fromPop&&history.state&&history.state.ls)try{history.back()}catch(e){}}render()}

/* ---- Clics ---- */
document.addEventListener('click',e=>{
const g=(s)=>e.target.closest(s);
if(g('#lsn')){
 if(g('[data-x]')){fermer();return}
 if(g('[data-go]')){qi=0;sc=0;quest();return}
 if(g('[data-a]')){repondre(+g('[data-a]').dataset.a);return}
 if(g('[data-why]')){const q=L.q[qi];$('#why').innerHTML=`<div class="apx"><b>Singala explique</b><p>${esc(q.e)}</p></div>`;g('[data-why]').hidden=true;return}
 if(g('[data-next]')){qi++;qi<L.q.length?quest():fin();return}
 if(g('[data-again]')){qi=0;sc=0;quest();return}
 if(g('[data-back]')){fermer();return}
 return}
if(!root()||!root().contains(e.target))return;
const o=g('.opt');if(o){$$('.opt').forEach(b=>b.classList.toggle('on',b===o));
 if(o.dataset.c==='general'){P.parcours='general';P.domaine='';save();render()}else{$('#apd').hidden=false;apercu()}return}
if(g('[data-ok]')){const d=$('#apS').value;if(!d)return;P.parcours='domaine';P.domaine=d;save();render();return}
if(g('[data-gen]')){P.parcours='general';P.domaine='';save();render();return}
if(g('[data-chg]')){choix(true);return}
const l=g('[data-l]');if(l&&!l.disabled)lecon(l.dataset.l)});
document.addEventListener('change',e=>{if(e.target.id==='apS')apercu()});
addEventListener('popstate',()=>{if(open)fermer(true)});

/* ---- Connexion : arriver directement sur l'apprentissage ---- */
function aller(){let n=0;const t=setInterval(()=>{const c=document.querySelector('.pane.on'),b=document.querySelector('#bn [data-t="form"]');if(c&&c.dataset.p==='home'&&b)b.click();if(++n>8)clearInterval(t)},300)}
auth.onAuthStateChanged(async u=>{if(!u){loaded=false;P={parcours:null,domaine:'',lecons:{}};const o=$('#lsn');if(o)o.hidden=true;open=false;return}
await load();setTimeout(()=>{render();aller()},350)});
const nb=document.querySelector('#bn [data-t="form"]');if(nb)nb.addEventListener('click',()=>{if(loaded)render()});
})();
