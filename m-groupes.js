// m-groupes.js (v4) — groupes de formation : boîtes privées, salon ouvert par l'admin, photos avec légende, voix
(function(){
const U=()=>auth.currentUser,isAd=()=>!!U()&&U().email===ADMIN,mail=()=>((U()&&U().email)||'').toLowerCase();
let cur=null,unM=null,list=[],names={},view='box',box=null,pend='',cache=[],first=true,rec=null;
const auto=()=>{try{return localStorage.getItem('sa_auto')==='1'}catch(e){return false}};
document.head.insertAdjacentHTML('beforeend',`<style>
.gc{cursor:pointer}.gc small{display:block;color:#667}
.gh{padding:12px}.ght{display:flex;align-items:center;gap:10px}
.gbk{width:38px;height:38px;flex:none;border-radius:50%;border:0;background:#eef2ff;color:#1b2a8a;font-size:18px;cursor:pointer}
.gav{width:42px;height:42px;flex:none;border-radius:50%;background:linear-gradient(135deg,#1b2a8a,#2f5be6);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:18px}
.gtt{flex:1;min-width:0}.gtt b{display:block;font-size:1.02rem;line-height:1.2}.gtt small{color:#667}
.gpill{font-size:.72rem;font-weight:700;background:#e6f4ea;color:#1a7f37;border-radius:999px;padding:4px 10px;white-space:nowrap}.gpill.o{background:#fff3b0;color:#8a6d00}
.gtl{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px;align-items:center}.gtl:empty{display:none}
.gset{display:flex;gap:6px;flex-wrap:wrap}.gset .ghost.on,.gtl .ghost.on{background:#1b2a8a;color:#fff}
.gm{max-width:84%;margin:8px 0;padding:8px 12px;border-radius:14px;background:#eef2ff;word-wrap:break-word}
.gm.me{margin-left:auto;background:#fff3b0}.gm>b{font-size:.8em;color:#2a3fb5}.gm p{margin:4px 0}
.gm img{max-width:100%;border-radius:10px;display:block;margin:4px 0}
.gm a{display:block;padding:6px 8px;background:#fff;border-radius:8px;margin:4px 0;text-decoration:none}.gm a.gb{display:inline-block;background:#1b2a8a;color:#fff;padding:8px 14px;border-radius:20px;font-weight:600;margin:4px 0}
.gma{display:flex;gap:6px;align-items:center;margin-top:4px}.gma small{margin-left:auto;color:#889;font-size:.7em}
.gm .sp{border:0;background:#fff;border-radius:12px;padding:2px 8px;cursor:pointer;font-size:.78em}.gm .sp.rd{color:#b3261e}
#gM{max-height:52vh;overflow:auto}.gf{display:flex;gap:6px;align-items:center;margin-top:8px}.gf input[type=text]{flex:1;min-width:0}
.gpv{display:flex;gap:10px;align-items:center;background:#eef2ff;border-radius:12px;padding:8px;margin-top:8px}.gpv img{width:54px;height:54px;object-fit:cover;border-radius:8px}.gpv div{flex:1;font-size:.85em}
.grec{display:flex;align-items:center;gap:4px;background:#fff0f0;border-radius:12px;padding:10px 12px;margin-top:8px;color:#b3261e;font-size:.85rem}
.grec i{width:4px;height:8px;border-radius:2px;background:#d93025;animation:gw 1s ease-in-out infinite}.grec i:nth-child(2){animation-delay:.12s}.grec i:nth-child(3){animation-delay:.24s}.grec i:nth-child(4){animation-delay:.36s}.grec i:nth-child(5){animation-delay:.48s}.grec span{margin-left:8px}
@keyframes gw{0%,100%{height:6px}50%{height:22px}}
#gMic.on{background:#d93025;color:#fff;animation:gpl 1.2s infinite}@keyframes gpl{0%{box-shadow:0 0 0 0 rgba(217,48,37,.5)}100%{box-shadow:0 0 0 12px rgba(217,48,37,0)}}
.gmd{float:right;font-size:.8em;padding:4px 10px}.gbc{margin-bottom:10px}
</style>`);
$('#app .wrap').insertAdjacentHTML('beforeend',`<section class="pane" data-p="grp2"><div id="gL"></div><div id="gR" hidden>
<div class="card gh"><div class="ght"><button class="gbk" id="gBk" type="button" aria-label="Retour">←</button><span class="gav" id="gAv"></span><div class="gtt"><b id="gT"></b><small id="gSt"></small></div><span class="gpill" id="gPill"></span></div>
<div class="gtl" id="gTb"></div>
<div class="gtl"><button class="ghost" id="gAu" type="button"></button><button class="ghost" id="gCl" type="button" hidden>🧹 Nettoyer les doublons</button></div></div>
<div id="gMb" hidden></div>
<div id="gCh"><div class="card gset" id="gSet"><button class="ghost" id="gPs" type="button">Changer mon pseudo</button><button class="ghost" id="gAn" type="button"></button></div>
<div class="card"><div id="gM"></div>
<div class="gpv" id="gPv" hidden><img id="gPi" alt=""><div><b>Photo prête</b><br>Écris une légende dans la zone de message, puis envoie.</div><button class="ghost" id="gPx" type="button">✕</button></div>
<div class="grec" id="gRec" hidden><i></i><i></i><i></i><i></i><i></i><span>Je t’écoute… touche le micro pour arrêter</span></div>
<div class="gf" id="gFm"><label class="ghost" style="padding:8px 12px;cursor:pointer">📎<input id="gF" type="file" hidden accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"></label><button class="ghost" id="gMic" type="button" title="Dicter">🎤</button><input id="gI" type="text" maxlength="1000" placeholder="Message, légende ou lien…"><button id="gS" type="button">Envoyer</button></div><p class="mu" id="gE"></p></div></div></div></section>`);
$('#bn [data-t="nt"]').insertAdjacentHTML('beforebegin',`<button data-t="grp2" id="tGrp" type="button"><svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20a6 6 0 0112 0M15 20a5 5 0 016 0"/></svg>Groupes</button>`);
$('#tGrp').onclick=()=>{$$('.pane').forEach(p=>p.classList.toggle('on',p.dataset.p==='grp2'));$('[data-p=grp2]').hidden=false;$$('#bn button').forEach(b=>b.classList.toggle('on',b.id==='tGrp'));const t=$('#ttl');if(t)t.textContent='Groupes';back()};
const lb=u=>/youtu|facebook|fb\.watch|vimeo/.test(u)?'▶ Voir la vidéo':/drive\.google|docs\.google|dropbox|onedrive|1drv/.test(u)?'📄 Ouvrir le document':'🔗 Ouvrir le lien';
const lk=t=>esc(t).replace(/(https?:\/\/[^\s<]+)/g,u=>`<a class="gb" href="${u}" target="_blank" rel="noopener noreferrer">${lb(u)}</a>`);
const isProf=()=>!isAd()&&cur&&cur.profEmail===mail(),staff=()=>isAd()||isProf(),md=()=>(cur&&cur.mode)||'prive';
const gref=()=>db.collection('groupes').doc(cur.id);
const col=()=>view==='salon'?gref().collection('messages'):gref().collection('boites').doc(box).collection('messages');
const lab=u=>{const i=(cur.membres||[]).indexOf(u);return((cur.pseudos&&cur.pseudos[u])||'Apprenant '+(i+1))+(isAd()&&names[u]?' ('+names[u]+')':'')};
const pseudo=()=>{if(isProf())return'Formateur';const u=U().uid;return(cur.anon&&cur.anon[u]===false)?(user||'Apprenant'):((cur.pseudos&&cur.pseudos[u])||'Apprenant')};
const anonTxt=()=>{$('#gAn').textContent=(cur.anon&&cur.anon[U().uid]===false)?'🕶 Passer en anonyme':'🕶 Anonyme : activé (toucher pour afficher mon nom)'};
async function setMine(k,v){const u=U().uid;await gref().update({[k+'.'+u]:v});(cur[k]=cur[k]||{})[u]=v}
function say(t){if(!window.speechSynthesis)return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='fr-FR';const v=speechSynthesis.getVoices().find(x=>/^fr/i.test(x.lang));if(v)u.voice=v;u.rate=.95;speechSynthesis.speak(u)}
async function loadList(){const u=U();if(!u)return;try{let docs;
if(isAd())docs=(await db.collection('groupes').limit(100).get()).docs;
else{const[a,b]=await Promise.all([db.collection('groupes').where('membres','array-contains',u.uid).get(),db.collection('groupes').where('profEmail','==',mail()).get()]);const m={};[...a.docs,...b.docs].forEach(d=>m[d.id]=d);docs=Object.values(m)}
list=docs.map(d=>({id:d.id,...d.data()}));
$('#gL').innerHTML=list.map(g=>{const st=isAd()||g.profEmail===mail(),o=(g.mode||'prive')==='ouvert';return`<div class="card gc" data-g="${g.id}">${isAd()?`<button class="ghost gmd" data-md="${g.id}" type="button">${o?'Revenir en privé':'Ouvrir le salon'}</button><button class="ghost gmd" data-gd="${g.id}" type="button" style="margin-right:6px">Supprimer</button>`:''}<b>${esc(g.formation)}</b><small>${st?(g.membres||[]).length+' apprenant(s) · ':''}${o?'🏆 salon ouvert':(st?'🔒 boîtes privées':'🔒 ton espace avec ton formateur')}${isAd()?' · lecture seule':''}</small></div>`}).join('')||'<p class="mu">Aucun groupe pour le moment. L’administration vous ajoutera à un groupe après validation de votre demande.</p>'}
catch(e){$('#gL').innerHTML='<p class="mu">Groupes indisponibles : ajoutez les règles Firebase.</p>'}}
function back(){if(unM){unM();unM=null}if(window.speechSynthesis)speechSynthesis.cancel();cur=null;$('#gR').hidden=true;$('#gL').hidden=false;loadList()}
$('#gBk').onclick=()=>{if(cur&&staff()&&view==='box')go('mb');else back()};
function tabs(){const el=$('#gTb');if(!staff()){el.innerHTML='';return}const t=[];if(md()==='ouvert')t.push(['salon','💬 Salon commun']);t.push(['mb','📥 Boîtes des apprenants']);const act=view==='box'?'mb':view;
el.innerHTML=t.length>1?t.map(x=>`<button class="ghost${x[0]===act?' on':''}" data-tb="${x[0]}" type="button">${x[1]}</button>`).join(''):''}
$('#gTb').onclick=e=>{const b=e.target.closest('[data-tb]');if(b)go(b.dataset.tb)};
function head(){const chat=view!=='mb';let st,av;
if(view==='mb'){st='Boîtes des apprenants';av='📥'}else if(view==='salon'){st='Salon commun';av='💬'}else if(staff()){st=lab(box);av=(st||'?').trim().charAt(0).toUpperCase()}else{st='Ton espace avec ton formateur';av='🎓'}
$('#gT').textContent=cur.formation;$('#gSt').textContent=st;$('#gAv').textContent=av;
const pr=md()==='prive';$('#gPill').textContent=pr?'🔒 Privé':'🏆 Salon';$('#gPill').className='gpill'+(pr?'':' o');
$('#gAu').textContent=auto()?'🔊 Lecture vocale : activée':'🔇 Lecture vocale : désactivée';$('#gCl').hidden=!isAd()||!chat}
$('#gAu').onclick=()=>{try{localStorage.setItem('sa_auto',auto()?'0':'1')}catch(e){}if(auto()&&window.speechSynthesis)say('Lecture vocale activée');else if(window.speechSynthesis)speechSynthesis.cancel();head()};
$('#gCl').onclick=async()=>{const seen=new Set(),d=[];cache.forEach(m=>{const k=m.uid+'|'+(m.t||'')+'|'+(m.img?m.img.length:0);if(seen.has(k))d.push(m.id);else seen.add(k)});
if(!d.length)return wait($('#gE'),'Aucun message en double.');if(!confirm(d.length+' message(s) en double seront supprimés. Continuer ?'))return;
try{const b=db.batch();d.forEach(id=>b.delete(col().doc(id)));await b.commit();wait($('#gE'),d.length+' message(s) supprimé(s).')}catch(e){wait($('#gE'),'Échec de la suppression.')}};
function members(){$('#gMb').innerHTML=(isProf()?`<div class="card gbc"><b>📢 Message ou cours pour tous</b><p class="mu">Chaque apprenant le reçoit dans sa propre boîte, sans voir les autres.</p><div class="gf"><label class="ghost" style="padding:8px 12px;cursor:pointer">📎<input id="gBf" type="file" hidden accept="image/*"></label><input id="gBi" type="text" maxlength="1000" placeholder="Texte ou légende pour tous…"><button id="gBs" type="button">Envoyer</button></div><p class="mu" id="gBe"></p></div>`:'')+((cur.membres||[]).map(u=>`<div class="card gc" data-mb="${esc(u)}"><b>${esc(lab(u))}</b><small>Ouvrir la boîte</small></div>`).join('')||'<p class="mu">Aucun apprenant dans ce groupe.</p>')}
$('#gMb').onclick=e=>{const c=e.target.closest('[data-mb]');if(c)return go('box',c.dataset.mb);if(e.target.id==='gBs')bcast()};
async function bcast(){const t=$('#gBi').value.trim(),f=$('#gBf').files[0],E=$('#gBe');if(!t&&!f)return;try{wait(E,'Envoi…');const x=f?{img:await shrink(f)}:{};const b=db.batch();
(cur.membres||[]).forEach(u=>b.set(gref().collection('boites').doc(u).collection('messages').doc(),{uid:U().uid,p:'Formateur',t:t.slice(0,1000),...x,tous:true,cree:TS()}));await b.commit();$('#gBi').value='';$('#gBf').value='';wait(E,'Envoyé à '+(cur.membres||[]).length+' apprenant(s).')}catch(e){wait(E,'Échec de l’envoi.')}}
function go(v,b){if(unM){unM();unM=null}if(window.speechSynthesis)speechSynthesis.cancel();
if(!staff()){v=md()==='ouvert'?'salon':'box';b=U().uid}
view=v;box=b||null;first=true;cache=[];pend='';$('#gPv').hidden=true;const chat=v!=='mb';$('#gMb').hidden=chat;$('#gCh').hidden=!chat;$('#gFm').hidden=isAd();$('#gSet').hidden=staff();
head();tabs();if(v==='mb')return members();if(!staff())anonTxt();
unM=col().orderBy('cree').limitToLast(100).onSnapshot(s=>{const me=U().uid;cache=s.docs.map(d=>({id:d.id,...d.data()}));
if(!first&&auto())s.docChanges().forEach(c=>{if(c.type==='added'){const m=c.doc.data();if(m.uid!==me&&m.t)say(m.t)}});first=false;
$('#gM').innerHTML=cache.map(m=>{const h=m.cree?new Date(m.cree.seconds*1e3).toLocaleTimeString('fr',{hour:'2-digit',minute:'2-digit'}):'';
return`<div class="gm ${m.uid===me?'me':''}"><b>${esc(m.p)}${isAd()&&names[m.uid]?' ('+esc(names[m.uid])+')':''}</b>${m.img?`<img src="${esc(m.img)}" alt="">`:''}${m.t?`<p>${lk(m.t)}</p>`:''}${m.f?`<a href="${esc(m.f)}" target="_blank" rel="noopener">📎 ${esc(m.fn)}</a>`:''}${m.fd?`<a href="${esc(m.fd)}" download="${esc(m.fn)}">📎 ${esc(m.fn)}</a>`:''}<div class="gma">${m.t&&m.uid!==me?`<button class="sp" type="button" data-sp="${esc(m.t)}">🔊 Écouter</button>`:''}${isAd()?`<button class="sp rd" type="button" data-del="${m.id}" title="Supprimer ce message">🗑</button>`:''}<small>${h}</small></div></div>`}).join('')||'<p class="mu">Aucun message. Écrivez le premier.</p>';$('#gM').scrollTop=1e6},()=>{$('#gM').innerHTML='<p class="mu">Messages indisponibles : mettez à jour les règles Firebase.</p>'})}
$('#gL').onclick=async e=>{const gd=e.target.closest('[data-gd]');
if(gd){e.stopPropagation();if(!confirm('Supprimer ce groupe et sa liste de membres ?'))return;try{await db.collection('groupes').doc(gd.dataset.gd).delete();await db.collection('groupes_admin').doc(gd.dataset.gd).delete().catch(()=>{})}catch(x){}return loadList()}
const m=e.target.closest('[data-md]');
if(m){e.stopPropagation();const g=list.find(x=>x.id===m.dataset.md);try{await db.collection('groupes').doc(g.id).update({mode:(g.mode||'prive')==='ouvert'?'prive':'ouvert'})}catch(x){}return loadList()}
const c=e.target.closest('[data-g]');if(!c)return;cur=list.find(g=>g.id===c.dataset.g);if(!cur)return;names={};
$('#gL').hidden=true;$('#gR').hidden=false;
if(isAd())db.collection('groupes_admin').doc(cur.id).get().then(d=>{names=d.exists?(d.data().noms||{}):{};if(cur&&view==='mb')members()}).catch(()=>{});
go(md()==='ouvert'?'salon':staff()?'mb':'box',U().uid)};
$('#gM').onclick=async e=>{const s=e.target.closest('[data-sp]'),d=e.target.closest('[data-del]');
if(s&&window.speechSynthesis){if(speechSynthesis.speaking)speechSynthesis.cancel();else say(s.dataset.sp)}
if(d&&confirm('Supprimer ce message ?')){try{await col().doc(d.dataset.del).delete()}catch(x){wait($('#gE'),'Suppression refusée.')}}};
async function send(x){const t=$('#gI').value.trim();x=x||(pend?{img:pend}:null);if(!t&&!x)return;$('#gI').value='';pend='';$('#gPv').hidden=true;await col().add({uid:U().uid,p:pseudo(),t:t.slice(0,1000),...(x||{}),cree:TS()})}
$('#gS').onclick=()=>send().catch(()=>wait($('#gE'),'Échec de l’envoi.'));$('#gI').onkeydown=e=>{if(e.key==='Enter')$('#gS').click()};
$('#gPx').onclick=()=>{pend='';$('#gPv').hidden=true};
$('#gF').onchange=async()=>{const f=$('#gF').files[0],E=$('#gE');$('#gF').value='';if(!f)return;
try{if(f.type.startsWith('image/')){wait(E,'Préparation de la photo…');pend=await shrink(f);$('#gPi').src=pend;$('#gPv').hidden=false;wait(E,'');$('#gI').focus()}
else{if(f.size>500*1024)return wait(E,'Fichier trop lourd (500 Ko maximum). Mettez-le sur Google Drive et collez le lien dans le message.');
wait(E,'Envoi du fichier…');const d=await new Promise((ok,ko)=>{const r=new FileReader();r.onload=()=>ok(r.result);r.onerror=ko;r.readAsDataURL(f)});await send({fd:d,fn:f.name.slice(0,80)});wait(E,'')}}catch(e){wait(E,'Échec de l’envoi.')}};
/* Voix transcrite : on dicte, le texte s'écrit en direct dans la zone de message */
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
if(!SR)$('#gMic').hidden=true;
$('#gMic').onclick=()=>{if(rec){rec.stop();return}const base=$('#gI').value.trim();rec=new SR();rec.lang='fr-FR';rec.interimResults=true;rec.continuous=true;
rec.onresult=e=>{let t='';for(let i=0;i<e.results.length;i++)t+=e.results[i][0].transcript;$('#gI').value=(base+' '+t).trim()};
rec.onend=()=>{rec=null;$('#gMic').classList.remove('on');$('#gRec').hidden=true};rec.onerror=()=>wait($('#gE'),'Micro indisponible : autorisez-le dans le navigateur.');
$('#gMic').classList.add('on');$('#gRec').hidden=false;rec.start()};
$('#gPs').onclick=async()=>{const p=(prompt('Votre pseudo dans ce groupe :')||'').trim().slice(0,20);if(!p)return;try{await setMine('pseudos',p);await setMine('anon',true);anonTxt()}catch(e){}};
$('#gAn').onclick=async()=>{try{await setMine('anon',cur.anon&&cur.anon[U().uid]===false);anonTxt()}catch(e){}};
// ---- côté administrateur : créer un groupe ----
async function learners(){const f=$('#gaF').value,L=$('#gaL');try{const[s,gs]=await Promise.all([db.collection('demandes').where('formation','==',f).where('statut','==','validée').get(),db.collection('groupes').where('formation','==',f).get()]);const seen={},used=new Set();gs.docs.forEach(g=>(g.data().membres||[]).forEach(u=>used.add(u)));
L.innerHTML=s.docs.map(d=>d.data()).filter(d=>d.uid&&!used.has(d.uid)&&!seen[d.uid]&&(seen[d.uid]=1)).map(d=>{const i=d.identite||{};return`<label style="display:block"><input type="checkbox" data-u="${esc(d.uid)}" data-n="${esc(d.nom||d.email||'')}" data-m="${esc(i.mode||'anonyme')}" data-s="${esc(i.surnom||'')}" checked> ${esc(d.nom||d.email||'Inscrit')}${i.mode==='visible'?' · nom visible':' · anonyme'+(i.surnom?' (« '+esc(i.surnom)+' »)':'')}</label>`}).join('')||(used.size?'Tous les apprenants validés ont déjà un groupe pour cette formation.':'Aucun inscrit validé pour cette formation.')}catch(e){L.textContent='Impossible de charger les inscrits.'}}
function fillProf(){const f=$('#gaF').value,L=(window.FMT||[]).filter(x=>(x.formations||[]).includes(f));
$('#gaP').innerHTML='<option value="">Sans formateur pour l’instant</option>'+L.map(x=>`<option value="${esc((x.email||'').toLowerCase())}">${esc(x.nom)}</option>`).join('')}
function admUI(){if(!isAd()||$('#gAdm'))return;
$('[data-p=adm]').insertAdjacentHTML('afterbegin',`<div class="card" id="gAdm"><h3>Groupes de formation</h3><label>Formation<select id="gaF">${F.map(f=>`<option>${esc(f[0])}</option>`).join('')}</select></label><label>Formateur (selon la spécialité)<select id="gaP"></select></label><b>Apprenants validés</b><div id="gaL" class="mu"></div><button id="gaC" type="button">Créer le groupe</button> <button id="gaD" class="ghost" type="button">Supprimer les groupes en double</button><p class="mu" id="gaM"></p><p class="mu">Le groupe porte le nom de la formation. Chaque apprenant reçoit une boîte privée avec le formateur. Dans l’onglet « Groupes », « Ouvrir le salon » les réunit pour une compétition, et « Revenir en privé » les isole de nouveau.</p></div>`);
$('#gaF').onchange=()=>{learners();fillProf()};learners();fillProf();addEventListener('fmt',fillProf);
let busy=false;
$('#gaC').onclick=async()=>{if(busy)return;const M=$('#gaM'),B=$('#gaC'),ch=$$('#gaL input:checked'),pe=$('#gaP').value.trim().toLowerCase(),f=$('#gaF').value;
if(!ch.length)return wait(M,'Sélectionnez au moins un apprenant.');
busy=true;B.disabled=true;wait(M,'Création en cours…');
try{const gs=await db.collection('groupes').where('formation','==',f).get(),used=new Set();gs.docs.forEach(g=>(g.data().membres||[]).forEach(u=>used.add(u)));
if(ch.some(c=>used.has(c.dataset.u))){learners();return wait(M,'Un de ces apprenants a déjà un groupe pour cette formation.')}
const membres=[],pseudos={},anon={},noms={};ch.forEach((c,i)=>{const u=c.dataset.u,vis=c.dataset.m==='visible';membres.push(u);pseudos[u]=vis?(c.dataset.n||'Apprenant '+(i+1)):(c.dataset.s||'Apprenant '+(i+1));anon[u]=!vis;noms[u]=c.dataset.n});
const ref=db.collection('groupes').doc(),b=db.batch();
b.set(ref,{formation:f,profEmail:pe,membres,pseudos,anon,mode:'prive',cree:TS()});b.set(db.collection('groupes_admin').doc(ref.id),{noms});
membres.forEach(u=>b.set(db.collection('notifs').doc(),{to:u,titre:'Nouveau groupe',texte:'Vous avez été ajouté au groupe « '+f+' ». Ouvrez l’onglet Groupes.',cree:TS()}));
await b.commit();wait(M,'Groupe créé.');learners()}
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
