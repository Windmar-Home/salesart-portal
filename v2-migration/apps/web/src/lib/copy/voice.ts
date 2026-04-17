/**
 * WindMar "Sin Cuentos" brand voice enforcement.
 * Rules: honest, concrete, no fluff, no superlatives, no exclamation spam.
 */

const BANNED: RegExp[] = [
  /\bel mejor\b/i, /\bincreíble\b/i, /\brevolucionario\b/i,
  /\búnico en el mundo\b/i, /\b#1\b/i, /\bnúmero uno\b/i,
  /!!+/g, /\?{2,}/g,
];

const trimFluff = (s: string): string =>
  s.replace(/^\s*(¡)?\s*/, '').replace(/\s+/g, ' ').trim();

export function enforceVoice(text: string): string {
  let out = trimFluff(String(text || ''));
  for (const rx of BANNED) out = out.replace(rx, '');
  return out.replace(/\s+/g, ' ').trim();
}

export function scoreVoice(text: string): 'pass' | 'needs_edit' {
  for (const rx of BANNED) if (rx.test(text)) return 'needs_edit';
  return 'pass';
}
