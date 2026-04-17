import { useEffect, useRef, useState } from 'react';
import { channelById, CHANNELS } from '../data/channels.js';
import { resolveTemplate } from '../templates/registry.js';
import { generateHeadlines } from '../copy/generate.js';
import { exportPng } from '../export/png.js';
import { exportPdf } from '../export/pdf.js';
import { escalate } from '../escalate/client.js';

export default function Preview({ intake, onRestart }) {
  const [channelId, setChannelId] = useState(intake.channel);
  const [options, setOptions] = useState(null);
  const [picked, setPicked] = useState(0);
  const [loading, setLoading] = useState(true);
  const [escalating, setEscalating] = useState(false);
  const [escalateStatus, setEscalateStatus] = useState(null);
  const canvasRef = useRef(null);
  const scalerRef = useRef(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    generateHeadlines({
      product: intake.product, customer: intake.customer,
      channel: channelId, message: intake.message, repName: intake.repName,
    }).then(opts => {
      if (!alive) return;
      setOptions(opts); setPicked(0); setLoading(false);
    });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intake.product, intake.customer, intake.message]);

  useEffect(() => { fitScaler(); }, [channelId, options]);
  useEffect(() => {
    const on = () => fitScaler();
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);

  const fitScaler = () => {
    const wrap = scalerRef.current?.parentElement;
    const node = scalerRef.current;
    if (!wrap || !node) return;
    const ch = channelById(channelId);
    const availW = wrap.clientWidth - 48;
    const availH = Math.min(wrap.clientHeight - 48, 720);
    const scale = Math.min(availW / ch.width, availH / ch.height, 1);
    node.style.transform = `scale(${scale})`;
    wrap.style.height = `${ch.height * scale + 48}px`;
  };

  const ch = channelById(channelId);
  const { component: Template } = resolveTemplate(intake.product);
  const selected = options?.[picked] || { headline: '—', cta: '—' };

  const doExport = async () => {
    const node = canvasRef.current;
    if (!node) return;
    const base = `${intake.product}-${channelId}-${Date.now()}`;
    if (ch.kind === 'pdf') await exportPdf(node, { width: ch.width, height: ch.height, filename: `${base}.pdf` });
    else await exportPng(node, { width: ch.width, height: ch.height, filename: `${base}.png` });
  };

  const doEscalate = async () => {
    setEscalating(true); setEscalateStatus(null);
    try {
      await escalate({ intake, channelId, headline: selected.headline });
      setEscalateStatus('ok');
    } catch (e) {
      setEscalateStatus('err');
    } finally {
      setEscalating(false);
    }
  };

  return (
    <div className="preview-layout">
      <div className="canvas-wrap">
        <div className="canvas-scaler" ref={scalerRef}>
          <div ref={canvasRef}>
            <Template
              width={ch.width}
              height={ch.height}
              orientation={ch.orientation}
              headline={selected.headline}
              cta={selected.cta}
              message={intake.message}
              repName={intake.repName}
              repPhone={intake.repPhone}
            />
          </div>
        </div>
      </div>

      <div className="controls">
        <h3>Formato</h3>
        <div className="format-row">
          {CHANNELS.map(c => (
            <button key={c.id}
              className={`format-btn ${channelId === c.id ? 'selected' : ''}`}
              onClick={() => setChannelId(c.id)}>
              {c.label}
              <div style={{ fontSize: 11, color: 'var(--wh-grey)', fontWeight: 400, marginTop: 2 }}>
                {c.width}×{c.height}
              </div>
            </button>
          ))}
        </div>

        <h3>Headline</h3>
        {loading && <div style={{ color: 'var(--wh-grey)', fontSize: 13 }}>Generando opciones…</div>}
        {!loading && (
          <div className="headline-options">
            {options.map((o, i) => (
              <button key={i}
                className={`headline-option ${picked === i ? 'selected' : ''}`}
                onClick={() => setPicked(i)}>
                <div style={{ fontWeight: 900 }}>{o.headline}</div>
                <div style={{ fontSize: 11, color: 'var(--wh-grey)', marginTop: 2 }}>{o.cta}</div>
              </button>
            ))}
          </div>
        )}

        <button className="wh-btn wh-btn-primary" onClick={doExport} disabled={loading}>
          Descargar {ch.kind.toUpperCase()}
        </button>

        <button className="wh-btn wh-btn-secondary" onClick={doEscalate} disabled={escalating}>
          {escalating ? 'Enviando…' : 'Pedir diseño a Jaime'}
        </button>
        {escalateStatus === 'ok'  && <div className="escalate-note" style={{ color: 'var(--wh-blue)' }}>Mensaje enviado a Teams.</div>}
        {escalateStatus === 'err' && <div className="escalate-note" style={{ color: '#C73535' }}>No se pudo enviar. Intenta de nuevo.</div>}

        <button className="wh-btn wh-btn-ghost" onClick={onRestart}>
          Empezar de nuevo
        </button>
      </div>
    </div>
  );
}
