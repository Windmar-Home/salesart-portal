/**
 * /[region]/[id]/quick — Quick intake mode for sales reps.
 *
 * 4-question intake → preset message → 3 AI-generated headline options →
 * submit to Placid via SalesArt-API → poll NotificationSocket for render done →
 * show result + download + optional escalation to Jaime.
 *
 * For the full Placid editor flow, see /[region]/[id]/arts (existing).
 */
'use client';

import { useMemo, useState, useTransition } from 'react';
import { useParams } from 'next/navigation';
import {
  PRODUCTS, CUSTOMER_SEGMENTS, CHANNELS, messagesFor, defaultSegmentFor,
  type ProductId, type CustomerSegmentId, type ChannelId,
} from '@salesarts/shared/intake-spec.types';
import { generateHeadlines, type HeadlineOption } from '@/lib/copy/generate';

interface IntakeState {
  product: ProductId | null;
  customer: CustomerSegmentId | null;
  channel: ChannelId | null;
  message: string | null;
  repName: string;
  repPhone: string;
  repEmail: string;
}

const INIT: IntakeState = {
  product: null, customer: null, channel: null, message: null,
  repName: '', repPhone: '', repEmail: '',
};

export default function QuickPage() {
  const { region, id } = useParams<{ region: string; id: string }>();
  const [step, setStep] = useState(0);
  const [state, setState] = useState<IntakeState>(INIT);
  const [options, setOptions] = useState<HeadlineOption[] | null>(null);
  const [picked, setPicked] = useState(0);
  const [, startTransition] = useTransition();

  const messages = useMemo(
    () => (state.product ? messagesFor(state.product) : []),
    [state.product],
  );

  const questions = [
    {
      title: '¿Para qué producto es este arte?',
      sub: 'Escoge uno. No se puede cambiar después sin reiniciar.',
      options: PRODUCTS.map(p => ({ value: p.id, label: p.label, meta: p.market })),
      onPick: (value: string) => {
        const product = value as ProductId;
        const customer = state.customer ?? defaultSegmentFor(product);
        setState(s => ({ ...s, product, customer }));
      },
      selected: state.product,
    },
    {
      title: '¿A qué tipo de cliente va dirigido?',
      sub: 'Esto ajusta el tono del mensaje.',
      options: CUSTOMER_SEGMENTS.map(c => ({ value: c.id, label: c.label })),
      onPick: (value: string) => setState(s => ({ ...s, customer: value as CustomerSegmentId })),
      selected: state.customer,
    },
    {
      title: '¿Para qué canal es el arte?',
      sub: 'Usamos esto para el formato y dimensiones correctas.',
      options: CHANNELS.map(ch => ({ value: ch.id, label: ch.label, meta: `${ch.width}×${ch.height}` })),
      onPick: (value: string) => setState(s => ({ ...s, channel: value as ChannelId })),
      selected: state.channel,
    },
    {
      title: '¿Cuál es el mensaje clave?',
      sub: 'Opciones pre-aprobadas. No se escribe texto libre.',
      options: messages.map(m => ({ value: m, label: m })),
      onPick: (value: string) => setState(s => ({ ...s, message: value })),
      selected: state.message,
    },
  ];

  const onIntakePick = (value: string, onPick: (v: string) => void) => {
    onPick(value);
    setTimeout(() => setStep(s => s + 1), 150);
  };

  const onSubmitRep = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!state.repName.trim() || !state.repPhone.trim()) return;
    if (!state.product || !state.customer || !state.channel || !state.message) return;
    startTransition(async () => {
      const opts = await generateHeadlines({
        product: state.product!,
        customer: state.customer!,
        channel: state.channel!,
        message: state.message!,
        repName: state.repName,
      });
      setOptions(opts);
      setPicked(0);
      setStep(questions.length + 1);
    });
  };

  // Phases: 0..3 = questions, 4 = rep form, 5 = preview
  const isRepForm = step === questions.length;
  const isPreview = step > questions.length && options;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#F7F9FC] to-[#ECF1F9] p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-xl">
        {/* Progress */}
        <div className="mb-6 flex gap-1.5">
          {Array.from({ length: questions.length + 1 }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full ${
                i < step ? 'bg-[#1D429B]' :
                i === step ? 'bg-[#F89B24]' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        {!isRepForm && !isPreview && (
          <>
            <h1 className="mb-2 text-2xl font-black leading-tight">{questions[step].title}</h1>
            <p className="mb-6 text-sm text-slate-500">{questions[step].sub}</p>
            <div className="grid gap-2">
              {questions[step].options.map(o => (
                <button
                  key={o.value}
                  onClick={() => onIntakePick(o.value, questions[step].onPick)}
                  className={`rounded-xl border-2 p-4 text-left font-semibold transition ${
                    questions[step].selected === o.value
                      ? 'border-[#1D429B] bg-[#ECF1F9]'
                      : 'border-slate-200 hover:border-[#A6C3E6] hover:bg-slate-50'
                  }`}
                >
                  <div>{o.label}</div>
                  {'meta' in o && o.meta && (
                    <div className="mt-0.5 text-xs font-normal text-slate-500">{o.meta}</div>
                  )}
                </button>
              ))}
            </div>
            {step > 0 && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="mt-4 text-sm font-semibold text-slate-500"
              >
                ← Atrás
              </button>
            )}
          </>
        )}

        {isRepForm && (
          <form onSubmit={onSubmitRep}>
            <h1 className="mb-2 text-2xl font-black">Tus datos</h1>
            <p className="mb-6 text-sm text-slate-500">
              Nombre y teléfono van al arte. Email es opcional para escalación.
            </p>
            <div className="grid gap-3">
              <label className="grid gap-1 text-sm font-semibold">
                Nombre completo
                <input
                  required
                  value={state.repName}
                  onChange={e => setState(s => ({ ...s, repName: e.target.value }))}
                  className="rounded-lg border-2 border-slate-200 p-3 text-base font-normal outline-none focus:border-[#1D429B]"
                />
              </label>
              <label className="grid gap-1 text-sm font-semibold">
                Teléfono
                <input
                  required
                  value={state.repPhone}
                  onChange={e => setState(s => ({ ...s, repPhone: e.target.value }))}
                  placeholder="(787) 555-0100"
                  className="rounded-lg border-2 border-slate-200 p-3 text-base font-normal outline-none focus:border-[#1D429B]"
                />
              </label>
              <label className="grid gap-1 text-sm font-semibold">
                Email WindMar (opcional)
                <input
                  type="email"
                  value={state.repEmail}
                  onChange={e => setState(s => ({ ...s, repEmail: e.target.value }))}
                  placeholder="tu.nombre@windmarhome.com"
                  className="rounded-lg border-2 border-slate-200 p-3 text-base font-normal outline-none focus:border-[#1D429B]"
                />
              </label>
            </div>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setStep(s => s - 1)}
                className="rounded-full border-2 border-[#1D429B] px-6 py-3 font-black text-[#1D429B]"
              >
                ← Atrás
              </button>
              <button
                type="submit"
                className="flex-1 rounded-full bg-[#F89B24] px-6 py-3 font-black text-slate-900"
              >
                Generar arte
              </button>
            </div>
          </form>
        )}

        {isPreview && options && (
          <QuickPreview
            region={region}
            zohoId={id}
            state={state}
            options={options}
            picked={picked}
            setPicked={setPicked}
            onRestart={() => {
              setState(INIT); setOptions(null); setPicked(0); setStep(0);
            }}
          />
        )}
      </div>
    </main>
  );
}

/**
 * Preview + render — submits to SalesArt-API /templates/generate/:type/:userId
 * and waits for NotificationSocket callback on 'placid_notification'.
 *
 * TODO (phase 5): replace PLACID_TEMPLATE_MAP placeholder with Bryan's real UUIDs.
 * TODO: integrate with existing GeneratePlacidImage / GeneratePlacidPDF helpers
 *       from SalesArts/src/lib/client.ts once merged into V2.
 */
function QuickPreview(props: {
  region: string;
  zohoId: string;
  state: IntakeState;
  options: HeadlineOption[];
  picked: number;
  setPicked: (i: number) => void;
  onRestart: () => void;
}) {
  const { state, options, picked, setPicked, onRestart } = props;
  const selected = options[picked];

  return (
    <div>
      <h1 className="mb-2 text-2xl font-black">Escoge tu titular</h1>
      <p className="mb-6 text-sm text-slate-500">
        3 opciones generadas para {state.product} · {state.customer} · {state.channel}.
      </p>
      <div className="grid gap-2">
        {options.map((o, i) => (
          <button
            key={i}
            onClick={() => setPicked(i)}
            className={`rounded-xl border-2 p-3 text-left transition ${
              picked === i ? 'border-[#F89B24] bg-[#FFF7EB]' : 'border-slate-200'
            }`}
          >
            <div className="font-black">{o.headline}</div>
            <div className="mt-1 text-xs text-slate-500">{o.cta}</div>
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-2">
        <button
          className="rounded-full bg-[#F89B24] px-6 py-3 font-black text-slate-900"
          onClick={() => {
            // TODO: wire to GeneratePlacidImage from SalesArts/lib/client.ts
            console.log('[TODO] Placid render submit', { state, selected });
          }}
        >
          Generar arte en Placid
        </button>
        <button
          className="rounded-full bg-[#1D429B] px-6 py-3 font-black text-white"
          onClick={async () => {
            await fetch('/api/escalate', {
              method: 'POST',
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify({
                repName: state.repName, repPhone: state.repPhone, repEmail: state.repEmail,
                product: state.product, customer: state.customer,
                channel: state.channel, message: state.message,
                headline: selected.headline,
              }),
            });
          }}
        >
          Pedir diseño custom a Jaime
        </button>
        <button
          className="rounded-full border-2 border-[#1D429B] px-6 py-3 font-black text-[#1D429B]"
          onClick={onRestart}
        >
          Empezar de nuevo
        </button>
      </div>
    </div>
  );
}
