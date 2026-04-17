/**
 * Intake specification — shared between web and worker.
 * Ported from Windmar-Home/salesart-portal src/data/*.js.
 *
 * The 4-question intake has fixed enums. Reps pick from this list only,
 * no free text. Rules engine references these IDs.
 */

export type Region = 'PR' | 'FL';

export type ProductId =
  | 'solar_pr'
  | 'solar_fl'
  | 'roofing_claims'
  | 'roofing_retail'
  | 'eqv'
  | 'powerwall'
  | 'general';

export type CustomerSegmentId =
  | 'savings'
  | 'resilience'
  | 'price'
  | 'insurance'
  | 'new_home'
  | 'hispanic_pr';

export type ChannelId =
  | 'ig_feed'
  | 'ig_story'
  | 'whatsapp'
  | 'facebook'
  | 'pdf';

export type ChannelKind = 'png' | 'pdf';
export type ChannelOrientation = 'square' | 'vertical' | 'horizontal';

export interface Product {
  id: ProductId;
  label: string;
  market: 'PR' | 'FL' | 'PR/FL';
}

export interface CustomerSegment {
  id: CustomerSegmentId;
  label: string;
}

export interface Channel {
  id: ChannelId;
  label: string;
  width: number;
  height: number;
  kind: ChannelKind;
  orientation: ChannelOrientation;
}

export const PRODUCTS: Product[] = [
  { id: 'solar_pr',       label: 'Solar PR',         market: 'PR'    },
  { id: 'solar_fl',       label: 'Solar FL',         market: 'FL'    },
  { id: 'roofing_claims', label: 'Roofing Claims',   market: 'FL'    },
  { id: 'roofing_retail', label: 'Roofing Retail',   market: 'FL'    },
  { id: 'eqv',            label: 'Energía que Vale', market: 'PR'    },
  { id: 'powerwall',      label: 'Powerwall',        market: 'PR/FL' },
  { id: 'general',        label: 'General',          market: 'PR/FL' },
];

export const CUSTOMER_SEGMENTS: CustomerSegment[] = [
  { id: 'savings',     label: 'Homeowner — ahorro en factura' },
  { id: 'resilience',  label: 'Homeowner — resiliencia / tormentas' },
  { id: 'price',       label: 'Price shopper' },
  { id: 'insurance',   label: 'Problema de seguro' },
  { id: 'new_home',    label: 'Nuevo homeowner' },
  { id: 'hispanic_pr', label: 'Comunidad hispana / PR' },
];

export const CHANNELS: Channel[] = [
  { id: 'ig_feed',  label: 'Instagram Feed',  width: 1080, height: 1080, kind: 'png', orientation: 'square'     },
  { id: 'ig_story', label: 'Instagram Story', width: 1080, height: 1920, kind: 'png', orientation: 'vertical'   },
  { id: 'whatsapp', label: 'WhatsApp',        width: 1080, height: 1920, kind: 'png', orientation: 'vertical'   },
  { id: 'facebook', label: 'Facebook',        width: 1200, height: 630,  kind: 'png', orientation: 'horizontal' },
  { id: 'pdf',      label: 'PDF (Letter)',    width: 816,  height: 1056, kind: 'pdf', orientation: 'vertical'   },
];

/**
 * Pre-approved key messages per product. Q4 of the intake.
 * Reps cannot type free text — only select from this list.
 */
export const KEY_MESSAGES: Record<ProductId, string[]> = {
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

export const productById = (id: ProductId): Product | undefined =>
  PRODUCTS.find(p => p.id === id);

export const channelById = (id: ChannelId): Channel | undefined =>
  CHANNELS.find(c => c.id === id);

export const messagesFor = (productId: ProductId): string[] =>
  KEY_MESSAGES[productId] ?? KEY_MESSAGES.general;

/**
 * Default customer segment per product — drives Q2 pre-selection.
 * Replaces the segment/targeting responsibility.
 */
const DEFAULT_SEGMENT_BY_PRODUCT: Record<ProductId, CustomerSegmentId> = {
  solar_pr:       'savings',
  solar_fl:       'savings',
  roofing_claims: 'insurance',
  roofing_retail: 'resilience',
  eqv:            'new_home',
  powerwall:      'resilience',
  general:        'savings',
};

export function defaultSegmentFor(productId: ProductId): CustomerSegmentId {
  return DEFAULT_SEGMENT_BY_PRODUCT[productId] ?? 'savings';
}
