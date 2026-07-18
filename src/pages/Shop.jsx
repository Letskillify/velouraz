import React, { useState, useEffect } from 'react';
import { db } from '../components/Firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Search, Heart, ShoppingBag, Eye, ChevronRight, Loader2, SlidersHorizontal, X } from 'lucide-react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../components/useAuth';
import { useStore } from '../hooks/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import QuickView from '../components/QuickView';
import Breadcrumb from '../components/Breadcrumb';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [cartLoadings, setCartLoadings] = useState({});
  const [wishlistLoadings, setWishlistLoadings] = useState({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const categoryQuery = searchParams.get('category');
    if (categoryQuery) {
      setSelectedCategory(categoryQuery);
    } else {
      setSelectedCategory('All');
    }
  }, [searchParams]);

  const curatedProducts = [];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        const dbProducts = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(dbProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts(curatedProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
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

  const categories = ['All', 'Necklace', 'Earrings', 'Rings', 'Bracelet', 'Bangles', 'Bridal Wear', 'Anklets'];
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#FDFAF5] font-sans text-[#2A2623]">
      
      {selectedProduct && <QuickView product={selectedProduct} onClose={() => setSelectedProduct(null)} />}

      {/* Premium Breadcrumb */}
      <Breadcrumb 
        title="Our Collection"
        subtitle="Discover our curated selection of handcrafted jewellery, inspired by cultures and designed for the modern woman."
        bgImage="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1600"
        links={[
          { name: 'Home', href: '/' },
          { name: 'Shop', href: '/shop', active: true }
        ]}
      />

      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-8">
        
        {/* Toolbar: Categories + Search + Sort */}
        <div className="flex flex-col gap-5 mb-8">
          
          {/* Categories - Scrollable */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-[14px] font-bold tracking-wider uppercase transition-all whitespace-nowrap border ${
                  selectedCategory === cat 
                    ? 'bg-[#2A2623] text-white border-[#2A2623]' 
                    : 'bg-white text-[#7B6D63] border-[#D8CBBE]/50 hover:border-[#7A0E2E] hover:text-[#7A0E2E]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search + Sort Row */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7B6D63]/40" size={16} />
              <input 
                type="text" 
                placeholder="Search products..." 
                className="w-full bg-white border border-[#D8CBBE]/50 rounded-lg pl-10 pr-4 py-2.5 text-[13px] text-[#2A2623] outline-none focus:border-[#7A0E2E] transition-all placeholder:text-[#7B6D63]/40"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-[#D8CBBE]/50 rounded-lg px-4 py-2.5 text-[12px] text-[#2A2623] outline-none focus:border-[#7A0E2E] transition-all cursor-pointer appearance-none pr-8 font-medium"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237B6D63' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
            <p className="text-[12px] text-[#7B6D63] hidden sm:block">{sortedProducts.length} products</p>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-[#F4EEE8] rounded-xl mb-3" />
                <div className="h-3 bg-[#F4EEE8] rounded w-3/4 mb-2" />
                <div className="h-3 bg-[#F4EEE8] rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : sortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {sortedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (index % 4) * 0.05 }}
                className="group cursor-pointer"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                {/* Image */}
                <div className="aspect-[3/4] overflow-hidden bg-[#F4EEE8] mb-3 relative rounded-xl border border-[#D8CBBE]/20">
                  <img 
                    src={product.image || product.images?.[0]} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
                    {product.original_price > product.price && (
                      <span className="bg-[#7A0E2E] text-white px-2 py-1 rounded-md text-[9px] font-bold tracking-wider">
                        -{Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                      </span>
                    )}
                    {product.stock <= 0 && (
                      <span className="bg-[#2A2623] text-white px-2 py-1 rounded-md text-[9px] font-bold tracking-wider">
                        Sold Out
                      </span>
                    )}
                  </div>

                  {/* Wishlist */}
                  <button 
                    onClick={(e) => handleAddToWishlist(e, product)} 
                    disabled={wishlistLoadings[product.id]}
                    className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 ${
                      isInWishlist(product.id) 
                        ? 'bg-[#7A0E2E] text-white' 
                        : 'bg-white/80 backdrop-blur-sm text-[#2A2623] opacity-0 group-hover:opacity-100 hover:bg-[#7A0E2E] hover:text-white'
                    }`}
                  >
                    {wishlistLoadings[product.id] ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Heart size={14} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                    )}
                  </button>

                  {/* Quick View */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedProduct(product); }} 
                    className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#2A2623] opacity-0 group-hover:opacity-100 hover:bg-[#7A0E2E] hover:text-white transition-all z-10"
                  >
                    <Eye size={14} />
                  </button>

                  {/* Add to Cart - Bottom overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-2.5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
                    <button 
                      onClick={(e) => product.stock > 0 && handleAddToCart(e, product)}
                      disabled={product.stock <= 0 || cartLoadings[product.id]}
                      className={`w-full py-2.5 text-[14px] tracking-wider font-bold uppercase flex items-center justify-center gap-2 rounded-lg transition-all ${
                        product.stock <= 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : isInCart(product.id) 
                        ? 'bg-[#7A0E2E] text-white' 
                        : 'bg-[#2A2623] text-white hover:bg-[#7A0E2E]'
                      }`}
                    >
                      {cartLoadings[product.id] ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <ShoppingBag size={12} />
                      )}
                      {product.stock <= 0 ? 'Sold Out' : isInCart(product.id) ? 'In Cart' : 'Add to Cart'}
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="space-y-1 px-0.5">
                  <p className="text-[9px] tracking-[0.2em] font-bold uppercase text-[#7B6D63]">{product.brand || "Velouraz"}</p>
                  <h3 className="font-serif text-[15px] text-[#2A2623] group-hover:text-[#7A0E2E] transition-colors leading-snug line-clamp-1">{product.name}</h3>
                  <div className="flex items-baseline gap-2 pt-0.5">
                    <span className="text-[14px] font-medium text-[#2A2623]">₹{Number(product.price).toLocaleString()}</span>
                    {product.original_price > product.price && (
                      <span className="text-[12px] text-[#7B6D63]/50 line-through">₹{Number(product.original_price).toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <ShoppingBag size={40} strokeWidth={1} className="mx-auto text-[#7A0E2E]/20 mb-4" />
            <p className="font-serif text-xl text-[#7B6D63]/60 mb-4">No products found</p>
            <button 
              onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }} 
              className="text-[12px] font-bold text-[#7A0E2E] hover:text-[#2A2623] transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
      <style dangerouslySetInnerHTML={{ __html: `.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }` }} />
    </div>
  );
};

export default Shop;