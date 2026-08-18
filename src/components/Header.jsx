import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Search, Menu, X, ShoppingBag, Heart, User,
  ChevronDown, ArrowRight, Loader2, Globe2
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
    "✦ Free Shipping Across India | Use Code VEL5 for 5% OFF on your first order ✦"
  ]);
  const [annIndex, setAnnIndex] = useState(0);
  const [dbCountries, setDbCountries] = useState([]);

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
    location.pathname === '/about' ||
    location.pathname.startsWith('/product/');

  const [scrolled, setScrolled] = useState(!isTransparentRoute || window.scrollY > 40);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaMenu, setMegaMenu] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState(null);

  const { user } = useAuth();
  const { cartCount, wishlistCount } = useStore();

  const navLinks = [
    { name: 'World Edit',    href: '/world-edit', hasDropdown: true },
    { name: 'New Arrivals',  href: '/shop?filter=new' },
    { name: 'Best Sellers',  href: '/shop?filter=bestsellers' },
    { name: 'Blogs',         href: '/blog' },
    { name: 'Our Story',     href: '/about' },
    { name: 'Contact Us',    href: '/contact' },
  ];

  useEffect(() => {
    if (!isTransparentRoute) {
      setScrolled(true);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [isTransparentRoute]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const headerBg = scrolled ? '#ffffff' : 'transparent';
  const headerBorder = scrolled ? 'rgba(0,0,0,0.06)' : 'transparent';
  const textColor = scrolled ? '#2A2623' : '#ffffff';

  return (
    <>
      <div className="relative z-[60] text-center py-2.5 px-4 h-[42px] overflow-hidden flex items-center justify-center" style={{ background: CRIMSON, position: 'fixed', top: 0, left: 0, right: 0 }}>
        <AnimatePresence mode="wait">
          <motion.p key={annIndex} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.35 }} className="text-[14px] tracking-[0.18em] font-medium text-white/90 truncate">
            {announcements[annIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      <header
        ref={(el) => {
          if (el) {
            document.documentElement.style.setProperty(
              '--header-height',
              el.getBoundingClientRect().bottom + 'px'
            );
          }
        }}
        className="w-full fixed z-50 transition-all duration-500"
        style={{ top: 0, paddingTop: 42, background: headerBg, borderBottom: `1px solid ${headerBorder}`, boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.08)' : 'none' }}
      >
        <div className="max-w-[1440px] mx-auto px-5 lg:px-12 flex items-center justify-between" style={{ height: scrolled ? '64px' : '80px', transition: 'height 0.4s ease' }}>
          <div className="flex items-center gap-3 flex-1">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2" style={{ color: textColor }} aria-label="Menu"><Menu size={22} /></button>
            <div className="hidden lg:flex items-center gap-2">
              <Link to="/shop" className="flex items-center gap-2 px-4 py-2 rounded-full border transition-all group" style={{ borderColor: scrolled ? 'rgba(42,38,35,0.18)' : 'rgba(255,255,255,0.22)', color: scrolled ? '#2A2623' : 'rgba(255,255,255,0.95)' }}>
                <Search size={16} /> <span className="text-[13px] font-bold tracking-[0.15em] uppercase">Search</span>
              </Link>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <Link to="/"><img src="/img/logo.png" alt="Velouraz" className="h-[36px] sm:h-[44px]" /></Link>
          </div>
          <div className="flex items-center justify-end gap-3 flex-1">
            <Link to="/wishlist" className="relative p-2" style={{ color: textColor }}><Heart size={20} />{wishlistCount > 0 && <BadgeDot count={wishlistCount} />}</Link>
            <Link to={user ? '/account' : '/login'} className="p-2" style={{ color: textColor }}><User size={20} /></Link>
            <Link to="/cart" className="relative p-2" style={{ color: textColor }}><ShoppingBag size={20} />{cartCount > 0 && <BadgeDot count={cartCount} />}</Link>
          </div>
        </div>

        <nav className="hidden lg:block" style={{ borderTop: `1px solid ${scrolled ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)'}` }}>
          <div className="max-w-[1440px] mx-auto flex justify-center gap-2">
            {navLinks.map((link) => (
              <div key={link.name} className="relative" onMouseEnter={() => setMegaMenu(link.name)} onMouseLeave={() => setMegaMenu(null)}>
                <Link to={link.href} className="flex items-center gap-1.5 px-6 py-3.5 text-[14px] tracking-[0.18em] font-bold uppercase transition-colors" style={{ color: megaMenu === link.name ? '#2e0e43' : (scrolled ? '#2A2623' : 'rgba(255,255,255,0.95)') }}>
                  {link.name} {link.hasDropdown && <ChevronDown size={13} style={{ transform: megaMenu === link.name ? 'rotate(180deg)' : 'none' }} />}
                  <span className="absolute bottom-0 left-4 right-4 h-[2px] transition-all" style={{ background: GOLD, transform: megaMenu === link.name ? 'scaleX(1)' : 'scaleX(0)' }} />
                </Link>
              </div>
            ))}
          </div>
        </nav>
      </header>

      {/* World Edit Mega Menu — rendered at root so fixed positioning works across full viewport */}
      <AnimatePresence>
        {megaMenu && navLinks.find(l => l.name === megaMenu)?.hasDropdown && (
          <div onMouseEnter={() => setMegaMenu(megaMenu)} onMouseLeave={() => setMegaMenu(null)}>
            <WorldEditDropdownPanel countries={dropdownCountries} onClose={() => setMegaMenu(null)} />
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm" />
            <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} className="fixed left-0 top-0 bottom-0 z-[100] w-[88vw] max-w-sm flex flex-col bg-[#0E0B09]">
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#C8A97A]/20">
                <img src="/img/logo.png" alt="Velouraz" className="h-9" />
                <button onClick={() => setMobileOpen(false)} className="text-white/60"><X size={18} /></button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {navLinks.map((link) => (
                  <div key={link.name} className="border-b border-[#C8A97A]/10">
                    <div className="flex justify-between items-center py-5 cursor-pointer" onClick={() => { if (link.hasDropdown) setMobileExpanded(mobileExpanded === link.name ? null : link.name); else { setMobileOpen(false); navigate(link.href); } }}>
                      <Link to={link.href} onClick={() => setMobileOpen(false)} className="text-xl text-white font-light" style={{ fontFamily: NAV_SERIF }}>{link.name}</Link>
                      {link.hasDropdown && <ChevronDown size={18} style={{ color: GOLD, transform: mobileExpanded === link.name ? 'rotate(180deg)' : 'none' }} />}
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
  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white bg-[#2e0e43]">
    {count}
  </span>
);

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
          <div style={{ marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(200,169,122,0.15)', pb: 16, paddingBottom: 16 }}>
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
                            justify: 'space-between',
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
