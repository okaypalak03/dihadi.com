import express from 'express';
const router = express.Router();
import {
  createJob,
  getJobById,
  updateJobStatus,
  getUserJobs,
  getWorkerJobs,
} from '../controllers/jobController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/', protect, createJob);
router.get('/myjobs', protect, getUserJobs);
router.get('/work', protect, getWorkerJobs);
router.get('/:id', protect, getJobById);
router.put('/:id/status', protect, updateJobStatus);

export default router;
