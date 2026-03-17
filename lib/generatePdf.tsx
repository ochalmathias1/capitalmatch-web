import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'
import type { ApplicationData } from './types'

// Register fonts (use standard PDF fonts for reliability)
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    padding: '36pt 48pt',
    color: '#0D1B2A',
    backgroundColor: '#FFFFFF',
  },
  header: {
    borderBottom: '2pt solid #C9A84C',
    paddingBottom: '12pt',
    marginBottom: '16pt',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  logoText: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 18,
    color: '#0D1B2A',
  },
  docTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#0D1B2A',
    textAlign: 'center',
    marginBottom: '4pt',
  },
  docSubtitle: {
    fontSize: 8,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: '16pt',
  },
  sectionTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    backgroundColor: '#0D1B2A',
    color: '#FFFFFF',
    padding: '4pt 8pt',
    marginBottom: '8pt',
    marginTop: '12pt',
  },
  grid2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '0pt',
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
    color: '#9CA3AF',
    fontFamily: 'Helvetica',
    textTransform: 'uppercase',
    letterSpacing: '0.5pt',
    marginBottom: '2pt',
  },
  fieldValue: {
    fontSize: 9,
    color: '#0D1B2A',
    fontFamily: 'Helvetica',
    borderBottom: '0.5pt solid #E5E7EB',
    paddingBottom: '3pt',
  },
  authText: {
    fontSize: 8,
    color: '#4B5563',
    lineHeight: 1.6,
    marginBottom: '12pt',
    border: '0.5pt solid #E5E7EB',
    padding: '8pt',
    backgroundColor: '#FAFAFA',
  },
  signatureLine: {
    borderBottom: '1pt solid #0D1B2A',
    marginTop: '8pt',
    marginBottom: '3pt',
    width: '240pt',
  },
  signatureText: {
    fontFamily: 'Helvetica-Oblique',
    fontSize: 14,
    color: '#0D1B2A',
  },
  signatureLabel: {
    fontSize: 7,
    color: '#9CA3AF',
  },
  footer: {
    position: 'absolute',
    bottom: '24pt',
    left: '48pt',
    right: '48pt',
    borderTop: '0.5pt solid #E5E7EB',
    paddingTop: '6pt',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 7,
    color: '#9CA3AF',
  },
  goldAccent: {
    color: '#C9A84C',
    fontFamily: 'Helvetica-Bold',
  },
})

function Field({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <View style={full ? styles.fieldBlockFull : styles.fieldBlock}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value || '—'}</Text>
    </View>
  )
}

export function ApplicationPDF({ data, date }: { data: ApplicationData; date: string }) {
  const AUTH_TEXT = `By signing below, I authorize CapitalMatch, its assigns, agents, banks, and financial institutions to obtain an investigative or consumer credit report from any credit bureau or credit reporting agency, and to investigate the references given or any other statements or data obtained from the applicant or any other person pertaining to the applicant. I also authorize CapitalMatch to act as my exclusive commercial finance broker for a period of 90 days from the date signed.`

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logoText}>CapitalMatch</Text>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 8, color: '#6B7280' }}>capitalmatchfunding.com</Text>
            <Text style={{ fontSize: 8, color: '#6B7280' }}>CONFIDENTIAL</Text>
          </View>
        </View>

        <Text style={styles.docTitle}>Merchant Cash Advance Application</Text>
        <Text style={styles.docSubtitle}>Date of Application: {date}</Text>

        {/* Section 1 */}
        <Text style={styles.sectionTitle}>SECTION 1 — BUSINESS INFORMATION</Text>
        <View style={styles.grid2}>
          <Field label="Business Legal Name" value={data.businessName} />
          <Field label="DBA (if different)" value={data.dba || 'N/A'} />
          <Field label="Business Address" value={`${data.businessAddress}, ${data.businessCity}, ${data.businessState} ${data.businessZip}`} full />
          <Field label="Business Phone" value={data.businessPhone} />
          <Field label="EIN" value={data.ein} />
          <Field label="Date Business Started" value={data.dateStarted} />
          <Field label="Entity Type" value={data.entityType} />
          <Field label="Business Email" value={data.businessEmail} />
          <Field label="Business Description" value={data.businessDescription} full />
        </View>

        {/* Section 2 */}
        <Text style={styles.sectionTitle}>SECTION 2 — FUNDING REQUEST</Text>
        <View style={styles.grid2}>
          <Field label="Monthly Revenue" value={data.monthlyRevenue} />
          <Field label="Amount Requested" value={data.requestedAmount} />
          <Field label="Use of Funds" value={data.useOfFunds} />
          <Field label="Open Positions" value={data.openPositions} />
          <Field label="Current MCA Balance" value={data.mcaBalance || '0'} />
        </View>

        {/* Section 3 */}
        <Text style={styles.sectionTitle}>SECTION 3 — OWNER INFORMATION</Text>
        <View style={styles.grid2}>
          <Field label="Owner Name" value={data.ownerName} />
          <Field label="Title" value={data.ownerTitle} />
          <Field label="Ownership" value={`${data.ownershipPct}%`} />
          <Field label="Home Address" value={`${data.homeAddress}, ${data.homeCity}, ${data.homeState} ${data.homeZip}`} full />
          <Field label="Date of Birth" value={data.dob} />
          <Field label="Credit Score Range" value={data.ficoRange} />
          <Field label="SSN" value={`XXX-XX-${data.ssnLast4}`} />
        </View>

        {/* Section 3b — Second Owner */}
        {data.hasSecondOwner && data.secondOwnerName && (
          <>
            <Text style={styles.sectionTitle}>SECTION 3B — SECOND OWNER</Text>
            <View style={styles.grid2}>
              <Field label="Owner Name" value={data.secondOwnerName} />
              <Field label="Title" value={data.secondOwnerTitle} />
              <Field label="Ownership" value={`${data.secondOwnerPct}%`} />
              <Field label="Home Address" value={`${data.secondOwnerAddress}, ${data.secondOwnerCity}, ${data.secondOwnerState} ${data.secondOwnerZip}`} full />
              <Field label="Date of Birth" value={data.secondOwnerDob} />
              <Field label="Credit Score Range" value={data.secondOwnerFico} />
              <Field label="SSN" value={`XXX-XX-${data.secondOwnerSsnLast4}`} />
            </View>
          </>
        )}

        {/* Section 4 — Authorization */}
        <Text style={styles.sectionTitle}>SECTION 4 — AUTHORIZATION</Text>
        <Text style={styles.authText}>{AUTH_TEXT}</Text>

        <Text style={styles.signatureText}>{data.signatureName}</Text>
        <View style={styles.signatureLine} />
        <Text style={styles.signatureLabel}>Authorized Signature — {data.signatureName}</Text>
        <Text style={{ fontSize: 8, color: '#4B5563', marginTop: '6pt' }}>Date Signed: {date}</Text>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>CapitalMatch — Confidential</Text>
          <Text style={styles.footerText}>capitalmatchfunding.com</Text>
        </View>
      </Page>
    </Document>
  )
}
