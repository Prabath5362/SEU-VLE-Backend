import express from 'express';
import { getDepartments, createDepartment, deleteDepartment } from '../controllers/departmentController.js';
import { getYears, createYear, deleteYear } from '../controllers/yearController.js';
import { getSemesters, createSemester, deleteSemester } from '../controllers/semesterController.js';
import { getSubjects, createSubject, deleteSubject, updateSubject } from '../controllers/subjectController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Department Routes
router.route('/departments').get(protect, getDepartments).post(protect, admin, createDepartment);
router.route('/departments/:id').delete(protect, admin, deleteDepartment);

// Year Routes
router.route('/years').post(protect, admin, createYear);
router.route('/years/:departmentId').get(protect, getYears);
router.route('/year-del/:id').delete(protect, admin, deleteYear);

// Semester Routes
router.route('/semesters').post(protect, admin, createSemester);
router.route('/semesters/:yearId').get(protect, getSemesters);
router.route('/semesters/:id').delete(protect, admin, deleteSemester);

// Subject Routes
router.route('/subjects').post(protect, admin, createSubject);
router.route('/subjects/:semesterId').get(protect, getSubjects);
router.route('/subjects/:id')
  .delete(protect, admin, deleteSubject)
  .put(protect, admin, updateSubject);

export default router;
