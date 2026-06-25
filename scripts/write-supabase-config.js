/* Genera js/supabase-config.js desde variables de entorno (Vercel / CI). */
var fs = require('fs');
var path = require('path');

var url = process.env.SUPABASE_URL || '';
var key = process.env.SUPABASE_ANON_KEY || '';
var enabled = !!(url && key);

var out = '/* Auto-generado en deploy — no editar a mano en producción */\n' +
  'window.SUPABASE_CONFIG = {\n' +
  '  url: ' + JSON.stringify(url) + ',\n' +
  '  anonKey: ' + JSON.stringify(key) + ',\n' +
  '  enabled: ' + enabled + ',\n' +
  '  cloudOnly: ' + enabled + '\n' +
  '};\n';

var target = path.join(__dirname, '..', 'js', 'supabase-config.js');
fs.writeFileSync(target, out, 'utf8');
console.log('supabase-config.js escrito (enabled=' + enabled + ')');
