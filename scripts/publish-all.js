/* Publica todo: stamp + seed CMS Supabase + deploy Vercel (ambos mirrors) */
var { execSync } = require('child_process');
var fs = require('fs');
var path = require('path');

var root = path.join(__dirname, '..');
var suffix = process.argv[2] || 'release';

function run(cmd, opts) {
  console.log('\n> ' + cmd);
  execSync(cmd, Object.assign({ stdio: 'inherit', cwd: root, shell: true }, opts || {}));
}

function loadEnvFile(file) {
  var p = path.join(root, file);
  if (!fs.existsSync(p)) return;
  fs.readFileSync(p, 'utf8').split(/\r?\n/).forEach(function (line) {
    var m = line.match(/^\s*([^#=]+)=(.*)$/);
    if (!m) return;
    var val = m[2].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (val) process.env[m[1].trim()] = val;
  });
}

loadEnvFile('.env.local');
loadEnvFile('.env.vercel');

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  try {
    var pulled = execSync('npx --yes vercel env pull .env.vercel.publish --environment=production --yes', {
      cwd: root,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    console.log(pulled.trim() || 'env pull ok');
    loadEnvFile('.env.vercel.publish');
  } catch (e) {
    console.warn('No se pudieron leer variables de Vercel:', e.message || e);
  }
}

run('node scripts/stamp-build.js ' + suffix);

if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  run('node scripts/seed-site-cms.js --force', { env: process.env });
} else {
  console.warn('SKIP seed CMS — faltan SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY en entorno.');
}

run('node scripts/write-supabase-config.js', { env: process.env });
run('npx --yes vercel deploy --prod --yes --force --project v0-sports-team-website', { env: process.env });
run('npx --yes vercel deploy --prod --yes --force --project lyokfox-esports', { env: process.env });

var config = fs.readFileSync(path.join(root, 'js', 'config.js'), 'utf8');
var buildMatch = config.match(/build:\s*'([^']+)'/);
console.log('\n✓ Publicación completa. Build footer: v' + (buildMatch ? buildMatch[1] : suffix));
