import mongoose from 'mongoose';

const lectureNoteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    pdfUrl: { type: String, required: true },
    noteType: { type: String, enum: ['this_year', 'previous_year'], default: 'this_year' },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    order: { type: Number, default: 0, required: true },
  },
  { timestamps: true }
);

lectureNoteSchema.index({ subjectId: 1, order: 1 });

const LectureNote = mongoose.model('LectureNote', lectureNoteSchema);
export default LectureNote;
