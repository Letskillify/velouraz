import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Breadcrumb = ({ title, subtitle, bgImage, links }) => {
  return (
    <div className="relative w-full h-[350px] md:h-[500px] overflow-hidden flex items-center justify-center">
      {/* Background Image with Slow Scale */}
      <motion.div 
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.5, ease: [0.19, 1, 0.22, 1] }}
        className="absolute inset-0"
      >
        <img 
          src={bgImage} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        {/* Darkening overlays for high contrast with transparent header elements */}
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/35" />
      </motion.div>

      {/* Content wrapper with top padding to clear fixed header height */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-16 pt-24 md:pt-32 text-center text-white">
        {/* Navigation Links */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1, ease: [0.19, 1, 0.22, 1] }}
          className="flex items-center justify-center gap-3 text-[10px] md:text-[11px] tracking-[0.4em] font-bold uppercase mb-8"
        >
          {links.map((link, index) => (
            <React.Fragment key={index}>
              {index > 0 && <ChevronRight size={10} className="opacity-30" />}
              {link.active ? (
                <span className="text-[#fff]">{link.name}</span>
              ) : (
                <Link to={link.href} className="opacity-50 hover:opacity-100 hover:text-white transition-all duration-300">
                  {link.name}
                </Link>
              )}
            </React.Fragment>
          ))}
        </motion.div>

        {/* Title with Split Reveal */}
        <div className="overflow-hidden mb-6">
          <motion.h1 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ delay: 0.6, duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
            className="text-5xl md:text-8xl font-serif leading-tight tracking-tight px-4"
          >
            {title}
          </motion.h1>
        </div>
        
        {subtitle && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.9, y: 0 }}
            transition={{ delay: 1, duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
            className="text-sm md:text-lg font-serif italic max-w-2xl mx-auto opacity-80 px-6 font-light"
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      {/* Decorative Bottom Edge */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-[#FDFAF5] rounded-t-[50%] md:rounded-t-[100%] scale-x-125 translate-y-12" />
    </div>
  );
};

export default Breadcrumb;
