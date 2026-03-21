import Subject from '../models/Subject.js';

// @desc    Get subjects for a semester
// @route   GET /api/subjects/:semesterId
// @access  Private
export const getSubjects = async (req, res) => {
  const subjects = await Subject.find({ semesterId: req.params.semesterId }).sort({ subjectName: 1 });
  res.json(subjects);
};

// @desc    Create a subject
// @route   POST /api/subjects
// @access  Private/Admin
export const createSubject = async (req, res) => {
  const { subjectName, subjectCode, description, semesterId } = req.body;

  const subjectExists = await Subject.findOne({ subjectCode });
  if (subjectExists) {
    return res.status(400).json({ message: 'Subject code already exists' });
  }

  const subject = await Subject.create({
    subjectName,
    subjectCode,
    description,
    semesterId,
  });
  res.status(201).json(subject);
};

// @desc    Delete a subject
// @route   DELETE /api/subjects/:id
// @access  Private/Admin
export const deleteSubject = async (req, res) => {
  const subject = await Subject.findById(req.params.id);

  if (subject) {
    await Subject.deleteOne({ _id: subject._id });
    res.json({ message: 'Subject removed' });
  } else {
    res.status(404).json({ message: 'Subject not found' });
  }
};
