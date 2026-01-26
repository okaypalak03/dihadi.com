import mongoose from 'mongoose';

const WorkerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  workTiming: {
    type: String,
    required: true,
  },
  charges: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalRatings: {
    type: Number,
    default: 0,
  },
});

const Worker = mongoose.model('Worker', WorkerSchema);

export default Worker;
