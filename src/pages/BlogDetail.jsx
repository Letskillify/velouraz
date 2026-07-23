import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db } from '../components/Firebase';
import { doc, getDoc, collection, getDocs, limit, query, where } from 'firebase/firestore';
import { Calendar, User, Clock, ArrowLeft, Share2, MessageCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const defaultBlogs = [
  {
    id: 'fallback-1',
    title: 'The Ultimate Jewellery Care Guide for Daily Luxury',
    category: 'Jewellery Care',
    author: 'Velouraz Editorial Team',
    readTime: '6 min read',
    createdAt: { toMillis: () => new Date('2026-06-15').getTime() },
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1200',
    excerpt: 'Preserve the luster of your conflict-free diamonds and 18k solid gold base with our step-by-step master guide for home preservation.',
    content: `Fine jewellery is an investment in beauty, heritage, and emotion. Whether your collection features conflict-free diamonds, precious gemstones, or classic 18k solid gold base, maintaining their brilliance requires consistent and careful attention. 

Here is our master guide on how to keep your pieces radiant for a lifetime.

### 1. General Handling Rules
Always put your jewellery on last when getting dressed. Cosmetics, hairsprays, perfumes, and lotions often contain chemicals that can dull the finish of precious metals and cloud the brilliance of stones. 

Conversely, make your jewellery the first thing you remove at the end of the day.

### 2. Routine Cleaning at Home
For solid gold and diamond pieces, a gentle home bath works wonders:
- Prepare a bowl of warm water with a few drops of mild dish soap.
- Soak the pieces for 10 to 15 minutes to loosen oils and daily grime.
- Use a very soft-bristled toothbrush to gently scrub the settings, especially underneath the stones where lotion and soap residue collect.
- Rinse thoroughly under clean running water.
- Pat dry with a clean, lint-free microfiber cloth.

### 3. Storing Your Masterpieces
Store your pieces individually in a soft fabric-lined tray or their original Velouraz pouch. Harder gems like diamonds can easily scratch softer gemstones and gold if they rub against each other. Keeping them separated prevents unwanted friction.`
  },
  {
    id: 'fallback-2',
    title: 'Autumn/Winter 2026 High Jewellery Styling Trends',
    category: 'Trends',
    author: 'Aria Dev, Styling Director',
    readTime: '4 min read',
    createdAt: { toMillis: () => new Date('2026-07-02').getTime() },
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1200',
    excerpt: 'From stacked crystal cuffs to statement emerald chokers, explore how leading tastemakers are layering jewellery this season.',
    content: `As we transition into the cooler months of 2026, high fashion and high jewellery are merging in spectacular ways. This season is defined by contrast—combining structured, heavy tailoring with delicate, light-catching accessories. 

Here are the major trends our design editors are tracking.

### 1. Layered Statement Necklaces
The single delicate chain is stepping aside to make way for artful, multi-layered arrangements. The key to this look is pairing different weights and styles:
- Start with a solid gold choker as a base.
- Add a medium-weight chain with an eye-catching pendant.
- Finish the look with a longer, finer lariat to elongate the collarline.

### 2. Mixed Metals
The old rule of sticking exclusively to white gold or yellow gold is gone. Combining platinum, solid yellow gold, and rose gold in a single stacked arrangement creates a modern, editorial aesthetic. When mixing metals, keep the gemstone color palette consistent to maintain visual harmony.`
  },
  {
    id: 'fallback-3',
    title: 'The Sacred Art of Kundan: A Craftsmanship Heritage',
    category: 'Craftsmanship',
    author: 'Rajiv Sen, Heritage Specialist',
    readTime: '8 min read',
    createdAt: { toMillis: () => new Date('2026-05-20').getTime() },
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1200',
    excerpt: 'An immersive look inside our ateliers where artisans practice centuries-old methods of setting raw gemstones in pure gold.',
    content: `Kundan is one of the oldest forms of jewellery making in India, possessing a rich heritage that dates back to the royal courts of the Mughal era. Today, the art is kept alive by highly skilled craftsmen who train for decades to master the delicate balance of heat, metal, and stones.

### The Meticulous Setting Process
Kundan creation is a collaborative process between different specialized artisans:
- **Ghaat**: The initial framing where gold strips are welded into shape.
- **Paadh**: The lac filling stage that provides stability inside the frames.
- **Khudai**: Engraving patterns into the gold.
- **Minakari**: Applying vibrant enamel colors to the back or sides of the gold frames.
- **Kundan**: Setting the gemstones by pressing pure, highly refined gold foil around the edges.

Because the foil is pure, refined gold, it creates a tight, highly reflective setting that amplifies the natural fire and brilliance of the raw gemstones.`
  }
];

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogDetail = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "blogs", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setBlog({ id: docSnap.id, ...docSnap.data() });
        } else {
          // Check fallback
          const fallback = defaultBlogs.find(b => b.id === id);
          if (fallback) {
            setBlog(fallback);
          } else {
            setBlog(null);
          }
        }
      } catch (err) {
        console.error("Error fetching blog details:", err);
        const fallback = defaultBlogs.find(b => b.id === id);
        setBlog(fallback || null);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogDetail();
  }, [id]);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const q = collection(db, "blogs");
        const snap = await getDocs(q);
        let list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (list.length === 0) {
          list = defaultBlogs;
        }
        setRelatedBlogs(list.filter(b => b.id !== id).slice(0, 3));
      } catch (err) {
        setRelatedBlogs(defaultBlogs.filter(b => b.id !== id).slice(0, 3));
      }
    };
    fetchRelated();
  }, [id]);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'July 2026';
    const date = new Date(timestamp.toMillis ? timestamp.toMillis() : timestamp);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Article link copied to clipboard!");
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`Check out this beautiful article: "${blog.title}" at ${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center pt-28">
        <Loader2 size={36} className="animate-spin text-[#7A0E2E]" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center pt-28 px-4 text-center">
        <h2 className="font-serif text-3xl text-[#222222] mb-4">Article Not Found</h2>
        <p className="text-sm text-[#7B6D63] mb-6">The article you are looking for does not exist or has been removed.</p>
        <Link to="/blog" className="px-6 py-2.5 bg-[#7A0E2E] text-white text-xs font-semibold uppercase tracking-[0.2em] rounded-xl hover:bg-[#2A2623] transition-colors">
          Back to Journal
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans text-[#2A2623] pt-24 pb-20">
      
      {/* Banner / Cover Image */}
      <div className="w-full h-[50vh] min-h-[350px] relative overflow-hidden bg-[#F3ECE1]">
        <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/10" />
        
        {/* Banner Details Overlay */}
        <div className="absolute bottom-0 left-0 right-0 max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 pb-10 text-white space-y-4">
          <span className="bg-[#B58E58] text-white text-[10px] uppercase font-bold tracking-[0.18em] px-3.5 py-1.5 rounded-sm inline-block">
            {blog.category}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[46px] leading-tight font-light tracking-tight">
            {blog.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-xs text-white/80 font-medium">
            <span className="flex items-center gap-1.5"><Calendar size={13} /> {formatDate(blog.createdAt)}</span>
            <span className="flex items-center gap-1.5"><User size={13} /> {blog.author}</span>
            <span className="flex items-center gap-1.5"><Clock size={13} /> {blog.readTime}</span>
          </div>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Navigation & Sharing Tools */}
        <div className="flex items-center justify-between border-b border-[#EFE8DC] pb-4 mb-8">
          <Link to="/blog" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#7B6D63] hover:text-[#7A0E2E] transition-colors">
            <ArrowLeft size={14} /> Back to Journal
          </Link>
          <div className="flex items-center gap-3">
            <button onClick={handleShare} className="p-2 bg-[#FFFDF9] rounded-full border border-[#EFE8DC] text-[#7B6D63] hover:text-[#7A0E2E] hover:border-[#7A0E2E] transition-all cursor-pointer shadow-sm" title="Copy Link">
              <Share2 size={14} />
            </button>
            <button onClick={handleShareWhatsApp} className="p-2 bg-[#FFFDF9] rounded-full border border-[#EFE8DC] text-[#7B6D63] hover:text-[#7A0E2E] hover:border-[#7A0E2E] transition-all cursor-pointer shadow-sm" title="Share on WhatsApp">
              <MessageCircle size={14} />
            </button>
          </div>
        </div>

        {/* Full Rich Text Content */}
        <article className="prose prose-[#2A2623] max-w-none font-serif text-base sm:text-lg text-[#2A2623]/95 leading-relaxed space-y-6 whitespace-pre-line">
          {blog.content}
        </article>

        {/* Related Articles Panel */}
        {relatedBlogs.length > 0 && (
          <div className="mt-20 pt-10 border-t border-[#EFE8DC]">
            <h3 className="font-serif text-2xl font-light text-[#222222] mb-8 text-center">Related Stories</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedBlogs.map((rBlog) => (
                <div key={rBlog.id} className="group bg-[#FFFDF9] rounded-xl border border-[#EFE8DC] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="relative aspect-video w-full overflow-hidden bg-[#F3ECE1]">
                    <img src={rBlog.image} alt={rBlog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4 space-y-2">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-[#B58E58] block">{rBlog.category}</span>
                    <h4 className="font-serif text-sm font-bold text-[#2A2623] leading-snug line-clamp-2 group-hover:text-[#7A0E2E] transition-colors">
                      <Link to={`/blog/${rBlog.id}`}>{rBlog.title}</Link>
                    </h4>
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

export default BlogDetail;
