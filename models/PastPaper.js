import mongoose from 'mongoose';

const pastPaperSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    pdfUrl: { type: String, required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    order: { type: Number, default: 0, required: true },
  },
  { timestamps: true }
);

pastPaperSchema.index({ subjectId: 1, order: 1 });

const PastPaper = mongoose.model('PastPaper', pastPaperSchema);
export default PastPaper;