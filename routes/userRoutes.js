import express from 'express';
import {
  getUserProfile,
  getStudents,
  deleteUser,
  toggleApproveUser,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/profile').get(protect, getUserProfile);
router.route('/students').get(protect, admin, getStudents);
router.route('/:id').delete(protect, admin, deleteUser);
router.route('/:id/approve').put(protect, admin, toggleApproveUser);

export default router;
