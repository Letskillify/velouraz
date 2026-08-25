import React from 'react';
import { motion } from 'framer-motion';
import AboutBreadcrumb from '../components/AboutBreadcrumb';
import Newsletter from '../components/Newsletter';

const CRIMSON = '#000000';
const DARK = '#000000';
const GOLD = '#C8A97A';
const CREAM = '#FDFAF6';
const SANS = "'Montserrat', sans-serif";

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
    <div className="overflow-hidden font-sans" style={{ backgroundColor: CREAM, color: DARK, fontFamily: SANS }}>

      {/* ── BREADCRUMB HERO ────────────────────────────────────── */}
      <AboutBreadcrumb
        title="About Us"
        subtitle="About the Brand and our Story • The journey of Zahabiya & Alifiya."
        bgImage="https://res.cloudinary.com/dcjn4y284/image/upload/v1787401054/ABout_Us_Image_vrb2xe.png"
        links={breadcrumbLinks}
      />

      {/* ── SECTION 1: ABOUT THE BRAND AND OUR STORY ────────────── */}
      <section className="relative px-6 py-14 lg:py-24">
        <div className="max-w-[1320px] mx-auto">

          {/* Eyebrow and Section Header */}
          <div className="max-w-3xl mb-10 lg:mb-14 space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-[1px]" style={{ background: CRIMSON }} />
              <span className="text-xs sm:text-sm tracking-[0.25em] font-semibold text-black uppercase" style={{ fontFamily: SANS }}>
                About the Brand & Our Story
              </span>
            </div>

            <h1
              className="font-normal leading-[1.15] tracking-tight"
              style={{
                fontFamily: SANS,
                fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
                color: DARK
              }}
            >
              A Friendship Transformed <br />
              <span className="italic font-semibold" style={{ color: CRIMSON, fontFamily: SANS }}>into a Global Journey.</span>
            </h1>
          </div>

          {/* 2-Column Editorial Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

            {/* Left: Editorial Imagery */}
            <motion.div
              className="lg:col-span-5 flex flex-col justify-between space-y-6 lg:sticky lg:top-28"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative group overflow-hidden rounded-[4px] border border-[#D8CBBE]/25 shadow-[0_20px_50px_rgba(42,38,35,0.04)] aspect-[4/5] bg-[#F6F2EB]">
                <img
                  src="https://images.unsplash.com/photo-1534126511673-b6899657816a?auto=format&fit=crop&q=80&w=1000"
                  alt="Zahabiya & Alifiya Journey"
                  className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[#2e0e43]/[0.03] pointer-events-none" />
              </div>

              <div className="border-l border-[#D8CBBE] pl-5 space-y-2 hidden lg:block">
                <span className="text-xs sm:text-sm tracking-widest font-semibold uppercase text-black" style={{ fontFamily: SANS }}>Our Essence</span>
                <p className="text-sm sm:text-base font-normal leading-relaxed italic text-black" style={{ fontFamily: SANS }}>
                  "Inspired by our travels, curated for your story VELOURAZ brings the world a little closer to home."
                </p>
              </div>
            </motion.div>

            {/* Right: Narrative Text Part 1 */}
            <div className="lg:col-span-7 flex flex-col space-y-6 text-black text-sm sm:text-base leading-relaxed font-normal" style={{ fontFamily: SANS }}>

              <motion.p
                className="text-base sm:text-lg text-black leading-relaxed font-normal"
                style={{ fontFamily: SANS }}
                {...fadeUp}
              >
                As best friends, Zahabiya Kalabhai and Alifiya Bohra found inspiration wherever their journeys took them from vibrant city streets to hidden local markets and beautiful destinations across the globe. Every journey revealed something new: A craft, a gemstone, a texture, a tradition or a piece of jewellery that carried a story of its own.
              </motion.p>

              <motion.p style={{ fontFamily: SANS }} {...fadeUp} transition={{ delay: 0.05 }}>
                From the delicate artistry of Japan, where intricate Miyuki beads bring colour and precision to jewellery, to the luminous beauty of South Korea’s pearls; from the ancient symbolism of Turkish stones and the iconic Evil Eye, to the timeless allure of Chinese jade; from sapphires and rubbies from Thailand,The opals from Australia to the rich gemstone heritage of India to the refined craftsmanship found across the world each destination became part of our inspiration.
              </motion.p>

              <motion.p style={{ fontFamily: SANS }} {...fadeUp} transition={{ delay: 0.1 }}>
                What began as a love for discovering beautiful jewellery evolved into something more meaningful: a desire to bring the world’s most captivating jewellery traditions together in one collection.
              </motion.p>

              <motion.p style={{ fontFamily: SANS }} {...fadeUp} transition={{ delay: 0.15 }}>
                We call it globally curated jewellery thoughtfully discovered pieces that blend heritage with contemporary style, designed to feel effortless yet distinctive, elegant yet expressive.
              </motion.p>

              <motion.p style={{ fontFamily: SANS }} {...fadeUp} transition={{ delay: 0.2 }}>
                Because to us, jewellery is never simply an accessory. It is a memory of a place, a reflection of your individuality, and a little piece of the world you can carry with you.
              </motion.p>

              <motion.div
                className="py-5 border-t border-b border-[#D8CBBE]/30 italic text-base sm:text-lg lg:text-xl text-black font-normal text-center"
                style={{ fontFamily: SANS }}
                {...fadeUp}
                transition={{ delay: 0.25 }}
              >
                Inspired by our travels, curated for your story VELOURAZ brings the world a little closer to home.
              </motion.div>

              {/* AND SO, VELOURAZ WAS BORN */}
              <div className="pt-4 space-y-5">
                <motion.h2
                  className="text-lg sm:text-xl lg:text-2xl font-bold text-black uppercase tracking-wider"
                  style={{ fontFamily: SANS }}
                  {...fadeUp}
                >
                  AND SO, VELOURAZ WAS BORN.
                </motion.h2>

                <motion.p style={{ fontFamily: SANS }} {...fadeUp} transition={{ delay: 0.05 }}>
                  From countless journeys, discoveries, and conversations about the beauty we found around the world, an idea began to take shape.
                </motion.p>

                <motion.p style={{ fontFamily: SANS }} {...fadeUp} transition={{ delay: 0.15 }}>
                  The name itself is inspired by velour a fabric celebrated for its softness, richness, warmth, and understated elegance. It became the perfect expression of what we wanted VELOURAZ to feel like: luxury that is felt rather than flaunted, beauty that feels effortless, and jewellery that becomes a natural extension of you.
                </motion.p>

                <motion.p
                  className="text-base sm:text-lg font-semibold text-black"
                  style={{ fontFamily: SANS }}
                  {...fadeUp}
                  transition={{ delay: 0.2 }}
                >
                  But VELOURAZ is more than a name.
                </motion.p>

                <motion.p style={{ fontFamily: SANS }} {...fadeUp} transition={{ delay: 0.25 }}>
                  It is our way of bringing the world closer discovering the artistry, colours, gemstones, pearls, traditions, and jewellery cultures that make every destination extraordinary, and reimagining them for the woman of today.
                </motion.p>

                <motion.p style={{ fontFamily: SANS }} {...fadeUp} transition={{ delay: 0.3 }}>
                  We believe the most beautiful pieces are not simply worn they are discovered, collected, remembered, and made your own.
                </motion.p>

                <motion.p style={{ fontFamily: SANS }} {...fadeUp} transition={{ delay: 0.35 }}>
                  Today, VELOURAZ is a world of globally curated jewellery, created for women who carry their own stories, follow their own style, and find beauty beyond the ordinary.
                </motion.p>

                <motion.div
                  className="p-6 rounded-[4px] border-l-2 bg-[#FBF9F4] space-y-2"
                  style={{ borderColor: CRIMSON, fontFamily: SANS }}
                  {...fadeUp}
                  transition={{ delay: 0.4 }}
                >
                  <p className="text-base sm:text-lg font-semibold text-black" style={{ fontFamily: SANS }}>
                    For Zahabiya and Alifiya , VELOURAZ is more than a brand.
                  </p>
                  <ul className="space-y-1 text-sm sm:text-base text-black font-normal" style={{ fontFamily: SANS }}>
                    <li style={{ fontFamily: SANS }}>It is a friendship transformed into a journey.</li>
                    <li style={{ fontFamily: SANS }}>A curiosity transformed into a collection.</li>
                    <li style={{ fontFamily: SANS }}>And a dream transformed into something you can wear.</li>
                  </ul>
                </motion.div>

                <motion.div className="space-y-1 pt-2" {...fadeUp} transition={{ delay: 0.45 }}>
                  <p className="italic text-base sm:text-lg text-black font-medium" style={{ fontFamily: SANS }}>
                    Because every journey leaves a trace.
                  </p>
                  <p className="italic text-base sm:text-lg text-black font-medium" style={{ fontFamily: SANS }}>
                    Ours just happens to be jewellery.
                  </p>
                </motion.div>

                <motion.p
                  className="text-base sm:text-lg font-semibold text-black pt-3"
                  style={{ fontFamily: SANS }}
                  {...fadeUp}
                  transition={{ delay: 0.5 }}
                >
                  Welcome to VELOURAZ where the world becomes jewellery, and jewellery becomes part of your story.
                </motion.p>
              </div>

            </div>

          </div>

        </div>
      </section>
       <div className="max-w-[1320px] mx-auto px-6 py-10 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">

            {/* Founders Closing Column */}
            <motion.div className="lg:col-span-8 space-y-3" {...fadeUp}>
              <span className="text-xs sm:text-sm tracking-[0.2em] uppercase font-semibold text-black" style={{ fontFamily: SANS }}>
                With Love,
              </span>
              <p
                className="italic font-normal leading-none"
                style={{
                  fontFamily: SANS,
                  fontSize: 'clamp(1.8rem, 3.5vw, 2.75rem)',
                  color: CRIMSON
                }}
              >
                Zahabiya & Alifiya
              </p>
              <div className="flex items-center gap-3">
                <span className="w-6 h-[1px]" style={{ background: GOLD }} />
                <span className="text-xs sm:text-sm tracking-[0.2em] uppercase font-semibold text-black" style={{ fontFamily: SANS }}>
                  Founders, VELOURAZ
                </span>
              </div>
            </motion.div>

            {/* Monogram brand stamp */}
            <motion.div
              className="lg:col-span-4 flex justify-start lg:justify-end"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div
                className="text-2xl lg:text-3xl font-light tracking-[0.1em]"
                style={{ fontFamily: SANS, color: '#000000', opacity: 0.25 }}
              >
                VELOURAZ
              </div>
            </motion.div>

          </div>
        </div>

      {/* ── PARALLAX TEXT RIBBON ───────────────────────────────── */}
      <div
        className="w-full py-3.5 border-t border-b border-[#D8CBBE]/30 overflow-hidden"
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
              className="text-xs sm:text-sm tracking-[0.2em] uppercase font-light px-12 text-[#C8A97A]"
              style={{ fontFamily: SANS }}
            >
              ✦ Inspired by Travels, Curated for Your Story ✦
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── SECTION 2: FROM OUR HANDS, INTO YOUR STORY ────────────── */}
      

      {/* ── NEWSLETTER SECTION ───────────────────────────────── */}
      

      {/* ── SECTION 3: SIGN-OFF ───────────────────────────────── */}
      <section className="border-t border-[#D8CBBE]/30" style={{ background: CREAM }}>
       
      </section>
      <Newsletter />

    </div>
  );
};

export default About;