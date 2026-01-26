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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  acceptedAt: {
    type: Date,
    default: null,
  },
  completedAt: {
    type: Date,
    default: null,
  },
  workDate: {
    type: Date,
    required: false,
  },
  workTimeFrom: {
    type: String,
    required: false,
  },
  workTimeTo: {
    type: String,
    required: false,
  },
});

const Job = mongoose.model('Job', JobSchema);

export default Job;