import LectureNote from '../models/LectureNote.js';
import KuppiVideo from '../models/KuppiVideo.js';
import PastpaperDiscussion from '../models/PastpaperDiscussion.js';
import ZoomLink from '../models/ZoomLink.js';
import Subject from '../models/Subject.js';
import PastPaper from '../models/PastPaper.js';
import mongoose from 'mongoose';

// Helper: Resolve model by type
const getModel = (type) => {
  switch (type) {
    case 'lecture_note': return LectureNote;
    case 'kuppi_videos': return KuppiVideo;
    case 'pastpaper_discussion': return PastpaperDiscussion;
    case 'zoomlink': return ZoomLink;
    case 'past_paper': return PastPaper;
    default: return null;
  }
};

// ─── READ ────────────────────────────────────────────────────────────────────

// GET /api/resources/:type/:subjectId
export const getResources = async (req, res) => {
  try {
    const Model = getModel(req.params.type);
    if (!Model) return res.status(400).json({ message: 'Invalid resource type' });

    if (req.params.subjectId && !mongoose.Types.ObjectId.isValid(req.params.subjectId)) {
      return res.json([]);
    }

    const items = await Model.find({ subjectId: req.params.subjectId }).sort({ order: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/resources/:type/single/:id
export const getResourceById = async (req, res) => {
  try {
    const Model = getModel(req.params.type);
    if (!Model) return res.status(400).json({ message: 'Invalid resource type' });
    const item = await Model.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Resource not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── CREATE ───────────────────────────────────────────────────────────────────

// POST /api/resources/:type
export const createResource = async (req, res) => {
  try {
    const Model = getModel(req.params.type);
    if (!Model) return res.status(400).json({ message: 'Invalid resource type' });

    const { subjectId } = req.body;
    if (!subjectId) return res.status(400).json({ message: 'subjectId is required' });

    const subjectExists = await Subject.findById(subjectId);
    if (!subjectExists) return res.status(404).json({ message: 'Subject not found' });

    const last = await Model.findOne({ subjectId }).sort({ order: -1 });
    const order = last ? last.order + 1 : 1;

    const item = await Model.create({ ...req.body, order });
    res.status(201).json(item);
  } catch (err) {
    // Send validation errors back cleanly — prevents server crash
    res.status(400).json({ message: err.message });
  }
};

// ─── UPDATE ───────────────────────────────────────────────────────────────────

// PUT /api/resources/:type/:id
export const updateResource = async (req, res) => {
  try {
    const Model = getModel(req.params.type);
    if (!Model) return res.status(400).json({ message: 'Invalid resource type' });

    const item = await Model.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Resource not found' });

    Object.assign(item, req.body);
    const updated = await item.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ─── DELETE ───────────────────────────────────────────────────────────────────

// DELETE /api/resources/:type/:id
export const deleteResource = async (req, res) => {
  try {
    const Model = getModel(req.params.type);
    if (!Model) return res.status(400).json({ message: 'Invalid resource type' });

    const item = await Model.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Resource not found' });

    await item.deleteOne();
    res.json({ message: 'Resource removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
