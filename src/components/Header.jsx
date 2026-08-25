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
                      <div className="mb-5 rounded-2xl p-4 bg-[#140D1C] border border-[#C8A97A]/25 space-y-3.5 shadow-lg">
                        <div className="flex items-center justify-between border-b border-[#C8A97A]/20 pb-2.5">
                          <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#C8A97A]">Featured World Edits</span>
                          <Link to="/world-edit" onClick={() => setMobileOpen(false)} className="text-[10px] font-bold uppercase tracking-wider text-[#F0D5A8] hover:text-white flex items-center gap-1">
                            View All <ArrowRight size={10} />
                          </Link>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          {worldEditMegaItems.map((item, idx) => (
                            <Link
                              key={`${item.country}-${idx}`}
                              to={item.href}
                              onClick={() => setMobileOpen(false)}
                              className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#C8A97A]/40 hover:bg-[#C8A97A]/10 transition-all group text-decoration-none"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-lg filter drop-shadow-xs">{item.flag}</span>
                                <div>
                                  <p className="text-sm font-medium text-white group-hover:text-[#F0D5A8] transition-colors leading-tight" style={{ fontFamily: NAV_SERIF }}>
                                    {item.country}
                                  </p>
                                  <p className="text-[10px] italic text-white/60 mt-0.5" style={{ fontFamily: NAV_SERIF }}>{item.subtitle}</p>
                                </div>
                              </div>
                              <ArrowRight size={12} className="text-[#C8A97A] group-hover:translate-x-1 transition-transform shrink-0" />
                            </Link>
                          ))}
                        </div>

                        <div className="pt-2 border-t border-[#C8A97A]/20 text-center">
                          <Link
                            to="/world-edit"
                            onClick={() => setMobileOpen(false)}
                            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#C8A97A] hover:text-white transition-colors py-1 text-decoration-none"
                          >
                            <span>Explore All Countries</span>
                            <ArrowRight size={12} />
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

const worldEditMegaItems = [
  {
    country: 'Paris',
    flag: '🇫🇷',
    subtitle: 'Inspired by Paris',
    collection: 'THE MAISON PARIS',
    cta: 'DISCOVER PARIS',
    href: '/shop?country=Paris',
    bgImage: 'https://res.cloudinary.com/dcjn4y284/image/upload/v1787672216/paris_vsqtxa.png',
  },
  {
    country: 'Thailand',
    flag: '🇹🇭',
    subtitle: 'Inspired by Thailand',
    collection: 'THE THAI GEMSTONE EDIT',
    cta: 'DISCOVER THAILAND',
    href: '/shop?country=Thailand',
    bgImage: 'https://res.cloudinary.com/dcjn4y284/image/upload/v1787672219/thiland_yz8axz.png',
  },
  {
    country: 'India',
    flag: '🇮🇳',
    subtitle: 'Inspired by India',
    collection: 'THE SIGNATURE COLLECTION',
    cta: 'DISCOVER INDIA',
    href: '/shop?country=India',
    bgImage: 'https://res.cloudinary.com/dcjn4y284/image/upload/v1787672225/india_yqlodw.png',
  },
  {
    country: 'Japan',
    flag: '🇯🇵',
    subtitle: 'Inspired by Japan',
    collection: 'THE MIYUKI ATELIER',
    cta: 'DISCOVER JAPAN',
    href: '/shop?country=Japan',
    bgImage: 'https://res.cloudinary.com/dcjn4y284/image/upload/v1787672222/japan_mzkd7z.png',
  },
  {
    country: 'South Korea',
    flag: '🇰🇷',
    subtitle: 'Inspired by South Korea',
    collection: 'THE PEARL EDIT',
    cta: 'DISCOVER SOUTH KOREA',
    href: '/shop?country=South%20Korea',
    bgImage: 'https://res.cloudinary.com/dcjn4y284/image/upload/v1787672225/south_korea_km1orl.png',
  },
];

const WorldEditDropdownPanel = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-0 right-0 z-[200] bg-[#0A070D] border-t border-[#C8A97A] border-b border-[#C8A97A]/20 shadow-[0_35px_90px_rgba(0,0,0,0.95)] overflow-hidden"
      style={{ top: 'var(--header-height, 148px)' }}
    >
      {/* Top Banner Bar */}
      <div className="border-b border-[#C8A97A]/20 bg-[#0F0B14] px-8 py-2.5 flex items-center justify-between z-20 relative">
        <div className="flex items-center gap-2 text-[11px] tracking-[0.25em] font-semibold text-[#C8A97A] uppercase">
          <Globe2 size={13} className="text-[#C8A97A]" />
          <span>The World Edit • Globally Curated Jewellery Collections</span>
        </div>
        <Link
          to="/world-edit"
          onClick={onClose}
          className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.2em] uppercase text-[#F0D5A8] hover:text-white transition-colors"
        >
          <span>Explore All Countries</span>
          <ArrowRight size={12} />
        </Link>
      </div>

      {/* 5 Vertical Columns Grid */}
      <div className="w-full max-w-[1600px] mx-auto grid grid-cols-5 divide-x divide-[#C8A97A]/20 min-h-[480px]">
        {worldEditMegaItems.map((item, index) => (
          <Link
            key={index}
            to={item.href}
            onClick={onClose}
            className="group relative p-7 flex flex-col justify-between overflow-hidden text-decoration-none min-h-[480px]"
          >
            {/* Full Background Image without color overlays */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img
                src={item.bgImage}
                alt={item.country}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {/* Soft transparent gradient only for text contrast */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/75 pointer-events-none" />
            </div>

            {/* Top Text Content */}
            <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xl filter drop-shadow-md">{item.flag}</span>
              </div>

              <div>
                <h3
                  className="text-3xl lg:text-4xl text-white font-normal tracking-tight group-hover:text-[#F0D5A8] transition-colors drop-shadow-md"
                  style={{ fontFamily: NAV_SERIF }}
                >
                  {item.country}
                </h3>
                <p className="text-xs lg:text-sm italic text-white/90 font-light mt-0.5 drop-shadow" style={{ fontFamily: NAV_SERIF }}>
                  {item.subtitle}
                </p>
              </div>

              {/* Accent Line */}
              <div className="w-8 group-hover:w-16 h-[1px] bg-[#C8A97A] transition-all duration-300 my-3.5 shadow-sm" />

              <div className="text-[11px] lg:text-[12px] font-bold tracking-[0.22em] uppercase text-[#F0D5A8] leading-tight drop-shadow">
                {item.collection}
              </div>
            </div>

            {/* Bottom Discover CTA */}
            <div className="relative z-10 pt-4 flex items-center justify-between text-[11px] font-bold tracking-[0.22em] uppercase text-white group-hover:text-[#F0D5A8] transition-colors drop-shadow-md">
              <span>{item.cta}</span>
              <ArrowRight size={14} className="text-[#C8A97A] group-hover:translate-x-2 transition-transform duration-300" />
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
};

export default LuxuryHeader;

