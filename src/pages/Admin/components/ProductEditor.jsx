import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Calendar, Camera, Check, ChevronRight, Cloud,
  Computer, Crown, Hash, ImagePlus, Loader2, Package,
  Plus, Save, Tag, Trash2, X, AlertCircle,
} from "lucide-react";
import { createProduct, updateProduct } from "../../../services/productService";
import { uploadToCloudinary, cloudinaryConfig } from "../../../config/cloudinary";
import CloudinaryImageLibrary from "./CloudinaryImageLibrary";
import { db } from "../../../components/Firebase";
import { collection, getDocs } from "firebase/firestore";

// ─── Config ──────────────────────────────────────────────────────────────────
const CATEGORIES = ["Necklace", "Earrings", "Rings", "Bracelet", "Bangles", "Bridal Wear", "Anklets"];
const COUNTRIES = [
  "India", "South Korea", "Japan", "France", "Italy", "Turkey", "Dubai",
  "UAE", "USA", "Thailand", "China", "Singapore", "UK", "Germany", "Spain",
  "Indonesia", "Malaysia", "Vietnam", "Sri Lanka", "Nepal",
];
const TAG_SUGGESTIONS = [
  "New Arrivals", "Best Sellers", "Trending", "Limited Edition", "Exclusive",
  "Premium Pick", "Editor's Choice", "Hot Selling", "Featured", "Sale",
  "Lightweight", "Anti Tarnish", "Hypoallergenic", "Handcrafted",
  "Bridal", "Daily Wear", "Wedding", "Festival", "Gift",
];
const DEFAULTS = { status: "Published", country: "", category: "", stock: 1, visibility: "Public" };

// ─── Helpers ─────────────────────────────────────────────────────────────────
const inp = "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-[#941232] focus:ring-2 focus:ring-[#941232]/10 placeholder:text-slate-400";
const label = "block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1.5";
const card = "rounded-2xl border border-slate-100 bg-white shadow-sm";

// ─── Tag Chip Input ───────────────────────────────────────────────────────────
const TagInput = ({ value = [], onChange }) => {
  const [inputVal, setInputVal] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);

  const add = (tag) => {
    const trimmed = tag.trim();
    if (trimmed && !value.includes(trimmed)) onChange([...value, trimmed]);
    setInputVal("");
    setOpen(false);
  };

  const remove = (tag) => onChange(value.filter((t) => t !== tag));

  const filtered = TAG_SUGGESTIONS.filter(
    (s) => !value.includes(s) && s.toLowerCase().includes(inputVal.toLowerCase())
  );

  return (
    <div className="relative">
      {/* Existing tags */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-[#941232]/10 pl-2.5 pr-1.5 py-1 text-xs font-semibold text-[#941232]"
            >
              <Tag size={10} />
              {tag}
              <button type="button" onClick={() => remove(tag)} className="ml-0.5 hover:text-red-600 transition-colors">
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}
      {/* Input */}
      <div className={`flex items-center gap-2 ${inp} cursor-text`} onClick={() => inputRef.current?.focus()}>
        <Hash size={14} className="text-slate-400 flex-shrink-0" />
        <input
          ref={inputRef}
          value={inputVal}
          onChange={(e) => { setInputVal(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.preventDefault(); if (inputVal.trim()) add(inputVal); }
            if (e.key === "," || e.key === " ") { e.preventDefault(); if (inputVal.trim()) add(inputVal); }
          }}
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-slate-400"
          placeholder="Type a tag or pick below…"
        />
      </div>
      {/* Dropdown suggestions */}
      <AnimatePresence>
        {open && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.12 }}
            className="absolute left-0 right-0 top-full mt-1 z-50 rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden"
          >
            <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b">Suggestions</p>
            <div className="flex flex-wrap gap-1.5 p-2.5 max-h-36 overflow-y-auto">
              {filtered.map((s) => (
                <button
                  key={s}
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); add(s); }}
                  className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:border-[#941232]/40 hover:bg-[#941232]/5 hover:text-[#941232] transition-all"
                >
                  <Plus size={9} /> {s}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Inline Media Picker (no separate file needed for this compact form) ──────
const MediaSection = ({ media, setMedia }) => {
  const fileInputRef = useRef(null);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [uploading, setUploading] = useState([]);

  const addFiles = (e) => {
    const files = Array.from(e.target.files || []);
    const newItems = files.map((f) => ({
      id: `local-${f.name}-${Date.now()}-${Math.random()}`,
      file: f,
      url: URL.createObjectURL(f),
      source: "computer",
    }));
    setMedia((prev) => [...prev, ...newItems]);
    e.target.value = "";
  };

  const addCloudinary = (assets) => {
    setMedia((prev) => [
      ...prev,
      ...assets.filter((a) => !prev.some((p) => p.publicId === a.publicId)),
    ]);
  };

  const remove = (id) => setMedia((prev) => prev.filter((m) => m.id !== id));
  const setPrimary = (id) =>
    setMedia((prev) => [prev.find((m) => m.id === id), ...prev.filter((m) => m.id !== id)].filter(Boolean));

  return (
    <div className={`${card} p-4 sm:p-5`}>
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <ImagePlus size={15} className="text-[#941232]" />
            Images & Media
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">First image = primary storefront image</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#941232]/30 px-3 py-1.5 text-xs font-bold text-[#941232] hover:bg-[#941232]/5 transition-all"
          >
            <Computer size={13} /> From device
          </button>
          <button
            type="button"
            onClick={() => setLibraryOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#941232] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#b01540] transition-all shadow-md shadow-[#941232]/20"
          >
            <Cloud size={13} /> Cloudinary
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={addFiles}
      />

      {media.length === 0 ? (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-10 text-center hover:border-[#941232]/40 hover:bg-[#941232]/5 transition-all group"
        >
          <Camera size={28} className="text-slate-300 group-hover:text-[#941232]/50 transition-colors" />
          <div>
            <p className="text-sm font-semibold text-slate-500 group-hover:text-[#941232]">Click to upload photos</p>
            <p className="text-xs text-slate-400 mt-0.5">JPG, PNG, WEBP supported</p>
          </div>
        </button>
      ) : (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
          {media.map((item, idx) => (
            <div
              key={item.id}
              className={`relative aspect-square overflow-hidden rounded-xl border-2 bg-slate-100 ${
                idx === 0 ? "border-[#941232] ring-2 ring-[#941232]/20" : "border-slate-200"
              }`}
            >
              <img src={item.url} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-1.5 flex items-center justify-between">
                {idx === 0 ? (
                  <span className="flex items-center gap-0.5 text-[9px] font-bold text-white">
                    <Crown size={9} /> Primary
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setPrimary(item.id)}
                    className="text-[9px] font-semibold text-white/80 hover:text-white"
                  >
                    Set primary
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  className="rounded-full bg-white/20 p-0.5 hover:bg-red-500/80 transition-colors"
                >
                  <Trash2 size={10} className="text-white" />
                </button>
              </div>
            </div>
          ))}
          {/* Add more */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 hover:border-[#941232]/40 hover:bg-[#941232]/5 transition-all group"
          >
            <Plus size={18} className="text-slate-300 group-hover:text-[#941232]/60" />
            <span className="text-[9px] font-bold text-slate-400 group-hover:text-[#941232]/60">Add</span>
          </button>
        </div>
      )}

      {libraryOpen && (
        <CloudinaryImageLibrary
          multiple
          onSelect={addCloudinary}
          onClose={() => setLibraryOpen(false)}
        />
      )}
    </div>
  );
};

// ─── Main ProductEditor ───────────────────────────────────────────────────────
const ProductEditor = ({ product, onCancel, onSuccess }) => {
  const { register, handleSubmit, control, reset, setError, clearErrors, watch, formState: { errors } } = useForm({
    defaultValues: { ...DEFAULTS, ...(product || {}) },
  });
  const [media, setMedia] = useState([]);
  const [tags, setTags] = useState([]);
  const [saving, setSaving] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [notice, setNotice] = useState("");
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [dbCategories, setDbCategories] = useState([]);
  const [dbCountries, setDbCountries] = useState([]);

  useEffect(() => {
    getDocs(collection(db, "categories")).then((snap) => {
      const list = snap.docs.map((d) => d.data().name).filter(Boolean);
      if (list.length > 0) setDbCategories(list);
    });
    getDocs(collection(db, "countries")).then((snap) => {
      const list = snap.docs.map((d) => d.data().name).filter(Boolean);
      if (list.length > 0) setDbCountries(list);
    });
  }, []);

  useEffect(() => {
    reset({ ...DEFAULTS, ...(product || {}) });
    setMedia(
      (product?.images || []).map((url, i) => ({
        id: `saved-${i}-${url}`,
        url,
        source: "cloudinary",
      }))
    );
    setTags(
      product?.tags
        ? (Array.isArray(product.tags) ? product.tags : product.tags.split(",").map((t) => t.trim()).filter(Boolean))
        : []
    );
    setScheduleEnabled(!!product?.scheduledAt);
  }, [product, reset]);

  const submit = async (values, intent = "Published") => {
    setNotice("");
    clearErrors();
    // Validate required
    if (!values.name?.trim()) { setError("name", { message: "Product name is required" }); return; }
    if (!values.category) { setError("category", { message: "Please select a category" }); return; }
    if (!values.price || Number(values.price) <= 0) { setError("price", { message: "Selling price must be greater than 0" }); return; }

    const isDraft = intent === "Draft";
    if (isDraft) setSavingDraft(true); else setSaving(true);

    try {
      const results = await Promise.allSettled(
        media.map((item) => (item.file ? uploadToCloudinary(item.file) : Promise.resolve(item.url)))
      );
      const images = results.filter((r) => r.status === "fulfilled").map((r) => r.value);

      const payload = {
        ...values,
        name: values.name.trim(),
        description: values.description?.trim() || "",
        tags,
        price: Number(values.price),
        original_price: Number(values.original_price || 0),
        discountPrice: Number(values.discountPrice || 0),
        stock: Number(values.stock || 0),
        stock_status: Number(values.stock || 0) <= 0 ? "Out of Stock" : "In Stock",
        status: intent,
        primaryImage: images[0] || "",
        secondaryImages: images.slice(1),
        images,
        image: images[0] || "",
        scheduledAt: scheduleEnabled ? values.scheduledAt : null,
      };

      if (product?.id) await updateProduct(product.id, payload);
      else await createProduct(payload, { status: intent, visibility: values.visibility, images });

      if (results.some((r) => r.status === "rejected")) {
        setNotice("Product saved, but some images could not upload.");
      }
      onSuccess();
    } catch (err) {
      setNotice(err?.message || "Unable to save product. Please try again.");
    } finally {
      setSaving(false);
      setSavingDraft(false);
    }
  };

  const originalPrice = Number(watch("original_price") || 0);
  const sellingPrice = Number(watch("price") || 0);
  const statusWatch = watch("status");
  const discountPct = originalPrice > 0 && sellingPrice > 0
    ? Math.round(((originalPrice - sellingPrice) / originalPrice) * 100)
    : 0;

  return (
    <div className="w-full pb-24 lg:pb-8">
      {/* ─── Top Bar ─── */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={onCancel}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-all"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
              {product ? "Edit Product" : "Add New Product"}
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              Dashboard <ChevronRight size={10} className="inline" /> Products <ChevronRight size={10} className="inline" />
              {product ? "Edit" : "New"}
            </p>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex gap-2 flex-shrink-0">
          <button
            type="button"
            disabled={savingDraft || saving}
            onClick={handleSubmit((v) => submit(v, "Draft"))}
            className="flex items-center gap-1.5 rounded-xl border border-[#941232]/30 bg-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-[#941232] hover:bg-[#941232]/5 transition-all disabled:opacity-50"
          >
            {savingDraft ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            <span className="hidden sm:inline">Save as </span>Draft
          </button>
          <button
            type="button"
            disabled={saving || savingDraft}
            onClick={handleSubmit((v) => submit(v, "Published"))}
            className="flex items-center gap-1.5 rounded-xl bg-[#941232] px-3 sm:px-5 py-2 text-xs sm:text-sm font-bold text-white shadow-lg shadow-[#941232]/20 hover:bg-[#b01540] transition-all active:scale-95 disabled:opacity-50"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            {saving ? "Saving…" : product ? "Save Changes" : "Publish"}
          </button>
        </div>
      </div>

      {/* ─── Error Banner ─── */}
      <AnimatePresence>
        {notice && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            <span>{notice}</span>
            <button onClick={() => setNotice("")} className="ml-auto text-red-400 hover:text-red-600">
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Two Column Layout ─── */}
      <form onSubmit={handleSubmit((v) => submit(v, "Published"))}>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.7fr)_300px] xl:grid-cols-[minmax(0,1.8fr)_320px]">

          {/* ─── LEFT COLUMN ─── */}
          <div className="space-y-4 min-w-0">

            {/* Basic Info */}
            <div className={`${card} p-4 sm:p-5`}>
              <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Package size={14} className="text-[#941232]" /> Basic Information
              </h2>
              <div className="space-y-4">

                {/* Product Title */}
                <div>
                  <label className={label}>Product Title <span className="text-[#941232]">*</span></label>
                  <input
                    {...register("name")}
                    className={`${inp} ${errors.name ? "border-red-400 ring-2 ring-red-100" : ""}`}
                    placeholder="e.g. Rose Gold Pearl Necklace"
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-600 font-medium">{errors.name.message}</p>}
                </div>

                {/* Description */}
                <div>
                  <label className={label}>Description</label>
                  <textarea
                    {...register("description")}
                    rows={4}
                    className={`${inp} resize-none leading-relaxed`}
                    placeholder="Describe the product — materials, style, occasion…"
                  />
                </div>

                {/* Category & Country — 2 cols on sm+ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={label}>Category <span className="text-[#941232]">*</span></label>
                    <select
                      {...register("category")}
                      className={`${inp} ${errors.category ? "border-red-400 ring-2 ring-red-100" : ""}`}
                    >
                      <option value="">Select category</option>
                      {(dbCategories.length > 0 ? dbCategories : CATEGORIES).map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.category && <p className="mt-1 text-xs text-red-600 font-medium">{errors.category.message}</p>}
                  </div>
                  <div>
                    <label className={label}>Country of Origin</label>
                    <select {...register("country")} className={inp}>
                      <option value="">Select country</option>
                      {(dbCountries.length > 0 ? dbCountries : COUNTRIES).map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className={label}>Tags & Labels</label>
                  <Controller
                    name="_tags"
                    control={control}
                    render={() => <TagInput value={tags} onChange={setTags} />}
                  />
                  <p className="mt-1.5 text-[11px] text-slate-400">
                    Use: <span className="font-medium text-slate-500">New Arrivals, Best Sellers, Trending</span> etc. Press Enter or comma to add.
                  </p>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className={`${card} p-4 sm:p-5`}>
              <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="text-base">₹</span> Pricing
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={label}>Original Price (MRP)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">₹</span>
                    <input type="number" min="0" {...register("original_price")} className={`${inp} pl-7`} placeholder="0" />
                  </div>
                </div>
                <div>
                  <label className={label}>Selling Price <span className="text-[#941232]">*</span></label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">₹</span>
                    <input
                      type="number" min="0"
                      {...register("price")}
                      className={`${inp} pl-7 ${errors.price ? "border-red-400" : ""}`}
                      placeholder="0"
                    />
                  </div>
                  {errors.price && <p className="mt-1 text-xs text-red-600 font-medium">{errors.price.message}</p>}
                </div>
                <div>
                  <label className={label}>Discount Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">₹</span>
                    <input type="number" min="0" {...register("discountPrice")} className={`${inp} pl-7`} placeholder="0" />
                  </div>
                </div>
              </div>
              {discountPct > 0 && (
                <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-1.5">
                  <Check size={13} className="text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-700">{discountPct}% discount applied</span>
                </div>
              )}
            </div>

            {/* Media */}
            <MediaSection media={media} setMedia={setMedia} />
          </div>

          {/* ─── RIGHT COLUMN ─── */}
          <div className="space-y-4">

            {/* Publish / Status */}
            <div className={`${card} p-4`}>
              <h3 className="text-sm font-bold text-slate-800 mb-3">Publish</h3>

              {/* Active / Inactive toggle */}
              <div className="mb-3">
                <label className={label}>Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {["Published", "Draft"].map((opt) => (
                    <label
                      key={opt}
                      className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-bold transition-all ${
                        statusWatch === opt
                          ? opt === "Published"
                            ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                            : "border-amber-400 bg-amber-50 text-amber-700"
                          : "border-slate-200 text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      <input type="radio" value={opt} {...register("status")} className="sr-only" />
                      <span className={`h-2 w-2 rounded-full ${opt === "Published" ? "bg-emerald-500" : "bg-amber-400"}`} />
                      {opt === "Published" ? "Active" : "Draft"}
                    </label>
                  ))}
                </div>
              </div>

              {/* Visibility */}
              <div className="mb-3">
                <label className={label}>Visibility</label>
                <select {...register("visibility")} className={inp}>
                  <option value="Public">Public</option>
                  <option value="Private">Private</option>
                </select>
              </div>

              {/* Featured toggle */}
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 hover:border-[#941232]/20 transition-all">
                <input type="checkbox" {...register("featuredProduct")} className="accent-[#941232] h-4 w-4 rounded" />
                <div>
                  <p className="text-xs font-bold text-slate-700">Featured Product</p>
                  <p className="text-[10px] text-slate-400">Shown on homepage</p>
                </div>
              </label>
            </div>

            {/* Schedule */}
            <div className={`${card} p-4`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Calendar size={14} className="text-[#941232]" /> Schedule
                </h3>
                <button
                  type="button"
                  onClick={() => setScheduleEnabled(!scheduleEnabled)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-all ${
                    scheduleEnabled ? "bg-[#941232]" : "bg-slate-200"
                  }`}
                >
                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${scheduleEnabled ? "translate-x-4" : "translate-x-0.5"}`} />
                </button>
              </div>
              {scheduleEnabled ? (
                <div>
                  <label className={label}>Publish at</label>
                  <input
                    type="datetime-local"
                    {...register("scheduledAt")}
                    className={`${inp} text-sm`}
                  />
                  <p className="mt-1 text-[10px] text-slate-400">Product will go live at the scheduled time.</p>
                </div>
              ) : (
                <p className="text-xs text-slate-400">Enable to schedule when this product goes live.</p>
              )}
            </div>

            {/* Inventory */}
            <div className={`${card} p-4`}>
              <h3 className="text-sm font-bold text-slate-800 mb-3">Inventory</h3>
              <div>
                <label className={label}>Quantity in Stock</label>
                <input
                  type="number"
                  min="0"
                  {...register("stock")}
                  className={inp}
                  placeholder="0"
                />
                <div className="mt-2 grid grid-cols-3 gap-1.5">
                  {[1, 5, 10, 25, 50, 100].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => reset((prev) => ({ ...prev, stock: n }))}
                      className="rounded-lg border border-slate-200 py-1 text-xs font-semibold text-slate-600 hover:border-[#941232]/40 hover:text-[#941232] transition-all"
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-xs leading-relaxed text-amber-800">
              <p className="font-bold mb-1">📸 Photo tips</p>
              <ul className="space-y-1 text-amber-700">
                <li>• First image = primary storefront thumbnail</li>
                <li>• Use square images (1:1) for best display</li>
                <li>• Minimum 800×800px recommended</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductEditor;
