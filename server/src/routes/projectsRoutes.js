import { Router } from 'express';
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getDashboardOverview,
} from '../controllers/projectsController.js';
import { requireAdminAuth } from '../middleware/authMiddleware.js';

const router = Router();

// All project routes are confidential and require Admin authentication
router.use(requireAdminAuth);

router.get('/overview', getDashboardOverview);
router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.post('/', createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;
