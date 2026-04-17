import { enforceVoice } from './voice';
import { FALLBACK_HEADLINES } from './fallback';
import type { ProductId, CustomerSegmentId, ChannelId } from '@salesarts/shared/intake-spec.types';

export interface GenerateInput {
  product: ProductId;
  customer: CustomerSegmentId;
  channel: ChannelId;
  message: string;
  repName?: string;
}

export interface HeadlineOption {
  headline: string;
  cta: string;
}

export interface GenerateResult {
  options: HeadlineOption[];
  usage?: {
    input?: number;
    output?: number;
    cache_read?: number;
    cache_create?: number;
  };
}

/**
 * Client-side wrapper. Calls /api/generate-copy and applies voice enforcement.
 * Falls back to local headlines if the API is unreachable.
 */
export async function generateHeadlines(input: GenerateInput): Promise<HeadlineOption[]> {
  try {
    const res = await fetch('/api/generate-copy', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error(`api ${res.status}`);
    const data: GenerateResult = await res.json();
    return (data.options ?? []).slice(0, 3).map(o => ({
      headline: enforceVoice(o.headline),
      cta: enforceVoice(o.cta),
    }));
  } catch {
    return localFallback(input).map(o => ({
      headline: enforceVoice(o.headline),
      cta: enforceVoice(o.cta),
    }));
  }
}

function localFallback({ product, customer, message }: GenerateInput): HeadlineOption[] {
  const pool = FALLBACK_HEADLINES[product] ?? FALLBACK_HEADLINES.general;
  const variants = pool[customer] ?? pool.default;
  return variants.map(h => ({
    headline: `${h}${message ? ' — ' + message : ''}`.trim(),
    cta: 'Habla con WindMar',
  }));
}
