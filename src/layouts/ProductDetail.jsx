import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { db } from "../components/Firebase";
import { doc, getDoc, collection, getDocs, limit, query, where } from "firebase/firestore";
import { useAuth } from "../components/useAuth";
import { useStore } from '../hooks/useStore';
import { motion, AnimatePresence } from "framer-motion";
import { 
  Star, Shield, Truck, RotateCcw, Heart, ShoppingBag, 
  ArrowLeft, Share2, Gem, Sparkles, ArrowRight, Loader2, ChevronRight, Package, Clock,
  Eye, CheckCircle2, Award, Gift, RefreshCw, ZoomIn, Check, Copy, MessageCircle, Info, Sparkle
} from 'lucide-react';

import Breadcrumb from "../components/Breadcrumb";

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
    const loadProduct = async () => {
      setLoading(true);
      try {
        const ref = doc(db, "products", id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setProduct({ id: snap.id, ...snap.data() });
        } else {
          setProduct(null);
        }
      } catch (e) {
        console.error("Error loading product:", e);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      transform: "scale(2.4)"
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
    if (!product || product.stock <= 0) return;
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
      setPincodeStatus({ success: true, msg: "Express Delivery available! Delivered by 3-5 business days." });
    } else {
      setPincodeStatus({ success: false, msg: "Please enter a valid 6-digit Pincode." });
    }
  };

  const getFlag = (country = "") => {
    const c = country.toLowerCase().trim();
    if (c.includes("italy")) return "🇮🇹";
    if (c.includes("south korea") || c.includes("korean")) return "🇰🇷";
    if (c.includes("india")) return "🇮🇳";
    if (c.includes("greece")) return "🇬🇷";
    if (c.includes("turkey")) return "🇹🇷";
    if (c.includes("japan")) return "🇯🇵";
    return "✦";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center gap-4">
        <div className="relative flex items-center justify-center">
          <div className="w-14 h-14 border-2 border-[#7A0E2E]/20 border-t-[#7A0E2E] rounded-full animate-spin" />
          <Gem size={20} className="absolute text-[#7A0E2E]" />
        </div>
        <p className="text-xs uppercase tracking-[0.4em] text-[#7A0E2E] font-bold">Unveiling Masterpiece</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center gap-6 text-center p-6 pt-32">
        <Gem size={48} className="text-[#B58E58]/40" />
        <h2 className="font-serif text-3xl text-[#2A2623] italic font-light">Piece unavailable or removed.</h2>
        <p className="text-xs text-[#7B6D63] max-w-sm">Explore our curated collections for similar high jewellery designs.</p>
        <button 
          onClick={() => navigate('/shop')} 
          className="px-8 py-3 bg-[#7A0E2E] text-white text-xs font-bold uppercase tracking-[0.25em] rounded-xl hover:bg-[#2A2623] transition-colors cursor-pointer shadow-lg"
        >
          Explore Catalogue
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans text-[#2A2623]">
      {/* Compact Dark Header Banner to ensure transparent header is visible */}
      <div className="relative w-full bg-[#1A1613] py-6 pt-[185px] pb-8 mb-10 border-b border-[#EBE3D7]/10 text-center">
        {/* Subtle Background Pattern/Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(181,142,88,0.08),transparent_70%)] pointer-events-none" />
        
        {/* Compact Breadcrumbs */}
        <div className="relative z-10 flex items-center justify-center gap-2.5 text-[10px] md:text-[11px] tracking-[0.25em] font-semibold uppercase text-white/50">
          <Link to="/" className="hover:text-[#C8A97A] transition-colors">Home</Link>
          <span className="text-white/20">/</span>
          <Link to="/shop" className="hover:text-[#C8A97A] transition-colors">Shop</Link>
          <span className="text-white/20">/</span>
          <span className="text-[#C8A97A] font-bold truncate max-w-[180px] sm:max-w-none">{product.name}</span>
        </div>
      </div>

      {/* Main Product Display Area */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          
          {/* Left Column: Multi-Angle Gallery with Glass Magnifier */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-col-reverse md:flex-row gap-4">
              
              {/* Vertical Thumbnail Rail */}
              {imageUrls.length > 1 && (
                <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:max-h-[580px] scrollbar-hide py-1">
                  {imageUrls.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImageIndex(i)}
                      className={`flex-shrink-0 w-16 h-20 md:w-20 md:h-24 rounded-2xl overflow-hidden border-2 transition-all duration-300 relative group cursor-pointer ${
                        selectedImageIndex === i 
                          ? 'border-[#7A0E2E] ring-2 ring-[#7A0E2E]/20 shadow-md scale-105' 
                          : 'border-[#EBE3D7] opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      {selectedImageIndex === i && (
                        <div className="absolute inset-0 bg-[#7A0E2E]/10" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Main Showcase Stage */}
              <div className="flex-1 relative">
                <motion.div 
                  className="aspect-[4/5] rounded-3xl overflow-hidden bg-[#F3ECE1] border border-[#EBE3D7] relative group cursor-zoom-in shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
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
                  
                  {/* Floating Luxe Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none z-10">
                    {discountPercent > 0 && (
                      <span className="bg-[#7A0E2E] text-white px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold tracking-[0.2em] shadow-md backdrop-blur-md">
                        Save {discountPercent}%
                      </span>
                    )}
                    {product.stock <= 5 && product.stock > 0 && (
                      <span className="bg-[#2A2623]/90 text-white px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold tracking-[0.2em] shadow-md">
                        Only {product.stock} Left
                      </span>
                    )}
                    <span className="bg-[#FFFDF9]/90 text-[#7A0E2E] border border-[#B58E58]/30 px-3 py-1 rounded-lg text-[10px] uppercase font-bold tracking-[0.18em] shadow-sm backdrop-blur-md flex items-center gap-1">
                      <Sparkles size={11} /> 100% Anti-Tarnish
                    </span>
                  </div>

                  {/* Expand / Lightbox Button Overlay */}
                  <div className="absolute bottom-4 right-4 bg-white/90 text-[#2A2623] p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md cursor-pointer">
                    <ZoomIn size={18} />
                  </div>

                  {/* Hover Magnify Hint */}
                  <div className="absolute bottom-4 left-4 bg-[#2A2623]/80 text-white text-[10px] uppercase tracking-widest font-semibold px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md pointer-events-none flex items-center gap-1.5">
                    <Eye size={12} /> Hover to Zoom
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Micro Guarantees Strip below Image - Hidden on Mobile */}
            <div className="hidden sm:grid sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-[#FFFDF9] border border-[#EBE3D7] rounded-2xl p-3 flex items-center gap-3 text-left shadow-sm">
                <Award className="text-[#B58E58] flex-shrink-0" size={20} />
                <div>
                  <h5 className="text-[11px] font-bold uppercase tracking-wider text-[#2A2623]">Certified Luxe</h5>
                  <p className="text-[10px] text-[#7B6D63]">Authenticity Guarantee</p>
                </div>
              </div>

              <div className="bg-[#FFFDF9] border border-[#EBE3D7] rounded-2xl p-3 flex items-center gap-3 text-left shadow-sm">
                <Truck className="text-[#B58E58] flex-shrink-0" size={20} />
                <div>
                  <h5 className="text-[11px] font-bold uppercase tracking-wider text-[#2A2623]">Express Insured</h5>
                  <p className="text-[10px] text-[#7B6D63]">Doorstep Delivery</p>
                </div>
              </div>

              <div className="bg-[#FFFDF9] border border-[#EBE3D7] rounded-2xl p-3 flex items-center gap-3 text-left shadow-sm">
                <RefreshCw className="text-[#B58E58] flex-shrink-0" size={20} />
                <div>
                  <h5 className="text-[11px] font-bold uppercase tracking-wider text-[#2A2623]">7-Day Easy</h5>
                  <p className="text-[10px] text-[#7B6D63]">Hassle-Free Returns</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: High-Jewellery Specifications & Purchase Panel */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Header: Category & Share */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-[#7A0E2E]/10 text-[#7A0E2E] text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-md">
                  {product.category || "Fine Jewellery"}
                </span>
                {product.country && (
                  <span className="bg-[#FFFDF9] border border-[#EBE3D7] text-[#7B6D63] text-[10px] font-semibold tracking-wider px-2.5 py-1 rounded-md flex items-center gap-1">
                    {getFlag(product.country)} {product.country}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddToWishlist}
                  disabled={wishlistLoading}
                  className={`p-2.5 rounded-full border transition-all cursor-pointer ${
                    isInWishlist(product.id)
                      ? 'bg-[#7A0E2E] text-white border-[#7A0E2E] shadow-sm'
                      : 'bg-[#FFFDF9] text-[#2A2623] border-[#EBE3D7] hover:border-[#7A0E2E]'
                  }`}
                  title="Wishlist"
                >
                  {wishlistLoading ? <Loader2 size={16} className="animate-spin" /> : <Heart size={16} fill={isInWishlist(product.id) ? "currentColor" : "none"} />}
                </button>

                <button
                  onClick={handleShare}
                  className="p-2.5 rounded-full bg-[#FFFDF9] border border-[#EBE3D7] text-[#2A2623] hover:border-[#7A0E2E] transition-all cursor-pointer relative"
                  title="Share Article"
                >
                  {copiedLink ? <Check size={16} className="text-emerald-600" /> : <Share2 size={16} />}
                  {copiedLink && (
                    <span className="absolute -bottom-8 right-0 bg-[#2A2623] text-white text-[9px] px-2 py-1 rounded whitespace-nowrap">
                      Link Copied!
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Product Title */}
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-[40px] text-[#222222] font-light leading-tight tracking-tight">
                {product.name}
              </h1>
              {product.collectionName && (
                <p className="text-xs uppercase tracking-[0.25em] text-[#B58E58] font-bold mt-2 flex items-center gap-1.5">
                  <Gem size={13} /> {product.collectionName} Collection
                </p>
              )}
            </div>

            {/* Verified Ratings */}
            <div className="flex items-center gap-3 bg-[#FFFDF9] p-3 rounded-2xl border border-[#EBE3D7] w-fit">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="#C5A267" stroke="#C5A267" />
                ))}
              </div>
              <span className="text-xs font-bold text-[#2A2623]">4.9</span>
              <span className="text-[11px] text-[#7B6D63] font-medium border-l border-[#EBE3D7] pl-3">
                142 Verified Reviews
              </span>
            </div>

            {/* Pricing Section */}
            <div className="bg-[#FFFDF9] p-6 rounded-3xl border border-[#EBE3D7] space-y-3 shadow-sm">
              <div className="flex items-baseline gap-4">
                <span className="font-sans font-bold text-3xl sm:text-4xl text-[#222222]">
                  ₹{Number(product.price).toLocaleString()}
                </span>
                {product.original_price > product.price && (
                  <span className="font-sans font-semibold text-base sm:text-lg text-[#7B6D63]/60 line-through">
                    ₹{Number(product.original_price).toLocaleString()}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="bg-[#7A0E2E]/10 text-[#7A0E2E] text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>
              <p className="text-xs text-[#7B6D63] font-sans">
                Price inclusive of all taxes. Free insured delivery across India.
              </p>
              
              {/* EMI Micro-Info */}
              <div className="pt-2 flex items-center gap-2 text-xs text-[#7B6D63] border-t border-[#EBE3D7]/60">
                <Clock size={13} className="text-[#B58E58]" />
                <span>Or 3 interest-free payments of <strong>₹{Math.round(product.price / 3).toLocaleString()}</strong></span>
              </div>
            </div>

            {/* Interactive Quantity & Add to Cart */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7B6D63]">Quantity</span>
                <div className="flex items-center border border-[#EBE3D7] rounded-xl bg-[#FFFDF9] overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-[#2A2623] hover:bg-[#F3ECE1] transition-colors text-base font-medium cursor-pointer"
                  >
                    −
                  </button>
                  <span className="w-12 text-center font-bold text-sm text-[#2A2623]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(Math.min(10, Number(product.stock || 10)), quantity + 1))}
                    className="w-10 h-10 flex items-center justify-center text-[#2A2623] hover:bg-[#F3ECE1] transition-colors text-base font-medium cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Gift Wrap Toggle */}
              <label className="flex items-center justify-between p-3.5 bg-[#FFFDF9] rounded-2xl border border-[#EBE3D7] cursor-pointer hover:border-[#B58E58] transition-all">
                <div className="flex items-center gap-3">
                  <Gift size={18} className="text-[#7A0E2E]" />
                  <div>
                    <p className="text-xs font-bold text-[#2A2623] uppercase tracking-wider">Add Signature Velvet Gift Packaging</p>
                    <p className="text-[10px] text-[#7B6D63]">Includes complimentary satin ribbon & handwritten wax-sealed gift note.</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={giftWrap}
                  onChange={(e) => setGiftWrap(e.target.checked)}
                  className="w-4 h-4 accent-[#7A0E2E] cursor-pointer"
                />
              </label>

              {/* Main Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0 || cartLoading}
                  className={`w-full sm:flex-1 min-h-[58px] py-4 px-6 text-sm font-bold uppercase tracking-[0.2em] rounded-2xl transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer shadow-md ${
                    product.stock <= 0
                      ? 'bg-[#EAE6E1] text-[#8C857E] border border-[#D8D2C9] cursor-not-allowed'
                      : isInCart(product.id)
                      ? 'bg-[#7A0E2E] text-white hover:bg-[#5E0B24]'
                      : 'bg-[#2A2623] text-white hover:bg-[#7A0E2E]'
                  }`}
                >
                  {cartLoading ? <Loader2 size={18} className="animate-spin" /> : <ShoppingBag size={18} />}
                  {product.stock <= 0 ? 'Out of Stock' : isInCart(product.id) ? 'Added to Bag' : 'Add to Shopping Bag'}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className={`w-full sm:flex-1 min-h-[58px] py-4 px-6 text-sm font-bold uppercase tracking-[0.2em] rounded-2xl transition-all duration-300 flex items-center justify-center cursor-pointer shadow-md ${
                    product.stock <= 0
                      ? 'bg-[#F5F2ED] border border-[#E2DDD4] text-[#A29A90] cursor-not-allowed'
                      : 'border-2 border-[#7A0E2E] text-[#7A0E2E] hover:bg-[#7A0E2E] hover:text-white'
                  }`}
                >
                  Buy Now
                </button>
              </div>
            </div>

            {/* Pincode Delivery Checker - Only show if in stock */}
            {product.stock > 0 && (
              <div className="bg-[#FFFDF9] p-4 rounded-2xl border border-[#EBE3D7] space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#2A2623] flex items-center gap-2">
                  <Truck size={15} className="text-[#B58E58]" /> Check Delivery Estimate
                </label>
                <form onSubmit={checkDeliveryPincode} className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit Pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="flex-1 px-4 py-2 bg-[#FAF7F2] border border-[#EBE3D7] rounded-xl text-xs outline-none focus:border-[#7A0E2E]"
                  />
                  <button type="submit" className="px-5 py-2 bg-[#2A2623] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#7A0E2E] transition-colors cursor-pointer">
                    Check
                  </button>
                </form>
                {pincodeStatus && (
                  <p className={`text-xs mt-1 ${pincodeStatus.success ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {pincodeStatus.msg}
                  </p>
                )}
              </div>
            )}

            {/* Accordion Tabs */}
            <div className="space-y-2 pt-4">
              {[
                { 
                  id: 'details', 
                  label: 'Product Details & Specs',
                  content: (
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-[#7B6D63] block font-medium">SKU / Code</span>
                        <span className="font-bold text-[#2A2623] uppercase">{product.sku || product.id.slice(0, 8)}</span>
                      </div>
                      <div>
                        <span className="text-[#7B6D63] block font-medium">Base Material</span>
                        <span className="font-bold text-[#2A2623]">18K Solid Gold Base / Premium Alloy</span>
                      </div>
                      <div>
                        <span className="text-[#7B6D63] block font-medium">Gemstone Type</span>
                        <span className="font-bold text-[#2A2623]">Hand-Cut AAA Zirconia / Crystals</span>
                      </div>
                      <div>
                        <span className="text-[#7B6D63] block font-medium">Finish</span>
                        <span className="font-bold text-[#2A2623]">High-Lustre Anti-Tarnish Coating</span>
                      </div>
                    </div>
                  )
                },
                { 
                  id: 'craftsmanship', 
                  label: 'Artisanal Craftsmanship',
                  content: (
                    <p className="text-xs text-[#7B6D63] leading-relaxed">
                      Every piece is handcrafted by master artisans using traditional lost-wax casting methods combined with modern high-precision gemstone setting techniques. Each gem is manually inspected to ensure unmatched optical brilliance and color saturation.
                    </p>
                  )
                },
                { 
                  id: 'care', 
                  label: 'Jewellery Care Guide',
                  content: (
                    <ul className="space-y-2 text-xs text-[#7B6D63]">
                      <li className="flex items-center gap-2"><Sparkles size={12} className="text-[#B58E58]" /> Store in a dry, velvet-lined box or pouch.</li>
                      <li className="flex items-center gap-2"><Sparkles size={12} className="text-[#B58E58]" /> Apply perfumes and lotions before putting on jewellery.</li>
                      <li className="flex items-center gap-2"><Sparkles size={12} className="text-[#B58E58]" /> Clean gently using a soft microfiber polishing cloth.</li>
                    </ul>
                  )
                }
              ].map((tab) => (
                <div key={tab.id} className="bg-[#FFFDF9] border border-[#EBE3D7] rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setActiveTab(activeTab === tab.id ? '' : tab.id)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left cursor-pointer"
                  >
                    <span className="text-xs font-bold uppercase tracking-wider text-[#2A2623]">{tab.label}</span>
                    <ChevronRight size={16} className={`text-[#B58E58] transition-transform duration-300 ${activeTab === tab.id ? 'rotate-90' : ''}`} />
                  </button>
                  {activeTab === tab.id && (
                    <div className="px-5 pb-5 pt-1 border-t border-[#EBE3D7]/40">
                      {tab.content}
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* You May Also Like / Complete The Look Carousel Grid */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-12 border-t border-[#EBE3D7]">
            <div className="text-center mb-10">
              <span className="text-xs uppercase tracking-[0.3em] text-[#B58E58] font-bold">Curated Complements</span>
              <h3 className="font-serif text-3xl font-light text-[#222222] mt-1">Complete The Look</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <div 
                  key={rel.id}
                  onClick={() => navigate(`/product/${rel.id}`)}
                  className="group bg-[#FFFDF9] rounded-2xl border border-[#EBE3D7] overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="aspect-square bg-[#F3ECE1] overflow-hidden relative">
                    <img 
                      src={rel.image || rel.images?.[0]} 
                      alt={rel.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                  <div className="p-4 space-y-1 text-center">
                    <h4 className="font-serif text-base font-bold text-[#2A2623] truncate">{rel.name}</h4>
                    <p className="text-xs font-bold text-[#7A0E2E]">₹{Number(rel.price).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Image Preview Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <button 
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 text-white text-sm font-bold bg-white/10 p-3 rounded-full hover:bg-white/20 cursor-pointer"
            >
              ✕ Close
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={activeImage}
              alt={product.name}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
            />
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Floating Sticky Bar for Ultra-Premium Mobile UX */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-t border-[#EBE3D7] p-3 px-4 shadow-[0_-5px_25px_rgba(0,0,0,0.08)] flex items-center gap-2.5">
        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0 || cartLoading}
          className={`flex-1 min-h-[50px] py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            product.stock <= 0
              ? 'bg-[#EAE6E1] text-[#8C857E] border border-[#D8D2C9] cursor-not-allowed'
              : isInCart(product.id)
              ? 'bg-[#7A0E2E] text-white'
              : 'bg-[#2A2623] text-white'
          }`}
        >
          {cartLoading ? <Loader2 size={16} className="animate-spin" /> : <ShoppingBag size={16} />}
          {product.stock <= 0 ? 'Out of Stock' : isInCart(product.id) ? 'In Bag' : 'Add to Bag'}
        </button>

        <button
          onClick={handleBuyNow}
          disabled={product.stock <= 0}
          className={`flex-1 min-h-[50px] py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center cursor-pointer ${
            product.stock <= 0
              ? 'bg-[#F5F2ED] border border-[#E2DDD4] text-[#A29A90] cursor-not-allowed'
              : 'border-2 border-[#7A0E2E] text-[#7A0E2E] bg-white'
          }`}
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