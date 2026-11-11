// m-prive.js : messages privés entre inscrits, liste des personnes en ligne, pastilles
(function(){
let MSG=[],PRO={},open=null,uM=null,uP=null,hb=null,init=false;
const on=id=>((PRO[id]||{}).vu||0)>Date.now()-15e4;
const ts=m=>(m.cree&&m.cree.seconds)||Date.now()/1e3;
const other=m=>m.de===me.uid?m.a:m.de;
const vis=()=>{const p=document.querySelector('.pane.on');return !!p&&p.dataset.p==='chat'&&!$('#prv').hidden&&!document.hidden};
const avh=id=>{const p=PRO[id]||{},n=p.nom||'?';return `<span class="aw">${p.photo?`<img class="av" src="${esc(p.photo)}" alt="">`:`<span class="av">${esc(n[0].toUpperCase())}</span>`}${on(id)?'<i class="dot"></i>':''}</span>`};
function seg(g){$('#grp').hidden=!g;$('#prv').hidden=g;$('#sgG').classList.toggle('on',g);$('#sgP').classList.toggle('on',!g);if(!g){draw();markRead()}}
$('#sgG').onclick=()=>seg(true);$('#sgP').onclick=()=>seg(false);
function unread(){return MSG.filter(m=>m.a===me.uid&&!m.lu).length}
function setBadge(){const n=unread();badge('#pb',n);badge('#db',n);document.title=(n?'('+n+') ':'')+'Singandu Academia';try{if(navigator.setAppBadge){n?navigator.setAppBadge(n):navigator.clearAppBadge()}}catch(e){}}
function markRead(){if(!open||!vis())return;MSG.filter(m=>m.a===me.uid&&m.de===open&&!m.lu).forEach(m=>db.collection('messages').doc(m.id).update({lu:true}).catch(()=>{}))}
function draw(){if(!me)return;if(open){thread();return}
$('#dmB').hidden=false;$('#dmT').hidden=true;
const ids=Object.keys(PRO).filter(i=>i!==me.uid),onl=ids.filter(on),conv={};
MSG.forEach(m=>{const o=other(m);(conv[o]=conv[o]||[]).push(m)});
const cl=Object.keys(conv).sort((x,y)=>ts(conv[y][conv[y].length-1])-ts(conv[x][conv[x].length-1]));
$('#dmB').innerHTML=
`<div class="card"><h3>En ligne</h3>${onl.length?`<div class="ons">${onl.map(i=>`<div class="on1" data-o="${i}">${avh(i)}<span>${esc((PRO[i].nom||'').split(' ')[0])}</span></div>`).join('')}</div>`:'<p class="mu">Personne n’est en ligne pour le moment.</p>'}</div>`+
`<div class="card"><h3>Conversations</h3>${cl.length?cl.map(i=>{const l=conv[i][conv[i].length-1],n=conv[i].filter(m=>m.a===me.uid&&!m.lu).length;return `<div class="dmrow" data-o="${i}">${avh(i)}<div class="nm"><b>${esc((PRO[i]&&PRO[i].nom)||l.nom||'Inscrit')}</b><small>${l.de===me.uid?'Vous : ':''}${esc(l.t)}</small></div>${n?`<span class="cn">${n}</span>`:''}</div>`}).join(''):'<p class="mu">Choisissez une personne pour démarrer.</p>'}</div>`+
`<div class="card"><h3>Tous les inscrits</h3>${ids.length?ids.map(i=>`<div class="dmrow" data-o="${i}">${avh(i)}<div class="nm"><b>${esc(PRO[i].nom||'Inscrit')}</b></div></div>`).join(''):'<p class="mu">Les autres inscrits apparaîtront ici.</p>'}</div>`}
function thread(){const id=open,p=PRO[id]||{};$('#dmB').hidden=true;$('#dmT').hidden=false;
$('#dmH').innerHTML=`<button class="bk" id="dmK">Retour</button>${avh(id)}<div><b>${esc(p.nom||'Inscrit')}</b><br><small class="mu">${on(id)?'En ligne':'Hors ligne'}</small></div>`;
const L=MSG.filter(m=>m.membres&&m.membres.includes(id));
$('#dmM').innerHTML=L.length?L.map(m=>`<div class="mg${m.de===me.uid?' me':''}">${esc(m.t)}</div>`).join(''):'<p class="mu">Écrivez le premier message.</p>';$('#dmM').scrollTop=1e9}
$('#prv').addEventListener('click',e=>{const o=e.target.closest('[data-o]');if(o){open=o.dataset.o;draw();markRead();return}if(e.target.closest('#dmK')){open=null;draw()}});
async function send(){const i=$('#dmI'),t=i.value.trim();if(!t||!open)return;i.value='';try{await db.collection('messages').add({de:me.uid,a:open,membres:[me.uid,open],nom:user,t:t.slice(0,1000),lu:false,cree:TS()})}catch(e){alert(e&&e.code==='permission-denied'?'Messages privés pas encore activés : ajoutez les règles Firebase.':'Message non envoyé.')}}
$('#dmS').onclick=send;$('#dmI').onkeydown=e=>{if(e.key==='Enter')send()};
function beat(){if(!me)return;db.collection('profils').doc(me.uid).set({nom:user,photo:me.photoURL||'',vu:Date.now()},{merge:true}).catch(()=>{})}
function start(){stop();init=false;
uM=db.collection('messages').where('membres','array-contains',me.uid).limit(300).onSnapshot(s=>{MSG=s.docs.map(d=>({id:d.id,...d.data()}));MSG.sort((x,y)=>ts(x)-ts(y));setBadge();
if(init&&s.docChanges().some(c=>{const d=c.doc.data();return c.type==='added'&&d.a===me.uid&&!(open&&d.de===open&&vis())}))ding();init=true;
if(!$('#prv').hidden)draw();markRead()},()=>{});
uP=db.collection('profils').limit(200).onSnapshot(s=>{PRO={};s.docs.forEach(d=>PRO[d.id]=d.data());if(!$('#prv').hidden&&!open)draw()},()=>{});
beat();hb=setInterval(beat,6e4)}
function stop(){[uM,uP].forEach(f=>f&&f());uM=uP=null;clearInterval(hb);MSG=[];PRO={};open=null;badge('#pb',0);badge('#db',0);document.title='Singandu Academia';try{navigator.clearAppBadge&&navigator.clearAppBadge()}catch(e){}}
document.addEventListener('visibilitychange',()=>{if(!document.hidden){beat();markRead()}});
auth.onAuthStateChanged(u=>{u?start():stop()});
})();
