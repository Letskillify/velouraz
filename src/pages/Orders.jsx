import React, { useState, useEffect } from "react";
import { useAuth } from "../components/useAuth";
import { db } from "../components/Firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package, Truck, CheckCircle2, Clock, FileText, Download,
  Search, ArrowLeft, ChevronRight, X, Printer, ShoppingBag,
  CreditCard, ShieldCheck, MapPin, Eye, ExternalLink
} from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";
import { generateInvoicePDF } from "../utils/invoice";

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [showTrackingModal, setShowTrackingModal] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const ordersRef = collection(db, "orders");
        try {
          const q = query(
            ordersRef,
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc")
          );
          const snap = await getDocs(q);
          const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setOrders(list);
        } catch (e) {
          // Fallback query without orderBy index requirement
          const q = query(ordersRef, where("userId", "==", user.uid));
          const snap = await getDocs(q);
          const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
          setOrders(list);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  // Filtering Logic
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items?.some((item) =>
        item.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );

    if (!matchesSearch) return false;

    if (statusFilter === "all") return true;
    if (statusFilter === "paid") return order.status?.toLowerCase().includes("paid");
    if (statusFilter === "cod") return order.paymentMethod?.toLowerCase().includes("cash");
    return true;
  });

  const breadcrumbLinks = [
    { name: "Home", href: "/" },
    { name: "My Account", href: "/account" },
    { name: "Order History", href: "/orders", active: true },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFAF5] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-2 border-[#7A0E2E] border-t-transparent rounded-full animate-spin" />
        <p className="text-base uppercase tracking-[0.3em] font-bold text-[#7A0E2E]">Fetching Your Atelier Orders</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFAF5] font-sans text-[#2A2623] pt-32 pb-24">
      
      {/* Top Breadcrumb */}
      <Breadcrumb
        title="Your Orders"
        subtitle="Explore and manage your exquisite jewelry acquisitions & track live deliveries."
        bgImage="https://images.unsplash.com/photo-1544027993-37dbfe43552e?auto=format&fit=crop&q=80&w=1600"
        links={breadcrumbLinks}
      />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-8">
        
        {/* Header Summary & Filter Bar */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D8CBBE]/40 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#D8CBBE]/30 pb-6">
            <div>
              <h1 className="text-2xl font-serif font-bold text-[#2A2623]">Acquisition History</h1>
              <p className="text-base text-[#7B6D63]">
                {orders.length} order(s) placed with House of Velouraz
              </p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <Link
                to="/account"
                className="px-4 py-2.5 border border-[#2A2623] text-[#2A2623] text-base font-bold uppercase tracking-wider rounded-xl hover:bg-[#2A2623] hover:text-white transition-all flex items-center gap-2"
              >
                <ArrowLeft size={14} /> Back to Profile
              </Link>
              <Link
                to="/shop"
                className="px-5 py-2.5 bg-[#7A0E2E] text-white text-base font-bold uppercase tracking-widest rounded-xl hover:bg-[#2A2623] transition-all"
              >
                Explore Shop
              </Link>
            </div>
          </div>

          {/* Search & Status Filters */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Status Tabs */}
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {[
                { id: "all", label: "All Purchases" },
                { id: "paid", label: "Paid Online" },
                { id: "cod", label: "Cash on Delivery" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-4 py-2 rounded-xl text-base font-bold transition-all ${
                    statusFilter === tab.id
                      ? "bg-[#7A0E2E] text-white shadow-sm"
                      : "bg-[#FDFAF5] text-[#7B6D63] border border-[#D8CBBE]/50 hover:text-[#7A0E2E]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7B6D63]" />
              <input
                type="text"
                placeholder="Search by Order ID or item..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#FDFAF5] border border-[#D8CBBE]/60 rounded-xl pl-10 pr-4 py-2 text-base outline-none focus:border-[#7A0E2E] transition-all text-[#2A2623] font-medium"
              />
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-[#D8CBBE]/40 p-6 sm:p-8 shadow-sm space-y-6 hover:border-[#7A0E2E]/40 transition-all"
              >
                {/* Order Top Summary */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#D8CBBE]/30 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-[16px] font-bold uppercase tracking-widest text-[#7B6D63]">Order Reference</span>
                      <span className="px-3 py-0.5 bg-[#7A0E2E]/10 text-[#7A0E2E] text-[16px] font-bold uppercase rounded-full">
                        {order.status || "Paid"}
                      </span>
                    </div>
                    <p className="text-sm font-bold font-mono text-[#2A2623]">#{order.id}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-base text-[#7B6D63]">
                    <div>
                      <p className="text-[16px] uppercase font-bold text-[#7B6D63]">Order Date</p>
                      <p className="font-semibold text-[#2A2623]">
                        {new Date(order.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="h-6 w-px bg-[#D8CBBE]/40 hidden sm:block" />
                    <div>
                      <p className="text-[16px] uppercase font-bold text-[#7B6D63]">Payment Method</p>
                      <p className="font-semibold text-[#7A0E2E]">{order.paymentMethod}</p>
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  {order.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-3 rounded-2xl bg-[#FDFAF5] border border-[#D8CBBE]/30"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover border border-[#D8CBBE]/40 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base sm:text-sm font-bold text-[#2A2623] truncate">{item.name}</h4>
                        <p className="text-[16px] text-[#7B6D63]">Quantity: {item.quantity || 1}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-base sm:text-sm font-bold text-[#7A0E2E]">
                          ₹{(Number(item.price || 0) * (item.quantity || 1)).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Action Footer */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pt-4 border-t border-[#D8CBBE]/30">
                  <div>
                    <span className="text-[16px] uppercase font-bold text-[#7B6D63]">Total Paid</span>
                    <p className="text-xl font-serif font-bold text-[#7A0E2E]">
                      ₹{Number(order.total || 0).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => { setTrackingOrder(order); setShowTrackingModal(true); }}
                      className="px-4 py-2.5 bg-[#FDFAF5] border border-[#D8CBBE]/60 text-[#2A2623] text-base font-bold uppercase tracking-wider rounded-xl hover:border-[#7A0E2E] hover:text-[#7A0E2E] transition-all flex items-center gap-1.5"
                    >
                      <Truck size={14} /> Live Track
                    </button>

                    <button
                      onClick={() => { setSelectedOrder(order); setShowDetailModal(true); }}
                      className="px-4 py-2.5 border border-[#2A2623] text-[#2A2623] text-base font-bold uppercase tracking-wider rounded-xl hover:bg-[#2A2623] hover:text-white transition-all flex items-center gap-1.5"
                    >
                      <Eye size={14} /> View Details
                    </button>

                    <button
                      onClick={() => generateInvoicePDF(order)}
                      className="px-4 py-2.5 bg-[#7A0E2E] text-white text-base font-bold uppercase tracking-wider rounded-xl hover:bg-[#2A2623] transition-all flex items-center gap-1.5"
                    >
                      <Download size={14} /> Download PDF Invoice
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-16 border border-[#D8CBBE]/40 shadow-sm text-center space-y-4">
            <ShoppingBag size={48} className="mx-auto text-[#7A0E2E]/30" />
            <h3 className="font-serif text-2xl text-[#2A2623]">No orders found</h3>
            <p className="text-base text-[#7B6D63] max-w-sm mx-auto">
              {searchQuery ? "No orders match your search criteria." : "You have not placed any orders with Velouraz yet."}
            </p>
            <Link
              to="/shop"
              className="inline-block px-6 py-3 bg-[#7A0E2E] text-white text-base font-bold uppercase tracking-widest rounded-xl hover:bg-[#2A2623] transition-all mt-2"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>

      {/* MODAL 1: ORDER DETAILS MODAL */}
      <AnimatePresence>
        {showDetailModal && selectedOrder && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetailModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-10 border border-[#D8CBBE]/40 shadow-2xl space-y-6"
            >
              <div className="flex justify-between items-center border-b border-[#D8CBBE]/30 pb-4">
                <div>
                  <span className="text-[16px] font-bold uppercase tracking-widest text-[#7A0E2E]">Detailed Receipt</span>
                  <h3 className="font-serif text-xl font-bold font-mono">#{selectedOrder.id}</h3>
                </div>
                <button onClick={() => setShowDetailModal(false)} className="p-2 text-gray-400 hover:text-black">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-3">
                <h4 className="text-base font-bold uppercase tracking-wider text-[#7B6D63]">Items Purchased</h4>
                <div className="space-y-2 divide-y divide-[#D8CBBE]/20">
                  {selectedOrder.items?.map((item, i) => (
                    <div key={i} className="pt-2 flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover border border-[#D8CBBE]/30" />
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-semibold text-[#2A2623] truncate">{item.name}</p>
                        <p className="text-[16px] text-[#7B6D63]">Qty: {item.quantity || 1}</p>
                      </div>
                      <span className="text-base font-bold text-[#7A0E2E]">
                        ₹{(Number(item.price || 0) * (item.quantity || 1)).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#FDFAF5] p-4 rounded-xl border border-[#D8CBBE]/30 space-y-2 text-base text-[#7B6D63]">
                <h4 className="font-bold text-[#2A2623] uppercase tracking-wider text-[16px]">Shipping Details</h4>
                <p><span className="font-bold text-[#2A2623]">{selectedOrder.shippingDetails?.name}</span> ({selectedOrder.shippingDetails?.phone})</p>
                <p>{selectedOrder.shippingDetails?.address}, {selectedOrder.shippingDetails?.city}, {selectedOrder.shippingDetails?.state} - {selectedOrder.shippingDetails?.pincode}</p>
                <p className="pt-1 text-[16px]">Payment Method: <span className="font-bold text-[#7A0E2E]">{selectedOrder.paymentMethod}</span></p>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-[#D8CBBE]/30">
                <button
                  onClick={() => generateInvoicePDF(selectedOrder)}
                  className="px-4 py-2 bg-[#7A0E2E] text-white text-base font-bold uppercase tracking-wider rounded-xl hover:bg-[#2A2623] transition-all flex items-center gap-1.5"
                >
                  <Download size={14} /> Download PDF Invoice
                </button>
                <div className="text-right">
                  <span className="text-[16px] font-bold uppercase tracking-wider text-[#7B6D63]">Grand Total</span>
                  <p className="text-xl font-serif font-bold text-[#7A0E2E]">₹{Number(selectedOrder.total || 0).toLocaleString()}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: LIVE TRACKING MODAL */}
      <AnimatePresence>
        {showTrackingModal && trackingOrder && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTrackingModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full relative z-10 border border-[#D8CBBE]/40 shadow-2xl space-y-6"
            >
              <div className="flex justify-between items-center border-b border-[#D8CBBE]/30 pb-4">
                <div>
                  <span className="text-[16px] font-bold uppercase tracking-widest text-[#7A0E2E]">Live Order Tracker</span>
                  <h3 className="font-serif text-xl font-bold font-mono">#{trackingOrder.id}</h3>
                </div>
                <button onClick={() => setShowTrackingModal(false)} className="p-2 text-gray-400 hover:text-black">
                  <X size={20} />
                </button>
              </div>

              {/* Progress Steps */}
              <div className="space-y-6 py-2">
                {[
                  { title: "Order Confirmed", desc: "Your purchase is verified.", active: true },
                  { title: "Artisan Crafting & QC", desc: "Inspected by master craftsmen.", active: true },
                  { title: "Dispatched", desc: "Express Insured Air Transit.", active: true },
                  { title: "Out for Delivery", desc: "Courier partner en route.", active: false },
                  { title: "Delivered", desc: "Safely handed over.", active: false },
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-base font-bold flex-shrink-0 ${
                      step.active ? "bg-[#7A0E2E] text-white" : "bg-gray-200 text-gray-400"
                    }`}>
                      {step.active ? <CheckCircle2 size={16} /> : idx + 1}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[#2A2623]">{step.title}</h4>
                      <p className="text-[16px] text-[#7B6D63]">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Orders;
