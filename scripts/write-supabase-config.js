/* Genera js/supabase-config.js desde variables de entorno (Vercel / CI). */
var fs = require('fs');
var path = require('path');

var url = process.env.SUPABASE_URL || '';
var key = process.env.SUPABASE_ANON_KEY || '';
var enabled = !!(url && key);

if (!enabled) {
  console.log('Sin SUPABASE_URL/ANON_KEY en entorno — se mantiene config.js y supabase-config.js del repo.');
  process.exit(0);
}

var out = '/* Auto-generado en deploy — no editar a mano en producción */\n' +
  'window.SUPABASE_CONFIG = {\n' +
  '  url: ' + JSON.stringify(url) + ',\n' +
  '  anonKey: ' + JSON.stringify(key) + ',\n' +
  '  enabled: ' + enabled + ',\n' +
  '  cloudOnly: ' + enabled + '\n' +
  '};\n';

var target = path.join(__dirname, '..', 'js', 'supabase-config.js');
fs.writeFileSync(target, out, 'utf8');

var configPath = path.join(__dirname, '..', 'js', 'config.js');
var config = fs.readFileSync(configPath, 'utf8');
var block = 'SITE.supabase = {\n' +
  "  url: " + JSON.stringify(url) + ",\n" +
  "  anonKey: " + JSON.stringify(key) + ",\n" +
  '  enabled: ' + enabled + ',\n' +
  '  cloudOnly: ' + enabled + '\n' +
  '};';
if (/SITE\.supabase\s*=\s*\{/.test(config)) {
  config = config.replace(/SITE\.supabase\s*=\s*\{[\s\S]*?\};/, block);
  fs.writeFileSync(configPath, config, 'utf8');
}

console.log('supabase-config.js escrito (enabled=' + enabled + ')');
