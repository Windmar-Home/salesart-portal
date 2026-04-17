// Vercel serverless function.
// Generates 3 headline+CTA options via Claude Haiku 4.5.
// Uses prompt caching on the brand voice system prompt (ephemeral 5-min cache).
import Anthropic from '@anthropic-ai/sdk';

const BRAND_VOICE_SYSTEM = [
  {
    type: 'text',
    text: [
      'Eres el generador de titulares para SalesArt Portal de WindMar Home.',
      'Voz: "Sin Cuentos" — directa, honesta, concreta. Español de Puerto Rico o Florida según mercado.',
      'Reglas:',
      '- Máximo 7 palabras por titular',
      '- Sin superlativos ("el mejor", "increíble", "#1", "único")',
      '- Sin signos de exclamación múltiples',
      '- Sin emoji en titulares',
      '- Concreto, no genérico: habla de dinero, tiempo, factura, tormenta, techo, seguro',
      '- CTA de 2-4 palabras, imperativo',
      'Output: JSON estricto con forma { "options": [ { "headline": "...", "cta": "..." }, ... ] } — 3 opciones.',
    ].join('\n'),
    cache_control: { type: 'ephemeral' },
  },
];

const FALLBACK = {
  options: [
    { headline: 'WindMar Home — Sin Cuentos', cta: 'Habla con un rep' },
    { headline: 'Construido para tu casa',    cta: 'Pide tu cotización' },
    { headline: 'Energía que vale',           cta: 'Agenda una visita' },
  ],
};

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'method' }); return; }

  const { product, customer, channel, message, repName } = req.body || {};
  for (const v of [product, customer, channel, message]) {
    if (typeof v !== 'string' || v.length > 200) {
      res.status(400).json({ error: 'invalid input' }); return;
    }
  }

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) { res.status(200).json(FALLBACK); return; }

  try {
    const client = new Anthropic({ apiKey: key });
    const user = [
      `Producto: ${product}`,
      `Tipo de cliente: ${customer}`,
      `Canal: ${channel}`,
      `Mensaje clave: ${message}`,
      `Rep: ${repName || 'N/A'}`,
      '',
      'Genera 3 opciones de { headline, cta } alineadas al mensaje clave y al tipo de cliente. Responde SOLO con el JSON.',
    ].join('\n');

    const resp = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      system: BRAND_VOICE_SYSTEM,
      messages: [{ role: 'user', content: user }],
    });

    const text = (resp.content?.[0]?.text || '').trim();
    const parsed = safeJson(text);
    if (!parsed?.options?.length) { res.status(200).json(FALLBACK); return; }
    res.status(200).json({ options: parsed.options.slice(0, 3) });
  } catch (e) {
    res.status(200).json(FALLBACK);
  }
}

function safeJson(s) {
  try { return JSON.parse(s); } catch {}
  const m = s.match(/\{[\s\S]*\}/);
  if (m) { try { return JSON.parse(m[0]); } catch {} }
  return null;
}
