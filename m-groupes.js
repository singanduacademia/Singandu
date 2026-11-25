// m-groupes.js — groupes de formation (apprenants + formateur), chat texte / photo / fichiers
(function(){
const U=()=>auth.currentUser,isAd=()=>!!U()&&U().email===ADMIN,mail=()=>((U()&&U().email)||'').toLowerCase();
let cur=null,unM=null,list=[],names={},st=null;
document.head.insertAdjacentHTML('beforeend',`<style>
.gc{cursor:pointer}.gc small{display:block;color:#667}
.gm{max-width:82%;margin:8px 0;padding:8px 12px;border-radius:14px;background:#eef2ff;word-wrap:break-word}
.gm.me{margin-left:auto;background:#fff3b0}.gm b{font-size:.8em;color:#2a3fb5}.gm p{margin:2px 0}
.gm img{max-width:100%;border-radius:10px;display:block;margin:4px 0}.gm small{color:#889;font-size:.7em;display:block}
.gm a{display:block;padding:6px 8px;background:#fff;border-radius:8px;margin:4px 0;text-decoration:none}
#gM{max-height:52vh;overflow:auto}.gf{display:flex;gap:6px;align-items:center;margin-top:8px}.gf input[type=text]{flex:1}
.gset{display:flex;gap:6px;flex-wrap:wrap}
</style>`);
$('#app .wrap').insertAdjacentHTML('beforeend',`<section class="pane" data-p="grp2"><div id="gL"></div><div id="gR" hidden>
<div class="card"><button class="ghost" id="gBk" type="button">← Retour</button> <b id="gT"></b></div>
<div class="card gset" id="gSet"><button class="ghost" id="gPs" type="button">Changer mon pseudo</button><button class="ghost" id="gAn" type="button"></button></div>
<div class="card"><div id="gM"></div><div class="gf" id="gFm"><label class="ghost" style="padding:8px 12px;cursor:pointer">📎<input id="gF" type="file" hidden accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"></label><input id="gI" type="text" maxlength="1000" placeholder="Votre message"><button id="gS" type="button">Envoyer</button></div><p class="mu" id="gE"></p></div></div></section>`);
$('#bn [data-t="nt"]').insertAdjacentHTML('beforebegin',`<button data-t="grp2" id="tGrp" type="button"><svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20a6 6 0 0112 0M15 20a5 5 0 016 0"/></svg>Groupes</button>`);
$('#tGrp').onclick=()=>{$$('.pane').forEach(p=>p.classList.toggle('on',p.dataset.p==='grp2'));$('[data-p=grp2]').hidden=false;$$('#bn button').forEach(b=>b.classList.toggle('on',b.id==='tGrp'));const t=$('#ttl');if(t)t.textContent='Groupes';back()};
const isProf=()=>!isAd()&&cur&&cur.profEmail===mail();
const pseudo=()=>{if(isProf())return'Formateur';const u=U().uid;return(cur.anon&&cur.anon[u]===false)?(user||'Apprenant'):((cur.pseudos&&cur.pseudos[u])||'Apprenant')};
const anonTxt=()=>{$('#gAn').textContent=(cur.anon&&cur.anon[U().uid]===false)?'🕶 Passer en anonyme':'🕶 Anonyme : activé (toucher pour afficher mon nom)'};
async function setMine(k,v){const u=U().uid;await db.collection('groupes').doc(cur.id).update({[k+'.'+u]:v});(cur[k]=cur[k]||{})[u]=v}
async function loadList(){const u=U();if(!u)return;try{let docs;
if(isAd())docs=(await db.collection('groupes').limit(100).get()).docs;
else{const[a,b]=await Promise.all([db.collection('groupes').where('membres','array-contains',u.uid).get(),db.collection('groupes').where('profEmail','==',mail()).get()]);const m={};[...a.docs,...b.docs].forEach(d=>m[d.id]=d);docs=Object.values(m)}
list=docs.map(d=>({id:d.id,...d.data()}));
$('#gL').innerHTML=list.map(g=>`<div class="card gc" data-g="${g.id}"><b>${esc(g.formation)}</b><small>${(g.membres||[]).length} apprenant(s)${isAd()?' · lecture seule':''}</small></div>`).join('')||'<p class="mu">Aucun groupe pour le moment. L’administration vous ajoutera à un groupe après validation de votre demande.</p>'}
catch(e){$('#gL').innerHTML='<p class="mu">Groupes indisponibles : ajoutez les règles Firebase.</p>'}}
function back(){if(unM){unM();unM=null}cur=null;$('#gR').hidden=true;$('#gL').hidden=false;loadList()}
$('#gBk').onclick=back;
$('#gL').onclick=e=>{const c=e.target.closest('[data-g]');if(!c)return;cur=list.find(g=>g.id===c.dataset.g);if(!cur)return;
$('#gL').hidden=true;$('#gR').hidden=false;$('#gT').textContent=cur.formation;$('#gFm').hidden=isAd();$('#gSet').hidden=isAd()||isProf();if(!isAd()&&!isProf())anonTxt();names={};
if(isAd())db.collection('groupes_admin').doc(cur.id).get().then(d=>{names=d.exists?(d.data().noms||{}):{}}).catch(()=>{});
unM=db.collection('groupes').doc(cur.id).collection('messages').orderBy('cree').limitToLast(100).onSnapshot(s=>{const me2=U().uid;
$('#gM').innerHTML=s.docs.map(d=>d.data()).map(m=>{const h=m.cree?new Date(m.cree.seconds*1e3).toLocaleTimeString('fr',{hour:'2-digit',minute:'2-digit'}):'';
return`<div class="gm ${m.uid===me2?'me':''}"><b>${esc(m.p)}${isAd()&&names[m.uid]?' ('+esc(names[m.uid])+')':''}</b>${m.t?`<p>${esc(m.t)}</p>`:''}${m.img?`<img src="${esc(m.img)}" alt="">`:''}${m.f?`<a href="${esc(m.f)}" target="_blank" rel="noopener">📎 ${esc(m.fn)}</a>`:''}<small>${h}</small></div>`}).join('')||'<p class="mu">Aucun message. Écrivez le premier.</p>';$('#gM').scrollTop=1e6},()=>{})};
async function send(x){const t=$('#gI').value.trim();if(!t&&!x)return;$('#gI').value='';await db.collection('groupes').doc(cur.id).collection('messages').add({uid:U().uid,p:pseudo(),t:t.slice(0,1000),...(x||{}),cree:TS()})}
$('#gS').onclick=()=>send().catch(()=>wait($('#gE'),'Échec de l’envoi.'));$('#gI').onkeydown=e=>{if(e.key==='Enter')$('#gS').click()};
$('#gF').onchange=async()=>{const f=$('#gF').files[0],E=$('#gE');$('#gF').value='';if(!f)return;
try{if(f.type.startsWith('image/')){wait(E,'Envoi de la photo…');await send({img:await shrink(f)})}
else{if(f.size>10*1048576)return wait(E,'Fichier trop lourd (10 Mo maximum).');wait(E,'Envoi du fichier…');st=st||firebase.storage();const r=st.ref(`groupes/${cur.id}/${Date.now()}-${f.name.replace(/[^\w.\-]/g,'_')}`);await r.put(f);await send({f:await r.getDownloadURL(),fn:f.name})}wait(E,'')}catch(e){wait(E,'Échec de l’envoi.')}};
$('#gPs').onclick=async()=>{const p=(prompt('Votre pseudo dans ce groupe :')||'').trim().slice(0,20);if(!p)return;try{await setMine('pseudos',p);await setMine('anon',true);anonTxt()}catch(e){}};
$('#gAn').onclick=async()=>{try{await setMine('anon',cur.anon&&cur.anon[U().uid]===false);anonTxt()}catch(e){}};
// ---- côté administrateur : créer un groupe ----
async function learners(){const f=$('#gaF').value,L=$('#gaL');try{const s=await db.collection('demandes').where('formation','==',f).where('statut','==','validée').get();const seen={};
L.innerHTML=s.docs.map(d=>d.data()).filter(d=>d.uid&&!seen[d.uid]&&(seen[d.uid]=1)).map(d=>`<label style="display:block"><input type="checkbox" data-u="${esc(d.uid)}" data-n="${esc(d.nom||d.email||'')}" checked> ${esc(d.nom||d.email||'Inscrit')}</label>`).join('')||'Aucun inscrit validé pour cette formation.'}catch(e){L.textContent='Impossible de charger les inscrits.'}}
function fillProf(){const f=$('#gaF').value,L=(window.FMT||[]).filter(x=>(x.formations||[]).includes(f));
$('#gaP').innerHTML='<option value="">Sans formateur pour l’instant</option>'+L.map(x=>`<option value="${esc((x.email||'').toLowerCase())}">${esc(x.nom)}</option>`).join('')}
function admUI(){if(!isAd()||$('#gAdm'))return;
$('[data-p=adm]').insertAdjacentHTML('afterbegin',`<div class="card" id="gAdm"><h3>Groupes de formation</h3><label>Formation<select id="gaF">${F.map(f=>`<option>${esc(f[0])}</option>`).join('')}</select></label><label>Formateur (selon la spécialité)<select id="gaP"></select></label><b>Apprenants validés</b><div id="gaL" class="mu"></div><button id="gaC" type="button">Créer le groupe</button><p class="mu" id="gaM"></p><p class="mu">Les groupes créés apparaissent dans l’onglet « Groupes » (lecture seule pour vous, sans que les membres vous voient).</p></div>`);
$('#gaF').onchange=()=>{learners();fillProf()};learners();fillProf();addEventListener('fmt',fillProf);
$('#gaC').onclick=async()=>{const M=$('#gaM'),ch=$$('#gaL input:checked'),pe=$('#gaP').value.trim().toLowerCase(),f=$('#gaF').value;
if(!ch.length)return wait(M,'Sélectionnez au moins un apprenant.');
const membres=[],pseudos={},anon={},noms={};ch.forEach((c,i)=>{const u=c.dataset.u;membres.push(u);pseudos[u]='Apprenant '+(i+1);anon[u]=true;noms[u]=c.dataset.n});
try{const g=await db.collection('groupes').add({formation:f,profEmail:pe,membres,pseudos,anon,cree:TS()});await db.collection('groupes_admin').doc(g.id).set({noms});
await Promise.all(membres.map(u=>db.collection('notifs').add({to:u,titre:'Nouveau groupe',texte:'Vous avez été ajouté au groupe « '+f+' ». Ouvrez l’onglet Groupes.',cree:TS()})));
wait(M,'Groupe créé.')}catch(e){wait(M,'Échec : vérifiez les règles Firebase.')}}}
auth.onAuthStateChanged(u=>{if(u)admUI()});
})();
