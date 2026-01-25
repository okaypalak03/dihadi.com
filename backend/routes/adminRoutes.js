import express from 'express';
const router = express.Router();
import {
  getAllUsers,
  getAllWorkers,
  getAllJobs,
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.get('/users', protect, admin, getAllUsers);
router.get('/workers', protect, admin, getAllWorkers);
router.get('/jobs', protect, admin, getAllJobs);

export default router;