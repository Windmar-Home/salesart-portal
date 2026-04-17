// Vercel serverless function.
// Escalation priority:
//   1. MOCK_TEAMS=1           -> log payload, return ok:true
//   2. MS_TENANT_ID/etc set   -> call Microsoft Graph directly (create chat + send message)
//   3. N8N_WEBHOOK_URL set    -> forward to n8n workflow (windmar-home homie pattern)
//   4. None                   -> 500 no_transport
//
// Rate-limited 5 req/min per IP.
import { createGroupChat, sendChatMessage } from './_lib/graphClient.js';

const RATE_LIMIT_PER_MIN = 5;
const rateMap = new Map();

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
  const repEmail = body.repEmail && /@/.test(body.repEmail) ? body.repEmail.trim().toLowerCase() : null;

  const memberEmails = [...new Set([designer, owner, repEmail].filter(Boolean))];
  const topic = `SalesArt — ${body.repName}`;
  const text =
    `${designer.split('@')[0]}, ${body.repName} necesita ayuda con un arte.\n` +
    `Producto: ${body.product} · Cliente: ${body.customer} · Canal: ${body.channel}\n` +
    `Mensaje: ${body.message}\n` +
    `Headline base: "${body.headline}"\n` +
    `Contacto rep: ${body.repPhone}${repEmail ? ' · ' + repEmail : ''}`;

  // 1. Mock
  if (process.env.MOCK_TEAMS === '1') {
    console.log('[MOCK_TEAMS] escalate:', JSON.stringify({ topic, memberEmails, text }));
    res.status(200).json({ ok: true, transport: 'mock' });
    return;
  }

  // 2. Microsoft Graph direct
  if (process.env.MS_TENANT_ID && process.env.MS_CLIENT_ID && process.env.MS_CLIENT_SECRET) {
    try {
      const chat = await createGroupChat({ topic, memberEmails });
      await sendChatMessage({ chatId: chat.id, text });
      res.status(200).json({ ok: true, transport: 'graph', chatId: chat.id });
      return;
    } catch (e) {
      console.error('graph escalate failed:', e.message);
      // fall through to n8n if configured, else error
      if (!process.env.N8N_WEBHOOK_URL) {
        res.status(502).json({ error: 'graph_fail', detail: e.message.slice(0, 200) });
        return;
      }
    }
  }

  // 3. n8n webhook
  if (process.env.N8N_WEBHOOK_URL) {
    try {
      const r = await fetch(process.env.N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          ...(process.env.N8N_AUTH_TOKEN ? { 'x-auth-token': process.env.N8N_AUTH_TOKEN } : {}),
        },
        body: JSON.stringify({
          designerEmail: designer,
          ownerEmail: owner,
          rep: { name: body.repName, phone: body.repPhone, email: repEmail },
          art: {
            product: body.product, customer: body.customer,
            channel: body.channel, message: body.message, headline: body.headline,
          },
          text, topic, ts: body.ts || new Date().toISOString(),
        }),
      });
      if (!r.ok) { res.status(502).json({ error: `webhook_${r.status}` }); return; }
      res.status(200).json({ ok: true, transport: 'n8n' });
      return;
    } catch (e) {
      res.status(502).json({ error: 'webhook_fail' });
      return;
    }
  }

  // 4. No transport configured
  res.status(500).json({ error: 'no_transport' });
}
