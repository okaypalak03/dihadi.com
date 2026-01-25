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
});

const Worker = mongoose.model('Worker', WorkerSchema);

export default Worker;
