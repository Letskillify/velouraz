import React, { useState, useEffect } from "react";
import { useStore } from "../hooks/useStore";
import { useAuth } from "../components/useAuth";
import { db } from "../components/Firebase";
import { collection, addDoc, serverTimestamp, doc, getDoc, setDoc, writeBatch } from "firebase/firestore";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, Truck, ArrowLeft, CreditCard, User, Mail, 
  Phone, MapPin, CheckCircle2, Lock, Sparkles, AlertCircle, Loader2, PackageCheck
} from "lucide-react";

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

  // Helper to load Razorpay SDK dynamically if missing
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

  const handlePlaceOrder = async (e) => {
    if (e) e.preventDefault();

    if (!formData.name || !formData.phone || !formData.address || !formData.city || !formData.pincode) {
      alert("Please fill in all required shipping fields.");
      return;
    }

    setLoading(true);

    // 1. Double-check Stock
    try {
      for (const item of checkoutItems) {
        if (!item.id || item.id.startsWith("bs-")) continue;
        const pRef = doc(db, "products", item.id);
        const pSnap = await getDoc(pRef);
        if (pSnap.exists()) {
          const currentStock = Number(pSnap.data().stock || 0);
          if (currentStock < (item.quantity || 1)) {
            alert(`Pardon us! "${item.name}" only has ${currentStock} piece(s) available.`);
            setLoading(false);
            return;
          }
        }
      }
    } catch (err) {
      console.error("Stock verification failed:", err);
    }

    // 2. Razorpay Flow
    if (paymentMethod === "razorpay") {
      const res = await loadRazorpayScript();
      if (!res) {
        alert("Failed to load Razorpay payment gateway. Please check your internet connection.");
        setLoading(false);
        return;
      }

      const RAZORPAY_KEY_ID = "rzp_test_1DP5mmOlF5G5ag";

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: Math.round(total * 100), // paise
        currency: "INR",
        name: "Velouraz Jewellery",
        description: isBuyNow ? `Order: ${buyNowItem.name}` : `Velouraz Luxury Checkout (${checkoutItems.length} items)`,
        image: "/img/logo.png",
        handler: async function (response) {
          try {
            await createFinalOrder(response.razorpay_payment_id, "Paid (Razorpay)");
          } catch (error) {
            console.error("Order creation error:", error);
            alert("Payment successful, but encountered an error saving order. Please contact support.");
            setLoading(false);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email || "customer@velouraz.in",
          contact: formData.phone,
        },
        theme: {
          color: "#7A0E2E",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (resp) {
        alert("Payment Failed: " + (resp.error?.description || "Transaction cancelled."));
        setLoading(false);
      });
      rzp.open();
    } else {
      // Cash on Delivery
      try {
        await createFinalOrder("COD-" + Date.now(), "Pending (Cash on Delivery)");
      } catch (err) {
        console.error("COD order error:", err);
        alert("Failed to place COD order. Please try again.");
        setLoading(false);
      }
    }
  };

  const createFinalOrder = async (paymentId, paymentStatus) => {
    const orderData = {
      userId: user?.uid || "guest",
      items: checkoutItems,
      subtotal: subtotal,
      shippingFee: shippingFee,
      total: total,
      shippingDetails: formData,
      paymentId: paymentId,
      paymentMethod: paymentMethod === "razorpay" ? "Razorpay Online" : "Cash on Delivery",
      status: paymentStatus,
      isBuyNowCheckout: isBuyNow,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "orders"), orderData);

    // Save/update user default address & phone in Firestore for logged in users
    if (user?.uid) {
      try {
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
          displayName: formData.name,
          email: formData.email,
          phone: formData.phone,
          defaultAddress: {
            name: formData.name,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
          },
          updatedAt: serverTimestamp()
        }, { merge: true });
      } catch (err) {
        console.error("Error saving user profile address:", err);
      }
    }

    // Update Stock in Firestore
    const batch = writeBatch(db);

    for (const item of checkoutItems) {
      if (item.id && !item.id.startsWith("bs-")) {
        const productRef = doc(db, "products", item.id);
        const pSnap = await getDoc(productRef);
        if (pSnap.exists()) {
          const freshStock = Number(pSnap.data().stock || 0);
          batch.update(productRef, {
            stock: Math.max(0, freshStock - (item.quantity || 1)),
          });
        }
      }
    }

    // Only clear main cart if checkout was NOT a direct "Buy Now"
    if (!isBuyNow) {
      if (user) {
        for (const item of cartItems) {
          const cartRef = doc(db, "users", user.uid, "cart", item.id);
          batch.delete(cartRef);
        }
      } else {
        localStorage.removeItem("cart");
      }
    }

    await batch.commit();

    setLoading(false);
    setOrderSuccess({ id: docRef.id, ...orderData });
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-[#FDFAF5] font-sans text-[#2A2623] pt-24 pb-16 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full bg-white rounded-3xl p-8 sm:p-10 border border-[#D8CBBE]/40 shadow-2xl text-center space-y-6"
        >
          <div className="w-20 h-20 bg-[#7A0E2E]/10 rounded-full flex items-center justify-center mx-auto text-[#7A0E2E]">
            <PackageCheck size={42} />
          </div>
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#C8A97A]">Order Confirmed</span>
            <h1 className="text-3xl font-serif text-[#2A2623]">Thank you for your purchase</h1>
            <p className="text-xs text-[#7B6D63]">Order ID: <span className="font-mono font-bold text-[#7A0E2E]">{orderSuccess.id}</span></p>
          </div>

          <div className="bg-[#FDFAF5] p-5 rounded-2xl border border-[#D8CBBE]/30 text-left space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#7B6D63]">Order Summary</h4>
            <div className="space-y-2 divide-y divide-[#D8CBBE]/20">
              {orderSuccess.items.map((item, idx) => (
                <div key={idx} className="pt-2 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-semibold text-[#2A2623]">{item.name}</p>
                    <p className="text-[10px] text-[#7B6D63]">Qty: {item.quantity || 1}</p>
                  </div>
                  <span className="font-bold text-[#7A0E2E]">₹{(Number(item.price) * (item.quantity || 1)).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="pt-3 border-t border-[#D8CBBE]/30 flex justify-between text-sm font-bold">
              <span>Total Paid ({orderSuccess.paymentMethod})</span>
              <span className="text-[#7A0E2E]">₹{orderSuccess.total.toLocaleString()}</span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <Link
              to="/account"
              className="flex-1 py-3 bg-[#7A0E2E] text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-[#2A2623] transition-colors"
            >
              View Order in Account
            </Link>
            <Link
              to="/shop"
              className="flex-1 py-3 border border-[#2A2623] text-[#2A2623] text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-[#2A2623] hover:text-white transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDFAF5] flex flex-col items-center justify-center p-6 text-center pt-24">
        <h1 className="text-3xl sm:text-4xl font-serif text-[#2A2623] mb-4 italic">Your checkout bag is empty</h1>
        <p className="text-xs text-[#7B6D63] mb-8">Add exquisite jewellery pieces to your collection to proceed.</p>
        <Link
          to="/shop"
          className="px-8 py-3.5 bg-[#7A0E2E] text-white font-bold rounded-xl uppercase tracking-[0.2em] text-xs shadow-lg hover:bg-[#2A2623] transition-colors"
        >
          Explore Shop Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFAF5] pt-36 sm:pt-44 md:pt-48 pb-20 px-4 sm:px-6 lg:px-8 font-sans text-[#2A2623]">
      <div className="max-w-[1280px] mx-auto">
        
        {/* Header Navigation */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D8CBBE]/40 pb-6">
          <div>
            <Link
              to={isBuyNow ? `/product/${buyNowItem.id}` : "/cart"}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#7B6D63] hover:text-[#7A0E2E] transition-colors mb-2"
            >
              <ArrowLeft size={14} /> Back to {isBuyNow ? "Product Details" : "Shopping Cart"}
            </Link>
            <h1 className="text-3xl sm:text-4xl font-serif text-[#2A2623] tracking-tight">
              Express <span className="text-[#7A0E2E] italic">Checkout</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-full border border-[#D8CBBE]/50 shadow-sm w-fit">
            <Lock size={15} className="text-[#7A0E2E]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#7B6D63]">
              256-Bit SSL Encrypted
            </span>
          </div>
        </div>

        {/* {isBuyNow && (
          <div className="mb-8 p-4 bg-[#7A0E2E]/10 border border-[#7A0E2E]/30 rounded-2xl flex items-center gap-3">
            <Sparkles size={18} className="text-[#7A0E2E] flex-shrink-0" />
            <p className="text-xs text-[#7A0E2E] font-semibold">
              Direct Buy Now Checkout for <span className="font-bold">"{buyNowItem.name}"</span>. Your main shopping cart items remain saved!
            </p>
          </div>
        )} */}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Form Fields */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Step 1: Customer Details */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#D8CBBE]/40 shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-[#D8CBBE]/30 pb-4">
                <span className="w-8 h-8 rounded-full bg-[#7A0E2E] text-white flex items-center justify-center font-bold text-xs">1</span>
                <h2 className="font-serif text-xl font-bold text-[#2A2623]">Customer Details</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#7B6D63]">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full bg-[#FDFAF5] border border-[#D8CBBE]/60 rounded-xl px-4 py-3 text-xs outline-none focus:border-[#7A0E2E] transition-all font-medium text-[#2A2623]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#7B6D63]">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    className="w-full bg-[#FDFAF5] border border-[#D8CBBE]/60 rounded-xl px-4 py-3 text-xs outline-none focus:border-[#7A0E2E] transition-all font-medium text-[#2A2623]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#7B6D63]">Phone Number (Primary) *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#FDFAF5] border border-[#D8CBBE]/60 rounded-xl px-4 py-3 text-xs outline-none focus:border-[#7A0E2E] transition-all font-medium text-[#2A2623]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#7B6D63]">Alternate Phone Number (Optional)</label>
                  <input
                    type="tel"
                    name="altPhone"
                    value={formData.altPhone || ""}
                    onChange={handleInputChange}
                    placeholder="+91 98765 00000"
                    className="w-full bg-[#FDFAF5] border border-[#D8CBBE]/60 rounded-xl px-4 py-3 text-xs outline-none focus:border-[#7A0E2E] transition-all font-medium text-[#2A2623]"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Delivery Address */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#D8CBBE]/40 shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-[#D8CBBE]/30 pb-4">
                <span className="w-8 h-8 rounded-full bg-[#7A0E2E] text-white flex items-center justify-center font-bold text-xs">2</span>
                <h2 className="font-serif text-xl font-bold text-[#2A2623]">Delivery Address</h2>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#7B6D63]">Street Address *</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Street Name, Area, Locality"
                    className="w-full bg-[#FDFAF5] border border-[#D8CBBE]/60 rounded-xl px-4 py-3 text-xs outline-none focus:border-[#7A0E2E] transition-all font-medium text-[#2A2623]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#7B6D63]">Apartment / Flat / Building (Optional)</label>
                    <input
                      type="text"
                      name="apartment"
                      value={formData.apartment || ""}
                      onChange={handleInputChange}
                      placeholder="Flat 402, Building A, Floor 4"
                      className="w-full bg-[#FDFAF5] border border-[#D8CBBE]/60 rounded-xl px-4 py-3 text-xs outline-none focus:border-[#7A0E2E] transition-all font-medium text-[#2A2623]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#7B6D63]">Landmark / Nearby Place (Optional)</label>
                    <input
                      type="text"
                      name="landmark"
                      value={formData.landmark || ""}
                      onChange={handleInputChange}
                      placeholder="Near Apollo Hospital, Opp. City Mall"
                      className="w-full bg-[#FDFAF5] border border-[#D8CBBE]/60 rounded-xl px-4 py-3 text-xs outline-none focus:border-[#7A0E2E] transition-all font-medium text-[#2A2623]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#7B6D63]">City *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      className="w-full bg-[#FDFAF5] border border-[#D8CBBE]/60 rounded-xl px-4 py-3 text-xs outline-none focus:border-[#7A0E2E] transition-all font-medium text-[#2A2623]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#7B6D63]">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="State"
                      className="w-full bg-[#FDFAF5] border border-[#D8CBBE]/60 rounded-xl px-4 py-3 text-xs outline-none focus:border-[#7A0E2E] transition-all font-medium text-[#2A2623]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#7B6D63]">Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="Pincode"
                      className="w-full bg-[#FDFAF5] border border-[#D8CBBE]/60 rounded-xl px-4 py-3 text-xs outline-none focus:border-[#7A0E2E] transition-all font-medium text-[#2A2623]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#7B6D63]">Delivery Instructions / Notes (Optional)</label>
                  <input
                    type="text"
                    name="deliveryNotes"
                    value={formData.deliveryNotes || ""}
                    onChange={handleInputChange}
                    placeholder="e.g. Ring doorbell, leave parcel at gate security"
                    className="w-full bg-[#FDFAF5] border border-[#D8CBBE]/60 rounded-xl px-4 py-3 text-xs outline-none focus:border-[#7A0E2E] transition-all font-medium text-[#2A2623]"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#D8CBBE]/40 shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-[#D8CBBE]/30 pb-4">
                <span className="w-8 h-8 rounded-full bg-[#7A0E2E] text-white flex items-center justify-center font-bold text-xs">3</span>
                <h2 className="font-serif text-xl font-bold text-[#2A2623]">Payment Option</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Razorpay Online */}
                <div
                  onClick={() => setPaymentMethod("razorpay")}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                    paymentMethod === "razorpay"
                      ? "border-[#7A0E2E] bg-[#7A0E2E]/5 shadow-sm"
                      : "border-[#D8CBBE]/50 hover:border-[#7A0E2E]/40 bg-[#FDFAF5]"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-[#7A0E2E]">
                      <CreditCard size={20} />
                      <span className="text-xs font-bold uppercase tracking-wider">Razorpay Online</span>
                    </div>
                    {paymentMethod === "razorpay" && <CheckCircle2 size={18} className="text-[#7A0E2E]" />}
                  </div>
                  <p className="text-[11px] text-[#7B6D63]">
                    Instant Pay via UPI (GPay, PhonePe), Credit/Debit Cards, NetBanking.
                  </p>
                </div>

                {/* Cash on Delivery */}
                <div
                  onClick={() => setPaymentMethod("cod")}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                    paymentMethod === "cod"
                      ? "border-[#7A0E2E] bg-[#7A0E2E]/5 shadow-sm"
                      : "border-[#D8CBBE]/50 hover:border-[#7A0E2E]/40 bg-[#FDFAF5]"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-[#2A2623]">
                      <Truck size={20} />
                      <span className="text-xs font-bold uppercase tracking-wider">Cash on Delivery</span>
                    </div>
                    {paymentMethod === "cod" && <CheckCircle2 size={18} className="text-[#7A0E2E]" />}
                  </div>
                  <p className="text-[11px] text-[#7B6D63]">
                    Pay in cash when your luxury parcel arrives at your doorstep.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <aside className="lg:col-span-5">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#D8CBBE]/40 shadow-sm sticky top-28 space-y-6">
              <h2 className="font-serif text-xl font-bold text-[#2A2623] border-b border-[#D8CBBE]/30 pb-4">
                Order Summary ({checkoutItems.length} {checkoutItems.length === 1 ? "item" : "items"})
              </h2>

              {/* Items List */}
              <div className="max-h-[300px] overflow-y-auto space-y-4 pr-1 scrollbar-hide">
                {checkoutItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3.5 p-2.5 rounded-xl bg-[#FDFAF5] border border-[#D8CBBE]/30">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-black/5 border border-[#D8CBBE]/30 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] uppercase tracking-widest font-bold text-[#7A0E2E]">
                        {item.category || "Jewellery"}
                      </p>
                      <h4 className="text-xs font-semibold text-[#2A2623] truncate">{item.name}</h4>
                      <p className="text-[11px] text-[#7B6D63]">Qty: {item.quantity || 1}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-[#7A0E2E]">
                        ₹{(Number(item.price || 0) * (item.quantity || 1)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculation */}
              <div className="space-y-3 pt-4 border-t border-[#D8CBBE]/30 text-xs text-[#7B6D63]">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-semibold text-[#2A2623]">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping & Delivery</span>
                  <span className="font-semibold text-[#7A0E2E]">
                    {shippingFee === 0 ? "Complimentary Free" : `₹${shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-[#D8CBBE]/30 text-sm font-bold text-[#2A2623]">
                  <span>Total Amount</span>
                  <span className="text-lg text-[#7A0E2E]">₹{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Submit Payment Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={loading || isAnyOutOfStock}
                className={`w-full py-4 rounded-xl text-xs font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-lg ${
                  isAnyOutOfStock
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-[#7A0E2E] text-white hover:bg-[#2A2623]"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Processing Order...
                  </>
                ) : isAnyOutOfStock ? (
                  "Some Items Out of Stock"
                ) : paymentMethod === "razorpay" ? (
                  <>Pay ₹{total.toLocaleString()} with Razorpay</>
                ) : (
                  <>Place Order (Cash on Delivery)</>
                )}
              </button>

              <div className="pt-2 grid grid-cols-2 gap-2 text-[10px] text-[#7B6D63] font-medium text-center">
                <div className="p-2 bg-[#FDFAF5] rounded-lg border border-[#D8CBBE]/20 flex items-center justify-center gap-1.5">
                  <ShieldCheck size={14} className="text-[#7A0E2E]" /> 100% Authentic
                </div>
                <div className="p-2 bg-[#FDFAF5] rounded-lg border border-[#D8CBBE]/20 flex items-center justify-center gap-1.5">
                  <Truck size={14} className="text-[#7A0E2E]" /> Express Shipping
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
