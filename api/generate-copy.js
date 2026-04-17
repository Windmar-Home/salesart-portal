// Vercel serverless function.
// Generates 3 headline+CTA options via Claude Haiku 4.5.
// System prompt distilled from skills-hub: windmar-brand + ad-creative + copywriting + copy-editing.
// Ephemeral cache on the system prompt → first call primes, subsequent calls hit cache for ~90% cost drop.
import Anthropic from '@anthropic-ai/sdk';

const SYSTEM_PROMPT = `Eres el generador de titulares para SalesArt Portal de WindMar Home — el Canva interno para reps de ventas.

# VOZ DE MARCA (Sin Cuentos)
Directa. Honesta. Concreta. Sin fluff. Español de Puerto Rico o Florida según mercado.
- Claridad sobre creatividad
- Beneficio sobre feature
- Específico sobre vago ("$0 en FPL" no "ahorros significativos")
- Voz activa sobre pasiva
- Confiado, sin calificadores ("casi", "muy", "realmente")
- Honesto — no fabriques stats ni testimonios

# PRODUCTOS WINDMAR
- solar_pr / solar_fl — Solar residencial (LUMA en PR, FPL en FL)
- roofing_claims — Reclamos de seguro de techo negados
- roofing_retail — Instalación de techo residencial, 15-year clock
- eqv (Energía que Vale) — Filtración de agua
- powerwall — Tesla Powerwall, storm resilience, independencia energética
- general — Contact card del rep

# ANGLES POR TIPO DE CLIENTE
- savings → dinero, factura, número concreto
- resilience → tormenta, black-out, respaldo
- price → comparación de pago, financiamiento
- insurance → claim, non-renewal, carta negada
- new_home → instalación, nuevo, sin obra
- hispanic_pr → familia, comunidad, español directo

# REGLAS DE HEADLINE
- Máximo 7 palabras
- Sin superlativos prohibidos: "el mejor", "#1", "increíble", "revolucionario", "único"
- Sin emoji
- Sin exclamaciones múltiples
- Sin all-caps
- Incluye número si aplica (dinero, tiempo, años)

# REGLAS DE CTA
- 2-4 palabras, imperativo
- Verbo concreto: "Pide", "Agenda", "Calcula", "Ver", "Habla", "Descubre"
- NO "Learn more", NO "Click here"

# OUTPUT
JSON estricto, nada más. Forma:
{ "options": [ { "headline": "...", "cta": "..." }, { "headline": "...", "cta": "..." }, { "headline": "...", "cta": "..." } ] }

Genera 3 opciones que varíen el angle (no solo word choice):
- Opción 1: directo al beneficio principal del mensaje clave
- Opción 2: angle del customer type (dolor, urgencia, o identidad)
- Opción 3: wild card — contrarian, número específico, o pregunta`;

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
      `Mensaje clave (preset): ${message}`,
      `Rep: ${repName || 'N/A'}`,
      '',
      'Responde SOLO con el JSON.',
    ].join('\n');

    const resp = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: user }],
    });

    const text = (resp.content?.[0]?.text || '').trim();
    const parsed = safeJson(text);
    if (!parsed?.options?.length) { res.status(200).json(FALLBACK); return; }
    res.status(200).json({
      options: parsed.options.slice(0, 3),
      usage: {
        input: resp.usage?.input_tokens,
        output: resp.usage?.output_tokens,
        cache_read: resp.usage?.cache_read_input_tokens,
        cache_create: resp.usage?.cache_creation_input_tokens,
      },
    });
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
