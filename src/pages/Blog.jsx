import React, { useState, useEffect } from 'react';
import { db } from '../components/Firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Search, Calendar, User, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Breadcrumb from '../components/Breadcrumb';

const defaultBlogs = [
  {
    id: 'fallback-1',
    title: 'The Ultimate Jewellery Care Guide for Daily Luxury',
    category: 'Jewellery Care',
    author: 'Velouraz Editorial Team',
    readTime: '6 min read',
    createdAt: { toMillis: () => new Date('2026-06-15').getTime() },
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1200',
    excerpt: 'Preserve the luster of your conflict-free diamonds and 18k solid gold base with our step-by-step master guide for home preservation.'
  },
  {
    id: 'fallback-2',
    title: 'Autumn/Winter 2026 High Jewellery Styling Trends',
    category: 'Trends',
    author: 'Aria Dev, Styling Director',
    readTime: '4 min read',
    createdAt: { toMillis: () => new Date('2026-07-02').getTime() },
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1200',
    excerpt: 'From stacked crystal cuffs to statement emerald chokers, explore how leading tastemakers are layering jewellery this season.'
  },
  {
    id: 'fallback-3',
    title: 'The Sacred Art of Kundan: A Craftsmanship Heritage',
    category: 'Craftsmanship',
    author: 'Rajiv Sen, Heritage Specialist',
    readTime: '8 min read',
    createdAt: { toMillis: () => new Date('2026-05-20').getTime() },
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1200',
    excerpt: 'An immersive look inside our ateliers where artisans practice centuries-old methods of setting raw gemstones in pure gold.'
  }
];

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setBlogs(list);
        } else {
          setBlogs(defaultBlogs);
        }
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setBlogs(defaultBlogs);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const categories = ['All', 'Jewellery Care', 'Trends', 'Craftsmanship', 'Style Guide'];

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || blog.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredBlog = filteredBlogs[0];
  const regularBlogs = filteredBlogs.slice(1);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'July 2026';
    const date = new Date(timestamp.toMillis ? timestamp.toMillis() : timestamp);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans text-[#2A2623]">
      {/* Premium Breadcrumb Hero (Similar to Shop Page) */}
      <Breadcrumb 
        title="The Journal"
        subtitle="Artisanal stories, high jewelry trends, style guides, and exclusive styling perspectives."
        bgImage="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1600"
        links={[
          { name: 'Home', href: '/' },
          { name: 'Journal', href: '/blog', active: true }
        ]}
      />

      {/* Filter Options & Search Bar */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 mb-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-[#EFE8DC] pb-6">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-2.5 justify-center md:justify-start">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#7A0E2E] text-white shadow-sm'
                    : 'bg-[#FFFDF9] text-[#7B6D63] border border-[#EFE8DC] hover:border-[#B58E58] hover:text-[#7A0E2E]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B58E58]" size={15} />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#FFFDF9] border border-[#EFE8DC] rounded-xl pl-10 pr-4 py-2.5 text-xs md:text-sm text-[#2A2623] outline-none focus:border-[#7A0E2E] transition-all placeholder:text-[#7B6D63]/50"
            />
          </div>
        </div>
      </div>

      {/* Main Articles Container */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pb-20">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-[#FFFDF9] rounded-2xl p-4 border border-[#EFE8DC]">
                <div className="aspect-video bg-[#F3ECE1] rounded-xl mb-4" />
                <div className="h-4 bg-[#F3ECE1] rounded w-3/4 mb-2" />
                <div className="h-3 bg-[#F3ECE1] rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredBlogs.length > 0 ? (
          <div className="space-y-16">
            {/* Featured Article Card */}
            {featuredBlog && activeCategory === 'All' && !searchTerm && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="group grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#FFFDF9] rounded-3xl border border-[#EFE8DC] overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.06)] transition-all duration-300"
              >
                <div className="lg:col-span-7 aspect-video lg:aspect-[4/3] overflow-hidden relative bg-[#F3ECE1]">
                  <img
                    src={featuredBlog.image}
                    alt={featuredBlog.title}
                    className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                  />
                  <span className="absolute top-4 left-4 bg-[#7A0E2E] text-white text-[10px] uppercase font-bold tracking-[0.18em] px-3.5 py-1.5 rounded-sm">
                    {featuredBlog.category}
                  </span>
                </div>
                <div className="lg:col-span-5 p-6 sm:p-8 lg:p-12 flex flex-col justify-center space-y-4">
                  <div className="flex items-center gap-4 text-xs font-semibold tracking-wider text-[#B58E58]">
                    <span className="flex items-center gap-1.5"><Calendar size={13} /> {formatDate(featuredBlog.createdAt)}</span>
                    <span className="flex items-center gap-1.5"><Clock size={13} /> {featuredBlog.readTime}</span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-[#222222] leading-tight group-hover:text-[#7A0E2E] transition-colors">
                    <Link to={`/blog/${featuredBlog.id}`}>{featuredBlog.title}</Link>
                  </h2>
                  <p className="text-sm text-[#7B6D63] font-sans font-light leading-relaxed">
                    {featuredBlog.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-[#EFE8DC] mt-4">
                    <span className="text-xs font-semibold text-[#2A2623]">{featuredBlog.author}</span>
                    <Link
                      to={`/blog/${featuredBlog.id}`}
                      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#7A0E2E] hover:text-[#2A2623] transition-colors"
                    >
                      Read Article <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Grid of Other Articles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(activeCategory !== 'All' || searchTerm ? filteredBlogs : regularBlogs).map((blog, idx) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (idx % 3) * 0.05 }}
                  className="group bg-[#FFFDF9] rounded-2xl border border-[#EFE8DC] overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.06)] hover:border-[#D5C6B1] transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-video w-full overflow-hidden bg-[#F3ECE1]">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <span className="absolute top-3 left-3 bg-[#7A0E2E] text-white text-[9px] uppercase font-bold tracking-[0.18em] px-2.5 py-1 rounded-sm">
                        {blog.category}
                      </span>
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-3 text-[10px] font-semibold text-[#B58E58] tracking-wider font-sans">
                        <span className="flex items-center gap-1"><Calendar size={11} /> {formatDate(blog.createdAt)}</span>
                        <span className="flex items-center gap-1"><Clock size={11} /> {blog.readTime}</span>
                      </div>

                      <h3 className="font-serif text-lg md:text-xl font-bold text-[#2A2623] leading-snug group-hover:text-[#7A0E2E] transition-colors line-clamp-2">
                        <Link to={`/blog/${blog.id}`}>{blog.title}</Link>
                      </h3>

                      <p className="text-xs md:text-sm text-[#7B6D63] font-sans font-light leading-relaxed line-clamp-3">
                        {blog.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-3 border-t border-[#EFE8DC]/60 flex items-center justify-between bg-gray-50/20 mt-auto">
                    <span className="text-[11px] font-semibold text-[#2A2623]">{blog.author}</span>
                    <Link
                      to={`/blog/${blog.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#7A0E2E] hover:text-[#2A2623] transition-colors"
                    >
                      Read <ArrowRight size={12} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-[#FFFDF9] rounded-2xl border border-[#EFE8DC] p-8 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
            <BookOpen size={36} className="mx-auto text-[#B58E58]/50 mb-3" />
            <h3 className="font-serif text-2xl text-[#2A2623] mb-2 font-light">No journal entries found</h3>
            <p className="text-xs md:text-sm text-[#7B6D63] max-w-md mx-auto mb-6">Try broadening your search term or selecting another category.</p>
            <button
              onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}
              className="px-8 py-3 bg-[#7A0E2E] text-white text-xs font-semibold uppercase tracking-[0.2em] rounded-xl hover:bg-[#2A2623] transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
