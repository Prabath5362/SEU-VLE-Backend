import mongoose from 'mongoose';

const yearSchema = new mongoose.Schema(
  {
    yearNumber: {
      type: Number,
      required: true,
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

yearSchema.index({ yearNumber: 1, departmentId: 1 }, { unique: true });

const Year = mongoose.model('Year', yearSchema);
export default Year;
