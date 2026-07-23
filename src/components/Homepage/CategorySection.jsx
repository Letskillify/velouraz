import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { db } from '../../components/Firebase';
import { collection, onSnapshot } from 'firebase/firestore';

import 'swiper/css';
import 'swiper/css/navigation';

const defaultCategories = [
  {
    id: '1',
    num: '01',
    name: "BANGLES",
    image: "img/jewellery/j.png",
    link: "/shop?category=Bangles"
  },
  {
    id: '2',
    num: '02',
    name: "JEWELLERY",
    image: "img/jewellery/j (6).png",
    link: "/shop"
  },
  {
    id: '3',
    num: '03',
    name: "NECKLACES",
    image: "img/jewellery/j (1).png",
    link: "/shop?category=Necklace"
  },
  {
    id: '4',
    num: '04',
    name: "JEWELLERY SETS",
    image: "img/jewellery/j (3).png",
    link: "/shop?category=Bridal Wear"
  },
  {
    id: '5',
    num: '05',
    name: "BRACELETS",
    image: "img/jewellery/j (4).png",
    link: "/shop?category=Bracelet"
  },
  {
    id: '6',
    num: '06',
    name: "RINGS",
    image: "img/jewellery/j (5).png",
    link: "/shop?category=Rings"
  }
];

const CategorySection = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [categories, setCategories] = useState(defaultCategories);

  useEffect(() => {
    return onSnapshot(collection(db, "categories"), (snap) => {
      if (!snap.empty) {
        setCategories(snap.docs.map((d, index) => {
          const item = d.data();
          let targetCategory = item.name || '';
          
          // Map to match Shop category filters
          const nameLower = targetCategory.toLowerCase().trim();
          if (nameLower === 'necklaces') targetCategory = 'Necklace';
          else if (nameLower === 'bracelets') targetCategory = 'Bracelet';
          else if (nameLower === 'jewellery sets' || nameLower === 'sets') targetCategory = 'Bridal Wear';
          else if (nameLower === 'jewellery') targetCategory = ''; // Show all
          else {
            // Capitalize first letter to match Shop category casing
            targetCategory = targetCategory.charAt(0).toUpperCase() + targetCategory.slice(1);
          }

          const shopLink = targetCategory ? `/shop?category=${encodeURIComponent(targetCategory)}` : '/shop';

          return {
            id: d.id,
            num: String(index + 1).padStart(2, '0'),
            name: (item.name || '').toUpperCase(),
            image: item.image || defaultCategories[index % defaultCategories.length].image,
            link: shopLink
          };
        }));
      } else {
        setCategories(defaultCategories);
      }
    });
  }, []);

  return (
    <section className="py-16 md:py-20 lg:py-24 overflow-hidden relative bg-[#FAF7F2]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-10 md:mb-14 gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="w-6 h-[1px] bg-[#B58E58]/60" />
              <span className="text-xs md:text-sm tracking-[0.3em] font-medium text-[#B58E58] uppercase">
                BROWSE COLLECTIONS
              </span>
            </div>
            
            <h2
              className="font-serif font-light leading-tight tracking-tight text-3xl sm:text-4xl md:text-5xl lg:text-[48px] text-[#222222]"
            >
              Shop By <span className="italic text-[#7A0E2E]">Category</span>
            </h2>

            {/* Star Accent */}
            <div className="flex items-center py-0.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#C5A267">
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
              </svg>
            </div>
            
            <p className="text-[#7B6D63] text-sm sm:text-base leading-relaxed font-serif max-w-md font-light pt-1">
              Indulge in a curated exploration of jewellery categories, each hand-finished with exceptional mastery.
            </p>
          </div>

          {/* Slider Navigation Buttons */}
          <div className="flex items-center gap-2.5 pb-2">
            <button
              ref={prevRef}
              aria-label="Previous categories"
              className="w-10 h-10 rounded-full border border-[#D8CBBE] bg-white/60 flex items-center justify-center text-[#7B6D63] hover:border-[#7A0E2E] hover:text-[#7A0E2E] hover:bg-white transition-all duration-300 cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft size={18} strokeWidth={1.5} />
            </button>
            <button
              ref={nextRef}
              aria-label="Next categories"
              className="w-10 h-10 rounded-full border border-[#D8CBBE] bg-white/60 flex items-center justify-center text-[#7B6D63] hover:border-[#7A0E2E] hover:text-[#7A0E2E] hover:bg-white transition-all duration-300 cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronRight size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Categories Slider */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={20}
            slidesPerView={1.2}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            breakpoints={{
              480: { slidesPerView: 2.1, spaceBetween: 20 },
              768: { slidesPerView: 3.2, spaceBetween: 20 },
              1024: { slidesPerView: 4.2, spaceBetween: 24 },
              1280: { slidesPerView: 6, spaceBetween: 20 },
            }}
            className="!overflow-visible"
          >
            {categories.map((category, index) => (
              <SwiperSlide key={category.id || index}>
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                  className="group flex flex-col h-full rounded-3xl border border-[#EFE8DC] bg-[#FAF7F2] p-4 md:p-5 shadow-[0_4px_25px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-[#D5C6B1] transition-all duration-300"
                >
                  <Link to={category.link} className="flex flex-col flex-1">
                    {/* Top Index Number */}
                    <div className="text-center mb-3">
                      <span className="text-xs font-semibold tracking-[0.2em] text-[#B58E58] inline-block relative px-3 py-0.5">
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-[1px] bg-[#B58E58]/40" />
                        {category.num}
                        <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-[1px] bg-[#B58E58]/40" />
                      </span>
                    </div>

                    {/* Dome Arch Frame Window */}
                    <div className="w-full aspect-[4/4.8] rounded-t-full rounded-b-none bg-[#F3ECE1] border border-[#EBE3D7]/60 overflow-hidden relative shadow-inner mb-3">
                      <img 
                        src={category.image} 
                        alt={category.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>

                    {/* Star Accent */}
                    <div className="flex items-center justify-center my-1.5">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="#C5A267">
                        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                      </svg>
                    </div>

                    {/* Category Title */}
                    <h3 
                      className="text-xs md:text-sm font-semibold tracking-[0.14em] text-[#2A2623] uppercase text-center font-sans mb-4 group-hover:text-[#7A0E2E] transition-colors"
                    >
                      {category.name}
                    </h3>
                  </Link>
                  
                  {/* Bottom Footer Action */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#EFE8DC]/60 mt-auto">
                    <Link 
                      to={category.link}
                      className="text-[10px] md:text-[11px] font-semibold tracking-[0.2em] text-[#B58E58] uppercase group-hover:text-[#7A0E2E] transition-colors"
                    >
                      VIEW EDIT
                    </Link>
                    
                    <Link 
                      to={category.link}
                      aria-label={`Explore ${category.name}`}
                      className="w-7 h-7 rounded-full border border-[#D5C6B1] flex items-center justify-center text-[#B58E58] group-hover:text-[#7A0E2E] group-hover:border-[#7A0E2E] transition-colors duration-300 bg-white/50"
                    >
                      <ArrowRight size={12} strokeWidth={1.5} />
                    </Link>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Bottom Explore All Collections Button */}
        <div className="flex justify-center mt-12 md:mt-16">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 border border-[#7A0E2E] text-[#7A0E2E] text-xs font-semibold tracking-[0.25em] uppercase hover:bg-[#7A0E2E] hover:text-white transition-all duration-300 bg-transparent group"
          >
            <span>EXPLORE ALL COLLECTIONS</span>
            <span className="text-xs text-[#B58E58] group-hover:text-white transition-colors">✦</span>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default CategorySection;