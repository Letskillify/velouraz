import React, { useEffect, useState } from "react";
import { db } from "../components/Firebase";
import { doc, getDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Trash2, ArrowLeft, ShieldCheck, Truck, Minus, Plus, CheckCircle2, AlertCircle, Tag, ChevronRight, Gift, Sparkles } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";
import { useStore } from "../hooks/useStore";
import { motion, AnimatePresence } from "framer-motion";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, updateCartQuantity, removeFromCart } = useStore();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liveStocks, setLiveStocks] = useState({});
  
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponError, setCouponError] = useState("");
  const [showCoupon, setShowCoupon] = useState(false);

  useEffect(() => {
    setItems(cartItems);
    
    const validateStock = async () => {
      if (cartItems.length === 0) return;
      
      const newLiveStocks = {};
      for (const item of cartItems) {
        try {
          if (!item.id || item.id.startsWith('bs-')) continue;
          const pRef = doc(db, "products", item.id);
          const pSnap = await getDoc(pRef);
          
          if (pSnap.exists()) {
            const actualStock = Number(pSnap.data().stock || 0);
            newLiveStocks[item.id] = actualStock;
            if (actualStock <= 0) {
              await removeFromCart(item.id);
            } else if (item.quantity > actualStock) {
              await updateCartQuantity(item.id, actualStock);
            }
          }
        } catch (e) {
          console.error("Stock validation error:", e);
        }
      }
      setLiveStocks(newLiveStocks);
    };

    if (cartItems.length > 0) {
      validateStock();
    }
    
    setLoading(false);
  }, [cartItems, updateCartQuantity, removeFromCart]);

  const removeItem = async (id) => {
    await removeFromCart(id);
  };

  const subtotal = items.reduce((sum, i) => sum + (Number(i.price) * (i.quantity || 1)), 0);
  const originalTotal = items.reduce((sum, i) => sum + (Number(i.original_price || i.price) * (i.quantity || 1)), 0);
  const productSavings = originalTotal - subtotal;

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFAF5] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-[1.5px] border-[#7A0E2E]"></div>
      </div>
    );
  }

  const total = Math.max(0, subtotal - discount);

  return (
    <div className="min-h-screen bg-[#FDFAF5] font-sans text-[#2A2623]">
      
      {/* Hero Breadcrumb */}
      <Breadcrumb 
        title="Shopping Cart"
        subtitle={`${items.length} ${items.length === 1 ? 'item' : 'items'} in your collection`}
        bgImage="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1600"
        links={[
          { name: 'Home', href: '/' },
          { name: 'Shop', href: '/shop' },
          { name: 'Cart', href: '/cart', active: true }
        ]}
      />

      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-8 pb-20">
        
        {/* Continue Shopping Link */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-[13px] text-[#7B6D63]">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
          <Link 
            to="/shop" 
            className="inline-flex items-center gap-2 text-[12px] font-bold text-[#7A0E2E] hover:text-[#2A2623] transition-colors"
          >
            <ArrowLeft size={14} />
            Continue Shopping
          </Link>
        </div>

        {items.length === 0 ? (
          /* Empty Cart */
          <div className="py-24 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-[#F4EEE8] flex items-center justify-center mb-6">
              <ShoppingBag size={32} strokeWidth={1} className="text-[#7A0E2E]/40" />
            </div>
            <h2 className="font-serif text-2xl text-[#2A2623] mb-2">Your cart is empty</h2>
            <p className="text-[14px] text-[#7B6D63] mb-8 max-w-sm">Looks like you haven't added any pieces to your collection yet.</p>
            <Link 
              to="/shop" 
              className="bg-[#2A2623] text-white px-8 py-3.5 rounded-xl text-[14px] font-bold uppercase tracking-[0.2em] hover:bg-[#7A0E2E] transition-all duration-500"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10">
            
            {/* Cart Items */}
            <div className="flex-1 min-w-0">
              {/* Table Header - Desktop */}
              <div className="hidden sm:grid grid-cols-[1fr_120px_120px_40px] gap-6 pb-4 border-b border-[#D8CBBE]/40 mb-0">
                <span className="text-[14px] font-bold uppercase tracking-[0.2em] text-[#7B6D63]">Product</span>
                <span className="text-[14px] font-bold uppercase tracking-[0.2em] text-[#7B6D63] text-center">Quantity</span>
                <span className="text-[14px] font-bold uppercase tracking-[0.2em] text-[#7B6D63] text-right">Total</span>
                <span></span>
              </div>

              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    key={item.id}
                    className="grid grid-cols-1 sm:grid-cols-[1fr_120px_120px_40px] gap-4 sm:gap-6 items-center py-6 border-b border-[#D8CBBE]/20"
                  >
                    {/* Product Info */}
                    <div className="flex items-center gap-4">
                      <Link 
                        to={`/product/${item.id}`}
                        className="w-20 h-24 sm:w-[72px] sm:h-[90px] rounded-lg overflow-hidden bg-[#F4EEE8] flex-shrink-0 border border-[#D8CBBE]/30 hover:border-[#7A0E2E]/30 transition-colors"
                      >
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </Link>
                      <div className="min-w-0">
                        <p className="text-[9px] font-bold text-[#7A0E2E] uppercase tracking-[0.3em] mb-1">Velouraz</p>
                        <Link to={`/product/${item.id}`} className="text-[15px] font-serif text-[#2A2623] hover:text-[#7A0E2E] transition-colors line-clamp-2 leading-snug block">
                          {item.name}
                        </Link>
                        <div className="flex items-baseline gap-2 mt-1.5">
                          <span className="text-[14px] font-medium text-[#2A2623]">₹{Number(item.price).toLocaleString()}</span>
                          {Number(item.original_price) > Number(item.price) && (
                            <span className="text-[12px] text-[#7B6D63]/50 line-through">₹{Number(item.original_price).toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center justify-center">
                      <div className="flex items-center border border-[#D8CBBE] rounded-lg overflow-hidden bg-white">
                        <button
                          onClick={() => updateCartQuantity(item.id, (item.quantity || 1) - 1)}
                          className="w-9 h-9 flex items-center justify-center text-[#2A2623] hover:bg-[#F4EEE8] transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-9 text-center font-bold text-[#2A2623] text-[13px]">
                          {item.quantity || 1}
                        </span>
                        <button 
                          onClick={() => updateCartQuantity(item.id, (item.quantity || 1) + 1)}
                          disabled={(item.quantity || 1) >= Math.min(10, liveStocks[item.id] ?? item.stock ?? 1)}
                          className="w-9 h-9 flex items-center justify-center text-[#2A2623] hover:bg-[#F4EEE8] transition-colors disabled:opacity-20"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Line Total */}
                    <div className="text-right">
                      <p className="text-[15px] font-medium text-[#2A2623]">
                        ₹{(Number(item.price) * (item.quantity || 1)).toLocaleString()}
                      </p>
                    </div>

                    {/* Remove */}
                    <div className="flex justify-end">
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 text-[#7B6D63]/40 hover:text-[#7A0E2E] transition-colors"
                      >
                        <Trash2 size={16} strokeWidth={1.5} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary Sidebar */}
            <aside className="w-full lg:w-[380px] flex-shrink-0">
              <div className="lg:sticky lg:top-24 bg-white rounded-2xl border border-[#D8CBBE]/30 overflow-hidden shadow-sm">
                
                {/* Summary Header */}
                <div className="px-6 py-5 border-b border-[#D8CBBE]/20">
                  <h2 className="text-[15px] font-bold text-[#2A2623] uppercase tracking-wider">Order Summary</h2>
                </div>

                <div className="px-6 py-5 space-y-4">
                  {/* Subtotal */}
                  <div className="flex justify-between text-[13px]">
                    <span className="text-[#7B6D63]">Subtotal ({items.length} items)</span>
                    <span className="font-medium text-[#2A2623]">₹{subtotal.toLocaleString()}</span>
                  </div>

                  {/* Savings */}
                  {productSavings > 0 && (
                    <div className="flex justify-between text-[13px]">
                      <span className="text-emerald-600">Product Discount</span>
                      <span className="font-medium text-emerald-600">−₹{productSavings.toLocaleString()}</span>
                    </div>
                  )}

                  {/* Shipping */}
                  <div className="flex justify-between text-[13px]">
                    <span className="text-[#7B6D63]">Delivery</span>
                    <span className="font-medium text-emerald-600">Free</span>
                  </div>

                  {/* Coupon Discount */}
                  {discount > 0 && (
                    <div className="flex justify-between text-[13px]">
                      <span className="text-emerald-600">Coupon ({appliedCoupon})</span>
                      <span className="font-medium text-emerald-600">−₹{discount.toLocaleString()}</span>
                    </div>
                  )}

                  {/* Coupon Input */}
                  <div className="pt-1">
                    {!showCoupon && !appliedCoupon ? (
                      <button 
                        onClick={() => setShowCoupon(true)}
                        className="flex items-center gap-2 text-[12px] font-bold text-[#7A0E2E] hover:text-[#2A2623] transition-colors"
                      >
                        <Tag size={14} />
                        Apply Coupon Code
                      </button>
                    ) : !appliedCoupon ? (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="Enter code" 
                            className="flex-1 border border-[#D8CBBE] rounded-lg px-4 py-2.5 text-[12px] font-bold tracking-wider text-[#2A2623] outline-none focus:border-[#7A0E2E] transition-all uppercase placeholder:text-[#7B6D63]/30 placeholder:normal-case bg-[#FDFAF5]"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                          />
                          <button 
                            onClick={handleApplyCoupon}
                            className="bg-[#2A2623] text-white px-5 py-2.5 rounded-lg text-[14px] font-bold uppercase tracking-wider hover:bg-[#7A0E2E] transition-all"
                          >
                            Apply
                          </button>
                        </div>
                        {couponError && (
                          <p className="text-[14px] text-red-500 flex items-center gap-1.5">
                            <AlertCircle size={12} /> {couponError}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-emerald-600" />
                          <span className="text-[14px] font-bold text-emerald-700 uppercase tracking-wider">{appliedCoupon}</span>
                        </div>
                        <button onClick={removeCoupon} className="text-[14px] font-bold text-red-500 hover:text-red-700 transition-colors">
                          Remove
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Total */}
                  <div className="pt-4 border-t border-[#D8CBBE]/30 flex justify-between items-baseline">
                    <span className="text-[14px] font-bold text-[#2A2623]">Total</span>
                    <span className="text-2xl font-serif text-[#2A2623]">₹{total.toLocaleString()}</span>
                  </div>

                  {/* Checkout Button */}
                  <button 
                    onClick={() => navigate("/checkout")}
                    disabled={items.length === 0}
                    className="w-full bg-[#2A2623] text-white py-4 rounded-xl text-[14px] font-bold uppercase tracking-[0.25em] hover:bg-[#7A0E2E] transition-all duration-500 disabled:opacity-40 disabled:cursor-not-allowed mt-2"
                  >
                    Proceed to Checkout
                  </button>

                  {/* Trust */}
                  <div className="flex items-center justify-center gap-6 pt-3">
                    <div className="flex items-center gap-1.5 text-[#7B6D63]">
                      <ShieldCheck size={14} strokeWidth={1.5} />
                      <span className="text-[14px] font-medium">Secure</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#7B6D63]">
                      <Truck size={14} strokeWidth={1.5} />
                      <span className="text-[14px] font-medium">Free Shipping</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#7B6D63]">
                      <Gift size={14} strokeWidth={1.5} />
                      <span className="text-[14px] font-medium">Gift Ready</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
