// m-parcours.js : accueil avec Sibot, chemin d'apprentissage, leçons (5 exercices variés), points et série
(function(){
document.head.insertAdjacentHTML('beforeend','<style>.pn .nn{font-size:1.2rem;font-weight:700;color:#fff;line-height:1}.tp.lv{background:var(--sky);color:var(--ink)}</style>');
let P={parcours:null,domaine:'',lecons:{},xp:0,serie:{n:0,d:''}},loaded=false,open=false,pick=null;
let CF="",L=null,Q=[],qi=0,ok1=0,cur=null,answered=false,st={},tipId=null;
const root=()=>$('#ap');
const KEY=()=>'sa_prog2_'+(me?me.uid:'x');
const niv=()=>1+Math.floor((P.xp||0)/100);
const prenom=()=>(((typeof user==='string'&&user)||(me&&me.displayName)||'').split(' ')[0])||'';
const LESS=[];CONTENU.niveaux.forEach(n=>n.chapitres.forEach(c=>c.lecons.forEach(l=>{l._c=c;l._n=n;LESS.push(l)})));
const LET='ABCD',GOOD=['Très bien !','Exactement !','Bravo, continuons.','C’est ça !','Parfait !'];
const day=d=>{d=d||new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const yest=()=>{const d=new Date();d.setDate(d.getDate()-1);return day(d)};
const norm=s=>String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9. ]/g,' ').replace(/\s+/g,' ').trim();
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const MM={mpesa:['mp','M-PESA','logo-mpesa.png'],om:['om','orange money','logo-orange.png']};
const rich=t=>esc(t).replace(/\{(mpesa|om)\}/g,(m,k)=>{const x=MM[k];return `<span class="mm ${x[0]}"><img src="${x[2]}" alt="" onload="this.parentNode.classList.add('lg')" onerror="this.remove()"><b>${x[1]}</b></span>`});
const IC={
star:'<svg viewBox="0 0 24 24"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/></svg>',
check:'<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
lock:'<svg viewBox="0 0 24 24"><path d="M7 10V8a5 5 0 0110 0v2h1a1 1 0 011 1v8a1 1 0 01-1 1H6a1 1 0 01-1-1v-8a1 1 0 011-1zm2 0h6V8a3 3 0 00-6 0z"/></svg>',
chest:'<svg viewBox="0 0 24 24"><path d="M4 9a4 4 0 014-4h8a4 4 0 014 4v2H4zm0 3h16v6a2 2 0 01-2 2H6a2 2 0 01-2-2zm7 1v3h2v-3z"/></svg>',
laptop:'<svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="11" rx="2"/><path d="M2 19h20"/></svg>',
brief:'<svg viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="12" rx="2.5"/><path d="M9 7V5.5A1.5 1.5 0 0110.5 4h3A1.5 1.5 0 0115 5.5V7M3 13h18"/></svg>'};

/* ---- Sibot : le robot à chapeau de diplômé ---- */
function sibot(mood,w){w=w||110;
const eyes=mood==='happy'?'<path d="M60 100q12-16 24 0M116 100q12-16 24 0" stroke="#10153f" stroke-width="7" fill="none" stroke-linecap="round"/>'
:mood==='sad'?'<g class="sbe"><circle cx="72" cy="102" r="14" fill="#fff"/><circle cx="128" cy="102" r="14" fill="#fff"/><circle cx="72" cy="106" r="7" fill="#10153f"/><circle cx="128" cy="106" r="7" fill="#10153f"/></g><path d="M56 86l22 6M144 86l-22 6" stroke="#10153f" stroke-width="5" stroke-linecap="round"/>'
:'<g class="sbe"><circle cx="72" cy="100" r="14" fill="#fff"/><circle cx="128" cy="100" r="14" fill="#fff"/><circle cx="75" cy="102" r="7" fill="#10153f"/><circle cx="125" cy="102" r="7" fill="#10153f"/><circle cx="78" cy="98" r="2.6" fill="#fff"/><circle cx="128" cy="98" r="2.6" fill="#fff"/></g>';
const mouth=mood==='sad'?'<path d="M84 140q16-12 32 0" stroke="#10153f" stroke-width="5" fill="none" stroke-linecap="round"/>'
:'<path d="M80 130q20 20 40 0z" fill="#10153f"/><ellipse cx="108" cy="140" rx="9" ry="6" fill="#ff6b8b"/>';
return `<svg class="sb" viewBox="0 0 200 210" width="${w}" height="${Math.round(w*1.05)}" role="img" aria-label="Sibot, le robot de l’académie">
<rect x="84" y="170" width="32" height="14" fill="#1a3fb8"/><rect x="54" y="180" width="92" height="26" rx="13" fill="#2f6df6"/><circle cx="100" cy="193" r="5" fill="#ffd400"/>
<rect x="14" y="98" width="18" height="40" rx="8" fill="#ffd400"/><rect x="168" y="98" width="18" height="40" rx="8" fill="#ffd400"/>
<rect x="28" y="62" width="144" height="112" rx="36" fill="#2f6df6" stroke="#1a3fb8" stroke-width="4"/>
<rect x="42" y="78" width="116" height="84" rx="28" fill="#eaf1ff"/>${eyes}
<circle cx="52" cy="128" r="9" fill="#ff9fb5" opacity=".55"/><circle cx="148" cy="128" r="9" fill="#ff9fb5" opacity=".55"/>${mouth}
<g class="cap"><polygon points="100,18 176,46 100,74 24,46" fill="#111a4a"/><path d="M60 62v16q0 12 40 12t40-12V62l-40 14z" fill="#1f2f8f"/><circle cx="100" cy="46" r="5" fill="#ffd400"/><path d="M164 50v34" stroke="#ffd400" stroke-width="4" stroke-linecap="round"/><circle cx="164" cy="88" r="6" fill="#ffd400"/></g></svg>`}

/* ---- Progression : enregistrée dans le compte, avec copie sur le téléphone ---- */
const blank=()=>({parcours:null,domaine:'',lecons:{},xp:0,serie:{n:0,d:''}});
async function load(){P=blank();let loc=null;try{loc=JSON.parse(localStorage.getItem(KEY())||'null')}catch(e){}
try{const d=await db.collection('progression').doc(me.uid).get();if(d.exists){const x=d.data();P=Object.assign(blank(),{parcours:x.parcours||null,domaine:x.domaine||'',lecons:x.lecons||{},xp:x.xp||0,serie:x.serie||{n:0,d:''}})}else if(loc)P=Object.assign(P,loc)}
catch(e){if(loc)P=Object.assign(P,loc)}
try{const q=await db.collection('demandes').where('uid','==',me.uid).get();const v=q.docs.map(d=>d.data()).filter(x=>x.type==='formation'&&x.statut==='validée').sort((a,b)=>((b.cree&&b.cree.seconds)||0)-((a.cree&&a.cree.seconds)||0));CF=v[0]?v[0].formation:''}catch(e){CF=''}
loaded=true}
function save(){try{localStorage.setItem(KEY(),JSON.stringify(P))}catch(e){}
try{db.collection('progression').doc(me.uid).set({parcours:P.parcours,domaine:P.domaine,lecons:P.lecons,xp:P.xp,serie:P.serie,maj:TS()},{merge:true}).catch(()=>{})}catch(e){}}
const serieNow=()=>(P.serie&&(P.serie.d===day()||P.serie.d===yest()))?P.serie.n:0;

/* ---- Écran d'accueil : une seule question ---- */
function accueil(change){pick=null;
root().innerHTML=`<div class="apw"><div class="sbrow">${sibot('happy',104)}<div class="bub">Salut ${esc(prenom())} ! Moi, c’est <b>Sibot</b>, ton robot-prof. Dis-moi comment tu veux apprendre.</div></div>
<h2 class="big">Comment veux-tu apprendre ?</h2>
<button class="choice" type="button" data-c="general"><span class="ci">${IC.laptop}</span><span><b>Informatique générale</b><small>J’apprends l’informatique, tout simplement.</small></span></button>
<button class="choice" type="button" data-c="domaine"><span class="ci">${IC.brief}</span><span><b>Informatique pour mon domaine</b><small>Avec des exemples de mes études ou de mon métier.</small></span></button>
<div id="apd" hidden><label class="dl">Mon domaine<select id="apS"><option value="">Choisis ton domaine</option>${Object.keys(DOMAINES).map(d=>`<option>${esc(d)}</option>`).join('')}</select></label><div id="apV"></div></div>
<button class="go" type="button" id="go0" data-start0="1" disabled>Commencer</button>
${change?'<p class="mu c">Ta progression est conservée si tu changes de parcours.</p>':''}</div>`}
function apercu(){const d=$('#apS').value,v=$('#apV');pick=d?{p:'domaine',d}:null;$('#go0').disabled=!d;
v.innerHTML=d?`<div class="apx"><b>${esc(d)}</b><p>Par exemple, nous pourrons ${esc(DOMAINES[d].ex)}</p><p class="mu">Exemple illustratif : Singandu Academia enseigne l’informatique, pas le métier lui-même.</p></div>`:''}

/* ---- Le chemin ---- */
function chemin(){
const done=LESS.filter(l=>P.lecons[l.id]).length,first=LESS.find((l,i)=>!P.lecons[l.id]);
const nom=P.parcours==='domaine'?'Informatique pour '+esc(P.domaine):'Informatique générale';
const photo=me&&me.photoURL;
let h=`<div class="apw"><div class="pt"><span class="tav">${photo?`<img src="${esc(photo)}" alt="">`:esc((prenom()[0]||'S').toUpperCase())}</span><span class="tp f">🔥 ${serieNow()}</span><span class="tp lv">Niveau ${niv()}</span></div>
<div class="unit"><div><small>Ma formation en cours</small><b>${esc(CF||'Aucune formation validée')}</b><small>Entraînement avec Sibot · ${nom}</small></div><button class="chg" type="button" data-chg="1">Changer</button></div>`;
CONTENU.niveaux.forEach(n=>n.chapitres.forEach(c=>{
 const dn=c.lecons.filter(l=>P.lecons[l.id]).length,all=dn===c.lecons.length;
 h+=`<h3 class="chp">Chapitre · ${esc(c.titre)}</h3><div class="bar sm"><i style="width:${Math.round(dn/c.lecons.length*100)}%"></i></div><div class="path">`;
 c.lecons.forEach((l,i)=>{const d=P.lecons[l.id],prev=LESS.indexOf(l)===0||P.lecons[LESS[LESS.indexOf(l)-1].id],s=d?'done':prev?'cur':'lock';
  h+=`<div class="ndw z${i%4}"><button class="pn ${s}" type="button" data-n="${l.id}" aria-label="${esc(l.titre)}">${d?IC.check:s==='lock'?IC.lock:'<b class="nn">'+(i+1)+'</b>'}</button>
  <div class="tip ${s==='lock'?'off':''}" data-t="${l.id}" ${tipId===l.id||(tipId===null&&first&&first.id===l.id)?'':'hidden'}><b>${esc(l.titre)}</b><small>Leçon ${i+1} sur ${c.lecons.length}${d?' · Maîtrise '+Math.round(d.s/d.n*100)+' %':''}</small>
  ${s==='lock'?'<small>Termine d’abord la leçon précédente.</small>':`<button type="button" data-start="${l.id}">${d?'Refaire · +10 XP':'Commencer · +25 XP'}</button>`}</div></div>`});
 h+=`<div class="ndw z0"><button class="pn chest ${all?'cur':'lock'}" type="button" data-chest="1" aria-label="Coffre du chapitre">${IC.chest}</button><div class="tip ${all?'':'off'}" data-t="chest" hidden><b>Coffre du chapitre</b><small>${all?'Bravo, chapitre terminé ! Le PDF du chapitre arrive bientôt.':'Termine les '+c.lecons.length+' leçons pour ouvrir le coffre.'}</small></div></div></div>`}));
root().innerHTML=h+'</div>'}
function render(){if(!root()||!me)return;if(!P.parcours)accueil(false);else chemin()}

/* ---- Leçon en plein écran ---- */
function ov(){let o=$('#lsn');if(!o){o=document.createElement('div');o.id='lsn';o.className='lsn';document.body.appendChild(o)}o.hidden=false;return o}
function head(pct){return `<div class="lsh"><button class="lsx" type="button" data-x="1" aria-label="Fermer"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button><div class="lst"><div class="bar"><i style="width:${pct||0}%"></i></div></div></div>`}
function lecon(id){L=LESS.find(l=>l.id===id);if(!L)return;open=true;try{history.pushState({ls:1},'')}catch(e){}
const idx=LESS.indexOf(L)%5,ctx=P.parcours==='domaine'&&DOMAINES[P.domaine]?DOMAINES[P.domaine].c[idx]:'';
ov().innerHTML=head(0)+`<div class="lsb"><h2 class="big sm">${esc(L.titre)}</h2><div class="sbrow">${sibot('normal',92)}<div class="bub">${rich(L.p)}</div></div><div class="apx"><b>À retenir</b><p>${rich(L.r)}</p></div>${ctx?`<div class="apx dom"><b>Dans ton domaine (${esc(P.domaine)})</b><p>${esc(ctx)}</p></div>`:''}</div><div class="lfo"><button class="go2" type="button" data-go="1">C’est parti !</button></div>`}
function demarrer(){Q=L.ex.map(e=>({e,r:false}));qi=0;ok1=0;show()}
function show(){cur=Q[qi];answered=false;st={};const e=cur.e;let b=`<h3 class="qq">${rich(e.q)}</h3>`,f='';
if(e.t==='qcm')b+=e.o.map((t,i)=>`<button class="qo" type="button" data-a="${i}"><span>${LET[i]}</span>${rich(t)}</button>`).join('');
else if(e.t==='vf')b+='<div class="vf"><button class="qo c" type="button" data-v="1">Vrai</button><button class="qo c" type="button" data-v="0">Faux</button></div>';
else if(e.t==='paires'){st.R=shuffle(e.p.map((x,i)=>[x[1],i]));st.done={};st.l=null;st.miss=0;
 b+=`<div class="pr"><div>${e.p.map((x,i)=>`<button class="pc" type="button" data-pl="${i}">${rich(x[0])}</button>`).join('')}</div><div>${st.R.map((x,j)=>`<button class="pc" type="button" data-pr="${j}">${rich(x[0])}</button>`).join('')}</div></div>`}
else if(e.t==='ecrit'){b+='<input id="qin" class="qi" type="text" autocomplete="off" autocapitalize="off" placeholder="Écris ta réponse ici" maxlength="140">';f='<button class="go2" type="button" id="vb" data-chk="1" disabled>Vérifier</button>'}
else if(e.t==='ordre'){st.bank=shuffle(e.i.map((t,i)=>i));st.line=[];b+='<div id="ord"></div>';f='<button class="go2" type="button" id="vb" data-chk="1" disabled>Vérifier</button>'}
ov().innerHTML=head(Math.round(qi/Q.length*100))+`<div class="lsb">${b}</div><div class="lfo" id="lfo">${f}</div>`;
if(e.t==='ordre')rdOrdre();if(e.t==='ecrit')setTimeout(()=>{const i=$('#qin');i&&i.focus()},150)}
function rdOrdre(){const e=cur.e,box=$('#ord');if(!box)return;
box.innerHTML=`<div class="oline">${st.line.map((k,p)=>`<button class="chip" type="button" data-ol="${p}">${rich(e.i[k])}</button>`).join('')}</div><div class="obank">${st.bank.filter(k=>!st.line.includes(k)).map(k=>`<button class="chip" type="button" data-ob="${k}">${rich(e.i[k])}</button>`).join('')}</div>`;
const vb=$('#vb');if(vb)vb.disabled=st.line.length!==e.i.length}
function bonne(e){return e.t==='qcm'?`${LET[e.a]}. ${rich(e.o[e.a])}`:e.t==='vf'?(e.a?'Vrai':'Faux'):e.t==='paires'?e.p.map(x=>rich(x[0])+' → '+rich(x[1])).join('<br>'):e.t==='ecrit'?rich(e.rep):e.i.map(rich).join(' → ')}
function resolve(good){if(answered)return;answered=true;
if(good){if(!cur.r)ok1++}else if(!cur.r)Q.push({e:cur.e,r:true});
const e=cur.e;$('#lfo').innerHTML=`<div class="sheet ${good?'ok':'ko'}"><b>${good?GOOD[qi%GOOD.length]:'Ce n’est pas la bonne réponse.'}</b>${good?'':`<p>Bonne réponse : ${bonne(e)}</p>`}<div id="why" hidden><b>Sibot explique</b><p>${rich(e.e)}</p></div><button class="ghost2" type="button" data-why="1">Explique ma réponse</button><button class="cont ${good?'g':'r'}" type="button" data-next="1">Continuer</button></div>`;
$$('.qi,.pc,.chip').forEach(x=>x.disabled=true)}
function verifier(){const e=cur.e;if(answered)return;
if(e.t==='ecrit'){const v=norm($('#qin').value);if(!v)return;resolve(e.k.every(g=>g.some(w=>v.includes(norm(w)))))}
else if(e.t==='ordre')resolve(st.line.every((k,i)=>k===i))}
function fin(){const n=L.ex.length,premiere=!P.lecons[L.id],gain=premiere?25:10,best=P.lecons[L.id];
if(!best||ok1>=best.s)P.lecons[L.id]={s:ok1,n,t:Date.now()};P.xp=(P.xp||0)+gain;
const t=day(),s=P.serie||{n:0,d:''};let up=false;if(s.d!==t){s.n=s.d===yest()?s.n+1:1;s.d=t;up=true}P.serie=s;save();
const chap=L._c.lecons.every(l=>P.lecons[l.id]),msg=ok1===n?'Parfait, tu maîtrises cette leçon !':ok1>=n-1?'Très bien, tu as compris l’essentiel.':'Bon début ! Refais la leçon pour mieux retenir.';
ov().innerHTML=head(100)+`<div class="lsb fin">${sibot(ok1>=n-1?'happy':'normal',150)}<h2 class="big">Leçon terminée !</h2><p class="msg2">${msg}</p><div class="stats"><div><b>${ok1}/${n}</b><small>du premier coup</small></div><div><b>+${gain}</b><small>points</small></div></div>${chap?'<div class="apx"><b>🎉 Chapitre terminé !</b><p>Le PDF du chapitre arrive bientôt.</p></div>':''}</div><div class="lfo"><button class="go2" type="button" data-end="${up?1:0}">Continuer</button></div>`}
function serieEcran(){const n=P.serie.n;ov().innerHTML=`<div class="lsb fin serie">${sibot('happy',150)}<div class="flame">🔥</div><div class="sn">${n}</div><h2 class="big">${n===1?'Une série est née !':'Série de '+n+' jours !'}</h2><p class="msg2">Entraîne-toi chaque jour pour la prolonger.</p></div><div class="lfo"><button class="go2" type="button" data-back="1">Je garde ma série</button></div>`}
function fermer(fromPop){const o=$('#lsn');if(o)o.hidden=true;if(open){open=false;if(!fromPop&&history.state&&history.state.ls)try{history.back()}catch(e){}}render()}

/* ---- Clics ---- */
document.addEventListener('click',e=>{const g=s=>e.target.closest(s);
if(g('#lsn')){
 if(g('[data-x]')){fermer();return}
 if(g('[data-go]')){demarrer();return}
 if(g('[data-a]')&&!answered){const i=+g('[data-a]').dataset.a,bt=$$('.qo'),q=cur.e;bt.forEach(b=>b.disabled=true);bt[q.a].classList.add('ok');if(i!==q.a)bt[i].classList.add('ko');resolve(i===q.a);return}
 if(g('[data-v]')&&!answered){const v=g('[data-v]').dataset.v==='1',bt=$$('.qo'),q=cur.e;bt.forEach(b=>b.disabled=true);bt[q.a?0:1].classList.add('ok');if(v!==q.a)g('[data-v]').classList.add('ko');resolve(v===q.a);return}
 if(g('[data-pl]')&&!answered){const b=g('[data-pl]');if(b.classList.contains('ok'))return;$$('[data-pl]').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');st.l=+b.dataset.pl;return}
 if(g('[data-pr]')&&!answered){const b=g('[data-pr]');if(st.l===null||b.classList.contains('ok'))return;const j=+b.dataset.pr;
  if(st.R[j][0]===cur.e.p[st.l][1]){b.classList.add('ok');const l=$(`[data-pl="${st.l}"]`);l.classList.remove('sel');l.classList.add('ok');st.done[st.l]=1;st.l=null;if(Object.keys(st.done).length===cur.e.p.length)resolve(st.miss<=1)}
  else{st.miss++;b.classList.add('ko');const l=$(`[data-pl="${st.l}"]`);l.classList.add('ko');setTimeout(()=>{b.classList.remove('ko');l.classList.remove('ko','sel')},450);st.l=null}return}
 if(g('[data-ob]')&&!answered){st.line.push(+g('[data-ob]').dataset.ob);rdOrdre();return}
 if(g('[data-ol]')&&!answered){st.line.splice(+g('[data-ol]').dataset.ol,1);rdOrdre();return}
 if(g('[data-chk]')){verifier();return}
 if(g('[data-why]')){$('#why').hidden=false;g('[data-why]').hidden=true;return}
 if(g('[data-next]')){qi++;qi<Q.length?show():fin();return}
 if(g('[data-end]')){g('[data-end]').dataset.end==='1'?serieEcran():fermer();return}
 if(g('[data-back]')){fermer();return}
 return}
if(!root()||!root().contains(e.target))return;
const c=g('.choice');if(c){$$('.choice').forEach(b=>b.classList.toggle('on',b===c));
 if(c.dataset.c==='general'){$('#apd').hidden=true;pick={p:'general',d:''};$('#go0').disabled=false}else{$('#apd').hidden=false;apercu()}return}
if(g('[data-start0]')&&pick){P.parcours=pick.p;P.domaine=pick.d;save();render();return}
if(g('[data-chg]')){accueil(true);return}
if(g('[data-start]')){lecon(g('[data-start]').dataset.start);return}
const n=g('[data-n]'),ch=g('[data-chest]');if(n||ch){const id=n?n.dataset.n:'chest';tipId=tipId===id?'':id;$$('.tip').forEach(t=>t.hidden=t.dataset.t!==tipId);if(tipId){const t=$(`.tip[data-t="${id}"]`);t&&t.scrollIntoView&&t.scrollIntoView({block:'nearest',behavior:'smooth'})}}});
document.addEventListener('change',e=>{if(e.target.id==='apS')apercu()});
document.addEventListener('input',e=>{if(e.target.id==='qin'){const vb=$('#vb');if(vb)vb.disabled=!e.target.value.trim()}});
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.id==='qin'&&!answered){e.preventDefault();verifier()}});
addEventListener('popstate',()=>{if(open)fermer(true)});

/* ---- Connexion : arriver directement sur l'apprentissage ---- */
function aller(){let n=0;const t=setInterval(()=>{const c=document.querySelector('.pane.on'),b=document.querySelector('#bn [data-t="form"]');if(c&&c.dataset.p==='home'&&b)b.click();if(++n>8)clearInterval(t)},300)}
auth.onAuthStateChanged(async u=>{if(!u){loaded=false;P=blank();const o=$('#lsn');if(o)o.hidden=true;open=false;return}
await load();setTimeout(()=>{render();aller()},350)});
const nb=document.querySelector('#bn [data-t="form"]');if(nb)nb.addEventListener('click',()=>{if(loaded)render()});
})();
