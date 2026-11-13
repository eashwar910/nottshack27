// Fallback logo ratio (height/width) used only until the real image has loaded; after that the real rendered size is measured.
const LOGO_RATIO = 0.454;
const $=(s)=>document.querySelector(s),$$=(s)=>[...document.querySelectorAll(s)],RM=matchMedia('(prefers-reduced-motion: reduce)');
/* hover: letter hop on headings */
$$('.fx').forEach(e=>{const t=e.textContent;e.setAttribute('aria-label',t);
 if(e.matches('h1,h2,h3,.fx-w')){/* headings: keep each word together, wrap only between words */
  let i=0;e.innerHTML=t.trim().split(/\s+/).map(w=>{const x=`<em class="fxw">${[...w].map(c=>`<span aria-hidden="true" style="--i:${i++}">${c}</span>`).join('')}</em>`;i++;return x}).join(' ')}
 else e.innerHTML=[...t].map((c,i)=>`<span aria-hidden="true" style="--i:${i}">${c==' '?'&nbsp;':c}</span>`).join('')});
/* phone menu: toggle, close on link tap / Escape / tap outside */
{const b=$('#nav-btn'),t=$('#nav-tabs'),set=o=>{t.dataset.open=String(o);b.setAttribute('aria-expanded',o);b.setAttribute('aria-label',o?'Close menu':'Open menu')};
 b.onclick=()=>set(t.dataset.open!=='true');t.addEventListener('click',e=>{if(e.target.closest('a'))set(false)});
 addEventListener('keydown',e=>{if(e.key=='Escape')set(false)});addEventListener('pointerdown',e=>{if(!e.target.closest('nav'))set(false)})}
/* hover: scramble-decode on nav links */
$$('[data-scr]').forEach(e=>{const t=e.textContent;e.onmouseenter=()=>{let f=0;clearInterval(e._t);e._t=setInterval(()=>{e.textContent=[...t].map((c,i)=>c==' '||i<f/2?c:'#%&*+?'[Math.random()*6|0]).join('');if(++f>t.length*2){clearInterval(e._t);e.textContent=t}},35)}});
/* countdown (set the real close date) */
const END=new Date('2027-02-25T18:00:00+08:00'),cd=$$('[data-cd]');
(function c(){const d=Math.max(0,Math.floor((END-Date.now())/1000)),v=[d/86400|0,d%86400/3600|0,d%3600/60|0,d%60];cd.forEach((e,i)=>e.textContent=String(v[i]).padStart(2,'0'));$('#cdl').textContent=d?'Countdown to kickoff':'Hacking is live!';setTimeout(c,1000)})();
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
addEventListener('keydown',e=>{if(e.key=='Escape'){[...bs].forEach(kill);setContactDrawer(false);cModal.close()}});

/* life: entrance, scroll reveal, wave, ticker */
$$('.ent>*').forEach((e,i)=>e.style.animationDelay=i*90+'ms');
$$('[data-l]').forEach((l,i)=>l.style.setProperty('--i',i));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
$$('.card,.sec>h2,.sec>p,details,#timeline li,.sp-tier').forEach((e,i)=>{e.classList.add('rv');e.style.animationDelay=(i%4)*70+'ms';io.observe(e)});
{const w=['dream','code','ship','repeat'],c=['bg-orchid','bg-spring','bg-peri','bg-peach'],g=`<span class="flex shrink-0 items-center gap-6 pr-6">${w.map((x,i)=>`${x}<i class="inline-block h-2.5 w-2.5 ${c[i]}"></i><u class="block h-px w-16 bg-rim"></u>`).join('')}</span>`,h=`<span class="flex shrink-0">${g.repeat(3)}</span>`;$('.mq').innerHTML=h+h}

/* NottsHack 26 album: click a photo to open the whole set as a large slideshow (arrows / swipe-free: buttons, ← →, Esc) */
{const lb=$('#lightbox'),im=$('#lb-img'),cap=$('#lb-cap'),num=$('#lb-n'),ph=$$('.past-gallery .photo');let i=0;
 const show=k=>{const p=ph[i=(k+ph.length)%ph.length].querySelector('img');im.src=p.src;im.alt=p.alt;cap.textContent=p.alt;num.textContent=`${i+1} / ${ph.length}`};
 ph.forEach((f,k)=>{f.tabIndex=0;f.setAttribute('role','button');f.setAttribute('aria-label','Enlarge photo '+(k+1));
  const open=()=>{show(k);lb.showModal()};f.onclick=open;f.onkeydown=e=>{if(e.key=='Enter'||e.key==' '){e.preventDefault();open()}}});
 $('#lb-prev').onclick=()=>show(i-1);$('#lb-next').onclick=()=>show(i+1);$('#lb-close').onclick=()=>lb.close();
 lb.addEventListener('click',e=>{if(e.target===lb||e.target.classList.contains('lb-in'))lb.close()});
 lb.addEventListener('keydown',e=>{if(e.key=='ArrowLeft')show(i-1);else if(e.key=='ArrowRight')show(i+1)})}

/* founding sponsor stage lights: aim the two edge lamps at the sponsor card for this screen size, then start once most of the box is on screen */
{const st=$('.sp-stage'),lg=$('.sp-founding .sp-logo'),aim=()=>{const s=st.getBoundingClientRect(),l=lg.getBoundingClientRect(),tx=l.left+l.width/2-s.left,ty=l.top+l.height/2-s.top,ly=90,dxL=tx-16,dxR=s.width-16-tx,dy=ty-ly,a=Math.atan2(dy,dxL)*180/Math.PI,b=Math.atan2(dy,dxR)*180/Math.PI;
 st.style.setProperty('--aimL',(-90+a)+'deg');st.style.setProperty('--aimR',(90-b)+'deg');st.style.setProperty('--len',Math.round(Math.max(Math.hypot(dxL,dy),Math.hypot(dxR,dy))+140)+'px')};
 aim();addEventListener('resize',aim);addEventListener('load',aim);
 new IntersectionObserver((es,o)=>es.forEach(e=>{if(e.isIntersecting){aim();e.target.classList.add('in');o.unobserve(e.target)}}),{threshold:.7}).observe($('.sp-founding'))};

/* gallery slideshow: arrows, dots, swipe (native scroll-snap) and a gentle autoplay that pauses on hover/touch, off-screen and for reduced motion */
{const tr=$('.past-gallery'),sl=tr.parentElement,ph=$$('.past-gallery .photo'),lb=$('#lightbox'),n=ph.length,dots=$('#ss-dots');let cur=0,hold=false,vis=false;
 const go=k=>{cur=(k+n)%n;tr.scrollTo({left:cur*tr.clientWidth,behavior:RM.matches?'auto':'smooth'})};
 ph.forEach((_,k)=>{const d=document.createElement('button');d.type='button';d.setAttribute('aria-label','Photo '+(k+1));d.onclick=()=>go(k);dots.append(d)});
 const mark=()=>{cur=Math.round(tr.scrollLeft/tr.clientWidth);[...dots.children].forEach((d,k)=>d.setAttribute('aria-current',k==cur))};
 tr.addEventListener('scroll',mark,{passive:true});mark();
 $('#ss-prev').onclick=()=>go(cur-1);$('#ss-next').onclick=()=>go(cur+1);
 ['pointerenter','focusin','touchstart'].forEach(e=>sl.addEventListener(e,()=>hold=true,{passive:true}));['pointerleave','focusout'].forEach(e=>sl.addEventListener(e,()=>hold=false));
 new IntersectionObserver(([e])=>vis=e.isIntersecting).observe(sl);
 if(!RM.matches)setInterval(()=>{if(vis&&!hold&&!document.hidden&&!lb.open)go(cur+1)},4500)}

/* sponsors: click-to-expand committee contacts + popup (popup grid is cloned from the drawer) */
const cDrawer=$('#contact-drawer'),cBtn=$('#contact-toggle-btn'),cModal=$('#contact-modal');
$('#modal-grid').innerHTML=$('#contact-grid').innerHTML;
function setContactDrawer(open){cDrawer.dataset.open=String(open);cBtn.setAttribute('aria-expanded',open);cBtn.querySelector('.btn-text').textContent=open?'Hide Committee Contacts':'Become a sponsor'}
cBtn.onclick=()=>setContactDrawer(cDrawer.dataset.open!=='true');
/* hero "Become a sponsor": open the drawer and scroll the whole card (contacts included) into view */
$$('[data-contact-trigger]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();setContactDrawer(true);$('#sponsor-card').scrollIntoView({behavior:RM.matches?'auto':'smooth'})}));
$('#open-contact-modal').onclick=()=>cModal.showModal();
$('#close-contact-modal').onclick=()=>cModal.close();
cModal.addEventListener('click',e=>{if(e.target===cModal)cModal.close()});
