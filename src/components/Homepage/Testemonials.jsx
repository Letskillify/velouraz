import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { db } from '../Firebase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';

import 'swiper/css';
import 'swiper/css/navigation';

const initialUserReviews = [
  {
    id: 'review-mariya-vakil',
    name: "Mariya Vakil",
    customerName: "Mariya Vakil",
    title: "Verified Buyer",
    quote: "Thnk u velouraz for beautiful bracelet..Got so many compliments...love to buy from you again",
    review: "Thnk u velouraz for beautiful bracelet..Got so many compliments...love to buy from you again",
    rating: 5
  },
  {
    id: 'review-rashida-bombaywala',
    name: "Rashida Bombaywala",
    customerName: "Rashida Bombaywala",
    title: "Verified Buyer",
    quote: "Thank u so much velouraz for this beautiful bracelet...really loved by everyone 💖 ❤️ 💗 quality is realy ultimate 👌",
    review: "Thank u so much velouraz for this beautiful bracelet...really loved by everyone 💖 ❤️ 💗 quality is realy ultimate 👌",
    rating: 5
  },
  {
    id: 'review-arwa-kagdi',
    name: "Arwa Kagdi",
    customerName: "Arwa Kagdi",
    title: "Verified Buyer",
    quote: "Thankyou VELOURAZ for such pretty hoops that not only matched my outfit but looked soo aesthetic yet subtle n can go with any outfit of mine....in love with this hoop earring ❤️🫶",
    review: "Thankyou VELOURAZ for such pretty hoops that not only matched my outfit but looked soo aesthetic yet subtle n can go with any outfit of mine....in love with this hoop earring ❤️🫶",
    rating: 5
  }
];

const fallbackReviews = [
  ...initialUserReviews,
  {
    id: 'review-priya-s',
    name: "Priya S.",
    title: "Collector, Mumbai",
    quote: "The quality is exceptional and designs are so unique. VelourAZ is my go-to for every occasion. Every piece I've received has exceeded my expectations.",
    rating: 5
  },
  {
    id: 'review-ananya-r',
    name: "Ananya R.",
    title: "Bride, Delhi",
    quote: "Stunning pieces and super fast delivery. I felt the luxury in the packaging too it felt like opening a gift from a couture house.",
    rating: 5
  }
];

const CRIMSON = '#2e0e43';
const SERIF = "'Cormorant Garamond', Georgia, serif";

const TestimonialSection = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [reviewsList, setReviewsList] = useState(fallbackReviews);

  useEffect(() => {
    const uploadAndFetchReviews = async () => {
      try {
        // Upload provided customer reviews to Firebase Firestore "reviews" collection
        for (const rev of initialUserReviews) {
          const docRef = doc(db, "reviews", rev.id);
          await setDoc(docRef, {
            customerName: rev.customerName,
            name: rev.name,
            review: rev.review,
            quote: rev.quote,
            title: rev.title,
            rating: rev.rating,
            createdAt: new Date().toISOString()
          }, { merge: true });
        }

        // Fetch all reviews live from Firebase Firestore
        const querySnapshot = await getDocs(collection(db, "reviews"));
        const fetched = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          fetched.push({
            id: docSnap.id,
            name: data.customerName || data.name || "Happy Customer",
            title: data.title || "Verified Buyer",
            quote: data.review || data.quote || "",
            rating: data.rating || 5
          });
        });

        // Merge initial reviews with any fetched from Firestore so all 3 are guaranteed to display
        const mergedMap = new Map();
        initialUserReviews.forEach(r => mergedMap.set(r.id, r));
        fetched.forEach(r => mergedMap.set(r.id, r));

        const combinedList = Array.from(mergedMap.values());
        if (combinedList.length > 0) {
          setReviewsList(combinedList);
        }
      } catch (error) {
        console.error("Firebase reviews sync error:", error);
      }
    };

    uploadAndFetchReviews();
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
            modules={[Navigation]}
            spaceBetween={24}
            slidesPerView={1}
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
            className="!overflow-visible"
          >
            {reviewsList.map((review, index) => (
              <SwiperSlide key={review.id || index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.09 }}
                  className="p-8 lg:p-10 h-full flex flex-col justify-between border border-white/10 rounded-2xl hover:border-white/30 transition-all duration-300 shadow-lg"
                  style={{ background: 'rgba(255,255,255,0.06)', minHeight: '260px' }}
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-5">
                    {[...Array(review.rating || 5)].map((_, i) => (
                      <Star key={i} size={13} className="fill-[#E5C794] text-[#E5C794]" />
                    ))}
                  </div>

                  <p
                    className="text-white/90 text-[16px] lg:text-[17px] leading-relaxed italic font-light flex-grow"
                    style={{ fontFamily: SERIF }}
                  >
                    "{review.quote}"
                  </p>

                  <div className="mt-7 pt-5 border-t border-white/10 flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-[#2e0e43] shadow-md shrink-0"
                      style={{ background: 'linear-gradient(135deg, #E5C794, #FFF)', fontFamily: SERIF }}
                    >
                      {review.name ? review.name.charAt(0) : 'V'}
                    </div>
                    <div>
                      <p className="text-[15px] tracking-wider font-semibold text-white uppercase">
                        {review.name}
                      </p>
                      <p className="text-[13px] text-white/50" style={{ fontFamily: SERIF }}>
                        {review.title || 'Verified Buyer'}
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