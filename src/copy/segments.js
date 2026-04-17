// Default customer segment recommendation per product.
// Replaces the "analytics + targeting" responsibility in the spec.
const DEFAULTS = {
  solar_pr:       'savings',
  solar_fl:       'savings',
  roofing_claims: 'insurance',
  roofing_retail: 'resilience',
  eqv:            'new_home',
  powerwall:      'resilience',
  general:        'savings',
};

export function defaultCustomerFor(productId) {
  return DEFAULTS[productId] || 'savings';
}
