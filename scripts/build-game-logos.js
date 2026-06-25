#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'assets', 'games');

function svgData(file) {
  let svg = fs.readFileSync(path.join(dir, file), 'utf8');
  svg = svg.replace(/<\?xml[^?]*\?>/gi, '').trim();
  return 'data:image/svg+xml,' + encodeURIComponent(svg);
}

function pngData(file) {
  const buf = fs.readFileSync(path.join(dir, file));
  return 'data:image/png;base64,' + buf.toString('base64');
}

const out =
  '/* Logos oficiales embebidos — Supercell / EA FC (Wikimedia) */\n' +
  '(function () {\n' +
  '  window.LOGO_BRAWL = ' + JSON.stringify(svgData('brawl-stars-official.svg')) + ';\n' +
  '  window.LOGO_EAFC = ' + JSON.stringify(svgData('fc26-official.svg')) + ';\n' +
  '  window.LOGO_CLASH = ' + JSON.stringify(pngData('clash-royale-official.png')) + ';\n' +
  '  window.GAME_LOGOS_OFFICIAL = true;\n' +
  '})();\n';

fs.writeFileSync(path.join(__dirname, '..', 'js', 'game-logos.js'), out, 'utf8');
console.log('game-logos.js generated OK');
