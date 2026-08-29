import { Router } from 'express';
import {
  getPublicReviews,
  submitReview,
  getAllReviews,
  updateReviewStatus,
  updateReview,
  deleteReview,
} from '../controllers/reviewsController.js';
import { requireAdminAuth } from '../middleware/authMiddleware.js';
import { reviewSubmitLimiter } from '../middleware/rateLimiters.js';

const router = Router();

// Public routes
router.get('/public', getPublicReviews);
router.post('/submit', reviewSubmitLimiter, submitReview);

// Admin moderation routes
router.get('/', requireAdminAuth, getAllReviews);
router.patch('/:id/status', requireAdminAuth, updateReviewStatus);
router.put('/:id', requireAdminAuth, updateReview);
router.delete('/:id', requireAdminAuth, deleteReview);

export default router;
