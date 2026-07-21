// SiteSettingsManager.jsx
import React, { useState, useEffect, useRef } from "react";
import { db } from "../../../components/Firebase";
import { doc, getDoc, setDoc, collection, onSnapshot, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save, Plus, Trash2, Edit3, ImagePlus, Loader2, Play, Video, Type, Link2, Bell, AlertCircle, Check, Image as ImageIcon
} from "lucide-react";
import { uploadToCloudinary } from "../../../config/cloudinary";

const labelStyle = "block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5";

const SiteSettingsManager = ({ isDarkMode = false }) => {
  const [activeSubTab, setActiveSubTab] = useState("hero"); // hero, announcements, world_edits, mega_menus

  const cardStyle = isDarkMode
    ? "p-5 rounded-2xl border bg-slate-850 border-slate-700 shadow-sm text-white"
    : "p-5 rounded-2xl border bg-white border-slate-100 shadow-sm text-slate-800";

  const inp = isDarkMode
    ? "w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#941232]"
    : "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#941232]";
  
  // ─── Hero Banner State ──────────────────────────────────────────────────────
  const [heroData, setHeroData] = useState({
    videoURL: "/img/video1.mp4",
    eyebrow: "Curated · Inspired · Timeless",
    title: "Jewellery that Travels the World",
    subtitle: "Handpicked designs from iconic cultures, crafted for the modern you.",
    btn1Text: "Explore Collections",
    btn1Link: "/shop",
    btn2Text: "World Edit",
    btn2Link: "/world-edit"
  });
  const [savingHero, setSavingHero] = useState(false);
  const [savedHero, setSavedHero] = useState(false);
  const videoInputRef = useRef(null);
  const [uploadingHeroVideo, setUploadingHeroVideo] = useState(false);

  // ─── Announcements Carousel State ──────────────────────────────────────────
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [savingAnnouncements, setSavingAnnouncements] = useState(false);
  const [savedAnnouncements, setSavedAnnouncements] = useState(false);

  // ─── World Edits Carousel State ─────────────────────────────────────────────
  const [worldEdits, setWorldEdits] = useState([]);
  const [editingEdit, setEditingEdit] = useState(null);
  const [newEdit, setNewEdit] = useState({
    country: "",
    collection: "",
    image: "",
    link: "",
  });
  const [uploadingEditImage, setUploadingEditImage] = useState(false);
  const editImageRef = useRef(null);

  // ─── Header Mega Menus Dynamic State ───────────────────────────────────────
  const [megaMenus, setMegaMenus] = useState({
    collections: {
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800",
      tagline: "TIMELESS BEAUTY",
      heading: "Crafted to Be Cherished",
      sections: [
        { title: "JEWELLERY SETS", icon: "𝓥", items: "Kundan Sets, Polki Sets, American Diamond Sets, Temple Jewellery Sets, Minimal Sets" },
        { title: "EARRINGS", icon: "❂", items: "Stud Earrings, Jhumka, Hoops, Chandbali, Drop Earrings" },
        { title: "NECKLACES", icon: "◇", items: "Choker Necklaces, Short Necklaces, Long Necklaces, Layered Necklaces, Pendant Necklaces" },
        { title: "RINGS", icon: "○", items: "Statement Rings, Adjustable Rings, Cocktail Rings, Stacking Rings, Band Rings" },
        { title: "BANGLES", icon: "◎", items: "Kada Bangles, Stone Bangles, Lac Bangles, Gold Plated Bangles, Pearl Bangles" },
        { title: "ANKLETS", icon: "✧", items: "Charms Anklets, Beaded Anklets, Chain Anklets, Oxidised Anklets, Minimal Anklets" }
      ]
    },
    world_edit: {
      image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800",
      tagline: "BEAUTY HAS NO BOUNDARIES",
      heading: "Jewellery Inspired by Cultures, Crafted for You.",
      sections: [
        { title: "KOREAN EDIT", icon: "⛩", items: "Pearl Collection, Minimal Luxe, Crystal Drops, Layered Necklaces, Statement Earrings" },
        { title: "TURKISH EDIT", icon: "🕌", items: "Evil Eye Collection, Oxidised Silver, Teardrop Earrings, Enamel Jewellery, Layered Necklaces" },
        { title: "INDIAN EDIT", icon: "◈", items: "Kundan Jewellery, Polki Sets, Temple Jewels, Meenakari Collection, Jadau Jewellery" },
        { title: "ARABIAN EDIT", icon: "☽", items: "Statement Sets, Gold Plated, Coin Jewellery, Chunky Chains, Dangle Earrings" },
        { title: "EUROPEAN EDIT", icon: "⚜", items: "Minimal Gold, Pearl Jewellery, Sleek Rings, Hoop Earrings, Tennis Bracelets" },
        { title: "THAI EDIT", icon: "❋", items: "Beaded Jewellery, Handcrafted Silver, Color Stone Earrings, Floral Motifs, Boho Necklaces" }
      ]
    },
    the_edit: {
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
      tagline: "Curated Picks, Loved by Many",
      heading: "HANDPICKED. TRENDING. TIMELESS.",
      sections: [
        { title: "TRENDING LUXE", icon: "✧", items: "Statement Pieces, Korean Luxe, Minimal Gold, Pearl Trends, Layered Looks" },
        { title: "BEST SELLERS", icon: "♡", items: "Top Rated, Customer Favorites, Most Loved Earrings, Most Loved Necklaces, Most Loved Sets" }
      ]
    }
  });

  const [selectedMegaMenuKey, setSelectedMegaMenuKey] = useState("collections"); // collections, world_edit, the_edit
  const [newSection, setNewSection] = useState({ title: "", icon: "", items: "" });
  const [savingMegaMenus, setSavingMegaMenus] = useState(false);
  const [savedMegaMenus, setSavedMegaMenus] = useState(false);
  const [uploadingMegaMenuImage, setUploadingMegaMenuImage] = useState(false);

  // ─── Initial Load ───────────────────────────────────────────────────────────
  useEffect(() => {
    // Read Hero banner config
    const heroRef = doc(db, "site_settings", "hero");
    getDoc(heroRef).then((snap) => {
      if (snap.exists()) setHeroData(snap.data());
    });

    // Read Announcements
    const announcementsRef = doc(db, "site_settings", "announcements");
    getDoc(announcementsRef).then((snap) => {
      if (snap.exists() && snap.data().items) {
        setAnnouncements(snap.data().items);
      } else {
        setAnnouncements([
          "Free Shipping Across India | Use Code VEL5 for 5% OFF on your first order",
          "Artisanal Craftsmanship | 100% Handcrafted Designs",
        ]);
      }
    });

    // Read Navigation Mega Menus
    const megaMenusRef = doc(db, "site_settings", "mega_menus");
    getDoc(megaMenusRef).then((snap) => {
      if (snap.exists()) {
        setMegaMenus(snap.data());
      }
    });

    // Realtime listen to World Edits Carousel items
    const stopEdits = onSnapshot(collection(db, "world_edits_carousel"), (snap) => {
      setWorldEdits(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => stopEdits();
  }, []);

  // ─── Hero video upload ──────────────────────────────────────────────────────
  const handleHeroVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingHeroVideo(true);
    try {
      const url = await uploadToCloudinary(file);
      setHeroData((prev) => ({ ...prev, videoURL: url }));
    } catch (err) {
      console.error("Hero video upload failed:", err);
    } finally {
      setUploadingHeroVideo(false);
    }
  };

  const handleSaveHero = async () => {
    setSavingHero(true);
    setSavedHero(false);
    try {
      await setDoc(doc(db, "site_settings", "hero"), heroData);
      setSavedHero(true);
      setTimeout(() => setSavedHero(false), 3000);
    } catch (err) {
      console.error("Save hero config failed:", err);
    } finally {
      setSavingHero(false);
    }
  };

  // ─── Announcements actions ──────────────────────────────────────────────────
  const handleAddAnnouncement = () => {
    if (!newAnnouncement.trim()) return;
    setAnnouncements((prev) => [...prev, newAnnouncement.trim()]);
    setNewAnnouncement("");
  };

  const handleRemoveAnnouncement = (index) => {
    setAnnouncements((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSaveAnnouncements = async () => {
    setSavingAnnouncements(true);
    setSavedAnnouncements(false);
    try {
      await setDoc(doc(db, "site_settings", "announcements"), { items: announcements });
      setSavedAnnouncements(true);
      setTimeout(() => setSavedAnnouncements(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSavingAnnouncements(false);
    }
  };

  // ─── World Edits actions ────────────────────────────────────────────────────
  const handleWorldEditPhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingEditImage(true);
    try {
      const url = await uploadToCloudinary(file);
      if (editingEdit) {
        setEditingEdit((prev) => ({ ...prev, image: url }));
      } else {
        setNewEdit((prev) => ({ ...prev, image: url }));
      }
    } catch (err) {
      console.error("Photo upload failed:", err);
    } finally {
      setUploadingEditImage(false);
    }
  };

  const handleSaveWorldEdit = async (e) => {
    e.preventDefault();
    const data = editingEdit || newEdit;
    if (!data.country || !data.image) return;

    try {
      if (editingEdit) {
        await updateDoc(doc(db, "world_edits_carousel", editingEdit.id), {
          country: data.country.toUpperCase(),
          collection: data.collection,
          image: data.image,
          link: data.link || `/world-edit/${data.country.toLowerCase().replace(/ /g, "-")}`,
        });
        setEditingEdit(null);
      } else {
        await addDoc(collection(db, "world_edits_carousel"), {
          country: data.country.toUpperCase(),
          collection: data.collection,
          image: data.image,
          link: data.link || `/world-edit/${data.country.toLowerCase().replace(/ /g, "-")}`,
          createdAt: new Date().toISOString()
        });
        setNewEdit({ country: "", collection: "", image: "", link: "" });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteWorldEdit = async (id) => {
    if (window.confirm("Delete this country from carousel?")) {
      await deleteDoc(doc(db, "world_edits_carousel", id));
    }
  };

  // ─── Mega Menus config ─────────────────────────────────────────────────────
  const handleMegaMenuPhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingMegaMenuImage(true);
    try {
      const url = await uploadToCloudinary(file);
      setMegaMenus((prev) => ({
        ...prev,
        [selectedMegaMenuKey]: {
          ...prev[selectedMegaMenuKey],
          image: url
        }
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingMegaMenuImage(false);
    }
  };

  const handleSaveMegaMenus = async () => {
    setSavingMegaMenus(true);
    setSavedMegaMenus(false);
    try {
      await setDoc(doc(db, "site_settings", "mega_menus"), megaMenus);
      setSavedMegaMenus(true);
      setTimeout(() => setSavedMegaMenus(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSavingMegaMenus(false);
    }
  };

  const handleAddSection = () => {
    if (!newSection.title.trim()) return;
    const updatedSections = [...megaMenus[selectedMegaMenuKey].sections, {
      title: newSection.title.toUpperCase(),
      icon: newSection.icon || "✧",
      items: newSection.items
    }];
    setMegaMenus((prev) => ({
      ...prev,
      [selectedMegaMenuKey]: {
        ...prev[selectedMegaMenuKey],
        sections: updatedSections
      }
    }));
    setNewSection({ title: "", icon: "", items: "" });
  };

  const handleRemoveSection = (index) => {
    const updatedSections = megaMenus[selectedMegaMenuKey].sections.filter((_, idx) => idx !== index);
    setMegaMenus((prev) => ({
      ...prev,
      [selectedMegaMenuKey]: {
        ...prev[selectedMegaMenuKey],
        sections: updatedSections
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Sub Tabs */}
      <div className={`flex gap-2 border-b pb-3 flex-wrap ${isDarkMode ? "border-slate-800" : "border-slate-100"}`}>
        {[
          { id: "hero", label: "Hero Banner (Video/Texts)" },
          { id: "announcements", label: "Announcement Tickers" },
          { id: "world_edits", label: "World Edits Carousel" },
          { id: "mega_menus", label: "Header Mega Menus" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === tab.id
                ? "bg-[#941232] text-white animate-pulse"
                : `${isDarkMode ? "bg-slate-800 text-slate-400 hover:bg-slate-700" : "bg-slate-50 text-slate-500 hover:bg-slate-100"}`
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── Hero Section Editor ─── */}
      {activeSubTab === "hero" && (
        <div className={cardStyle}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>Hero Video & Content</h3>
              <p className="text-xs text-slate-400">Configure title, subtitle, promotional video and CTA links</p>
            </div>
            <button
              onClick={handleSaveHero}
              disabled={savingHero}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#941232] hover:bg-[#b01540] text-white text-xs font-bold transition-all disabled:opacity-50"
            >
              {savingHero ? <Loader2 size={13} className="animate-spin" /> : savedHero ? <Check size={13} /> : <Save size={13} />}
              {savingHero ? "Saving..." : savedHero ? "Saved!" : "Save Hero Section"}
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label className={labelStyle}>Hero Video Source (MP4 / Webm)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={heroData.videoURL}
                    onChange={(e) => setHeroData({ ...heroData, videoURL: e.target.value })}
                    className={inp}
                    placeholder="Enter video URL link"
                  />
                  <label className={`flex items-center justify-center p-2.5 rounded-xl border border-dashed border-slate-350 cursor-pointer ${isDarkMode ? "bg-slate-900 text-slate-300" : "bg-slate-50 text-slate-600"}`}>
                    <Video size={16} />
                    <input type="file" accept="video/*" className="hidden" onChange={handleHeroVideoUpload} />
                  </label>
                </div>
                {uploadingHeroVideo && <p className="text-[10px] text-amber-600 font-semibold animate-pulse mt-1">Uploading hero video...</p>}
              </div>

              <div>
                <label className={labelStyle}>Eyebrow Subtitle</label>
                <input
                  type="text"
                  value={heroData.eyebrow}
                  onChange={(e) => setHeroData({ ...heroData, eyebrow: e.target.value })}
                  className={inp}
                />
              </div>

              <div>
                <label className={labelStyle}>Hero Main Headline</label>
                <input
                  type="text"
                  value={heroData.title}
                  onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
                  className={inp}
                />
              </div>

              <div>
                <label className={labelStyle}>Hero Sub-copy description</label>
                <textarea
                  rows={2}
                  value={heroData.subtitle}
                  onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
                  className={`${inp} resize-none`}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}>Button 1 Label</label>
                  <input
                    type="text"
                    value={heroData.btn1Text}
                    onChange={(e) => setHeroData({ ...heroData, btn1Text: e.target.value })}
                    className={inp}
                  />
                </div>
                <div>
                  <label className={labelStyle}>Button 1 Link</label>
                  <input
                    type="text"
                    value={heroData.btn1Link}
                    onChange={(e) => setHeroData({ ...heroData, btn1Link: e.target.value })}
                    className={inp}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}>Button 2 Label</label>
                  <input
                    type="text"
                    value={heroData.btn2Text}
                    onChange={(e) => setHeroData({ ...heroData, btn2Text: e.target.value })}
                    className={inp}
                  />
                </div>
                <div>
                  <label className={labelStyle}>Button 2 Link</label>
                  <input
                    type="text"
                    value={heroData.btn2Link}
                    onChange={(e) => setHeroData({ ...heroData, btn2Link: e.target.value })}
                    className={inp}
                  />
                </div>
              </div>

              {/* Video Preview */}
              <div className="rounded-xl border border-slate-100 dark:border-slate-700/60 overflow-hidden bg-slate-900 relative aspect-video flex items-center justify-center">
                {heroData.videoURL ? (
                  <video src={heroData.videoURL} autoPlay muted loop className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-slate-500">No video selected</span>
                )}
                <div className="absolute inset-0 bg-black/45 p-4 flex flex-col justify-end text-white">
                  <p className="text-[8px] uppercase tracking-widest text-[#C8A97A] font-bold">{heroData.eyebrow}</p>
                  <h4 className="font-serif text-sm font-semibold text-white mt-1 leading-tight">{heroData.title}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Announcements Editor ─── */}
      {activeSubTab === "announcements" && (
        <div className={cardStyle}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>Announcement Carousels</h3>
              <p className="text-xs text-slate-400">Multiple announcement texts rotating in the website header bar</p>
            </div>
            <button
              onClick={handleSaveAnnouncements}
              disabled={savingAnnouncements}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#941232] hover:bg-[#b01540] text-white text-xs font-bold transition-all disabled:opacity-50"
            >
              {savingAnnouncements ? <Loader2 size={13} className="animate-spin" /> : savedAnnouncements ? <Check size={13} /> : <Save size={13} />}
              {savingAnnouncements ? "Saving..." : savedAnnouncements ? "Saved!" : "Save Announcements"}
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newAnnouncement}
                onChange={(e) => setNewAnnouncement(e.target.value)}
                className={inp}
                placeholder="Enter ticker announcement line (e.g. Free shipping on orders over ₹999)"
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddAnnouncement(); } }}
              />
              <button
                type="button"
                onClick={handleAddAnnouncement}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold text-white ${isDarkMode ? "bg-slate-800 hover:bg-slate-700" : "bg-slate-900 hover:bg-slate-850"}`}
              >
                Add
              </button>
            </div>

            <div className={`border rounded-xl divide-y overflow-hidden ${isDarkMode ? "border-slate-800 divide-slate-800" : "border-slate-100 divide-slate-100"}`}>
              {announcements.map((text, index) => (
                <div key={index} className={`flex justify-between items-center p-3.5 text-xs ${isDarkMode ? "bg-slate-900/40" : "bg-slate-50/50"}`}>
                  <span className={`font-semibold ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>{text}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAnnouncement(index)}
                    className="p-1 rounded bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
              {announcements.length === 0 && (
                <div className="p-8 text-center text-xs text-slate-400">No announcement lines configured.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── World Edits Carousel Editor ─── */}
      {activeSubTab === "world_edits" && (
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* Add / Edit Form */}
          <div className={cardStyle}>
            <h3 className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-slate-800"} mb-4`}>
              {editingEdit ? "Edit Carousel Card" : "Add Carousel Card"}
            </h3>
            <form onSubmit={handleSaveWorldEdit} className="space-y-4">
              <div>
                <label className={labelStyle}>Country Name *</label>
                <input
                  type="text"
                  required
                  value={editingEdit ? editingEdit.country : newEdit.country}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (editingEdit) setEditingEdit({ ...editingEdit, country: value });
                    else setNewEdit({ ...newEdit, country: value });
                  }}
                  className={inp}
                  placeholder="e.g. ITALY"
                />
              </div>

              <div>
                <label className={labelStyle}>Collection / Sub-header Label</label>
                <input
                  type="text"
                  value={editingEdit ? editingEdit.collection : newEdit.collection}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (editingEdit) setEditingEdit({ ...editingEdit, collection: value });
                    else setNewEdit({ ...newEdit, collection: value });
                  }}
                  className={inp}
                  placeholder="e.g. MARBLE CHIC COLLECTION"
                />
              </div>

              <div>
                <label className={labelStyle}>Image URL *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={editingEdit ? editingEdit.image : newEdit.image}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (editingEdit) setEditingEdit({ ...editingEdit, image: value });
                      else setNewEdit({ ...newEdit, image: value });
                    }}
                    className={inp}
                    placeholder="Enter image link"
                  />
                  <label className={`flex items-center justify-center p-2.5 rounded-xl border border-dashed border-slate-350 cursor-pointer ${isDarkMode ? "bg-slate-900 text-slate-300" : "bg-slate-50 text-slate-600"}`}>
                    <ImagePlus size={16} />
                    <input type="file" accept="image/*" className="hidden" onChange={handleWorldEditPhotoUpload} />
                  </label>
                </div>
                {uploadingEditImage && <p className="text-[10px] text-amber-600 font-semibold animate-pulse mt-1">Uploading...</p>}
              </div>

              <div>
                <label className={labelStyle}>Redirect Link</label>
                <input
                  type="text"
                  value={editingEdit ? editingEdit.link : newEdit.link}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (editingEdit) setEditingEdit({ ...editingEdit, link: value });
                    else setNewEdit({ ...newEdit, link: value });
                  }}
                  className={inp}
                  placeholder="e.g. /world-edit/italy"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#941232] hover:bg-[#b01540] text-white text-xs font-bold rounded-xl shadow-md transition-all"
                >
                  {editingEdit ? "Update Slide" : "Add Slide"}
                </button>
                {editingEdit && (
                  <button
                    type="button"
                    onClick={() => setEditingEdit(null)}
                    className="px-4 py-3 border border-slate-200 rounded-xl text-xs font-bold"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Carousel Cards List */}
          <div className="space-y-4">
            <h3 className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>Active Carousel Cards</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {worldEdits.map((item) => (
                <div key={item.id} className={`flex gap-3 p-3 border rounded-2xl items-center ${isDarkMode ? "bg-slate-855 border-slate-700" : "bg-white border-slate-100"}`}>
                  <img src={item.image} alt="" className="w-14 h-14 rounded-xl object-cover bg-slate-150 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold uppercase truncate ${isDarkMode ? "text-white" : "text-slate-800"}`}>{item.country}</p>
                    <p className="text-[10px] text-slate-400 truncate">{item.collection || "No sub-title"}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditingEdit(item)}
                      className={`p-1.5 rounded-lg ${isDarkMode ? "bg-slate-750 text-white hover:bg-slate-700" : "bg-slate-100 text-slate-650 hover:bg-slate-200"}`}
                    >
                      <Edit3 size={12} />
                    </button>
                    <button
                      onClick={() => handleDeleteWorldEdit(item.id)}
                      className="p-1.5 bg-rose-50 hover:bg-rose-500 hover:text-white rounded-lg text-rose-600 transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── Mega Menus Editor Tab ─── */}
      {activeSubTab === "mega_menus" && (
        <div className="space-y-6">
          {/* Menu Selector */}
          <div className="flex gap-2">
            {[
              { key: "collections", label: "Collections Menu" },
              { key: "world_edit", label: "World Edit Menu" },
              { key: "the_edit", label: "The Edit Menu" }
            ].map((menu) => (
              <button
                key={menu.key}
                onClick={() => setSelectedMegaMenuKey(menu.key)}
                className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
                  selectedMegaMenuKey === menu.key
                    ? "bg-[#941232] text-white shadow-sm"
                    : `${isDarkMode ? "bg-slate-800 text-slate-400 hover:bg-slate-700" : "bg-slate-50 text-slate-500 hover:bg-slate-100"}`
                }`}
              >
                {menu.label}
              </button>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            {/* Promo Card & Details Form */}
            <div className={cardStyle}>
              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>
                  Promo Card & Global Setup
                </h3>
                <button
                  onClick={handleSaveMegaMenus}
                  disabled={savingMegaMenus}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#941232] text-white text-xs font-bold transition-all"
                >
                  {savingMegaMenus ? <Loader2 size={13} className="animate-spin" /> : savedMegaMenus ? <Check size={13} /> : <Save size={13} />}
                  Save Menu Data
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={labelStyle}>Promo Card Banner Image URL</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={megaMenus[selectedMegaMenuKey]?.image || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setMegaMenus((prev) => ({
                          ...prev,
                          [selectedMegaMenuKey]: { ...prev[selectedMegaMenuKey], image: val }
                        }));
                      }}
                      className={inp}
                      placeholder="Enter promo image URL link"
                    />
                    <label className={`flex items-center justify-center p-2.5 rounded-xl border border-dashed border-slate-350 cursor-pointer ${isDarkMode ? "bg-slate-900 text-slate-300" : "bg-slate-50 text-slate-600"}`}>
                      <ImageIcon size={16} />
                      <input type="file" accept="image/*" className="hidden" onChange={handleMegaMenuPhotoUpload} />
                    </label>
                  </div>
                  {uploadingMegaMenuImage && <p className="text-[10px] text-amber-600 font-semibold animate-pulse mt-1">Uploading...</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelStyle}>Promo Tagline (Gold Text)</label>
                    <input
                      type="text"
                      value={megaMenus[selectedMegaMenuKey]?.tagline || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setMegaMenus((prev) => ({
                          ...prev,
                          [selectedMegaMenuKey]: { ...prev[selectedMegaMenuKey], tagline: val }
                        }));
                      }}
                      className={inp}
                      placeholder="e.g. TIMELESS BEAUTY"
                    />
                  </div>
                  <div>
                    <label className={labelStyle}>Promo Headline (White Bold Text)</label>
                    <input
                      type="text"
                      value={megaMenus[selectedMegaMenuKey]?.heading || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setMegaMenus((prev) => ({
                          ...prev,
                          [selectedMegaMenuKey]: { ...prev[selectedMegaMenuKey], heading: val }
                        }));
                      }}
                      className={inp}
                      placeholder="e.g. Crafted to Be Cherished"
                    />
                  </div>
                </div>
              </div>

              {/* Add New Section Inside Menu */}
              <div className="border-t border-slate-100 dark:border-slate-800 mt-6 pt-5">
                <h4 className={`text-xs font-bold mb-4 ${isDarkMode ? "text-white" : "text-slate-700"}`}>
                  Add New Dropdown Column / Section
                </h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className={labelStyle}>Column Title</label>
                    <input
                      type="text"
                      value={newSection.title}
                      onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
                      className={inp}
                      placeholder="e.g. JEWELLERY SETS"
                    />
                  </div>
                  <div>
                    <label className={labelStyle}>Bullet Emoji/Icon</label>
                    <input
                      type="text"
                      value={newSection.icon}
                      onChange={(e) => setNewSection({ ...newSection, icon: e.target.value })}
                      className={inp}
                      placeholder="e.g. 𝓥 or ⛩"
                    />
                  </div>
                  <div>
                    <label className={labelStyle}>Sub-items (comma separated)</label>
                    <input
                      type="text"
                      value={newSection.items}
                      onChange={(e) => setNewSection({ ...newSection, items: e.target.value })}
                      className={inp}
                      placeholder="Studs, Jhumka, Hoops"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAddSection}
                  className="mt-4 px-4 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
                >
                  <Plus size={14} /> Add Dropdown Column
                </button>
              </div>
            </div>

            {/* List Active Columns */}
            <div className="space-y-4">
              <h3 className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>
                Active Columns / Sections
              </h3>
              <div className="space-y-3">
                {megaMenus[selectedMegaMenuKey]?.sections.map((section, index) => (
                  <div
                    key={index}
                    className={`p-4 border rounded-2xl flex justify-between items-start ${
                      isDarkMode ? "bg-slate-850 border-slate-700" : "bg-white border-slate-100"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#941232]">{section.icon}</span>
                        <h4 className={`text-xs font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>
                          {section.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {section.items}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSection(index)}
                      className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteSettingsManager;
