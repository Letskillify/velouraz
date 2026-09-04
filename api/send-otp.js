import { transporter } from "./utils/mailer.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (e) {
      // Keep body as string fallback
    }
  }

  const { email, otp } = body || {};
  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP code are required." });
  }

  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  // Fallback check if SMTP is not configured in local environment
  if (!smtpUser || !smtpPass) {
    console.warn(`[DEV MODE] SMTP credentials missing in .env. Generated OTP for ${email}: ${otp}`);
    return res.status(200).json({
      success: true,
      simulated: true,
      message: "Dev Mode: SMTP credentials not set in .env. Code logged to console.",
    });
  }

  const mailOptions = {
    from: process.env.SMTP_FROM || `"Velouraz High Jewellery" <${smtpUser}>`,
    to: email,
    subject: `${otp} is your Velouraz Verification Code`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Velouraz Verification Code</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0d0b0e; color: #ffffff;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="100%" maxWidth="550" cellpadding="0" cellspacing="0" style="max-width: 550px; background-color: #161217; border: 1px solid #2e2633; border-radius: 12px; overflow: hidden; padding: 40px 30px;">
                <tr>
                  <td align="center" style="padding-bottom: 20px;">
                    <h1 style="margin: 0; font-family: Georgia, serif; font-size: 26px; font-weight: normal; letter-spacing: 4px; color: #d4af37;">VELOURAZ</h1>
                    <p style="margin: 5px 0 0 0; font-size: 11px; tracking: 2px; text-transform: uppercase; color: #8a8292;">High Jewellery</p>
                  </td>
                </tr>
                <tr>
                  <td style="border-top: 1px solid #2e2633; padding-top: 25px;">
                    <h2 style="font-size: 18px; font-weight: 500; color: #ffffff; margin-bottom: 12px;">Verification Code</h2>
                    <p style="font-size: 14px; color: #b5adc0; line-height: 1.6; margin: 0 0 24px 0;">
                      Please enter the verification code below to verify your account or confirm your security request on Velouraz.
                    </p>
                    <div style="text-align: center; margin: 30px 0; padding: 20px; background: #1e1921; border-radius: 8px; border: 1px dashed #d4af37;">
                      <span style="font-size: 34px; font-weight: bold; letter-spacing: 8px; color: #d4af37;">${otp}</span>
                    </div>
                    <p style="font-size: 13px; color: #8a8292; line-height: 1.5; margin: 0;">
                      This code is valid for <strong>10 minutes</strong>. For security reasons, please do not share this code with anyone.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="border-top: 1px solid #2e2633; margin-top: 30px; padding-top: 25px;">
                    <p style="font-size: 11px; color: #6b6374; margin: 0;">
                      If you did not request this email, you can safely ignore it.
                    </p>
                    <p style="font-size: 11px; color: #6b6374; margin-top: 8px;">
                      © ${new Date().getFullYear()} Velouraz High Jewellery. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[Nodemailer] OTP dispatched successfully to ${email}`);
    return res.status(200).json({ success: true, message: "Verification code sent." });
  } catch (error) {
    console.error("[Nodemailer] Failed to send OTP:", error);
    return res.status(500).json({ error: error.message || "Failed to send verification email." });
  }
}
