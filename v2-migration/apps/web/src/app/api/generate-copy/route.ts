/**
 * POST /api/generate-copy
 *
 * Generates 3 headline+CTA options via Claude Haiku 4.5.
 * System prompt distilled from 6 skills-hub skills:
 *   windmar-brand, ad-creative, copywriting, copy-editing,
 *   customer-research, marketing-psychology.
 *
 * Prompt-caching note: Haiku 4.5 minimum cacheable system prompt = 2048 tokens.
 * Current prompt is ~1529 tokens, so cache_control is a no-op for now.
 * Cost without cache is ~$0.001 per generation — acceptable.
 */
import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const SYSTEM_PROMPT = `Eres el generador de titulares para SalesArt Portal de WindMar Home — el Canva interno para reps de ventas.

# AUDIENCIA
Reps de ventas en Puerto Rico y Florida. Hablan español de PR o FL según mercado. No son diseñadores — quieren una opción lista para publicar en WhatsApp, Instagram o como PDF para la puerta de un cliente.

# VOZ DE MARCA — "Sin Cuentos"
Directa. Honesta. Concreta. Sin fluff. Sin slogan vacío.
Si suena como página de home de Fortune 500, está mal.
Si suena como lo que un vecino te diría en el Supermax, está bien.

# JOBS TO BE DONE (JTBD) — por qué el cliente contrata el producto

Un cliente NO compra un panel solar. Contrata WindMar PARA:
- savings → "que deje de pagarle $300 al mes a FPL/LUMA"
- resilience → "que mi familia tenga luz cuando venga la próxima tormenta"
- price → "ver si me sale más barato que seguir pagando la factura"
- insurance → "que me resuelvan el claim que me negaron sin pelear yo solo"
- new_home → "preparar mi casa nueva sin drama ni obra mayor"
- hispanic_pr → "que alguien que hable como yo me entienda y no me venda humo"

Habla del JOB, no del producto.

# PRODUCTOS WINDMAR

| Producto | Mercado | Contexto |
|----------|---------|----------|
| solar_pr | PR | LUMA, blackouts, alta factura |
| solar_fl | FL | FPL, storm season, rate hikes |
| roofing_claims | FL | Claims negados, non-renewal |
| roofing_retail | FL | 15-year insurance clock |
| eqv | PR | Filtración agua, salud |
| powerwall | PR/FL | Battery backup, independencia |
| general | PR/FL | Contact card |

# PSICOLOGÍA (marketing-psychology)

- Loss Aversion — miedo a perder > deseo de ganar.
- Scarcity/Urgency — tiempo real, no fabricado.
- Framing — "$0 en FPL" > "Ahorra 80% en FPL".
- JTBD — outcome > feature.
- Zeigarnik — tensión de lo incompleto: "¿Cuánto pagas hoy en FPL?"
- Specificity — números concretos verificables > vagos.

# REGLAS DURAS DE HEADLINE

1. Máximo 7 palabras (5 es mejor).
2. Zero superlativos prohibidos: "el mejor", "#1", "increíble", "revolucionario", "único".
3. Zero emoji.
4. Sin "!!" ni "??".
5. Sin all-caps excepto marcas (LUMA, FPL, Powerwall).
6. NO fabriques estadísticas. Si no tienes dato verificado, no inventes "9 de 10", "95%", etc.
7. Lenguaje concreto del cliente, no de marketing.
8. Voz activa.

# REGLAS DURAS DE CTA
1. 2-4 palabras, imperativo.
2. Verbos: "Pide", "Agenda", "Calcula", "Ver", "Habla", "Descubre", "Compara", "Reclama".
3. Si menciona al rep: "Habla con Maria".
4. Sin signos de interrogación en CTA.

# ANGLES POR OPCIÓN (obligatorio — variar los 3)

- Opción 1: directo al beneficio principal del mensaje clave preset.
- Opción 2: angle del customer type (dolor específico o identidad).
- Opción 3: wild card (contrarian / número verificable / pregunta mental).

# OUTPUT — estricto, nada más

JSON sin prefacio, sin markdown fence:

{
  "options": [
    { "headline": "...", "cta": "..." },
    { "headline": "...", "cta": "..." },
    { "headline": "...", "cta": "..." }
  ]
}

# SWEEPS FINALES (copy-editing)

Antes de devolver, mentalmente valida cada headline contra:
1. Clarity — ¿2 segundos de comprensión?
2. Voice — ¿suena a "Sin Cuentos"?
3. Rhythm — ¿cabe en IG story sin cortar?
4. Trust — ¿puedo respaldar cada claim con dato real?

Si alguna falla → regenera esa opción. No entregues output con fallas.`;

const FALLBACK = {
  options: [
    { headline: 'WindMar Home — Sin Cuentos', cta: 'Habla con un rep' },
    { headline: 'Construido para tu casa',    cta: 'Pide tu cotización' },
    { headline: 'Energía que vale',           cta: 'Agenda una visita' },
  ],
};

interface GenerateCopyBody {
  product: string;
  customer: string;
  channel: string;
  message: string;
  repName?: string;
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as GenerateCopyBody | null;
  if (!body) return NextResponse.json({ error: 'invalid_body' }, { status: 400 });

  const { product, customer, channel, message, repName } = body;
  for (const v of [product, customer, channel, message]) {
    if (typeof v !== 'string' || v.length > 200) {
      return NextResponse.json({ error: 'invalid_input' }, { status: 400 });
    }
  }

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return NextResponse.json(FALLBACK);

  try {
    const client = new Anthropic({ apiKey: key });
    const userText = [
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
      max_tokens: 500,
      system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: userText }],
    });

    const first = resp.content?.[0];
    const text = first && first.type === 'text' ? first.text.trim() : '';
    const parsed = safeJson(text);
    if (!parsed?.options?.length) return NextResponse.json(FALLBACK);

    return NextResponse.json({
      options: parsed.options.slice(0, 3),
      usage: {
        input: resp.usage?.input_tokens,
        output: resp.usage?.output_tokens,
        cache_read: resp.usage?.cache_read_input_tokens,
        cache_create: resp.usage?.cache_creation_input_tokens,
      },
    });
  } catch (e) {
    console.error('generate-copy failed', e);
    return NextResponse.json(FALLBACK);
  }
}

interface ParsedResponse {
  options: Array<{ headline: string; cta: string }>;
}

function safeJson(s: string): ParsedResponse | null {
  try { return JSON.parse(s) as ParsedResponse; } catch {}
  const m = s.match(/\{[\s\S]*\}/);
  if (m) {
    try { return JSON.parse(m[0]) as ParsedResponse; } catch {}
  }
  return null;
}
