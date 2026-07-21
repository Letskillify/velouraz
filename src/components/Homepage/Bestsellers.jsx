import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { Loader2, ShoppingBag, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../Firebase';
import { useStore } from '../../hooks/useStore';

import 'swiper/css';
import 'swiper/css/navigation';

const CRIMSON = '#7A0E2E';
const DARK_TEXT = '#2A2623';
const LIGHT_BG = '#FDFCF7';
const GOLD = '#C8A97A';
const SERIF = "'Cormorant Garamond', Georgia, serif";

const BestSellers = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartLoadings, setCartLoadings] = useState({});
  const [wishlistLoadings, setWishlistLoadings] = useState({});
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  React.useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"), limit(8));
        const snap = await getDocs(q);
        const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(list);
      } catch (e) {
        console.error("Error fetching bestsellers:", e);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBestsellers();
  }, []);

  const { addToCart, addToWishlist, isInCart, isInWishlist } = useStore();

  const handleAddToCart = async (e, product) => {
    e.stopPropagation();
    setCartLoadings(prev => ({ ...prev, [product.id]: true }));
    try {
      await addToCart(product);
    } finally {
      setCartLoadings(prev => ({ ...prev, [product.id]: false }));
    }
  };

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
    <section className="py-8 lg:py-12 relative overflow-hidden border-t border-[#D8CBBE]/30" style={{ backgroundColor: LIGHT_BG }}>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row items-end justify-between mb-10 gap-6">
          <div className="space-y-4 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-[1px]" style={{ background: CRIMSON }} />
              <span className="text-base lg:text-[16px] tracking-[0.35em] font-bold text-[#7B6D63] uppercase">
                Curated Selection
              </span>
            </motion.div>
            
            <h2
              className="font-light leading-tight tracking-tight"
              style={{
                color: DARK_TEXT,
                fontFamily: SERIF,
                fontSize: 'clamp(2rem, 3.5vw, 3rem)',
              }}
            >
              The Atelier <span className="italic" style={{ color: CRIMSON }}>Bestsellers</span>
            </h2>
            
            <p className="text-[#7B6D63] text-[16px] lg:text-[16px] leading-relaxed max-w-md" style={{ fontFamily: SERIF }}>
              Masterpieces favored by patrons worldwide, exemplifying the pinnacle of Velauraz design language.
            </p>
          </div>

          {/* Navigation Controls matching other components */}
          <div className="flex items-center gap-2 pb-2">
            <button
              ref={prevRef}
              aria-label="Previous product"
              className="w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none"
              style={{
                borderColor: 'rgba(123, 109, 99, 0.25)',
                color: '#7B6D63',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = CRIMSON;
                e.currentTarget.style.color = CRIMSON;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(123, 109, 99, 0.25)';
                e.currentTarget.style.color = '#7B6D63';
              }}
            >
              <ChevronLeft size={18} strokeWidth={1.5} />
            </button>
            <button
              ref={nextRef}
              aria-label="Next product"
              className="w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none"
              style={{
                borderColor: 'rgba(123, 109, 99, 0.25)',
                color: '#7B6D63',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = CRIMSON;
                e.currentTarget.style.color = CRIMSON;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(123, 109, 99, 0.25)';
                e.currentTarget.style.color = '#7B6D63';
              }}
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
              480: { slidesPerView: 2 },
              768: { slidesPerView: 2.8 },
              1024: { slidesPerView: 3.5 },
              1280: { slidesPerView: 4.2 },
            }}
            className="!overflow-visible"
          >
            {loading ? (
              <div className="flex gap-6 w-full">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex-1 min-w-[280px] aspect-[4/5] bg-[#7A0E2E]/5 animate-pulse rounded-[4px]" />
                ))}
              </div>
            ) : products.map((product) => {
              const inWishlist = isInWishlist(product.id);
              const inCart = isInCart(product.id);

              return (
                <SwiperSlide key={product.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="group flex flex-col space-y-4 cursor-pointer"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    {/* Image frame */}
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[4px] border border-[#D8CBBE]/15 bg-[#F6F2EB] transition-all duration-500 hover:shadow-[0_12px_35px_rgba(42,38,35,0.06)]">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                      />

                      {/* Top floating wishlist button */}
                      <button
                        onClick={(e) => handleAddToWishlist(e, product)}
                        disabled={wishlistLoadings[product.id]}
                        aria-label="Add to wishlist"
                        className="absolute top-4 right-4 w-9 h-9 rounded-full border border-black/10 bg-white/95 flex items-center justify-center text-[#2A2623] hover:text-[#7A0E2E] shadow-sm transition-all duration-300 z-10"
                      >
                        {wishlistLoadings[product.id] ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <Heart size={14} fill={inWishlist ? CRIMSON : "none"} stroke={inWishlist ? CRIMSON : "currentColor"} strokeWidth={inWishlist ? 0 : 1.5} />
                        )}
                      </button>

                      {/* Clean Hover Slide-up for Quick Purchase */}
                      {product.stock > 0 && (
                        <div className="absolute bottom-4 left-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-10">
                          <button
                            onClick={(e) => handleAddToCart(e, product)}
                            disabled={cartLoadings[product.id]}
                            className="w-full py-3 text-[16px] tracking-[0.22em] font-bold uppercase flex items-center justify-center gap-2 rounded-sm border border-transparent bg-[#2A2623] text-white hover:bg-[#7A0E2E] transition-colors duration-300 shadow-md"
                          >
                            {cartLoadings[product.id] ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <ShoppingBag size={12} />
                            )}
                            {inCart ? 'Added to Bag' : 'Acquire Piece'}
                          </button>
                        </div>
                      )}

                      {product.stock <= 0 && (
                        <div className="absolute top-4 left-4 z-10">
                          <span className="bg-[#7A0E2E]/95 text-white text-[16px] tracking-[0.25em] font-bold uppercase px-3 py-1.5 rounded-sm">
                            Sold Out
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Product Metadata & Specifications */}
                    <div className="px-1 text-center space-y-1">
                      <p className="text-[16px] tracking-[0.25em] font-bold uppercase text-[#7B6D63]/70">
                        {product.brand || "Velouraz Workshop"}
                      </p>
                      
                      <h3 
                        className="text-lg lg:text-xl font-light text-[#2A2623] group-hover:text-[#7A0E2E] transition-colors duration-300"
                        style={{ fontFamily: SERIF }}
                      >
                        {product.name}
                      </h3>

                      <div className="flex items-center justify-center gap-3 pt-0.5">
                        <span className="text-base font-semibold text-[#7A0E2E]">
                          ₹{Number(product.price || 0).toLocaleString()}
                        </span>
                        {product.original_price > product.price && (
                          <span className="text-base text-[#7B6D63]/50 line-through">
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
      </div>
    </section>
  );
};

export default BestSellers;