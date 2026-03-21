import Year from '../models/Year.js';

// @desc    Get years by department
// @route   GET /api/years/:departmentId
// @access  Private
export const getYears = async (req, res) => {
  const years = await Year.find({ departmentId: req.params.departmentId }).sort({ yearNumber: 1 });
  res.json(years);
};

// @desc    Create a year
// @route   POST /api/years
// @access  Private/Admin
export const createYear = async (req, res) => {
  const { yearNumber, departmentId } = req.body;

  const yearExists = await Year.findOne({ yearNumber, departmentId });
  if (yearExists) {
    return res.status(400).json({ message: 'Year already exists in this department' });
  }

  const year = await Year.create({ yearNumber, departmentId });
  res.status(201).json(year);
};

// @desc    Delete a year
// @route   DELETE /api/years/:id
// @access  Private/Admin
export const deleteYear = async (req, res) => {
  const year = await Year.findById(req.params.id);

  if (year) {
    await Year.deleteOne({ _id: year._id });
    res.json({ message: 'Year removed' });
  } else {
    res.status(404).json({ message: 'Year not found' });
  }
};
