import User from '../models/User.js';
import { generateAccessToken, generateRefreshToken, setTokenCookies } from '../utils/generateToken.js';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, registrationNumber } = req.body;

    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ message: 'Invalid input format' });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      registrationNumber,
      role: 'student', // default
    });

    if (user) {
      res.status(201).json({
        message: 'Registered successfully. Please wait for admin approval.',
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ message: 'Invalid input format' });
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      if (user.role !== 'admin' && !user.isApproved) {
        return res.status(401).json({ message: 'Your account is pending admin approval.' });
      }

      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);
      setTokenCookies(res, accessToken, refreshToken);

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (typeof token !== 'string') {
      return res.status(400).json({ message: 'Invalid input format' });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const { email, name, sub } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      // First time Google login, need registration number. Usually, we might redirect to a 'complete profile' page.
      // But according to requirements, students must register with Registration Number.
      // So if User doesn't exist, we send a required state for the frontend to ask for Registration Number.
      return res.status(404).json({ message: 'User not found. Please register first with your student registration number.' });
    }

    if (user.role !== 'admin' && !user.isApproved) {
      return res.status(401).json({ message: 'Your account is pending admin approval.' });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    setTokenCookies(res, accessToken, refreshToken);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid Google Token' });
  }
};

export const logoutUser = (req, res) => {
  res.cookie('accessToken', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.cookie('refreshToken', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

export const refreshToken = async (req, res) => {
  try {
    const rt = req.cookies.refreshToken;
    if (!rt) return res.status(401).json({ message: 'Not authorized, no refresh token' });

    jwt.verify(rt, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Invalid refresh token' });

      const user = await User.findById(decoded.id).select('-password');
      if (!user) return res.status(404).json({ message: 'User not found' });

      const newAccessToken = generateAccessToken(user._id);
      
      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000, 
      });

      res.status(200).json({ message: 'Token refreshed successfully' });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
