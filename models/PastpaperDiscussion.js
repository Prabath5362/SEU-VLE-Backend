import mongoose from 'mongoose';

const pastpaperDiscussionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    duration: { type: String },
    youtubeUrl: { type: String, required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    order: { type: Number, default: 0, required: true },
  },
  { timestamps: true }
);

pastpaperDiscussionSchema.index({ subjectId: 1, order: 1 });

const PastpaperDiscussion = mongoose.model('PastpaperDiscussion', pastpaperDiscussionSchema);
export default PastpaperDiscussion;
