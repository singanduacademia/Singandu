// m-admin2.js — admin en onglets, demandes/inscrits propres, conseils discrets (bannière « Conseil Singandu »)
(function(){
let ETU=[],GR=[],FM={},unC=null,cibleF=null;
document.head.insertAdjacentHTML('beforeend',`<style>
#aT{display:flex;gap:6px;overflow-x:auto;padding:4px 0 10px;position:sticky;top:0;background:var(--bg,#fff);z-index:3}
#aT button{white-space:nowrap;border-radius:20px;padding:8px 14px;background:#eef2ff;color:#1b2a8a;border:0}
#aT button.on{background:#1b2a8a;color:#fff}#aT i{font-style:normal;background:#e5322d;color:#fff;border-radius:10px;padding:0 6px;margin-left:4px;font-size:.8em}
.ap[hidden]{display:none}.dq,.ir{display:flex;gap:10px;align-items:center;justify-content:space-between;padding:10px;border-radius:12px;background:#f4f6ff;margin:8px 0}
.dq.pend{background:#fff8d6}.dq small,.ir small{display:block;color:#667;font-size:.8em;word-break:break-all}.dqa{display:flex;flex-direction:column;gap:4px;align-items:flex-end}
.bg{font-size:.75em;border-radius:10px;padding:2px 8px;background:#e5e5e5}.bg.w{background:#ffd400}.bg.o{background:#c8f5d8}.bg.n{background:#ffd5d5}
.ir>div{flex:1;min-width:0}#cbn{position:fixed;left:12px;right:12px;top:-120px;z-index:99;background:#1b2a8a;color:#fff;border-radius:16px;padding:12px 14px;box-shadow:0 8px 24px rgba(0,0,0,.3);transition:top .5s}
#cbn.on{top:12px}#cbn small{opacity:.8;display:block}
</style>`);
// ---- 1. onglets ----
const P=$('[data-p=adm]'),card=s=>{const e=$(s);return e&&e.closest('.card')};
const tabs=[['dem','Demandes'],['ins','Inscrits'],['grp','Groupes'],['con','Conseils'],['site','Site'],['ast','Assistant']];
P.insertAdjacentHTML('afterbegin','<div id="aT">'+tabs.map(t=>`<button type="button" data-at="${t[0]}">${t[1]}<i hidden></i></button>`).join('')+'</div>'+tabs.map(t=>`<div class="ap" data-ap="${t[0]}" hidden></div>`).join(''));
const pn=k=>P.querySelector(`[data-ap=${k}]`);
[['dem','#rq'],['ins','#ins'],['site','#bPub'],['site','#bNo'],['site','#bSj'],['ast','#bSa']].forEach(([k,s])=>{const c=card(s);if(c)pn(k).append(c)});
pn('con').innerHTML=`<div class="card"><h3>Conseil discret</h3><p class="mu">Le destinataire voit « Conseil Singandu » : aucun nom d’administrateur n’apparaît.</p><label>Destinataire<select id="cT"><option value="">Chargement…</option></select></label><label>Conseil<textarea id="cX" maxlength="400" placeholder="Ex. : Pensez à faire des pauses plus courtes et à reformuler chaque leçon avec vos mots."></textarea></label><button id="cSend" type="button">Envoyer</button><p class="mu" id="cM"></p></div>`;
const iq=document.createElement('input');iq.id='iq';iq.placeholder='Rechercher un inscrit…';$('#ins').before(iq);iq.oninput=rnIns;
function tab(k){$$('#aT button').forEach(b=>b.classList.toggle('on',b.dataset.at===k));$$('.ap').forEach(p=>p.hidden=p.dataset.ap!==k);place()}
$('#aT').onclick=e=>{const b=e.target.closest('[data-at]');if(b)tab(b.dataset.at)};tab('dem');
function place(){const g=$('#gAdm');if(g&&!g.closest('.ap'))pn('grp').append(g)}
// ---- 2. demandes ----
async function loadAdm(){place();let n=0;try{const s=await db.collection('demandes').limit(100).get();
const a=s.docs.map(d=>({id:d.id,...d.data()})).sort((x,y)=>(x.statut==='en attente'?0:1)-(y.statut==='en attente'?0:1)||(y.cree?.seconds||0)-(x.cree?.seconds||0));
$('#rq').innerHTML=a.map(d=>{const p=d.statut==='en attente';if(p)n++;const a2=`data-r="${d.id}" data-u="${esc(d.uid)}" data-f="${esc(d.formation)}"`;
return`<div class="dq ${p?'pend':''}"><div><b>${esc(d.nom)}</b><small>${esc(d.formation)}${d.prix?' · '+d.prix+' $':''}</small><small>${esc(d.email||'')} ${esc(d.tel||'')}</small>${d.note?`<small>${esc(d.note)}</small>`:''}</div><div class="dqa"><span class="bg ${p?'w':d.statut==='validée'?'o':'n'}">${esc(d.statut)}</span>${p?`<button ${a2} data-v="1">Valider</button><button class="ghost" ${a2} data-v="0">Refuser</button>`:''}</div></div>`}).join('')||'<p class="mu">Aucune demande.</p>'}catch(e){}
const i=$('#aT [data-at=dem] i');i.textContent=n;i.hidden=!n;
if(typeof loadAs==='function')try{loadAs()}catch(e){}
loadIns();loadSent();loadGR()}
window.loadAdm=loadAdm;
// ---- 3. inscrits ----
async function loadIns(){try{const s=await db.collection('etudiants').limit(300).get();ETU=s.docs.map(d=>({uid:d.id,...d.data()})).sort((a,b)=>(b.vu?.seconds||0)-(a.vu?.seconds||0));try{const f=await db.collection('formateurs').get();FM={};f.docs.forEach(d=>FM[d.id]=d.data());window.FMT=f.docs.map(d=>({uid:d.id,...d.data()}));dispatchEvent(new Event('fmt'))}catch(e){}$('#ncnt').textContent='('+ETU.length+')';rnIns();fillT()}catch(e){$('#ins').innerHTML='<p class="mu">Liste indisponible.</p>'}}
function rnIns(){const q=iq.value.toLowerCase();$('#ins').innerHTML=ETU.filter(e=>((e.nom||'')+' '+(e.email||'')).toLowerCase().includes(q)).map(e=>`<div class="ir">${e.photo?`<img class="av" src="${esc(e.photo)}" alt="">`:`<span class="av">${esc((e.nom||'?')[0].toUpperCase())}</span>`}<div><b>${esc(e.nom)}</b><small>${esc(e.email)}</small>${FM[e.uid]?`<small>🎓 ${esc((FM[e.uid].formations||[]).join(', '))}</small>`:''}</div><button class="ghost" data-fm="${esc(e.uid)}" type="button">${FM[e.uid]?'Formateur ✓':'Formateur'}</button><button class="ghost" data-cs="${esc(e.uid)}" type="button">Conseil</button></div>`).join('')||'<p class="mu">Aucun inscrit trouvé.</p>'}
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
})();
