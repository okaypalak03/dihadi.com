import express from 'express';
import {
  getUserById,
  updateUserProfile,
} from '../controllers/userController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET api/users/:id
// @desc    Get user by ID
// @access  Public
router.get('/:id', getUserById);

// @route   PUT api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, updateUserProfile);

export default router;
