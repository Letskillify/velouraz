import React from 'react';
import { motion } from 'framer-motion';

const items = [
  '✦ Ethically Sourced',
  '✦ Artisanal Craftsmanship',
  '✦ Anti-Tarnish Formula',
  '✦ Global Designs',
  '✦ Skin Friendly Alloys',
  '✦ 4.9 ★ Patron Rated',
  '✦ Premium Packaging',
  '✦ Easy Returns',
];

const SERIF = "'Cormorant Garamond', Georgia, serif";

/**
 * Luxury brand marquee ticker — shown between Hero and PromoSlider.
 * Infinitely scrolling ticker using CSS keyframe animation.
 */
const Marquee = () => {
  const doubled = [...items, ...items]; // duplicate for seamless loop

  return (
    <div
      className="w-full overflow-hidden border-t border-b border-[#D8CBBE]/30 py-3.5"
      style={{ background: '#2A2623' }}
    >
      <div className="relative flex">
        <motion.div
          className="flex shrink-0 gap-0"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
        >
          {doubled.map((item, index) => (
            <span
              key={index}
              className="shrink-0 px-10 text-[11px] lg:text-[13px] tracking-[0.25em] uppercase font-light whitespace-nowrap"
              style={{ color: '#C8A97A', fontFamily: SERIF }}
            >
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Marquee;
