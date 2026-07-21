// SuperAdmin.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import { db, auth } from "../../components/Firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  LayoutDashboard,
  ShoppingBag,
  List,
  Users,
  Image,
  LogOut,
  Plus,
  Package,
  Activity,
  Bell,
  ChevronRight,
  Gem,
  Search,
  Sun,
  Moon,
  ChevronDown,
  ChevronUp,
  Grid2X2,
  Tags,
  Layers3,
  Globe2,
  TicketPercent,
  Star,
  FileText,
  Images,
  Settings,
  Truck,
  CreditCard,
  PanelLeftClose,
  PanelLeftOpen,
  Database,
  Lock,
  Mail,
  Camera,
  Trash2,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck
} from "lucide-react";
import SuperAdminAuth from "./SuperAdminAuth";
import MetricCards from "../Admin/components/MetricCards";
import ProductsTable from "../Admin/components/ProductsTable";
import UsersTable from "../Admin/components/UsersTable";
import MediaLibrary from "../Admin/components/MediaLibrary";
import ProductEditor from "../Admin/components/ProductEditor";
import CatalogManager from "../Admin/components/CatalogManager";
import SiteSettingsManager from "../Admin/components/SiteSettingsManager";
import { uploadToCloudinary } from "../../config/cloudinary";

// Chart.js imports
import { Chart as ChartJS, ArcElement, CategoryScale, Filler, Legend, LineElement, LinearScale, PointElement, Tooltip } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(ArcElement, CategoryScale, Filler, Legend, LineElement, LinearScale, PointElement, Tooltip);

const sidebarItems = [
  { name: "Dashboard", icon: LayoutDashboard, desc: "Overview" },
  { name: "Products", icon: Package, desc: "Catalog" },
  { name: "Orders", icon: ShoppingBag, desc: "Transactions" },
  { name: "Inventory", icon: Database, desc: "Stock" },
  { name: "Billing", icon: CreditCard, desc: "Revenue & Invoices" },
  { name: "Categories", icon: List, desc: "Structure" },
  { name: "Users", icon: Users, desc: "Accounts" },
  { name: "Admins", icon: ShieldCheck, desc: "Access Control" },
  { name: "Media", icon: Image, desc: "Assets" },
  { name: "Banners", icon: Images, desc: "Hero & Carousel" },
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

const sortNewest = (rows) => [...rows].sort((a, b) => {
  const toMillis = (value) => value?.toMillis?.() ?? new Date(value || 0).getTime();
  return toMillis(b.createdAt || b.orderDate || b.date) - toMillis(a.createdAt || a.orderDate || a.date);
});

const SuperAdmin = () => {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [adminsList, setAdminsList] = useState([]);
  const [superAdminUser, setSuperAdminUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [productsMenuOpen, setProductsMenuOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Admin access management modals
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    adminId: "",
    email: "",
    password: "",
    role: "Admin",
    displayName: "",
    photoURL: "",
  });
  const [uploadingAdminPhoto, setUploadingAdminPhoto] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null);

  // Global search state
  const [globalSearch, setGlobalSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // ─── Theme preference ───────────────────────────────────────────────────────
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

  // ─── Super Admin Authentication ─────────────────────────────────────────────
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
          console.error("Error verifying superadmin status:", error);
          setSuperAdminUser(null);
        }
      } else {
        setSuperAdminUser(null);
      }
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  // ─── Listen to Collections in Real-time ─────────────────────────────────────
  useEffect(() => {
    if (!superAdminUser) return undefined;
    
    const snapProducts = onSnapshot(collection(db, "products"), (snapshot) => {
      setProducts(sortNewest(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))));
    });

    const snapUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      setUsers(sortNewest(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))));
    });

    const snapOrders = onSnapshot(collection(db, "orders"), (snapshot) => {
      setOrders(sortNewest(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))));
    });

    const snapAdmins = onSnapshot(collection(db, "admins"), (snapshot) => {
      setAdminsList(sortNewest(snapshot.docs.map((d) => ({ firestoreId: d.id, ...d.data() }))));
    });

    return () => {
      snapProducts();
      snapUsers();
      snapOrders();
      snapAdmins();
    };
  }, [superAdminUser]);

  // ─── Calculations ──────────────────────────────────────────────────────────
  const grossRevenue = useMemo(() => {
    return orders
      .filter((o) => o.status !== "Cancelled")
      .reduce((sum, o) => sum + Number(o.total || 0), 0);
  }, [orders]);

  const profitMargin = useMemo(() => {
    return products.reduce((sum, p) => {
      const margin = Number(p.price || 0) - Number(p.costPrice || p.original_price * 0.4 || 0);
      return sum + (margin > 0 ? margin : 0);
    }, 0);
  }, [products]);

  const lowStockCount = useMemo(() => {
    return products.filter((p) => Number(p.stock || 0) <= 10).length;
  }, [products]);

  // ─── Global Search ──────────────────────────────────────────────────────────
  useEffect(() => {
    const q = globalSearch.trim().toLowerCase();
    if (!q) { setSearchResults([]); setShowSearchResults(false); return; }
    const matched = products.filter((p) =>
      `${p.name || ""} ${p.sku || ""} ${p.category || ""} ${p.country || ""}`.toLowerCase().includes(q)
    ).slice(0, 5).map((p) => ({ type: "product", label: p.name, sub: p.category || "No category", id: p.id, img: p.images?.[0] }));
    const matchedOrders = orders.filter((o) =>
      `${o.id} ${o.customerName || ""} ${o.email || ""}`.toLowerCase().includes(q)
    ).slice(0, 3).map((o) => ({ type: "order", label: `Order #${o.id.slice(0, 8)}`, sub: o.customerName || o.email || "Customer", id: o.id }));
    const matchedUsers = users.filter((u) =>
      `${u.name || ""} ${u.email || ""}`.toLowerCase().includes(q)
    ).slice(0, 3).map((u) => ({ type: "user", label: u.name || u.email, sub: u.email || "User", id: u.id }));
    setSearchResults([...matched, ...matchedOrders, ...matchedUsers]);
    setShowSearchResults(true);
  }, [globalSearch, products, orders, users]);

  // ─── Functions ──────────────────────────────────────────────────────────────
  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteDoc(doc(db, "products", id));
    }
  };

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

  const handleAdminPhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAdminPhoto(true);
    try {
      const url = await uploadToCloudinary(file);
      setNewAdmin((prev) => ({ ...prev, photoURL: url }));
    } catch (err) {
      console.error("Admin photo upload failed:", err);
    } finally {
      setUploadingAdminPhoto(false);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!newAdmin.adminId || !newAdmin.email || !newAdmin.password) return;
    try {
      await addDoc(collection(db, "admins"), {
        adminId: newAdmin.adminId.trim(),
        email: newAdmin.email.trim(),
        password: newAdmin.password.trim(),
        role: newAdmin.role,
        displayName: newAdmin.displayName.trim() || newAdmin.adminId.trim(),
        photoURL: newAdmin.photoURL,
        createdAt: new Date().toISOString()
      });

      // Construct and trigger a direct access email template
      const emailSubject = encodeURIComponent("Welcome to Velouraz - Admin Panel Access Details");
      const emailBody = encodeURIComponent(
        `Hello ${newAdmin.displayName || newAdmin.adminId},\n\n` +
        `You have been granted access to the Velouraz Admin Panel.\n\n` +
        `Credentials:\n` +
        `- Admin ID: ${newAdmin.adminId}\n` +
        `- Access Password: ${newAdmin.password}\n\n` +
        `Link: ${window.location.origin}/admin\n\n` +
        `Best regards,\nSuper Admin Team`
      );

      // Trigger user's mail client or display credentials status
      window.open(`mailto:${newAdmin.email}?subject=${emailSubject}&body=${emailBody}`);

      setEmailStatus(`Access granted! Email template opened for: ${newAdmin.email}`);
      setTimeout(() => setEmailStatus(null), 6000);

      setNewAdmin({
        adminId: "",
        email: "",
        password: "",
        role: "Admin",
        displayName: "",
        photoURL: "",
      });
      setIsAdminModalOpen(false);
    } catch (error) {
      console.error("Error creating admin credential:", error);
    }
  };

  const handleDeleteAdmin = async (firestoreId) => {
    if (window.confirm("Are you sure you want to revoke remote access and delete this administrator account?")) {
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

    const revenueArr = Array(14).fill(0);

    orders.forEach((o) => {
      const oDate = o.createdAt ? new Date(o.createdAt) : new Date();
      const diff = Math.floor((new Date() - oDate) / (1000 * 60 * 60 * 24));
      if (diff >= 0 && diff < 14) {
        revenueArr[13 - diff] += Number(o.total || 0);
      }
    });

    return {
      labels: dates,
      revenueArr
    };
  }, [orders]);

  const lineChartData = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Platform Revenue (₹)",
        data: chartData.revenueArr,
        borderColor: "#9c1237",
        backgroundColor: "rgba(156,18,55,.05)",
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        borderWidth: 2
      }
    ]
  };

  // ─── Header ─────────────────────────────────────────────────────────────────
  const renderHeader = () => (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-slate-400">Velauraz SuperAdmin</span>
          <ChevronRight size={12} className="text-slate-300" />
          <span className="text-xs font-semibold text-[#811331]">{activeItem}</span>
        </div>
        <h1 className={`text-2xl font-bold tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
          {activeItem}
        </h1>
        <p className={`mt-1 text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
          Control Center — fully configure products, catalog, transactions & remote administrative accounts
        </p>
      </div>
      <div className="flex items-center gap-3 self-end sm:self-auto">
        <div className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full shadow-sm border ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"}`}>
          <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_6px_1px_rgba(239,68,68,0.6)] animate-pulse" />
          <span className={`text-xs font-medium ${isDarkMode ? "text-slate-300" : "text-slate-500"}`}>
            Access: <span className="font-bold text-red-500">Super User Mode</span>
          </span>
        </div>
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

  // ─── Main Content Views ──────────────────────────────────────────────────────
  const renderMainContent = () => {
    switch (activeItem) {
      case "Dashboard":
        return (
          <div className="space-y-6">
            {/* Analytics Metrics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className={`p-5 rounded-2xl border shadow-sm ${isDarkMode ? "bg-slate-800 border-slate-700/60" : "bg-white border-slate-100"}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Platform Income</p>
                    <p className={`text-2xl font-bold mt-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>₹{grossRevenue.toLocaleString("en-IN")}</p>
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

              <div className={`p-5 rounded-2xl border shadow-sm ${isDarkMode ? "bg-slate-800 border-slate-700/60" : "bg-white border-slate-100"}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Total Orders</p>
                    <p className={`text-2xl font-bold mt-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>{orders.length}</p>
                  </div>
                  <span className="p-3 rounded-xl bg-blue-50 text-blue-600">
                    <ShoppingBag size={20} />
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-3 text-xs text-blue-600 font-semibold">
                  <span>Across all regions</span>
                </div>
              </div>

              <div className={`p-5 rounded-2xl border shadow-sm ${isDarkMode ? "bg-slate-800 border-slate-700/60" : "bg-white border-slate-100"}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Live Catalog Products</p>
                    <p className={`text-2xl font-bold mt-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>{products.length}</p>
                  </div>
                  <span className="p-3 rounded-xl bg-[#811331]/10 text-[#811331]">
                    <Package size={20} />
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-3 text-xs text-amber-600 font-semibold">
                  <span>{lowStockCount} low stock alerts</span>
                </div>
              </div>

              <div className={`p-5 rounded-2xl border shadow-sm ${isDarkMode ? "bg-slate-800 border-slate-700/60" : "bg-white border-slate-100"}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Active Customers</p>
                    <p className={`text-2xl font-bold mt-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>{users.length}</p>
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

            {/* Line graph of revenue */}
            <div className={`p-5 rounded-2xl border shadow-sm ${isDarkMode ? "bg-[#1e2230] border-slate-700/60" : "bg-white border-slate-100"}`}>
              <h3 className={`text-sm font-bold mb-4 ${isDarkMode ? "text-white" : "text-slate-900"}`}>Revenue / Platform Volume over the last 14 days</h3>
              <div className="h-64">
                <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
              </div>
            </div>
          </div>
        );

      case "Products":
        return (
          <ProductsTable
            products={products}
            onAddProduct={() => { setEditingProduct(null); setIsProductModalOpen(true); }}
            onEditProduct={(p) => { setEditingProduct(p); setIsProductModalOpen(true); }}
            onDeleteProduct={handleDeleteProduct}
            onRefresh={() => {}}
          />
        );

      case "Orders":
        return (
          <div className={`rounded-2xl border shadow-sm overflow-hidden ${isDarkMode ? "bg-[#1e2230] border-slate-700/60" : "bg-white border-slate-100"}`}>
            <div className="px-6 py-5 border-b border-slate-100/10">
              <h3 className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>Platform Order Fulfillments</h3>
              <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"} mt-1`}>Review platform order status and set status updates</p>
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
                          <p className={`font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>{o.customerName || "Platform Guest"}</p>
                          <p className={`text-[10px] ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{o.email}</p>
                        </div>
                      </td>
                      <td className={`px-6 py-4 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-IN") : "Recent"}</td>
                      <td className={`px-6 py-4 font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>₹{Number(o.total || 0).toLocaleString("en-IN")}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full font-bold border text-[10px] uppercase ${statusBadgeClasses(o.status)}`}>
                          {o.status || "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <select
                          value={o.status || "Pending"}
                          onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                          className="bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg p-1 text-xs outline-none focus:border-[#811331]"
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
                </tbody>
              </table>
            </div>
          </div>
        );

      case "Inventory":
        return (
          <div className={`rounded-2xl border shadow-sm overflow-hidden ${isDarkMode ? "bg-[#1e2230] border-slate-700/60" : "bg-white border-slate-100"}`}>
            <div className="px-6 py-5 border-b border-slate-100/10">
              <h3 className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>Inventory Control</h3>
              <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"} mt-1`}>Super Admin inventory controls. Perform quick stock operations</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className={`text-[11px] font-bold uppercase tracking-wider border-b border-slate-100/10 ${isDarkMode ? "bg-slate-800 text-slate-400" : "bg-slate-50 text-slate-400"}`}>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Stock Level</th>
                    <th className="px-6 py-4">Adjustment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/10 text-xs">
                  {products.map((p) => {
                    const isLow = Number(p.stock || 0) <= 10;
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/5">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={p.images?.[0] || p.image} alt="" className="w-10 h-10 rounded-xl object-cover bg-slate-100" />
                            <div>
                              <p className={`font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>{p.name}</p>
                              <p className={`text-[10px] ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>SKU: {p.sku || "N/A"}</p>
                            </div>
                          </div>
                        </td>
                        <td className={`px-6 py-4 font-semibold ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{p.category}</td>
                        <td className={`px-6 py-4 font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>{p.stock || 0} units</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleQuickStockAdjustment(p.id, -1)}
                              className="w-7 h-7 bg-slate-150 hover:bg-slate-200 dark:bg-slate-800 rounded-lg flex items-center justify-center font-bold text-slate-700 dark:text-white"
                            >
                              -
                            </button>
                            <button
                              onClick={() => handleQuickStockAdjustment(p.id, 5)}
                              className="px-2.5 py-1 bg-[#811331]/10 text-[#811331] rounded-lg font-bold text-[10px]"
                            >
                              +5
                            </button>
                            <button
                              onClick={() => handleQuickStockAdjustment(p.id, 25)}
                              className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg font-bold text-[10px]"
                            >
                              +25
                            </button>
                            <button
                              onClick={() => handleQuickStockAdjustment(p.id, 1)}
                              className="w-7 h-7 bg-slate-150 hover:bg-slate-200 dark:bg-slate-800 rounded-lg flex items-center justify-center font-bold text-slate-700 dark:text-white"
                            >
                              +
                            </button>
                          </div>
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
            <div className={`p-6 rounded-2xl border shadow-sm ${isDarkMode ? "bg-[#1e2230] border-slate-700/60" : "bg-white border-slate-100"}`}>
              <h3 className={`text-base font-bold ${isDarkMode ? "text-white" : "text-slate-900"} mb-2`}>Billing Statements & Gross Sales</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <div className={`p-4 rounded-xl border ${isDarkMode ? "border-slate-700 bg-slate-900/40" : "border-slate-100 bg-slate-50"}`}>
                  <p className={`text-xs font-bold ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Platform Revenue</p>
                  <p className={`text-2xl font-bold mt-1 ${isDarkMode ? "text-white" : "text-slate-900"}`}>₹{grossRevenue.toLocaleString("en-IN")}</p>
                </div>
                <div className={`p-4 rounded-xl border ${isDarkMode ? "border-slate-700 bg-slate-900/40" : "border-slate-100 bg-slate-50"}`}>
                  <p className={`text-xs font-bold ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Estimated Margins</p>
                  <p className="text-2xl font-bold mt-1 text-emerald-600">₹{profitMargin.toLocaleString("en-IN")}</p>
                </div>
                <div className={`p-4 rounded-xl border ${isDarkMode ? "border-slate-700 bg-slate-900/40" : "border-slate-100 bg-slate-50"}`}>
                  <p className={`text-xs font-bold ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Platform Average Invoices</p>
                  <p className={`text-2xl font-bold mt-1 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    ₹{orders.length ? Math.round(grossRevenue / orders.length).toLocaleString("en-IN") : 0}
                  </p>
                </div>
              </div>
            </div>

            <div className={`rounded-2xl border shadow-sm overflow-hidden ${isDarkMode ? "bg-[#1e2230] border-slate-700/60" : "bg-white border-slate-100"}`}>
              <div className="px-6 py-5 border-b border-slate-100/10">
                <h4 className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>Invoices Log</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className={`text-[11px] font-bold uppercase tracking-wider border-b border-slate-100/10 ${isDarkMode ? "bg-slate-800 text-slate-400" : "bg-slate-50 text-slate-400"}`}>
                      <th className="px-6 py-4">Invoice #</th>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Order Value</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/10 text-xs">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-50/5">
                        <td className="px-6 py-4 font-mono font-bold">INV-{o.id.slice(0, 6).toUpperCase()}</td>
                        <td className="px-6 py-4">
                          <div>
                            <p className={`font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>{o.customerName || "Platform Guest"}</p>
                            <p className={`text-[10px] ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{o.email}</p>
                          </div>
                        </td>
                        <td className={`px-6 py-4 font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>₹{Number(o.total || 0).toLocaleString("en-IN")}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold border text-[9px] uppercase ${statusBadgeClasses(o.status)}`}>
                            {o.status || "Pending"}
                          </span>
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
      case "Sub Categories":
        return <CatalogManager type="SubCategories" />;
      case "Collections":
        return <CatalogManager type="Collections" />;
      case "Countries":
        return <CatalogManager type="Countries" />;
      case "Attributes":
        return <CatalogManager type="Attributes" />;

      case "Users":
        return <UsersTable users={users} />;

      case "Admins":
        return (
          <div className="space-y-6">
            {emailStatus && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold">
                {emailStatus}
              </div>
            )}

            <div className={`p-6 rounded-2xl border shadow-sm ${isDarkMode ? "bg-[#1e2230] border-slate-700/60" : "bg-white border-slate-100"}`}>
              <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
                <div>
                  <h3 className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>Remote Access Control</h3>
                  <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"} mt-0.5`}>Create admin accounts, assign photo, and set credentials</p>
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
                      <th className="px-6 py-4">Administrator</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Access key</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/10 text-xs">
                    {adminsList.map((admin) => (
                      <tr key={admin.firestoreId} className="hover:bg-slate-50/5">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {admin.photoURL ? (
                              <img src={admin.photoURL} alt="" className="w-8 h-8 rounded-full object-cover border" />
                            ) : (
                              <span className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                                {admin.adminId?.charAt(0).toUpperCase()}
                              </span>
                            )}
                            <div>
                              <p className={`font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>{admin.displayName || admin.adminId}</p>
                              <p className={`text-[10px] ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>ID: {admin.adminId}</p>
                            </div>
                          </div>
                        </td>
                        <td className={`px-6 py-4 font-semibold ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{admin.email || "No Email"}</td>
                        <td className="px-6 py-4 font-mono font-bold text-slate-600 dark:text-slate-300">{admin.password}</td>
                        <td className="px-6 py-4">
                          <span className="inline-block px-2.5 py-0.5 rounded-full font-bold bg-[#811331]/10 text-[#811331] text-[9px] uppercase">
                            {admin.role || "Admin"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
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
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "Media":
        return <MediaLibrary />;

      case "Banners":
        return <SiteSettingsManager isDarkMode={isDarkMode} />;

      default:
        return null;
    }
  };

  // ─── Sidebar ────────────────────────────────────────────────────────────────
  const SidebarContent = ({ collapsed = false }) => (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#630a21] via-[#570819] to-[#31040e] text-white">
      <div className={`border-b border-white/10 ${collapsed ? "px-3 py-5" : "px-6 py-5"}`}>
        <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
          {collapsed ? (
            <div className="grid h-10 w-10 place-items-center rounded-full border border-[#e8c37b]/70 text-[#e8c37b]">
              <Gem size={21} />
            </div>
          ) : (
            <div className="text-center flex-1">
              <div className="mx-auto grid h-10 w-10 place-items-center rounded-full border border-[#e8c37b]/70 text-[#e8c37b]"><Gem size={21} /></div>
              <p className="mt-2 font-serif text-[25px] leading-none tracking-wide text-white">VELOURAZ</p>
              <p className="mt-1 text-[8px] tracking-[.18em] text-[#e8c37b]/80">SUPER ADMIN CONSOLE</p>
            </div>
          )}
        </div>
      </div>

      <nav className={`flex-1 overflow-y-auto py-4 text-[12px] ${collapsed ? "px-2" : "px-3"}`}>
        {sidebarItems.map((item) => {
          const isActive = item.name === activeItem;
          const Icon = item.icon;
          return (
            <button
              key={item.name}
              onClick={() => setActiveItem(item.name)}
              className={`flex w-full items-center rounded-lg font-semibold transition-all mb-1 ${
                collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5"
              } ${isActive ? "bg-[#a4143e] text-white" : "text-white/80 hover:bg-white/10"}`}
            >
              <Icon size={15} />
              {!collapsed && <span>{item.name}</span>}
            </button>
          );
        })}
      </nav>

      <div className={`border-t border-white/10 py-3 space-y-1 ${collapsed ? "px-2" : "px-3"}`}>
        <button
          onClick={() => signOut(auth)}
          className={`flex w-full items-center rounded-lg px-2 py-2 text-[12px] text-white/80 hover:bg-white/10 ${collapsed ? "justify-center" : "gap-3 px-3"}`}
        >
          <LogOut size={15} />
          {!collapsed && "Logout"}
        </button>
      </div>
    </div>
  );

  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 border-[3px] border-white/10 border-t-[#811331] rounded-full"
          />
          <p className="text-xs text-white/30 font-medium tracking-widest uppercase">Loading...</p>
        </div>
      </div>
    );
  }

  if (!superAdminUser) {
    return <SuperAdminAuth onAuthSuccess={(u) => setSuperAdminUser(u)} />;
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-[#0f1117]" : "bg-[#f5f5f7]"} ${isDarkMode ? "text-white" : "text-slate-900"} font-sans selection:bg-[#811331]/10 transition-colors duration-300`}>
      {/* Sidebar - Desktop */}
      <aside className={`hidden lg:flex flex-col fixed top-0 left-0 h-screen z-30 transition-all duration-300 ${isSidebarCollapsed ? "w-16" : "w-60"}`}>
        <SidebarContent collapsed={isSidebarCollapsed} />
      </aside>

      {/* Main Content offset */}
      <div className={`flex flex-col min-h-screen transition-all duration-300 ${isSidebarCollapsed ? "lg:ml-16" : "lg:ml-60"}`}>
        {/* Topbar */}
        <header className={`hidden lg:flex h-[74px] items-center gap-6 justify-between border-b px-7 xl:px-9 ${isDarkMode ? "bg-[#1a1d27] border-slate-700/60" : "bg-white border-slate-200/80"} sticky top-0 z-20`}>
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className={`grid h-9 w-9 place-items-center rounded-lg ${isDarkMode ? "text-slate-300 hover:bg-slate-700" : "text-slate-700 hover:bg-slate-100"}`}
          >
            {isSidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>

          {/* Search */}
          <div className="relative flex w-full max-w-[430px] flex-col">
            <label className={`flex items-center gap-3 rounded-xl border px-3.5 py-2 ${isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50/50 border-slate-200 text-slate-700"} transition-colors`}>
              <Search size={17} className="text-slate-400" />
              <input
                className="w-full bg-transparent text-xs outline-none"
                placeholder="Search products, orders, customers…"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                onFocus={() => globalSearch && setShowSearchResults(true)}
              />
            </label>
          </div>

          {/* Right Area */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`relative flex h-9 w-9 items-center justify-center rounded-xl transition-all ${isDarkMode ? "bg-slate-700 text-yellow-400" : "text-slate-600 hover:bg-slate-100"}`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[#631028] text-xs font-bold text-white">SA</span>
              <div>
                <p className={`text-xs font-semibold ${isDarkMode ? "text-white" : "text-slate-800"}`}>Super Admin</p>
                <p className="text-[11px] text-slate-400">{superAdminUser.email}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Navbar */}
        <nav className={`lg:hidden flex items-center justify-between px-4 py-3 border-b sticky top-0 z-30 ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}>
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-[#0f0a0b] flex items-center justify-center shadow-md">
              <Gem size={13} className="text-white" />
            </div>
            <div>
              <p className={`text-sm font-bold tracking-tight leading-none ${isDarkMode ? "text-white" : "text-slate-900"}`}>Velauraz</p>
              <p className="text-[9px] font-medium tracking-widest uppercase mt-0.5 text-slate-400">SuperAdmin</p>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className={`p-2 rounded-xl ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}
          >
            <Menu size={16} />
          </button>
        </nav>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-4 py-5 pb-24 sm:px-8 sm:py-8 lg:px-7 lg:py-6 lg:pb-10 xl:px-9">
          <div className="max-w-[1500px] mx-auto">
            {activeItem !== "AddProduct" && activeItem !== "EditProduct" && renderHeader()}
            <motion.div key={activeItem} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
              {renderMainContent()}
            </motion.div>
          </div>
        </main>
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsProductModalOpen(false)} className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className={`rounded-3xl shadow-2xl max-w-4xl w-full relative z-10 max-h-[90vh] overflow-hidden flex flex-col ${isDarkMode ? "bg-[#1a1d26]" : "bg-white"}`}>
              <div className={`px-6 py-4 border-b flex items-center justify-between ${isDarkMode ? "border-slate-700" : "border-slate-100"}`}>
                <div>
                  <h2 className={`text-base font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>{editingProduct ? "Edit Product" : "Add New Product"}</h2>
                  <p className="text-xs text-slate-400">Super admins can manage catalog items directly</p>
                </div>
                <button type="button" onClick={() => setIsProductModalOpen(false)} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-400"><X size={16} /></button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <ProductEditor product={editingProduct} onCancel={() => setIsProductModalOpen(false)} onSuccess={() => { setIsProductModalOpen(false); }} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Grant Admin Access Modal */}
      <AnimatePresence>
        {isAdminModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAdminModalOpen(false)} className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`rounded-3xl shadow-2xl max-w-md w-full relative z-10 overflow-hidden flex flex-col ${isDarkMode ? "bg-[#1a1d26]" : "bg-white"}`}
            >
              <div className={`px-6 py-4 border-b flex items-center justify-between ${isDarkMode ? "border-slate-700" : "border-slate-100"}`}>
                <div>
                  <h2 className={`text-base font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>Grant Admin Access</h2>
                  <p className="text-xs text-slate-400">Add admin credentials & email access details</p>
                </div>
                <button type="button" onClick={() => setIsAdminModalOpen(false)} className="p-1.5 rounded-lg text-slate-400"><X size={16} /></button>
              </div>
              <div className="px-6 py-6">
                <form onSubmit={handleCreateAdmin} className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Admin ID / User Name</label>
                    <input
                      type="text" required value={newAdmin.adminId}
                      onChange={(e) => setNewAdmin({ ...newAdmin, adminId: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl text-xs outline-none border ${isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200"}`}
                      placeholder="e.g. catalog_mgr"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Display Name / Full Name</label>
                    <input
                      type="text" value={newAdmin.displayName}
                      onChange={(e) => setNewAdmin({ ...newAdmin, displayName: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl text-xs outline-none border ${isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200"}`}
                      placeholder="e.g. John Doe"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">User's Email</label>
                    <input
                      type="email" required value={newAdmin.email}
                      onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl text-xs outline-none border ${isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200"}`}
                      placeholder="john@velouraz.com"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Access Password</label>
                    <input
                      type="text" required value={newAdmin.password}
                      onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl text-xs outline-none border ${isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200"}`}
                      placeholder="Password"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Photo URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text" value={newAdmin.photoURL}
                        onChange={(e) => setNewAdmin({ ...newAdmin, photoURL: e.target.value })}
                        className={`flex-1 px-4 py-2.5 rounded-xl text-xs outline-none border ${isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200"}`}
                        placeholder="Image Link"
                      />
                      <label className="flex items-center justify-center p-2.5 rounded-xl border border-dashed border-slate-350 cursor-pointer bg-slate-50 hover:bg-slate-100 dark:bg-slate-800">
                        <Camera size={16} />
                        <input type="file" accept="image/*" className="hidden" onChange={handleAdminPhotoUpload} />
                      </label>
                    </div>
                    {uploadingAdminPhoto && <p className="text-[10px] text-amber-600 font-semibold animate-pulse">Uploading photo...</p>}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#811331] hover:bg-[#9d1a3d] text-white text-xs font-bold rounded-xl transition-all shadow-md mt-2"
                  >
                    Grant Access & Send Email
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
