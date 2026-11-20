/* Hero canvas: one particle field that morphs between four forms.
     01 DREAM IT  a spiral galaxy
     02 CODE IT   a crystal lattice with signals running along it
     03 THE GOOSE the NottsHack logo goose, rebuilt from thousands of coloured specks sampled from the artwork
     04 SHIP IT   the pixel "27"
   Drag to spin it, click to morph to the next form, hover to push the particles around.
   Uses $, RM and root from main.js. */
(() => {
  const cv = $('#fx'), hero = $('#top'), x = cv.getContext('2d');
  const lite = root.classList.contains('lite');
  const TAU = Math.PI * 2, L = 10, N = L * L * L;
  const COL = ['rgb(125,255,178)', 'rgb(255,122,217)', 'rgb(154,165,255)', 'rgb(255,184,107)', 'rgb(255,250,255)']; /* g p b o w */
  const NAMES = ['Dream it', 'Code it', 'The goose', 'Ship it'];
  let sd = 11; const rn = () => (sd = sd * 16807 % 2147483647) / 2147483647, gs = () => (rn() + rn() + rn() - 1.5) / 1.5;
  const smooth = u => u * u * (3 - 2 * u), clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  /* ---- three target shapes, one position + colour bucket per particle ---- */
  const GAL = new Float32Array(N * 3), LAT = new Float32Array(N * 3), TXT = new Float32Array(N * 3);
  const BG = new Uint8Array(N), BL = new Uint8Array(N), BT = new Uint8Array(N);
  const GOO = new Float32Array(N * 3), BO = new Uint8Array(N);
  const PH = [GAL, LAT, GOO, TXT], PB = [BG, BL, BO, BT];

  for (let i = 0; i < N; i++) { /* galaxy: two spiral arms plus a bright core */
    const core = i % 7 == 0, r = core ? Math.abs(gs()) * .2 : Math.pow(rn(), .72) + .08, a = r * 6 + (i % 2) * Math.PI + gs() * .35 * (1 - r * .5);
    GAL[i * 3] = r * Math.cos(a); GAL[i * 3 + 2] = r * Math.sin(a); GAL[i * 3 + 1] = gs() * .09 * (1 - r * .6) + (core ? gs() * .1 : 0);
    BG[i] = r < .2 ? (rn() < .5 ? 4 : 3) : r < .5 ? (rn() < .6 ? 3 : 1) : r < .8 ? (rn() < .6 ? 1 : 2) : (rn() < .7 ? 2 : 0);
  }
  const surf = i => { const a = i % L, b = (i / L | 0) % L, c = i / (L * L) | 0; return a % 9 == 0 || b % 9 == 0 || c % 9 == 0 };
  const EDGE = [], ADJ = Array.from({ length: N }, () => []);
  for (let i = 0; i < N; i++) { /* lattice: a 10x10x10 crystal, its surface drawn as a mesh */
    const a = i % L, b = (i / L | 0) % L, c = i / (L * L) | 0, k = .62 / 4.5;
    LAT[i * 3] = (a - 4.5) * k; LAT[i * 3 + 1] = (b - 4.5) * k; LAT[i * 3 + 2] = (c - 4.5) * k;
    const corner = a % 9 == 0 && b % 9 == 0 && c % 9 == 0;
    BL[i] = corner ? 1 : (a + b + c) % 9 == 0 ? 0 : surf(i) ? 2 : (rn() < .12 ? 4 : 2);
    [[1, a < L - 1], [L, b < L - 1], [L * L, c < L - 1]].forEach(([s, ok]) => { if (ok && surf(i) && surf(i + s)) { EDGE.push(i, i + s); ADJ[i].push(i + s); ADJ[i + s].push(i) } });
  }
  function buildText() { /* the "27", sampled from the brand pixel font so it keeps its blocky edges */
    const o = document.createElement('canvas'); o.width = 340; o.height = 240; const g = o.getContext('2d', { willReadFrequently: true });
    g.fillStyle = '#000'; g.font = '200px Monocraft, "Trebuchet MS", sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('27', 170, 125);
    const d = g.getImageData(0, 0, 340, 240).data, P = [];
    for (let py = 0; py < 240; py += 3) for (let px = 0; px < 340; px += 3) if (d[(py * 340 + px) * 4 + 3] > 140) P.push([(px - 170) / 118, (py - 125) / 118]);
    for (let i = P.length - 1; i > 0; i--) { const j = rn() * (i + 1) | 0;[P[i], P[j]] = [P[j], P[i]] }
    if (!P.length) P.push([0, 0]);
    for (let i = 0; i < N; i++) {
      const p = P[i % P.length], j = i < P.length ? 0 : .03;
      TXT[i * 3] = p[0] + gs() * j; TXT[i * 3 + 1] = p[1] + gs() * j; TXT[i * 3 + 2] = (rn() - .5) * .14;
      const t = (p[1] + .5); BT[i] = t < .33 ? 0 : t < .66 ? 4 : 1;
    }
  }

  /* the goose: sampled from the NottsHack logo (a goose typing on a laptop), a pixel map where each cell is filled by three particles */
  (() => {
    const MAP = ['...........wwww..............', '..........wwwwwg.............', '.........wwwwwwoo............', '.........wwwwwwooo...........', '.........wwwwwwooo...........', '.........wwww................', '.........wwww............w...', '.........wwww..........w.w.w.', '.........wwww........w.g.w.w.', '.........wwwww........w......', '.........wwwww......w.....ggg', '.........wwwww.........gggggg', '......wwwwwwwww.....w.wgggggg', '.....wwwwwwwwww.......ggggggg', '.gwwwwwwwwwwwwwwww....gggggg.', 'gwwwwwwwwwwwwwwwwwww..gggggg.', '.wwwwwwwwwwwwwwwwwwwgggggggg.', '.wwwwwwwwwwwwwwwwwwggggggggg.', '..wwwwwwwwwwwwwwgwggggggggg..', '..wwwwwwwwwwwgggggggggggg....', '...wwwwwwwwwwgggggggggg......', '....wwwwwwwwooooogggg........', '......wwwoooooooo............', '.........oooooog.............', '..........wwo................'];
    const CH = { w: 4, g: 2, o: 3 }, W0 = 29, H0 = 25, cell = 1.9 / Math.max(W0, H0), P = [];
    MAP.forEach((row, y) => [...row].forEach((c, x) => {
      if (!CH.hasOwnProperty(c)) return;
      const sub = [[0, 0], [1, 0], [0, 1], [1, 1]]; for (let i = 3; i > 0; i--) { const j = rn() * (i + 1) | 0;[sub[i], sub[j]] = [sub[j], sub[i]] }
      for (let k = 0; k < 3; k++) P.push([(x - W0 / 2 + (sub[k][0] + .5) / 2) * cell, (y - H0 / 2 + (sub[k][1] + .5) / 2) * cell, CH[c]]);
    }));
    for (let i = P.length - 1; i > 0; i--) { const j = rn() * (i + 1) | 0;[P[i], P[j]] = [P[j], P[i]] }
    for (let i = 0; i < N; i++) { const p = P[i % P.length]; GOO[i * 3] = p[0]; GOO[i * 3 + 1] = p[1]; GOO[i * 3 + 2] = (rn() - .5) * .16; BO[i] = p[2] }
  })();

  /* the goose, in particles. The artwork is only a source of points: thousands of fine specks (each keeping its colour from the logo)
     condense out of the cloud into the goose, so it stays part of the particle world instead of being a pasted picture. */
  const EM = lite ? 3200 : 10000;
  const EX = new Float32Array(EM * 3), ES = new Float32Array(EM * 3), ED = new Float32Array(EM), EW = new Float32Array(EM), EC = new Uint8Array(EM), ER = new Uint8Array(EM);
  const EOX = new Float32Array(EM), EOY = new Float32Array(EM), EPAL = []; let gready = false, gw = 1, gh = 1, gcell = 1;
  const gimg = new Image();
  gimg.onload = () => {
    gw = gimg.naturalWidth; gh = gimg.naturalHeight; gcell = 1.8 / Math.max(gw, gh);
    const o = document.createElement('canvas'); o.width = gw; o.height = gh; const g = o.getContext('2d', { willReadFrequently: true }); g.drawImage(gimg, 0, 0);
    const d = g.getImageData(0, 0, gw, gh).data, P = [];
    for (let y = 0; y < gh; y++) for (let x = 0; x < gw; x++) {
      const k = (y * gw + x) * 4; if (d[k + 3] < 160) continue;
      P.push([x, y, d[k], d[k + 1], d[k + 2]]);
    }
    if (!P.length) return;
    for (let i = P.length - 1; i > 0; i--) { const j = rn() * (i + 1) | 0;[P[i], P[j]] = [P[j], P[i]] }
    /* base particles take the silhouette, in their usual bright colours */
    for (let i = 0; i < N; i++) {
      const p = P[i % P.length], r = p[2], gr = p[3], b = p[4];
      GOO[i * 3] = (p[0] + rn() - gw / 2) * gcell; GOO[i * 3 + 1] = (p[1] + rn() - gh / 2) * gcell; GOO[i * 3 + 2] = (rn() - .5) * .1;
      BO[i] = r > 200 && gr > 100 && gr < 215 && b < 120 ? 3 : (r + gr + b) / 3 > 190 ? 4 : 2;
    }
    /* fine specks: colour comes straight from the artwork, quantised to a small palette and grouped so colour changes are rare */
    const pick = []; for (let j = 0; j < EM; j++) pick.push(P[j % P.length]);
    const keyOf = p => (p[2] >> 5) << 6 | (p[3] >> 5) << 3 | (p[4] >> 5); pick.sort((a, b) => keyOf(a) - keyOf(b));
    const idx = new Map();
    pick.forEach((p, j) => {
      const key = keyOf(p); if (!idx.has(key)) { idx.set(key, EPAL.length); EPAL.push(`rgb(${Math.min(255, (p[2] >> 5 << 5) + 16)},${Math.min(255, (p[3] >> 5 << 5) + 16)},${Math.min(255, (p[4] >> 5 << 5) + 16)})`) }
      EC[j] = idx.get(key);
      EX[j * 3] = (p[0] + rn() - gw / 2) * gcell; EX[j * 3 + 1] = (p[1] + rn() - gh / 2) * gcell; EX[j * 3 + 2] = (rn() - .5) * .12;
      const a = rn() * TAU, rad = .5 + rn() * .9; ES[j * 3] = Math.cos(a) * rad; ES[j * 3 + 1] = Math.sin(a) * rad * .8; ES[j * 3 + 2] = (rn() - .5) * .8;
      ED[j] = rn() * .45; EW[j] = rn();
      const spark = p[2] > 200 && p[3] > 200 && p[4] > 200 && p[0] > gw * .6 && p[1] < gh * .42, hands = p[0] > gw * .3 && p[1] > gh * .55 && p[1] < gh * .85;
      ER[j] = spark ? 1 : hands ? 2 : 0;
    });
    gready = true;
  };
  gimg.src = 'assets/NottsHack-logo/goose.png';
  buildText();
  if (document.fonts && document.fonts.load) Promise.race([document.fonts.load('200px Monocraft', '27'), new Promise(r => setTimeout(r, 2500))]).then(buildText).catch(() => {});

  /* per-particle morph timing: each one leaves a little later and swirls by its own amount, so the change flows like a fluid */
  const DL = Float32Array.from({ length: N }, () => rn() * .4), SW = Float32Array.from({ length: N }, () => (.6 + rn() * .9) * (rn() < .5 ? -1 : 1));
  const SX = new Float32Array(N), SY = new Float32Array(N), SD = new Float32Array(N), SB = new Uint8Array(N);
  const OFX = new Float32Array(N), OFY = new Float32Array(N); /* how far the cursor has pushed each particle (eases out and back) */
  const DUST = Array.from({ length: lite ? 10 : 34 }, () => ({ fx: rn(), fy: rn(), r: 1 + rn() * 1.6, p: rn() * TAU, c: rn() > .6 ? 1 : 4 }));
  const WK = Array.from({ length: 5 }, () => ({ a: 0, b: 0, u: 1 }));

  /* ---- state ---- */
  let W, H, zone = 0, wide = false, raf = 0, vis = true, lt = 0, cx = 0, cy = 0, R = 1, mx = 0, my = 0, tx = 0, ty = 0;
  let cur = 0, to = 0, mp = 1, hold = 0, yaw = 0, pitchD = 0, vy = .00022, hint = 1, used = false;
  let ptr = null, drag = false, moved = false, down, lx, ly;
  const HOLD = 5200, MORPH = 2800, IDLE = .00022;
  /* ?form=0..3 shows one form and holds it (handy for checking a single shape) */
  { const q = new URLSearchParams(location.search).get('form'); if (q !== null && !isNaN(+q)) { cur = to = (+q % 4 + 4) % 4; hold = -1e9 } }
  const live = () => wide && !RM.matches;
  const next = () => { if (mp < 1) return; to = (cur + 1) % 4; mp = 0; hold = 0 };

  function draw(t) {
    const dt = lt ? Math.min(t - lt, 50) : 0; lt = t;
    mx += (tx - mx) * .05; my += (ty - my) * .05;
    x.globalCompositeOperation = 'source-over'; x.clearRect(0, 0, W, H);

    /* ambient dust */
    DUST.forEach(d => { x.globalAlpha = (.12 + .3 * (Math.sin(t * .0012 + d.p) + 1) / 2); x.fillStyle = COL[d.c]; x.fillRect(W * d.fx + mx * 10, H * d.fy + my * 8, d.r, d.r) });

    /* morph clock: hold on a form, then flow into the next */
    if (!RM.matches) {
      if (mp < 1) { mp = Math.min(1, mp + dt / MORPH); if (mp >= 1) { cur = to; hold = 0 } }
      else { hold += dt; if (hold > HOLD && !drag) next() }
    }
    const e = mp >= 1 ? 1 : smooth(mp), w = [0, 0, 0, 0]; if (mp >= 1) w[cur] = 1; else { w[cur] = 1 - e; w[to] = e }
    const wf = w[2] + w[3]; /* the goose and the "27" both turn to face the front */

    /* camera: idle spin, drag momentum, and a gentle turn to face front for the "27" */
    if (!drag) { yaw += vy * dt * (1 - wf); vy += (IDLE - vy) * Math.min(1, dt * .0015); pitchD *= Math.exp(-dt / 1600) }
    if (wf > .001) { const tg = Math.round(yaw / TAU) * TAU + Math.sin(t * .0006) * .36; yaw += (tg - yaw) * Math.min(1, dt * .004 * wf) }
    const pitch = .52 * w[0] + .36 * w[1] + .03 * wf + Math.sin(t * .0004) * .07 * w[1] + pitchD;
    const cyw = Math.cos(yaw), syw = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
    const A = PH[cur], B = mp >= 1 ? A : PH[to], BA = PB[cur], BB = PB[mp >= 1 ? cur : to];
    const ox = cx + mx * 8, oy = cy + my * 6, px0 = ptr ? ptr[0] : -1e4, py0 = ptr ? ptr[1] : -1e4, pr = R * .34, ek = 1 - Math.exp(-dt / 120);

    for (let i = 0; i < N; i++) {
      const k = i * 3, u = mp >= 1 ? 1 : clamp((mp - DL[i]) / .6, 0, 1), s = smooth(u);
      let X = A[k] + (B[k] - A[k]) * s, Y = A[k + 1] + (B[k + 1] - A[k + 1]) * s, Z = A[k + 2] + (B[k + 2] - A[k + 2]) * s;
      if (u > 0 && u < 1) { const a = Math.sin(Math.PI * s) * SW[i], c = Math.cos(a), n = Math.sin(a), q = X * c + Z * n; Z = -X * n + Z * c; X = q }
      const sh = Math.sin(t * .0015 + i * 1.7) * .005; X += sh; Y += sh;
      const x1 = X * cyw + Z * syw, z1 = -X * syw + Z * cyw, y2 = Y * cp - z1 * sp, z2 = Y * sp + z1 * cp, f = 1 / (1 - z2 * .32);
      let sx = ox + x1 * R * f, sy = oy + y2 * R * f, gx = 0, gy = 0;
      if (ptr) { const dx = sx - px0, dy = sy - py0, d2 = dx * dx + dy * dy; if (d2 < pr * pr && d2 > 1) { const d = Math.sqrt(d2), p = 1 - d / pr, m = p * p * R * .3 / d; gx = dx * m; gy = dy * m } }
      OFX[i] += (gx - OFX[i]) * ek; OFY[i] += (gy - OFY[i]) * ek; sx += OFX[i]; sy += OFY[i];
      SX[i] = sx; SY[i] = sy; SD[i] = clamp((z2 + 1) / 2, 0, 1); SB[i] = s > .5 ? BB[i] : BA[i];
    }

    /* instrument ring + tick marks */
    {
      x.save(); x.translate(ox, oy); x.strokeStyle = 'rgba(255,255,255,.07)'; x.lineWidth = 1; x.beginPath(); x.arc(0, 0, R * 1.16, 0, TAU); x.stroke();
      x.strokeStyle = 'rgba(255,255,255,.16)'; x.beginPath();
      for (let k = 0; k < 72; k++) { const a = k * TAU / 72 + t * .00004, c = Math.cos(a), n = Math.sin(a), l = k % 6 == 0 ? 10 : 4, r0 = R * 1.16; x.moveTo(c * r0, n * r0); x.lineTo(c * (r0 + l), n * (r0 + l)) }
      x.stroke(); x.restore();
    }

    /* lattice mesh: fades in only once the crystal has formed */
    if (w[1] > .02) {
      x.globalAlpha = 1; x.strokeStyle = `rgba(154,165,255,${(.2 * w[1] ** 3).toFixed(3)})`; x.lineWidth = 1; x.beginPath();
      for (let k = 0; k < EDGE.length; k += 2) { const a = EDGE[k], b = EDGE[k + 1]; x.moveTo(SX[a], SY[a]); x.lineTo(SX[b], SY[b]) }
      x.stroke();
    }

    /* particles: small pixel squares, added together so dense areas glow */
    x.globalCompositeOperation = 'lighter'; let last = -1;
    for (let i = 0; i < N; i++) {
      const d = SD[i], z = ((lite ? 1.6 : 1.4) + d * 2.2) * (1 + .75 * wf);
      if (SB[i] !== last) { x.fillStyle = COL[SB[i]]; last = SB[i] }
      x.globalAlpha = Math.min(1, (.22 + .78 * d) * (1 + .5 * wf)) * (1 - .8 * w[2]); x.fillRect(SX[i] - z / 2, SY[i] - z / 2, z, z);
    }

    /* the goose: fine specks condense out of the cloud; the sparks flicker and the hands tap the keys */
    if (gready && w[2] > .01) {
      const sc = R / 245; let lc = -1; x.globalCompositeOperation = 'source-over';
      for (let j = 0; j < EM; j++) {
        const p = clamp((w[2] * 1.25 - ED[j]) / .5, 0, 1); if (p <= 0) continue;
        const s = smooth(p), inv = 1 - s, k = j * 3;
        let X = EX[k] + ES[k] * inv, Y = EX[k + 1] + ES[k + 1] * inv, Z = EX[k + 2] + ES[k + 2] * inv;
        if (inv > .001) { const a = inv * 1.2 * (EW[j] > .5 ? 1 : -1), c = Math.cos(a), n = Math.sin(a), q = X * c + Z * n; Z = -X * n + Z * c; X = q }
        const x1 = X * cyw + Z * syw, z1 = -X * syw + Z * cyw, y2 = Y * cp - z1 * sp, z2 = Y * sp + z1 * cp, f = 1 / (1 - z2 * .32);
        let sx = ox + x1 * R * f, sy = oy + y2 * R * f, al = s * .92, gx = 0, gy = 0;
        if (ptr) { const dx = sx - px0, dy = sy - py0, d2 = dx * dx + dy * dy; if (d2 < pr * pr && d2 > 1) { const d = Math.sqrt(d2), p = 1 - d / pr, m = p * p * R * (.18 + .5 * EW[j]) / d; gx = dx * m + (EW[j] - .5) * 14 * p; gy = dy * m + (EW[(j * 7) % EM] - .5) * 14 * p } }
        EOX[j] += (gx - EOX[j]) * ek; EOY[j] += (gy - EOY[j]) * ek; sx += EOX[j]; sy += EOY[j];
        if (ER[j] === 1) al *= Math.sin(t * .011 + EW[j] * 9) > .15 ? 1 : .3;
        else if (ER[j] === 2) { sx += Math.sin(t * .05 + EW[j] * 40) * .5 * sc; sy += Math.sin(t * .043 + EW[j] * 31) * .6 * sc }
        if (EC[j] !== lc) { x.fillStyle = EPAL[EC[j]]; lc = EC[j] }
        const sz = Math.max(1.5, 2.4 * sc * (.85 + .3 * z2));
        x.globalAlpha = al; x.fillRect(sx - sz / 2, sy - sz / 2, sz, sz);
      }
    }

    /* signals hopping along the lattice */
    if (w[1] > .7) {
      x.fillStyle = COL[4];
      WK.forEach(k => {
        if (k.u >= 1) { const a = k.b || (rn() * N | 0), n = ADJ[a]; if (!n.length) { k.b = rn() * N | 0; return } k.a = a; k.b = n[rn() * n.length | 0]; k.u = 0 }
        k.u += dt * .0022; const u = Math.min(1, k.u), px = SX[k.a] + (SX[k.b] - SX[k.a]) * u, py = SY[k.a] + (SY[k.b] - SY[k.a]) * u;
        x.globalAlpha = .18 * w[1]; x.fillRect(px - 7, py - 7, 14, 14); x.globalAlpha = w[1]; x.fillRect(px - 2.5, py - 2.5, 5, 5);
      });
    }


    /* label */
    x.globalCompositeOperation = 'source-over'; x.globalAlpha = 1; x.textAlign = 'center';
    if (wide) {
      const nm = e > .5 ? to : cur, ly0 = oy + R * 1.16 + 38;
      x.font = '700 11px "Space Mono",monospace'; x.fillStyle = 'rgba(226,219,248,.7)';
      x.fillText(`0${nm + 1} / ${NAMES[nm].toUpperCase()}`, ox, ly0);
      for (let k = 0; k < 4; k++) { x.fillStyle = k == nm ? COL[0] : 'rgba(255,255,255,.2)'; x.fillRect(ox - 21 + k * 12, ly0 + 12, 6, 6) }
      if (hint > 0) { x.font = '11px "Space Mono",monospace'; x.fillStyle = `rgba(226,219,248,${.45 * hint})`; x.fillText('drag to spin · click to morph', ox, ly0 + 40); if (used) hint = Math.max(0, hint - dt / 1500) }
    }
    x.textAlign = 'start';
  }

  function size() {
    const d = lite ? 1 : Math.min(devicePixelRatio || 1, 2); W = cv.clientWidth; H = cv.clientHeight; cv.width = W * d; cv.height = H * d; x.setTransform(d, 0, 0, d, 0, 0);
    wide = W > 1080; zone = wide ? 0 : Math.min(W * .85, 380); hero.style.setProperty('--zone', zone + 'px');
    if (wide) { cx = W * .765; cy = H * .5; R = Math.min(W * .16, H * .3) }
    else { cx = W / 2; cy = 84 + zone / 2; R = zone * .4 }
    if (RM.matches) { cur = to = 3; mp = 1; yaw = 0; lt = 0; draw(0) }
  }
  const f = t => { draw(t); raf = requestAnimationFrame(f) }, go = () => { if (!raf && vis && !document.hidden && !RM.matches) raf = requestAnimationFrame(f) }, no = () => { cancelAnimationFrame(raf); raf = 0 };
  new ResizeObserver(size).observe(cv); new IntersectionObserver(([en]) => { vis = en.isIntersecting; vis ? go() : no() }).observe(cv);
  document.addEventListener('visibilitychange', () => { lt = 0; document.hidden ? no() : go() });
  addEventListener('pointermove', e => { tx = (e.clientX / innerWidth - .5) * 2; ty = (e.clientY / innerHeight - .5) * 2 }, { passive: true });

  /* pointer input lives on the hero (the canvas sits behind the copy) */
  const local = e => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top] }, onUI = e => e.target.closest('a,button,input,.card,[data-l]');
  const inShape = p => Math.hypot(p[0] - cx, p[1] - cy) < R * 1.25;
  hero.addEventListener('pointermove', e => {
    if (!live()) return; ptr = local(e);
    if (drag) {
      const dx = e.clientX - lx, dy = e.clientY - ly; lx = e.clientX; ly = e.clientY;
      if (Math.hypot(ptr[0] - down[0], ptr[1] - down[1]) > 4) moved = true;
      yaw += dx * .007; pitchD = clamp(pitchD + dy * .005, -.9, .9); vy = clamp(dx * .0012, -.006, .006);
    } else hero.style.cursor = onUI(e) ? '' : inShape(ptr) ? 'grab' : '';
  });
  hero.addEventListener('pointerleave', () => { if (!drag) { ptr = null; hero.style.cursor = '' } });
  hero.addEventListener('pointerdown', e => {
    if (!live() || e.button || onUI(e)) return; const p = local(e); if (!inShape(p)) return;
    drag = true; moved = false; used = true; down = ptr = p; lx = e.clientX; ly = e.clientY;
    hero.setPointerCapture(e.pointerId); hero.style.cursor = 'grabbing'; hero.style.userSelect = 'none'; e.preventDefault();
  });
  const drop = () => { if (!drag) return; drag = false; hero.style.userSelect = ''; if (!moved) next(); hero.style.cursor = 'grab' };
  hero.addEventListener('pointerup', drop); hero.addEventListener('pointercancel', drop);
  size(); go();
})();
