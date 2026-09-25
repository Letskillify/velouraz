import useSEO from '../../hooks/useSEO';
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
  useSEO({
    title: 'Globally Curated Jewellery for the Modern Woman',
    description: 'Velouraz brings you handpicked jewellery inspired by cultures across India, Paris, Thailand, Japan, South Korea and beyond. Shop earrings, bangles, rings, necklaces and bracelets crafted for the modern woman.',
    keywords: 'velouraz, jewellery india, globally curated jewellery, statement earrings, gold bangles, bridal jewellery, shop jewellery online india, festive jewellery',
    canonical: '/',
    ogType: 'website',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": "https://www.velouraz.in/#business",
      "name": "Velouraz",
      "image": "https://www.velouraz.in/img/logo.png",
      "description": "Velouraz is a globally curated jewellery brand bringing handpicked pieces inspired by cultures across India, Paris, Thailand, Japan, South Korea and beyond.",
      "url": "https://www.velouraz.in",
      "telephone": "+91-83494-40045",
      "email": "contact@velouraz.in",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "783 Khatiwala Tank",
        "addressLocality": "Indore",
        "addressRegion": "Madhya Pradesh",
        "postalCode": "452014",
        "addressCountry": "IN"
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "10:00",
        "closes": "19:00"
      },
      "priceRange": "$$",
      "currenciesAccepted": "INR",
      "paymentAccepted": "Cash, Credit Card, UPI",
      "sameAs": [
        "https://www.instagram.com/_velouraz_",
        "https://www.facebook.com/share/1Bg4DRSKhd/"
      ]
    }
  });

  return (
    <>
      <Hero />
      <Marquee />
      <PromoSlider />
      <BestSellers />
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
