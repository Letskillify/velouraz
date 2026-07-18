import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Globe, Gem, Package, RotateCcw, ShieldCheck, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

const GOLD = '#C8A97A';
const SERIF = "'Cormorant Garamond', Georgia, serif";

const usps = [
  { icon: <Globe size={16} strokeWidth={1.2} />, title: 'Inspired by Cultures', desc: 'Curated from across the world' },
  { icon: <Gem size={16} strokeWidth={1.2} />, title: 'Premium Quality', desc: 'Crafted to last, made to shine' },
  { icon: <Package size={16} strokeWidth={1.2} />, title: 'Secure Packaging', desc: 'Perfectly packed with care' },
  { icon: <RotateCcw size={16} strokeWidth={1.2} />, title: 'Easy Returns', desc: 'Hassle-free 30 day returns' },
  { icon: <ShieldCheck size={16} strokeWidth={1.2} />, title: 'Secure Payments', desc: 'Shop with confidence' },
];

const Hero = () => {
  const videoRef   = useRef(null);
  const sectionRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const videoScale   = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const contentY     = useTransform(scrollYProgress, [0, 1], [0, 60]);

  useEffect(() => { videoRef.current?.play().catch(() => {}); }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ height: '100svh', minHeight: 640 }}
    >

      {/* ── VIDEO BG ─────────────────────────────────── */}
      <motion.div className="absolute inset-0 z-0 origin-center" style={{ scale: videoScale }}>
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{ backgroundImage: "url('/img/b (1).jpeg')", opacity: loaded ? 0 : 1 }}
        />
        <video
          ref={videoRef}
          src="/img/video1.mp4"
          autoPlay muted loop playsInline
          onCanPlay={() => setLoaded(true)}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
          style={{ opacity: loaded ? 1 : 0 }}
        />
      </motion.div>

      {/* ── OVERLAYS ─────────────────────────────────── */}
      {/* Base darkening */}
      <div className="absolute inset-0 z-10" style={{ background: 'rgba(8,5,3,0.22)' }} />
      {/* Left-side content reveal gradient */}
      <div
        className="absolute inset-0 z-10"
        style={{ background: 'linear-gradient(105deg, rgba(8,5,3,0.52) 0%, rgba(8,5,3,0.22) 45%, transparent 70%)' }}
      />
      {/* Bottom fade for USP bar */}
      <div
        className="absolute inset-x-0 bottom-0 z-10 h-[45%]"
        style={{ background: 'linear-gradient(to top, rgba(8,5,3,0.78) 0%, transparent 100%)' }}
      />
      {/* Top fade for header */}
      <div
        className="absolute inset-x-0 top-0 z-10 h-28"
        style={{ background: 'linear-gradient(to bottom, rgba(8,5,3,0.30) 0%, transparent 100%)' }}
      />

      {/* ── CONTENT ──────────────────────────────────── */}
      <motion.div
        className="absolute inset-0 z-20 flex flex-col justify-center"
        style={{ y: contentY }}
      >
        <div className="max-w-[1440px] mx-auto w-full px-6 lg:px-16 ">

          {/* Eyebrow line */}
          <motion.div
            className="flex items-center gap-3 mb-5"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="block h-px w-8 shrink-0" style={{ background: GOLD }} />
            <span
              className="text-[9px] tracking-[0.45em] uppercase font-semibold"
              style={{ color: GOLD, fontFamily: SERIF }}
            >
              Curated &middot; Inspired &middot; Timeless
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="font-light text-white mb-4 lg:mb-5"
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(2.4rem, 5vw, 5rem)',
              lineHeight: 1.07,
              letterSpacing: '-0.01em',
            }}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            Jewellery that <br />
            <em
              className="not-italic font-semibold"
              style={{ color: GOLD }}
            >
              Travels the World
            </em>
          </motion.h1>

          {/* Sub-copy */}
          <motion.p
            className="mb-7 lg:mb-8 max-w-xs text-white/65 font-light leading-snug"
            style={{ fontFamily: SERIF, fontSize: 'clamp(0.9rem, 1.2vw, 1.05rem)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            Handpicked designs from iconic cultures,<br className="hidden md:block" /> crafted for the modern you.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex items-center gap-5 flex-wrap"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.36, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Primary */}
            <Link
              to="/shop"
              className="group relative inline-flex items-center overflow-hidden text-white"
              style={{
                background: '#7A0E2E',
                padding: '12px 32px',
                fontSize: '9px',
                letterSpacing: '0.32em',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              <span className="relative z-10">Explore Collections</span>
              <span
                className="absolute left-[-100%] top-0 h-full w-full transition-transform duration-700 group-hover:translate-x-[200%]"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }}
              />
            </Link>

            {/* Ghost */}
            <Link
              to="/world-edit"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-300"
              style={{ fontSize: '9px', letterSpacing: '0.3em', fontWeight: 600, textTransform: 'uppercase' }}
            >
              <span className="border-b border-white/30 hover:border-white pb-px">World Edit</span>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* ── SCROLL CUE ───────────────────────────────── */}
      <motion.button
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        className="absolute z-30 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/35 hover:text-[#C8A97A] transition-colors duration-300"
        style={{ bottom: 108 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.7 }}
      >
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.9, ease: 'easeInOut' }}
        >
          <ChevronDown size={20} strokeWidth={1.2} />
        </motion.div>
      </motion.button>

      {/* ── USP BAR ──────────────────────────────────── */}
      <div className="absolute bottom-0 inset-x-0 z-30">
        <motion.div
          className="max-w-[1440px] mx-auto px-4 lg:px-10 pb-4 lg:pb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Desktop grid */}
          <div
            className="hidden lg:grid lg:grid-cols-5 divide-x"
            style={{
              background: 'rgba(8,5,3,0.58)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderTop: '1px solid rgba(200,169,122,0.15)',
              borderLeft: '1px solid rgba(200,169,122,0.15)',
              borderRight: '1px solid rgba(200,169,122,0.15)',
              borderBottom: '1px solid rgba(200,169,122,0.08)',
              divideColor: 'rgba(255,255,255,0.06)',
            }}
          >
            {usps.map((u, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-5 py-4"
                style={{ borderRight: i < 4 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}
              >
                <span style={{ color: GOLD, flexShrink: 0 }}>{u.icon}</span>
                <div>
                  <p className="text-[9px] tracking-[0.18em] font-bold uppercase mb-0.5" style={{ color: GOLD }}>
                    {u.title}
                  </p>
                  <p className="text-[14px] text-white/50 font-light" style={{ fontFamily: SERIF }}>
                    {u.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile slider */}
          <div
            className="lg:hidden overflow-hidden"
            style={{
              background: 'rgba(8,5,3,0.62)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(200,169,122,0.12)',
            }}
          >
            <Swiper
              spaceBetween={0}
              slidesPerView={1}
              autoplay={{ delay: 2800, disableOnInteraction: false }}
              modules={[Autoplay]}
              className="w-full"
            >
              {usps.map((u, i) => (
                <SwiperSlide key={i}>
                  <div className="flex items-center gap-3 px-5 py-3.5">
                    <span style={{ color: GOLD, flexShrink: 0 }}>{u.icon}</span>
                    <div>
                      <p className="text-[8.5px] tracking-[0.2em] font-bold uppercase mb-0.5" style={{ color: GOLD }}>
                        {u.title}
                      </p>
                      <p className="text-[14px] text-white/50 font-light" style={{ fontFamily: SERIF }}>
                        {u.desc}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
