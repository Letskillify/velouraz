import React from 'react';
import { motion } from 'framer-motion';
import Breadcrumb from '../components/Breadcrumb';

const CRIMSON = '#7A0E2E';
const DARK = '#2A2623';
const GOLD = '#C8A97A';
const TAUPE = '#7B6D63';
const CREAM = '#FDFAF6';
const SERIF = "'Cormorant Garamond', Georgia, serif";

const fadeUp = {
  initial: { opacity: 0, y: 35 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] }
};

const About = () => {
  const breadcrumbLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about', active: true }
  ];

  return (
    <div className="overflow-hidden" style={{ backgroundColor: CREAM, color: DARK }}>
      
      {/* ── BREADCRUMB HERO ────────────────────────────────────── */}
      <Breadcrumb
        title="Our Story"
        subtitle="The journey of Zahabiya & Alefiya — bringing global craftsmanship home."
        bgImage="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=1600"
        links={breadcrumbLinks}
      />

      {/* ── SECTION 1: MEET THE FOUNDERS ───────────────────────── */}
      <section className="relative px-6 py-20 lg:py-32">
        <div className="max-w-[1320px] mx-auto">
          
          {/* Eyebrow and Section Header */}
          <div className="max-w-3xl mb-14 lg:mb-20 space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-[1px]" style={{ background: CRIMSON }} />
              <span className="text-base lg:text-[16px] tracking-[0.4em] font-bold text-[#7B6D63] uppercase">
                Meet The Founders
              </span>
            </div>
            
            <h1 
              className="font-light leading-[1.1] tracking-tight"
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(2.4rem, 5.5vw, 4.5rem)',
                color: DARK
              }}
            >
              A Friendship. A Shared Love <br />
              <span className="italic" style={{ color: CRIMSON }}>for Travel. A World of Inspiration.</span>
            </h1>
          </div>

          {/* Asymmetric 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-stretch">
            
            {/* Left: Premium Editorial Imagery */}
            <motion.div 
              className="lg:col-span-5 flex flex-col justify-between space-y-8"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative group overflow-hidden rounded-[4px] border border-[#D8CBBE]/25 shadow-[0_20px_50px_rgba(42,38,35,0.04)] aspect-[4/5] bg-[#F6F2EB]">
                <img 
                  src="https://images.unsplash.com/photo-1534126511673-b6899657816a?auto=format&fit=crop&q=80&w=1000" 
                  alt="Crafting and Designing" 
                  className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[#7A0E2E]/[0.03] pointer-events-none" />
              </div>

              {/* Minimal Brand Credo Box */}
              <div className="border-l border-[#D8CBBE] pl-6 space-y-3 hidden lg:block">
                <span className="text-[16px] tracking-widest font-bold uppercase text-[#7B6D63]">Philosophy</span>
                <p className="text-[17px] font-light leading-relaxed italic text-[#5C534C]" style={{ fontFamily: SERIF }}>
                  "Jewellery that feels effortless, looks sophisticated, and adds beauty without trying too hard."
                </p>
              </div>
            </motion.div>

            {/* Right: The Founders Narrative */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-8">
              <div className="text-[16px] lg:text-[16px] text-[#5C534C] leading-relaxed font-light space-y-6">
                
                <motion.p 
                  className="text-[19px] lg:text-[21px] text-[#2A2623] leading-relaxed font-light"
                  style={{ fontFamily: SERIF }}
                  {...fadeUp}
                >
                  VELOURAZ began with a friendship and a shared curiosity for the world.
                </motion.p>

                <motion.p {...fadeUp} transition={{ delay: 0.05 }}>
                  As best friends, Zahabiya Kalabhai and Alefiya Bohra found inspiration wherever their journeys took them—from vibrant city streets to hidden local markets and beautiful destinations across the globe. Every place introduced them to new cultures, distinctive styles, and jewellery that told a story of its own.
                </motion.p>

                <motion.p {...fadeUp} transition={{ delay: 0.1 }}>
                  Along the way, they discovered a shared fascination for demi-fine jewellery—pieces that captured the beauty of global trends while remaining elegant, effortless, and wearable every day. They saw jewellery as more than an accessory; it could be a memory of a place, an expression of individuality, and a reflection of personal style.
                </motion.p>

                <motion.div 
                  className="py-6 border-t border-b border-[#D8CBBE]/30 italic text-[19px] lg:text-[23px] text-[#2A2623] leading-snug font-light text-center"
                  style={{ fontFamily: SERIF }}
                  {...fadeUp}
                  transition={{ delay: 0.15 }}
                >
                  Inspired by their travels, they dreamed of bringing the world a little closer to home.
                </motion.div>

                <motion.div 
                  className="p-6 rounded-[2px] border-l-2 bg-[#FBF9F4] space-y-3"
                  style={{ borderColor: CRIMSON }}
                  {...fadeUp}
                  transition={{ delay: 0.2 }}
                >
                  <p className="text-[18px] lg:text-[20px] font-medium text-[#2A2623] leading-none" style={{ fontFamily: SERIF }}>
                    And so, VELOURAZ was born.
                  </p>
                  <p className="text-sm text-[#7B6D63] leading-relaxed">
                    The name draws inspiration from velour—a fabric known for its softness, warmth, and quiet sense of luxury. That same philosophy lies at the heart of VELOURAZ: jewellery that feels effortless, looks sophisticated, and adds beauty without trying too hard.
                  </p>
                </motion.div>

                <motion.p {...fadeUp} transition={{ delay: 0.25 }}>
                  Today, VELOURAZ is a curated world of jewellery inspired by global influences and reimagined for the modern Indian woman. Each collection brings together stories, cultures, and contemporary trends from around the world—designed to become part of your own story.
                </motion.p>

                <motion.p {...fadeUp} transition={{ delay: 0.3 }}>
                  For Zahabiya and Alefiya, VELOURAZ is more than a brand. It is a dream built on friendship, passion, travel, and the belief that true luxury is personal.
                </motion.p>

                <motion.p 
                  className="text-[17px] lg:text-[19px] font-medium text-[#2A2623] pt-4"
                  style={{ fontFamily: SERIF }}
                  {...fadeUp}
                  transition={{ delay: 0.35 }}
                >
                  Welcome to VELOURAZ — where global inspiration meets your personal style.
                </motion.p>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── PARALLAX TEXT RIBBON ───────────────────────────────── */}
      <div 
        className="w-full py-4 border-t border-b border-[#D8CBBE]/30 overflow-hidden" 
        style={{ background: '#2A2623' }}
      >
        <motion.div 
          className="flex whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 25, ease: 'linear', repeat: Infinity }}
        >
          {[...Array(8)].map((_, i) => (
            <span 
              key={i} 
              className="text-[16px] lg:text-[16px] tracking-[0.25em] uppercase font-light px-16 text-[#C8A97A]"
              style={{ fontFamily: SERIF }}
            >
              ✦ Trends That Travel the World
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── SECTION 2: FROM OUR JOURNEY TO YOURS ────────────────── */}
      <section className="px-6 py-20 lg:py-32 border-t border-[#D8CBBE]/30" style={{ backgroundColor: '#FDFCF7' }}>
        <div className="max-w-[1320px] mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            
            {/* Left Hand: Typography Introduction */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-[1px]" style={{ background: CRIMSON }} />
                  <span className="text-base lg:text-[16px] tracking-[0.4em] font-bold text-[#7B6D63] uppercase">
                    From Our Journey to Yours
                  </span>
                </div>
                
                <h2 
                  className="font-light leading-[1.1] tracking-tight"
                  style={{
                    fontFamily: SERIF,
                    fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
                    color: DARK
                  }}
                >
                  What began as our journey <br />
                  <span className="italic" style={{ color: CRIMSON }}>around the world is now a part of yours.</span>
                </h2>
              </div>

              <div className="text-[16px] lg:text-[16px] text-[#5C534C] leading-relaxed font-light space-y-6">
                <motion.p {...fadeUp}>
                  We created VELOURAZ for women who love to express themselves in their own way—who believe that jewellery doesn’t need an occasion to feel special. Whether it becomes part of your everyday moments, your celebrations, your travels, or a gift filled with meaning, we hope every VELOURAZ piece becomes connected to a memory that is uniquely yours.
                </motion.p>

                <motion.p {...fadeUp} transition={{ delay: 0.1 }}>
                  When you choose VELOURAZ, you’re not simply choosing jewellery. You’re carrying a little piece of the world with you—and making it entirely your own.
                </motion.p>

                <motion.p {...fadeUp} transition={{ delay: 0.15 }}>
                  As founders, there is something incredibly special about seeing our pieces become part of your stories. You are not just our customer; you are part of the journey we began together as two best friends with one shared dream.
                </motion.p>

                <motion.p 
                  className="text-[18px] lg:text-[20px] italic font-light text-[#2A2623]"
                  style={{ fontFamily: SERIF }}
                  {...fadeUp}
                  transition={{ delay: 0.2 }}
                >
                  Our journey inspired VELOURAZ. Now, we can’t wait to be part of yours.
                </motion.p>
              </div>
            </div>

            {/* Right Hand: Elegant Fine Art Frame */}
            <motion.div 
              className="lg:col-span-5 relative group"
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
              {/* Outer floating border accent */}
              <div className="absolute -inset-3 border border-[#D8CBBE]/30 translate-x-3 translate-y-3 pointer-events-none rounded-[4px] transition-transform duration-500 group-hover:translate-x-1.5 group-hover:translate-y-1.5" />
              
              <div className="relative overflow-hidden aspect-[4/5] rounded-[4px] border border-[#D8CBBE]/25 bg-[#F6F2EB] shadow-[0_15px_40px_rgba(42,38,35,0.03)] z-10">
                <img 
                  src="https://images.unsplash.com/photo-1453733190148-c44698c26578?auto=format&fit=crop&q=80&w=1200" 
                  alt="Travel and discovery moments" 
                  className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                />
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* ── SECTION 3: LIGHT PREMIUM SIGN-OFF ──────────────────── */}
      <section className="border-t border-[#D8CBBE]/30" style={{ background: CREAM }}>
        <div className="max-w-[1320px] mx-auto px-6 py-14 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            
            {/* Founders Closing Column */}
            <motion.div className="lg:col-span-8 space-y-4" {...fadeUp}>
              <span className="text-[16px] tracking-[0.3em] uppercase font-bold text-[#7B6D63]">
                With Love,
              </span>
              <p 
                className="italic font-light leading-none"
                style={{ 
                  fontFamily: SERIF, 
                  fontSize: 'clamp(2.4rem, 5vw, 4.2rem)',
                  color: CRIMSON 
                }}
              >
                Zahabiya & Alefiya
              </p>
              <div className="flex items-center gap-3">
                <span className="w-6 h-[1px]" style={{ background: GOLD }} />
                <span className="text-[16px] tracking-[0.2em] uppercase font-bold text-[#2A2623]">
                  Founders, VELOURAZ
                </span>
              </div>
            </motion.div>

            {/* Giant Monogram brand stamp */}
            <motion.div 
              className="lg:col-span-4 flex justify-start lg:justify-end"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div 
                className="text-[42px] lg:text-[50px] font-light tracking-[0.1em]"
                style={{ fontFamily: SERIF, color: '#D8CBBE' }}
              >
                VELOURAZ
              </div>
            </motion.div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default About;