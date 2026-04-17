// Sol WindMar — versión SVG inline aproximada del logotype oficial.
// Reemplazar por el SVG oficial cuando se pegue a public/assets/logos/windmar-sun.svg.
export default function WindmarSun({ size = 120, color = 'var(--wh-orange)' }) {
  return (
    <svg
      width={size}
      height={size * 0.6}
      viewBox="0 0 200 120"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="WindMar"
    >
      <g fill={color}>
        <path d="M100 48 C 130 48, 155 70, 158 115 L 42 115 C 45 70, 70 48, 100 48 Z" />
        <polygon points="100,8 94,48 106,48" />
        <polygon points="60,22 80,50 88,46" />
        <polygon points="140,22 120,50 112,46" />
        <polygon points="28,52 60,60 58,70" />
        <polygon points="172,52 140,60 142,70" />
        <polygon points="40,82 66,76 64,86" />
        <polygon points="160,82 134,76 136,86" />
      </g>
    </svg>
  );
}
