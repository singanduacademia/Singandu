// m-chat.js
function startChat(){if(unsub)return;db.collection('config').doc('sujet').get().then(d=>$('#sj').textContent=d.exists?d.data().t:'Aucun sujet pour le moment.').catch(()=>{});
unsub=db.collection('chat').orderBy('cree','desc').limit(50).onSnapshot(s=>{$('#cm').innerHTML=s.docs.map(d=>({id:d.id,...d.data()})).reverse().map(m=>`<div class="mg ${m.uid===me.uid?'me':''}"><b>${esc(m.n)}</b><p>${esc(m.t)}</p>${isA||m.uid===me.uid?`<button data-d="${m.id}">Supprimer</button>`:''}</div>`).join('')||'<p class="mu">Soyez le premier à écrire.</p>';$('#cm').scrollTop=1e6},()=>{})}
function stopChat(){if(unsub){unsub();unsub=null}}
$('#cs').onclick=async()=>{const i=$('#ci'),t=i.value.trim();if(!t)return;i.value='';try{await db.collection('chat').add({uid:me.uid,n:user,t:t.slice(0,500),cree:TS()})}catch(e){}};$('#ci').onkeydown=e=>{if(e.key==='Enter')$('#cs').click()};
$('#cm').onclick=async e=>{const b=e.target.closest('[data-d]');if(b)try{await db.collection('chat').doc(b.dataset.d).delete()}catch(x){}};
