import Link from 'next/link'
import Image from 'next/image'

export default function Logo({ size = 'md', light = false }: {
  size?: 'sm' | 'md' | 'lg'
  light?: boolean
}) {
  const heights = { sm: 36, md: 48, lg: 64 }
  const h = heights[size]

  return (
    <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
      <Image
        src={light ? '/logo-white.png' : '/logo-dark.png'}
        alt="Capital Match Funding — Est. New York"
        height={h * 2}
        width={h * 8}
        style={{
          objectFit: 'contain',
          objectPosition: 'left center',
          height: h,
          width: 'auto',
          maxWidth: h * 4,
        }}
        priority
      />
    </Link>
  )
}
