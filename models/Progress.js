import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VideoLesson',
      required: true,
    },
    watched: {
      type: Boolean,
      default: false,
    },
    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    lastWatchedTime: {
      type: Number,
      default: 0, // in seconds from the YouTube player
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a user has only one progress record per video
progressSchema.index({ userId: 1, videoId: 1 }, { unique: true });

const Progress = mongoose.model('Progress', progressSchema);
export default Progress;
