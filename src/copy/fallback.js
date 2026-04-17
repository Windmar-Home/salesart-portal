// Pre-written headlines when the Anthropic API is offline or in dev.
// Every line must pass the brand voice check — honest, concrete, no fluff.
export const FALLBACK_HEADLINES = {
  solar_pr: {
    savings:     ['Tu factura de LUMA no tiene que doler', 'Paga por tu sistema, no a LUMA'],
    resilience:  ['Tormenta llega, luz se queda', 'Tu casa no depende de LUMA'],
    hispanic_pr: ['Energía tuya, para tu familia', 'Lo que LUMA cobra, tú lo ahorras'],
    default:     ['Energía para tu casa — sin cuentos'],
  },
  solar_fl: {
    savings:     ['Tu factura de FPL puede ser $0', 'Paga tu sistema, no FPL'],
    resilience:  ['Solar + Powerwall: cero black-outs', 'Hurricane season ready'],
    default:     ['Solar para tu casa en Florida'],
  },
  roofing_claims: {
    insurance:   ['Tu claim fue negado — podemos ayudar', 'No esperes la carta de non-renewal'],
    resilience:  ['Tu techo aguantó — ahora documéntalo bien', 'Inspección gratis'],
    default:     ['Inspección de techo — gratis'],
  },
  roofing_retail: {
    resilience:  ['Built for Florida', '15 años de techo — es hora'],
    price:       ['Techo + financiamiento en 1 visita', 'Un pago, dos soluciones'],
    default:     ['Tu techo, construido para Florida'],
  },
  eqv: {
    new_home:    ['Agua limpia para tu familia', 'Instalación sin obra mayor'],
    default:     ['Agua que vale'],
  },
  powerwall: {
    resilience:  ['Cuando se va la luz, tu casa sigue', 'Respaldo 24/7 para tu casa'],
    savings:     ['Usa tu solar de noche también', 'Menos diesel, más Powerwall'],
    default:     ['Energía independiente'],
  },
  general: {
    default:     ['WindMar Home — Sin Cuentos'],
  },
};
