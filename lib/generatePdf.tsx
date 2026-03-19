import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { ApplicationData } from './types'

// ─────────────────────────────────────────────
// STYLE SETS
// compact  — single owner, targets 1 page
// standard — two owners,  2 pages expected
// ─────────────────────────────────────────────

const base = {
  // Shared values between both style sets
  gold:        '#C9A84C',
  navy:        '#0D1B2A',
  gray:        '#6B7280',
  lightGray:   '#9CA3AF',
  border:      '#E5E7EB',
  faintBg:     '#FAFAFA',
}

const compact = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    padding: '22pt 30pt 36pt 30pt',   // top right bottom left — bottom reserve for footer
    color: base.navy,
    backgroundColor: '#FFFFFF',
  },
  header: {
    borderBottom: `2pt solid ${base.gold}`,
    paddingBottom: '7pt',
    marginBottom: '10pt',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  logoText: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 16,
    color: base.navy,
  },
  docTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: base.navy,
    textAlign: 'center',
    marginBottom: '2pt',
  },
  docSubtitle: {
    fontSize: 7,
    color: base.gray,
    textAlign: 'center',
    marginBottom: '10pt',
  },
  sectionTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    backgroundColor: base.navy,
    color: '#FFFFFF',
    padding: '3pt 6pt',
    marginBottom: '5pt',
    marginTop: '8pt',
  },
  grid2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  fieldBlock: {
    width: '50%',
    paddingRight: '10pt',
    marginBottom: '4pt',
  },
  fieldBlockFull: {
    width: '100%',
    marginBottom: '4pt',
  },
  fieldLabel: {
    fontSize: 6.5,
    color: base.lightGray,
    fontFamily: 'Helvetica',
    textTransform: 'uppercase',
    letterSpacing: '0.4pt',
    marginBottom: '1pt',
  },
  fieldValue: {
    fontSize: 9,
    color: base.navy,
    fontFamily: 'Helvetica',
    borderBottom: `0.5pt solid ${base.border}`,
    paddingBottom: '2pt',
  },
  authText: {
    fontSize: 7.5,
    color: '#4B5563',
    lineHeight: 1.5,
    marginBottom: '8pt',
    border: `0.5pt solid ${base.border}`,
    padding: '5pt 7pt',
    backgroundColor: base.faintBg,
  },
  signatureLine: {
    borderBottom: `1pt solid ${base.navy}`,
    marginTop: '6pt',
    marginBottom: '2pt',
    width: '220pt',
  },
  signatureText: {
    fontFamily: 'Helvetica-Oblique',
    fontSize: 13,
    color: base.navy,
  },
  signatureLabel: {
    fontSize: 7,
    color: base.lightGray,
  },
  footer: {
    position: 'absolute',
    bottom: '14pt',
    left: '30pt',
    right: '30pt',
    borderTop: `0.5pt solid ${base.border}`,
    paddingTop: '4pt',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 6.5,
    color: base.lightGray,
  },
})

const standard = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    padding: '36pt 48pt 48pt 48pt',
    color: base.navy,
    backgroundColor: '#FFFFFF',
  },
  header: {
    borderBottom: `2pt solid ${base.gold}`,
    paddingBottom: '12pt',
    marginBottom: '16pt',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  logoText: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 18,
    color: base.navy,
  },
  docTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: base.navy,
    textAlign: 'center',
    marginBottom: '4pt',
  },
  docSubtitle: {
    fontSize: 8,
    color: base.gray,
    textAlign: 'center',
    marginBottom: '16pt',
  },
  sectionTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    backgroundColor: base.navy,
    color: '#FFFFFF',
    padding: '4pt 8pt',
    marginBottom: '8pt',
    marginTop: '12pt',
  },
  grid2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  fieldBlock: {
    width: '50%',
    paddingRight: '12pt',
    marginBottom: '7pt',
  },
  fieldBlockFull: {
    width: '100%',
    marginBottom: '7pt',
  },
  fieldLabel: {
    fontSize: 7,
    color: base.lightGray,
    fontFamily: 'Helvetica',
    textTransform: 'uppercase',
    letterSpacing: '0.5pt',
    marginBottom: '2pt',
  },
  fieldValue: {
    fontSize: 9,
    color: base.navy,
    fontFamily: 'Helvetica',
    borderBottom: `0.5pt solid ${base.border}`,
    paddingBottom: '3pt',
  },
  authText: {
    fontSize: 8,
    color: '#4B5563',
    lineHeight: 1.6,
    marginBottom: '12pt',
    border: `0.5pt solid ${base.border}`,
    padding: '8pt',
    backgroundColor: base.faintBg,
  },
  signatureLine: {
    borderBottom: `1pt solid ${base.navy}`,
    marginTop: '8pt',
    marginBottom: '3pt',
    width: '240pt',
  },
  signatureText: {
    fontFamily: 'Helvetica-Oblique',
    fontSize: 14,
    color: base.navy,
  },
  signatureLabel: {
    fontSize: 7,
    color: base.lightGray,
  },
  footer: {
    position: 'absolute',
    bottom: '20pt',
    left: '48pt',
    right: '48pt',
    borderTop: `0.5pt solid ${base.border}`,
    paddingTop: '5pt',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 7,
    color: base.lightGray,
  },
})

// ─────────────────────────────────────────────
// SHARED FIELD COMPONENT
// Accepts a style set so it works in both layouts
// ─────────────────────────────────────────────

type StyleSet = typeof compact | typeof standard

function Field({
  label, value, full, S,
}: { label: string; value: string; full?: boolean; S: StyleSet }) {
  return (
    <View style={full ? S.fieldBlockFull : S.fieldBlock}>
      <Text style={S.fieldLabel}>{label}</Text>
      <Text style={S.fieldValue}>{value || '—'}</Text>
    </View>
  )
}

// ─────────────────────────────────────────────
// SECTION BLOCKS (reused on both page variants)
// ─────────────────────────────────────────────

function SectionBusiness({ data, S }: { data: ApplicationData; S: StyleSet }) {
  return (
    <>
      <Text style={S.sectionTitle}>SECTION 1 — BUSINESS INFORMATION</Text>
      <View style={S.grid2}>
        <Field S={S} label="Business Legal Name"   value={data.businessName} />
        <Field S={S} label="DBA (if different)"     value={data.dba || 'N/A'} />
        <Field S={S} label="Business Address"       value={`${data.businessAddress}, ${data.businessCity}, ${data.businessState} ${data.businessZip}`} full />
        <Field S={S} label="Business Phone"         value={data.businessPhone} />
        <Field S={S} label="EIN"                    value={data.ein} />
        <Field S={S} label="Date Business Started"  value={data.dateStarted} />
        <Field S={S} label="Entity Type"            value={data.entityType} />
        <Field S={S} label="Business Email"         value={data.businessEmail} />
        <Field S={S} label="Business Description"   value={data.businessDescription} full />
      </View>
    </>
  )
}

function SectionFunding({ data, S }: { data: ApplicationData; S: StyleSet }) {
  return (
    <>
      <Text style={S.sectionTitle}>SECTION 2 — FUNDING REQUEST</Text>
      <View style={S.grid2}>
        <Field S={S} label="Monthly Revenue"      value={data.monthlyRevenue} />
        <Field S={S} label="Amount Requested"     value={data.requestedAmount} />
        <Field S={S} label="Use of Funds"         value={data.useOfFunds} />
        <Field S={S} label="Open Positions"       value={data.openPositions} />
        <Field S={S} label="Current MCA Balance"  value={data.mcaBalance || '0'} />
      </View>
    </>
  )
}

function SectionOwner({ data, S }: { data: ApplicationData; S: StyleSet }) {
  return (
    <>
      <Text style={S.sectionTitle}>SECTION 3 — OWNER INFORMATION</Text>
      <View style={S.grid2}>
        <Field S={S} label="Owner Name"           value={data.ownerName} />
        <Field S={S} label="Cell Phone"           value={data.ownerCellPhone} />
        <Field S={S} label="Title"               value={data.ownerTitle} />
        <Field S={S} label="Ownership"           value={`${data.ownershipPct}%`} />
        <Field S={S} label="Home Address"        value={`${data.homeAddress}, ${data.homeCity}, ${data.homeState} ${data.homeZip}`} full />
        <Field S={S} label="Date of Birth"       value={data.dob} />
        <Field S={S} label="Credit Score Range"  value={data.ficoRange} />
        <Field S={S} label="SSN"                 value={data.ssnFull} />
      </View>
    </>
  )
}

function SectionSecondOwner({ data, S }: { data: ApplicationData; S: StyleSet }) {
  return (
    <>
      <Text style={S.sectionTitle}>SECTION 3B — SECOND OWNER</Text>
      <View style={S.grid2}>
        <Field S={S} label="Owner Name"          value={data.secondOwnerName || ''} />
        <Field S={S} label="Title"               value={data.secondOwnerTitle || ''} />
        <Field S={S} label="Ownership"           value={`${data.secondOwnerPct || ''}%`} />
        <Field S={S} label="Home Address"        value={`${data.secondOwnerAddress}, ${data.secondOwnerCity}, ${data.secondOwnerState} ${data.secondOwnerZip}`} full />
        <Field S={S} label="Date of Birth"       value={data.secondOwnerDob || ''} />
        <Field S={S} label="Credit Score Range"  value={data.secondOwnerFico || ''} />
        <Field S={S} label="SSN"                 value={data.secondOwnerSsnFull || ''} />
      </View>
    </>
  )
}

function SectionAuth({ data, date, S }: { data: ApplicationData; date: string; S: StyleSet }) {
  const AUTH_TEXT = `By signing below, I authorize CapitalMatch, its assigns, agents, banks, and financial institutions to obtain an investigative or consumer credit report from any credit bureau or credit reporting agency, and to investigate the references given or any other statements or data obtained from the applicant or any other person pertaining to the applicant. I also authorize CapitalMatch to act as my exclusive commercial finance broker for a period of 90 days from the date signed.`
  return (
    <>
      <Text style={S.sectionTitle}>SECTION 4 — AUTHORIZATION</Text>
      <Text style={S.authText}>{AUTH_TEXT}</Text>
      <Text style={S.signatureText}>{data.signatureName}</Text>
      <View style={S.signatureLine} />
      <Text style={S.signatureLabel}>Authorized Signature — {data.signatureName}</Text>
      <Text style={{ fontSize: 8, color: '#4B5563', marginTop: '6pt' }}>Date Signed: {date}</Text>
    </>
  )
}

function PageHeader({ S }: { S: StyleSet }) {
  return (
    <View style={S.header}>
      <Text style={S.logoText}>CapitalMatch</Text>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={{ fontSize: 8, color: base.gray }}>capitalmatchfunding.com</Text>
        <Text style={{ fontSize: 8, color: base.gray }}>CONFIDENTIAL</Text>
      </View>
    </View>
  )
}

// Footer with dynamic page number — must use render prop for totalPages
function PageFooter({ S }: { S: StyleSet }) {
  return (
    <View style={S.footer} fixed>
      <Text style={S.footerText}>CapitalMatch — Confidential</Text>
      <Text
        style={S.footerText}
        render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
      />
      <Text style={S.footerText}>capitalmatchfunding.com</Text>
    </View>
  )
}

// ─────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────

export function ApplicationPDF({ data, date }: { data: ApplicationData; date: string }) {
  const hasSecondOwner = !!(data.hasSecondOwner && data.secondOwnerName)

  // ── TWO OWNERS — 2 pages ──────────────────────────────────────────────────
  // Page 1: header + business + funding + owner 1
  // Page 2: owner 2 + authorization + signature
  if (hasSecondOwner) {
    const S = standard
    return (
      <Document>
        {/* Page 1 */}
        <Page size="LETTER" style={S.page}>
          <PageHeader S={S} />
          <Text style={S.docTitle}>Merchant Cash Advance Application</Text>
          <Text style={S.docSubtitle}>Date of Application: {date}</Text>
          <SectionBusiness  data={data} S={S} />
          <SectionFunding   data={data} S={S} />
          <SectionOwner     data={data} S={S} />
          <PageFooter S={S} />
        </Page>

        {/* Page 2 */}
        <Page size="LETTER" style={S.page}>
          <PageHeader S={S} />
          <SectionSecondOwner data={data} S={S} />
          <SectionAuth        data={data} date={date} S={S} />
          <PageFooter S={S} />
        </Page>
      </Document>
    )
  }

  // ── SINGLE OWNER — 1 page ─────────────────────────────────────────────────
  const S = compact
  return (
    <Document>
      <Page size="LETTER" style={S.page}>
        <PageHeader S={S} />
        <Text style={S.docTitle}>Merchant Cash Advance Application</Text>
        <Text style={S.docSubtitle}>Date of Application: {date}</Text>
        <SectionBusiness  data={data} S={S} />
        <SectionFunding   data={data} S={S} />
        <SectionOwner     data={data} S={S} />
        <SectionAuth      data={data} date={date} S={S} />
        <PageFooter S={S} />
      </Page>
    </Document>
  )
}
