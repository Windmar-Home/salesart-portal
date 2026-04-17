export const PRODUCTS = [
  { id: 'solar_pr',       label: 'Solar PR',        market: 'PR' },
  { id: 'solar_fl',       label: 'Solar FL',        market: 'FL' },
  { id: 'roofing_claims', label: 'Roofing Claims',  market: 'FL' },
  { id: 'roofing_retail', label: 'Roofing Retail',  market: 'FL' },
  { id: 'eqv',            label: 'Energía que Vale',market: 'PR' },
  { id: 'powerwall',      label: 'Powerwall',       market: 'PR/FL' },
  { id: 'general',        label: 'General',         market: 'PR/FL' },
];

export const productById = (id) => PRODUCTS.find(p => p.id === id);
