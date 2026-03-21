import mongoose from 'mongoose';

const zoomLinkSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    dayAndTime: { type: String, required: true },
    zoomUrl: { type: String, required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    order: { type: Number, default: 0, required: true },
  },
  { timestamps: true }
);

zoomLinkSchema.index({ subjectId: 1, order: 1 });

const ZoomLink = mongoose.model('ZoomLink', zoomLinkSchema);
export default ZoomLink;
