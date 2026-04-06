import Link from 'next/link'
import Image from 'next/image'

export default function Logo({ size = 'md', light = false }: {
  size?: 'sm' | 'md' | 'lg'
  light?: boolean
}) {
  const heights = { sm: 36, md: 48, lg: 64 }
  const h = heights[size]
  // header logo aspect ratio is roughly 2.3:1
  const w = Math.round(h * 2.3)

  return (
    <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
      <Image
        src={light ? '/logo-white.png' : '/logo-header.png'}
        alt="Capital Match Funding — Est. New York"
        height={h}
        width={w}
        style={{ objectFit: 'contain', objectPosition: 'left center', height: h, width: 'auto' }}
        priority
      />
    </Link>
  )
}
