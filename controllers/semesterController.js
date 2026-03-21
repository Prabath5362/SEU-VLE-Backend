import Semester from '../models/Semester.js';

// @desc    Get semesters for a year
// @route   GET /api/semesters/:yearId
// @access  Private
export const getSemesters = async (req, res) => {
  const semesters = await Semester.find({ yearId: req.params.yearId }).sort({ semesterNumber: 1 });
  res.json(semesters);
};

// @desc    Create a semester
// @route   POST /api/semesters
// @access  Private/Admin
export const createSemester = async (req, res) => {
  const { semesterNumber, yearId } = req.body;

  const semesterExists = await Semester.findOne({ semesterNumber, yearId });
  if (semesterExists) {
    return res.status(400).json({ message: 'Semester already exists for this year' });
  }

  const semester = await Semester.create({ semesterNumber, yearId });
  res.status(201).json(semester);
};

// @desc    Delete a semester
// @route   DELETE /api/semesters/:id
// @access  Private/Admin
export const deleteSemester = async (req, res) => {
  const semester = await Semester.findById(req.params.id);

  if (semester) {
    await Semester.deleteOne({ _id: semester._id });
    res.json({ message: 'Semester removed' });
  } else {
    res.status(404).json({ message: 'Semester not found' });
  }
};
