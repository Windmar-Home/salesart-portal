// Copy generator — server-side via /api/generate-copy (Anthropic), local fallback otherwise.
import { enforceVoice } from './voice.js';
import { FALLBACK_HEADLINES } from './fallback.js';

export async function generateHeadlines({ product, customer, channel, message, repName }) {
  try {
    const res = await fetch('/api/generate-copy', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ product, customer, channel, message, repName }),
    });
    if (!res.ok) throw new Error(`api ${res.status}`);
    const data = await res.json();
    return (data.options || []).map(o => ({
      headline: enforceVoice(o.headline),
      cta: enforceVoice(o.cta),
    })).slice(0, 3);
  } catch (e) {
    return localFallback({ product, customer, message }).map(o => ({
      headline: enforceVoice(o.headline),
      cta: enforceVoice(o.cta),
    }));
  }
}

function localFallback({ product, customer, message }) {
  const pool = FALLBACK_HEADLINES[product] || FALLBACK_HEADLINES.general;
  const variants = pool[customer] || pool.default;
  return variants.map(h => ({ headline: `${h} ${message ? '— ' + message : ''}`.trim(), cta: 'Habla con WindMar' }));
}
