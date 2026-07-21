import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../components/Firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { 
  Search, Heart, ShoppingBag, Eye, ChevronRight, ChevronDown, 
  Loader2, SlidersHorizontal, X, RotateCcw, Check, Sparkles, Filter
} from 'lucide-react';
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

  // New Filter States
  const [priceLimit, setPriceLimit] = useState(100000);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [availability, setAvailability] = useState('all');

  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const searchVal = searchParams.get('search') || searchParams.get('q');
    const categoryQuery = searchParams.get('category');
    const itemQuery = searchParams.get('item');

    if (searchVal) {
      setSearchTerm(searchVal);
    } else if (itemQuery) {
      setSearchTerm(itemQuery.replace(/-/g, ' '));
    }

    if (categoryQuery) {
      setSelectedCategory(categoryQuery);
    } else {
      setSelectedCategory('All');
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        const dbProducts = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(dbProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const { addToCart, addToWishlist, isInCart, isInWishlist } = useStore();

  const maxProductPrice = useMemo(() => {
    if (!products || products.length === 0) return 50000;
    const maxP = Math.max(...products.map(p => Number(p.price) || 0));
    return Math.max(maxP, 5000);
  }, [products]);

  // Set default price limit once products load
  useEffect(() => {
    if (products.length > 0) {
      setPriceLimit(maxProductPrice);
    }
  }, [maxProductPrice, products.length]);

  const categories = ['All', 'Necklace', 'Earrings', 'Rings', 'Bracelet', 'Bangles', 'Bridal Wear', 'Anklets'];
  const materialsList = ['Kundan', 'Polki', 'Gold Plated', 'Silver', 'Pearl', 'Crystal'];

  // Counts per category
  const categoryCounts = useMemo(() => {
    const counts = { All: products.length };
    categories.forEach(cat => {
      if (cat === 'All') return;
      counts[cat] = products.filter(p => p.category?.toLowerCase() === cat.toLowerCase()).length;
    });
    return counts;
  }, [products, categories]);

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

  const toggleMaterial = (mat) => {
    setSelectedMaterials(prev =>
      prev.includes(mat) ? prev.filter(m => m !== mat) : [...prev, mat]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setPriceLimit(maxProductPrice);
    setSelectedMaterials([]);
    setAvailability('all');
    setSortBy('newest');
    setSearchParams({});
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (selectedCategory !== 'All') count++;
    if (priceLimit < maxProductPrice) count++;
    if (selectedMaterials.length > 0) count += selectedMaterials.length;
    if (availability !== 'all') count++;
    return count;
  }, [searchTerm, selectedCategory, priceLimit, maxProductPrice, selectedMaterials, availability]);

  const filteredProducts = products.filter(p => {
    const price = Number(p.price) || 0;
    const queryStr = searchTerm.toLowerCase().trim();

    const matchesSearch = !queryStr ||
      (p.name && p.name.toLowerCase().includes(queryStr)) ||
      (p.category && p.category.toLowerCase().includes(queryStr)) ||
      (p.brand && p.brand.toLowerCase().includes(queryStr)) ||
      (p.description && p.description.toLowerCase().includes(queryStr)) ||
      (Array.isArray(p.tags) && p.tags.some(t => t.toLowerCase().includes(queryStr)));

    const matchesCategory = selectedCategory === 'All' ||
      (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());

    const matchesPrice = price <= priceLimit;

    const matchesMaterial = selectedMaterials.length === 0 || selectedMaterials.some(m => {
      const mat = m.toLowerCase();
      return (p.name && p.name.toLowerCase().includes(mat)) ||
             (p.description && p.description.toLowerCase().includes(mat)) ||
             (p.material && p.material.toLowerCase().includes(mat)) ||
             (Array.isArray(p.tags) && p.tags.some(t => t.toLowerCase().includes(mat)));
    });

    let matchesAvailability = true;
    if (availability === 'inStock') {
      matchesAvailability = Number(p.stock) > 0;
    } else if (availability === 'onSale') {
      matchesAvailability = Number(p.original_price) > Number(p.price);
    }

    return matchesSearch && matchesCategory && matchesPrice && matchesMaterial && matchesAvailability;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return 0;
  });

  // Render Filter Content Sidebar Component
  const FilterSidebarContent = () => (
    <div className="space-y-7 text-[#2A2623]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#D8CBBE]/40">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-[#7A0E2E]" />
          <h3 className="font-serif text-lg font-bold tracking-wide">Filters</h3>
          {activeFiltersCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#7A0E2E] text-white text-[16px] font-bold flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-[16px] uppercase tracking-wider font-bold text-[#7A0E2E] hover:text-[#2A2623] transition-colors flex items-center gap-1"
          >
            <RotateCcw size={12} /> Reset
          </button>
        )}
      </div>

      {/* Price Filter Slider */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-base font-bold uppercase tracking-wider text-[#7B6D63]">
          <span>Price Range</span>
          <span className="text-[#7A0E2E]">Up to ₹{Number(priceLimit).toLocaleString()}</span>
        </div>
        <input
          type="range"
          min={0}
          max={maxProductPrice}
          step={500}
          value={priceLimit}
          onChange={(e) => setPriceLimit(Number(e.target.value))}
          className="w-full accent-[#7A0E2E] cursor-pointer"
        />
        <div className="flex justify-between text-[16px] text-[#7B6D63] font-medium">
          <span>₹0</span>
          <span>₹{Number(maxProductPrice).toLocaleString()}</span>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h4 className="text-base font-bold uppercase tracking-wider text-[#7B6D63] border-b border-[#D8CBBE]/20 pb-1">
          Category
        </h4>
        <div className="space-y-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-base font-semibold transition-all ${
                  isSelected
                    ? 'bg-[#7A0E2E] text-white shadow-sm'
                    : 'text-[#2A2623]/80 hover:bg-[#F4EEE8] hover:text-[#7A0E2E]'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[16px] px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-[#D8CBBE]/30 text-[#7B6D63]'}`}>
                  {categoryCounts[cat] ?? 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Material & Style */}
      <div className="space-y-3">
        <h4 className="text-base font-bold uppercase tracking-wider text-[#7B6D63] border-b border-[#D8CBBE]/20 pb-1">
          Material & Craft
        </h4>
        <div className="space-y-2">
          {materialsList.map((mat) => {
            const checked = selectedMaterials.includes(mat);
            return (
              <label
                key={mat}
                onClick={() => toggleMaterial(mat)}
                className="flex items-center gap-2.5 cursor-pointer text-base font-medium text-[#2A2623]/80 hover:text-[#7A0E2E] transition-colors"
              >
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                  checked ? 'bg-[#7A0E2E] border-[#7A0E2E] text-white' : 'border-[#D8CBBE] bg-white'
                }`}>
                  {checked && <Check size={10} strokeWidth={3} />}
                </div>
                <span>{mat}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Availability */}
      <div className="space-y-3">
        <h4 className="text-base font-bold uppercase tracking-wider text-[#7B6D63] border-b border-[#D8CBBE]/20 pb-1">
          Availability
        </h4>
        <div className="space-y-2">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'inStock', label: 'In Stock Only' },
            { id: 'onSale', label: 'On Sale / Discounted' },
          ].map((opt) => (
            <label
              key={opt.id}
              onClick={() => setAvailability(opt.id)}
              className="flex items-center gap-2.5 cursor-pointer text-base font-medium text-[#2A2623]/80 hover:text-[#7A0E2E] transition-colors"
            >
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                availability === opt.id ? 'border-[#7A0E2E]' : 'border-[#D8CBBE] bg-white'
              }`}>
                {availability === opt.id && <div className="w-2 h-2 rounded-full bg-[#7A0E2E]" />}
              </div>
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

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

      <div className="max-w-[1340px] mx-auto px-4 sm:px-8 py-8">
        
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0 bg-white p-6 rounded-2xl border border-[#D8CBBE]/40 h-fit sticky top-28 shadow-sm">
            <FilterSidebarContent />
          </aside>

          {/* Main Catalog Content */}
          <div className="flex-1 min-w-0">
            
            {/* Top Bar: Search, Mobile Filter Toggle, Sort */}
            <div className="bg-white p-4 rounded-2xl border border-[#D8CBBE]/40 mb-6 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                
                {/* Search Bar */}
                <div className="relative w-full sm:max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7B6D63]/50" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search jewellery, styles, collections..." 
                    className="w-full bg-[#FDFAF5] border border-[#D8CBBE]/50 rounded-xl pl-10 pr-9 py-2.5 text-base text-[#2A2623] outline-none focus:border-[#7A0E2E] transition-all placeholder:text-[#7B6D63]/40"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black">
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Right controls: Mobile Filter button + Sort drop-down */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  
                  {/* Mobile Filter Toggle Button */}
                  <button
                    onClick={() => setShowMobileFilters(true)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-[#2A2623] text-white rounded-xl text-base font-bold tracking-wider uppercase shadow-sm"
                  >
                    <SlidersHorizontal size={14} />
                    Filters
                    {activeFiltersCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-[#7A0E2E] text-white text-[16px] font-bold flex items-center justify-center">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>

                  {/* Sort Selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-[#7B6D63] uppercase tracking-wider hidden md:inline">Sort:</span>
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-[#FDFAF5] border border-[#D8CBBE]/50 rounded-xl px-3.5 py-2.5 text-base font-semibold text-[#2A2623] outline-none focus:border-[#7A0E2E] transition-all cursor-pointer appearance-none pr-8"
                      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237B6D63' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
                    >
                      <option value="newest">Newest Arrivals</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                  </div>

                  <p className="text-base text-[#7B6D63] font-medium hidden lg:block">
                    {sortedProducts.length} items
                  </p>
                </div>
              </div>

              {/* Active Filter Chips */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#D8CBBE]/30">
                  <span className="text-[16px] font-bold uppercase tracking-wider text-[#7B6D63]">Active Filters:</span>
                  
                  {selectedCategory !== 'All' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#7A0E2E]/10 text-[#7A0E2E] rounded-full text-base font-semibold">
                      Category: {selectedCategory}
                      <X size={12} className="cursor-pointer hover:scale-110" onClick={() => setSelectedCategory('All')} />
                    </span>
                  )}

                  {priceLimit < maxProductPrice && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#7A0E2E]/10 text-[#7A0E2E] rounded-full text-base font-semibold">
                      Max: ₹{Number(priceLimit).toLocaleString()}
                      <X size={12} className="cursor-pointer hover:scale-110" onClick={() => setPriceLimit(maxProductPrice)} />
                    </span>
                  )}

                  {selectedMaterials.map(mat => (
                    <span key={mat} className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#7A0E2E]/10 text-[#7A0E2E] rounded-full text-base font-semibold">
                      {mat}
                      <X size={12} className="cursor-pointer hover:scale-110" onClick={() => toggleMaterial(mat)} />
                    </span>
                  ))}

                  {availability !== 'all' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#7A0E2E]/10 text-[#7A0E2E] rounded-full text-base font-semibold">
                      {availability === 'inStock' ? 'In Stock' : 'On Sale'}
                      <X size={12} className="cursor-pointer hover:scale-110" onClick={() => setAvailability('all')} />
                    </span>
                  )}

                  {searchTerm && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#7A0E2E]/10 text-[#7A0E2E] rounded-full text-base font-semibold">
                      "{searchTerm}"
                      <X size={12} className="cursor-pointer hover:scale-110" onClick={() => setSearchTerm('')} />
                    </span>
                  )}

                  <button
                    onClick={clearAllFilters}
                    className="text-base font-bold text-[#7A0E2E] underline hover:text-[#2A2623] ml-2"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-[#F4EEE8] rounded-2xl mb-3" />
                    <div className="h-3 bg-[#F4EEE8] rounded w-3/4 mb-2" />
                    <div className="h-3 bg-[#F4EEE8] rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : sortedProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {sortedProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: (index % 4) * 0.04 }}
                    className="group cursor-pointer bg-white p-2.5 rounded-2xl border border-[#D8CBBE]/30 hover:shadow-lg transition-all duration-300 flex flex-col"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    {/* Image Box */}
                    <div className="aspect-[3/4] overflow-hidden bg-[#F4EEE8] relative rounded-xl mb-3">
                      <img 
                        src={product.image || product.images?.[0]} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      
                      {/* Badges */}
                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
                        {product.original_price > product.price && (
                          <span className="bg-[#7A0E2E] text-white px-2 py-0.5 rounded-md text-[16px] font-bold tracking-wider">
                            -{Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                          </span>
                        )}
                        {product.stock <= 0 && (
                          <span className="bg-[#2A2623] text-white px-2 py-0.5 rounded-md text-[16px] font-bold tracking-wider">
                            Sold Out
                          </span>
                        )}
                      </div>

                      {/* Wishlist Button */}
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

                      {/* Quick View Button */}
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedProduct(product); }} 
                        className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#2A2623] opacity-0 group-hover:opacity-100 hover:bg-[#7A0E2E] hover:text-white transition-all z-10"
                      >
                        <Eye size={14} />
                      </button>

                      {/* Add to Cart Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
                        <button 
                          onClick={(e) => product.stock > 0 && handleAddToCart(e, product)}
                          disabled={product.stock <= 0 || cartLoadings[product.id]}
                          className={`w-full py-2.5 text-[16px] tracking-wider font-bold uppercase flex items-center justify-center gap-2 rounded-lg transition-all ${
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
                    <div className="space-y-1 px-1 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-[16px] tracking-[0.2em] font-bold uppercase text-[#7B6D63] mb-0.5">{product.category || "Jewellery"}</p>
                        <h3 className="font-serif text-[16px] text-[#2A2623] group-hover:text-[#7A0E2E] transition-colors leading-snug line-clamp-1 font-semibold">{product.name}</h3>
                      </div>
                      <div className="flex items-baseline gap-2 pt-1">
                        <span className="text-[16px] font-bold text-[#2A2623]">₹{Number(product.price).toLocaleString()}</span>
                        {product.original_price > product.price && (
                          <span className="text-[16px] text-[#7B6D63]/50 line-through">₹{Number(product.original_price).toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-white rounded-2xl border border-[#D8CBBE]/30 p-8">
                <ShoppingBag size={40} strokeWidth={1} className="mx-auto text-[#7A0E2E]/30 mb-4" />
                <h3 className="font-serif text-2xl text-[#2A2623] mb-2">No matching pieces found</h3>
                <p className="text-base text-[#7B6D63] mb-6">Try adjusting your filters or price range to find what you're looking for.</p>
                <button 
                  onClick={clearAllFilters} 
                  className="px-6 py-2.5 bg-[#7A0E2E] text-white text-base font-bold uppercase tracking-wider rounded-xl hover:bg-[#2A2623] transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] lg:hidden"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 w-[85vw] max-w-sm bg-white z-[160] lg:hidden p-6 overflow-y-auto flex flex-col justify-between shadow-2xl"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-[#D8CBBE]/30">
                  <h3 className="font-serif text-xl font-bold">Filter Products</h3>
                  <button onClick={() => setShowMobileFilters(false)} className="p-2 text-gray-400 hover:text-black">
                    <X size={20} />
                  </button>
                </div>
                <FilterSidebarContent />
              </div>
              <div className="pt-6 border-t border-[#D8CBBE]/30 mt-6">
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full py-3 bg-[#7A0E2E] text-white text-base font-bold uppercase tracking-widest rounded-xl"
                >
                  Apply Filters ({sortedProducts.length})
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }` }} />
    </div>
  );
};

export default Shop;