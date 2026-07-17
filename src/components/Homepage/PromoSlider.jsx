import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

const collections = [
  {
    id: 1,
    country: 'TURKEY',
    collection: 'EVIL EYE COLLECTION',
    image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=800',
    link: '/world-edit/turkey'
  },
  {
    id: 2,
    country: 'JAPAN',
    collection: 'MIYUKI COLLECTION',
    image: 'https://images.unsplash.com/photo-1544413660-299165566b1d?auto=format&fit=crop&q=80&w=800',
    link: '/world-edit/japan'
  },
  {
    id: 3,
    country: 'CHINA',
    collection: 'JADE COLLECTION',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800',
    link: '/world-edit/china'
  },
  {
    id: 4,
    country: 'SOUTH KOREA',
    collection: 'PEARLS & SILVER Collection',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800',
    link: '/world-edit/south-korea'
  },
  {
    id: 5,
    country: 'INDIA',
    collection: 'HERITAGE COLLECTION',
    image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800',
    link: '/world-edit/india'
  },
  {
    id: 6,
    country: 'EUROPE',
    collection: 'CHARMS COLLECTION',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800',
    link: '/world-edit/europe'
  }
];

const CRIMSON = '#7A0E2E';
const DARK_TEXT = '#2A2623';
const LIGHT_BG = '#F8F4EF';
const SERIF = "'Cormorant Garamond', Georgia, serif";

const PromoSlider = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <section className="w-full relative py-14 lg:py-20 border-t border-[#D8CBBE]/30 overflow-hidden" style={{ backgroundColor: LIGHT_BG }}>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 mb-10 flex items-end justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="block h-px w-8" style={{ background: CRIMSON }} />
            <span
              className="text-xs lg:text-[14px] tracking-[0.35em] font-bold text-[#7B6D63] uppercase"
            >
              Globally Inspired
            </span>
          </div>
          <h2
            className="font-light leading-tight tracking-tight"
            style={{
              color: DARK_TEXT,
              fontFamily: SERIF,
              fontSize: 'clamp(2rem, 3.5vw, 3rem)',
            }}
          >
            The World <span className="italic" style={{ color: CRIMSON }}>Edits</span>
          </h2>
        </div>

        {/* Custom Navigation buttons */}
        <div className="flex items-center gap-2">
          <button
            ref={prevRef}
            aria-label="Previous slide"
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
            aria-label="Next slide"
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

      {/* Slider Container */}
      <div className="px-6 lg:px-12">
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={16}
          slidesPerView={1.2}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          breakpoints={{
            480: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 5 }, // 5 cards in a row on desktop
          }}
          className="w-full !overflow-visible"
        >
          {collections.map((item, index) => (
            <SwiperSlide key={item.id} className="snap-center">
              <Link
                to={item.link}
                className="group relative block h-[380px] lg:h-[450px] overflow-hidden border border-[#D8CBBE]/30 rounded-sm bg-[#EAE3DB]"
              >
                {/* Background Image */}
                <img
                  src={item.image}
                  alt={`${item.country} - ${item.collection}`}
                  className="w-full h-full object-cover transition-transform duration-[1.2s] ease-[0.25,0.46,0.45,0.94] group-hover:scale-110"
                />

                {/* Elegant Dark Vignette Overlay internally to keep content readable */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent transition-opacity duration-500"
                />

                {/* Content Container (Bottom Aligned) */}
                <div className="absolute inset-0 flex flex-col justify-end p-5 lg:p-6">
                  <div className="space-y-1 transform transition-transform duration-500 ease-out group-hover:-translate-y-2.5">
                    {/* Country Name */}
                    <h3
                      className="text-white font-light uppercase tracking-[0.06em] text-[20px] lg:text-[23px] leading-tight"
                      style={{ fontFamily: SERIF }}
                    >
                      {item.country}
                    </h3>

                    {/* Collection Subtitle */}
                    <p className="text-[#C8A97A] text-[9px] font-bold tracking-[0.15em] uppercase pb-1.5 break-words">
                      {item.collection}
                    </p>

                    {/* Elegant Discover Tag */}
                    <div className="flex items-center gap-2 text-white/80 text-[9px] tracking-widest uppercase font-medium">
                      <span>Discover</span>
                      <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center transition-all duration-300 group-hover:bg-white group-hover:text-black group-hover:border-white">
                        <ChevronRight size={10} strokeWidth={2.5} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subtle border shine effect */}
                <div className="absolute inset-0 border border-white/0 group-hover:border-white/10 transition-colors duration-500 pointer-events-none" />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default PromoSlider;
