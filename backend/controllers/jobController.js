import Job from '../models/Job.js';
import User from '../models/User.js';
import Worker from '../models/Worker.js';

export const createJob = async (req, res) => {
  const { workerId, description, requiredTime, workDate, workTimeFrom, workTimeTo } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'User') {
      return res.status(401).json({ msg: 'Only users can create jobs' });
    }

    const newJob = new Job({
      user: req.user.id,
      worker: workerId,
      description,
      requiredTime,
      workDate: workDate ? new Date(workDate) : null,
      workTimeFrom: workTimeFrom || null,
      workTimeTo: workTimeTo || null,
    });

    const job = await newJob.save();
    res.json(job);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export const getJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    let jobs;
    if (user.role === 'User') {
      jobs = await Job.find({ user: req.user.id }).populate({ 
        path: 'worker', 
        populate: { path: 'user', select: 'name' } 
      });
    } else if (user.role === 'Worker') {
      const worker = await Worker.findOne({ user: req.user.id });
      jobs = await Job.find({ worker: worker._id }).populate('user', 'name email');
    } else { // Admin
      jobs = await Job.find().populate('user', 'name').populate({
        path: 'worker',
        populate: { path: 'user', select: 'name' }
      });
    }
    res.json(jobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('user', ['name', 'email'])
      .populate({ 
        path: 'worker', 
        populate: { path: 'user', select: 'name' } 
      });

    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }
    res.json(job);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Job not found' });
    }
    res.status(500).send('Server error');
  }
};

export const updateJobStatus = async (req, res) => {
  const { status } = req.body;

  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    const user = await User.findById(req.user.id);

    // Only worker can accept/reject/complete
    if (user.role === 'Worker') {
        const worker = await Worker.findOne({ user: req.user.id });
        if(job.worker.toString() !== worker._id.toString()){
            return res.status(401).json({ msg: 'Not authorized' });
        }
    } else if (user.role === 'User') {
        // User cannot change status, only the worker can
        return res.status(401).json({ msg: 'Not authorized' });
    }


    const oldStatus = job.status;
    job.status = status || job.status;

    // Set timestamps based on status changes
    if (status === 'Accepted' && oldStatus !== 'Accepted') {
      job.acceptedAt = new Date();
    }
    if (status === 'Completed' && oldStatus !== 'Completed') {
      job.completedAt = new Date();
      job.paymentStatus = 'Paid';
    }
    if (status === 'Rejected' && oldStatus === 'Accepted') {
      // If worker rejects after accepting, clear acceptedAt
      job.acceptedAt = null;
    }

    await job.save();
    
    // a fresh job object to send back
    const updatedJob = await Job.findById(req.params.id)
        .populate('user', 'name email')
        .populate({
            path: 'worker',
            populate: { path: 'user', select: 'name' }
        });

    res.json(updatedJob);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    const user = await User.findById(req.user.id);
    const worker = user.role === 'Worker' ? await Worker.findOne({ user: req.user.id }) : null;

    const isCreator = job.user.toString() === req.user.id;
    const isAssignedWorker = worker && job.worker.toString() === worker._id.toString();

    if (!isCreator && !isAssignedWorker) {
      return res.status(401).json({ msg: 'Not authorized to remove this job' });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Job removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Job not found' });
    }
    res.status(500).send('Server error');
  }
};
