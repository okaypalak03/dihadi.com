import User from '../models/User.js';
import Worker from '../models/Worker.js';
import Job from '../models/Job.js';

const getAllUsers = async (req, res) => {
    const users = await User.find({}).select('-password');
    res.json(users);
};

const getAllWorkers = async (req, res) => {
    const workers = await Worker.find({}).populate('user', 'name email');
    res.json(workers);
};

const getAllJobs = async (req, res) => {
    const jobs = await Job.find({}).populate('user', 'name').populate('worker', 'user');
    res.json(jobs);
};

export { getAllUsers, getAllWorkers, getAllJobs };
