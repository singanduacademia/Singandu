// m-install.js
let dp;addEventListener('beforeinstallprompt',e=>{e.preventDefault();dp=e});
const instOK=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
function instGo(){if(dp){dp.prompt();dp.userChoice.catch(()=>{}).then(()=>{dp=null});return}
const u=navigator.userAgent,ios=/iPhone|iPad|iPod/i.test(u),an=/Android/i.test(u);
info('<h3>Installer l’application</h3>'+(ios?'<p><b>iPhone / iPad (Safari)</b> : touchez le bouton Partager, puis « Sur l’écran d’accueil ».</p>':an?'<p><b>Android (Chrome)</b> : touchez le menu ⋮, puis « Installer l’application ».</p>':'<p><b>Ordinateur (Chrome ou Edge)</b> : cliquez sur l’icône d’installation à droite de la barre d’adresse, ou sur le menu ⋮ puis « Installer Singandu Academia ».</p>')+'<p class="mu">Une fois installée, l’application s’ouvre comme un vrai logiciel, avec son icône.</p>')}
$('#bInst').onclick=instGo;$('#bInst2').onclick=instGo;
const hideInst=()=>{$('#bInst').hidden=true;$('#bInst2').hidden=true};if(instOK())hideInst();addEventListener('appinstalled',hideInst);
if('serviceWorker'in navigator&&location.protocol==='https:')navigator.serviceWorker.register('sw.js').catch(()=>{});
