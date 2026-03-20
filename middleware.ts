import { NextRequest, NextResponse } from 'next/server'

// ─────────────────────────────────────────────────────────────────────────────
// Rate limiting for /api/submit
//
// Uses a module-level Map — persists within a single Vercel edge instance.
// Not globally distributed, but significantly reduces spam from any single IP.
// For full cross-region rate limiting, replace with Upstash Redis.
// ─────────────────────────────────────────────────────────────────────────────

const WINDOW_MS  = 60 * 60 * 1000  // 1 hour
const MAX_SUBMIT = 5                // max submissions per IP per hour
const MAX_UPLOAD = 30               // max uploads per IP per hour

const submitHits = new Map<string, number[]>()
const uploadHits = new Map<string, number[]>()

function checkLimit(map: Map<string, number[]>, ip: string, max: number): boolean {
  const now  = Date.now()
  const hits = (map.get(ip) || []).filter(t => now - t < WINDOW_MS)
  hits.push(now)
  map.set(ip, hits)
  return hits.length > max
}

export function middleware(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

  if (req.nextUrl.pathname === '/api/submit') {
    if (checkLimit(submitHits, ip, MAX_SUBMIT)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait before submitting again.' },
        { status: 429 },
      )
    }
  }

  if (req.nextUrl.pathname === '/api/upload-statement') {
    if (checkLimit(uploadHits, ip, MAX_UPLOAD)) {
      return NextResponse.json(
        { error: 'Too many uploads. Please wait before uploading more files.' },
        { status: 429 },
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/submit', '/api/upload-statement'],
}
