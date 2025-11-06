import express from 'express';
import { getUserDashboardData } from '../../controllers/user/dashboardController.js';
import { protect } from '../../middleware/auth.js';

const router = express.Router();
router.get('/', protect, getUserDashboardData);
export default router;