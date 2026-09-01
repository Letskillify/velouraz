/**
 * Velouraz EmailJS Notification Service
 * Handles sending automated customer order receipts & admin order alerts.
 * 
 * Configuration variables fall back to empty strings if not yet set in .env.
 */

export const EMAILJS_CONFIG = {
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_jrbtkwl",
  USER_TEMPLATE_ID: import.meta.env.VITE_EMAILJS_USER_TEMPLATE_ID || "template_2pij0vn",
  ADMIN_TEMPLATE_ID: import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE_ID || "template_2pij0vn",
  OTP_TEMPLATE_ID: import.meta.env.VITE_EMAILJS_OTP_TEMPLATE_ID || "template_2pij0vn",
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "",
  ADMIN_EMAIL: import.meta.env.VITE_ADMIN_EMAIL || "admin@velouraz.com",
};

/**
 * Send 6-Digit Email OTP via EmailJS
 */
export const sendOtpViaEmailJS = async (toEmail, otp) => {
  const serviceId = EMAILJS_CONFIG.SERVICE_ID;
  const templateId = EMAILJS_CONFIG.OTP_TEMPLATE_ID || EMAILJS_CONFIG.USER_TEMPLATE_ID;
  const publicKey = EMAILJS_CONFIG.PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    console.warn(
      "[EmailJS] OTP parameters missing. Please configure VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_OTP_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY in your .env file."
    );
    return { success: false, reason: "Missing EmailJS configuration" };
  }

  const templateParams = {
    to_email: toEmail,
    email: toEmail,
    otp_code: otp,
    passcode: otp,
    app_name: "Velouraz High Jewellery",
    expiry_minutes: "10",
  };

  try {
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: templateParams,
      }),
    });

    if (response.ok) {
      console.log(`[EmailJS] OTP email dispatched successfully to ${toEmail}`);
      return { success: true };
    } else {
      const errText = await response.text();
      console.error("[EmailJS] OTP Email error response:", errText);
      return { success: false, error: errText };
    }
  } catch (error) {
    console.error("[EmailJS] Exception sending OTP email:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Format order item list into readable HTML/text
 */
const formatOrderItems = (items = []) => {
  return items
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.name} × ${item.quantity || 1} — ₹${(
          Number(item.price || 0) * (item.quantity || 1)
        ).toLocaleString()}`
    )
    .join("\n");
};

/**
 * Send Order Confirmation Email to Customer
 */
export const sendOrderConfirmationToUser = async (orderData) => {
  if (!EMAILJS_CONFIG.SERVICE_ID || !EMAILJS_CONFIG.USER_TEMPLATE_ID || !EMAILJS_CONFIG.PUBLIC_KEY) {
    console.warn(
      "[EmailJS] Customer Email parameters missing. Please configure VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_USER_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY in your .env file."
    );
    return { success: false, reason: "Missing EmailJS configuration" };
  }

  const templateParams = {
    to_email: orderData.email,
    customer_name: orderData.customerName || orderData.shippingAddress?.name || "Valued Customer",
    order_id: orderData.id || orderData.orderId || "VEL-" + Math.floor(100000 + Math.random() * 900000),
    order_date: new Date(orderData.orderDate || Date.now()).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    order_total: `₹${Number(orderData.totalAmount || orderData.total || 0).toLocaleString()}`,
    item_list: formatOrderItems(orderData.items),
    shipping_address: orderData.shippingAddress?.fullAddress || `${orderData.shippingAddress?.address}, ${orderData.shippingAddress?.city} - ${orderData.shippingAddress?.pincode}`,
    payment_method: (orderData.paymentMethod || "online").toUpperCase(),
    payment_status: orderData.paymentStatus || "Paid",
    tracking_number: orderData.trackingNumber || orderData.awbNumber || "Pending Dispatch",
    tracking_link: window.location.origin + `/track-order?id=${orderData.id || ""}`,
  };

  try {
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        service_id: EMAILJS_CONFIG.SERVICE_ID,
        template_id: EMAILJS_CONFIG.USER_TEMPLATE_ID,
        user_id: EMAILJS_CONFIG.PUBLIC_KEY,
        template_params: templateParams,
      }),
    });

    if (response.ok) {
      console.log("[EmailJS] Customer confirmation email dispatched successfully.");
      return { success: true };
    } else {
      const errText = await response.text();
      console.error("[EmailJS] Customer Email error response:", errText);
      return { success: false, error: errText };
    }
  } catch (error) {
    console.error("[EmailJS] Exception sending customer email:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Send New Order Alert Email to Velouraz Admin
 */
export const sendOrderNotificationToAdmin = async (orderData) => {
  if (!EMAILJS_CONFIG.SERVICE_ID || !EMAILJS_CONFIG.ADMIN_TEMPLATE_ID || !EMAILJS_CONFIG.PUBLIC_KEY) {
    console.warn(
      "[EmailJS] Admin Email parameters missing. Please configure VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_ADMIN_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY in your .env file."
    );
    return { success: false, reason: "Missing EmailJS configuration" };
  }

  const templateParams = {
    admin_email: EMAILJS_CONFIG.ADMIN_EMAIL,
    customer_name: orderData.customerName || orderData.shippingAddress?.name || "Customer",
    customer_email: orderData.email,
    customer_phone: orderData.phone || orderData.shippingAddress?.phone || "N/A",
    order_id: orderData.id || orderData.orderId || "VEL-" + Math.floor(100000 + Math.random() * 900000),
    order_date: new Date(orderData.orderDate || Date.now()).toLocaleString("en-IN"),
    order_total: `₹${Number(orderData.totalAmount || orderData.total || 0).toLocaleString()}`,
    item_list: formatOrderItems(orderData.items),
    shipping_address: orderData.shippingAddress?.fullAddress || `${orderData.shippingAddress?.address}, ${orderData.shippingAddress?.city} - ${orderData.shippingAddress?.pincode}`,
    payment_method: (orderData.paymentMethod || "online").toUpperCase(),
    payment_status: orderData.paymentStatus || "Paid",
    tracking_number: orderData.trackingNumber || orderData.awbNumber || "Pending Dispatch",
  };

  try {
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        service_id: EMAILJS_CONFIG.SERVICE_ID,
        template_id: EMAILJS_CONFIG.ADMIN_TEMPLATE_ID,
        user_id: EMAILJS_CONFIG.PUBLIC_KEY,
        template_params: templateParams,
      }),
    });

    if (response.ok) {
      console.log("[EmailJS] Admin order alert dispatched successfully.");
      return { success: true };
    } else {
      const errText = await response.text();
      console.error("[EmailJS] Admin Email error response:", errText);
      return { success: false, error: errText };
    }
  } catch (error) {
    console.error("[EmailJS] Exception sending admin email:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Main Combined Email Dispatcher
 * Calls both customer and admin email senders safely.
 */
export const sendOrderEmails = async (orderData) => {
  console.log("[EmailJS] Initiating order email dispatches for Order #" + (orderData.id || orderData.orderId));
  const results = await Promise.allSettled([
    sendOrderConfirmationToUser(orderData),
    sendOrderNotificationToAdmin(orderData),
  ]);
  return results;
};
