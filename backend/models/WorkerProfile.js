import mongoose from 'mongoose';

const workerProfileSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    area: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
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
  },
  {
    timestamps: true,
  }
);

const WorkerProfile = mongoose.model('WorkerProfile', workerProfileSchema);

export default WorkerProfile;
