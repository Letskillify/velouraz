import React, { useState, useEffect } from "react";
import { useStore } from "../hooks/useStore";
import { useAuth } from "../components/useAuth";
import { db } from "../components/Firebase";
import { collection, addDoc, serverTimestamp, doc, getDoc, setDoc, writeBatch } from "firebase/firestore";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, Truck, ArrowLeft, CreditCard, User, Mail, 
  Phone, MapPin, CheckCircle2, Lock, Sparkles, AlertCircle, Loader2, PackageCheck, Gem, Gift, ChevronRight, Check
} from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";

const Checkout = () => {
  const { cartItems, cartCount } = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("razorpay"); // 'razorpay' | 'cod'
  const [orderSuccess, setOrderSuccess] = useState(null);

  // Check if coming from "Buy Now" on Product Details page
  const buyNowItem = location.state?.buyNowItem;
  const isBuyNow = Boolean(buyNowItem);

  // Derive active items for checkout
  const checkoutItems = isBuyNow ? [buyNowItem] : cartItems;

  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    state: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: "/checkout", buyNowItem: location.state?.buyNowItem } });
    }
  }, [user, navigate, location.state]);

  useEffect(() => {
    if (user?.uid) {
      const userRef = doc(db, "users", user.uid);
      getDoc(userRef).then((snap) => {
        if (snap.exists()) {
          const data = snap.data();
          const defAddr = data.defaultAddress || (data.savedAddresses && data.savedAddresses[0]) || {};
          setFormData((prev) => ({
            name: data.displayName || data.name || user.displayName || prev.name,
            email: data.email || user.email || prev.email,
            phone: data.phone || data.phoneNumber || defAddr.phone || prev.phone,
            address: defAddr.address || data.address || prev.address,
            city: defAddr.city || data.city || prev.city,
            state: defAddr.state || data.state || prev.state,
            pincode: defAddr.pincode || data.pincode || prev.pincode,
          }));
        }
      }).catch(err => console.error("Error loading user address:", err));
    }
  }, [user]);

  const [stockStatus, setStockStatus] = useState({});

  // Calculate totals
  const subtotal = checkoutItems.reduce(
    (sum, item) => sum + Number(item.price || 0) * (item.quantity || 1),
    0
  );
  const shippingFee = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  const total = subtotal + shippingFee;

  useEffect(() => {
    const checkStock = async () => {
      const status = {};
      for (const item of checkoutItems) {
        if (!item.id || item.id.startsWith("bs-")) continue;
        try {
          const pRef = doc(db, "products", item.id);
          const pSnap = await getDoc(pRef);
          if (pSnap.exists()) {
            status[item.id] = Number(pSnap.data().stock || 0);
          }
        } catch (e) {
          console.error("Stock check error:", e);
        }
      }
      setStockStatus(status);
    };
    if (checkoutItems.length > 0) {
      checkStock();
    }
  }, [checkoutItems]);

  const isAnyOutOfStock = checkoutItems.some((item) => {
    const stock = stockStatus[item.id];
    return stock !== undefined && stock < (item.quantity || 1);
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const executeOrderCreation = async (paymentDetails = {}) => {
    setLoading(true);
    try {
      const batch = writeBatch(db);
      for (const item of checkoutItems) {
        if (item.id && !item.id.startsWith("bs-")) {
          const pRef = doc(db, "products", item.id);
          const pSnap = await getDoc(pRef);
          if (pSnap.exists()) {
            const currentStock = Number(pSnap.data().stock || 0);
            const newStock = Math.max(0, currentStock - (item.quantity || 1));
            batch.update(pRef, { stock: newStock });
          }
        }
      }
      await batch.commit();

      const orderData = {
        userId: user?.uid || "guest",
        customerName: formData.name,
        email: formData.email,
        phone: formData.phone,
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        items: checkoutItems.map(i => ({
          id: i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity || 1,
          image: i.image || i.primaryImage || ''
        })),
        subtotal,
        shippingFee,
        totalAmount: total,
        paymentMethod,
        paymentStatus: paymentMethod === "razorpay" ? "Paid" : "Pending",
        paymentDetails,
        orderStatus: "Processing",
        createdAt: serverTimestamp(),
        orderDate: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, "orders"), orderData);

      // Save user default address for next time
      if (user?.uid) {
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
          defaultAddress: {
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
          }
        }, { merge: true });
      }

      setOrderSuccess({ id: docRef.id, ...orderData });
    } catch (err) {
      console.error("Order creation error:", err);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address || !formData.city || !formData.pincode) {
      alert("Please fill in all required shipping fields.");
      return;
    }

    if (isAnyOutOfStock) {
      alert("One or more items in your cart are currently out of stock.");
      return;
    }

    if (paymentMethod === "razorpay") {
      const res = await loadRazorpayScript();
      if (!res) {
        alert("Razorpay SDK failed to load. Please check your internet connection.");
        return;
      }

      const options = {
        key: "rzp_test_VelourazDummyKey",
        amount: total * 100, // amount in paise
        currency: "INR",
        name: "Velouraz Jewellery",
        description: "High Jewellery Order Payment",
        image: "/img/logo.png",
        handler: function (response) {
          executeOrderCreation({
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          });
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#7A0E2E",
        },
      };

      try {
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } catch (err) {
        console.warn("Razorpay simulated mode, completing order directly:", err);
        executeOrderCreation({ mode: "simulated_razorpay" });
      }
    } else {
      executeOrderCreation({ mode: "cod" });
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] font-sans text-[#2A2623] pt-28 pb-20 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full bg-[#FFFDF9] rounded-3xl border border-[#EFE8DC] p-8 md:p-12 text-center shadow-[0_12px_45px_rgba(0,0,0,0.06)] space-y-6"
        >
          <div className="w-20 h-20 rounded-full bg-[#7A0E2E]/10 text-[#7A0E2E] flex items-center justify-center mx-auto border border-[#7A0E2E]/30">
            <CheckCircle2 size={42} />
          </div>

          <div>
            <span className="text-xs uppercase font-bold tracking-[0.3em] text-[#B58E58]">Order Confirmed</span>
            <h1 className="font-serif text-3xl md:text-4xl text-[#222222] font-light mt-1">Thank You for Your Order</h1>
            <p className="text-xs md:text-sm text-[#7B6D63] font-light mt-2">
              Your order <span className="font-bold text-[#7A0E2E]">#{orderSuccess.id.slice(0, 10).toUpperCase()}</span> has been placed successfully and is being prepared by our ateliers.
            </p>
          </div>

          {/* Order Summary Details */}
          <div className="bg-[#FAF7F2] rounded-2xl p-5 border border-[#EFE8DC] text-left space-y-3 text-xs">
            <div className="flex justify-between border-b border-[#EFE8DC] pb-2">
              <span className="text-[#7B6D63] uppercase font-bold tracking-wider">Recipient</span>
              <span className="font-bold text-[#2A2623]">{orderSuccess.customerName}</span>
            </div>
            <div className="flex justify-between border-b border-[#EFE8DC] pb-2">
              <span className="text-[#7B6D63] uppercase font-bold tracking-wider">Payment Method</span>
              <span className="font-bold text-[#2A2623] uppercase">{orderSuccess.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7B6D63] uppercase font-bold tracking-wider">Total Paid</span>
              <span className="font-bold text-[#7A0E2E] text-sm">₹{Number(orderSuccess.totalAmount).toLocaleString()}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => navigate('/orders')}
              className="flex-1 py-3.5 bg-[#7A0E2E] text-white text-xs font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-[#2A2623] transition-colors cursor-pointer shadow-md"
            >
              Track My Orders
            </button>
            <button
              onClick={() => navigate('/shop')}
              className="flex-1 py-3.5 border border-[#EFE8DC] text-[#2A2623] text-xs font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-[#FAF7F2] transition-colors cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-6 text-center pt-32">
        <Gem size={48} className="text-[#B58E58]/40 mb-3" />
        <h2 className="font-serif text-3xl text-[#222222] font-light">Your shopping bag is empty.</h2>
        <p className="text-xs text-[#7B6D63] mt-2 mb-6">Select pieces from our catalog to proceed to checkout.</p>
        <button
          onClick={() => navigate('/shop')}
          className="px-8 py-3.5 bg-[#7A0E2E] text-white text-xs font-bold uppercase tracking-[0.25em] rounded-xl hover:bg-[#2A2623] transition-colors cursor-pointer shadow-md"
        >
          Explore Catalogue
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans text-[#2A2623]">
      {/* Top Banner */}
      <Breadcrumb 
        title="Express Checkout"
        subtitle="Complete your order securely with insured delivery across India."
        bgImage="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1600"
        links={[
          { name: 'Home', href: '/' },
          { name: 'Shopping Bag', href: '/cart' },
          { name: 'Checkout', active: true }
        ]}
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-12">
        
        {/* Out of Stock Warning */}
        {isAnyOutOfStock && (
          <div className="mb-8 bg-rose-50 border border-rose-200 p-4 rounded-2xl flex items-center gap-3 text-rose-700 text-xs">
            <AlertCircle size={20} className="flex-shrink-0 text-rose-600" />
            <p>One or more items in your order are out of stock. Please adjust quantities before completing purchase.</p>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          
          {/* Left Column: Shipping & Payment Form */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Step 1: Delivery Address */}
            <div className="bg-[#FFFDF9] p-6 sm:p-8 rounded-3xl border border-[#EFE8DC] shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-[#EFE8DC] pb-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#7A0E2E] text-white text-xs font-bold flex items-center justify-center">1</span>
                  <h3 className="font-serif text-xl sm:text-2xl text-[#222222] font-light">Shipping & Delivery Address</h3>
                </div>
                <span className="text-xs text-[#B58E58] font-bold uppercase tracking-wider">Step 1 of 2</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#7B6D63] mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#EFE8DC] rounded-xl outline-none focus:border-[#7A0E2E] transition-all"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#7B6D63] mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#EFE8DC] rounded-xl outline-none focus:border-[#7A0E2E] transition-all"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold uppercase tracking-wider text-[#7B6D63] mb-1">Mobile Phone Number *</label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile number"
                    className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#EFE8DC] rounded-xl outline-none focus:border-[#7A0E2E] transition-all"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold uppercase tracking-wider text-[#7B6D63] mb-1">Street Address / House No. *</label>
                  <textarea
                    rows={2}
                    required
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Apartment, building, street, area"
                    className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#EFE8DC] rounded-xl outline-none focus:border-[#7A0E2E] transition-all"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#7B6D63] mb-1">City *</label>
                  <input
                    type="text"
                    required
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g. Mumbai"
                    className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#EFE8DC] rounded-xl outline-none focus:border-[#7A0E2E] transition-all"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#7B6D63] mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="6-digit pincode"
                    className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#EFE8DC] rounded-xl outline-none focus:border-[#7A0E2E] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="bg-[#FFFDF9] p-6 sm:p-8 rounded-3xl border border-[#EFE8DC] shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-[#EFE8DC] pb-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#7A0E2E] text-white text-xs font-bold flex items-center justify-center">2</span>
                  <h3 className="font-serif text-xl sm:text-2xl text-[#222222] font-light">Payment Method</h3>
                </div>
                <span className="text-xs text-[#B58E58] font-bold uppercase tracking-wider">Step 2 of 2</span>
              </div>

              <div className="space-y-3">
                {/* Razorpay Online */}
                <label 
                  onClick={() => setPaymentMethod("razorpay")}
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === "razorpay"
                      ? "bg-[#7A0E2E]/5 border-[#7A0E2E] shadow-sm"
                      : "bg-[#FAF7F2] border-[#EFE8DC] hover:border-[#B58E58]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "razorpay"}
                      onChange={() => setPaymentMethod("razorpay")}
                      className="accent-[#7A0E2E] w-4 h-4"
                    />
                    <div>
                      <p className="text-xs font-bold text-[#2A2623] uppercase tracking-wider">Razorpay Online Payment</p>
                      <p className="text-[11px] text-[#7B6D63]">Cards, UPI, NetBanking, Wallets</p>
                    </div>
                  </div>
                  <CreditCard size={20} className="text-[#7A0E2E]" />
                </label>

                {/* Cash on Delivery */}
                <label 
                  onClick={() => setPaymentMethod("cod")}
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === "cod"
                      ? "bg-[#7A0E2E]/5 border-[#7A0E2E] shadow-sm"
                      : "bg-[#FAF7F2] border-[#EFE8DC] hover:border-[#B58E58]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="accent-[#7A0E2E] w-4 h-4"
                    />
                    <div>
                      <p className="text-xs font-bold text-[#2A2623] uppercase tracking-wider">Cash on Delivery (COD)</p>
                      <p className="text-[11px] text-[#7B6D63]">Pay in cash at doorstep upon delivery</p>
                    </div>
                  </div>
                  <Truck size={20} className="text-[#B58E58]" />
                </label>
              </div>
            </div>

            {/* Guarantee Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-[#FFFDF9] p-4 rounded-2xl border border-[#EFE8DC] text-center space-y-1">
                <ShieldCheck size={20} className="mx-auto text-[#7A0E2E]" />
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#2A2623]">256-Bit SSL</h5>
                <p className="text-[10px] text-[#7B6D63]">Bank grade encryption</p>
              </div>

              <div className="bg-[#FFFDF9] p-4 rounded-2xl border border-[#EFE8DC] text-center space-y-1">
                <Truck size={20} className="mx-auto text-[#B58E58]" />
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#2A2623]">Insured Transit</h5>
                <p className="text-[10px] text-[#7B6D63]">100% door-to-door insurance</p>
              </div>

              <div className="bg-[#FFFDF9] p-4 rounded-2xl border border-[#EFE8DC] text-center space-y-1">
                <Gem size={20} className="mx-auto text-[#7A0E2E]" />
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#2A2623]">Hallmarked Gold</h5>
                <p className="text-[10px] text-[#7B6D63]">Conflict free materials</p>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#FFFDF9] p-6 sm:p-8 rounded-3xl border border-[#EFE8DC] shadow-md sticky top-32 space-y-6">
              
              <div className="border-b border-[#EFE8DC] pb-4">
                <h3 className="font-serif text-2xl text-[#222222] font-light">Order Summary</h3>
                <p className="text-xs text-[#7B6D63] font-medium mt-0.5">{checkoutItems.length} Piece{checkoutItems.length > 1 ? 's' : ''}</p>
              </div>

              {/* Items List */}
              <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                {checkoutItems.map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-center">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#F3ECE1] border border-[#EFE8DC] flex-shrink-0">
                      <img src={item.image || item.primaryImage || '/img/jewellery/j.png'} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[#2A2623] truncate">{item.name}</h4>
                      <p className="text-[11px] text-[#7B6D63]">Qty: {item.quantity || 1}</p>
                      <p className="text-xs font-serif font-bold text-[#7A0E2E]">₹{Number(item.price).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cost Calculations */}
              <div className="space-y-3 pt-4 border-t border-[#EFE8DC] text-xs font-sans">
                <div className="flex justify-between text-[#7B6D63]">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#2A2623]">₹{subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-[#7B6D63]">
                  <span>Insured Shipping Fee</span>
                  <span className="font-bold text-emerald-700">
                    {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                  </span>
                </div>

                <div className="flex justify-between text-base font-serif font-bold text-[#2A2623] pt-3 border-t border-[#EFE8DC]">
                  <span>Total Amount</span>
                  <span className="text-[#7A0E2E] text-xl">₹{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Submit Order CTA */}
              <button
                type="submit"
                disabled={loading || isAnyOutOfStock}
                className={`w-full h-14 text-xs font-bold uppercase tracking-[0.25em] rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                  loading || isAnyOutOfStock
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-[#7A0E2E] text-white hover:bg-[#2A2623]'
                }`}
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Lock size={16} />}
                {loading ? 'Processing Order...' : `Complete Purchase (₹${total.toLocaleString()})`}
              </button>

            </div>
          </div>

        </form>

      </div>
    </div>
  );
};

export default Checkout;
