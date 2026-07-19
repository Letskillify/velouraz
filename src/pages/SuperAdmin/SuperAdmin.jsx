// SuperAdmin.jsx
import React, { useState, useEffect, useMemo } from "react";
import { db, auth } from "../../components/Firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  onSnapshot,
  where
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingBag,
  List,
  Users,
  Image,
  LogOut,
  Settings,
  Plus,
  Package,
  ShieldCheck,
  Activity,
  Database,
  ArrowUpRight,
  TrendingUp,
  CreditCard,
  Layers3,
  Globe2,
  Tags,
  Images,
  Edit2,
  Trash2,
  Lock,
  Sun,
  Moon,
  Check,
  X,
  FileText,
  Search,
  Eye,
  Key
} from "lucide-react";
import SuperAdminAuth from "./SuperAdminAuth";
import MetricCards from "../Admin/components/MetricCards";
import ProductsTable from "../Admin/components/ProductsTable";
import UsersTable from "../Admin/components/UsersTable";
import MediaLibrary from "../Admin/components/MediaLibrary";
import ProductEditor from "../Admin/components/ProductEditor";
import CatalogManager from "../Admin/components/CatalogManager";

// Chart.js imports
import { Chart as ChartJS, ArcElement, CategoryScale, Filler, Legend, LineElement, LinearScale, PointElement, Tooltip } from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, CategoryScale, Filler, Legend, LineElement, LinearScale, PointElement, Tooltip);

const sidebarItems = [
  { name: "Dashboard", icon: LayoutDashboard, desc: "Overview" },
  { name: "Products", icon: Package, desc: "Catalog" },
  { name: "Orders", icon: ShoppingBag, desc: "Transactions" },
  { name: "Inventory", icon: Database, desc: "Stock" },
  { name: "Billing", icon: CreditCard, desc: "Revenue & Billing" },
  { name: "Categories", icon: List, desc: "Structures" },
  { name: "Users", icon: Users, desc: "Accounts" },
  { name: "Admins", icon: ShieldCheck, desc: "Remote Access" },
  { name: "Media", icon: Image, desc: "Assets" }
];

const statusBadgeClasses = (status) => {
  switch (status?.toLowerCase()) {
    case "delivered": return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
    case "shipped": return "bg-blue-50 text-blue-700 border-blue-200/60";
    case "processing": return "bg-purple-50 text-purple-700 border-purple-200/60";
    case "cancelled": return "bg-red-50 text-red-700 border-red-200/60";
    default: return "bg-amber-50 text-amber-700 border-amber-200/60";
  }
};

const SuperAdmin = () => {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [adminsList, setAdminsList] = useState([]);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isEditAdminModalOpen, setIsEditAdminModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [newAdminId, setNewAdminId] = useState("");
  const [newAdminPass, setNewAdminPass] = useState("");
  const [superAdminUser, setSuperAdminUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  
  // Realtime updates
  useEffect(() => {
    const darkPref = localStorage.getItem("velouraz_superadmin_dark");
    if (darkPref === "true") setIsDarkMode(true);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("velouraz_superadmin_dark", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "superadmins", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().role === "superadmin") {
            setSuperAdminUser(user);
          } else {
            await signOut(auth);
            setSuperAdminUser(null);
          }
        } catch (error) {
          console.error("Error checking superadmin status:", error);
          setSuperAdminUser(null);
        }
      } else {
        setSuperAdminUser(null);
      }
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  // Listen to Firestore
  useEffect(() => {
    if (!superAdminUser) return;
    
    const snapProducts = onSnapshot(collection(db, "products"), (snap) => {
      setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    const snapUsers = onSnapshot(collection(db, "users"), (snap) => {
      setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    const snapOrders = onSnapshot(collection(db, "orders"), (snap) => {
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    const snapAdmins = onSnapshot(collection(db, "admins"), (snap) => {
      setAdminsList(snap.docs.map((d) => ({ firestoreId: d.id, ...d.data() })));
    });

    return () => {
      snapProducts();
      snapUsers();
      snapOrders();
      snapAdmins();
    };
  }, [superAdminUser]);

  // Analytics helper calculations
  const totalRevenue = useMemo(() => {
    return orders
      .filter((o) => o.status !== "Cancelled")
      .reduce((sum, o) => sum + Number(o.total || 0), 0);
  }, [orders]);

  const platformProfit = useMemo(() => {
    // Computed based on cost price vs selling price
    return products.reduce((sum, p) => {
      const margin = Number(p.price || 0) - Number(p.costPrice || p.original_price * 0.4 || 0);
      return sum + (margin > 0 ? margin : 0);
    }, 0);
  }, [products]);

  const lowStockProducts = useMemo(() => {
    return products.filter((p) => Number(p.stock || 0) <= 10);
  }, [products]);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });
    } catch (e) {
      console.error("Order status update failed:", e);
    }
  };

  const handleQuickStockAdjustment = async (productId, amount) => {
    try {
      const prodRef = doc(db, "products", productId);
      const prodSnap = await getDoc(prodRef);
      if (prodSnap.exists()) {
        const currentStock = Number(prodSnap.data().stock || 0);
        await updateDoc(prodRef, {
          stock: Math.max(0, currentStock + amount),
          stock_status: (currentStock + amount) <= 0 ? "Out of Stock" : "In Stock"
        });
      }
    } catch (e) {
      console.error("Stock adjustment failed:", e);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteDoc(doc(db, "products", id));
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!newAdminId || !newAdminPass) return;
    try {
      await addDoc(collection(db, "admins"), {
        adminId: newAdminId,
        password: newAdminPass,
        displayName: newAdminId,
        email: `${newAdminId}@velouraz.com`,
        phone: "",
        role: "Admin",
        createdAt: new Date().toISOString()
      });
      setIsAdminModalOpen(false);
      setNewAdminId("");
      setNewAdminPass("");
    } catch (error) {
      console.error("Error creating admin:", error);
    }
  };

  const handleEditAdmin = async (e) => {
    e.preventDefault();
    if (!selectedAdmin) return;
    try {
      await updateDoc(doc(db, "admins", selectedAdmin.firestoreId), {
        adminId: selectedAdmin.adminId,
        password: selectedAdmin.password,
        role: selectedAdmin.role || "Admin"
      });
      setIsEditAdminModalOpen(false);
      setSelectedAdmin(null);
    } catch (e) {
      console.error("Error editing admin:", e);
    }
  };

  const handleDeleteAdmin = async (firestoreId) => {
    if (window.confirm("Are you sure you want to revoke remote access for this admin?")) {
      await deleteDoc(doc(db, "admins", firestoreId));
    }
  };

  // Chart data calculations
  const chartData = useMemo(() => {
    const dates = Array.from({ length: 14 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    }).reverse();

    const counts = Array(14).fill(0);
    const revenueArr = Array(14).fill(0);

    orders.forEach((o) => {
      const oDate = o.createdAt ? new Date(o.createdAt) : new Date();
      const diff = Math.floor((new Date() - oDate) / (1000 * 60 * 60 * 24));
      if (diff >= 0 && diff < 14) {
        counts[13 - diff] += 1;
        revenueArr[13 - diff] += Number(o.total || 0);
      }
    });

    return {
      labels: dates,
      counts,
      revenueArr
    };
  }, [orders]);

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true }
    }
  };

  const lineChartData = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Revenue (₹)",
        data: chartData.revenueArr,
        borderColor: "#811331",
        backgroundColor: "rgba(129, 19, 49, 0.05)",
        fill: true,
        tension: 0.4
      }
    ]
  };

  const bg = isDarkMode ? "bg-[#0f1117]" : "bg-[#f5f5f7]";
  const cardBg = isDarkMode ? "bg-[#1e2230] border-slate-700/60" : "bg-white border-slate-100";
  const textPrimary = isDarkMode ? "text-white" : "text-slate-900";
  const textMuted = isDarkMode ? "text-slate-400" : "text-slate-500";
  const divider = isDarkMode ? "border-slate-700" : "border-slate-150";

  const renderHeader = () => (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className={`text-2xl font-bold tracking-tight ${textPrimary}`}>
          Super Admin Console
        </h1>
        <p className={`mt-1 text-sm ${textMuted}`}>
          Platform Control Panel — {activeItem}
        </p>
      </div>
      <div className="flex items-center gap-3 self-end sm:self-auto">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`h-10 w-10 rounded-xl flex items-center justify-center border transition-all ${
            isDarkMode ? "bg-slate-800 border-slate-700 text-yellow-400" : "bg-white border-slate-200 text-slate-600"
          }`}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button
          onClick={() => {
            setEditingProduct(null);
            setIsProductModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#811331] text-white rounded-xl text-xs font-bold shadow-lg shadow-[#811331]/20 hover:bg-[#9d1a3d] transition-all active:scale-95"
        >
          <Plus size={14} />
          <span>Add Product</span>
        </button>
      </div>
    </header>
  );

  const renderMainContent = () => {
    switch (activeItem) {
      case "Dashboard":
        return (
          <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className={`p-5 rounded-2xl border shadow-sm ${cardBg}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-wider ${textMuted}`}>Total Platform Sales</p>
                    <p className={`text-2xl font-bold mt-2 ${textPrimary}`}>₹{totalRevenue.toLocaleString("en-IN")}</p>
                  </div>
                  <span className="p-3 rounded-xl bg-rose-50 text-[#811331]">
                    <TrendingUp size={20} />
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-3 text-xs text-emerald-600 font-semibold">
                  <ArrowUpRight size={14} />
                  <span>Platform live transactions</span>
                </div>
              </div>

              <div className={`p-5 rounded-2xl border shadow-sm ${cardBg}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-wider ${textMuted}`}>Total Orders</p>
                    <p className={`text-2xl font-bold mt-2 ${textPrimary}`}>{orders.length}</p>
                  </div>
                  <span className="p-3 rounded-xl bg-blue-50 text-blue-600">
                    <ShoppingBag size={20} />
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-3 text-xs text-blue-600 font-semibold">
                  <span>Across all regions</span>
                </div>
              </div>

              <div className={`p-5 rounded-2xl border shadow-sm ${cardBg}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-wider ${textMuted}`}>Live Catalog Products</p>
                    <p className={`text-2xl font-bold mt-2 ${textPrimary}`}>{products.length}</p>
                  </div>
                  <span className="p-3 rounded-xl bg-[#811331]/10 text-[#811331]">
                    <Package size={20} />
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-3 text-xs text-amber-600 font-semibold">
                  <span>{lowStockProducts.length} low stock warnings</span>
                </div>
              </div>

              <div className={`p-5 rounded-2xl border shadow-sm ${cardBg}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-wider ${textMuted}`}>Active Customers</p>
                    <p className={`text-2xl font-bold mt-2 ${textPrimary}`}>{users.length}</p>
                  </div>
                  <span className="p-3 rounded-xl bg-purple-50 text-purple-600">
                    <Users size={20} />
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-3 text-xs text-purple-600 font-semibold">
                  <span>Platform accounts</span>
                </div>
              </div>
            </div>

            {/* Revenue Trend Chart */}
            <div className={`p-5 rounded-2xl border shadow-sm ${cardBg}`}>
              <h3 className={`text-sm font-bold mb-4 ${textPrimary}`}>Platform Revenue Trend (Last 14 Days)</h3>
              <div className="h-64">
                <Line data={lineChartData} options={lineChartOptions} />
              </div>
            </div>

            {/* Platform Quick Health */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Recent Orders Overview */}
              <div className={`rounded-2xl border shadow-sm overflow-hidden ${cardBg}`}>
                <div className="px-5 py-4 border-b border-slate-100/10 flex justify-between items-center">
                  <h3 className={`text-sm font-bold ${textPrimary}`}>Recent Transactions</h3>
                  <button onClick={() => setActiveItem("Orders")} className="text-xs font-bold text-[#811331]">View all</button>
                </div>
                <div className="divide-y divide-slate-100/10 max-h-80 overflow-y-auto">
                  {orders.slice(0, 5).map((o) => (
                    <div key={o.id} className="p-4 flex items-center justify-between hover:bg-slate-50/5">
                      <div>
                        <p className={`text-xs font-bold font-mono ${textPrimary}`}>#{o.id.slice(0, 8)}</p>
                        <p className={`text-[11px] ${textMuted}`}>{o.customerName || o.email || "Guest User"}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-xs font-bold ${textPrimary}`}>₹{Number(o.total || 0).toLocaleString("en-IN")}</p>
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 border ${statusBadgeClasses(o.status)}`}>
                          {o.status || "Pending"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inventory warning */}
              <div className={`rounded-2xl border shadow-sm overflow-hidden ${cardBg}`}>
                <div className="px-5 py-4 border-b border-slate-100/10 flex justify-between items-center">
                  <h3 className={`text-sm font-bold ${textPrimary}`}>Stock Level Alerts</h3>
                  <button onClick={() => setActiveItem("Inventory")} className="text-xs font-bold text-[#811331]">Manage Inventory</button>
                </div>
                <div className="divide-y divide-slate-100/10 max-h-80 overflow-y-auto">
                  {lowStockProducts.slice(0, 5).map((p) => (
                    <div key={p.id} className="p-4 flex items-center justify-between hover:bg-slate-50/5">
                      <div className="flex items-center gap-3">
                        <img src={p.images?.[0] || p.image} alt="" className="w-8 h-8 rounded-lg object-cover bg-slate-100" />
                        <div>
                          <p className={`text-xs font-bold ${textPrimary} truncate max-w-[180px]`}>{p.name}</p>
                          <p className={`text-[10px] ${textMuted}`}>{p.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs font-bold ${Number(p.stock) === 0 ? "text-red-500" : "text-amber-500"}`}>
                          {p.stock} remaining
                        </span>
                      </div>
                    </div>
                  ))}
                  {lowStockProducts.length === 0 && (
                    <div className="p-8 text-center text-xs text-slate-400">
                      All products have healthy stock counts.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case "Products":
        return (
          <div className="space-y-4">
            <ProductsTable
              products={products}
              onAddProduct={() => {
                setEditingProduct(null);
                setIsProductModalOpen(true);
              }}
              onEditProduct={(p) => {
                setEditingProduct(p);
                setIsProductModalOpen(true);
              }}
              onDeleteProduct={handleDeleteProduct}
              onRefresh={loadProducts}
            />
          </div>
        );

      case "Orders":
        return (
          <div className={`rounded-2xl border shadow-sm overflow-hidden ${cardBg}`}>
            <div className="px-6 py-5 border-b border-slate-100/10">
              <h3 className={`text-sm font-bold ${textPrimary}`}>Platform Order Management</h3>
              <p className={`text-xs ${textMuted} mt-1`}>Fulfill orders, cancel transactions, and track status</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className={`text-[11px] font-bold uppercase tracking-wider border-b border-slate-100/10 ${isDarkMode ? "bg-slate-800 text-slate-400" : "bg-slate-50 text-slate-400"}`}>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Total Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/10 text-xs font-medium">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50/5">
                      <td className="px-6 py-4 font-mono font-bold">{o.id.slice(0, 8)}</td>
                      <td className="px-6 py-4">
                        <div>
                          <p className={`font-bold ${textPrimary}`}>{o.customerName || "Platform Guest"}</p>
                          <p className={`text-[10px] ${textMuted}`}>{o.email}</p>
                        </div>
                      </td>
                      <td className={`px-6 py-4 ${textMuted}`}>{o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-IN") : "Recent"}</td>
                      <td className={`px-6 py-4 font-bold ${textPrimary}`}>₹{Number(o.total || 0).toLocaleString("en-IN")}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full font-bold border text-[10px] uppercase ${statusBadgeClasses(o.status)}`}>
                          {o.status || "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <select
                          value={o.status || "Pending"}
                          onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                          className="bg-transparent border border-slate-200 rounded-lg p-1 text-xs outline-none focus:border-[#811331]"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-16 text-center text-slate-400">
                        No orders recorded on the platform yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "Inventory":
        return (
          <div className={`rounded-2xl border shadow-sm overflow-hidden ${cardBg}`}>
            <div className="px-6 py-5 border-b border-slate-100/10">
              <h3 className={`text-sm font-bold ${textPrimary}`}>Inventory Control</h3>
              <p className={`text-xs ${textMuted} mt-1`}>Adjust stock levels, set low-stock triggers, and view status</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className={`text-[11px] font-bold uppercase tracking-wider border-b border-slate-100/10 ${isDarkMode ? "bg-slate-800 text-slate-400" : "bg-slate-50 text-slate-400"}`}>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Current Stock</th>
                    <th className="px-6 py-4">Quick Adjust</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/10 text-xs">
                  {products.map((p) => {
                    const isLow = Number(p.stock || 0) <= 10;
                    const isOut = Number(p.stock || 0) <= 0;
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/5">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={p.images?.[0] || p.image} alt="" className="w-10 h-10 rounded-xl object-cover bg-slate-100" />
                            <div>
                              <p className={`font-bold ${textPrimary}`}>{p.name}</p>
                              <p className={`text-[10px] ${textMuted}`}>SKU: {p.sku || "N/A"}</p>
                            </div>
                          </div>
                        </td>
                        <td className={`px-6 py-4 font-semibold ${textMuted}`}>{p.category}</td>
                        <td className={`px-6 py-4 font-bold ${textPrimary}`}>{p.stock || 0} units</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleQuickStockAdjustment(p.id, -1)}
                              className="w-7 h-7 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg flex items-center justify-center font-bold text-slate-700 dark:text-white"
                            >
                              -
                            </button>
                            <button
                              onClick={() => handleQuickStockAdjustment(p.id, 5)}
                              className="px-2 py-1 bg-[#811331]/10 text-[#811331] rounded-lg font-bold text-[10px]"
                            >
                              +5
                            </button>
                            <button
                              onClick={() => handleQuickStockAdjustment(p.id, 25)}
                              className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg font-bold text-[10px]"
                            >
                              +25
                            </button>
                            <button
                              onClick={() => handleQuickStockAdjustment(p.id, 1)}
                              className="w-7 h-7 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg flex items-center justify-center font-bold text-slate-700 dark:text-white"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {isOut ? (
                            <span className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-100">Out of Stock</span>
                          ) : isLow ? (
                            <span className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">Low Stock</span>
                          ) : (
                            <span className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">Healthy</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "Billing":
        return (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border shadow-sm ${cardBg}`}>
              <h3 className={`text-base font-bold ${textPrimary} mb-2`}>Billing Statements & Net Income</h3>
              <p className={`text-xs ${textMuted} mb-6`}>Platform margin calculations and invoicing breakdown</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className={`p-4 rounded-xl border ${isDarkMode ? "border-slate-700 bg-slate-900/40" : "border-slate-100 bg-slate-50"}`}>
                  <p className={`text-xs font-bold ${textMuted}`}>Gross Revenue</p>
                  <p className={`text-2xl font-bold mt-1 ${textPrimary}`}>₹{totalRevenue.toLocaleString("en-IN")}</p>
                </div>
                <div className={`p-4 rounded-xl border ${isDarkMode ? "border-slate-700 bg-slate-900/40" : "border-slate-100 bg-slate-50"}`}>
                  <p className={`text-xs font-bold ${textMuted}`}>Est. Platform margin profit</p>
                  <p className="text-2xl font-bold mt-1 text-emerald-600">₹{platformProfit.toLocaleString("en-IN")}</p>
                </div>
                <div className={`p-4 rounded-xl border ${isDarkMode ? "border-slate-700 bg-slate-900/40" : "border-slate-100 bg-slate-50"}`}>
                  <p className={`text-xs font-bold ${textMuted}`}>Avg Order Value</p>
                  <p className={`text-2xl font-bold mt-1 ${textPrimary}`}>
                    ₹{orders.length ? Math.round(totalRevenue / orders.length).toLocaleString("en-IN") : 0}
                  </p>
                </div>
              </div>
            </div>

            <div className={`rounded-2xl border shadow-sm overflow-hidden ${cardBg}`}>
              <div className="px-6 py-5 border-b border-slate-100/10">
                <h4 className={`text-sm font-bold ${textPrimary}`}>Invoices Log</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className={`text-[11px] font-bold uppercase tracking-wider border-b border-slate-100/10 ${isDarkMode ? "bg-slate-800 text-slate-400" : "bg-slate-50 text-slate-400"}`}>
                      <th className="px-6 py-4">Invoice #</th>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Order Value</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Statement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/10 text-xs">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-50/5">
                        <td className="px-6 py-4 font-mono font-bold">INV-{o.id.slice(0, 6).toUpperCase()}</td>
                        <td className="px-6 py-4">
                          <div>
                            <p className={`font-bold ${textPrimary}`}>{o.customerName || "Guest Account"}</p>
                            <p className={`text-[10px] ${textMuted}`}>{o.email}</p>
                          </div>
                        </td>
                        <td className={`px-6 py-4 font-bold ${textPrimary}`}>₹{Number(o.total || 0).toLocaleString("en-IN")}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold border text-[9px] uppercase ${statusBadgeClasses(o.status)}`}>
                            {o.status || "Pending"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => {
                              alert(`Invoice details:\nOrder ID: ${o.id}\nCustomer: ${o.customerName || o.email}\nTotal: ₹${Number(o.total).toLocaleString("en-IN")}\nStatus: ${o.status || "Pending"}`);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300"
                          >
                            <FileText size={10} /> View details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "Categories":
        return <CatalogManager type="Categories" />;
      case "Users":
        return <UsersTable users={users} />;
      case "Admins":
        return (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border shadow-sm ${cardBg}`}>
              <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
                <div>
                  <h3 className={`text-sm font-bold ${textPrimary}`}>Remote Access Control</h3>
                  <p className={`text-xs ${textMuted} mt-0.5`}>Create admin accounts and set credentials for administrative panel</p>
                </div>
                <button
                  onClick={() => setIsAdminModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#811331] text-white rounded-xl text-xs font-bold hover:bg-[#9d1a3d] transition-all"
                >
                  <Plus size={14} /> Add new admin
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className={`text-[11px] font-bold uppercase tracking-wider border-b border-slate-100/10 ${isDarkMode ? "bg-slate-800 text-slate-400" : "bg-slate-50 text-slate-400"}`}>
                      <th className="px-6 py-4">Admin ID</th>
                      <th className="px-6 py-4">Access key</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/10 text-xs">
                    {adminsList.map((admin) => (
                      <tr key={admin.firestoreId} className="hover:bg-slate-50/5">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className={`font-bold ${textPrimary}`}>{admin.adminId}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Key size={12} className="text-slate-400" />
                            <span className="font-mono text-slate-600 dark:text-slate-300">{admin.password}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                            Active Remote
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setSelectedAdmin(admin);
                              setIsEditAdminModalOpen(true);
                            }}
                            className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                            title="Edit Password"
                          >
                            <Lock size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteAdmin(admin.firestoreId)}
                            className="p-1.5 border border-red-200 rounded-lg hover:bg-red-50 text-red-500"
                            title="Delete"
                          >
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {adminsList.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                          No delegated admin accounts configured.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "Media":
        return <MediaLibrary />;

      default:
        return null;
    }
  };

  const SidebarContent = () => (
    <div className={`flex flex-col h-full border-r ${isDarkMode ? "bg-[#161922] border-slate-800" : "bg-white border-slate-100"}`}>
      <div className={`px-6 py-6 border-b ${divider}`}>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#811331] text-white flex items-center justify-center text-sm font-bold shadow-xl shadow-[#811331]/20">
            SA
          </div>
          <div>
            <p className={`text-sm font-bold tracking-tight ${textPrimary}`}>
              Super Admin
            </p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Control Center</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {sidebarItems.map((item) => {
          const isActive = item.name === activeItem;
          const Icon = item.icon;
          return (
            <button
              key={item.name}
              type="button"
              onClick={() => {
                setActiveItem(item.name);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                isActive
                  ? "bg-[#811331] text-white shadow-lg shadow-[#811331]/20"
                  : isDarkMode
                    ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon size={16} className={isActive ? "text-white" : "text-slate-400 group-hover:text-[#811331]"} />
              <span className="flex-1 text-left">{item.name}</span>
            </button>
          );
        })}
      </nav>

      <div className={`px-4 py-5 border-t space-y-3 ${divider}`}>
        <div className={`px-3 py-2.5 rounded-xl border ${isDarkMode ? "bg-slate-900/40 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Session</p>
          <p className={`text-xs font-semibold truncate ${textPrimary}`} title={superAdminUser?.email}>
            {superAdminUser?.email}
          </p>
        </div>
        <button
          onClick={() => signOut(auth)}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition-all border border-red-100"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </div>
  );

  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-55">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#811331]/10 border-t-[#811331] rounded-full"
        />
      </div>
    );
  }

  if (!superAdminUser) {
    return <SuperAdminAuth onAuthSuccess={(user) => setSuperAdminUser(user)} />;
  }

  return (
    <div className={`min-h-screen flex ${bg} ${textPrimary} font-sans selection:bg-[#811331]/10 transition-colors duration-300`}>
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 flex-col sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden shadow-2xl"
          >
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Navbar */}
        <nav className={`lg:hidden flex items-center justify-between px-6 py-4 border-b sticky top-0 z-30 ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-[#811331] text-white flex items-center justify-center text-xs font-bold">
              SA
            </div>
            <span className={`font-bold text-sm tracking-tight ${textPrimary}`}>Super Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-xl border transition-all ${
                isDarkMode ? "bg-slate-800 border-slate-700 text-yellow-400" : "bg-slate-50 border-slate-200 text-slate-600"
              }`}
            >
              {isDarkMode ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700 hover:bg-slate-100 transition-all"
            >
              <Menu size={16} />
            </button>
          </div>
        </nav>

        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 sm:py-8 lg:px-9 lg:py-8">
          <div className="max-w-[1500px] mx-auto">
            {activeItem !== "AddProduct" && activeItem !== "EditProduct" && renderHeader()}
            <motion.div
              key={activeItem}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              {renderMainContent()}
            </motion.div>
          </div>
        </main>
      </div>

      {/* Add / Edit Product Modal */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProductModalOpen(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`rounded-3xl shadow-2xl max-w-4xl w-full relative z-10 max-h-[90vh] overflow-hidden flex flex-col ${isDarkMode ? "bg-[#1a1d26]" : "bg-white"}`}
            >
              <div className={`px-6 py-4 border-b flex items-center justify-between ${divider}`}>
                <div>
                  <h2 className={`text-base font-bold ${textPrimary}`}>
                    {editingProduct ? "Edit Product" : "Add New Product"}
                  </h2>
                  <p className={`text-xs ${textMuted}`}>
                    Super admins can manage catalog items directly
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-400"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <ProductEditor
                  product={editingProduct}
                  onCancel={() => setIsProductModalOpen(false)}
                  onSuccess={async () => {
                    setIsProductModalOpen(false);
                    await loadProducts();
                  }}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Admin Modal */}
      <AnimatePresence>
        {isAdminModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdminModalOpen(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`rounded-3xl shadow-2xl max-w-sm w-full relative z-10 overflow-hidden flex flex-col ${isDarkMode ? "bg-[#1a1d26]" : "bg-white"}`}
            >
              <div className={`px-6 py-4 border-b flex items-center justify-between bg-slate-50/50 ${divider}`}>
                <div>
                  <h2 className={`text-sm font-bold ${textPrimary}`}>Add New Admin</h2>
                  <p className={`text-[10px] ${textMuted}`}>Create access key credentials</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAdminModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="px-6 py-6">
                <form onSubmit={handleCreateAdmin} className="space-y-4">
                  <div className="space-y-1">
                    <label className={`block text-[10px] font-bold uppercase tracking-wider ${textMuted}`}>Admin ID</label>
                    <input
                      type="text"
                      required
                      value={newAdminId}
                      onChange={(e) => setNewAdminId(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl text-xs outline-none border ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"}`}
                      placeholder="e.g. employee_01"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={`block text-[10px] font-bold uppercase tracking-wider ${textMuted}`}>Password</label>
                    <input
                      type="text"
                      required
                      value={newAdminPass}
                      onChange={(e) => setNewAdminPass(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl text-xs outline-none border ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"}`}
                      placeholder="Enter password"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#811331] hover:bg-[#9d1a3d] text-white text-xs font-bold rounded-xl transition-all shadow-md"
                  >
                    Create Account
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Admin Modal */}
      <AnimatePresence>
        {isEditAdminModalOpen && selectedAdmin && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsEditAdminModalOpen(false);
                setSelectedAdmin(null);
              }}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`rounded-3xl shadow-2xl max-w-sm w-full relative z-10 overflow-hidden flex flex-col ${isDarkMode ? "bg-[#1a1d26]" : "bg-white"}`}
            >
              <div className={`px-6 py-4 border-b flex items-center justify-between bg-slate-50/50 ${divider}`}>
                <div>
                  <h2 className={`text-sm font-bold ${textPrimary}`}>Edit Admin Credentials</h2>
                  <p className={`text-[10px] ${textMuted}`}>Adjust password/access key permissions</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditAdminModalOpen(false);
                    setSelectedAdmin(null);
                  }}
                  className="p-1.5 rounded-lg text-slate-400"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="px-6 py-6">
                <form onSubmit={handleEditAdmin} className="space-y-4">
                  <div className="space-y-1">
                    <label className={`block text-[10px] font-bold uppercase tracking-wider ${textMuted}`}>Admin ID (Read Only)</label>
                    <input
                      type="text"
                      disabled
                      value={selectedAdmin.adminId}
                      className={`w-full px-4 py-2.5 rounded-xl text-xs outline-none border opacity-60 ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={`block text-[10px] font-bold uppercase tracking-wider ${textMuted}`}>Access Key / Password</label>
                    <input
                      type="text"
                      required
                      value={selectedAdmin.password}
                      onChange={(e) => setSelectedAdmin({ ...selectedAdmin, password: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl text-xs outline-none border ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"}`}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#811331] hover:bg-[#9d1a3d] text-white text-xs font-bold rounded-xl transition-all shadow-md"
                  >
                    Save Credentials
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SuperAdmin;
