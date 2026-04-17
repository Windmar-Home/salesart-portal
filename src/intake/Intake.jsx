import { useState } from 'react';
import { QUESTIONS } from './questions.js';
import { defaultCustomerFor } from '../copy/segments.js';

export default function Intake({ onComplete }) {
  const [step, setStep] = useState(0);
  const [state, setState] = useState({
    product: null, customer: null, channel: null, message: null,
    repName: '', repPhone: '', repEmail: '',
  });

  const q = QUESTIONS[step];
  const isRepForm = step === QUESTIONS.length;
  const progressCount = QUESTIONS.length + 1; // + rep form
  const opts = !isRepForm ? q.options(state) : [];

  const pick = (value) => {
    let next = { ...state, [q.id]: value };
    if (q.id === 'product' && !state.customer) next.customer = defaultCustomerFor(value);
    setState(next);
    setTimeout(() => setStep(step + 1), 150);
  };

  const submitRep = (e) => {
    e.preventDefault();
    if (!state.repName.trim() || !state.repPhone.trim()) return;
    onComplete(state);
  };

  return (
    <div className="intake-card">
      <div className="intake-progress">
        {Array.from({ length: progressCount }).map((_, i) => (
          <div key={i} className={`dot ${i < step ? 'done' : i === step ? 'active' : ''}`} />
        ))}
      </div>

      {!isRepForm && (
        <>
          <h2 className="intake-question">{q.title}</h2>
          <p className="intake-sub">{q.sub}</p>
          <div className="intake-options">
            {opts.map(o => (
              <button
                key={o.value}
                className={`intake-option ${state[q.id] === o.value ? 'selected' : ''}`}
                onClick={() => pick(o.value)}
              >
                <div>{o.label}</div>
                {o.meta && <div style={{ fontSize: 12, color: 'var(--wh-grey)', fontWeight: 400, marginTop: 2 }}>{o.meta}</div>}
              </button>
            ))}
          </div>
          {step > 0 && (
            <button className="intake-back" onClick={() => setStep(step - 1)}>← Atrás</button>
          )}
        </>
      )}

      {isRepForm && (
        <form onSubmit={submitRep}>
          <h2 className="intake-question">Tus datos</h2>
          <p className="intake-sub">Solo nombre y teléfono van al arte. Email es para la escalación a Jaime si pides diseño custom.</p>
          <div className="rep-fields">
            <label>Nombre completo
              <input value={state.repName} onChange={e => setState({ ...state, repName: e.target.value })} required />
            </label>
            <label>Teléfono
              <input value={state.repPhone} onChange={e => setState({ ...state, repPhone: e.target.value })} required placeholder="(787) 555-0100" />
            </label>
            <label>Email WindMar (opcional)
              <input type="email" value={state.repEmail} onChange={e => setState({ ...state, repEmail: e.target.value })} placeholder="tu.nombre@windmarhome.com" />
            </label>
          </div>
          <div style={{ marginTop: 20, display: 'flex', gap: 8 }}>
            <button type="button" className="wh-btn wh-btn-ghost" onClick={() => setStep(step - 1)}>← Atrás</button>
            <button type="submit" className="wh-btn wh-btn-primary" style={{ flex: 1 }}>Generar arte</button>
          </div>
        </form>
      )}
    </div>
  );
}
