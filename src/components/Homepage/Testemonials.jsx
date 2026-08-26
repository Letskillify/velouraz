import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { db } from '../Firebase';
import { collection, getDocs } from 'firebase/firestore';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

const CRIMSON = '#2e0e43';
const SERIF = "'Cormorant Garamond', Georgia, serif";

const TestimonialSection = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [reviewsList, setReviewsList] = useState([]);

  useEffect(() => {
    const fetchReviewsFromFirestore = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "reviews"));
        const fetched = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          fetched.push({
            id: docSnap.id,
            name: data.customerName || data.name || "Happy Customer",
            title: data.title || "Verified Buyer",
            date: data.date || "",
            quote: data.review || data.quote || "",
            rating: data.rating || 5
          });
        });

        if (fetched.length > 0) {
          setReviewsList(fetched);
        }
      } catch (error) {
        console.error("Firebase reviews fetch error:", error);
      }
    };

    fetchReviewsFromFirestore();
  }, []);

  return (
    <section className="py-12 md:py-16 relative overflow-hidden border-t border-[#D8CBBE]/30" style={{ background: CRIMSON }}>
      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between mb-8 md:mb-10 gap-8">
          <div className="w-10 opacity-0 hidden lg:block" /> {/* Spacer for centering */}

          <div className="max-w-2xl mx-auto text-center">
            <h2
              className="font-serif font-light leading-tight tracking-tight text-3xl sm:text-4xl md:text-5xl lg:text-[42px] text-white"
            >
              Real Stories. <span className="italic font-normal text-white/75">Real Love.</span>
            </h2>
            <div className="flex items-center justify-center gap-3 mt-3">
              <span className="w-8 h-[1px] bg-white/30" />
              <span className="text-xs text-white/70">✦</span>
              <span className="w-8 h-[1px] bg-white/30" />
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <button
              ref={prevRef}
              aria-label="Previous review"
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/60 transition-all duration-300 cursor-pointer"
            >
              <ChevronLeft size={18} strokeWidth={1.5} />
            </button>
            <button
              ref={nextRef}
              aria-label="Next review"
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/60 transition-all duration-300 cursor-pointer"
            >
              <ChevronRight size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative overflow-hidden">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            breakpoints={{
              640: { slidesPerView: 1.5 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 3 },
            }}
            className="!overflow-visible [&_.swiper-slide]:!h-auto"
          >
            {reviewsList.map((review, index) => (
              <SwiperSlide key={review.id || index} className="!h-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.09 }}
                  className="p-8 lg:p-10 h-full flex flex-col justify-between border border-white/20 bg-white rounded-2xl hover:border-[#E5C794] hover:shadow-2xl transition-all duration-300 shadow-md"
                  style={{ minHeight: '260px' }}
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-5">
                    {[...Array(review.rating || 5)].map((_, i) => (
                      <Star key={i} size={13} className="fill-[#C5A059] text-[#C5A059]" />
                    ))}
                  </div>

                  <p
                    className="text-[#222222] text-[16px] lg:text-[17px] leading-relaxed italic font-light flex-grow"
                    style={{ fontFamily: SERIF }}
                  >
                    "{review.quote}"
                  </p>

                  <div className="mt-7 pt-5 border-t border-[#EAE3D8] flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm shrink-0"
                      style={{ background: 'linear-gradient(135deg, #2e0e43, #4a186a)', fontFamily: SERIF }}
                    >
                      {review.name ? review.name.trim().charAt(0) : 'V'}
                    </div>
                    <div>
                      <p className="text-[15px] tracking-wider font-normal text-[#2e0e43] uppercase">
                        {review.name ? review.name.trim() : ''}
                      </p>
                      <p className="text-[13px] text-black" style={{ fontFamily: SERIF }}>
                        {review.title || 'Verified Buyer'}{review.date ? ` • ${review.date}` : ''}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;