import WindmarSun from '../components/WindmarSun.jsx';

export default function RoofingClaims({ width, height, orientation, headline, cta, repName, repPhone, message }) {
  const isVertical = orientation === 'vertical';
  const pad = isVertical ? 80 : 60;

  return (
    <div
      style={{
        width, height, position: 'relative', overflow: 'hidden',
        background: 'var(--white)',
        color: 'var(--dark)',
        padding: pad,
        display: 'flex', flexDirection: 'column',
        fontFamily: 'var(--font)',
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: isVertical ? 12 : 8,
        background: 'var(--wh-orange)',
      }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
        <WindmarSun size={isVertical ? 130 : 110} color="var(--wh-blue)" />
        <div style={{ fontWeight: 900, fontSize: isVertical ? 26 : 20, color: 'var(--wh-blue)', letterSpacing: '-0.01em' }}>
          WindMar Home
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{
          fontWeight: 900, fontSize: isVertical ? 28 : 20, color: 'var(--wh-orange)',
          textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 16,
        }}>ROOFING CLAIMS</div>
        <h1 style={{
          fontWeight: 900, fontSize: isVertical ? 88 : 64,
          lineHeight: 1.02, letterSpacing: '-0.02em', margin: 0,
          color: 'var(--wh-blue-dark)',
        }}>{headline}</h1>
        {message && (
          <div style={{
            marginTop: 24, fontSize: isVertical ? 26 : 20, fontWeight: 600,
            color: 'var(--wh-grey)',
          }}>{message}</div>
        )}
      </div>

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        borderTop: `3px solid var(--wh-blue)`, paddingTop: 24,
      }}>
        <div>
          <div style={{ fontSize: isVertical ? 28 : 20, fontWeight: 900, color: 'var(--wh-blue-dark)' }}>{repName}</div>
          <div style={{ fontSize: isVertical ? 22 : 16, fontWeight: 600, color: 'var(--wh-grey)' }}>{repPhone}</div>
        </div>
        <div style={{
          background: 'var(--wh-blue)', color: 'var(--white)',
          padding: '14px 22px', borderRadius: 999,
          fontWeight: 900, fontSize: isVertical ? 22 : 16,
        }}>{cta}</div>
      </div>
    </div>
  );
}
