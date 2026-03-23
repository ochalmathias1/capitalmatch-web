import Navigation from '@/components/Navigation'
import Hero from '@/components/landing/Hero'
import Mission from '@/components/landing/Mission'
import StatsBanner from '@/components/landing/StatsBanner'
import HowItWorks from '@/components/landing/HowItWorks'
import WhyCapitalMatch from '@/components/landing/WhyCapitalMatch'
import Reviews from '@/components/landing/Reviews'
import FinalCTA from '@/components/landing/FinalCTA'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <Mission />
        <StatsBanner />
        <HowItWorks />
        <WhyCapitalMatch />
        <Reviews />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}
