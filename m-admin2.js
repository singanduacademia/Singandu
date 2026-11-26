// m-admin2.js — admin en onglets, demandes/inscrits propres, conseils discrets (bannière « Conseil Singandu »)
(function(){
let ETU=[],GR=[],FM={},unC=null,cibleF=null,FD='att',gu=null;
document.head.insertAdjacentHTML('beforeend',`<style>
#aT{display:flex;gap:6px;overflow-x:auto;padding:4px 0 10px;position:sticky;top:0;background:var(--bg,#fff);z-index:3}
#aT button{white-space:nowrap;border-radius:20px;padding:8px 14px;background:#eef2ff;color:#1b2a8a;border:0}
#aT button.on{background:#1b2a8a;color:#fff}#aT i{font-style:normal;background:#e5322d;color:#fff;border-radius:10px;padding:0 6px;margin-left:4px;font-size:.8em}
.ap[hidden]{display:none}.dq,.ir{display:flex;gap:10px;align-items:center;justify-content:space-between;padding:10px;border-radius:12px;background:#f4f6ff;margin:8px 0}
.dq.pend{background:#fff8d6}.dq small,.ir small{display:block;color:#667;font-size:.8em;word-break:break-all}.dqa{display:flex;flex-direction:column;gap:4px;align-items:flex-end}
.bg{font-size:.75em;border-radius:10px;padding:2px 8px;background:#e5e5e5}.bg.w{background:#ffd400}.bg.o{background:#c8f5d8}.bg.n{background:#ffd5d5}
.ir>div{flex:1;min-width:0}#cbn{position:fixed;left:12px;right:12px;top:-120px;z-index:99;background:#1b2a8a;color:#fff;border-radius:16px;padding:12px 14px;box-shadow:0 8px 24px rgba(0,0,0,.3);transition:top .5s}
#cbn.on{top:12px}#cbn small{opacity:.8;display:block}
#dfT{display:flex;gap:6px;margin:6px 0}#dfT button{border-radius:20px;padding:7px 14px;background:#eef2ff;color:#1b2a8a;border:0}#dfT .on{background:#1b2a8a;color:#fff}.ir{flex-wrap:wrap}.ir .ghost{padding:6px 10px;font-size:.8em}
.dd{margin-top:6px}.dd summary{cursor:pointer;color:#1b2a8a;font-size:.85em}.dd ul{margin:6px 0;padding-left:18px;font-size:.85em}.dd p{font-size:.85em;margin:6px 0;white-space:pre-wrap}
</style>`);
// ---- 1. onglets ----
const P=$('[data-p=adm]'),card=s=>{const e=$(s);return e&&e.closest('.card')};
const tabs=[['dem','Demandes'],['ins','Inscrits'],['grp','Groupes'],['for','Formations'],['avis','Avis'],['con','Conseils'],['site','Site'],['ast','Assistant']];
P.insertAdjacentHTML('afterbegin','<div id="aT">'+tabs.map(t=>`<button type="button" data-at="${t[0]}">${t[1]}<i hidden></i></button>`).join('')+'</div>'+tabs.map(t=>`<div class="ap" data-ap="${t[0]}" hidden></div>`).join(''));
const pn=k=>P.querySelector(`[data-ap=${k}]`);
[['dem','#rq'],['ins','#ins'],['site','#bPub'],['site','#bNo'],['site','#bSj'],['ast','#bSa']].forEach(([k,s])=>{const c=card(s);if(c)pn(k).append(c)});
pn('con').innerHTML=`<div class="card"><h3>Conseil discret</h3><p class="mu">Le destinataire voit « Conseil Singandu » : aucun nom d’administrateur n’apparaît.</p><label>Destinataire<select id="cT"><option value="">Chargement…</option></select></label><label>Conseil<textarea id="cX" maxlength="400" placeholder="Ex. : Pensez à faire des pauses plus courtes et à reformuler chaque leçon avec vos mots."></textarea></label><button id="cSend" type="button">Envoyer</button><p class="mu" id="cM"></p></div>`;
const iq=document.createElement('input');iq.id='iq';iq.placeholder='Rechercher un inscrit…';$('#ins').before(iq);iq.oninput=rnIns;
function tab(k){$$('#aT button').forEach(b=>b.classList.toggle('on',b.dataset.at===k));$$('.ap').forEach(p=>p.hidden=p.dataset.ap!==k);place()}
$('#aT').onclick=e=>{const b=e.target.closest('[data-at]');if(b)tab(b.dataset.at)};tab('dem');
function place(){const g=$('#gAdm');if(g&&!g.closest('.ap'))pn('grp').append(g)}
// ---- 2. demandes ----
const det=d=>{const r=(d.reponses||[]).map(x=>`<li>${esc(x.q)} <b>${esc(x.r)}</b></li>`).join(''),i=d.identite||{};return(r||d.presentation||d.photo)?`<details class="dd"><summary>Voir la demande</summary>${d.photo?`<img class="av" src="${esc(d.photo)}" alt="">`:''}<small>Dans les groupes : ${i.mode==='anonyme'?'anonyme'+(i.surnom?' · surnom « '+esc(i.surnom)+' »':''):'nom visible'}</small><ul>${r}</ul>${d.presentation?`<p>${esc(d.presentation)}</p>`:''}</details>`:''};
// prix promotionnel saisi au moment de valider (capté avant le gestionnaire existant)
document.addEventListener('click',e=>{const b=e.target.closest('[data-v="1"]');if(!b)return;const v=prompt('Prix promotionnel en $ (laissez vide s’il n’y a pas de promotion). Annuler = ne pas valider.');
if(v===null){e.stopImmediatePropagation();e.preventDefault();return}b.disabled=true;const n=parseFloat(String(v).replace(',','.'));if(n>0)db.collection('demandes').doc(b.dataset.r).update({prixPromo:n}).catch(()=>{})},true);
async function loadAdm(){place();let n=0;if(!$('#dfT')){$('#rq').insertAdjacentHTML('beforebegin','<div id="dfT"><button class="on" data-df="att" type="button">En attente</button><button data-df="tr" type="button">Traitées</button></div>');$('#dfT').onclick=e=>{const b=e.target.closest('[data-df]');if(!b)return;FD=b.dataset.df;$$('#dfT button').forEach(x=>x.classList.toggle('on',x===b));loadAdm()}}try{const s=await db.collection('demandes').limit(100).get();
const a=s.docs.map(d=>({id:d.id,...d.data()})).sort((x,y)=>(x.statut==='en attente'?0:1)-(y.statut==='en attente'?0:1)||(y.cree?.seconds||0)-(x.cree?.seconds||0));
n=a.filter(d=>d.statut==='en attente').length;$('#rq').innerHTML=a.filter(d=>FD==='tr'?d.statut!=='en attente':d.statut==='en attente').map(d=>{const p=d.statut==='en attente';const a2=`data-r="${d.id}" data-u="${esc(d.uid)}" data-f="${esc(d.formation)}"`;
return`<div class="dq ${p?'pend':''}"><div><b>${esc(d.nom)}</b><small style="font-size:.92em;color:#1b2a8a;font-weight:700">🎓 ${esc(d.formation)}${d.prix?' · '+d.prix+' $':''}</small><small>${esc(d.email||'')} ${esc(d.tel||'')}</small>${d.note?`<small>${esc(d.note)}</small>`:''}${det(d)}</div><div class="dqa"><span class="bg ${p?'w':d.statut==='validée'?'o':'n'}">${esc(d.statut)}</span>${p?`<button ${a2} data-v="1">Valider</button><button class="ghost" ${a2} data-v="0">Refuser</button>`:''}</div></div>`}).join('')||`<p class="mu">${FD==='tr'?'Aucune demande traitée.':'Aucune demande en attente.'}</p>`}catch(e){}
const i=$('#aT [data-at=dem] i');i.textContent=n;i.hidden=!n;
if(typeof loadAs==='function')try{loadAs()}catch(e){}
loadIns();loadSent();loadGR();loadCat();loadAvis()}
window.loadAdm=loadAdm;
// ---- 3. inscrits ----
async function loadIns(){try{const s=await db.collection('etudiants').limit(300).get();ETU=s.docs.map(d=>({uid:d.id,...d.data()})).sort((a,b)=>(b.vu?.seconds||0)-(a.vu?.seconds||0));try{const f=await db.collection('formateurs').get();FM={};f.docs.forEach(d=>FM[d.id]=d.data());window.FMT=f.docs.map(d=>({uid:d.id,...d.data()}));dispatchEvent(new Event('fmt'))}catch(e){}$('#ncnt').textContent='('+ETU.length+')';rnIns();fillT()}catch(e){$('#ins').innerHTML='<p class="mu">Liste indisponible.</p>'}}
function rnIns(){const q=iq.value.toLowerCase();$('#ins').innerHTML=ETU.filter(e=>((e.nom||'')+' '+(e.email||'')).toLowerCase().includes(q)).map(e=>`<div class="ir">${e.photo?`<img class="av" src="${esc(e.photo)}" alt="">`:`<span class="av">${esc((e.nom||'?')[0].toUpperCase())}</span>`}<div><b>${esc(e.nom)}</b><small>${esc(e.email)}</small>${FM[e.uid]?`<small>🎓 ${esc((FM[e.uid].formations||[]).join(', '))}</small>`:''}</div><button class="ghost" data-fm="${esc(e.uid)}" type="button">${FM[e.uid]?'Formateur ✓':'Formateur'}</button><button class="ghost" data-gu="${esc(e.uid)}" type="button">Gérer</button><button class="ghost" data-cs="${esc(e.uid)}" type="button">Conseil</button></div>`).join('')||'<p class="mu">Aucun inscrit trouvé.</p>'}
document.body.insertAdjacentHTML('beforeend','<dialog id="dFm" style="border-radius:16px;max-width:92vw"><h3 id="fmN"></h3><p class="mu">Cochez les formations qu’il peut enseigner :</p><div id="fmL"></div><div class="modes" style="margin-top:12px"><button id="fmS" type="button">Enregistrer</button><button id="fmR" class="ghost" type="button">Retirer le statut</button><button id="fmC" class="ghost" type="button">Annuler</button></div><p class="mu" id="fmM"></p></dialog>');
$('#fmC').onclick=()=>$('#dFm').close();
$('#fmS').onclick=async()=>{const fo=$$('#fmL input:checked').map(i=>i.value);if(!fo.length)return wait($('#fmM'),'Cochez au moins une formation.');try{await db.collection('formateurs').doc(cibleF.uid).set({nom:cibleF.nom||'',email:cibleF.email||'',formations:fo,cree:TS()});$('#dFm').close();loadIns()}catch(e){wait($('#fmM'),'Échec : ajoutez la règle « formateurs ».')}};
$('#fmR').onclick=async()=>{try{await db.collection('formateurs').doc(cibleF.uid).delete();$('#dFm').close();loadIns()}catch(e){wait($('#fmM'),'Échec.')}};
$('#ins').onclick=e=>{const f=e.target.closest('[data-fm]');if(f){cibleF=ETU.find(x=>x.uid===f.dataset.fm);if(!cibleF)return;const cur=(FM[cibleF.uid]||{}).formations||[];$('#fmN').textContent=cibleF.nom||cibleF.email;$('#fmM').textContent='';$('#fmL').innerHTML=F.map(x=>`<label style="display:block"><input type="checkbox" value="${esc(x[0])}" ${cur.includes(x[0])?'checked':''}> ${esc(x[0])}</label>`).join('');$('#dFm').showModal();return}
const b=e.target.closest('[data-cs]');if(!b)return;tab('con');$('#cT').value=b.dataset.cs;$('#cX').focus()};
async function loadSent(){try{const s=await db.collection('notifs').where('to','==','all').limit(8).get();$('#nsent').innerHTML=s.docs.map(d=>d.data()).sort((a,b)=>(b.cree?.seconds||0)-(a.cree?.seconds||0)).map(x=>`<p class="mu">• ${esc(x.titre)} : ${esc(x.texte)}</p>`).join('')}catch(e){}}
// ---- 4. conseils ----
async function loadGR(){try{GR=(await db.collection('groupes').limit(100).get()).docs.map(d=>({id:d.id,...d.data()}));fillT()}catch(e){}}
function fillT(){const v=$('#cT').value;$('#cT').innerHTML='<option value="">Choisir…</option>'+(GR.length?'<optgroup label="Groupes">'+GR.map(g=>`<option value="g:${g.id}">Groupe : ${esc(g.formation)} (${(g.membres||[]).length})</option>`).join('')+'</optgroup>':'')+'<optgroup label="Personnes">'+ETU.map(e=>`<option value="${esc(e.uid)}">${esc(e.nom)}</option>`).join('')+'</optgroup>';$('#cT').value=v}
$('#cSend').onclick=async()=>{const M=$('#cM'),t=$('#cX').value.trim(),v=$('#cT').value;if(!t||!v)return wait(M,'Choisissez un destinataire et écrivez le conseil.');
let to=[v];if(v.startsWith('g:')){const g=GR.find(x=>x.id===v.slice(2));to=[...(g.membres||[])];const p=ETU.find(e=>(e.email||'').toLowerCase()===g.profEmail);if(p)to.push(p.uid)}
try{await Promise.all(to.map(u=>db.collection('notifs').add({to:u,titre:'💡 Conseil Singandu',texte:t.slice(0,400),conseil:true,cree:TS()})));$('#cX').value='';wait(M,'Conseil envoyé à '+to.length+' personne(s).')}catch(e){wait(M,'Échec de l’envoi.')}};
// ---- 5. bannière côté destinataire ----
document.body.insertAdjacentHTML('beforeend','<div id="cbn" role="status"></div>');
let tm;function banner(c){const b=$('#cbn');b.innerHTML=`<b>${esc(c.titre||'💡 Conseil Singandu')}</b><small>${esc(c.texte||'')}</small>`;b.classList.add('on');clearTimeout(tm);tm=setTimeout(()=>b.classList.remove('on'),9000)}
$('#cbn').onclick=()=>{$('#cbn').classList.remove('on');show('nt')};
auth.onAuthStateChanged(u=>{if(unC){unC();unC=null}if(!u)return;let first=true;
unC=db.collection('notifs').where('to','==',u.uid).where('conseil','==',true).onSnapshot(s=>{if(first){first=false;return}s.docChanges().forEach(c=>{if(c.type==='added')banner(c.doc.data())});loadND&&loadND()},()=>{})});

// ---- gestion d'un inscrit : attribuer, valider, refuser, révoquer une formation ----
document.body.insertAdjacentHTML('beforeend','<dialog id="dGu" style="border-radius:16px;max-width:92vw;width:420px"><h3 id="guN"></h3><div id="guL"></div><b>Attribuer une formation</b><label>Formation<select id="guF">'+F.map(f=>`<option>${esc(f[0])}</option>`).join('')+'</select></label><label>Prix promotionnel en $ <small>(facultatif)</small><input id="guP" inputmode="decimal"></label><div class="modes" style="margin-top:10px"><button id="guA" type="button">Attribuer</button><button id="guC" class="ghost" type="button">Fermer</button></div><p class="mu" id="guM"></p></dialog>');
const nt=(u,titre,texte)=>db.collection('notifs').add({to:u,titre,texte,cree:TS()}).catch(()=>{});
async function guLoad(){const L=$('#guL');try{const s=await db.collection('demandes').where('uid','==',gu.uid).get();const a=s.docs.map(d=>({id:d.id,...d.data()})).sort((x,y)=>(y.cree?.seconds||0)-(x.cree?.seconds||0)),av=((await db.collection('avancement').doc(gu.uid).get().catch(()=>null))||{data:()=>({})}).data()||{};
L.innerHTML=a.map(d=>{const t=`data-id="${d.id}" data-f="${esc(d.formation)}"`,st=d.statut;return`<div class="dq"><div><b>${esc(d.formation)}</b><small>${esc(st)}</small></div><div class="dqa">${st==='en attente'?`<button ${t} data-ga="valider">Valider</button><button class="ghost" ${t} data-ga="refuser">Refuser</button>`:st==='validée'?`<input type="number" min="0" max="100" value="${+av[slug(d.formation)]||0}" style="width:58px" title="Progression en %"><button class="ghost" ${t} data-ga="prog">%</button><button class="ghost" ${t} data-ga="revoquer">Révoquer</button>`:`<button class="ghost" ${t} data-ga="valider">Rétablir</button>`}</div></div>`}).join('')||'<p class="mu">Aucune formation pour le moment.</p>'}catch(e){L.textContent='Liste indisponible.'}}
$('#ins').addEventListener('click',e=>{const b=e.target.closest('[data-gu]');if(!b)return;gu=ETU.find(x=>x.uid===b.dataset.gu);if(!gu)return;$('#guN').textContent=gu.nom||gu.email;$('#guM').textContent='';$('#guP').value='';guLoad();$('#dGu').showModal()});
$('#guC').onclick=()=>$('#dGu').close();
$('#dGu').addEventListener('click',async e=>{const b=e.target.closest('[data-ga]');if(!b)return;const k=b.dataset.ga,f=b.dataset.f,ref=db.collection('demandes').doc(b.dataset.id),M=$('#guM');
try{if(k==='prog'){const pc=Math.max(0,Math.min(100,parseInt(b.parentElement.querySelector('input').value)||0));await db.collection('avancement').doc(gu.uid).set({[slug(f)]:pc},{merge:true});return wait(M,'Progression enregistrée : '+pc+' %.')}
if(k==='valider'){await ref.update({statut:'validée'});await nt(gu.uid,'Demande validée','Votre accès à la formation « '+f+' » est confirmé.')}
else if(k==='refuser'){await ref.update({statut:'refusée'});await nt(gu.uid,'Demande refusée','Votre demande pour « '+f+' » n’a pas été retenue.')}
else if(k==='revoquer'){if(!confirm('Révoquer l’accès de '+(gu.nom||'cet apprenant')+' à « '+f+' » ? Il sera retiré de son groupe.'))return;await ref.update({statut:'révoquée'});
const g=await db.collection('groupes').where('membres','array-contains',gu.uid).get();await Promise.all(g.docs.filter(x=>x.data().formation===f).map(x=>x.ref.update({membres:firebase.firestore.FieldValue.arrayRemove(gu.uid)})));await nt(gu.uid,'Accès retiré','Votre accès à la formation « '+f+' » a été retiré.')}
wait(M,'Fait.');guLoad();loadAdm()}catch(x){wait(M,'Échec : vérifiez les règles Firebase.')}});
$('#guA').onclick=async()=>{const f=$('#guF').value,M=$('#guM'),n=parseFloat(String($('#guP').value).replace(',','.')),fo=F.find(x=>x[0]===f)||[];
try{const s=await db.collection('demandes').where('uid','==',gu.uid).get();if(s.docs.some(d=>d.data().formation===f&&(d.data().statut==='validée'||d.data().statut==='en attente')))return wait(M,'Cet apprenant a déjà cette formation (ou une demande en cours).');
await db.collection('demandes').add({uid:gu.uid,nom:gu.nom||'',email:gu.email||'',tel:'',formation:f,...(typeof fo[2]==='number'?{prix:fo[2]}:{}),...(n>0?{prixPromo:n}:{}),statut:'validée',attribuee:true,cree:TS()});
await nt(gu.uid,'Formation attribuée','La formation « '+f+' » vous a été attribuée.');wait(M,'Formation attribuée.');guLoad();loadAdm()}catch(x){wait(M,'Échec : vérifiez les règles Firebase.')}};

// ---- onglet Formations : voir, modifier et ajouter les formations du site (photo, titre, description, prix) ----
const SITE=[['Initiation à l’informatique','Niveau léger : faisable même avec un téléphone ou peu de matériel.',100],['Bureautique','Niveau ordinateur : un ordinateur est nécessaire.',150],['Maintenance','Niveau ordinateur : pratique sur ordinateur.',150],['Réseaux','Niveau ordinateur : pratique sur ordinateur.',150],['Développement web','Niveau léger : les bases se pratiquent même sur téléphone.',100],['Applications de bureau','Niveau complexe : formation longue avec accompagnement renforcé.',250],['Bases de données','Niveau complexe : formation longue avec accompagnement renforcé.',250],['Design graphique','Niveau ordinateur : logos, affiches et visuels professionnels sur ordinateur.',150]];
const nz=t=>String(t).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’']/g,"'").trim();
const slug=t=>nz(t).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
let BASEF=null,CAT=[],ed=null,cfPh='';
const OV=n=>CAT.find(c=>c.remplace===n),CU=()=>CAT.filter(c=>!c.remplace),isDup=c=>SITE.some(s=>nz(s[0])===nz(c.nom));
pn('for').innerHTML=`<div class="card"><h3 id="cfH">Ajouter une formation</h3><label>Photo<input id="cfP" type="file" accept="image/*"></label><img id="cfV" alt="" hidden style="max-width:100%;border-radius:12px;margin:6px 0"><label>Titre<input id="cfT" maxlength="60" placeholder="Ex. : Montage vidéo"></label><label>Description <small id="cfN">0/140</small><textarea id="cfD" maxlength="140" placeholder="Une phrase courte pour donner envie"></textarea></label><label>Prix en $<input id="cfX" inputmode="decimal" placeholder="Ex. : 120"></label><div class="modes"><button id="cfA" type="button">Ajouter la formation</button><button id="cfZ" class="ghost" type="button" hidden>Annuler</button></div><p class="mu" id="cfM"></p></div><div class="card"><h3>Formations du site <span id="cfC"></span></h3><div id="cfL"></div></div>`;
const mini2=f=>new Promise((ok,ko)=>{const r=new FileReader();r.onerror=ko;r.onload=()=>{const im=new Image();im.onerror=ko;im.onload=()=>{const k=Math.min(1,640/Math.max(im.width,im.height)),w=Math.round(im.width*k),h=Math.round(im.height*k),c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(im,0,0,w,h);ok(c.toDataURL('image/jpeg',.72))};im.src=r.result};r.readAsDataURL(f)});
function syncF(){if(!BASEF)BASEF=F.slice();const L=BASEF.slice();SITE.forEach(s=>{if(!L.some(f=>nz(f[0])===nz(s[0])))L.push(s)});
CU().filter(c=>!isDup(c)&&!L.some(f=>nz(f[0])===nz(c.nom))).forEach(c=>L.push([c.nom,c.desc||'',+c.prix||0]));F.length=0;L.forEach(x=>F.push(x));
$$('#gaF,#guF').forEach(s=>{const v=s.value;s.innerHTML=F.map(f=>`<option>${esc(f[0])}</option>`).join('');s.value=v})}
const row=(img,t,sub,btns)=>`<div class="ir">${img?`<img class="av" src="${esc(img)}" alt="">`:''}<div><b>${esc(t)}</b><small>${esc(sub)}</small></div>${btns}</div>`;
function rnCat(){$('#cfC').textContent='('+(SITE.length+CU().filter(c=>!isDup(c)).length)+')';
$('#cfL').innerHTML=SITE.map(s=>{const o=OV(s[0]);return row(o&&o.photo,s[0],((o&&o.desc)||s[1])+' · '+((o&&+o.prix)||s[2])+' $'+(o?' · modifiée':''),`<button class="ghost" data-ce="b:${esc(s[0])}" type="button">Modifier</button>${o?`<button class="ghost" data-cr="${esc(o.id)}" type="button">Rétablir</button>`:''}`)}).join('')
+CU().map(c=>row(c.photo,c.nom,(isDup(c)?'⚠ Doublon d’une formation du site (masqué sur le site) · ':'')+(c.desc||'')+' · '+(+c.prix||0)+' $',`<button class="ghost" data-ce="c:${esc(c.id)}" type="button">Modifier</button><button class="ghost" data-cd="${esc(c.id)}" type="button">Supprimer</button>`)).join('')}
async function loadCat(){try{const s=await db.collection('catalogue').limit(60).get();CAT=s.docs.map(d=>({id:d.id,...d.data()})).filter(x=>x.nom).sort((a,b)=>(a.cree?.seconds||0)-(b.cree?.seconds||0));syncF();rnCat()}catch(e){$('#cfL').innerHTML='<p class="mu">Liste indisponible : ajoutez la règle « catalogue » dans Firebase.</p>'}}
function fill(nom,desc,prix,photo,lock){$('#cfH').textContent='Modifier la formation';$('#cfT').value=nom;$('#cfT').disabled=!!lock;$('#cfD').value=desc||'';$('#cfN').textContent=($('#cfD').value.length)+'/140';$('#cfX').value=prix||'';$('#cfP').value='';cfPh='';$('#cfV').hidden=!photo;if(photo)$('#cfV').src=photo;$('#cfA').textContent='Enregistrer les modifications';$('#cfZ').hidden=false;$('#cfH').scrollIntoView({block:'start',behavior:'smooth'})}
function reset(){ed=null;cfPh='';$('#cfH').textContent='Ajouter une formation';['cfT','cfD','cfX','cfP'].forEach(i=>$('#'+i).value='');$('#cfT').disabled=false;$('#cfV').hidden=true;$('#cfN').textContent='0/140';$('#cfA').textContent='Ajouter la formation';$('#cfZ').hidden=true}
$('#cfD').oninput=()=>$('#cfN').textContent=$('#cfD').value.length+'/140';
$('#cfZ').onclick=reset;
$('#cfP').onchange=async()=>{const f=$('#cfP').files[0];if(!f)return;try{cfPh=await mini2(f);$('#cfV').src=cfPh;$('#cfV').hidden=false}catch(e){wait($('#cfM'),'Photo illisible.')}};
$('#cfA').onclick=async()=>{const M=$('#cfM'),B=$('#cfA'),nom=$('#cfT').value.trim(),desc=$('#cfD').value.trim(),prix=parseFloat(String($('#cfX').value).replace(',','.'));
if(nom.length<3)return wait(M,'Écrivez le titre de la formation.');if(desc.length<10)return wait(M,'Écrivez une courte description.');if(!(prix>0))return wait(M,'Indiquez le prix en $.');
const pris=SITE.map(s=>s[0]).concat(CU().filter(c=>!ed||c.id!==ed.id).map(c=>c.nom));
if(!(ed&&ed.base)&&pris.some(n=>nz(n)===nz(nom)))return wait(M,'Cette formation existe déjà : modifiez-la dans la liste au lieu de l’ajouter.');
B.disabled=true;
try{const dat={desc,prix};if(cfPh)dat.photo=cfPh;
if(!ed)await db.collection('catalogue').add({nom,...dat,photo:cfPh,cree:TS()});
else if(ed.base)await db.collection('catalogue').doc(ed.id||'base-'+slug(ed.nom)).set({remplace:ed.nom,nom:ed.nom,...dat,cree:TS()},{merge:true});
else await db.collection('catalogue').doc(ed.id).update({nom,...dat});
wait(M,ed?'Modifications enregistrées. Elles apparaissent sur le site.':'Formation ajoutée. Elle apparaît sur le site.');reset();loadCat()}
catch(e){wait(M,'Échec : ajoutez la règle « catalogue » dans Firebase.')}finally{B.disabled=false}};
$('#cfL').onclick=async e=>{const E=e.target.closest('[data-ce]'),D=e.target.closest('[data-cd]'),R=e.target.closest('[data-cr]');
if(E){const k=E.dataset.ce,v=k.slice(2);if(k[0]==='b'){const s=SITE.find(x=>x[0]===v),o=OV(v);ed={base:1,nom:v,id:o&&o.id};fill(v,(o&&o.desc)||s[1],(o&&+o.prix)||s[2],o&&o.photo,1)}else{const c=CAT.find(x=>x.id===v);if(!c)return;ed={base:0,id:c.id,nom:c.nom};fill(c.nom,c.desc,c.prix,c.photo,0)}return}
try{if(D){if(!confirm('Supprimer cette formation du site ? Les demandes déjà reçues restent.'))return;await db.collection('catalogue').doc(D.dataset.cd).delete()}
else if(R){if(!confirm('Rétablir le texte et la photo d’origine de cette formation ?'))return;await db.collection('catalogue').doc(R.dataset.cr).delete()}else return;loadCat()}catch(x){wait($('#cfM'),'Échec.')}};

// ---- onglet Avis : ce qui n'avance pas, signalé par les apprenants (3 avis maximum par formation) ----
pn('avis').innerHTML='<div class="card"><h3>Avis des apprenants <span id="avC"></span></h3><p class="mu">Ce qui n’avance pas, signalé par les apprenants.</p><div id="avL"></div></div>';
async function loadAvis(){try{const s=await db.collection('avis').limit(100).get();const a=s.docs.map(d=>({id:d.id,...d.data()})).sort((x,y)=>(y.cree?.seconds||0)-(x.cree?.seconds||0));
$('#avC').textContent='('+a.filter(x=>!x.traite).length+' à traiter)';
$('#avL').innerHTML=a.map(x=>`<div class="dq"><div><b>${esc(x.nom||'Apprenant')} · ${esc(x.formation)}</b><small>${x.cree?new Date(x.cree.seconds*1e3).toLocaleDateString('fr'):''}${x.traite?' · traité':''}</small><p style="margin:6px 0;white-space:pre-wrap">${esc(x.texte)}</p></div>${x.traite?'':`<div class="dqa"><button data-av="${esc(x.id)}" type="button">Traité</button></div>`}</div>`).join('')||'<p class="mu">Aucun avis pour le moment.</p>'}catch(e){$('#avL').innerHTML='<p class="mu">Avis indisponibles : ajoutez la règle « avis » dans Firebase.</p>'}}
$('#avL').onclick=async e=>{const b=e.target.closest('[data-av]');if(!b)return;b.disabled=true;try{await db.collection('avis').doc(b.dataset.av).update({traite:true});loadAvis()}catch(x){b.disabled=false}};
})();
