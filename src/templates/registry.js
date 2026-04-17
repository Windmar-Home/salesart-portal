import Solar from './Solar.jsx';
import RoofingClaims from './RoofingClaims.jsx';

// Map product → template component.
// Phase 2 adds RoofingRetail, EQV, Powerwall, ContactCard.
export const TEMPLATE_FOR_PRODUCT = {
  solar_pr:       { component: Solar,          templateId: 'solar' },
  solar_fl:       { component: Solar,          templateId: 'solar' },
  roofing_claims: { component: RoofingClaims,  templateId: 'roofing_claims' },
  // Fallbacks to Solar for MVP; phase 2 will add the real ones.
  roofing_retail: { component: Solar,          templateId: 'roofing_retail' },
  eqv:            { component: Solar,          templateId: 'eqv' },
  powerwall:      { component: Solar,          templateId: 'powerwall' },
  general:        { component: Solar,          templateId: 'solar' },
};

export function resolveTemplate(productId) {
  return TEMPLATE_FOR_PRODUCT[productId] || TEMPLATE_FOR_PRODUCT.general;
}
