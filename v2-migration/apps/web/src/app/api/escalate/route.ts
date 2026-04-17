/**
 * POST /api/escalate
 *
 * Creates a Teams group chat + sends the escalation message.
 * Transport priority:
 *   1. MOCK_TEAMS=1           → log + return ok
 *   2. MS_* set               → Microsoft Graph direct
 *   3. N8N_WEBHOOK_URL set    → fallback n8n forward
 *   4. else                   → 500 no_transport
 *
 * In-memory rate limit: 5 req/min per IP.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createGroupChat, sendChatMessage } from '@/lib/graph/client';

export const runtime = 'nodejs';

const RATE_LIMIT_PER_MIN = 5;
const rateMap = new Map<string, number[]>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - 60_000;
  const list = (rateMap.get(ip) ?? []).filter(t => t > windowStart);
  if (list.length >= RATE_LIMIT_PER_MIN) return false;
  list.push(now);
  rateMap.set(ip, list);
  return true;
}

interface EscalateBody {
  repName: string;
  repPhone: string;
  repEmail?: string;
  product: string;
  customer: string;
  channel: string;
  message: string;
  headline: string;
  ts?: string;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: 'rate_limit' }, { status: 429 });
  }

  const body = (await req.json().catch(() => null)) as EscalateBody | null;
  if (!body) return NextResponse.json({ error: 'invalid_body' }, { status: 400 });

  const required: (keyof EscalateBody)[] = ['repName', 'repPhone', 'product', 'customer', 'channel', 'message', 'headline'];
  for (const k of required) {
    const v = body[k];
    if (typeof v !== 'string' || v.length > 500) {
      return NextResponse.json({ error: `invalid_${k}` }, { status: 400 });
    }
  }

  const designer = process.env.ESCALATION_DESIGNER_EMAIL ?? 'jaime.diaz@windmarhome.com';
  const owner    = process.env.ESCALATION_OWNER_EMAIL    ?? 'miguel@windmarhome.com';
  const repEmail = body.repEmail && /@/.test(body.repEmail) ? body.repEmail.trim().toLowerCase() : null;

  const memberEmails = [...new Set([designer, owner, repEmail].filter(Boolean))] as string[];
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
    return NextResponse.json({ ok: true, transport: 'mock' });
  }

  // 2. Microsoft Graph direct
  if (process.env.MS_TENANT_ID && process.env.MS_CLIENT_ID && process.env.MS_CLIENT_SECRET) {
    try {
      const chat = await createGroupChat({ topic, memberEmails });
      await sendChatMessage({ chatId: chat.id, text });
      return NextResponse.json({ ok: true, transport: 'graph', chatId: chat.id });
    } catch (e) {
      const detail = e instanceof Error ? e.message : 'unknown';
      console.error('graph escalate failed:', detail);
      if (!process.env.N8N_WEBHOOK_URL) {
        return NextResponse.json({ error: 'graph_fail', detail: detail.slice(0, 200) }, { status: 502 });
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
          designerEmail: designer, ownerEmail: owner,
          rep: { name: body.repName, phone: body.repPhone, email: repEmail },
          art: {
            product: body.product, customer: body.customer,
            channel: body.channel, message: body.message, headline: body.headline,
          },
          text, topic, ts: body.ts ?? new Date().toISOString(),
        }),
      });
      if (!r.ok) return NextResponse.json({ error: `webhook_${r.status}` }, { status: 502 });
      return NextResponse.json({ ok: true, transport: 'n8n' });
    } catch {
      return NextResponse.json({ error: 'webhook_fail' }, { status: 502 });
    }
  }

  return NextResponse.json({ error: 'no_transport' }, { status: 500 });
}
