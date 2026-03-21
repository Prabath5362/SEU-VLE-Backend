import express from 'express';
import {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
} from '../controllers/resourceController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// ⚠️ Order matters: specific routes before dynamic ones to avoid conflicts

// Single item fetch — must be before /:type/:subjectId
router.get('/:type/single/:id', protect, getResourceById);

// All resources for a subject
router.get('/:type/:subjectId', protect, getResources);

// Create
router.post('/:type', protect, admin, createResource);

// Update / Delete
router.put('/:type/:id', protect, admin, updateResource);
router.delete('/:type/:id', protect, admin, deleteResource);

export default router;
