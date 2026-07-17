import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

const categories = [
  {
    id: 1,
    num: '01',
    name: "Jewellery Sets",
    image: "img/jewellery/j (3).png",
    link: "/shop?category=sets"
  },
  {
    id: 2,
    num: '02',
    name: "Earrings",
    image: "img/jewellery/j (4).png",
    link: "/shop?category=earrings"
  },
  {
    id: 3,
    num: '03',
    name: "Necklaces",
    image: "img/jewellery/j (1).png",
    link: "/shop?category=necklaces"
  },
  {
    id: 4,
    num: '04',
    name: "Rings",
    image: "img/jewellery/j (5).png",
    link: "/shop?category=rings"
  },
  {
    id: 5,
    num: '05',
    name: "Bangles",
    image: "img/jewellery/j.png",
    link: "/shop?category=bangles"
  },
  {
    id: 6,
    num: '06',
    name: "Bracelets",
    image: "img/jewellery/j (6).png",
    link: "/shop?category=bracelets"
  }
];

const CRIMSON = '#7A0E2E';
const DARK_TEXT = '#2A2623';
const LIGHT_BG = '#FDFCF7';
const GOLD = '#C8A97A';
const SERIF = "'Cormorant Garamond', Georgia, serif";

const CategorySection = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <section className="py-8 lg:py-12 overflow-hidden relative border-t border-[#D8CBBE]/30" style={{ backgroundColor: LIGHT_BG }}>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row items-end justify-between mb-10 gap-6">
          <div className="space-y-4 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-[1px]" style={{ background: CRIMSON }} />
              <span className="text-xs lg:text-[14px] tracking-[0.35em] font-bold text-[#7B6D63] uppercase">
                Browse Collections
              </span>
            </motion.div>
            
            <h2
              className="font-light leading-tight tracking-tight"
              style={{
                color: DARK_TEXT,
                fontFamily: SERIF,
                fontSize: 'clamp(2rem, 3.5vw, 3rem)',
              }}
            >
              Shop By <span className="italic" style={{ color: CRIMSON }}>Category</span>
            </h2>
            
            <p className="text-[#7B6D63] text-[14px] lg:text-[16px] leading-relaxed max-w-md" style={{ fontFamily: SERIF }}>
              Indulge in a curated exploration of jewellery categories, each hand-finished with exceptional mastery.
            </p>
          </div>

          {/* Navigation Controls matching PromoSlider */}
          <div className="flex items-center gap-2 pb-2">
            <button
              ref={prevRef}
              aria-label="Previous categories"
              className="w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none"
              style={{
                borderColor: 'rgba(123, 109, 99, 0.25)',
                color: '#7B6D63',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = CRIMSON;
                e.currentTarget.style.color = CRIMSON;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(123, 109, 99, 0.25)';
                e.currentTarget.style.color = '#7B6D63';
              }}
            >
              <ChevronLeft size={18} strokeWidth={1.5} />
            </button>
            <button
              ref={nextRef}
              aria-label="Next categories"
              className="w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none"
              style={{
                borderColor: 'rgba(123, 109, 99, 0.25)',
                color: '#7B6D63',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = CRIMSON;
                e.currentTarget.style.color = CRIMSON;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(123, 109, 99, 0.25)';
                e.currentTarget.style.color = '#7B6D63';
              }}
            >
              <ChevronRight size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Categories Slider */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={24}
            slidesPerView={1.3}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            breakpoints={{
              480: { slidesPerView: 2.1 },
              768: { slidesPerView: 3.2 },
              1024: { slidesPerView: 4.2 },
              1280: { slidesPerView: 5.2 },
            }}
            className="!overflow-visible"
          >
            {categories.map((category, index) => (
              <SwiperSlide key={category.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.08 }}
                  className="group flex flex-col space-y-4"
                >
                  <Link 
                    to={category.link} 
                    className="relative w-full aspect-[4/5] overflow-hidden block rounded-[4px] border border-[#D8CBBE]/15 bg-[#F6F2EB] transition-all duration-500 hover:shadow-[0_12px_30px_rgba(42,38,35,0.06)]"
                  >
                    {/* Corner index numbering */}
                    <div 
                      className="absolute top-4 left-5 text-[14px] italic font-light z-10"
                      style={{ color: GOLD, fontFamily: SERIF }}
                    >
                      {category.num}
                    </div>

                    <img 
                      src={category.image} 
                      alt={category.name} 
                      className="w-full h-full object-contain transition-transform duration-[1200ms] scale-[0.87] group-hover:scale-95 p-4"
                    />

                    {/* Elegant hover fade overlay */}
                    <div className="absolute inset-0 bg-[#7A0E2E]/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </Link>
                  
                  <div className="px-1 flex items-center justify-between">
                    <Link to={category.link} className="flex flex-col group/text">
                      <h3 
                        className="text-base lg:text-lg font-light text-[#2A2623] group-hover/text:text-[#7A0E2E] transition-colors"
                        style={{ fontFamily: SERIF }}
                      >
                        {category.name}
                      </h3>
                      <span className="text-[14px] tracking-widest text-[#7B6D63] uppercase font-bold transform translate-y-[-2px] opacity-70 group-hover/text:opacity-100 transition-opacity">
                        View Edit
                      </span>
                    </Link>
                    
                    <Link 
                      to={category.link}
                      aria-label={`Explore ${category.name}`}
                      className="w-8 h-8 rounded-full border border-[#D8CBBE]/30 flex items-center justify-center text-[#7B6D63] hover:text-[#7A0E2E] hover:border-[#7A0E2E] transition-colors duration-300"
                    >
                      <ArrowRight size={13} strokeWidth={2} />
                    </Link>
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

export default CategorySection;