import { PRODUCTS } from '../data/products.js';
import { CUSTOMERS } from '../data/customers.js';
import { CHANNELS } from '../data/channels.js';
import { messagesFor } from '../data/messages.js';

export const QUESTIONS = [
  {
    id: 'product',
    title: '¿Para qué producto es este arte?',
    sub: 'Escoge uno. No se puede cambiar después sin reiniciar.',
    options: () => PRODUCTS.map(p => ({ value: p.id, label: p.label, meta: p.market })),
  },
  {
    id: 'customer',
    title: '¿A qué tipo de cliente va dirigido?',
    sub: 'Esto ajusta el tono del mensaje.',
    options: () => CUSTOMERS.map(c => ({ value: c.id, label: c.label })),
  },
  {
    id: 'channel',
    title: '¿Para qué canal es el arte?',
    sub: 'MVP: Instagram Feed, Story, o PDF.',
    options: () => CHANNELS.map(ch => ({ value: ch.id, label: ch.label, meta: `${ch.width}×${ch.height}` })),
  },
  {
    id: 'message',
    title: '¿Cuál es el mensaje clave?',
    sub: 'Opciones pre-aprobadas. No se escribe texto libre.',
    options: (state) => messagesFor(state.product).map(m => ({ value: m, label: m })),
  },
];
