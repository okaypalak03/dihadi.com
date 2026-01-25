import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['User', 'Worker', 'Admin'],
    default: 'User',
  },
  address: {
    type: String,
  },
  area: {
    type: String,
  },
  contactNumber: {
    type: String,
  },
  profilePhoto: {
    type: String,
    default: null,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', UserSchema);

export default User;