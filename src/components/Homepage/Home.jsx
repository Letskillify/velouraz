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
import Newsletter from '../Newsletter'

function Home() {
  return (
    <>
     <Hero />
     <Marquee />
     <PromoSlider />
     {/* <BestSellers /> */}
     <QualitySection />
     {/* <CategorySection /> */}
     {/* <TheEdit /> */}
     <TestimonialSection />
     {/* <Stories/> */}
     <TheJournal />
     <Newsletter />
    </>
  )
}

export default Home
