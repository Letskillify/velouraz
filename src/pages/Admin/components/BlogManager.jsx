import React, { useState, useEffect } from 'react';
import { db } from '../../../components/Firebase';
import { 
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy 
} from 'firebase/firestore';
import { 
  FileText, Plus, Edit2, Trash2, Image, Sparkles, X, Check, Search, Calendar, User, Clock, Eye 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const defaultCategories = ['Jewellery Care', 'Trends', 'Craftsmanship', 'Style Guide', 'Behind The Scenes'];

const BlogManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Jewellery Care',
    author: 'Velouraz Editorial',
    readTime: '5 min read',
    image: '',
    excerpt: '',
    content: ''
  });

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setBlogs(list);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const openAddModal = () => {
    setEditingBlog(null);
    setFormData({
      title: '',
      category: 'Jewellery Care',
      author: 'Velouraz Editorial',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1200',
      excerpt: '',
      content: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title || '',
      category: blog.category || 'Jewellery Care',
      author: blog.author || 'Velouraz Editorial',
      readTime: blog.readTime || '5 min read',
      image: blog.image || '',
      excerpt: blog.excerpt || '',
      content: blog.content || ''
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      alert("Title and content are required.");
      return;
    }

    setSaving(true);
    try {
      const blogPayload = {
        title: formData.title,
        category: formData.category,
        author: formData.author,
        readTime: formData.readTime,
        image: formData.image || 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1200',
        excerpt: formData.excerpt || formData.content.slice(0, 140) + '...',
        content: formData.content,
        updatedAt: serverTimestamp()
      };

      if (editingBlog) {
        await updateDoc(doc(db, "blogs", editingBlog.id), blogPayload);
      } else {
        await addDoc(collection(db, "blogs"), {
          ...blogPayload,
          createdAt: serverTimestamp()
        });
      }

      setIsModalOpen(false);
      fetchBlogs();
    } catch (err) {
      console.error("Error saving blog:", err);
      alert("Failed to save blog post.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;
    try {
      await deleteDoc(doc(db, "blogs", blogId));
      fetchBlogs();
    } catch (err) {
      console.error("Error deleting blog:", err);
    }
  };

  const filteredBlogs = blogs.filter(b => 
    b.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-serif font-bold text-gray-900 flex items-center gap-2">
            <FileText className="text-[#7A0E2E]" size={24} /> Blog & Journal Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">Create, edit and manage dynamic blog articles & editorial stories.</p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#7A0E2E] text-white text-sm font-semibold rounded-xl hover:bg-[#5E0B24] transition-all cursor-pointer shadow-md"
        >
          <Plus size={16} /> Create Article
        </button>
      </div>

      {/* Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#7A0E2E] transition-all"
          />
        </div>
        <p className="text-sm text-gray-500 font-medium">
          Showing <span className="font-bold text-gray-900">{filteredBlogs.length}</span> articles
        </p>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white p-4 rounded-2xl border border-gray-100">
              <div className="aspect-video bg-gray-200 rounded-xl mb-4" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredBlogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <div key={blog.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="relative aspect-video w-full bg-gray-100 overflow-hidden">
                  <img src={blog.image || 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1200'} alt={blog.title} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 bg-[#7A0E2E] text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-md">
                    {blog.category}
                  </span>
                </div>
                <div className="p-5 space-y-2">
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><User size={12} /> {blog.author}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {blog.readTime}</span>
                  </div>
                  <h3 className="font-serif font-bold text-lg text-gray-900 leading-snug line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 font-light">
                    {blog.excerpt}
                  </p>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                <a 
                  href={`/blog/${blog.id}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-xs text-gray-500 hover:text-[#7A0E2E] flex items-center gap-1"
                >
                  <Eye size={13} /> View
                </a>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(blog)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    title="Edit article"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(blog.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete article"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 p-8">
          <FileText size={40} className="mx-auto text-gray-300 mb-3" />
          <h3 className="font-serif text-xl font-bold text-gray-800">No blog posts found</h3>
          <p className="text-sm text-gray-500 mt-1 mb-4">Click "Create Article" to publish your first journal story.</p>
          <button
            onClick={openAddModal}
            className="px-5 py-2.5 bg-[#7A0E2E] text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer"
          >
            Create First Article
          </button>
        </div>
      )}

      {/* Add / Edit Blog Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl my-8"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="text-xl font-serif font-bold text-gray-900">
                  {editingBlog ? 'Edit Blog Article' : 'Publish New Blog Article'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Article Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. The Ultimate Jewellery Care Guide for Daily Luxury"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#7A0E2E]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#7A0E2E]"
                    >
                      {defaultCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Author Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Velouraz Editorial"
                      value={formData.author}
                      onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#7A0E2E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Read Time</label>
                    <input
                      type="text"
                      placeholder="e.g. 5 min read"
                      value={formData.readTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, readTime: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#7A0E2E]"
                    />
                  </div>
                </div>

                {/* Image Upload / URL */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">Cover Image URL / Upload</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Paste image URL..."
                      value={formData.image}
                      onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                      className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#7A0E2E]"
                    />
                    <label className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-gray-200">
                      <Image size={15} /> Upload File
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                  {formData.image && (
                    <div className="h-24 aspect-video rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Excerpt / Short Summary</label>
                  <textarea
                    rows={2}
                    placeholder="Brief intro for the article card..."
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#7A0E2E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Full Article Content *</label>
                  <textarea
                    rows={8}
                    required
                    placeholder="Write your article content here..."
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#7A0E2E] font-sans"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 border border-gray-200 text-gray-600 text-xs font-bold uppercase rounded-xl hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 bg-[#7A0E2E] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#5E0B24] transition-all cursor-pointer shadow-md"
                  >
                    {saving ? 'Saving...' : editingBlog ? 'Update Article' : 'Publish Article'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogManager;
