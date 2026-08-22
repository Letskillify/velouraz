import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Search, Menu, X, ShoppingBag, Heart, User,
  ChevronDown, ArrowRight, Loader2, Globe2, Sparkles, Tag
} from 'lucide-react';
import { useAuth } from './useAuth';
import { useStore } from '../hooks/useStore';
import { db } from './Firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

/* ─── Design Tokens ──────────────────────────────────── */
const GOLD   = '#C8A97A';
const CRIMSON = '#2e0e43';
const NAV_SERIF = "'Cormorant Garamond', Georgia, serif";

const fallbackCountries = [
  "Turkey", "Japan", "India", "South Korea", "Europe",
  "China", "United Arab Emirates", "Italy", "Sri Lanka", "Brazil",
  "Thailand", "France", "Spain", "Germany", "United Kingdom"
];

const trendingTags = ['Kundan', 'Pearls', 'Bangles', 'Choker', 'Gold Plated', 'Silver', 'Rings'];

const getCountryFlag = (name = "") => {
  const n = name.toLowerCase();
  if (n.includes("turkey")) return "🇹🇷";
  if (n.includes("japan")) return "🇯🇵";
  if (n.includes("india")) return "🇮🇳";
  if (n.includes("korea")) return "🇰🇷";
  if (n.includes("europe") || n.includes("france")) return "⚜️";
  if (n.includes("china")) return "🇨🇳";
  if (n.includes("emirates") || n.includes("uae")) return "🇦🇪";
  if (n.includes("italy")) return "🇮🇹";
  if (n.includes("sri lanka")) return "🇱🇰";
  if (n.includes("brazil")) return "🇧🇷";
  if (n.includes("thailand")) return "🇹🇭";
  if (n.includes("spain")) return "🇪🇸";
  if (n.includes("germany")) return "🇩🇪";
  if (n.includes("uk") || n.includes("united kingdom")) return "🇬🇧";
  if (n.includes("us") || n.includes("united states")) return "🇺🇸";
  return "🌍";
};

const LuxuryHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([
    "✦ Complimentary Shipping Across India ✦"
  ]);
  const [annIndex, setAnnIndex] = useState(0);
  const [dbCountries, setDbCountries] = useState([]);

  // Search State
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    getDoc(doc(db, "site_settings", "announcements")).then((snap) => {
      if (snap.exists() && snap.data().items && snap.data().items.length > 0) {
        setAnnouncements(snap.data().items);
      }
    });

    getDocs(collection(db, "countries"))
      .then((snap) => {
        if (!snap.empty) {
          const list = snap.docs.map(d => d.data().name).filter(Boolean);
          const unique = Array.from(new Set(list));
          if (unique.length > 0) setDbCountries(unique.slice(0, 15));
        }
      })
      .catch((err) => console.error("Error fetching countries:", err));
  }, []);

  useEffect(() => {
    if (announcements.length <= 1) return;
    const interval = setInterval(() => {
      setAnnIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [announcements]);

  const dropdownCountries = useMemo(() => {
    return dbCountries.length >= 5 ? dbCountries.slice(0, 15) : fallbackCountries.slice(0, 15);
  }, [dbCountries]);

  const isTransparentRoute = 
    location.pathname === '/' ||
    location.pathname === '/shop' ||
    location.pathname === '/cart' ||
    location.pathname === '/wishlist' ||
    location.pathname.startsWith('/product/');

  const [scrolled, setScrolled] = useState(!isTransparentRoute || window.scrollY > 20);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaMenu, setMegaMenu] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState(null);

  const { user } = useAuth();
  const { cartCount, wishlistCount } = useStore();

  const navLinks = [
    { name: 'New Arrivals',  href: '/shop?filter=new' },
    { name: 'Best Sellers',  href: '/shop?filter=bestsellers' },
    { name: 'World Edit',    href: '/world-edit', hasDropdown: true },
    { name: 'Blogs',         href: '/blog' },
    { name: 'Our Story',     href: '/about' },
    { name: 'Contact Us',    href: '/contact' },
  ];

  useEffect(() => {
    if (!isTransparentRoute) {
      setScrolled(true);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [isTransparentRoute]);

  useEffect(() => {
    document.body.style.overflow = (mobileOpen || isSearchOpen) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen, isSearchOpen]);

  const headerBg = scrolled ? 'rgba(255, 255, 255, 0.96)' : 'transparent';
  const headerBorder = scrolled ? 'rgba(0,0,0,0.06)' : 'transparent';
  const textColor = scrolled ? '#2A2623' : '#ffffff';

  return (
    <>
      {/* Announcement Bar */}
      <div 
        className="relative z-[60] text-center py-1.5 px-4 h-[34px] overflow-hidden flex items-center justify-center shadow-xs" 
        style={{ background: CRIMSON, position: 'fixed', top: 0, left: 0, right: 0 }}
      >
        <AnimatePresence mode="wait">
          <motion.p 
            key={annIndex} 
            initial={{ opacity: 0, y: 12 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -12 }} 
            transition={{ duration: 0.3 }} 
            className="text-[12px] sm:text-[13px] tracking-[0.16em] font-medium text-white/90 truncate uppercase"
          >
            {announcements[annIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Main Header Container */}
      <header
        ref={(el) => {
          if (el) {
            document.documentElement.style.setProperty(
              '--header-height',
              el.getBoundingClientRect().bottom + 'px'
            );
          }
        }}
        className="w-full fixed z-50 transition-all duration-300 backdrop-blur-md"
        style={{ 
          top: 0, 
          paddingTop: 34, 
          background: headerBg, 
          borderBottom: `1px solid ${headerBorder}`, 
          boxShadow: scrolled ? '0 4px 25px rgba(0,0,0,0.06)' : 'none' 
        }}
      >
        {/* Compact Header Top Bar */}
        <div 
          className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between" 
          style={{ height: scrolled ? '56px' : '64px', transition: 'height 0.3s ease' }}
        >
          {/* Left: Mobile Menu & Icon-only Search */}
          <div className="flex items-center gap-1 sm:gap-3 flex-1">
            <button 
              onClick={() => setMobileOpen(true)} 
              className="lg:hidden p-1.5 sm:p-2 rounded-full hover:bg-black/5 transition-all" 
              style={{ color: textColor }} 
              aria-label="Menu"
            >
              <Menu className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px]" />
            </button>
            
            {/* Search Icon Only (Desktop & Mobile) */}
            <button 
              onClick={() => setIsSearchOpen(true)} 
              className="p-1.5 sm:p-2.5 rounded-full hover:bg-black/5 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer group" 
              style={{ color: textColor }} 
              title="Search Products"
              aria-label="Search"
            >
              <Search className="w-[17px] h-[17px] sm:w-[21px] sm:h-[21px] group-hover:text-[#2e0e43] transition-colors" />
            </button>
          </div>

          {/* Center: Larger Prominent Logo */}
          <div className="flex-1 flex justify-center items-center">
            <Link to="/" className="inline-block transition-transform hover:scale-102 active:scale-98">
              <img 
                src="/img/logo.png" 
                alt="Velouraz" 
                className="transition-all duration-300 object-contain drop-shadow-xs" 
                style={{ 
                  height: scrolled ? '38px' : '48px',
                  maxHeight: '56px'
                }}
              />
            </Link>
          </div>

          {/* Right: Icons (Wishlist, Account, Cart) */}
          <div className="flex items-center justify-end gap-0.5 sm:gap-2 flex-1">
            <Link 
              to="/wishlist" 
              className="relative p-1.5 sm:p-2.5 rounded-full hover:bg-black/5 hover:scale-105 active:scale-95 transition-all" 
              style={{ color: textColor }}
              title="Wishlist"
            >
              <Heart className="w-[17px] h-[17px] sm:w-[20px] sm:h-[20px]" />
              {wishlistCount > 0 && <BadgeDot count={wishlistCount} />}
            </Link>
            
            <Link 
              to={user ? '/account' : '/login'} 
              className="p-1.5 sm:p-2.5 rounded-full hover:bg-black/5 hover:scale-105 active:scale-95 transition-all" 
              style={{ color: textColor }}
              title={user ? "My Account" : "Sign In"}
            >
              <User className="w-[17px] h-[17px] sm:w-[20px] sm:h-[20px]" />
            </Link>
            
            <Link 
              to="/cart" 
              className="relative p-1.5 sm:p-2.5 rounded-full hover:bg-black/5 hover:scale-105 active:scale-95 transition-all" 
              style={{ color: textColor }}
              title="Shopping Bag"
            >
              <ShoppingBag className="w-[17px] h-[17px] sm:w-[20px] sm:h-[20px]" />
              {cartCount > 0 && <BadgeDot count={cartCount} />}
            </Link>
          </div>
        </div>

        {/* Navigation Links Bar */}
        <nav className="hidden lg:block" style={{ borderTop: `1px solid ${scrolled ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.08)'}` }}>
          <div className="max-w-[1440px] mx-auto flex justify-center gap-1">
            {navLinks.map((link) => (
              <div key={link.name} className="relative" onMouseEnter={() => setMegaMenu(link.name)} onMouseLeave={() => setMegaMenu(null)}>
                <Link 
                  to={link.href} 
                  className="flex items-center gap-1.5 px-5 py-2.5 text-[13px] tracking-[0.18em] font-bold uppercase transition-colors" 
                  style={{ color: scrolled ? '#2A2623' : 'rgba(255,255,255,0.95)' }}
                >
                  {link.name} {link.hasDropdown && <ChevronDown size={12} style={{ transform: megaMenu === link.name ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />}
                  <span 
                    className="absolute bottom-0 left-4 right-4 h-[2px] transition-all duration-300" 
                    style={{ background: GOLD, transform: megaMenu === link.name ? 'scaleX(1)' : 'scaleX(0)' }} 
                  />
                </Link>
              </div>
            ))}
          </div>
        </nav>
      </header>

      {/* Interactive Search Overlay Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <SearchOverlayModal onClose={() => setIsSearchOpen(false)} />
        )}
      </AnimatePresence>

      {/* World Edit Mega Menu */}
      <AnimatePresence>
        {megaMenu && navLinks.find(l => l.name === megaMenu)?.hasDropdown && (
          <div onMouseEnter={() => setMegaMenu(megaMenu)} onMouseLeave={() => setMegaMenu(null)}>
            <WorldEditDropdownPanel countries={dropdownCountries} onClose={() => setMegaMenu(null)} />
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setMobileOpen(false)} 
              className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm" 
            />
            <motion.aside 
              initial={{ x: '-100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '-100%' }} 
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed left-0 top-0 bottom-0 z-[100] w-[88vw] max-w-sm flex flex-col bg-[#0E0B09] shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#C8A97A]/20">
                <img src="/img/logo.png" alt="Velouraz" className="h-10 object-contain" />
                <button onClick={() => setMobileOpen(false)} className="p-2 text-white/60 hover:text-white rounded-full"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {navLinks.map((link) => (
                  <div key={link.name} className="border-b border-[#C8A97A]/10">
                    <div className="flex justify-between items-center py-4 cursor-pointer" onClick={() => { if (link.hasDropdown) setMobileExpanded(mobileExpanded === link.name ? null : link.name); else { setMobileOpen(false); navigate(link.href); } }}>
                      <Link to={link.href} onClick={() => setMobileOpen(false)} className="text-xl text-white font-light" style={{ fontFamily: NAV_SERIF }}>{link.name}</Link>
                      {link.hasDropdown && <ChevronDown size={18} style={{ color: GOLD, transform: mobileExpanded === link.name ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />}
                    </div>
                    {link.hasDropdown && mobileExpanded === link.name && (
                      <div className="mb-5 rounded-xl p-4 bg-[#C8A97A]/10 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#C8A97A]">Explore Countries</span>
                          <Link to="/world-edit" onClick={() => setMobileOpen(false)} className="text-[11px] font-bold uppercase tracking-wider text-[#C8A97A] underline flex items-center gap-1">
                            Explore More <ArrowRight size={10} />
                          </Link>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {dropdownCountries.map((c) => (
                            <Link key={c} to={`/shop?country=${encodeURIComponent(c)}`} onClick={() => setMobileOpen(false)} className="flex items-center gap-2 text-xs text-white/80 hover:text-[#C8A97A]">
                              <span>{getCountryFlag(c)}</span> <span className="truncate">{c}</span>
                            </Link>
                          ))}
                        </div>
                        <div className="pt-2 border-t border-white/10 text-center">
                          <Link to="/world-edit" onClick={() => setMobileOpen(false)} className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-white hover:text-[#C8A97A]">
                            Explore More Countries <ArrowRight size={12} />
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const BadgeDot = ({ count }) => (
  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white bg-[#2e0e43] border border-white">
    {count}
  </span>
);

/* ─── Interactive Search Overlay Modal ────────────────────── */
const SearchOverlayModal = ({ onClose }) => {
  const [queryStr, setQueryStr] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();

    // Fetch initial products for search lookup
    setLoading(true);
    getDocs(collection(db, "products"))
      .then((snap) => {
        if (!snap.empty) {
          setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        }
      })
      .catch((err) => console.error("Search fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  const searchResults = useMemo(() => {
    if (!queryStr.trim()) return [];
    const q = queryStr.toLowerCase().trim();
    return products.filter(p => {
      const nameMatch = p.name?.toLowerCase().includes(q);
      const catMatch = p.category?.toLowerCase().includes(q);
      const matMatch = p.material?.toLowerCase().includes(q);
      const tagMatch = Array.isArray(p.tags) && p.tags.some(t => String(t).toLowerCase().includes(q));
      return nameMatch || catMatch || matMatch || tagMatch;
    }).slice(0, 6);
  }, [queryStr, products]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (queryStr.trim()) {
      navigate(`/shop?search=${encodeURIComponent(queryStr.trim())}`);
      onClose();
    }
  };

  const handleTagClick = (tag) => {
    setQueryStr(tag);
    navigate(`/shop?search=${encodeURIComponent(tag)}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex flex-col justify-start">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Main Search Panel */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{ type: "spring", damping: 25, stiffness: 280 }}
        className="relative z-10 w-full bg-white shadow-2xl border-b border-gray-100"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
          {/* Header & Input Form */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search size={22} className="absolute left-4 text-[#2e0e43]" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search jewellery, bangles, necklaces, Kundan..."
              value={queryStr}
              onChange={(e) => setQueryStr(e.target.value)}
              className="w-full pl-12 pr-12 py-3.5 sm:py-4 bg-gray-50 border border-gray-200 rounded-2xl text-base sm:text-lg text-gray-900 outline-none focus:border-[#2e0e43] focus:bg-white transition-all shadow-inner"
            />
            {queryStr ? (
              <button
                type="button"
                onClick={() => setQueryStr('')}
                className="absolute right-4 p-1.5 text-gray-400 hover:text-gray-700 rounded-full cursor-pointer"
              >
                <X size={18} />
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 p-1.5 text-gray-400 hover:text-gray-700 rounded-full cursor-pointer"
              >
                <X size={20} />
              </button>
            )}
          </form>

          {/* Trending Tags */}
          <div className="flex items-center flex-wrap gap-2 pt-1">
            <span className="text-xs uppercase font-bold tracking-widest text-gray-400 flex items-center gap-1 mr-1">
              <Sparkles size={13} className="text-[#C8A97A]" /> Popular:
            </span>
            {trendingTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagClick(tag)}
                className="px-3 py-1 bg-gray-100 hover:bg-[#2e0e43] hover:text-white rounded-full text-xs font-semibold text-gray-700 transition-all cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Live Search Results Preview */}
          {queryStr.trim() !== '' && (
            <div className="space-y-4 pt-2 border-t border-gray-100 max-h-[60vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-widest text-gray-500">
                  Matching Products ({searchResults.length})
                </span>
                <button
                  onClick={handleSearchSubmit}
                  className="text-xs font-bold text-[#2e0e43] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  View all in Shop <ArrowRight size={12} />
                </button>
              </div>

              {loading ? (
                <div className="py-8 text-center text-gray-400 flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin text-[#2e0e43]" size={20} /> Searching catalogue...
                </div>
              ) : searchResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {searchResults.map((item) => (
                    <Link
                      key={item.id}
                      to={`/product/${item.id}`}
                      onClick={onClose}
                      className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 hover:border-[#2e0e43]/30 hover:bg-gray-50/80 transition-all group"
                    >
                      <img
                        src={item.image || 'img/jewellery/j.png'}
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded-lg bg-gray-100 shrink-0 group-hover:scale-105 transition-transform"
                      />
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-gray-900 truncate leading-snug group-hover:text-[#2e0e43]">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-gray-500 mt-0.5">{item.category}</p>
                        <p className="text-xs font-bold text-[#2e0e43] mt-1">
                          ₹{Number(item.price || 0).toLocaleString()}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 font-medium">No direct matches found for "{queryStr}"</p>
                  <button
                    onClick={handleSearchSubmit}
                    className="mt-2 text-xs font-bold text-[#2e0e43] underline cursor-pointer"
                  >
                    Search full catalogue in Shop
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const countryRegions = [
  {
    region: 'ASIAN ARTISANSHIP',
    icon: '⛩',
    items: [
      { name: 'Japan', desc: 'Miyuki Glass & Pearls', flag: '🇯🇵' },
      { name: 'India', desc: 'Kundan & Silver Heritage', flag: '🇮🇳' },
      { name: 'South Korea', desc: 'Minimal Luxe & Crystals', flag: '🇰🇷' },
      { name: 'Thailand', desc: 'Handcrafted Silver', flag: '🇹🇭' },
      { name: 'China', desc: 'Carved Jade & Cloisonné', flag: '🇨🇳' },
    ]
  },
  {
    region: 'EUROPE & MEDITERRANEAN',
    icon: '⚜',
    items: [
      { name: 'Paris', desc: 'Atelier Haute Couture', flag: '⚜️' },
      { name: 'Italy', desc: 'Venetian Fine Gold', flag: '🇮🇹' },
      { name: 'Turkey', desc: 'Filigree & Evil Eye', flag: '🇹🇷' },
      { name: 'Spain', desc: 'Traditional Pearl & Lace', flag: '🇪🇸' },
      { name: 'United Kingdom', desc: 'Heritage Royal Jewels', flag: '🇬🇧' },
    ]
  },
  {
    region: 'MIDDLE EAST & GLOBAL',
    icon: '☽',
    items: [
      { name: 'United Arab Emirates', desc: 'Arabian Statement Luxe', flag: '🇦🇪' },
      { name: 'Sri Lanka', desc: 'Natural Sapphire & Gems', flag: '🇱🇰' },
      { name: 'Brazil', desc: 'Raw Crystal & Quartz', flag: '🇧🇷' },
      { name: 'Germany', desc: 'Precision Craft & Metal', flag: '🇩🇪' },
      { name: 'Explore All Countries', desc: 'View Full 15+ World Edit', flag: '🌍', isLinkToWorldEdit: true },
    ]
  }
];

const WorldEditDropdownPanel = ({ countries, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed',
        top: 'var(--header-height, 148px)',
        left: 0,
        right: 0,
        zIndex: 200,
        background: '#0F0A14',
        borderTop: '1px solid #C8A97A',
        borderBottom: '1px solid rgba(200, 169, 122, 0.2)',
        boxShadow: '0 36px 90px rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(24px)',
      }}
    >
      <div style={{ maxWidth: 1440, margin: '0 auto', display: 'flex', minHeight: 420 }}>

        {/* ── Left & Middle: 3 Regional Editorial Columns ─── */}
        <div style={{ flex: 1, padding: '36px 56px', overflowY: 'auto' }}>
          <div style={{ marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(200,169,122,0.15)', paddingBottom: 16 }}>
            <div>
              <span style={{ fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', color: GOLD, fontWeight: 700 }}>
                ✦ THE WORLD EDIT
              </span>
              <h3 style={{ fontFamily: NAV_SERIF, fontSize: 24, color: '#ffffff', fontWeight: 400, marginTop: 2 }}>
                Global Jewellery Traditions & Cultural Ateliers
              </h3>
            </div>
            <Link
              to="/world-edit"
              onClick={onClose}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                padding: '9px 22px',
                borderRadius: 9999,
                background: '#2e0e43',
                color: '#ffffff',
                border: '1px solid rgba(200, 169, 122, 0.4)',
                textDecoration: 'none',
                transition: 'all 0.3s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = GOLD;
                e.currentTarget.style.color = '#0F0A14';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#2e0e43';
                e.currentTarget.style.color = '#ffffff';
              }}
            >
              <span>Explore More Countries</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* 3 Regional Columns Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40 }}>
            {countryRegions.map((col, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 14, color: GOLD }}>{col.icon}</span>
                  <h4 style={{ fontSize: 11, letterSpacing: '0.25em', fontWeight: 700, textTransform: 'uppercase', color: GOLD }}>
                    {col.region}
                  </h4>
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {col.items.map((item, i) => {
                    const targetLink = item.isLinkToWorldEdit 
                      ? '/world-edit' 
                      : `/shop?country=${encodeURIComponent(item.name)}`;

                    return (
                      <li key={i}>
                        <Link
                          to={targetLink}
                          onClick={onClose}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '6px 10px',
                            borderRadius: 8,
                            textDecoration: 'none',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = 'rgba(200, 169, 122, 0.1)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = 'transparent';
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontSize: 18 }}>{item.flag}</span>
                            <div>
                              <p style={{
                                fontFamily: NAV_SERIF,
                                fontSize: 16,
                                color: item.isLinkToWorldEdit ? GOLD : '#ffffff',
                                fontWeight: item.isLinkToWorldEdit ? 700 : 500,
                                margin: 0,
                                lineHeight: 1.2
                              }}>
                                {item.name}
                              </p>
                              <span style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.45)', display: 'block', marginTop: 2 }}>
                                {item.desc}
                              </span>
                            </div>
                          </div>
                          <ArrowRight size={12} style={{ color: GOLD, opacity: 0.7 }} />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          {/* Footer Banner */}
          <div style={{ marginTop: 28, paddingTop: 16, borderTop: '1px solid rgba(200, 169, 122, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
              ✦ Discover rare artisanal jewellery techniques from over 15 countries worldwide.
            </p>
            <Link
              to="/world-edit"
              onClick={onClose}
              style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}
              onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
              onMouseLeave={e => e.currentTarget.style.color = GOLD}
            >
              Explore More Countries <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* ── Right Column: Editorial Visual Card ─── */}
        <div style={{ width: 350, position: 'relative', overflow: 'hidden', borderLeft: '1px solid rgba(200, 169, 122, 0.15)', flexShrink: 0 }}>
          <img
            src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800"
            alt="World Edit Editorial"
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.75)', transition: 'transform 1.2s ease' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(15, 10, 20, 0.95) 0%, rgba(15, 10, 20, 0.35) 60%, transparent 100%)',
            display: 'flex', flexDirection: 'column', justify: 'flex-end', padding: '36px 32px',
          }}>
            <span style={{ fontSize: 10, letterSpacing: '0.45em', fontWeight: 700, textTransform: 'uppercase', color: GOLD, marginBottom: 8 }}>
              CURATED GLOBAL HERITAGE
            </span>
            <h3 style={{ fontFamily: NAV_SERIF, fontSize: 24, fontStyle: 'italic', fontWeight: 300, color: '#ffffff', marginBottom: 10, lineHeight: 1.2 }}>
              Craftsmanship Across 15+ Countries
            </h3>
            <p style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.65)', marginBottom: 22, lineHeight: 1.6 }}>
              From Turkish filigree to Japanese Miyuki beads and Indian silver. Experience timeless cultural beauty.
            </p>
            <Link
              to="/world-edit"
              onClick={onClose}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                fontSize: 11, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase',
                padding: '13px 26px', background: '#2e0e43', color: '#ffffff', textDecoration: 'none',
                border: '1px solid rgba(200, 169, 122, 0.4)',
                transition: 'all 0.3s', width: 'fit-content',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = GOLD; e.currentTarget.style.color = '#0F0A14'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#2e0e43'; e.currentTarget.style.color = '#ffffff'; }}
            >
              Explore World Edit <ArrowRight size={12} strokeWidth={2} />
            </Link>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default LuxuryHeader;

