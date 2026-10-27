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
/* scramble-decode text into place (nav hover, track statuses, mentor quips) */
function scramble(e,t){let f=0;clearInterval(e._t);e._t=setInterval(()=>{e.textContent=[...t].map((c,i)=>c==' '||i<f/2?c:'01<>/_{}'[Math.random()*8|0]).join('');if(++f>[...t].length*2){clearInterval(e._t);e.textContent=t}},35)}
$$('[data-scr]').forEach(e=>{const t=e.textContent;e.onmouseenter=()=>scramble(e,t)});
/* countdown (set the real close date) */
const END=new Date('2026-04-01T23:59:59+08:00'),cd=$$('[data-cd]');
(function c(){const d=Math.max(0,Math.floor((END-Date.now())/1000)),v=[d/86400|0,d%86400/3600|0,d%3600/60|0,d%60];cd.forEach((e,i)=>e.textContent=String(v[i]).padStart(2,'0'));$('#cdl').textContent=d?'Sign-ups close in':'Sign-ups closed';setTimeout(c,1000)})();
/* bouncing-logo easter egg */
const GL=['#7dffb2','#ff7ad9','#9aa5ff','#f6f4ff'],bs=[];let raf=0,last=0,hits=0;
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
addEventListener('keydown',e=>{if(e.key=='Escape'){[...bs].forEach(kill);setMenu(false)}});

/* theme: dark by default, light = the original purple palette. A click is remembered; otherwise follow the OS setting. */
const root=document.documentElement,tb=$('#theme'),OSL=matchMedia('(prefers-color-scheme: light)');
function setTheme(t,save){root.dataset.theme=t;tb.setAttribute('aria-label',`Switch to ${t=='light'?'dark':'light'} mode`);
 $$('meta[name=theme-color]').forEach(m=>m.content=t=='light'?'#241845':'#0b0916');document.dispatchEvent(new Event('themechange'));
 if(save)try{localStorage.setItem('theme',t)}catch(e){}}
setTheme(root.dataset.theme);tb.onclick=()=>setTheme(root.dataset.theme=='light'?'dark':'light',true);
OSL.addEventListener('change',e=>{let s;try{s=localStorage.getItem('theme')}catch(_){}if(!s)setTheme(e.matches?'light':'dark')});
/* mobile menu: dropdown under the nav pill below 1024px */
const nav=$('header nav'),mb=$('#menu-btn');
function setMenu(o){nav.toggleAttribute('data-open',o);mb.setAttribute('aria-expanded',o);mb.setAttribute('aria-label',o?'Close menu':'Open menu')}
mb.onclick=()=>setMenu(!nav.hasAttribute('data-open'));
$$('#menu a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
addEventListener('click',e=>{if(!nav.contains(e.target))setMenu(false)});

/* life: entrance, scroll reveal, ticker, card spotlight */
$$('.ent>*').forEach((e,i)=>e.style.animationDelay=i*90+'ms');
$$('[data-l]').forEach((l,i)=>l.style.setProperty('--i',i));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
$$('.card,.sec>h2,.sec>p,details,.term').forEach((e,i)=>{e.classList.add('rv');e.style.animationDelay=(i%4)*70+'ms';io.observe(e)});
{const w=['prompt','prototype','debug','ship','pitch','repeat'],g=`<span class="flex shrink-0 items-center gap-8 pr-8">${w.map(x=>`${x}<i class="not-italic text-spring">✦</i>`).join('')}</span>`,h=`<span class="flex shrink-0">${g.repeat(3)}</span>`;$('.mq').innerHTML=h+h}
addEventListener('pointermove',e=>{const c=e.target.closest?.('.card');if(c){const r=c.getBoundingClientRect();c.style.setProperty('--mx',e.clientX-r.left+'px');c.style.setProperty('--my',e.clientY-r.top+'px')}},{passive:true});
/* hero prompt: types out example ideas, then deletes and moves on */
{const el=$('#typed'),ideas=['an agent that turns lecture slides into flashcards','a voice assistant that finds your next class','a copilot that explains your stack traces','a vision model that spots plant disease from one photo','a RAG bot over every module handbook','something nobody has built yet'];
 if(RM.matches)el.textContent=ideas[0];
 else{let i=0,n=0,del=false;(function step(){const s=ideas[i];
  if(!del){el.textContent=s.slice(0,++n);if(n==s.length){del=true;return setTimeout(step,2200)}}
  else{el.textContent=s.slice(0,--n);if(!n){del=false;i=(i+1)%ideas.length;return setTimeout(step,400)}}
  setTimeout(step,del?14:35+Math.random()*45)})()}}
/* hero canvas: a small neural net. Signals fire from the inputs and light up every node they reach.
   Desktop (net beside the text): hover a node to light its links, click it to fire a burst,
   drag it around (it springs back), or click empty space near the net to inject a signal. */
(()=>{const cv=$('#fx'),hero=$('#top'),x=cv.getContext('2d'),M='125,255,178',P='255,122,217',B='154,165,255',L='201,195,230',R=(c,a)=>`rgba(${c},${a})`;
 const LY=[4,6,6,3],OUT=['build','ship','win'],HIT=[0,0,0];let sd=11;const rn=()=>(sd=sd*16807%2147483647)/2147483647;
 const N=LY.flatMap((n,l)=>Array.from({length:n},(_,i)=>({l,i,n,a:0,c:M,ph:rn()*6.283,ox:0,oy:0,vx:0,vy:0})));
 const E=[];N.forEach((p,j)=>N.forEach((q,k)=>{if(q.l==p.l+1)E.push({a:j,b:k,w:.2+rn()*.8})}));
 const OE=N.map((_,j)=>E.filter(e=>e.a==j));
 const D=Array.from({length:34},()=>({fx:rn(),fy:rn(),r:.6+rn()*1.3,p:rn()*6.283}));
 const S=[],RP=[];let W,H,sc,cx,cy,fade,wide,raf=0,vis=true,mx=0,my=0,tx=0,ty=0,lt=0,next=0,fill,Q=[],ptr=null,hov=-1,drag=-1,downAt,moved;
 /* node centres are filled with the theme's panel colour */
 const paint=()=>{fill=`rgb(${getComputedStyle(root).getPropertyValue('--deep').trim()})`;if(RM.matches&&W)draw(0)};
 document.addEventListener('themechange',paint);
 function size(){const d=Math.min(devicePixelRatio||1,2);W=cv.clientWidth;H=cv.clientHeight;cv.width=W*d;cv.height=H*d;x.setTransform(d,0,0,d,0,0);
  wide=W>=1200;/* below this the net would sit under the prompt box, so it becomes a faded backdrop instead */sc=wide?Math.min(Math.max(W/1300,.8),1.15):Math.min(W/640,.8);cx=wide?W*.75:W*.62;cy=wide?H*.5:H*.17;fade=wide?1:.3;if(RM.matches)draw(0)}
 const base=(p,t)=>[cx+(p.l-(LY.length-1)/2)*128*sc+mx*6*(p.l+1),cy+(p.i-(p.n-1)/2)*62*sc+Math.sin(t*.0011+p.ph)*4*sc+my*8];
 const live=()=>wide&&!RM.matches,pick=()=>Math.random()<.25?P:M;
 const near=(px,py,max)=>{let b=-1,d=max*max;Q.forEach(([qx,qy],j)=>{const dd=(qx-px)**2+(qy-py)**2;if(dd<d){d=dd;b=j}});return b};
 function fire(j,c){const o=OE[j];if(!o.length||S.length>60)return;let r=Math.random()*o.reduce((s,e)=>s+e.w,0),e=o[0];for(const q of o){r-=q.w;if(r<=0){e=q;break}}
  N[j].a=Math.max(N[j].a,.7);N[j].c=c;S.push({e,u:0,c})}
 /* a burst fires down every outgoing link at once; an output node just scores */
 function burst(j,c){N[j].a=1;N[j].c=c;if(!OE[j].length)HIT[N[j].i]++;OE[j].forEach(e=>S.length<90&&S.push({e,u:0,c}))}
 function draw(t){const dt=lt?Math.min(t-lt,50):0;lt=t;mx+=(tx-mx)*.05;my+=(ty-my)*.05;x.clearRect(0,0,W,H);
  D.forEach(d=>{x.fillStyle=R(L,.06+.2*(Math.sin(t*.001+d.p)+1)/2);x.beginPath();x.arc(W*d.fx,H*d.fy,d.r,0,6.283);x.fill()});
  /* springs: nodes lean toward a nearby cursor, the dragged node follows it, everything eases back home */
  N.forEach((p,j)=>{const[bx,by]=base(p,t);
   if(j==drag&&ptr){p.ox=ptr[0]-bx;p.oy=ptr[1]-by;p.vx=p.vy=0;return}
   let gx=0,gy=0;if(ptr&&live()){const dx=ptr[0]-bx,dy=ptr[1]-by,d=Math.hypot(dx,dy);if(d<150){gx=dx*(1-d/150)*.3;gy=dy*(1-d/150)*.3}}
   p.vx=(p.vx+(gx-p.ox)*.07)*.82;p.vy=(p.vy+(gy-p.oy)*.07)*.82;p.ox+=p.vx;p.oy+=p.vy});
  x.globalAlpha=fade;Q=N.map(p=>{const[bx,by]=base(p,t);return[bx+p.ox,by+p.oy]});
  x.lineWidth=1;E.forEach(e=>{x.strokeStyle=R(B,.05+.13*e.w);x.beginPath();x.moveTo(...Q[e.a]);x.lineTo(...Q[e.b]);x.stroke()});
  const hl=drag>=0?drag:hov;
  if(hl>=0){x.lineWidth=1.3;x.strokeStyle=R(M,.5);E.forEach(e=>{if(e.a==hl||e.b==hl){x.beginPath();x.moveTo(...Q[e.a]);x.lineTo(...Q[e.b]);x.stroke()}});N[hl].a=Math.max(N[hl].a,.6)}
  for(let k=RP.length-1;k>=0;k--){const r=RP[k],u=(t-r.t0)/700;if(u>=1){RP.splice(k,1);continue}if(u<0)continue;
   x.strokeStyle=R(M,(1-u)*.6);x.lineWidth=1.5;x.beginPath();x.arc(r.x,r.y,6+u*70*sc,0,6.283);x.stroke()}
  if(!RM.matches&&t>next){next=t+240+Math.random()*280;fire(Math.random()*LY[0]|0,pick())}
  for(let k=S.length-1;k>=0;k--){const s=S[k],[a1,a2]=Q[s.e.a],[b1,b2]=Q[s.e.b];s.u+=dt/520;
   if(s.u>=1){S.splice(k,1);const b=N[s.e.b];b.a=1;b.c=s.c;if(!OE[s.e.b].length)HIT[b.i]++;else if(Math.random()<.9)fire(s.e.b,s.c);continue}
   const u0=Math.max(0,s.u-.4),sx=a1+(b1-a1)*u0,sy=a2+(b2-a2)*u0,hx=a1+(b1-a1)*s.u,hy=a2+(b2-a2)*s.u,g=x.createLinearGradient(sx,sy,hx,hy);
   g.addColorStop(0,R(s.c,0));g.addColorStop(1,R(s.c,.9));x.strokeStyle=g;x.lineWidth=1.6;x.beginPath();x.moveTo(sx,sy);x.lineTo(hx,hy);x.stroke();
   x.shadowColor=R(s.c,1);x.shadowBlur=wide?12:0;x.fillStyle=R(s.c,1);x.beginPath();x.arc(hx,hy,2.4*sc,0,6.283);x.fill();x.shadowBlur=0}
  N.forEach((p,j)=>{const[px,py]=Q[j],r=(p.l==0||p.l==LY.length-1?7.5:6)*sc*(j==hl?1.35:1);p.a=Math.max(0,p.a-dt/900);
   if(wide&&p.a>0){x.shadowColor=R(p.c,p.a);x.shadowBlur=26*p.a}
   x.fillStyle=fill;x.beginPath();x.arc(px,py,r+p.a*2,0,6.283);x.fill();x.shadowBlur=0;
   x.lineWidth=1.4;x.strokeStyle=p.a>.02?R(p.c,.45+.55*p.a):R(B,.5);x.stroke();
   if(p.a>.02){x.fillStyle=R(p.c,p.a*.9);x.beginPath();x.arc(px,py,r*.5,0,6.283);x.fill()}
   if(wide&&p.l==LY.length-1){x.font='500 11px "Geist Mono",monospace';x.fillStyle=R(L,.35+.6*p.a);x.fillText(OUT[p.i]+(HIT[p.i]?` ×${HIT[p.i]}`:''),px+r+12,py+4)}});
  if(live()){x.font='500 11px "Geist Mono",monospace';x.textAlign='center';x.fillStyle=R(L,.35);x.fillText('drag a node · click to fire',cx,cy+215*sc);x.textAlign='start'}
  x.globalAlpha=1}
 const f=t=>{draw(t);raf=requestAnimationFrame(f)},go=()=>{if(!raf&&vis&&!document.hidden&&!RM.matches)raf=requestAnimationFrame(f)},no=()=>{cancelAnimationFrame(raf);raf=0};
 new ResizeObserver(size).observe(cv);new IntersectionObserver(([e])=>{vis=e.isIntersecting;vis?go():no()}).observe(cv);
 document.addEventListener('visibilitychange',()=>{lt=0;document.hidden?no():go()});
 addEventListener('pointermove',e=>{tx=(e.clientX/innerWidth-.5)*2;ty=(e.clientY/innerHeight-.5)*2},{passive:true});
 /* pointer input lives on the hero section (the canvas sits behind the text) */
 const local=e=>{const r=cv.getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top]},onUI=e=>e.target.closest('a,button,input');
 hero.addEventListener('pointermove',e=>{if(!live())return;ptr=local(e);
  if(drag>=0){if(Math.hypot(ptr[0]-downAt[0],ptr[1]-downAt[1])>4)moved=true;return}
  hov=onUI(e)?-1:near(...ptr,24);hero.style.cursor=hov>=0?'grab':''});
 hero.addEventListener('pointerleave',()=>{if(drag<0){ptr=null;hov=-1;hero.style.cursor=''}});
 hero.addEventListener('pointerdown',e=>{if(!live()||e.button||onUI(e))return;const p=local(e),j=near(...p,24);
  if(j>=0){drag=j;downAt=ptr=p;moved=false;hero.setPointerCapture(e.pointerId);hero.style.cursor='grabbing';e.preventDefault()}
  else if(!e.target.closest('.ent>*')&&Math.hypot(p[0]-cx,p[1]-cy)<300*sc){RP.push({x:p[0],y:p[1],t0:performance.now()});burst(near(...p,1e4),pick())}});
 const drop=()=>{if(drag<0)return;if(!moved)burst(drag,pick());drag=-1;hero.style.cursor=hov>=0?'grab':''};
 hero.addEventListener('pointerup',drop);hero.addEventListener('pointercancel',drop);
 paint();size();go()})();

/* ---- small interactions scattered around the page ---- */
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),2200)}
/* emoji / glyph particles flying out of a point */
function pop(px,py,items,n=10){for(let i=0;i<n;i++){const s=document.createElement('i'),r=Math.random()*6.283,d=50+Math.random()*80;s.className='emo';s.textContent=items[i%items.length];
 s.style.cssText=`left:${px}px;top:${py}px;--dx:${Math.cos(r)*d}px;--dy:${Math.sin(r)*d-40}px;--r:${Math.random()*80-40}deg`;document.body.append(s);setTimeout(()=>s.remove(),900)}}
/* stat cards burst their emoji when clicked */
$$('[data-burst]').forEach(c=>{const it=c.dataset.burst.split(' ');c.classList.add('cursor-pointer','select-none');c.addEventListener('click',e=>pop(e.clientX,e.clientY,it,12))});
/* track statuses and mentor names decode into a new quip on each click, then cycle back */
$$('[data-msgs]').forEach(el=>{const m=[...el.dataset.msgs.split('|'),el.textContent];let i=0;el.closest('.card').classList.add('cursor-pointer','select-none');el.closest('.card').addEventListener('click',()=>scramble(el,m[i++%m.length]))});
/* the goose honks back */
{const g=$('#honk'),lines=['HONK!','honk honk','HONK?!','*angry honking*','hjonk'];let ac;
 g.addEventListener('click',()=>{g.classList.remove('honking');void g.offsetWidth;g.classList.add('honking');
  const b=document.createElement('span');b.className='bubble';b.textContent=lines[Math.random()*lines.length|0];g.append(b);setTimeout(()=>b.remove(),1100);
  try{ac=ac||new AudioContext();const t=ac.currentTime,o=ac.createOscillator(),fl=ac.createBiquadFilter(),v=ac.createGain();
   o.type='sawtooth';o.frequency.setValueAtTime(440,t);o.frequency.exponentialRampToValueAtTime(280,t+.2);fl.type='bandpass';fl.frequency.value=1100;fl.Q.value=1.5;
   v.gain.setValueAtTime(.0001,t);v.gain.exponentialRampToValueAtTime(.15,t+.02);v.gain.exponentialRampToValueAtTime(.0001,t+.25);
   o.connect(fl).connect(v).connect(ac.destination);o.start(t);o.stop(t+.26)}catch(e){}})}
/* schedule terminal: a tiny shell. Try `help`. */
{const form=$('#term-form'),inp=$('#term-in'),out=$('#term-out'),hist=[];let hi=0;
 const say=(...l)=>{l.forEach(s=>{const d=document.createElement('div');d.textContent=s;out.append(d)});while(out.childElementCount>14)out.firstChild.remove()};
 const jump=id=>setTimeout(()=>$(id).scrollIntoView({behavior:RM.matches?'auto':'smooth'}),450);
 const C={help:()=>say('commands: schedule  tracks  register  faq  whoami  ls  goose  clear'),
  schedule:()=>say('feb 25     kickoff   · opening ceremony + briefing','feb 25–27  build     · squads, workshops, mentors','feb 27     demo day  · pitch, judging, awards'),
  tracks:()=>say('track_a    status: loading…','track_b    status: loading…','briefs drop once sponsors are confirmed'),
  register:()=>{say('→ jumping to registration…');jump('#join')},
  faq:()=>{say('→ opening the FAQ…');jump('#faq')},
  whoami:()=>say('a future NottsHack 27 builder'),
  ls:()=>say('ideas/  squad/  snacks/  README.md'),
  cat:a=>say(a.toLowerCase()=='readme.md'?'dream it. code it. ship it.':`cat: ${a||'?'}: no such file`),
  goose:()=>{say('honk.');const r=inp.getBoundingClientRect();spawn(r.left+40,r.top)},
  clear:()=>{out.textContent=''},
  sudo:()=>say('nice try.'),
  exit:()=>say('there is no exit. only shipping.'),
  hello:()=>say('hey 👋 type help'),hi:()=>C.hello()};
 form.addEventListener('submit',e=>{e.preventDefault();const v=inp.value.trim();inp.value='';if(!v)return;hist.push(v);hi=hist.length;say('$ '+v);
  const[c,...a]=v.split(/\s+/);(C[c.toLowerCase()]||(()=>say(`command not found: ${c} (try help)`)))(a.join(' '))});
 inp.addEventListener('keydown',e=>{if(e.key=='ArrowUp'&&hi>0){inp.value=hist[--hi];e.preventDefault()}else if(e.key=='ArrowDown'){hi=Math.min(hist.length,hi+1);inp.value=hist[hi]||''}});
 $('.term').addEventListener('click',e=>{if(!getSelection().toString())inp.focus({preventScroll:true})})}
/* hidden tokens: six ✦ dropped in random spots on every visit. Find them all for a goose party. */
{const K=6,hint=$('#tokens'),secs=$$('main .sec').sort(()=>Math.random()-.5).slice(0,K);let n=0;
 secs.forEach((s,i)=>{const b=document.createElement('button');b.type='button';b.className='token';b.textContent='✦';b.tabIndex=-1;b.setAttribute('aria-hidden','true');
  b.style.cssText=`left:${3+Math.random()*92}%;top:${6+Math.random()*86}%;--c:${['#7dffb2','#ff7ad9','#9aa5ff'][i%3]};animation-delay:${-Math.random()*3}s`;s.append(b);
  b.onclick=e=>{b.remove();n++;pop(e.clientX,e.clientY,['✦','✧','✦'],10);hint.textContent=n<K?`✦ ${n}/${K} found`:`✦ all ${K} found. legend.`;
   toast(n<K?`✦ token ${n}/${K} found`:'All tokens found. Goose party!');
   if(n==K)for(let k=0;k<5;k++)setTimeout(()=>spawn(Math.random()*VW(),Math.random()*VH()),k*180)}})}
