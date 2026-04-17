/**
 * Microsoft Graph helper — application (client-credentials) auth.
 * Token cached in module scope; Vercel keeps warm functions ~5min.
 */

interface CachedToken {
  value: string;
  expiresAt: number;
}

let cachedToken: CachedToken | null = null;

export async function getAppToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 60_000) return cachedToken.value;

  const tenant = process.env.MS_TENANT_ID;
  const clientId = process.env.MS_CLIENT_ID;
  const secret = process.env.MS_CLIENT_SECRET;
  if (!tenant || !clientId || !secret) throw new Error('MS_* env vars not set');

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: secret,
    scope: 'https://graph.microsoft.com/.default',
    grant_type: 'client_credentials',
  });

  const r = await fetch(`https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`graph_token_${r.status}: ${t.slice(0, 200)}`);
  }
  const j = (await r.json()) as { access_token: string; expires_in: number };
  cachedToken = {
    value: j.access_token,
    expiresAt: now + (j.expires_in - 60) * 1000,
  };
  return cachedToken.value;
}

export async function createGroupChat(opts: { topic: string; memberEmails: string[] }) {
  const token = await getAppToken();
  const body = {
    chatType: 'group',
    topic: opts.topic,
    members: opts.memberEmails.map(email => ({
      '@odata.type': '#microsoft.graph.aadUserConversationMember',
      roles: ['owner'],
      'user@odata.bind': `https://graph.microsoft.com/v1.0/users('${email}')`,
    })),
  };
  const r = await fetch('https://graph.microsoft.com/v1.0/chats', {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`graph_create_chat_${r.status}: ${t.slice(0, 300)}`);
  }
  return (await r.json()) as { id: string };
}

export async function sendChatMessage(opts: { chatId: string; text: string }) {
  const token = await getAppToken();
  const r = await fetch(`https://graph.microsoft.com/v1.0/chats/${opts.chatId}/messages`, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: JSON.stringify({ body: { contentType: 'text', content: opts.text } }),
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`graph_send_msg_${r.status}: ${t.slice(0, 300)}`);
  }
  return r.json();
}
