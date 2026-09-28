// Illustrations vectorielles sur mesure — ENMA Formation / Gestes et postures de l'élu
const NAVY = '#0B032B', CREAM = '#FFF9C7', WHITE = '#FFFFFF', ALERT = '#E4572E', SURF2 = '#1F1A4D', TINT = '#ECEAF4';

const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const pts = (a) => a.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' ');
const line = (a, col, sw, op = 1, extra = '') =>
  `<polyline points="${pts(a)}" fill="none" stroke="${col}" stroke-opacity="${op}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;

// Silhouette pictogramme (vue de profil, tournée vers la droite)
function figure(P, o = {}) {
  const c = o.color || NAVY, far = o.far || c, fo = o.farOpacity ?? 0.42, w = o.w || 17, tw = o.tw || 24, hr = o.hr || 23;
  const dir = P.dir || 1;
  const sh = P.shoulder || (P.back ? P.neck : lerp(P.neck, P.hip, 0.1));
  let s = '';
  if (P.kneeF) s += line([P.hip, P.kneeF, P.footF, [P.footF[0] + dir * 20, P.footF[1]]], far, w, fo);
  if (P.elbowF) s += line([sh, P.elbowF, P.handF], far, w, fo);
  if (o.behind) s += o.behind;
  const torso = P.back
    ? `<path d="M${P.hip[0]},${P.hip[1]} Q${P.back[0]},${P.back[1]} ${P.neck[0]},${P.neck[1]}" fill="none" stroke="${c}" stroke-width="${tw}" stroke-linecap="round"/>`
    : line([P.hip, P.neck], c, tw);
  s += torso;
  if (o.spine) {
    const sc = o.spine === 'bad' ? ALERT : o.spineColor || CREAM;
    s += P.back
      ? `<path d="M${P.hip[0]},${P.hip[1]} Q${P.back[0]},${P.back[1]} ${P.neck[0]},${P.neck[1]}" fill="none" stroke="${sc}" stroke-width="6" stroke-linecap="round" stroke-dasharray="${o.spine === 'bad' ? '2 10' : '0'}"/>`
      : line([P.hip, P.neck], sc, 6);
  }
  if (o.mid) s += o.mid;
  s += line([P.hip, P.knee, P.foot, [P.foot[0] + dir * 20, P.foot[1]]], c, w);
  if (P.elbow) s += line([sh, P.elbow, P.hand], c, w);
  s += `<circle cx="${P.head[0]}" cy="${P.head[1]}" r="${hr}" fill="${c}"/>`;
  if (o.front) s += o.front;
  return s;
}

const svg = (w, h, body, bg) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${bg ? `<rect width="${w}" height="${h}" fill="${bg}"/>` : ''}${body}</svg>`;

const box = (x, y, w, h, stroke, fill, sw = 7) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>` +
  `<line x1="${x + w * 0.5}" y1="${y}" x2="${x + w * 0.5}" y2="${y + h * 0.35}" stroke="${stroke}" stroke-width="${sw * 0.7}" stroke-linecap="round"/>`;

// ---------- Poses ----------
const POSES = {
  goodLift: {
    head: [224, 104], neck: [206, 140], hip: [150, 262],
    knee: [236, 272], foot: [214, 390], kneeF: [226, 284], footF: [176, 392],
    elbow: [224, 222], hand: [252, 284], elbowF: [218, 226], handF: [246, 286],
  },
  badLift: {
    head: [296, 236], neck: [264, 214], hip: [150, 205], back: [214, 124],
    knee: [158, 300], foot: [162, 390], kneeF: [150, 300], footF: [146, 392],
    elbow: [270, 290], hand: [272, 348], elbowF: [262, 290], handF: [262, 350],
  },
  stand: {
    head: [200, 70], neck: [200, 106], hip: [200, 226],
    knee: [204, 310], foot: [200, 390], kneeF: [196, 310], footF: [192, 392],
    elbow: [207, 172], hand: [214, 230], elbowF: [193, 172], handF: [188, 230],
  },
  carry: {
    head: [196, 70], neck: [192, 106], hip: [186, 228],
    knee: [226, 306], foot: [236, 390], kneeF: [170, 306], footF: [150, 392],
    elbow: [206, 172], hand: [242, 186], elbowF: [200, 172], handF: [236, 186],
  },
  sit: {
    head: [150, 104], neck: [142, 140], hip: [128, 262],
    knee: [228, 262], foot: [230, 384], kneeF: [222, 266], footF: [222, 386],
    elbow: [160, 214], hand: [238, 206], elbowF: [154, 216], handF: [232, 208],
  },
  push: {
    head: [250, 122], neck: [226, 152], hip: [160, 242],
    knee: [206, 312], foot: [216, 392], kneeF: [124, 316], footF: [92, 392],
    elbow: [258, 198], hand: [296, 202], elbowF: [252, 194], handF: [292, 198],
  },
};

// ---------- Illustrations complètes ----------
function titleArt() {
  // Composition : soleil + montagnes du logo, silhouette en levage correct
  const W = 520, H = 460;
  let s = `<circle cx="385" cy="118" r="62" fill="${CREAM}" fill-opacity="0.16"/>`;
  s += `<circle cx="385" cy="118" r="38" fill="${CREAM}" fill-opacity="0.9"/>`;
  s += `<polyline points="250,420 330,300 365,338 420,250 520,420" fill="${SURF2}" stroke="none"/>`;
  s += `<polyline points="330,300 365,338 420,250 460,318" fill="none" stroke="${CREAM}" stroke-opacity="0.35" stroke-width="3" stroke-linejoin="round"/>`;
  s += `<line x1="40" y1="421" x2="500" y2="421" stroke="${CREAM}" stroke-opacity="0.35" stroke-width="3" stroke-linecap="round"/>`;
  const P = shift(POSES.goodLift, 30, 30);
  s += figure(P, {
    color: CREAM, far: WHITE, farOpacity: 0.35, spine: 'good', spineColor: NAVY,
    mid: box(272, 262, 86, 70, CREAM, NAVY, 7),
  });
  return svg(W, H, s);
}

function shift(P, dx, dy) {
  const o = {};
  for (const k in P) o[k] = Array.isArray(P[k]) ? [P[k][0] + dx, P[k][1] + dy] : P[k];
  return o;
}
function scaleP(P, f, cx = 0, cy = 0) {
  const o = {};
  for (const k in P) o[k] = Array.isArray(P[k]) ? [cx + P[k][0] * f, cy + P[k][1] * f] : P[k];
  return o;
}

function goodLiftArt(c = NAVY, bg) {
  let s = `<line x1="40" y1="400" x2="370" y2="400" stroke="${c}" stroke-opacity="0.25" stroke-width="4" stroke-linecap="round"/>`;
  s += figure(POSES.goodLift, { color: c, spine: 'good', spineColor: c === NAVY ? CREAM : NAVY, mid: box(242, 232, 82, 68, c, c === NAVY ? CREAM : NAVY, 7) });
  return svg(400, 420, s, bg);
}
function badLiftArt(c = NAVY, bg) {
  let s = `<line x1="40" y1="400" x2="370" y2="400" stroke="${c}" stroke-opacity="0.25" stroke-width="4" stroke-linecap="round"/>`;
  s += figure(POSES.badLift, { color: c, spine: 'bad', front: box(240, 334, 88, 62, c, c === NAVY ? CREAM : NAVY, 7) });
  // éclat de douleur au niveau lombaire
  s += burst(176, 150, 26, ALERT);
  return svg(400, 420, s, bg);
}
function burst(cx, cy, r, col) {
  let d = '';
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    d += `<line x1="${cx + Math.cos(a) * r * 0.55}" y1="${cy + Math.sin(a) * r * 0.55}" x2="${cx + Math.cos(a) * r}" y2="${cy + Math.sin(a) * r}" stroke="${col}" stroke-width="5" stroke-linecap="round"/>`;
  }
  return d;
}

function sitArt(c = NAVY) {
  let s = '';
  // chaise
  s += line([[96, 150], [100, 272], [196, 272]], c, 9, 0.35);
  s += line([[120, 272], [120, 388]], c, 8, 0.35) + line([[180, 272], [186, 388]], c, 8, 0.35);
  // bureau
  s += line([[232, 200], [372, 200]], c, 9, 0.5) + line([[356, 200], [356, 390]], c, 8, 0.35);
  // écran
  s += `<rect x="318" y="96" width="14" height="78" rx="4" fill="${c}" fill-opacity="0.8"/>` + line([[325, 174], [325, 200]], c, 7, 0.8) + line([[306, 200], [344, 200]], c, 7, 0.8);
  // sol
  s += line([[60, 400], [390, 400]], c, 4, 0.25);
  // ligne du regard
  s += `<line x1="170" y1="100" x2="312" y2="100" stroke="${ALERT}" stroke-width="3" stroke-dasharray="8 7"/>`;
  s += figure(POSES.sit, { color: c, spine: 'good', spineColor: CREAM });
  // angles 90°
  s += `<path d="M 208 262 L 208 282 L 228 282" fill="none" stroke="${CREAM}" stroke-width="0"/>`;
  return svg(400, 420, s);
}

function pushArt(c = NAVY) {
  let s = line([[40, 400], [420, 400]], c, 4, 0.25);
  // chariot plateforme
  s += line([[300, 196], [304, 364]], c, 9);
  s += line([[300, 364], [410, 364]], c, 10);
  s += `<circle cx="322" cy="384" r="14" fill="none" stroke="${c}" stroke-width="7"/><circle cx="392" cy="384" r="14" fill="none" stroke="${c}" stroke-width="7"/>`;
  s += box(318, 286, 78, 72, c, CREAM, 7);
  s += box(326, 228, 60, 54, c, CREAM, 7);
  // flèche de poussée
  s += line([[120, 160], [178, 160]], ALERT, 6) + line([[164, 148], [180, 160], [164, 172]], ALERT, 6);
  s += figure(POSES.push, { color: c, spine: 'good', spineColor: CREAM });
  return svg(440, 420, s);
}

function carryArt(c = NAVY) {
  let s = line([[60, 400], [340, 400]], c, 4, 0.25);
  s += figure(POSES.carry, { color: c, spine: 'good', spineColor: CREAM, mid: box(214, 150, 70, 64, c, CREAM, 7) });
  return svg(400, 420, s);
}

// Colonne vertébrale (vue de profil, face à droite)
function spineArt() {
  const W = 300, H = 620;
  const ctrl = [[0, 168], [0.1, 180], [0.2, 166], [0.42, 122], [0.62, 160], [0.74, 180], [0.86, 160], [1, 120]];
  const xAt = (t) => {
    for (let i = 0; i < ctrl.length - 1; i++) {
      const [t0, x0] = ctrl[i], [t1, x1] = ctrl[i + 1];
      if (t <= t1) { const u = (t - t0) / (t1 - t0); const e = (1 - Math.cos(u * Math.PI)) / 2; return x0 + (x1 - x0) * e; }
    }
    return ctrl[ctrl.length - 1][1];
  };
  const y0 = 30, y1 = 590;
  const Y = (t) => y0 + (y1 - y0) * t;
  let s = '';
  // tracé des courbures
  let d = '';
  for (let i = 0; i <= 60; i++) { const t = i / 60; d += `${i ? 'L' : 'M'}${xAt(t) - 34},${Y(t)} `; }
  s += `<path d="${d}" fill="none" stroke="${CREAM}" stroke-opacity="0.25" stroke-width="3" stroke-dasharray="6 8"/>`;
  const reg = [
    { n: 7, t0: 0.0, t1: 0.2, w: 30, col: WHITE },
    { n: 12, t0: 0.2, t1: 0.62, w: 38, col: WHITE },
    { n: 5, t0: 0.62, t1: 0.86, w: 52, col: CREAM },
  ];
  for (const r of reg) {
    for (let i = 0; i < r.n; i++) {
      const tc = r.t0 + ((i + 0.5) / r.n) * (r.t1 - r.t0);
      const hSeg = ((r.t1 - r.t0) / r.n) * (y1 - y0);
      const h = hSeg * 0.72;
      const x = xAt(tc), y = Y(tc);
      const dx = xAt(tc + 0.005) - xAt(tc - 0.005), dy = Y(tc + 0.005) - Y(tc - 0.005);
      const ang = (Math.atan2(dx, dy) * -180) / Math.PI;
      const wv = r.w + i * (r.n > 6 ? 0.6 : 1.5);
      s += `<g transform="translate(${x},${y}) rotate(${ang})">`;
      s += `<rect x="${-wv / 2 + 6}" y="${-h / 2}" width="${wv}" height="${h}" rx="${Math.min(6, h / 2)}" fill="${r.col}"/>`;
      s += `<line x1="${-wv / 2 + 6}" y1="0" x2="${-wv / 2 - 22}" y2="${h * 0.3}" stroke="${r.col}" stroke-opacity="0.55" stroke-width="${Math.max(4, h * 0.35)}" stroke-linecap="round"/>`;
      s += `</g>`;
    }
  }
  // sacrum + coccyx
  const tS = 0.9, xs = xAt(tS), ys = Y(tS);
  s += `<path d="M${xs + 34},${ys - 26} L${xs - 18},${ys - 20} L${xs - 36},${ys + 50} L${xs - 50},${ys + 70} L${xs - 30},${ys + 58} Z" fill="${WHITE}" fill-opacity="0.75" stroke-linejoin="round"/>`;
  return { svg: svg(W, H, s), W, H, Y };
}

function discArt() {
  const W = 760, H = 300;
  let s = '';
  const vert = (x, y, ang, col = NAVY) =>
    `<g transform="translate(${x},${y}) rotate(${ang})"><rect x="-95" y="-38" width="190" height="76" rx="16" fill="${col}"/><rect x="-150" y="-14" width="70" height="28" rx="12" fill="${col}" fill-opacity="0.55"/></g>`;
  // panneau 1 : dos droit
  s += vert(190, 80, 0) + vert(190, 222, 0);
  s += `<ellipse cx="200" cy="151" rx="92" ry="24" fill="${CREAM}" stroke="${NAVY}" stroke-width="4"/>`;
  s += `<ellipse cx="200" cy="151" rx="30" ry="12" fill="${NAVY}" fill-opacity="0.85"/>`;
  // flèches de charge réparties
  for (const x of [140, 200, 260]) s += line([[x, 20], [x, 36]], NAVY, 5, 0.5) + line([[x - 7, 30], [x, 38], [x + 7, 30]], NAVY, 5, 0.5);
  // panneau 2 : dos rond — pincement avant, noyau chassé vers l'arrière
  const ox = 380;
  s += vert(ox + 200, 92, 14) + vert(ox + 190, 222, 0);
  s += `<path d="M${ox + 110},${160} Q${ox + 190},${150} ${ox + 290},${176} Q${ox + 292},${188} ${ox + 280},${196} L${ox + 100},${196} Q${ox + 84},${182} ${ox + 110},${160} Z" fill="${CREAM}" stroke="${NAVY}" stroke-width="4"/>`;
  s += `<ellipse cx="${ox + 128}" cy="${180}" rx="26" ry="12" fill="${ALERT}"/>`;
  s += `<path d="M${ox + 100},${178} q -22,4 -26,14" fill="none" stroke="${ALERT}" stroke-width="7" stroke-linecap="round"/>`;
  s += burst(ox + 62, 190, 24, ALERT);
  s += line([[ox + 300, 26], [ox + 300, 60]], NAVY, 5, 0.6) + line([[ox + 292, 50], [ox + 300, 62], [ox + 308, 50]], NAVY, 5, 0.6);
  return svg(W, H, s);
}

// Silhouette de face avec zones de TMS
function bodyMapArt() {
  const W = 400, H = 560, c = NAVY;
  let s = '';
  s += `<circle cx="200" cy="58" r="34" fill="${c}"/>`;
  s += `<rect x="186" y="88" width="28" height="26" fill="${c}"/>`;
  s += `<path d="M138,112 Q200,100 262,112 Q274,116 272,132 L252,300 Q200,312 148,300 L128,132 Q126,116 138,112 Z" fill="${c}"/>`;
  s += line([[140, 124], [116, 214], [106, 300]], c, 26) + line([[260, 124], [284, 214], [294, 300]], c, 26);
  s += `<circle cx="104" cy="318" r="15" fill="${c}"/><circle cx="296" cy="318" r="15" fill="${c}"/>`;
  s += line([[176, 296], [172, 420], [168, 530]], c, 32) + line([[224, 296], [228, 420], [232, 530]], c, 32);
  s += line([[168, 532], [146, 540]], c, 20) + line([[232, 532], [254, 540]], c, 20);
  const hot = [[200, 100], [140, 128], [116, 214], [108, 292], [200, 268], [228, 420]];
  for (const [x, y] of hot) s += `<circle cx="${x}" cy="${y}" r="22" fill="${CREAM}" fill-opacity="0.35"/><circle cx="${x}" cy="${y}" r="11" fill="${CREAM}" stroke="${ALERT}" stroke-width="4"/>`;
  return { svg: svg(W, H, s), W, H, hot };
}

// Aides à la manutention (pictos au trait)
function aid(kind) {
  const c = NAVY, sw = 9;
  let s = '';
  const wheel = (x, y, r = 16) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${CREAM}" stroke="${c}" stroke-width="${sw - 2}"/>`;
  switch (kind) {
    case 'diable':
      s += line([[70, 30], [96, 36], [118, 168], [150, 168]], c, sw);
      s += box(118, 96, 46, 64, c, CREAM, 6) + box(124, 50, 36, 42, c, CREAM, 6);
      s += wheel(112, 176, 18);
      break;
    case 'plateau':
      s += line([[40, 46], [44, 150]], c, sw) + line([[40, 150], [168, 150]], c, sw + 2);
      s += box(64, 92, 56, 52, c, CREAM, 6) + box(124, 108, 38, 36, c, CREAM, 6);
      s += wheel(64, 172) + wheel(150, 172);
      break;
    case 'transpalette':
      s += line([[52, 30], [74, 128]], c, sw) + line([[40, 32], [64, 28]], c, sw);
      s += `<rect x="66" y="122" width="26" height="36" rx="6" fill="${c}"/>`;
      s += line([[90, 150], [178, 150]], c, sw + 2) + wheel(80, 170, 13) + wheel(168, 170, 10);
      s += `<rect x="100" y="112" width="74" height="30" rx="3" fill="none" stroke="${c}" stroke-width="5" stroke-dasharray="10 6"/>`;
      break;
    case 'chaises':
      s += line([[150, 34], [154, 150]], c, sw) + line([[50, 150], [160, 150]], c, sw + 2);
      for (let i = 0; i < 4; i++) s += line([[64 + i * 6, 64 - i * 10], [70 + i * 6, 118 - i * 10], [128, 118 - i * 10], [128, 146]], c, 6, 0.9 - i * 0.15);
      s += wheel(64, 172) + wheel(140, 172);
      break;
    case 'sangles':
      s += box(40, 96, 130, 70, c, CREAM, 7);
      s += `<path d="M62,100 Q62,40 84,40 L126,40 Q148,40 148,100" fill="none" stroke="${ALERT}" stroke-width="8" stroke-linecap="round"/>`;
      s += `<rect x="86" y="30" width="38" height="20" rx="8" fill="${c}"/>`;
      s += `<path d="M40,150 L20,150 M170,150 L190,150" stroke="${c}" stroke-width="8" stroke-linecap="round"/>`;
      break;
    case 'hauteur':
      s += line([[40, 70], [168, 70]], c, sw + 2) + box(70, 26, 70, 40, c, CREAM, 6);
      s += line([[56, 76], [150, 150]], c, 7) + line([[150, 76], [56, 150]], c, 7);
      s += line([[40, 152], [168, 152]], c, sw) + wheel(52, 174, 12) + wheel(156, 174, 12);
      s += line([[182, 90], [182, 140]], ALERT, 5) + line([[174, 100], [182, 88], [190, 100]], ALERT, 5) + line([[174, 130], [182, 142], [190, 130]], ALERT, 5);
      break;
  }
  return svg(210, 200, s);
}

// Étirements (petites silhouettes)
function stretch(kind) {
  const c = NAVY, w = 13, tw = 18, hr = 17;
  let s = line([[30, 262], [190, 262]], c, 3, 0.25);
  const head = (x, y) => `<circle cx="${x}" cy="${y}" r="${hr}" fill="${c}"/>`;
  const legs = (hx, hy) => line([[hx, hy], [hx - 16, 206], [hx - 20, 256]], c, w) + line([[hx, hy], [hx + 16, 206], [hx + 20, 256]], c, w);
  switch (kind) {
    case 'nuque':
      s += legs(110, 150) + line([[110, 150], [110, 72]], c, tw);
      s += line([[110, 80], [90, 118], [86, 150]], c, w);
      s += line([[110, 80], [150, 56], [128, 30]], c, w);
      s += head(124, 44);
      s += `<path d="M 88 30 A 34 34 0 0 1 112 14" fill="none" stroke="${ALERT}" stroke-width="4" stroke-linecap="round"/>`;
      break;
    case 'epaules':
      s += legs(110, 150) + line([[110, 150], [110, 72]], c, tw);
      s += line([[110, 82], [150, 98], [70, 100]], c, w);
      s += line([[110, 82], [134, 116], [150, 100]], c, w, 0.6);
      s += head(110, 50);
      break;
    case 'lateral':
      s += legs(110, 150) + line([[110, 150], [98, 74]], c, tw);
      s += line([[98, 82], [92, 40], [112, 14]], c, w) + line([[98, 82], [120, 42], [112, 14]], c, w);
      s += head(92, 52);
      s += `<path d="M 140 60 Q 150 110 132 150" fill="none" stroke="${ALERT}" stroke-width="4" stroke-dasharray="6 6"/>`;
      break;
    case 'poignets':
      s += line([[100, 150], [96, 206], [100, 256]], c, w) + line([[100, 150], [104, 206], [108, 256]], c, w, 0.5);
      s += line([[100, 150], [104, 74]], c, tw) + head(108, 44);
      s += line([[104, 84], [160, 90], [164, 66]], c, w);
      s += line([[104, 86], [132, 110], [160, 84]], c, w, 0.6);
      break;
    case 'dos':
      s += line([[100, 150], [102, 206], [98, 256]], c, w) + line([[100, 150], [96, 206], [92, 256]], c, w, 0.5);
      s += `<path d="M100,150 Q96,110 84,74" fill="none" stroke="${c}" stroke-width="${tw}" stroke-linecap="round"/>`;
      s += line([[86, 86], [116, 120], [104, 150]], c, w);
      s += head(76, 46);
      s += `<path d="M 60 100 Q 64 136 80 150" fill="none" stroke="${ALERT}" stroke-width="4" stroke-dasharray="6 6"/>`;
      break;
    case 'mollets':
      s += line([[176, 40], [176, 262]], c, 6, 0.3);
      s += line([[112, 150], [140, 200], [140, 256]], c, w) + line([[112, 150], [80, 206], [52, 256]], c, w);
      s += line([[112, 150], [140, 80]], c, tw) + head(150, 52);
      s += line([[138, 90], [160, 100], [170, 96]], c, w);
      s += `<path d="M 66 214 Q 58 236 60 250" fill="none" stroke="${ALERT}" stroke-width="4" stroke-dasharray="5 5"/>`;
      break;
  }
  return svg(220, 280, s);
}

// Mini silhouettes pour la journée type (sur fond clair)
function miniScene(kind) {
  const c = NAVY;
  let s = '';
  const f = (P, o = {}) => figure(scaleP(P, 0.5, 0, 0), { w: 10, tw: 14, hr: 12, color: c, ...o });
  switch (kind) {
    case 'bureau': s = f(POSES.sit) + line([[116, 100], [186, 100]], c, 5, 0.5) + `<rect x="158" y="48" width="8" height="40" rx="2" fill="${c}"/>`; break;
    case 'chantier': s = f(POSES.stand) + line([[40, 196], [80, 180], [120, 190], [170, 170], [200, 180]], c, 5, 0.4); break;
    case 'debout': s = f(shift(POSES.stand, -40, 0)) + f(shift(POSES.stand, 40, 0), { color: c, farOpacity: 0.3 }); break;
    case 'salle': s = f(POSES.carry, { mid: box(107, 75, 35, 32, c, CREAM, 4) }); break;
    case 'conseil': s = f(POSES.sit) + line([[116, 100], [186, 100]], c, 5, 0.5); break;
    case 'voiture':
      s = `<path d="M20,160 L40,120 Q60,96 110,96 L150,96 Q176,100 190,130 L200,160 Z" fill="${c}" fill-opacity="0.85"/><circle cx="60" cy="166" r="16" fill="${c}"/><circle cx="160" cy="166" r="16" fill="${c}"/><circle cx="60" cy="166" r="6" fill="${CREAM}"/><circle cx="160" cy="166" r="6" fill="${CREAM}"/><rect x="100" y="104" width="44" height="26" rx="6" fill="${CREAM}"/>`;
      break;
  }
  return svg(210, 200, s);
}

module.exports = { titleArt, goodLiftArt, badLiftArt, sitArt, pushArt, carryArt, spineArt, discArt, bodyMapArt, aid, stretch, miniScene, POSES, figure, svg, box, line };
