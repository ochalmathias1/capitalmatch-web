import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'
import { renderToBuffer, Document } from '@react-pdf/renderer'
import { createElement, type ReactElement, type ComponentProps } from 'react'
import { getServiceClient } from '@/lib/supabase'
import { ApplicationPDF } from '@/lib/generatePdf'
import type { ApplicationData } from '@/lib/types'

// ─────────────────────────────────────────────
// SERVER-SIDE VALIDATION SCHEMA
// ─────────────────────────────────────────────

const ENTITY_TYPES   = ['LLC', 'Sole Proprietorship', 'Partnership', 'Corporation', 'Other'] as const
const REVENUE_RANGES = ['Under $10,000', '$10,000 – $25,000', '$25,000 – $50,000', '$50,000 – $100,000', '$100,000 – $250,000', '$250,000 or more'] as const
const AMOUNT_RANGES  = ['$5,000 – $15,000', '$15,000 – $30,000', '$30,000 – $75,000', '$75,000 – $150,000', '$150,000 – $300,000', '$300,000 or more'] as const
const USE_OF_FUNDS   = ['Inventory or Stock', 'Equipment Purchase', 'Payroll or Staffing', 'Marketing or Advertising', 'Renovations', 'Bridge Financing', 'Working Capital', 'Expansion', 'Other'] as const
const OWNER_TITLES   = ['Owner', 'CEO', 'President', 'Partner', 'Member', 'Other'] as const
const FICO_RANGES    = ['Below 500', '500–579', '580–619', '620–679', '680–719', '720 or above'] as const
const POSITIONS      = ['No existing advances — 1st position', '1 open advance — 2nd position', '2 open advances — 3rd position', '3 or more open advances'] as const

const str    = (max: number) => z.string().min(1).max(max).trim()
const optStr = (max: number) => z.string().max(max).optional()
const stateZ  = z.string().length(2).regex(/^[A-Z]{2}$/)
const zipZ    = z.string().regex(/^\d{5}(-\d{4})?$/)
const phoneZ  = z.string().refine(
  s => { const d = s.replace(/\D/g, ''); return d.length === 10 || (d.length === 11 && d[0] === '1') },
  'Please enter a valid 10-digit phone number',
)
const ssnZ    = z.string().regex(/^\d{3}-\d{2}-\d{4}$/, 'SSN must be XXX-XX-XXXX')
const einZ    = z.string().regex(/^\d{2}-\d{7}$/, 'EIN must be XX-XXXXXXX')
const dateZ   = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date')
const emailZ  = z.string().email().max(200)
const pctZ    = z.string().regex(/^\d{1,3}$/).refine(v => parseInt(v) <= 100, 'Must be 0–100')
const urlZ    = z.string().url().max(2000)

const ApplicationSchema = z.object({
  // Business
  businessName:        str(200),
  dba:                 optStr(200),
  businessAddress:     str(200),
  businessCity:        str(100),
  businessState:       stateZ,
  businessZip:         zipZ,
  businessPhone:       phoneZ,
  ein:                 einZ,
  dateStarted:         dateZ,
  entityType:          z.enum(ENTITY_TYPES),
  businessEmail:       emailZ,
  businessDescription: str(2000),
  monthlyRevenue:      z.enum(REVENUE_RANGES),
  requestedAmount:     z.enum(AMOUNT_RANGES),
  useOfFunds:          z.enum(USE_OF_FUNDS),
  // Owner
  ownerName:           str(200),
  ownerCellPhone:      phoneZ,
  ownerTitle:          z.enum(OWNER_TITLES),
  ownershipPct:        pctZ,
  homeAddress:         str(200),
  homeCity:            str(100),
  homeState:           stateZ,
  homeZip:             zipZ,
  ssnFull:             ssnZ,
  dob:                 dateZ,
  ficoRange:           z.enum(FICO_RANGES),
  // Documents
  openPositions:       z.enum(POSITIONS),
  mcaBalance:          optStr(50),
  bankStatementUrls:   z.array(urlZ).min(1, 'At least 1 document is required').max(10, 'Maximum 10 files allowed'),
  bankStatementNames:  z.array(z.string().max(500)).min(1),
  signatureName:       str(200),
  authCheck1:          z.literal(true),
  authCheck2:          z.literal(true),
  // Broker referral (optional)
  brokerCode:              z.string().max(50).optional(),
  // Second owner (conditional)
  hasSecondOwner:          z.boolean(),
  secondOwnerName:         optStr(200),
  secondOwnerTitle:        z.string().max(100).optional(),
  secondOwnerPct:          z.string().max(3).optional(),
  secondOwnerAddress:      optStr(200),
  secondOwnerCity:         optStr(100),
  secondOwnerState:        z.string().max(2).optional(),
  secondOwnerZip:          z.string().max(10).optional(),
  secondOwnerSsnFull:      z.string().max(11).optional(),
  secondOwnerDob:          z.string().max(10).optional(),
  secondOwnerFico:         z.string().max(30).optional(),
})

// ─────────────────────────────────────────────
// STORAGE PATH HELPER
// ─────────────────────────────────────────────

function extractStoragePath(signedUrl: string): string {
  try {
    const url   = new URL(signedUrl)
    const match = url.pathname.match(/\/storage\/v1\/object\/sign\/bank-statements\/(.+)/)
    return match ? match[1] : ''
  } catch {
    return ''
  }
}

// ─────────────────────────────────────────────
// ROUTE HANDLER
// ─────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const supabase = getServiceClient()
  const resend   = new Resend(process.env.RESEND_API_KEY)
  let   dealId   = ''

  try {
    // ── 1. Parse + validate body ─────────────────────────────────────────
    let rawData: unknown
    try {
      rawData = await req.json()
    } catch {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const parsed = ApplicationSchema.safeParse(rawData)
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]
      return NextResponse.json(
        { error: `Validation error: ${firstError.path.join('.')} — ${firstError.message}` },
        { status: 400 },
      )
    }

    const data       = parsed.data as ApplicationData
    const brokerCode = parsed.data.brokerCode ?? null
    const now        = new Date()
    const dateStr    = now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
    const timestamp  = now.toISOString()

    // ── 2a. Broker lookup (if referral code provided) ─────────────────────
    let brokerId:   string | null = null
    let brokerName: string | null = null
    if (brokerCode) {
      const { data: broker } = await supabase
        .from('brokers')
        .select('id, name')
        .eq('referral_code', brokerCode)
        .eq('active', true)
        .maybeSingle()
      if (broker) {
        brokerId   = broker.id
        brokerName = broker.name
      }
    }

    // ── 2. Duplicate EIN check ────────────────────────────────────────────
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const { data: existing } = await supabase
      .from('applications')
      .select('deal_id, status, created_at')
      .eq('ein', data.ein)
      .not('status', 'in', '("declined","draft","failed")')
      .gte('created_at', thirtyDaysAgo)
      .limit(1)
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { error: 'An application for this business has already been submitted in the last 30 days. Please contact us if you need assistance.' },
        { status: 409 },
      )
    }

    // ── 3. Insert DB row first (status: 'draft') ─────────────────────────
    // Inserting before PDF generation means PDF is never orphaned in storage
    // if the DB insert fails. Draft status is invisible to the pipeline.
    // Sanitize business name for dealId: strip diacritics and non-ASCII chars
    // (smart quotes, emoji, accented letters) that break Supabase storage paths.
    const safeName = data.businessName
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .toUpperCase() || 'APPLICATION'
    dealId = `${safeName}-${now.getTime()}`

    const { error: dbError } = await supabase.from('applications').insert({
      deal_id:              dealId,
      status:               'draft',
      created_at:           timestamp,
      submitted_by:         brokerId ? 'broker' : 'CMF Website',
      broker_id:            brokerId,
      broker_code:          brokerCode,
      broker_name:          brokerName,
      business_name:        data.businessName,
      dba:                  data.dba || null,
      business_address:     `${data.businessAddress}, ${data.businessCity}, ${data.businessState} ${data.businessZip}`,
      business_phone:       data.businessPhone,
      ein:                  data.ein,
      date_started:         data.dateStarted || null,
      entity_type:          data.entityType,
      business_email:       data.businessEmail,
      business_description: data.businessDescription,
      monthly_revenue_range:   data.monthlyRevenue,
      requested_amount_range:  data.requestedAmount,
      use_of_funds:            data.useOfFunds,
      owner_name:           data.ownerName,
      owner_cell_phone:     data.ownerCellPhone || null,
      owner_title:          data.ownerTitle,
      ownership_pct:        parseInt(data.ownershipPct) || null,
      home_address:         `${data.homeAddress}, ${data.homeCity}, ${data.homeState} ${data.homeZip}`,
      ssn_full:             data.ssnFull,
      ssn_last4:            data.ssnFull.replace(/\D/g, '').slice(-4),
      dob:                  data.dob || null,
      fico_range:           data.ficoRange,
      open_positions:       data.openPositions,
      mca_balance:          data.mcaBalance || '0',
      second_owner_name:    data.hasSecondOwner ? data.secondOwnerName : null,
      second_owner_title:   data.hasSecondOwner ? data.secondOwnerTitle : null,
      second_owner_pct:     data.hasSecondOwner ? parseInt(data.secondOwnerPct || '0') || null : null,
      second_owner_address: data.hasSecondOwner ? `${data.secondOwnerAddress}, ${data.secondOwnerCity}, ${data.secondOwnerState} ${data.secondOwnerZip}` : null,
      second_owner_ssn_full: data.hasSecondOwner ? data.secondOwnerSsnFull : null,
      second_owner_ssn_last4: data.hasSecondOwner && data.secondOwnerSsnFull
        ? data.secondOwnerSsnFull.replace(/\D/g, '').slice(-4) : null,
      second_owner_dob:     data.hasSecondOwner ? data.secondOwnerDob || null : null,
      second_owner_fico:    data.hasSecondOwner ? data.secondOwnerFico : null,
      signature_timestamp:  timestamp,
      ip_address:           req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || null,
    })

    if (dbError) throw new Error('Failed to save application record')

    // ── 4. Generate + upload PDF ──────────────────────────────────────────
    const pdfBuffer = await renderToBuffer(
      createElement(ApplicationPDF, { data, date: dateStr }) as ReactElement<ComponentProps<typeof Document>>
    )

    const pdfPath = `applications/${dealId}.pdf`
    const { error: pdfUploadError } = await supabase.storage
      .from('applications')
      .upload(pdfPath, pdfBuffer, { contentType: 'application/pdf' })

    if (pdfUploadError) {
      await supabase.from('applications').update({ status: 'failed' }).eq('deal_id', dealId)
      throw new Error('Failed to upload application PDF')
    }

    const { data: pdfSigned } = await supabase.storage
      .from('applications')
      .createSignedUrl(pdfPath, 900)  // 15-minute signed URL

    // ── 5. Insert document records (bank statements) ──────────────────────
    const bankUrls:  string[] = data.bankStatementUrls  || []
    const bankNames: string[] = data.bankStatementNames || []

    const documentInserts = bankNames.map((name, i) => ({
      deal_id:   dealId,
      type:      'bank_statement',
      file_name: name || `statement-${i + 1}.pdf`,
      file_path: extractStoragePath(bankUrls[i] || ''),
      file_url:  bankUrls[i] || '',
      bucket:    'bank-statements',
    })).filter(d => d.file_name && d.file_path)

    if (documentInserts.length > 0) {
      const { error: docsError } = await supabase.from('documents').insert(documentInserts)
      if (docsError) {
        console.error(`[submit] Document insert error for ${dealId}:`, docsError.message)
      }
    }

    // ── 6. Flip status to 'processing' then 'submitted' ──────────────────
    // Two-step so pipeline only fires AFTER documents are in the table
    await supabase.from('applications').update({ status: 'processing' }).eq('deal_id', dealId)
    const { error: statusError } = await supabase
      .from('applications')
      .update({ status: 'submitted' })
      .eq('deal_id', dealId)

    if (statusError) {
      console.error(`[submit] Failed to set status=submitted for ${dealId}:`, statusError.message)
    }

    // ── 7. Fetch bank statements for email attachments ────────────────────
    const bankAttachments: { filename: string; content: Buffer }[] = []
    for (let i = 0; i < bankUrls.length; i++) {
      try {
        const response = await fetch(bankUrls[i])
        if (response.ok) {
          const buffer = Buffer.from(await response.arrayBuffer())
          bankAttachments.push({ filename: bankNames[i] || `statement-${i + 1}.pdf`, content: buffer })
        }
      } catch {
        // Non-fatal — skip failed attachment
      }
    }

    // ── 8. Send internal submission email ─────────────────────────────────
    await resend.emails.send({
      from:    `CapitalMatch <${process.env.SUBMISSIONS_EMAIL || 'noreply@capitalmatchfunding.com'}>`,
      to:      process.env.SUBMISSIONS_EMAIL || 'subs@capitalmatchfunding.com',
      replyTo: 'subs@capitalmatchfunding.com',
      subject: `NEW APPLICATION -- ${data.businessName.toUpperCase()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0D1B2A;">
          <div style="background: #0D1B2A; padding: 24px; text-align: center;">
            <h1 style="color: #C9A84C; font-size: 24px; margin: 0;">CapitalMatch</h1>
            <p style="color: rgba(255,255,255,0.7); margin: 8px 0 0; font-size: 14px;">New Application Received</p>
          </div>
          <div style="padding: 32px; background: #fff; border: 1px solid #e5e7eb;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-weight: 600; width: 160px;">Business</td><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${data.businessName}</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-weight: 600;">Owner</td><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${data.ownerName}</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-weight: 600;">Monthly Revenue</td><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${data.monthlyRevenue}</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-weight: 600;">Amount Requested</td><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${data.requestedAmount}</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-weight: 600;">Open Positions</td><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${data.openPositions}</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-weight: 600;">Submitted</td><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${now.toLocaleString('en-US', { timeZone: 'America/New_York' })} ET</td></tr>
              <tr><td style="padding: 8px 0; font-weight: 600;">Deal Reference</td><td style="padding: 8px 0; font-family: monospace; font-size: 13px; color: #C9A84C;">${dealId}</td></tr>
            </table>
            <p style="margin: 24px 0 0; font-size: 13px; color: #6B7280;">
              Application PDF and ${bankAttachments.length} bank statement(s) attached.
            </p>
          </div>
        </div>
      `,
      attachments: [
        { filename: `${dealId}-application.pdf`, content: pdfBuffer },
        ...bankAttachments,
      ],
    })

    return NextResponse.json({ success: true, reference: dealId })

  } catch (error) {
    console.error(`[submit] Error${dealId ? ` for ${dealId}` : ''}:`, error instanceof Error ? error.message : error)
    return NextResponse.json({ error: 'Submission failed. Please try again.' }, { status: 500 })
  }
}
