import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { verifyToken } from '@/app/api/upload-token/route'

const ALLOWED_MIME_TYPES  = new Set(['application/pdf', 'image/jpeg', 'image/png', 'application/octet-stream'])
const ALLOWED_EXTENSIONS  = new Set(['pdf', 'jpg', 'jpeg', 'png'])
// 25 MB — phone-scanned multi-page bank statements routinely exceed 10 MB.
// File never passes through this Vercel function (only the metadata does);
// the actual upload streams directly browser → Supabase Storage. Vercel's
// ~4.5MB function payload cap therefore does not bound this.
const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024

export const maxDuration = 30 // seconds

// This route now issues a short-lived Supabase signed upload URL. The
// browser PUTs the file directly to Supabase Storage, so the file bytes
// never traverse this serverless function. The function only validates
// the upload token and the metadata the client claims about the file.
//
// Request body (JSON):
//   { uploadToken: string, filename: string, contentType: string, size: number }
//
// Response (JSON):
//   { uploadUrl: string, signedUrl: string, path: string }
//
// Client flow:
//   1. POST this route with metadata → receive uploadUrl + signedUrl
//   2. PUT the file body to uploadUrl with the correct Content-Type header
//   3. Use signedUrl as the readable URL (valid 1 hour)

export async function POST(req: NextRequest) {
  try {
    // ── Parse + validate body ─────────────────────────────────────────────
    let body: { uploadToken?: unknown; filename?: unknown; contentType?: unknown; size?: unknown }
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const token       = typeof body.uploadToken === 'string' ? body.uploadToken : ''
    const filename    = typeof body.filename    === 'string' ? body.filename    : ''
    const contentType = typeof body.contentType === 'string' ? body.contentType : ''
    const size        = typeof body.size        === 'number' ? body.size        : 0

    // ── Token validation ──────────────────────────────────────────────────
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ── Filename presence + length cap ────────────────────────────────────
    if (!filename || filename.length > 200) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 })
    }

    // ── Type validation (server-side, not just client accept= attribute) ──
    // iOS Safari sends PDFs as application/octet-stream — accept and rely on
    // the file extension to constrain the type.
    const fileExt = filename.split('.').pop()?.toLowerCase() || ''

    if (!ALLOWED_MIME_TYPES.has(contentType)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF, JPG, and PNG are accepted.' },
        { status: 400 },
      )
    }
    if (!ALLOWED_EXTENSIONS.has(fileExt)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF, JPG, and PNG are accepted.' },
        { status: 400 },
      )
    }
    if (contentType === 'application/octet-stream' && !ALLOWED_EXTENSIONS.has(fileExt)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF, JPG, and PNG are accepted.' },
        { status: 400 },
      )
    }

    // ── Size validation ───────────────────────────────────────────────────
    if (!Number.isFinite(size) || size <= 0) {
      return NextResponse.json({ error: 'Invalid file size' }, { status: 400 })
    }
    if (size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 25 MB.' },
        { status: 400 },
      )
    }

    // ── Compute storage path + create signed upload URL ──────────────────
    const supabase = getServiceClient()
    const uniqueId = crypto.randomUUID()
    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '-').slice(0, 100)
    const path     = `statements/${Date.now()}-${uniqueId}-${safeName}`

    const { data: signedUploadData, error: signedUploadError } = await supabase.storage
      .from('bank-statements')
      .createSignedUploadUrl(path)

    if (signedUploadError || !signedUploadData?.signedUrl) {
      console.error('[upload-statement] Signed upload URL error:', signedUploadError?.message)
      return NextResponse.json({ error: 'Could not prepare upload. Please try again.' }, { status: 500 })
    }

    // 1-hour signed read URL — long enough for the merchant to finish the
    // form and the /api/submit handler to fetch + attach the file. The
    // pipeline regenerates fresh URLs on its own when needed downstream.
    const { data: signedReadData, error: signedReadError } = await supabase.storage
      .from('bank-statements')
      .createSignedUrl(path, 60 * 60)

    if (signedReadError || !signedReadData?.signedUrl) {
      console.error('[upload-statement] Signed read URL error:', signedReadError?.message)
      return NextResponse.json({ error: 'Could not prepare upload. Please try again.' }, { status: 500 })
    }

    return NextResponse.json({
      uploadUrl: signedUploadData.signedUrl,
      signedUrl: signedReadData.signedUrl,
      path,
    })

  } catch (err) {
    console.error('[upload-statement] Unexpected error:', err instanceof Error ? err.message : 'unknown')
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 })
  }
}
