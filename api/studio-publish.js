/* Publica CMS del Studio en Supabase (service_role solo en servidor Vercel). */
var SUPABASE_URL = process.env.SUPABASE_URL || '';
var SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
var STUDIO_PIN = (process.env.STUDIO_PIN || 'lyokfox').toLowerCase();
var CMS_ROW_ID = 'main';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Studio-Pin');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, reason: 'method_not_allowed' });
    return;
  }
  if (!SUPABASE_URL || !SERVICE_KEY) {
    res.status(503).json({ ok: false, reason: 'supabase_not_configured' });
    return;
  }

  var pin = String(req.headers['x-studio-pin'] || '').trim().toLowerCase();
  if (!pin || pin !== STUDIO_PIN) {
    res.status(401).json({ ok: false, reason: 'invalid_pin' });
    return;
  }

  var body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = null; }
  }
  if (!body || !body.data || typeof body.data !== 'object') {
    res.status(400).json({ ok: false, reason: 'invalid_payload' });
    return;
  }

  var payload = {
    data: body.data,
    visibility: body.visibility || body.data.visibility || {}
  };

  try {
    var upsertRes = await fetch(SUPABASE_URL + '/rest/v1/site_cms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SERVICE_KEY,
        Authorization: 'Bearer ' + SERVICE_KEY,
        Prefer: 'resolution=merge-duplicates,return=representation'
      },
      body: JSON.stringify({
        id: CMS_ROW_ID,
        payload: payload,
        updated_at: new Date().toISOString()
      })
    });

    if (!upsertRes.ok) {
      var errText = await upsertRes.text();
      res.status(502).json({ ok: false, reason: 'supabase_error', detail: errText.slice(0, 200) });
      return;
    }

    var rows = await upsertRes.json();
    var row = Array.isArray(rows) ? rows[0] : rows;
    try {
      await fetch(SUPABASE_URL + '/rest/v1/cms_publish_log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SERVICE_KEY,
          Authorization: 'Bearer ' + SERVICE_KEY,
          Prefer: 'return=minimal'
        },
        body: JSON.stringify({
          cms_id: CMS_ROW_ID,
          build: (body.data && body.data.build) || '',
          source: 'studio-api'
        })
      });
    } catch (logErr) { /* ignore log errors */ }
    res.status(200).json({
      ok: true,
      updated_at: row && row.updated_at ? row.updated_at : new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ ok: false, reason: err.message || 'server_error' });
  }
};
