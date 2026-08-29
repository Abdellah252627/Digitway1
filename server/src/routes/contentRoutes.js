import { Router } from 'express';
import { getPublicContent, updateContent, testTelegram } from '../controllers/contentController.js';
import { requireAdminAuth } from '../middleware/authMiddleware.js';

const router = Router();

// Public route to fetch dynamic site copy & prices
router.get('/', getPublicContent);

// Admin-protected update & test routes
router.put('/', requireAdminAuth, updateContent);
router.post('/test-telegram', requireAdminAuth, testTelegram);

export default router;
