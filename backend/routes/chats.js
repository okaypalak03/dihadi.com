import express from 'express';
import {
  getOrCreateChat,
  getChats,
  sendMessage,
} from '../controllers/chatController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET api/chats
// @desc    Get all chats for current user
// @access  Private
router.get('/', auth, getChats);

// @route   GET api/chats/job/:jobId
// @desc    Get or create chat for a job
// @access  Private
router.get('/job/:jobId', auth, getOrCreateChat);

// @route   POST api/chats/:chatId/message
// @desc    Send a message in chat
// @access  Private
router.post('/:chatId/message', auth, sendMessage);

export default router;
