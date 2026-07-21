import React from 'react';
import { motion } from 'framer-motion';
import { Gem, Award, ShieldCheck, Heart, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Gem,
    title: "Premium Materials",
    description: "Finest precious conflict-free stones and 18k solid gold base."
  },
  {
    icon: Sparkles,
    title: "Artisanal Finish",
    description: "Each masterpiece is meticulously hand-detailed by lead artisans."
  },
  {
    icon: ShieldCheck,
    title: "Anti-Tarnish Wear",
    description: "Hypoallergenic coating to lock in reflectivity and shine."
  },
  {
    icon: Heart,
    title: "Skin Friendly Alloys",
    description: "Nickel-free and lead-free alloys designed for daily comfort."
  },
  {
    icon: Award,
    title: "Atelier Guarantee",
    description: "Backed by our lifetime authenticity and preservation promise."
  }
];

const CRIMSON = '#7A0E2E';
const DARK_TEXT = '#2A2623';
const WARM_BEIGE = '#FDFCF7';
const SERIF = "'Cormorant Garamond', Georgia, serif";

const QualitySection = () => {
  return (
    <section 
      className="py-10 lg:py-14 relative overflow-hidden border-t border-[#D8CBBE]/30"
      style={{ backgroundColor: WARM_BEIGE }}
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full relative z-10">
        
        {/* Global Standard Title & Subtitle Design - Centered for compactness */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-8">
          <div className="flex items-center justify-center gap-3">
            <span className="w-8 h-[1px]" style={{ background: CRIMSON }} />
            <span className="text-base lg:text-[16px] tracking-[0.35em] font-bold text-[#7B6D63] uppercase">
              Why Velauraz
            </span>
            <span className="w-8 h-[1px]" style={{ background: CRIMSON }} />
          </div>

          <h2
            className="font-light leading-tight tracking-tight"
            style={{
              color: DARK_TEXT,
              fontFamily: SERIF,
              fontSize: 'clamp(2rem, 3.5vw, 3rem)',
            }}
          >
            Quality You <span className="italic" style={{ color: CRIMSON }}>Can Trust</span>
          </h2>
          
          <p className="text-[#7B6D63] text-[16px] lg:text-[16px] leading-relaxed max-w-xl mx-auto" style={{ fontFamily: SERIF }}>
            Unrivaled excellence in metal-smithing, ethical gems, and lifelong wear.
          </p>
        </div>

        {/* 5-Column Grid Layout - Highly compact and premium */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className="group flex flex-col items-center text-center p-5 rounded-[2px] border border-[#D8CBBE]/20 bg-[#FBF9F4] hover:border-[#7A0E2E]/25 transition-all duration-300 hover:shadow-[0_8px_20px_rgba(42,38,35,0.03)]"
            >
              {/* Micro Icon */}
              <div 
                className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-500 mb-4 border"
                style={{
                  borderColor: 'rgba(200, 169, 122, 0.2)',
                  background: '#FFFDF9',
                  color: CRIMSON,
                }}
              >
                <feature.icon size={18} strokeWidth={1.2} className="group-hover:scale-110 transition-transform duration-300" />
              </div>

              {/* Title & Desc (min 14px size for descriptions) */}
              <h3 
                className="text-[16px] tracking-[0.06em] font-semibold uppercase mb-2 group-hover:text-[#7A0E2E] transition-colors"
                style={{ color: DARK_TEXT, fontFamily: SERIF }}
              >
                {feature.title}
              </h3>
              <p className="text-[16px] text-[#7B6D63] leading-relaxed font-light">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default QualitySection;