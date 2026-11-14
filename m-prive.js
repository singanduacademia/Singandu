// m-prive.js : messagerie privée style WhatsApp, personnes en ligne, Singala, pastilles
(function(){
let MSG=[],PRO={},open=null,uM=null,uP=null,hb=null,init=false,seen=null,lastN=0,newN=0;
const on=id=>((PRO[id]||{}).vu||0)>Date.now()-15e4;
const ts=m=>(m.cree&&m.cree.seconds)||Date.now()/1e3;
const other=m=>m.de===me.uid?m.a:m.de;
const vis=()=>{const p=document.querySelector('.pane.on');return !!p&&p.dataset.p==='chat'&&!$('#prv').hidden&&!document.hidden};
const hm=s=>new Date(s*1000).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});
const dl=s=>{const d=new Date(s*1000),k=x=>x.toDateString();return k(d)===k(new Date())?'Aujourd’hui':k(d)===k(new Date(Date.now()-864e5))?'Hier':d.toLocaleDateString('fr-FR',{day:'numeric',month:'long'})};
const prof=id=>PRO[id]||(me&&id===me.uid?{nom:user,photo:me.photoURL||''}:{});
const avh=(id,nd)=>{const p=prof(id),n=p.nom||'?';return `<span class="aw">${p.photo?`<img class="av" src="${esc(p.photo)}" alt="">`:`<span class="av">${esc(n[0].toUpperCase())}</span>`}${!nd&&on(id)?'<i class="dot"></i>':''}</span>`};
const botAv='<span class="aw"><span class="av bot">S</span><i class="dot"></i></span>';
function seg(g){$('#grp').hidden=!g;$('#prv').hidden=g;$('#sgG').classList.toggle('on',g);$('#sgP').classList.toggle('on',!g);if(!g){draw();markRead()}}
$('#sgG').onclick=()=>seg(true);$('#sgP').onclick=()=>seg(false);
function unread(){return MSG.filter(m=>m.a===me.uid&&!m.lu).length}
function setBadge(){const n=unread();badge('#pb',n);badge('#db',n);document.title=(n?'('+n+') ':'')+'Singandu Academia';try{if(navigator.setAppBadge){n?navigator.setAppBadge(n):navigator.clearAppBadge()}}catch(e){}}
function markRead(){if(!open||!vis())return;MSG.filter(m=>m.a===me.uid&&m.de===open&&!m.lu).forEach(m=>db.collection('messages').doc(m.id).update({lu:true}).catch(()=>{}))}

/* ---- Liste : personnes en ligne + conversations ---- */
function draw(){if(!me)return;if(open){thread();return}
$('#dmB').hidden=false;$('#dmT').hidden=true;
const ids=Object.keys(PRO).filter(i=>i!==me.uid),onl=ids.filter(on),conv={};
MSG.forEach(m=>{const o=other(m);(conv[o]=conv[o]||[]).push(m)});
const cl=Object.keys(conv).sort((x,y)=>ts(conv[y][conv[y].length-1])-ts(conv[x][conv[x].length-1]));
$('#dmB').innerHTML=
`<div class="card"><h3>En ligne</h3><div class="ons"><div class="on1" data-bot="1">${botAv}<span>Singala</span></div>${onl.map(i=>`<div class="on1" data-o="${i}">${avh(i)}<span>${esc((PRO[i].nom||'').split(' ')[0])}</span></div>`).join('')}</div>${onl.length?'':'<p class="mu">Aucun ami en ligne pour le moment. Singala est toujours là pour vous aider.</p>'}</div>`+
`<div class="card"><h3>Conversations</h3>${cl.length?cl.map(i=>{const l=conv[i][conv[i].length-1],n=conv[i].filter(m=>m.a===me.uid&&!m.lu).length;return `<div class="dmrow" data-o="${i}">${avh(i)}<div class="nm"><b>${esc((PRO[i]&&PRO[i].nom)||l.nom||'Inscrit')}</b><small>${l.de===me.uid?'Vous : ':''}${esc(l.t)}</small></div><div class="rt"><span class="tm">${hm(ts(l))}</span>${n?`<span class="cn">${n}</span>`:''}</div></div>`}).join(''):'<p class="mu">Touchez un ami en ligne pour démarrer une discussion.</p>'}</div>`}

/* ---- Conversation ---- */
function head(){const id=open,p=prof(id);$('#dmH').innerHTML=`${avh(id)}<div><b>${esc(p.nom||'Inscrit')}</b><small>${on(id)?'En ligne':'Hors ligne'}</small></div>`}
function jump(){const b=$('#dmM'),near=b.scrollHeight-b.scrollTop-b.clientHeight<140;if(near)newN=0;$('#dmJ').hidden=near;$('#dmJ').innerHTML=newN?`<span>${newN} nouveau${newN>1?'x':''}</span> ↓`:'↓'}
function thread(){const id=open,box=$('#dmM');$('#dmB').hidden=true;$('#dmT').hidden=false;head();
const prev=box.scrollTop,near=box.scrollHeight-box.scrollTop-box.clientHeight<140,first=seen!==id;
const L=MSG.filter(m=>m.membres&&m.membres.includes(id));let day='',h='';
L.forEach(m=>{const s=ts(m),d=dl(s),mine=m.de===me.uid;if(d!==day){day=d;h+=`<div class="wd">${esc(d)}</div>`}
h+=`<div class="wr${mine?' me':''}">${avh(mine?me.uid:id,1)}<div class="wb">${esc(m.t)}<time>${hm(s)}${mine?(m.lu?' ✓✓':' ✓'):''}</time></div></div>`});
box.innerHTML=h||'<p class="mu" style="margin:auto;text-align:center">Écrivez le premier message.</p>';
const last=L[L.length-1],add=L.length-lastN;
if(first||near||(last&&last.de===me.uid)){box.scrollTop=box.scrollHeight;newN=0}else{box.scrollTop=prev;if(add>0)newN+=add}
seen=id;lastN=L.length;jump()}
function openT(id){open=id;seen=null;lastN=0;newN=0;try{history.pushState({dm:1},'')}catch(e){}draw();markRead();setTimeout(()=>{const i=$('#dmI');i&&i.focus()},60)}
function closeT(){open=null;seen=null;draw()}
$('#prv').addEventListener('click',e=>{
if(e.target.closest('[data-bot]')){$('#bBot').click();return}
const o=e.target.closest('[data-o]');if(o){openT(o.dataset.o);return}
if(e.target.closest('#dmK')){if(history.state&&history.state.dm)history.back();else closeT()}});
addEventListener('popstate',()=>{if(open)closeT()});
$('#dmM').addEventListener('scroll',jump);
$('#dmJ').onclick=()=>{const b=$('#dmM');newN=0;b.scrollTo({top:b.scrollHeight,behavior:'smooth'})};
async function send(){const i=$('#dmI'),t=i.value.trim();if(!t||!open)return;i.value='';i.focus();try{await db.collection('messages').add({de:me.uid,a:open,membres:[me.uid,open],nom:user,t:t.slice(0,1000),lu:false,cree:TS()})}catch(e){alert(e&&e.code==='permission-denied'?'Messages privés pas encore activés : ajoutez les règles Firebase.':'Message non envoyé.')}}
$('#dmS').onclick=send;$('#dmI').onkeydown=e=>{if(e.key==='Enter')send()};

/* ---- Présence et abonnements ---- */
function beat(){if(!me)return;db.collection('profils').doc(me.uid).set({nom:user,photo:me.photoURL||'',vu:Date.now()},{merge:true}).catch(()=>{})}
function start(){stop();init=false;
uM=db.collection('messages').where('membres','array-contains',me.uid).limit(300).onSnapshot(s=>{MSG=s.docs.map(d=>({id:d.id,...d.data()}));MSG.sort((x,y)=>ts(x)-ts(y));setBadge();
if(init&&s.docChanges().some(c=>{const d=c.doc.data();return c.type==='added'&&d.a===me.uid&&!(open&&d.de===open&&vis())}))ding();init=true;
if(!$('#prv').hidden)draw();markRead()},()=>{});
uP=db.collection('profils').limit(200).onSnapshot(s=>{PRO={};s.docs.forEach(d=>PRO[d.id]=d.data());if(!$('#prv').hidden){open?head():draw()}},()=>{});
beat();hb=setInterval(beat,6e4)}
function stop(){[uM,uP].forEach(f=>f&&f());uM=uP=null;clearInterval(hb);MSG=[];PRO={};open=null;seen=null;$('#dmT').hidden=true;badge('#pb',0);badge('#db',0);document.title='Singandu Academia';try{navigator.clearAppBadge&&navigator.clearAppBadge()}catch(e){}}
document.addEventListener('visibilitychange',()=>{if(!document.hidden){beat();markRead()}});
auth.onAuthStateChanged(u=>{u?start():stop()});
})();
