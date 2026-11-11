// m-assistant.js
const norm=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
let CUS=[];const KB=[
{k:'prix tarif tarifs cout combien frais payer',r:'Les tarifs s’affichent dans l’onglet Formations : choisissez une formation et son prix apparaît.'},
{k:'formation formations cours apprendre programme',r:'Nous proposons : '+F.map(f=>f[0]).join(', ')+'.'},
{k:'horaire horaires heure heures ouvert',r:'Au centre de 8 h 30 à 16 h 30. En ligne, jusqu’à 22 h 30.'},
{k:'adresse situe lieu centre',r:'Av. Cikapa, Q/Ciaciacia n° 18, commune de la Kanshi, derrière l’école Case MIBA, Mbuji-Mayi.'},
{k:'domicile maison chez',r:'Oui, formation à domicile à Dibindi, Diulu, Kanshi et Bipemba. Le tarif s’affiche après inscription.'},
{k:'certificat attestation diplome',r:'Le certificat s’obtient après la formation complète d’environ 3 mois et au moins 80 % de présence.'},
{k:'telephone smartphone portable ordinateur materiel',r:'Certaines formations (initiation, développement web de base) se suivent même sur téléphone ; les autres demandent un ordinateur.'},
{k:'inscrire inscription compte',r:'Cliquez sur « Connectez-vous pour continuer » : c’est rapide avec Google.'},
{k:'age ans',r:'L’âge minimum est de 15 ans.'},
{k:'depannage reparation panne maintenance',r:'Oui : onglet Formations, rubrique Dépannage, décrivez la panne et envoyez votre demande.'},
{k:'whatsapp contact joindre appeler numero',r:'WhatsApp : +243 860 269 169. Email : singanduacademia@gmail.com.'}];
const bub=(t,me)=>{const r=document.createElement('div');r.className='rw'+(me?' me':'');const b=document.createElement('div');b.className='bu';if(me)b.textContent=t;else{r.innerHTML='<span class="ai">✨</span>';b.innerHTML='<span class="dots"><i></i><i></i><i></i></span>';const w=t.split(' ');setTimeout(()=>{b.textContent='';let i=0;const k=setInterval(()=>{b.textContent=w.slice(0,++i).join(' ');$('#bm').scrollTop=1e5;if(i>=w.length)clearInterval(k)},45)},650)}r.append(b);$('#bm').append(r);$('#bm').scrollTop=1e5};
const toks=q=>norm(q).split(/[^a-z0-9]+/).filter(Boolean);
async function ask(q){q=q.trim();if(!q)return;bub(q,1);const T=toks(q);let best=null,sc=0;[...CUS,...KB].forEach(e=>{const n=norm(e.k).split(/\s+/).filter(w=>T.some(t=>t===w||(w.length>4&&t.length>3&&(t.startsWith(w)||w.startsWith(t))))).length;if(n>sc){sc=n;best=e}});
if(best)bub(best.r);else{bub('Je n’ai pas encore la réponse. Écrivez-nous sur WhatsApp au +243 860 269 169 ; votre question est notée pour que l’assistant apprenne.');try{await db.collection('assistant_inconnu').add({q:q.slice(0,300),cree:firebase.firestore.FieldValue.serverTimestamp()})}catch(e){}}}
['Formations','Prix','Horaires','Domicile','Certificat','Paiement'].forEach(t=>{const b=document.createElement('button');b.className='ghost';b.style.padding='6px 14px';b.textContent=t;b.onclick=()=>ask(t==='Paiement'?'prix payer':t);$('#bq').append(b)});
$('#bBot').onclick=()=>{if(!$('#bm').children.length)bub('Bonjour ! Posez votre question ou choisissez un sujet.');$('#dBot').showModal()};
$('#bs').onclick=()=>{ask($('#bi').value);$('#bi').value=''};$('#bi').onkeydown=e=>{if(e.key==='Enter')$('#bs').click()};
async function loadCus(){try{const s=await db.collection('assistant').limit(200).get();CUS=s.docs.map(d=>({id:d.id,...d.data()}))}catch(e){}}
async function loadAs(){await loadCus();$('#sl').innerHTML=CUS.map(e=>`<p style="margin-top:6px"><span>${esc(e.k)} : ${esc(e.r)}</span> <button class="ghost" style="padding:2px 10px" data-ad="${e.id}">Effacer</button></p>`).join('');
let U=[];try{const s=await db.collection('assistant_inconnu').limit(30).get();U=s.docs.map(d=>({id:d.id,...d.data()}))}catch(e){}
$('#su').innerHTML=U.map(e=>`<p style="margin-top:6px"><span>${esc(e.q)}</span> <button class="ghost" style="padding:2px 10px" data-ur="${e.id}" data-q="${esc(e.q)}">Répondre</button> <button class="ghost" style="padding:2px 10px" data-ux="${e.id}">Effacer</button></p>`).join('')||'<p class="msg">Aucune pour le moment.</p>';
$$('[data-ad]').forEach(b=>b.onclick=async()=>{try{await db.collection('assistant').doc(b.dataset.ad).delete();loadAs()}catch(e){}});
$$('[data-ux]').forEach(b=>b.onclick=async()=>{try{await db.collection('assistant_inconnu').doc(b.dataset.ux).delete();loadAs()}catch(e){}});
$$('[data-ur]').forEach(b=>b.onclick=()=>{$('#sk').value=toks(b.dataset.q).filter(w=>w.length>3).join(' ');$('#sr').focus();$('#sr').dataset.u=b.dataset.ur})}
$('#bSa').onclick=async()=>{const k=$('#sk').value.trim(),r=$('#sr').value.trim(),m=$('#ms');if(!k||!r)return wait(m,'Ajoutez des mots-clés et une réponse.');try{await db.collection('assistant').add({k,r,cree:firebase.firestore.FieldValue.serverTimestamp()});const u=$('#sr').dataset.u;if(u){try{await db.collection('assistant_inconnu').doc(u).delete()}catch(e){}delete $('#sr').dataset.u}$('#sk').value='';$('#sr').value='';wait(m,'Ajouté : l’assistant connaît cette réponse.');loadAs()}catch(e){wait(m,'Échec de l’enregistrement.')}};
if(db)loadCus();
