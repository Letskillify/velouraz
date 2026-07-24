import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { db } from '../../components/Firebase';
import { collection, onSnapshot } from 'firebase/firestore';

import 'swiper/css';
import 'swiper/css/navigation';

const staticCollections = [
  {
    id: 'turkey',
    country: 'TURKEY',
    collection: 'EVIL EYE COLLECTION',
    badge: 'ORGANIC',
    defaultImage: 'https://res.cloudinary.com/duzwys877/image/upload/v1784908844/t1_m0x6yw.png',
    hoverImage: 'https://res.cloudinary.com/duzwys877/image/upload/v1784908840/t2_kkdwuf.png',
    link: '/shop?country=Turkey'
  },
  {
    id: 'south-korea',
    country: 'SOUTH KOREA',
    collection: 'PEARLS & SILVER',
    badge: 'ORGANIC',
    defaultImage: 'https://res.cloudinary.com/duzwys877/image/upload/v1784908842/sk1_hy65t6.png',
    hoverImage: 'https://res.cloudinary.com/duzwys877/image/upload/v1784908837/sk2_sl2cal.png',
    link: '/shop?country=South%20Korea'
  },
  {
    id: 'india',
    country: 'INDIA',
    collection: 'HERITAGE COLLECTION',
    badge: 'ORGANIC',
    defaultImage: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800',
    hoverImage: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=800',
    link: '/shop?country=India'
  },
  {
    id: 'europe',
    country: 'EUROPE',
    collection: 'CHARMS COLLECTION',
    badge: 'ORGANIC',
    defaultImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800',
    hoverImage: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800',
    link: '/shop?country=Europe'
  }
];

const CRIMSON = '#2e0e43';
const LIGHT_BG = '#FFFFFF';
const SERIF = "'Cormorant Garamond', Georgia, serif";

const CardItem = ({ item }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    let interval;
    if (isHovered) {
      // Switch immediately to 2nd image on hover
      setCurrentImageIndex(1);

      // Cycle every 2 seconds between 1st (0) and 2nd (1) image continuously
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev === 0 ? 1 : 0));
      }, 2000);
    } else {
      setCurrentImageIndex(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isHovered]);

  const defaultImg = item.defaultImage || item.image;
  const hoverImg = item.hoverImage || item.defaultImage || item.image;

  return (
    <Link
      to={item.link}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative block aspect-[3/4] w-full overflow-hidden bg-gray-100 rounded-none shadow-sm"
    >
      {/* Organic Ribbon Badge */}
      <div className="absolute top-0 left-0 w-24 h-24 overflow-hidden z-20 pointer-events-none">
        <div className="bg-[#487316] text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-widest py-1 px-8 -rotate-45 -translate-x-7 translate-y-3.5 shadow-sm text-center">
          {item.badge || 'ORGANIC'}
        </div>
      </div>

      {/* Image Container with direct instant switch (no zoom, no scale animation) */}
      <div className="relative w-full h-full overflow-hidden">
        {/* 1st Image */}
        <img
          src={defaultImg}
          alt={item.country}
          className={`absolute inset-0 w-full h-full object-cover ${
            currentImageIndex === 0 ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* 2nd Image */}
        <img
          src={hoverImg}
          alt={`${item.country} alternative`}
          className={`absolute inset-0 w-full h-full object-cover ${
            currentImageIndex === 1 ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>

      {/* Bottom Vignette Gradient */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/35 to-transparent pointer-events-none" />

      {/* Card Overlay Text */}
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 text-center z-10 flex flex-col items-center justify-end">
        <h3 className="text-white text-lg sm:text-xl md:text-2xl font-extrabold uppercase tracking-wider drop-shadow-md">
          {item.country}
        </h3>
        {item.collection && (
          <p className="text-white/80 text-[11px] sm:text-xs tracking-[0.2em] uppercase mt-1 font-medium opacity-90">
            {item.collection}
          </p>
        )}
      </div>

      {/* Inner Border */}
      <div className="absolute inset-0 border border-black/5 pointer-events-none" />
    </Link>
  );
};

const PromoSlider = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [collections, setCollections] = useState(staticCollections);

  useEffect(() => {
    return onSnapshot(collection(db, "world_edits_carousel"), (snap) => {
      if (!snap.empty) {
        const fetched = snap.docs.map((d) => {
          const data = d.data();
          const countryName = data.country || '';
          return {
            id: d.id,
            badge: 'ORGANIC',
            ...data,
            defaultImage: data.defaultImage || data.image || 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800',
            hoverImage: data.hoverImage || data.image || 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=800',
            link: `/shop?country=${encodeURIComponent(countryName)}`
          };
        });
        setCollections(fetched);
      } else {
        setCollections(staticCollections);
      }
    });
  }, []);

  return (
    <section className="w-full relative py-12 lg:py-16 overflow-hidden" style={{ backgroundColor: LIGHT_BG }}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 mb-8 flex items-end justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="block h-px w-8" style={{ background: CRIMSON }} />
            <span className="text-xs sm:text-sm tracking-[0.35em] font-bold text-[#7B6D63] uppercase">
              Globally Inspired
            </span>
          </div>
          <h2
            className="font-light leading-tight tracking-tight text-gray-900"
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(2rem, 3.5vw, 3rem)',
            }}
          >
            The World <span className="italic font-normal" style={{ color: CRIMSON }}>Edits</span>
          </h2>
        </div>

        {/* Custom Navigation buttons */}
        <div className="flex items-center gap-2">
          <button
            ref={prevRef}
            aria-label="Previous slide"
            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:border-gray-900 hover:text-black transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronLeft size={18} strokeWidth={1.5} />
          </button>
          <button
            ref={nextRef}
            aria-label="Next slide"
            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:border-gray-900 hover:text-black transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronRight size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Grid on Desktop (4 columns) & Swiper Slider on Mobile/Tablet */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={16}
          slidesPerView={1.15}
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
            480: { slidesPerView: 1.8, spaceBetween: 16 },
            640: { slidesPerView: 2.2, spaceBetween: 20 },
            768: { slidesPerView: 3, spaceBetween: 20 },
            1024: { slidesPerView: 4, spaceBetween: 24 },
          }}
          className="w-full"
        >
          {collections.map((item) => (
            <SwiperSlide key={item.id}>
              <CardItem item={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default PromoSlider;

