// m-splash.js : écran de démarrage + apparition douce des sections
(function(){
document.documentElement.classList.add('js');
// apparition des blocs au défilement
const rv=[...document.querySelectorAll('.rv')],show=e=>e.classList.add('in');
if('IntersectionObserver'in window){const io=new IntersectionObserver(l=>l.forEach(x=>{if(x.isIntersecting){show(x.target);io.unobserve(x.target)}}),{threshold:.12});rv.forEach(e=>io.observe(e))}else rv.forEach(show);
setTimeout(()=>rv.forEach(show),5000);
// écran de démarrage
const sp=document.getElementById('splash');if(!sp)return;
try{if(sessionStorage.getItem('sg')){sp.remove();return}}catch(e){}
const f=document.getElementById('spf'),p=document.getElementById('spp'),t=document.getElementById('spt'),r=sp.querySelector('.c1');
const ok={load:document.readyState==='complete',fonts:false,auth:false};
addEventListener('load',()=>ok.load=true);
(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(()=>ok.fonts=true,()=>ok.fonts=true);
try{auth.onAuthStateChanged(()=>ok.auth=true)}catch(e){ok.auth=true}
const T0=Date.now();let v=0,done=false;
function end(){if(done)return;done=true;try{sessionStorage.setItem('sg','1')}catch(e){}sp.classList.add('end');setTimeout(()=>sp.remove(),700)}
function tick(){
const n=Date.now()-T0,all=ok.load&&ok.fonts&&ok.auth,got=(ok.load+ok.fonts+ok.auth)/3;
const goal=all?100:Math.min(92,8+got*70+Math.min(14,n/400));
v+=(goal-v)*.12;if(all&&v>99)v=100;
const q=Math.round(v);f.style.width=q+'%';p.textContent=q+'%';r.style.strokeDashoffset=1-q/100;
t.textContent=q<35?'Démarrage de l’application…':q<70?'Chargement de vos formations…':q<100?'Connexion sécurisée…':'Bienvenue !';
if(q>=100&&n>1300)return setTimeout(end,250);
if(n>7000)return end();
requestAnimationFrame(tick)}
tick()})();
