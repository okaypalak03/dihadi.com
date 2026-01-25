import express from 'express';
const router = express.Router();
import {
  createWorkerProfile,
  getWorkerProfile,
  updateWorkerProfile,
  getWorkersByArea,
} from '../controllers/workerController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/', protect, createWorkerProfile);
router.get('/area/:area', getWorkersByArea);
router.get('/:id', getWorkerProfile);
router.put('/', protect, updateWorkerProfile);

export default router;
