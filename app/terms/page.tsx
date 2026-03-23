import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Terms of Service',
  robots: { index: false, follow: false },
}

export default function TermsPage() {
  return (
    <>
      <Navigation />
      <main style={{ paddingTop: '72px', backgroundColor: '#FFFFFF' }}>
        <div style={{ backgroundColor: '#0D1B2A', padding: '3rem 1.5rem', textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-playfair, serif)', fontSize: '2rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.5rem' }}>
            Terms of Service
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-ibm, sans-serif)', fontSize: '0.875rem' }}>
            Effective Date: January 1, 2026
          </p>
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 1.5rem' }}>
          <div style={{ fontFamily: 'var(--font-ibm, sans-serif)', color: '#374151', lineHeight: 1.8, fontSize: '0.95rem' }}>

            <p style={{ marginBottom: '2rem' }}>
              These Terms of Service (&quot;Terms&quot;) govern your use of the CapitalMatch website and services. By submitting an application or using our services, you agree to these Terms. Please read them carefully.
            </p>

            {[
              {
                title: '1. Broker Relationship — We Are Not a Lender',
                content: `CapitalMatch operates exclusively as a commercial finance broker. We are not a lender, bank, or financial institution. We do not provide, fund, or underwrite merchant cash advances or any other financial products. Our role is to collect your application information and present it to third-party lending partners who may choose to offer funding at their sole discretion. Any funding offer you receive comes directly from an independent lender, not from CapitalMatch.`,
              },
              {
                title: '2. No Guarantee of Funding or Specific Terms',
                content: `Submitting an application through CapitalMatch does not guarantee that you will receive a funding offer, that any offer will meet your requested amount or terms, that any offer will be presented within any particular timeframe, or that you will qualify for any specific factor rate, advance amount, or payment schedule. All funding decisions are made solely by independent lenders based on their own underwriting criteria. CapitalMatch makes no representations or warranties regarding the availability, terms, or suitability of any funding offer.`,
              },
              {
                title: '3. Exclusive Broker Authorization',
                content: `By submitting a completed application and signing the authorization, you appoint CapitalMatch as your exclusive commercial finance broker for a period of 90 days from the date of signing. During this period, you agree not to engage any other broker or submit your application directly to any lender introduced to you through CapitalMatch. This exclusivity protects CapitalMatch's investment in processing and submitting your application. This provision applies only to lenders in our network to whom your application was submitted.`,
              },
              {
                title: '4. Credit Authorization',
                content: `By submitting an application, you authorize CapitalMatch and the lending partners to whom your application is submitted to obtain consumer and business credit reports for the purpose of evaluating your funding application. You acknowledge that credit inquiries may appear on your credit report as a result of this authorization.`,
              },
              {
                title: '5. Accuracy of Information',
                content: `You represent and warrant that all information provided in your application is true, accurate, and complete to the best of your knowledge. You agree not to provide false, misleading, or fraudulent information. Providing false information in connection with a funding application may constitute fraud and may result in criminal liability. CapitalMatch reserves the right to reject or cancel any application based on inaccurate or misleading information.`,
              },
              {
                title: '6. No Broker Fees to Applicant',
                content: `CapitalMatch does not charge applicants any broker fees, application fees, or upfront costs. Our compensation is paid by lending partners upon successful funding of your application. You will never be asked to pay CapitalMatch directly for our brokering services.`,
              },
              {
                title: '7. Limitation of Liability',
                content: `To the fullest extent permitted by applicable law, CapitalMatch shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from or related to your use of our services, any funding offer or lack thereof, the actions or decisions of independent lending partners, or any errors or omissions in application processing. CapitalMatch's total liability to you for any claim arising from these Terms or our services shall not exceed one hundred dollars ($100.00). Some jurisdictions do not allow limitations on liability, so these limitations may not apply to you.`,
              },
              {
                title: '8. Indemnification',
                content: `You agree to indemnify, defend, and hold harmless CapitalMatch and its officers, employees, and agents from any claims, damages, losses, or expenses (including reasonable attorneys' fees) arising from your violation of these Terms, your use of our services, your application or the information contained therein, or your violation of any applicable law.`,
              },
              {
                title: '9. Third-Party Lender Agreements',
                content: `If you accept a funding offer, your legal relationship is directly with the independent lender who made the offer, not with CapitalMatch. You will enter into a separate agreement with that lender governing the terms of your advance. CapitalMatch is not a party to that agreement and is not responsible for the lender's performance, the terms offered, or any disputes arising from the funding relationship.`,
              },
              {
                title: '10. Governing Law',
                content: `These Terms are governed by and construed in accordance with the laws of the State of Florida, without regard to its conflict of law principles. Any disputes arising from these Terms or our services shall be resolved in the state or federal courts located in Miami-Dade County, Florida, and you consent to the personal jurisdiction of such courts.`,
              },
              {
                title: '11. Changes to These Terms',
                content: `We reserve the right to update these Terms at any time. Material changes will be communicated by posting updated Terms on our website with a new effective date. Your continued use of our services after changes are posted constitutes acceptance of the revised Terms.`,
              },
              {
                title: '12. Contact Us',
                content: `Questions about these Terms should be directed to: CapitalMatch, legal@capitalmatchfunding.com. For general inquiries: support@capitalmatchfunding.com.`,
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
