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

// Two-phase upload to bypass Vercel's serverless function payload cap. File
// bytes never traverse this route — they stream browser → Supabase Storage.
//
// Phase 1 — INIT (request body has `filename`):
//   { uploadToken, filename, contentType, size }
//   → returns { uploadUrl, path }
//
// Phase 2 — CONFIRM (request body has `path` and no filename):
//   { uploadToken, path }
//   → returns { signedUrl }   (1-hour read URL — only valid once object exists)
//
// Client flow:
//   1. POST init    → receive uploadUrl + path
//   2. PUT file body to uploadUrl with proper Content-Type
//   3. POST confirm → receive signedUrl
//
// We split read-URL generation out of phase 1 because Supabase's
// createSignedUrl requires the object to actually exist in storage and
// returns 'Object not found' otherwise.

function isAllowedPath(path: string): boolean {
  // Paths we issue have shape: statements/<timestamp>-<uuid>-<safe-name>
  // Confirm phase must reject anything outside that prefix to prevent a
  // valid token holder from minting read URLs for arbitrary objects.
  return /^statements\/\d+-[0-9a-f-]{36}-[A-Za-z0-9._-]{1,100}$/.test(path)
}

export async function POST(req: NextRequest) {
  try {
    let body: {
      uploadToken?: unknown
      filename?:    unknown
      contentType?: unknown
      size?:        unknown
      path?:        unknown
    }
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const token = typeof body.uploadToken === 'string' ? body.uploadToken : ''
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = getServiceClient()

    // ── Phase 2: CONFIRM — issue read URL for an already-uploaded object ──
    if (typeof body.path === 'string' && body.path && !body.filename) {
      const path = body.path
      if (!isAllowedPath(path)) {
        return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
      }
      const { data, error } = await supabase.storage
        .from('bank-statements')
        .createSignedUrl(path, 60 * 60)
      if (error || !data?.signedUrl) {
        console.error('[upload-statement] confirm: createSignedUrl error:', error)
        return NextResponse.json({ error: 'Upload not found. Please re-upload.' }, { status: 404 })
      }
      return NextResponse.json({ signedUrl: data.signedUrl })
    }

    // ── Phase 1: INIT — validate metadata, issue upload URL ───────────────
    const filename    = typeof body.filename    === 'string' ? body.filename    : ''
    const contentType = typeof body.contentType === 'string' ? body.contentType : ''
    const size        = typeof body.size        === 'number' ? body.size        : 0

    if (!filename || filename.length > 200) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 })
    }

    // iOS Safari sends PDFs as application/octet-stream — we accept that
    // mime type only when the extension is also one of our allowed types.
    const fileExt = filename.split('.').pop()?.toLowerCase() || ''
    if (!ALLOWED_MIME_TYPES.has(contentType) || !ALLOWED_EXTENSIONS.has(fileExt)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF, JPG, and PNG are accepted.' },
        { status: 400 },
      )
    }

    if (!Number.isFinite(size) || size <= 0) {
      return NextResponse.json({ error: 'Invalid file size' }, { status: 400 })
    }
    if (size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 25 MB.' },
        { status: 400 },
      )
    }

    const uniqueId = crypto.randomUUID()
    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '-').slice(0, 100)
    const path     = `statements/${Date.now()}-${uniqueId}-${safeName}`

    const { data, error } = await supabase.storage
      .from('bank-statements')
      .createSignedUploadUrl(path)

    if (error || !data?.signedUrl) {
      console.error('[upload-statement] init: createSignedUploadUrl error:', error)
      return NextResponse.json({ error: 'Could not prepare upload. Please try again.' }, { status: 500 })
    }

    return NextResponse.json({ uploadUrl: data.signedUrl, path })

  } catch (err) {
    console.error('[upload-statement] Unexpected error:', err instanceof Error ? err.message : 'unknown')
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 })
  }
}
