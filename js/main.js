// Fallback logo ratio (height/width) used only until the real image has loaded; after that the real rendered size is measured.
const LOGO_RATIO = 0.454;
const $=(s)=>document.querySelector(s),$$=(s)=>[...document.querySelectorAll(s)],RM=matchMedia('(prefers-reduced-motion: reduce)');
/* Past-year album folder: toggle the horizontal photo gallery. */
const album=$('.past-album'),albumButton=$('.past-folder');
albumButton?.addEventListener('click',()=>{const open=album.dataset.open!=='true';album.dataset.open=String(open);albumButton.setAttribute('aria-expanded',String(open));album.querySelector('.past-folder-copy small').textContent=open?'Click to fold away':'Open the album'});
/* hover: letter hop on headings */
$$('.fx').forEach(e=>{const t=e.textContent;e.setAttribute('aria-label',t);
 if(e.matches('h1,h2,h3,.fx-w')){/* headings: keep each word together, wrap only between words */
  let i=0;e.innerHTML=t.split(' ').map(w=>{const x=`<em class="fxw">${[...w].map(c=>`<span aria-hidden="true" style="--i:${i++}">${c}</span>`).join('')}</em>`;i++;return x}).join(' ')}
 else e.innerHTML=[...t].map((c,i)=>`<span aria-hidden="true" style="--i:${i}">${c==' '?'&nbsp;':c}</span>`).join('')});
/* hover: scramble-decode on nav links */
$$('[data-scr]').forEach(e=>{const t=e.textContent;e.onmouseenter=()=>{let f=0;clearInterval(e._t);e._t=setInterval(()=>{e.textContent=[...t].map((c,i)=>c==' '||i<f/2?c:'#%&*+?'[Math.random()*6|0]).join('');if(++f>t.length*2){clearInterval(e._t);e.textContent=t}},35)}});
/* countdown (set the real close date) */
const END=new Date('2026-04-01T23:59:59+08:00'),cd=$$('[data-cd]');
(function c(){const d=Math.max(0,Math.floor((END-Date.now())/1000)),v=[d/86400|0,d%86400/3600|0,d%3600/60|0,d%60];cd.forEach((e,i)=>e.textContent=String(v[i]).padStart(2,'0'));$('#cdl').textContent=d?'Sign-Ups Close In':'Sign-Ups Are Closed In';setTimeout(c,1000)})();
/* bouncing-logo easter egg */
const GL=['#ff7ad9','#7dffb2','#9aa5ff','#ffb86b'],bs=[];let raf=0,last=0,hits=0;
/* usable viewport size (excludes scrollbars) and real rendered logo size, so bounces hit the true screen edges */
const VW=()=>Math.min(innerWidth,document.documentElement.clientWidth||innerWidth),VH=()=>Math.min(innerHeight,document.documentElement.clientHeight||innerHeight);
function measure(b){const w=b.el.offsetWidth,h=b.el.offsetHeight;if(w&&h){b.w=w;b.h=h}}
addEventListener('resize',()=>bs.forEach(measure));
function spawn(x,y){if(bs.length>=5)kill(bs[0]);const w=Math.min(220,VW()*.38),h=w*LOGO_RATIO,el=new Image(),a=Math.random()*6.283,s=RM.matches?0:190;
 el.src=LOGO;el.alt='';el.className='bouncer';el.style.width=w+'px';document.body.append(el);
 const b={el,w,h,x:Math.min(Math.max(x-w/2,0),VW()-w),y:Math.min(Math.max(y-h/2,0),VH()-h),vx:Math.cos(a)*s||0,vy:Math.sin(a)*s||0,c:0};
 if(s){if(Math.abs(b.vx)<90)b.vx=b.vx<0?-120:120;if(Math.abs(b.vy)<90)b.vy=b.vy<0?-120:120}
 el.style.transform=`translate3d(${b.x}px,${b.y}px,0)`;el.onclick=()=>kill(b);el.onload=()=>measure(b);bs.push(b);$('#hud').hidden=false;if(!raf){last=performance.now();raf=requestAnimationFrame(tick)}}
function kill(b){const i=bs.indexOf(b);if(i<0)return;bs.splice(i,1);b.el.classList.add('pop');setTimeout(()=>b.el.remove(),250);if(!bs.length)$('#hud').hidden=true}
function burst(b){hits++;{const m=document.createElement('b');m.className='corner-t';m.textContent='CORNER!';m.style.cssText=`left:${Math.min(Math.max(b.x,8),VW()-130)}px;top:${Math.min(Math.max(b.y-30,8),VH()-40)}px`;document.body.append(m);setTimeout(()=>m.remove(),1000)}$('#ch').textContent=hits;for(let i=0;i<16;i++){const s=document.createElement('i'),r=Math.random()*6.283,d=60+Math.random()*90;s.className='spark';s.style.cssText=`left:${b.x+b.w/2}px;top:${b.y+b.h/2}px;--c:${GL[i%4]};--dx:${Math.cos(r)*d}px;--dy:${Math.sin(r)*d}px`;document.body.append(s);setTimeout(()=>s.remove(),800)}}
function tick(t){const dt=Math.min((t-last)/1000,.05);last=t;
 for(const b of bs){b.x+=b.vx*dt;b.y+=b.vy*dt;const mx=VW()-b.w,my=VH()-b.h;let hx=0,hy=0;
  if(b.x<=0){b.x=0;b.vx=Math.abs(b.vx);hx=1}else if(b.x>=mx){b.x=mx;b.vx=-Math.abs(b.vx);hx=1}
  if(b.y<=0){b.y=0;b.vy=Math.abs(b.vy);hy=1}else if(b.y>=my){b.y=my;b.vy=-Math.abs(b.vy);hy=1}
  if(hx||hy){b.c=(b.c+1)%4;b.el.style.setProperty('--g',GL[b.c]);
   if((hx&&(b.y<50||b.y>my-50))||(hy&&(b.x<50||b.x>mx-50)))burst(b)}
  b.el.style.transform=`translate3d(${b.x}px,${b.y}px,0)`}
 raf=bs.length?requestAnimationFrame(tick):0}
$('#wm').onclick=e=>{const l=e.target.closest('[data-l]');if(l){const r=l.getBoundingClientRect();spawn(r.left+r.width/2,r.top+r.height/2)}};
$('#poke').onclick=e=>{const r=e.target.getBoundingClientRect();spawn(r.left+r.width/2,r.top)};
addEventListener('keydown',e=>{if(e.key=='Escape')[...bs].forEach(kill)});

/* life: entrance, scroll reveal, wave, ticker */
$$('.ent>*').forEach((e,i)=>e.style.animationDelay=i*90+'ms');
$$('[data-l]').forEach((l,i)=>l.style.setProperty('--i',i));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
$$('.card,.sec>h2,.sec>p,details,#timeline li').forEach((e,i)=>{e.classList.add('rv');e.style.animationDelay=(i%4)*70+'ms';io.observe(e)});
{const w=['dream','code','chain','repeat'],c=['bg-orchid','bg-spring','bg-peri','bg-peach'],g=`<span class="flex shrink-0 items-center gap-6 pr-6">${w.map((x,i)=>`${x}<i class="inline-block h-2.5 w-2.5 ${c[i]}"></i><u class="block h-px w-16 bg-rim"></u>`).join('')}</span>`,h=`<span class="flex shrink-0">${g.repeat(3)}</span>`;$('.mq').innerHTML=h+h}
/* hero canvas: node graph, n-gon wireframes (5+ vertices), asterisks, dust */
(()=>{const cv=$('#fx'),x=cv.getContext('2d'),M='125,255,178',P='255,122,217',L='214,203,245',B='154,165,255';
 const R=(c,a)=>`rgba(${c},${a})`;let W,H,sc,raf=0,vis=true,mx=0,my=0,tx=0,ty=0;
 const G=[{n:5,fx:.50,fy:.22,r:30,c:L,a:.5,s:.0005},{n:6,fx:.58,fy:.80,r:18,c:P,a:.55,s:-.0006},{n:8,fx:.80,fy:.84,r:28,c:L,a:.5,s:.0004},{n:7,fx:.92,fy:.14,r:16,c:B,a:.35,s:.0005},{n:5,fx:.06,fy:.12,r:12,c:P,a:.25,s:-.0004}],
 S=[{fx:.06,fy:.78,s:10,c:M},{fx:.955,fy:.5,s:18,c:M},{fx:.9,fy:.04,s:9,c:P}];let sd=7;const rn=()=>(sd=sd*16807%2147483647)/2147483647;
 const D=Array.from({length:26},()=>({fx:rn(),fy:rn(),r:.8+rn()*2,p:rn()*6.28,c:rn()>.6?P:L}));
 function size(){const d=Math.min(devicePixelRatio||1,2);W=cv.clientWidth;H=cv.clientHeight;cv.width=W*d;cv.height=H*d;x.setTransform(d,0,0,d,0,0);sc=Math.min(Math.max(W/900,.55),1.2);if(RM.matches)draw(0)}
 function ngon(o,t){const ox=W*o.fx+mx*14,oy=H*o.fy+Math.sin(t*.0007+o.fx*9)*8+my*10,tl=.3+.7*Math.abs(Math.cos(t*o.s)),r=o.r*sc,n=o.n;
  const pts=k=>Array.from({length:n},(_,i)=>{const a=i*6.283/n+t*o.s*.6;return[ox+Math.cos(a)*r*k*tl,oy+Math.sin(a)*r*k]});
  const A=pts(1),I=pts(.5);x.strokeStyle=R(o.c,o.a);x.lineWidth=1;x.beginPath();
  [A,I].forEach(q=>{q.forEach((p,i)=>i?x.lineTo(...p):x.moveTo(...p));x.closePath()});A.forEach((p,i)=>{x.moveTo(...p);x.lineTo(...I[i])});x.stroke()}
 function star(s,t){const px=W*s.fx,py=H*s.fy+Math.sin(t*.0009+s.fx*9)*4,r=s.s*sc;x.strokeStyle=R(s.c,.75);x.lineWidth=Math.max(2,r*.38);x.beginPath();for(let i=0;i<3;i++){const a=i*Math.PI/3+Math.PI/6+Math.sin(t*.0009+s.fx*9)*.6;x.moveTo(px-Math.cos(a)*r,py-Math.sin(a)*r);x.lineTo(px+Math.cos(a)*r,py+Math.sin(a)*r)}x.stroke()}
 const V=Array.from({length:16},(_,i)=>[i&1?1:-1,i&2?1:-1,i&4?1:-1,i&8?1:-1]),TE=[];
 for(let i=0;i<16;i++)for(let b=1;b<16;b<<=1)if(!(i&b))TE.push([i,i|b,b==8]);
 const adj=V.map((_,i)=>TE.filter(e=>e[0]==i||e[1]==i).map(e=>e[0]==i?e[1]:e[0])),
 WK=[0,5,10,15].map((s,k)=>({a:s,b:adj[s][k%4],u:0,sp:.0007+k*.0002})),pt=v=>v.reduce((n,x)=>n+(x>0),0)%2;let lt=0;
 function graph(t){const dt=lt?t-lt:0;lt=t;const cx=W>820?W*.74:W/2,cy=Math.min(H*.46,300*sc),A=t*.00032,Bb=t*.00021,C=t*.00027,S=620*sc;
  const p=V.map(v=>{let[X,Y,Z,Wd]=v,q=X*Math.cos(A)-Wd*Math.sin(A),w=X*Math.sin(A)+Wd*Math.cos(A);X=q;Wd=w;/* 4D spin (XW) */
   q=Y*Math.cos(Bb)-Z*Math.sin(Bb);let z=Y*Math.sin(Bb)+Z*Math.cos(Bb);Y=q;Z=z;
   const k4=1/(2.6-Wd*.7);X*=k4;Y*=k4;Z*=k4;/* project 4D to 3D */
   q=X*Math.cos(C)+Z*Math.sin(C);z=-X*Math.sin(C)+Z*Math.cos(C);X=q;Z=z;const k3=1/(3-Z*.8);return{x:cx+X*S*k3+mx*10,y:cy+Y*S*k3+my*8,d:k3}});
  x.lineCap='round';TE.forEach(([a,b,w4])=>{const c=w4?M:P;x.shadowColor=R(c,.7);x.shadowBlur=8;x.strokeStyle=R(c,.4+.5*(p[a].d+p[b].d)/.9);x.lineWidth=w4?1.4:2;x.beginPath();x.moveTo(p[a].x,p[a].y);x.lineTo(p[b].x,p[b].y);x.stroke()});
  V.forEach((v,i)=>{const c=pt(v)?P:M,u=(Math.sin(t*.002+i)+1)/2;x.shadowColor=R(c,.9);x.shadowBlur=14;x.fillStyle=R(c,1);x.beginPath();x.arc(p[i].x,p[i].y,14*p[i].d*sc+u,0,6.283);x.fill()});
  WK.forEach(k=>{k.u+=k.sp*dt;if(k.u>=1){const a=k.b;k.u=0;k.b=adj[a][Math.random()*4|0];k.a=a}const A1=p[k.a],B1=p[k.b];x.shadowColor='#fff';x.shadowBlur=18;x.fillStyle='#fff';x.beginPath();x.arc(A1.x+(B1.x-A1.x)*k.u,A1.y+(B1.y-A1.y)*k.u,3.4,0,6.283);x.fill()});x.shadowBlur=0}
 function draw(t){mx+=(tx-mx)*.05;my+=(ty-my)*.05;x.clearRect(0,0,W,H);D.forEach(d=>{x.fillStyle=R(d.c,.25+.45*(Math.sin(t*.0012+d.p)+1)/2);x.beginPath();x.arc(W*d.fx,H*d.fy,d.r,0,6.283);x.fill()});G.forEach(o=>ngon(o,t));S.forEach(s=>star(s,t));graph(t)}
 const f=t=>{draw(t);raf=requestAnimationFrame(f)},go=()=>{if(!raf&&vis&&!document.hidden&&!RM.matches)raf=requestAnimationFrame(f)},no=()=>{cancelAnimationFrame(raf);raf=0};
 new ResizeObserver(size).observe(cv);new IntersectionObserver(([e])=>{vis=e.isIntersecting;vis?go():no()}).observe(cv);
 document.addEventListener('visibilitychange',()=>document.hidden?no():go());
 addEventListener('pointermove',e=>{tx=(e.clientX/innerWidth-.5)*2;ty=(e.clientY/innerHeight-.5)*2},{passive:true});size();go()})();
