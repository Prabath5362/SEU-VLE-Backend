import express from 'express';
import {
  getProgress,
  updateProgress,
  getAllProgress,
} from '../controllers/progressController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getAllProgress);
router.route('/:videoId').get(protect, getProgress).put(protect, updateProgress);

export default router;
