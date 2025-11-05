import express from 'express';
import { getTicketStats } from '../../controllers/admin/analyticsController.js';
import { protect, admin } from '../../middleware/auth.js';

const router = express.Router();
router.get('/tickets', protect, admin, getTicketStats);
export default router;