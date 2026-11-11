// m-animations.js
(function(){const c=$('#cv');if(!c)return;const x=c.getContext('2d'),R=Math.random,rm=matchMedia('(prefers-reduced-motion: reduce)').matches;let W,H,vis=true;
function size(){const d=devicePixelRatio||1;W=c.parentNode.clientWidth;H=Math.min(360,Math.max(270,W*.55));c.width=W*d;c.height=H*d;c.style.height=H+'px';x.setTransform(d,0,0,d,0,0)}size();addEventListener('resize',size);
new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(c);
const B=Array.from({length:24},()=>({x:R(),y:R(),r:4+R()*14,vy:.0006+R()*.0016,vx:0,ph:R()*6,c:R()<.3?'229,50,45':'30,50,200'}));
const rr=(a,b,w,h,r)=>{x.beginPath();x.roundRect?x.roundRect(a,b,w,h,r):x.rect(a,b,w,h)},q=(a,b,c,t)=>(1-t)*(1-t)*a+2*(1-t)*t*b+t*t*c,LK={};
let amp=8,ta=8,tilt=0,tt=0,next=0,sc=0,pv=0,fade=1,nextS=7000;
function lap(cx,cy,s){x.fillStyle='#0a1470';rr(cx-s*.8,cy-s*.6,s*1.6,s,8);x.fill();x.fillStyle='#dfe7ff';rr(cx-s*.7,cy-s*.5,s*1.4,s*.8,4);x.fill();x.fillStyle='#1c2cb0';[.12,.3,.48].forEach((k,i)=>x.fillRect(cx-s*.6,cy-s*.45+s*k*.7,s*(1.2-i*.3),4));x.fillStyle='#0a1470';rr(cx-s,cy+s*.42,s*2,s*.12,4);x.fill()}
function pho(cx,cy,s,a){x.save();x.translate(cx,cy);x.rotate(a);x.fillStyle='#0a1470';rr(-s*.3,-s*.55,s*.6,s*1.1,12);x.fill();x.fillStyle='#fff';rr(-s*.25,-s*.45,s*.5,s*.85,6);x.fill();x.fillStyle='#e5322d';x.beginPath();x.moveTo(-s*.06,-s*.18);x.lineTo(s*.1,-s*.05);x.lineTo(-s*.06,s*.08);x.fill();x.fillStyle='#c9d2ff';[.2,.28].forEach(k=>x.fillRect(-s*.18,s*k,s*.36,4));x.restore()}
function tab(cx,cy,s){x.fillStyle='#0a1470';rr(cx-s*.55,cy-s*.4,s*1.1,s*.8,8);x.fill();x.fillStyle='#dfe7ff';rr(cx-s*.48,cy-s*.33,s*.96,s*.66,4);x.fill();x.fillStyle='#e5322d';x.beginPath();x.moveTo(cx-s*.08,cy-s*.12);x.lineTo(cx+s*.1,cy);x.lineTo(cx-s*.08,cy+s*.12);x.fill()}
function wat(cx,cy,s){x.fillStyle='#e5322d';x.fillRect(cx-s*.1,cy-s*.4,s*.2,s*.8);x.fillStyle='#0a1470';rr(cx-s*.22,cy-s*.22,s*.44,s*.44,8);x.fill();x.fillStyle='#dfe7ff';x.beginPath();x.arc(cx,cy,s*.1,0,7);x.fill()}
const SK=['#f1c9a5','#c68642','#8d5524','#e0ac69'],SH=['#e5322d','#1c2cb0','#0a1470','#6a4cff','#12a37f'],HR=['#1b1b1b','#3b2a1a','#111'];
function ppl(cx,by,s,i,dv){x.fillStyle=SH[i%5];rr(cx-s*.3,by-s*.55,s*.6,s*.55,s*.14);x.fill();x.fillStyle=SK[i%4];x.beginPath();x.arc(cx,by-s*.74,s*.2,0,7);x.fill();x.fillStyle=HR[i%3];x.beginPath();x.arc(cx,by-s*.78,s*.21,Math.PI,0);x.fill();
const dy=by-s*.3;if(dv==='lap')lap(cx,dy,s*.55);else if(dv==='pho')pho(cx,dy-s*.02,s*.62,tilt);else if(dv==='tab')tab(cx,dy,s*.7);else wat(cx+s*.34,by-s*.26,s*.5);return[cx+(dv==='wat'?s*.34:0),dy-s*.2]}
function ah(px,py,cx,cy){x.save();x.translate(px,py);x.rotate(Math.atan2(py-cy,px-cx));x.fillStyle='#e5322d';x.beginPath();x.moveTo(0,0);x.lineTo(-14,-7);x.lineTo(-14,7);x.fill();x.restore()}
function link(k,ax,ay,bx,by,ts,bend){const mx=(ax+bx)/2,my=(ay+by)/2-bend+Math.sin(ts/600+k.length)*amp*.4;x.strokeStyle='rgba(28,44,176,.45)';x.lineWidth=3;x.setLineDash([8,7]);x.lineDashOffset=-ts/60;x.beginPath();x.moveTo(ax,ay);x.quadraticCurveTo(mx,my,bx,by);x.stroke();x.setLineDash([]);ah(ax,ay,mx,my);ah(bx,by,mx,my);
const L=LK[k]||(LK[k]=[{t:R(),v:.004+R()*.004,k:1},{t:R(),v:-(.004+R()*.004),k:0}]);L.forEach(p=>{p.t+=p.v;if(p.t>1||p.t<0){p.v=-p.v*(.7+R()*.6);p.t=Math.max(0,Math.min(1,p.t))}if(R()<.003)p.v=-p.v;x.beginPath();x.arc(q(ax,mx,bx,p.t),q(ay,my,by,p.t),4,0,7);x.fillStyle=p.k?'#e5322d':'#0a1470';x.fill()})}
const cap=t=>{x.fillStyle='#0a1470';x.font='600 15px Poppins,Arial';x.textAlign='center';x.fillText(t,W/2,26)};
function cloud(cx,cy,r){x.fillStyle='#dfe7ff';[[-1,0,.8],[0,-.5,1],[1,0,.8],[0,.1,1]].forEach(([a,b,k])=>{x.beginPath();x.arc(cx+a*r*.8,cy+b*r*.6,r*.6*k,0,7);x.fill()});x.fillStyle='#0a1470';x.font='700 14px Poppins,Arial';x.textAlign='center';x.fillText('Singandu',cx,cy+5)}
function s0(ts){cap('Un formateur, vos cours en ligne');const by=H*.82,s=H*.5,a=ppl(W*.17,by,s,0,'lap'),b=ppl(W*.83,by,s,1,'lap'),m=ppl(W*.5,by,s*.8,2,'pho');link('a',a[0],a[1],b[0],b[1],ts,H*.28);link('b',a[0],a[1],m[0],m[1],ts,H*.1);link('c',m[0],m[1],b[0],b[1],ts,H*.1)}
function s1(ts){cap('Tous apprennent ensemble');const t=ppl(W*.5,H*.55,H*.42,0,'lap'),by=H*.96,s=H*.36;[ppl(W*.2,by,s,1,'pho'),ppl(W*.5,by,s,3,'tab'),ppl(W*.8,by,s,4,'lap')].forEach((p,i)=>link('d'+i,t[0],t[1],p[0],p[1]-6,ts,H*.1*(i-1)))}
function s2(ts){cap('Ordinateur, tablette, téléphone, montre');const cx=W*.5,cy=H*.3;cloud(cx,cy,Math.min(46,W*.07));const by=H*.96,s=H*.33;['pho','wat','tab','pho','lap'].forEach((d,i)=>{const p=ppl(W*(.1+i*.2),by,s,i+1,d);link('e'+i,cx,cy+22,p[0],p[1]-6,ts,H*.06*(i-2))})}
const S=[s0,s1,s2];
function f(ts){if(!rm)requestAnimationFrame(f);if(!vis&&!rm)return;x.clearRect(0,0,W,H);
if(ts>next){next=ts+2500+R()*4000;tt=(R()-.5)*.5;ta=4+R()*22}tilt+=(tt-tilt)*.03;amp+=(ta-amp)*.03;
B.forEach(b=>{b.vx+=(R()-.5)*.00004;b.vx=Math.max(-.0006,Math.min(.0006,b.vx));b.x+=b.vx+Math.sin(ts/900+b.ph)*.0002;b.y-=b.vy;if(b.y<-.1){b.y=1.1;b.x=R()}x.beginPath();x.arc(b.x*W,b.y*H,b.r,0,7);x.fillStyle='rgba('+b.c+',.10)';x.fill();x.strokeStyle='rgba('+b.c+',.35)';x.lineWidth=1;x.stroke()});
if(ts>nextS){pv=sc;sc=(sc+1+(R()<.5?1:0))%3;fade=0;nextS=ts+7000+R()*4000}fade=Math.min(1,fade+.025);
if(fade<1){x.globalAlpha=1-fade;S[pv](ts)}x.globalAlpha=fade;S[sc](ts);x.globalAlpha=1}
rm?f(1000):requestAnimationFrame(f)})();

// ---- démo dans le fil ----
(function(){
const card=document.createElement('div');card.className='pc';card.innerHTML='<b>Un jour dans la vie d’un étudiant Singandu</b><canvas style="display:block;width:100%;border-radius:14px;margin-top:10px;cursor:pointer"></canvas><small class="mu">Touchez l’image pour rejouer.</small>';const c=card.querySelector('canvas'),x=c.getContext('2d'),R=Math.random;let S=1,t0=performance.now(),vis=true,lw=0,dn=0;
function fit(){const w=c.clientWidth;if(!w||w===lw)return;lw=w;dn=0;const d=devicePixelRatio||1;c.width=w*d;c.height=w*d*.625;c.style.height=w*.625+'px';S=w*d/800}
new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(c);c.onclick=()=>t0=performance.now();
const rr=(a,b,w,h,r)=>{x.beginPath();x.roundRect?x.roundRect(a,b,w,h,r):x.rect(a,b,w,h)},ease=t=>t<0?0:t>1?1:t*t*(3-2*t);
const circ=(cx,cy,r,f)=>{x.fillStyle=f;x.beginPath();x.arc(cx,cy,r,0,7);x.fill()},box=(a,b,w,h,r,f)=>{x.fillStyle=f;rr(a,b,w,h,r);x.fill()};
const txt=(t,px,py,sz,col,al,w)=>{x.fillStyle=col;x.font=(w||600)+' '+sz+'px Poppins,Arial,sans-serif';x.textAlign=al||'center';x.fillText(t,px,py)};
const head=(cx,cy,r,sk,hr)=>{circ(cx,cy,r,sk);x.fillStyle=hr;x.beginPath();x.arc(cx,cy-r*.15,r,Math.PI,0);x.fill()};
const person=(cx,by,s,sh,sk,hr)=>{box(cx-s*.3,by-s*.55,s*.6,s*.55,s*.14,sh);head(cx,by-s*.74,s*.2,sk,hr)};
const phone=(cx,cy,s,g)=>{if(g)circ(cx,cy,s*1.2,'rgba(255,212,0,.28)');box(cx-s*.3,cy-s*.55,s*.6,s*1.1,8,'#0a1470');box(cx-s*.25,cy-s*.45,s*.5,s*.85,5,g?'#fff7c2':'#dfe7ff')};
const laptop=(cx,cy,s)=>{box(cx-s*.8,cy-s*.6,s*1.6,s,8,'#0a1470');box(cx-s*.7,cy-s*.5,s*1.4,s*.8,4,'#dfe7ff');box(cx-s,cy+s*.42,s*2,s*.12,4,'#0a1470')};
const cloud=(cx,cy,r)=>{[[-1,0,.8],[0,-.5,1],[1,0,.8],[0,.1,1]].forEach(([a,b,k])=>circ(cx+a*r*.8,cy+b*r*.6,r*.6*k,'#fff'))};
function bubble(a,b,w,t,col){box(a,b,w,44,22,'#fff');x.strokeStyle=col;x.lineWidth=2;rr(a,b,w,44,22);x.stroke();txt(t,a+w/2,b+28,15,'#10153f')}
function sc0(p,t){box(0,0,800,500,0,'#e9eeff');box(540,70,170,150,10,'#fff');x.save();rr(550,80,150,130,6);x.clip();const g=x.createLinearGradient(0,80,0,210);g.addColorStop(0,p<.5?'#ffcf8a':'#8fd0ff');g.addColorStop(1,'#ffe6b0');x.fillStyle=g;x.fillRect(550,80,150,130);circ(625,215-ease(p*1.2)*90,28,'#ffd400');x.restore();box(618,80,4,130,0,'#fff');box(550,143,150,4,0,'#fff');
box(100,340,360,26,6,'#7a5230');box(110,310,340,40,10,'#1c2cb0');const k=ease((p-.3)/.2);x.save();x.translate(200,312);x.rotate(-k*1.35);box(0,-22,150,44,18,'#6a4cff');head(165,-6,26,'#c68642','#111');x.restore();box(250,300,200,50,10,'#2b3ccf');box(110,290,70,26,12,'#fff');
if(k<.5)['z','Z','Z'].forEach((z,i)=>txt(z,250+i*24,265-i*28-(t*20%20),22+i*8,'#6a4cff'));
if(p>.22&&p<.5){x.save();x.translate(380,200);x.rotate(Math.sin(t*35)*.25);txt('⏰',0,0,44);x.restore()}
if(k>.9)phone(292,262+Math.sin(t*3)*3,50,1)}
function sc1(p,t){box(0,0,800,500,0,'#d6ebff');circ(90,70,34,'#ffd400');box(0,330,800,170,0,'#9bc27a');box(0,370,800,70,0,'#555a70');for(let i=-1;i<11;i++)box(i*80+(t*60)%80,402,44,6,3,'#fff');
box(640,250,120,80,6,'#c9d2ff');box(690,280,20,50,0,'#1c2cb0');box(700,215,4,40,0,'#0a1470');box(704,215,30,18,0,'#e5322d');txt('Singandu',700,348,13,'#0a1470');
box(330,290,110,40,8,'#fff');txt('12 km',385,317,20,'#e5322d');box(382,330,6,40,0,'#555');
const bx=-200+ease(p)*1100;box(bx,322,170,64,12,'#ffd400');[0,1,2,3].forEach(i=>box(bx+14+i*38,332,28,22,4,'#9fd0ff'));circ(bx+36,388,14,'#222');circ(bx+134,388,14,'#222');
person(110,376,150,'#e5322d','#c68642','#111');phone(132,334,44,0);
for(let i=0;i<3;i++){x.save();x.globalAlpha=1-((t*40+i*30)%90)/90;txt('$',190+i*40,240-((t*40+i*30)%90),30,'#d4a000');x.restore()}
const a=ease((p-.3)/.15);x.save();x.globalAlpha=a;bubble(40,150,230,'Trop loin, trop cher…','#e5322d');txt('✖',560,300,46,'#e5322d');x.restore()}
function sc2(p,t){box(0,0,800,500,0,'#e6f6ea');circ(690,80,40,'#ffe36e');cloud((t*12)%900-80,95,34);cloud((t*8+400)%900-80,140,26);box(0,380,800,120,0,'#8fcf8f');
box(110,230,30,170,6,'#7a5230');circ(125,210,70,'#4caf6a');circ(80,250,48,'#5cc17a');circ(170,250,48,'#5cc17a');
box(330,362,260,16,6,'#7a5230');box(344,378,16,30,0,'#7a5230');box(562,378,16,30,0,'#7a5230');person(450,362,150,'#1c2cb0','#8d5524','#111');laptop(450,332,48);phone(560,334,36,0);
x.strokeStyle='#445';x.lineWidth=3;for(let i=0;i<3;i++){const bx=(t*40+i*160)%900-50,by=120+i*30+Math.sin(t*3+i)*8;x.beginPath();x.arc(bx-8,by,8,Math.PI,0);x.arc(bx+8,by,8,Math.PI,0);x.stroke()}
x.save();x.globalAlpha=ease(p*3);txt('🌿 Calme et connexion',300,300,22,'#2f6b3e');x.restore()}
function sc3(p,t){box(0,0,800,500,0,'#eef1ff');box(120,50,560,340,18,'#fff');x.strokeStyle='#d6dcff';x.lineWidth=2;rr(120,50,560,340,18);x.stroke();box(120,50,560,50,18,'#e8ebff');[0,1,2].forEach(i=>circ(150+i*22,75,7,['#e5322d','#ffd400','#12a37f'][i]));box(250,62,400,26,13,'#fff');
const n=Math.min(12,Math.floor(p*22));txt('singandu.com'.slice(0,n)+(Math.floor(t*3)%2&&p<.55?'|':''),270,81,16,'#10153f','left');
if(p>.5){x.save();x.globalAlpha=ease((p-.5)*4);circ(400,180,40,'#0a1470');txt('S',400,196,44,'#fff',null,800);txt('Singandu Academia',400,252,24,'#0a1470',null,700);txt('Apprendre, c’est conquérir l’invisible.',400,280,14,'#5b6192');const k=1+Math.sin(t*5)*.03;x.translate(400,325);x.scale(k,k);box(-135,-24,270,48,24,'#ffd400');txt('Connectez-vous pour continuer',0,6,15,'#000');x.restore()}
if(p>.6){const q=ease((p-.6)*3),cx=560+(420-560)*q,cy=410+(335-410)*q;x.fillStyle='#10153f';x.beginPath();x.moveTo(cx,cy);x.lineTo(cx,cy+22);x.lineTo(cx+6,cy+17);x.lineTo(cx+14,cy+24);x.lineTo(cx+17,cy+21);x.lineTo(cx+10,cy+14);x.lineTo(cx+18,cy+13);x.fill();if(p>.88){x.strokeStyle='rgba(229,50,45,.7)';x.lineWidth=3;x.beginPath();x.arc(420,335,(p-.88)*320,0,7);x.stroke()}}}
const LK={};function ah(px,py,cx,cy){x.save();x.translate(px,py);x.rotate(Math.atan2(py-cy,px-cx));x.fillStyle='#e5322d';x.beginPath();x.moveTo(0,0);x.lineTo(-14,-7);x.lineTo(-14,7);x.fill();x.restore()}
function link(k,ax,ay,bx,by,t,bend){const mx=(ax+bx)/2,my=(ay+by)/2-bend+Math.sin(t*2+k.length)*10,q=(a,b,c,u)=>(1-u)*(1-u)*a+2*(1-u)*u*b+u*u*c;x.strokeStyle='rgba(28,44,176,.5)';x.lineWidth=3;x.setLineDash([8,7]);x.lineDashOffset=-t*40;x.beginPath();x.moveTo(ax,ay);x.quadraticCurveTo(mx,my,bx,by);x.stroke();x.setLineDash([]);ah(ax,ay,mx,my);ah(bx,by,mx,my);
const L=LK[k]||(LK[k]=[{u:R(),v:.006+R()*.004,k:1},{u:R(),v:-(.006+R()*.004),k:0}]);L.forEach(o=>{o.u+=o.v;if(o.u>1||o.u<0){o.v=-o.v*(.8+R()*.4);o.u=Math.max(0,Math.min(1,o.u))}if(R()<.004)o.v=-o.v;circ(q(ax,mx,bx,o.u),q(ay,my,by,o.u),5,o.k?'#e5322d':'#0a1470')})}
function sc4(p,t){box(0,0,800,500,0,'#eef1ff');box(0,400,800,90,0,'#dfe7ff');person(130,402,170,'#e5322d','#8d5524','#111');laptop(130,368,52);phone(222,376,40,0);person(670,402,170,'#12a37f','#f1c9a5','#3b2a1a');laptop(670,368,52);
cloud(400,120,50);txt('singandu.com',400,128,16,'#0a1470');link('a',150,325,375,150,t,60);link('b',425,150,660,325,t,60);link('c',222,338,395,150,t,-30);
const s=Math.floor(t/1.6)%2;if(s)bubble(530,235,230,'Bonjour ! Voici la leçon 📘','#12a37f');else bubble(30,235,230,'Merci professeur !','#e5322d')}
const SC=[[sc0,'6 h : l’étudiant se réveille'],[sc1,'Les cours sont loin, le transport coûte cher'],[sc2,'Il choisit un endroit calme'],[sc3,'Il tape singandu.com'],[sc4,'Il apprend avec son professeur, où qu’il soit']],D=[5,5.5,5,5.5,6.5],TOT=D.reduce((a,b)=>a+b);
const rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
function draw(t){let i=0,a=t;while(a>=D[i]){a-=D[i];i++}const p=a/D[i];x.setTransform(S,0,0,S,0,0);x.clearRect(0,0,800,500);x.save();x.globalAlpha=Math.min(1,p*6,(1-p)*6);SC[i][0](p,t);box(60,426,680,40,20,'rgba(255,255,255,.92)');txt(SC[i][1],400,452,18,'#10153f');x.restore();SC.forEach((_,j)=>circ(370+j*15,486,j===i?5:3,j===i?'#e5322d':'#aab2e8'))}
function f(ms){requestAnimationFrame(f);fit();if(!lw||!c.clientWidth||!vis)return;if(rm){if(!dn){draw(TOT-2);dn=1}return}draw(((ms-t0)/1000)%TOT)}
requestAnimationFrame(f);window.demoCard=card;
})();
