// Admin.jsx
import React, { useState, useEffect } from "react";
import { db } from "../../components/Firebase";
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
  updateDoc,
} from "firebase/firestore";
import { useForm } from "react-hook-form";
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
  ChevronDown,
  ChevronUp,
  Grid2X2,
  Tags,
  Layers3,
  Landmark,
  TicketPercent,
  Star,
  FileText,
  Images,
  Settings,
  Truck,
  CreditCard,
  PanelLeftClose,
} from "lucide-react";
import AdminAuth from "./AdminAuth";
import MetricCards from "./components/MetricCards";
import ProductsTable from "./components/ProductsTable";
import OrdersTable from "./components/OrdersTable";
import UsersTable from "./components/UsersTable";
import CategoriesOverview from "./components/CategoriesOverview";
import { ProductForm, EditProductForm } from "./components/ProductForms";
import MediaLibrary from "./components/MediaLibrary";
import DashboardOverview from "./components/DashboardOverview";
import ProductEditor from "./components/ProductEditor";
import CatalogManager from "./components/CatalogManager";
import { listenToProducts, removeProduct, sortNewestProducts } from "../../services/productService";

const sidebarItems = [
  { name: "Dashboard", icon: LayoutDashboard, desc: "Overview" },
  { name: "Products", icon: Package, desc: "Catalog" },
  { name: "Orders", icon: ShoppingBag, desc: "Transactions" },
  { name: "Categories", icon: List, desc: "Structure" },
  { name: "Users", icon: Users, desc: "Accounts" },
  { name: "Media", icon: Image, desc: "Assets" },
];

const metricCards = (productCount, userCount, orderCount, revenue) => [
  { label: "Active Products", value: productCount, hint: "Across all categories", icon: Package, color: "crimson" },
  { label: "Total Users", value: userCount, hint: "Registered accounts", icon: Users, color: "blue" },
  { label: "Live Orders", value: orderCount, hint: "Orders from database", icon: ShoppingBag, color: "blue" },
  { label: "Total Revenue", value: `₹${Number(revenue || 0).toLocaleString("en-IN")}`, hint: "From all recorded orders", icon: Activity, color: "green" },
];

const sortNewest = (rows) => [...rows].sort((a, b) => {
  const toMillis = (value) => value?.toMillis?.() ?? new Date(value || 0).getTime();
  return toMillis(b.createdAt || b.orderDate || b.date) - toMillis(a.createdAt || a.orderDate || a.date);
});
const getOrderAmount = (order) => Number(order.total ?? order.totalAmount ?? order.grandTotal ?? order.amount ?? 0);

const Admin = () => {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [adminUser, setAdminUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [productsMenuOpen, setProductsMenuOpen] = useState(true);
  const [ordersMenuOpen, setOrdersMenuOpen] = useState(false);

  useEffect(() => {
    const storedAdmin = localStorage.getItem("velouraz_admin");
    if (storedAdmin) {
      setAdminUser(JSON.parse(storedAdmin));
    }
    setLoadingAuth(false);
  }, []);

  const handleAuthSuccess = (user) => {
    setAdminUser(user);
    localStorage.setItem("velouraz_admin", JSON.stringify(user));
  };

  const handleLogout = () => {
    setAdminUser(null);
    localStorage.removeItem("velouraz_admin");
  };

  const loadProducts = async () => {
    const snap = await getDocs(collection(db, "products"));
    setProducts(sortNewestProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
  };

  const loadUsers = async () => {
    try {
      const snap = await getDocs(collection(db, "users"));
      setUsers(sortNewest(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
    } catch (error) {
      console.log("Note: Users collection may not exist yet or error fetching users");
    }
  };

  useEffect(() => {
    if (!adminUser) return undefined;
    const subscribe = (name, setter) => onSnapshot(collection(db, name), (snapshot) => {
      setter(sortNewest(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))));
    }, (error) => console.warn(`Could not listen to ${name}:`, error));
    const stopProducts = listenToProducts(setProducts, (error) => console.warn("Could not listen to products:", error));
    const stopUsers = subscribe("users", setUsers);
    const stopOrders = subscribe("orders", setOrders);
    return () => { stopProducts(); stopUsers(); stopOrders(); };
  }, [adminUser]);

  const handleDeleteProduct = async (id) => {
    await removeProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setActiveItem("EditProduct");
  };

  const openProductEditor = () => {
    setActiveItem("AddProduct");
    setIsProductModalOpen(false);
    setIsSidebarOpen(false);
  };

  const currentItem = sidebarItems.find((i) => i.name === activeItem);

  const renderHeader = () => (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-slate-400">Velauraz</span>
          <ChevronRight size={12} className="text-slate-300" />
          <span className="text-xs font-semibold text-[#811331]">{activeItem}</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {activeItem}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {currentItem?.desc} — manage your jewellery store
        </p>
      </div>
      <div className="flex items-center gap-3 self-end sm:self-auto">
        {/* Store Status Pill */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-slate-100">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_1px_rgba(52,211,153,0.6)] animate-pulse" />
          <span className="text-xs font-medium text-slate-500">
            Store: <span className="font-bold text-slate-800">Live</span>
          </span>
        </div>
        {/* Add Product CTA */}
        <button
          onClick={openProductEditor}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#811331] text-white rounded-xl text-xs font-bold shadow-lg shadow-[#811331]/20 hover:bg-[#9d1a3d] hover:shadow-[#811331]/30 transition-all active:scale-95"
        >
          <Plus size={14} />
          <span>Add Product</span>
        </button>
      </div>
    </header>
  );

  const renderMainContent = () => {
    const revenue = orders.reduce((total, order) => total + getOrderAmount(order), 0);
    const cards = metricCards(products.length, users.length, orders.length, revenue);
    switch (activeItem) {
      case "Products":
        {
          const activeProducts = products.filter((product) => !product.status || product.status === "Published" || product.status === "Active").length;
          const draftProducts = products.filter((product) => product.status === "Draft").length;
          const trashedProducts = products.filter((product) => product.status === "Trash").length;
          const productCards = [
            { label: "Total Products", value: products.length, hint: "All catalogue products", icon: Package, color: "crimson" },
            { label: "Active Products", value: activeProducts, hint: "Published and active", icon: Activity, color: "green" },
            { label: "Draft Products", value: draftProducts, hint: "Not published yet", icon: Package, color: "blue" },
            { label: "Trash", value: trashedProducts, hint: "Archived products", icon: Package, color: "crimson" },
          ];
        return (
          <>
            <MetricCards cards={productCards} />
            <ProductsTable
              products={products}
              onAddProduct={openProductEditor}
              onEditProduct={handleEditClick}
              onDeleteProduct={handleDeleteProduct}
              onRefresh={loadProducts}
            />
          </>
        );
        }
      case "Orders":
        return (
          <>
            <MetricCards cards={cards} />
            <OrdersTable orders={orders} />
          </>
        );
      case "Categories":
        return <CatalogManager type="Categories" />;
      case "SubCategories":
        return <CatalogManager type="SubCategories" />;
      case "Collections":
        return <CatalogManager type="Collections" />;
      case "Brands":
        return <CatalogManager type="Brands" />;
      case "Attributes":
        return <CatalogManager type="Attributes" />;
      case "Users":
        return (
          <>
            <MetricCards cards={cards} />
            <UsersTable users={users} />
          </>
        );
      case "Media":
        return <MediaLibrary />;
      case "AddProduct":
        return <ProductEditor onCancel={() => setActiveItem("Products")} onSuccess={() => setActiveItem("Products")} />;
      case "EditProduct":
        return <ProductEditor product={editingProduct} onCancel={() => { setEditingProduct(null); setActiveItem("Products"); }} onSuccess={() => { setEditingProduct(null); setActiveItem("Products"); }} />;
      default:
        return <DashboardOverview products={products} users={users} orders={orders} onViewProducts={() => setActiveItem("Products")} />;
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#630a21] via-[#570819] to-[#31040e] text-white">
      {/* Logo / Brand */}
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="text-center">
            <div className="mx-auto grid h-10 w-10 place-items-center rounded-full border border-[#e8c37b]/70 text-[#e8c37b]"><Gem size={21} /></div>
            <p className="mt-2 font-serif text-[25px] leading-none tracking-wide text-white">VELOURAZ</p>
            <p className="mt-1 text-[8px] tracking-[.18em] text-[#e8c37b]/80">TIMELESS ELEGANCE</p>
          </div>
          <button
            className="lg:hidden p-1.5 text-white/40 hover:text-white transition-colors"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 text-[12px]">
        <button onClick={() => setActiveItem("Dashboard")} className={`mb-4 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 font-semibold ${activeItem === "Dashboard" ? "bg-[#a4143e] text-white" : "text-white/80 hover:bg-white/10"}`}><LayoutDashboard size={15}/>Dashboard</button>
        <p className="mb-2 px-3 text-[9px] font-medium tracking-wide text-white/50">CATALOG</p>
        <button onClick={() => { setActiveItem("Products"); setProductsMenuOpen(!productsMenuOpen); }} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 font-semibold ${activeItem === "Products" || activeItem === "AddProduct" || activeItem === "EditProduct" ? "bg-[#a4143e] text-white" : "text-white/80 hover:bg-white/10"}`}><Package size={15}/><span className="flex-1 text-left">Products</span>{productsMenuOpen ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}</button>
        {productsMenuOpen && <div className="ml-3 border-l border-white/15 py-1 pl-2.5 space-y-0.5">{[["All Products", Grid2X2, "Products"]].map(([label, Icon, target]) => <button key={label} onClick={() => target === "AddProduct" ? openProductEditor() : setActiveItem(target)} className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[14px] ${activeItem === target ? "bg-[#84112f] text-white" : "text-white/75 hover:bg-white/10"}`}><Icon size={12}/>{label}</button>)}</div>}
        {[["Categories", Layers3, "Categories", ["All Categories"]], ["Sub Categories", Layers3, "SubCategories", ["All Sub Categories"]], ["Collections", Layers3, "Collections", ["All Collections"]], ["Brands", Landmark, "Brands", ["All Brands"]], ["Attributes", Tags, "Attributes", ["All Attributes"]], ["Media", Images, "Media", ["Media Library"]]].map(([title, Icon, target, links]) => <div key={title} className="mt-1"><button onClick={() => setActiveItem(target)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 ${activeItem === target ? "bg-[#a4143e] text-white" : "text-white/80 hover:bg-white/10"}`}><Icon size={15}/><span className="flex-1 text-left">{title}</span><ChevronDown size={13}/></button><div className="ml-3 border-l border-white/15 py-0.5 pl-2.5">{links.map((link) => <button key={link} onClick={() => setActiveItem(target)} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-[14px] text-white/75 hover:bg-white/10"><Grid2X2 size={12}/>{link}</button>)}</div></div>)}
        <p className="mb-2 mt-4 px-3 text-[9px] font-medium tracking-wide text-white/50">CONTENT</p>
        {[["Pages", FileText], ["Banners", Images]].map(([label, Icon]) => <button key={label} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-white/80 hover:bg-white/10"><Icon size={15}/>{label}</button>)}
      </nav>

      <div className="border-t border-white/10 px-3 py-3 space-y-1">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[12px] text-white/80 hover:bg-white/10"><Users size={15}/>Profile</button>
        <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[12px] text-white/80 hover:bg-white/10"><LogOut size={15}/>Logout</button>
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
          <p className="text-xs text-white/30 font-medium tracking-widest uppercase">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!adminUser) {
    return <AdminAuth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-slate-900 font-sans selection:bg-[#811331]/10">
      {/* ─── Fixed Sidebar — Desktop ─── */}
      <aside className="hidden lg:flex w-60 flex-col fixed top-0 left-0 h-screen z-30">
        <SidebarContent />
      </aside>

      {/* ─── Mobile Sidebar Overlay ─── */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* ─── Mobile Sidebar Drawer ─── */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-50 w-72 lg:hidden shadow-2xl"
          >
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ─── Main Content (offset on desktop for fixed sidebar) ─── */}
      <div className="lg:ml-60 flex flex-col min-h-screen">
        <header className="hidden lg:flex h-[74px] items-center justify-between border-b border-slate-200/80 bg-white px-7 xl:px-9">
          <button className="grid h-9 w-9 place-items-center rounded-lg text-slate-700 hover:bg-slate-100"><Menu size={21} /></button>
          <label className="flex w-full max-w-[430px] items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-slate-400 focus-within:border-[#9c1237]/40"><Search size={17} /><input className="w-full bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400" placeholder="Search for products, orders, customers..." /><kbd className="rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[9px] text-slate-500">Ctrl + K</kbd></label>
          <div className="flex items-center gap-4"><button className="text-slate-600"><Sun size={20} /></button><button className="relative text-slate-700"><Bell size={20} /><span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-[#9c1237] text-[9px] text-white">0</span></button><div className="h-8 w-px bg-slate-200" /><div className="flex items-center gap-2.5"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#631028] text-xs font-bold text-white">{(adminUser?.adminId || "A").charAt(0).toUpperCase()}</span><div><p className="text-xs font-semibold text-slate-800">Admin</p><p className="text-[14px] text-slate-400">Super Admin</p></div><ChevronDown size={15} /></div></div>
        </header>
        {/* Mobile Topbar */}
        <nav className="lg:hidden flex items-center justify-between px-4 py-3 bg-white/90 backdrop-blur-lg border-b border-slate-100 sticky top-0 z-30">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-[#0f0a0b] flex items-center justify-center shadow-md">
              <Gem size={13} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 tracking-tight leading-none">Velauraz</p>
              <p className="text-[9px] text-slate-400 font-medium tracking-widest uppercase mt-0.5">{activeItem}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={openProductEditor}
              className="p-2 rounded-xl bg-[#811331] text-white shadow-md shadow-[#811331]/20 active:scale-95 transition-transform"
            >
              <Plus size={16} />
            </button>
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-xl bg-slate-100 text-slate-600 active:scale-95 transition-transform"
            >
              <Menu size={16} />
            </button>
          </div>
        </nav>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-4 py-5 pb-24 sm:px-8 sm:py-8 lg:px-7 lg:py-6 lg:pb-10 xl:px-9">
          <div className="max-w-[1500px] mx-auto">
            {activeItem !== "AddProduct" && activeItem !== "EditProduct" && renderHeader()}
            <motion.div
              key={activeItem}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              {renderMainContent()}
            </motion.div>
          </div>
        </main>

        {/* ─── Mobile Bottom Navigation ─── */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-100 shadow-[0_-2px_20px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-around px-2 py-1.5 max-w-md mx-auto">
            {sidebarItems.slice(0, 5).map((item) => {
              const isActive = item.name === activeItem;
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveItem(item.name)}
                  className={`flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-all duration-200 min-w-[56px] ${
                    isActive
                      ? "text-[#811331]"
                      : "text-slate-400"
                  }`}
                >
                  <div className={`p-1.5 rounded-xl transition-all duration-200 ${isActive ? 'bg-[#811331]/10' : ''}`}>
                    <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
                  </div>
                  <span className={`text-[9px] font-bold tracking-wide ${isActive ? 'text-[#811331]' : 'text-slate-400'}`}>
                    {item.name === "Dashboard" ? "Home" : item.name}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="mobile-tab-indicator"
                      className="w-4 h-0.5 rounded-full bg-[#811331] mt-0.5"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
          {/* Safe area for phones with home indicator */}
          <div className="h-[env(safe-area-inset-bottom,0px)]" />
        </nav>
      </div>

      {/* ─── Add Product Modal ─── */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProductModalOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 24 }}
              transition={{ type: "spring", damping: 25, stiffness: 260 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full relative z-10 max-h-[92vh] overflow-hidden flex flex-col"
            >
              <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#811331]/10">
                    <Package size={16} className="text-[#811331]" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Add New Product</h2>
                    <p className="text-xs text-slate-400 font-medium">
                      Create a new entry in your jewelry collection
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-7 py-7">
                <ProductForm
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

      {/* ─── Edit Product Modal ─── */}
      <AnimatePresence>
        {isEditModalOpen && editingProduct && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 24 }}
              transition={{ type: "spring", damping: 25, stiffness: 260 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full relative z-10 max-h-[92vh] overflow-hidden flex flex-col"
            >
              <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-50">
                    <Package size={16} className="text-amber-600" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Edit Product</h2>
                    <p className="text-xs text-slate-400 font-medium">
                      Modifying: <span className="text-[#811331] font-semibold">{editingProduct.name}</span>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-7 py-7">
                <EditProductForm
                  product={editingProduct}
                  onSuccess={async () => {
                    setIsEditModalOpen(false);
                    setEditingProduct(null);
                    await loadProducts();
                  }}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admin;
