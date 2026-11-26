// m-progres.js — ma progression + avis à l'administration (3 par formation), en haut de l'onglet Apprendre
(function(){
const U=()=>auth.currentUser,isAd=()=>!!U()&&U().email===ADMIN;
const nz=t=>String(t).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’']/g,"'").trim();
const slug=t=>nz(t).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
document.head.insertAdjacentHTML('beforeend',`<style>
.pgf{padding:12px 0;border-top:1px solid #e3e8ff}.pgf:first-of-type{border-top:0}
.pgb{height:10px;border-radius:6px;background:#e3e8ff;margin:8px 0 4px;overflow:hidden}.pgb i{display:block;height:100%;background:linear-gradient(90deg,#1b2a8a,#2f5be6);border-radius:6px}
.pga{display:flex;align-items:center;gap:10px;margin-top:8px}.pga small{color:#667}
.pgx{margin-top:8px}.pgx textarea{width:100%;box-sizing:border-box;border:1.5px solid #dbe3ff;border-radius:12px;padding:10px;font:inherit}
</style>`);
function ensure(){const h=$('[data-p=form]');if(!h||$('#pgC'))return;h.insertAdjacentHTML('afterbegin','<div class="card" id="pgC"><h3>Ma progression</h3><div id="pgL" class="mu">Chargement…</div></div>')}
async function load(){const u=U();if(!u||isAd())return;ensure();const L=$('#pgL');if(!L)return;
try{const[d,a,v]=await Promise.all([db.collection('demandes').where('uid','==',u.uid).get(),db.collection('avancement').doc(u.uid).get().catch(()=>null),db.collection('avis').where('uid','==',u.uid).get().catch(()=>({docs:[]}))]);
const fs=[...new Set(d.docs.map(x=>x.data()).filter(x=>x.statut==='validée').map(x=>x.formation))],av=(a&&a.exists&&a.data())||{},nb={};
v.docs.forEach(x=>{const f=x.data().formation;nb[f]=(nb[f]||0)+1});
L.innerHTML=fs.map(f=>{const p=Math.max(0,Math.min(100,+av[slug(f)]||0)),n=nb[f]||0;return`<div class="pgf"><b>${esc(f)}</b><div class="pgb"><i style="width:${p}%"></i></div><small>${p} % accompli</small><div class="pga"><button class="ghost" data-pf="${esc(f)}" type="button"${n>=3?' disabled':''}>Signaler un blocage</button><small>${n}/3 avis envoyés</small></div><div class="pgx" hidden></div></div>`}).join('')||'<p class="mu">Ta progression apparaîtra ici dès que ta demande de formation sera validée.</p>'}
catch(e){L.textContent='Progression indisponible.'}}
document.addEventListener('click',async e=>{const b=e.target.closest('[data-pf]'),s=e.target.closest('[data-pS]'),c=e.target.closest('[data-pC]');
if(b){const x=b.closest('.pgf').querySelector('.pgx');x.hidden=!x.hidden;if(!x.hidden){x.innerHTML='<textarea rows="3" maxlength="400" placeholder="Qu’est-ce qui n’avance pas ? Explique en quelques mots."></textarea><div class="pga"><button type="button" data-pS="'+esc(b.dataset.pf)+'">Envoyer à l’administration</button><button class="ghost" type="button" data-pC="1">Annuler</button></div><p class="mu"></p>'}return}
if(c){c.closest('.pgx').hidden=true;return}
if(s){const x=s.closest('.pgx'),t=x.querySelector('textarea').value.trim(),M=x.querySelector('p'),f=s.dataset.pS,u=U();
if(t.length<5)return wait(M,'Écris quelques mots.');s.disabled=true;
try{const q=await db.collection('avis').where('uid','==',u.uid).get(),used=new Set(q.docs.map(d=>d.id));let n=0;for(let i=1;i<=3;i++)if(!used.has(u.uid+'_'+slug(f)+'_'+i)){n=i;break}
if(!n){wait(M,'Tu as déjà envoyé 3 avis pour cette formation.');return}
await db.collection('avis').doc(u.uid+'_'+slug(f)+'_'+n).set({uid:u.uid,nom:u.displayName||'',formation:f,texte:t.slice(0,400),cree:TS()});
wait(M,'Avis envoyé. Merci !');load()}catch(x){wait(M,'Envoi impossible. Réessaie plus tard.');s.disabled=false}}});
auth.onAuthStateChanged(u=>{if(u&&!isAd())load()});
const h=$('[data-p=form]');if(h)new MutationObserver(()=>{if(!$('#pgC')&&U()&&!isAd())load()}).observe(h,{childList:true});
})();
