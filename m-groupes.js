// m-groupes.js (v7) — discussion façon WhatsApp : l'apprenant ne voit que son formateur ; le formateur écrit à tous sans voir les noms ; l'admin gère tout
(function(){
const U=()=>auth.currentUser,isAd=()=>!!U()&&U().email===ADMIN,mail=()=>((U()&&U().email)||'').toLowerCase();
let cur=null,unM=[],list=[],names={},view='box',box=null,pend='',cache=[],first=true,rec=null,tmr=null,recBase='';
const unsub=()=>{unM.forEach(f=>{try{f()}catch(e){}});unM=[]};
const auto=()=>{try{return localStorage.getItem('sa_auto')==='1'}catch(e){return false}};
const ICO={mic:'<svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M12 14a3 3 0 003-3V5a3 3 0 10-6 0v6a3 3 0 003 3zm5-3a5 5 0 01-10 0H5a7 7 0 006 6.92V21h2v-3.08A7 7 0 0019 11h-2z"/></svg>',
send:'<svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>',
stop:'<svg viewBox="0 0 24 24" width="22" height="22"><rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/></svg>',
clip:'<svg viewBox="0 0 24 24" width="22" height="22"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M21 11l-8.5 8.5a5 5 0 01-7-7L14 4a3.5 3.5 0 015 5l-8.5 8.5a2 2 0 01-3-3L15 7"/></svg>'};
document.head.insertAdjacentHTML('beforeend',`<style>
.gc{cursor:pointer}.gc small{display:block;color:#667}
.gtop{display:flex;align-items:center;gap:10px;background:linear-gradient(135deg,#1b2a8a,#2f5be6);color:#fff;border-radius:14px 14px 0 0;padding:10px 12px}
.gtop .gbk{background:rgba(255,255,255,.18);color:#fff}
.gbk{width:38px;height:38px;flex:none;border-radius:50%;border:0;background:#eef2ff;color:#1b2a8a;font-size:18px;cursor:pointer}
.gav{width:42px;height:42px;flex:none;border-radius:50%;background:#fff;color:#1b2a8a;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:18px}
.gtt{flex:1;min-width:0}.gtt b{display:block;font-size:1.02rem;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.gtt small{opacity:.85}
.gop{background:#fff;color:#14183a;border:1px solid #e3e8ff;border-top:0;padding:10px}
.gtl{display:flex;gap:6px;flex-wrap:wrap;align-items:center}.gtl:empty{display:none}.gtl .ghost.on{background:#1b2a8a;color:#fff}
#gM{height:58vh;overflow:auto;background:#efeae2;padding:8px 10px}
.gm{color:#14183a;max-width:82%;margin:4px 0;padding:6px 10px 4px;border-radius:10px;background:#fff;box-shadow:0 1px 1px rgba(0,0,0,.13);word-wrap:break-word}
.gm.me{margin-left:auto;background:#d9fdd3}.gm>b{display:block;font-size:.76em;color:#2a3fb5}
.gm p{margin:3px 0}.gm img{max-width:100%;border-radius:8px;display:block;margin:3px 0}
.gm a{display:block;color:#1b2a8a;padding:6px 8px;background:#f2f4ff;border-radius:8px;margin:4px 0;text-decoration:none}.gm a.gb{display:inline-block;background:#1b2a8a;color:#fff;padding:8px 14px;border-radius:20px;font-weight:600}
.gma{display:flex;gap:6px;align-items:center;justify-content:flex-end}.gma small{color:#889;font-size:.68em}
.gm .sp{border:0;background:transparent;cursor:pointer;font-size:.9em;padding:0 4px}
.gwb{background:#f0f2f5;color:#14183a;border-radius:0 0 14px 14px;padding:8px}
.gf{display:flex;gap:6px;align-items:center}.gf input[type=text]{color:#14183a;flex:1;min-width:0;border-radius:22px;padding:11px 14px;border:1px solid #dde1ee;background:#fff}
.gic{width:40px;height:40px;flex:none;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#667;cursor:pointer}
.gsend{width:46px;height:46px;flex:none;border-radius:50%;border:0;background:#1b2a8a;color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0}
.gsend:disabled{opacity:.45}.gsend.on{background:#d93025;animation:gpl 1.2s infinite}
@keyframes gpl{0%{box-shadow:0 0 0 0 rgba(217,48,37,.5)}100%{box-shadow:0 0 0 12px rgba(217,48,37,0)}}
.gpv{color:#14183a;display:flex;gap:10px;align-items:center;background:#fff;border-radius:12px;padding:8px;margin-bottom:8px}.gpv img{width:54px;height:54px;object-fit:cover;border-radius:8px}.gpv div{flex:1;font-size:.85em}
.grec{display:flex;align-items:center;gap:4px;background:#fff0f0;border-radius:22px;padding:8px 14px;margin-bottom:8px;color:#b3261e;font-size:.85rem}
.grec i{width:4px;height:8px;border-radius:2px;background:#d93025;animation:gw 1s ease-in-out infinite}.grec i:nth-child(2){animation-delay:.12s}.grec i:nth-child(3){animation-delay:.24s}.grec i:nth-child(4){animation-delay:.36s}.grec i:nth-child(5){animation-delay:.48s}
.grec span{margin-left:8px;font-variant-numeric:tabular-nums}.grec button{margin-left:auto;border:0;background:transparent;color:#b3261e;font-size:1.1rem;cursor:pointer}
@keyframes gw{0%,100%{height:6px}50%{height:22px}}
.gdt{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px}.gdt label{font-size:.72rem;color:var(--muted)}.gdt input{margin:2px 0 0;padding:8px}.gdr{display:block;margin-top:4px}
.gmd{float:right;font-size:.8em;padding:4px 10px}.gbc{margin-bottom:10px}
.gop .ghost,.gpv .ghost{background:#fff;color:#1b2a8a;border:1px solid #1b2a8a}.gop .ghost.on{background:#1b2a8a;color:#fff}#gM .mu{color:#556}.gf input[type=text]::placeholder{color:#8a90a6}
</style>`);
$('#app .wrap').insertAdjacentHTML('beforeend',`<section class="pane" data-p="grp2"><div id="gL"></div><div id="gR" hidden>
<div class="gtop"><button class="gbk" id="gBk" type="button" aria-label="Retour">←</button><span class="gav" id="gAv"></span><div class="gtt"><b id="gT"></b><small id="gSt"></small></div><button class="gbk" id="gOpB" type="button" aria-label="Options" hidden>⋮</button></div>
<div class="gop" id="gOp" hidden><div class="gtl" id="gTb"></div><div class="gtl" style="margin-top:6px"><button class="ghost" id="gAu" type="button"></button><button class="ghost" id="gCl" type="button">🧹 Nettoyer les doublons</button></div></div>
<div id="gMb" hidden></div>
<div id="gCh"><div id="gM"></div>
<div class="gwb"><div class="gpv" id="gPv" hidden><img id="gPi" alt=""><div><b>Photo prête</b><br>Ajoutez une légende si vous voulez, puis envoyez.</div><button class="ghost" id="gPx" type="button">✕</button></div>
<div class="grec" id="gRec" hidden><i></i><i></i><i></i><i></i><i></i><span id="gRt">0:00</span><button id="gRx" type="button" aria-label="Annuler">✕</button></div>
<div class="gf" id="gFm"><label class="gic" aria-label="Joindre">${ICO.clip}<input id="gF" type="file" hidden accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"></label><input id="gI" type="text" maxlength="1000" placeholder="Message" autocomplete="off"><button class="gsend" id="gS" type="button"></button></div>
<p class="mu" id="gE" style="margin:6px 4px 0"></p></div></div></div></section>`);
$('#bn [data-t="nt"]').insertAdjacentHTML('beforebegin',`<button data-t="grp2" id="tGrp" type="button"><svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20a6 6 0 0112 0M15 20a5 5 0 016 0"/></svg>Groupes</button>`);
$('#tGrp').onclick=()=>{$$('.pane').forEach(p=>p.classList.toggle('on',p.dataset.p==='grp2'));$('[data-p=grp2]').hidden=false;$$('#bn button').forEach(b=>b.classList.toggle('on',b.id==='tGrp'));const t=$('#ttl');if(t)t.textContent='Groupes';back()};
const lb=u=>/youtu|facebook|fb\.watch|vimeo/.test(u)?'▶ Voir la vidéo':/drive\.google|docs\.google|dropbox|onedrive|1drv/.test(u)?'📄 Ouvrir le document':'🔗 Ouvrir le lien';
const lk=t=>esc(t).replace(/(https?:\/\/[^\s<]+)/g,u=>`<a class="gb" href="${u}" target="_blank" rel="noopener noreferrer">${lb(u)}</a>`);
const isProf=()=>!isAd()&&cur&&cur.profEmail===mail(),staff=()=>isAd()||isProf(),md=()=>(cur&&cur.mode)||'prive';
const gref=()=>db.collection('groupes').doc(cur.id);
const bref=u=>gref().collection('boites').doc(u).collection('messages');
const col=()=>view==='salon'?gref().collection('messages'):bref(box);
const lab=u=>{const i=(cur.membres||[]).indexOf(u);return((cur.pseudos&&cur.pseudos[u])||'Apprenant '+(i+1))+(isAd()&&names[u]?' ('+names[u]+')':'')};
// Le nom affiché est toujours celui fixé à l'inscription (surnom si anonyme) : l'apprenant ne peut plus le changer
const pseudo=()=>isProf()?'Formateur':((cur.pseudos&&cur.pseudos[U().uid])||'Apprenant');
function say(t){if(!window.speechSynthesis)return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='fr-FR';const v=speechSynthesis.getVoices().find(x=>/^fr/i.test(x.lang));if(v)u.voice=v;u.rate=.95;speechSynthesis.speak(u)}
async function loadList(){const u=U();if(!u)return;try{let docs;
if(isAd())docs=(await db.collection('groupes').limit(100).get()).docs;
else{const[a,b]=await Promise.all([db.collection('groupes').where('membres','array-contains',u.uid).get(),db.collection('groupes').where('profEmail','==',mail()).get()]);const m={};[...a.docs,...b.docs].forEach(d=>m[d.id]=d);docs=Object.values(m)}
list=docs.map(d=>({id:d.id,...d.data()}));
if(!isAd()){const s=new Set();list=list.filter(g=>{const k=g.formation+'|'+(g.profEmail||'');if(s.has(k))return false;s.add(k);return true})}
$('#gL').innerHTML=list.map(g=>{const o=(g.mode||'prive')==='ouvert';return`<div class="card gc" data-g="${g.id}">${isAd()?`<button class="ghost gmd" data-md="${g.id}" type="button">${o?'Revenir en privé':'Ouvrir le salon'}</button><button class="ghost gmd" data-gd="${g.id}" type="button" style="margin-right:6px">Supprimer</button>`:''}<b>${esc(g.formation)}</b><small>${isAd()?(g.membres||[]).length+' apprenant(s) · '+(o?'🏆 salon ouvert':'🔒 boîtes privées')+' · lecture seule':(g.profEmail===mail()?'Message à vos apprenants':'Discussion avec votre formateur')}</small></div>`}).join('')||'<p class="mu">Aucun groupe pour le moment. L’administration vous ajoutera à un groupe après validation de votre demande.</p>'}
catch(e){$('#gL').innerHTML='<p class="mu">Groupes indisponibles : ajoutez les règles Firebase.</p>'}}
function back(){unsub();if(tmr){clearInterval(tmr);tmr=null}if(rec){try{rec.abort()}catch(e){}rec=null}if(window.speechSynthesis)speechSynthesis.cancel();cur=null;$('#gR').hidden=true;$('#gL').hidden=false;$('#gOp').hidden=true;loadList()}
$('#gBk').onclick=()=>{if(cur&&isAd()&&view==='box')go('mb');else back()};
$('#gOpB').onclick=()=>{$('#gOp').hidden=!$('#gOp').hidden};
function tabs(){const el=$('#gTb');if(!isAd()){el.innerHTML='';return}const t=[];if(md()==='ouvert')t.push(['salon','💬 Salon commun']);t.push(['mb','📥 Boîtes des apprenants']);const act=view==='box'?'mb':view;
el.innerHTML=t.map(x=>`<button class="ghost${x[0]===act?' on':''}" data-tb="${x[0]}" type="button">${x[1]}</button>`).join('')}
$('#gTb').onclick=e=>{const b=e.target.closest('[data-tb]');if(b)go(b.dataset.tb)};
function head(){let st,av;
if(view==='mb'){st='Boîtes des apprenants';av='📥'}else if(view==='salon'){st='Salon commun';av='💬'}
else if(view==='stream'){st='Message pour tous vos apprenants';av='📢'}
else if(isAd()){st=lab(box);av=(st||'?').trim().charAt(0).toUpperCase()}else{st='Formateur';av='🎓'}
$('#gT').textContent=cur.formation;$('#gSt').textContent=st;$('#gAv').textContent=av;
$('#gOpB').hidden=!isAd();if(!isAd())$('#gOp').hidden=true;
$('#gAu').textContent=auto()?'🔊 Lecture vocale : activée':'🔇 Lecture vocale : désactivée';$('#gCl').hidden=!isAd()||view==='mb'}
$('#gAu').onclick=()=>{try{localStorage.setItem('sa_auto',auto()?'0':'1')}catch(e){}if(auto()&&window.speechSynthesis)say('Lecture vocale activée');else if(window.speechSynthesis)speechSynthesis.cancel();head()};
$('#gCl').onclick=async()=>{const seen=new Set(),d=[];cache.forEach(m=>{const k=m.uid+'|'+(m.t||'')+'|'+(m.img?m.img.length:0);if(seen.has(k))d.push(m.id);else seen.add(k)});
if(!d.length)return wait($('#gE'),'Aucun message en double.');if(!confirm(d.length+' message(s) en double seront supprimés. Continuer ?'))return;
try{const b=db.batch();d.forEach(id=>b.delete(col().doc(id)));await b.commit();wait($('#gE'),d.length+' message(s) supprimé(s).')}catch(e){wait($('#gE'),'Échec de la suppression.')}};
const dur=d=>{if(!d||!d.debut)return'Début non renseigné';const a=new Date(d.debut),n=Math.round(((d.fin?new Date(d.fin):new Date())-a)/864e5);return d.fin?'Durée : '+n+' jour(s)':'En cours depuis '+Math.max(0,n)+' jour(s)'};
function members(){const dt=cur.dates||{};$('#gMb').innerHTML=(cur.membres||[]).map(u=>{const d=dt[u]||{};return`<div class="card gc" data-mb="${esc(u)}"><b>${esc(lab(u))}</b><small>Ouvrir la boîte</small><div class="gdt"><label>Début<input type="date" data-dt="debut" data-u="${esc(u)}" value="${esc(d.debut||'')}"></label><label>Fin<input type="date" data-dt="fin" data-u="${esc(u)}" value="${esc(d.fin||'')}"></label></div><small class="gdr">${dur(d)}</small></div>`}).join('')||'<p class="mu">Aucun apprenant dans ce groupe.</p>'}
$('#gMb').addEventListener('change',async e=>{const i=e.target.closest('[data-dt]');if(!i||!cur)return;const u=i.dataset.u,k=i.dataset.dt;cur.dates=cur.dates||{};cur.dates[u]=Object.assign({},cur.dates[u],{[k]:i.value});
try{await gref().update({['dates.'+u+'.'+k]:i.value})}catch(x){wait($('#gE'),'Date non enregistrée.')}members()});
$('#gMb').onclick=e=>{if(e.target.closest('label,input'))return;const c=e.target.closest('[data-mb]');if(c)go('box',c.dataset.mb)};
function paint(ms){const me=U().uid;
$('#gM').innerHTML=ms.map(m=>{const mine=m.uid===me,h=m.cree?new Date(m.cree.seconds*1e3).toLocaleTimeString('fr',{hour:'2-digit',minute:'2-digit'}):'';
const who=mine&&!isAd()?'':(esc(m.p||'')+(isAd()&&names[m.uid]?' ('+esc(names[m.uid])+')':''));
return`<div class="gm ${mine?'me':''}">${who?`<b>${who}</b>`:''}${m.img?`<img src="${esc(m.img)}" alt="">`:''}${m.t?`<p>${lk(m.t)}</p>`:''}${m.f?`<a href="${esc(m.f)}" target="_blank" rel="noopener">📎 ${esc(m.fn)}</a>`:''}${m.fd?`<a href="${esc(m.fd)}" download="${esc(m.fn)}">📎 ${esc(m.fn)}</a>`:''}<div class="gma">${m.t&&!mine?`<button class="sp" type="button" data-sp="${esc(m.t)}" aria-label="Écouter">🔊</button>`:''}${isAd()?`<button class="sp" type="button" data-del="${m.id}" aria-label="Supprimer">🗑</button>`:''}<small>${h}</small></div></div>`}).join('')||'<p class="mu" style="text-align:center;margin-top:20px">Aucun message.</p>';$('#gM').scrollTop=1e6}
// Formateur : un seul fil ; ses messages partent chez tous, les réponses arrivent sous le surnom de l'apprenant
function stream(){const by={};
const draw=()=>{const seen=new Set(),all=[];Object.keys(by).forEach(u=>by[u].forEach(m=>{if(m.bid){if(seen.has(m.bid))return;seen.add(m.bid)}all.push(m)}));
all.sort((a,b)=>((a.cree&&a.cree.seconds)||1e10)-((b.cree&&b.cree.seconds)||1e10));cache=all;paint(all)};
const ms=cur.membres||[];if(!ms.length)paint([]);
ms.forEach(u=>unM.push(bref(u).orderBy('cree').limitToLast(40).onSnapshot(s=>{by[u]=s.docs.map(d=>({id:d.id,...d.data()}));draw()},()=>{})))}
function go(v,b){unsub();if(window.speechSynthesis)speechSynthesis.cancel();
if(isProf())v=md()==='ouvert'?'salon':'stream';else if(!isAd()){v=md()==='ouvert'?'salon':'box';b=U().uid}
view=v;box=b||null;first=true;cache=[];pend='';$('#gPv').hidden=true;const chat=v!=='mb';$('#gMb').hidden=chat;$('#gCh').hidden=!chat;$('#gFm').hidden=isAd();
head();tabs();sync();if(v==='mb')return members();if(v==='stream')return stream();
unM.push(col().orderBy('cree').limitToLast(100).onSnapshot(s=>{const me=U().uid;cache=s.docs.map(d=>({id:d.id,...d.data()}));
if(!first&&auto())s.docChanges().forEach(c=>{if(c.type==='added'){const m=c.doc.data();if(m.uid!==me&&m.t)say(m.t)}});first=false;paint(cache)},()=>{$('#gM').innerHTML='<p class="mu">Messages indisponibles : mettez à jour les règles Firebase.</p>'}))}
$('#gL').onclick=async e=>{const gd=e.target.closest('[data-gd]');
if(gd){e.stopPropagation();if(!confirm('Supprimer ce groupe et sa liste de membres ?'))return;try{await db.collection('groupes').doc(gd.dataset.gd).delete();await db.collection('groupes_admin').doc(gd.dataset.gd).delete().catch(()=>{})}catch(x){}return loadList()}
const m=e.target.closest('[data-md]');
if(m){e.stopPropagation();const g=list.find(x=>x.id===m.dataset.md);try{await db.collection('groupes').doc(g.id).update({mode:(g.mode||'prive')==='ouvert'?'prive':'ouvert'})}catch(x){}return loadList()}
const c=e.target.closest('[data-g]');if(!c)return;cur=list.find(g=>g.id===c.dataset.g);if(!cur)return;names={};
$('#gL').hidden=true;$('#gR').hidden=false;
if(isAd())db.collection('groupes_admin').doc(cur.id).get().then(d=>{names=d.exists?(d.data().noms||{}):{};if(cur&&view==='mb')members();else if(cur)paint(cache)}).catch(()=>{});
go(md()==='ouvert'?'salon':isAd()?'mb':'box',U().uid)};
$('#gM').onclick=async e=>{const s=e.target.closest('[data-sp]'),d=e.target.closest('[data-del]');
if(s&&window.speechSynthesis){if(speechSynthesis.speaking)speechSynthesis.cancel();else say(s.dataset.sp)}
if(d&&confirm('Supprimer ce message ?')){try{await col().doc(d.dataset.del).delete()}catch(x){wait($('#gE'),'Suppression refusée.')}}};
async function bcast(t,x){const ms=cur.membres||[];if(!ms.length)throw new Error('vide');
const bid=Date.now().toString(36)+Math.random().toString(36).slice(2,6),b=db.batch();
ms.forEach(u=>b.set(bref(u).doc(),{uid:U().uid,p:'Formateur',t:t.slice(0,1000),...(x||{}),tous:true,bid,cree:TS()}));await b.commit()}
async function send(x){const t=$('#gI').value.trim();x=x||(pend?{img:pend}:null);if(!t&&!x)return;
if(isProf()&&view==='stream')await bcast(t,x);else await col().add({uid:U().uid,p:pseudo(),t:t.slice(0,1000),...(x||{}),cree:TS()});
$('#gI').value='';pend='';$('#gPv').hidden=true;sync()}
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
function sync(){const has=$('#gI').value.trim()||pend,b=$('#gS'),m=rec?'stop':(has?'send':(SR?'mic':'send'));
b.dataset.m=m;b.className='gsend'+(rec?' on':'');b.innerHTML=m==='send'?ICO.send:m==='stop'?ICO.stop:ICO.mic;b.disabled=(m==='send'&&!has)}
function mic(){recBase=$('#gI').value.trim();rec=new SR();rec.lang='fr-FR';rec.interimResults=true;rec.continuous=true;
rec.onresult=e=>{let t='';for(let i=0;i<e.results.length;i++)t+=e.results[i][0].transcript;$('#gI').value=(recBase+' '+t).trim();sync()};
rec.onend=()=>{rec=null;if(tmr){clearInterval(tmr);tmr=null}$('#gRec').hidden=true;sync()};
rec.onerror=()=>wait($('#gE'),'Micro indisponible : autorisez-le dans le navigateur.');
let s=0;$('#gRt').textContent='0:00';tmr=setInterval(()=>{s++;$('#gRt').textContent=Math.floor(s/60)+':'+String(s%60).padStart(2,'0')},1000);
$('#gRec').hidden=false;try{rec.start()}catch(e){}sync()}
$('#gS').onclick=()=>{const m=$('#gS').dataset.m;if(m==='stop'){rec&&rec.stop()}else if(m==='mic')mic();else send().catch(()=>wait($('#gE'),'Échec de l’envoi.'))};
$('#gRx').onclick=()=>{if(rec){rec.onresult=null;$('#gI').value=recBase;try{rec.abort()}catch(e){}}};
$('#gI').oninput=sync;$('#gI').onkeydown=e=>{if(e.key==='Enter'&&$('#gS').dataset.m==='send')$('#gS').click()};
$('#gPx').onclick=()=>{pend='';$('#gPv').hidden=true;sync()};
$('#gF').onchange=async()=>{const f=$('#gF').files[0],E=$('#gE');$('#gF').value='';if(!f)return;
try{if(f.type.startsWith('image/')){wait(E,'Préparation de la photo…');pend=await shrink(f);$('#gPi').src=pend;$('#gPv').hidden=false;wait(E,'');sync();$('#gI').focus()}
else{if(f.size>500*1024)return wait(E,'Fichier trop lourd (500 Ko maximum). Mettez-le sur Google Drive et collez le lien dans le message.');
wait(E,'Envoi du fichier…');const d=await new Promise((ok,ko)=>{const r=new FileReader();r.onload=()=>ok(r.result);r.onerror=ko;r.readAsDataURL(f)});await send({fd:d,fn:f.name.slice(0,80)});wait(E,'')}}catch(e){wait(E,'Échec de l’envoi.')}};
sync();
// ---- côté administrateur : créer un groupe ----
async function learners(){const f=$('#gaF').value,L=$('#gaL');try{const[s,gs]=await Promise.all([db.collection('demandes').where('formation','==',f).where('statut','==','validée').get(),db.collection('groupes').where('formation','==',f).get()]);const seen={},used=new Set();gs.docs.forEach(g=>(g.data().membres||[]).forEach(u=>used.add(u)));
L.innerHTML=s.docs.map(d=>d.data()).filter(d=>d.uid&&!used.has(d.uid)&&!seen[d.uid]&&(seen[d.uid]=1)).map(d=>{const i=d.identite||{};return`<label style="display:block"><input type="checkbox" data-u="${esc(d.uid)}" data-n="${esc(d.nom||d.email||'')}" data-m="${esc(i.mode||'anonyme')}" data-s="${esc(i.surnom||'')}" checked> ${esc(d.nom||d.email||'Inscrit')}${i.mode==='visible'?' · nom visible':' · anonyme'+(i.surnom?' (« '+esc(i.surnom)+' »)':'')}</label>`}).join('')||(used.size?'Tous les apprenants validés ont déjà un groupe pour cette formation.':'Aucun inscrit validé pour cette formation.')}catch(e){L.textContent='Impossible de charger les inscrits.'}}
function fillProf(){const f=$('#gaF').value,L=(window.FMT||[]).filter(x=>(x.formations||[]).includes(f));
$('#gaP').innerHTML='<option value="">Sans formateur pour l’instant</option>'+L.map(x=>`<option value="${esc((x.email||'').toLowerCase())}">${esc(x.nom)}</option>`).join('')}
function admUI(){if(!isAd()||$('#gAdm'))return;
$('[data-p=adm]').insertAdjacentHTML('afterbegin',`<div class="card" id="gAdm"><h3>Groupes de formation</h3><label>Formation<select id="gaF">${F.map(f=>`<option>${esc(f[0])}</option>`).join('')}</select></label><label>Groupe<select id="gaG"><option value="">➕ Nouveau groupe</option></select></label><label>Formateur (selon la spécialité)<select id="gaP"></select></label><div class="gdt"><label>Début de l’apprenant<input type="date" id="gaDb"></label><label>Fin prévue (facultatif)<input type="date" id="gaFn"></label></div><b>Apprenants validés</b><div id="gaL" class="mu"></div><button id="gaC" type="button">Créer le groupe</button> <button id="gaD" class="ghost" type="button">Supprimer les groupes en double</button><p class="mu" id="gaM"></p><p class="mu">Le groupe porte le nom de la formation. Chaque apprenant reçoit une boîte privée avec le formateur. Dans l’onglet « Groupes », « Ouvrir le salon » les réunit pour une compétition, et « Revenir en privé » les isole de nouveau.</p></div>`);
let GL=[];
async function fillGroups(){const f=$('#gaF').value;try{const s=await db.collection('groupes').where('formation','==',f).get();GL=s.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>((a.cree&&a.cree.seconds)||0)-((b.cree&&b.cree.seconds)||0))}catch(e){GL=[]}
$('#gaG').innerHTML='<option value="">➕ Nouveau groupe</option>'+GL.map(g=>{const d=g.cree?new Date(g.cree.seconds*1e3).toLocaleDateString('fr'):'';return`<option value="${g.id}">Ajouter au groupe du ${d} (${(g.membres||[]).length} apprenant(s))</option>`}).join('');syncG()}
function syncG(){const g=GL.find(x=>x.id===$('#gaG').value);$('#gaP').disabled=!!g;if(g)$('#gaP').value=g.profEmail||'';$('#gaC').textContent=g?'Ajouter au groupe':'Créer le groupe'}
$('#gaDb').value=new Date().toISOString().slice(0,10);
$('#gaG').onchange=syncG;
$('#gaF').onchange=()=>{learners();fillProf();fillGroups()};learners();fillProf();fillGroups();addEventListener('fmt',()=>{fillProf();syncG()});
let busy=false;
$('#gaC').onclick=async()=>{if(busy)return;const M=$('#gaM'),B=$('#gaC'),ch=$$('#gaL input:checked'),pe=$('#gaP').value.trim().toLowerCase(),f=$('#gaF').value;
if(!ch.length)return wait(M,'Sélectionnez au moins un apprenant.');
busy=true;B.disabled=true;wait(M,'Enregistrement…');const gid=$('#gaG').value,d0=$('#gaDb').value||new Date().toISOString().slice(0,10),d1=$('#gaFn').value||'';
try{const gs=await db.collection('groupes').where('formation','==',f).get(),used=new Set();gs.docs.forEach(g=>(g.data().membres||[]).forEach(u=>used.add(u)));
if(gid){if(ch.some(c=>used.has(c.dataset.u))){learners();return wait(M,'Un de ces apprenants a déjà un groupe pour cette formation.')}
const ref=db.collection('groupes').doc(gid),sn=await ref.get();if(!sn.exists)throw new Error('absent');const g0=sn.data(),base=(g0.membres||[]).length,up={},nm={};
ch.forEach((c,i)=>{const u=c.dataset.u,vis=c.dataset.m==='visible';up['pseudos.'+u]=vis?(c.dataset.n||'Apprenant '+(base+i+1)):(c.dataset.s||'Apprenant '+(base+i+1));up['anon.'+u]=!vis;up['dates.'+u]={debut:d0,fin:d1};nm[u]=c.dataset.n});
up.membres=firebase.firestore.FieldValue.arrayUnion(...ch.map(c=>c.dataset.u));
const b2=db.batch();b2.update(ref,up);b2.set(db.collection('groupes_admin').doc(gid),{noms:nm},{merge:true});
ch.forEach(c=>b2.set(db.collection('notifs').doc(),{to:c.dataset.u,titre:'Nouveau groupe',texte:'Vous avez été ajouté au groupe « '+f+' ». Ouvrez l’onglet Groupes.',cree:TS()}));
await b2.commit();wait(M,ch.length+' apprenant(s) ajouté(s) au groupe.');learners();fillGroups();return}
if(ch.some(c=>used.has(c.dataset.u))){learners();return wait(M,'Un de ces apprenants a déjà un groupe pour cette formation.')}
const membres=[],pseudos={},anon={},noms={},dates={};ch.forEach((c,i)=>{const u=c.dataset.u,vis=c.dataset.m==='visible';membres.push(u);pseudos[u]=vis?(c.dataset.n||'Apprenant '+(i+1)):(c.dataset.s||'Apprenant '+(i+1));anon[u]=!vis;noms[u]=c.dataset.n;dates[u]={debut:d0,fin:d1}});
const ref=db.collection('groupes').doc(),b=db.batch();
b.set(ref,{formation:f,profEmail:pe,membres,pseudos,anon,dates,mode:'prive',cree:TS()});b.set(db.collection('groupes_admin').doc(ref.id),{noms});
membres.forEach(u=>b.set(db.collection('notifs').doc(),{to:u,titre:'Nouveau groupe',texte:'Vous avez été ajouté au groupe « '+f+' ». Ouvrez l’onglet Groupes.',cree:TS()}));
await b.commit();wait(M,'Groupe créé.');learners();fillGroups()}
catch(e){wait(M,'Échec : rien n’a été créé. Vérifiez les règles Firebase.')}
finally{busy=false;B.disabled=false}};
$('#gaD').onclick=async()=>{const M=$('#gaM');if(!confirm('Supprimer les groupes en double (même formation, mêmes apprenants) ? Un seul sera gardé.'))return;
try{const s=await db.collection('groupes').get(),m={};s.docs.forEach(d=>{const g=d.data(),k=g.formation+'|'+(g.membres||[]).slice().sort().join(',')+'|'+(g.profEmail||'');(m[k]=m[k]||[]).push(d)});let n=0;
for(const k in m){const a=m[k].sort((x,y)=>((x.data().cree&&x.data().cree.seconds)||0)-((y.data().cree&&y.data().cree.seconds)||0));if(a.length<2)continue;
const has=await Promise.all(a.map(d=>db.collection('groupes_admin').doc(d.id).get().then(x=>x.exists)));let keep=has.lastIndexOf(true);if(keep<0)keep=a.length-1;
const kd=a[keep];if(!has[keep]){const noms={};await Promise.all((kd.data().membres||[]).map(async u=>{try{const e=await db.collection('etudiants').doc(u).get();noms[u]=(e.exists&&e.data().nom)||''}catch(x){}}));await db.collection('groupes_admin').doc(kd.id).set({noms})}
for(let i=0;i<a.length;i++)if(i!==keep){await db.collection('groupes').doc(a[i].id).delete();await db.collection('groupes_admin').doc(a[i].id).delete().catch(()=>{});n++}}
wait(M,n+' groupe(s) en double supprimé(s).');learners()}catch(e){wait(M,'Échec du nettoyage.')}}}
auth.onAuthStateChanged(u=>{if(u)admUI()});
})();
