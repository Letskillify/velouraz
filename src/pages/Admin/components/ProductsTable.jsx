import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit2,
  Trash2,
  Package,
  Plus,
  Minus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Globe2,
  RotateCcw,
  AlertTriangle,
  X,
  Trash,
  ArchiveRestore,
  ShieldAlert,
} from "lucide-react";
import { statusBadgeClasses } from "./AdminUtils";
import CSVUpload from "./CSVUpload";
import { quickUpdateStock } from "../../../services/productService";

// ─── Confirm Dialog ──────────────────────────────────────────────────────────
const ConfirmDialog = ({ isOpen, title, message, confirmLabel, confirmClass, onConfirm, onCancel, icon: Icon }) => {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed z-[1000] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl border border-slate-100 w-[90vw] max-w-[400px] p-6"
          >
            <div className="flex flex-col items-center text-center gap-4">
              {Icon && (
                <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center border border-red-100">
                  <Icon size={26} className="text-red-500" />
                </div>
              )}
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{message}</p>
              </div>
              <div className="flex gap-3 w-full mt-1">
                <button
                  onClick={onCancel}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className={`flex-1 py-2.5 rounded-xl text-white font-bold text-sm transition-all active:scale-95 ${confirmClass || "bg-red-500 hover:bg-red-600"}`}
                >
                  {confirmLabel || "Confirm"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ─── Quick Stock Editor ──────────────────────────────────────────────────────
const QuickStockEditor = ({ productId, currentStock }) => {
  const [val, setVal] = useState(currentStock ?? 0);
  const [updating, setUpdating] = useState(false);

  React.useEffect(() => {
    setVal(currentStock ?? 0);
  }, [currentStock]);

  const handleUpdate = async (newStock) => {
    const s = Math.max(0, Number(newStock) || 0);
    setVal(s);
    setUpdating(true);
    try {
      await quickUpdateStock(productId, s);
    } catch (err) {
      console.error("Failed to update stock:", err);
      setVal(currentStock ?? 0);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        disabled={updating || val <= 0}
        onClick={() => handleUpdate(Number(val) - 1)}
        className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 flex items-center justify-center text-xs font-bold transition-all"
        title="Decrease stock"
      >
        <Minus size={11} />
      </button>
      <input
        type="number"
        min="0"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onBlur={(e) => handleUpdate(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.target.blur();
          }
        }}
        className={`w-14 px-1.5 py-1 text-center text-sm font-bold border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#811331]/30 transition-all ${
          val > 10
            ? "border-emerald-200 text-emerald-700 bg-emerald-50/40"
            : val > 0
            ? "border-amber-200 text-amber-700 bg-amber-50/40"
            : "border-red-200 text-red-700 bg-red-50/50"
        }`}
      />
      <button
        type="button"
        disabled={updating}
        onClick={() => handleUpdate(Number(val) + 1)}
        className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 flex items-center justify-center text-xs font-bold transition-all"
        title="Increase stock"
      >
        <Plus size={11} />
      </button>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────
const ProductsTable = ({
  products,
  trashedProducts = [],
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onRestoreProduct,
  onPermanentDelete,
  onBatchTrash,
  onBatchRestore,
  onBatchPermanentDelete,
  onRefresh,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "All Categories");
  const [selectedCountry, setSelectedCountry] = useState(searchParams.get("country") || "All Countries");

  // View mode: "active" or "trash"
  const [viewMode, setViewMode] = useState("active");

  // Pagination & Selection States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState([]);

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState({ open: false, type: null, ids: [] });

  const currentList = viewMode === "trash" ? trashedProducts : products;

  useEffect(() => {
    const sQuery = searchParams.get("search") || searchParams.get("q") || "";
    const cQuery = searchParams.get("category") || "All Categories";
    const coQuery = searchParams.get("country") || "All Countries";
    setSearch(sQuery);
    setCategory(cQuery);
    setSelectedCountry(coQuery);
  }, [searchParams]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === "All Categories" || value === "All Countries") {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams, { replace: true });
  };

  // Filter & Search
  const filteredProducts = useMemo(() => {
    return currentList.filter((product) => {
      const queryStr = search.toLowerCase().trim();
      const matchesSearch =
        !queryStr ||
        `${product.name || ""} ${product.sku || ""} ${product.country || ""}`.toLowerCase().includes(queryStr);
      const matchesCategory =
        category === "All Categories" ||
        (product.category && product.category.toLowerCase() === category.toLowerCase());
      const matchesCountry =
        selectedCountry === "All Countries" ||
        (product.country && product.country.toLowerCase() === selectedCountry.toLowerCase());
      return matchesSearch && matchesCategory && matchesCountry;
    });
  }, [currentList, search, category, selectedCountry]);

  // Derived Pagination
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds([]);
  }, [search, category, selectedCountry, pageSize, viewMode]);

  const allCategories = [...new Set(products.map((p) => p.category).filter(Boolean))];
  const allCountries = [...new Set(products.map((p) => p.country).filter(Boolean))];

  // Selection Handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const pageIds = paginatedProducts.map((p) => p.id);
      setSelectedIds((prev) => [...new Set([...prev, ...pageIds])]);
    } else {
      const pageIds = paginatedProducts.map((p) => p.id);
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    }
  };

  const handleSelectOne = (id, checked) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const isAllPageSelected =
    paginatedProducts.length > 0 && paginatedProducts.every((p) => selectedIds.includes(p.id));

  // ─── Confirm helpers ────────────────────────────────────────────────────────
  const openConfirm = (type, ids) => setConfirmDialog({ open: true, type, ids });
  const closeConfirm = () => setConfirmDialog({ open: false, type: null, ids: [] });

  const handleConfirm = async () => {
    const { type, ids } = confirmDialog;
    closeConfirm();
    if (type === "trash_one") {
      await onDeleteProduct?.(ids[0]);
    } else if (type === "trash_batch") {
      await onBatchTrash?.(ids);
      setSelectedIds([]);
    } else if (type === "restore_one") {
      await onRestoreProduct?.(ids[0]);
    } else if (type === "restore_batch") {
      await onBatchRestore?.(ids);
      setSelectedIds([]);
    } else if (type === "permanent_one") {
      await onPermanentDelete?.(ids[0]);
    } else if (type === "permanent_batch") {
      await onBatchPermanentDelete?.(ids);
      setSelectedIds([]);
    } else if (type === "empty_trash") {
      await onBatchPermanentDelete?.(trashedProducts.map((p) => p.id));
      setSelectedIds([]);
    }
    if (onRefresh) onRefresh();
  };

  // ─── Dialog config ─────────────────────────────────────────────────────────
  const getDialogConfig = () => {
    const { type, ids } = confirmDialog;
    const count = ids.length;
    switch (type) {
      case "trash_one":
        return {
          title: "Move to Trash",
          message: "This product will be moved to trash. You can restore it later.",
          confirmLabel: "Move to Trash",
          confirmClass: "bg-amber-500 hover:bg-amber-600",
          icon: Trash2,
        };
      case "trash_batch":
        return {
          title: `Move ${count} Products to Trash`,
          message: `${count} selected products will be moved to trash. You can restore them later.`,
          confirmLabel: "Move to Trash",
          confirmClass: "bg-amber-500 hover:bg-amber-600",
          icon: Trash2,
        };
      case "restore_one":
        return {
          title: "Restore Product",
          message: "This product will be restored to your active catalogue.",
          confirmLabel: "Restore",
          confirmClass: "bg-emerald-500 hover:bg-emerald-600",
          icon: ArchiveRestore,
        };
      case "restore_batch":
        return {
          title: `Restore ${count} Products`,
          message: `${count} products will be restored to your active catalogue.`,
          confirmLabel: "Restore All",
          confirmClass: "bg-emerald-500 hover:bg-emerald-600",
          icon: ArchiveRestore,
        };
      case "permanent_one":
        return {
          title: "Permanently Delete",
          message: "This action is irreversible. The product will be permanently removed from the database.",
          confirmLabel: "Delete Forever",
          confirmClass: "bg-red-600 hover:bg-red-700",
          icon: ShieldAlert,
        };
      case "permanent_batch":
        return {
          title: `Permanently Delete ${count} Products`,
          message: `This action cannot be undone. All ${count} selected products will be permanently removed.`,
          confirmLabel: "Delete Forever",
          confirmClass: "bg-red-600 hover:bg-red-700",
          icon: ShieldAlert,
        };
      case "empty_trash":
        return {
          title: "Empty Trash",
          message: `All ${trashedProducts.length} products in trash will be permanently deleted. This cannot be undone.`,
          confirmLabel: "Empty Trash",
          confirmClass: "bg-red-600 hover:bg-red-700",
          icon: ShieldAlert,
        };
      default:
        return {};
    }
  };

  const dialogConfig = getDialogConfig();

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <ConfirmDialog
        isOpen={confirmDialog.open}
        {...dialogConfig}
        onConfirm={handleConfirm}
        onCancel={closeConfirm}
      />

      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-300">
        {/* Header */}
        <div className="px-6 py-5 sm:px-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-[16px] font-bold text-slate-900 flex items-center gap-2.5">
              <span className="p-1.5 bg-[#811331]/10 rounded-lg">
                {viewMode === "trash" ? (
                  <Trash size={15} className="text-[#811331]" />
                ) : (
                  <Package size={15} className="text-[#811331]" />
                )}
              </span>
              {viewMode === "trash" ? "Trash" : "Products"}
            </h2>
            <p className="text-base text-slate-400 font-medium mt-1 ml-0.5">
              {viewMode === "trash"
                ? `${trashedProducts.length} item${trashedProducts.length !== 1 ? "s" : ""} in trash`
                : `${products.length} item${products.length !== 1 ? "s" : ""} in inventory`}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* View Toggle */}
            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1 gap-1">
              <button
                onClick={() => setViewMode("active")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-base font-bold transition-all ${
                  viewMode === "active"
                    ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Package size={13} />
                Products
              </button>
              <button
                onClick={() => setViewMode("trash")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-base font-bold transition-all relative ${
                  viewMode === "trash"
                    ? "bg-white text-red-600 shadow-sm border border-red-100"
                    : "text-slate-500 hover:text-red-500"
                }`}
              >
                <Trash2 size={13} />
                Trash
                {trashedProducts.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {trashedProducts.length > 99 ? "99+" : trashedProducts.length}
                  </span>
                )}
              </button>
            </div>

            {/* Batch Actions */}
            {selectedIds.length > 0 && viewMode === "active" && (
              <button
                onClick={() => openConfirm("trash_batch", selectedIds)}
                className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-100 rounded-xl text-base font-bold transition-all"
              >
                <Trash2 size={13} />
                Move to Trash ({selectedIds.length})
              </button>
            )}
            {selectedIds.length > 0 && viewMode === "trash" && (
              <>
                <button
                  onClick={() => openConfirm("restore_batch", selectedIds)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100 rounded-xl text-base font-bold transition-all"
                >
                  <ArchiveRestore size={13} />
                  Restore ({selectedIds.length})
                </button>
                <button
                  onClick={() => openConfirm("permanent_batch", selectedIds)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-xl text-base font-bold transition-all"
                >
                  <ShieldAlert size={13} />
                  Delete Forever ({selectedIds.length})
                </button>
              </>
            )}

            {/* Empty Trash Button */}
            {viewMode === "trash" && trashedProducts.length > 0 && (
              <button
                onClick={() => openConfirm("empty_trash", [])}
                className="flex items-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-base font-bold transition-all shadow-md shadow-red-200"
              >
                <Trash size={13} />
                Empty Trash
              </button>
            )}

            {viewMode === "active" && (
              <>
                <CSVUpload onComplete={onRefresh} />
                <button
                  type="button"
                  onClick={onRefresh}
                  className="p-2.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-slate-100 transition-all"
                  title="Refresh"
                >
                  <RefreshCw size={14} />
                </button>
                <button
                  type="button"
                  onClick={onAddProduct}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-[#811331] text-white rounded-xl text-[16px] font-bold shadow-md shadow-[#811331]/20 hover:bg-[#9d1a3d] transition-all active:scale-95"
                >
                  <Plus size={13} />
                  New Product
                </button>
              </>
            )}

            {viewMode === "trash" && (
              <button
                type="button"
                onClick={onRefresh}
                className="p-2.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-slate-100 transition-all"
                title="Refresh"
              >
                <RefreshCw size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Trash Banner */}
        {viewMode === "trash" && (
          <div className="mx-5 mt-4 sm:mx-8 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <AlertTriangle size={16} className="text-amber-500 flex-shrink-0" />
            <p className="text-sm text-amber-700 font-medium">
              Items in trash are soft-deleted. Restore them to bring them back, or delete forever to remove permanently.
            </p>
          </div>
        )}

        {/* Filter Toolbar */}
        <div className="mx-5 mb-4 mt-4 flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3 sm:mx-8 sm:flex-row sm:items-center">
          <label className="flex flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-400">
            <Search size={15} />
            <input
              value={search}
              onChange={(event) => {
                const val = event.target.value;
                setSearch(val);
                updateParam("search", val);
              }}
              className="w-full bg-transparent text-base text-slate-700 outline-none"
              placeholder={`Search ${viewMode === "trash" ? "trashed" : ""} products...`}
            />
          </label>
          {/* Category Select */}
          <select
            value={category}
            onChange={(event) => {
              const val = event.target.value;
              setCategory(val);
              updateParam("category", val);
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-base text-slate-600 outline-none"
          >
            <option value="All Categories">All Categories</option>
            {allCategories.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
          {/* Country Select */}
          <select
            value={selectedCountry}
            onChange={(event) => {
              const val = event.target.value;
              setSelectedCountry(val);
              updateParam("country", val);
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-base text-slate-600 outline-none"
          >
            <option value="All Countries">All Countries</option>
            {allCountries.map((c) => (
              <option key={c} value={c}>🌍 {c}</option>
            ))}
          </select>
          {(search || category !== "All Categories") && (
            <button
              onClick={() => {
                setSearch("");
                setCategory("All Categories");
              }}
              className="px-2 text-base font-semibold text-[#811331]"
            >
              Reset
            </button>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[16px] font-bold text-slate-400 uppercase tracking-[0.12em] border-b border-slate-50 bg-slate-50/60">
                <th className="px-6 py-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={isAllPageSelected}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-slate-350 accent-[#811331] cursor-pointer"
                  />
                </th>
                <th className="px-6 py-4">Product</th>
                <th className="px-5 py-4">SKU</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Country</th>
                <th className="px-5 py-4">Price</th>
                {viewMode === "active" && <th className="px-5 py-4">Stock</th>}
                {viewMode === "active" && <th className="px-5 py-4">Status</th>}
                {viewMode === "active" && <th className="px-5 py-4">Date</th>}
                {viewMode === "trash" && <th className="px-5 py-4">Deleted</th>}
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedProducts.map((row, idx) => {
                const isChecked = selectedIds.includes(row.id);
                return (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.02 }}
                    className={`hover:bg-slate-50/60 transition-colors group ${isChecked ? "bg-red-50/20" : ""} ${viewMode === "trash" ? "opacity-70" : ""}`}
                  >
                    <td className="px-6 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => handleSelectOne(row.id, e.target.checked)}
                        className="w-4 h-4 rounded border-slate-350 accent-[#811331] cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className={`w-11 h-11 rounded-xl bg-slate-100 overflow-hidden border flex-shrink-0 ${viewMode === "trash" ? "border-red-100 grayscale" : "border-slate-200"}`}>
                          {row.images?.[0] ? (
                            <img src={row.images[0]} alt={row.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <Package size={18} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-[16px] font-bold text-slate-900 line-clamp-1 max-w-[185px]">{row.name}</p>
                          <p className="text-[16px] text-slate-400 font-mono mt-0.5">{row.id.substring(0, 10)}…</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[16px] font-medium text-slate-500">{row.sku || row.productCode || row.id.slice(0, 10)}</td>
                    <td className="px-5 py-4">
                      <span className="text-[16px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                        {row.category || "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {row.country ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[16px] font-semibold text-blue-600">
                          🌍 {row.country}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[16px]"> </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-[16px] font-bold text-slate-900">₹{Number(row.price || 0).toLocaleString()}</p>
                    </td>
                    {viewMode === "active" && (
                      <td className="px-5 py-4">
                        <QuickStockEditor productId={row.id} currentStock={row.stock} />
                      </td>
                    )}
                    {viewMode === "active" && (
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[16px] font-bold uppercase tracking-wide border ${statusBadgeClasses(row.stock_status || "In Stock")}`}>
                          {row.stock_status || "In Stock"}
                        </span>
                      </td>
                    )}
                    {viewMode === "active" && (
                      <td className="px-5 py-4 text-[16px] text-slate-500">
                        {row.createdAt?.toDate ? row.createdAt.toDate().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : " "}
                      </td>
                    )}
                    {viewMode === "trash" && (
                      <td className="px-5 py-4 text-[16px] text-red-400">
                        {row.deletedAt?.toDate
                          ? row.deletedAt.toDate().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                          : "Recently"}
                      </td>
                    )}
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        {viewMode === "active" && (
                          <>
                            {onEditProduct && (
                              <button
                                type="button"
                                onClick={() => onEditProduct(row)}
                                className="p-2 rounded-xl text-slate-500 hover:text-white hover:bg-[#811331] bg-slate-100 transition-all"
                                title="Edit"
                              >
                                <Edit2 size={14} />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => openConfirm("trash_one", [row.id])}
                              className="p-2 rounded-xl text-amber-600 hover:text-white hover:bg-amber-500 bg-amber-50 transition-all"
                              title="Move to Trash"
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                        {viewMode === "trash" && (
                          <>
                            <button
                              type="button"
                              onClick={() => openConfirm("restore_one", [row.id])}
                              className="p-2 rounded-xl text-emerald-600 hover:text-white hover:bg-emerald-500 bg-emerald-50 transition-all"
                              title="Restore"
                            >
                              <ArchiveRestore size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => openConfirm("permanent_one", [row.id])}
                              className="p-2 rounded-xl text-red-500 hover:text-white hover:bg-red-500 bg-red-50 transition-all"
                              title="Delete Forever"
                            >
                              <ShieldAlert size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Card List View */}
        <div className="lg:hidden divide-y divide-slate-50">
          {paginatedProducts.map((row) => {
            const isChecked = selectedIds.includes(row.id);
            return (
              <div key={row.id} className={`p-5 hover:bg-slate-50 transition-colors relative ${isChecked ? "bg-red-50/10" : ""} ${viewMode === "trash" ? "opacity-75" : ""}`}>
                <div className="absolute top-4 left-4 z-10">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => handleSelectOne(row.id, e.target.checked)}
                    className="w-4.5 h-4.5 rounded border-slate-350 accent-[#811331]"
                  />
                </div>

                <div className="flex items-center gap-4 mb-4 pl-7">
                  <div className={`w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden border flex-shrink-0 ${viewMode === "trash" ? "border-red-100 grayscale" : "border-slate-200"}`}>
                    {row.images?.[0] ? (
                      <img src={row.images[0]} alt={row.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <Package size={22} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{row.name}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-[16px] font-bold text-slate-400 uppercase">{row.category}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span className="text-sm font-bold text-[#811331]">₹{Number(row.price || 0).toLocaleString()}</span>
                    </div>
                    {viewMode === "active" && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 uppercase">Stock:</span>
                        <QuickStockEditor productId={row.id} currentStock={row.stock} />
                      </div>
                    )}
                    {viewMode === "trash" && (
                      <div className="mt-1">
                        <span className="text-xs font-semibold text-red-400">
                          Deleted: {row.deletedAt?.toDate ? row.deletedAt.toDate().toLocaleDateString("en-IN") : "Recently"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 pl-7">
                  {viewMode === "active" && (
                    <>
                      {onEditProduct && (
                        <button
                          onClick={() => onEditProduct(row)}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-900 text-white rounded-xl text-base font-bold transition-all active:scale-95"
                        >
                          <Edit2 size={13} /> Edit
                        </button>
                      )}
                      <button
                        onClick={() => openConfirm("trash_one", [row.id])}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-amber-50 text-amber-700 rounded-xl text-base font-bold border border-amber-100 transition-all active:scale-95"
                      >
                        <Trash2 size={13} /> Trash
                      </button>
                    </>
                  )}
                  {viewMode === "trash" && (
                    <>
                      <button
                        onClick={() => openConfirm("restore_one", [row.id])}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl text-base font-bold border border-emerald-100 transition-all active:scale-95"
                      >
                        <ArchiveRestore size={13} /> Restore
                      </button>
                      <button
                        onClick={() => openConfirm("permanent_one", [row.id])}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-600 rounded-xl text-base font-bold border border-red-100 transition-all active:scale-95"
                      >
                        <ShieldAlert size={13} /> Delete Forever
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="px-8 py-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-5 border border-slate-100">
              {viewMode === "trash" ? (
                <Trash size={30} className="text-slate-300" />
              ) : (
                <Package size={30} className="text-slate-300" />
              )}
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              {viewMode === "trash" ? "Trash is empty" : "No products yet"}
            </h3>
            <p className="text-base text-slate-400 max-w-[200px] mx-auto">
              {viewMode === "trash"
                ? "Deleted products will appear here and can be restored."
                : "Your inventory is empty. Add your first jewelry item."}
            </p>
            {viewMode === "active" && (
              <button
                onClick={onAddProduct}
                className="mt-6 px-6 py-2.5 bg-[#811331] text-white rounded-xl text-base font-bold shadow-lg shadow-[#811331]/20 hover:bg-[#9d1a3d] transition-all"
              >
                Add Your First Product
              </button>
            )}
          </div>
        )}

        {/* Footer Controls with Pagination */}
        {filteredProducts.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 px-6 py-4 gap-4 text-base font-semibold text-slate-500 bg-slate-50/30">
            <div className="flex items-center gap-2">
              <span>Showing</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="rounded-lg border border-slate-200 bg-white px-2 py-1 outline-none text-slate-700 font-bold"
              >
                {[10, 25, 50, 100].map((size) => (
                  <option key={size} value={size}>{size} rows</option>
                ))}
              </select>
              <span>of {filteredProducts.length} entries</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg font-bold text-slate-800">
                Page {currentPage} of {totalPages || 1}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default ProductsTable;
