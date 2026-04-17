/**
 * Rules engine — what a rep may edit per template.
 * MVP: only identity fields (name, phone).
 * Contact Card allows market + products listing.
 *
 * Future: role-based expansion (sales managers edit more).
 */
type TemplateId =
  | 'solar'
  | 'roofing_claims'
  | 'roofing_retail'
  | 'eqv'
  | 'powerwall'
  | 'contact_card';

type EditableField = 'repName' | 'repPhone' | 'repMarket' | 'repProducts';

export const EDITABLE_FIELDS: Record<TemplateId, EditableField[]> = {
  solar:          ['repName', 'repPhone'],
  roofing_claims: ['repName', 'repPhone'],
  roofing_retail: ['repName', 'repPhone'],
  eqv:            ['repName', 'repPhone'],
  powerwall:      ['repName', 'repPhone'],
  contact_card:   ['repName', 'repPhone', 'repMarket', 'repProducts'],
};

export function canEdit(templateId: TemplateId, field: EditableField): boolean {
  return (EDITABLE_FIELDS[templateId] ?? []).includes(field);
}
