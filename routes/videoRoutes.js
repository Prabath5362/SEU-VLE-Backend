import express from 'express';
import {
  getVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
  reorderVideos,
} from '../controllers/videoController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, admin, createVideo);
router.route('/reorder').put(protect, admin, reorderVideos);
router.route('/single/:id').get(protect, getVideoById);
router.route('/:subjectId').get(protect, getVideos);
router.route('/:id').put(protect, admin, updateVideo).delete(protect, admin, deleteVideo);

export default router;
