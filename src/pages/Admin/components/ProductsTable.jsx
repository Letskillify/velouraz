// ProductsTable.jsx
import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, Trash2, Package, Plus, RefreshCw, Search, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { statusBadgeClasses } from "./AdminUtils";
import CSVUpload from "./CSVUpload";

const ProductsTable = ({ products, onAddProduct, onEditProduct, onDeleteProduct, onRefresh }) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");

  // Pagination & Selection States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState([]);

  // Filter & Search
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = `${product.name || ""} ${product.sku || ""} ${product.country || ""}`.toLowerCase().includes(search.toLowerCase());
      return matchesSearch && (category === "All Categories" || product.category === category);
    });
  }, [products, search, category]);

  // Derived Pagination
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, category, pageSize]);

  const categories = [...new Set(products.map((product) => product.category).filter(Boolean))];

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

  const isAllPageSelected = paginatedProducts.length > 0 && paginatedProducts.every((p) => selectedIds.includes(p.id));

  const handleBatchDelete = async () => {
    if (!window.confirm(`Delete ${selectedIds.length} selected products?`)) return;
    try {
      for (const id of selectedIds) {
        await onDeleteProduct(id);
      }
      setSelectedIds([]);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Batch delete failed:", err);
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="px-6 py-5 sm:px-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[16px] font-bold text-slate-900 flex items-center gap-2.5">
            <span className="p-1.5 bg-[#811331]/10 rounded-lg">
              <Package size={15} className="text-[#811331]" />
            </span>
            Products
          </h2>
          <p className="text-base text-slate-400 font-medium mt-1 ml-0.5">
            {products.length} item{products.length !== 1 ? "s" : ""} in inventory
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {selectedIds.length > 0 && (
            <button
              onClick={handleBatchDelete}
              className="flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-xl text-base font-bold transition-all"
            >
              <Trash2 size={13} />
              Delete Selected ({selectedIds.length})
            </button>
          )}
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
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="mx-5 mb-4 mt-4 flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3 sm:mx-8 sm:flex-row sm:items-center">
        <label className="flex flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-400">
          <Search size={15} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full bg-transparent text-base text-slate-700 outline-none"
            placeholder="Search products..."
          />
        </label>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-base text-slate-600 outline-none"
        >
          <option>All Categories</option>
          {categories.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <button className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-base font-semibold text-slate-700">
          <SlidersHorizontal size={14} />
          Filter
        </button>
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
              <th className="px-5 py-4">Stock</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Date</th>
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
                  className={`hover:bg-slate-50/60 transition-colors group ${isChecked ? "bg-red-50/20" : ""}`}
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
                      <div className="w-11 h-11 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 flex-shrink-0">
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
                      <span className="text-slate-400 text-[16px]">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-[16px] font-bold text-slate-900">₹{Number(row.price || 0).toLocaleString()}</p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${row.stock > 10 ? "bg-emerald-500" : row.stock > 0 ? "bg-amber-500" : "bg-red-500"}`} />
                      <span className="text-[16px] font-semibold text-slate-700">{row.stock || 0}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[16px] font-bold uppercase tracking-wide border ${statusBadgeClasses(row.stock_status || "In Stock")}`}>
                      {row.stock_status || "In Stock"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[16px] text-slate-500">
                    {row.createdAt?.toDate ? row.createdAt.toDate().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
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
                        onClick={() => onDeleteProduct(row.id)}
                        className="p-2 rounded-xl text-red-500 hover:text-white hover:bg-red-500 bg-red-50 transition-all"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
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
            <div key={row.id} className={`p-5 hover:bg-slate-50 transition-colors relative ${isChecked ? "bg-red-50/10" : ""}`}>
              {/* Checkbox placement inside mobile cards */}
              <div className="absolute top-4 left-4 z-10">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => handleSelectOne(row.id, e.target.checked)}
                  className="w-4.5 h-4.5 rounded border-slate-350 accent-[#811331]"
                />
              </div>

              <div className="flex items-center gap-4 mb-4 pl-7">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 flex-shrink-0">
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
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[16px] font-bold text-slate-400 uppercase">{row.category}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span className="text-sm font-bold text-[#811331]">₹{Number(row.price || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pl-7">
                {onEditProduct && (
                  <button
                    onClick={() => onEditProduct(row)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-900 text-white rounded-xl text-base font-bold transition-all active:scale-95"
                  >
                    <Edit2 size={13} /> Edit
                  </button>
                )}
                <button
                  onClick={() => onDeleteProduct(row.id)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-600 rounded-xl text-base font-bold border border-red-100 transition-all active:scale-95"
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="px-8 py-20 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-5 border border-slate-100">
            <Package size={30} className="text-slate-300" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-1">No products yet</h3>
          <p className="text-base text-slate-400 max-w-[200px] mx-auto">
            Your inventory is empty. Add your first jewelry item.
          </p>
          <button
            onClick={onAddProduct}
            className="mt-6 px-6 py-2.5 bg-[#811331] text-white rounded-xl text-base font-bold shadow-lg shadow-[#811331]/20 hover:bg-[#9d1a3d] transition-all"
          >
            Add Your First Product
          </button>
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
  );
};

export default ProductsTable;
