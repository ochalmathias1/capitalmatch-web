import Navigation from '@/components/Navigation'
import Hero from '@/components/landing/Hero'
import HowItWorks from '@/components/landing/HowItWorks'
import WhyCapitalMatch from '@/components/landing/WhyCapitalMatch'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <HowItWorks />
        <WhyCapitalMatch />
      </main>
      <Footer />
    </>
  )
}
