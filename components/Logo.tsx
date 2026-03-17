import Link from 'next/link'

export default function Logo({ size = 'md', light = false }: {
  size?: 'sm' | 'md' | 'lg'
  light?: boolean
}) {
  const sizes = { sm: 28, md: 36, lg: 48 }
  const textSizes = { sm: 'text-lg', md: 'text-2xl', lg: 'text-3xl' }
  const px = sizes[size]

  return (
    <Link href="/" className="inline-flex items-center gap-2.5 no-underline">
      {/* Geometric gold mark — hexagon with inner diamond */}
      <svg width={px} height={px} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon
          points="20,2 35,10 35,28 20,36 5,28 5,10"
          fill="#C9A84C"
        />
        <polygon
          points="20,10 27,17 20,24 13,17"
          fill={light ? '#FFFFFF' : '#0D1B2A'}
        />
      </svg>
      <span
        className={`${textSizes[size]} font-bold tracking-tight`}
        style={{
          fontFamily: 'var(--font-playfair), Playfair Display, Georgia, serif',
          color: light ? '#FFFFFF' : '#0D1B2A',
        }}
      >
        CapitalMatch
      </span>
    </Link>
  )
}
