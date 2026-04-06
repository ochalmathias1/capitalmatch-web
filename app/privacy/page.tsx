import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  robots: { index: false, follow: false },
}

export default function PrivacyPage() {
  return (
    <>
      <Navigation />
      <main style={{ paddingTop: '72px', backgroundColor: '#FFFFFF' }}>
        <div style={{ backgroundColor: '#0D1B2A', padding: '3rem 1.5rem', textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-playfair, serif)', fontSize: '2rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.5rem' }}>
            Privacy Policy
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-ibm, sans-serif)', fontSize: '0.875rem' }}>
            Effective Date: January 1, 2026
          </p>
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 1.5rem' }}>
          <div style={{ fontFamily: 'var(--font-ibm, sans-serif)', color: '#374151', lineHeight: 1.8, fontSize: '0.95rem' }}>

            <p style={{ marginBottom: '2rem' }}>
              CapitalMatch (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates as a commercial finance broker. This Privacy Policy describes how we collect, use, share, and protect information obtained through our website at capitalmatchfunding.com and our application process.
            </p>

            {[
              {
                title: '1. Information We Collect',
                content: `We collect information you provide directly when you submit a funding application, including: business name and address, Employer Identification Number (EIN), business financial information, owner name and home address, last four digits of Social Security Number (we do not collect or store full SSNs), date of birth, estimated credit score range, business bank statements, and contact information including phone number and email address. We also automatically collect certain technical information when you visit our website, including IP address, browser type, device information, and pages visited.`,
              },
              {
                title: '2. How We Use Your Information',
                content: `We use the information we collect to: process and evaluate your funding application; match your application to compatible lending partners in our network; communicate with you about your application status and funding offers; verify your identity and business information; comply with applicable legal obligations; improve our website and services; and send transactional communications related to your application.`,
              },
              {
                title: '3. How We Share Your Information',
                content: `We share your information with our network of private lending partners solely for the purpose of evaluating and funding your application. We do not share your personal contact information (phone number and email address) with any lender until you have accepted a specific lender's funding offer and we are delivering your final documentation package. We do not sell your personal information to third parties. We do not share your Social Security Number with any lender under any circumstances. We may share information with service providers who assist us in operating our platform, all of whom are bound by confidentiality obligations.`,
              },
              {
                title: '4. Credit Authorization and Reporting',
                content: `By submitting an application, you authorize CapitalMatch and our lending partners to obtain consumer and business credit reports from credit reporting agencies. This may result in inquiries that appear on your credit report. We obtain this authorization through the signed authorization included in your application. We handle credit information in accordance with the Fair Credit Reporting Act (FCRA) and applicable state laws.`,
              },
              {
                title: '5. Data Security',
                content: `We implement industry-standard security measures to protect your information, including encrypted data transmission (TLS/SSL), secure cloud storage with access controls, and limited access to personal information on a need-to-know basis. Bank statements and application documents are stored in private, access-controlled storage and accessed only via time-limited secure URLs. No method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.`,
              },
              {
                title: '6. Data Retention',
                content: `We retain your application information for as long as necessary to fulfill the purposes described in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. If your application does not result in funding, we typically retain records for three years. Funded applications are retained for seven years in accordance with financial recordkeeping requirements.`,
              },
              {
                title: '7. Your Rights',
                content: `You have the right to request access to the personal information we hold about you, request correction of inaccurate information, request deletion of your information where we are not legally required to retain it, and opt out of marketing communications at any time. To exercise these rights, contact us at privacy@capitalmatchfunding.com.`,
              },
              {
                title: '8. Cookies and Tracking',
                content: `Our website uses cookies and similar technologies to enhance your experience, remember your form progress, and analyze site usage. You can control cookies through your browser settings. Disabling cookies may affect some website functionality, including form progress saving.`,
              },
              {
                title: '9. Children\'s Privacy',
                content: `Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from minors. If we learn we have collected information from a minor, we will delete it promptly.`,
              },
              {
                title: '10. Changes to This Policy',
                content: `We may update this Privacy Policy periodically. We will notify you of material changes by posting the updated policy on our website with a new effective date. Your continued use of our services after changes are posted constitutes acceptance of the updated policy.`,
              },
              {
                title: '11. Contact Us',
                content: `For privacy-related questions or to exercise your rights, contact us at: CapitalMatch, privacy@capitalmatchfunding.com. For general inquiries: lenders@capitalmatchfunding.com.`,
              },
            ].map(({ title, content }) => (
              <div key={title} style={{ marginBottom: '2rem' }}>
                <h2 style={{
                  fontFamily: 'var(--font-playfair, serif)',
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: '#0D1B2A',
                  marginBottom: '0.75rem',
                }}>
                  {title}
                </h2>
                <p>{content}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
