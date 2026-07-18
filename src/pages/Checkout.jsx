import React, { useState } from "react";
import { useStore } from "../hooks/useStore";
import { useAuth } from "../components/useAuth";
import { db } from "../components/Firebase";
import { collection, addDoc, serverTimestamp, doc, deleteDoc, writeBatch, getDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Truck, ArrowLeft, CreditCard, User, Mail, Phone, MapPin } from "lucide-react";

const Checkout = () => {
  const { cartItems, cartCount } = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const total = cartItems.reduce((sum, item) => sum + (Number(item.price) * (item.quantity || 1)), 0);

  const [stockStatus, setStockStatus] = useState({});

  React.useEffect(() => {
    const checkAllStock = async () => {
      const status = {};
      for (const item of cartItems) {
        try {
          if (!item.id || item.id.startsWith('bs-')) continue;
          const pRef = doc(db, "products", item.id);
          const pSnap = await getDoc(pRef);
          if (pSnap.exists()) {
            const currentStock = Number(pSnap.data().stock || 0);
            status[item.id] = currentStock;
          }
        } catch (e) {
          console.error(e);
        }
      }
      setStockStatus(status);
    };
    if (cartItems.length > 0) checkAllStock();
  }, [cartItems]);

  const isAnyOutOfStock = cartItems.some(item => {
    const stock = stockStatus[item.id];
    return stock !== undefined && stock < (item.quantity || 1);
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayment = async () => {
    if (!formData.phone || !formData.address || !formData.city || !formData.pincode) {
      alert("Please fill in all shipping details.");
      return;
    }

    setLoading(true);

    // 1. Verify Stock Availability
    try {
      for (const item of cartItems) {
        if (!item.id || item.id.startsWith('bs-')) continue;
        const pRef = doc(db, "products", item.id);
        const pSnap = await getDoc(pRef);
        if (pSnap.exists()) {
          const currentStock = pSnap.data().stock || 0;
          if (currentStock < (item.quantity || 1)) {
            alert(`Apologies. "${item.name}" has only ${currentStock} pieces left in stock. Please adjust your selection.`);
            setLoading(false);
            return;
          }
        }
      }
    } catch (e) {
      console.error("Stock check error:", e);
      alert("Error verifying stock. Please try again.");
      setLoading(false);
      return;
    }

    const RAZORPAY_KEY_ID = "rzp_test_1DP5mmOlF5G5ag";

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: total * 100, // Amount in paise
      currency: "INR",
      name: "Velouraz Luxury",
      description: "Order Payment",
      image: "/img/logo.png",
      handler: async function (response) {
        // Payment successful
        try {
          // 1. Create order in Firestore
          const orderData = {
            userId: user?.uid || "guest",
            items: cartItems,
            total: total,
            shippingDetails: formData,
            paymentId: response.razorpay_payment_id,
            status: "Paid",
            createdAt: serverTimestamp(),
          };

          await addDoc(collection(db, "orders"), orderData);

          // 2. Clear cart and Update Stock
          const batch = writeBatch(db);
          
          if (user) {
            for (const item of cartItems) {
              // Remove from cart
              const cartRef = doc(db, "users", user.uid, "cart", item.id);
              batch.delete(cartRef);
              
              // Decrease stock by purchased quantity
              if (item.id && !item.id.startsWith('bs-')) {
                const productRef = doc(db, "products", item.id);
                const pSnap = await getDoc(productRef); // Get fresh stock
                const freshStock = pSnap.exists() ? (pSnap.data().stock || 0) : 0;
                batch.update(productRef, {
                  stock: Number(freshStock) - (item.quantity || 1)
                });
              }
            }
          } else {
            for (const item of cartItems) {
              // Decrease stock for guest users too
              if (item.id && !item.id.startsWith('bs-')) {
                const productRef = doc(db, "products", item.id);
                const pSnap = await getDoc(productRef);
                const freshStock = pSnap.exists() ? (pSnap.data().stock || 0) : 0;
                batch.update(productRef, {
                  stock: Number(freshStock) - (item.quantity || 1)
                });
              }
            }
            localStorage.removeItem("cart");
          }
          await batch.commit();

          alert("Payment Successful! Your order has been placed.");
          navigate("/account"); // Redirect to account or orders page
        } catch (error) {
          console.error("Error creating order:", error);
          alert("Payment successful, but failed to save order details. Please contact support.");
        } finally {
          setLoading(false);
        }
      },
      prefill: {
        name: formData.name,
        email: formData.email || "info@velouraz.in",
        contact: formData.phone || "695035916",
      },
      theme: {
        color: "#7A0E2E",
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.on("payment.failed", function (response) {
      alert("Payment Failed: " + response.error.description);
      setLoading(false);
    });
    rzp1.open();
  };

  if (cartCount === 0) {
    return (
      <div className="min-h-screen bg-[#F8F4EF] flex flex-col items-center justify-center p-6 pt-32 text-center">
        <h1 className="text-4xl sm:text-6xl font-serif text-[#2A2623] mb-8 italic">Your collection is empty</h1>
        <Link to="/shop" className="px-12 py-5 bg-[#7A0E2E] text-white font-bold rounded-2xl uppercase tracking-[0.3em] text-[14px] shadow-2xl shadow-[#7A0E2E]/20 hover:bg-[#2A2623] transition-all active:scale-95">
          Return to Atelier
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F4EF] pt-20 pb-20 px-4 sm:px-6 lg:px-8 font-sans text-[#2A2623] selection:bg-[#7A0E2E]/10 selection:text-[#7A0E2E]">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Editorial Header */}
        <div className="mb-20 border-b border-[#D8CBBE]/30 pb-12 flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="space-y-6">
            <Link to="/cart" className="inline-flex items-center gap-3 text-[14px] font-bold uppercase tracking-[0.4em] text-[#7B6D63] hover:text-[#7A0E2E] transition-all group">
              <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform duration-500" />
              Return to Selection
            </Link>
            <h1 className="text-5xl sm:text-7xl font-serif text-[#2A2623] tracking-tighter leading-none">
              Final <span className="text-[#7A0E2E] italic font-light">Acquisition</span>
            </h1>
          </div>
          <div className="flex items-center gap-6 bg-white/40 backdrop-blur-xl px-8 py-4 rounded-full border border-[#D8CBBE]/30 shadow-sm">
             <ShieldCheck size={18} className="text-[#7A0E2E]" />
             <span className="text-[14px] font-bold uppercase tracking-[0.3em] text-[#7B6D63]">Encrypted Transaction</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          {/* Main Checkout Flow */}
          <div className="lg:col-span-7 space-y-16">
            
            {/* Step 1: Identity */}
            <section className="space-y-10">
              <div className="flex items-center gap-6">
                <span className="w-12 h-12 rounded-full bg-[#7A0E2E] text-white flex items-center justify-center font-serif text-xl shadow-xl shadow-[#7A0E2E]/20">1</span>
                <h2 className="text-3xl font-serif text-[#2A2623]">Identity & Contact</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 pl-18">
                <div className="space-y-3">
                  <label className="text-[14px] font-bold uppercase tracking-[0.3em] text-[#7B6D63] ml-2">Full Name</label>
                  <input 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-white/60 border border-[#D8CBBE]/50 rounded-2xl px-6 py-4 text-sm font-medium text-[#2A2623] outline-none focus:border-[#7A0E2E] transition-all shadow-sm"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[14px] font-bold uppercase tracking-[0.3em] text-[#7B6D63] ml-2">Email Address</label>
                  <input 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-white/60 border border-[#D8CBBE]/50 rounded-2xl px-6 py-4 text-sm font-medium text-[#2A2623] outline-none focus:border-[#7A0E2E] transition-all shadow-sm"
                  />
                </div>
                <div className="space-y-3 md:col-span-2">
                  <label className="text-[14px] font-bold uppercase tracking-[0.3em] text-[#7B6D63] ml-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-[#7B6D63]/30" size={16} />
                    <input 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-white/60 border border-[#D8CBBE]/50 rounded-2xl pl-16 pr-6 py-4 text-sm font-medium text-[#2A2623] outline-none focus:border-[#7A0E2E] transition-all shadow-sm"
                      placeholder="+91 00000 00000"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Step 2: Shipping */}
            <section className="space-y-10">
              <div className="flex items-center gap-6">
                <span className="w-12 h-12 rounded-full bg-[#7A0E2E] text-white flex items-center justify-center font-serif text-xl shadow-xl shadow-[#7A0E2E]/20">2</span>
                <h2 className="text-3xl font-serif text-[#2A2623]">Destination Atelier</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 pl-18">
                <div className="space-y-3 md:col-span-2">
                  <label className="text-[14px] font-bold uppercase tracking-[0.3em] text-[#7B6D63] ml-2">Street Address</label>
                  <input 
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full bg-white/60 border border-[#D8CBBE]/50 rounded-2xl px-6 py-4 text-sm font-medium text-[#2A2623] outline-none focus:border="
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[14px] font-bold uppercase tracking-[0.3em] text-[#7B6D63] ml-2">City</label>
                  <input 
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full bg-white/60 border border-[#D8CBBE]/50 rounded-2xl px-6 py-4 text-sm font-medium text-[#2A2623] outline-none focus:border-[#7A0E2E] transition-all shadow-sm"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[14px] font-bold uppercase tracking-[0.3em] text-[#7B6D63] ml-2">Postal Code</label>
                  <input 
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full bg-white/60 border border-[#D8CBBE]/50 rounded-2xl px-6 py-4 text-sm font-medium text-[#2A2623] outline-none focus:border-[#7A0E2E] transition-all shadow-sm"
                  />
                </div>
              </div>
            </section>

            {/* Step 3: Payment */}
            <section className="space-y-10">
              <div className="flex items-center gap-6">
                <span className="w-12 h-12 rounded-full bg-[#7A0E2E] text-white flex items-center justify-center font-serif text-xl shadow-xl shadow-[#7A0E2E]/20">3</span>
                <h2 className="text-3xl font-serif text-[#2A2623]">Payment Protocol</h2>
              </div>
              
              <div className="pl-18 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div
                      className="flex flex-col items-start p-8 rounded-[32px] border transition-all duration-500 text-left bg-[#7A0E2E] border-[#7A0E2E] text-white shadow-2xl shadow-[#7A0E2E]/20"
                    >
                      <CreditCard size={28} strokeWidth={1} className="mb-6 text-white" />
                      <span className="text-[14px] font-bold uppercase tracking-[0.2em] mb-2">Secured Transaction</span>
                      <span className="text-[14px] text-white/60">UPI, Cards, Net Banking</span>
                    </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right: Order Summary */}
          <aside className="lg:col-span-5">
            <div className="bg-white/40 backdrop-blur-2xl rounded-[40px] border border-[#D8CBBE]/30 p-10 sticky top-32 shadow-[0_32px_80px_rgba(122,14,46,0.05)]">
              <h2 className="text-3xl font-serif text-[#2A2623] mb-10 border-b border-[#D8CBBE]/20 pb-6">Your Selection</h2>
              
              <div className="max-h-[400px] overflow-y-auto pr-4 mb-10 space-y-8 scrollbar-hide">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-6 items-center">
                    <div className="w-20 h-24 rounded-2xl overflow-hidden bg-[#F4EEE8] border border-[#D8CBBE]/30 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="text-sm font-serif text-[#2A2623] font-bold">{item.name}</h4>
                      <div className="flex justify-between items-center">
                        <p className="text-[14px] text-[#7B6D63] font-bold uppercase tracking-widest">Qty: {item.quantity || 1}</p>
                        <p className="text-sm font-bold text-[#7A0E2E]">₹{(Number(item.price) * (item.quantity || 1)).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-6 pt-10 border-t border-[#D8CBBE]/20">
                <div className="flex justify-between text-[14px] font-bold uppercase tracking-widest text-[#7B6D63]">
                  <span>Subtotal</span>
                  <span className="text-[#2A2623]">₹{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[14px] font-bold uppercase tracking-widest text-[#7B6D63]">
                  <span>Shipping</span>
                  <span className="text-[#7A0E2E] italic">Complimentary</span>
                </div>
                <div className="flex justify-between items-end pt-6">
                  <span className="text-sm font-bold uppercase tracking-[0.3em] text-[#2A2623]">Total Acquisition</span>
                  <span className="text-4xl font-serif text-[#7A0E2E]">₹{total.toLocaleString()}</span>
                </div>
              </div>

              <button 
                onClick={handlePayment}
                disabled={loading || isAnyOutOfStock}
                className={`w-full py-6 rounded-2xl text-[14px] font-bold uppercase tracking-[0.5em] transition-all duration-700 shadow-2xl mt-12 flex items-center justify-center gap-4 ${
                  isAnyOutOfStock 
                  ? 'bg-[#2A2623]/10 text-[#2A2623]/40 cursor-not-allowed' 
                  : 'bg-[#2A2623] text-white hover:bg-[#7A0E2E] shadow-[#2A2623]/20'
                }`}
              >
                {loading ? (
                  <div className="w-6 h-6 border-[3px] border-white/20 border-t-white rounded-full animate-spin" />
                ) : isAnyOutOfStock ? (
                  "Adjust Selection"
                ) : (
                  <>Complete Transaction</>
                )}
              </button>
              
              <p className="text-center mt-8 text-[9px] font-bold uppercase tracking-[0.2em] text-[#7B6D63]/50">
                Finalizing this order signifies your acceptance of our <br/> 
                <span className="text-[#7A0E2E]">Terms of Service</span> and <span className="text-[#7A0E2E]">Privacy Protocol</span>.
              </p>
            </div>
          </aside>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `.scrollbar-hide::-webkit-scrollbar { display: none; }` }} />
    </div>
  );
};


export default Checkout;
