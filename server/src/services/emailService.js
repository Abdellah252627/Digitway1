import nodemailer from 'nodemailer';
import { config } from '../config/env.js';

let transporter = null;

if (config.smtp.host && config.smtp.user) {
  transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.port === 465,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass,
    },
  });
}

export async function sendOtpEmail(email, otp) {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🔐 [Digitway Admin Auth] Claude-style OTP Code:`);
  console.log(`👉 Email: ${email}`);
  console.log(`👉 Your Verification Code: [ ${otp} ]`);
  console.log(`👉 Code expires in 10 minutes.`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (!transporter) {
    return { success: true, simulated: true, otp };
  }

  try {
    await transporter.sendMail({
      from: config.smtp.from,
      to: email,
      subject: `Your Digitway Admin Security Code: ${otp}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; background: #F1EFE8; border-radius: 12px; color: #2C2C2A;">
          <h2 style="color: #173404; margin-bottom: 8px;">Digitway Admin Login</h2>
          <p style="color: #62625D; font-size: 15px;">Use the verification code below to access the Digitway administration portal:</p>
          <div style="margin: 24px 0; background: #FFFFFF; border: 2px solid #3B6D11; border-radius: 8px; padding: 18px; text-align: center;">
            <span style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #173404; font-family: monospace;">${otp}</span>
          </div>
          <p style="font-size: 13px; color: #8C8C85;">This code will expire in 10 minutes. If you did not request this code, you can safely ignore this email.</p>
        </div>
      `,
    });
    return { success: true, simulated: false };
  } catch (error) {
    console.error('⚠️ Failed to send SMTP email:', error.message);
    return { success: true, simulated: true, error: error.message };
  }
}
