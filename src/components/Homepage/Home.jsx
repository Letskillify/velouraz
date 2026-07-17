import Hero from './Hero'
import PromoSlider from './PromoSlider'
import TestimonialSection from './Testemonials'
import TheJournal from './News'
import BestSellers from './Bestsellers'
import TheEdit from './TheEdit'
import QualitySection from './WhyChoose'
import CategorySection from './CategorySection'
import Stories from './Stories'
import Marquee from './Marquee'

function Home() {
  return (
    <>
     <Hero />
     <Marquee />
     <PromoSlider />
     <QualitySection />
     <CategorySection />
     <BestSellers />
     {/* <TheEdit /> */}
     <TestimonialSection />
     {/* <Stories/> */}
     <TheJournal />
    </>
  )
}

export default Home
