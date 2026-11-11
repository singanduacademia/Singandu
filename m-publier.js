// m-publier.js
// ---- publication des membres ----
(function(){let img='';const F=$('#cpF'),P=$('#cpP'),T=$('#cpT'),B=$('#cpB'),M=$('#cpM');
F.onchange=async()=>{const f=F.files[0];if(!f)return;try{img=await shrink(f);P.src=img;P.hidden=false}catch(e){img='';wait(M,'Photo illisible.')}};
B.onclick=async()=>{const x=T.value.trim();if(!x&&!img)return wait(M,'Écrivez une légende ou ajoutez une photo.');B.disabled=true;
try{await db.collection('posts').add({type:'membre',uid:me.uid,auteur:user,photo:me.photoURL||'',titre:'',texte:x,exp:0,bg:'',date:'',image:img,video:'',comOk:true,shareOk:false,likes:[],c:[],cree:TS()});T.value='';img='';P.hidden=true;F.value='';wait(M,'Publié.');loadPosts()}
catch(e){wait(M,e&&e.code==='permission-denied'?'Publication pas encore activée : ajoutez la règle Firebase.':'Échec de la publication.')}B.disabled=false};
auth.onAuthStateChanged(u=>{if(u)$('#cpA').innerHTML=u.photoURL?`<img class="av" src="${esc(u.photoURL)}" alt="">`:`<span class="av">${esc((u.displayName||u.email||'M')[0].toUpperCase())}</span>`})})();

