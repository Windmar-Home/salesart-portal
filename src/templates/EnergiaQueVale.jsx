import WindmarSun from '../components/WindmarSun.jsx';

// Energía que Vale — agua, salud, hogar.
export default function EnergiaQueVale({ width, height, orientation, headline, cta, repName, repPhone, message }) {
  const isVertical = orientation === 'vertical';
  const isHoriz = orientation === 'horizontal';
  const pad = isVertical ? 80 : isHoriz ? 50 : 60;

  return (
    <div
      style={{
        width, height, position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(160deg, var(--wh-blue-light) 0%, var(--white) 60%)',
        color: 'var(--wh-blue-dark)',
        padding: pad,
        display: 'flex', flexDirection: 'column',
        fontFamily: 'var(--font)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <WindmarSun size={isVertical ? 130 : 110} color="var(--wh-blue)" />
        <div style={{ fontWeight: 900, fontSize: isVertical ? 26 : 20, color: 'var(--wh-blue)' }}>WindMar Home</div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{
          fontWeight: 900, fontSize: isVertical ? 26 : 18, color: 'var(--wh-orange)',
          textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 16,
        }}>ENERGÍA QUE VALE</div>
        <h1 style={{
          fontWeight: 900, fontSize: isVertical ? 88 : isHoriz ? 50 : 68,
          lineHeight: 1.02, letterSpacing: '-0.02em', margin: 0,
        }}>{headline}</h1>
        {message && (
          <div style={{ marginTop: 24, fontSize: isVertical ? 26 : 20, fontWeight: 600, color: 'var(--wh-grey)' }}>
            {message}
          </div>
        )}
      </div>

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        borderTop: '3px solid var(--wh-blue)', paddingTop: 20,
      }}>
        <div>
          <div style={{ fontSize: isVertical ? 26 : 18, fontWeight: 900 }}>{repName}</div>
          <div style={{ fontSize: isVertical ? 20 : 14, fontWeight: 600, color: 'var(--wh-grey)' }}>{repPhone}</div>
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
