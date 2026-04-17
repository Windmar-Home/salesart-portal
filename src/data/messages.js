// Pre-approved key messages per product. Q4 of the intake.
// Rep cannot type free text — only selects from this list.
export const KEY_MESSAGES = {
  solar_pr: [
    'Ahorra en tu factura de LUMA',
    'Independencia energética',
    'Powerwall incluido',
    'Solar + Roofing juntos',
  ],
  solar_fl: [
    'Ahorra en tu factura de FPL',
    'Independencia energética',
    'Powerwall incluido',
    'Solar + Roofing juntos',
  ],
  roofing_claims: [
    'Tu claim fue negado — tenemos la solución',
    'No esperes la carta de non-renewal',
    'Inspección gratis',
  ],
  roofing_retail: [
    'Built for Florida',
    'Tu techo cumple 15 años — es hora',
    'Techo + solar en un solo pago',
  ],
  eqv: [
    'Agua pura para tu familia',
    'Salud desde la llave',
    'Tecnología para todo el hogar',
  ],
  powerwall: [
    'Energía que no se va con la tormenta',
    'Independencia energética total',
    'Respaldo 24/7 para tu casa',
  ],
  general: [
    'Construido para tu casa',
    'WindMar Home — Sin Cuentos',
  ],
};

export const messagesFor = (productId) => KEY_MESSAGES[productId] || KEY_MESSAGES.general;
