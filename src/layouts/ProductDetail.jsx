import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../components/Firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../components/useAuth";
import { useStore } from '../hooks/useStore';
import { motion, AnimatePresence } from "framer-motion";
import { 
  Star, Shield, Truck, RotateCcw, Heart, ShoppingBag, 
  ArrowLeft, Share2, Gem, Sparkles, ArrowRight, Loader2, ChevronRight, Package, Clock
} from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const [quantity, setQuantity] = useState(1);
  const [cartLoading, setCartLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const curatedProducts = [];

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const curated = curatedProducts.find(p => String(p.id) === String(id));
      if (curated) {
        setProduct(curated);
        setLoading(false);
        return;
      }
      try {
        const ref = doc(db, "products", id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setProduct({ id: snap.id, ...snap.data() });
        }
      } catch (e) {
        console.error("Firebase error:", e);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const { addToCart, addToWishlist, isInCart, isInWishlist } = useStore();

  const handleAddToCart = async () => {
    if (!product) return;
    setCartLoading(true);
    try {
      await addToCart(product, quantity);
    } finally {
      setCartLoading(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!product) return;
    setWishlistLoading(true);
    try {
      await addToWishlist(product);
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleBuyNow = () => {
    if (!product || product.stock <= 0) return;
    const buyNowItem = {
      id: product.id,
      name: product.name,
      price: Number(product.price || 0),
      original_price: Number(product.original_price || 0),
      image: product.image || product.images?.[0] || '',
      quantity: quantity,
      category: product.category || 'Jewellery',
      stock: product.stock
    };
    if (!user) {
      navigate('/login', { state: { from: '/checkout', buyNowItem } });
    } else {
      navigate('/checkout', { state: { buyNowItem } });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFAF5] flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-[1.5px] border-[#7A0E2E] border-t-transparent rounded-full animate-spin" />
        <p className="text-[14px] uppercase tracking-[0.5em] text-[#7A0E2E] font-bold">Loading</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FDFAF5] flex flex-col items-center justify-center gap-6 text-center p-6">
        <h2 className="font-serif text-3xl text-[#2A2623]/80 italic">Piece not found.</h2>
        <button onClick={() => navigate('/shop')} className="text-[14px] tracking-[0.3em] uppercase text-[#7A0E2E] border-b border-[#7A0E2E] pb-1 hover:text-[#2A2623] hover:border-[#2A2623] transition-all font-bold">Return to Shop</button>
      </div>
    );
  }

  const discountPercent = product.original_price > product.price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-[#FDFAF5] font-sans text-[#2A2623]">
      
      {/* Premium Dark Crimson Breadcrumb Banner (No Product Image) */}
      <div 
        className="relative w-full h-[260px] sm:h-[340px] flex items-center justify-center overflow-hidden" 
        style={{ background: 'linear-gradient(135deg, #1C030A 0%, #300612 50%, #4D091B 100%)' }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,169,122,0.15)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-black/45" />

        <div className="relative z-10 text-center px-5 pt-32 md:pt-40 text-white">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif tracking-tight leading-tight max-w-[800px] mx-auto line-clamp-1 italic font-light text-[#C8A97A]">
            {product.name}
          </h1>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-12 bg-[#FDFAF5] rounded-t-[50%] md:rounded-t-[100%] scale-x-125 translate-y-6" />
      </div>

      {/* Main Product Section */}
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-8 pb-16">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
          
          {/* Left: Image Gallery */}
          <div className="w-full lg:w-[55%] lg:sticky lg:top-24 self-start">
            <div className="flex flex-col-reverse sm:flex-row gap-4">
              {/* Thumbnail Strip */}
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:max-h-[600px] scrollbar-hide">
                {[...Array(4)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImageIndex(i)}
                    className={`flex-shrink-0 w-16 h-20 sm:w-[72px] sm:h-[90px] rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      selectedImageIndex === i 
                        ? 'border-[#7A0E2E] opacity-100' 
                        : 'border-transparent opacity-50 hover:opacity-80'
                    }`}
                  >
                    <img src={product.image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Main Image */}
              <motion.div 
                className="flex-1 aspect-[3/4] rounded-2xl overflow-hidden bg-[#F4EEE8] relative group cursor-crosshair"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                />
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {discountPercent > 0 && (
                    <span className="bg-[#7A0E2E] text-white px-3 py-1.5 rounded-full text-[14px] font-bold tracking-wider">
                      -{discountPercent}%
                    </span>
                  )}
                  {product.stock <= 5 && product.stock > 0 && (
                    <span className="bg-[#2A2623] text-white px-3 py-1.5 rounded-full text-[14px] font-bold tracking-wider">
                      Few Left
                    </span>
                  )}
                </div>
                {/* Wishlist Button on Image */}
                <button
                  onClick={handleAddToWishlist}
                  disabled={wishlistLoading}
                  className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md ${
                    isInWishlist(product.id) 
                      ? 'bg-[#7A0E2E] text-white' 
                      : 'bg-white/80 text-[#2A2623] hover:bg-[#7A0E2E] hover:text-white'
                  }`}
                >
                  {wishlistLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Heart size={16} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                  )}
                </button>
              </motion.div>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="w-full lg:w-[45%] py-2">
            <div className="space-y-6">

              {/* Category & Name */}
              <div>
                <p className="text-[14px] tracking-[0.3em] font-bold uppercase text-[#7A0E2E] mb-3">
                  {product.category || 'Velouraz Collection'}
                </p>
                <h1 className="text-3xl md:text-4xl font-serif text-[#2A2623] leading-snug tracking-tight">
                  {product.name}
                </h1>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="#D4A853" stroke="#D4A853" className={i >= 4 ? 'opacity-30' : ''} />
                  ))}
                </div>
                <span className="text-[12px] text-[#7B6D63]">4.8 (128 reviews)</span>
              </div>

              {/* Price Block */}
              <div className="flex items-baseline gap-4">
                <span className="text-3xl font-serif text-[#2A2623]">
                  ₹{Number(product.price).toLocaleString()}
                </span>
                {product.original_price > product.price && (
                  <>
                    <span className="text-lg text-[#7B6D63]/50 line-through font-serif">
                      ₹{Number(product.original_price).toLocaleString()}
                    </span>
                    <span className="text-[14px] font-bold text-[#7A0E2E] bg-[#7A0E2E]/8 px-2.5 py-1 rounded-full">
                      Save {discountPercent}%
                    </span>
                  </>
                )}
              </div>

              <p className="text-[14px] text-[#7B6D63]">Inclusive of all taxes. Free shipping on orders above ₹999.</p>

              {/* Divider */}
              <div className="h-px bg-[#D8CBBE]/40" />

              {/* Description */}
              <p className="text-[15px] text-[#2A2623]/70 leading-relaxed font-serif">
                {product.description || "An exceptional masterwork of artisanal design, meticulously handcrafted to embody Velouraz's philosophy of timeless elegance and modern sophistication."}
              </p>

              {/* Quantity & Add to Cart */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-6">
                  <span className="text-[14px] uppercase tracking-[0.2em] font-bold text-[#7B6D63]">Qty</span>
                  <div className="flex items-center border border-[#D8CBBE] rounded-lg overflow-hidden bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center text-[#2A2623] hover:bg-[#F4EEE8] transition-colors text-lg font-light border-r border-[#D8CBBE]"
                    >
                      −
                    </button>
                    <span className="w-12 text-center font-bold text-[#2A2623] text-sm">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(Math.min(10, Number(product.stock)), quantity + 1))}
                      disabled={quantity >= Math.min(10, Number(product.stock))}
                      className="w-10 h-10 flex items-center justify-center text-[#2A2623] hover:bg-[#F4EEE8] transition-colors disabled:opacity-20 text-lg font-light border-l border-[#D8CBBE]"
                    >
                      +
                    </button>
                  </div>
                  {product.stock <= 5 && product.stock > 0 && (
                    <span className="text-[14px] text-amber-600 font-bold uppercase tracking-wider animate-pulse">
                      Only {product.stock} left
                    </span>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0 || cartLoading}
                    className={`flex-1 h-14 text-[14px] uppercase tracking-[0.3em] font-bold rounded-xl transition-all duration-500 flex items-center justify-center gap-3 ${
                      product.stock <= 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : isInCart(product.id)
                      ? 'bg-[#7A0E2E] text-white shadow-lg shadow-[#7A0E2E]/20'
                      : 'bg-[#2A2623] text-white hover:bg-[#7A0E2E] shadow-lg shadow-[#2A2623]/15'
                    }`}
                  >
                    {cartLoading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <ShoppingBag size={18} />
                    )}
                    {product.stock <= 0 ? 'Out of Stock' : isInCart(product.id) ? 'Added to Cart' : 'Add to Cart'}
                  </button>
                </div>

                {/* Buy Now */}
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className="w-full h-14 text-[14px] uppercase tracking-[0.3em] font-bold rounded-xl border-2 border-[#2A2623] text-[#2A2623] hover:bg-[#2A2623] hover:text-white transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Buy Now
                </button>
              </div>

              {/* Divider */}
              <div className="h-px bg-[#D8CBBE]/40" />

              {/* Trust Signals - Horizontal */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { icon: Shield, label: "Secure\nCheckout" },
                  { icon: Truck, label: "Free\nDelivery" },
                  { icon: RotateCcw, label: "Easy\nReturns" },
                  { icon: Gem, label: "Certified\nQuality" }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 text-center py-3">
                    <div className="w-10 h-10 rounded-full bg-[#F4EEE8] flex items-center justify-center">
                      <item.icon size={18} className="text-[#7A0E2E]" strokeWidth={1.5} />
                    </div>
                    <span className="text-[9px] uppercase tracking-wider font-bold text-[#7B6D63] whitespace-pre-line leading-tight">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="h-px bg-[#D8CBBE]/40" />

              {/* Accordion-Style Tabs */}
              <div className="space-y-0">
                {[
                  { 
                    id: 'details', 
                    label: 'Product Details',
                    content: (
                      <div className="grid grid-cols-2 gap-4 py-1">
                        {[
                          { label: 'Reference', value: product.id.slice(0, 10).toUpperCase() },
                          { label: 'Material', value: 'Demi-Fine / Gold Plated' },
                          { label: 'Country of Origin', value: product.country || 'Imported' },
                          { label: 'Collection', value: product.category || 'Velouraz' },
                        ].map((d, i) => (
                          <div key={i}>
                            <p className="text-[14px] uppercase tracking-wider text-[#7B6D63]/60 font-bold mb-1">{d.label}</p>
                            <p className="text-[13px] text-[#2A2623] font-medium">{d.value}</p>
                          </div>
                        ))}
                      </div>
                    )
                  },
                  { 
                    id: 'craft', 
                    label: 'Craftsmanship',
                    content: (
                      <div className="space-y-3 py-1">
                        <p className="text-[13px] text-[#2A2623]/70 leading-relaxed">
                          Each piece undergoes meticulous hand-polishing for a high-lustre finish. Advanced plating techniques including gold, rose gold, and rhodium enhance both appearance and longevity.
                        </p>
                        <div className="flex items-center gap-2 text-[#7A0E2E]">
                          <Sparkles size={14} />
                          <span className="text-[14px] uppercase tracking-wider font-bold">Signature Anti-Tarnish Finish</span>
                        </div>
                      </div>
                    )
                  },
                  { 
                    id: 'care', 
                    label: 'Care Instructions',
                    content: (
                      <ul className="space-y-2.5 py-1">
                        {[
                          "Avoid contact with water, perfumes & chemicals",
                          "Store in the provided luxury pouch",
                          "Wipe gently with a soft, dry cloth after use",
                          "Keep away from direct sunlight"
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-[13px] text-[#2A2623]/70">
                            <span className="w-1 h-1 rounded-full bg-[#7A0E2E] mt-2 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )
                  },
                  { 
                    id: 'shipping', 
                    label: 'Shipping & Returns',
                    content: (
                      <div className="space-y-3 py-1">
                        <div className="flex items-start gap-3">
                          <Package size={16} className="text-[#7A0E2E] mt-0.5 flex-shrink-0" />
                          <p className="text-[13px] text-[#2A2623]/70">Free standard shipping on all orders above ₹999. Delivered within 5-7 business days.</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <Clock size={16} className="text-[#7A0E2E] mt-0.5 flex-shrink-0" />
                          <p className="text-[13px] text-[#2A2623]/70">Easy 7-day returns. Items must be unworn and in original packaging.</p>
                        </div>
                      </div>
                    )
                  },
                ].map((tab) => (
                  <div key={tab.id} className="border-b border-[#D8CBBE]/30">
                    <button
                      onClick={() => setActiveTab(activeTab === tab.id ? '' : tab.id)}
                      className="w-full flex items-center justify-between py-4 text-left group"
                    >
                      <span className="text-[13px] font-bold text-[#2A2623] uppercase tracking-wider">{tab.label}</span>
                      <ChevronRight 
                        size={16} 
                        className={`text-[#7B6D63] transition-transform duration-300 ${activeTab === tab.id ? 'rotate-90' : ''}`} 
                      />
                    </button>
                    <AnimatePresence>
                      {activeTab === tab.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="pb-5 px-1">
                            {tab.content}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Fixed Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-xl border-t border-[#D8CBBE]/30 z-50 lg:hidden flex gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0 || cartLoading}
          className={`flex-1 h-12 text-[14px] uppercase tracking-[0.2em] font-bold rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${
            product.stock <= 0
            ? 'bg-gray-100 text-gray-400'
            : isInCart(product.id)
            ? 'bg-[#7A0E2E] text-white'
            : 'bg-[#2A2623] text-white'
          }`}
        >
          {cartLoading ? <Loader2 size={14} className="animate-spin" /> : <ShoppingBag size={14} />}
          {product.stock <= 0 ? 'Sold Out' : isInCart(product.id) ? 'In Cart' : 'Add to Cart'}
        </button>
        <button
          onClick={handleBuyNow}
          disabled={product.stock <= 0}
          className="flex-1 h-12 text-[14px] uppercase tracking-[0.2em] font-bold rounded-xl border-2 border-[#2A2623] text-[#2A2623] active:scale-[0.98] transition-all disabled:opacity-30"
        >
          Buy Now
        </button>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default ProductDetail;