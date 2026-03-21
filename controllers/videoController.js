import VideoLesson from '../models/VideoLesson.js';
import Subject from '../models/Subject.js';

// @desc    Get videos for a subject
// @route   GET /api/videos/:subjectId
// @access  Private
export const getVideos = async (req, res) => {
  const videos = await VideoLesson.find({ subjectId: req.params.subjectId }).sort({ order: 1 });
  res.json(videos);
};

// @desc    Get a single video by ID
// @route   GET /api/videos/single/:id
// @access  Private
export const getVideoById = async (req, res) => {
  const video = await VideoLesson.findById(req.params.id);
  if (video) {
    res.json(video);
  } else {
    res.status(404).json({ message: 'Video not found' });
  }
};

// @desc    Create a video lesson
// @route   POST /api/videos
// @access  Private/Admin
export const createVideo = async (req, res) => {
  const { title, description, youtubeVideoId, subjectId, duration, category } = req.body;

  const subjectExists = await Subject.findById(subjectId);
  if (!subjectExists) {
    return res.status(404).json({ message: 'Subject not found' });
  }

  // Determine order
  const lastVideo = await VideoLesson.findOne({ subjectId }).sort({ order: -1 });
  const order = lastVideo ? lastVideo.order + 1 : 1;

  const video = await VideoLesson.create({
    title,
    description,
    youtubeVideoId,
    subjectId,
    duration,
    category: category || 'lecture_note',
    order,
  });

  res.status(201).json(video);
};

// @desc    Edit a video
// @route   PUT /api/videos/:id
// @access  Private/Admin
export const updateVideo = async (req, res) => {
  const { title, description, youtubeVideoId, duration, category } = req.body;

  const video = await VideoLesson.findById(req.params.id);

  if (video) {
    video.title = title || video.title;
    video.description = description || video.description;
    video.youtubeVideoId = youtubeVideoId || video.youtubeVideoId;
    video.duration = duration || video.duration;
    if (category) video.category = category;

    const updatedVideo = await video.save();
    res.json(updatedVideo);
  } else {
    res.status(404).json({ message: 'Video not found' });
  }
};

// @desc    Reorder videos
// @route   PUT /api/videos/reorder
// @access  Private/Admin
export const reorderVideos = async (req, res) => {
  const { items } = req.body; // Array of { id, order }
  
  try {
    for (const item of items) {
      await VideoLesson.findByIdAndUpdate(item.id, { order: item.order });
    }
    res.json({ message: 'Videos reordered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reorder' });
  }
};

// @desc    Delete a video
// @route   DELETE /api/videos/:id
// @access  Private/Admin
export const deleteVideo = async (req, res) => {
  const video = await VideoLesson.findById(req.params.id);

  if (video) {
    await VideoLesson.deleteOne({ _id: video._id });
    res.json({ message: 'Video removed' });
  } else {
    res.status(404).json({ message: 'Video not found' });
  }
};
