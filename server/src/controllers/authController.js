import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import db from '../db/database.js';
import { config } from '../config/env.js';
import { sendOtpEmail } from '../services/emailService.js';

function hashOtp(otp) {
  return crypto.createHash('sha256').update(otp).digest('hex');
}

export async function requestOtp(req, res) {
  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // For single-admin security: ensure it matches configured ADMIN_EMAIL (or accept in dev mode)
    if (normalizedEmail !== config.adminEmail.toLowerCase()) {
      return res.status(403).json({
        error: 'Unauthorized email. Only the administrator account can sign in to this portal.',
      });
    }

    // Generate secure 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes from now
    const otpHash = hashOtp(otp);

    // Save hashed OTP (never store raw code)
    db.prepare('INSERT INTO auth_otps (email, otp, expires_at, used) VALUES (?, ?, ?, 0)').run(
      normalizedEmail,
      otpHash,
      expiresAt
    );

    // Send email / log
    await sendOtpEmail(normalizedEmail, otp);

    // In development or demo mode, also return devOtp in response for easy testing
    const isDev = config.nodeEnv === 'development';
    return res.json({
      success: true,
      message: `A 6-digit verification code has been sent to ${normalizedEmail}`,
      devOtp: isDev ? otp : undefined,
    });
  } catch (error) {
    console.error('Request OTP error:', error);
    return res.status(500).json({ error: 'Failed to generate security code. Please try again.' });
  }
}

export async function verifyOtp(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and verification code are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const cleanOtp = otp.toString().trim();
    const otpHash = hashOtp(cleanOtp);

    // Find the latest valid OTP for this email (compare hashes)
    const record = db.prepare(`
      SELECT * FROM auth_otps 
      WHERE email = ? AND otp = ? AND used = 0 
      ORDER BY id DESC LIMIT 1
    `).get(normalizedEmail, otpHash);

    if (!record) {
      return res.status(400).json({ error: 'Invalid or expired verification code.' });
    }

    if (Date.now() > record.expires_at) {
      return res.status(400).json({ error: 'Verification code has expired. Please request a new one.' });
    }

    // Mark as used
    db.prepare('UPDATE auth_otps SET used = 1 WHERE id = ?').run(record.id);

    // Generate JWT token (valid for 7 days)
    const token = jwt.sign(
      { email: normalizedEmail, role: 'admin' },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      token,
      admin: {
        email: normalizedEmail,
        role: 'admin',
        name: 'Developer Admin',
      },
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return res.status(500).json({ error: 'Verification failed. Please try again.' });
  }
}

export async function getMe(req, res) {
  return res.json({
    admin: {
      email: req.admin.email,
      role: req.admin.role,
      name: 'Digitway Admin',
    },
  });
}
