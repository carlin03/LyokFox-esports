/* Marca build en config.js + cache-bust en CSS @import (deploy / predeploy) */
var fs = require('fs');
var path = require('path');

var root = path.join(__dirname, '..');
var suffix = process.argv[2] || 'web';
var d = new Date();
var build = d.getFullYear() + '.' +
  String(d.getMonth() + 1).padStart(2, '0') + '.' +
  String(d.getDate()).padStart(2, '0') + '-' + suffix;

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function write(file, content) {
  fs.writeFileSync(path.join(root, file), content, 'utf8');
}

var config = read('js/config.js');
if (!/build:\s*'/.test(config)) {
  console.error('No se encontró SITE.build en js/config.js');
  process.exit(1);
}
config = config.replace(/build:\s*'[^']*'/, "build: '" + build + "'");
write('js/config.js', config);

var lyokJs = read('js/lyok.js');
if (/build:\s*'/.test(lyokJs)) {
  lyokJs = lyokJs.replace(/build:\s*'[^']*'/, "build: '" + build + "'");
  write('js/lyok.js', lyokJs);
}

var style = read('css/style.css');
style = style.replace(/@import url\('([^'?]+)(?:\?v=[^']*)?'\)/g, function (_, file) {
  return "@import url('" + file + '?v=' + build + "')";
});
write('css/style.css', style);

var htmlFiles = fs.readdirSync(root).filter(function (name) {
  return name.endsWith('.html') && name !== 'dist';
});

htmlFiles.forEach(function (name) {
  var file = name;
  var html = read(file);
  if (html.indexOf('js/boot-assets.js') < 0) {
    html = html.replace(
      /<script src="js\/config\.js"><\/script>\r?\n/,
      '<script src="js/config.js"></script>\n  <script src="js/boot-assets.js"></script>\n'
    );
  }
  html = html.replace(/(href|src)="((?:css|js)\/[^"?]+)(?:\?v=[^"]*)?"/g, function (_, attr, asset) {
    return attr + '="' + asset + '?v=' + build + '"';
  });
  write(file, html);
});

console.log('Build marcado: ' + build);
console.log('HTML actualizados: ' + htmlFiles.join(', '));
