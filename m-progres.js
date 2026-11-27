// m-progres.js — ma formation en cours, niveaux + avis à l'administration (3 par formation), en haut de l'onglet Apprendre
(function(){
const U=()=>auth.currentUser,isAd=()=>!!U()&&U().email===ADMIN;
const nz=t=>String(t).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’']/g,"'").trim();
const slug=t=>nz(t).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
document.head.insertAdjacentHTML('beforeend',`<style>
.pgf{padding:12px 0;border-top:1px solid rgba(128,128,128,.25)}.pgf:first-of-type{border-top:0}
.pgt{display:inline-block;background:var(--blue);color:#fff;border-radius:999px;font-size:.7rem;font-weight:700;padding:2px 10px;margin-bottom:4px}
.pgl{display:flex;gap:6px;margin:8px 0 6px}.pgl i{flex:1;height:10px;border-radius:6px;background:var(--sky)}.pgl i.on{background:var(--blue)}
.pga{display:flex;align-items:center;gap:10px;margin-top:8px}.pga small,.pgf>small{color:var(--muted)}
.pgx{margin-top:8px}.pgx textarea{margin:0}
</style>`);
function ensure(){const h=$('[data-p=form]');if(!h||$('#pgC'))return;h.insertAdjacentHTML('afterbegin','<div class="card" id="pgC"><h3>Ma formation</h3><div id="pgL" class="mu">Chargement…</div></div>')}
async function load(){const u=U();if(!u||isAd())return;ensure();const L=$('#pgL');if(!L)return;
try{const[d,a,v]=await Promise.all([db.collection('demandes').where('uid','==',u.uid).get(),db.collection('avancement').doc(u.uid).get().catch(()=>null),db.collection('avis').where('uid','==',u.uid).get().catch(()=>({docs:[]}))]);
const vs=d.docs.map(x=>x.data()).filter(x=>x.statut==='validée'&&x.type!=='dépannage').sort((a,b)=>((b.cree&&b.cree.seconds)||0)-((a.cree&&a.cree.seconds)||0)),fs=[...new Set(vs.map(x=>x.formation))],lv=p=>p>=100?4:Math.min(4,1+Math.floor(p/25)),av=(a&&a.exists&&a.data())||{},nb={};
v.docs.forEach(x=>{const f=x.data().formation;nb[f]=(nb[f]||0)+1});
L.innerHTML=fs.map((f,k)=>{const p=Math.max(0,Math.min(100,+av[slug(f)]||0)),n=nb[f]||0,l=lv(p);return`<div class="pgf">${k===0?'<span class="pgt">En cours</span><br>':''}<b>${esc(f)}</b><div class="pgl">${[1,2,3,4].map(i=>`<i class="${i<=l?'on':''}"></i>`).join('')}</div><small>${p>=100?'Formation terminée':'Niveau '+l+' sur 4 · '+p+' %'}</small><div class="pga"><button class="ghost" data-pf="${esc(f)}" type="button"${n>=3?' disabled':''}>Signaler un blocage</button><small>${n}/3 avis envoyés</small></div><div class="pgx" hidden></div></div>`}).join('')||'<p class="mu">Ta progression apparaîtra ici dès que ta demande de formation sera validée.</p>'}
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
