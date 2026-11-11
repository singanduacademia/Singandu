// m-accueil.js : accueil animé (sections qui défilent) + boutons d'action
(function(){
const WA='243860269169',TEL='+243860269169';
const SCENES=[
{tag:'Formation',titre:'Formation en informatique',texte:'Web, maintenance, bureautique, bases de données : à domicile, en ligne ou au centre, avec certificat.',img:'enseigner.jpg',
 b:[{l:'Voir les formations',go:'form'},{l:'Poser une question',wa:'Bonjour, je souhaite des informations sur vos formations en informatique.',alt:1}]},
{tag:'Dépannage',titre:'Réparation d’ordinateurs',texte:'Pannes logicielles ou matérielles : diagnostic, réparation et conseils. Consultation à 5 $.',img:'tech.jpg',
 b:[{l:'Demander une réparation',wa:'Bonjour, je souhaite une réparation de mon ordinateur. Voici la panne : '},{l:'Appeler',tel:TEL,alt:1}]},
{tag:'Mémoires',titre:'Encadrement de mémoires',texte:'Un accompagnement pas à pas pour réaliser, rédiger et mettre en forme votre mémoire ou vos travaux.',img:'conf.jpg',
 b:[{l:'Solliciter un accompagnement',wa:'Bonjour, je souhaite un accompagnement pour mon mémoire.'},{l:'En savoir plus',wa:'Bonjour, pouvez-vous m’expliquer comment se passe l’encadrement de mémoire ?',alt:1}]},
{tag:'Projets',titre:'Accompagnement de projets informatiques',texte:'De l’idée à la réalisation : conseils, conception et mise en œuvre de votre projet.',img:'code.jpg',
 b:[{l:'Parler de mon projet',wa:'Bonjour, j’ai un projet informatique et je souhaite être accompagné.'}]},
{tag:'Étudiants',titre:'Étudiants et finalistes',texte:'Nouveaux étudiants ou finalistes : rejoignez la communauté, suivez les annonces et posez vos questions.',img:'gagner.jpg',
 b:[{l:'Créer mon espace',go:'home'}]}];
const HOLD=7000,OUT=700,box=document.getElementById('sc'),dts=document.getElementById('sd'),land=document.getElementById('land');if(!box)return;
const wa=m=>'https://wa.me/'+WA+'?text='+encodeURIComponent(m);
// liens WhatsApp des cartes de services
document.querySelectorAll('[data-wa]').forEach(a=>{a.href=wa(a.dataset.wa);a.target='_blank';a.rel='noopener'});
SCENES.forEach(s=>{const d=document.createElement('div');let i=1;d.className='sl';
let h='<img class="ph el" style="--i:0" alt="" src="'+s.img+'" onerror="this.onerror=null;this.src=\'logo.jpg\'"><div class="tx2">';
h+=`<span class="tg el" style="--i:${i++}">${s.tag}</span><h2 class="el" style="--i:${i++}">${s.titre}</h2><p class="el" style="--i:${i++}">${s.texte}</p><div class="bts el" style="--i:${i++}">`;
s.b.forEach(b=>{const c='bt'+(b.alt?' alt':'');
h+=b.tel?`<a class="${c}" href="tel:${b.tel}">${b.l}</a>`:b.wa?`<a class="${c}" href="${wa(b.wa)}" target="_blank" rel="noopener">${b.l}</a>`:`<a class="${c}" href="#" data-go="${b.go}">${b.l}</a>`});
d.innerHTML=h+'</div></div>';box.appendChild(d);dts.appendChild(document.createElement('i'))});
const sl=[...box.children],pt=[...dts.children];let t;
function play(n){sl.forEach((x,k)=>{x.classList.remove('on','out');pt[k].classList.remove('on')});void sl[n].offsetWidth;sl[n].classList.add('on');pt[n].classList.add('on');
t=setTimeout(()=>{sl[n].classList.add('out');t=setTimeout(()=>play((n+1)%sl.length),OUT)},HOLD)}
pt.forEach((p,k)=>p.onclick=()=>{clearTimeout(t);play(k)});play(0);
// boutons « go » : on passe par la connexion Google, puis on ouvre la bonne page
let WANT=null,viaScene=false;const go=document.getElementById('go');
go.addEventListener('click',()=>{if(!viaScene)WANT=null});
land.addEventListener('click',e=>{const a=e.target.closest('[data-go]');if(!a)return;e.preventDefault();
if(me){show(a.dataset.go);return}
WANT=a.dataset.go;viaScene=true;go.click();viaScene=false});
auth.onAuthStateChanged(u=>{if(u&&WANT){const w=WANT;WANT=null;show(w)}})})();
