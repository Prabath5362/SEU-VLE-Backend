import express from 'express';
import {
  getNotifications,
  createNotification,
  updateNotification,
  deleteNotification,
  markNotificationsAsRead,
  clearNotificationForUser,
} from '../controllers/notificationController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getNotifications)
  .post(protect, admin, createNotification);

router.route('/read')
  .post(protect, markNotificationsAsRead);

router.route('/:id/clear')
  .post(protect, clearNotificationForUser);

router.route('/:id')
  .put(protect, admin, updateNotification)
  .delete(protect, admin, deleteNotification);

export default router;
