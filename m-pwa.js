// m-pwa.js : installation facile de l'application (Android, iPhone, ordinateur)
(function(){
let ip=null;
const standalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
const ios=/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
const snoozed=()=>{try{return +localStorage.getItem('ib')>Date.now()}catch(e){return false}};
function rm(){const b=document.getElementById('ibar');if(b)b.remove()}
function bar(){if(standalone()||snoozed()||document.getElementById('ibar'))return;
const d=document.createElement('div');d.id='ibar';
d.innerHTML='<img src="logo.jpg" alt=""><div><b>Installer Singandu Academia</b><small>Plein écran, accès rapide, alertes de messages</small></div><button type="button" id="ibY">Installer</button><button type="button" id="ibN" class="ghost" aria-label="Plus tard">✕</button>';
document.body.appendChild(d)}
function help(){if(document.getElementById('ihelp'))return;
const o=document.createElement('div');o.id='ihelp';o.className='ihelp';
const etapes=ios?['Ouvrez ce site dans <b>Safari</b>.','Touchez le bouton <b>Partager</b> (le carré avec une flèche vers le haut).','Choisissez <b>« Sur l’écran d’accueil »</b>, puis <b>Ajouter</b>.']
:['Touchez le menu <b>⋮</b> en haut à droite du navigateur.','Choisissez <b>« Installer l’application »</b> ou <b>« Ajouter à l’écran d’accueil »</b>.','Confirmez : l’icône Singandu apparaît sur votre écran d’accueil.'];
o.innerHTML='<div class="ih"><h3>Installer l’application</h3><ol>'+etapes.map(x=>'<li>'+x+'</li>').join('')+'</ol><p class="mu">Une fois installée, l’application s’ouvre en plein écran comme un vrai logiciel.</p><button type="button" id="ihX">Compris</button></div>';
document.body.appendChild(o)}
async function install(){if(ip){ip.prompt();try{const r=await ip.userChoice;if(r&&r.outcome==='accepted'){ip=null;rm()}}catch(e){}return}help()}
addEventListener('beforeinstallprompt',e=>{e.preventDefault();ip=e;bar()});
addEventListener('appinstalled',()=>{ip=null;rm()});
document.addEventListener('click',e=>{
const t=e.target;
if(t.closest('#ibY')){e.preventDefault();install();return}
if(t.closest('#ibN')){try{localStorage.setItem('ib',Date.now()+3*864e5)}catch(x){}rm();return}
if(t.closest('#ihX')||t.id==='ihelp'){const h=document.getElementById('ihelp');h&&h.remove();return}
if(t.closest('#bInst,#bInst2')){e.preventDefault();e.stopImmediatePropagation();install()}},true);
// iPhone : pas d'événement automatique, on propose les étapes dès l'ouverture
if(ios&&!standalone())setTimeout(bar,2500);
else if(!standalone())setTimeout(()=>{if(!ip)bar()},4000);
})();

// ---- mise à jour automatique : plus besoin de désinstaller ----
(function(){if(!('serviceWorker' in navigator))return;
const had=!!navigator.serviceWorker.controller;let done=false;
const rl=()=>{if(done)return;done=true;location.reload()};
navigator.serviceWorker.addEventListener('controllerchange',()=>{if(had)rl()});
navigator.serviceWorker.addEventListener('message',e=>{if(had&&e.data&&e.data.maj)rl()});
navigator.serviceWorker.register('sw.js',{updateViaCache:'none'}).catch(()=>{});
const chk=()=>navigator.serviceWorker.getRegistration().then(r=>r&&r.update()).catch(()=>{});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)chk()});
setInterval(chk,30*60*1000);chk();
})();
