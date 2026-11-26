// m-groupes.js — groupes de formation : boîtes privées (formateur ↔ apprenant), salon ouvert, images, voix
(function(){
const U=()=>auth.currentUser,isAd=()=>!!U()&&U().email===ADMIN,mail=()=>((U()&&U().email)||'').toLowerCase();
let cur=null,unM=null,list=[],names={},view='salon',box=null;
document.head.insertAdjacentHTML('beforeend',`<style>
.gc{cursor:pointer}.gc small{display:block;color:#667}
.gm{max-width:82%;margin:8px 0;padding:8px 12px;border-radius:14px;background:#eef2ff;word-wrap:break-word}
.gm.me{margin-left:auto;background:#fff3b0}.gm b{font-size:.8em;color:#2a3fb5}.gm p{margin:2px 0}
.gm img{max-width:100%;border-radius:10px;display:block;margin:4px 0}.gm small{color:#889;font-size:.7em;display:block}
.gm a{display:block;padding:6px 8px;background:#fff;border-radius:8px;margin:4px 0;text-decoration:none}.gm a.gb{display:inline-block;background:#1b2a8a;color:#fff;padding:8px 14px;border-radius:20px;font-weight:600;margin:4px 0}
.gm .sp{border:0;background:#fff;border-radius:12px;padding:2px 8px;cursor:pointer;margin-top:4px}
#gM{max-height:52vh;overflow:auto}.gf{display:flex;gap:6px;align-items:center;margin-top:8px}.gf input[type=text]{flex:1}
.gset{display:flex;gap:6px;flex-wrap:wrap}.gset .ghost.on,#gMic.on{background:#1b2a8a;color:#fff}
.gmd{float:right;font-size:.8em;padding:4px 10px}.gbc{margin-bottom:10px}
</style>`);
$('#app .wrap').insertAdjacentHTML('beforeend',`<section class="pane" data-p="grp2"><div id="gL"></div><div id="gR" hidden>
<div class="card"><button class="ghost" id="gBk" type="button">← Retour</button> <b id="gT"></b><div class="gset" id="gTb" style="margin-top:8px"></div></div>
<div id="gMb" hidden></div>
<div id="gCh"><div class="card gset" id="gSet"><button class="ghost" id="gPs" type="button">Changer mon pseudo</button><button class="ghost" id="gAn" type="button"></button></div>
<div class="card"><div id="gM"></div><div class="gf" id="gFm"><label class="ghost" style="padding:8px 12px;cursor:pointer">📎<input id="gF" type="file" hidden accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"></label><button class="ghost" id="gMic" type="button" title="Dicter">🎤</button><input id="gI" type="text" maxlength="1000" placeholder="Message ou lien (Drive, YouTube…)"><button id="gS" type="button">Envoyer</button></div><p class="mu" id="gE"></p></div></div></div></section>`);
$('#bn [data-t="nt"]').insertAdjacentHTML('beforebegin',`<button data-t="grp2" id="tGrp" type="button"><svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20a6 6 0 0112 0M15 20a5 5 0 016 0"/></svg>Groupes</button>`);
$('#tGrp').onclick=()=>{$$('.pane').forEach(p=>p.classList.toggle('on',p.dataset.p==='grp2'));$('[data-p=grp2]').hidden=false;$$('#bn button').forEach(b=>b.classList.toggle('on',b.id==='tGrp'));const t=$('#ttl');if(t)t.textContent='Groupes';back()};
const lb=u=>/youtu|facebook|fb\.watch|vimeo/.test(u)?'▶ Voir la vidéo':/drive\.google|docs\.google|dropbox|onedrive|1drv/.test(u)?'📄 Ouvrir le document':'🔗 Ouvrir le lien';
const lk=t=>esc(t).replace(/(https?:\/\/[^\s<]+)/g,u=>`<a class="gb" href="${u}" target="_blank" rel="noopener noreferrer">${lb(u)}</a>`);
const isProf=()=>!isAd()&&cur&&cur.profEmail===mail(),staff=()=>isAd()||isProf(),md=()=>(cur&&cur.mode)||'ouvert';
const gref=()=>db.collection('groupes').doc(cur.id);
const col=()=>view==='salon'?gref().collection('messages'):gref().collection('boites').doc(box).collection('messages');
const lab=u=>{const i=(cur.membres||[]).indexOf(u);return((cur.pseudos&&cur.pseudos[u])||'Apprenant '+(i+1))+(isAd()&&names[u]?' ('+names[u]+')':'')};
const pseudo=()=>{if(isProf())return'Formateur';const u=U().uid;return(cur.anon&&cur.anon[u]===false)?(user||'Apprenant'):((cur.pseudos&&cur.pseudos[u])||'Apprenant')};
const anonTxt=()=>{$('#gAn').textContent=(cur.anon&&cur.anon[U().uid]===false)?'🕶 Passer en anonyme':'🕶 Anonyme : activé (toucher pour afficher mon nom)'};
async function setMine(k,v){const u=U().uid;await gref().update({[k+'.'+u]:v});(cur[k]=cur[k]||{})[u]=v}
async function loadList(){const u=U();if(!u)return;try{let docs;
if(isAd())docs=(await db.collection('groupes').limit(100).get()).docs;
else{const[a,b]=await Promise.all([db.collection('groupes').where('membres','array-contains',u.uid).get(),db.collection('groupes').where('profEmail','==',mail()).get()]);const m={};[...a.docs,...b.docs].forEach(d=>m[d.id]=d);docs=Object.values(m)}
list=docs.map(d=>({id:d.id,...d.data()}));
$('#gL').innerHTML=list.map(g=>`<div class="card gc" data-g="${g.id}">${isAd()?`<button class="ghost gmd" data-md="${g.id}" type="button">${(g.mode||'ouvert')==='ouvert'?'Revenir en privé':'Ouvrir le salon'}</button>`:''}<b>${esc(g.formation)}</b><small>${(g.membres||[]).length} apprenant(s) · ${(g.mode||'ouvert')==='ouvert'?'🏆 salon ouvert':'🔒 boîtes privées'}${isAd()?' · lecture seule':''}</small></div>`).join('')||'<p class="mu">Aucun groupe pour le moment. L’administration vous ajoutera à un groupe après validation de votre demande.</p>'}
catch(e){$('#gL').innerHTML='<p class="mu">Groupes indisponibles : ajoutez les règles Firebase.</p>'}}
function back(){if(unM){unM();unM=null}cur=null;$('#gR').hidden=true;$('#gL').hidden=false;loadList()}
$('#gBk').onclick=()=>{if(cur&&staff()&&view==='box')go('mb');else back()};
function tabs(){const t=[];if(md()==='ouvert')t.push(['salon','💬 Salon commun']);t.push(staff()?['mb','📥 Boîtes des apprenants']:['box','📥 Ma boîte']);
const act=staff()&&view==='box'?'mb':view;$('#gTb').innerHTML=t.length>1?t.map(x=>`<button class="ghost${x[0]===act?' on':''}" data-tb="${x[0]}" type="button">${x[1]}</button>`).join(''):''}
$('#gTb').onclick=e=>{const b=e.target.closest('[data-tb]');if(b)go(b.dataset.tb,b.dataset.tb==='box'?U().uid:null)};
function members(){$('#gMb').innerHTML=(isProf()?`<div class="card gbc"><b>📢 Message ou cours pour tous</b><p class="mu">Chaque apprenant le reçoit dans sa propre boîte, sans voir les autres.</p><div class="gf"><label class="ghost" style="padding:8px 12px;cursor:pointer">📎<input id="gBf" type="file" hidden accept="image/*"></label><input id="gBi" type="text" maxlength="1000" placeholder="Écrivez pour tous les apprenants…"><button id="gBs" type="button">Envoyer</button></div><p class="mu" id="gBe"></p></div>`:'')+((cur.membres||[]).map(u=>`<div class="card gc" data-mb="${esc(u)}"><b>${esc(lab(u))}</b><small>Ouvrir la boîte</small></div>`).join('')||'<p class="mu">Aucun apprenant dans ce groupe.</p>')}
$('#gMb').onclick=e=>{const c=e.target.closest('[data-mb]');if(c)return go('box',c.dataset.mb);if(e.target.id==='gBs')bcast()};
async function bcast(){const t=$('#gBi').value.trim(),f=$('#gBf').files[0],E=$('#gBe');if(!t&&!f)return;try{wait(E,'Envoi…');const x=f?{img:await shrink(f)}:{};const b=db.batch();
(cur.membres||[]).forEach(u=>b.set(gref().collection('boites').doc(u).collection('messages').doc(),{uid:U().uid,p:'Formateur',t:t.slice(0,1000),...x,tous:true,cree:TS()}));await b.commit();$('#gBi').value='';$('#gBf').value='';wait(E,'Envoyé à '+(cur.membres||[]).length+' apprenant(s).')}catch(e){wait(E,'Échec de l’envoi.')}}
function go(v,b){if(unM){unM();unM=null}view=v;box=b||null;const chat=v!=='mb';$('#gMb').hidden=chat;$('#gCh').hidden=!chat;$('#gFm').hidden=isAd();$('#gSet').hidden=staff();
$('#gT').textContent=cur.formation+(v==='box'?' · '+(staff()?lab(b):'Ma boîte'):v==='mb'?' · Boîtes':md()==='ouvert'?' · Salon':'');tabs();if(v==='mb')return members();if(!staff())anonTxt();
unM=col().orderBy('cree').limitToLast(100).onSnapshot(s=>{const me=U().uid;
$('#gM').innerHTML=s.docs.map(d=>d.data()).map(m=>{const h=m.cree?new Date(m.cree.seconds*1e3).toLocaleTimeString('fr',{hour:'2-digit',minute:'2-digit'}):'';
return`<div class="gm ${m.uid===me?'me':''}"><b>${esc(m.p)}${isAd()&&names[m.uid]?' ('+esc(names[m.uid])+')':''}</b>${m.t?`<p>${lk(m.t)}</p>`:''}${m.img?`<img src="${esc(m.img)}" alt="">`:''}${m.f?`<a href="${esc(m.f)}" target="_blank" rel="noopener">📎 ${esc(m.fn)}</a>`:''}${m.fd?`<a href="${esc(m.fd)}" download="${esc(m.fn)}">📎 ${esc(m.fn)}</a>`:''}${isProf()&&m.uid!==me&&m.t?`<button class="sp" type="button" data-sp="${esc(m.t)}">🔊 Écouter</button>`:''}<small>${h}</small></div>`}).join('')||'<p class="mu">Aucun message. Écrivez le premier.</p>';$('#gM').scrollTop=1e6},()=>{$('#gM').innerHTML='<p class="mu">Messages indisponibles : mettez à jour les règles Firebase.</p>'})}
$('#gL').onclick=async e=>{const m=e.target.closest('[data-md]');
if(m){e.stopPropagation();const g=list.find(x=>x.id===m.dataset.md);try{await db.collection('groupes').doc(g.id).update({mode:(g.mode||'ouvert')==='ouvert'?'prive':'ouvert'})}catch(x){}return loadList()}
const c=e.target.closest('[data-g]');if(!c)return;cur=list.find(g=>g.id===c.dataset.g);if(!cur)return;names={};
$('#gL').hidden=true;$('#gR').hidden=false;
if(isAd())db.collection('groupes_admin').doc(cur.id).get().then(d=>{names=d.exists?(d.data().noms||{}):{};if(cur&&view==='mb')members()}).catch(()=>{});
go(md()==='ouvert'?'salon':staff()?'mb':'box',U().uid)};
$('#gM').onclick=e=>{const s=e.target.closest('[data-sp]');if(s&&window.speechSynthesis){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(s.dataset.sp);u.lang='fr-FR';speechSynthesis.speak(u)}};
async function send(x){const t=$('#gI').value.trim();if(!t&&!x)return;$('#gI').value='';await col().add({uid:U().uid,p:pseudo(),t:t.slice(0,1000),...(x||{}),cree:TS()})}
$('#gS').onclick=()=>send().catch(()=>wait($('#gE'),'Échec de l’envoi.'));$('#gI').onkeydown=e=>{if(e.key==='Enter')$('#gS').click()};
$('#gF').onchange=async()=>{const f=$('#gF').files[0],E=$('#gE');$('#gF').value='';if(!f)return;
try{if(f.type.startsWith('image/')){wait(E,'Envoi de l’image…');await send({img:await shrink(f)})}
else{if(f.size>500*1024)return wait(E,'Fichier trop lourd (500 Ko maximum). Mettez-le sur Google Drive et collez le lien dans le message.');
wait(E,'Envoi du fichier…');const d=await new Promise((ok,ko)=>{const r=new FileReader();r.onload=()=>ok(r.result);r.onerror=ko;r.readAsDataURL(f)});await send({fd:d,fn:f.name.slice(0,80)})}wait(E,'')}catch(e){wait(E,'Échec de l’envoi.')}};
/* Voix transcrite : on dicte, le texte apparaît dans la zone de message */
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;let rec=null;
if(!SR)$('#gMic').hidden=true;
$('#gMic').onclick=()=>{if(rec){rec.stop();return}rec=new SR();rec.lang='fr-FR';rec.interimResults=false;rec.onresult=e=>{$('#gI').value=($('#gI').value+' '+e.results[0][0].transcript).trim()};rec.onend=()=>{rec=null;$('#gMic').classList.remove('on')};rec.onerror=()=>wait($('#gE'),'Micro indisponible : autorisez-le dans le navigateur.');$('#gMic').classList.add('on');rec.start()};
$('#gPs').onclick=async()=>{const p=(prompt('Votre pseudo dans ce groupe :')||'').trim().slice(0,20);if(!p)return;try{await setMine('pseudos',p);await setMine('anon',true);anonTxt()}catch(e){}};
$('#gAn').onclick=async()=>{try{await setMine('anon',cur.anon&&cur.anon[U().uid]===false);anonTxt()}catch(e){}};
// ---- côté administrateur : créer un groupe ----
async function learners(){const f=$('#gaF').value,L=$('#gaL');try{const s=await db.collection('demandes').where('formation','==',f).where('statut','==','validée').get();const seen={};
L.innerHTML=s.docs.map(d=>d.data()).filter(d=>d.uid&&!seen[d.uid]&&(seen[d.uid]=1)).map(d=>{const i=d.identite||{};return`<label style="display:block"><input type="checkbox" data-u="${esc(d.uid)}" data-n="${esc(d.nom||d.email||'')}" data-m="${esc(i.mode||'anonyme')}" data-s="${esc(i.surnom||'')}" checked> ${esc(d.nom||d.email||'Inscrit')}${i.mode==='visible'?' · nom visible':' · anonyme'+(i.surnom?' (« '+esc(i.surnom)+' »)':'')}</label>`}).join('')||'Aucun inscrit validé pour cette formation.'}catch(e){L.textContent='Impossible de charger les inscrits.'}}
function fillProf(){const f=$('#gaF').value,L=(window.FMT||[]).filter(x=>(x.formations||[]).includes(f));
$('#gaP').innerHTML='<option value="">Sans formateur pour l’instant</option>'+L.map(x=>`<option value="${esc((x.email||'').toLowerCase())}">${esc(x.nom)}</option>`).join('')}
function admUI(){if(!isAd()||$('#gAdm'))return;
$('[data-p=adm]').insertAdjacentHTML('afterbegin',`<div class="card" id="gAdm"><h3>Groupes de formation</h3><label>Formation<select id="gaF">${F.map(f=>`<option>${esc(f[0])}</option>`).join('')}</select></label><label>Formateur (selon la spécialité)<select id="gaP"></select></label><b>Apprenants validés</b><div id="gaL" class="mu"></div><button id="gaC" type="button">Créer le groupe</button><p class="mu" id="gaM"></p><p class="mu">Le groupe porte le nom de la formation. Chaque apprenant reçoit une boîte privée avec le formateur. Dans l’onglet « Groupes », « Ouvrir le salon » les réunit pour une compétition, et « Revenir en privé » les isole de nouveau.</p></div>`);
$('#gaF').onchange=()=>{learners();fillProf()};learners();fillProf();addEventListener('fmt',fillProf);
$('#gaC').onclick=async()=>{const M=$('#gaM'),ch=$$('#gaL input:checked'),pe=$('#gaP').value.trim().toLowerCase(),f=$('#gaF').value;
if(!ch.length)return wait(M,'Sélectionnez au moins un apprenant.');
const membres=[],pseudos={},anon={},noms={};ch.forEach((c,i)=>{const u=c.dataset.u,vis=c.dataset.m==='visible';membres.push(u);pseudos[u]=vis?(c.dataset.n||'Apprenant '+(i+1)):(c.dataset.s||'Apprenant '+(i+1));anon[u]=!vis;noms[u]=c.dataset.n});
try{const g=await db.collection('groupes').add({formation:f,profEmail:pe,membres,pseudos,anon,mode:'prive',cree:TS()});await db.collection('groupes_admin').doc(g.id).set({noms});
await Promise.all(membres.map(u=>db.collection('notifs').add({to:u,titre:'Nouveau groupe',texte:'Vous avez été ajouté au groupe « '+f+' ». Ouvrez l’onglet Groupes.',cree:TS()})));
wait(M,'Groupe créé.')}catch(e){wait(M,'Échec : vérifiez les règles Firebase.')}}}
auth.onAuthStateChanged(u=>{if(u)admUI()});
})();
