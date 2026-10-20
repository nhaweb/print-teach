import { SiteHeader } from '@/components/landing/site-header'
import { Hero } from '@/components/landing/hero'
import { Services } from '@/components/landing/services'
import { Factory } from '@/components/landing/factory'
import { Finishes } from '@/components/landing/finishes'
import { Testimonials } from '@/components/landing/testimonials'
import { CtaBand } from '@/components/landing/cta-band'
import { SiteFooter } from '@/components/landing/site-footer'
import { MotionProvider } from '@/components/landing/motion-provider'

export default function Page() {
  return (
    <MotionProvider>
      <SiteHeader />
      <main>
        <Hero />
        <Services />
        <Factory />
        <Finishes />
        <Testimonials />
        <CtaBand />
      </main>
      <SiteFooter />
    </MotionProvider>
  )
}
