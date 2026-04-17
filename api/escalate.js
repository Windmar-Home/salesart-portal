// Vercel serverless function.
// Forwards escalation payload to n8n webhook that posts to Teams.
// In MOCK_TEAMS=1 mode, just logs and returns ok — no network call.
const RATE_LIMIT_PER_MIN = 5;
const rateMap = new Map(); // ip -> [timestamps]

function rateLimit(ip) {
  const now = Date.now();
  const windowStart = now - 60_000;
  const list = (rateMap.get(ip) || []).filter(t => t > windowStart);
  if (list.length >= RATE_LIMIT_PER_MIN) return false;
  list.push(now); rateMap.set(ip, list);
  return true;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'method' }); return; }

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
  if (!rateLimit(ip)) { res.status(429).json({ error: 'rate_limit' }); return; }

  const body = req.body || {};
  const required = ['repName', 'repPhone', 'product', 'customer', 'channel', 'message', 'headline'];
  for (const k of required) {
    if (typeof body[k] !== 'string' || body[k].length > 500) {
      res.status(400).json({ error: `invalid ${k}` }); return;
    }
  }

  const designer = process.env.ESCALATION_DESIGNER_EMAIL || 'jaime.diaz@windmarhome.com';
  const owner    = process.env.ESCALATION_OWNER_EMAIL    || 'miguel@windmarhome.com';

  const payload = {
    designerEmail: designer,
    ownerEmail: owner,
    rep: { name: body.repName, phone: body.repPhone, email: body.repEmail || null },
    art: {
      product: body.product, customer: body.customer,
      channel: body.channel, message: body.message,
      headline: body.headline,
    },
    text:
      `Jaime, ${body.repName} necesita ayuda con un arte.\n` +
      `Producto: ${body.product} · Cliente: ${body.customer} · Canal: ${body.channel}\n` +
      `Mensaje: ${body.message}\n` +
      `Headline base: "${body.headline}"\n` +
      `Contacto rep: ${body.repPhone}${body.repEmail ? ' · ' + body.repEmail : ''}`,
    ts: body.ts || new Date().toISOString(),
  };

  if (process.env.MOCK_TEAMS === '1') {
    console.log('[MOCK_TEAMS] escalate payload:', JSON.stringify(payload));
    res.status(200).json({ ok: true, mock: true });
    return;
  }

  const url = process.env.N8N_WEBHOOK_URL;
  if (!url) { res.status(500).json({ error: 'no_webhook' }); return; }

  try {
    // Align with windmar-home/teams-n8n-bridge (homie) auth pattern: X-Auth-Token
    const r = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(process.env.N8N_AUTH_TOKEN ? { 'x-auth-token': process.env.N8N_AUTH_TOKEN } : {}),
      },
      body: JSON.stringify(payload),
    });
    if (!r.ok) { res.status(502).json({ error: `webhook_${r.status}` }); return; }
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(502).json({ error: 'webhook_fail' });
  }
}
