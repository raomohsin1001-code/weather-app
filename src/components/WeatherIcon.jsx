const ICONS = {
  sun: (
    <g stroke="#d99a2b" strokeWidth="2.2" fill="none" strokeLinecap="round">
      <circle cx="24" cy="24" r="9" fill="#d99a2b" stroke="none" />
      <line x1="24" y1="4" x2="24" y2="10" />
      <line x1="24" y1="38" x2="24" y2="44" />
      <line x1="4" y1="24" x2="10" y2="24" />
      <line x1="38" y1="24" x2="44" y2="24" />
      <line x1="9.5" y1="9.5" x2="13.5" y2="13.5" />
      <line x1="34.5" y1="34.5" x2="38.5" y2="38.5" />
      <line x1="9.5" y1="38.5" x2="13.5" y2="34.5" />
      <line x1="34.5" y1="13.5" x2="38.5" y2="9.5" />
    </g>
  ),
  'cloud-sun': (
    <g>
      <circle cx="17" cy="17" r="7" fill="#d99a2b" />
      <path
        d="M14 32a8 8 0 0 1 1-16 10 10 0 0 1 19 4 7 7 0 0 1-2 12H14z"
        fill="#b7bcac"
      />
    </g>
  ),
  cloud: (
    <path
      d="M12 34a9 9 0 0 1 1.5-17.9A11 11 0 0 1 34.5 20 8 8 0 0 1 33 34H12z"
      fill="#8a9198"
    />
  ),
  rain: (
    <g>
      <path
        d="M12 27a9 9 0 0 1 1.5-17.9A11 11 0 0 1 34.5 13 8 8 0 0 1 33 27H12z"
        fill="#8a9198"
      />
      <g stroke="#2e6f5e" strokeWidth="2.2" strokeLinecap="round">
        <line x1="16" y1="32" x2="14" y2="40" />
        <line x1="24" y1="32" x2="22" y2="40" />
        <line x1="32" y1="32" x2="30" y2="40" />
      </g>
    </g>
  ),
  snow: (
    <g>
      <path
        d="M12 27a9 9 0 0 1 1.5-17.9A11 11 0 0 1 34.5 13 8 8 0 0 1 33 27H12z"
        fill="#8a9198"
      />
      <g stroke="#3f7c98" strokeWidth="2" strokeLinecap="round">
        <line x1="16" y1="32" x2="16" y2="40" />
        <line x1="13" y1="35" x2="19" y2="37" />
        <line x1="19" y1="35" x2="13" y2="37" />
        <line x1="30" y1="32" x2="30" y2="40" />
        <line x1="27" y1="35" x2="33" y2="37" />
        <line x1="33" y1="35" x2="27" y2="37" />
      </g>
    </g>
  ),
  storm: (
    <g>
      <path
        d="M12 26a9 9 0 0 1 1.5-17.9A11 11 0 0 1 34.5 12 8 8 0 0 1 33 26H12z"
        fill="#565f66"
      />
      <path d="M23 28 17 38h6l-3 8 10-13h-6l3-5z" fill="#d99a2b" />
    </g>
  ),
  fog: (
    <g stroke="#8a9198" strokeWidth="2.4" strokeLinecap="round">
      <line x1="8" y1="18" x2="40" y2="18" />
      <line x1="8" y1="25" x2="40" y2="25" />
      <line x1="8" y1="32" x2="34" y2="32" />
    </g>
  ),
}

export default function WeatherIcon({ icon, size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      {ICONS[icon] || ICONS.cloud}
    </svg>
  )
}