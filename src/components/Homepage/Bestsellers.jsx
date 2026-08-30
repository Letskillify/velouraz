import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { Loader2, Heart, ChevronLeft, ChevronRight, Globe, Star } from 'lucide-react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../Firebase';
import { useStore } from '../../hooks/useStore';

import 'swiper/css';
import 'swiper/css/navigation';

const staticBestsellers = [
  {
    id: 'bs-1',
    brand: 'VELOURAZ',
    name: 'Lavender Blossom Ring',
    price: 2499,
    original_price: 3499,
    badge: 'BESTSELLER',
    badgeType: 'gold',
    country: 'ITALY',
    rating: 5,
    reviewsCount: 128,
    image: 'img/jewellery/j.png',
    stock: 5
  },
  {
    id: 'bs-2',
    brand: 'VELOURAZ',
    name: 'Sapphire Drop Necklace',
    price: 2999,
    original_price: 4199,
    badge: 'NEW ARRIVAL',
    badgeType: 'burgundy',
    country: 'SRI LANKA',
    rating: 5,
    reviewsCount: 96,
    image: 'img/jewellery/j (4).png',
    stock: 5
  },
  {
    id: 'bs-3',
    brand: 'VELOURAZ',
    name: 'Dainty Clover Bracelet',
    price: 1999,
    original_price: 2999,
    badge: 'BESTSELLER',
    badgeType: 'gold',
    country: 'TURKEY',
    rating: 5,
    reviewsCount: 154,
    image: 'img/jewellery/j (6).png',
    stock: 5
  },
  {
    id: 'bs-4',
    brand: 'VELOURAZ',
    name: 'Classic Pearl Earrings',
    price: 1799,
    original_price: 2599,
    badge: 'TRENDING',
    badgeType: 'burgundy',
    country: 'UAE',
    rating: 5,
    reviewsCount: 112,
    image: 'img/jewellery/j.png',
    stock: 10
  },
  {
    id: 'bs-5',
    brand: 'VELOURAZ',
    name: 'Royal Amethyst Pendant',
    price: 2799,
    original_price: 3999,
    badge: 'BESTSELLER',
    badgeType: 'gold',
    country: 'BRAZIL',
    rating: 5,
    reviewsCount: 88,
    image: 'img/jewellery/j (4).png',
    stock: 8
  }
];

const BestSellers = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState(staticBestsellers);
  const [loading, setLoading] = useState(true);
  const [wishlistLoadings, setWishlistLoadings] = useState({});
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.6;
    }
  }, []);

  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"), limit(8));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setProducts(list);
        } else {
          setProducts(staticBestsellers);
        }
      } catch (e) {
        console.error("Error fetching bestsellers:", e);
        setProducts(staticBestsellers);
      } finally {
        setLoading(false);
      }
    };
    fetchBestsellers();
  }, []);

  const { addToWishlist, isInWishlist } = useStore();

  const handleAddToWishlist = async (e, product) => {
    e.stopPropagation();
    setWishlistLoadings(prev => ({ ...prev, [product.id]: true }));
    try {
      await addToWishlist(product);
    } finally {
      setWishlistLoadings(prev => ({ ...prev, [product.id]: false }));
    }
  };

  return (
    <section className="py-6 md:py-8 relative overflow-hidden bg-[#FAF7F2]">
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        onLoadedMetadata={(e) => {
          e.target.playbackRate = 0.6;
        }}
        onPlay={(e) => {
          e.target.playbackRate = 0.6;
        }}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
      >
        <source src="https://res.cloudinary.com/duzwys877/video/upload/v1785058045/Animate_two_airplanes_looping_202607261457_fojd30.mp4" type="video/mp4" />
      </video>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between mb-6 md:mb-8 gap-6">
          <div className="w-10 opacity-0 hidden lg:block" /> {/* Spacer for centering */}

          <div className="max-w-2xl mx-auto text-center">
            <h2
              className="font-serif font-light leading-tight tracking-tight text-3xl sm:text-4xl md:text-5xl lg:text-[42px] text-[#222222]"
            >
              The  <span className="italic font-normal text-[#2e0e43]">Bestsellers</span>
            </h2>
            <div className="flex items-center justify-center gap-3 mt-3">
              <span className="w-8 h-[1px] bg-[#B58E58]/40" />
              <span className="text-xs text-[#B58E58]">✦</span>
              <span className="w-8 h-[1px] bg-[#B58E58]/40" />
            </div>
          </div>

          {/* Slider Navigation Buttons */}
          <div className="flex items-center gap-2.5 pb-2">
            <button
              ref={prevRef}
              aria-label="Previous product"
              className="w-10 h-10 rounded-full border border-[#D8CBBE] bg-white/60 flex items-center justify-center text-[#7B6D63] hover:border-[#2e0e43] hover:text-[#2e0e43] hover:bg-white transition-all duration-300 cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft size={18} strokeWidth={1.5} />
            </button>
            <button
              ref={nextRef}
              aria-label="Next product"
              className="w-10 h-10 rounded-full border border-[#D8CBBE] bg-white/60 flex items-center justify-center text-[#7B6D63] hover:border-[#2e0e43] hover:text-[#2e0e43] hover:bg-white transition-all duration-300 cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronRight size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Product Slider */}
        <div className="relative">
          <Swiper
            modules={[Navigation]}
            spaceBetween={24}
            slidesPerView={1.2}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            breakpoints={{
              480: { slidesPerView: 2, spaceBetween: 16 },
              768: { slidesPerView: 3, spaceBetween: 20 },
              1024: { slidesPerView: 4, spaceBetween: 24 },
              1280: { slidesPerView: 4, spaceBetween: 24 },
            }}
            className="!overflow-visible"
          >
            {products.map((product, index) => {
              const inWishlist = isInWishlist ? isInWishlist(product.id) : false;
              const isSoldOut = product.stock <= 0 || product.badge === 'SOLD OUT';
              const countryList = ['ITALY', 'SRI LANKA', 'TURKEY', 'UAE', 'BRAZIL'];
              const country = product.country || countryList[index % countryList.length];
              const reviewsCount = product.reviewsCount || product.reviews || 128;
              const isBurgundyBadge = product.badge === 'NEW ARRIVAL' || product.badge === 'TRENDING' || product.badgeType === 'burgundy';

              return (
                <SwiperSlide key={product.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="group flex flex-col h-full rounded-2xl border border-[#E5D7C5] bg-white overflow-hidden shadow-[0_6px_25px_rgba(46,14,67,0.04)] hover:shadow-[0_16px_40px_rgba(46,14,67,0.12)] hover:border-[#B58E58] transition-all duration-500 cursor-pointer"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    {/* Image Frame Box */}
                    <div className="relative aspect-[4/4.2] w-full overflow-hidden bg-gradient-to-b from-[#F9F6F0] to-[#EFE7DA]">
                      <img
                        src={product.image || 'img/jewellery/j.png'}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                      />

                      {/* Top Badge */}
                      {(product.badge || isSoldOut) && (
                        <div className="absolute top-0 left-0 z-10">
                          <span 
                            className={`inline-block text-[10px] tracking-[0.18em] font-bold uppercase px-3.5 py-1.5 rounded-br-xl shadow-xs ${
                              isSoldOut || isBurgundyBadge
                                ? 'bg-[#2E0E43] text-white' 
                                : 'bg-[#A37B3E] text-white'
                            }`}
                          >
                            {isSoldOut ? 'SOLD OUT' : product.badge}
                          </span>
                        </div>
                      )}

                      {/* Bottom Left Country Tag */}
                      <div className="absolute bottom-3 left-3 z-10">
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-[#E5DBCC] text-[10px] font-bold text-[#8C6D37] tracking-wider uppercase shadow-xs group-hover:border-[#B58E58] transition-colors">
                          <Globe size={11} className="text-[#8C6D37]" />
                          <span>{country}</span>
                        </div>
                      </div>

                      {/* Floating Wishlist Button */}
                      <button
                        onClick={(e) => handleAddToWishlist(e, product)}
                        disabled={wishlistLoadings[product.id]}
                        aria-label="Add to wishlist"
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center text-[#2A2623] hover:text-white hover:bg-[#2E0E43] transition-all duration-300 z-10 border border-black/5 hover:scale-110 cursor-pointer"
                      >
                        {wishlistLoadings[product.id] ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <Heart size={14} fill={inWishlist ? '#2E0E43' : 'none'} stroke={inWishlist ? '#2E0E43' : 'currentColor'} strokeWidth={inWishlist ? 0 : 1.5} />
                        )}
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="p-4 sm:p-5 bg-white flex flex-col justify-between flex-1 text-left border-t border-[#F0E6D8]">
                      <div>
                        <span className="text-[10px] font-bold tracking-[0.25em] text-[#B58E58] font-sans block mb-1 uppercase">
                          {product.brand || "VELOURAZ"}
                        </span>

                        <h3 
                          className="text-xs sm:text-sm font-serif font-semibold text-[#222222] group-hover:text-[#2E0E43] leading-snug line-clamp-1 mb-2.5 transition-colors duration-300"
                        >
                          {product.name}
                        </h3>
                      </div>

                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#F5EFE6]">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-sm sm:text-base font-bold text-[#2E0E43]">
                            ₹{Number(product.price || 0).toLocaleString()}
                          </span>
                          {product.original_price && Number(product.original_price) > Number(product.price) && (
                            <span className="text-xs text-[#999999] line-through font-normal">
                              ₹{Number(product.original_price).toLocaleString()}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <div className="flex items-center text-[#D4A359]">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={11} className="fill-[#D4A359] text-[#D4A359]" />
                            ))}
                          </div>
                          <span className="text-[11px] text-[#777777] font-medium font-sans">({reviewsCount})</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        {/* Bottom Explore All Bestsellers Button */}
        <div className="flex justify-center mt-12 md:mt-16">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 border border-[#2e0e43] text-[#2e0e43] text-xs font-semibold tracking-[0.25em] uppercase hover:bg-[#2e0e43] hover:text-white transition-all duration-300 bg-transparent group"
          >
            <span>EXPLORE ALL BESTSELLERS</span>
            <span className="text-xs text-[#B58E58] group-hover:text-white transition-colors">✦</span>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default BestSellers;

