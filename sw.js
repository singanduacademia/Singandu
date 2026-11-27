const V='singandu-v20';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(
caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x))))
.then(()=>self.clients.claim())
.then(()=>self.clients.matchAll({type:'window',includeUncontrolled:true}))
.then(l=>l.forEach(c=>c.postMessage({maj:V})))));
// Réseau d'abord, SANS le cache HTTP du navigateur (GitHub Pages garde 10 min) ; le cache ne sert que hors connexion
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
e.respondWith(fetch(r,{cache:'no-store'}).then(x=>{if(x&&x.ok){const c=x.clone();caches.open(V).then(h=>h.put(r,c))}return x}).catch(()=>caches.match(r).then(x=>x||caches.match('index.html'))))});

self.addEventListener('notificationclick',e=>{e.notification.close();const de=e.notification.data&&e.notification.data.de;
e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(l=>{for(const c of l){if('focus' in c){c.postMessage({open:de});return c.focus()}}return clients.openWindow('./')}))});
