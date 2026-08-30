import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { db } from "../components/Firebase";
import { doc, onSnapshot, collection, getDocs } from "firebase/firestore";
import { useAuth } from "../components/useAuth";
import { useStore } from '../hooks/useStore';
import { motion, AnimatePresence } from "framer-motion";
import { 
  Star, Shield, Truck, RotateCcw, Heart, ShoppingBag, 
  Share2, Gem, Sparkles, Loader2, ChevronRight, Clock,
  Eye, Award, Gift, RefreshCw, ZoomIn, Check,
  ArrowRight, Lock, X
} from 'lucide-react';

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
  const [zoomStyle, setZoomStyle] = useState({ transform: "scale(1)" });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [copiedLink, setCopiedLink] = useState(false);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);
  const [giftWrap, setGiftWrap] = useState(false);

  const { addToCart, addToWishlist, isInCart, isInWishlist } = useStore();

  useEffect(() => {
    if (!id) return undefined;
    setLoading(true);
    const ref = doc(db, "products", id);
    const unsubscribe = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setProduct({ id: snap.id, ...data });
        const actualStock = Number(data.stock || 0);
        if (actualStock > 0) {
          setQuantity((prev) => Math.min(prev, actualStock));
        }
      } else {
        setProduct(null);
      }
      setLoading(false);
    }, (e) => {
      console.error("Error listening to product:", e);
      setProduct(null);
      setLoading(false);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
    return () => unsubscribe();
  }, [id]);

  // Fetch Related Products
  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const snap = await getDocs(collection(db, "products"));
        const list = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(p => p.id !== id)
          .slice(0, 4);
        setRelatedProducts(list);
      } catch (err) {
        console.error("Error loading related products:", err);
      }
    };
    fetchRelated();
  }, [id]);

  const imageUrls = useMemo(() => {
    if (!product) return [];
    if (product.images && product.images.length > 0) return product.images;
    return [product.image || product.primaryImage || '/img/jewellery/j.png'].filter(Boolean);
  }, [product]);

  const activeImage = imageUrls[selectedImageIndex] || imageUrls[0] || "";

  const discountPercent = product?.original_price > product?.price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100) 
    : 0;

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2.2)"
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transformOrigin: "center center",
      transform: "scale(1)"
    });
  };

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
    if (!product || (product.stock !== undefined && Number(product.stock) <= 0)) return;
    const buyNowItem = {
      id: product.id,
      name: product.name,
      price: Number(product.price || 0),
      original_price: Number(product.original_price || 0),
      image: activeImage,
      quantity: quantity,
      category: product.category || 'Jewellery',
      stock: product.stock,
      giftWrap: giftWrap
    };
    if (!user) {
      navigate('/login', { state: { from: '/checkout', buyNowItem } });
    } else {
      navigate('/checkout', { state: { buyNowItem } });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const checkDeliveryPincode = (e) => {
    e.preventDefault();
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      setPincodeStatus({ success: true, msg: "Insured Express Delivery available! Delivered within 3-4 business days." });
    } else {
      setPincodeStatus({ success: false, msg: "Please enter a valid 6-digit Indian Pincode." });
    }
  };

  const getFlag = (country = "") => {
    const c = country.toLowerCase().trim();
    if (c.includes("italy")) return "🇮🇹";
    if (c.includes("south korea") || c.includes("korean")) return "🇰🇷";
    if (c.includes("france")) return "🇫🇷";
    if (c.includes("india")) return "🇮🇳";
    if (c.includes("greece")) return "🇬🇷";
    if (c.includes("turkey")) return "🇹🇷";
    if (c.includes("japan")) return "🇯🇵";
    if (c.includes("europe")) return "🇪🇺";
    return "✦";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F4EF] flex flex-col items-center justify-center gap-5">
        <div className="relative flex items-center justify-center">
          <div className="w-14 h-14 border-2 border-[#2e0e43]/15 border-t-[#2e0e43] rounded-full animate-spin" />
          <Gem size={22} className="absolute text-[#C8A46A]" />
        </div>
        <p className="text-sm uppercase tracking-[0.25em] text-[#2e0e43] font-bold font-sans">
          Unveiling Velouraz Creation...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F8F4EF] flex flex-col items-center justify-center gap-6 text-center p-6 pt-36">
        <Gem size={52} className="text-[#C8A46A]/50" />
        <h2 className="font-serif text-3xl text-[#2A2623] font-normal">Creation unavailable or archived.</h2>
        <p className="text-sm text-[#7B6D63] max-w-sm font-serif">Explore our boutique collections for handcrafted high jewellery creations.</p>
        <button 
          onClick={() => navigate('/shop')} 
          className="px-8 py-4 bg-[#2e0e43] text-white text-sm font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-[#1A0829] transition-all duration-300 shadow-md font-sans"
        >
          Explore Boutique Catalogue
        </button>
      </div>
    );
  }

  const isOutOfStock = product.stock !== undefined && Number(product.stock) <= 0;

  return (
    <div className="min-h-screen bg-[#F8F4EF] font-sans text-[#2A2623] selection:bg-[#2e0e43] selection:text-white">
      
      {/* High Luxury Header Banner (Exact Breadcrumb Header) */}
      <div className="relative w-full bg-[#120E15] py-8 pt-[170px] pb-10 border-b border-[#C8A46A]/20 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,169,122,0.12),transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none opacity-40" />
        
        <div className="relative z-10 flex items-center justify-center gap-3 text-sm tracking-[0.25em] font-semibold uppercase text-white/60">
          <Link to="/" className="hover:text-[#C8A46A] transition-colors duration-300">home</Link>
          <span className="text-[#C8A46A]/30">/</span>
          <Link to="/shop" className="hover:text-[#C8A46A] transition-colors duration-300">Shop </Link>
          <span className="text-[#C8A46A]/30">/</span>
          <span className="text-[#C8A46A] font-bold truncate max-w-[200px] sm:max-w-none">{product.name}</span>
        </div>
      </div>

      {/* Main Stage Grid Container */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-14 pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
          
          {/* Left Column Container */}
          <div className="lg:col-span-7">
            {/* STICKY GALLERY WRAPPER: Pinned on Desktop View */}
            <div className="lg:sticky lg:top-[120px] space-y-5">
              
              <div className="flex flex-col-reverse md:flex-row gap-4">
                
                {/* Vertical / Horizontal Thumbnail Rail */}
                {imageUrls.length > 1 && (
                  <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:max-h-[580px] no-scrollbar py-1 shrink-0">
                    {imageUrls.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImageIndex(i)}
                        className={`w-16 h-20 md:w-20 md:h-24 rounded-2xl overflow-hidden border-2 transition-all duration-300 relative shrink-0 cursor-pointer ${
                          selectedImageIndex === i 
                            ? 'border-[#2e0e43] ring-2 ring-[#C8A46A] shadow-md scale-105' 
                            : 'border-[#D8CBBE]/60 opacity-70 hover:opacity-100 hover:border-[#C8A46A]'
                        }`}
                      >
                        <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Main Showcase Stage Frame */}
                <div className="flex-1 relative">
                  <motion.div 
                    className="aspect-[4/5] rounded-3xl overflow-hidden bg-[#F4EEE8] border border-[#D8CBBE]/50 relative group cursor-zoom-in shadow-sm hover:shadow-xl transition-shadow"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => setIsLightboxOpen(true)}
                  >
                    <img
                      src={activeImage}
                      alt={product.name}
                      style={zoomStyle}
                      className="w-full h-full object-cover transition-transform duration-100 ease-out"
                    />
                    
                    {/* Floating Status Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none z-10">
                      {discountPercent > 0 && (
                        <span className="bg-[#2e0e43] text-white px-3.5 py-1.5 rounded-xl text-xs uppercase font-bold tracking-[0.2em] shadow-md border border-white/10 font-sans">
                          {discountPercent}% Savings
                        </span>
                      )}
                      {product.stock <= 5 && product.stock > 0 && (
                        <span className="bg-[#1A0829]/90 text-[#F0D5A8] border border-[#C8A46A]/30 px-3.5 py-1.5 rounded-xl text-xs uppercase font-bold tracking-[0.18em] shadow-md font-sans">
                          Limited Edition ({product.stock} Left)
                        </span>
                      )}
                      <span className="bg-white/95 text-[#2e0e43] border border-[#C8A46A]/40 px-3.5 py-1.5 rounded-xl text-xs uppercase font-bold tracking-[0.18em] shadow-xs backdrop-blur-md flex items-center gap-1.5 font-sans">
                        <Sparkles size={13} className="text-[#C8A46A]" /> 100% Anti-Tarnish
                      </span>
                    </div>

                    {/* Expand Lightbox Trigger */}
                    <div className="absolute bottom-4 right-4 bg-white/90 text-[#2e0e43] p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md cursor-pointer hover:scale-110">
                      <ZoomIn size={18} />
                    </div>

                    {/* Hover Magnify Hint */}
                    <div className="absolute bottom-4 left-4 bg-[#2e0e43]/90 text-white text-xs uppercase tracking-[0.18em] font-semibold px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md pointer-events-none flex items-center gap-2 font-sans">
                      <Eye size={14} className="text-[#C8A46A]" /> Hover to Magnify
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Micro Guarantees Strip below Image */}
              <div className="hidden sm:grid sm:grid-cols-3 gap-3.5 pt-1">
                <div className="bg-white border border-[#D8CBBE]/50 rounded-2xl p-3.5 flex items-center gap-3 shadow-xs">
                  <Award className="text-[#C8A46A] shrink-0" size={22} />
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-[#2A2623] font-sans">100% Certified</h5>
                    <p className="text-sm text-[#7B6D63] font-serif">Authenticity Assured</p>
                  </div>
                </div>

                <div className="bg-white border border-[#D8CBBE]/50 rounded-2xl p-3.5 flex items-center gap-3 shadow-xs">
                  <Truck className="text-[#C8A46A] shrink-0" size={22} />
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-[#2A2623] font-sans">Insured Delivery</h5>
                    <p className="text-sm text-[#7B6D63] font-serif">Complimentary Express</p>
                  </div>
                </div>

                <div className="bg-white border border-[#D8CBBE]/50 rounded-2xl p-3.5 flex items-center gap-3 shadow-xs">
                  <RefreshCw className="text-[#C8A46A] shrink-0" size={22} />
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-[#2A2623] font-sans">Easy Returns</h5>
                    <p className="text-sm text-[#7B6D63] font-serif">Hassle-Free Concierge</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Purchase Suite & Information */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-7">
            
            {/* Category Tag, Country Origin, Wishlist & Share */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-[#2e0e43]/10 text-[#2e0e43] text-xs font-bold uppercase tracking-[0.22em] px-3.5 py-1.5 rounded-lg border border-[#2e0e43]/15 font-sans">
                  {product.category || "Velouraz High Jewellery"}
                </span>
                {(product.inspired_country || product.country) && (
                  <span className="bg-white border border-[#D8CBBE]/60 text-[#7B6D63] text-xs font-semibold tracking-wider px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs font-sans">
                    {getFlag(product.inspired_country || product.country)} {product.inspired_country || product.country}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddToWishlist}
                  disabled={wishlistLoading}
                  className={`p-3 rounded-xl border transition-all duration-300 cursor-pointer ${
                    isInWishlist(product.id)
                      ? 'bg-[#2e0e43] text-white border-[#2e0e43] shadow-md scale-105'
                      : 'bg-white text-[#2A2623] border-[#D8CBBE] hover:border-[#2e0e43] hover:bg-[#2e0e43]/5'
                  }`}
                  title="Save to Wishlist"
                >
                  {wishlistLoading ? <Loader2 size={18} className="animate-spin" /> : <Heart size={18} fill={isInWishlist(product.id) ? "currentColor" : "none"} />}
                </button>

                <button
                  onClick={handleShare}
                  className="p-3 rounded-xl bg-white border border-[#D8CBBE] text-[#2A2623] hover:border-[#2e0e43] hover:bg-[#2e0e43]/5 transition-all duration-300 cursor-pointer relative"
                  title="Share Creation"
                >
                  {copiedLink ? <Check size={18} className="text-emerald-700" /> : <Share2 size={18} />}
                  {copiedLink && (
                    <span className="absolute -bottom-9 right-0 bg-[#2e0e43] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md shadow-lg whitespace-nowrap font-sans">
                      Link Copied!
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Title & Collection Name */}
            <div className="space-y-2">
              <h1 className="font-serif text-2xl sm:text-4xl text-[#2e0e43] font-normal leading-tight">
                {product.name}
              </h1>
              {product.collectionName && (
                <p className="text-xs uppercase tracking-[0.22em] text-[#C8A46A] font-bold flex items-center gap-2 pt-1 font-sans">
                  <Gem size={14} className="text-[#C8A46A]" /> {product.collectionName}
                </p>
              )}
            </div>

            {/* Verified Rating Badge */}
            <div className="flex items-center gap-3 bg-white p-3 px-4 rounded-2xl border border-[#D8CBBE]/50 w-fit shadow-xs">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="#C8A46A" stroke="#C8A46A" />
                ))}
              </div>
              <span className="text-sm font-bold text-[#2A2623] font-sans">4.9 / 5.0</span>
              <span className="text-sm text-[#7B6D63] font-serif border-l border-[#D8CBBE] pl-3">
                142 Collector Reviews
              </span>
            </div>

            {/* Price Box */}
            <div className="bg-white p-5 sm:p-7 rounded-3xl border border-[#D8CBBE]/60 space-y-4 shadow-sm relative overflow-hidden">
              <div className="flex items-baseline gap-3.5 font-sans flex-wrap">
                <span className="font-sans font-bold text-2xl sm:text-4xl text-[#2e0e43]">
                  ₹{Number(product.price).toLocaleString()}
                </span>
                {product.original_price > product.price && (
                  <span className="font-sans font-semibold text-base sm:text-lg text-[#7B6D63]/50 line-through">
                    ₹{Number(product.original_price).toLocaleString()}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg">
                    Save {discountPercent}%
                  </span>
                )}
              </div>
              
              <p className="text-sm text-[#7B6D63] font-serif">
                Price inclusive of all taxes. Free insured global express delivery.
              </p>
              
              {/* EMI Indicator */}
              <div className="pt-3 flex items-center gap-2.5 text-sm text-[#7B6D63] border-t border-[#F4EEE8] font-sans">
                <Clock size={16} className="text-[#C8A46A] shrink-0" />
                <span>Or 3 interest-free payments of <strong className="text-[#2e0e43] font-bold">₹{Math.round((product.price || 0) / 3).toLocaleString()}</strong></span>
              </div>
            </div>

            {/* Quantity & Packaging Option */}
            <div className="space-y-4 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7B6D63] font-sans">Quantity</span>
                <div className="flex items-center border border-[#D8CBBE] rounded-xl bg-white overflow-hidden shadow-xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-11 h-11 flex items-center justify-center text-[#2A2623] hover:bg-[#F4EEE8] transition-colors text-lg font-medium cursor-pointer"
                  >
                    −
                  </button>
                  <span className="w-12 text-center font-bold text-sm text-[#2e0e43] font-sans">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(Math.min(10, Number(product.stock || 10)), quantity + 1))}
                    className="w-11 h-11 flex items-center justify-center text-[#2A2623] hover:bg-[#F4EEE8] transition-colors text-lg font-medium cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Signature Velvet Packaging Option */}
              <label className="flex items-center justify-between p-4 bg-white rounded-2xl border border-[#D8CBBE]/60 cursor-pointer hover:border-[#C8A46A] transition-all shadow-xs group">
                <div className="flex items-center gap-3.5">
                  <Gift size={20} className="text-[#2e0e43] group-hover:scale-110 transition-transform shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-[#2A2623] uppercase tracking-wider font-sans">Signature Velvet Gift Packaging</p>
                    <p className="text-sm text-[#7B6D63] font-serif">Includes plush velvet box, satin ribbon & wax-sealed gift note.</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={giftWrap}
                  onChange={(e) => setGiftWrap(e.target.checked)}
                  className="w-4 h-4 accent-[#2e0e43] cursor-pointer shrink-0"
                />
              </label>

              {/* Action Buttons (Exact Original Buy Now Button Styling restored!) */}
              <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || cartLoading}
                  className={`w-full sm:flex-1 min-h-[54px] py-4 px-6 text-sm font-bold uppercase tracking-[0.2em] rounded-xl transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer shadow-md font-sans ${
                    isOutOfStock
                      ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                      : isInCart(product.id)
                      ? 'bg-[#2e0e43] text-white hover:bg-[#1A0829]'
                      : 'bg-[#2e0e43] text-white hover:bg-[#1A0829] active:scale-[0.99]'
                  }`}
                >
                  {cartLoading ? (
                    <Loader2 size={18} className="animate-spin shrink-0" />
                  ) : (
                    <ShoppingBag size={18} className="shrink-0 text-[#C8A46A]" />
                  )}
                  <span>{isOutOfStock ? 'Out of Stock' : isInCart(product.id) ? 'Added to Bag' : 'Add to Bag'}</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className={`w-full sm:flex-1 min-h-[54px] py-4 px-6 text-sm font-bold uppercase tracking-[0.2em] rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md font-sans ${
                    isOutOfStock
                      ? 'bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed'
                      : 'border-2 border-[#2e0e43] bg-white text-[#2e0e43] hover:bg-[#2e0e43] hover:text-white'
                  }`}
                >
                  Buy Now
                </button>
              </div>
            </div>

            {/* Description & Technical Accordion */}
            <div className="pt-6 space-y-6 border-t border-[#D8CBBE]/40">
              
              {/* Delivery Estimator */}
              {product.stock > 0 && (
                <div className="bg-white p-5 rounded-2xl border border-[#D8CBBE]/60 space-y-3 shadow-xs">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#2A2623] flex items-center gap-2 font-sans">
                    <Truck size={16} className="text-[#C8A46A]" /> Express Delivery Estimator
                  </label>
                  <form onSubmit={checkDeliveryPincode} className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="Enter 6-digit Pincode"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="flex-1 px-4 py-3 bg-[#F8F4EF] border border-[#D8CBBE] rounded-xl text-sm outline-none focus:border-[#2e0e43] transition-all font-sans"
                    />
                    <button type="submit" className="px-6 py-3 bg-[#2e0e43] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#1A0829] transition-colors cursor-pointer font-sans shadow-xs">
                      Check
                    </button>
                  </form>
                  {pincodeStatus && (
                    <p className={`text-sm mt-1.5 font-serif ${pincodeStatus.success ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {pincodeStatus.msg}
                    </p>
                  )}
                </div>
              )}

              {/* Description Card */}
              {(product.product_details || product.description) && (
                <div className="bg-white p-6 rounded-3xl border border-[#D8CBBE]/60 space-y-3 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#C8A46A] font-sans">
                    <Sparkles size={14} /> Creation Story & Description
                  </div>
                  <h3 className="font-serif text-xl text-[#2e0e43] font-normal leading-snug">
                    Artisanal Inspiration & Aesthetics
                  </h3>
                  <p className="text-sm text-[#7B6D63] leading-relaxed font-serif whitespace-pre-line">
                    {product.product_details || product.description}
                  </p>
                </div>
              )}

              {/* Accordion Specs */}
              <div className="space-y-3">
                {[
                  { 
                    id: 'details', 
                    label: 'Product Details & Technical Specs',
                    content: (
                      <div className="grid grid-cols-2 gap-4 text-sm font-sans">
                        <div>
                          <span className="text-[#7B6D63] block font-medium">SKU / Code</span>
                          <span className="font-bold text-[#2A2623] uppercase">{product.sku || product.id.slice(0, 8)}</span>
                        </div>
                        {product.productType && (
                          <div>
                            <span className="text-[#7B6D63] block font-medium">Product Type</span>
                            <span className="font-bold text-[#2A2623]">{product.productType}</span>
                          </div>
                        )}
                        {product.color && (
                          <div>
                            <span className="text-[#7B6D63] block font-medium">Color Palette</span>
                            <span className="font-bold text-[#2A2623]">{product.color}</span>
                          </div>
                        )}
                        {(product.size || product.size_weight) && (
                          <div>
                            <span className="text-[#7B6D63] block font-medium">Sizing / Fit</span>
                            <span className="font-bold text-[#2A2623]">{product.size || product.size_weight}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-[#7B6D63] block font-medium">Base Material</span>
                          <span className="font-bold text-[#2A2623]">{product.material || "18K Gold-tone / Premium Alloy"}</span>
                        </div>
                        <div>
                          <span className="text-[#7B6D63] block font-medium">Stones / Details</span>
                          <span className="font-bold text-[#2A2623]">{product.stones || "AAA Cubic Zirconia / Crystals"}</span>
                        </div>
                        {(product.inspired_country || product.country) && (
                          <div>
                            <span className="text-[#7B6D63] block font-medium">Country Collection</span>
                            <span className="font-bold text-[#2A2623]">{product.inspired_country || product.country}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-[#7B6D63] block font-medium">Finish</span>
                          <span className="font-bold text-[#2A2623]">High-Lustre Anti-Tarnish Finish</span>
                        </div>
                      </div>
                    )
                  },
                  { 
                    id: 'craftsmanship', 
                    label: 'Artisanal Craftsmanship & Quality',
                    content: (
                      <p className="text-sm text-[#7B6D63] leading-relaxed font-serif">
                        Handcrafted by master artisans combining lost-wax casting methods with high-precision micro-pavé gemstone setting techniques. Every piece undergoes rigorous quality testing for optical brilliance, anti-tarnish durability, and skin safety.
                      </p>
                    )
                  },
                  { 
                    id: 'shipping', 
                    label: 'Shipping, Delivery & Packaging',
                    content: (
                      <p className="text-sm text-[#7B6D63] leading-relaxed font-serif">
                        {product.shipping || "Dispatched within 1–2 business days. Includes insured doorstep shipping across India. Hand-packed in Velouraz luxury box with authenticity certificate."}
                      </p>
                    )
                  },
                  { 
                    id: 'care', 
                    label: 'Jewellery Care & Preservation Guide',
                    content: (
                      <ul className="space-y-2 text-sm text-[#7B6D63] font-serif">
                        {product.care_instructions ? (
                          <li className="flex items-center gap-2"><Sparkles size={14} className="text-[#C8A46A] shrink-0" /> {product.care_instructions}</li>
                        ) : (
                          <>
                            <li className="flex items-center gap-2"><Sparkles size={14} className="text-[#C8A46A] shrink-0" /> Store in a dry, velvet-lined Velouraz box or pouch.</li>
                            <li className="flex items-center gap-2"><Sparkles size={14} className="text-[#C8A46A] shrink-0" /> Apply perfumes, lotions and cosmetics prior to wearing jewellery.</li>
                            <li className="flex items-center gap-2"><Sparkles size={14} className="text-[#C8A46A] shrink-0" /> Clean gently with a soft microfiber polishing cloth after use.</li>
                          </>
                        )}
                      </ul>
                    )
                  }
                ].map((tab) => (
                  <div key={tab.id} className="bg-white border border-[#D8CBBE]/60 rounded-2xl overflow-hidden shadow-xs">
                    <button
                      onClick={() => setActiveTab(activeTab === tab.id ? '' : tab.id)}
                      className="w-full px-5 py-4 flex items-center justify-between text-left cursor-pointer"
                    >
                      <span className="text-xs font-bold uppercase tracking-wider text-[#2A2623] font-sans">{tab.label}</span>
                      <ChevronRight size={16} className={`text-[#C8A46A] transition-transform duration-300 ${activeTab === tab.id ? 'rotate-90' : ''}`} />
                    </button>
                    {activeTab === tab.id && (
                      <div className="px-5 pb-5 pt-1 border-t border-[#F4EEE8]">
                        {tab.content}
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>

        {/* You May Also Like Showcase */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-12 border-t border-[#D8CBBE]/40">
            <div className="text-center mb-10 space-y-2">
              <span className="text-xs uppercase tracking-[0.25em] text-[#C8A46A] font-bold flex items-center justify-center gap-2 font-sans">
                <Sparkles size={14} /> Curated Complements
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl font-normal text-[#2e0e43]">Complete The Look</h3>
              <p className="text-sm text-[#7B6D63] font-serif max-w-md mx-auto">Handpicked creations designed to seamlessly pair with your selected masterpiece.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6">
              {relatedProducts.map((rel) => (
                <div 
                  key={rel.id}
                  onClick={() => navigate(`/product/${rel.id}`)}
                  className="group bg-white rounded-2xl border border-[#D8CBBE]/50 overflow-hidden cursor-pointer shadow-xs hover:shadow-xl hover:border-[#C8A46A] transition-all duration-500 flex flex-col justify-between"
                >
                  <div className="aspect-square bg-[#F4EEE8] overflow-hidden relative">
                    <img 
                      src={rel.image || rel.images?.[0]} 
                      alt={rel.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    {rel.original_price > rel.price && (
                      <span className="absolute top-3 left-3 bg-[#2e0e43] text-white text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs font-sans">
                        -{Math.round(((rel.original_price - rel.price) / rel.original_price) * 100)}%
                      </span>
                    )}
                  </div>
                  <div className="p-4 space-y-1 text-center">
                    <span className="text-xs uppercase tracking-[0.22em] font-bold text-[#C8A46A] block font-sans">
                      {rel.category || "Velouraz"}
                    </span>
                    <h4 className="font-serif text-base font-medium text-[#2A2623] truncate group-hover:text-[#2e0e43] transition-colors">{rel.name}</h4>
                    <p className="text-sm font-bold text-[#2e0e43] font-sans pt-1">₹{Number(rel.price).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLightboxOpen(false)}
              className="absolute inset-0 bg-[#0B0711]/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 max-w-4xl max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl p-2"
            >
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-[#2e0e43] flex items-center justify-center shadow-md cursor-pointer"
              >
                <X size={20} />
              </button>
              <img
                src={activeImage}
                alt={product.name}
                className="w-full max-h-[85vh] object-contain rounded-2xl"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ProductDetail;