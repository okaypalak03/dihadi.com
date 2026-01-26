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
  const { area, workDate, workTimeFrom, workTimeTo } = req.query;
  try {
    const query = {};
    if (area) {
      const usersInArea = await User.find({ area: new RegExp(area, 'i') }).select('_id');
      const userIds = usersInArea.map(user => user._id);
      query.user = { $in: userIds };
    }
    
    // Find all workers
    const allWorkers = await Worker.find(query).populate('user', ['name', 'area', 'contactNumber', 'profilePhoto']);
    
    // If date/time filters are provided, check for conflicts with ACCEPTED jobs only
    let busyWorkerIds = new Set();
    
    if (workDate && workTimeFrom && workTimeTo) {
      const workDateObj = new Date(workDate);
      const startOfDay = new Date(workDateObj.setHours(0, 0, 0, 0));
      const endOfDay = new Date(workDateObj.setHours(23, 59, 59, 999));
      
      // Only check ACCEPTED jobs (not Pending - worker hasn't accepted yet)
      // Completed jobs don't block availability
      const conflictingJobs = await Job.find({
        status: 'Accepted', // Only hide if worker has accepted
        workDate: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      });
      
      // Check for time overlap
      for (const job of conflictingJobs) {
        if (job.workTimeFrom && job.workTimeTo) {
          // Check if time ranges overlap
          if (
            (workTimeFrom >= job.workTimeFrom && workTimeFrom < job.workTimeTo) ||
            (workTimeTo > job.workTimeFrom && workTimeTo <= job.workTimeTo) ||
            (workTimeFrom <= job.workTimeFrom && workTimeTo >= job.workTimeTo)
          ) {
            busyWorkerIds.add(job.worker.toString());
          }
        }
      }
    }
    // If no date/time provided, show all workers (no filtering)
    
    // Filter out workers with conflicts (only for the specific date/time)
    const availableWorkers = allWorkers.filter(worker => 
      !busyWorkerIds.has(worker._id.toString())
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
