import { Router } from 'express';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  clearNotifications,
} from '../controllers/notificationsController.js';
import { requireAdminAuth } from '../middleware/authMiddleware.js';

const router = Router();

// Admin-protected notification routes
router.use(requireAdminAuth);

router.get('/', getNotifications);
router.patch('/:id/read', markAsRead);
router.post('/read-all', markAllAsRead);
router.delete('/clear', clearNotifications);

export default router;
