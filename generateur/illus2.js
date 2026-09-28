// Illustrations vectorielles sur mesure — Formation des élus municipaux 2026 (ENMA Formation)
const { svg, line } = require('./illus');
const NAVY = '#0B032B', CREAM = '#FFF9C7', WHITE = '#FFFFFF', ALERT = '#E4572E', SURF = '#160F3F', SURF2 = '#1F1A4D', MUTED = '#B3B3BA', TINT = '#ECEAF4';

// Mairie devant les terrils et le chevalement (couverture)
function mairieArt() {
  const W = 600, H = 520;
  let s = '';
  s += `<circle cx="478" cy="112" r="70" fill="${CREAM}" fill-opacity="0.12"/><circle cx="478" cy="112" r="42" fill="${CREAM}"/>`;
  s += `<polygon points="300,432 420,292 540,432" fill="${SURF2}"/><polygon points="430,432 520,330 600,432" fill="${SURF2}" fill-opacity="0.8"/>`;
  s += `<polyline points="420,292 450,326 470,312" fill="none" stroke="${CREAM}" stroke-opacity="0.3" stroke-width="3"/>`;
  // chevalement
  const cv = CREAM, co = 0.45;
  s += line([[62, 432], [84, 196]], cv, 5, co) + line([[118, 432], [96, 196]], cv, 5, co);
  for (let y = 420; y > 210; y -= 34) {
    const t0 = (432 - y) / 236, t1 = (432 - (y - 34)) / 236;
    const xl0 = 62 + 22 * t0, xr0 = 118 - 22 * t0, xl1 = 62 + 22 * t1, xr1 = 118 - 22 * t1;
    s += line([[xl0, y], [xr1, y - 34]], cv, 3, co) + line([[xr0, y], [xl1, y - 34]], cv, 3, co);
  }
  s += line([[76, 196], [104, 196]], cv, 6, co) + `<circle cx="90" cy="176" r="20" fill="none" stroke="${cv}" stroke-opacity="${co}" stroke-width="5"/>`;
  s += line([[96, 190], [176, 432]], cv, 4, co * 0.8) + line([[104, 196], [196, 432]], cv, 4, co * 0.8);
  // mairie
  const F = CREAM, D = NAVY;
  s += `<rect x="168" y="262" width="304" height="170" fill="${F}"/>`;
  s += `<rect x="158" y="250" width="324" height="16" rx="3" fill="${F}"/>`;
  s += `<rect x="266" y="196" width="108" height="236" fill="${F}"/>`;
  s += `<polygon points="256,200 320,146 384,200" fill="${F}"/><polygon points="276,192 320,156 364,192" fill="${D}" fill-opacity="0.18"/>`;
  s += `<circle cx="320" cy="224" r="17" fill="${D}"/>` + line([[320, 224], [320, 213]], F, 3) + line([[320, 224], [328, 228]], F, 3);
  s += line([[320, 146], [320, 84]], F, 5) + `<path d="M322,86 Q346,78 360,90 Q374,102 396,94 L396,120 Q374,128 360,116 Q346,104 322,112 Z" fill="${F}"/>`;
  s += `<rect x="168" y="270" width="304" height="8" fill="${D}" fill-opacity="0.25"/>`;
  const win = (x, y) => `<path d="M${x},${y + 40} L${x},${y + 12} Q${x + 12},${y} ${x + 24},${y + 12} L${x + 24},${y + 40} Z" fill="${D}"/>`;
  for (const x of [184, 226, 394, 436]) { s += win(x, 292); s += win(x, 358); }
  s += win(284, 262) + win(332, 262);
  s += `<path d="M298,432 L298,372 Q320,350 342,372 L342,432 Z" fill="${D}"/>`;
  for (const x of [276, 364]) s += `<rect x="${x - 4}" y="330" width="8" height="102" fill="${D}" fill-opacity="0.2"/>`;
  s += `<rect x="270" y="432" width="100" height="8" fill="${F}" fill-opacity="0.7"/><rect x="258" y="440" width="124" height="8" fill="${F}" fill-opacity="0.45"/>`;
  s += line([[20, 450], [580, 450]], CREAM, 3, 0.35);
  // arbres stylisés
  for (const [x, r] of [[146, 26], [496, 22]]) s += `<circle cx="${x}" cy="${432 - r - 26}" r="${r}" fill="${CREAM}" fill-opacity="0.35"/>` + line([[x, 432], [x, 432 - 26]], CREAM, 5, 0.5);
  return svg(W, H, s);
}

// Silhouette de face avec écharpe
function maireFigure() {
  const W = 300, H = 460, c = NAVY;
  let s = `<circle cx="150" cy="62" r="40" fill="${c}"/>`;
  s += `<path d="M78,128 Q150,106 222,128 Q240,136 238,160 L220,330 Q150,346 80,330 L62,160 Q60,136 78,128 Z" fill="${c}"/>`;
  s += line([[70, 144], [44, 250], [40, 330]], c, 30) + line([[230, 144], [256, 250], [260, 330]], c, 30);
  s += line([[118, 326], [112, 440]], c, 36) + line([[182, 326], [188, 440]], c, 36);
  // écharpe (diagonale épaule droite -> hanche gauche)
  s += `<path d="M206,120 L232,146 L102,322 L76,300 Z" fill="${CREAM}" stroke="${c}" stroke-width="3"/>`;
  s += `<path d="M216,130 L96,306" stroke="${ALERT}" stroke-width="5" stroke-opacity="0.8"/>`;
  s += `<circle cx="86" cy="316" r="14" fill="${CREAM}" stroke="${c}" stroke-width="3"/>`;
  s += line([[80, 328], [70, 364]], CREAM, 8) + line([[92, 328], [96, 366]], CREAM, 8);
  return svg(W, H, s);
}

// Conseil municipal en fer à cheval (vue de dessus)
function conseilArt() {
  const W = 520, H = 440;
  let s = '';
  // table en U, ouverte vers le haut
  s += `<path d="M110,60 L110,300 Q110,360 170,360 L350,360 Q410,360 410,300 L410,60" fill="none" stroke="${TINT}" stroke-width="54" stroke-linejoin="round"/>`;
  s += `<path d="M110,60 L110,300 Q110,360 170,360 L350,360 Q410,360 410,300 L410,60" fill="none" stroke="${MUTED}" stroke-width="2" stroke-dasharray="4 8"/>`;
  const seat = (x, y, kind) => {
    if (kind === 'maire') return `<circle cx="${x}" cy="${y}" r="22" fill="${CREAM}" stroke="${NAVY}" stroke-width="6"/><circle cx="${x}" cy="${y}" r="8" fill="${NAVY}"/>`;
    if (kind === 'opp') return `<circle cx="${x}" cy="${y}" r="15" fill="${CREAM}" stroke="${NAVY}" stroke-width="4"/>`;
    if (kind === 'adj') return `<circle cx="${x}" cy="${y}" r="15" fill="${NAVY}"/><circle cx="${x}" cy="${y}" r="6" fill="${CREAM}"/>`;
    return `<circle cx="${x}" cy="${y}" r="15" fill="${NAVY}"/>`;
  };
  // bas du U (tête de table)
  s += seat(260, 410, 'maire');
  for (const x of [200, 320]) s += seat(x, 404, 'adj');
  for (const x of [150, 370]) s += seat(x, 398, 'adj');
  // bras gauche (majorité)
  for (const y of [300, 250, 200, 150, 100, 55]) s += seat(62, y, 'maj');
  // bras droit : majorité puis opposition
  const right = [[300, 'maj'], [250, 'maj'], [200, 'opp'], [150, 'opp'], [100, 'opp'], [55, 'opp']];
  for (const [y, k] of right) s += seat(458, y, k);
  // pupitre central (secrétaire de séance / public)
  s += `<rect x="226" y="150" width="68" height="44" rx="8" fill="none" stroke="${NAVY}" stroke-opacity="0.35" stroke-width="4"/>`;
  return svg(W, H, s);
}

// Balance droits / devoirs
function balanceArt(c = NAVY) {
  const W = 320, H = 300;
  let s = '';
  s += line([[160, 40], [160, 262]], c, 10) + `<path d="M110,276 L210,276 L190,256 L130,256 Z" fill="${c}"/>`;
  s += line([[40, 76], [280, 76]], c, 9) + `<circle cx="160" cy="46" r="14" fill="${CREAM}" stroke="${c}" stroke-width="6"/>`;
  for (const x of [52, 268]) {
    s += line([[x, 76], [x - 34, 160]], c, 3) + line([[x, 76], [x + 34, 160]], c, 3);
    s += `<path d="M${x - 46},160 L${x + 46},160 Q${x + 40},196 ${x},196 Q${x - 40},196 ${x - 46},160 Z" fill="${CREAM}" stroke="${c}" stroke-width="6" stroke-linejoin="round"/>`;
  }
  return svg(W, H, s);
}

function gavelArt(c = NAVY) {
  let s = `<g transform="rotate(-35 150 130)"><rect x="80" y="70" width="140" height="56" rx="12" fill="${c}"/><rect x="70" y="62" width="20" height="72" rx="6" fill="${c}"/><rect x="210" y="62" width="20" height="72" rx="6" fill="${c}"/><rect x="140" y="126" width="20" height="130" rx="8" fill="${c}"/></g>`;
  s += `<rect x="150" y="230" width="130" height="30" rx="8" fill="${CREAM}" stroke="${c}" stroke-width="6"/>`;
  s += line([[120, 214], [104, 200]], ALERT, 6) + line([[132, 196], [128, 176]], ALERT, 6) + line([[110, 234], [88, 232]], ALERT, 6);
  return svg(300, 280, s);
}
function reparationArt(c = NAVY) {
  // bouclier fissuré + pansement : réparer le préjudice
  let s = `<path d="M150,30 L250,66 Q252,180 150,250 Q48,180 50,66 Z" fill="${CREAM}" stroke="${c}" stroke-width="10" stroke-linejoin="round"/>`;
  s += `<polyline points="150,40 136,96 166,130 140,176 158,240" fill="none" stroke="${c}" stroke-width="6" stroke-linejoin="round"/>`;
  s += `<g transform="rotate(-38 150 140)"><rect x="78" y="118" width="144" height="44" rx="22" fill="${c}"/><rect x="128" y="118" width="44" height="44" fill="${ALERT}"/>`;
  for (const [x, y] of [[138, 130], [160, 130], [138, 150], [160, 150]]) s += `<circle cx="${x}" cy="${y}" r="3" fill="${CREAM}"/>`;
  s += `</g>`;
  return svg(300, 280, s);
}
function urneArt(c = NAVY) {
  let s = `<rect x="60" y="120" width="180" height="140" rx="10" fill="${CREAM}" stroke="${c}" stroke-width="9"/>`;
  s += `<rect x="50" y="108" width="200" height="24" rx="8" fill="${c}"/><rect x="115" y="114" width="70" height="10" rx="5" fill="${CREAM}"/>`;
  s += `<g transform="rotate(-8 150 70)"><rect x="112" y="30" width="76" height="82" rx="4" fill="${WHITE}" stroke="${c}" stroke-width="7"/>`;
  s += line([[126, 56], [174, 56]], c, 5, 0.5) + line([[126, 72], [162, 72]], c, 5, 0.5) + `</g>`;
  s += line([[112, 196], [138, 222], [190, 166]], c, 12);
  return svg(300, 280, s);
}

// Communes fédérées en EPCI : pavage hexagonal à sommets partagés et « jitter » déterministe
function epciArt() {
  const W = 460, H = 420, R = 54;
  const cells = [[0, 0], [1, 0], [-1, 0], [0.5, 1], [-0.5, 1], [0.5, -1], [-0.5, -1], [1.5, 1], [1.5, -1], [-1.5, -1]];
  const cx0 = 230, cy0 = 210, dx = R * Math.sqrt(3), dy = R * 1.5;
  const jitter = (x, y) => {
    const k = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    const r = k - Math.floor(k), r2 = (Math.sin(x * 3.1 + y * 7.7) * 9999) % 1;
    return [x + (r - 0.5) * 20, y + (r2 - 0.5) * 20];
  };
  let s = '';
  const polys = cells.map(([q, r], i) => {
    const cx = cx0 + q * dx, cy = cy0 + r * dy;
    const pts = [];
    for (let k = 0; k < 6; k++) {
      const a = Math.PI / 6 + (k * Math.PI) / 3;
      const x = Math.round(cx + R * Math.cos(a)), y = Math.round(cy + R * Math.sin(a));
      pts.push(jitter(x, y));
    }
    return { pts, i, cx, cy };
  });
  for (const p of polys) {
    const fill = p.i === 0 ? CREAM : p.i % 3 === 1 ? '#2A2455' : SURF2;
    s += `<polygon points="${p.pts.map((v) => v.join(',')).join(' ')}" fill="${fill}" stroke="${NAVY}" stroke-width="5" stroke-linejoin="round"/>`;
    s += `<circle cx="${p.cx}" cy="${p.cy}" r="${p.i === 0 ? 9 : 6}" fill="${p.i === 0 ? NAVY : CREAM}" fill-opacity="${p.i === 0 ? 1 : 0.7}"/>`;
  }
  // liens de coopération
  for (const p of polys.slice(1)) s += `<line x1="${cx0}" y1="${cy0}" x2="${p.cx}" y2="${p.cy}" stroke="${CREAM}" stroke-opacity="0.55" stroke-width="2.5" stroke-dasharray="3 6"/>`;
  return svg(W, H, s);
}

// Carte « tuiles » des 5 départements des Hauts-de-France
function hdfTiles() {
  const R = 78, W = 460, H = 460;
  const dx = R * Math.sqrt(3), dy = R * 1.5;
  const tiles = [
    { n: 'Pas-de-Calais', q: -0.5, r: -1, hi: true },
    { n: 'Nord', q: 0.5, r: -1 },
    { n: 'Somme', q: -1, r: 0 },
    { n: 'Aisne', q: 0.5 + 0.5, r: 0 },
    { n: 'Oise', q: -0.5 + 0.5 - 0.5, r: 1 },
  ];
  // recentrage
  const cx0 = 230, cy0 = 230;
  let s = '';
  const out = [];
  for (const t of tiles) {
    const cx = cx0 + t.q * dx, cy = cy0 + t.r * dy;
    const p = [];
    for (let k = 0; k < 6; k++) { const a = Math.PI / 6 + (k * Math.PI) / 3; p.push([cx + (R - 4) * Math.cos(a), cy + (R - 4) * Math.sin(a)]); }
    s += `<polygon points="${p.map((v) => v.join(',')).join(' ')}" fill="${t.hi ? CREAM : NAVY}" stroke="${t.hi ? NAVY : CREAM}" stroke-opacity="${t.hi ? 1 : 0.5}" stroke-width="4" stroke-linejoin="round"/>`;
    out.push({ ...t, cx, cy });
  }
  return { svg: svg(W, H, s), W, H, tiles: out };
}

// Deux habitants et un élu : bulles de dialogue
function bust(x, y, sc, col, dashed) {
  const st = dashed ? `fill="none" stroke="${col}" stroke-width="4" stroke-dasharray="8 7"` : `fill="${col}"`;
  return `<circle cx="${x}" cy="${y}" r="${24 * sc}" ${st}/><path d="M${x - 46 * sc},${y + 86 * sc} Q${x - 46 * sc},${y + 34 * sc} ${x},${y + 34 * sc} Q${x + 46 * sc},${y + 34 * sc} ${x + 46 * sc},${y + 86 * sc} Z" ${st}/>`;
}
function dialogueArt() {
  const W = 520, H = 380;
  let s = '';
  s += bust(120, 190, 1.35, NAVY) + bust(400, 196, 1.25, NAVY);
  s += `<path d="M310,290 L310,248 Q336,238 348,250" fill="none"/>`;
  s += `<path d="M76,176 L130,176" stroke="${CREAM}" stroke-width="0"/>`;
  // écharpe discrète sur l'élu
  s += `<path d="M150,236 L166,250 L96,304 L84,292 Z" fill="${CREAM}"/>`;
  // bulles
  const bubble = (x, y, w, h, tail, fill, stroke) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}" stroke="${stroke}" stroke-width="5"/><path d="M${tail[0]},${tail[1]} L${tail[2]},${tail[3]} L${tail[4]},${tail[5]} Z" fill="${fill}" stroke="${stroke}" stroke-width="5" stroke-linejoin="round"/><rect x="${tail[0] - 2}" y="${y + h - 8}" width="${Math.abs(tail[4] - tail[0]) + 4}" height="10" fill="${fill}"/>`;
  s += bubble(40, 30, 190, 80, [110, 106, 100, 146, 140, 106], CREAM, NAVY);
  for (let i = 0; i < 3; i++) s += `<circle cx="${105 + i * 30}" cy="70" r="9" fill="${NAVY}"/>`;
  s += bubble(290, 44, 190, 80, [380, 120, 400, 158, 410, 120], NAVY, NAVY);
  s += line([[322, 74], [446, 74]], CREAM, 7) + line([[322, 96], [410, 96]], CREAM, 7, 0.6);
  return svg(W, H, s);
}

// Se déporter : un siège vide au moment du vote
function deportArt() {
  const W = 560, H = 360;
  let s = '';
  const xs = [80, 190, 300, 420];
  xs.forEach((x, i) => {
    if (i === 2) {
      s += bust(x, 130, 1, NAVY, true);
      s += line([[x + 60, 150], [x + 100, 150]], ALERT, 6) + line([[x + 86, 136], [x + 102, 150], [x + 86, 164]], ALERT, 6);
    } else {
      s += bust(x, 130, 1, NAVY);
      s += line([[x + 34, 176], [x + 44, 110], [x + 46, 74]], NAVY, 14);
      s += `<circle cx="${x + 46}" cy="66" r="11" fill="${NAVY}"/>`;
    }
  });
  s += `<rect x="20" y="230" width="520" height="34" rx="8" fill="${NAVY}"/><rect x="40" y="264" width="20" height="80" fill="${NAVY}" fill-opacity="0.6"/><rect x="500" y="264" width="20" height="80" fill="${NAVY}" fill-opacity="0.6"/>`;
  s += `<rect x="252" y="200" width="96" height="30" rx="4" fill="${CREAM}" stroke="${NAVY}" stroke-width="4"/>`;
  return svg(W, H, s);
}

// Vignettes de l'action municipale
function vignette(kind) {
  const c = NAVY;
  let s = line([[16, 180], [184, 180]], c, 4, 0.3);
  switch (kind) {
    case 'ecole':
      s += `<rect x="40" y="90" width="120" height="90" fill="${CREAM}" stroke="${c}" stroke-width="7"/><polygon points="30,94 100,44 170,94" fill="${c}"/>`;
      s += `<circle cx="100" cy="76" r="10" fill="${CREAM}"/><rect x="86" y="130" width="28" height="50" fill="${c}"/>`;
      for (const x of [54, 128]) s += `<rect x="${x}" y="110" width="20" height="20" fill="${c}"/>`;
      s += line([[100, 44], [100, 20]], c, 5) + `<path d="M102,20 L124,26 L102,32 Z" fill="${ALERT}"/>`;
      break;
    case 'voirie':
      s += `<path d="M70,180 L90,40 L110,40 L130,180 Z" fill="${c}"/>`;
      for (const y of [60, 95, 135]) s += line([[100, y], [100, y + 18]], CREAM, 5);
      for (let i = 0; i < 5; i++) s += `<rect x="${30 + i * 30}" y="150" width="18" height="10" fill="${CREAM}" stroke="${c}" stroke-width="2"/>`;
      s += `<circle cx="160" cy="62" r="16" fill="${ALERT}"/><rect x="152" y="58" width="16" height="7" fill="${WHITE}"/>` + line([[160, 78], [160, 180]], c, 5);
      break;
    case 'asso':
      s += `<circle cx="64" cy="70" r="18" fill="${c}"/><circle cx="136" cy="70" r="18" fill="${c}"/>`;
      s += `<path d="M30,180 Q30,100 64,100 Q88,100 96,130 L104,130 Q112,100 136,100 Q170,100 170,180 Z" fill="${c}"/>`;
      s += `<path d="M78,132 Q100,112 122,132" fill="none" stroke="${CREAM}" stroke-width="10" stroke-linecap="round"/>`;
      s += `<path d="M100,40 C92,26 74,34 86,48 L100,60 L114,48 C126,34 108,26 100,40 Z" fill="${ALERT}"/>`;
      break;
    case 'commerce':
      s += `<rect x="36" y="86" width="128" height="94" fill="${CREAM}" stroke="${c}" stroke-width="7"/>`;
      for (let i = 0; i < 4; i++) s += `<path d="M${36 + i * 32},70 L${68 + i * 32},70 L${68 + i * 32},92 Q${52 + i * 32},108 ${36 + i * 32},92 Z" fill="${i % 2 ? CREAM : c}" stroke="${c}" stroke-width="4"/>`;
      s += `<rect x="52" y="116" width="44" height="40" fill="${c}" fill-opacity="0.8"/><rect x="112" y="116" width="34" height="64" fill="${c}"/>`;
      break;
    case 'espace':
      s += `<circle cx="138" cy="70" r="36" fill="${c}"/><circle cx="112" cy="92" r="24" fill="${c}"/>` + line([[134, 106], [134, 180]], c, 10);
      s += `<rect x="30" y="136" width="80" height="10" rx="4" fill="${c}"/><rect x="30" y="116" width="80" height="8" rx="4" fill="${c}"/>` + line([[40, 146], [40, 180]], c, 6) + line([[100, 146], [100, 180]], c, 6);
      s += `<circle cx="70" cy="60" r="18" fill="${CREAM}" stroke="${c}" stroke-width="5"/>`;
      break;
  }
  return svg(200, 200, s);
}

// Le mandat, un marathon : parcours 2026 → 2032
function marathonArt() {
  const W = 1000, H = 360;
  const P = (t) => {
    const x = 60 + t * 880;
    const y = 200 + Math.sin(t * Math.PI * 2.2) * 70 * (1 - t * 0.35);
    return [x, y];
  };
  let d = '';
  for (let i = 0; i <= 100; i++) { const [x, y] = P(i / 100); d += `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)} `; }
  let s = `<path d="${d}" fill="none" stroke="${SURF2}" stroke-width="46" stroke-linecap="round" stroke-linejoin="round"/>`;
  s += `<path d="${d}" fill="none" stroke="${CREAM}" stroke-width="3" stroke-dasharray="14 12" stroke-opacity="0.8"/>`;
  const marks = [];
  for (let k = 0; k <= 6; k++) {
    const [x, y] = P(k / 6);
    s += `<circle cx="${x}" cy="${y}" r="${k === 0 || k === 6 ? 20 : 13}" fill="${k === 6 ? CREAM : NAVY}" stroke="${CREAM}" stroke-width="5"/>`;
    marks.push([x, y]);
  }
  // coureur stylisé près du départ
  const [rx, ry] = P(0.1);
  s += `<g transform="translate(${rx - 20},${ry - 128}) scale(0.9)">`;
  s += `<circle cx="40" cy="14" r="12" fill="${CREAM}"/>` + line([[36, 30], [26, 70]], CREAM, 11) + line([[34, 36], [52, 52], [64, 40]], CREAM, 8) + line([[34, 36], [18, 50], [8, 44]], CREAM, 8, 0.6);
  s += line([[26, 70], [44, 90], [40, 112]], CREAM, 9) + line([[26, 70], [10, 92], [-6, 96]], CREAM, 9, 0.6) + `</g>`;
  return { svg: svg(W, H, s), W, H, marks };
}

module.exports = { mairieArt, maireFigure, conseilArt, balanceArt, gavelArt, reparationArt, urneArt, epciArt, hdfTiles, dialogueArt, deportArt, vignette, marathonArt };
