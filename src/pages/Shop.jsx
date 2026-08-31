import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../components/Firebase';
import { collection, getDocs, onSnapshot, query, orderBy } from 'firebase/firestore';
import { 
  Search, Heart, ShoppingBag, Eye, ChevronRight, 
  Loader2, SlidersHorizontal, X, RotateCcw, Check, Sparkles, Filter, Tag
} from 'lucide-react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../components/useAuth';
import { useStore } from '../hooks/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import QuickView from '../components/QuickView';
import Breadcrumb from '../components/Breadcrumb';
import AddToCartModal from '../components/AddToCartModal';
import { listenToTags } from '../services/tagsService';

const fallbackProducts = [
  {
    id: 'shop-1',
    name: 'Aurora Luxe Crystal Cuff Bangle',
    category: 'Bangles',
    brand: 'VELOURAZ',
    price: 2999,
    original_price: 5199,
    material: 'Crystal',
    image: 'img/jewellery/j.png',
    stock: 5,
    tags: ['Bangles', 'Gold Plated']
  },
  {
    id: 'shop-2',
    name: 'Azure Infinity Crystal Bangle',
    category: 'Bangles',
    brand: 'VELOURAZ',
    price: 1799,
    original_price: 2699,
    material: 'Polki',
    image: 'img/jewellery/j.png',
    stock: 0,
    tags: ['Bangles']
  },
  {
    id: 'shop-3',
    name: 'Celestia Emerald Royal Choker',
    category: 'Necklace',
    brand: 'VELOURAZ',
    price: 4999,
    original_price: 6999,
    material: 'Kundan',
    image: 'img/jewellery/j (1).png',
    stock: 12,
    tags: ['Necklace', 'Kundan']
  },
  {
    id: 'shop-4',
    name: 'Royal Sapphire Halo Tennis Bracelet',
    category: 'Bracelet',
    brand: 'VELOURAZ',
    price: 4014,
    original_price: 5099,
    material: 'Crystal',
    image: 'img/jewellery/j (6).png',
    stock: 10,
    tags: ['Bracelet', 'Crystal']
  },
  {
    id: 'shop-5',
    name: 'Empress Pearl Statement Drop Earrings',
    category: 'Earrings',
    brand: 'VELOURAZ',
    price: 2499,
    original_price: 3499,
    material: 'Pearl',
    image: 'img/jewellery/j (4).png',
    stock: 8,
    tags: ['Earrings', 'Pearl']
  },
  {
    id: 'shop-6',
    name: 'Solitaire Cushion Cut Diamond Ring',
    category: 'Rings',
    brand: 'VELOURAZ',
    price: 3299,
    original_price: 4599,
    material: 'Gold Plated',
    image: 'img/jewellery/j (5).png',
    stock: 15,
    tags: ['Rings', 'Gold Plated']
  },
  {
    id: 'shop-7',
    name: 'Heritage Kundan & Pearl Bridal Set',
    category: 'Bridal Wear',
    brand: 'VELOURAZ',
    price: 8999,
    original_price: 12999,
    material: 'Kundan',
    image: 'img/jewellery/j (3).png',
    stock: 3,
    tags: ['Bridal Wear', 'Kundan']
  },
  {
    id: 'shop-8',
    name: 'Lattice Luxe Crystal Bracelet',
    category: 'Bracelet',
    brand: 'VELOURAZ',
    price: 2408,
    original_price: 3299,
    material: 'Silver',
    image: 'img/jewellery/j (6).png',
    stock: 6,
    tags: ['Bracelet', 'Silver']
  }
];

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [cartLoadings, setCartLoadings] = useState({});
  const [wishlistLoadings, setWishlistLoadings] = useState({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [addModalProduct, setAddModalProduct] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Filter States
  const [priceLimit, setPriceLimit] = useState(100000);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [availability, setAvailability] = useState('all');

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const unsub = listenToTags((tagsList) => setAvailableTags(tagsList));
    return () => unsub();
  }, []);

  // Helper to sync query parameters with URL
  const updateFilterParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === 'All' || value === 'all' || (Array.isArray(value) && value.length === 0)) {
      newParams.delete(key);
    } else if (Array.isArray(value)) {
      newParams.set(key, value.join(','));
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams, { replace: true });
  };

  useEffect(() => {
    const searchVal = searchParams.get('search') || searchParams.get('q');
    const categoryQuery = searchParams.get('category');
    const countryQuery = searchParams.get('country');
    const itemQuery = searchParams.get('item');
    const filterQuery = searchParams.get('filter');
    const materialQuery = searchParams.get('material');
    const tagQuery = searchParams.get('tag');
    const sortQuery = searchParams.get('sort');
    const maxPriceQuery = searchParams.get('maxPrice');

    if (searchVal) {
      setSearchTerm(searchVal);
    } else if (itemQuery) {
      setSearchTerm(itemQuery.replace(/-/g, ' '));
    } else {
      setSearchTerm('');
    }

    if (categoryQuery) {
      setSelectedCategory(categoryQuery);
    } else {
      setSelectedCategory('All');
    }

    if (countryQuery) {
      setSelectedCountry(countryQuery);
    } else {
      setSelectedCountry('All');
    }

    if (materialQuery) {
      setSelectedMaterials(materialQuery.split(',').filter(Boolean));
    } else {
      setSelectedMaterials([]);
    }

    if (tagQuery) {
      setSelectedTags(tagQuery.split(',').filter(Boolean));
    } else if (filterQuery === 'new' || filterQuery === 'new-arrivals') {
      setSelectedTags(['New Arrivals']);
    } else if (filterQuery === 'bestsellers') {
      setSelectedTags(['Bestsellers']);
    } else {
      setSelectedTags([]);
    }

    if (sortQuery) {
      setSortBy(sortQuery);
    } else if (filterQuery === 'new') {
      setSortBy('newest');
    }

    if (maxPriceQuery && !isNaN(Number(maxPriceQuery))) {
      setPriceLimit(Number(maxPriceQuery));
    }
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        const dbProducts = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(dbProducts);
      } else {
        setProducts(fallbackProducts);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error listening to products:", error);
      setProducts(fallbackProducts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const { addToCart, addToWishlist, isInCart, isInWishlist } = useStore();

  const maxProductPrice = useMemo(() => {
    if (!products || products.length === 0) return 20000;
    const maxP = Math.max(...products.map(p => Number(p.price) || 0));
    return Math.max(maxP, 10000);
  }, [products]);

  useEffect(() => {
    if (products.length > 0 && !searchParams.get('maxPrice')) {
      setPriceLimit(maxProductPrice);
    }
  }, [maxProductPrice, products.length, searchParams]);

  const categories = ['All', 'Necklace', 'Earrings', 'Rings', 'Bracelet', 'Bangles', 'Bridal Wear'];
  const materialsList = ['Kundan', 'Polki', 'Gold Plated', 'Silver', 'Pearl', 'Crystal'];

  // Country options dynamically extracted or curated
  const featuredCountries = ['All', 'Paris', 'Thailand', 'India', 'Japan', 'South Korea'];
  const countryList = useMemo(() => {
    const fromProducts = Array.from(new Set(products.map(p => p.country).filter(Boolean)));
    const combined = Array.from(new Set([...featuredCountries, ...fromProducts]));
    return combined;
  }, [products]);

  const categoryCounts = useMemo(() => {
    const counts = { All: products.length };
    categories.forEach(cat => {
      if (cat === 'All') return;
      counts[cat] = products.filter(p => p.category?.toLowerCase() === cat.toLowerCase()).length;
    });
    return counts;
  }, [products, categories]);

  const countryCounts = useMemo(() => {
    const counts = { All: products.length };
    countryList.forEach(c => {
      if (c === 'All') return;
      counts[c] = products.filter(p => p.country?.toLowerCase() === c.toLowerCase()).length;
    });
    return counts;
  }, [products, countryList]);

  const handleAddToCart = async (e, product) => {
    e.stopPropagation();
    setCartLoadings(prev => ({ ...prev, [product.id]: true }));
    try {
      const success = await addToCart(product);
      if (success) {
        setAddModalProduct(product);
        setIsAddModalOpen(true);
      }
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
    const nextMaterials = selectedMaterials.includes(mat)
      ? selectedMaterials.filter(m => m !== mat)
      : [...selectedMaterials, mat];
    setSelectedMaterials(nextMaterials);
    updateFilterParam('material', nextMaterials);
  };

  const toggleTag = (tagName) => {
    const nextTags = selectedTags.includes(tagName)
      ? selectedTags.filter(t => t !== tagName)
      : [...selectedTags, tagName];
    setSelectedTags(nextTags);
    updateFilterParam('tag', nextTags);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedCountry('All');
    setPriceLimit(maxProductPrice);
    setSelectedMaterials([]);
    setSelectedTags([]);
    setAvailability('all');
    setSortBy('newest');
    setSearchParams({});
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (selectedCategory !== 'All') count++;
    if (selectedCountry !== 'All') count++;
    if (priceLimit < maxProductPrice) count++;
    if (selectedMaterials.length > 0) count += selectedMaterials.length;
    if (selectedTags.length > 0) count += selectedTags.length;
    if (availability !== 'all') count++;
    return count;
  }, [searchTerm, selectedCategory, selectedCountry, priceLimit, maxProductPrice, selectedMaterials, selectedTags, availability]);

  const filteredProducts = products.filter(p => {
    const price = Number(p.price) || 0;
    const queryStr = searchTerm.toLowerCase().trim();

    const matchesSearch = !queryStr ||
      (p.name && p.name.toLowerCase().includes(queryStr)) ||
      (p.category && p.category.toLowerCase().includes(queryStr)) ||
      (p.brand && p.brand.toLowerCase().includes(queryStr)) ||
      (p.description && p.description.toLowerCase().includes(queryStr)) ||
      (Array.isArray(p.tags) && p.tags.some(t => String(t).toLowerCase().includes(queryStr)));

    const matchesCategory = selectedCategory === 'All' ||
      (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());

    const matchesCountry = selectedCountry === 'All' ||
      (p.country && p.country.toLowerCase() === selectedCountry.toLowerCase());

    const matchesPrice = price <= priceLimit;

    const matchesMaterial = selectedMaterials.length === 0 || selectedMaterials.some(m => {
      const mat = m.toLowerCase();
      return (p.name && p.name.toLowerCase().includes(mat)) ||
             (p.description && p.description.toLowerCase().includes(mat)) ||
             (p.material && p.material.toLowerCase().includes(mat)) ||
             (Array.isArray(p.tags) && p.tags.some(t => String(t).toLowerCase().includes(mat)));
    });

    const matchesTags = selectedTags.length === 0 || selectedTags.some(t => {
      const tagStr = t.toLowerCase().trim();

      // Special logic for "New Arrivals": products uploaded within the last 30 days OR explicitly tagged
      if (tagStr === 'new arrivals' || tagStr === 'new arrival') {
        const thirtyDaysInMillis = 30 * 24 * 60 * 60 * 1000;
        const now = Date.now();
        let prodTime = 0;

        if (p.createdAt?.toMillis) {
          prodTime = p.createdAt.toMillis();
        } else if (p.createdAt?.seconds) {
          prodTime = p.createdAt.seconds * 1000;
        } else if (p.createdAt) {
          prodTime = new Date(p.createdAt).getTime();
        } else {
          prodTime = now; // Fallback to current time if no date string
        }

        const isUploadedInLast30Days = (now - prodTime) <= thirtyDaysInMillis && prodTime <= now;
        const hasExplicitTag = Array.isArray(p.tags) && p.tags.some(pt => String(pt).toLowerCase() === tagStr);
        return isUploadedInLast30Days || hasExplicitTag;
      }

      return Array.isArray(p.tags) && p.tags.some(pt => String(pt).toLowerCase() === tagStr);
    });

    let matchesAvailability = true;
    if (availability === 'inStock') {
      matchesAvailability = Number(p.stock) > 0;
    } else if (availability === 'onSale') {
      matchesAvailability = Number(p.original_price) > Number(p.price);
    }

    return matchesSearch && matchesCategory && matchesCountry && matchesPrice && matchesMaterial && matchesTags && matchesAvailability;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'bestsellers') return (b.salesCount || b.stock || 0) - (a.salesCount || a.stock || 0);
    return 0;
  });

  // Refined Sidebar Content Component
  const FilterSidebarContent = () => (
    <div className="space-y-8 text-[#2A2623]">
      {/* Sidebar Title Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#EFE8DC]">
        <div className="flex items-center gap-2.5">
          <SlidersHorizontal size={17} className="text-[#B58E58]" />
          <h3 className="font-serif text-lg font-semibold tracking-wide text-[#2A2623]">FILTERS</h3>
          {activeFiltersCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#2e0e43] text-white text-[11px] font-bold flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-[11px] uppercase tracking-widest font-semibold text-[#2e0e43] hover:text-[#2A2623] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw size={11} /> Reset
          </button>
        )}
      </div>

      {/* Promotional & Catalog Tags Filter */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B58E58] font-sans border-b border-[#EFE8DC]/60 pb-1.5 flex items-center gap-1.5">
          <Tag size={13} className="text-[#B58E58]" /> TAGS & EDITIONS
        </h4>
        <div className="flex flex-wrap gap-2 pt-1">
          {availableTags.map((tagObj) => {
            const checked = selectedTags.some(t => t.toLowerCase() === tagObj.name.toLowerCase());
            return (
              <button
                key={tagObj.id}
                onClick={() => toggleTag(tagObj.name)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                  checked
                    ? "bg-[#2e0e43] text-white border-[#2e0e43] shadow-xs"
                    : "bg-[#FAF7F2] text-[#2A2623]/80 border-[#EFE8DC] hover:border-[#2e0e43]"
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded flex items-center justify-center transition-all ${checked ? "bg-white text-[#2e0e43]" : "border border-[#D5C6B1] bg-white"}`}>
                  {checked && <Check size={10} strokeWidth={3} />}
                </div>
                <span>{tagObj.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Slider */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-[0.15em] text-[#B58E58] font-sans">
          <span>PRICE RANGE</span>
          <span className="text-[#2e0e43] font-bold">₹{Number(priceLimit).toLocaleString()}</span>
        </div>
        <input
          type="range"
          min={0}
          max={maxProductPrice}
          step={250}
          value={priceLimit}
          onChange={(e) => {
            const val = Number(e.target.value);
            setPriceLimit(val);
            updateFilterParam('maxPrice', val);
          }}
          className="w-full accent-[#2e0e43] cursor-pointer h-1.5 bg-[#EFE8DC] rounded-lg border-none"
        />
        <div className="flex justify-between text-[11px] text-[#7B6D63] font-medium font-sans">
          <span>₹0</span>
          <span>₹{Number(maxProductPrice).toLocaleString()}</span>
        </div>
      </div>

      {/* Country & Origin Filter */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B58E58] font-sans border-b border-[#EFE8DC]/60 pb-1.5">
          WORLD EDITS & DESTINATIONS
        </h4>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          {countryList.map((c) => {
            const isSelected = selectedCountry.toLowerCase() === c.toLowerCase();
            return (
              <button
                key={c}
                onClick={() => {
                  setSelectedCountry(c);
                  updateFilterParam('country', c);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs md:text-sm font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#2e0e43] text-white shadow-sm font-semibold'
                    : 'text-[#2A2623]/80 hover:bg-[#F5EFE6] hover:text-[#2e0e43]'
                }`}
              >
                <span>{c}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-[#EFE8DC] text-[#7B6D63]'}`}>
                  {countryCounts[c] ?? 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B58E58] font-sans border-b border-[#EFE8DC]/60 pb-1.5">
          CATEGORIES
        </h4>
        <div className="space-y-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  updateFilterParam('category', cat);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs md:text-sm font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#2e0e43] text-white shadow-sm font-semibold'
                    : 'text-[#2A2623]/80 hover:bg-[#F5EFE6] hover:text-[#2e0e43]'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-[#EFE8DC] text-[#7B6D63]'}`}>
                  {categoryCounts[cat] ?? 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Material & Craft */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B58E58] font-sans border-b border-[#EFE8DC]/60 pb-1.5">
          MATERIAL & CRAFT
        </h4>
        <div className="space-y-2">
          {materialsList.map((mat) => {
            const checked = selectedMaterials.includes(mat);
            return (
              <label
                key={mat}
                onClick={() => toggleMaterial(mat)}
                className="flex items-center gap-2.5 cursor-pointer text-xs md:text-sm font-medium text-[#2A2623]/80 hover:text-[#2e0e43] transition-colors"
              >
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                  checked ? 'bg-[#2e0e43] border-[#2e0e43] text-white' : 'border-[#D5C6B1] bg-white'
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
        <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B58E58] font-sans border-b border-[#EFE8DC]/60 pb-1.5">
          AVAILABILITY
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
              className="flex items-center gap-2.5 cursor-pointer text-xs md:text-sm font-medium text-[#2A2623]/80 hover:text-[#2e0e43] transition-colors"
            >
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                availability === opt.id ? 'border-[#2e0e43]' : 'border-[#D5C6B1] bg-white'
              }`}>
                {availability === opt.id && <div className="w-2 h-2 rounded-full bg-[#2e0e43]" />}
              </div>
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans text-[#2A2623]">
      
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

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-8 md:py-12">
        
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0 bg-[#FFFDF9] p-6 rounded-2xl border border-[#EFE8DC] h-fit sticky top-28 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
            <FilterSidebarContent />
          </aside>

          {/* Main Catalog Content */}
          <div className="flex-1 min-w-0">
            
            {/* Top Control Bar: Search, Filter Drawer Button, Sort */}
            <div className="bg-[#FFFDF9] p-4 rounded-2xl border border-[#EFE8DC] mb-6 space-y-3 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                
                {/* Search Bar */}
                <div className="relative w-full sm:max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B58E58]" size={15} />
                  <input 
                    type="text" 
                    placeholder="Search jewellery, styles, materials..." 
                    className="w-full bg-[#FAF7F2] border border-[#EFE8DC] rounded-xl pl-10 pr-9 py-2.5 text-xs md:text-sm text-[#2A2623] outline-none focus:border-[#2e0e43] transition-all placeholder:text-[#7B6D63]/50"
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
                    className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-[#2A2623] text-white rounded-xl text-xs font-semibold tracking-wider uppercase shadow-sm cursor-pointer"
                  >
                    <SlidersHorizontal size={14} />
                    Filters
                    {activeFiltersCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-[#2e0e43] text-white text-[10px] font-bold flex items-center justify-center">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>

                  {/* Sort Selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#B58E58] uppercase tracking-wider hidden md:inline font-sans">Sort:</span>
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-[#FAF7F2] border border-[#EFE8DC] rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#2A2623] outline-none focus:border-[#2e0e43] transition-all cursor-pointer appearance-none pr-8 font-sans"
                      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23B58E58' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
                    >
                      <option value="newest">Newest Arrivals</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                  </div>

                  <p className="text-xs text-[#7B6D63] font-medium hidden lg:block font-sans">
                    {sortedProducts.length} pieces
                  </p>
                </div>
              </div>

              {/* Active Filter Chips */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#EFE8DC]/60">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#B58E58] font-sans">Active:</span>
                  
                  {selectedCategory !== 'All' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2e0e43]/10 text-[#2e0e43] rounded-full text-xs font-medium">
                      Category: {selectedCategory}
                      <X size={12} className="cursor-pointer hover:scale-110" onClick={() => setSelectedCategory('All')} />
                    </span>
                  )}

                  {selectedCountry !== 'All' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2e0e43]/10 text-[#2e0e43] rounded-full text-xs font-medium">
                      Country: {selectedCountry}
                      <X size={12} className="cursor-pointer hover:scale-110" onClick={() => setSelectedCountry('All')} />
                    </span>
                  )}

                  {priceLimit < maxProductPrice && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2e0e43]/10 text-[#2e0e43] rounded-full text-xs font-medium">
                      Max: ₹{Number(priceLimit).toLocaleString()}
                      <X size={12} className="cursor-pointer hover:scale-110" onClick={() => setPriceLimit(maxProductPrice)} />
                    </span>
                  )}

                  {selectedMaterials.map(mat => (
                    <span key={mat} className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2e0e43]/10 text-[#2e0e43] rounded-full text-xs font-medium">
                      {mat}
                      <X size={12} className="cursor-pointer hover:scale-110" onClick={() => toggleMaterial(mat)} />
                    </span>
                  ))}

                  {selectedTags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2e0e43] text-white rounded-full text-xs font-medium">
                      Tag: {tag}
                      <X size={12} className="cursor-pointer hover:scale-110" onClick={() => toggleTag(tag)} />
                    </span>
                  ))}

                  {availability !== 'all' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2e0e43]/10 text-[#2e0e43] rounded-full text-xs font-medium">
                      {availability === 'inStock' ? 'In Stock' : 'On Sale'}
                      <X size={12} className="cursor-pointer hover:scale-110" onClick={() => setAvailability('all')} />
                    </span>
                  )}

                  {searchTerm && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2e0e43]/10 text-[#2e0e43] rounded-full text-xs font-medium">
                      "{searchTerm}"
                      <X size={12} className="cursor-pointer hover:scale-110" onClick={() => setSearchTerm('')} />
                    </span>
                  )}

                  <button
                    onClick={clearAllFilters}
                    className="text-xs font-semibold text-[#2e0e43] underline hover:text-[#2A2623] ml-2 cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {/* Product Cards Grid */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-[#FFFDF9] rounded-2xl p-4 border border-[#EFE8DC]">
                    <div className="aspect-square bg-[#F3ECE1] rounded-xl mb-3" />
                    <div className="h-3 bg-[#F3ECE1] rounded w-3/4 mb-2" />
                    <div className="h-3 bg-[#F3ECE1] rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : sortedProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                {sortedProducts.map((product, index) => {
                  const inWishlist = isInWishlist ? isInWishlist(product.id) : false;
                  const isSoldOut = product.stock <= 0;

                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: (index % 4) * 0.05 }}
                      className="group flex flex-col h-full rounded-2xl border border-[#EFE8DC] bg-[#FFFDF9] overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.08)] hover:border-[#D5C6B1] transition-all duration-300 cursor-pointer"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      {/* Image Box */}
                      <div className="relative aspect-square w-full overflow-hidden bg-[#F3ECE1] border-b border-[#EBE3D7]/60">
                        <img 
                          src={product.image || product.images?.[0] || 'img/jewellery/j.png'} 
                          alt={product.name} 
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        
                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                          {product.original_price > product.price && (
                            <span className="bg-[#2e0e43] text-white text-[10px] font-semibold tracking-[0.18em] uppercase px-2.5 py-1 rounded-sm shadow-sm">
                              -{Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                            </span>
                          )}
                          {isSoldOut && (
                            <span className="bg-[#2A2623] text-white text-[10px] font-semibold tracking-[0.18em] uppercase px-2.5 py-1 rounded-sm shadow-sm">
                              SOLD OUT
                            </span>
                          )}
                        </div>

                        {/* Top Floating Action Button: Wishlist */}
                        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button 
                            onClick={(e) => handleAddToWishlist(e, product)} 
                            disabled={wishlistLoadings[product.id]}
                            aria-label="Add to wishlist"
                            className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[#2A2623] hover:text-[#2e0e43] transition-all duration-300 border border-black/5 hover:scale-105 cursor-pointer"
                          >
                            {wishlistLoadings[product.id] ? (
                              <Loader2 size={13} className="animate-spin" />
                            ) : (
                              <Heart size={14} fill={inWishlist ? '#2e0e43' : 'none'} stroke={inWishlist ? '#2e0e43' : 'currentColor'} strokeWidth={inWishlist ? 0 : 1.5} />
                            )}
                          </button>
                        </div>

                        {/* Slide-up Add to Cart / Quick Purchase Button */}
                        {!isSoldOut && (
                          <div className="absolute bottom-3 left-3 right-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
                            <button 
                              onClick={(e) => handleAddToCart(e, product)}
                              disabled={cartLoadings[product.id]}
                              className="w-full py-2.5 text-[11px] tracking-[0.2em] font-semibold uppercase flex items-center justify-center gap-2 rounded-lg border border-transparent bg-[#2A2623] text-white hover:bg-[#2e0e43] transition-colors duration-300 shadow-md cursor-pointer"
                            >
                              {cartLoadings[product.id] ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : (
                                <ShoppingBag size={12} />
                              )}
                              {isInCart(product.id) ? 'IN BAG' : 'ACQUIRE PIECE'}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Product Metadata, Title & Pricing */}
                      <div className="p-4 text-center space-y-1 flex flex-col justify-between flex-1">
                        <div>
                          <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#B58E58] font-sans block mb-1">
                            {product.brand || product.category || "VELOURAZ"}
                          </span>
                          
                          <h3 
                            className="text-xs md:text-sm font-normal text-[#2A2623] font-serif leading-snug group-hover:text-[#2e0e43] transition-colors duration-300 line-clamp-2"
                          >
                            {product.name}
                          </h3>
                        </div>

                        <div className="flex items-center justify-center gap-2 pt-2">
                          <span className="text-sm font-bold text-[#2e0e43]">
                            ₹{Number(product.price || 0).toLocaleString()}
                          </span>
                          {product.original_price && Number(product.original_price) > Number(product.price) && (
                            <span className="text-xs text-[#999999] line-through font-normal">
                              ₹{Number(product.original_price).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 bg-[#FFFDF9] rounded-2xl border border-[#EFE8DC] p-8 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
                <ShoppingBag size={38} strokeWidth={1} className="mx-auto text-[#B58E58]/50 mb-3" />
                <h3 className="font-serif text-2xl text-[#2A2623] mb-2 font-light">No matching pieces found</h3>
                <p className="text-xs md:text-sm text-[#7B6D63] max-w-md mx-auto mb-6">Try clearing or adjusting your search filters to explore the rest of our luxury collection.</p>
                <button 
                  onClick={clearAllFilters} 
                  className="px-8 py-3 bg-[#2e0e43] text-white text-xs font-semibold uppercase tracking-[0.2em] rounded-xl hover:bg-[#2A2623] transition-colors cursor-pointer"
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
              className="fixed right-0 top-0 bottom-0 w-[85vw] max-w-sm bg-[#FFFDF9] z-[160] lg:hidden p-6 overflow-y-auto flex flex-col justify-between shadow-2xl"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-[#EFE8DC]">
                  <h3 className="font-serif text-xl font-semibold text-[#2A2623]">Filter Products</h3>
                  <button onClick={() => setShowMobileFilters(false)} className="p-2 text-gray-400 hover:text-black cursor-pointer">
                    <X size={20} />
                  </button>
                </div>
                <FilterSidebarContent />
              </div>
              <div className="pt-6 border-t border-[#EFE8DC] mt-6">
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full py-3 bg-[#2e0e43] text-white text-xs font-semibold uppercase tracking-[0.2em] rounded-xl shadow-md cursor-pointer"
                >
                  Apply Filters ({sortedProducts.length})
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Add To Cart Confirmation & Quantity Modal */}
      <AddToCartModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        product={addModalProduct}
      />

    </div>
  );
};

export default Shop;
