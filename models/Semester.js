import mongoose from 'mongoose';

const semesterSchema = new mongoose.Schema(
  {
    semesterNumber: {
      type: Number,
      required: true,
    },
    yearId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Year',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a semester is unique within a year
semesterSchema.index({ semesterNumber: 1, yearId: 1 }, { unique: true });

const Semester = mongoose.model('Semester', semesterSchema);
export default Semester;
