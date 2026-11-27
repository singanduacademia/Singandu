// m-compte.js (v1) — onglet Compte façon « Paramètres » : profil discret, réglages alignés, une seule liste claire
(function(){
const COL=[['#1c2cb0','Bleu'],['#6a1fb0','Violet'],['#0f7a4a','Vert'],['#b3261e','Rouge'],['#b85500','Orange']];
const setCol=x=>document.documentElement.style.setProperty('--blue',x);
try{const s=localStorage.getItem('sa_col');if(s)setCol(s)}catch(e){}
const P=document.querySelector('[data-p="acc"]');if(!P)return;
document.head.insertAdjacentHTML('beforeend',`<style>
[data-p="acc"] .sh{font-size:.72rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;opacity:.7;margin:18px 8px 6px}
[data-p="acc"] .card.setg{padding:2px 14px}
[data-p="acc"] .srow{display:flex!important;align-items:center;gap:12px;width:100%;text-align:left;background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;color:inherit!important;padding:15px 2px!important;font:inherit;font-weight:600;border-bottom:1px solid rgba(128,128,128,.25)!important;cursor:pointer;min-height:0;margin:0}
[data-p="acc"] .srow:last-child{border-bottom:0!important}
[data-p="acc"] .srow::after{content:'›';margin-left:auto;opacity:.5;font-size:1.4em;line-height:1}
[data-p="acc"] .srow.out{color:#e5484d!important}[data-p="acc"] .srow.out::after{content:''}
#bSh::before{content:'📤'}#bSite::before{content:'🌐'}#bInst::before{content:'📲'}#bOut::before{content:'🚪'}
.spcl{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 0}.spcl div{display:flex;gap:10px}.spcl .sw{width:34px;height:34px;padding:0;border-radius:50%;border:3px solid transparent}.spcl .sw.on{border-color:var(--ink)}
.spf{display:flex;align-items:center;gap:14px}
.spa{width:58px;height:58px;border-radius:50%;overflow:hidden;background:#2f5be6;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:22px;flex:none}.spa img{width:100%;height:100%;object-fit:cover}
.spt{flex:1;min-width:0}.spt h3{margin:0 0 2px}.spe{display:flex;align-items:center;gap:8px;font-size:.88rem;opacity:.8}.spe button{border:0;background:transparent;color:inherit;text-decoration:underline;font:inherit;font-size:.82rem;cursor:pointer;padding:0}
#sps{position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.45);display:flex;align-items:flex-start;justify-content:flex-end;padding:calc(env(safe-area-inset-top,0px) + 64px) 12px 0}
#sps .spc{width:min(320px,92vw);background:#fff;color:#14183a;border-radius:16px;padding:16px;box-shadow:0 10px 30px rgba(0,0,0,.35)}
#sps .spt h3{color:#14183a}#sps .spc button.b{display:block;width:100%;text-align:left;border:0;background:#f2f4ff;color:#1b2a8a;font:inherit;font-weight:600;padding:12px 14px;border-radius:10px;margin-top:8px;cursor:pointer}#sps .spc button.b.out{color:#d93025;background:#fff0f0}
</style>`);
const q=s=>document.querySelector(s),nm=q('#nm'),em=q('#em'),av=q('#av'),my=q('#my');
// doublon « Visiter notre site » sans identifiant
P.querySelectorAll('button').forEach(b=>{if(!b.id&&/site=1/.test(b.getAttribute('onclick')||''))b.remove()});
const mask=e=>{const i=e.indexOf('@');return i>0?e.slice(0,Math.min(2,i))+'•••'+e.slice(i):e};
let shown=false;const emM=document.createElement('span');
const real=()=>(em&&em.textContent||'').trim();
const upd=()=>{emM.textContent=shown?real():mask(real());[...document.querySelectorAll('.spA')].forEach(a=>{a.innerHTML=(av&&av.querySelector('img'))?av.innerHTML:((nm&&nm.textContent||'?').trim().charAt(0).toUpperCase())})};
// Carte profil
const pf=document.createElement('div');pf.className='card spf';
const sa=document.createElement('span');sa.className='spa spA';
const st=document.createElement('div');st.className='spt';
const row=document.createElement('div');row.className='spe';
const tg=document.createElement('button');tg.type='button';tg.textContent='Afficher';
tg.onclick=()=>{shown=!shown;tg.textContent=shown?'Masquer':'Afficher';upd()};
row.append(emM,tg);if(nm)st.append(nm);st.append(row);pf.append(sa,st);
if(em)em.hidden=true;
// Sections
const sec=t=>{const d=document.createElement('div');d.className='sh';d.textContent=t;return d};
const grp=(...bs)=>{const c=document.createElement('div');c.className='card setg';bs.filter(Boolean).forEach(b=>{b.classList.add('srow');c.append(b)});return c};
const bSh=q('#bSh'),bSite=q('#bSite'),bInst=q('#bInst'),bTh=q('#bTh'),bOut=q('#bOut');
if(bOut)bOut.classList.add('out');
const oldFirst=P.firstElementChild;
const reqCard=my?my.closest('.card'):null;
const wrap=document.createElement('div');wrap.className='setl';
wrap.append(pf);
if(reqCard)wrap.append(sec('Mes demandes'),reqCard);
const cs=document.createElement('div');cs.className='card';let cur='';try{cur=localStorage.getItem('sa_col')||''}catch(e){}
cs.innerHTML='<div class="spcl"><b>Couleur</b><div>'+COL.map(x=>`<button type="button" class="sw${(cur||COL[0][0])===x[0]?' on':''}" data-c="${x[0]}" style="background:${x[0]}" aria-label="${x[1]}"></button>`).join('')+'</div></div>';
cs.onclick=e=>{const b=e.target.closest('[data-c]');if(!b)return;setCol(b.dataset.c);try{localStorage.setItem('sa_col',b.dataset.c)}catch(x){}cs.querySelectorAll('.sw').forEach(s=>s.classList.toggle('on',s===b))};
wrap.append(sec('Apparence'),grp(bTh),cs,sec('Application'),grp(bInst,bSh,bSite),sec('Session'),grp(bOut));
const h=reqCard&&reqCard.querySelector('h3');if(h)h.hidden=true;
P.prepend(wrap);
[...P.children].forEach(c=>{if(c!==wrap&&!c.contains(wrap)&&c.classList.contains('card')&&!c.querySelector('button,#my,#nm'))c.remove()});
if(oldFirst&&oldFirst!==wrap&&oldFirst.parentNode===P&&!oldFirst.querySelector('#nm,#my,button'))oldFirst.remove();
P.querySelectorAll(':scope > .card.modes').forEach(c=>{if(!c.children.length)c.remove()});
// Suivi des changements (nom, e-mail, photo)
const mo=new MutationObserver(upd);[em,nm,av].forEach(x=>x&&mo.observe(x,{childList:true,characterData:true,subtree:true}));upd();
// Toucher la petite photo en haut : volet d'informations
if(av){av.style.cursor='pointer';
av.addEventListener('click',e=>{e.stopImmediatePropagation();e.preventDefault();if(q('#sps'))return;
const o=document.createElement('div');o.id='sps';
o.innerHTML=`<div class="spc"><div class="spf"><span class="spa spA"></span><div class="spt"><h3>${(nm&&nm.textContent||'').replace(/</g,'&lt;')}</h3><div class="spe"><span id="spM"></span><button type="button" id="spT">Afficher</button></div></div></div><button class="b" id="spP" type="button">⚙️ Paramètres</button><button class="b out" id="spO" type="button">🚪 Se déconnecter</button></div>`;
document.body.appendChild(o);const cl=()=>{o.remove()};
let sh=false;const m=o.querySelector('#spM');m.textContent=mask(real());
o.querySelector('#spT').onclick=ev=>{sh=!sh;m.textContent=sh?real():mask(real());ev.target.textContent=sh?'Masquer':'Afficher'};
o.addEventListener('click',ev=>{if(ev.target===o)cl()});
o.querySelector('#spP').onclick=()=>{cl();const t=q('#bn [data-t="acc"]');if(t)t.click()};
o.querySelector('#spO').onclick=()=>{cl();if(bOut)bOut.click()};upd()},true)}
})();
