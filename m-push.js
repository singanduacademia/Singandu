// m-push.js (v1) — notifications push (Chrome, Android) : même téléphone verrouillé
(function(){
const PUB='COLLEZ_ICI_LA_CLE_PUBLIQUE';   // clé publique VAPID (la même que dans functions/index.js)
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
if(OK)auth.onAuthStateChanged(u=>{if(u&&Notification.permission==='granted')sub().catch(()=>{})});
})();
