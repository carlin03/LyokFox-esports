#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const src = path.join(__dirname, '..', 'js', 'game-logos.js');
const out = path.join(__dirname, '..', 'assets', 'games', 'clash-royale-official.png');
const s = fs.readFileSync(src, 'utf8');
const m = s.match(/LOGO_CLASH = "([^"]+)"/);
if (!m) {
  console.error('LOGO_CLASH not found');
  process.exit(1);
}
const b64 = m[1].replace('data:image/png;base64,', '');
fs.writeFileSync(out, Buffer.from(b64, 'base64'));
console.log('Written', out, fs.statSync(out).size, 'bytes');
