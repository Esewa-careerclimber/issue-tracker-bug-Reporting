import express from 'express';
import { listUsers, deactivateUser, listAdmins } from '../../controllers/admin/userController.js';
import { protect, admin } from '../../middleware/auth.js';

const router = express.Router();
router.get('/', protect, admin, listUsers);
router.get('/admins', protect, admin, listAdmins);
router.patch('/:id/deactivate', protect, admin, deactivateUser);
export default router;