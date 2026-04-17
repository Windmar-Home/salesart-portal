import Solar from './Solar.jsx';
import RoofingClaims from './RoofingClaims.jsx';
import RoofingRetail from './RoofingRetail.jsx';
import EnergiaQueVale from './EnergiaQueVale.jsx';
import Powerwall from './Powerwall.jsx';
import ContactCard from './ContactCard.jsx';

export const TEMPLATE_FOR_PRODUCT = {
  solar_pr:       { component: Solar,          templateId: 'solar' },
  solar_fl:       { component: Solar,          templateId: 'solar' },
  roofing_claims: { component: RoofingClaims,  templateId: 'roofing_claims' },
  roofing_retail: { component: RoofingRetail,  templateId: 'roofing_retail' },
  eqv:            { component: EnergiaQueVale, templateId: 'eqv' },
  powerwall:      { component: Powerwall,      templateId: 'powerwall' },
  general:        { component: ContactCard,    templateId: 'contact_card' },
};

export const TEMPLATES = {
  solar:          Solar,
  roofing_claims: RoofingClaims,
  roofing_retail: RoofingRetail,
  eqv:            EnergiaQueVale,
  powerwall:      Powerwall,
  contact_card:   ContactCard,
};

export function resolveTemplate(productId) {
  return TEMPLATE_FOR_PRODUCT[productId] || TEMPLATE_FOR_PRODUCT.general;
}
