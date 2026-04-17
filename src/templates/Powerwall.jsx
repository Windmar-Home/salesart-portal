import WindmarSun from '../components/WindmarSun.jsx';

// Tesla Powerwall — independencia energética, storm resilience.
export default function Powerwall({ width, height, orientation, headline, cta, repName, repPhone, message }) {
  const isVertical = orientation === 'vertical';
  const isHoriz = orientation === 'horizontal';
  const pad = isVertical ? 80 : isHoriz ? 50 : 60;

  return (
    <div
      style={{
        width, height, position: 'relative', overflow: 'hidden',
        background: 'var(--dark)',
        color: 'var(--white)',
        padding: pad,
        display: 'flex', flexDirection: 'column',
        fontFamily: 'var(--font)',
      }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 20% 80%, rgba(29,66,155,.45) 0%, transparent 50%)',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at 85% 10%, rgba(248,155,36,.18) 0%, transparent 40%)',
      }} />

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <WindmarSun size={isVertical ? 130 : 110} color="var(--wh-orange)" />
        <div style={{ fontWeight: 900, fontSize: isVertical ? 26 : 20 }}>WindMar Home</div>
      </div>

      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{
          fontWeight: 900, fontSize: isVertical ? 26 : 18, color: 'var(--wh-orange)',
          textTransform: 'uppercase', letterSpacing: '.15em', marginBottom: 20,
        }}>TESLA POWERWALL</div>
        <h1 style={{
          fontWeight: 900, fontSize: isVertical ? 92 : isHoriz ? 54 : 70,
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
