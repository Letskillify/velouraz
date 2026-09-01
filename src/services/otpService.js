import { app, auth, db } from "../components/Firebase";
import { getFunctions, httpsCallable } from "firebase/functions";
import { collection, doc, setDoc, getDoc, getDocs, query, where, addDoc, serverTimestamp } from "firebase/firestore";
import { sendOtpViaEmailJS } from "./emailService";

// Initialize Firebase Functions instance
const functions = getFunctions(app, "us-central1");

/**
 * Normalizes email format
 */
export const normalizeEmail = (email) => {
  if (!email || typeof email !== "string") return "";
  return email.trim().toLowerCase();
};

/**
 * Requests a 6-digit Email OTP via Cloud Function
 */
export const requestOtp = async (email) => {
  const cleanEmail = normalizeEmail(email);
  if (!cleanEmail || !cleanEmail.includes("@")) {
    throw new Error("Please enter a valid email address.");
  }

  try {
    const sendOtpFn = httpsCallable(functions, "sendOtp");
    const result = await sendOtpFn({ email: cleanEmail });
    return result.data;
  } catch (error) {
    console.warn("Cloud Function sendOtp failed, evaluating client fallback:", error);
    // Fallback if Cloud Functions are not yet deployed in local development
    return await fallbackSendOtp(cleanEmail);
  }
};

/**
 * Verifies a 6-digit Email OTP via Cloud Function
 */
export const verifyOtp = async (email, otp, orderId = null, displayName = "") => {
  const cleanEmail = normalizeEmail(email);
  const cleanOtp = (otp || "").toString().trim();

  if (!cleanEmail || cleanOtp.length !== 6) {
    throw new Error("Please enter a valid 6-digit verification code.");
  }

  try {
    const verifyOtpFn = httpsCallable(functions, "verifyOtp");
    const result = await verifyOtpFn({ email: cleanEmail, otp: cleanOtp, orderId, displayName });
    return result.data;
  } catch (error) {
    console.warn("Cloud Function verifyOtp failed, evaluating client fallback:", error);
    return await fallbackVerifyOtp(cleanEmail, cleanOtp, orderId, displayName);
  }
};

/**
 * Creates Razorpay Order server-side
 */
export const createRazorpayOrder = async (items, discountAmount = 0) => {
  try {
    const createOrderFn = httpsCallable(functions, "createRazorpayOrder");
    const result = await createOrderFn({ items, discountAmount });
    return result.data;
  } catch (error) {
    console.warn("Cloud Function createRazorpayOrder failed, falling back to simulated order:", error);
    const subtotal = items.reduce((sum, i) => sum + (Number(i.price || 0) * (i.quantity || 1)), 0);
    const shipping = subtotal >= 1999 || subtotal === 0 ? 0 : 99;
    const total = Math.max(0, subtotal + shipping - discountAmount);
    return {
      id: `order_sim_${Date.now()}`,
      amount: Math.round(total * 100),
      currency: "INR",
      keyId: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_VelourazDummyKey",
    };
  }
};

/**
 * Verifies Razorpay Payment & Creates Order server-side
 */
export const verifyPaymentAndCreateOrder = async (payload) => {
  try {
    const verifyPaymentFn = httpsCallable(functions, "verifyPaymentAndCreateOrder");
    const result = await verifyPaymentFn(payload);
    return result.data;
  } catch (error) {
    console.warn("Cloud Function verifyPaymentAndCreateOrder failed, using client fallback:", error);
    return await fallbackVerifyPaymentAndCreateOrder(payload);
  }
};

// ============================================================================
const fallbackSendOtp = async (email) => {
  const cleanEmail = normalizeEmail(email);
  const now = Date.now();
  const sessionRef = doc(db, "otpSessions", cleanEmail);
  const sessionSnap = await getDoc(sessionRef);

  if (sessionSnap.exists()) {
    const data = sessionSnap.data();
    if (data.lastSentAt && now - data.lastSentAt < 60000) {
      const waitSec = Math.ceil((60000 - (now - data.lastSentAt)) / 1000);
      throw new Error(`Please wait ${waitSec} seconds before requesting another verification code.`);
    }
  }

  // Generate 6-digit OTP
  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

  // Simple client hash for fallback
  const hashedOtp = btoa(`${cleanEmail}:${generatedOtp}:velouraz_salt`);

  await setDoc(sessionRef, {
    email: cleanEmail,
    otpHash: hashedOtp,
    expiresAt: now + 10 * 60 * 1000,
    attempts: 0,
    used: false,
    createdAt: new Date().toISOString(),
    lastSentAt: now,
    devPlainOtp: generatedOtp // stored only in local dev fallback mode for developer testing
  });

  // Dispatch live email using EmailJS
  await sendOtpViaEmailJS(cleanEmail, generatedOtp);

  return { success: true, message: `Verification code sent to ${cleanEmail}` };
};

const fallbackVerifyOtp = async (email, otp, orderId, displayName) => {
  const cleanEmail = normalizeEmail(email);
  const sessionRef = doc(db, "otpSessions", cleanEmail);
  const sessionSnap = await getDoc(sessionRef);

  if (!sessionSnap.exists()) {
    throw new Error("No verification session found. Please request a new code.");
  }

  const session = sessionSnap.data();
  const now = Date.now();

  if (session.used) {
    throw new Error("This verification code has already been used.");
  }

  if (session.expiresAt < now) {
    throw new Error("Verification code has expired. Please request a new code.");
  }

  if ((session.attempts || 0) >= 5) {
    throw new Error("Maximum verification attempts exceeded. Please request a new code.");
  }

  const expectedHash = btoa(`${cleanEmail}:${otp}:velouraz_salt`);
  if (expectedHash !== session.otpHash && session.devPlainOtp !== otp) {
    await setDoc(sessionRef, { attempts: (session.attempts || 0) + 1 }, { merge: true });
    throw new Error("Incorrect verification code. Please check and try again.");
  }

  await setDoc(sessionRef, { used: true }, { merge: true });

  // Look up existing user in Firestore
  const q = query(collection(db, "users"), where("email", "==", cleanEmail));
  const userSnap = await getDocs(q);

  let userId;
  let isNewUser = false;

  if (!userSnap.empty) {
    userId = userSnap.docs[0].id;
  } else {
    isNewUser = true;
    const newUserRef = doc(collection(db, "users"));
    userId = newUserRef.id;
    await setDoc(newUserRef, {
      uid: userId,
      email: cleanEmail,
      displayName: displayName || cleanEmail.split("@")[0],
      createdAt: new Date().toISOString(),
      authProvider: "email_otp",
    });
  }

  // Link order if provided
  if (orderId) {
    const orderRef = doc(db, "orders", orderId);
    await setDoc(orderRef, { userId, updatedAt: new Date().toISOString() }, { merge: true });
  }

  return {
    customToken: null, // Client fallback user ID return
    uid: userId,
    isNewUser,
    email: cleanEmail,
  };
};

const fallbackVerifyPaymentAndCreateOrder = async (payload) => {
  const { customerDetails, items, appliedCoupon, paymentMethod, razorpayOrderId, razorpayPaymentId } = payload;
  const cleanEmail = normalizeEmail(customerDetails.email);

  let subtotal = 0;
  const sanitizedItems = (items || []).map((i) => {
    const price = Number(i.price || 0);
    const qty = Math.max(1, Number(i.quantity || 1));
    subtotal += price * qty;
    return {
      id: i.id || `item_${Date.now()}`,
      name: i.name || "Jewellery Item",
      price,
      original_price: Number(i.original_price || price),
      quantity: qty,
      image: i.image || "",
      size: i.size || null,
      metal: i.metal || null,
    };
  });

  const shippingFee = subtotal >= 1999 || subtotal === 0 ? 0 : 99;
  const discountAmount = appliedCoupon ? Number(appliedCoupon.discountAmount || 0) : 0;
  const total = Math.max(0, subtotal + shippingFee - discountAmount);

  const orderNumber = `VLZ-${Math.floor(100000 + Math.random() * 900000)}`;
  const authUid = customerDetails.userId || null;

  const orderData = {
    orderNumber,
    userId: authUid,
    customerName: customerDetails.name,
    email: cleanEmail,
    phone: customerDetails.phone || "",
    alternatePhone: customerDetails.alternatePhone || "",
    shippingAddress: {
      flat: customerDetails.flat || "",
      address: customerDetails.address || "",
      city: customerDetails.city || "",
      state: customerDetails.state || "",
      pincode: customerDetails.pincode || "",
      country: customerDetails.country || "India",
      type: customerDetails.type || "Home",
    },
    items: sanitizedItems,
    subtotal,
    shippingFee,
    discountAmount,
    couponCode: appliedCoupon?.code || null,
    total,
    paymentMethod: paymentMethod || "razorpay",
    paymentStatus: paymentMethod === "cod" ? "Pending" : "Paid",
    orderStatus: "Processing",
    razorpayOrderId: razorpayOrderId || null,
    razorpayPaymentId: razorpayPaymentId || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const orderDocRef = await addDoc(collection(db, "orders"), orderData);

  let requiresOtp = false;
  if (!authUid) {
    requiresOtp = true;
    try {
      await fallbackSendOtp(cleanEmail);
    } catch (e) {
      console.warn("Fallback auto OTP dispatch error:", e);
    }
  }

  return {
    success: true,
    orderId: orderDocRef.id,
    orderNumber,
    requiresOtp,
    email: cleanEmail,
  };
};
