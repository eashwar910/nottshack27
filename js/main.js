// Fallback logo ratio (height/width) used only until the real image has loaded; after that the real rendered size is measured.
const LOGO_RATIO = 0.454;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)],RM=matchMedia('(prefers-reduced-motion: reduce)');
const root=document.documentElement;

/* register buttons: point them at REGISTER_URL once it is set in config.js */
if(typeof REGISTER_URL==='string'&&REGISTER_URL)$$('[data-register]').forEach(a=>{a.href=REGISTER_URL;a.target='_blank';a.rel='noopener'});

/* ---- nav: solid after scrolling, active section, sliding indicator, phone menu ---- */
{const nav=$('#nav'),tabs=$('#nav-tabs'),btn=$('#nav-btn'),ind=$('.nav-ind'),links=$$('.nav-link'),bar=$('#progress');
 const set=o=>{nav.classList.toggle('menu',o);tabs.dataset.open=String(o);btn.setAttribute('aria-expanded',o);btn.setAttribute('aria-label',o?'Close menu':'Open menu')};
 btn.onclick=()=>set(tabs.dataset.open!=='true');
 tabs.addEventListener('click',e=>{if(e.target.closest('a'))set(false)});
 addEventListener('keydown',e=>{if(e.key==='Escape')set(false)});
 addEventListener('pointerdown',e=>{if(!e.target.closest('nav'))set(false)});
 const place=l=>{if(!l||!ind||getComputedStyle(ind).display==='none')return;ind.style.setProperty('--w',l.offsetWidth+'px');ind.style.setProperty('--x',l.offsetLeft+'px');ind.classList.add('show')};
 let cur=null;const mark=l=>{if(l===cur)return;cur=l;links.forEach(a=>a.classList.toggle('on',a===l));l?place(l):ind&&ind.classList.remove('show')};
 const secs=links.map(a=>$(a.getAttribute('href'))).filter(Boolean);
 let tick=0;
 const onScroll=()=>{tick=0;const y=scrollY,h=document.documentElement.scrollHeight-innerHeight;
  nav.classList.toggle('scrolled',y>24);bar.style.setProperty('--p',h>0?Math.min(1,y/h):0);
  let a=null;for(const s of secs){if(s.getBoundingClientRect().top<innerHeight*.4)a=links[secs.indexOf(s)]}
  const last=secs[secs.length-1];if(last&&last.getBoundingClientRect().bottom<innerHeight*.4)a=null;
  mark(a)};
 addEventListener('scroll',()=>{if(!tick)tick=requestAnimationFrame(onScroll)},{passive:true});
 addEventListener('resize',()=>{place($('.nav-link.on'))});onScroll()}

/* ---- scroll reveal: cards and marked elements fade up as they enter, staggered within their group ---- */
$$('.card:not([data-rv])').forEach(c=>{if(!c.closest('[data-rv]'))c.setAttribute('data-rv','')});
{const groups=new Map();
 $$('[data-rv]').forEach(e=>{const p=e.parentElement,n=groups.get(p)||0;groups.set(p,n+1);e.style.setProperty('--d',Math.min(n,6)*80+'ms')});
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.14,rootMargin:'0px 0px -6% 0px'});
 $$('[data-rv]').forEach(e=>io.observe(e));
}

/* ---- schedule: a power line that charges up as you scroll; each day boots when the current reaches it ---- */
{const box=$('#days');if(box){
 const days=$$('.day',box),vert=matchMedia('(max-width:860px)'),HC=['#7dffb2','#ff7ad9','#ffb86b'];
 let th=[],cur=0,tgt=0,running=false;
 const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
 const measure=()=>{const r=box.getBoundingClientRect();th=days.map(d=>{const n=$('.node',d).getBoundingClientRect();return vert.matches?(n.top+n.height/2-r.top)/r.height:(n.left+n.width/2-r.left)/r.width})};
 const decode=el=>{const t=el.dataset.t;if(RM.matches||el._d)return;el._d=1;let f=0;const id=setInterval(()=>{el.textContent=[...t].map((c,i)=>c===' '||i<f?c:'#%&*+?<>/'[Math.random()*9|0]).join('');if(++f>t.length+1){clearInterval(id);el.textContent=t}},55)};
 const paint=()=>{box.style.setProperty('--p',cur.toFixed(4));let n=0;
  days.forEach((d,i)=>{const on=cur>=th[i]-.002;if(on){n++;if(!d.classList.contains('on')){d.classList.add('on');decode($('h3',d))}}else d.classList.remove('on')});
  box.style.setProperty('--hc',HC[Math.max(0,n-1)]);box.classList.toggle('live',cur>.001&&cur<.995);box.classList.toggle('done',cur>=.995)};
 const aim=()=>{const r=box.getBoundingClientRect();tgt=clamp((innerHeight*(vert.matches?.62:.72)-r.top)/(vert.matches?r.height:r.height*1.1),0,1)};
 const tick=()=>{cur+=(tgt-cur)*.11;if(Math.abs(tgt-cur)<.0006)cur=tgt;paint();if(cur!==tgt)requestAnimationFrame(tick);else running=false};
 const kick=()=>{if(!running){running=true;requestAnimationFrame(tick)}};
 const init=()=>{measure();aim();if(RM.matches){cur=1;paint()}else{cur=tgt;paint()}};
 if(RM.matches){measure();cur=1;paint()}
 else{addEventListener('scroll',()=>{aim();kick()},{passive:true});
  addEventListener('resize',()=>{measure();aim();kick()});
  init();addEventListener('load',init);if(document.fonts)document.fonts.ready.then(()=>{measure();aim();kick()})}
}}

/* ---- pixel sprites: the "Meet NottsHack" slots and the sponsor-tier emblems. Drawn from tiny bitmaps; each pixel pops in at a random moment ---- */
{const PAL={a:'var(--a)',w:'#fffaff',c:'color-mix(in srgb,var(--a) 45%,#140b29)',y:'#ffd35c',k:'#d9961c',l:'#fff6c9',g:'#7dffb2',p:'#ff7ad9',b:'#9aa5ff',o:'#ffb86b',n:'#a06a46',r:'#ff6b6b',d:'rgba(255,255,255,.22)'};
 const disc=(n,ring,fill)=>{const c=(n-1)/2,r=n/2-.2,m=[];for(let y=0;y<n;y++){let row='';for(let x=0;x<n;x++){const d=Math.hypot(x-c,y-c);row+=d>r?'.':d>r-1.15?ring:fill}m.push(row)}return m};
 const line=(x0,y0,x1,y1)=>{const p=[],n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0));for(let i=0;i<=n;i++)p.push([Math.round(x0+(x1-x0)*i/n),Math.round(y0+(y1-y0)*i/n)]);return p};
 const node=(cx,cy)=>{const p=[];for(let y=-1;y<=1;y++)for(let x=-1;x<=1;x++)p.push([cx+x,cy+y]);return p};
 const person=c=>['.www.','wwwww','wwwww','.www.',c.repeat(5),c.repeat(5)];
 const SP={
  /* about slots */
  clock:{w:13,h:13,L:[
   {map:['....aaaaa....','..aa.....aa..','.a.........a.','.a.........a.','a...........a','a...........a','a...........a','a...........a','a...........a','.a.........a.','.a.........a.','..aa.....aa..','....aaaaa....']},
   {cls:'hand',c:'w',pts:[[6,2],[6,3],[6,4],[6,5],[6,6]]},
   {c:'w',pts:[[7,6],[8,6],[9,6]]}]},
  squad:{w:29,h:6,u:.78,L:[0,1,2,3,4].map(i=>({x:i*6,cls:i<3?'pp':'pd',map:person(['g','p','b','d','d'][i])}))},
  spark:{w:15,h:14,L:[
   {cls:'star',y:2,map:['.....a.....','.....a.....','....aaa....','....aaa....','..aaaaaaa..','aaaaawaaaaa','..aaaaaaa..','....aaa....','....aaa....','.....a.....','.....a.....']},
   {cls:'tw1',x:11,y:0,map:['.w.','www','.w.']},
   {cls:'tw2',x:12,y:11,map:['.w.','www','.w.']}]},
  trophy:{w:13,h:12,L:[
   {cls:'cup',map:['.yyyyyyyyyyy.','yy.yyyyyyy.yy','y..yyyyyyy..y','yy.yyyyyyy.yy','...yyyyyyy...','....yyyyy....','.....yyy.....']},
   {y:7,map:['......y......','......y......','.....yyy.....','....yyyyy....','....yyyyy....']},
   {cls:'shine',c:'w',pts:[[4,1],[5,1],[4,2]]}]},
  burger:{w:13,h:11,L:[
   {cls:'bun',map:['...ooooooo...','.ooooooooooo.','ooowooowooooo','ooooooooooooo']},
   {y:4,map:['ggggggggggggg','.yyyyyyyyyyy.','.nnnnnnnnnnn.','.nnnnnnnnnnn.','ooooooooooooo','.ooooooooooo.','..ooooooooo..']}]},
  notes:{w:11,h:9,L:[
   {cls:'notes',map:['...aaaaaaaa','...aaaaaaaa','...a......a','...a......a','...a......a','...a......a','.aaa....aaa','aaaa....aaa','.aa......aa']}]},
  /* the NottsHack goose, for the hero title */
  goose:{w:14,h:16,L:[{map:['.......wwww...','......wwwwww..','......wkwwwoo.','......wwwwoo..','......wwww....','.....wwww.....','.....wwww.....','....wwwww.....','w...wwwwwww...','ww.wwwwwwwwww.','wwwwggggggwwg.','wwwwwggggwwww.','.wwwwwwwwwwg..','..wwwwwwwwg...','....o...o.....','...ooo.ooo....']}]},
  /* sponsor tiers */
  crown:{w:15,h:9,L:[{map:['w......w......w','aa....aaa....aa','aa...aaaaa...aa','aaa.aaaaaaa.aaa','aaaaaaaaaaaaaaa','aaaaaaaaaaaaaaa','aaawaaawaaawaaa','aaaaaaaaaaaaaaa','aaaaaaaaaaaaaaa']}]},
  gem:{w:13,h:11,L:[{map:['...wwwwwww...','..waaaaaaaw..','.waaaaaaaaaw.','wwwwwwwwwwwww','.aaaaaaccccc.','..aaaaaccccc.','...aaaaccc...','....aaacc....','.....aacc....','......ac.....','.......c.....']}]},
  medal:{w:13,h:13,L:[{map:disc(13,'w','a')},{c:'c',pts:[[6,3],[6,4],[4,5],[5,5],[6,5],[7,5],[8,5],[5,6],[6,6],[7,6],[5,7],[6,7],[7,7],[5,8],[7,8]]}]},
  coin:{w:13,h:13,L:[{map:disc(13,'k','y')},{c:'k',pts:[[5,4],[6,4],[7,4],[6,5],[6,6],[6,7],[6,8],[5,9],[6,9],[7,9]]},{c:'l',pts:[[3,4],[3,5],[4,3]]}]},
  net:{w:15,h:13,L:[{c:'c',pts:[...line(7,1,2,11),...line(7,1,12,11),...line(2,11,12,11)]},{c:'w',pts:[...node(7,1),...node(2,11),...node(12,11)]}]}
 };
 const rect=(x,y,c)=>`<rect x="${x}" y="${y}" width="1" height="1" style="fill:${PAL[c]};--r:${(Math.random()*.75).toFixed(2)}s"/>`;
 $$('[data-sprite]').forEach(el=>{const d=SP[el.dataset.sprite];if(!d)return;
  const g=d.L.map(l=>{let o='';const ox=l.x||0,oy=l.y||0;
   if(l.pts)l.pts.forEach(([x,y])=>o+=rect(x+ox,y+oy,l.c));
   else l.map.forEach((row,y)=>[...row].forEach((c,x)=>{if(c!=='.')o+=rect(x+ox,y+oy,c)}));
   return `<g class="${l.cls||''}">${o}</g>`}).join('');
  el.innerHTML=`<svg viewBox="0 0 ${d.w} ${d.h}" shape-rendering="crispEdges" style="width:calc(var(--u)*${d.u||1}*${d.w});height:calc(var(--u)*${d.u||1}*${d.h})">${g}</svg>`})}

/* ---- headings decode as they scroll in (the display font is monospaced, so nothing shifts) ---- */
if(!RM.matches){const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;io.unobserve(e.target);const el=e.target,t=el.textContent;let f=0;
  const id=setInterval(()=>{el.textContent=[...t].map((c,i)=>c===' '||c===' '||i<f?c:'#%&*+?<>/'[Math.random()*9|0]).join('');if(++f>t.length+1){clearInterval(id);el.textContent=t}},38)}),{threshold:.6});
 $$('.h2').forEach(h=>io.observe(h))}

/* ---- card spotlight: a soft glow follows the cursor ---- */
if(matchMedia('(hover:hover)').matches)document.addEventListener('pointermove',e=>{const c=e.target.closest&&e.target.closest('.card');if(!c)return;const r=c.getBoundingClientRect();c.style.setProperty('--mx',e.clientX-r.left+'px');c.style.setProperty('--my',e.clientY-r.top+'px')},{passive:true});

/* ---- count-up numbers ---- */
{const fmt=(n,e)=>(e.dataset.prefix||'')+Math.round(n).toLocaleString('en-US')+(e.dataset.suffix||'');
 const run=e=>{const to=+e.dataset.count;if(RM.matches){e.textContent=fmt(to,e);return}const t0=performance.now(),d=1400;
  (function f(t){const u=Math.min(1,(t-t0)/d);e.textContent=fmt(to*(1-Math.pow(1-u,4)),e);if(u<1)requestAnimationFrame(f)})(t0)};
 const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){run(x.target);io.unobserve(x.target)}}),{threshold:.6});
 $$('[data-count]').forEach(e=>{e.textContent=fmt(0,e);io.observe(e)})}

/* ---- countdown ---- */
const END=new Date('2027-02-25T18:00:00+08:00'),cd=$$('[data-cd]');
(function c(){const d=Math.max(0,Math.floor((END-Date.now())/1000)),v=[d/86400|0,d%86400/3600|0,d%3600/60|0,d%60];cd.forEach((e,i)=>e.textContent=String(v[i]).padStart(2,'0'));$('#cdl').textContent=d?'Kickoff in':'Hacking is live!';setTimeout(c,1000)})();

/* ---- FAQ accordion (smooth open/close) ---- */
$$('.faq-q').forEach(q=>q.addEventListener('click',()=>{const i=q.closest('.faq-i'),o=!i.classList.contains('open');i.classList.toggle('open',o);q.setAttribute('aria-expanded',o)}));

/* ---- sponsor tiers + tracks: logos and sponsors come from config.js; each tier has its own reveal (see the css) ---- */
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
{const tiers=$$('.tier');
 tiers.forEach(t=>{const list=(typeof SPONSORS!=='undefined'&&SPONSORS[t.dataset.tier])||[];if(!list.length)return;
  $('.tiles',t).innerHTML=list.map((s,i)=>{const inner=s.logo?`<img src="${esc(s.logo)}" alt="${esc(s.name)}" loading="lazy" decoding="async"/>`:`<span>${esc(s.name)}</span>`,cls='tile'+(s.light?' light':''),st=`style="--i:${i}"`;
   return s.url?`<a class="${cls}" ${st} href="${esc(s.url)}" target="_blank" rel="noopener" aria-label="${esc(s.name)}">${inner}</a>`:`<div class="${cls}" ${st} role="img" aria-label="${esc(s.name)}">${inner}</div>`}).join('');
  t.classList.add('has')});
 const gold=$('.t-gold .fx');if(gold)for(let i=0;i<9;i++){const s=document.createElement('i');s.className='spk';s.style.cssText=`left:${8+Math.random()*84}%;top:${12+Math.random()*76}%;--dl:${(Math.random()*2.6).toFixed(2)}s`;gold.append(s)}
 if($$('.tier.has').length){$('#sp-title').textContent='Sponsors & Partners';$('#sp-lede').textContent='NottsHack 2027 is made possible by these partners. Want to join them? Pick a tier below.'}
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.3});
 tiers.forEach(t=>io.observe(t))}
{const T=(typeof TRACKS!=='undefined'&&TRACKS)||[];
 $$('.track').forEach((el,i)=>{const t=T[i];if(!t||(!t.sponsor&&!t.title&&!t.brief))return;
  if(t.title)$('.track-t',el).textContent=t.title;
  if(t.brief)$('.track-brief',el).innerHTML=`<p class="s">${esc(t.brief)}</p>`;
  if(t.sponsor){const s=t.sponsor;$('.track-sp',el).innerHTML=`<span class="name">${s.logo?`<img src="${esc(s.logo)}" alt=""/>`:''}${esc(s.name)}</span>`;$('.link-go',el).hidden=true}})}

/* ---- "Be a … sponsor" buttons jump to the contact card with that interest filled in ---- */
{const card=$('#contact'),chips=$$('[data-chip]'),links=$$('[data-wa],[data-mail]');let cur='';
 const msg=p=>p?`Hi! I'm interested in becoming a ${p} for NottsHack '27.`:`Hi! I'd like to know more about sponsoring NottsHack '27.`;
 const apply=p=>{cur=p;const k=p.toLowerCase();chips.forEach(c=>c.setAttribute('aria-pressed',String(!!p&&k.startsWith(c.dataset.chip))));
  links.forEach(a=>{const m=msg(p);a.href=a.dataset.wa?`https://wa.me/${a.dataset.wa}?text=${encodeURIComponent(m)}`:`mailto:${a.dataset.mail}?subject=${encodeURIComponent("NottsHack '27: "+(p||'sponsorship'))}&body=${encodeURIComponent(m)}`})};
 chips.forEach(c=>c.addEventListener('click',()=>apply(cur===c.dataset.pick?'':c.dataset.pick)));
 $$('[data-pick]:not([data-chip])').forEach(b=>b.addEventListener('click',()=>{apply(b.dataset.pick);card.scrollIntoView({behavior:RM.matches?'auto':'smooth',block:'start'});card.classList.remove('flash');void card.offsetWidth;card.classList.add('flash')}));
 apply('')}

/* ---- bouncing-logo easter egg ---- */
const GL=['#ff7ad9','#7dffb2','#9aa5ff','#ffb86b'],bs=[];let raf=0,last=0,hits=0;
/* usable viewport size (excludes scrollbars) and real rendered logo size, so bounces hit the true screen edges */
const VW=()=>Math.min(innerWidth,root.clientWidth||innerWidth),VH=()=>Math.min(innerHeight,root.clientHeight||innerHeight);
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
$$('[data-l]').forEach((l,i)=>l.style.setProperty('--i',i));
$('#wm').onclick=e=>{const l=e.target.closest('[data-l]');if(l){const r=l.getBoundingClientRect();spawn(r.left+r.width/2,r.top+r.height/2)}};
$('#poke').onclick=e=>{const r=e.currentTarget.getBoundingClientRect();spawn(r.left+r.width/2,r.top)};
addEventListener('keydown',e=>{if(e.key==='Escape')[...bs].forEach(kill)});

/* ---- NottsHack 26 album: click a photo to open the whole set in a lightbox (buttons, ← →, swipe, Esc) ---- */
{const lb=$('#lightbox'),im=$('#lb-img'),cap=$('#lb-cap'),num=$('#lb-n'),ph=$$('#gallery .photo');let i=0;
 const show=(k,anim)=>{const p=ph[i=(k+ph.length)%ph.length].querySelector('img');im.src=p.currentSrc||p.src;im.alt=p.alt;cap.textContent=p.alt;num.textContent=`${i+1} / ${ph.length}`;
  if(anim&&!RM.matches){im.classList.remove('swap');void im.offsetWidth;im.classList.add('swap')}};
 ph.forEach((f,k)=>{f.tabIndex=0;f.setAttribute('role','button');f.setAttribute('aria-label','Enlarge photo '+(k+1));
  const open=()=>{show(k,true);lb.showModal()};f.onclick=open;f.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}}});
 $('#lb-prev').onclick=()=>show(i-1,true);$('#lb-next').onclick=()=>show(i+1,true);$('#lb-close').onclick=()=>lb.close();
 lb.addEventListener('click',e=>{if(e.target===lb||e.target.classList.contains('lb-in'))lb.close()});
 lb.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')show(i-1,true);else if(e.key==='ArrowRight')show(i+1,true)});
 let sx=0;lb.addEventListener('touchstart',e=>sx=e.changedTouches[0].clientX,{passive:true});
 lb.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>50)show(i+(d<0?1:-1),true)},{passive:true})}
