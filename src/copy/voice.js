// WindMar "Sin Cuentos" brand voice enforcement.
// Rules: honest, concrete, no fluff, no superlatives, no exclamation spam.
const BANNED = [
  /\bel mejor\b/i, /\bincreíble\b/i, /\brevolucionario\b/i,
  /\búnico en el mundo\b/i, /\b#1\b/i, /\bnúmero uno\b/i,
  /!!+/g, /\?{2,}/g,
];

const TRIM_FLUFF = (s) =>
  s
    .replace(/^\s*(¡)?\s*/, '')
    .replace(/\s+/g, ' ')
    .trim();

export function enforceVoice(text) {
  let out = TRIM_FLUFF(String(text || ''));
  for (const rx of BANNED) out = out.replace(rx, '');
  out = out.replace(/\s+/g, ' ').trim();
  return out;
}

export function scoreVoice(text) {
  let hits = 0;
  for (const rx of BANNED) if (rx.test(text)) hits++;
  return hits === 0 ? 'pass' : 'needs_edit';
}
