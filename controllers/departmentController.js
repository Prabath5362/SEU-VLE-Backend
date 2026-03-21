import Department from '../models/Department.js';

// @desc    Get all departments
// @route   GET /api/departments
// @access  Private
export const getDepartments = async (req, res) => {
  const departments = await Department.find({}).sort({ name: 1 });
  res.json(departments);
};

// @desc    Create a department
// @route   POST /api/departments
// @access  Private/Admin
export const createDepartment = async (req, res) => {
  const { name } = req.body;

  const exists = await Department.findOne({ name });
  if (exists) {
    return res.status(400).json({ message: 'Department already exists' });
  }

  const department = await Department.create({ name });
  res.status(201).json(department);
};

// @desc    Delete a department
// @route   DELETE /api/departments/:id
// @access  Private/Admin
export const deleteDepartment = async (req, res) => {
  const department = await Department.findById(req.params.id);

  if (department) {
    await Department.deleteOne({ _id: department._id });
    res.json({ message: 'Department removed' });
  } else {
    res.status(404).json({ message: 'Department not found' });
  }
};
