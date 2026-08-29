import { Router } from 'express';
import {
  submitQuote,
  getAllQuotes,
  updateQuoteStatus,
  deleteQuote,
  convertQuoteToProject,
} from '../controllers/quotesController.js';
import { requireAdminAuth } from '../middleware/authMiddleware.js';
import { quoteSubmitLimiter } from '../middleware/rateLimiters.js';

const router = Router();

// Public route to request a quote
router.post('/', quoteSubmitLimiter, submitQuote);

// Admin-protected routes
router.get('/', requireAdminAuth, getAllQuotes);
router.patch('/:id', requireAdminAuth, updateQuoteStatus);
router.post('/:id/convert', requireAdminAuth, convertQuoteToProject);
router.delete('/:id', requireAdminAuth, deleteQuote);

export default router;
