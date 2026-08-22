import React from 'react';
import { motion } from 'framer-motion';
import AboutBreadcrumb from '../components/AboutBreadcrumb';

const CRIMSON = '#2e0e43';
const DARK = '#2A2623';
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
      <section className="relative px-6 py-20 lg:py-32">
        <div className="max-w-[1320px] mx-auto">

          {/* Eyebrow and Section Header */}
          <div className="max-w-3xl mb-14 lg:mb-20 space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-[1px]" style={{ background: CRIMSON }} />
              <span className="text-base lg:text-[18px] tracking-[0.3em] font-medium text-[#7B6D63] uppercase" style={{ fontFamily: SANS }}>
                About the Brand & Our Story
              </span>
            </div>

            <h1
              className="font-light leading-[1.1] tracking-tight"
              style={{
                fontFamily: SANS,
                fontSize: 'clamp(2.4rem, 5.5vw, 4.5rem)',
                color: DARK
              }}
            >
              A Friendship Transformed <br />
              <span className="italic" style={{ color: CRIMSON, fontFamily: SANS }}>into a Global Journey.</span>
            </h1>
          </div>

          {/* 2-Column Editorial Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

            {/* Left: Editorial Imagery */}
            <motion.div
              className="lg:col-span-5 flex flex-col justify-between space-y-8 lg:sticky lg:top-28"
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

              <div className="border-l border-[#D8CBBE] pl-6 space-y-3 hidden lg:block">
                <span className="text-[17px] tracking-widest font-semibold uppercase text-[#7B6D63]" style={{ fontFamily: SANS }}>Our Essence</span>
                <p className="text-[19px] font-light leading-relaxed italic text-[#5C534C]" style={{ fontFamily: SANS }}>
                  "Inspired by our travels, curated for your story   VELOURAZ brings the world a little closer to home."
                </p>
              </div>
            </motion.div>

            {/* Right: Narrative Text Part 1 */}
            <div className="lg:col-span-7 flex flex-col space-y-8 text-[#5C534C] text-[18px] lg:text-[20px] leading-relaxed font-light" style={{ fontFamily: SANS }}>

              <motion.p
                className="text-[21px] lg:text-[23px] text-[#2A2623] leading-relaxed font-light"
                style={{ fontFamily: SANS }}
                {...fadeUp}
              >
                As best friends, Zahabiya Kalabhai and Alifiya Bohra found inspiration wherever their journeys took them from vibrant city streets to hidden local markets and beautiful destinations across the globe. Every journey revealed something new: A craft, a gemstone, a texture, a tradition or a piece of jewellery that carried a story of its own.
              </motion.p>

              <motion.p style={{ fontFamily: SANS }} {...fadeUp} transition={{ delay: 0.05 }}>
                From the delicate artistry of Japan, where intricate Miyuki beads bring colour and precision to jewellery, to the luminous beauty of South Korea’s pearls; from the ancient symbolism of Turkish stones and the iconic Evil Eye, to the timeless allure of Chinese jade; from sapphires and rubbies from Thailand,The opals from Australia to the rich gemstone heritage of India to the refined craftsmanship found across the world   each destination became part of our inspiration.
              </motion.p>

              <motion.p style={{ fontFamily: SANS }} {...fadeUp} transition={{ delay: 0.1 }}>
                What began as a love for discovering beautiful jewellery evolved into something more meaningful: a desire to bring the world’s most captivating jewellery traditions together in one collection.
              </motion.p>

              <motion.p style={{ fontFamily: SANS }} {...fadeUp} transition={{ delay: 0.15 }}>
                We call it globally curated jewellery   thoughtfully discovered pieces that blend heritage with contemporary style, designed to feel effortless yet distinctive, elegant yet expressive.
              </motion.p>

              <motion.p style={{ fontFamily: SANS }} {...fadeUp} transition={{ delay: 0.2 }}>
                Because to us, jewellery is never simply an accessory. It is a memory of a place, a reflection of your individuality, and a little piece of the world you can carry with you.
              </motion.p>

              <motion.div
                className="py-6 border-t border-b border-[#D8CBBE]/30 italic text-[20px] lg:text-[24px] text-[#2A2623] font-light text-center"
                style={{ fontFamily: SANS }}
                {...fadeUp}
                transition={{ delay: 0.25 }}
              >
                Inspired by our travels, curated for your story   VELOURAZ brings the world a little closer to home.
              </motion.div>

              {/* AND SO, VELOURAZ WAS BORN */}
              <div className="pt-6 space-y-6">
                <motion.h2
                  className="text-2xl lg:text-3xl font-bold text-[#2A2623] uppercase tracking-wider"
                  style={{ fontFamily: SANS }}
                  {...fadeUp}
                >
                  AND SO, VELOURAZ WAS BORN.
                </motion.h2>

                <motion.p style={{ fontFamily: SANS }} {...fadeUp} transition={{ delay: 0.05 }}>
                  From countless journeys, discoveries, and conversations about the beauty we found around the world, an idea began to take shape.
                </motion.p>

                <motion.p style={{ fontFamily: SANS }} {...fadeUp} transition={{ delay: 0.15 }}>
                  The name itself is inspired by velour   a fabric celebrated for its softness, richness, warmth, and understated elegance. It became the perfect expression of what we wanted VELOURAZ to feel like: luxury that is felt rather than flaunted, beauty that feels effortless, and jewellery that becomes a natural extension of you.
                </motion.p>

                <motion.p
                  className="text-[19px] lg:text-[21px] font-medium text-[#2A2623]"
                  style={{ fontFamily: SANS }}
                  {...fadeUp}
                  transition={{ delay: 0.2 }}
                >
                  But VELOURAZ is more than a name.
                </motion.p>

                <motion.p style={{ fontFamily: SANS }} {...fadeUp} transition={{ delay: 0.25 }}>
                  It is our way of bringing the world closer   discovering the artistry, colours, gemstones, pearls, traditions, and jewellery cultures that make every destination extraordinary, and reimagining them for the woman of today.
                </motion.p>

                <motion.p style={{ fontFamily: SANS }} {...fadeUp} transition={{ delay: 0.3 }}>
                  We believe the most beautiful pieces are not simply worn   they are discovered, collected, remembered, and made your own.
                </motion.p>

                <motion.p style={{ fontFamily: SANS }} {...fadeUp} transition={{ delay: 0.35 }}>
                  Today, VELOURAZ is a world of globally curated jewellery, created for women who carry their own stories, follow their own style, and find beauty beyond the ordinary.
                </motion.p>

                <motion.div
                  className="p-8 rounded-[4px] border-l-2 bg-[#FBF9F4] space-y-3"
                  style={{ borderColor: CRIMSON, fontFamily: SANS }}
                  {...fadeUp}
                  transition={{ delay: 0.4 }}
                >
                  <p className="text-[19px] lg:text-[21px] font-medium text-[#2A2623]" style={{ fontFamily: SANS }}>
                    For Zahabiya and Alifiya , VELOURAZ is more than a brand.
                  </p>
                  <ul className="space-y-2 text-lg text-[#5C534C]" style={{ fontFamily: SANS }}>
                    <li style={{ fontFamily: SANS }}>It is a friendship transformed into a journey.</li>
                    <li style={{ fontFamily: SANS }}>A curiosity transformed into a collection.</li>
                    <li style={{ fontFamily: SANS }}>And a dream transformed into something you can wear.</li>
                  </ul>
                </motion.div>

                <motion.div className="space-y-2 pt-2" {...fadeUp} transition={{ delay: 0.45 }}>
                  <p className="italic text-[19px] lg:text-[21px] text-[#2e0e43]" style={{ fontFamily: SANS }}>
                    Because every journey leaves a trace.
                  </p>
                  <p className="italic text-[19px] lg:text-[21px] text-[#2e0e43]" style={{ fontFamily: SANS }}>
                    Ours just happens to be jewellery.
                  </p>
                </motion.div>

                <motion.p
                  className="text-[20px] lg:text-[22px] font-medium text-[#2A2623] pt-4"
                  style={{ fontFamily: SANS }}
                  {...fadeUp}
                  transition={{ delay: 0.5 }}
                >
                  Welcome to VELOURAZ   where the world becomes jewellery, and jewellery becomes part of your story.
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
              className="text-[17px] lg:text-[18px] tracking-[0.25em] uppercase font-light px-16 text-[#C8A97A]"
              style={{ fontFamily: SANS }}
            >
              ✦ Inspired by Travels, Curated for Your Story ✦
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── SECTION 2: FROM OUR HANDS, INTO YOUR STORY ────────────── */}
      <section className="px-6 py-20 lg:py-32 border-t border-[#D8CBBE]/30" style={{ backgroundColor: '#FDFCF7' }}>
        <div className="max-w-[1320px] mx-auto">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">

            {/* Left Column: Story Text Part 2 */}
            <div className="lg:col-span-7 space-y-8" style={{ fontFamily: SANS }}>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-[1px]" style={{ background: CRIMSON }} />
                  <span className="text-base lg:text-[18px] tracking-[0.3em] font-medium text-[#7B6D63] uppercase" style={{ fontFamily: SANS }}>
                    From Our Hands, Into Your Story
                  </span>
                </div>

                <h2
                  className="font-light leading-[1.1] tracking-tight"
                  style={{
                    fontFamily: SANS,
                    fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
                    color: DARK
                  }}
                >
                  Jewellery that becomes <br />
                  <span className="italic" style={{ color: CRIMSON, fontFamily: SANS }}>part of your journey.</span>
                </h2>
              </div>

              <div className="text-[18px] lg:text-[19px] text-[#5C534C] leading-relaxed font-light space-y-6" style={{ fontFamily: SANS }}>

                <motion.p
                  className="text-[20px] lg:text-[22px] text-[#2A2623] font-light"
                  style={{ fontFamily: SANS }}
                  {...fadeUp}
                >
                  We created VELOURAZ for women who believe jewellery is more than something you wear   it is something you feel, remember, and make your own.
                </motion.p>

                <motion.ul className="space-y-2 pt-1 border-l-2 border-[#C8A97A]/40 pl-6" style={{ fontFamily: SANS }} {...fadeUp} transition={{ delay: 0.05 }}>
                  <li className="text-[18px] sm:text-[19px] text-[#2A2623] italic" style={{ fontFamily: SANS }}>For the woman who dresses for herself.</li>
                  <li className="text-[18px] sm:text-[19px] text-[#2A2623] italic" style={{ fontFamily: SANS }}>For the woman who finds beauty in the everyday.</li>
                  <li className="text-[18px] sm:text-[19px] text-[#2A2623] italic" style={{ fontFamily: SANS }}>For the woman who carries memories from places she has been   and dreams of places yet to discover.</li>
                </motion.ul>

                <motion.p style={{ fontFamily: SANS }} {...fadeUp} transition={{ delay: 0.1 }}>
                  It can be the necklace you reach for every morning, the bracelet that travels with you, the earrings you wear on a night worth remembering, or a carefully chosen piece gifted to someone you love.
                </motion.p>

                <motion.p
                  className="text-[19px] lg:text-[21px] font-medium text-[#2A2623]"
                  style={{ fontFamily: SANS }}
                  {...fadeUp}
                  transition={{ delay: 0.15 }}
                >
                  Every VELOURAZ piece begins with a story from somewhere in the world   and finds its meaning with you.
                </motion.p>

                <motion.p style={{ fontFamily: SANS }} {...fadeUp} transition={{ delay: 0.2 }}>
                  When you choose VELOURAZ, you aren’t simply choosing jewellery. You are choosing a little piece of the world   a colour, a craft, a tradition, a feeling   and making it entirely your own.
                </motion.p>

                <motion.p style={{ fontFamily: SANS }} {...fadeUp} transition={{ delay: 0.25 }}>
                  And as founders, perhaps the most beautiful part of our journey is seeing where those pieces go next.
                </motion.p>

                <motion.div className="space-y-2 pt-4 border-t border-[#D8CBBE]/30" style={{ fontFamily: SANS }} {...fadeUp} transition={{ delay: 0.3 }}>
                  <p className="text-[21px] lg:text-[23px] font-medium text-[#2A2623]" style={{ fontFamily: SANS }}>
                    From our hands, into your story.
                  </p>
                  <p className="text-[19px] lg:text-[21px] italic text-[#2e0e43]" style={{ fontFamily: SANS }}>
                    Our journey inspired VELOURAZ.
                  </p>
                  <p className="text-[19px] lg:text-[21px] italic text-[#2e0e43]" style={{ fontFamily: SANS }}>
                    Now, we can’t wait to see where yours takes it.
                  </p>
                </motion.div>

              </div>
            </div>

            {/* Right Column: Fine Art Image */}
            <motion.div
              className="lg:col-span-5 relative group"
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
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

      {/* ── SECTION 3: SIGN-OFF ───────────────────────────────── */}
      <section className="border-t border-[#D8CBBE]/30" style={{ background: CREAM }}>
        <div className="max-w-[1320px] mx-auto px-6 py-14 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">

            {/* Founders Closing Column */}
            <motion.div className="lg:col-span-8 space-y-4" {...fadeUp}>
              <span className="text-[17px] tracking-[0.25em] uppercase font-semibold text-[#7B6D63]" style={{ fontFamily: SANS }}>
                With Love,
              </span>
              <p
                className="italic font-light leading-none"
                style={{
                  fontFamily: SANS,
                  fontSize: 'clamp(2.4rem, 5vw, 4.2rem)',
                  color: CRIMSON
                }}
              >
                Zahabiya & Alifiya
              </p>
              <div className="flex items-center gap-3">
                <span className="w-6 h-[1px]" style={{ background: GOLD }} />
                <span className="text-[17px] tracking-[0.2em] uppercase font-semibold text-[#2A2623]" style={{ fontFamily: SANS }}>
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
                className="text-[42px] lg:text-[50px] font-light tracking-[0.1em]"
                style={{ fontFamily: SANS, color: '#D8CBBE' }}
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