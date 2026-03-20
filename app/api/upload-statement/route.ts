import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { verifyToken } from '@/app/api/upload-token/route'

const ALLOWED_MIME_TYPES  = new Set(['application/pdf', 'image/jpeg', 'image/png', 'application/octet-stream'])
const ALLOWED_EXTENSIONS  = new Set(['pdf', 'jpg', 'jpeg', 'png'])
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  // 10 MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()

    // ── Token validation ───────────────────────────────────────────────────
    const token = formData.get('uploadToken') as string | null
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ── File presence ──────────────────────────────────────────────────────
    const file = formData.get('file') as File | null
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // ── File type validation (server-side, not just accept= attribute) ─────
    // iOS Safari sends PDFs as application/octet-stream — check extension too
    const fileExt = file.name.split('.').pop()?.toLowerCase() || ''

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF, JPG, and PNG are accepted.' },
        { status: 400 },
      )
    }

    if (file.type === 'application/octet-stream' && !ALLOWED_EXTENSIONS.has(fileExt)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF, JPG, and PNG are accepted.' },
        { status: 400 },
      )
    }

    // ── File size validation ───────────────────────────────────────────────
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10 MB.' },
        { status: 400 },
      )
    }

    const supabase = getServiceClient()
    const uniqueId = crypto.randomUUID()
    // Determine canonical extension (handles octet-stream PDFs from iOS Safari)
    const ext = file.type === 'application/pdf' ? 'pdf'
      : file.type === 'image/jpeg' ? 'jpg'
      : file.type === 'image/png' ? 'png'
      : (fileExt === 'jpeg' ? 'jpg' : fileExt)
    const uploadContentType = file.type === 'application/octet-stream'
      ? (fileExt === 'pdf' ? 'application/pdf' : fileExt === 'jpg' || fileExt === 'jpeg' ? 'image/jpeg' : 'image/png')
      : file.type
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').slice(0, 100)
    const path     = `statements/${Date.now()}-${uniqueId}-${safeName}`
    const buffer   = Buffer.from(await file.arrayBuffer())

    const { error: uploadError } = await supabase.storage
      .from('bank-statements')
      .upload(path, buffer, { contentType: uploadContentType, upsert: false })

    if (uploadError) {
      console.error('[upload-statement] Supabase upload error:', uploadError.message)
      return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 })
    }

    const { data: signedData, error: signedError } = await supabase.storage
      .from('bank-statements')
      .createSignedUrl(path, 900)  // 15 minutes — reduced from 1 hour

    if (signedError || !signedData?.signedUrl) {
      console.error('[upload-statement] Signed URL error:', signedError?.message)
      return NextResponse.json({ error: 'Upload succeeded but URL generation failed.' }, { status: 500 })
    }

    return NextResponse.json({ path, signedUrl: signedData.signedUrl })

  } catch (err) {
    console.error('[upload-statement] Unexpected error:', err instanceof Error ? err.message : 'unknown')
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 })
  }
}
