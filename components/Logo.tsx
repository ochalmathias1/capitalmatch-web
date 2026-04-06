import Link from 'next/link'
import Image from 'next/image'

export default function Logo({ size = 'md', light = false }: {
  size?: 'sm' | 'md' | 'lg'
  light?: boolean
}) {
  const heights = { sm: 32, md: 44, lg: 56 }
  const h = heights[size]

  return (
    <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
      <Image
        src={light ? '/logo-light.png' : '/logo-dark.png'}
        alt="Capital Match Funding — Est. New York"
        height={h}
        width={Math.round(h * 2)}
        style={{ objectFit: 'contain', objectPosition: 'left center' }}
        priority
      />
    </Link>
  )
}
