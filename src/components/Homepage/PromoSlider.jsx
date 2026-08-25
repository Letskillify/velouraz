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
    id: 'paris',
    country: 'PARIS',
    collection: 'THE MAISON PARIS',
    badge: 'ORGANIC',
    video: 'https://res.cloudinary.com/dcjn4y284/video/upload/v1787673523/paris_ufrhvg.mp4',
    defaultImage: 'https://res.cloudinary.com/dcjn4y284/image/upload/v1787672216/paris_vsqtxa.png',
    hoverImage: 'https://res.cloudinary.com/dcjn4y284/image/upload/v1787672216/paris_vsqtxa.png',
    link: '/shop?country=Paris'
  },
  {
    id: 'thailand',
    country: 'THAILAND',
    collection: 'THE THAI GEMSTONE EDIT',
    badge: 'ORGANIC',
    video: 'https://res.cloudinary.com/dcjn4y284/video/upload/v1787673905/Luxury_jewellery_commercial_vide__202608252134_tmc8h9.mp4',
    defaultImage: 'https://res.cloudinary.com/dcjn4y284/image/upload/v1787672219/thiland_yz8axz.png',
    hoverImage: 'https://res.cloudinary.com/dcjn4y284/image/upload/v1787672219/thiland_yz8axz.png',
    link: '/shop?country=Thailand'
  },
  {
    id: 'india',
    country: 'INDIA',
    collection: 'HERITAGE COLLECTION',
    badge: 'ORGANIC',
    video: 'https://res.cloudinary.com/dcjn4y284/video/upload/v1787419483/Diamond_ring_on_crystal_display_202608222147_kscwkr.mp4',
    defaultImage: 'https://res.cloudinary.com/dcjn4y284/image/upload/v1787672225/india_yqlodw.png',
    hoverImage: 'https://res.cloudinary.com/dcjn4y284/image/upload/v1787672225/india_yqlodw.png',
    link: '/shop?country=India'
  },
  {
    id: 'japan',
    country: 'JAPAN',
    collection: 'MIYUKI ATELIER',
    badge: 'ORGANIC',
    video: 'https://res.cloudinary.com/dcjn4y284/video/upload/v1787673506/japan_zgoqxh.mp4',
    defaultImage: 'https://res.cloudinary.com/dcjn4y284/image/upload/v1787672222/japan_mzkd7z.png',
    hoverImage: 'https://res.cloudinary.com/dcjn4y284/image/upload/v1787672222/japan_mzkd7z.png',
    link: '/shop?country=Japan'
  },
  {
    id: 'south-korea',
    country: 'SOUTH KOREA',
    collection: 'PEARLS & SILVER',
    badge: 'ORGANIC',
    video: 'https://res.cloudinary.com/dcjn4y284/video/upload/v1787419491/Jewellery_commercial_on_ceramic___202608222147_evmtuf.mp4',
    defaultImage: 'https://res.cloudinary.com/dcjn4y284/image/upload/v1787672225/south_korea_km1orl.png',
    hoverImage: 'https://res.cloudinary.com/dcjn4y284/image/upload/v1787672225/south_korea_km1orl.png',
    link: '/shop?country=South%20Korea'
  }
];

const CRIMSON = '#2e0e43';
const LIGHT_BG = '#FFFFFF';
const SERIF = "'Cormorant Garamond', Georgia, serif";

const CardItem = ({ item }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const videoRef = useRef(null);

  const videoSrc = item.video || item.videoUrl;

  useEffect(() => {
    let interval;
    if (!videoSrc && isHovered) {
      // Switch immediately to 2nd image on hover when video is absent
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
  }, [isHovered, videoSrc]);

  const defaultImg = item.defaultImage || item.image;
  const hoverImg = item.hoverImage || item.defaultImage || item.image;

  return (
    <Link
      to={item.link || '#'}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative block aspect-[3/4] w-full overflow-hidden bg-gray-900 rounded-none shadow-md"
    >
      {/* Organic Ribbon Badge */}
      
      {/* Container for Video or Images */}
      <div className="relative w-full h-full overflow-hidden">
        {videoSrc ? (
          <video
            ref={videoRef}
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <>
            {/* 1st Image */}
            <img
              src={defaultImg}
              alt={item.country}
              className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
                currentImageIndex === 0 ? 'opacity-100' : 'opacity-0'
              }`}
            />

            {/* 2nd Image */}
            <img
              src={hoverImg}
              alt={`${item.country} alternative`}
              className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
                currentImageIndex === 1 ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </>
        )}
      </div>

      {/* Bottom Vignette Gradient */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none z-10" />

      {/* Card Overlay Text */}
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 text-center z-15 flex flex-col items-center justify-end">
        <h3 className="text-white text-sm sm:text-base md:text-lg font-extrabold uppercase tracking-wider drop-shadow-md">
          {item.country}
        </h3>
        {item.collection && (
          <p className="text-white/85 text-[9px] sm:text-[10px] md:text-[11px] tracking-[0.18em] uppercase mt-1 font-medium opacity-90">
            {item.collection}
          </p>
        )}
      </div>

      {/* Inner Border */}
      <div className="absolute inset-0 border border-white/10 pointer-events-none z-20" />
    </Link>
  );
};

const PromoSlider = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [collections, setCollections] = useState(staticCollections);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    return onSnapshot(collection(db, "world_edits_carousel"), (snap) => {
      if (!snap.empty) {
        const fetched = snap.docs.map((d, index) => {
          const data = d.data();
          const countryName = data.country || '';
          const fallbackVideo = staticCollections[index] ? staticCollections[index].video : null;
          return {
            id: d.id,
            badge: 'ORGANIC',
            ...data,
            video: data.video || data.videoUrl || fallbackVideo,
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
    <section className="w-full relative py-6 md:py-8 overflow-hidden" style={{ backgroundColor: LIGHT_BG }}>
      <div className="max-w-[1650px] mx-auto px-4 sm:px-6 lg:px-10 mb-6 md:mb-8 flex items-center justify-between">
        <div className="w-10 opacity-0 hidden sm:block" /> {/* Spacer for centering */}
        
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="font-serif font-light leading-tight tracking-tight text-3xl sm:text-4xl md:text-5xl lg:text-[42px] text-[#222222]"
          >
            World <span className="italic font-normal text-[#2e0e43]">Edits</span>
          </h2>
          <div className="flex items-center justify-center gap-3 mt-3">
            <span className="w-8 h-[1px] bg-[#B58E58]/40" />
            <span className="text-xs text-[#B58E58]">✦</span>
            <span className="w-8 h-[1px] bg-[#B58E58]/40" />
          </div>
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

      {/* Grid on Desktop (5 columns) & Swiper Slider on Mobile/Tablet */}
      {isDesktop ? (
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-[1650px]">
          <div className="mx-auto grid grid-cols-5 gap-3 sm:gap-4 md:gap-5">
            {collections.map((item) => (
              <CardItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      ) : (
        <div className="mx-auto px-4 sm:px-6 lg:px-10">
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
              320: { slidesPerView: 1.2, spaceBetween: 12 },
              480: { slidesPerView: 1.8, spaceBetween: 16 },
              640: { slidesPerView: 2.5, spaceBetween: 16 },
              768: { slidesPerView: 3.5, spaceBetween: 20 },
              1024: { slidesPerView: 5, spaceBetween: 24 },
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
      )}
    </section>
  );
};

export default PromoSlider;


