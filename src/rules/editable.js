// What a rep may edit per template. MVP: only identity fields.
// Extend this to phase-in role-based permissions (e.g. sales managers edit more).
export const EDITABLE_FIELDS = {
  solar:          ['repName', 'repPhone'],
  roofing_claims: ['repName', 'repPhone'],
  roofing_retail: ['repName', 'repPhone'],
  eqv:            ['repName', 'repPhone'],
  powerwall:      ['repName', 'repPhone'],
  contact_card:   ['repName', 'repPhone', 'repMarket', 'repProducts'],
};

export function canEdit(templateId, field) {
  const allowed = EDITABLE_FIELDS[templateId] || [];
  return allowed.includes(field);
}
