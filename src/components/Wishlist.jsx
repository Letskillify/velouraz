import React, { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { db } from "./Firebase";
import { collection, getDocs, doc, deleteDoc, addDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Trash2, ShoppingCart, ArrowLeft, Star, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../hooks/useStore";
import Breadcrumb from "./Breadcrumb";

const Wishlist = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToCart } = useStore();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [movingItems, setMovingItems] = useState({});

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
    if (item.stock <= 0) {
      alert("This item is currently out of stock.");
      return;
    }
    setMovingItems(prev => ({ ...prev, [item.id]: true }));
    try {
      const success = await addToCart(item);
      if (success) {
        await removeItem(item.id);
        alert("Moved to your collection!");
      }
    } catch (error) {
      console.error("Error moving to cart:", error);
    } finally {
      setMovingItems(prev => ({ ...prev, [item.id]: false }));
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
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#7A0E2E]"></div>
          <Heart className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#7A0E2E]/50 animate-pulse" size={24} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F4EF] font-sans text-[#2A2623]">
      {/* Hero Breadcrumb */}
      <Breadcrumb 
        title="The Wishlist"
        subtitle="A curated selection of exquisite jewelry, awaiting your next celebration."
        bgImage="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=1600"
        links={[
          { name: 'Home', href: '/' },
          { name: 'Shop', href: '/shop' },
          { name: 'Wishlist', href: '/wishlist', active: true }
        ]}
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 pb-20">

        {/* Grid */}
        <AnimatePresence mode="popLayout">
          {items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
              {items.map((item, idx) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.05 }}
                  key={item.id}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/product/${item.id}`)}
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden bg-[#F4EEE8] mb-8 border border-[#D8CBBE]/30 transition-all duration-700 ease-out group-hover:shadow-[0_30px_60px_rgba(122,14,46,0.1)]">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110 opacity-95 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-[#2A2623]/0 group-hover:bg-[#2A2623]/5 transition-colors duration-500" />
                    
                    {/* Quick Actions */}
                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0 z-20">
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                        className="w-12 h-12 bg-white/90 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-[#7B6D63]/30 hover:text-red-600 transition-all shadow-lg"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    {/* Add to Cart Overlay */}
                    <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20">
                      <button 
                        onClick={(e) => { e.stopPropagation(); moveToCart(item); }}
                        disabled={item.stock <= 0 || movingItems[item.id]}
                        className={`w-full py-4 text-[16px] tracking-[0.2em] font-bold uppercase flex items-center justify-center gap-3 transition-all rounded-xl shadow-xl ${
                          item.stock <= 0
                          ? 'bg-red-50 text-red-400 cursor-not-allowed border border-red-100'
                          : 'bg-[#2A2623] text-white hover:bg-[#7A0E2E]'
                        }`}
                      >
                        {movingItems[item.id] ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <ShoppingCart size={16} />
                        )}
                        {item.stock <= 0 ? 'Out of Stock' : 'Move to Collection'}
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-4 px-2 text-center">
                    <div className="space-y-1">
                      <p className="text-[16px] tracking-[0.3em] font-bold uppercase text-[#7B6D63] mb-2">{item.brand || "Velouraz Atelier"}</p>
                      <h3 className="text-xl font-serif text-[#2A2623] group-hover:text-[#7A0E2E] transition-colors duration-300">
                        {item.name}
                      </h3>
                    </div>
                    
                    <div className="flex items-center justify-center gap-4 pt-2">
                      <p className="text-lg font-medium text-[#7A0E2E]">
                        ₹{Number(item.price || 0).toLocaleString()}
                      </p>
                      {item.original_price > item.price && (
                        <p className="text-sm text-[#7B6D63]/40 line-through">
                          ₹{Number(item.original_price).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-40 text-center bg-[#F4EEE8]/30 rounded-[64px] border border-[#D8CBBE]/20"
            >
              <div className="w-32 h-32 bg-[#7A0E2E]/5 rounded-[40px] flex items-center justify-center mx-auto mb-10 text-[#7A0E2E]/20">
                <Heart size={64} />
              </div>
              <h3 className="text-4xl font-serif text-[#2A2623] mb-6 italic font-bold">Your collection is empty</h3>
              <p className="text-[#7B6D63] font-serif text-lg italic mb-12">
                Explore our boutique and save your favorites here for later.
              </p>
              <Link 
                to="/shop" 
                className="inline-flex items-center gap-4 bg-[#7A0E2E] text-white px-16 py-6 rounded-2xl font-bold uppercase tracking-[0.4em] text-[16px] hover:bg-[#2A2623] transition-all shadow-xl shadow-[#7A0E2E]/20"
              >
                Start Exploring
                <ArrowLeft size={20} strokeWidth={2} className="rotate-180" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};


export default Wishlist;
