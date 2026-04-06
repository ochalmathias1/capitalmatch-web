import Link from 'next/link'

export default function Logo({ size = 'md', light = false }: {
  size?: 'sm' | 'md' | 'lg'
  light?: boolean
}) {
  const heights = { sm: 32, md: 40, lg: 52 }
  const h = heights[size]

  // Bridge + mountain mark — matches brand logo
  const navy = '#0D1B2A'
  const gold = '#C9A84C'
  const white = '#FFFFFF'
  const stroke = light ? white : navy

  return (
    <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
      {/* Bridge + Mountain SVG Mark */}
      <svg width={h * 1.2} height={h} viewBox="0 0 48 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Bridge deck */}
        <line x1="4" y1="28" x2="44" y2="28" stroke={stroke} strokeWidth="1.5"/>
        {/* Left tower */}
        <line x1="14" y1="12" x2="14" y2="28" stroke={stroke} strokeWidth="1.5"/>
        {/* Right tower */}
        <line x1="34" y1="8" x2="34" y2="28" stroke={stroke} strokeWidth="1.5"/>
        {/* Left cables */}
        <line x1="14" y1="12" x2="4" y2="28" stroke={stroke} strokeWidth="1"/>
        <line x1="14" y1="12" x2="8" y2="28" stroke={stroke} strokeWidth="0.75"/>
        {/* Right cables */}
        <line x1="34" y1="8" x2="44" y2="28" stroke={stroke} strokeWidth="1"/>
        <line x1="34" y1="8" x2="40" y2="28" stroke={stroke} strokeWidth="0.75"/>
        {/* Center cables */}
        <line x1="14" y1="12" x2="22" y2="28" stroke={stroke} strokeWidth="0.75"/>
        <line x1="34" y1="8" x2="26" y2="28" stroke={stroke} strokeWidth="0.75"/>
        {/* Gold mountain accent */}
        <polyline points="18,22 22,16 26,22" stroke={gold} strokeWidth="1.8" fill="none" strokeLinejoin="round"/>
        <polyline points="22,22 24.5,18.5 27,22" stroke={gold} strokeWidth="1.2" fill="none" strokeLinejoin="round"/>
        {/* Bridge supports */}
        <line x1="14" y1="28" x2="14" y2="34" stroke={stroke} strokeWidth="1.5"/>
        <line x1="34" y1="28" x2="34" y2="34" stroke={stroke} strokeWidth="1.5"/>
      </svg>

      {/* Text */}
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span style={{
          fontFamily: 'var(--font-playfair), Playfair Display, Georgia, serif',
          fontSize: size === 'lg' ? '1.5rem' : size === 'md' ? '1.2rem' : '1rem',
          fontWeight: 700,
          color: light ? white : navy,
          letterSpacing: '0.04em',
        }}>
          CAPITAL MATCH
        </span>
        <span style={{
          fontFamily: 'var(--font-ibm), IBM Plex Sans, sans-serif',
          fontSize: size === 'lg' ? '0.7rem' : size === 'md' ? '0.6rem' : '0.5rem',
          fontWeight: 500,
          color: gold,
          letterSpacing: '0.2em',
          marginTop: '0.15rem',
        }}>
          FUNDING
        </span>
      </div>
    </Link>
  )
}
