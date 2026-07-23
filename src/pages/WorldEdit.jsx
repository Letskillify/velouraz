import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../components/Firebase';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Globe2, Sparkles, Filter, ShoppingBag, Eye, Heart } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import { useStore } from '../hooks/useStore';

const defaultCountries = [
  {
    id: 'turkey',
    name: 'Turkey',
    code: 'TR',
    flag: '🇹🇷',
    collection: 'Evil Eye & Oxidised Collection',
    tagline: 'Sacred protection & Ottoman artisanal heritage',
    description: 'Intricately handcrafted enamel, protective talismans, and dark oxidised silver inspired by ancient Mediterranean ateliers.',
    image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=1200',
    featuredItems: ['Evil Eye Amulets', 'Teardrop Earrings', 'Enamel Necklaces']
  },
  {
    id: 'japan',
    name: 'Japan',
    code: 'JP',
    flag: '🇯🇵',
    collection: 'Miyuki & Pearl Collection',
    tagline: 'Precision beadwork & serene minimalist elegance',
    description: 'Delicate glass seed beads and pristine Akoya pearls woven into lightweight, modern architectural silhouettes.',
    image: 'https://images.unsplash.com/photo-1544413660-299165566b1d?auto=format&fit=crop&q=80&w=1200',
    featuredItems: ['Miyuki Chokers', 'Minimal Pearl Drops', 'Silk Thread Sets']
  },
  {
    id: 'india',
    name: 'India',
    code: 'IN',
    flag: '🇮🇳',
    collection: 'Heritage Kundan & Polki',
    tagline: 'Royal court luxury & timeless craft',
    description: 'Centuries-old technique of setting uncut gems in pure gold foils, accented by rich Meenakari enamel artwork.',
    image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=1200',
    featuredItems: ['Raw Gemstone Chokers', 'Jadau Earrings', 'Bridal Sets']
  },
  {
    id: 'south-korea',
    name: 'South Korea',
    code: 'KR',
    flag: '🇰🇷',
    collection: 'Korean Luxe & Crystal Edits',
    tagline: 'Contemporary drama & ethereal glass sheen',
    description: 'Statement ear cuffs, asymmetric drop earrings, and sleek layered chains favored by Seoul fashion directors.',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1200',
    featuredItems: ['Layered Chains', 'Asymmetric Drops', 'Crystal Cuffs']
  },
  {
    id: 'europe',
    name: 'Europe',
    code: 'EU',
    flag: '⚜️',
    collection: 'Charms & Modern Gold',
    tagline: 'Parisian chic & Milanese refined gold',
    description: 'Clean tennis bracelets, baroque pearl pendants, and versatile gold charms designed for daily sophisticated layering.',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1200',
    featuredItems: ['Tennis Bracelets', 'Baroque Pendants', 'Gold Hoops']
  },
  {
    id: 'china',
    name: 'China',
    code: 'CN',
    flag: '🇨🇳',
    collection: 'Jade & Carved Gemstones',
    tagline: 'Imperial jadeite & symbolic harmony',
    description: 'Polished green and white jade carved into symbolic coins, lotus petals, and lucky charms wrapped in solid gold settings.',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1200',
    featuredItems: ['Jade Pendants', 'Carved Bangles', 'Lucky Coins']
  }
];

const WorldEdit = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [loading, setLoading] = useState(true);

  const { addToCart, addToWishlist, isInCart, isInWishlist } = useStore();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snap = await getDocs(collection(db, "products"));
        if (!snap.empty) {
          setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        }
      } catch (err) {
        console.error("Error fetching products for World Edit:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Compute product count per country
  const countryCounts = useMemo(() => {
    const counts = {};
    defaultCountries.forEach(c => {
      counts[c.name] = products.filter(p => p.country && p.country.toLowerCase() === c.name.toLowerCase()).length;
    });
    return counts;
  }, [products]);

  const filteredCountries = selectedCountry === 'All' 
    ? defaultCountries 
    : defaultCountries.filter(c => c.name.toLowerCase() === selectedCountry.toLowerCase());

  // Featured products matching active selected country tab
  const countryProducts = useMemo(() => {
    if (selectedCountry === 'All') return products.slice(0, 8);
    return products.filter(p => p.country && p.country.toLowerCase() === selectedCountry.toLowerCase());
  }, [products, selectedCountry]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans text-[#2A2623]">
      {/* Hero Header */}
      <Breadcrumb
        title="The World Edit"
        subtitle="Explore luxury jewellery collections inspired by global cultures, artisanal heritage, and world traditions."
        bgImage="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=1600"
        links={[
          { name: 'Home', href: '/' },
          { name: 'World Edit', href: '/world-edit', active: true }
        ]}
      />

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-12">

        {/* Section Intro */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-[#B58E58]" />
            <span className="text-xs md:text-sm tracking-[0.3em] font-bold text-[#B58E58] uppercase">
              Global Artisanal Journeys
            </span>
            <span className="w-8 h-px bg-[#B58E58]" />
          </div>
          <h2 className="font-serif font-light text-3xl md:text-5xl text-[#222222]">
            Curated by <span className="italic text-[#7A0E2E]">Country & Culture</span>
          </h2>
          <p className="text-xs md:text-sm text-[#7B6D63] font-serif font-light leading-relaxed">
            Select a region below to discover handcrafted statement pieces, traditional motifs, and iconic craftsmanship from across the globe.
          </p>
        </div>

        {/* Country Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12 border-b border-[#EFE8DC] pb-6">
          <button
            onClick={() => setSelectedCountry('All')}
            className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              selectedCountry === 'All'
                ? 'bg-[#7A0E2E] text-white shadow-md'
                : 'bg-[#FFFDF9] text-[#7B6D63] border border-[#EFE8DC] hover:border-[#B58E58] hover:text-[#7A0E2E]'
            }`}
          >
            🌐 All Countries ({defaultCountries.length})
          </button>
          {defaultCountries.map((country) => (
            <button
              key={country.id}
              onClick={() => setSelectedCountry(country.name)}
              className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                selectedCountry === country.name
                  ? 'bg-[#7A0E2E] text-white shadow-md'
                  : 'bg-[#FFFDF9] text-[#7B6D63] border border-[#EFE8DC] hover:border-[#B58E58] hover:text-[#7A0E2E]'
              }`}
            >
              <span>{country.flag}</span>
              <span>{country.name}</span>
              {countryCounts[country.name] > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  selectedCountry === country.name ? 'bg-white/20 text-white' : 'bg-[#EFE8DC] text-[#2A2623]'
                }`}>
                  {countryCounts[country.name]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Country Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {filteredCountries.map((c, idx) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="group bg-[#FFFDF9] rounded-3xl border border-[#EFE8DC] overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.08)] hover:border-[#C8A97A] transition-all duration-500 flex flex-col justify-between"
            >
              <div>
                {/* Image Cover */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F3ECE1]">
                  <img
                    src={c.image}
                    alt={c.name}
                    className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Flag & Name Badge Overlay */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-[#1A1613]/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-white">
                    <span className="text-base">{c.flag}</span>
                    <span className="text-xs font-bold uppercase tracking-widest">{c.name}</span>
                  </div>

                  {/* Dynamic Product Count */}
                  <div className="absolute top-4 right-4 bg-[#7A0E2E] text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full shadow-md">
                    {countryCounts[c.name] || 0} Products Available
                  </div>

                  {/* Title Overlay on Image Bottom */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-[#C8A97A] text-[11px] font-bold uppercase tracking-widest mb-0.5">
                      {c.collection}
                    </p>
                    <h3 className="font-serif text-2xl font-light leading-tight">
                      {c.tagline}
                    </h3>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-4">
                  <p className="text-xs text-[#7B6D63] font-sans font-light leading-relaxed">
                    {c.description}
                  </p>

                  {/* Featured Signature Elements */}
                  <div className="pt-2 border-t border-[#EFE8DC]/60">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#B58E58] block mb-2">
                      Key Highlights
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {c.featuredItems.map((item, i) => (
                        <span key={i} className="text-[10px] font-medium bg-[#FAF7F2] border border-[#EFE8DC] text-[#2A2623] px-2.5 py-1 rounded-md">
                          ✦ {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button Footer */}
              <div className="p-6 pt-0 mt-auto">
                <button
                  onClick={() => navigate(`/shop?country=${encodeURIComponent(c.name)}`)}
                  className="w-full h-12 bg-[#2A2623] text-white text-xs font-bold uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-2 group-hover:bg-[#7A0E2E] transition-all duration-300 cursor-pointer shadow-sm"
                >
                  Explore {c.name} Collection <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Live Product Showcase Section */}
        {countryProducts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-[#EFE8DC]">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
              <div>
                <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#B58E58]">Live Catalogue</span>
                <h3 className="font-serif text-3xl text-[#222222] font-light">
                  {selectedCountry === 'All' ? 'Featured Global Pieces' : `${selectedCountry} Jewellery Highlights`}
                </h3>
              </div>

              <button
                onClick={() => navigate(`/shop${selectedCountry !== 'All' ? `?country=${encodeURIComponent(selectedCountry)}` : ''}`)}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#7A0E2E] hover:text-[#2A2623] transition-colors cursor-pointer"
              >
                View All {selectedCountry !== 'All' ? selectedCountry : ''} Products in Shop <ArrowRight size={14} />
              </button>
            </div>

            {/* Showcase Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {countryProducts.slice(0, 8).map((product) => (
                <div
                  key={product.id}
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="group bg-[#FFFDF9] rounded-2xl border border-[#EFE8DC] overflow-hidden shadow-sm hover:shadow-md hover:border-[#C8A97A] transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-[#F3ECE1]">
                    <img
                      src={product.image || product.images?.[0] || 'img/jewellery/j.png'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.country && (
                      <span className="absolute top-2 left-2 bg-black/75 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                        {product.country}
                      </span>
                    )}
                  </div>
                  <div className="p-4 space-y-1.5">
                    <span className="text-[10px] font-semibold text-[#B58E58] uppercase tracking-wider block">
                      {product.category || 'Jewellery'}
                    </span>
                    <h4 className="font-serif text-sm font-bold text-[#2A2623] truncate group-hover:text-[#7A0E2E] transition-colors">
                      {product.name}
                    </h4>
                    <p className="font-serif text-base font-light text-[#222222]">
                      ₹{Number(product.price).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default WorldEdit;
