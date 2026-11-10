/* Hero canvas: an interactive tesseract in front of 3D wireframe shapes, jacks and dust.
   Tesseract: drag to spin it (it keeps its momentum), shift-drag to rotate through the 4th dimension,
   hover a node to light its edges, click a node to send a pulse racing through the graph.
   Everything else floats at its own depth: nearer things drift more with the cursor and are drawn in front.
   Uses $ and RM from main.js. */
(() => {
  const cv = $('#fx'), hero = $('#top'), x = cv.getContext('2d');
  const M = '125,255,178', P = '255,122,217', L = '214,203,245', B = '154,165,255', O = '255,184,107';
  const R = (c, a) => `rgba(${c},${a})`, TAU = 6.2832;
  let W, H, sc, raf = 0, vis = true, wide = false, mx = 0, my = 0, tx = 0, ty = 0, lt = 0;
  let sd = 7; const rn = () => (sd = sd * 16807 % 2147483647) / 2147483647;

  /* ---- 3D wireframes: n-sided bipyramids ('bi') and prisms ('pr'), z = depth in [-1 far, 1 near] ---- */
  const ring = (n, y) => Array.from({ length: n }, (_, i) => [Math.cos(i * TAU / n), y, Math.sin(i * TAU / n)]);
  function shape(k, n) {
    const e = []; let v;
    if (k == 'bi') { v = [[0, -1.25, 0], [0, 1.25, 0], ...ring(n, 0)]; for (let i = 0; i < n; i++) e.push([0, 2 + i], [1, 2 + i], [2 + i, 2 + (i + 1) % n]) }
    else { v = [...ring(n, -.75), ...ring(n, .75)]; for (let i = 0; i < n; i++) e.push([i, (i + 1) % n], [n + i, n + (i + 1) % n], [i, n + i]) }
    return { v, e };
  }
  const G = [
    { k: 'bi', n: 5, fx: .50, fy: .22, r: 30, c: L, a: .6, s: .0005, z: -.5 },
    { k: 'pr', n: 6, fx: .58, fy: .80, r: 18, c: P, a: .65, s: -.0006, z: .55 },
    { k: 'bi', n: 7, fx: .80, fy: .84, r: 28, c: L, a: .6, s: .0004, z: -.2 },
    { k: 'pr', n: 8, fx: .92, fy: .14, r: 16, c: B, a: .5, s: .0005, z: .6 },
    { k: 'bi', n: 5, fx: .06, fy: .12, r: 12, c: P, a: .4, s: -.0004, z: -.75 },
    { k: 'pr', n: 4, fx: .04, fy: .62, r: 14, c: B, a: .45, s: .0006, z: .3 },
    { k: 'bi', n: 6, fx: .66, fy: .06, r: 13, c: O, a: .4, s: -.0005, z: .15 }
  ];
  G.forEach(o => { o.sh = shape(o.k, o.n); o.ph = rn() * TAU; o.f = solid });
  /* jacks: three crossed bars that tumble in 3D */
  const S = [{ fx: .06, fy: .78, sz: 10, c: M, z: .4 }, { fx: .955, fy: .5, sz: 18, c: M, z: -.3 }, { fx: .9, fy: .04, sz: 9, c: P, z: .7 }];
  S.forEach(o => o.f = jack);
  const ITEMS = [...G, ...S].sort((a, b) => a.z - b.z), FAR = ITEMS.filter(o => o.z < 0), NEAR = ITEMS.filter(o => o.z >= 0);
  const D = Array.from({ length: 34 }, () => ({ fx: rn(), fy: rn(), r: .8 + rn() * 2, p: rn() * TAU, c: rn() > .6 ? P : L, z: rn() * 2 - 1 }));

  function solid(o, t) {
    const d = (o.z + 1) / 2, ox = W * o.fx + mx * (10 + 22 * d), oy = H * o.fy + Math.sin(t * .0007 + o.fx * 9) * 8 + my * (8 + 16 * d), r = o.r * sc * (.8 + .5 * d);
    const ax = t * o.s * 1.4 + o.ph + ty * .6, ay = t * o.s * 2.2 + tx * .8, ca = Math.cos(ax), sa = Math.sin(ax), cb = Math.cos(ay), sb = Math.sin(ay);
    const p = o.sh.v.map(([X, Y, Z]) => {
      const y1 = Y * ca - Z * sa, z1 = Y * sa + Z * ca, x2 = X * cb + z1 * sb, z2 = -X * sb + z1 * cb, k = 1 / (1 - z2 * .18);
      return [ox + x2 * r * k, oy + y1 * r * k, z2];
    });
    x.lineWidth = 1 + .5 * d;
    o.sh.e.forEach(([a, b]) => { x.strokeStyle = R(o.c, o.a * (.4 + .6 * d) * (.65 + .25 * (p[a][2] + p[b][2]) / 2)); x.beginPath(); x.moveTo(p[a][0], p[a][1]); x.lineTo(p[b][0], p[b][1]); x.stroke() });
    x.fillStyle = R(o.c, o.a * (.5 + .5 * d) + .15);
    p.forEach(q => { x.beginPath(); x.arc(q[0], q[1], (1 + d) * (.8 + .25 * q[2]), 0, TAU); x.fill() });
  }
  function jack(o, t) {
    const d = (o.z + 1) / 2, px = W * o.fx + mx * (8 + 20 * d), py = H * o.fy + Math.sin(t * .0009 + o.fx * 9) * 4 + my * (6 + 12 * d), r = o.sz * sc * (.8 + .5 * d);
    const a = t * .0009 + o.fx * 9, b = t * .0007 + o.fx * 5, ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b);
    x.strokeStyle = R(o.c, .45 + .4 * d); x.lineWidth = Math.max(2, r * .34 * (.7 + .4 * d));
    [[1, 0, 0], [0, 1, 0], [0, 0, 1]].forEach(([X, Y, Z]) => {
      const x1 = X * ca + Z * sa, z1 = -X * sa + Z * ca, y2 = Y * cb - z1 * sb, k = 1 / (1 - (Y * sb + z1 * cb) * .25), vx = x1 * r * k, vy = y2 * r * k;
      x.beginPath(); x.moveTo(px - vx, py - vy); x.lineTo(px + vx, py + vy); x.stroke();
    });
  }

  /* ---- tesseract: 16 vertices, 32 edges, three rotation angles ([XW, YZ, ZX]) with momentum ---- */
  const V = Array.from({ length: 16 }, (_, i) => [i & 1 ? 1 : -1, i & 2 ? 1 : -1, i & 4 ? 1 : -1, i & 8 ? 1 : -1]), TE = [];
  for (let i = 0; i < 16; i++) for (let b = 1; b < 16; b <<= 1) if (!(i & b)) TE.push([i, i | b, b == 8]);
  const adj = V.map((_, i) => TE.filter(e => e[0] == i || e[1] == i).map(e => e[0] == i ? e[1] : e[0])),
    WK = [0, 5, 10, 15].map((s, k) => ({ a: s, b: adj[s][k % 4], u: 0, sp: .0007 + k * .0002 })), pt = v => v.reduce((n, q) => n + (q > 0), 0) % 2;
  const IDLE = [.00032, .00021, .00027], ang = [0, 0, 0], vel = [...IDLE], gl = new Array(16).fill(0), PU = [], RP = [];
  let Q = [], bb = [0, 0, 0, 0], ptr = null, hov = -1, drag = false, moved = false, cand = -1, down, lx, ly, lT, hint = 1, used = false;

  const live = () => wide && !RM.matches;
  const fire = j => { gl[j] = 1; RP.push({ x: Q[j].x, y: Q[j].y, t0: performance.now() }); adj[j].forEach(k => PU.length < 120 && PU.push({ a: j, b: k, u: 0, g: 0, c: pt(V[j]) ? P : M })) };
  const near = p => { let b = -1, d = (24 * sc) ** 2; Q.forEach((q, j) => { const dd = (q.x - p[0]) ** 2 + (q.y - p[1]) ** 2; if (dd < d) { d = dd; b = j } }); return b };

  function graph(t, dt) {
    const cx = wide ? W * .74 : W / 2, cy = Math.min(H * .46, 300 * sc), S = 620 * sc;
    for (let i = 0; i < 3; i++) {
      if (drag) vel[i] *= Math.exp(-dt / 80);                                  /* held still: no fling on release */
      else { ang[i] += vel[i] * dt; vel[i] += (IDLE[i] - vel[i]) * Math.min(1, dt * .0015) }  /* coast, then ease back to the idle spin */
    }
    const [A, Bb, C] = ang, cA = Math.cos(A), sA = Math.sin(A), cB = Math.cos(Bb), sB = Math.sin(Bb), cC = Math.cos(C), sC = Math.sin(C);
    const p = V.map(v => {
      let [X, Y, Z, Wd] = v, q = X * cA - Wd * sA, w = X * sA + Wd * cA; X = q; Wd = w;      /* 4D spin (XW) */
      q = Y * cB - Z * sB; let z = Y * sB + Z * cB; Y = q; Z = z;
      const k4 = 1 / (2.6 - Wd * .7); X *= k4; Y *= k4; Z *= k4;                              /* project 4D to 3D */
      q = X * cC + Z * sC; z = -X * sC + Z * cC; X = q; Z = z; const k3 = 1 / (3 - Z * .8);
      return { x: cx + X * S * k3 + mx * 10, y: cy + Y * S * k3 + my * 8, d: k3 };
    });
    Q = p; bb = [Math.min(...p.map(q => q.x)), Math.min(...p.map(q => q.y)), Math.max(...p.map(q => q.x)), Math.max(...p.map(q => q.y))];
    hov = ptr && live() && !drag ? near([ptr[0], ptr[1]]) : -1;
    gl.forEach((g, i) => gl[i] = Math.max(0, g - dt / 900));
    if (hov >= 0) gl[hov] = Math.max(gl[hov], .45);

    x.lineCap = 'round';
    TE.forEach(([a, b, w4]) => {
      const lit = a == hov || b == hov, c = w4 ? M : P;
      x.shadowColor = R(c, .7); x.shadowBlur = lit ? 14 : 8; x.strokeStyle = R(c, lit ? 1 : .4 + .5 * (p[a].d + p[b].d) / .9); x.lineWidth = (w4 ? 1.4 : 2) + (lit ? 1 : 0);
      x.beginPath(); x.moveTo(p[a].x, p[a].y); x.lineTo(p[b].x, p[b].y); x.stroke();
    });
    for (let k = RP.length - 1; k >= 0; k--) { const r = RP[k], u = (t - r.t0) / 700; if (u >= 1) { RP.splice(k, 1); continue } if (u < 0) continue; x.shadowBlur = 0; x.strokeStyle = R(M, (1 - u) * .6); x.lineWidth = 1.5; x.beginPath(); x.arc(r.x, r.y, 8 + u * 90 * sc, 0, TAU); x.stroke() }
    /* clicked pulses hop node to node (up to 3 hops), lighting each vertex they reach */
    for (let k = PU.length - 1; k >= 0; k--) {
      const s = PU[k]; s.u += dt / 360;
      if (s.u >= 1) {
        PU.splice(k, 1); gl[s.b] = Math.max(gl[s.b], .85 - .2 * s.g);
        if (s.g < 2 && PU.length < 120) adj[s.b].filter(q => q != s.a).sort(() => Math.random() - .5).slice(0, 2).forEach(q => PU.push({ a: s.b, b: q, u: 0, g: s.g + 1, c: s.c }));
        continue;
      }
      const A1 = p[s.a], B1 = p[s.b], u0 = Math.max(0, s.u - .35), hx = A1.x + (B1.x - A1.x) * s.u, hy = A1.y + (B1.y - A1.y) * s.u, g = x.createLinearGradient(A1.x + (B1.x - A1.x) * u0, A1.y + (B1.y - A1.y) * u0, hx, hy);
      g.addColorStop(0, R(s.c, 0)); g.addColorStop(1, R(s.c, .95)); x.shadowBlur = 0; x.strokeStyle = g; x.lineWidth = 2.4; x.beginPath(); x.moveTo(A1.x + (B1.x - A1.x) * u0, A1.y + (B1.y - A1.y) * u0); x.lineTo(hx, hy); x.stroke();
      x.shadowColor = R(s.c, 1); x.shadowBlur = 14; x.fillStyle = R(s.c, 1); x.beginPath(); x.arc(hx, hy, 3.2, 0, TAU); x.fill();
    }
    V.forEach((v, i) => {
      const c = pt(v) ? P : M, u = (Math.sin(t * .002 + i) + 1) / 2, g = gl[i], r = 14 * p[i].d * sc + u + (i == hov ? 3 : 0) + g * 5;
      x.shadowColor = R(c, .9); x.shadowBlur = 14 + g * 22; x.fillStyle = R(c, 1); x.beginPath(); x.arc(p[i].x, p[i].y, r, 0, TAU); x.fill();
      if (g > .05) { x.shadowBlur = 0; x.strokeStyle = R('255,255,255', g * .8); x.lineWidth = 1.5; x.beginPath(); x.arc(p[i].x, p[i].y, r + 3 + (1 - g) * 8, 0, TAU); x.stroke() }
    });
    WK.forEach(k => { k.u += k.sp * dt; if (k.u >= 1) { const a = k.b; k.u = 0; k.b = adj[a][Math.random() * 4 | 0]; k.a = a } const A1 = p[k.a], B1 = p[k.b]; x.shadowColor = '#fff'; x.shadowBlur = 18; x.fillStyle = '#fff'; x.beginPath(); x.arc(A1.x + (B1.x - A1.x) * k.u, A1.y + (B1.y - A1.y) * k.u, 3.4, 0, TAU); x.fill() });
    x.shadowBlur = 0;
    if (live() && hint > 0) { x.font = '11px "Space Mono",monospace'; x.textAlign = 'center'; x.fillStyle = R(L, .5 * hint); x.fillText('drag to spin · shift-drag for 4D · click a node', cx, bb[3] + 34); x.textAlign = 'start'; if (used) hint = Math.max(0, hint - dt / 1500) }
  }

  function draw(t) {
    const dt = lt ? Math.min(t - lt, 50) : 0; lt = t;
    mx += (tx - mx) * .05; my += (ty - my) * .05; x.clearRect(0, 0, W, H);
    D.forEach(d => { const e = (d.z + 1) / 2; x.fillStyle = R(d.c, (.25 + .45 * (Math.sin(t * .0012 + d.p) + 1) / 2) * (.5 + .5 * e)); x.beginPath(); x.arc(W * d.fx + mx * (4 + 18 * e), H * d.fy + my * (3 + 12 * e), d.r * (.6 + .8 * e), 0, TAU); x.fill() });
    x.lineCap = 'round'; FAR.forEach(o => o.f(o, t)); graph(t, dt); x.lineCap = 'round'; NEAR.forEach(o => o.f(o, t));
  }

  function size() {
    const d = Math.min(devicePixelRatio || 1, 2); W = cv.clientWidth; H = cv.clientHeight; cv.width = W * d; cv.height = H * d; x.setTransform(d, 0, 0, d, 0, 0);
    wide = W > 820; sc = Math.min(Math.max(W / 900, .55), 1.2); if (RM.matches) draw(0);
  }
  const f = t => { draw(t); raf = requestAnimationFrame(f) }, go = () => { if (!raf && vis && !document.hidden && !RM.matches) raf = requestAnimationFrame(f) }, no = () => { cancelAnimationFrame(raf); raf = 0 };
  new ResizeObserver(size).observe(cv); new IntersectionObserver(([e]) => { vis = e.isIntersecting; vis ? go() : no() }).observe(cv);
  document.addEventListener('visibilitychange', () => { lt = 0; document.hidden ? no() : go() });
  addEventListener('pointermove', e => { tx = (e.clientX / innerWidth - .5) * 2; ty = (e.clientY / innerHeight - .5) * 2 }, { passive: true });

  /* pointer input lives on the hero section (the canvas sits behind the text) */
  const local = e => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top] }, onUI = e => e.target.closest('a,button,input,.card,[data-l]');
  const inBox = p => p[0] > bb[0] - 30 && p[0] < bb[2] + 30 && p[1] > bb[1] - 30 && p[1] < bb[3] + 30;
  hero.addEventListener('pointermove', e => {
    if (!live()) return; ptr = local(e);
    if (drag) {
      const dx = e.clientX - lx, dy = e.clientY - ly, dtm = Math.max(e.timeStamp - lT, 1); lx = e.clientX; ly = e.clientY; lT = e.timeStamp;
      if (Math.hypot(ptr[0] - down[0], ptr[1] - down[1]) > 4) moved = true;
      const d = e.shiftKey ? [dx * .006, 0, 0] : [0, -dy * .006, dx * .006];
      d.forEach((v, i) => { ang[i] += v; vel[i] = Math.max(-.006, Math.min(.006, vel[i] * .5 + v / dtm * .5)) });
    } else hero.style.cursor = onUI(e) ? '' : hov >= 0 ? 'pointer' : inBox(ptr) ? 'grab' : '';
  });
  hero.addEventListener('pointerleave', () => { if (!drag) { ptr = null; hov = -1; hero.style.cursor = '' } });
  hero.addEventListener('pointerdown', e => {
    if (!live() || e.button || onUI(e)) return; const p = local(e); if (!inBox(p)) return;
    drag = true; moved = false; used = true; down = ptr = p; lx = e.clientX; ly = e.clientY; lT = e.timeStamp; cand = near(p);
    hero.setPointerCapture(e.pointerId); hero.style.cursor = 'grabbing'; hero.style.userSelect = 'none'; e.preventDefault();
  });
  const drop = () => { if (!drag) return; drag = false; hero.style.userSelect = ''; if (!moved && cand >= 0) fire(cand); hero.style.cursor = cand >= 0 && !moved ? 'pointer' : 'grab' };
  hero.addEventListener('pointerup', drop); hero.addEventListener('pointercancel', drop);
  size(); go();
})();
