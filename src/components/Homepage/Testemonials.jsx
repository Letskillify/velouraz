import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

const reviews = [
  {
    name: "Priya S.",
    title: "Collector, Mumbai",
    quote: "The quality is exceptional and designs are so unique. Velauraz is my go-to for every occasion. Every piece I've received has exceeded my expectations.",
    rating: 5
  },
  {
    name: "Ananya R.",
    title: "Bride, Delhi",
    quote: "Stunning pieces and super fast delivery. I felt the luxury in the packaging too — it felt like opening a gift from a couture house.",
    rating: 5
  },
  {
    name: "Neha K.",
    title: "Fashion Editor, Bangalore",
    quote: "Finally found a brand that brings global styles with such elegance. The Korean edit was impeccable — I've been wearing it every single day.",
    rating: 5
  },
  {
    name: "Meera J.",
    title: "Entrepreneur, Hyderabad",
    quote: "Exquisite craftsmanship! The pieces are even more beautiful in person. The Heritage collection is a standout — museum-quality at every angle.",
    rating: 5
  }
];

const CRIMSON = '#7A0E2E';
const SERIF = "'Cormorant Garamond', Georgia, serif";

const TestimonialSection = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <section className="py-16 lg:py-24 relative overflow-hidden border-t border-[#D8CBBE]/30" style={{ background: CRIMSON }}>
      {/* Subtle pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      />
      
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row items-end justify-between mb-14 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-[1px] bg-white/40" />
              <span className="text-xs lg:text-[14px] tracking-[0.35em] font-bold text-white/60 uppercase">
                Patron Stories
              </span>
            </div>
            <h2
              className="font-light leading-tight tracking-tight text-white"
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(2rem, 3.5vw, 3rem)',
              }}
            >
              Real Stories. <span className="italic" style={{ color: 'rgba(255,255,255,0.65)' }}>Real Love.</span>
            </h2>
            <p className="text-white/55 text-[14px] lg:text-[16px] max-w-md leading-relaxed" style={{ fontFamily: SERIF }}>
              Hear from our community of jewellery enthusiasts who found their defining piece with Velauraz.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <button
              ref={prevRef}
              aria-label="Previous review"
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/60 transition-all duration-300"
            >
              <ChevronLeft size={18} strokeWidth={1.5} />
            </button>
            <button
              ref={nextRef}
              aria-label="Next review"
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/60 transition-all duration-300"
            >
              <ChevronRight size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative overflow-hidden">
          <Swiper
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView={1.1}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            breakpoints={{
              640: { slidesPerView: 1.6 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 3.5 },
            }}
            className="!overflow-visible"
          >
            {reviews.map((review, index) => (
              <SwiperSlide key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.09 }}
                  className="p-8 lg:p-10 h-full flex flex-col justify-between border border-white/10 rounded-[4px] hover:border-white/20 transition-colors duration-300"
                  style={{ background: 'rgba(255,255,255,0.05)', minHeight: '260px' }}
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-5">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={11} className="fill-white/70 text-white/70" />
                    ))}
                  </div>

                  <p 
                    className="text-white/85 text-[15px] lg:text-[17px] leading-relaxed italic font-light flex-grow"
                    style={{ fontFamily: SERIF }}
                  >
                    "{review.quote}"
                  </p>

                  <div className="mt-7 pt-5 border-t border-white/10 flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-[#7A0E2E]"
                      style={{ background: 'rgba(255,255,255,0.9)', fontFamily: SERIF }}
                    >
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[10px] tracking-widest font-bold uppercase text-white">
                        {review.name}
                      </p>
                      <p className="text-[12px] text-white/40 mt-0.5" style={{ fontFamily: SERIF }}>
                        {review.title}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;