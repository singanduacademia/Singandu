// m-admin.js
$('#pk').onchange=()=>{const a=$('#pk').value;$('#px').maxLength=a==='annonce'?160:a==='story'?140:5000;$('#pdw').hidden=a!=='session';$('#pbw').hidden=a!=='story'};
// Prix et fin de promotion : champs ajoutés pour les annonces (affichés sur le site)
(function(){const px=$('#px');if(!px||$('#pap'))return;const L=px.closest('label')||px;
L.insertAdjacentHTML('afterend','<div id="pap" hidden><label>Prix avant la promotion ($, facultatif)<input id="pa1" inputmode="decimal"></label><label>Prix promotionnel ($, facultatif)<input id="pa2" inputmode="decimal"></label><label>Fin de la promotion (facultatif)<input id="pa3" type="datetime-local"></label></div>');
const sh=()=>{$('#pap').hidden=$('#pk').value!=='annonce'};$('#pk').addEventListener('change',sh);sh()})();
// Compression locale : renvoie une image JPEG en texte, sous ~450 Ko (limite Firestore : 1 Mo par document)
async function miniPost(file,maxW=1100){
  let bmp;try{bmp=await createImageBitmap(file)}catch(e){throw new Error('image-illisible')}
  const r=Math.min(1,maxW/bmp.width),c=document.createElement('canvas');
  c.width=Math.round(bmp.width*r);c.height=Math.round(bmp.height*r);
  c.getContext('2d').drawImage(bmp,0,0,c.width,c.height);
  let q=.78,out=c.toDataURL('image/jpeg',q);
  while(out.length>450000&&q>.35){q-=.1;out=c.toDataURL('image/jpeg',q)}
  if(out.length>900000)throw new Error('image-trop-lourde');
  return out}
$('#bPub').onclick=async()=>{const m=$('#mp'),B=$('#bPub'),k=$('#pk').value,t=$('#pt').value.trim(),x=$('#px').value.trim(),f=$('#pf').files[0];if(!t&&!x)return wait(m,'Ajoutez un titre ou un texte.');if(k==='session'&&!$('#pd').value)return wait(m,'Ajoutez la date.');
B.disabled=true;wait(m,f?'Préparation de la photo…':'Publication…');
try{const img=f?await miniPost(f):'';
await db.collection('posts').add({type:k,titre:t,texte:x,exp:k==='story'?Date.now()+864e5:0,bg:($('#pb')||{}).value||'',date:k==='session'?($('#pd').value||''):'',image:img,video:($('#pv')||{}).value?$('#pv').value.trim():'',comOk:!!($('#pc')&&$('#pc').checked),shareOk:!!($('#ps')&&$('#ps').checked),likes:[],c:[],cree:TS()});
let site='';
if(k==='annonce'||k==='session'){try{const pa=parseFloat(String(($('#pa1')||{}).value||'').replace(',','.')),pp=parseFloat(String(($('#pa2')||{}).value||'').replace(',','.')),pf=($('#pa3')||{}).value||'';
const an={tag:k==='session'?'Session':(!isNaN(pp)?'Promotion':'Annonce'),titre:t||'Annonce',texte:x,publie:true,cree:TS()};
if(img)an.image=img;if(k==='session'&&$('#pd').value)an.date=new Date($('#pd').value).toLocaleString('fr',{dateStyle:'long',timeStyle:'short'});
if(k==='annonce'&&!isNaN(pp)){an.prixPromo=pp;if(!isNaN(pa))an.prixAvant=pa;if(pf)an.fin=new Date(pf).toISOString()}
const vv=($('#pv')||{}).value?$('#pv').value.trim():'';if(vv&&/^https?:/.test(vv)){an.lien=vv;an.bouton='Voir la vidéo'}
await db.collection('annonces').add(an);site=' Visible aussi sur le site.'}catch(e2){console.error('Annonce site :',e2);site=' Attention : pas envoyée sur le site ('+((e2&&e2.code)||'erreur')+').'}}
wait(m,'Publié dans l’application.'+site);['pa1','pa2','pa3'].forEach(i=>{const e=$('#'+i);if(e)e.value=''});['pt','px','pd','pv'].forEach(i=>{const e=$('#'+i);if(e)e.value=''});$('#pf').value='';loadPosts()}
catch(e){const c=(e&&(e.code||e.message))||'inconnue';console.error('Publication :',e);
const h={'permission-denied':'accès refusé : reconnectez-vous avec le compte admin (e-mail vérifié) et vérifiez les règles « posts »','image-illisible':'photo illisible, essayez un autre fichier','image-trop-lourde':'photo trop lourde même compressée','unavailable':'connexion instable, réessayez','invalid-argument':'donnée invalide dans le formulaire'}[e&&(e.code||e.message)]||'';
wait(m,'Échec ('+c+')'+(h?' : '+h:'')+'.')}
finally{B.disabled=false}};
$('#bNo').onclick=async()=>{const t=$('#n2').value.trim();if(!t)return wait($('#mn'),'Écrivez un message.');try{await db.collection('notifs').add({to:'all',titre:$('#n1').value.trim()||'Information',texte:t,cree:TS()});$('#n1').value=$('#n2').value='';wait($('#mn'),'Envoyée à tous les inscrits.')}catch(e){wait($('#mn'),'Échec de l’envoi.')}};
$('#bSj').onclick=async()=>{try{await db.collection('config').doc('sujet').set({t:$('#sj2').value.trim()});$('#sj2').value=''}catch(e){}};
async function loadAdm(){try{const s=await db.collection('demandes').limit(60).get();const a=s.docs.map(d=>({id:d.id,...d.data()})).sort((x,y)=>(y.cree?.seconds||0)-(x.cree?.seconds||0));$('#rq').innerHTML=a.map(d=>`<div class="pc" style="box-shadow:none;background:var(--sky)"><b>${esc(d.nom)}</b> · ${esc(d.formation)} ${d.prix?'('+d.prix+' $)':''}<br><small>${esc(d.email||'')} ${esc(d.tel||'')} ${esc(d.note||'')}</small><br><b>${esc(d.statut)}</b> <button data-r="${d.id}" data-u="${d.uid}" data-f="${esc(d.formation)}" data-v="1">Valider</button> <button class="ghost" data-r="${d.id}" data-u="${d.uid}" data-f="${esc(d.formation)}" data-v="0">Refuser</button></div>`).join('')||'<p class="mu">Aucune demande.</p>'}catch(e){}loadAs();loadAdm2()}
$('#rq').onclick=async e=>{const b=e.target.closest('[data-r]');if(!b)return;const v=b.dataset.v==='1';try{await db.collection('demandes').doc(b.dataset.r).update({statut:v?'validée':'refusée'});await db.collection('notifs').add({to:b.dataset.u,titre:'Votre demande',texte:'Votre demande « '+b.dataset.f+' » a été '+(v?'validée.':'refusée. Contactez-nous pour plus de détails.'),cree:TS()});loadAdm()}catch(x){alert('Échec.')}};
