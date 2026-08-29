import { Router } from 'express';
import { requestOtp, verifyOtp, getMe } from '../controllers/authController.js';
import { requireAdminAuth } from '../middleware/authMiddleware.js';
import { otpRequestLimiter, otpVerifyLimiter } from '../middleware/rateLimiters.js';

const router = Router();

router.post('/request-otp', otpRequestLimiter, requestOtp);
router.post('/verify-otp', otpVerifyLimiter, verifyOtp);
router.get('/me', requireAdminAuth, getMe);

export default router;
