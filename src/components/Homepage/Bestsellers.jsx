import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { Loader2, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../Firebase';
import { useStore } from '../../hooks/useStore';

import 'swiper/css';
import 'swiper/css/navigation';

const staticBestsellers = [
  {
    id: 'bs-1',
    brand: 'VELOURAZ',
    name: 'Aurora Luxe Crystal Cuff Bangle',
    price: 2999,
    original_price: 5199,
    badge: 'NEW ARRIVAL',
    badgeType: 'gold',
    image: 'img/jewellery/j.png',
    stock: 5
  },
  {
    id: 'bs-2',
    brand: 'VELOURAZ',
    name: 'Azure Infinity Crystal Bangle',
    price: 1799,
    original_price: 2699,
    badge: 'SOLD OUT',
    badgeType: 'burgundy',
    image: 'img/jewellery/j.png',
    stock: 0
  },
  {
    id: 'bs-3',
    brand: 'VELOURAZ',
    name: 'Celestia Luxe Crystal Statement Bracelet',
    price: 3499,
    original_price: 4999,
    badge: 'SOLD OUT',
    badgeType: 'burgundy',
    image: 'img/jewellery/j (4).png',
    stock: 0
  },
  {
    id: 'bs-4',
    brand: 'VELOURAZ',
    name: 'Royal Sapphire Halo Tennis Bracelet',
    price: 4014,
    original_price: 5099,
    badge: null,
    image: 'img/jewellery/j (6).png',
    stock: 10
  },
  {
    id: 'bs-5',
    brand: 'VELOURAZ',
    name: 'Lattice Luxe Crystal Bracelet',
    price: 2408,
    original_price: 3299,
    badge: null,
    image: 'img/jewellery/j (6).png',
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
    <section className="py-16 md:py-20 lg:py-24 relative overflow-hidden bg-[#FAF7F2]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-10 md:mb-14 gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="w-6 h-[1px] bg-[#B58E58]/60" />
              <span className="text-xs md:text-sm tracking-[0.3em] font-medium text-[#B58E58] uppercase">
                THE ATELIER
              </span>
            </div>
            
            <h2
              className="font-serif font-light leading-tight tracking-tight text-3xl sm:text-4xl md:text-5xl lg:text-[48px] text-[#222222]"
            >
              The Atelier <span className="italic text-[#7A0E2E]">Bestsellers</span>
            </h2>
            
            <p className="text-[#7B6D63] text-sm sm:text-base leading-relaxed font-serif max-w-md font-light pt-1">
              Masterpieces loved by women worldwide, exemplifying the pinnacle of Velouraz design language.
            </p>
          </div>

          {/* Slider Navigation Buttons */}
          <div className="flex items-center gap-2.5 pb-2">
            <button
              ref={prevRef}
              aria-label="Previous product"
              className="w-10 h-10 rounded-full border border-[#D8CBBE] bg-white/60 flex items-center justify-center text-[#7B6D63] hover:border-[#7A0E2E] hover:text-[#7A0E2E] hover:bg-white transition-all duration-300 cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft size={18} strokeWidth={1.5} />
            </button>
            <button
              ref={nextRef}
              aria-label="Next product"
              className="w-10 h-10 rounded-full border border-[#D8CBBE] bg-white/60 flex items-center justify-center text-[#7B6D63] hover:border-[#7A0E2E] hover:text-[#7A0E2E] hover:bg-white transition-all duration-300 cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronRight size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Product Slider */}
        <div className="relative">
          <Swiper
            modules={[Navigation]}
            spaceBetween={20}
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
              480: { slidesPerView: 2.1, spaceBetween: 20 },
              768: { slidesPerView: 3.2, spaceBetween: 20 },
              1024: { slidesPerView: 4.2, spaceBetween: 20 },
              1280: { slidesPerView: 5, spaceBetween: 20 },
            }}
            className="!overflow-visible"
          >
            {products.map((product) => {
              const inWishlist = isInWishlist ? isInWishlist(product.id) : false;
              const isSoldOut = product.stock <= 0 || product.badge === 'SOLD OUT';

              return (
                <SwiperSlide key={product.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="group flex flex-col h-full rounded-2xl border border-[#EFE8DC] bg-[#FAF7F2] overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-[#D5C6B1] transition-all duration-300 cursor-pointer"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    {/* Image Frame Box */}
                    <div className="relative aspect-square w-full overflow-hidden bg-[#F3ECE1] border-b border-[#EBE3D7]/60">
                      <img
                        src={product.image || 'img/jewellery/j.png'}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />

                      {/* Top Badges */}
                      {product.badge ? (
                        <div className="absolute top-3 left-3 z-10">
                          <span 
                            className={`text-[10px] tracking-[0.18em] font-semibold uppercase px-2.5 py-1 rounded-sm shadow-sm ${
                              product.badgeType === 'burgundy' || isSoldOut 
                                ? 'bg-[#7A0E2E] text-white' 
                                : 'bg-[#B58E58] text-white'
                            }`}
                          >
                            {product.badge}
                          </span>
                        </div>
                      ) : isSoldOut ? (
                        <div className="absolute top-3 left-3 z-10">
                          <span className="bg-[#7A0E2E] text-white text-[10px] tracking-[0.18em] font-semibold uppercase px-2.5 py-1 rounded-sm shadow-sm">
                            SOLD OUT
                          </span>
                        </div>
                      ) : null}

                      {/* Floating Wishlist Button */}
                      <button
                        onClick={(e) => handleAddToWishlist(e, product)}
                        disabled={wishlistLoadings[product.id]}
                        aria-label="Add to wishlist"
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[#2A2623] hover:text-[#7A0E2E] transition-all duration-300 z-10 border border-black/5 hover:scale-105"
                      >
                        {wishlistLoadings[product.id] ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <Heart size={14} fill={inWishlist ? '#7A0E2E' : 'none'} stroke={inWishlist ? '#7A0E2E' : 'currentColor'} strokeWidth={inWishlist ? 0 : 1.5} />
                        )}
                      </button>
                    </div>

                    {/* Product Metadata & Title & Price */}
                    <div className="p-4 text-center space-y-1 flex flex-col justify-between flex-1">
                      <div>
                        <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#B58E58] font-sans block mb-1">
                          {product.brand || "VELOURAZ"}
                        </span>
                        
                        <h3 
                          className="text-xs md:text-sm font-normal text-[#2A2623] font-serif leading-snug group-hover:text-[#7A0E2E] transition-colors duration-300 line-clamp-2"
                        >
                          {product.name}
                        </h3>
                      </div>

                      <div className="flex items-center justify-center gap-2 pt-2">
                        <span className="text-sm font-bold text-[#7A0E2E]">
                          ₹{Number(product.price || 0).toLocaleString()}
                        </span>
                        {product.original_price && Number(product.original_price) > Number(product.price) && (
                          <span className="text-xs text-[#999999] line-through font-normal">
                            ₹{Number(product.original_price).toLocaleString()}
                          </span>
                        )}
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
            className="inline-flex items-center gap-2.5 px-8 py-3.5 border border-[#7A0E2E] text-[#7A0E2E] text-xs font-semibold tracking-[0.25em] uppercase hover:bg-[#7A0E2E] hover:text-white transition-all duration-300 bg-transparent group"
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