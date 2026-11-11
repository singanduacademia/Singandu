// m-auth.js
$('#go').onclick=async()=>{const m=$('#ge');try{await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())}catch(x){const c=x&&x.code;wait(m,c==='auth/popup-closed-by-user'||c==='auth/cancelled-popup-request'?'Fenêtre fermée avant la fin. Réessayez.':c==='auth/popup-blocked'?'Fenêtre bloquée : autorisez les fenêtres surgissantes.':'Échec : '+(c||x))}};
auth.onAuthStateChanged(u=>{me=u;if(!u){$('#land').hidden=false;$('#app').hidden=true;stopChat();stopLive();return}user=u.displayName||u.email.split('@')[0];isA=u.email===ADMIN&&u.emailVerified;$('#land').hidden=true;$('#app').hidden=false;$('#tAdm').hidden=!isA;
$('#av').innerHTML=u.photoURL?`<img class="av" src="${esc(u.photoURL)}" alt="">`:`<span class="av">${esc(user[0].toUpperCase())}</span>`;$('#nm').textContent=user;$('#em').textContent=u.email;
db.collection('etudiants').doc(u.uid).set({nom:user,email:u.email,photo:u.photoURL||'',vu:TS()},{merge:true}).catch(()=>{});loadPosts();startLive();loadMine();show('home')});
$('#av').onclick=()=>show('acc');$('#bOut').onclick=()=>auth.signOut();$('#bSh').onclick=()=>share('formations informatiques à Mbuji-Mayi');
function show(t){$$('.pane').forEach(p=>p.classList.toggle('on',p.dataset.p===t));$$('#bn button').forEach(b=>b.classList.toggle('on',b.dataset.t===t));scrollTo(0,0);chOpen=t==='chat';if(chOpen){chN=0;badge('#cb',0);startChat()}else stopChat();$('#ttl').textContent=TT[t]||'';if(t==='nt')seen();if(t==='adm')loadAdm()}
$$('#bn button').forEach(b=>b.onclick=()=>show(b.dataset.t));
