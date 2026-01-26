import express from 'express';
import {
  createJob,
  getJobs,
  getJobById,
  updateJobStatus,
  deleteJob,
  submitRating,
} from '../controllers/jobController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   POST api/jobs
// @desc    Create a new job
// @access  Private
router.post('/', auth, createJob);

// @route   GET api/jobs
// @desc    Get all jobs for a user or worker
// @access  Private
router.get('/', auth, getJobs);

// @route   GET api/jobs/:id
// @desc    Get job by ID
// @access  Private
router.get('/:id', auth, getJobById);

// @route   PUT api/jobs/:id
// @desc    Update job status
// @access  Private
router.put('/:id', auth, updateJobStatus);

// @route   DELETE api/jobs/:id
// @desc    Delete / remove job (cancel request)
// @access  Private (user who created or worker assigned)
router.delete('/:id', auth, deleteJob);

// @route   POST api/jobs/:id/rating
// @desc    Submit rating for completed job
// @access  Private (user who created the job)
router.post('/:id/rating', auth, submitRating);

export default router;
