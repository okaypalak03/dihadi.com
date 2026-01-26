import Chat from '../models/Chat.js';
import Job from '../models/Job.js';
import User from '../models/User.js';
import Worker from '../models/Worker.js';

// Get or create chat for a job
export const getOrCreateChat = async (req, res) => {
  const { jobId } = req.params;

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    const user = await User.findById(req.user.id);
    const worker = await Worker.findById(job.worker);

    // Verify user has access to this chat
    if (user.role === 'User') {
      if (job.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'Not authorized' });
      }
    } else if (user.role === 'Worker') {
      if (!worker || worker.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'Not authorized' });
      }
    } else {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    let chat = await Chat.findOne({ job: jobId })
      .populate('user', 'name profilePhoto')
      .populate('worker', 'user')
      .populate({
        path: 'worker',
        populate: { path: 'user', select: 'name profilePhoto' },
      });

    if (!chat) {
      chat = new Chat({
        job: jobId,
        user: job.user,
        worker: job.worker,
        messages: [],
      });
      await chat.save();
      chat = await Chat.findById(chat._id)
        .populate('user', 'name profilePhoto')
        .populate('worker', 'user')
        .populate({
          path: 'worker',
          populate: { path: 'user', select: 'name profilePhoto' },
        });
    }

    res.json(chat);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all chats for current user
export const getChats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    let chats;

    if (user.role === 'User') {
      chats = await Chat.find({ user: req.user.id })
        .populate('job', 'description status workDate workTimeFrom workTimeTo')
        .populate('worker', 'user')
        .populate({
          path: 'worker',
          populate: { path: 'user', select: 'name profilePhoto' },
        })
        .sort({ updatedAt: -1 });
    } else if (user.role === 'Worker') {
      const worker = await Worker.findOne({ user: req.user.id });
      if (worker) {
        chats = await Chat.find({ worker: worker._id })
          .populate('job', 'description status workDate workTimeFrom workTimeTo')
          .populate('user', 'name profilePhoto')
          .sort({ updatedAt: -1 });
      } else {
        chats = [];
      }
    } else {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    res.json(chats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Send a message
export const sendMessage = async (req, res) => {
  const { chatId } = req.params;
  const { message } = req.body;

  try {
    if (!message || !message.trim()) {
      return res.status(400).json({ msg: 'Message cannot be empty' });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ msg: 'Chat not found' });
    }

    const user = await User.findById(req.user.id);
    const worker = user.role === 'Worker' ? await Worker.findOne({ user: req.user.id }) : null;

    // Determine sender type and verify authorization
    let sender = null;
    if (user.role === 'User' && chat.user.toString() === req.user.id) {
      sender = 'user';
    } else if (user.role === 'Worker' && worker && chat.worker.toString() === worker._id.toString()) {
      sender = 'worker';
    }

    if (!sender) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Add message
    chat.messages.push({
      sender,
      message: message.trim(),
      timestamp: new Date(),
    });

    chat.updatedAt = new Date();
    await chat.save();

    const updatedChat = await Chat.findById(chatId)
      .populate('user', 'name profilePhoto')
      .populate('worker', 'user')
      .populate({
        path: 'worker',
        populate: { path: 'user', select: 'name profilePhoto' },
      });

    res.json(updatedChat);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
