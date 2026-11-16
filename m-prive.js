// m-prive.js : messagerie privée style WhatsApp, présence, "écrit…", notifications, pastilles
(function(){
let MSG=[],PRO={},open=null,uM=null,uP=null,hb=null,init=false,seen=null,lastN=0,newN=0,lastTyp=0,typT=null,wasTyp=false,toastT=null;
const on=id=>((PRO[id]||{}).vu||0)>Date.now()-15e4;
const ts=m=>(m.cree&&m.cree.seconds)||Date.now()/1e3;
const other=m=>m.de===me.uid?m.a:m.de;
const vis=()=>{const p=document.querySelector('.pane.on');return !!p&&p.dataset.p==='chat'&&!$('#prv').hidden&&!document.hidden};
const hm=s=>new Date(s*1000).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});
const dl=s=>{const d=new Date(s*1000),k=x=>x.toDateString();return k(d)===k(new Date())?'Aujourd’hui':k(d)===k(new Date(Date.now()-864e5))?'Hier':d.toLocaleDateString('fr-FR',{day:'numeric',month:'long'})};
const prof=id=>PRO[id]||(me&&id===me.uid?{nom:user,photo:me.photoURL||''}:{});
const isTyp=id=>{const e=(PRO[id]||{}).ecrit;return !!e&&e.a===me.uid&&Date.now()-e.t<5000};
const avh=(id,nd)=>{const p=prof(id),n=p.nom||'?';return `<span class="aw">${p.photo?`<img class="av" src="${esc(p.photo)}" alt="">`:`<span class="av">${esc(n[0].toUpperCase())}</span>`}${!nd&&on(id)?'<i class="dot"></i>':''}</span>`};
const botAv='<span class="aw"><span class="av bot">S</span><i class="dot"></i></span>';
function seg(g){$('#grp').hidden=!g;$('#prv').hidden=g;$('#sgG').classList.toggle('on',g);$('#sgP').classList.toggle('on',!g);if(!g){draw();markRead()}}
$('#sgG').onclick=()=>seg(true);$('#sgP').onclick=()=>seg(false);
function unread(){return MSG.filter(m=>m.a===me.uid&&!m.lu).length}
function setBadge(){const n=unread();badge('#pb',n);badge('#db',n);document.title=(n?'('+n+') ':'')+'Singandu Academia';try{if(navigator.setAppBadge){n?navigator.setAppBadge(n):navigator.clearAppBadge()}}catch(e){}}
function markRead(){if(!open||!vis())return;MSG.filter(m=>m.a===me.uid&&m.de===open&&!m.lu).forEach(m=>db.collection('messages').doc(m.id).update({lu:true}).catch(()=>{}))}

/* ---- Écran adapté au clavier : le panneau suit la zone réellement visible ---- */
const vv=window.visualViewport;
function fit(){const t=$('#dmT');if(!t||t.hidden||!vv)return;const b=$('#dmM'),near=b.scrollHeight-b.scrollTop-b.clientHeight<160;
t.style.height=vv.height+'px';t.style.top=vv.offsetTop+'px';if(near)b.scrollTop=b.scrollHeight}
if(vv){vv.addEventListener('resize',fit);vv.addEventListener('scroll',fit)}
function lock(v){document.documentElement.style.overflow=v?'hidden':'';document.body.style.overflow=v?'hidden':''}

/* ---- "écrit…" ---- */
function setTyp(v){const t=Date.now();if(v){if(!open||t-lastTyp<2500)return;lastTyp=t}else{if(!lastTyp)return;lastTyp=0}
try{db.collection('profils').doc(me.uid).set({ecrit:v?{a:open,t:t}:null,vu:t},{merge:true}).catch(()=>{})}catch(e){}}

/* ---- Notifications : alerte sonore, bandeau dans l'application, notification du téléphone ---- */
function toast(nom,txt,de){let t=$('#toast');if(!t){t=document.createElement('div');t.id='toast';t.className='toast';document.body.appendChild(t)}
t.innerHTML=`<b>${esc(nom)}</b><span>${esc(txt)}</span>`;t.dataset.de=de;t.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>{t.hidden=true},5500)}
document.addEventListener('click',e=>{const t=e.target.closest('#toast');if(t&&!t.hidden){t.hidden=true;goChat(t.dataset.de)}});
function goChat(de){const b=document.querySelector('#bn [data-t="chat"]');b&&b.click();setTimeout(()=>{if(de)openT(de)},120)}
function notify(d){const nom=(PRO[d.de]&&PRO[d.de].nom)||d.nom||'Nouveau message';ding();
if(document.hidden){try{if('Notification' in window&&Notification.permission==='granted'){const o={body:String(d.t).slice(0,120),icon:'ic%C3%B4ne-192.png',badge:'ic%C3%B4ne-192.png',tag:'msg-'+d.de,renotify:true,data:{de:d.de}};
if(navigator.serviceWorker&&navigator.serviceWorker.ready)navigator.serviceWorker.ready.then(r=>r.showNotification(nom,o));else new Notification(nom,o)}}catch(e){}}
else toast(nom,d.t,d.de)}
if(navigator.serviceWorker)navigator.serviceWorker.addEventListener('message',e=>{const d=e.data;if(d&&d.open)goChat(d.open)});

/* ---- Liste : personnes en ligne + conversations ---- */
function draw(){if(!me)return;if(open){thread();return}
$('#dmB').hidden=false;$('#dmT').hidden=true;
const ids=Object.keys(PRO).filter(i=>i!==me.uid),onl=ids.filter(on),conv={};
MSG.forEach(m=>{const o=other(m);(conv[o]=conv[o]||[]).push(m)});
const cl=Object.keys(conv).sort((x,y)=>ts(conv[y][conv[y].length-1])-ts(conv[x][conv[x].length-1]));
const nt='Notification' in window&&Notification.permission==='default';
$('#dmB').innerHTML=
(nt?`<div class="card ntc"><b>Soyez prévenu de chaque message</b><p class="mu">Activez les notifications pour recevoir une alerte quand quelqu’un vous écrit.</p><button type="button" data-notif="1">Activer les notifications</button></div>`:'')+
`<div class="card"><h3>En ligne</h3><div class="ons"><div class="on1" data-bot="1">${botAv}<span>Sibot</span></div>${onl.map(i=>`<div class="on1" data-o="${i}">${avh(i)}<span>${esc((PRO[i].nom||'').split(' ')[0])}</span></div>`).join('')}</div>${onl.length?'':'<p class="mu">Aucun ami en ligne pour le moment. Sibot est toujours là pour vous aider.</p>'}</div>`+
`<div class="card"><h3>Conversations</h3>${cl.length?cl.map(i=>{const l=conv[i][conv[i].length-1],n=conv[i].filter(m=>m.a===me.uid&&!m.lu).length;return `<div class="dmrow" data-o="${i}">${avh(i)}<div class="nm"><b>${esc((PRO[i]&&PRO[i].nom)||l.nom||'Inscrit')}</b><small>${isTyp(i)?'écrit…':(l.de===me.uid?'Vous : ':'')+esc(l.t)}</small></div><div class="rt"><span class="tm">${hm(ts(l))}</span>${n?`<span class="cn">${n}</span>`:''}</div></div>`}).join(''):'<p class="mu">Touchez un ami en ligne pour démarrer une discussion.</p>'}</div>`}

/* ---- Conversation ---- */
function head(){const id=open,p=prof(id);$('#dmH').innerHTML=`${avh(id)}<div><b>${esc(p.nom||'Inscrit')}</b><small class="${isTyp(id)?'typing':''}">${isTyp(id)?'écrit…':on(id)?'En ligne':'Hors ligne'}</small></div>`}
function jump(){const b=$('#dmM'),near=b.scrollHeight-b.scrollTop-b.clientHeight<140;if(near)newN=0;$('#dmJ').hidden=near;$('#dmJ').innerHTML=newN?`<span>${newN} nouveau${newN>1?'x':''}</span> ↓`:'↓'}
function thread(){const id=open,box=$('#dmM');$('#dmB').hidden=true;$('#dmT').hidden=false;head();fit();
const prev=box.scrollTop,near=box.scrollHeight-box.scrollTop-box.clientHeight<140,first=seen!==id;
const L=MSG.filter(m=>m.membres&&m.membres.includes(id));let day='',h='';
L.forEach(m=>{const s=ts(m),d=dl(s),mine=m.de===me.uid;if(d!==day){day=d;h+=`<div class="wd">${esc(d)}</div>`}
h+=`<div class="wr${mine?' me':''}">${avh(mine?me.uid:id,1)}<div class="wb">${esc(m.t)}<time>${hm(s)}${mine?(m.lu?' ✓✓':' ✓'):''}</time></div></div>`});
if(isTyp(id))h+=`<div class="wr typ">${avh(id,1)}<div class="wb dots"><i></i><i></i><i></i></div></div>`;
box.innerHTML=h||'<p class="mu" style="margin:auto;text-align:center">Écrivez le premier message.</p>';
const last=L[L.length-1],add=L.length-lastN;
if(first||near||(last&&last.de===me.uid)){box.scrollTop=box.scrollHeight;newN=0}else{box.scrollTop=prev;if(add>0)newN+=add}
seen=id;lastN=L.length;jump()}
function openT(id){open=id;seen=null;lastN=0;newN=0;wasTyp=false;try{history.pushState({dm:1},'')}catch(e){}lock(true);draw();markRead();setTimeout(fit,0)}
function closeT(){setTyp(false);open=null;seen=null;lock(false);const t=$('#dmT');t.style.height='';t.style.top='';draw()}
$('#prv').addEventListener('click',e=>{
if(e.target.closest('[data-notif]')){try{Notification.requestPermission().then(()=>draw())}catch(x){}return}
if(e.target.closest('[data-bot]')){$('#bBot').click();return}
const o=e.target.closest('[data-o]');if(o){openT(o.dataset.o);return}
if(e.target.closest('#dmK')){if(history.state&&history.state.dm)history.back();else closeT()}});
addEventListener('popstate',()=>{if(open)closeT()});
$('#dmM').addEventListener('scroll',jump);
$('#dmJ').onclick=()=>{const b=$('#dmM');newN=0;b.scrollTo({top:b.scrollHeight,behavior:'smooth'})};
$('#dmI').addEventListener('input',()=>setTyp(true));
$('#dmI').addEventListener('blur',()=>setTyp(false));
$('#dmI').addEventListener('focus',()=>setTimeout(()=>{fit();const b=$('#dmM');b.scrollTop=b.scrollHeight},320));
async function send(){const i=$('#dmI'),t=i.value.trim();if(!t||!open)return;i.value='';i.focus();setTyp(false);try{await db.collection('messages').add({de:me.uid,a:open,membres:[me.uid,open],nom:user,t:t.slice(0,1000),lu:false,cree:TS()})}catch(e){alert(e&&e.code==='permission-denied'?'Messages privés pas encore activés : ajoutez les règles Firebase.':'Message non envoyé.')}}
$('#dmS').onclick=send;$('#dmI').onkeydown=e=>{if(e.key==='Enter')send()};

/* ---- Présence et abonnements ---- */
function beat(){if(!me)return;db.collection('profils').doc(me.uid).set({nom:user,photo:me.photoURL||'',vu:Date.now()},{merge:true}).catch(()=>{})}
function start(){stop();init=false;
uM=db.collection('messages').where('membres','array-contains',me.uid).limit(300).onSnapshot(s=>{MSG=s.docs.map(d=>({id:d.id,...d.data()}));MSG.sort((x,y)=>ts(x)-ts(y));setBadge();
if(init)s.docChanges().forEach(c=>{const d=c.doc.data();if(c.type==='added'&&d.a===me.uid&&!(open&&d.de===open&&vis()))notify(d)});init=true;
if(!$('#prv').hidden)draw();markRead()},()=>{});
uP=db.collection('profils').limit(200).onSnapshot(s=>{PRO={};s.docs.forEach(d=>PRO[d.id]=d.data());
if($('#prv').hidden)return;
if(open){const t=isTyp(open);if(t!==wasTyp){wasTyp=t;thread()}else head();clearTimeout(typT);if(t)typT=setTimeout(()=>{if(open&&wasTyp&&!isTyp(open)){wasTyp=false;thread()}},5300)}else draw()},()=>{});
beat();hb=setInterval(beat,6e4)}
function stop(){[uM,uP].forEach(f=>f&&f());uM=uP=null;clearInterval(hb);clearTimeout(typT);MSG=[];PRO={};open=null;seen=null;lock(false);$('#dmT').hidden=true;badge('#pb',0);badge('#db',0);document.title='Singandu Academia';try{navigator.clearAppBadge&&navigator.clearAppBadge()}catch(e){}}
document.addEventListener('visibilitychange',()=>{if(!document.hidden){beat();markRead()}});
auth.onAuthStateChanged(u=>{u?start():stop()});
})();
