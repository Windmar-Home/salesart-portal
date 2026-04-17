import WindmarSun from '../components/WindmarSun.jsx';

export default function Solar({ width, height, orientation, headline, cta, repName, repPhone, message }) {
  const isVertical = orientation === 'vertical';
  const pad = isVertical ? 80 : 60;

  return (
    <div
      style={{
        width, height, position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(180deg, var(--wh-blue) 0%, var(--wh-blue-dark) 100%)',
        color: 'var(--white)',
        padding: pad,
        display: 'flex', flexDirection: 'column',
        fontFamily: 'var(--font)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <WindmarSun size={isVertical ? 140 : 120} color="var(--wh-orange)" />
        <div style={{ fontWeight: 900, fontSize: isVertical ? 28 : 22, letterSpacing: '-0.01em' }}>WindMar Home</div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{
          fontWeight: 600, fontSize: isVertical ? 32 : 22, color: 'var(--wh-orange)',
          textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 16,
        }}>SOLAR</div>
        <h1 style={{
          fontWeight: 900, fontSize: isVertical ? 96 : 72,
          lineHeight: 1.02, letterSpacing: '-0.02em', margin: 0,
        }}>{headline}</h1>
        {message && (
          <div style={{
            marginTop: 24, fontSize: isVertical ? 28 : 22, fontWeight: 600,
            color: 'var(--wh-blue-light)',
          }}>{message}</div>
        )}
      </div>

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        borderTop: '2px solid rgba(255,255,255,.2)', paddingTop: 24,
      }}>
        <div>
          <div style={{ fontSize: isVertical ? 28 : 20, fontWeight: 900 }}>{repName}</div>
          <div style={{ fontSize: isVertical ? 22 : 16, fontWeight: 600, opacity: .9 }}>{repPhone}</div>
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
