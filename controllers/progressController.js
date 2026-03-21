import Progress from '../models/Progress.js';

// @desc    Get user progress for a specific video
// @route   GET /api/progress/:videoId
// @access  Private
export const getProgress = async (req, res) => {
  const progress = await Progress.findOne({
    userId: req.user._id,
    videoId: req.params.videoId,
  });

  if (progress) {
    res.json(progress);
  } else {
    // Return empty progress structure so frontend can handle gracefully
    res.json({
      watched: false,
      progressPercentage: 0,
      lastWatchedTime: 0,
    });
  }
};

// @desc    Update video progress
// @route   PUT /api/progress/:videoId
// @access  Private
export const updateProgress = async (req, res) => {
  const { watched, progressPercentage, lastWatchedTime } = req.body;

  let progress = await Progress.findOne({
    userId: req.user._id,
    videoId: req.params.videoId,
  });

  if (progress) {
    progress.watched = watched !== undefined ? watched : progress.watched;
    progress.progressPercentage =
      progressPercentage !== undefined ? progressPercentage : progress.progressPercentage;
    progress.lastWatchedTime =
      lastWatchedTime !== undefined ? lastWatchedTime : progress.lastWatchedTime;

    if (progress.progressPercentage > 95) {
      progress.watched = true;
    }

    const updatedProgress = await progress.save();
    res.json(updatedProgress);
  } else {
    // Create new progress record
    const newProgress = await Progress.create({
      userId: req.user._id,
      videoId: req.params.videoId,
      watched: watched || false,
      progressPercentage: progressPercentage || 0,
      lastWatchedTime: lastWatchedTime || 0,
    });
    res.status(201).json(newProgress);
  }
};

// @desc    Get user's overall progress (Optional, for dashboard)
// @route   GET /api/progress
// @access  Private
export const getAllProgress = async (req, res) => {
  const progress = await Progress.find({ userId: req.user._id }).populate('videoId');
  res.json(progress);
};
