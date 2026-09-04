/**
 * Velouraz Email Notification Service (Nodemailer Edition)
 * Replaces EmailJS with server-side Nodemailer for high delivery reliability.
 */

/**
 * Send 6-Digit Email OTP via Nodemailer API
 */
export const sendOtpViaNodemailer = async (toEmail, otp) => {
  try {
    const response = await fetch("/api/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: toEmail, otp }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log(`[Nodemailer] OTP email dispatched successfully to ${toEmail}`);
      return { success: true, message: data.message, simulated: data.simulated };
    } else {
      console.error("[Nodemailer] OTP Email error response:", data.error);
      return { success: false, error: data.error || "Failed to send OTP email" };
    }
  } catch (error) {
    console.error("[Nodemailer] Exception sending OTP email:", error);
    return { success: false, error: error.message };
  }
};

// Backward-compatibility alias
export const sendOtpViaEmailJS = sendOtpViaNodemailer;

/**
 * Send Order Confirmation & Admin Notification Emails via Nodemailer API
 */
export const sendOrderEmails = async (orderData) => {
  console.log("[Nodemailer] Initiating order email dispatches for Order #" + (orderData.id || orderData.orderId));
  try {
    const response = await fetch("/api/send-order-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("[Nodemailer] Order emails dispatched successfully.");
      return [{ status: "fulfilled", value: { success: true } }];
    } else {
      console.error("[Nodemailer] Order email error response:", data.error);
      return [{ status: "rejected", reason: data.error }];
    }
  } catch (error) {
    console.error("[Nodemailer] Exception sending order emails:", error);
    return [{ status: "rejected", reason: error.message }];
  }
};

export const sendOrderConfirmationToUser = sendOrderEmails;
export const sendOrderNotificationToAdmin = sendOrderEmails;
