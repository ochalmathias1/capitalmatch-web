import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const supabase = getServiceClient()
    const path = `statements/${Date.now()}-${file.name.replace(/\s+/g, '-')}`
    const buffer = Buffer.from(await file.arrayBuffer())

    const { error: uploadError } = await supabase.storage
      .from('bank-statements')
      .upload(path, buffer, { contentType: file.type || 'application/octet-stream' })

    if (uploadError) {
      console.error('[upload-statement] Supabase upload error:', uploadError)
      return NextResponse.json(
        { error: uploadError.message, details: uploadError },
        { status: 500 }
      )
    }

    const { data: signedData, error: signedError } = await supabase.storage
      .from('bank-statements')
      .createSignedUrl(path, 3600)

    if (signedError || !signedData?.signedUrl) {
      console.error('[upload-statement] Supabase signed URL error:', signedError)
      return NextResponse.json(
        { error: signedError?.message ?? 'Failed to create signed URL' },
        { status: 500 }
      )
    }

    return NextResponse.json({ path, signedUrl: signedData.signedUrl })
  } catch (err) {
    console.error('[upload-statement] Unexpected error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Upload failed' },
      { status: 500 }
    )
  }
}
