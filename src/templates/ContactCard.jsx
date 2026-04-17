import WindmarSun from '../components/WindmarSun.jsx';

// Rep Contact Card — nombre, teléfono, market, productos que vende.
// Único template donde el rep puede editar más campos (market + productos).
export default function ContactCard({ width, height, orientation, headline, cta, repName, repPhone, message, repMarket, repProducts }) {
  const isVertical = orientation === 'vertical';
  const isHoriz = orientation === 'horizontal';
  const pad = isVertical ? 80 : isHoriz ? 60 : 70;
  const market = repMarket || 'PR/FL';
  const products = repProducts || 'Solar · Roofing · Powerwall · EQV';

  return (
    <div
      style={{
        width, height, position: 'relative', overflow: 'hidden',
        background: 'var(--white)',
        color: 'var(--wh-blue-dark)',
        padding: pad,
        display: 'flex', flexDirection: 'column',
        fontFamily: 'var(--font)',
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: isVertical ? 180 : 110,
        background: 'var(--wh-blue)',
      }} />
      <div style={{
        position: 'absolute', top: isVertical ? 120 : 80, right: pad,
        width: isVertical ? 6 : 4, height: isVertical ? 80 : 50,
        background: 'var(--wh-orange)',
      }} />

      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        color: 'var(--white)',
      }}>
        <WindmarSun size={isVertical ? 120 : 90} color="var(--wh-orange)" />
        <div style={{ fontWeight: 900, fontSize: isVertical ? 24 : 18 }}>WindMar Home</div>
      </div>

      <div style={{
        position: 'relative', zIndex: 1, flex: 1,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        marginTop: isVertical ? 40 : 20,
      }}>
        <div style={{
          fontWeight: 900, fontSize: isVertical ? 22 : 16, color: 'var(--wh-orange)',
          textTransform: 'uppercase', letterSpacing: '.15em', marginBottom: 20,
        }}>CONTACT · {market}</div>

        <h1 style={{
          fontWeight: 900, fontSize: isVertical ? 96 : isHoriz ? 56 : 74,
          lineHeight: 1.02, letterSpacing: '-0.02em', margin: 0,
        }}>{repName}</h1>

        <div style={{
          marginTop: 16, fontSize: isVertical ? 40 : isHoriz ? 26 : 32,
          fontWeight: 600, color: 'var(--wh-blue)',
        }}>{repPhone}</div>

        <div style={{
          marginTop: 28, fontSize: isVertical ? 22 : 16,
          fontWeight: 600, color: 'var(--wh-grey)',
          textTransform: 'uppercase', letterSpacing: '.08em',
        }}>Vende: {products}</div>
      </div>

      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderTop: '3px solid var(--wh-blue)', paddingTop: 18,
      }}>
        <div style={{ fontSize: isVertical ? 16 : 12, fontWeight: 600, color: 'var(--wh-grey)' }}>
          Sin Cuentos · Construido para tu casa
        </div>
        <div style={{
          background: 'var(--wh-orange)', color: 'var(--dark)',
          padding: '12px 20px', borderRadius: 999,
          fontWeight: 900, fontSize: isVertical ? 20 : 14,
        }}>{cta || 'Llámame'}</div>
      </div>
    </div>
  );
}
