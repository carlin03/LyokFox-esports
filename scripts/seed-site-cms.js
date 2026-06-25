/* Siembra site_cms con LYOK_DATA por defecto si la fila está vacía. */
var fs = require('fs');
var path = require('path');
var vm = require('vm');

var url = process.env.SUPABASE_URL || '';
var key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
var CMS_ROW_ID = 'main';

if (!url || !key) {
  console.error('Faltan SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

var dataPath = path.join(__dirname, '..', 'js', 'lyok-data.js');
var code = fs.readFileSync(dataPath, 'utf8');
var sandbox = vm.createContext({});
vm.runInContext(code, sandbox);
var data = sandbox.LYOK_DATA;
if (!data || typeof data !== 'object') {
  console.error('No se pudo leer LYOK_DATA');
  process.exit(1);
}

var payload = {
  data: data,
  visibility: data.visibility || {}
};

async function main() {
  var check = await fetch(url + '/rest/v1/site_cms?id=eq.' + CMS_ROW_ID + '&select=id,payload', {
    headers: { apikey: key, Authorization: 'Bearer ' + key }
  });
  var rows = await check.json();
  if (Array.isArray(rows) && rows[0] && rows[0].payload && Object.keys(rows[0].payload).length) {
    console.log('site_cms ya tiene contenido — no se sobrescribe.');
    return;
  }

  var res = await fetch(url + '/rest/v1/site_cms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: key,
      Authorization: 'Bearer ' + key,
      Prefer: 'resolution=merge-duplicates,return=representation'
    },
    body: JSON.stringify({
      id: CMS_ROW_ID,
      payload: payload,
      updated_at: new Date().toISOString()
    })
  });

  if (!res.ok) {
    console.error('Error al sembrar:', await res.text());
    process.exit(1);
  }
  console.log('site_cms sembrado con LYOK_DATA completo.');
}

main().catch(function (e) {
  console.error(e);
  process.exit(1);
});
