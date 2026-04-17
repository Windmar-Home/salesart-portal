import WindmarSun from '../components/WindmarSun.jsx';

// Built for Florida — 15-year clock messaging.
export default function RoofingRetail({ width, height, orientation, headline, cta, repName, repPhone, message }) {
  const isVertical = orientation === 'vertical';
  const isHoriz = orientation === 'horizontal';
  const pad = isVertical ? 80 : isHoriz ? 50 : 60;

  return (
    <div
      style={{
        width, height, position: 'relative', overflow: 'hidden',
        background: 'var(--wh-blue-dark)',
        color: 'var(--white)',
        padding: pad,
        display: 'flex', flexDirection: 'column',
        fontFamily: 'var(--font)',
      }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at 90% 15%, rgba(248,155,36,.22) 0%, transparent 45%)',
      }} />

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <WindmarSun size={isVertical ? 140 : 110} color="var(--wh-orange)" />
        <div style={{ fontWeight: 900, fontSize: isVertical ? 26 : 20, letterSpacing: '-0.01em' }}>WindMar Home</div>
      </div>

      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          fontWeight: 900, fontSize: isVertical ? 24 : 18, color: 'var(--wh-orange)',
          textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 20,
        }}>
          <span style={{ width: 40, height: 3, background: 'var(--wh-orange)' }} />
          ROOFING · BUILT FOR FLORIDA
        </div>
        <h1 style={{
          fontWeight: 900, fontSize: isVertical ? 92 : isHoriz ? 54 : 72,
          lineHeight: 1.02, letterSpacing: '-0.02em', margin: 0,
        }}>{headline}</h1>
        {message && (
          <div style={{ marginTop: 24, fontSize: isVertical ? 26 : 20, fontWeight: 600, color: 'var(--wh-blue-light)' }}>
            {message}
          </div>
        )}
      </div>

      <div style={{
        position: 'relative',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        borderTop: '2px solid rgba(255,255,255,.2)', paddingTop: 20,
      }}>
        <div>
          <div style={{ fontSize: isVertical ? 26 : 18, fontWeight: 900 }}>{repName}</div>
          <div style={{ fontSize: isVertical ? 20 : 14, fontWeight: 600, opacity: .85 }}>{repPhone}</div>
        </div>
        <div style={{
          background: 'var(--wh-orange)', color: 'var(--dark)',
          padding: '14px 22px', borderRadius: 999,
          fontWeight: 900, fontSize: isVertical ? 22 : 16,
        }}>{cta}</div>
      </div>
    </div>
  );
}
