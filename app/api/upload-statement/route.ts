import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  // ── Diagnostic: confirm request is reaching the server ──
  console.log('[upload-statement] Request received')

  // ── Diagnostic: confirm env vars are present (values never logged) ──
  console.log('[upload-statement] Env check:', {
    NEXT_PUBLIC_SUPABASE_URL:    !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY:   !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  })

  try {
    // Fail early if required env vars are missing
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.error('[upload-statement] NEXT_PUBLIC_SUPABASE_URL is not set')
      return NextResponse.json({ error: 'Server misconfiguration: NEXT_PUBLIC_SUPABASE_URL missing' }, { status: 500 })
    }
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('[upload-statement] SUPABASE_SERVICE_ROLE_KEY is not set')
      return NextResponse.json({ error: 'Server misconfiguration: SUPABASE_SERVICE_ROLE_KEY missing' }, { status: 500 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    console.log('[upload-statement] File received:', file ? `${file.name} (${file.size} bytes, ${file.type})` : 'null')

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const supabase = getServiceClient()
    // Include crypto.randomUUID() so paths are unique even if Date.now()
    // returns the same millisecond for two rapid sequential uploads.
    const uniqueId = crypto.randomUUID()
    const safeName = file.name.replace(/\s+/g, '-')
    const path = `statements/${Date.now()}-${uniqueId}-${safeName}`
    const buffer = Buffer.from(await file.arrayBuffer())

    console.log('[upload-statement] Uploading to bucket: bank-statements, path:', path)

    const { error: uploadError } = await supabase.storage
      .from('bank-statements')
      .upload(path, buffer, { contentType: file.type || 'application/octet-stream', upsert: false })

    if (uploadError) {
      console.error('[upload-statement] Supabase upload error:', JSON.stringify(uploadError))
      return NextResponse.json(
        { error: uploadError.message, details: uploadError },
        { status: 500 }
      )
    }

    console.log('[upload-statement] Upload succeeded, creating signed URL')

    const { data: signedData, error: signedError } = await supabase.storage
      .from('bank-statements')
      .createSignedUrl(path, 3600)

    if (signedError || !signedData?.signedUrl) {
      console.error('[upload-statement] Signed URL error:', JSON.stringify(signedError))
      return NextResponse.json(
        { error: signedError?.message ?? 'Failed to create signed URL' },
        { status: 500 }
      )
    }

    console.log('[upload-statement] Success — signed URL created')
    return NextResponse.json({ path, signedUrl: signedData.signedUrl })

  } catch (err) {
    console.error('[upload-statement] Unexpected error:', err instanceof Error ? err.message : err)
    console.error('[upload-statement] Full error object:', JSON.stringify(err, Object.getOwnPropertyNames(err)))
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Upload failed' },
      { status: 500 }
    )
  }
}
