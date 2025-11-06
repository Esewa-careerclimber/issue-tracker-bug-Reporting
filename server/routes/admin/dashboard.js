import express from 'express';
import { getDashboardData } from '../../controllers/admin/dashboardController.js';
import { protect, admin } from '../../middleware/auth.js';

const router = express.Router();
router.get('/', protect, admin, getDashboardData);
export default router;