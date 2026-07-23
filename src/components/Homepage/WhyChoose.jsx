import React from 'react';
import { motion } from 'framer-motion';
import { Gem, Award, ShieldCheck } from 'lucide-react';

// Custom icons to match screenshot 1 perfectly
const ArtisanalIcon = ({ size = 22, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2v6" />
    <path d="M8 8h8a2 2 0 0 1 2 2v3H6v-3a2 2 0 0 1 2-2z" />
    <path d="M4 17h16" />
    <path d="M7 17v3a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-3" />
  </svg>
);

const LeafIcon = ({ size = 22, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.4 19 2c1 2 2 4.1 2 9 0 5.5-4.5 9-10 9z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);

const features = [
  {
    icon: Gem,
    title: "PREMIUM MATERIALS",
    description: "Finest precious conflict-free stones and 18k solid gold base."
  },
  {
    icon: ArtisanalIcon,
    title: "ARTISANAL FINISH",
    description: "Each masterpiece is meticulously hand-detailed by lead artisans."
  },
  {
    icon: ShieldCheck,
    title: "ANTI-TARNISH WEAR",
    description: "Hypoallergenic coating to lock in reflectivity and shine."
  },
  {
    icon: LeafIcon,
    title: "SKIN FRIENDLY ALLOYS",
    description: "Nickel-free and lead-free alloys designed for daily comfort."
  },
  {
    icon: Award,
    title: "ATELIER GUARANTEE",
    description: "Backed by our lifetime authenticity and preservation promise."
  }
];

const QualitySection = () => {
  return (
    <section 
      className="py-16 md:py-20 lg:py-24 relative overflow-hidden bg-[#FAF7F2]"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 w-full relative z-10">
        
        {/* Header Section */}
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-12 md:mb-16">
          <div className="flex items-center justify-center gap-3">
            <span className="w-6 h-[1px] bg-[#B58E58]/60" />
            <span className="text-xs md:text-sm tracking-[0.3em] font-medium text-[#B58E58] uppercase">
              WHY VELOURAZ
            </span>
            <span className="w-6 h-[1px] bg-[#B58E58]/60" />
          </div>

          <h2
            className="font-serif font-light leading-tight tracking-tight text-3xl sm:text-4xl md:text-5xl lg:text-[52px] text-[#222222]"
          >
            Quality You <span className="italic text-[#7A0E2E]">Can Trust</span>
          </h2>

          {/* Gold Star Accent */}
          <div className="flex items-center justify-center py-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#C5A267">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
          </div>
          
          <p className="text-[#7B6D63] text-sm sm:text-base leading-relaxed font-serif max-w-xl mx-auto font-light">
            Unrivaled excellence in metal-smithing, ethical gems, and lifelong wear.
          </p>
        </div>

        {/* 5-Column Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group flex flex-col items-center text-center p-6 md:p-7 rounded-2xl border border-[#EFE8DC] bg-[#FAF7F2]/90 hover:bg-white hover:border-[#D5C6B1] transition-all duration-300 shadow-[0_4px_25px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
              >
                {/* Gold Circle Ring Icon Container */}
                <div 
                  className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 mb-5 border border-[#D5C6B1] bg-white/80 text-[#B58E58] group-hover:scale-105 group-hover:border-[#B58E58]"
                >
                  <IconComponent size={22} strokeWidth={1.2} className="text-[#B58E58]" />
                </div>

                {/* Title & Description */}
                <h3 
                  className="text-xs md:text-sm font-semibold tracking-[0.14em] uppercase mb-2.5 text-[#2A2623] group-hover:text-[#7A0E2E] transition-colors font-sans"
                >
                  {feature.title}
                </h3>
                <p className="text-xs md:text-[13px] text-[#7B6D63] leading-relaxed font-light font-sans">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default QualitySection;