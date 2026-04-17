// Client that posts escalation payload to /api/escalate.
// The serverless function forwards to n8n webhook with shared secret.
export async function escalate({ intake, channelId, headline }) {
  const res = await fetch('/api/escalate', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      repName:  intake.repName,
      repPhone: intake.repPhone,
      repEmail: intake.repEmail,
      product:  intake.product,
      customer: intake.customer,
      channel:  channelId,
      message:  intake.message,
      headline,
      ts: new Date().toISOString(),
    }),
  });
  if (!res.ok) throw new Error(`escalate ${res.status}`);
  return res.json();
}
