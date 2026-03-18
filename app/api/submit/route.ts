import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { renderToBuffer, Document } from '@react-pdf/renderer'
import { createElement, type ReactElement, type ComponentProps } from 'react'
import { getServiceClient } from '@/lib/supabase'
import { ApplicationPDF } from '@/lib/generatePdf'
import type { ApplicationData } from '@/lib/types'

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  try {
    const data: ApplicationData = await req.json()
    const supabase = getServiceClient()
    const now = new Date()
    const dateStr = now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
    const timestamp = now.toISOString()
    const reference = `${data.businessName.replace(/\s+/g, '-').toUpperCase()}-${now.getTime()}`
    const dealId = reference

    // Step 1 — Generate PDF
    const pdfBuffer = await renderToBuffer(
      createElement(ApplicationPDF, { data, date: dateStr }) as ReactElement<ComponentProps<typeof Document>>
    )

    // Step 2 — Upload PDF to Supabase Storage
    const pdfPath = `applications/${dealId}.pdf`
    const { error: pdfUploadError } = await supabase.storage
      .from('applications')
      .upload(pdfPath, pdfBuffer, { contentType: 'application/pdf' })

    if (pdfUploadError) throw new Error('Failed to upload application PDF')

    const { data: pdfSigned } = await supabase.storage
      .from('applications')
      .createSignedUrl(pdfPath, 3600)

    // Step 3 — Save to Supabase applications table
    const { error: dbError } = await supabase.from('applications').insert({
      deal_id: dealId,
      status: 'submitted',
      created_at: timestamp,
      business_name: data.businessName,
      dba: data.dba || null,
      business_address: `${data.businessAddress}, ${data.businessCity}, ${data.businessState} ${data.businessZip}`,
      business_phone: data.businessPhone,
      ein: data.ein,
      date_started: data.dateStarted || null,
      entity_type: data.entityType,
      business_email: data.businessEmail,
      business_description: data.businessDescription,
      monthly_revenue_range: data.monthlyRevenue,
      requested_amount_range: data.requestedAmount,
      use_of_funds: data.useOfFunds,
      owner_name: data.ownerName,
      owner_title: data.ownerTitle,
      ownership_pct: parseInt(data.ownershipPct) || null,
      home_address: `${data.homeAddress}, ${data.homeCity}, ${data.homeState} ${data.homeZip}`,
      ssn_full: data.ssnFull,
      ssn_last4: data.ssnFull.replace(/\D/g, '').slice(-4),
      dob: data.dob || null,
      fico_range: data.ficoRange,
      open_positions: data.openPositions,
      mca_balance: data.mcaBalance || '0',
      second_owner_name: data.hasSecondOwner ? data.secondOwnerName : null,
      second_owner_title: data.hasSecondOwner ? data.secondOwnerTitle : null,
      second_owner_pct: data.hasSecondOwner ? parseInt(data.secondOwnerPct) || null : null,
      second_owner_address: data.hasSecondOwner ? `${data.secondOwnerAddress}, ${data.secondOwnerCity}, ${data.secondOwnerState} ${data.secondOwnerZip}` : null,
      second_owner_ssn_full: data.hasSecondOwner ? data.secondOwnerSsnFull : null,
      second_owner_ssn_last4: data.hasSecondOwner ? data.secondOwnerSsnFull.replace(/\D/g, '').slice(-4) : null,
      second_owner_dob: data.hasSecondOwner ? data.secondOwnerDob || null : null,
      second_owner_fico: data.hasSecondOwner ? data.secondOwnerFico : null,
      signature_timestamp: timestamp,
      ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || null,
    })

    if (dbError) throw new Error('Failed to save application')

    // Step 4 — Fetch bank statement signed URLs for email attachments
    const bankUrls: string[] = data.bankStatementUrls || []
    const bankNames: string[] = data.bankStatementNames || []

    // Fetch bank statement files as buffers for email attachment
    const bankAttachments: { filename: string; content: Buffer }[] = []
    for (let i = 0; i < bankUrls.length; i++) {
      try {
        const response = await fetch(bankUrls[i])
        if (response.ok) {
          const buffer = Buffer.from(await response.arrayBuffer())
          bankAttachments.push({ filename: bankNames[i] || `statement-${i + 1}.pdf`, content: buffer })
        }
      } catch {
        // Skip failed attachments — do not block submission
      }
    }

    // Step 5 — Send email via Resend
    await resend.emails.send({
      from: `CapitalMatch <${process.env.SUBMISSIONS_EMAIL || 'noreply@capitalmatchfunding.com'}>`,
      to: process.env.SUBMISSIONS_EMAIL || 'submissions@capitalmatchfunding.com',
      replyTo: 'submissions@capitalmatchfunding.com',
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

    // Step 6 — Send merchant confirmation email
    await resend.emails.send({
      from: 'CapitalMatch <noreply@capitalmatchfunding.com>',
      to: data.businessEmail,
      replyTo: 'replies@capitalmatchfunding.com',
      subject: `Application Received — ${dealId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0D1B2A;">
          <div style="background: #0D1B2A; padding: 24px; text-align: center;">
            <h1 style="color: #C9A84C; font-size: 24px; margin: 0;">CapitalMatch</h1>
            <p style="color: rgba(255,255,255,0.7); margin: 8px 0 0; font-size: 14px;">Application Received</p>
          </div>
          <div style="padding: 32px; background: #ffffff; border: 1px solid #e5e7eb;">
            <p style="font-size: 16px; font-weight: 600; margin: 0 0 8px;">Dear ${data.ownerName},</p>
            <p style="font-size: 14px; color: #374151; margin: 0 0 24px; line-height: 1.6;">
              We have received your CapitalMatch application and your documents are verified. Here is what happens next.
            </p>

            <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
              <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #9CA3AF; margin: 0 0 4px;">Your Reference Number</p>
              <p style="font-family: monospace; font-size: 15px; font-weight: 700; color: #C9A84C; margin: 0;">${dealId}</p>
            </div>

            <p style="font-size: 14px; font-weight: 600; color: #0D1B2A; margin: 0 0 12px;">What happens next:</p>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #F3F4F6; vertical-align: top; width: 28px;">
                  <div style="width: 22px; height: 22px; background: #0D1B2A; border-radius: 50%; text-align: center; line-height: 22px; font-size: 11px; font-weight: 700; color: #C9A84C;">1</div>
                </td>
                <td style="padding: 10px 0 10px 12px; border-bottom: 1px solid #F3F4F6; font-size: 13px; color: #374151; line-height: 1.5;">
                  <strong>Application review</strong> — Our team is reviewing your application right now.
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #F3F4F6; vertical-align: top;">
                  <div style="width: 22px; height: 22px; background: #0D1B2A; border-radius: 50%; text-align: center; line-height: 22px; font-size: 11px; font-weight: 700; color: #C9A84C;">2</div>
                </td>
                <td style="padding: 10px 0 10px 12px; border-bottom: 1px solid #F3F4F6; font-size: 13px; color: #374151; line-height: 1.5;">
                  <strong>Lender matching</strong> — We match your profile to our network of lending partners.
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #F3F4F6; vertical-align: top;">
                  <div style="width: 22px; height: 22px; background: #0D1B2A; border-radius: 50%; text-align: center; line-height: 22px; font-size: 11px; font-weight: 700; color: #C9A84C;">3</div>
                </td>
                <td style="padding: 10px 0 10px 12px; border-bottom: 1px solid #F3F4F6; font-size: 13px; color: #374151; line-height: 1.5;">
                  <strong>Offers collected</strong> — Lenders review your file and return funding offers.
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; vertical-align: top;">
                  <div style="width: 22px; height: 22px; background: #C9A84C; border-radius: 50%; text-align: center; line-height: 22px; font-size: 11px; font-weight: 700; color: #0D1B2A;">4</div>
                </td>
                <td style="padding: 10px 0 10px 12px; font-size: 13px; color: #374151; line-height: 1.5;">
                  <strong>You choose</strong> — We send you all your offers side by side. You pick the one that works best.
                </td>
              </tr>
            </table>

            <div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
              <p style="font-size: 14px; font-weight: 600; color: #166534; margin: 0 0 4px;">⏱ Expected timeline: within 24 hours</p>
              <p style="font-size: 13px; color: #15803D; margin: 0;">You can expect to hear from us with funding offer details within 24 hours.</p>
            </div>

            <p style="font-size: 13px; color: #6B7280; margin: 0; line-height: 1.6;">
              Questions? Simply reply to this email and we will get back to you promptly.
            </p>
          </div>
          <div style="padding: 16px 32px; background: #F9FAFB; border: 1px solid #E5E7EB; border-top: none; text-align: center;">
            <p style="font-size: 12px; color: #9CA3AF; margin: 0;">CapitalMatch — capitalmatchfunding.com</p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true, reference: dealId })
  } catch (error) {
    console.error('Submit error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Submission failed' },
      { status: 500 }
    )
  }
}
