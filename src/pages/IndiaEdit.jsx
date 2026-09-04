import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Gem, Crown } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';

const IndiaEdit = () => {
  const navigate = useNavigate();

  const handleSilverClick = () => {
    navigate('/shop?country=India&material=Silver');
  };

  const handleLuxeClick = () => {
    navigate('/shop?country=India&material=Kundan');
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] font-sans text-[#2A2623]">
      
      {/* Hero Banner Section */}
      <Breadcrumb
        title="The India Edit"
        subtitle="Exploring royal courts, artisanal silver craft, uncut Polki diamonds & timeless Indian high jewellery."
        bgImage="https://res.cloudinary.com/dcjn4y284/image/upload/v1787672225/india_yqlodw.png"
        links={[
          { name: 'Home', href: '/' },
          { name: 'World Edit', href: '/world-edit' },
          { name: 'The India Edit', href: '/world-edit/india', active: true }
        ]}
      />

      {/* Main Container */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-12 lg:py-16">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#FAF3E8] border border-[#C8A46A]/30 text-[#B89355] text-xs font-semibold uppercase tracking-[0.25em]">
            <Sparkles className="w-3.5 h-3.5 text-[#B89355]" /> Inspired by Indian Artistry & Royal Heritage
          </div>

          <h1 className="font-serif font-light text-3xl sm:text-5xl text-[#2A2623] tracking-tight leading-tight">
            Curated Collections of <span className="italic text-[#8B6B38]">Indian Craftsmanship</span>
          </h1>

          <p className="text-sm sm:text-base text-[#6B5E52] font-serif font-light leading-relaxed">
            Select a collection below to discover hallmarked 925 sterling silver statement creations or imperial court Jadau, uncut Polki diamonds, and royal Kundan chokers in our boutique.
          </p>
        </div>

        {/* ─── THE TWO FEATURED CARDS SECTION ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">

          {/* CARD 1: THE SILVER EDIT */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            onClick={handleSilverClick}
            className="group relative bg-gradient-to-b from-[#FFFFFF] via-[#FAF6F0] to-[#F5ECE0] rounded-3xl border border-[#E5D7C5] overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(184,147,85,0.2)] hover:border-[#C8A46A] transition-all duration-500 flex flex-col justify-between cursor-pointer"
          >
            <div>
              {/* Image Banner */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-[#EFE7DC]">
                <img
                  src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1200"
                  alt="The Silver Edit"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                
                {/* Badge Overlay */}
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-[#2A2623]/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-[#FAF6F0]">
                  <Gem className="w-3.5 h-3.5 text-[#C8A46A]" />
                  <span className="text-xs font-bold uppercase tracking-widest font-sans">925 Sterling & Oxidised</span>
                </div>

                {/* Title Overlay */}
                <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
                  <span className="text-xs font-sans uppercase font-bold tracking-[0.2em] text-[#E5C794] block">
                    Collection I
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl font-normal leading-tight group-hover:text-[#E5C794] transition-colors">
                    The Silver Edit
                  </h2>
                </div>
              </div>

              {/* Card Content Body */}
              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <p className="text-xs font-sans uppercase tracking-[0.2em] text-[#B89355] font-semibold mb-1.5">
                    Pure 925 Silver & Oxidised Tribal Heritage
                  </p>
                  <p className="text-sm sm:text-base text-[#5C524A] font-serif font-light leading-relaxed">
                    Rooted in ancient silver-smithing traditions of Rajasthan and Gujarat. Discover hallmarked 925 sterling silver bangles, oxidised tribal chokers, intricately carved ear cuffs, and versatile modern everyday statements.
                  </p>
                </div>

                {/* Feature Bullet Highlights */}
                <div className="space-y-2.5 pt-4 border-t border-[#E8DFC8]">
                  <span className="text-xs font-sans uppercase font-bold tracking-[0.18em] text-[#2A2623] block">
                    Key Signature Highlights:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#6B5E52] font-sans">
                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/70 border border-[#E8DFC8]">
                      <span className="text-[#B89355] font-bold">✦</span> 925 Hallmarked Pure Silver
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/70 border border-[#E8DFC8]">
                      <span className="text-[#B89355] font-bold">✦</span> Tribal Oxidised & Antique Finish
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/70 border border-[#E8DFC8]">
                      <span className="text-[#B89355] font-bold">✦</span> Modern Contemporary Layering
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/70 border border-[#E8DFC8]">
                      <span className="text-[#B89355] font-bold">✦</span> Lightweight Everyday Comfort
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Action CTA */}
            <div className="p-6 sm:p-8 pt-0">
              <button
                type="button"
                onClick={handleSilverClick}
                className="w-full py-4 rounded-full bg-[#2A2623] text-[#FAF6F0] font-sans text-xs font-bold uppercase tracking-[0.2em] group-hover:bg-[#B89355] group-hover:shadow-[0_8px_25px_rgba(184,147,85,0.35)] active:scale-98 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Shop The Silver Edit</span>
                <ArrowRight className="w-4 h-4 text-[#E5C794] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

          {/* CARD 2: THE LUXE EDIT */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            onClick={handleLuxeClick}
            className="group relative bg-gradient-to-b from-[#FFFFFF] via-[#FAF6F0] to-[#F5ECE0] rounded-3xl border border-[#E5D7C5] overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(184,147,85,0.2)] hover:border-[#C8A46A] transition-all duration-500 flex flex-col justify-between cursor-pointer"
          >
            <div>
              {/* Image Banner */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-[#EFE7DC]">
                <img
                  src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=1200"
                  alt="The Luxe Edit"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                
                {/* Badge Overlay */}
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-[#2A2623]/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-[#FAF6F0]">
                  <Crown className="w-3.5 h-3.5 text-[#C8A46A]" />
                  <span className="text-xs font-bold uppercase tracking-widest font-sans">Royal Kundan, Polki & High Jewellery</span>
                </div>

                {/* Title Overlay */}
                <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
                  <span className="text-xs font-sans uppercase font-bold tracking-[0.2em] text-[#E5C794] block">
                    Collection II
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl font-normal leading-tight group-hover:text-[#E5C794] transition-colors">
                    The Luxe Edit
                  </h2>
                </div>
              </div>

              {/* Card Content Body */}
              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <p className="text-xs font-sans uppercase tracking-[0.2em] text-[#B89355] font-semibold mb-1.5">
                    Imperial Court Jadau, Uncut Polki & Meenakari
                  </p>
                  <p className="text-sm sm:text-base text-[#5C524A] font-serif font-light leading-relaxed">
                    Inspired by the grand royal courts of India. Luxurious heritage pieces featuring uncut Polki stones set in pure foil gold, handcrafted Kundan artwork, vibrant Meenakari enameling, and regal bridal chokers.
                  </p>
                </div>

                {/* Feature Bullet Highlights */}
                <div className="space-y-2.5 pt-4 border-t border-[#E8DFC8]">
                  <span className="text-xs font-sans uppercase font-bold tracking-[0.18em] text-[#2A2623] block">
                    Key Signature Highlights:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#6B5E52] font-sans">
                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/70 border border-[#E8DFC8]">
                      <span className="text-[#B89355] font-bold">✦</span> Royal Uncut Polki & Kundan Stones
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/70 border border-[#E8DFC8]">
                      <span className="text-[#B89355] font-bold">✦</span> Hand-carved Meenakari Enameling
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/70 border border-[#E8DFC8]">
                      <span className="text-[#B89355] font-bold">✦</span> Bridal & Statement High Chokers
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/70 border border-[#E8DFC8]">
                      <span className="text-[#B89355] font-bold">✦</span> 24K Gold Plated Heritage Finish
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Action CTA */}
            <div className="p-6 sm:p-8 pt-0">
              <button
                type="button"
                onClick={handleLuxeClick}
                className="w-full py-4 rounded-full bg-[#2A2623] text-[#FAF6F0] font-sans text-xs font-bold uppercase tracking-[0.2em] group-hover:bg-[#B89355] group-hover:shadow-[0_8px_25px_rgba(184,147,85,0.35)] active:scale-98 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Shop The Luxe Edit</span>
                <ArrowRight className="w-4 h-4 text-[#E5C794] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

        </div>

      </div>
    </div>
  );
};

export default IndiaEdit;
