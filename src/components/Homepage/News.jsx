import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, ArrowRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/free-mode';

const socialPosts = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600",
    time: "2h"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=600",
    time: "5h"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600",
    time: "12h"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600",
    time: "1d"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=600",
    time: "2d"
  }
];

const TheJournal = () => {
  return (
    <section className="bg-[#F8F4EF] py-12 lg:py-20 overflow-hidden relative border-t border-[#D8CBBE]/30">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-10 text-left">

        {/* Header */}
        <div className="mb-16 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-[1px] bg-[#7A0E2E]" />
            <span className="text-[10px] md:text-[12px] tracking-[0.4em] font-bold text-[#7B6D63] uppercase">
              BEHIND THE SPARKLE
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl lg:text-6xl font-serif text-[#2A2623] leading-tight"
          >
            Moments that <span className="text-[#7A0E2E] italic">inspire us</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[#7B6D63] font-serif text-base leading-relaxed max-w-2xl"
          >
            A glimpse into our world of craftsmanship, creativity and culture. Explore the stories behind each unique collection.
          </motion.p>
        </div>

        {/* Instagram Slider */}
        <div className="mb-16">
          <Swiper
            modules={[Autoplay, FreeMode]}
            spaceBetween={20}
            slidesPerView={1.5}
            freeMode={true}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2.5 },
              1024: { slidesPerView: 4 },
              1280: { slidesPerView: 5 }
            }}
            className="!overflow-visible"
          >
            {socialPosts.map((post, index) => (
              <SwiperSlide key={post.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative aspect-[4/5] overflow-hidden cursor-pointer rounded-2xl shadow-sm hover:shadow-xl transition-all duration-700"
                >
                  <img
                    src={post.image}
                    alt="Social Post"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Overlay Info */}
                  <div className="absolute top-6 left-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center backdrop-blur-sm bg-black/10">
                      <Instagram size={14} className="text-white" />
                    </div>
                    <div className="flex flex-col items-start leading-none">
                      <span className="text-[10px] font-bold text-white tracking-widest uppercase">velouraz.jewels</span>
                      <span className="text-[9px] text-white/70 mt-1">{post.time}</span>
                    </div>
                  </div>

                  {/* Hover Darken */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <a
            href="https://instagram.com/velouraz.jewels"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 group"
          >
            <div className="w-12 h-12 rounded-full bg-[#7A0E2E] flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110">
              <Instagram size={20} />
            </div>
            <div className="flex items-center gap-3 border-b border-transparent group-hover:border-[#7A0E2E] transition-all pb-1">
              <span className="text-[12px] font-bold text-[#2A2623] tracking-[0.2em] uppercase">JOIN OUR WORLD</span>
              <span className="text-[12px] text-[#7B6D63] font-serif border-l border-[#D8CBBE] pl-3 italic">@velouraz.jewels</span>
              <ArrowRight size={16} className="text-[#7A0E2E] transition-transform group-hover:translate-x-1" />
            </div>
          </a>
        </motion.div>

      </div>
    </section>
  );
};

export default TheJournal;