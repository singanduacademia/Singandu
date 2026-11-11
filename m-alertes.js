// m-alertes.js
async function loadND(){try{const s=await db.collection('notifs').where('to','in',['all',me.uid]).limit(40).get();ND=s.docs.map(d=>d.data()).sort((a,b)=>(b.cree?.seconds||0)-(a.cree?.seconds||0))}catch(e){}
let l=0;try{l=+localStorage.getItem('nv')||0}catch(e){}const n=ND.filter(x=>(x.cree?.seconds||0)*1000>l).length;$('#nb').textContent=n;$('#nb').hidden=!n;
$('#nl').innerHTML=ND.length?ND.map(x=>`<div class="pc"><b>${esc(x.titre||'Information')}</b><p class="tx">${esc(x.texte||'')}</p><small class="mu">${x.cree?x.cree.toDate().toLocaleString('fr-FR'):''}</small></div>`).join(''):'<p class="mu">Aucune alerte pour le moment.</p>'}
function seen(){try{localStorage.setItem('nv',Date.now())}catch(e){}$('#nb').hidden=true}
async function loadMine(){try{const s=await db.collection('demandes').where('uid','==',me.uid).limit(30).get();MY=s.docs.map(d=>d.data()).sort((a,b)=>(b.cree?.seconds||0)-(a.cree?.seconds||0))}catch(e){}$('#my').innerHTML=MY.length?MY.map(d=>`<p>• <b>${esc(d.formation)}</b> : ${esc(d.statut)}</p>`).join(''):'<p class="mu">Aucune demande pour le moment.</p>'}
