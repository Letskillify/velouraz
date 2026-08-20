import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, ArrowRight, Play, ExternalLink, X } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/free-mode';

const reelPosts = [
  {
    id: 'DcLBf4Tghoy',
    title: "Elegance That Speaks Without Words",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800",
    url: "https://www.instagram.com/reel/DcLBf4Tghoy/?igsh=bW92cHBjZHM3d2Fx",
    tag: "Luxury Edit",
    duration: "0:30"
  },
  {
    id: 'DaxMdOLNzLv',
    title: "Timeless Royal Kundan Craft",
    image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=800",
    url: "https://www.instagram.com/reel/DaxMdOLNzLv/?igsh=MWVlYThqbTYyNHYxYg==",
    tag: "Artisanal Craft",
    duration: "0:45"
  },
  {
    id: 'DbAbQzstTso',
    title: "Precision Setting & Polishing",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
    url: "https://www.instagram.com/reel/DbAbQzstTso/?igsh=N2V0MHh0MW40Nmdy",
    tag: "Atelier Reel",
    duration: "0:25"
  },
  {
    id: 'Db2X8BsDdOg',
    title: "Handcrafted 925 Sterling Silver",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800",
    url: "https://www.instagram.com/reel/Db2X8BsDdOg/?igsh=MWNkaWM3emRubjQwaw==",
    tag: "Sterling Silver",
    duration: "0:35"
  },
  {
    id: 'DbN2BortfR_',
    title: "Velouraz Signature Statement Edit",
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800",
    url: "https://www.instagram.com/reel/DbN2BortfR_/?igsh=MXNxbTAxbDM3N3I5aw==",
    tag: "Signature Edit",
    duration: "0:40"
  }
];

const TheJournal = () => {
  const [activeEmbedUrl, setActiveEmbedUrl] = useState(null);

  return (
    <section className="bg-[#FAF7F2] py-12 md:py-16 overflow-hidden relative border-t border-[#EAE3D8]">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-10 text-left">

        {/* Section Header */}
        <div className="mb-8 md:mb-12 text-center max-w-2xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#C8A97A] block mb-1.5"
          >
            ✦ VELOURAZ ON INSTAGRAM
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif font-normal leading-tight tracking-tight text-3xl sm:text-4xl md:text-5xl text-[#2e0e43]"
          >
            Moments That <span className="italic font-normal text-[#C8A97A]">Inspire Us</span>
          </motion.h2>
          <p className="text-xs sm:text-sm text-[#7B6D63] font-serif italic mt-2">
            Watch our official reels & discover handcrafted jewellery in motion.
          </p>
        </div>

        {/* Reels Slider */}
        <div className="mb-12">
          <Swiper
            modules={[Autoplay, FreeMode]}
            spaceBetween={20}
            slidesPerView={1.3}
            freeMode={true}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2.3 },
              1024: { slidesPerView: 4 },
              1280: { slidesPerView: 5 }
            }}
            className="!overflow-visible"
          >
            {reelPosts.map((post, index) => (
              <SwiperSlide key={post.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => window.open(post.url, '_blank')}
                  className="group relative aspect-[9/16] overflow-hidden cursor-pointer rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-700 bg-[#170624]"
                >
                  {/* Thumbnail Cover Image */}
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Dark Gradient Overlay for Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14061F]/90 via-black/20 to-[#14061F]/40 group-hover:from-[#14061F]/95 transition-all duration-500" />

                  {/* Top Bar Info */}
                  <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
                    <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                      <Instagram size={13} className="text-[#E5C794]" />
                      <span className="text-[10px] font-bold text-white tracking-widest uppercase">@_velouraz_</span>
                    </div>
                    <span className="text-[10px] font-bold text-white/80 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full">
                      REEL
                    </span>
                  </div>

                  {/* Center Play Icon Indicator */}
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-[#C8A97A] group-hover:text-[#14061F] group-hover:border-[#C8A97A] transition-all duration-500 shadow-xl">
                      <Play size={22} className="ml-1 fill-current" />
                    </div>
                  </div>

                  {/* Bottom Information */}
                  <div className="absolute bottom-4 inset-x-4 z-10 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#E5C794] block">
                      ✦ {post.tag}
                    </span>
                    <p className="text-xs sm:text-sm font-serif text-white font-medium line-clamp-2 leading-snug">
                      {post.title}
                    </p>
                    <div className="flex items-center gap-1.5 pt-1 text-[11px] text-white/70 group-hover:text-white transition-colors">
                      <span>Watch Reel on Instagram</span>
                      <ExternalLink size={11} />
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Footer CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <a
            href="https://www.instagram.com/_velouraz_?igsh=cWt5bDBjZHZuZG9h&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 group"
          >
            <div className="w-12 h-12 rounded-full bg-[#2e0e43] flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110">
              <Instagram size={20} />
            </div>
            <div className="flex items-center gap-3 border-b border-transparent group-hover:border-[#2e0e43] transition-all pb-1">
              <span className="text-xs sm:text-sm font-bold text-[#2A2623] tracking-[0.2em] uppercase">FOLLOW OUR REELS</span>
              <span className="text-xs sm:text-sm text-[#7B6D63] font-serif border-l border-[#D8CBBE] pl-3 italic">@_velouraz_</span>
              <ArrowRight size={16} className="text-[#2e0e43] transition-transform group-hover:translate-x-1" />
            </div>
          </a>
        </motion.div>

      </div>
    </section>
  );
};

export default TheJournal;