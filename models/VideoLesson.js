import mongoose from 'mongoose';

const videoLessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    youtubeVideoId: {
      type: String,
      required: true,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    duration: {
      type: String, // E.g., '10:45'
    },
    category: {
      type: String,
      enum: ['lecture_note', 'kuppi_videos', 'pastpaper_discussion', 'zoomlink'],
      default: 'lecture_note',
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Optional: ensure order is unique per subject, but maybe admins reorder.
// Let's just create an index for faster queries by subject
videoLessonSchema.index({ subjectId: 1, order: 1 });

const VideoLesson = mongoose.model('VideoLesson', videoLessonSchema);
export default VideoLesson;
