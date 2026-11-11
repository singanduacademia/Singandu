// m-live.js

// ---- v8 ----
const TT={home:'Accueil',form:'Formations',chat:'Discussion',nt:'Alertes',acc:'Mon compte',adm:'Administration'};
let u1=null,u2=null,AC,chN=0,chOpen=false,ndInit=false;
addEventListener('click',()=>{if(!AC)try{AC=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}},{once:true});
function ding(){try{navigator.vibrate&&navigator.vibrate(120);if(!AC)return;const o=AC.createOscillator(),g=AC.createGain();o.frequency.value=880;g.gain.setValueAtTime(.18,AC.currentTime);g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+.45);o.connect(g);g.connect(AC.destination);o.start();o.stop(AC.currentTime+.45)}catch(e){}}
function badge(id,n){const b=$(id);b.textContent=n>9?'9+':n;b.hidden=!n}
function startLive(){stopLive();ndInit=false;
u1=db.collection('notifs').where('to','in',['all',me.uid]).limit(40).onSnapshot(s=>{ND=s.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(b.cree?.seconds||0)-(a.cree?.seconds||0));let l=0;try{l=+localStorage.getItem('nv')||0}catch(e){}const n=ND.filter(x=>(x.cree?.seconds||0)*1000>l).length,cur=$('.pane.on')?.dataset.p,nom=user.split(' ')[0];badge('#nb',cur==='nt'?0:n);
$('#nl').innerHTML=ND.length?ND.map(x=>`<div class="pc"><b>${esc(x.titre||'Information')}</b><p class="tx">${esc((x.texte||'').replace(/\{nom\}/gi,nom))}</p><small class="mu">${x.cree?x.cree.toDate().toLocaleString('fr-FR'):''}</small></div>`).join(''):'<p class="mu">Aucune alerte pour le moment.</p>';
if(ndInit&&cur!=='nt'&&s.docChanges().some(c=>c.type==='added'))ding();ndInit=true},()=>{});
let ci=false;u2=db.collection('chat').orderBy('cree','desc').limit(1).onSnapshot(s=>{if(ci&&!chOpen&&s.docChanges().some(c=>c.type==='added'&&c.doc.data().uid!==me.uid)){chN++;badge('#cb',chN);ding()}ci=true},()=>{})}
function stopLive(){[u1,u2].forEach(f=>f&&f());u1=u2=null;chN=0}
function th(d){document.documentElement.dataset.th=d?'dark':'';try{localStorage.setItem('th2',d?1:0)}catch(e){}$('#bTh').textContent=d?'Thème clair':'Thème sombre'}
let thd=false;try{thd=localStorage.getItem('th2')==='1'}catch(e){}th(thd);$('#bTh').onclick=()=>th(document.documentElement.dataset.th!=='dark');
function rnStories(){const S=POSTS.filter(p=>p.type==='story'&&p.exp>Date.now());$('#st').hidden=!S.length;$('#st').innerHTML=S.map((p,i)=>`<div class="sl${i?'':' on'}" style="${p.image?`background-image:linear-gradient(rgba(0,0,0,.35),rgba(0,0,0,.35)),url(${p.image})`:`background:${esc(p.bg||'#1c2cb0')}`}"><span>${esc(p.texte||p.titre||'')}</span>${isA?`<button data-sd="${p.id}">✕</button>`:''}</div>`).join('')}
setInterval(()=>{const s=$$('#st .sl');if(s.length<2)return;const i=s.findIndex(x=>x.classList.contains('on'));s[i].classList.remove('on');s[(i+1)%s.length].classList.add('on')},4500);
$('#st').onclick=async e=>{const b=e.target.closest('[data-sd]');if(b&&confirm('Supprimer cette story ?'))try{await db.collection('posts').doc(b.dataset.sd).delete();POSTS=POSTS.filter(x=>x.id!==b.dataset.sd);rnPosts()}catch(x){}};
const ago=t=>{const m=Math.round((Date.now()-t)/6e4);return m<2?'à l’instant':m<60?'il y a '+m+' min':m<1440?'il y a '+Math.round(m/60)+' h':'il y a '+Math.round(m/1440)+' j'};
async function loadAdm2(){try{const s=await db.collection('notifs').limit(30).get();const a=s.docs.map(d=>({id:d.id,...d.data()})).filter(x=>x.to==='all').sort((x,y)=>(y.cree?.seconds||0)-(x.cree?.seconds||0));$('#nsent').innerHTML='<b>Alertes envoyées</b>'+(a.map(x=>`<p>${esc(x.titre)} : ${esc((x.texte||'').slice(0,50))} <button class="ghost" style="padding:2px 10px" data-nd="${x.id}">Supprimer</button></p>`).join('')||'<p class="mu">Aucune.</p>')}catch(e){}
try{const s=await db.collection('etudiants').limit(300).get();const a=s.docs.map(d=>d.data()).sort((x,y)=>(y.vu?.seconds||0)-(x.vu?.seconds||0));$('#ncnt').textContent='('+a.length+')';$('#ins').innerHTML=a.map(x=>`<p><b>${esc(x.nom)}</b> · ${esc(x.email)}<br><small class="mu">Vu ${x.vu?ago(x.vu.seconds*1000):''}</small></p>`).join('')}catch(e){}}
$('#nsent').onclick=async e=>{const b=e.target.closest('[data-nd]');if(b)try{await db.collection('notifs').doc(b.dataset.nd).delete();loadAdm2()}catch(x){}};
