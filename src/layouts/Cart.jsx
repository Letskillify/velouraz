import React, { useEffect, useState } from "react";
import { db } from "../components/Firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { 
  ShoppingBag, 
  Trash2, 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  Minus, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Tag, 
  ChevronRight, 
  Gift, 
  Lock, 
  RefreshCw, 
  ArrowRight,
  Sparkles
} from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";
import { useStore } from "../hooks/useStore";
import { useAuth } from "../components/useAuth";
import { motion, AnimatePresence } from "framer-motion";

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, updateCartQuantity, removeFromCart } = useStore();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liveStocks, setLiveStocks] = useState({});
  
  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponError, setCouponError] = useState("");
  const [showCoupon, setShowCoupon] = useState(false);

  // Gift note state
  const [showGiftNote, setShowGiftNote] = useState(false);
  const [giftNoteText, setGiftNoteText] = useState("");
  const [savedGiftNote, setSavedGiftNote] = useState("");

  useEffect(() => {
    setItems(cartItems);

    if (cartItems.length === 0) {
      setLoading(false);
      setLiveStocks({});
      return undefined;
    }

    const unsubs = [];
    cartItems.forEach((item) => {
      if (!item.id || item.id.startsWith('bs-')) return;
      const pRef = doc(db, "products", item.id);
      const unsub = onSnapshot(pRef, async (snap) => {
        if (snap.exists()) {
          const actualStock = Number(snap.data().stock || 0);
          setLiveStocks((prev) => ({ ...prev, [item.id]: actualStock }));
          if (actualStock <= 0) {
            await removeFromCart(item.id);
          } else if (item.quantity > actualStock) {
            await updateCartQuantity(item.id, actualStock);
          }
        }
      }, (err) => {
        console.error("Live stock subscription error for item", item.id, err);
      });
      unsubs.push(unsub);
    });

    setLoading(false);

    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  }, [cartItems, updateCartQuantity, removeFromCart]);

  const removeItem = async (id) => {
    await removeFromCart(id);
  };

  const subtotal = items.reduce((sum, i) => sum + (Number(i.price) * (i.quantity || 1)), 0);
  const originalTotal = items.reduce((sum, i) => sum + (Number(i.original_price || i.price) * (i.quantity || 1)), 0);
  const productSavings = originalTotal - subtotal;
  const itemCount = items.reduce((sum, i) => sum + (i.quantity || 1), 0);

  const handleApplyCoupon = () => {
    setCouponError("");
    const code = couponCode.toUpperCase().trim();
    
    if (code === "VELOURAZ10") {
      setDiscount(subtotal * 0.1);
      setAppliedCoupon(code);
    } else if (code === "WELCOME20") {
      setDiscount(subtotal * 0.2);
      setAppliedCoupon(code);
    } else if (code === "GIFT500") {
      setDiscount(Math.min(500, subtotal));
      setAppliedCoupon(code);
    } else {
      setCouponError("Invalid coupon code");
      setDiscount(0);
      setAppliedCoupon("");
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon("");
    setDiscount(0);
    setCouponCode("");
  };

  const handleSaveGiftNote = () => {
    setSavedGiftNote(giftNoteText);
    setShowGiftNote(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F4EF] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#2e0e43]"></div>
      </div>
    );
  }

  const total = Math.max(0, subtotal - discount);

  return (
    <div className="min-h-screen bg-[#F8F4EF] font-sans text-[#2A2623]">
      
      {/* Hero Breadcrumb */}
      <Breadcrumb 
        title="My Cart"
        subtitle="Review your items before checkout"
        bgImage="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1600"
        links={[
          { name: 'Home', href: '/' },
          { name: 'Shop', href: '/shop' },
          { name: 'Cart', href: '/cart', active: true }
        ]}
      />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 py-10 pb-24">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#D8CBBE]/40">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif text-[#2e0e43] font-normal tracking-tight">
              My Cart <span className="text-lg sm:text-xl text-[#7B6D63] font-sans font-normal">({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
            </h1>
            <p className="text-sm text-[#7B6D63] mt-1 font-serif">
              Review your items before checkout
            </p>
          </div>

          <Link 
            to="/shop" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#2e0e43] hover:text-[#C8A46A] transition-colors duration-300 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Continue Shopping
          </Link>
        </div>

        {items.length === 0 ? (
          /* Empty Cart State */
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-20 px-6 rounded-3xl bg-white border border-[#D8CBBE]/40 shadow-sm text-center max-w-xl mx-auto"
          >
            <div className="w-20 h-20 rounded-full bg-[#F4EEE8] border border-[#C8A46A]/30 flex items-center justify-center mx-auto mb-6 shadow-inner">
              <ShoppingBag size={32} className="text-[#2e0e43]" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#2e0e43] mb-3">Your cart is empty</h2>
            <p className="text-sm sm:text-base text-[#7B6D63] mb-8 leading-relaxed max-w-md mx-auto">
              Your personal high-jewellery bag is waiting. Discover our bespoke collections and curate your style.
            </p>
            <Link 
              to="/shop" 
              className="inline-flex items-center justify-center gap-2 bg-[#2e0e43] text-white px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#1A0829] transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Explore Collection
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        ) : (
          /* Main 2-Column Cart Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            
            {/* Left Column: Cart Items + Trust Bar + Assurance Banner */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-6">
              
              {/* Item Cards List */}
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      key={item.id}
                      className="p-5 sm:p-6 rounded-2xl bg-white border border-[#D8CBBE]/50 shadow-sm hover:border-[#C8A46A]/50 transition-all duration-300"
                    >
                      <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                        
                        {/* Product Image */}
                        <Link 
                          to={`/product/${item.id}`}
                          className="w-24 h-28 sm:w-28 sm:h-32 rounded-xl overflow-hidden bg-[#F4EEE8] flex-shrink-0 border border-[#D8CBBE]/40 group relative"
                        >
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                        </Link>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0 space-y-2">
                          <div>
                            <span className="text-sm font-sans font-bold uppercase tracking-[0.22em] text-[#C8A46A] block mb-1">
                              Velouraz High Jewellery
                            </span>
                            <Link 
                              to={`/product/${item.id}`} 
                              className="text-base sm:text-lg font-serif text-[#2A2623] hover:text-[#2e0e43] transition-colors leading-snug font-medium line-clamp-2 block"
                            >
                              {item.name}
                            </Link>
                          </div>

                          {/* Variant / Size info if present */}
                          {(item.size || item.metal || item.color) && (
                            <p className="text-sm text-[#7B6D63] font-sans">
                              {item.size && <span>Size: <strong className="text-[#2A2623] font-semibold">{item.size}</strong></span>}
                              {item.metal && <span className="ml-3">Metal: <strong className="text-[#2A2623] font-semibold">{item.metal}</strong></span>}
                            </p>
                          )}

                          {/* Price Tag */}
                          <div className="flex items-baseline gap-3 pt-1">
                            <span className="text-lg font-bold text-[#2e0e43] font-sans tracking-tight">
                              ₹{Number(item.price).toLocaleString()}
                            </span>
                            {Number(item.original_price) > Number(item.price) && (
                              <span className="text-sm text-[#7B6D63]/60 line-through font-sans">
                                ₹{Number(item.original_price).toLocaleString()}
                              </span>
                            )}
                          </div>

                          {/* Controls Row: Quantity Selector & Remove Button */}
                          <div className="flex items-center justify-between pt-3 border-t border-[#F4EEE8]">
                            
                            {/* Quantity Selector */}
                            <div className="flex items-center border border-[#D8CBBE] rounded-xl overflow-hidden bg-[#FDFAF5]">
                              <button
                                onClick={() => updateCartQuantity(item.id, (item.quantity || 1) - 1)}
                                className="w-10 h-10 flex items-center justify-center text-[#2A2623] hover:bg-[#EFE6DC] active:bg-[#D8CBBE] transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="w-10 text-center font-bold text-[#2A2623] text-sm font-sans">
                                {item.quantity || 1}
                              </span>
                              <button 
                                onClick={() => updateCartQuantity(item.id, (item.quantity || 1) + 1)}
                                disabled={(item.quantity || 1) >= Math.min(10, liveStocks[item.id] ?? item.stock ?? 1)}
                                className="w-10 h-10 flex items-center justify-center text-[#2A2623] hover:bg-[#EFE6DC] active:bg-[#D8CBBE] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                aria-label="Increase quantity"
                              >
                                <Plus size={14} />
                              </button>
                            </div>

                            {/* Remove Button */}
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-[#7B6D63] hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all duration-300 font-sans font-medium"
                            >
                              <Trash2 size={16} />
                              <span>Remove</span>
                            </button>

                          </div>

                        </div>

                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Trust Highlights Suite Card (Reference Inspired) */}
              <div className="p-6 rounded-2xl bg-white border border-[#D8CBBE]/40 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
                  
                  {/* Secure Checkout */}
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#F4EEE8] border border-[#C8A46A]/30 flex items-center justify-center text-[#2e0e43] shrink-0 shadow-inner">
                      <ShieldCheck size={22} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#2A2623] font-sans">Secure Checkout</h4>
                      <p className="text-sm text-[#7B6D63] font-serif">256-bit SSL Encryption</p>
                    </div>
                  </div>

                  {/* Free Shipping */}
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#F4EEE8] border border-[#C8A46A]/30 flex items-center justify-center text-[#2e0e43] shrink-0 shadow-inner">
                      <Truck size={22} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#2A2623] font-sans">Free Shipping</h4>
                      <p className="text-sm text-[#7B6D63] font-serif">On orders ₹1,999+</p>
                    </div>
                  </div>

                  {/* Easy Returns */}
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#F4EEE8] border border-[#C8A46A]/30 flex items-center justify-center text-[#2e0e43] shrink-0 shadow-inner">
                      <RefreshCw size={22} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#2A2623] font-sans">Easy Returns</h4>
                      <p className="text-sm text-[#7B6D63] font-serif">7–10 day returns</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Assurance Banner Card (Reference Inspired: "Love it or return it") */}
              <div className="p-5 rounded-2xl bg-[#FDFAF5] border border-[#C8A46A]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#2e0e43]/5 border border-[#2e0e43]/20 flex items-center justify-center text-[#2e0e43] shrink-0">
                    <Tag size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#2A2623] font-sans">Love it or return it</h4>
                    <p className="text-sm text-[#7B6D63] font-serif">Easy 7–10 day returns. Refund after we receive product back.</p>
                  </div>
                </div>

                <Link 
                  to="/return-policy" 
                  className="inline-flex items-center gap-1 text-sm font-bold text-[#2e0e43] hover:text-[#C8A46A] transition-colors shrink-0 font-sans"
                >
                  Know More <ArrowRight size={15} />
                </Link>
              </div>

            </div>

            {/* Right Column: Price Details & Order Summary Card */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="lg:sticky lg:top-24 bg-white rounded-2xl border border-[#D8CBBE]/50 shadow-md overflow-hidden">
                
                {/* Header */}
                <div className="px-6 py-5 border-b border-[#D8CBBE]/30 bg-[#FDFAF5] flex items-center justify-between">
                  <h2 className="text-sm font-bold text-[#2e0e43] uppercase tracking-[0.2em] font-sans">
                    PRICE DETAILS
                  </h2>
                  <span className="text-sm font-serif text-[#7B6D63]">
                    {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
                  </span>
                </div>

                <div className="p-6 space-y-5">
                  
                  {/* Line Items */}
                  <div className="space-y-3.5 text-sm font-sans">
                    
                    {/* Price Subtotal */}
                    <div className="flex justify-between items-center text-[#7B6D63]">
                      <span>Price ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                      <span className="font-bold text-[#2A2623] font-sans text-base">₹{originalTotal.toLocaleString()}</span>
                    </div>

                    {/* Product Savings / Discount */}
                    {productSavings > 0 ? (
                      <div className="flex justify-between items-center text-emerald-700">
                        <span>Product Discount</span>
                        <span className="font-bold font-sans text-base">−₹{productSavings.toLocaleString()}</span>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center text-[#7B6D63]">
                        <span>Discount</span>
                        <span className="font-sans text-base">—</span>
                      </div>
                    )}

                    {/* Delivery Charges */}
                    <div className="flex justify-between items-center text-[#7B6D63]">
                      <span>Delivery Charges</span>
                      <span className="font-bold text-emerald-700 uppercase tracking-wider">FREE</span>
                    </div>

                    {/* GST Included */}
                    <div className="flex justify-between items-center text-[#7B6D63]">
                      <span>GST (Included)</span>
                      <span className="font-bold text-[#2A2623] font-sans text-base">₹0</span>
                    </div>

                    {/* Coupon Discount */}
                    {discount > 0 && (
                      <div className="flex justify-between items-center text-emerald-700 pt-1">
                        <span className="flex items-center gap-1 font-medium">
                          Coupon ({appliedCoupon})
                        </span>
                        <span className="font-bold font-sans text-base">−₹{discount.toLocaleString()}</span>
                      </div>
                    )}

                  </div>

                  {/* Divider */}
                  <div className="border-t border-[#D8CBBE]/40 pt-4">
                    <div className="flex justify-between items-baseline">
                      <span className="text-base font-bold text-[#2A2623] font-sans">Total Amount</span>
                      <span className="text-2xl sm:text-3xl font-bold font-sans text-[#2e0e43]">
                        ₹{total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Coupon Code Section */}
                  <div className="pt-2 border-t border-[#F4EEE8]">
                    {!showCoupon && !appliedCoupon ? (
                      <button 
                        onClick={() => setShowCoupon(true)}
                        className="w-full flex items-center justify-between p-3 rounded-xl border border-dashed border-[#C8A46A]/60 bg-[#FDFAF5] hover:bg-[#F4EEE8] transition-colors text-sm font-bold text-[#2e0e43] font-sans"
                      >
                        <span className="flex items-center gap-2">
                          <Tag size={16} className="text-[#C8A46A]" />
                          Apply Coupon Code
                        </span>
                        <ChevronRight size={16} className="text-[#7B6D63]" />
                      </button>
                    ) : !appliedCoupon ? (
                      <div className="space-y-2 bg-[#FDFAF5] p-3 rounded-xl border border-[#D8CBBE]">
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="Enter code (e.g. VELOURAZ10)" 
                            className="flex-1 border border-[#D8CBBE] rounded-lg px-3 py-2 text-sm font-bold tracking-wider text-[#2A2623] outline-none focus:border-[#2e0e43] uppercase placeholder:normal-case placeholder:font-normal placeholder:text-[#7B6D63]/50 bg-white"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                          />
                          <button 
                            onClick={handleApplyCoupon}
                            className="bg-[#2e0e43] text-white px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-[#1A0829] transition-colors shrink-0"
                          >
                            Apply
                          </button>
                        </div>
                        {couponError && (
                          <p className="text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle size={14} /> {couponError}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-emerald-700" />
                          <span className="text-sm font-bold text-emerald-800 uppercase tracking-wider">
                            {appliedCoupon}
                          </span>
                        </div>
                        <button 
                          onClick={removeCoupon} 
                          className="text-sm font-bold text-red-600 hover:text-red-800 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Gift Note Section (Reference Feature: "Add a Gift Note") */}
                  <div className="pt-2 border-t border-[#F4EEE8]">
                    {!showGiftNote ? (
                      <button 
                        onClick={() => setShowGiftNote(true)}
                        className="w-full flex items-center justify-between text-sm font-medium text-[#7B6D63] hover:text-[#2e0e43] transition-colors py-1"
                      >
                        <span className="flex items-center gap-2">
                          <Gift size={16} className="text-[#C8A46A]" />
                          {savedGiftNote ? 'Edit Gift Note' : 'Add a Gift Note'}
                        </span>
                        <ChevronRight size={16} />
                      </button>
                    ) : (
                      <div className="space-y-3 bg-[#FDFAF5] p-3 rounded-xl border border-[#D8CBBE]">
                        <p className="text-sm font-semibold text-[#2A2623] flex items-center gap-1.5">
                          <Gift size={15} className="text-[#C8A46A]" />
                          Complimentary Gift Card Message
                        </p>
                        <textarea
                          rows={3}
                          placeholder="Write your special message for the recipient..."
                          value={giftNoteText}
                          onChange={(e) => setGiftNoteText(e.target.value)}
                          className="w-full border border-[#D8CBBE] rounded-lg p-2.5 text-sm text-[#2A2623] bg-white outline-none focus:border-[#2e0e43] resize-none"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setShowGiftNote(false)}
                            className="px-3 py-1.5 text-sm text-[#7B6D63] hover:text-[#2A2623]"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveGiftNote}
                            className="px-4 py-1.5 rounded-lg bg-[#2e0e43] text-white text-sm font-semibold hover:bg-[#1A0829]"
                          >
                            Save Note
                          </button>
                        </div>
                      </div>
                    )}
                    {savedGiftNote && !showGiftNote && (
                      <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 p-2 rounded-lg mt-2 italic">
                        "{savedGiftNote}"
                      </p>
                    )}
                  </div>

                  {/* Primary Checkout Action Button */}
                  <button 
                    onClick={() => {
                      if (!user) {
                        navigate("/login", { state: { from: "/checkout" } });
                      } else {
                        navigate("/checkout");
                      }
                    }}
                    disabled={items.length === 0}
                    className="w-full bg-[#2e0e43] text-white py-4 px-6 rounded-xl text-sm font-bold uppercase tracking-[0.22em] hover:bg-[#1A0829] active:scale-[0.99] transition-all duration-300 shadow-md hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 group cursor-pointer"
                  >
                    <span>PLACE ORDER</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform shrink-0" />
                  </button>

                  {/* Safe & Secure Sub-caption */}
                  <div className="flex items-center justify-center gap-2 text-sm text-[#7B6D63] pt-1">
                    <Lock size={15} className="text-[#C8A46A]" />
                    <span className="font-serif">Safe & Secure Payments</span>
                  </div>

                </div>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Cart;
