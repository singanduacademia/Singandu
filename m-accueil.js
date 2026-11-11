// m-accueil.js

// ---- accueil animé ----
(function(){
const SCENES=[
{tag:'Nos services',titre:'Réparation d’ordinateurs',texte:'Maintenance informatique et accompagnement de vos projets informatiques.',bt:{l:'Appeler maintenant',tel:'+243860269169'}},
{tag:'Formation',titre:'Formation complète en informatique',texte:'À domicile, en ligne ou en présentiel.',bt:{l:'Voir les formations',go:'form'}},
{tag:'Académique',titre:'Mémoires et travaux académiques',texte:'Un accompagnement pour réaliser vos mémoires et vos travaux informatiques.',bt:{l:'Nous contacter',tel:'+243860269169'}},
{tag:'Étudiants',titre:'Étudiants et finalistes',texte:'Nous accompagnons aussi les nouveaux étudiants et les finalistes.',bt:{l:'S’inscrire',go:'form'}}];
const HOLD=6500,OUT=700,box=document.getElementById('sc'),dts=document.getElementById('sd');if(!box)return;
const ok=[];let last='';
for(let k=1;k<=12;k++){const u='photos/accueil-'+k+'.jpg',im=new Image();im.onload=()=>ok.push(u);im.src=u}
const pick=()=>{const a=ok.length?ok:['teach.jpg'],b=a.filter(u=>u!==last),c=b.length?b:a;last=c[Math.floor(Math.random()*c.length)];return last};
SCENES.forEach(s=>{const d=document.createElement('div');let i=1;d.className='sl';
let h='<img class="ph el" style="--i:0" alt="" src="teach.jpg"><div class="tx2">';
h+=`<span class="tg el" style="--i:${i++}">${s.tag}</span><h2 class="el" style="--i:${i++}">${s.titre}</h2><p class="el" style="--i:${i++}">${s.texte}</p>`;
h+=s.bt.tel?`<a class="bt el" style="--i:${i++}" href="tel:${s.bt.tel}">${s.bt.l}</a>`:`<a class="bt el" style="--i:${i++}" href="#" data-go="${s.bt.go}">${s.bt.l}</a>`;
d.innerHTML=h+'</div>';box.appendChild(d);dts.appendChild(document.createElement('i'))});
const sl=[...box.children],pt=[...dts.children];let t;
function play(n){sl.forEach((x,k)=>{x.classList.remove('on','out');pt[k].classList.remove('on')});sl[n].querySelector('.ph').src=pick();void sl[n].offsetWidth;sl[n].classList.add('on');pt[n].classList.add('on');
t=setTimeout(()=>{sl[n].classList.add('out');t=setTimeout(()=>play((n+1)%sl.length),OUT)},HOLD)}
pt.forEach((p,k)=>p.onclick=()=>{clearTimeout(t);play(k)});play(0);
let WANT=null,viaScene=false;const go=document.getElementById('go');
go.addEventListener('click',()=>{if(!viaScene)WANT=null});
box.addEventListener('click',e=>{const a=e.target.closest('[data-go]');if(!a)return;e.preventDefault();WANT=a.dataset.go;viaScene=true;go.click();viaScene=false});
auth.onAuthStateChanged(u=>{if(u&&WANT){const w=WANT;WANT=null;show(w)}})})();
