import nodemailer from "nodemailer";

const createTransporterForPort = (port, secure) => {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const user = (process.env.SMTP_USER || "velourazglobal@gmail.com").trim();
  const pass = (process.env.SMTP_PASS || "").trim();

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
  });
};

/**
 * Sends mail with automatic fallback between Port 465 (SSL) and Port 587 (STARTTLS)
 * to handle unexpected socket closures on different ISP/firewall configurations.
 */
export const sendMailWithFallback = async (mailOptions) => {
  const primaryPort = Number(process.env.SMTP_PORT) || 465;
  const primarySecure = process.env.SMTP_SECURE === "true" || (process.env.SMTP_SECURE !== "false" && primaryPort === 465);

  try {
    const primaryTransporter = createTransporterForPort(primaryPort, primarySecure);
    return await primaryTransporter.sendMail(mailOptions);
  } catch (err) {
    console.warn(`[Nodemailer] Primary attempt (port ${primaryPort}, secure=${primarySecure}) failed: ${err.message}. Retrying with fallback configuration...`);

    // Fallback: If port 465 (SSL) failed due to socket close, try port 587 (STARTTLS)
    const fallbackPort = primaryPort === 465 ? 587 : 465;
    const fallbackSecure = fallbackPort === 465;

    const fallbackTransporter = createTransporterForPort(fallbackPort, fallbackSecure);
    return await fallbackTransporter.sendMail(mailOptions);
  }
};

export const transporter = createTransporterForPort(
  Number(process.env.SMTP_PORT) || 465,
  process.env.SMTP_SECURE === "true" || (process.env.SMTP_SECURE !== "false" && (Number(process.env.SMTP_PORT) || 465) === 465)
);
