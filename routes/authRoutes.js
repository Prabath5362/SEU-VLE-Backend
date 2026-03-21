import express from 'express';
import {
  registerUser,
  loginUser,
  googleLogin,
  logoutUser,
  refreshToken,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.post('/logout', logoutUser);
router.post('/refresh', refreshToken);

export default router;
