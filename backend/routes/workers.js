import express from 'express';
import {
  getWorkers,
  getWorkerById,
  createWorkerProfile,
  updateWorkerProfile,
  getWorkerMe,
} from '../controllers/workerController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET api/workers/me
// @desc    Get current worker's profile
// @access  Private
router.get('/me', auth, getWorkerMe);

// @route   GET api/workers
// @desc    Get all workers
// @access  Public
router.get('/', getWorkers);

// @route   GET api/workers/:id
// @desc    Get worker by ID
// @access  Public
router.get('/:id', getWorkerById);

// @route   POST api/workers
// @desc    Create or update worker profile
// @access  Private
router.post('/', auth, createWorkerProfile);

// @route   PUT api/workers/:id
// @desc    Update worker profile
// @access  Private
router.put('/:id', auth, updateWorkerProfile);

export default router;