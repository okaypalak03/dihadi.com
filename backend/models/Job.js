import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker',
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  requiredTime: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Completed', 'Rejected'],
    default: 'Pending',
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid'],
    default: 'Pending',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Job = mongoose.model('Job', JobSchema);

export default Job;