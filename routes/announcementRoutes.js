import express from 'express';
import { getAnnouncements, getLatestAnnouncements, createAnnouncement, deleteAnnouncement } from '../controllers/announcementController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getAnnouncements).post(protect, admin, createAnnouncement);
router.route('/latest').get(protect, getLatestAnnouncements);
router.route('/:id').delete(protect, admin, deleteAnnouncement);

export default router;