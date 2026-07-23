import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Search, Menu, X, ShoppingBag, Heart, User, Package,
  ChevronDown, ChevronLeft, ChevronRight, ArrowRight, Loader2,
} from 'lucide-react';
import { useAuth } from './useAuth';
import { useStore } from '../hooks/useStore';
import { db } from './Firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

/* ─── Design Tokens ──────────────────────────────────── */
const GOLD   = '#C8A97A';
const CRIMSON = '#7A0E2E';
const DARK   = 'rgba(10,7,5,0.88)';
const NAV_SERIF = "'Cormorant Garamond', Georgia, serif";

const LuxuryHeader = () => {
  const location = useLocation();
  const [announcements, setAnnouncements] = useState([
    "✦ Free Shipping Across India | Use Code VEL5 for 5% OFF on your first order ✦"
  ]);
  const [annIndex, setAnnIndex] = useState(0);
  const [dbMegaMenus, setDbMegaMenus] = useState(null);

  useEffect(() => {
    getDoc(doc(db, "site_settings", "announcements")).then((snap) => {
      if (snap.exists() && snap.data().items && snap.data().items.length > 0) {
        setAnnouncements(snap.data().items);
      }
    });

    getDoc(doc(db, "site_settings", "mega_menus")).then((snap) => {
      if (snap.exists()) {
        setDbMegaMenus(snap.data());
      }
    });
  }, []);

  useEffect(() => {
    if (announcements.length <= 1) return;
    const interval = setInterval(() => {
      setAnnIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [announcements]);
  
  // Public pages with a dark image/gradient banner at the top
  const isTransparentRoute = 
    location.pathname === '/' ||
    location.pathname === '/shop' ||
    location.pathname === '/cart' ||
    location.pathname === '/wishlist' ||
    location.pathname === '/about' ||
    location.pathname.startsWith('/product/');

  const navigate                          = useNavigate();
  const [scrolled, setScrolled]           = useState(!isTransparentRoute || window.scrollY > 40);
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [megaMenu, setMegaMenu]           = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [searchOpen, setSearchOpen]       = useState(false);
  const [searchVal, setSearchVal]         = useState('');
  const [productsCache, setProductsCache] = useState([]);
  const [fetchingProducts, setFetchingProducts] = useState(false);

  const { user }                          = useAuth();
  const { cartCount, wishlistCount }      = useStore();

  useEffect(() => {
    if (searchOpen && productsCache.length === 0) {
      setFetchingProducts(true);
      getDocs(collection(db, "products"))
        .then((snap) => {
          const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          setProductsCache(list);
        })
        .catch((err) => {
          console.error("Error fetching products for live search:", err);
        })
        .finally(() => {
          setFetchingProducts(false);
        });
    }
  }, [searchOpen, productsCache.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    if (searchOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen]);

  const liveResults = useMemo(() => {
    const q = searchVal.trim().toLowerCase();
    if (!q) return [];
    return productsCache.filter((p) => {
      const name = p.name?.toLowerCase() || '';
      const cat = p.category?.toLowerCase() || '';
      const brand = p.brand?.toLowerCase() || '';
      const desc = p.description?.toLowerCase() || '';
      const tags = Array.isArray(p.tags) ? p.tags.join(' ').toLowerCase() : '';
      return name.includes(q) || cat.includes(q) || brand.includes(q) || desc.includes(q) || tags.includes(q);
    });
  }, [searchVal, productsCache]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const queryStr = searchVal.trim();
    setSearchOpen(false);
    if (queryStr) {
      navigate(`/shop?search=${encodeURIComponent(queryStr)}`);
    } else {
      navigate('/shop');
    }
  };

  const handleTagClick = (tag) => {
    setSearchVal(tag);
    setSearchOpen(false);
    navigate(`/shop?search=${encodeURIComponent(tag)}`);
  };

  const handleProductClick = (productId) => {
    setSearchOpen(false);
    navigate(`/product/${productId}`);
  };

  useEffect(() => {
    if (!isTransparentRoute) {
      setScrolled(true);
      return;
    }
    
    // Set initial scroll state
    setScrolled(window.scrollY > 40);
    
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.pathname, isTransparentRoute]);

  /* lock body scroll when mobile menu or search is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen || searchOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen, searchOpen]);

  /* Helpers to format dynamic mega menus */
  const formatSections = (key, defaultSections) => {
    if (!dbMegaMenus || !dbMegaMenus[key] || !dbMegaMenus[key].sections) return defaultSections;
    return dbMegaMenus[key].sections.map((section) => ({
      title: section.title,
      icon: section.icon || "✧",
      items: typeof section.items === "string"
        ? section.items.split(",").map((i) => i.trim()).filter(Boolean)
        : section.items || []
    }));
  };

  const formatImage = (key, defaultImg) => dbMegaMenus?.[key]?.image || defaultImg;
  const formatTagline = (key, defaultTag) => dbMegaMenus?.[key]?.tagline || defaultTag;
  const formatHeading = (key, defaultHead) => dbMegaMenus?.[key]?.heading || defaultHead;

  /* ─ Nav Data ──────────────────────────────────────── */
  const navLinks = [
    {
      name: 'Collections', href: '/shop',
      megaMenu: {
        sections: formatSections('collections', [
          { title: 'JEWELLERY SETS', icon: '𝓥', items: ['Kundan Sets','Polki Sets','American Diamond Sets','Temple Jewellery Sets','Minimal Sets'] },
          { title: 'EARRINGS',       icon: '❂', items: ['Stud Earrings','Jhumka','Hoops','Chandbali','Drop Earrings'] },
          { title: 'NECKLACES',      icon: '◇', items: ['Choker Necklaces','Short Necklaces','Long Necklaces','Layered Necklaces','Pendant Necklaces'] },
          { title: 'RINGS',          icon: '○', items: ['Statement Rings','Adjustable Rings','Cocktail Rings','Stacking Rings','Band Rings'] },
          { title: 'BANGLES',        icon: '◎', items: ['Kada Bangles','Stone Bangles','Lac Bangles','Gold Plated Bangles','Pearl Bangles'] },
          { title: 'ANKLETS',        icon: '✧', items: ['Charms Anklets','Beaded Anklets','Chain Anklets','Oxidised Anklets','Minimal Anklets'] },
        ]),
        image: formatImage('collections', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800'),
        tagline: formatTagline('collections', 'TIMELESS BEAUTY'),
        heading: formatHeading('collections', 'Crafted to Be Cherished'),
      },
    },
    {
      name: 'World Edit', href: '/world-edit',
      megaMenu: {
        sections: formatSections('world_edit', [
          { title: 'KOREAN EDIT',   icon: '⛩', items: ['Pearl Collection','Minimal Luxe','Crystal Drops','Layered Necklaces','Statement Earrings'] },
          { title: 'TURKISH EDIT',  icon: '🕌', items: ['Evil Eye Collection','Oxidised Silver','Teardrop Earrings','Enamel Jewellery','Layered Necklaces'] },
          { title: 'INDIAN EDIT',   icon: '◈', items: ['Kundan Jewellery','Polki Sets','Temple Jewels','Meenakari Collection','Jadau Jewellery'] },
          { title: 'ARABIAN EDIT',  icon: '☽', items: ['Statement Sets','Gold Plated','Coin Jewellery','Chunky Chains','Dangle Earrings'] },
          { title: 'EUROPEAN EDIT', icon: '⚜', items: ['Minimal Gold','Pearl Jewellery','Sleek Rings','Hoop Earrings','Tennis Bracelets'] },
          { title: 'THAI EDIT',     icon: '❋', items: ['Beaded Jewellery','Handcrafted Silver','Color Stone Earrings','Floral Motifs','Boho Necklaces'] },
        ]),
        image: formatImage('world_edit', 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800'),
        tagline: formatTagline('world_edit', 'BEAUTY HAS NO BOUNDARIES'),
        heading: formatHeading('world_edit', 'Jewellery Inspired by Cultures, Crafted for You.'),
      },
    },
    {
      name: 'The Edit', href: '/the-edit',
      megaMenu: {
        sections: formatSections('the_edit', [
          { title: 'TRENDING LUXE', icon: '✧', items: ['Statement Pieces','Korean Luxe','Minimal Gold','Pearl Trends','Layered Looks'] },
          { title: 'BEST SELLERS',  icon: '♡', items: ['Top Rated','Customer Favorites','Most Loved Earrings','Most Loved Necklaces','Most Loved Sets'] },
        ]),
        image: formatImage('the_edit', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800'),
        tagline: formatTagline('the_edit', 'Curated Picks, Loved by Many'),
        heading: formatHeading('the_edit', 'HANDPICKED. TRENDING. TIMELESS.'),
      },
    },
    { name: 'Journal',          href: '/journal' },
    { name: 'Our Story',        href: '/about' },
   
  ];

  /* ─── Derived header style ────────────────────────── */
  const headerBg     = scrolled ? '#ffffff' : 'transparent';
  const headerBorder = scrolled ? 'rgba(0,0,0,0.06)' : 'transparent';
  const textColor    = scrolled ? '#2A2623' : '#ffffff';
  const logoFilter   = scrolled ? 'brightness(0)' : 'brightness(0) invert(1)';   // black on scroll, white at top

  return (
    <>
      {/* ── Announcement Bar ──────────────────────────── */}
      <div
        className="relative z-[60] text-center py-2.5 px-4 h-[42px] overflow-hidden flex items-center justify-center"
        style={{ background: CRIMSON, position: 'fixed', top: 0, left: 0, right: 0 }}
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={annIndex}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="text-[14px] md:text-[14px] tracking-[0.18em] font-medium text-white/90 truncate max-w-full"
          >
            {announcements[annIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* ── Main Header ───────────────────────────────── */}
      <header
        className="w-full fixed z-50 transition-all duration-500"
        style={{
          top: 0,
          left: 0,
          right: 0,
          paddingTop: 42,
          background: headerBg,
          backdropFilter: scrolled ? 'none' : 'none',
          WebkitBackdropFilter: 'none',
          borderBottom: `1px solid ${headerBorder}`,
          boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.08)' : 'none',
        }}
      >
        <div
          className="max-w-[1440px] mx-auto px-5 lg:px-12 flex items-center justify-between"
          style={{ height: scrolled ? '64px' : '80px', transition: 'height 0.4s ease' }}
        >

          {/* ── Left cluster: hamburger (mobile) + search + nav-icons (desktop) */}
          <div className="flex items-center gap-3 flex-1">
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 transition-colors"
              style={{ color: textColor }}
              aria-label="Open menu"
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>

            {/* Desktop icon buttons */}
            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 group cursor-pointer"
                style={{
                  borderColor: scrolled ? 'rgba(42,38,35,0.18)' : 'rgba(255,255,255,0.22)',
                  color: scrolled ? '#2A2623' : 'rgba(255,255,255,0.95)',
                }}
              >
                <Search size={16} strokeWidth={1.5} className="group-hover:text-[#7A0E2E] transition-colors" />
                <span className="text-[13px] font-bold tracking-[0.15em] uppercase group-hover:text-[#7A0E2E] transition-colors font-sans">
                  Search
                </span>
              </button>
            </div>

            {/* Mobile Search */}
            <button
              className="lg:hidden p-2 transition-colors"
              style={{ color: textColor }}
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>
          </div>

          {/* ── Center: Logo ─────────────────────────── */}
          <div className="flex-1 flex justify-center">
            <Link to="/" className="block transition-transform duration-500 hover:scale-105">
              <img
                src="/img/logo.png"
                alt="Velouraz Jewellery"
                className="object-contain"
                style={{
                  height: scrolled ? '36px' : '44px',
                  transition: 'all 0.4s ease',
                  filter: logoFilter,
                }}
              />
            </Link>
          </div>

          {/* ── Right cluster: wishlist • account • cart ─ */}
          <div className="flex items-center justify-end gap-1 md:gap-3 flex-1">
            <Link
              to="/wishlist"
              className="relative p-2 hidden sm:flex items-center transition-colors duration-300 group"
              style={{ color: textColor }}
            >
              <Heart
                size={20}
                strokeWidth={1.5}
                className="group-hover:scale-110 transition-transform"
                style={{ color: wishlistCount > 0 ? GOLD : 'inherit' }}
              />
              {wishlistCount > 0 && (
                <BadgeDot count={wishlistCount} />
              )}
            </Link>

            <div className="hidden md:flex items-center">
              {/* <Link
                to={user ? '/orders' : '/login'}
                className="p-2 flex items-center transition-colors duration-300 group"
                style={{ color: textColor }}
                title="My Orders"
              >
                <Package
                  size={20}
                  strokeWidth={1.5}
                  className="group-hover:scale-110 transition-transform"
                />
              </Link> */}
              <Link
                to={user ? '/account' : '/login'}
                className="p-2 flex items-center transition-colors duration-300 group"
                style={{ color: textColor }}
                title="Account Settings"
              >
                <User
                  size={20}
                  strokeWidth={1.5}
                  className="group-hover:scale-110 transition-transform"
                />
              </Link>
            </div>

            <Link
              to="/cart"
              className="relative p-2 flex items-center transition-colors duration-300 group"
              style={{ color: textColor }}
            >
              <ShoppingBag
                size={20}
                strokeWidth={1.5}
                className="group-hover:scale-110 transition-transform"
                style={{ color: cartCount > 0 ? GOLD : 'inherit' }}
              />
              {cartCount > 0 && (
                <BadgeDot count={cartCount} />
              )}
            </Link>
          </div>
        </div>

        {/* ── Desktop Navigation ────────────────────── */}
        <nav
          className="hidden lg:block"
          style={{ borderTop: `1px solid ${scrolled ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)'}` }}
        >
          <div className="max-w-[1440px] mx-auto flex justify-center gap-2">
            {navLinks.map((link) => (
              <div
                key={link.name}
                className="static"
                onMouseEnter={() => setMegaMenu(link.name)}
                onMouseLeave={() => setMegaMenu(null)}
              >
                <Link
                  to={link.href}
                  className="flex items-center gap-2 px-6 py-3.5 relative group transition-colors duration-200"
                  style={{
                    color: megaMenu === link.name ? '#7A0E2E' : (scrolled ? '#2A2623' : 'rgba(255,255,255,0.95)'),
                    fontSize: '14px',
                    letterSpacing: '0.18em',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                  }}
                >
                  {link.name}
                  {link.megaMenu && (
                    <ChevronDown
                      size={13}
                      className="transition-transform duration-300"
                      style={{ transform: megaMenu === link.name ? 'rotate(180deg)' : 'none' }}
                    />
                  )}
                  {/* Gold underline */}
                  <span
                    className="absolute bottom-0 left-4 right-4 h-[2px] transition-all duration-300 origin-left"
                    style={{
                      background: GOLD,
                      transform: megaMenu === link.name ? 'scaleX(1)' : 'scaleX(0)',
                    }}
                  />
                </Link>

                {/* Mega Menu */}
                <AnimatePresence>
                  {megaMenu === link.name && link.megaMenu && (
                    <MegaMenuPanel link={link} />
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </nav>
      </header>

      {/* ── Fullscreen Search Overlay ─────────────────── */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[200] flex flex-col items-center justify-start pt-20 pb-10 px-4 sm:px-6 overflow-y-auto"
            style={{ background: 'rgba(10,7,5,0.96)', backdropFilter: 'blur(24px)' }}
          >
            {/* Close Button */}
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute top-6 right-6 sm:top-8 sm:right-10 p-2 text-white/50 hover:text-white transition-colors rounded-full hover:bg-white/10"
              aria-label="Close search"
            >
              <X size={26} strokeWidth={1.2} />
            </button>

            <motion.div
              initial={{ y: 25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-3xl flex flex-col items-center my-auto"
            >
              <p
                className="text-center text-[16px] sm:text-[16px] tracking-[0.4em] uppercase mb-6 font-semibold"
                style={{ color: GOLD }}
              >
                Search Our Luxury Collections
              </p>

              {/* Form Input */}
              <form onSubmit={handleSearchSubmit} className="w-full relative mb-8">
                <div className="relative flex items-center border-b-2 border-white/20 focus-within:border-[#C8A97A] transition-colors duration-300 pb-1">
                  <button type="submit" className="p-2 text-white/40 hover:text-[#C8A97A] transition-colors">
                    <Search size={22} strokeWidth={1.5} />
                  </button>
                  <input
                    autoFocus
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    placeholder="Search jewellery, styles, collections..."
                    className="w-full bg-transparent px-3 py-3 text-white text-xl sm:text-2xl font-light placeholder-white/25 outline-none"
                    style={{ fontFamily: NAV_SERIF }}
                  />
                  {searchVal ? (
                    <button
                      type="button"
                      onClick={() => setSearchVal('')}
                      className="p-2 text-white/40 hover:text-white transition-colors"
                      aria-label="Clear search text"
                    >
                      <X size={18} />
                    </button>
                  ) : null}
                  <button
                    type="submit"
                    className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-[#7A0E2E] text-white text-[16px] uppercase tracking-widest font-semibold rounded hover:bg-[#921438] transition-all ml-2 whitespace-nowrap"
                  >
                    Search <ArrowRight size={13} />
                  </button>
                </div>
              </form>

              {/* Popular Tags when search is empty */}
              {!searchVal.trim() && (
                <div className="w-full text-center space-y-4">
                  <p className="text-[16px] tracking-[0.25em] text-white/40 uppercase font-medium">Popular Searches</p>
                  <div className="flex flex-wrap gap-2.5 justify-center">
                    {['Kundan Sets', 'Pearl Necklaces', 'Statement Rings', 'Korean Edit', 'Minimal Luxe', 'Bangles', 'Earrings'].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleTagClick(tag)}
                        className="px-4 py-2 rounded-full border border-white/10 text-white/70 hover:border-[#C8A97A] hover:text-[#C8A97A] hover:bg-[#C8A97A]/5 transition-all duration-200 text-[16px] tracking-wider uppercase font-medium"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Live Search Results */}
              {searchVal.trim() && (
                <div className="w-full space-y-6">
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <span className="text-[16px] tracking-[0.2em] text-white/60 uppercase">
                      {fetchingProducts ? 'Searching...' : `Found ${liveResults.length} ${liveResults.length === 1 ? 'product' : 'products'}`}
                    </span>
                    {liveResults.length > 0 && (
                      <button
                        onClick={handleSearchSubmit}
                        className="text-[16px] tracking-[0.15em] text-[#C8A97A] hover:underline uppercase font-medium flex items-center gap-1"
                      >
                        View all in shop <ArrowRight size={12} />
                      </button>
                    )}
                  </div>

                  {fetchingProducts ? (
                    <div className="flex items-center justify-center py-12 text-[#C8A97A]">
                      <Loader2 size={28} className="animate-spin" />
                    </div>
                  ) : liveResults.length > 0 ? (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[50vh] overflow-y-auto pr-1">
                        {liveResults.slice(0, 6).map((product) => (
                          <div
                            key={product.id}
                            onClick={() => handleProductClick(product.id)}
                            className="flex items-center gap-3.5 p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#C8A97A]/40 transition-all cursor-pointer group"
                          >
                            <div className="w-16 h-16 rounded overflow-hidden bg-black/30 flex-shrink-0 border border-white/10">
                              <img
                                src={product.image || product.images?.[0] || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=200'}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[16px] tracking-[0.2em] uppercase text-[#C8A97A] font-semibold truncate">
                                {product.category || 'Jewellery'}
                              </p>
                              <h4
                                className="text-white text-sm font-medium line-clamp-1 group-hover:text-[#C8A97A] transition-colors"
                                style={{ fontFamily: NAV_SERIF }}
                              >
                                {product.name}
                              </h4>
                              <p className="text-white/70 text-base font-semibold mt-0.5">
                                ₹{Number(product.price || 0).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 text-center">
                        <button
                          onClick={handleSearchSubmit}
                          className="w-full sm:w-auto px-8 py-3.5 bg-[#7A0E2E] text-white text-[16px] font-bold tracking-[0.2em] uppercase rounded hover:bg-[#921438] transition-all flex items-center justify-center gap-2 mx-auto"
                        >
                          View all {liveResults.length} results for "{searchVal.trim()}" <ArrowRight size={14} />
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12 space-y-4">
                      <p className="text-white/60 text-base" style={{ fontFamily: NAV_SERIF }}>
                        No products found matching "<span className="text-[#C8A97A]">{searchVal}</span>"
                      </p>
                      <button
                        onClick={handleSearchSubmit}
                        className="px-6 py-2.5 border border-[#C8A97A] text-[#C8A97A] text-[16px] font-bold tracking-widest uppercase rounded hover:bg-[#C8A97A] hover:text-[#0E0B09] transition-all"
                      >
                        Search for "{searchVal}" in Shop catalog
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile Drawer ─────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[90]"
              style={{ background: 'rgba(10,7,5,0.6)', backdropFilter: 'blur(4px)' }}
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              className="fixed left-0 top-0 bottom-0 z-[100] w-[88vw] max-w-sm flex flex-col overflow-hidden"
              style={{ background: '#0E0B09' }}
            >
              {/* Drawer header */}
              <div
                className="flex items-center justify-between px-6 py-5"
                style={{ borderBottom: '1px solid rgba(200,169,122,0.12)' }}
              >
                <img src="/img/logo.png" alt="Velouraz" className="h-9" style={{ filter: 'invert(1)' }} />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-full transition-colors"
                  style={{ border: '1px solid rgba(200,169,122,0.2)', color: 'rgba(255,255,255,0.6)' }}
                >
                  <X size={18} strokeWidth={1.5} />
                </button>
              </div>

              {/* Nav items */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {navLinks.map((link) => (
                  <div
                    key={link.name}
                    style={{ borderBottom: '1px solid rgba(200,169,122,0.08)' }}
                  >
                    <div
                      className="flex justify-between items-center py-5 cursor-pointer"
                      onClick={() => {
                        if (link.megaMenu) {
                          setMobileExpanded(mobileExpanded === link.name ? null : link.name);
                        } else {
                          setMobileOpen(false);
                        }
                      }}
                    >
                      {link.megaMenu ? (
                        <span
                          className="text-xl font-light text-white"
                          style={{ fontFamily: NAV_SERIF }}
                        >
                          {link.name}
                        </span>
                      ) : (
                        <Link
                          to={link.href}
                          onClick={() => setMobileOpen(false)}
                          className="text-xl font-light text-white"
                          style={{ fontFamily: NAV_SERIF }}
                        >
                          {link.name}
                        </Link>
                      )}
                      {link.megaMenu && (
                        <ChevronDown
                          size={18}
                          strokeWidth={1.5}
                          style={{
                            color: GOLD,
                            transform: mobileExpanded === link.name ? 'rotate(180deg)' : 'rotate(0)',
                            transition: 'transform 0.3s ease',
                          }}
                        />
                      )}
                    </div>

                    <AnimatePresence>
                      {mobileExpanded === link.name && link.megaMenu && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div
                            className="mb-5 rounded-lg p-5 space-y-6"
                            style={{ background: 'rgba(200,169,122,0.06)' }}
                          >
                            {link.megaMenu.sections.map((section, idx) => (
                              <div key={idx} className="space-y-3">
                                <p
                                  className="text-[16px] tracking-[0.28em] uppercase font-bold"
                                  style={{ color: GOLD }}
                                >
                                  {section.icon} {section.title}
                                </p>
                                <ul className="space-y-2 pl-3">
                                  {section.items.map((item, i) => (
                                    <li key={i}>
                                      <Link
                                        to={`${link.href}?item=${item.toLowerCase().replace(/ /g, '-')}`}
                                        onClick={() => setMobileOpen(false)}
                                        className="text-sm text-white/55 hover:text-white transition-colors"
                                        style={{ fontFamily: NAV_SERIF }}
                                      >
                                        {item}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* Drawer footer */}
              <div
                className="px-8 py-6"
                style={{ borderTop: '1px solid rgba(200,169,122,0.12)', background: 'rgba(200,169,122,0.04)' }}
              >
                <div className="flex justify-around items-center">
                  {[
                    { to: '/wishlist', icon: <Heart size={20} strokeWidth={1.5} />, label: 'Wishlist' },
                    { to: '/account', icon: <User size={20} strokeWidth={1.5} />, label: 'Profile' },
                    { to: '/cart',    icon: <ShoppingBag size={20} strokeWidth={1.5} />, label: 'Cart' },
                  ].map(({ to, icon, label }) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setMobileOpen(false)}
                      className="flex flex-col items-center gap-1.5 transition-colors group"
                      style={{ color: 'rgba(255,255,255,0.45)' }}
                    >
                      <span className="group-hover:text-[#C8A97A] transition-colors">{icon}</span>
                      <span
                        className="text-[16px] tracking-[0.22em] uppercase group-hover:text-[#C8A97A] transition-colors"
                      >
                        {label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

/* ─── Badge Dot ──────────────────────────────────────── */
const BadgeDot = ({ count }) => (
  <span
    className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[16px] font-bold text-white"
    style={{ background: '#7A0E2E' }}
  >
    {count}
  </span>
);

/* ─── Header Icon Button ─────────────────────────────── */
const HdrIconBtn = ({ children, onClick, label, scrolled }) => (
  <button
    onClick={onClick}
    aria-label={label}
    className="group p-2.5 rounded-full border transition-all duration-300"
    style={{
      borderColor: scrolled ? 'rgba(42,38,35,0.18)' : 'rgba(255,255,255,0.22)',
      color: scrolled ? '#2A2623' : 'rgba(255,255,255,0.85)',
    }}
  >
    <span className="group-hover:text-[#7A0E2E] transition-colors block">{children}</span>
  </button>
);

/* ─── Mega Menu Panel ────────────────────────────────── */
const MegaMenuPanel = ({ link }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 8 }}
    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    className="absolute top-full left-0 w-full z-[100]"
    style={{
      background: '#FDFAF6',
      borderTop: '1px solid rgba(0,0,0,0.07)',
      boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
    }}
  >
    <div className="max-w-[1440px] mx-auto flex h-[420px]">
      {/* Links */}
      <div className="flex-1 py-10 px-12 overflow-y-auto">
        <div
          className={`grid gap-x-12 gap-y-8 ${
            link.megaMenu.sections.length <= 2 ? 'grid-cols-2' : 'grid-cols-3'
          }`}
        >
          {link.megaMenu.sections.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xl opacity-60" style={{ color: '#7A0E2E' }}>{section.icon || '✦'}</span>
                <h4
                  className="text-[16px] tracking-[0.26em] font-bold uppercase"
                  style={{ color: '#7A0E2E' }}
                >
                  {section.title}
                </h4>
              </div>
              <ul className="space-y-2.5 pl-9">
                {section.items.map((item, i) => (
                  <li key={i}>
                    <Link
                      to={`${link.href}?item=${item.toLowerCase().replace(/ /g, '-')}`}
                      className="text-[14.5px] text-[#2A2623]/70 hover:text-white hover:bg-[#7A0E2E] px-2 py-0.5 -ml-2 transition-all duration-200 block"
                      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                    >
                      {item}
                    </Link>
                  </li>
                ))}
                <li className="pt-1">
                  <Link
                    to={`${link.href}?category=${section.title.toLowerCase().replace(/ /g, '-')}`}
                    className="inline-flex items-center gap-1.5 text-[16px] font-bold uppercase tracking-wider transition-colors"
                    style={{ color: '#C8A97A' }}
                  >
                    Shop all <ArrowRight size={11} strokeWidth={2.5} />
                  </Link>
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Promo image */}
      <div
        className="w-[380px] relative overflow-hidden flex-shrink-0 group"
        style={{ borderLeft: '1px solid rgba(200,169,122,0.10)' }}
      >
        <img
          src={link.megaMenu.image}
          alt={link.name}
          className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
        />
        <div
          className="absolute inset-0 flex flex-col justify-end p-10"
          style={{ background: 'linear-gradient(to top, rgba(10,7,5,0.85) 0%, rgba(10,7,5,0.15) 55%, transparent 100%)' }}
        >
          <span
            className="text-[16px] tracking-[0.45em] font-bold uppercase mb-3"
            style={{ color: '#C8A97A' }}
          >
            {link.megaMenu.tagline}
          </span>
          <h3
            className="text-2xl italic font-light text-white mb-6 leading-snug"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            {link.megaMenu.heading}
          </h3>
          <Link
            to={link.href}
            className="inline-flex items-center gap-3 text-[16px] font-bold tracking-[0.25em] uppercase px-7 py-3.5 transition-all duration-300 hover:gap-5 w-fit"
            style={{ background: '#7A0E2E', color: '#fff' }}
          >
            Explore Collections <ArrowRight size={12} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </div>
  </motion.div>
);

export default LuxuryHeader;
