import React, { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { db } from "./Firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { 
  Heart, 
  Trash2, 
  ShoppingBag, 
  ArrowLeft, 
  Loader2, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Gift, 
  ArrowRight,
  Lock,
  Gem,
  CheckCircle2,
  Filter,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../hooks/useStore";
import Breadcrumb from "./Breadcrumb";

const Wishlist = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToCart, cartCount } = useStore();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // 'all' | 'inStock'
  const [movingItems, setMovingItems] = useState({});
  const [movingAll, setMovingAll] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const snap = await getDocs(collection(db, "users", user.uid, "wishlist"));
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setItems(list);
      } catch (error) {
        console.error("Error loading wishlist:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const removeItem = async (id) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "wishlist", id));
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const moveToCart = async (item) => {
    if (!user) return;
    if (item.stock !== undefined && Number(item.stock) <= 0) {
      alert("This piece is currently out of stock.");
      return;
    }
    setMovingItems(prev => ({ ...prev, [item.id]: true }));
    try {
      const success = await addToCart(item);
      if (success) {
        await removeItem(item.id);
      }
    } catch (error) {
      console.error("Error moving to cart:", error);
    } finally {
      setMovingItems(prev => ({ ...prev, [item.id]: false }));
    }
  };

  const handleMoveAllToCart = async () => {
    if (!user || items.length === 0) return;
    setMovingAll(true);
    try {
      const inStockItems = items.filter(item => item.stock === undefined || Number(item.stock) > 0);
      for (const item of inStockItems) {
        const success = await addToCart(item);
        if (success) {
          await deleteDoc(doc(db, "users", user.uid, "wishlist", item.id));
        }
      }
      setItems(prev => prev.filter(i => i.stock !== undefined && Number(i.stock) <= 0));
    } catch (err) {
      console.error("Error moving all to cart:", err);
    } finally {
      setMovingAll(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F4EF] flex items-center justify-center">
        <div className="relative flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#2e0e43]"></div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#2e0e43]">Loading Private Collection</p>
        </div>
      </div>
    );
  }

  const inStockItems = items.filter(i => i.stock === undefined || Number(i.stock) > 0);
  const displayedItems = filter === "inStock" ? inStockItems : items;

  return (
    <div className="min-h-screen bg-[#F8F4EF] font-sans text-[#2A2623]">
      
      {/* Hero Breadcrumb */}
      <Breadcrumb 
        title="My Private Collection"
        subtitle="A curated editorial gallery of bespoke high jewellery, saved for your next celebration."
        bgImage="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=1600"
        links={[
          { name: 'Home', href: '/' },
          { name: 'Shop', href: '/shop' },
          { name: 'Wishlist', href: '/wishlist', active: true }
        ]}
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-10 pb-28">

        {/* Top Atelier Header Suite */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#D8CBBE]/40">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-sans font-bold uppercase tracking-[0.25em] text-[#C8A46A]">
                ✦ Velouraz  Selection ✦
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif text-[#2e0e43] font-normal tracking-tight flex items-center gap-3">
              My Wishlist Gallery 
              <span className="text-lg sm:text-xl text-[#7B6D63] font-sans font-normal bg-[#2e0e43]/5 border border-[#2e0e43]/10 px-3.5 py-1 rounded-full">
                {items.length} {items.length === 1 ? 'Piece' : 'Pieces'}
              </span>
            </h1>
            <p className="text-sm sm:text-base text-[#7B6D63] font-serif leading-relaxed max-w-xl">
              Your personal gallery of handcrafted masterpieces awaiting acquisition.
            </p>
          </div>

          {/* Action Suite Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {items.length > 0 && inStockItems.length > 0 && (
              <button
                onClick={handleMoveAllToCart}
                disabled={movingAll}
                className="px-5 py-3 rounded-xl bg-[#2e0e43] text-white text-sm font-bold uppercase tracking-[0.18em] hover:bg-[#1A0829] active:scale-[0.99] transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-50 cursor-pointer font-sans"
              >
                {movingAll ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <ShoppingBag size={16} className="text-[#C8A46A]" />
                )}
                <span>{movingAll ? "Moving Items..." : "Move All Available to Bag"}</span>
              </button>
            )}

            <Link 
              to="/cart" 
              className="px-5 py-3 rounded-xl bg-white border border-[#D8CBBE] text-[#2e0e43] hover:border-[#2e0e43] hover:bg-[#FDFAF5] text-sm font-bold uppercase tracking-[0.18em] transition-all duration-300 shadow-xs flex items-center gap-2 font-sans"
            >
              <ShoppingBag size={16} className="text-[#C8A46A]" />
              <span>Bag ({cartCount})</span>
            </Link>

            <Link 
              to="/shop" 
              className="px-5 py-3 rounded-xl bg-transparent border border-[#D8CBBE] text-[#7B6D63] hover:text-[#2A2623] hover:border-[#2A2623] text-sm font-bold uppercase tracking-[0.18em] transition-all duration-300 flex items-center gap-2 font-sans"
            >
              <ArrowLeft size={16} />
              <span>Boutique</span>
            </Link>
          </div>

        </div>

        {/* Filter Pills Bar */}
        {items.length > 0 && (
          <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${
                  filter === "all"
                    ? "bg-[#2e0e43] text-white shadow-sm"
                    : "bg-white text-[#7B6D63] border border-[#D8CBBE]/60 hover:border-[#2e0e43]"
                }`}
              >
                All Saved ({items.length})
              </button>
              <button
                onClick={() => setFilter("inStock")}
                className={`px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${
                  filter === "inStock"
                    ? "bg-[#2e0e43] text-white shadow-sm"
                    : "bg-white text-[#7B6D63] border border-[#D8CBBE]/60 hover:border-[#2e0e43]"
                }`}
              >
                In Stock Only ({inStockItems.length})
              </button>
            </div>

            <p className="text-sm font-serif text-[#7B6D63] italic">
              Showing {displayedItems.length} of {items.length} saved creations
            </p>
          </div>
        )}

        {/* Main Wishlist Gallery */}
        {items.length === 0 ? (
          /* Empty Gallery State */
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-24 px-6 rounded-3xl bg-white border border-[#D8CBBE]/50 shadow-sm text-center max-w-2xl mx-auto space-y-6"
          >
            <div className="w-24 h-24 rounded-full bg-[#F4EEE8] border border-[#C8A46A]/40 flex items-center justify-center mx-auto shadow-inner">
              <Heart size={40} className="text-[#2e0e43]" strokeWidth={1.5} />
            </div>

            <div className="space-y-2">
              <span className="text-sm uppercase font-bold tracking-[0.25em] text-[#C8A46A] block">
                 Gallery Empty
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#2e0e43] font-normal">
                Your Private Collection is Empty
              </h2>
              <p className="text-sm sm:text-base text-[#7B6D63] font-serif leading-relaxed max-w-md mx-auto">
                Discover our high-jewellery catalog and curate your personal collection of timeless treasures.
              </p>
            </div>

            <div className="pt-4">
              <Link 
                to="/shop" 
                className="inline-flex items-center justify-center gap-2.5 bg-[#2e0e43] text-white px-9 py-4 rounded-xl text-sm font-bold uppercase tracking-[0.22em] hover:bg-[#1A0829] transition-all duration-300 shadow-md hover:shadow-xl font-sans"
              >
                <span>Explore Boutique Catalog</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        ) : (
          /* Editorial High-Jewellery Product Gallery Grid */
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
              {displayedItems.map((item, idx) => {
                const isOutOfStock = item.stock !== undefined && Number(item.stock) <= 0;
                return (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: idx * 0.04 }}
                    key={item.id}
                    className="bg-white border border-[#D8CBBE]/50 rounded-3xl p-5 shadow-sm hover:shadow-2xl hover:border-[#C8A46A] transition-all duration-500 flex flex-col justify-between group relative"
                  >
                    <div>
                      {/* Image Showcase Container */}
                      <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-[#F4EEE8] relative mb-5 border border-[#D8CBBE]/30">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                        />
                        <div className="absolute inset-0 bg-[#2A2623]/0 group-hover:bg-[#2A2623]/5 transition-colors duration-500" />
                        
                        {/* Top-Left Saved Tag Badge */}
                        <div className="absolute top-3.5 left-3.5 bg-white/90 backdrop-blur-md border border-[#C8A46A]/40 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                          <Heart size={12} className="text-[#C8A46A] fill-[#C8A46A]" />
                          <span className="text-xs font-bold uppercase tracking-wider text-[#2e0e43] font-sans">Saved</span>
                        </div>

                        {/* Top-Right Trash Action Button */}
                        <button 
                          onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                          className="absolute top-3.5 right-3.5 w-9 h-9 bg-white/90 backdrop-blur-md border border-[#D8CBBE]/60 rounded-full flex items-center justify-center text-[#7B6D63] hover:text-red-700 hover:bg-red-50 hover:border-red-200 transition-all shadow-xs"
                          title="Remove from wishlist"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Item Information */}
                      <div className="space-y-2 px-1">
                        
                        {/* Brand Tag */}
                        <span className="text-xs font-sans font-bold uppercase tracking-[0.22em] text-[#C8A46A] block">
                          {item.brand || "Velouraz High Jewellery"}
                        </span>

                        {/* Product Title */}
                        <Link 
                          to={`/product/${item.id}`} 
                          className="text-base sm:text-lg font-serif text-[#2A2623] hover:text-[#2e0e43] transition-colors leading-snug font-medium line-clamp-2 block"
                        >
                          {item.name}
                        </Link>

                        {/* Price & Stock Pill */}
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-bold text-[#2e0e43] font-sans">
                              ₹{Number(item.price || 0).toLocaleString()}
                            </span>
                            {Number(item.original_price) > Number(item.price) && (
                              <span className="text-sm text-[#7B6D63]/60 line-through font-sans">
                                ₹{Number(item.original_price).toLocaleString()}
                              </span>
                            )}
                          </div>

                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            isOutOfStock ? "bg-rose-50 text-rose-700 border border-rose-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          }`}>
                            {isOutOfStock ? "Out of Stock" : "In Stock"}
                          </span>
                        </div>

                      </div>
                    </div>

                    {/* Card Bottom CTA Button */}
                    <div className="pt-4 mt-2">
                      <button 
                        onClick={() => moveToCart(item)}
                        disabled={isOutOfStock || movingItems[item.id]}
                        className={`w-full py-3.5 px-4 rounded-xl text-sm font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all duration-300 shadow-sm ${
                          isOutOfStock
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                            : "bg-[#2e0e43] text-white hover:bg-[#1A0829] active:scale-[0.99] hover:shadow-md cursor-pointer"
                        }`}
                      >
                        {movingItems[item.id] ? (
                          <Loader2 size={16} className="animate-spin shrink-0" />
                        ) : (
                          <ShoppingBag size={16} className="shrink-0 text-[#C8A46A]" />
                        )}
                        <span>{movingItems[item.id] ? "Moving..." : "Move to Bag"}</span>
                      </button>
                    </div>

                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        )}

      </div>
    </div>
  );
};

export default Wishlist;
