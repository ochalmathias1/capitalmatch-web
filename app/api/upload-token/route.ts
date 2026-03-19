import { NextResponse } from 'next/server'
import { createHmac } from 'crypto'

// Issues a short-lived HMAC-signed token that authorises one upload session.
// The upload endpoint validates this token before accepting files.
//
// Set UPLOAD_TOKEN_SECRET in .env.local (minimum 32 random characters).
// Example: openssl rand -hex 32

const SECRET = process.env.UPLOAD_TOKEN_SECRET || ''
const TOKEN_TTL_MS = 60 * 60 * 1000  // 1 hour

export function signToken(ts: number): string {
  const payload = Buffer.from(JSON.stringify({ ts })).toString('base64url')
  const sig = createHmac('sha256', SECRET).update(payload).digest('base64url')
  return `${payload}.${sig}`
}

export function verifyToken(token: string): boolean {
  if (!SECRET) return false  // secret not configured — reject all
  const [payload, sig] = token.split('.')
  if (!payload || !sig) return false
  const expected = createHmac('sha256', SECRET).update(payload).digest('base64url')
  if (expected !== sig) return false
  try {
    const { ts } = JSON.parse(Buffer.from(payload, 'base64url').toString())
    return Date.now() - ts < TOKEN_TTL_MS
  } catch {
    return false
  }
}

export async function GET() {
  if (!SECRET) {
    console.error('[upload-token] UPLOAD_TOKEN_SECRET is not configured')
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
  }
  const token = signToken(Date.now())
  return NextResponse.json({ token })
}
