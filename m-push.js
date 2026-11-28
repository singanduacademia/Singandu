// m-push.js (v1) — notifications push (Chrome, Android) : même téléphone verrouillé
(function(){
const PUB='BPVhQpAHHFSicyKn1pJkWB9N1eMn1Ek75NUYWJfdqMTvjtV7nUVGxlj44Pxj05Gko0-sbTJumj860oLdaQVf8pU';   // clé publique VAPID (la même que dans functions/index.js)
const OK='serviceWorker' in navigator&&'PushManager' in window&&'Notification' in window&&PUB.length>40;
const k64=s=>{const r=(s+'='.repeat((4-s.length%4)%4)).replace(/-/g,'+').replace(/_/g,'/'),a=atob(r);return Uint8Array.from([...a].map(c=>c.charCodeAt(0)))};
async function sub(){const u=auth.currentUser;if(!u)return;const reg=await navigator.serviceWorker.ready;
let s=await reg.pushManager.getSubscription();if(!s)s=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:k64(PUB)});
const id=btoa(s.endpoint).replace(/[^a-zA-Z0-9]/g,'').slice(-40);
await db.collection('pushsubs').doc(id).set({uid:u.uid,sub:JSON.stringify(s.toJSON()),cree:TS()})}
// ligne « Notifications » dans l'onglet Compte
const P=document.querySelector('[data-p="acc"]');
if(P&&OK){const L=P.querySelector('.setl'),hs=L?L.querySelectorAll('.sh'):[];
if(L&&hs.length){const sh=document.createElement('div');sh.className='sh';sh.textContent='Notifications';
const c=document.createElement('div');c.className='card setg';const b=document.createElement('button');b.type='button';b.className='srow';c.append(b);
const lab=()=>{b.textContent=Notification.permission==='granted'?'🔔 Notifications activées':Notification.permission==='denied'?'🔕 Bloquées : autorisez-les dans les réglages du navigateur':'🔔 Activer les notifications'};lab();
b.onclick=async()=>{try{if(Notification.permission==='denied')return;const p=await Notification.requestPermission();lab();if(p==='granted')await sub()}catch(e){b.textContent='Impossible d’activer les notifications'}};
hs[hs.length-1].before(sh,c)}}
// Invitation à l'ouverture : une bannière propose d'activer les notifications (2 fois au maximum si « Plus tard »)
function ask(){if(document.getElementById('spq'))return;const d=document.createElement('div');d.id='spq';
d.style.cssText='position:fixed;left:12px;right:12px;bottom:calc(env(safe-area-inset-bottom,0px) + 86px);z-index:9998;background:linear-gradient(135deg,#1b2a8a,#6a1fb0);color:#fff;border-radius:16px;padding:14px;display:flex;gap:10px;align-items:center;box-shadow:0 8px 24px rgba(0,0,0,.35)';
d.innerHTML='<span style="font-size:1.6rem">🔔</span><div style="flex:1;font-size:.9rem"><b>Restez informé</b><br>Recevez les annonces et les messages de votre formateur.</div><button type="button" id="spqY" style="border:0;border-radius:999px;background:#fff;color:#1b2a8a;font-weight:700;padding:9px 14px;cursor:pointer">Activer</button><button type="button" id="spqN" aria-label="Plus tard" style="border:0;background:transparent;color:#fff;font-size:1.2rem;cursor:pointer">✕</button>';
document.body.appendChild(d);
d.querySelector('#spqY').onclick=async()=>{d.remove();try{if(await Notification.requestPermission()==='granted')await sub()}catch(e){}};
d.querySelector('#spqN').onclick=()=>{d.remove();try{localStorage.setItem('sa_pq',String((+localStorage.getItem('sa_pq')||0)+1))}catch(e){}}}
if(OK)auth.onAuthStateChanged(u=>{if(!u)return;if(Notification.permission==='granted')sub().catch(()=>{});
else if(Notification.permission==='default'){let n=0;try{n=+localStorage.getItem('sa_pq')||0}catch(e){}if(n<2)setTimeout(ask,4000)}});
})();
