import Worker from '../models/Worker.js';
import User from '../models/User.js';
import Job from '../models/Job.js';

export const getWorkerMe = async (req, res) => {
  try {
    const worker = await Worker.findOne({ user: req.user.id }).populate('user', ['name', 'area', 'contactNumber', 'profilePhoto']);
    if (!worker) {
      return res.status(404).json({ msg: 'Worker profile not found for this user' });
    }
    res.json(worker);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export const getWorkers = async (req, res) => {
  const { area } = req.query;
  try {
    const query = {};
    if (area) {
      const usersInArea = await User.find({ area: new RegExp(area, 'i') }).select('_id');
      const userIds = usersInArea.map(user => user._id);
      query.user = { $in: userIds };
    }
    
    // Find all workers
    const allWorkers = await Worker.find(query).populate('user', ['name', 'area', 'contactNumber', 'profilePhoto']);
    
    // Find workers with active jobs (Pending or Accepted)
    const activeJobs = await Job.find({
      status: { $in: ['Pending', 'Accepted'] }
    }).select('worker');
    
    const busyWorkerIds = [...new Set(activeJobs.map(job => job.worker.toString()))];
    
    // Filter out workers with active jobs
    const availableWorkers = allWorkers.filter(worker => 
      !busyWorkerIds.includes(worker._id.toString())
    );
    
    res.json(availableWorkers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export const getWorkerById = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id).populate('user', ['name', 'area', 'contactNumber', 'profilePhoto']);
    if (!worker) {
      return res.status(404).json({ msg: 'Worker not found' });
    }
    res.json(worker);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Worker not found' });
    }
    res.status(500).send('Server error');
  }
};

export const createWorkerProfile = async (req, res) => {
  const { workTiming, charges, category } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'Worker') {
      return res.status(401).json({ msg: 'User is not a worker' });
    }

    let worker = await Worker.findOne({ user: req.user.id });

    if (worker) {
      // Update
      worker.workTiming = workTiming || worker.workTiming;
      worker.charges = charges || worker.charges;
      worker.category = category || worker.category;
    } else {
      // Create
      worker = new Worker({
        user: req.user.id,
        workTiming,
        charges,
        category,
      });
    }

    await worker.save();
    res.json(worker);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export const updateWorkerProfile = async (req, res) => {
  const { workTiming, charges, category, isAvailable } = req.body;

  try {
    let worker = await Worker.findById(req.params.id);

    if (!worker) {
      return res.status(404).json({ msg: 'Worker not found' });
    }

    // Check if the user owns the worker profile
    if (worker.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    worker.workTiming = workTiming || worker.workTiming;
    worker.charges = charges || worker.charges;
    worker.category = category || worker.category;
    if (isAvailable !== undefined) {
      worker.isAvailable = isAvailable;
    }

    await worker.save();
    res.json(worker);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
