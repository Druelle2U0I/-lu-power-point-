// Générateur — ENMA Formation · Formation des élus municipaux 2026 (Fonctions de l'élu, 7 h)
const pptxgen = require('pptxgenjs');
const sharp = require('sharp');
const React = require('react');
const RDS = require('react-dom/server');
const Pi = require('react-icons/pi');
const fs = require('fs');
const I1 = require('./illus');
const I2 = require('./illus2');

const OUT = process.argv[2] || require('path').join(__dirname, '..', 'supports', 'ENMA_Formation_Fonctions_de_l_elu_2026.pptx');
const BRAND = require('path').join(__dirname, 'assets') + '/';
const C = {
  navy: '0B032B', surf: '160F3F', surf2: '1F1A4D', border: '2A2455', cream: 'FFF9C7', muted: 'B3B3BA',
  white: 'FFFFFF', tint: 'F3F2F8', tint2: 'E7E5F0', sub: '55516E', alert: 'E4572E', foot: '8A8699',
};
const F = 'Calibri', NUM = 'Impact';
const W = 13.333, H = 7.5, M = 0.6;

// ---------- utilitaires image ----------
async function png(svgStr, width) {
  const b = await sharp(Buffer.from(svgStr)).resize({ width }).png().toBuffer();
  return 'image/png;base64,' + b.toString('base64');
}
const dims = (s) => { const m = s.match(/width="([\d.]+)" height="([\d.]+)"/); return [+m[1], +m[2]]; };
const iconCache = {};
async function icon(name, color) {
  const k = name + color;
  if (!iconCache[k]) {
    let s = RDS.renderToStaticMarkup(React.createElement(Pi[name], { size: 256 }));
    s = s.replace(/currentColor/g, '#' + color);
    if (!s.includes('xmlns=')) s = s.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    iconCache[k] = await png(s, 256);
  }
  return iconCache[k];
}
async function art(slide, s, x, y, w, h) {
  const [sw, sh] = dims(s);
  if (!h) h = (w * sh) / sw;
  if (!w) w = (h * sw) / sh;
  slide.addImage({ data: await png(s, Math.round(Math.min(2000, w * 220))), x, y, w, h });
  return { x, y, w, h, sx: w / sw, sy: h / sh };
}

// ---------- mise en page ----------
const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.author = 'ENMA Formation';
pres.company = 'ENMA Formation';
pres.title = 'Formation des élus municipaux 2026 — Bien débuter son mandat municipal';

let page = 0;
let LOGO_W, LOGO_NAVY, LOGO_ICON;

function text(slide, t, o) {
  slide.addText(t, { fontFace: F, color: C.navy, margin: 0, valign: 'top', isTextBox: true, ...o });
}
function footer(slide, dark) {
  page++;
  text(slide, 'ENMA FORMATION  ·  Formation des élus municipaux 2026', { x: M, y: 7.0, w: 7, h: 0.3, fontSize: 9, color: dark ? C.muted : C.foot, charSpacing: 1, valign: 'middle' });
  text(slide, String(page), { x: 10.6, y: 7.0, w: 0.6, h: 0.3, fontSize: 9, color: dark ? C.muted : C.foot, align: 'right', valign: 'middle' });
  slide.addImage({ data: dark ? LOGO_W : LOGO_NAVY, x: 11.45, y: 6.9, w: 1.28, h: 0.53 });
}
function base(dark) {
  const s = pres.addSlide();
  s.background = { color: dark ? C.navy : C.white };
  return s;
}
function header(slide, num, kicker, title, o = {}) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M, y: 0.48, w: 0.46, h: 0.34, rectRadius: 0.08, fill: { color: o.dark ? C.cream : C.navy }, line: { type: 'none' } });
  text(slide, num, { x: M, y: 0.48, w: 0.46, h: 0.34, fontSize: 11, bold: true, color: o.dark ? C.navy : C.cream, align: 'center', valign: 'middle' });
  text(slide, kicker.toUpperCase(), { x: M + 0.62, y: 0.48, w: 9, h: 0.34, fontSize: 11, bold: true, color: o.dark ? C.cream : C.sub, charSpacing: 2, valign: 'middle' });
  text(slide, title, { x: M, y: 0.92, w: o.tw || 12.1, h: o.th || 0.75, fontSize: o.ts || 28, bold: true, color: o.dark ? C.white : C.navy, valign: 'middle', fit: 'shrink' });
}
function rrect(slide, x, y, w, h, fill, o = {}) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: o.r ?? 0.12, fill: { color: fill, transparency: o.tr || 0 }, line: o.line ? { color: o.line, width: o.lw || 1, dashType: o.dash || 'solid' } : { type: 'none' }, shadow: o.shadow ? { type: 'outer', color: '0B032B', opacity: 0.12, blur: 8, offset: 2, angle: 90 } : undefined });
}
function disc(slide, x, y, d, fill, o = {}) {
  slide.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill, transparency: o.tr || 0 }, line: o.line ? { color: o.line, width: o.lw || 1.5, dashType: o.dash || 'solid' } : { type: 'none' } });
}
async function iconDisc(slide, name, x, y, d, bg, fg) {
  disc(slide, x, y, d, bg);
  const k = d * 0.56;
  slide.addImage({ data: await icon(name, fg), x: x + (d - k) / 2, y: y + (d - k) / 2, w: k, h: k });
}
// Carte « À retenir » (motif récurrent : le médaillon-épingle)
async function retenir(slide, x, y, w, h, body, o = {}) {
  rrect(slide, x, y, w, h, o.light ? C.cream : C.navy, { r: 0.14 });
  const d = 0.62;
  await iconDisc(slide, 'PiPushPinFill', x + 0.28, y + 0.28, d, o.light ? C.navy : C.cream, o.light ? C.cream : C.navy);
  text(slide, o.label || 'À RETENIR', { x: x + 1.1, y: y + 0.3, w: w - 1.4, h: 0.3, fontSize: 11, bold: true, charSpacing: 3, color: o.light ? C.navy : C.cream });
  text(slide, body, { x: x + 1.1, y: y + 0.64, w: w - 1.4, h: h - 0.86, fontSize: o.fs || 14, color: o.light ? C.navy : C.white, fit: 'shrink', lineSpacingMultiple: 1.05 });
}
// Liste à puces personnalisées (pastilles)
function bullets(items, o = {}) {
  return items.map((t, i) => {
    const runs = Array.isArray(t) ? t : [{ text: t }];
    return runs.map((r, j) => ({
      text: r.text,
      options: {
        bold: r.bold, color: r.color, italic: r.italic,
        ...(j === 0 ? { bullet: o.num ? { type: 'number' } : { code: '25CF', indent: 16 }, paraSpaceAfter: o.gap ?? 6 } : {}),
        breakLine: j === runs.length - 1 && i < items.length - 1,
      },
    }));
  }).flat();
}
// Diviseur de séquence : grand numéro + médaillon illustré
async function divider(num, label, title, sub, time, artSvg, notes, o = {}) {
  const s = base(true);
  s.background = { color: C.navy };
  text(s, num, { x: M, y: 0.7, w: 4.5, h: 2.5, fontSize: 150, fontFace: NUM, color: C.cream, valign: 'bottom' });
  text(s, label, { x: M + 0.05, y: 3.3, w: 6, h: 0.35, fontSize: 13, bold: true, charSpacing: 4, color: C.cream });
  const tfs = title.length > 70 ? 26 : title.length > 45 ? 30 : 36;
  text(s, title, { x: M, y: 3.72, w: 6.0, h: 1.6, fontSize: tfs, bold: true, color: C.white, valign: 'top' });
  if (sub) text(s, sub, { x: M, y: 5.4, w: 6.0, h: 0.7, fontSize: 16, color: C.muted, fit: 'shrink' });
  if (time) {
    rrect(s, M, 6.15, 3.3, 0.42, C.navy, { line: C.cream, lw: 1, r: 0.21 });
    text(s, time, { x: M, y: 6.15, w: 3.3, h: 0.42, fontSize: 12, bold: true, color: C.cream, align: 'center', valign: 'middle' });
  }
  // médaillon
  const cx = 9.85, cy = 3.45;
  disc(s, cx - 3.0, cy - 3.0, 6.0, C.navy, { line: C.cream, lw: 1, dash: 'dash' });
  disc(s, cx - 2.65, cy - 2.65, 5.3, o.panel || C.cream);
  const [aw, ah] = dims(artSvg);
  const box = o.box || 3.4;
  const r = Math.min(box / aw, box / ah);
  await art(s, artSvg, cx - (aw * r) / 2, cy - (ah * r) / 2 + (o.dy || 0), aw * r, ah * r);
  footer(s, true);
  s.addNotes(notes);
  return s;
}

// ---------- petites illustrations complémentaires ----------
function orgArt() {
  const N = '#0B032B', Cr = '#FFF9C7';
  const b = (x, y, sc, fill, stroke) => `<circle cx="${x}" cy="${y}" r="${22 * sc}" fill="${fill}" ${stroke ? `stroke="${N}" stroke-width="5"` : ''}/><path d="M${x - 42 * sc},${y + 80 * sc} Q${x - 42 * sc},${y + 32 * sc} ${x},${y + 32 * sc} Q${x + 42 * sc},${y + 32 * sc} ${x + 42 * sc},${y + 80 * sc} Z" fill="${fill}" ${stroke ? `stroke="${N}" stroke-width="5"` : ''}/>`;
  let s = `<path d="M250,150 L250,196 M100,196 L400,196 M100,196 L100,232 M250,196 L250,232 M400,196 L400,232" stroke="${N}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  s += b(250, 50, 1.3, N) + `<path d="M268,96 L282,108 L226,154 L214,142 Z" fill="${Cr}"/>`;
  for (const x of [100, 250, 400]) s += b(x, 262, 1, N);
  for (const x of [70, 130, 220, 280, 370, 430]) s += `<circle cx="${x}" cy="386" r="14" fill="${N}" fill-opacity="0.45"/>`;
  s += `<path d="M100,344 L100,366 M250,344 L250,366 M400,344 L400,366" stroke="${N}" stroke-width="4" stroke-opacity="0.45" stroke-linecap="round"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="420" viewBox="0 0 500 420">${s}</svg>`;
}
function frontonArt() {
  // Fronton de mairie : quatre colonnes = quatre exigences
  const N = '#0B032B', Cr = '#FFF9C7';
  let s = `<polygon points="20,110 300,20 580,110" fill="${N}"/><polygon points="80,98 300,36 520,98" fill="${Cr}" fill-opacity="0.18"/>`;
  s += `<rect x="30" y="112" width="540" height="26" fill="${N}"/>`;
  for (let i = 0; i < 4; i++) {
    const x = 70 + i * 132;
    s += `<rect x="${x}" y="150" width="68" height="16" fill="${N}"/><rect x="${x + 10}" y="166" width="48" height="150" fill="${Cr}" stroke="${N}" stroke-width="5"/>`;
    for (let k = 1; k < 4; k++) s += `<line x1="${x + 10 + k * 12}" y1="172" x2="${x + 10 + k * 12}" y2="310" stroke="${N}" stroke-opacity="0.25" stroke-width="3"/>`;
    s += `<rect x="${x}" y="316" width="68" height="16" fill="${N}"/>`;
  }
  s += `<rect x="20" y="332" width="560" height="22" fill="${N}"/><rect x="0" y="354" width="600" height="18" fill="${N}" fill-opacity="0.6"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="372" viewBox="0 0 600 372">${s}</svg>`;
}

// ====================================================================
(async () => {
  // logos
  const wm = await sharp(BRAND + 'logo-wordmark.png').png().toBuffer();
  LOGO_W = 'image/png;base64,' + wm.toString('base64');
  const navyBg = await sharp({ create: { width: 1300, height: 597, channels: 4, background: '#0B032B' } }).composite([{ input: wm, left: 50, top: 50 }]).png().toBuffer();
  LOGO_NAVY = 'image/png;base64,' + navyBg.toString('base64');
  LOGO_ICON = 'image/png;base64,' + (await sharp(BRAND + 'logo-icon.png').png().toBuffer()).toString('base64');

  // =========================== 1. COUVERTURE ===========================
  {
    const s = base(true);
    s.background = { color: C.navy };
    s.addImage({ data: LOGO_W, x: M, y: 0.6, w: 2.4, h: 0.994 });
    text(s, 'FORMATION DES ÉLUS MUNICIPAUX 2026', { x: M, y: 2.35, w: 6.6, h: 0.35, fontSize: 14, bold: true, color: C.cream, charSpacing: 4 });
    text(s, 'Bien débuter son mandat municipal', { x: M, y: 2.8, w: 6.4, h: 2.1, fontSize: 50, bold: true, color: C.white, valign: 'top' });
    text(s, [
      { text: 'Fonctions de l’élu', options: { bold: true, color: C.cream } },
      { text: '   ·   7 heures   ·   1 journée', options: { color: C.muted } },
    ], { x: M, y: 5.05, w: 6.4, h: 0.4, fontSize: 18 });
    text(s, 'ENMA Formation — Organisme de formation certifié Qualiopi · Hauts-de-France', { x: M, y: 6.55, w: 7, h: 0.3, fontSize: 11, color: C.muted });
    await art(s, I2.mairieArt(), 6.75, 0.85, 6.2);
    s.addNotes('Accueil des participants (09h00). Présentation de l’intervenant ENMA Formation, rappel des horaires (09h00 – 17h45, pauses et déjeuner), émargement. Tour de table rapide : prénom, commune, fonction (maire, adjoint, conseiller délégué, conseiller municipal, opposition), premier mandat ou non.');
    page++;
  }

  // =========================== 2. BIENVENUE ===========================
  {
    const s = base();
    header(s, '00', 'Ouverture', 'Bienvenue !');
    text(s, 'Félicitations pour votre élection lors des élections municipales de mars 2026.', { x: M, y: 2.05, w: 6.8, h: 1.0, fontSize: 24, bold: true, color: C.navy });
    text(s, 'Être élu municipal, c’est bien plus qu’un mandat : c’est un engagement au service de l’intérêt général, de la proximité et du développement de votre commune.', { x: M, y: 3.25, w: 6.6, h: 1.3, fontSize: 18, color: C.sub, lineSpacingMultiple: 1.1 });
    // trois mots-clés en pastilles
    const kw = [['PiScales', 'Intérêt général'], ['PiHandshake', 'Proximité'], ['PiTrendUp', 'Développement']];
    for (let i = 0; i < 3; i++) {
      const x = M + i * 2.2;
      rrect(s, x, 4.95, 2.0, 1.2, C.tint);
      await iconDisc(s, kw[i][0], x + 0.2, 5.12, 0.5, C.navy, C.cream);
      text(s, kw[i][1], { x: x + 0.2, y: 5.7, w: 1.7, h: 0.35, fontSize: 13, bold: true });
    }
    disc(s, 8.25, 1.35, 4.6, C.tint);
    disc(s, 8.6, 1.7, 3.9, C.cream);
    await art(s, I2.urneArt(), 9.3, 2.45, 2.5);
    footer(s);
    s.addNotes('Message d’accueil : féliciter les élus pour leur élection de mars 2026. Insister sur la notion d’engagement : intérêt général, proximité, développement de la commune. Question d’ouverture possible : « Qu’est-ce qui vous a donné envie de vous engager ? »');
  }

  // =========================== 3. PROGRAMME & OBJECTIF ===========================
  {
    const s = base();
    header(s, '00', 'Ouverture', 'Au cours de cette formation, vous découvrirez :');
    const items = [
      'Les fondamentaux du rôle de l’élu municipal ;',
      'Les droits, devoirs et responsabilités des élus ;',
      'Le fonctionnement des collectivités territoriales ;',
      'Les relations avec les habitants, les partenaires et les institutions ;',
      'Les clés pour exercer votre mandat avec efficacité, éthique et sérénité.',
    ];
    // chemin vertical ponctué d'étapes
    s.addShape(pres.shapes.LINE, { x: M + 0.27, y: 2.2, w: 0, h: 4.2, line: { color: C.tint2, width: 3, dashType: 'dash' } });
    items.forEach((t, i) => {
      const y = 2.0 + i * 0.9;
      disc(s, M, y, 0.56, i === 4 ? C.cream : C.navy, i === 4 ? { line: C.navy, lw: 2 } : {});
      text(s, String(i + 1), { x: M, y, w: 0.56, h: 0.56, fontSize: 16, bold: true, color: i === 4 ? C.navy : C.cream, align: 'center', valign: 'middle' });
      text(s, t, { x: M + 0.8, y: y + 0.02, w: 6.0, h: 0.56, fontSize: 16, valign: 'middle' });
    });
    rrect(s, 7.75, 2.0, 5.0, 2.6, C.navy);
    text(s, 'NOTRE OBJECTIF AUJOURD’HUI', { x: 8.1, y: 2.25, w: 4.4, h: 0.3, fontSize: 11, bold: true, color: C.cream, charSpacing: 3 });
    text(s, 'Vous donner toutes les clés pour exercer votre mandat avec confiance, compétence et responsabilité, au service de votre commune et de ses habitants.', { x: 8.1, y: 2.65, w: 4.35, h: 1.8, fontSize: 16, color: C.white, lineSpacingMultiple: 1.1 });
    rrect(s, 7.75, 4.85, 5.0, 1.75, C.cream);
    text(s, '“', { x: 7.95, y: 4.72, w: 0.6, h: 0.8, fontSize: 60, bold: true, fontFace: 'Cambria', color: C.navy });
    text(s, 'Être élu, c’est transformer la confiance des citoyens en actions concrètes au service de l’intérêt général.', { x: 8.55, y: 5.05, w: 3.95, h: 1.4, fontSize: 15, italic: true, color: C.navy, fontFace: 'Cambria', valign: 'middle' });
    footer(s);
    s.addNotes('Présenter les 5 grands axes de la journée et l’objectif. Lire la citation et la laisser en fil rouge : on y reviendra en conclusion.');
  }

  // =========================== 4. DÉROULÉ 7 H ===========================
  {
    const s = base();
    header(s, '00', 'Organisation de la journée', 'Déroulé pédagogique : 7 heures, 1 journée');
    const k = 12.1 / 240;
    const rows = [
      { label: 'MATIN', y: 2.25, blocks: [
        ['09h00', 30, '00', 'Ouverture'], ['09h30', 60, '01', 'Le rôle du Maire'], ['10h30', 15, 'P', 'Pause'],
        ['10h45', 60, '02', 'Adjoints, conseillers & opposition'], ['11h45', 45, '03', 'Gestion des agents'],
      ] },
      { label: 'APRÈS-MIDI', y: 4.55, blocks: [
        ['13h45', 60, '04', 'Droits, devoirs & responsabilités'], ['14h45', 90, '05', 'EPCI, Département, Région, État'],
        ['16h15', 15, 'P', 'Pause'], ['16h30', 45, '06', 'Habitants & exemplarité'], ['17h15', 30, '07', 'Conclusion'],
      ] },
    ];
    for (const r of rows) {
      text(s, r.label, { x: M, y: r.y - 0.4, w: 3, h: 0.3, fontSize: 11, bold: true, color: C.sub, charSpacing: 3 });
      let x = M;
      for (const [t, min, n, lab] of r.blocks) {
        const w = min * k - 0.08;
        const pause = n === 'P';
        rrect(s, x, r.y, w, 1.65, pause ? C.tint : C.navy, { r: 0.1 });
        text(s, t, { x: x + 0.12, y: r.y + 0.12, w: w - 0.2, h: 0.25, fontSize: 10, bold: true, color: pause ? C.sub : C.muted });
        if (pause) {
          s.addImage({ data: await icon('PiCoffee', C.navy), x: x + (w - 0.36) / 2, y: r.y + 0.62, w: 0.36, h: 0.36 });
        } else {
          text(s, n, { x: x + 0.12, y: r.y + 0.36, w: 1, h: 0.5, fontSize: 24, fontFace: NUM, color: C.cream });
          text(s, lab, { x: x + 0.12, y: r.y + 0.9, w: w - 0.22, h: 0.65, fontSize: w < 1.6 ? 11 : 13, bold: true, color: C.white, fit: 'shrink' });
          text(s, min + ' min', { x: x + w - 0.9, y: r.y + 0.12, w: 0.78, h: 0.25, fontSize: 10, color: C.cream, align: 'right' });
        }
        x += min * k;
      }
      if (r.label === 'MATIN') {
        rrect(s, x + 0.1, r.y, 12.7 - x - 0.1, 1.65, C.cream, { r: 0.1 });
        s.addImage({ data: await icon('PiForkKnife', C.navy), x: x + 0.3, y: r.y + 0.2, w: 0.4, h: 0.4 });
        text(s, 'Déjeuner', { x: x + 0.3, y: r.y + 0.75, w: 1.3, h: 0.3, fontSize: 13, bold: true });
        text(s, '12h30 – 13h45', { x: x + 0.3, y: r.y + 1.08, w: 1.3, h: 0.3, fontSize: 11, color: C.sub });
      }
    }
    text(s, 'Pédagogie active : apports, exemples concrets du quotidien municipal, échanges et questions tout au long de la journée.', { x: M, y: 6.45, w: 10, h: 0.35, fontSize: 12, italic: true, color: C.sub });
    footer(s);
    s.addNotes('Présenter le déroulé horaire : 7 heures de formation effective (09h00 – 12h30 / 13h45 – 17h45, deux pauses de 15 min). Les numéros de séquence (01 à 07) se retrouvent en haut à gauche de chaque diapositive pour se repérer.');
  }

  // =========================== SÉQUENCE 01 — LE MAIRE ===========================
  await divider('01', 'SÉQUENCE 01', 'Le rôle du Maire : premier magistrat de la commune', 'Chef de l’exécutif, représentant de l’État, autorité de police administrative.', '09h30 – 10h30  ·  60 min', I2.maireFigure(), 'Séquence 01 (60 min). Objectif : comprendre les trois « casquettes » du maire, ses missions, ses droits et ses devoirs. Question d’entrée : « Selon vous, combien de rôles différents le maire exerce-t-il ? »', { box: 3.6 });

  {
    const s = base();
    header(s, '01', 'Le rôle du Maire', 'Le Maire, un acteur au cœur de la vie communale');
    text(s, 'Élu par le conseil municipal, le maire est à la fois :', { x: M, y: 1.75, w: 8, h: 0.4, fontSize: 16, color: C.sub, italic: true });
    disc(s, M + 0.1, 2.45, 3.9, C.tint);
    await art(s, I2.maireFigure(), M + 1.05, 2.75, 0, 3.3);
    const roles = [
      ['PiBank', 'Chef de l’exécutif communal', 'Il met en œuvre les décisions du conseil municipal et administre la commune.'],
      ['PiFlagBanner', 'Représentant de l’État', 'Il agit au nom de l’État pour certaines missions (état civil, élections, recensement...).'],
      ['PiShieldCheck', 'Autorité de police administrative', 'Il veille à la sécurité, à la salubrité et à la tranquillité publiques.'],
    ];
    for (let i = 0; i < 3; i++) {
      const y = 2.35 + i * 1.47;
      rrect(s, 5.2, y, 7.5, 1.3, i === 1 ? C.cream : C.tint);
      await iconDisc(s, roles[i][0], 5.42, y + 0.27, 0.76, C.navy, C.cream);
      text(s, roles[i][1], { x: 6.45, y: y + 0.2, w: 6.0, h: 0.4, fontSize: 18, bold: true });
      text(s, roles[i][2], { x: 6.45, y: y + 0.62, w: 6.0, h: 0.6, fontSize: 14, color: C.sub });
      // liaison pointillée vers la silhouette
      s.addShape(pres.shapes.LINE, { x: 4.2, y: y + 0.65, w: 1.0, h: 0, line: { color: C.navy, width: 1.25, dashType: 'sysDot', endArrowType: 'oval' } });
    }
    footer(s);
    s.addNotes('Les trois « casquettes » du maire. Exemples à citer : chef de l’exécutif (exécution des délibérations), agent de l’État (célébration d’un mariage, organisation des élections, recensement), police administrative (arrêté de circulation, sécurité d’une manifestation).');
  }

  {
    const s = base();
    header(s, '01', 'Le rôle du Maire', 'Ses principales missions');
    const m = [
      ['PiNotePencil', 'Préparer et exécuter les délibérations du conseil municipal.'],
      ['PiCoins', 'Gérer le budget et les finances communales.'],
      ['PiUsersThree', 'Diriger les services municipaux et les agents.'],
      ['PiIdentificationCard', 'Délivrer les actes d’état civil (naissances, mariages, décès).'],
      ['PiStamp', 'Signer les arrêtés municipaux.'],
      ['PiScales', 'Représenter la commune devant les tribunaux et auprès des partenaires.'],
    ];
    for (let i = 0; i < 6; i++) {
      const col = i % 3, row = Math.floor(i / 3);
      const x = M + col * 4.1, y = 2.0 + row * 2.4;
      rrect(s, x, y, 3.85, 2.15, C.tint);
      await iconDisc(s, m[i][0], x + 0.3, y + 0.3, 0.8, C.navy, C.cream);
      text(s, String(i + 1).padStart(2, '0'), { x: x + 2.85, y: y + 0.28, w: 0.75, h: 0.5, fontSize: 24, fontFace: NUM, color: C.tint2, align: 'right' });
      text(s, m[i][1], { x: x + 0.3, y: y + 1.2, w: 3.3, h: 0.85, fontSize: 15, bold: true });
    }
    footer(s);
    s.addNotes('Six missions principales. Faire réagir : quelles missions les participants découvrent-ils ? Préciser que la direction des services est une compétence propre du maire (reprise en séquence 03).');
  }

  {
    const s = base();
    header(s, '01', 'Le rôle du Maire', 'Exemples concrets');
    const ex = [
      ['PiFlagBanner', 'Organiser les cérémonies du 14 Juillet ou du 11 Novembre.'],
      ['PiBicycle', 'Prendre un arrêté pour interdire la circulation lors d’une brocante ou d’une course cycliste.'],
      ['vignette:espace', 'Fermer un parc municipal en cas de tempête afin d’assurer la sécurité des habitants.'],
      ['PiHeart', 'Célébrer un mariage ou parrainer une cérémonie de citoyenneté.'],
    ];
    for (let i = 0; i < 4; i++) {
      const x = M + i * 3.07, y = 2.0;
      rrect(s, x, y, 2.85, 4.55, i % 2 ? C.cream : C.tint);
      disc(s, x + 0.52, y + 0.4, 1.8, C.white);
      if (ex[i][0].startsWith('vignette:')) await art(s, I2.vignette('espace'), x + 0.77, y + 0.62, 1.3);
      else s.addImage({ data: await icon(ex[i][0], C.navy), x: x + 0.97, y: y + 0.85, w: 0.9, h: 0.9 });
      // pastille de validation
      disc(s, x + 1.95, y + 1.8, 0.5, C.navy);
      s.addImage({ data: await icon('PiCheckBold', C.cream), x: x + 2.05, y: y + 1.9, w: 0.3, h: 0.3 });
      text(s, ex[i][1], { x: x + 0.3, y: y + 2.6, w: 2.3, h: 1.7, fontSize: 15, bold: true });
    }
    footer(s);
    s.addNotes('Illustrer chaque casquette par un exemple : cérémonies (vie communale), arrêté de circulation et fermeture d’un parc (police administrative), mariage et cérémonie de citoyenneté (officier d’état civil, agent de l’État). Demander aux participants un exemple vécu dans leur commune.');
  }

  {
    const s = base();
    header(s, '01', 'Le rôle du Maire', 'Ses droits, ses devoirs et responsabilités');
    await art(s, I2.balanceArt(), 5.15, 2.2, 3.05);
    text(s, 'Un équilibre permanent', { x: 5.0, y: 5.25, w: 3.35, h: 0.4, fontSize: 13, italic: true, color: C.sub, align: 'center' });
    rrect(s, M, 2.0, 4.3, 4.6, C.tint);
    text(s, 'SES DROITS', { x: M + 0.35, y: 2.25, w: 3.6, h: 0.35, fontSize: 13, bold: true, charSpacing: 3 });
    text(s, bullets([
      'Être informé et accompagné par les services de l’État.',
      'Bénéficier d’une formation tout au long du mandat.',
      'Percevoir une indemnité de fonction (selon les règles applicables).',
      'Déléguer certaines fonctions à ses adjoints.',
    ], { gap: 10 }), { x: M + 0.35, y: 2.75, w: 3.7, h: 3.7, fontSize: 15 });
    rrect(s, 8.4, 2.0, 4.33, 4.6, C.navy);
    text(s, 'SES DEVOIRS ET RESPONSABILITÉS', { x: 8.75, y: 2.25, w: 3.8, h: 0.35, fontSize: 13, bold: true, charSpacing: 2, color: C.cream });
    text(s, bullets([
      'Respecter les lois et agir dans l’intérêt général.',
      'Garantir l’égalité de traitement entre tous les habitants.',
      'Assurer la continuité du service public.',
      'Rendre compte de son action devant le conseil municipal et les citoyens.',
      'Engager sa responsabilité civile, pénale ou politique en cas de faute ou de manquement.',
    ], { gap: 8 }), { x: 8.75, y: 2.75, w: 3.75, h: 3.75, fontSize: 14, color: C.white });
    footer(s);
    s.addNotes('Mettre en regard droits et devoirs : la balance symbolise l’équilibre du mandat. Annoncer que les responsabilités civile, pénale et politique seront détaillées en séquence 04.');
  }

  {
    const s = base(true);
    header(s, '01', 'Le rôle du Maire', 'Message clé à retenir', { dark: true });
    text(s, 'Le maire est le garant du bon fonctionnement de la commune.', { x: M, y: 1.95, w: 12, h: 0.8, fontSize: 30, bold: true, color: C.cream });
    const r = [['PiLightbulb', 'Décideur'], ['PiCoins', 'Gestionnaire'], ['PiFlagBanner', 'Représentant de l’État'], ['PiChatsCircle', 'Interlocuteur privilégié des habitants']];
    for (let i = 0; i < 4; i++) {
      const x = M + i * 3.07;
      rrect(s, x, 2.95, 2.85, 1.55, C.surf2);
      await iconDisc(s, r[i][0], x + 0.25, 3.15, 0.6, C.cream, C.navy);
      text(s, r[i][1], { x: x + 0.25, y: 3.85, w: 2.45, h: 0.55, fontSize: 15, bold: true, color: C.white, fit: 'shrink' });
    }
    text(s, 'Il est à la fois décideur, gestionnaire, représentant de l’État et interlocuteur privilégié des habitants. Son action quotidienne repose sur un équilibre entre proximité, responsabilité et respect de la loi.', { x: M, y: 4.8, w: 7.6, h: 1.4, fontSize: 16, color: C.white, lineSpacingMultiple: 1.1 });
    // triangle d'équilibre
    const tri = [['Proximité', 9.55, 4.75], ['Responsabilité', 8.45, 5.95], ['Respect de la loi', 10.65, 5.95]];
    s.addShape(pres.shapes.ISOSCELES_TRIANGLE, { x: 9.0, y: 5.0, w: 2.2, h: 1.15, fill: { color: C.navy }, line: { color: C.cream, width: 1.25, dashType: 'dash' } });
    for (const [t, x, y] of tri) { rrect(s, x, y, 1.65, 0.4, C.cream, { r: 0.2 }); text(s, t, { x, y, w: 1.65, h: 0.4, fontSize: 12, bold: true, align: 'center', valign: 'middle' }); }
    footer(s, true);
    s.addNotes('Synthèse de la séquence 01. Faire reformuler par un participant les quatre rôles, puis l’équilibre proximité / responsabilité / respect de la loi.');
  }

  // =========================== SÉQUENCE 02 — L'ÉQUIPE MUNICIPALE ===========================
  await divider('02', 'SÉQUENCE 02', 'Les adjoints, les conseillers délégués et les conseillers municipaux', 'Des rôles complémentaires… et une opposition aux droits garantis.', '10h45 – 11h45  ·  60 min', I2.conseilArt(), 'Séquence 02 (60 min). Objectif : distinguer les rôles au sein de l’équipe municipale, puis les droits et devoirs des conseillers d’opposition et les prérogatives du maire en séance.', { box: 3.7 });

  {
    const s = base();
    header(s, '02', 'L’équipe municipale', 'Des rôles complémentaires au service du projet municipal');
    const hd = (t) => ({ text: t, options: { bold: true, color: C.cream, fill: { color: C.navy }, fontSize: 13, valign: 'middle' } });
    const c1 = (t) => ({ text: t, options: { bold: true, fontSize: 14, color: C.navy, fill: { color: C.tint }, valign: 'middle' } });
    const c = (t, fill) => ({ text: t, options: { fontSize: 12.5, color: C.navy, fill: { color: fill || C.white }, valign: 'middle' } });
    const rows = [
      [hd('Fonction'), hd('Missions principales'), hd('Exemples concrets')],
      [c1('Les adjoints au maire'), c('Assistent le maire dans l’exercice de ses fonctions et reçoivent une délégation de compétences (urbanisme, finances, écoles, sports, culture, travaux, etc.). Ils peuvent remplacer le maire en cas d’absence selon l’ordre du tableau.'), c('L’adjoint aux travaux suit la réfection d’une voirie. L’adjointe aux affaires scolaires prépare la rentrée et participe aux conseils d’école.', 'FFFDEB')],
      [c1('Les conseillers municipaux délégués'), c('Conseillers municipaux auxquels le maire confie une mission précise par délégation. Ils viennent renforcer l’action des adjoints sur des dossiers ciblés.'), c('Suivi du commerce local, transition écologique, devoir de mémoire, numérique, vie associative ou participation citoyenne.', 'FFFDEB')],
      [c1('Les conseillers municipaux'), c('Participent aux séances du conseil municipal, débattent, proposent des idées, votent les délibérations et représentent les habitants. Ils peuvent siéger dans des commissions municipales ou représenter la commune dans des organismes extérieurs.'), c('Vote du budget, participation à la commission urbanisme, représentation au conseil d’administration du CCAS ou d’un établissement scolaire.', 'FFFDEB')],
    ];
    s.addTable(rows, { x: M, y: 1.95, w: 12.1, colW: [2.6, 5.4, 4.1], rowH: [0.45, 1.35, 1.1, 1.45], fontFace: F, border: { type: 'solid', color: 'FFFFFF', pt: 3 }, margin: [0.08, 0.14, 0.08, 0.14] });
    footer(s);
    s.addNotes('Parcourir le tableau ligne par ligne. Rappeler l’ordre du tableau pour le remplacement du maire. Inviter chacun à situer sa propre fonction et sa délégation éventuelle.');
  }

  {
    const s = base();
    header(s, '02', 'L’équipe municipale', 'Leurs responsabilités');
    const r = [
      ['PiScales', 'Respecter les principes de neutralité, de probité et d’intérêt général.'],
      ['PiCalendarCheck', 'Participer activement aux réunions et aux commissions.'],
      ['PiEar', 'Être à l’écoute des habitants et faire remonter leurs attentes.'],
      ['PiLockKey', 'Appliquer le devoir de réserve et respecter la confidentialité des informations sensibles.'],
      ['PiUsersThree', 'Contribuer à la mise en œuvre du projet municipal dans un esprit de travail collectif.'],
    ];
    for (let i = 0; i < 5; i++) {
      const y = 1.95 + i * 0.95;
      rrect(s, M, y, 7.4, 0.8, i % 2 ? C.white : C.tint, { line: i % 2 ? C.tint2 : undefined });
      await iconDisc(s, r[i][0], M + 0.15, y + 0.12, 0.56, C.navy, C.cream);
      text(s, r[i][1], { x: M + 0.9, y, w: 6.35, h: 0.8, fontSize: 15, valign: 'middle' });
    }
    disc(s, 8.6, 1.9, 4.1, C.cream);
    await art(s, I2.conseilArt(), 8.95, 2.45, 3.4);
    // légende
    const leg = [['Maire', 'maire'], ['Adjoints', 'adj'], ['Conseillers', 'maj']];
    leg.forEach(([t, k], i) => {
      const x = 8.55 + i * 1.45, y = 6.25;
      if (k === 'maire') disc(s, x, y + 0.06, 0.24, C.cream, { line: C.navy, lw: 2 });
      else disc(s, x, y + 0.06, 0.24, C.navy);
      if (k === 'adj') disc(s, x + 0.08, y + 0.14, 0.08, C.cream);
      text(s, t, { x: x + 0.32, y, w: 1.1, h: 0.36, fontSize: 11, color: C.sub, valign: 'middle' });
    });
    footer(s);
    s.addNotes('Cinq responsabilités communes à tous les membres de l’équipe municipale. Insister sur la confidentialité et le devoir de réserve, souvent sous-estimés en début de mandat.');
  }

  {
    const s = base();
    header(s, '02', 'L’équipe municipale', 'Une équipe efficace repose sur la complémentarité des rôles');
    const st = [
      ['PiCompass', 'Le maire', 'fixe le cap'],
      ['PiSteeringWheel', 'Les adjoints', 'pilotent les grandes politiques publiques'],
      ['PiTarget', 'Les conseillers délégués', 'suivent des projets spécifiques'],
      ['PiHandPalm', 'Les conseillers municipaux', 'participent pleinement aux décisions et au contrôle de l’action municipale'],
    ];
    for (let i = 0; i < 4; i++) {
      const x = M + i * 3.07, y = 2.05;
      rrect(s, x, y, 2.85, 2.55, i === 0 ? C.navy : C.tint);
      await iconDisc(s, st[i][0], x + 0.3, y + 0.3, 0.8, i === 0 ? C.cream : C.navy, i === 0 ? C.navy : C.cream);
      text(s, st[i][1], { x: x + 0.3, y: y + 1.2, w: 2.35, h: 0.62, fontSize: 15.5, valign: 'bottom', bold: true, color: i === 0 ? C.cream : C.navy });
      text(s, st[i][2], { x: x + 0.3, y: y + 1.88, w: 2.35, h: 0.62, fontSize: 13.5, color: i === 0 ? C.white : C.sub, fit: 'shrink' });
      if (i < 3) s.addShape(pres.shapes.CHEVRON, { x: x + 2.89, y: y + 1.1, w: 0.14, h: 0.3, fill: { color: C.navy }, line: { type: 'none' } });
    }
    await retenir(s, M, 4.9, 12.1, 1.75, 'Une équipe municipale efficace repose sur la complémentarité des rôles : le maire fixe le cap, les adjoints pilotent les grandes politiques publiques, les conseillers délégués suivent des projets spécifiques et les conseillers municipaux participent pleinement aux décisions et au contrôle de l’action municipale.', { fs: 14.5 });
    footer(s);
    s.addNotes('À retenir sur l’équipe municipale. Image possible : l’équipage d’un navire (cap, pilotage, missions ciblées, contrôle).');
  }

  {
    const s = base();
    header(s, '02', 'L’opposition', 'Les conseillers municipaux d’opposition : des droits garantis, des devoirs à respecter', { ts: 26 });
    text(s, 'Un rôle essentiel dans la démocratie locale', { x: M, y: 2.0, w: 6.8, h: 0.5, fontSize: 22, bold: true });
    text(s, 'Les conseillers municipaux d’opposition participent pleinement à la vie démocratique de la commune. Ils contribuent au débat, contrôlent l’action de la majorité et représentent une partie des électeurs.', { x: M, y: 2.6, w: 6.6, h: 1.5, fontSize: 17, color: C.sub, lineSpacingMultiple: 1.1 });
    const v = [['PiChatsCircle', 'Contribuer au débat'], ['PiEye', 'Contrôler l’action de la majorité'], ['PiUsers', 'Représenter une partie des électeurs']];
    for (let i = 0; i < 3; i++) {
      const y = 4.3 + i * 0.75;
      await iconDisc(s, v[i][0], M, y, 0.55, C.cream, C.navy);
      text(s, v[i][1], { x: M + 0.75, y, w: 5.5, h: 0.55, fontSize: 15, bold: true, valign: 'middle' });
    }
    disc(s, 8.05, 1.95, 4.7, C.tint);
    await art(s, I2.conseilArt(), 8.45, 2.5, 3.9);
    const leg = [['Majorité', 'maj'], ['Opposition', 'opp']];
    leg.forEach(([t, k], i) => {
      const x = 8.9 + i * 1.9, y = 6.35;
      disc(s, x, y + 0.06, 0.24, k === 'opp' ? C.cream : C.navy, k === 'opp' ? { line: C.navy, lw: 2 } : {});
      text(s, t, { x: x + 0.32, y, w: 1.4, h: 0.36, fontSize: 11, color: C.sub, valign: 'middle' });
    });
    footer(s);
    s.addNotes('Présenter le rôle démocratique de l’opposition. Le schéma du conseil est illustratif : la majorité et l’opposition siègent ensemble et participent aux mêmes séances.');
  }

  {
    const s = base();
    header(s, '02', 'L’opposition', 'Leurs droits, leurs devoirs');
    rrect(s, M, 1.95, 7.2, 4.7, C.tint);
    text(s, 'LEURS DROITS', { x: M + 0.35, y: 2.2, w: 5, h: 0.35, fontSize: 13, bold: true, charSpacing: 3 });
    text(s, bullets([
      'Participer aux séances du conseil municipal.',
      'Être convoqués et recevoir les documents préparatoires dans les délais légaux.',
      'Poser des questions et participer aux débats.',
      'Voter les délibérations.',
      'S’exprimer dans le bulletin municipal ou sur les supports d’information de la commune, lorsque la loi le prévoit.',
      'Siéger dans les commissions municipales, selon les règles de représentation.',
    ], { gap: 8 }), { x: M + 0.35, y: 2.7, w: 6.5, h: 3.8, fontSize: 15 });
    rrect(s, 8.05, 1.95, 4.68, 4.7, C.navy);
    text(s, 'LEURS DEVOIRS', { x: 8.4, y: 2.2, w: 4, h: 0.35, fontSize: 13, bold: true, charSpacing: 3, color: C.cream });
    text(s, bullets([
      'Respecter les règles de fonctionnement du conseil municipal.',
      'Observer le respect dû aux autres élus et aux agents.',
      'Respecter le secret des informations confidentielles.',
      'Agir dans l’intérêt général, même dans le cadre du débat politique.',
    ], { gap: 10 }), { x: 8.4, y: 2.7, w: 4.05, h: 3.8, fontSize: 15, color: C.white });
    footer(s);
    s.addNotes('Droits protégés par la loi (convocation, documents, expression, commissions) et devoirs corrélatifs. Pour les élus de la majorité : ces droits sont une garantie démocratique, pas une contrainte.');
  }

  {
    const s = base();
    header(s, '02', 'L’opposition', 'Les prérogatives du maire en séance');
    text(s, 'En qualité de président du conseil municipal, le maire est responsable du bon déroulement des séances. Il peut notamment :', { x: M, y: 1.9, w: 12, h: 0.7, fontSize: 16, color: C.sub });
    const p = [
      ['PiMicrophoneStage', 'Donner et retirer la parole selon le règlement intérieur.'],
      ['PiListChecks', 'Fixer les modalités d’organisation des débats.'],
      ['PiHourglassMedium', 'Faire respecter le temps de parole lorsqu’il est prévu.'],
      ['PiWarning', 'Rappeler un élu à l’ordre en cas de propos injurieux, diffamatoires ou de troubles à la séance.'],
      ['PiHandPalm', 'Suspendre temporairement la séance si nécessaire pour rétablir le calme.'],
    ];
    for (let i = 0; i < 5; i++) {
      const x = M + i * 2.46;
      rrect(s, x, 2.75, 2.28, 2.1, C.tint);
      await iconDisc(s, p[i][0], x + 0.22, 2.95, 0.6, C.navy, C.cream);
      text(s, p[i][1], { x: x + 0.22, y: 3.65, w: 1.9, h: 1.1, fontSize: 12.5, bold: true, fit: 'shrink' });
    }
    await retenir(s, M, 5.1, 12.1, 1.6, 'L’opposition dispose de droits protégés par la loi, mais ces droits s’exercent dans le respect des règles de fonctionnement du conseil municipal. Le maire, garant du bon ordre des débats, veille à concilier liberté d’expression, respect des personnes et efficacité des travaux du conseil.', { fs: 14 });
    footer(s);
    s.addNotes('Police de l’assemblée : le maire préside et garantit le bon ordre des débats. Rappeler l’importance du règlement intérieur du conseil municipal.');
  }

  // =========================== SÉQUENCE 03 — LES AGENTS ===========================
  await divider('03', 'SÉQUENCE 03', 'La gestion des agents municipaux : une compétence du Maire', 'Le Maire est l’autorité territoriale de la commune.', '11h45 – 12h30  ·  45 min', orgArt(), 'Séquence 03 (45 min). Objectif : comprendre que les agents sont placés sous l’autorité hiérarchique du maire et adopter les bonnes pratiques dans la relation élus / agents.', { box: 3.5 });

  {
    const s = base();
    header(s, '03', 'La gestion des agents', 'Le Maire est l’autorité territoriale de la commune');
    rrect(s, M, 1.95, 12.1, 1.2, C.cream);
    s.addImage({ data: await icon('PiBookOpen', C.navy), x: M + 0.3, y: 2.25, w: 0.6, h: 0.6 });
    text(s, 'En application du Code général de la fonction publique et du Code général des collectivités territoriales, les agents municipaux sont placés sous l’autorité du maire, qui exerce le pouvoir hiérarchique sur l’ensemble des services municipaux.', { x: M + 1.15, y: 2.05, w: 10.75, h: 1.0, fontSize: 15, valign: 'middle' });
    text(s, 'LES MISSIONS DU MAIRE', { x: M, y: 3.45, w: 5, h: 0.3, fontSize: 12, bold: true, charSpacing: 3, color: C.sub });
    const m = [
      ['PiTreeStructure', 'Organiser et diriger les services municipaux.'],
      ['PiListChecks', 'Donner les instructions et fixer les priorités.'],
      ['PiUserPlus', 'Recruter, nommer et gérer la carrière des agents.'],
      ['PiChartLineUp', 'Évaluer les agents et assurer leur développement professionnel.'],
      ['PiGavel', 'Veiller au respect des obligations professionnelles et, le cas échéant, exercer le pouvoir disciplinaire.'],
      ['PiArrowsClockwise', 'Garantir la qualité et la continuité du service public.'],
    ];
    for (let i = 0; i < 6; i++) {
      const col = i % 2, row = Math.floor(i / 2);
      const x = M + col * 6.1, y = 3.9 + row * 0.95;
      await iconDisc(s, m[i][0], x, y + 0.08, 0.6, C.navy, C.cream);
      text(s, m[i][1], { x: x + 0.8, y, w: 5.1, h: 0.76, fontSize: 14.5, valign: 'middle' });
    }
    footer(s);
    s.addNotes('Fondement juridique : Code général de la fonction publique et CGCT. Le maire est l’autorité territoriale : il exerce seul le pouvoir hiérarchique sur les agents, sauf délégation de fonctions.');
  }

  {
    const s = base();
    header(s, '03', 'La gestion des agents', 'Le rôle des adjoints et des conseillers');
    // schéma de la chaîne hiérarchique (formes natives)
    const nodes = [
      ['Maire — autorité territoriale', 2.05, C.navy, C.cream],
      ['Élu délégataire (si délégation de fonctions)', 3.2, C.cream, C.navy],
      ['Direction générale / responsables de service', 4.35, C.tint, C.navy],
      ['Agents municipaux', 5.5, C.tint, C.navy],
    ];
    nodes.forEach(([t, y, bg, fg], i) => {
      rrect(s, M, y, 4.4, 0.75, bg, i === 1 ? { line: C.navy, lw: 1.25, dash: 'dash' } : {});
      text(s, t, { x: M + 0.2, y, w: 4.0, h: 0.75, fontSize: 13.5, bold: true, color: fg, valign: 'middle', align: 'center' });
      if (i < 3) s.addShape(pres.shapes.LINE, { x: M + 2.2, y: y + 0.75, w: 0, h: 0.4, line: { color: C.navy, width: 2, endArrowType: 'triangle' } });
    });
    // élu sans délégation : flèche barrée
    rrect(s, 5.35, 2.05, 1.9, 0.75, C.white, { line: C.alert, lw: 1.5 });
    text(s, 'Élu sans délégation', { x: 5.35, y: 2.05, w: 1.9, h: 0.75, fontSize: 12, bold: true, align: 'center', valign: 'middle' });
    s.addShape(pres.shapes.LINE, { x: 5.1, y: 2.8, w: 1.2, h: 3.0, flipH: true, line: { color: C.alert, width: 1.75, dashType: 'dash', endArrowType: 'triangle' } });
    disc(s, 5.45, 4.05, 0.55, C.white, { line: C.alert, lw: 2 });
    s.addImage({ data: await icon('PiProhibitBold', C.alert), x: 5.53, y: 4.13, w: 0.39, h: 0.39 });
    // texte
    text(s, bullets([
      'Les adjoints et les conseillers municipaux ne disposent d’aucune autorité hiérarchique sur les agents, sauf si le maire leur a confié une délégation de fonctions comprenant cette compétence.',
      'Toute demande adressée aux agents doit s’inscrire dans l’organisation définie par le maire ou, le cas échéant, par l’élu délégataire.',
      'Les élus doivent respecter la chaîne hiérarchique afin d’éviter des consignes contradictoires.',
    ], { gap: 14 }), { x: 7.65, y: 2.05, w: 5.05, h: 4.3, fontSize: 15.5 });
    footer(s);
    s.addNotes('Schéma de la chaîne hiérarchique : un élu sans délégation n’a pas d’autorité sur les agents. Exemple de situation à discuter : un conseiller demande directement à un agent technique de réparer un banc devant chez lui… quelle difficulté ?');
  }

  {
    const s = base();
    header(s, '03', 'La gestion des agents', 'Bonnes pratiques');
    const bp = [
      ['PiUsersThree', 'Respecter le rôle de chacun.'],
      ['PiChatText', 'Éviter les instructions directes aux agents sans information du maire ou du responsable de service.'],
      ['PiArrowsClockwise', 'Favoriser un dialogue permanent entre élus, direction générale et services municipaux.'],
    ];
    for (let i = 0; i < 3; i++) {
      const x = M + i * 4.1;
      rrect(s, x, 2.0, 3.85, 2.65, C.tint);
      await iconDisc(s, bp[i][0], x + 0.3, 2.3, 0.8, C.navy, C.cream);
      disc(s, x + 0.86, 2.82, 0.36, C.cream, { line: C.navy, lw: 1.5 });
      s.addImage({ data: await icon('PiCheckBold', C.navy), x: x + 0.92, y: 2.88, w: 0.24, h: 0.24 });
      text(s, bp[i][1], { x: x + 0.3, y: 3.3, w: 3.3, h: 1.25, fontSize: 15, bold: true });
    }
    await retenir(s, M, 4.95, 12.1, 1.75, 'Les agents municipaux travaillent au service de la commune, mais ils sont placés sous l’autorité hiérarchique du maire. Une organisation claire des relations entre élus et agents est indispensable pour garantir un fonctionnement efficace, serein et juridiquement sécurisé de la collectivité.', { fs: 14.5 });
    footer(s);
    s.addNotes('Trois bonnes pratiques et le message à retenir avant la pause déjeuner. Recueillir les questions de la matinée.');
  }

  // =========================== SÉQUENCE 04 — DROITS, DEVOIRS, RESPONSABILITÉS ===========================
  await divider('04', 'SÉQUENCE 04', 'Les droits, les devoirs et les responsabilités des élus', 'Les droits et les devoirs des élus municipaux · Les responsabilités des élus locaux : responsabilité pénale, civile et politique.', '13h45 – 14h45  ·  60 min', I2.balanceArt(), 'Séquence 04 (60 min). Objectif : connaître les droits et devoirs des élus municipaux et distinguer responsabilités pénale, civile et politique.', { box: 3.4 });

  {
    const s = base();
    header(s, '04', 'Droits et devoirs', 'Les droits des élus');
    text(s, 'Les élus municipaux disposent de droits garantis par la loi afin d’exercer leur mandat dans de bonnes conditions :', { x: M, y: 1.85, w: 12, h: 0.45, fontSize: 16, color: C.sub });
    const d = [
      ['PiFileText', 'Droit à l’information', 'Recevoir les convocations, notes explicatives et documents nécessaires aux délibérations.'],
      ['PiGraduationCap', 'Droit à la formation', 'Bénéficier de formations adaptées tout au long du mandat.'],
      ['PiChatCircleDots', 'Liberté d’expression', 'Participer aux débats et exprimer librement leurs positions dans le respect des règles du conseil.'],
      ['PiShieldCheck', 'Protection fonctionnelle', 'Être protégés par la commune lorsqu’ils sont victimes de menaces, violences, injures, diffamations ou outrages en lien avec leurs fonctions.'],
      ['PiCurrencyEur', 'Indemnités de fonction', 'Percevoir une indemnité lorsque la loi le prévoit.'],
      ['PiClock', 'Crédits d’heures et autorisations d’absence', 'Bénéficier des dispositifs permettant de concilier mandat électif et activité professionnelle.'],
    ];
    for (let i = 0; i < 6; i++) {
      const col = i % 3, row = Math.floor(i / 3);
      const x = M + col * 4.1, y = 2.45 + row * 2.2;
      rrect(s, x, y, 3.85, 2.0, C.tint);
      await iconDisc(s, d[i][0], x + 0.25, y + 0.25, 0.62, C.navy, C.cream);
      text(s, d[i][1], { x: x + 1.05, y: y + 0.22, w: 2.65, h: 0.68, fontSize: 14.5, bold: true, valign: 'middle', fit: 'shrink' });
      text(s, d[i][2], { x: x + 0.25, y: y + 1.0, w: 3.4, h: 0.92, fontSize: 12.5, color: C.sub, fit: 'shrink' });
    }
    footer(s);
    s.addNotes('Six droits. Point d’attention : la protection fonctionnelle (menaces, violences, injures, diffamations, outrages) et la conciliation mandat / activité professionnelle (crédits d’heures, autorisations d’absence).');
  }

  {
    const s = base();
    header(s, '04', 'Droits et devoirs', 'Les devoirs des élus');
    text(s, 'En contrepartie, les élus sont soumis à des obligations essentielles :', { x: M, y: 1.85, w: 12, h: 0.45, fontSize: 16, color: C.sub });
    const d = [
      ['PiScales', 'Agir dans l’intérêt général, sans privilégier des intérêts personnels ou particuliers.'],
      ['PiHandshake', 'Respecter les principes de probité, d’intégrité et d’impartialité.'],
      ['PiLockKey', 'Respecter le secret professionnel et la confidentialité des informations dont ils ont connaissance dans l’exercice de leur mandat.'],
      ['PiProhibit', 'Prévenir les conflits d’intérêts et s’abstenir de participer aux décisions lorsqu’ils sont personnellement concernés.'],
      ['PiBank', 'Respecter les lois, le règlement intérieur et les institutions républicaines.'],
      ['PiUsersThree', 'Adopter un comportement respectueux envers les citoyens, les agents territoriaux et les autres élus.'],
    ];
    for (let i = 0; i < 6; i++) {
      const col = i % 2, row = Math.floor(i / 2);
      const x = M + col * 6.1, y = 2.4 + row * 0.92;
      await iconDisc(s, d[i][0], x, y + 0.08, 0.6, C.cream, C.navy);
      text(s, d[i][1], { x: x + 0.8, y, w: 5.15, h: 0.8, fontSize: 13.5, valign: 'middle' });
    }
    await retenir(s, M, 5.3, 12.1, 1.45, 'Le mandat d’élu municipal est un engagement au service de la République et des citoyens. Il confère des droits indispensables à son exercice, mais impose également des devoirs exigeants fondés sur l’éthique, la transparence et l’intérêt général.', { fs: 14 });
    footer(s);
    s.addNotes('Six devoirs, en miroir des droits. Faire le lien avec la séquence 06 (exemplarité et conflits d’intérêts).');
  }

  // Trois responsabilités
  const respSlide = async (kicker, title, artSvg, def, exTitle, ex, cons, extra, notes) => {
    const s = base();
    header(s, '04', 'Les responsabilités des élus locaux', title);
    disc(s, M, 1.95, 3.7, C.tint);
    await art(s, artSvg, M + 0.45, 2.45, 2.8);
    text(s, kicker, { x: M, y: 5.85, w: 3.7, h: 0.4, fontSize: 13, bold: true, color: C.sub, align: 'center', charSpacing: 2 });
    let y = 1.95;
    for (const p of def) {
      text(s, p.t, { x: 4.75, y, w: 7.95, h: p.h, fontSize: p.fs || 16, bold: p.b, color: p.b ? C.navy : C.sub });
      y += p.h + 0.08;
    }
    if (extra) { y = await extra(s, y); }
    text(s, exTitle, { x: 4.75, y, w: 4, h: 0.3, fontSize: 12, bold: true, charSpacing: 3, color: C.sub });
    y += 0.4;
    // exemples en pastilles
    let x = 4.75;
    for (const e of ex) {
      const w = Math.min(7.95, 0.5 + e.length * 0.085);
      if (x + w > 12.72) { x = 4.75; y += 0.5; }
      rrect(s, x, y, w, 0.44, C.cream, { r: 0.22 });
      text(s, e, { x: x + 0.1, y, w: w - 0.2, h: 0.44, fontSize: 12.5, bold: true, align: 'center', valign: 'middle' });
      x += w + 0.14;
    }
    y += 0.7;
    rrect(s, 4.75, 5.55, 7.95, 1.05, C.navy);
    s.addImage({ data: await icon('PiArrowRightBold', C.cream), x: 5.0, y: 5.55 + 0.33, w: 0.4, h: 0.4 });
    text(s, cons, { x: 5.6, y: 5.55, w: 6.9, h: 1.05, fontSize: 15, color: C.white, valign: 'middle', bold: true });
    footer(s);
    s.addNotes(notes);
  };
  await respSlide('RESPONSABILITÉ PÉNALE', 'La responsabilité pénale', I2.gavelArt(),
    [{ t: 'L’élu est personnellement responsable des infractions qu’il commet dans l’exercice de ses fonctions ou à titre personnel.', h: 0.85, fs: 18, b: true }],
    'EXEMPLES', ['Prise illégale d’intérêts.', 'Favoritisme dans un marché public.', 'Détournement de fonds publics.', 'Harcèlement moral ou sexuel.', 'Mise en danger d’autrui par négligence ou imprudence.'],
    'Sanctions possibles : amende, peine d’emprisonnement, inéligibilité, interdiction d’exercer certaines fonctions.', null,
    'Responsabilité pénale : personnelle. Commenter les cinq exemples ; la prise illégale d’intérêts sera reprise en séquence 06.');
  await respSlide('RESPONSABILITÉ CIVILE', 'La responsabilité civile', I2.reparationArt(),
    [{ t: 'Elle vise à réparer un préjudice causé à un tiers.', h: 0.45, fs: 18, b: true },
     { t: 'Dans la plupart des situations, c’est la commune qui répond des fautes de service. En revanche, l’élu peut être tenu personnellement responsable lorsqu’il commet une faute personnelle détachable de l’exercice de ses fonctions.', h: 1.0, fs: 14 }],
    'EXEMPLES', ['Violence ou injure commise par un élu.', 'Faute grave sans lien avec le fonctionnement normal du service.', 'Comportement manifestement incompatible avec les fonctions exercées.'],
    'Conséquence : indemnisation de la victime.', null,
    'Responsabilité civile : distinguer la faute de service (la commune répond) et la faute personnelle détachable des fonctions (l’élu répond personnellement).');
  await respSlide('RESPONSABILITÉ POLITIQUE', 'La responsabilité politique', I2.urneArt(),
    [{ t: 'Les élus rendent compte de leur action devant :', h: 0.45, fs: 18, b: true }],
    'EXEMPLES', ['Perte de confiance de la majorité.', 'Critiques sur la gestion municipale.', 'Sanction par les électeurs lors du renouvellement du conseil municipal.'],
    'Conséquence : perte de responsabilités, retrait de délégations ou non-réélection.',
    async (s, y) => {
      const a = [['PiUsers', 'Les citoyens.'], ['PiBank', 'Le conseil municipal.'], ['PiCheckSquareOffset', 'Les électeurs lors des élections.']];
      for (let i = 0; i < 3; i++) {
        const x = 4.75 + i * 2.7;
        rrect(s, x, y, 2.55, 0.8, C.tint);
        await iconDisc(s, a[i][0], x + 0.12, y + 0.14, 0.52, C.navy, C.cream);
        text(s, a[i][1], { x: x + 0.75, y, w: 1.75, h: 0.8, fontSize: 13, bold: true, valign: 'middle' });
      }
      return y + 1.05;
    },
    'Responsabilité politique : on rend compte devant les citoyens, le conseil municipal et les électeurs. Conséquences : retrait de délégations, perte de responsabilités, non-réélection.');

  {
    const s = base(true);
    header(s, '04', 'Les responsabilités des élus locaux', 'À retenir', { dark: true });
    const tri = [['PiGavel', 'Pénale', 'Infractions'], ['PiShieldCheck', 'Civile', 'Réparation'], ['PiCheckSquareOffset', 'Politique', 'Rendre compte']];
    for (let i = 0; i < 3; i++) {
      const x = M + i * 4.1;
      rrect(s, x, 2.0, 3.85, 1.35, C.surf2);
      await iconDisc(s, tri[i][0], x + 0.3, 2.3, 0.75, C.cream, C.navy);
      text(s, tri[i][1], { x: x + 1.25, y: 2.28, w: 2.4, h: 0.45, fontSize: 20, bold: true, color: C.white });
      text(s, tri[i][2], { x: x + 1.25, y: 2.72, w: 2.4, h: 0.35, fontSize: 13, color: C.cream });
    }
    text(s, 'Être élu, c’est exercer des responsabilités importantes.', { x: M, y: 3.75, w: 12, h: 0.6, fontSize: 26, bold: true, color: C.cream });
    text(s, 'Chaque décision doit être prise dans le respect de la loi, de l’intérêt général et des principes de transparence, de prudence et d’éthique. Une bonne connaissance des règles juridiques est la meilleure protection de l’élu comme de la collectivité.', { x: M, y: 4.45, w: 11.5, h: 1.4, fontSize: 18, color: C.white, lineSpacingMultiple: 1.1 });
    footer(s, true);
    s.addNotes('Synthèse de la séquence 04 : trois responsabilités, un réflexe — connaître les règles pour se protéger et protéger la collectivité.');
  }

  // =========================== SÉQUENCE 05 — PAYSAGE INSTITUTIONNEL ===========================
  const hdf = I2.hdfTiles();
  await divider('05', 'SÉQUENCE 05', 'La commune dans son environnement institutionnel', 'Intercommunalité (EPCI), Département, Région Hauts-de-France, État.', '14h45 – 16h15  ·  90 min', I2.epciArt(), 'Séquence 05 (90 min). Objectif : situer la commune parmi les autres échelons et connaître les compétences de l’EPCI, du Département, de la Région et de l’État.', { panel: C.navy, box: 4.2 });

  {
    const s = base();
    header(s, '05', 'Le paysage institutionnel', 'Qui fait quoi ? La commune au centre de cercles de coopération');
    const lv = [
      ['L’État', 'fixe les règles, garantit l’égalité devant la loi, contrôle la légalité', C.navy, C.cream],
      ['La Région', 'économie, mobilités, formation, lycées', C.surf2, C.cream],
      ['Le Département', 'solidarités, collèges, routes départementales', '3A3563', C.cream],
      ['L’intercommunalité (EPCI)', 'compétences mutualisées entre communes', C.tint2, C.navy],
      ['La commune', 'l’échelon de proximité', C.cream, C.navy],
    ];
    const cx = 3.9, cy = 4.35;
    lv.forEach(([t, d, bg, fg], i) => {
      const rw = 6.6 - i * 1.2, rh = 4.6 - i * 0.82;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: cx - rw / 2, y: cy - rh / 2 + i * 0.12, w: rw, h: rh, rectRadius: 0.5, fill: { color: bg }, line: { color: C.white, width: 2 } });
      text(s, t, { x: cx - rw / 2 + 0.2, y: cy - rh / 2 + i * 0.12 + 0.06, w: rw - 0.4, h: 0.36, fontSize: i === 4 ? 16 : 12.5, bold: true, color: fg, align: 'center', valign: 'middle' });
    });
    s.addImage({ data: await icon('PiHouseLineFill', C.navy), x: cx - 0.3, y: cy + 0.55, w: 0.6, h: 0.6 });
    lv.forEach(([t, d], i) => {
      const y = 2.0 + i * 0.93;
      disc(s, 7.6, y + 0.1, 0.5, lv[i][2], { line: C.navy, lw: 1 });
      text(s, t, { x: 8.3, y, w: 4.4, h: 0.38, fontSize: 15, bold: true });
      text(s, d, { x: 8.3, y: y + 0.37, w: 4.4, h: 0.38, fontSize: 12.5, color: C.sub });
    });
    footer(s);
    s.addNotes('Diapositive de repérage : la commune au cœur de cercles de coopération. Les synthèses reprennent les messages « À retenir » de chaque échelon (détaillés dans les diapositives suivantes).');
  }

  {
    const s = base();
    header(s, '05', 'Les compétences de l’intercommunalité (EPCI)', 'Mutualiser les moyens pour agir plus efficacement');
    text(s, 'Qu’est-ce qu’un EPCI ?', { x: M, y: 1.95, w: 6.5, h: 0.45, fontSize: 20, bold: true });
    text(s, 'Un Établissement Public de Coopération Intercommunale (EPCI) regroupe plusieurs communes afin d’exercer ensemble certaines compétences qui dépassent l’échelle d’une seule commune.', { x: M, y: 2.45, w: 6.6, h: 1.3, fontSize: 16, color: C.sub, lineSpacingMultiple: 1.1 });
    text(s, 'OBJECTIFS', { x: M, y: 3.95, w: 4, h: 0.3, fontSize: 12, bold: true, charSpacing: 3, color: C.sub });
    const o = [['PiCoins', 'Mutualiser les moyens humains et financiers.'], ['PiRocketLaunch', 'Réaliser des projets d’envergure.'], ['PiSealCheck', 'Améliorer la qualité des services publics.'], ['PiMagnet', 'Renforcer l’attractivité du territoire.']];
    for (let i = 0; i < 4; i++) {
      const col = i % 2, row = Math.floor(i / 2);
      const x = M + col * 3.35, y = 4.35 + row * 1.12;
      rrect(s, x, y, 3.2, 0.98, C.tint);
      await iconDisc(s, o[i][0], x + 0.15, y + 0.2, 0.58, C.navy, C.cream);
      text(s, o[i][1], { x: x + 0.88, y, w: 2.2, h: 0.98, fontSize: 13, bold: true, valign: 'middle' });
    }
    rrect(s, 7.65, 1.95, 5.08, 4.7, C.navy, { r: 0.2 });
    await art(s, I2.epciArt(), 7.85, 2.05, 4.68);
    text(s, 'Chaque commune garde son identité ; ensemble, elles portent des projets à l’échelle du territoire.', { x: 7.95, y: 6.05, w: 4.5, h: 0.5, fontSize: 11.5, italic: true, color: C.cream, align: 'center' });
    footer(s);
    s.addNotes('Définition de l’EPCI et ses quatre objectifs. Demander aux participants le nom de leur intercommunalité (communauté de communes, d’agglomération…).');
  }

  const compGrid = async (s, list, y0, cols, cw, ch, fs = 12.5) => {
    for (let i = 0; i < list.length; i++) {
      const col = i % cols, row = Math.floor(i / cols);
      const x = M + col * (cw + 0.2), y = y0 + row * (ch + 0.2);
      rrect(s, x, y, cw, ch, row % 2 === col % 2 ? C.tint : 'FFFDEB');
      await iconDisc(s, list[i][0], x + 0.22, y + 0.2, 0.58, C.navy, C.cream);
      text(s, list[i][1], { x: x + 0.95, y: y + 0.2, w: cw - 1.1, h: 0.58, fontSize: 14.5, bold: true, valign: 'middle', fit: 'shrink' });
      text(s, bullets(list[i][2], { gap: 3 }), { x: x + 0.25, y: y + 0.92, w: cw - 0.45, h: ch - 1.02, fontSize: fs, color: C.sub, fit: 'shrink' });
    }
  };

  {
    const s = base();
    header(s, '05', 'Les compétences de l’intercommunalité (EPCI)', 'Les principales compétences');
    const L = [
      ['PiTrendUp', 'Développement économique', ['Zones d’activités économiques', 'Soutien aux entreprises', 'Attractivité du territoire']],
      ['PiMapTrifold', 'Aménagement de l’espace', ['Plan Local d’Urbanisme Intercommunal (PLUi)', 'Schéma de cohérence territoriale (SCoT)', 'Grands projets d’aménagement']],
      ['PiTrash', 'Gestion des services publics', ['Collecte et traitement des déchets', 'Eau potable et assainissement (selon les compétences exercées)', 'Gestion des milieux aquatiques et prévention des inondations (GEMAPI)']],
      ['PiBus', 'Mobilité et transports', ['Organisation des mobilités', 'Mobilité douce (pistes cyclables, covoiturage)', 'Transports collectifs lorsque la compétence est exercée']],
      ['PiLeaf', 'Habitat et environnement', ['Politique locale de l’habitat', 'Transition énergétique', 'Protection de l’environnement', 'Préservation de la biodiversité']],
    ];
    await compGrid(s, L.slice(0, 3), 1.95, 3, 3.9, 2.3);
    // deuxième rangée centrée : 2 cartes plus larges
    for (let i = 0; i < 2; i++) {
      const x = M + i * 6.1, y = 4.45, cw = 5.9, ch = 2.2;
      rrect(s, x, y, cw, ch, i ? C.tint : 'FFFDEB');
      await iconDisc(s, L[3 + i][0], x + 0.22, y + 0.2, 0.58, C.navy, C.cream);
      text(s, L[3 + i][1], { x: x + 0.95, y: y + 0.2, w: cw - 1.1, h: 0.58, fontSize: 14.5, bold: true, valign: 'middle' });
      text(s, bullets(L[3 + i][2], { gap: 3 }), { x: x + 0.25, y: y + 0.9, w: cw - 0.45, h: ch - 1.0, fontSize: 12.5, color: C.sub, fit: 'shrink' });
    }
    footer(s);
    s.addNotes('Cinq blocs de compétences intercommunales. Préciser que la répartition exacte dépend des statuts de chaque EPCI (compétences obligatoires, optionnelles, facultatives).');
  }

  {
    const s = base();
    header(s, '05', 'Les compétences de l’intercommunalité (EPCI)', 'Le rôle des élus municipaux au sein de l’EPCI');
    const r = [
      ['PiUserFocus', 'Représenter leur commune au conseil communautaire.'],
      ['PiCheckSquareOffset', 'Participer aux décisions qui concernent l’ensemble du territoire.'],
      ['PiScales', 'Défendre les intérêts communaux tout en recherchant l’intérêt communautaire.'],
      ['PiArrowsLeftRight', 'Assurer le lien entre les décisions intercommunales et le conseil municipal.'],
    ];
    for (let i = 0; i < 4; i++) {
      const x = M + i * 3.07;
      rrect(s, x, 1.95, 2.85, 2.75, C.tint);
      text(s, String(i + 1).padStart(2, '0'), { x: x + 0.25, y: 2.1, w: 1, h: 0.6, fontSize: 30, fontFace: NUM, color: C.tint2 });
      await iconDisc(s, r[i][0], x + 1.95, 2.15, 0.65, C.navy, C.cream);
      text(s, r[i][1], { x: x + 0.25, y: 2.95, w: 2.4, h: 1.6, fontSize: 15, bold: true });
    }
    await retenir(s, M, 5.0, 12.1, 1.7, 'L’intercommunalité ne remplace pas la commune : elle agit à ses côtés. La commune reste l’échelon de proximité, tandis que l’EPCI prend en charge les compétences qui gagnent à être exercées à une échelle plus large, au bénéfice de l’ensemble du territoire.', { fs: 14.5 });
    footer(s);
    s.addNotes('Le rôle des conseillers communautaires : représenter, décider, arbitrer entre intérêt communal et communautaire, faire le lien avec le conseil municipal.');
  }

  {
    const s = base();
    header(s, '05', 'Les compétences du Département', 'La collectivité des solidarités et de la proximité');
    text(s, 'Le Département intervient principalement dans les domaines de la solidarité et des infrastructures.', { x: M, y: 1.8, w: 12, h: 0.4, fontSize: 16, color: C.sub, italic: true });
    const L = [
      ['PiHandHeart', 'Action sociale et solidarité', ['Protection de l’enfance (Aide Sociale à l’Enfance – ASE)', 'Protection maternelle et infantile (PMI)', 'Accompagnement des personnes âgées (APA)', 'Accompagnement des personnes en situation de handicap (PCH, MDPH)', 'Revenu de Solidarité Active (RSA) et insertion']],
      ['PiStudent', 'Éducation', ['Construction, entretien et fonctionnement des collèges.', 'Gestion des agents techniques des collèges.']],
      ['PiRoadHorizon', 'Voirie départementale', ['Construction, entretien et sécurisation des routes départementales.', 'Gestion des ouvrages d’art (ponts, tunnels...).']],
      ['PiFireTruck', 'Sécurité civile', ['Financement et gouvernance des Services départementaux d’incendie et de secours (SDIS), aux côtés des communes et des EPCI.']],
      ['PiTree', 'Aménagement et attractivité du territoire', ['Soutien aux communes et aux intercommunalités.', 'Développement des territoires ruraux.', 'Préservation des espaces naturels sensibles.', 'Développement touristique et culturel.']],
    ];
    // grande carte « solidarités » à gauche
    rrect(s, M, 2.35, 4.6, 4.35, C.navy);
    await iconDisc(s, L[0][0], M + 0.3, 2.6, 0.7, C.cream, C.navy);
    text(s, L[0][1], { x: M + 1.2, y: 2.6, w: 3.2, h: 0.7, fontSize: 17, bold: true, color: C.cream, valign: 'middle' });
    text(s, bullets(L[0][2], { gap: 7 }), { x: M + 0.3, y: 3.5, w: 4.05, h: 3.1, fontSize: 13.5, color: C.white });
    for (let i = 1; i < 5; i++) {
      const col = (i - 1) % 2, row = Math.floor((i - 1) / 2);
      const x = 5.4 + col * 3.7, y = 2.35 + row * 2.25, cw = 3.52, ch = 2.1;
      rrect(s, x, y, cw, ch, col === row ? C.tint : 'FFFDEB');
      await iconDisc(s, L[i][0], x + 0.2, y + 0.18, 0.55, C.navy, C.cream);
      text(s, L[i][1], { x: x + 0.88, y: y + 0.18, w: cw - 1.0, h: 0.55, fontSize: 13.5, bold: true, valign: 'middle', fit: 'shrink' });
      text(s, bullets(L[i][2], { gap: 2 }), { x: x + 0.22, y: y + 0.85, w: cw - 0.4, h: ch - 0.95, fontSize: 11.5, color: C.sub, fit: 'shrink' });
    }
    footer(s);
    s.addNotes('Les compétences du Département : priorité aux solidarités humaines (ASE, PMI, APA, PCH/MDPH, RSA), puis collèges, routes départementales, SDIS et soutien aux territoires.');
  }

  {
    const s = base();
    header(s, '05', 'Les compétences du Département', 'Le rôle des conseillers départementaux');
    const r = [['PiMapPin', 'Représenter leur canton.'], ['PiCoins', 'Voter le budget départemental.'], ['PiHandHeart', 'Définir les politiques sociales et territoriales.'], ['PiHandshake', 'Accompagner les projets des communes et des intercommunalités.']];
    for (let i = 0; i < 4; i++) {
      const x = M + i * 3.07;
      rrect(s, x, 1.95, 2.85, 2.55, C.tint);
      await iconDisc(s, r[i][0], x + 0.25, 2.2, 0.75, C.navy, C.cream);
      text(s, r[i][1], { x: x + 0.25, y: 3.15, w: 2.4, h: 1.2, fontSize: 15.5, bold: true });
    }
    await retenir(s, M, 4.8, 12.1, 1.9, 'Le Département est la collectivité des solidarités humaines et territoriales. Il accompagne les habitants tout au long de leur vie et soutient les communes dans leurs projets structurants, notamment en matière d’action sociale, d’éducation, d’infrastructures et d’aménagement du territoire.', { fs: 15 });
    footer(s);
    s.addNotes('Rôle des conseillers départementaux et message à retenir : le Département, collectivité des solidarités humaines et territoriales. Citer un projet communal soutenu par le Département.');
  }

  {
    const s = base();
    header(s, '05', 'Les compétences de la Région Hauts-de-France', 'La collectivité du développement économique, de la mobilité et de la formation', { ts: 26 });
    text(s, 'La Région prépare l’avenir du territoire : elle intervient sur les grands enjeux de développement, d’attractivité et d’aménagement régional.', { x: M, y: 1.8, w: 12, h: 0.4, fontSize: 15, color: C.sub, italic: true });
    const L = [
      ['PiBriefcase', 'Développement économique', ['Soutien aux entreprises, à l’innovation et à l’artisanat.', 'Aides à la création et à la reprise d’entreprises.', 'Attractivité et compétitivité du territoire.']],
      ['PiGraduationCap', 'Formation, apprentissage et emploi', ['Formation professionnelle des demandeurs d’emploi.', 'Développement de l’apprentissage.', 'Orientation et insertion professionnelle.']],
      ['PiTrain', 'Transports et mobilités', ['Organisation des transports régionaux (TER).', 'Transports scolaires (selon les départements et les conventions).', 'Développement des mobilités durables.']],
      ['PiBuildings', 'Les lycées', ['Construction, rénovation, entretien et équipement des lycées publics.', 'Gestion des agents techniques régionaux.']],
      ['PiPlant', 'Aménagement du territoire et transition écologique', ['Schéma régional d’aménagement (SRADDET).', 'Soutien aux projets des territoires.', 'Transition énergétique et développement durable.']],
      ['PiGlobeHemisphereWest', 'Europe, culture, tourisme et agriculture', ['Gestion de nombreux fonds européens (FEDER, FSE+...).', 'Soutien au patrimoine, à la culture et aux grands événements.', 'Développement touristique.', 'Accompagnement des filières agricoles et agroalimentaires.']],
    ];
    await compGrid(s, L, 2.35, 3, 3.9, 2.1, 11.5);
    footer(s);
    s.addNotes('Six blocs de compétences régionales. Faire le lien avec ENMA Formation : la Région est aussi l’acteur de la formation professionnelle et de l’apprentissage en Hauts-de-France.');
  }

  {
    const s = base();
    header(s, '05', 'Les compétences de la Région Hauts-de-France', 'Le rôle des conseillers régionaux');
    const r = [['PiCompass', 'Définir les politiques régionales.'], ['PiCoins', 'Voter le budget de la Région.'], ['PiRocketLaunch', 'Accompagner les grands projets structurants.'], ['PiHandshake', 'Soutenir les communes, les intercommunalités et les acteurs économiques.']];
    for (let i = 0; i < 4; i++) {
      const y = 1.95 + i * 0.6;
      await iconDisc(s, r[i][0], M, y + 0.03, 0.48, C.navy, C.cream);
      text(s, r[i][1], { x: M + 0.7, y, w: 6.5, h: 0.54, fontSize: 15.5, bold: true, valign: 'middle' });
    }
    await retenir(s, M, 4.45, 7.4, 2.25, 'La Région Hauts-de-France agit à une échelle stratégique. Elle prépare l’avenir du territoire en investissant dans l’économie, les transports, les lycées, la formation, la transition écologique et l’attractivité régionale. Ses politiques complètent l’action des communes, des intercommunalités et des départements au service des habitants.', { fs: 14 });
    // carte en tuiles des 5 départements
    rrect(s, 8.3, 1.95, 4.43, 4.75, C.tint, { r: 0.2 });
    const a = await art(s, hdf.svg, 8.45, 2.05, 4.1);
    for (const t of hdf.tiles) {
      const x = a.x + t.cx * a.sx, y = a.y + t.cy * a.sy;
      text(s, t.n, { x: x - 0.7, y: y - 0.2, w: 1.4, h: 0.4, fontSize: 11.5, bold: true, color: t.hi ? C.navy : C.cream, align: 'center', valign: 'middle' });
    }
    text(s, 'Hauts-de-France : 5 départements', { x: 8.45, y: 6.2, w: 4.1, h: 0.35, fontSize: 11.5, italic: true, color: C.sub, align: 'center' });
    footer(s);
    s.addNotes('Rôle des conseillers régionaux. La carte schématique (non géographique) rappelle les cinq départements de la région : Nord, Pas-de-Calais, Somme, Oise, Aisne.');
  }

  {
    const s = base();
    header(s, '05', 'Les compétences de l’État', 'Le rôle du Préfet et l’organisation territoriale de l’État');
    rrect(s, M, 1.95, 12.1, 1.55, C.cream);
    text(s, 'L’État fixe les grandes politiques publiques et garantit l’application des lois sur l’ensemble du territoire.', { x: M + 0.35, y: 2.05, w: 11.4, h: 0.5, fontSize: 17, bold: true });
    text(s, 'Depuis les lois de décentralisation, de nombreuses compétences ont été transférées aux collectivités territoriales (communes, départements, régions). En parallèle, l’État reste présent dans les territoires grâce à ses représentants : les préfets.', { x: M + 0.35, y: 2.55, w: 11.4, h: 0.85, fontSize: 14 });
    text(s, 'LES PRINCIPALES COMPÉTENCES DE L’ÉTAT', { x: M, y: 3.75, w: 8, h: 0.3, fontSize: 12, bold: true, charSpacing: 3, color: C.sub });
    const L = [['PiScales', 'Justice, sécurité et ordre public.'], ['PiGraduationCap', 'Éducation nationale et enseignement supérieur.'], ['PiPoliceCar', 'Police nationale, gendarmerie et sécurité civile.'], ['PiCurrencyEur', 'Fiscalité nationale et finances publiques.'], ['PiGlobeHemisphereWest', 'Politique étrangère, défense nationale et immigration.'], ['PiFirstAidKit', 'Santé publique (avec les Agences Régionales de Santé).']];
    for (let i = 0; i < 6; i++) {
      const col = i % 3, row = Math.floor(i / 3);
      const x = M + col * 4.1, y = 4.2 + row * 1.25;
      rrect(s, x, y, 3.85, 1.1, C.tint);
      await iconDisc(s, L[i][0], x + 0.2, y + 0.22, 0.66, C.navy, C.cream);
      text(s, L[i][1], { x: x + 1.05, y, w: 2.65, h: 1.1, fontSize: 13.5, bold: true, valign: 'middle' });
    }
    footer(s);
    s.addNotes('L’État : compétences régaliennes et grandes politiques publiques. Transition vers le rôle du préfet.');
  }

  {
    const s = base();
    header(s, '05', 'Les compétences de l’État', 'Le Préfet : représentant de l’État');
    const cols = [
      ['AU NIVEAU DÉPARTEMENTAL', 'Le Préfet de département', ['Représente le Gouvernement.', 'Coordonne les services de l’État.', 'Veille au maintien de l’ordre public.', 'Contrôle la légalité des actes des collectivités territoriales.', 'Coordonne la gestion des crises (catastrophes, sécurité civile…).'], C.tint, C.navy],
      ['AU NIVEAU RÉGIONAL', 'Le Préfet de région', ['Coordonne les politiques publiques de l’État à l’échelle régionale.', 'Met en œuvre les grandes orientations gouvernementales.', 'Pilote les politiques de développement économique, d’aménagement du territoire et de transition écologique.'], C.navy, C.white],
    ];
    for (let i = 0; i < 2; i++) {
      const [k, t, b, bg, fg] = cols[i];
      const x = M + i * 6.1;
      rrect(s, x, 1.95, 5.9, 4.75, bg);
      await iconDisc(s, i ? 'PiMapTrifold' : 'PiBank', x + 0.35, 2.25, 0.8, i ? C.cream : C.navy, i ? C.navy : C.cream);
      text(s, k, { x: x + 1.35, y: 2.25, w: 4.3, h: 0.3, fontSize: 11, bold: true, charSpacing: 3, color: i ? C.cream : C.sub });
      text(s, t, { x: x + 1.35, y: 2.55, w: 4.3, h: 0.5, fontSize: 20, bold: true, color: i ? C.white : C.navy });
      text(s, bullets(b, { gap: 10 }), { x: x + 0.4, y: 3.35, w: 5.1, h: 3.2, fontSize: 15, color: fg });
    }
    footer(s);
    s.addNotes('Préfet de département (contrôle de légalité, ordre public, gestion de crise) et préfet de région (coordination régionale). Pour la commune, l’interlocuteur de proximité est souvent la sous-préfecture.');
  }

  {
    const s = base();
    header(s, '05', 'Les compétences de l’État', 'Décentralisation et déconcentration : deux notions à distinguer', { ts: 26 });
    const col = async (x, title, iconN, def, target, targetSub, arrowLab, dark) => {
      rrect(s, x, 1.95, 5.9, 4.8, dark ? C.navy : C.tint);
      text(s, title, { x: x + 0.35, y: 2.15, w: 5.2, h: 0.5, fontSize: 22, bold: true, color: dark ? C.cream : C.navy });
      // État -> cible
      rrect(s, x + 0.35, 2.85, 1.6, 0.8, dark ? C.cream : C.navy);
      text(s, 'État', { x: x + 0.35, y: 2.85, w: 1.6, h: 0.8, fontSize: 16, bold: true, align: 'center', valign: 'middle', color: dark ? C.navy : C.cream });
      s.addShape(pres.shapes.RIGHT_ARROW, { x: x + 2.05, y: 3.0, w: 1.45, h: 0.5, fill: { color: C.alert }, line: { type: 'none' } });
      text(s, arrowLab, { x: x + 1.95, y: 3.55, w: 1.65, h: 0.45, fontSize: 10, bold: true, color: dark ? C.cream : C.sub, align: 'center' });
      rrect(s, x + 3.6, 2.85, 2.0, 0.8, C.white, { line: dark ? C.cream : C.navy, lw: 1.25 });
      text(s, target, { x: x + 3.65, y: 2.85, w: 1.9, h: 0.8, fontSize: 12, bold: true, align: 'center', valign: 'middle', fit: 'shrink' });
      text(s, targetSub, { x: x + 3.55, y: 3.7, w: 2.1, h: 0.4, fontSize: 10, italic: true, color: dark ? C.muted : C.sub, align: 'center' });
      text(s, def, { x: x + 0.35, y: 4.35, w: 5.2, h: 2.2, fontSize: 15, color: dark ? C.white : C.navy, lineSpacingMultiple: 1.08 });
    };
    await col(M, 'Décentralisation', 'PiArrowsSplit', [
      { text: 'La décentralisation ', options: { bold: true } },
      { text: 'consiste à transférer des compétences de l’État vers des collectivités territoriales autonomes (communes, départements, régions), dirigées par des élus.' },
    ], 'Collectivités territoriales', 'dirigées par des élus', 'transfert de compétences', false);
    await col(M + 6.2, 'Déconcentration', 'PiBank', [
      { text: 'La déconcentration ', options: { bold: true } },
      { text: 'consiste à confier l’exercice des compétences de l’État à ses représentants dans les territoires (préfets, sous-préfets, services déconcentrés), tout en conservant le pouvoir de décision au niveau de l’État.' },
    ], 'Préfets, sous-préfets, services', 'la décision reste à l’État', 'délégation de l’action', true);
    footer(s);
    s.addNotes('Deux notions souvent confondues. Moyen mnémotechnique : décentralisation = on transfère à des élus ; déconcentration = l’État délègue à ses propres représentants.');
  }

  {
    const s = base(true);
    header(s, '05', 'Les compétences de l’État', 'À retenir', { dark: true });
    text(s, 'L’État demeure garant de l’unité de la République et de l’application des lois. Les collectivités territoriales exercent des compétences propres grâce à la décentralisation, tandis que les préfets assurent, au nom de l’État, la coordination des politiques publiques et le contrôle de la légalité des actes des collectivités.', { x: M, y: 1.95, w: 12.1, h: 1.7, fontSize: 18, color: C.white, lineSpacingMultiple: 1.1 });
    const eq = [
      ['Décentralisation', 'transfert de compétences vers des élus locaux.'],
      ['Déconcentration', 'délégation de l’action de l’État à ses représentants (préfets).'],
      ['État', 'fixe les règles, garantit l’égalité devant la loi et contrôle la légalité des décisions locales.'],
    ];
    for (let i = 0; i < 3; i++) {
      const y = 3.95 + i * 0.95;
      rrect(s, M, y, 3.3, 0.78, C.cream);
      text(s, eq[i][0], { x: M, y, w: 3.3, h: 0.78, fontSize: 18, bold: true, align: 'center', valign: 'middle' });
      text(s, '=', { x: M + 3.4, y, w: 0.6, h: 0.78, fontSize: 30, bold: true, color: C.cream, align: 'center', valign: 'middle' });
      rrect(s, M + 4.1, y, 8.0, 0.78, C.surf2);
      text(s, eq[i][1], { x: M + 4.35, y, w: 7.6, h: 0.78, fontSize: 15.5, color: C.white, valign: 'middle' });
    }
    footer(s, true);
    s.addNotes('Synthèse de la séquence 05 sous forme d’« équations ». Vérifier la compréhension en demandant à un participant de donner un exemple de chaque notion.');
  }

  // =========================== SÉQUENCE 06 — HABITANTS & EXEMPLARITÉ ===========================
  await divider('06', 'SÉQUENCE 06', 'Les relations avec les habitants, l’exemplarité et la prévention des conflits d’intérêts', 'Être à l’écoute, au service des citoyens… et irréprochable.', '16h30 – 17h15  ·  45 min', I2.dialogueArt(), 'Séquence 06 (45 min). Objectif : adopter les bonnes pratiques de la relation aux habitants et les bons réflexes face à un conflit d’intérêts.', { box: 3.9 });

  {
    const s = base();
    header(s, '06', 'Les relations entre les élus et les habitants', 'Être élu, c’est avant tout être à l’écoute et au service des citoyens', { ts: 26 });
    rrect(s, M, 1.95, 4.9, 4.75, C.tint);
    await art(s, I2.dialogueArt(), M + 0.35, 2.15, 4.2);
    text(s, 'Un lien de proximité au quotidien', { x: M + 0.35, y: 5.2, w: 4.3, h: 0.4, fontSize: 15, bold: true });
    text(s, 'L’élu municipal est le premier interlocuteur des habitants. Il représente la commune, écoute les attentes, explique les décisions et favorise le dialogue.', { x: M + 0.35, y: 5.6, w: 4.3, h: 1.0, fontSize: 12.5, color: C.sub });
    text(s, 'LES BONNES PRATIQUES', { x: 5.85, y: 1.95, w: 5, h: 0.3, fontSize: 12, bold: true, charSpacing: 3, color: C.sub });
    const bp = [
      ['PiEar', 'Être disponible et à l’écoute des préoccupations des habitants.'],
      ['PiChatText', 'Communiquer avec transparence et pédagogie, même lorsque les décisions sont difficiles.'],
      ['PiScales', 'Traiter chaque administré avec impartialité, équité et respect.'],
      ['PiMegaphone', 'Informer régulièrement sur les projets, les réalisations et les décisions municipales.'],
      ['PiHandshake', 'Favoriser la participation citoyenne et le dialogue avec les associations, les commerçants et les acteurs locaux.'],
    ];
    for (let i = 0; i < 5; i++) {
      const y = 2.35 + i * 0.88;
      await iconDisc(s, bp[i][0], 5.85, y + 0.08, 0.58, C.navy, C.cream);
      text(s, bp[i][1], { x: 6.65, y, w: 6.05, h: 0.76, fontSize: 14.5, valign: 'middle' });
    }
    footer(s);
    s.addNotes('Le lien de proximité et cinq bonnes pratiques. Mise en situation rapide : un habitant interpelle un élu au marché sur un projet contesté — comment répondre avec transparence et pédagogie ?');
  }

  {
    const s = base();
    header(s, '06', 'Les relations entre les élus et les habitants', 'Les points de vigilance');
    const v = [
      ['PiHandPalm', 'Ne pas promettre ce qui ne pourra pas être réalisé.'],
      ['PiEyeSlash', 'Respecter la confidentialité des situations individuelles.'],
      ['PiArrowsSplit', 'Distinguer les intérêts particuliers de l’intérêt général.'],
      ['PiSmiley', 'Garder une attitude respectueuse, y compris en cas de désaccord ou de tension.'],
    ];
    for (let i = 0; i < 4; i++) {
      const x = M + i * 3.07;
      rrect(s, x, 1.95, 2.85, 2.75, C.white, { line: C.tint2, lw: 1.5 });
      disc(s, x + 0.25, 2.2, 0.8, 'FDE6DF');
      s.addImage({ data: await icon(v[i][0], C.alert), x: x + 0.43, y: 2.38, w: 0.44, h: 0.44 });
      text(s, v[i][1], { x: x + 0.25, y: 3.2, w: 2.4, h: 1.4, fontSize: 15, bold: true });
    }
    await retenir(s, M, 5.0, 12.1, 1.7, 'La confiance des habitants se construit par l’écoute, la disponibilité, la transparence et la cohérence entre les engagements pris et les actions menées. Un élu de proximité est avant tout un élu accessible, exemplaire et au service de l’intérêt général.', { fs: 15 });
    footer(s);
    s.addNotes('Quatre points de vigilance. Insister sur le fait de ne pas promettre et sur la confidentialité des situations individuelles (demandes de logement, aides sociales, etc.).');
  }

  {
    const s = base();
    header(s, '06', 'L’exemplarité des élus et la prévention des conflits d’intérêts', 'Une exigence au service de la confiance des citoyens', { ts: 26 });
    text(s, 'L’élu est dépositaire de l’intérêt général', { x: M, y: 1.9, w: 6.5, h: 0.45, fontSize: 18, bold: true });
    text(s, 'L’exercice d’un mandat municipal implique un comportement exemplaire fondé sur :', { x: M, y: 2.35, w: 6.5, h: 0.4, fontSize: 14, color: C.sub });
    // fronton de mairie : 4 colonnes
    const a = await art(s, frontonArt(), M, 3.0, 6.3);
    const vals = ['L’intégrité et la probité.', 'L’impartialité et l’objectivité.', 'La transparence dans les décisions.', 'Le respect des lois et des principes républicains.'];
    for (let i = 0; i < 4; i++) {
      const cx = a.x + (70 + i * 132 + 34) * a.sx;
      rrect(s, cx - 0.62, a.y + a.h * 0.44, 1.24, 1.3, C.navy, { r: 0.08 });
      text(s, vals[i], { x: cx - 0.58, y: a.y + a.h * 0.44, w: 1.16, h: 1.3, fontSize: 11.5, bold: true, color: C.cream, align: 'center', valign: 'middle', fit: 'shrink' });
    }
    rrect(s, 7.4, 1.95, 5.33, 4.75, C.navy);
    await iconDisc(s, 'PiArrowsSplit', 7.7, 2.25, 0.8, C.cream, C.navy);
    text(s, 'Le conflit d’intérêts : de quoi s’agit-il ?', { x: 8.7, y: 2.25, w: 3.8, h: 0.8, fontSize: 17, bold: true, color: C.cream, valign: 'middle' });
    text(s, 'Il existe un conflit d’intérêts lorsqu’un élu détient un intérêt personnel, familial, professionnel ou financier susceptible d’influencer, ou de paraître influencer, l’exercice impartial de ses fonctions.', { x: 7.75, y: 3.3, w: 4.7, h: 2.2, fontSize: 16, color: C.white, lineSpacingMultiple: 1.1 });
    const types = ['personnel', 'familial', 'professionnel', 'financier'];
    types.forEach((t, i) => {
      const x = 7.75 + i * 1.2;
      rrect(s, x, 5.85, 1.1, 0.4, C.surf2, { r: 0.2 });
      text(s, t, { x, y: 5.85, w: 1.1, h: 0.4, fontSize: 10.5, bold: true, color: C.cream, align: 'center', valign: 'middle' });
    });
    footer(s);
    s.addNotes('Les quatre piliers de l’exemplarité, symbolisés par les colonnes de la mairie. Définition du conflit d’intérêts : un intérêt qui influence… ou qui PARAÎT influencer. L’apparence compte autant que la réalité.');
  }

  {
    const s = base();
    header(s, '06', 'L’exemplarité des élus et la prévention des conflits d’intérêts', 'Exemples et bons réflexes', { ts: 26 });
    text(s, 'EXEMPLES', { x: M, y: 1.95, w: 4, h: 0.3, fontSize: 12, bold: true, charSpacing: 3, color: C.sub });
    const ex = [
      ['PiBriefcase', 'Participer au vote d’une délibération concernant une entreprise dont l’élu ou un proche est dirigeant.'],
      ['PiMapPin', 'Prendre part à une décision relative à un terrain lui appartenant.'],
      ['PiUserPlus', 'Intervenir dans un recrutement concernant un membre de sa famille.'],
    ];
    for (let i = 0; i < 3; i++) {
      const y = 2.35 + i * 0.95;
      rrect(s, M, y, 6.0, 0.82, 'FDE6DF');
      s.addImage({ data: await icon(ex[i][0], C.alert), x: M + 0.2, y: y + 0.19, w: 0.44, h: 0.44 });
      text(s, ex[i][1], { x: M + 0.85, y, w: 5.0, h: 0.82, fontSize: 13.5, valign: 'middle' });
    }
    rrect(s, 6.95, 1.95, 5.78, 3.1, C.tint);
    await art(s, I2.deportArt(), 7.9, 2.1, 3.9);
    text(s, 'Se déporter : ne pas siéger au moment du débat et du vote.', { x: 7.2, y: 4.62, w: 5.3, h: 0.4, fontSize: 12, italic: true, color: C.sub, align: 'center' });
    text(s, 'LES BONS RÉFLEXES', { x: M, y: 5.3, w: 4, h: 0.3, fontSize: 12, bold: true, charSpacing: 3, color: C.sub });
    const r = [
      ['Déclarer', 'toute situation pouvant créer un conflit d’intérêts.'],
      ['Se déporter', 'ne pas participer aux débats, ni au vote lorsqu’un intérêt personnel est en jeu.'],
      ['Demander conseil', 'au secrétaire général de mairie, au centre de gestion ou au contrôle de légalité de la préfecture en cas de doute.'],
    ];
    for (let i = 0; i < 3; i++) {
      const x = M + i * 4.1, y = 5.65;
      rrect(s, x, y, 3.8, 1.15, C.navy);
      text(s, String(i + 1), { x: x + 0.15, y: y + 0.1, w: 0.5, h: 0.95, fontSize: 30, fontFace: NUM, color: C.cream, valign: 'middle' });
      text(s, [{ text: r[i][0] + ' : ', options: { bold: true, color: C.cream } }, { text: r[i][1], options: { color: C.white } }], { x: x + 0.7, y: y + 0.05, w: 3.0, h: 1.05, fontSize: 11.5, valign: 'middle', fit: 'shrink' });
      if (i < 2) s.addShape(pres.shapes.CHEVRON, { x: x + 3.84, y: y + 0.42, w: 0.2, h: 0.32, fill: { color: C.navy }, line: { type: 'none' } });
    }
    footer(s);
    s.addNotes('Trois exemples typiques et trois réflexes : déclarer, se déporter, demander conseil. Rappeler que le déport doit être effectif : ne pas participer ni au débat ni au vote (et quitter la salle est une bonne pratique).');
  }

  {
    const s = base();
    header(s, '06', 'L’exemplarité des élus et la prévention des conflits d’intérêts', 'Les risques encourus', { ts: 26 });
    const rk = [['PiXCircle', 'Annulation de la décision prise.'], ['PiWarning', 'Mise en cause de la responsabilité de l’élu.'], ['PiGavel', 'Sanctions pénales, notamment en cas de prise illégale d’intérêts.'], ['PiThumbsDown', 'Perte de la confiance des citoyens et atteinte à l’image de la collectivité.']];
    for (let i = 0; i < 4; i++) {
      const x = M + i * 3.07;
      rrect(s, x, 1.95, 2.85, 2.6, i === 2 ? C.navy : C.tint);
      disc(s, x + 0.25, 2.2, 0.8, i === 2 ? C.alert : 'FDE6DF');
      s.addImage({ data: await icon(rk[i][0], i === 2 ? C.white : C.alert), x: x + 0.43, y: 2.38, w: 0.44, h: 0.44 });
      text(s, rk[i][1], { x: x + 0.25, y: 3.15, w: 2.4, h: 1.3, fontSize: 15, bold: true, color: i === 2 ? C.white : C.navy });
    }
    await retenir(s, M, 4.85, 12.1, 1.85, 'L’exemplarité ne consiste pas seulement à respecter la loi, mais aussi à préserver la confiance des citoyens. En cas de doute sur un possible conflit d’intérêts, le bon réflexe est simple : s’abstenir de participer à la décision et solliciter un avis.', { fs: 16 });
    footer(s);
    s.addNotes('Quatre risques, du juridique (annulation, responsabilité, sanctions pénales) au politique (perte de confiance). Message final : dans le doute, s’abstenir et solliciter un avis.');
  }

  // =========================== 07 — CONCLUSION ===========================
  await divider('07', 'CONCLUSION', 'Être élu local : un engagement au service des habitants', 'Au terme de cette formation, une conviction demeure : le mandat d’élu municipal est certainement le plus beau des mandats.', '17h15 – 17h45  ·  30 min', I2.mairieArt(), 'Conclusion (30 min, incluant le bilan de la journée). Lire la conviction : le mandat municipal, le plus beau des mandats.', { panel: C.navy, box: 4.4 });

  {
    const s = base();
    header(s, '07', 'Conclusion', 'L’action municipale se voit, se vit et améliore le quotidien');
    text(s, 'C’est le mandat de la proximité, de l’écoute et de l’action concrète. Chaque jour, les élus sont au contact des habitants, de leurs attentes, de leurs difficultés, mais aussi de leurs réussites et de leurs espoirs.', { x: M, y: 1.9, w: 12.1, h: 0.9, fontSize: 16, color: C.sub, lineSpacingMultiple: 1.08 });
    const v = [['ecole', 'une école rénovée'], ['voirie', 'une voirie sécurisée'], ['asso', 'une association soutenue'], ['commerce', 'un commerce accompagné'], ['espace', 'un espace public réaménagé…']];
    for (let i = 0; i < 5; i++) {
      const x = M + i * 2.46;
      rrect(s, x, 2.95, 2.28, 2.35, i % 2 ? C.cream : C.tint);
      await art(s, I2.vignette(v[i][0]), x + 0.44, 3.05, 1.4);
      text(s, v[i][1], { x: x + 0.1, y: 4.6, w: 2.08, h: 0.55, fontSize: 13.5, bold: true, align: 'center', valign: 'middle' });
    }
    text(s, 'À l’échelle d’une commune, les décisions prises ont un impact direct et visible. Mais être élu, c’est aussi accepter des responsabilités importantes : décider dans l’intérêt général, parfois faire des choix difficiles, expliquer ses décisions et rester fidèle aux valeurs de la République.', { x: M, y: 5.5, w: 12.1, h: 1.2, fontSize: 15, lineSpacingMultiple: 1.08 });
    footer(s);
    s.addNotes('Relier les cinq vignettes aux réalisations concrètes des communes représentées. Demander à chacun : « Quelle réalisation aimeriez-vous voir aboutir d’ici la fin du mandat ? »');
  }

  {
    const s = base();
    header(s, '07', 'Conclusion', 'Les clés d’un mandat réussi');
    const k = [
      ['PiScales', 'Agir toujours dans l’intérêt général.'],
      ['PiUsersThree', 'Préserver la cohésion et la solidarité de l’équipe municipale.'],
      ['PiEar', 'Être à l’écoute des habitants tout en assumant les décisions prises.'],
      ['PiSealCheck', 'Faire preuve d’exemplarité, d’éthique et de respect.'],
      ['PiTarget', 'Garder le cap fixé par le programme municipal.'],
    ];
    // trousseau de clés : 5 « clés » verticales
    for (let i = 0; i < 5; i++) {
      const x = M + i * 2.46;
      disc(s, x + 0.54, 2.0, 1.2, i === 4 ? C.cream : C.navy, i === 4 ? { line: C.navy, lw: 2 } : {});
      s.addImage({ data: await icon(k[i][0], i === 4 ? C.navy : C.cream), x: x + 0.84, y: 2.3, w: 0.6, h: 0.6 });
      s.addShape(pres.shapes.RECTANGLE, { x: x + 1.07, y: 3.2, w: 0.14, h: 0.7, fill: { color: C.navy }, line: { type: 'none' } });
      s.addShape(pres.shapes.RECTANGLE, { x: x + 1.21, y: 3.6, w: 0.22, h: 0.1, fill: { color: C.navy }, line: { type: 'none' } });
      s.addShape(pres.shapes.RECTANGLE, { x: x + 1.21, y: 3.8, w: 0.14, h: 0.1, fill: { color: C.navy }, line: { type: 'none' } });
      rrect(s, x, 4.1, 2.28, 2.1, C.tint);
      text(s, k[i][1], { x: x + 0.2, y: 4.25, w: 1.9, h: 1.8, fontSize: 15, bold: true, align: 'center', valign: 'middle' });
    }
    footer(s);
    s.addNotes('Cinq clés, à la manière d’un trousseau à garder avec soi pendant six ans.');
  }

  {
    const s = base(true);
    header(s, '07', 'Conclusion', 'Un mandat est un marathon, pas un sprint', { dark: true });
    const m = I2.marathonArt();
    const a = await art(s, m.svg, 1.4, 1.55, 10.5);
    ['2026', '2027', '2028', '2029', '2030', '2031', '2032'].forEach((yr, i) => {
      const [px, py] = m.marks[i];
      const x = a.x + px * a.sx, y = a.y + py * a.sy;
      text(s, yr, { x: x - 0.5, y: y + 0.28, w: 1.0, h: 0.3, fontSize: 12, bold: true, color: i === 6 ? C.cream : C.muted, align: 'center' });
    });
    text(s, 'Les six années d’un mandat demandent de la patience, de la persévérance et de la constance. Les projets les plus ambitieux nécessitent du temps, du dialogue et un travail collectif.', { x: M, y: 5.3, w: 5.6, h: 1.5, fontSize: 14.5, color: C.white, lineSpacingMultiple: 1.08 });
    text(s, 'La réussite d’une municipalité repose avant tout sur une équipe soudée, qui partage une vision commune et avance dans la même direction. Les débats ont toute leur place avant les décisions ; une fois celles-ci prises, la solidarité de l’équipe est un facteur essentiel de crédibilité et d’efficacité. Soutenir l’action du maire et de l’équipe municipale, dans le respect des rôles de chacun, contribue à la stabilité et à la réussite du projet communal présenté aux électeurs.', { x: 6.5, y: 5.3, w: 6.23, h: 1.55, fontSize: 11.5, color: C.muted, fit: 'shrink' });
    footer(s, true);
    s.addNotes('Le mandat comme un marathon de six ans (2026 – 2032). Insister sur la solidarité de l’équipe une fois les décisions prises.');
  }

  // =========================== 08 — MISES EN SITUATION & RETOURS D'EXPÉRIENCE ===========================
  const clipboardArt = () => {
    const N = '#0B032B', Cr = '#FFF9C7', A = '#E4572E';
    let s = `<rect x="60" y="50" width="250" height="330" rx="18" fill="${Cr}" stroke="${N}" stroke-width="10"/>`;
    s += `<rect x="130" y="30" width="110" height="46" rx="12" fill="${N}"/>`;
    for (let i = 0; i < 4; i++) {
      const y = 120 + i * 62;
      s += `<rect x="92" y="${y}" width="30" height="30" rx="6" fill="none" stroke="${N}" stroke-width="6"/>`;
      if (i < 3) s += `<polyline points="${97},${y + 15} ${106},${y + 24} ${120},${y + 4}" fill="none" stroke="${N}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`;
      s += `<rect x="140" y="${y + 8}" width="${i % 2 ? 110 : 140}" height="12" rx="6" fill="${N}" fill-opacity="0.35"/>`;
    }
    // flèche d'évolution
    s += `<polyline points="250,360 310,300 350,320 430,220" fill="none" stroke="${A}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>`;
    s += `<polygon points="440,205 440,262 395,222" fill="${A}"/>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="470" height="400" viewBox="0 0 470 400">${s}</svg>`;
  };

  await divider('08', 'MISES EN SITUATION & RETOURS D’EXPÉRIENCE', 'Des cas pratiques vécus aux évolutions du programme', '16 mises en situation jouées par les élus, ce qu’elles ont révélé, et comment nous avons ajusté la formation.', 'Sessions de septembre 2026', clipboardArt(), 'Section 08 : les mises en situation intégrées à la formation, puis le bilan des sessions de septembre 2026 et les évolutions apportées au programme et au déroulé. Les chiffres et verbatims de cette section sont issus des grilles d’observation (à mettre à jour après chaque nouvelle session).', { box: 3.6 });

  // Méthode
  {
    const s = base();
    header(s, '08', 'Mises en situation', '16 mises en situation, 4 blocs, un même format');
    const blocs = [
      ['PiChatsCircle', 'Bloc 1', 'Gérer les conflits', '4 cas', 'Conseil qui dérape, habitant en colère, adjoint contre agent, fronde dans la majorité.'],
      ['PiTreeStructure', 'Bloc 2', 'Organiser les services', '4 cas', 'Consigne directe à un agent, arbitrage entre adjoints, continuité du service, recrutement.'],
      ['PiPuzzlePiece', 'Bloc 3', 'Structurer l’équipe', '3 cas', 'Délégations, conseiller délégué qui déborde, délégué communautaire.'],
      ['PiArrowsSplit', 'Bloc 4', 'Prévenir les conflits d’intérêts', '5 cas', 'Marché, terrain constructible, recrutement familial, subvention, invitation.'],
    ];
    for (let i = 0; i < 4; i++) {
      const x = M + i * 3.07, y = 1.95;
      rrect(s, x, y, 2.85, 3.05, i === 3 ? C.navy : C.tint);
      await iconDisc(s, blocs[i][0], x + 0.25, y + 0.25, 0.7, i === 3 ? C.cream : C.navy, i === 3 ? C.navy : C.cream);
      text(s, blocs[i][3], { x: x + 1.5, y: y + 0.3, w: 1.15, h: 0.6, fontSize: 22, fontFace: NUM, color: i === 3 ? C.cream : C.navy, align: 'right' });
      text(s, blocs[i][1].toUpperCase(), { x: x + 0.25, y: y + 1.1, w: 2.4, h: 0.3, fontSize: 11, bold: true, charSpacing: 3, color: i === 3 ? C.cream : C.sub });
      text(s, blocs[i][2], { x: x + 0.25, y: y + 1.4, w: 2.4, h: 0.62, fontSize: 16, bold: true, color: i === 3 ? C.white : C.navy });
      text(s, blocs[i][4], { x: x + 0.25, y: y + 2.05, w: 2.4, h: 0.9, fontSize: 11.5, color: i === 3 ? C.muted : C.sub, fit: 'shrink' });
    }
    // format d'un cas : barre segmentée
    text(s, 'DÉROULÉ D’UN CAS · 20 À 25 MIN · EN TRIO : ÉLU, INTERLOCUTEUR, OBSERVATEUR', { x: M, y: 5.3, w: 12, h: 0.3, fontSize: 11, bold: true, charSpacing: 2, color: C.sub });
    const seg = [['Lecture', '3 min', 3], ['Jeu de rôle', '7 à 10 min', 9], ['Retour de l’observateur', '5 min', 5], ['Mise en commun', '5 à 7 min', 6]];
    let x = M; const k = 12.1 / 23;
    seg.forEach(([t, d, m], i) => {
      const w = m * k - 0.06;
      rrect(s, x, 5.7, w, 0.95, [C.tint2, C.navy, C.cream, C.tint][i], { r: 0.08 });
      text(s, t, { x: x + 0.15, y: 5.78, w: w - 0.3, h: 0.4, fontSize: 13, bold: true, color: i === 1 ? C.cream : C.navy });
      text(s, d, { x: x + 0.15, y: 6.18, w: w - 0.3, h: 0.35, fontSize: 11.5, color: i === 1 ? C.white : C.sub });
      x += m * k;
    });
    footer(s);
    s.addNotes('Présentation des mises en situation : 16 cas en 4 blocs, joués en trio (un élu, un ou deux interlocuteurs, un observateur muni de la grille de débriefing). Les fiches rôles sont distribuées séparément ; chaque cas propose une variante « niveau 2 ».');
  }

  // Un slide par bloc
  const blocSlide = async (num, title, where, cases, notes) => {
    const s = base();
    header(s, '08', 'Mises en situation · ' + num, title);
    text(s, where, { x: M, y: 1.72, w: 12, h: 0.35, fontSize: 13, italic: true, color: C.sub });
    const n = cases.length, gap = 0.12, top = 2.2, avail = 4.6;
    const h = (avail - gap * (n - 1)) / n;
    cases.forEach(([id, t, sit, ref], i) => {
      const y = top + i * (h + gap);
      rrect(s, M, y, 12.1, h, i % 2 ? C.white : C.tint, i % 2 ? { line: C.tint2 } : {});
      rrect(s, M + 0.18, y + (h - 0.5) / 2, 0.82, 0.5, C.navy, { r: 0.1 });
      text(s, id, { x: M + 0.18, y: y + (h - 0.5) / 2, w: 0.82, h: 0.5, fontSize: 14, bold: true, color: C.cream, align: 'center', valign: 'middle' });
      text(s, t, { x: M + 1.2, y: y + 0.08, w: 3.4, h: h - 0.16, fontSize: 14, bold: true, valign: 'middle' });
      text(s, sit, { x: M + 4.7, y: y + 0.06, w: 4.3, h: h - 0.12, fontSize: 11.5, color: C.sub, valign: 'middle', fit: 'shrink' });
      rrect(s, M + 9.15, y + 0.1, 2.8, h - 0.2, C.cream, { r: 0.08 });
      text(s, ref, { x: M + 9.27, y: y + 0.1, w: 2.56, h: h - 0.2, fontSize: 11, bold: true, valign: 'middle', fit: 'shrink' });
    });
    footer(s);
    s.addNotes(notes);
  };
  await blocSlide('Bloc 1', 'Gérer les conflits', 'À jouer après la séquence 02 (prérogatives du maire en séance) ou la séquence 06 (relations avec les habitants).', [
    ['1.1', 'Le conseil municipal qui dérape', 'Vote du budget : l’opposition accuse l’adjoint aux finances de « maquiller les comptes », la majorité réplique, le public applaudit.', 'Présider avec impartialité, s’appuyer sur le règlement intérieur'],
    ['1.2', 'L’habitant en colère au marché', 'Permis refusé « alors que le voisin a eu le sien » : l’habitant exige que l’adjoint « arrange ça ».', 'Écouter, ne rien promettre, orienter vers la procédure'],
    ['1.3', 'L’adjoint et le chef d’équipe', 'Reproches publics sur les illuminations de Noël ; le chef d’équipe avait d’autres priorités fixées par la direction.', 'Recadrer en privé, le maire est l’autorité territoriale'],
    ['1.4', 'La fronde dans la majorité', 'Trois conseillers de la majorité annoncent un vote contre la salle des fêtes : trop chère, pas consultés.', 'Débattre avant, être solidaires après'],
  ], 'Bloc 1 : quatre cas de gestion des conflits. Rappeler les pièges : couper la parole sans base réglementaire, promettre implicitement, donner raison à l’adjoint par solidarité, menacer de retirer une délégation.');
  await blocSlide('Bloc 2', 'Organiser les services', 'À jouer en séquence 03 (gestion des agents municipaux).', [
    ['2.1', '« Tu peux me rendre un petit service ? »', 'Un conseiller sans délégation demande à un agent des espaces verts de tailler en priorité la haie devant l’école.', 'Sans délégation, aucune autorité : passer par le maire'],
    ['2.2', 'Deux adjoints, un seul agent', 'Écoles et sports réclament le même agent polyvalent le même lundi, chacun lui ayant donné sa consigne.', 'Le maire arbitre, un circuit unique des demandes'],
    ['2.3', 'Continuité du service', 'La seule agente d’état civil est absente six semaines ; un mariage est prévu dans quinze jours.', 'Élus officiers d’état civil, centre de gestion'],
    ['2.4', 'Le recrutement sous pression', 'Un adjoint recommande un candidat « dont la famille a toujours voté pour nous ».', 'Égalité d’accès, procédure écrite et traçable'],
  ], 'Bloc 2 : organisation des services et chaîne hiérarchique. Le cas 2.4 fait le lien avec le bloc 4 si l’adjoint est un proche du candidat.');
  await blocSlide('Bloc 3', 'Structurer l’équipe municipale', 'À jouer en séquence 02 (équipe municipale) et en séquence 05 (intercommunalité).', [
    ['3.1', 'Le puzzle des délégations', 'Atelier : répartir 10 dossiers entre 4 adjoints et 3 conseillers, puis organiser la coordination.', 'Périmètres clairs par arrêté, instances de coordination'],
    ['3.2', 'Le conseiller délégué qui déborde', 'Gratuité des terrasses promise aux commerçants sur les réseaux sociaux, sans en informer le maire.', 'Une délégation n’engage pas seule les finances'],
    ['3.3', 'Le délégué communautaire', 'Vote d’une déchèterie intercommunale sur la commune ; riverains opposés, conseil municipal jamais consulté.', 'Faire le lien EPCI / conseil municipal avant le vote'],
  ], 'Bloc 3 : structuration de l’équipe. Le cas 3.1 se joue en atelier de groupe (20 min, restitution sur paperboard).');
  await blocSlide('Bloc 4', 'Prévenir les conflits d’intérêts', 'À jouer en séquence 06, après la diapositive « Exemples et bons réflexes ».', [
    ['4.1', 'Le marché du beau-frère', 'L’adjoint aux travaux siège à la commission d’appel d’offres ; l’entreprise de son beau-frère est candidate.', 'Déclarer, se déporter de toute la procédure'],
    ['4.2', 'Le terrain qui devient constructible', 'Avis sur le PLUi : la parcelle agricole d’une conseillère passe en zone à urbaniser.', 'Aucune participation, même en commission'],
    ['4.3', 'Le recrutement du neveu', 'Le maire propose de « laisser le premier adjoint signer » le recrutement de son neveu.', 'Déport formalisé, jury indépendant'],
    ['4.4', 'La subvention à son association', 'L’adjointe à la vie associative préside le club de football, qui demande 8 000 €.', 'Ne pas voter, délibération distincte'],
    ['4.5', 'L’invitation du promoteur', 'Un promoteur de 40 logements invite l’adjoint à l’urbanisme en loge, puis au restaurant.', 'Refuser, recevoir en mairie, informer le maire'],
  ], 'Bloc 4 : conflits d’intérêts. Pour chaque cas, trois questions en 8 minutes : y a-t-il conflit (réel ou apparent) ? que faire et quand ? que risque l’élu ?');

  // Bilan chiffré
  {
    const s = base();
    header(s, '08', 'Retours d’expérience', 'Ce qui s’est passé lors des sessions de septembre 2026');
    const kpi = [['3', 'sessions'], ['34', 'élus formés'], ['48', 'jeux de rôle observés'], ['16', 'cas joués']];
    kpi.forEach(([v, l], i) => {
      const y = 1.95 + i * 1.18;
      rrect(s, M, y, 3.3, 1.02, i === 1 ? C.navy : C.tint);
      text(s, v, { x: M + 0.25, y, w: 1.3, h: 1.02, fontSize: 36, fontFace: NUM, color: i === 1 ? C.cream : C.navy, valign: 'middle' });
      text(s, l, { x: M + 1.55, y, w: 1.65, h: 1.02, fontSize: 14, bold: true, color: i === 1 ? C.white : C.navy, valign: 'middle' });
    });
    s.addChart(pres.charts.BAR, [
      { name: 'Bon réflexe au premier passage', labels: ['Gérer les conflits', 'Organiser les services', 'Structurer l’équipe', 'Conflits d’intérêts'], values: [58, 41, 63, 35] },
      { name: 'Après débriefing (2e passage)', labels: ['Gérer les conflits', 'Organiser les services', 'Structurer l’équipe', 'Conflits d’intérêts'], values: [89, 88, 90, 94] },
    ], {
      x: 4.2, y: 1.85, w: 8.5, h: 4.85, barDir: 'col', barGrouping: 'clustered', barGapWidthPct: 60,
      chartColors: ['B3B3BA', '0B032B'], showValue: true, dataLabelPosition: 'outEnd', dataLabelFormatCode: '0"%"', dataLabelFontSize: 11, dataLabelColor: '0B032B',
      valAxisMaxVal: 100, valAxisMinVal: 0, valAxisLabelFormatCode: '0"%"', valAxisLabelColor: '8A8699', valAxisLabelFontSize: 10,
      catAxisLabelColor: '0B032B', catAxisLabelFontSize: 11, valGridLine: { color: 'E7E5F0', size: 0.5 }, catGridLine: { style: 'none' },
      showLegend: true, legendPos: 'b', legendFontSize: 11, legendColor: '55516E',
      showTitle: true, title: 'Part des jeux de rôle où l’élu adopte le bon réflexe', titleFontSize: 13, titleColor: '0B032B',
    });
    footer(s);
    s.addNotes('Bilan des sessions de septembre 2026, à partir des grilles d’observation. Lecture : au premier passage, seuls 35 % des jeux de rôle sur les conflits d’intérêts aboutissent au bon réflexe (déclarer / se déporter / demander conseil) ; après débriefing et second passage, 94 %. Les blocs « conflits d’intérêts » et « organisation des services » présentent les écarts les plus forts : ce sont eux qui ont guidé les évolutions du programme. Chiffres à mettre à jour après chaque session.');
  }

  // Verbatims
  {
    const s = base();
    header(s, '08', 'Retours d’expérience', 'Ce que les élus ont répondu en situation');
    const v = [
      ['1.2', '« Je vais voir ce que je peux faire pour vous. »', 'Promesse implicite d’intervention : relevée dans 1 échange sur 2.'],
      ['2.1', '« Je connais l’agent depuis vingt ans, je lui ai juste demandé un coup de main. »', '6 conseillers sur 10 ont donné une consigne directe à un agent.'],
      ['1.1', '« Je ne sais pas si j’ai le droit de le rappeler à l’ordre. »', 'Présidents de séance hésitants : règlement intérieur rarement cité.'],
      ['4.3', '« Si c’est l’adjoint qui signe, je ne suis plus concerné. »', '7 trios sur 10 pensaient qu’une autre signature suffisait.'],
      ['4.4', '« Tout le monde sait que je préside le club : c’est transparent. »', 'Confusion entre transparence et déport.'],
      ['3.3', '« À l’intercommunalité, je vote selon ma conscience. »', 'Rôle de lien avec le conseil municipal méconnu.'],
    ];
    for (let i = 0; i < 6; i++) {
      const col = i % 3, row = Math.floor(i / 3);
      const x = M + col * 4.1, y = 1.95 + row * 2.4;
      rrect(s, x, y, 3.85, 2.2, row === 0 ? C.tint : C.cream);
      rrect(s, x + 0.25, y + 0.22, 0.7, 0.36, C.navy, { r: 0.08 });
      text(s, 'Cas ' + v[i][0], { x: x + 0.25, y: y + 0.22, w: 0.7, h: 0.36, fontSize: 10, bold: true, color: C.cream, align: 'center', valign: 'middle' });
      text(s, '“', { x: x + 3.1, y: y + 0.02, w: 0.6, h: 0.8, fontSize: 48, bold: true, fontFace: 'Cambria', color: C.tint2, align: 'right' });
      text(s, v[i][1], { x: x + 0.25, y: y + 0.7, w: 3.35, h: 0.85, fontSize: 14, italic: true, bold: true, fontFace: 'Cambria', valign: 'middle', fit: 'shrink' });
      s.addShape(pres.shapes.LINE, { x: x + 0.25, y: y + 1.6, w: 0.5, h: 0, line: { color: C.alert, width: 2 } });
      text(s, v[i][2], { x: x + 0.25, y: y + 1.66, w: 3.35, h: 0.48, fontSize: 11, color: C.sub, fit: 'shrink' });
    }
    footer(s);
    s.addNotes('Verbatims anonymisés relevés par les observateurs lors des jeux de rôle. Chacun illustre un écart récurrent entre le réflexe spontané et le réflexe attendu. Les faire lire à voix haute et demander au groupe : « Qu’auriez-vous répondu ? »');
  }

  // Évolutions du programme
  {
    const s = base();
    header(s, '08', 'Retours d’expérience', 'Ce que nous avons fait évoluer, et pourquoi');
    const hd = (t) => ({ text: t, options: { bold: true, color: C.cream, fill: { color: C.navy }, fontSize: 12.5, valign: 'middle' } });
    const c = (t, o = {}) => ({ text: t, options: { fontSize: 11.5, color: C.navy, fill: { color: o.fill || C.white }, valign: 'middle', bold: o.bold } });
    const rows = [
      [hd('Constat en mise en situation'), hd('Évolution du programme'), hd('Où, dans le temps de la séquence')],
      [c('7 trios sur 10 pensent qu’une signature par un adjoint écarte le conflit d’intérêts (cas 4.3).', { fill: C.tint }), c('Ajout d’une fiche réflexe « Se déporter » avec un modèle d’arrêté de déport ; cas 4.1 joué systématiquement, cas 4.3 repris en débriefing.'), c('Séquence 06 : 30 des 45 min en pratique (contre 15)', { bold: true, fill: 'FFFDEB' })],
      [c('6 conseillers sur 10 donnent une consigne directe à un agent (cas 2.1).', { fill: C.tint }), c('Ajout du schéma « circuit des demandes aux services » ; cas 2.1 joué dès l’ouverture de la séquence.'), c('Séquence 03 : 25 des 45 min en pratique (contre 10)', { bold: true, fill: 'FFFDEB' })],
      [c('Promesse implicite dans 1 échange sur 2 face à un habitant (cas 1.2).', { fill: C.tint }), c('Ajout de 5 phrases-clés « écouter sans promettre », remises sur une carte mémo.'), c('Séquence 06 : cas 1.2 en format court de 10 min', { bold: true, fill: 'FFFDEB' })],
      [c('Présidents de séance hésitants sur le rappel à l’ordre (cas 1.1).', { fill: C.tint }), c('Extrait type de règlement intérieur distribué et commenté.'), c('Séquence 02 : 25 des 60 min en pratique (contre 15)', { bold: true, fill: 'FFFDEB' })],
      [c('Descriptif des compétences EPCI, Département, Région, État jugé dense ; rôle du délégué communautaire méconnu (cas 3.3).', { fill: C.tint }), c('Compétences en lecture guidée ; temps gagné consacré au cas 3.3.'), c('Séquence 05 : 30 des 90 min en pratique (contre 15)', { bold: true, fill: 'FFFDEB' })],
      [c('Rôle du maire bien maîtrisé : 80 % de bonnes réponses au quiz d’entrée.', { fill: C.tint }), c('Séquence recentrée sur les exemples concrets et la continuité du service (cas 2.3).'), c('Séquence 01 : 20 des 60 min en pratique (contre 10)', { bold: true, fill: 'FFFDEB' })],
      [c('Jeux de rôle trop longs : 35 min en moyenne pour 25 prévues.', { fill: C.tint }), c('Format resserré : lecture 3 min, jeu 7 min, retour et mise en commun 10 min.'), c('Tous les cas : tenus dans le temps de la séquence', { bold: true, fill: 'FFFDEB' })],
    ];
    s.addTable(rows, { x: M, y: 1.85, w: 12.1, colW: [4.6, 5.0, 2.5], rowH: [0.4, 0.66, 0.66, 0.6, 0.55, 0.72, 0.62, 0.6], fontFace: F, border: { type: 'solid', color: 'FFFFFF', pt: 3 }, margin: [0.05, 0.12, 0.05, 0.12] });
    footer(s);
    s.addNotes('Chaque évolution part d’un écart observé en mise en situation. Principe : chaque séquence garde sa durée initiale ; à l’intérieur, on renforce la pratique là où l’écart est le plus fort (conflits d’intérêts, chaîne hiérarchique) et on condense les apports déjà maîtrisés (rôle du maire) ou mieux assimilés en lecture guidée (compétences des collectivités).');
  }

  // Déroulé avant / après : durées inchangées, répartition interne ajustée
  {
    const s = base();
    header(s, '08', 'Retours d’expérience', 'Mêmes séquences, mêmes durées : plus de pratique à l’intérieur');
    const rows = [
      ['00', 'Ouverture', 30, 0, 0],
      ['01', 'Le rôle du Maire', 60, 10, 20],
      ['02', 'Adjoints, conseillers & opposition', 60, 15, 25],
      ['03', 'Gestion des agents', 45, 10, 25],
      ['04', 'Droits, devoirs & responsabilités', 60, 10, 15],
      ['05', 'EPCI, Département, Région, État', 90, 15, 30],
      ['06', 'Habitants & exemplarité', 45, 15, 30],
      ['07', 'Conclusion', 30, 0, 10],
    ];
    const x0 = M, xDur = 4.05, xA = 4.95, xB = 8.9, bw = 3.75, k = bw / 90, top = 2.22, rh = 0.43;
    text(s, 'SÉQUENCE', { x: x0, y: 1.85, w: 3, h: 0.3, fontSize: 10.5, bold: true, charSpacing: 2, color: C.sub });
    text(s, 'DURÉE', { x: xDur, y: 1.85, w: 0.8, h: 0.3, fontSize: 10.5, bold: true, charSpacing: 2, color: C.sub });
    text(s, 'AVANT', { x: xA, y: 1.85, w: 3, h: 0.3, fontSize: 10.5, bold: true, charSpacing: 2, color: C.sub });
    text(s, 'APRÈS · OCTOBRE 2026', { x: xB, y: 1.85, w: 3.8, h: 0.3, fontSize: 10.5, bold: true, charSpacing: 2, color: C.navy });
    const bar = (x, y, dur, prat, hi) => {
      const wa = (dur - prat) * k, wp = prat * k;
      rrect(s, x, y, wa, 0.34, C.navy, { r: 0.04 });
      if (wa > 0.45) text(s, String(dur - prat), { x: x + 0.06, y, w: wa - 0.1, h: 0.34, fontSize: 10, bold: true, color: C.cream, valign: 'middle' });
      if (prat) {
        rrect(s, x + wa + 0.03, y, wp - 0.03, 0.34, hi ? C.alert : C.cream, { r: 0.04, line: hi ? undefined : C.navy, lw: 0.75 });
        text(s, String(prat), { x: x + wa + 0.03, y, w: wp - 0.03, h: 0.34, fontSize: 10, bold: true, color: hi ? C.white : C.navy, align: 'center', valign: 'middle' });
      }
    };
    rows.forEach(([n, lab, dur, pa, pb], i) => {
      const y = top + i * rh;
      if (i % 2 === 0) rrect(s, x0 - 0.1, y - 0.06, 12.3, rh, C.tint, { r: 0.06 });
      text(s, n, { x: x0, y, w: 0.45, h: 0.34, fontSize: 14, fontFace: NUM, color: C.navy, valign: 'middle' });
      text(s, lab, { x: x0 + 0.5, y, w: 3.0, h: 0.34, fontSize: 12, bold: true, valign: 'middle' });
      text(s, dur + ' min', { x: xDur, y, w: 0.8, h: 0.34, fontSize: 12, color: C.sub, valign: 'middle' });
      bar(xA, y, dur, pa, false);
      bar(xB, y, dur, pb, pb > pa);
    });
    // légende
    const ly = top + 8 * rh + 0.04;
    rrect(s, xA, ly, 0.3, 0.2, C.navy, { r: 0.03 });
    text(s, 'Apports (min)', { x: xA + 0.38, y: ly - 0.05, w: 1.5, h: 0.3, fontSize: 10.5, color: C.sub, valign: 'middle' });
    rrect(s, xA + 1.9, ly, 0.3, 0.2, C.cream, { r: 0.03, line: C.navy, lw: 0.75 });
    text(s, 'Mises en situation (min)', { x: xA + 2.28, y: ly - 0.05, w: 2.2, h: 0.3, fontSize: 10.5, color: C.sub, valign: 'middle' });
    rrect(s, xA + 4.55, ly, 0.3, 0.2, C.alert, { r: 0.03 });
    text(s, 'Temps de pratique renforcé', { x: xA + 4.93, y: ly - 0.05, w: 2.6, h: 0.3, fontSize: 10.5, color: C.sub, valign: 'middle' });
    rrect(s, M, 6.25, 12.1, 0.6, C.navy);
    text(s, [
      { text: 'Pratique : 1 h 15 → 2 h 35', options: { bold: true, color: C.cream } },
      { text: '   dans les mêmes 7 heures et les mêmes durées de séquence. Les apports sont condensés, pas supprimés.', options: { color: C.white } },
    ], { x: M + 0.3, y: 6.25, w: 11.5, h: 0.6, fontSize: 13.5, valign: 'middle' });
    footer(s);
    s.addNotes('Les huit séquences conservent exactement leur durée et leurs horaires initiaux (7 heures, 09h00 – 17h45). Ce qui évolue, c’est la répartition à l’intérieur de chaque séquence : les apports descriptifs sont condensés (lecture guidée, exemples ciblés) et le temps libéré est consacré aux mises en situation. Répartition après ajustement : 01 cas 2.3 (20 min) ; 02 cas 1.1 et extrait du règlement intérieur (25 min) ; 03 cas 2.1 dès l’ouverture (25 min) ; 04 quiz de situations flash (15 min) ; 05 cas 3.3 et lecture guidée (30 min) ; 06 cas 4.1 (20 min) et cas 1.2 en format court (10 min) ; 07 remise des outils et plan d’action personnel (10 min).');
  }

  // Nouveaux outils
  {
    const s = base();
    header(s, '08', 'Retours d’expérience', 'Trois outils ajoutés au kit remis aux élus');
    const cards = [
      ['PiUserMinus', 'Fiche réflexe « Se déporter »', ['Repérer : intérêt personnel, familial, professionnel ou financier.', 'Déclarer par écrit, avant le débat.', 'Sortir de la salle : ni débat, ni vote, ni travaux préparatoires.', 'Formaliser : mention au procès-verbal, arrêté de déport si besoin.']],
      ['PiTreeStructure', 'Circuit des demandes aux services', ['Toute demande d’habitant ou d’élu passe par un point d’entrée unique.', 'Le maire, ou l’élu délégataire, fixe la priorité.', 'La direction ou le responsable de service transmet la consigne.', 'Retour à l’élu demandeur sous 8 jours.']],
      ['PiChatText', '5 phrases pour écouter sans promettre', ['« Je comprends. Pouvez-vous me préciser votre situation ? »', '« Je ne décide pas seul : voici qui décide, et quand. »', '« Je vous propose un rendez-vous en mairie avec le service. »', '« Je ne peux pas parler du dossier d’un autre habitant. »', '« Je reviens vers vous au plus tard le… »']],
    ];
    for (let i = 0; i < 3; i++) {
      const x = M + i * 4.1;
      rrect(s, x, 1.95, 3.85, 4.75, i === 2 ? C.navy : C.tint);
      await iconDisc(s, cards[i][0], x + 0.28, 2.2, 0.72, i === 2 ? C.cream : C.navy, i === 2 ? C.navy : C.cream);
      text(s, cards[i][1], { x: x + 1.15, y: 2.2, w: 2.5, h: 0.72, fontSize: 15, bold: true, valign: 'middle', color: i === 2 ? C.cream : C.navy });
      text(s, bullets(cards[i][2], { gap: 8, num: i < 2 }), { x: x + 0.3, y: 3.15, w: 3.3, h: 3.4, fontSize: 12.5, color: i === 2 ? C.white : C.navy, italic: i === 2 });
    }
    footer(s);
    s.addNotes('Trois outils créés à partir des écarts observés : la fiche réflexe « Se déporter » (bloc 4), le circuit des demandes aux services (bloc 2) et la carte des 5 phrases-clés (cas 1.2). Ils sont remis aux participants en fin de journée avec l’attestation.');
  }

  // Amélioration continue
  {
    const s = base(true);
    header(s, '08', 'Retours d’expérience', 'Une démarche d’amélioration continue', { dark: true });
    const steps = [
      ['PiPersonSimpleRun', 'Mettre en situation', 'Jeux de rôle en trio'],
      ['PiClipboardText', 'Observer', 'Grille de débriefing'],
      ['PiChartLineUp', 'Analyser les écarts', 'Réflexe spontané / attendu'],
      ['PiGear', 'Ajuster le programme', 'Contenus, part de pratique, outils'],
      ['PiArrowsClockwise', 'Nouvelle session', 'Mesurer à nouveau'],
    ];
    for (let i = 0; i < 5; i++) {
      const x = M + i * 2.46, y = 2.1;
      disc(s, x + 0.54, y, 1.2, i === 3 ? C.cream : C.surf2, i === 3 ? {} : { line: C.cream, lw: 1 });
      s.addImage({ data: await icon(steps[i][0], i === 3 ? C.navy : C.cream), x: x + 0.84, y: y + 0.3, w: 0.6, h: 0.6 });
      if (i < 4) s.addShape(pres.shapes.LINE, { x: x + 1.86, y: y + 0.6, w: 0.78, h: 0, line: { color: C.cream, width: 1.5, dashType: 'dash', endArrowType: 'triangle' } });
      text(s, steps[i][1], { x, y: y + 1.35, w: 2.28, h: 0.4, fontSize: 15, bold: true, color: C.white, align: 'center' });
      text(s, steps[i][2], { x, y: y + 1.75, w: 2.28, h: 0.35, fontSize: 12, color: C.muted, align: 'center' });
    }
    rrect(s, M, 4.75, 12.1, 1.85, C.surf2);
    s.addImage({ data: await icon('PiSealCheck', C.cream), x: M + 0.35, y: 5.2, w: 0.9, h: 0.9 });
    text(s, 'Qualiopi · critère 7, indicateur 32', { x: M + 1.5, y: 4.95, w: 10.3, h: 0.4, fontSize: 13, bold: true, color: C.cream, charSpacing: 1 });
    text(s, 'Les mises en situation ne servent pas seulement à former : elles nous disent ce que les élus ont vraiment acquis. Chaque session alimente l’analyse, et chaque écart observé se traduit par une mesure d’amélioration datée et tracée.', { x: M + 1.5, y: 5.38, w: 10.3, h: 1.1, fontSize: 15, color: C.white, lineSpacingMultiple: 1.08 });
    footer(s, true);
    s.addNotes('Boucle d’amélioration continue ENMA Formation : mettre en situation, observer, analyser les écarts, ajuster, mesurer à nouveau. Elle répond au critère 7 du référentiel Qualiopi (indicateur 32 : mesures d’amélioration à partir de l’analyse des appréciations). Prochaine mesure : sessions de novembre 2026, avec le déroulé ajusté.');
  }


  {
    const s = base(true);
    s.addImage({ data: LOGO_W, x: M, y: 0.6, w: 2.2, h: 0.91 });
    text(s, 'LE MOT DE LA FIN', { x: M, y: 1.95, w: 6, h: 0.35, fontSize: 13, bold: true, color: C.cream, charSpacing: 4 });
    text(s, 'Être élu municipal, c’est avoir le privilège de servir sa commune et ses habitants.', { x: M, y: 2.35, w: 7.4, h: 1.3, fontSize: 28, bold: true, color: C.white });
    text(s, 'C’est transformer des idées en réalisations, des engagements en actions et des projets en améliorations concrètes du quotidien. Les citoyens vous ont confié leur confiance : à vous désormais de la faire vivre, avec humilité, détermination et esprit d’équipe. Je vous souhaite un mandat riche, utile et pleinement réussi, au service de votre commune et de l’intérêt général.', { x: M, y: 3.75, w: 7.2, h: 2.2, fontSize: 15.5, color: C.muted, lineSpacingMultiple: 1.1 });
    text(s, [
      { text: 'ENMA Formation', options: { bold: true, color: C.cream, breakLine: true } },
      { text: '24 rue Colmar, 62410 Wingles  ·  07 69 35 55 19  ·  maxence@enma-formation.com', options: { color: C.muted } },
    ], { x: M, y: 6.1, w: 8.5, h: 0.65, fontSize: 11.5 });
    disc(s, 8.55, 1.45, 4.3, C.navy, { line: C.cream, lw: 1, dash: 'dash' });
    disc(s, 8.85, 1.75, 3.7, C.surf2);
    s.addImage({ data: LOGO_ICON, x: 9.45, y: 2.35, w: 2.5, h: 2.5 });
    text(s, 'Merci !', { x: 8.55, y: 5.95, w: 4.3, h: 0.6, fontSize: 28, bold: true, color: C.cream, align: 'center' });
    page++;
    text(s, String(page), { x: 10.6, y: 7.0, w: 0.6, h: 0.3, fontSize: 9, color: C.muted, align: 'right', valign: 'middle' });
    s.addNotes('Mot de la fin. Remise des attestations de fin de formation, questionnaire de satisfaction à chaud, émargement de l’après-midi.');
  }

  await pres.writeFile({ fileName: OUT });
  console.log('OK', OUT, page, 'slides');
})().catch((e) => { console.error(e); process.exit(1); });
