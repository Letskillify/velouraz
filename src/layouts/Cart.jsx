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

  const handleSaveGiftNote = () => {
    setSavedGiftNote(giftNoteText);
    setShowGiftNote(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#C8A46A]"></div>
      </div>
    );
  }

  const total = subtotal;

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-[#2A2623]">
      
      {/* Hero Breadcrumb */}
      <Breadcrumb 
        title="Shopping Cart"
        subtitle="Review your curated high-jewellery items before checkout"
        bgImage="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1600"
        links={[
          { name: 'Home', href: '/' },
          { name: 'Shop', href: '/shop' },
          { name: 'Cart', href: '/cart', active: true }
        ]}
      />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 py-10 pb-24">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#E8DFD5]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif text-[#2e0e43] font-normal tracking-tight flex items-center gap-3">
              Your Selection 
              <span className="text-xs sm:text-sm font-sans font-normal text-[#C8A46A] bg-[#FAF6F0] border border-[#C8A46A]/30 px-3 py-1 rounded-full tracking-wider uppercase">
                {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
              </span>
            </h1>
            <p className="text-sm text-[#7B6D63] mt-1 font-serif">
              Handcrafted elegance, tailored for your collection
            </p>
          </div>

          <Link 
            to="/shop" 
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#2e0e43] hover:text-[#C8A46A] transition-colors duration-300 group"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
            Continue Shopping
          </Link>
        </div>

        {items.length === 0 ? (
          /* Empty Cart State */
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-20 px-6 rounded-3xl bg-white border border-[#E8DFD5] shadow-sm text-center max-w-xl mx-auto"
          >
            <div className="w-20 h-20 rounded-full bg-[#FAF6F0] border border-[#C8A46A]/40 flex items-center justify-center mx-auto mb-6 shadow-inner">
              <ShoppingBag size={32} className="text-[#C8A46A]" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#2e0e43] mb-3 font-normal">Your cart is empty</h2>
            <p className="text-sm sm:text-base text-[#7B6D63] mb-8 leading-relaxed max-w-md mx-auto font-serif">
              Your personal high-jewellery bag is waiting. Discover our bespoke collections and curate your style.
            </p>
            <Link 
              to="/shop" 
              className="inline-flex items-center justify-center gap-2 bg-[#2e0e43] text-white px-8 py-4 rounded-xl text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#C8A46A] transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Explore Collection
              <ArrowRight size={15} />
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
                  {items.map((item) => {
                    const unitPrice = Number(item.price);
                    const originalPrice = Number(item.original_price || item.price);
                    const itemSavings = originalPrice > unitPrice ? (originalPrice - unitPrice) * (item.quantity || 1) : 0;
                    
                    return (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        key={item.id}
                        className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E8DFD5] shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-[#C8A46A]/50 transition-all duration-300 relative overflow-hidden"
                      >
                        {/* Top subtle golden gradient line on item hover */}
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C8A46A]/40 to-transparent opacity-0 hover:opacity-100 transition-opacity" />

                        <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                          
                          {/* Product Image */}
                          <Link 
                            to={`/product/${item.id}`}
                            className="w-24 h-28 sm:w-28 sm:h-32 rounded-xl overflow-hidden bg-[#FAF6F0] flex-shrink-0 border border-[#E8DFD5] group relative"
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
                              <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.25em] text-[#C8A46A] block mb-1">
                                Velouraz High Jewellery
                              </span>
                              <Link 
                                to={`/product/${item.id}`} 
                                className="text-base sm:text-lg font-serif text-[#2e0e43] hover:text-[#C8A46A] transition-colors leading-snug font-normal line-clamp-2 block"
                              >
                                {item.name}
                              </Link>
                            </div>

                            {/* Variant / Size info if present */}
                            {(item.size || item.metal || item.color) && (
                              <p className="text-xs text-[#7B6D63] font-sans flex items-center gap-3">
                                {item.size && <span>Size: <strong className="text-[#2A2623] font-normal">{item.size}</strong></span>}
                                {item.metal && <span>Metal: <strong className="text-[#2A2623] font-normal">{item.metal}</strong></span>}
                              </p>
                            )}

                            {/* Price Tag - ALL PRICES FONT NORMAL */}
                            <div className="flex items-baseline gap-3 pt-1">
                              <span className="text-lg font-normal text-[#2e0e43] font-sans tracking-tight">
                                ₹{unitPrice.toLocaleString()}
                              </span>
                              {originalPrice > unitPrice && (
                                <span className="text-xs font-normal text-[#7B6D63]/60 line-through font-sans">
                                  ₹{originalPrice.toLocaleString()}
                                </span>
                              )}
                              {itemSavings > 0 && (
                                <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/50 font-sans">
                                  Save ₹{itemSavings.toLocaleString()}
                                </span>
                              )}
                            </div>

                            {/* Controls Row: Quantity Selector & Remove Button */}
                            <div className="flex items-center justify-between pt-3 border-t border-[#F5EFE8]">
                              
                              {/* Quantity Selector */}
                              <div className="flex items-center border border-[#E8DFD5] rounded-xl overflow-hidden bg-[#FAF6F0]/60">
                                <button
                                  onClick={() => updateCartQuantity(item.id, (item.quantity || 1) - 1)}
                                  className="w-9 h-9 flex items-center justify-center text-[#2A2623] hover:bg-[#E8DFD5] active:bg-[#D8CBBE] transition-colors"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus size={13} />
                                </button>
                                <span className="w-9 text-center font-normal text-[#2A2623] text-sm font-sans">
                                  {item.quantity || 1}
                                </span>
                                <button 
                                  onClick={() => updateCartQuantity(item.id, (item.quantity || 1) + 1)}
                                  disabled={(item.quantity || 1) >= Math.min(10, liveStocks[item.id] ?? item.stock ?? 1)}
                                  className="w-9 h-9 flex items-center justify-center text-[#2A2623] hover:bg-[#E8DFD5] active:bg-[#D8CBBE] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                  aria-label="Increase quantity"
                                >
                                  <Plus size={13} />
                                </button>
                              </div>

                              {/* Remove Button */}
                              <button 
                                onClick={() => removeItem(item.id)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-[#7B6D63] hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all duration-300 font-sans font-normal"
                              >
                                <Trash2 size={15} />
                                <span>Remove</span>
                              </button>

                            </div>

                          </div>

                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Trust Highlights Suite Card */}
              <div className="p-6 rounded-2xl bg-white border border-[#E8DFD5] shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
                  
                  {/* Secure Checkout */}
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-[#FAF6F0] border border-[#C8A46A]/30 flex items-center justify-center text-[#C8A46A] shrink-0 shadow-inner">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#2A2623] font-sans">100% Certified</h4>
                      <p className="text-xs text-[#7B6D63] font-serif">Hallmarked & Authenticated</p>
                    </div>
                  </div>

                  {/* Free Shipping */}
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-[#FAF6F0] border border-[#C8A46A]/30 flex items-center justify-center text-[#C8A46A] shrink-0 shadow-inner">
                      <Truck size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#2A2623] font-sans">Insured Shipping</h4>
                      <p className="text-xs text-[#7B6D63] font-serif">Complimentary door delivery</p>
                    </div>
                  </div>

                  {/* Easy Returns */}
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-[#FAF6F0] border border-[#C8A46A]/30 flex items-center justify-center text-[#C8A46A] shrink-0 shadow-inner">
                      <RefreshCw size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#2A2623] font-sans">7–10 Day Returns</h4>
                      <p className="text-xs text-[#7B6D63] font-serif">Hassle-free return policy</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Assurance Banner Card ("Love it or return it") */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-[#FAF6F0] to-[#F5EFE8] border border-[#C8A46A]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#2e0e43]/5 border border-[#2e0e43]/15 flex items-center justify-center text-[#2e0e43] shrink-0">
                    <Tag size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-[#2e0e43] font-serif">Love it or return it</h4>
                    <p className="text-xs text-[#7B6D63] font-serif">Easy 7–10 day returns. Refund processed upon inspection.</p>
                  </div>
                </div>

                <Link 
                  to="/return-policy" 
                  className="inline-flex items-center gap-1 text-xs uppercase tracking-wider font-semibold text-[#2e0e43] hover:text-[#C8A46A] transition-colors shrink-0 font-sans"
                >
                  Policy details <ArrowRight size={14} />
                </Link>
              </div>

            </div>

            {/* Right Column: Price Details & Order Summary Card */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="lg:sticky lg:top-24 bg-white rounded-2xl border border-[#E8DFD5] border-t-2 border-t-[#C8A46A] shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
                
                {/* Header */}
                <div className="px-6 py-4 border-b border-[#E8DFD5] bg-[#FAF6F0]/80 backdrop-blur-sm flex items-center justify-between">
                  <h2 className="text-xs font-semibold text-[#2e0e43] uppercase tracking-[0.25em] font-sans flex items-center gap-2">
                    <Sparkles size={14} className="text-[#C8A46A]" />
                    ORDER SUMMARY
                  </h2>
                  <span className="text-xs font-serif text-[#7B6D63]">
                    {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
                  </span>
                </div>

                <div className="p-6 space-y-5">
                  
                  {/* Line Items - ALL PRICES FONT NORMAL */}
                  <div className="space-y-3.5 text-sm font-sans">
                    
                    {/* Price Subtotal */}
                    <div className="flex justify-between items-center text-[#7B6D63]">
                      <span className="font-sans">Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                      <span className="font-normal text-[#2A2623] font-sans text-base">₹{originalTotal.toLocaleString()}</span>
                    </div>

                    {/* Product Savings / Discount */}
                    {productSavings > 0 ? (
                      <div className="flex justify-between items-center text-emerald-700">
                        <span className="font-sans">Bespoke Discount</span>
                        <span className="font-normal font-sans text-base">−₹{productSavings.toLocaleString()}</span>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center text-[#7B6D63]">
                        <span className="font-sans">Discount</span>
                        <span className="font-normal font-sans text-base">—</span>
                      </div>
                    )}

                    {/* Delivery Charges */}
                    <div className="flex justify-between items-center text-[#7B6D63]">
                      <span className="font-sans">Insured Delivery</span>
                      <span className="font-semibold text-emerald-700 text-xs uppercase tracking-wider">COMPLIMENTARY</span>
                    </div>

                    {/* GST Included */}
                    <div className="flex justify-between items-center text-[#7B6D63]">
                      <span className="font-sans">Estimated GST (Included)</span>
                      <span className="font-normal text-[#2A2623] font-sans text-base">₹0</span>
                    </div>

                  </div>

                  {/* Savings Banner Highlight if saving money */}
                  {productSavings > 0 && (
                    <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/60 text-emerald-800 text-xs font-sans flex items-center justify-between">
                      <span className="font-medium">Total Savings on this order</span>
                      <span className="font-normal font-sans text-sm">₹{productSavings.toLocaleString()}</span>
                    </div>
                  )}

                  {/* Total Box Divider & Content - TOTAL PRICE FONT NORMAL / LESS BOLD */}
                  <div className="p-4 rounded-xl bg-[#FAF6F0] border border-[#C8A46A]/20 space-y-1">
                    <div className="flex justify-between items-baseline">
                      <span className="text-sm font-medium text-[#2A2623] font-sans">Total Amount</span>
                      <span className="text-2xl sm:text-3xl font-normal font-sans text-[#2e0e43] tracking-tight">
                        ₹{total.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#7B6D63] font-serif text-right">
                      Inclusive of all applicable taxes
                    </p>
                  </div>

                  {/* Gift Note Section */}
                  <div className="pt-1">
                    {!showGiftNote ? (
                      <button 
                        onClick={() => setShowGiftNote(true)}
                        className="w-full flex items-center justify-between text-xs font-sans text-[#7B6D63] hover:text-[#2e0e43] transition-colors py-2 border-t border-b border-[#F5EFE8]"
                      >
                        <span className="flex items-center gap-2">
                          <Gift size={15} className="text-[#C8A46A]" />
                          {savedGiftNote ? 'Edit Complimentary Gift Message' : 'Add Complimentary Gift Message'}
                        </span>
                        <ChevronRight size={15} />
                      </button>
                    ) : (
                      <div className="space-y-3 bg-[#FAF6F0] p-4 rounded-xl border border-[#C8A46A]/30">
                        <p className="text-xs font-semibold uppercase tracking-wider text-[#2A2623] flex items-center gap-2">
                          <Gift size={15} className="text-[#C8A46A]" />
                          Complimentary Gift Message
                        </p>
                        <textarea
                          rows={3}
                          placeholder="Write your special message for the recipient..."
                          value={giftNoteText}
                          onChange={(e) => setGiftNoteText(e.target.value)}
                          className="w-full border border-[#E8DFD5] rounded-lg p-2.5 text-xs text-[#2A2623] bg-white outline-none focus:border-[#C8A46A] resize-none"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setShowGiftNote(false)}
                            className="px-3 py-1.5 text-xs text-[#7B6D63] hover:text-[#2A2623]"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveGiftNote}
                            className="px-4 py-1.5 rounded-lg bg-[#2e0e43] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#C8A46A] transition-colors"
                          >
                            Save Note
                          </button>
                        </div>
                      </div>
                    )}
                    {savedGiftNote && !showGiftNote && (
                      <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 p-2.5 rounded-lg mt-2 font-serif italic">
                        "{savedGiftNote}"
                      </p>
                    )}
                  </div>

                  {/* Primary Checkout Action Button */}
                  <button 
                    onClick={() => {
                      navigate("/checkout");
                    }}
                    disabled={items.length === 0}
                    className="w-full bg-[#2e0e43] text-white py-4 px-6 rounded-xl text-xs font-semibold uppercase tracking-[0.25em] hover:bg-[#1A0829] active:scale-[0.99] transition-all duration-300 shadow-md hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 group cursor-pointer"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform shrink-0 text-[#C8A46A]" />
                  </button>

                  {/* Safe & Secure Sub-caption */}
                  <div className="flex items-center justify-center gap-2 text-xs text-[#7B6D63] pt-1 font-serif">
                    <Lock size={14} className="text-[#C8A46A]" />
                    <span>256-Bit SSL Encrypted • Safe & Secure</span>
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