import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { db } from '../Firebase';
import { collection, getDocs } from 'firebase/firestore';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

const SERIF = "'Cormorant Garamond', Georgia, serif";

const defaultReviews = [
  {
    id: 'rev-1',
    name: "Ananya Sharma",
    title: "Verified Buyer",
    date: "14 Feb 2026",
    quote: "The Kundan Choker exceeded all my expectations. The craftsmanship is divine and the atelier packaging felt like receiving a royal gift.",
    rating: 5
  },
  {
    id: 'rev-2',
    name: "Rohan Kapoor",
    title: "Verified Collector",
    date: "02 Feb 2026",
    quote: "Acquired the Solitaire Ring for our 10th anniversary. Exceptional brilliance and unmatched anti-tarnish durability.",
    rating: 5
  },
  {
    id: 'rev-3',
    name: "Meera Oberoi",
    title: "Verified Buyer",
    date: "28 Jan 2026",
    quote: "Velouraz high jewellery pieces have become my signature style for celebrations. The weight, luster, and finish are extraordinary.",
    rating: 5
  },
  {
    id: 'rev-4',
    name: "Kavita Singhania",
    title: "Verified Buyer",
    date: "19 Jan 2026",
    quote: "The attention to detail and gemstone clarity is remarkable. Truly heirloom-quality creations.",
    rating: 5
  }
];

const TestimonialSection = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [reviewsList, setReviewsList] = useState(defaultReviews);

  useEffect(() => {
    const fetchReviewsFromFirestore = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "reviews"));
        const fetched = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          fetched.push({
            id: docSnap.id,
            name: data.customerName || data.name || "Happy Collector",
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
    <section className="py-16 md:py-20 relative overflow-hidden bg-[#F8F4EF] border-t border-b border-[#D8CBBE]/40">
      
      {/* Subtle Ambient Background Radial Lighting */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(ellipse at center, rgba(200,164,106,0.12), transparent 70%)' }}
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-10 md:mb-12 gap-6">
          
          <div className="text-center sm:text-left space-y-2">
            
            <h2 className="font-serif font-normal leading-tight text-3xl sm:text-4xl md:text-5xl text-[#2e0e43]">
              Real Stories. <span className="italic font-serif">Real Love.</span>
            </h2>
          </div>

          {/* Swiper Navigation Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              ref={prevRef}
              aria-label="Previous testimonial"
              className="w-11 h-11 rounded-full bg-white border border-[#D8CBBE] flex items-center justify-center text-[#2e0e43] hover:bg-[#2e0e43] hover:text-white hover:border-[#2e0e43] transition-all duration-300 shadow-xs cursor-pointer"
            >
              <ChevronLeft size={18} strokeWidth={1.8} />
            </button>
            <button
              ref={nextRef}
              aria-label="Next testimonial"
              className="w-11 h-11 rounded-full bg-white border border-[#D8CBBE] flex items-center justify-center text-[#2e0e43] hover:bg-[#2e0e43] hover:text-white hover:border-[#2e0e43] transition-all duration-300 shadow-xs cursor-pointer"
            >
              <ChevronRight size={18} strokeWidth={1.8} />
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
              delay: 4000,
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
                  transition={{ delay: index * 0.08 }}
                  className="p-8 lg:p-9 h-full flex flex-col justify-between border border-[#D8CBBE]/50 bg-white rounded-3xl hover:border-[#C8A46A] hover:shadow-xl transition-all duration-500 shadow-sm relative group"
                  style={{ minHeight: '270px' }}
                >
                  
                  {/* Top Quote Watermark Icon */}
                  <Quote size={32} className="absolute top-6 right-6 text-[#C8A46A]/15 group-hover:text-[#C8A46A]/25 transition-colors pointer-events-none" />

                  {/* Stars */}
                  <div className="flex items-center gap-1.5 mb-5">
                    {[...Array(review.rating || 5)].map((_, i) => (
                      <Star key={i} size={15} className="fill-[#C8A46A] text-[#C8A46A]" />
                    ))}
                  </div>

                  {/* Quote Content */}
                  <p className="text-[#2A2623] text-base sm:text-lg leading-relaxed italic font-serif font-normal flex-grow">
                    "{review.quote}"
                  </p>

                  {/* Reviewer Details */}
                  <div className="mt-7 pt-5 border-t border-[#F4EEE8] flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-xs shrink-0 bg-gradient-to-br from-[#2e0e43] to-[#4a186a] font-serif">
                      {review.name ? review.name.trim().charAt(0) : 'V'}
                    </div>
                    <div>
                      <p className="text-sm font-bold tracking-[0.2em] font-sans text-[#2e0e43] uppercase">
                        {review.name ? review.name.trim() : 'Verified Collector'}
                      </p>
                      <p className="text-sm font-serif text-[#7B6D63]">
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