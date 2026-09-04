import nodemailer from "nodemailer";

/**
 * Reusable Nodemailer Transporter
 * Configured via environment variables (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS)
 */
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE === "true" || process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
});

/**
 * Verify SMTP connection settings (optional log helper)
 */
export const verifySmtpConnection = async () => {
  try {
    await transporter.verify();
    console.log("[Nodemailer] SMTP Server connection established successfully.");
    return true;
  } catch (error) {
    console.warn("[Nodemailer] SMTP Connection Warning:", error.message);
    return false;
  }
};
