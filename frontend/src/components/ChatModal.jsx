import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext.jsx';
import API_BASE from '../config/api.js';
import { formatDateTime } from '../utils/inputFormatters.js';

const ChatModal = ({ isOpen, onClose, job, currentUser }) => {
  const [chat, setChat] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const toast = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChat = useCallback(async () => {
    if (!job?._id) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API_BASE}/chats/job/${job._id}`, {
        headers: { 'x-auth-token': token },
      });
      setChat(data);
    } catch (error) {
      console.error('Error fetching chat:', error);
      toast.error('Failed to load chat');
    } finally {
      setLoading(false);
    }
  }, [job?._id, toast]);

  useEffect(() => {
    if (isOpen && job?._id) {
      fetchChat();
      // Poll for new messages every 3 seconds
      const interval = setInterval(fetchChat, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen, job?._id, fetchChat]);

  useEffect(() => {
    if (chat) {
      scrollToBottom();
    }
  }, [chat]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || !chat?._id) return;

    setSending(true);
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        `${API_BASE}/chats/${chat._id}/message`,
        { message: message.trim() },
        { headers: { 'x-auth-token': token } }
      );
      setChat(data);
      setMessage('');
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleClose = useCallback(() => {
    setChat(null);
    setMessage('');
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const onEscape = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const otherUser = currentUser?.role === 'User'
    ? chat?.worker?.user
    : chat?.user;

  return (
    <div
      className="hire-modal-overlay"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="chat-modal-title"
    >
      <div className="chat-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="chat-modal-header">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-bold">
              {otherUser?.profilePhoto ? (
                <img src={otherUser.profilePhoto} alt={otherUser.name} className="w-full h-full object-cover" />
              ) : (
                <span>{otherUser?.name?.charAt(0).toUpperCase() || '?'}</span>
              )}
            </div>
            <div>
              <h2 id="chat-modal-title" className="chat-modal-title">
                Chat with {otherUser?.name || 'User'}
              </h2>
              {job?.workDate && (
                <p className="text-xs text-stone-500">
                  Job: {new Date(job.workDate).toLocaleDateString('en-IN')}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="hire-modal-close"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="chat-modal-body">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-stone-500">Loading chat...</p>
            </div>
          ) : chat?.messages?.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-stone-500 text-center">
                No messages yet. Start the conversation!
              </p>
            </div>
          ) : (
            <div className="chat-messages">
              {chat?.messages?.map((msg, idx) => {
                const isCurrentUser = (currentUser?.role === 'User' && msg.sender === 'user') ||
                  (currentUser?.role === 'Worker' && msg.sender === 'worker');
                return (
                  <div
                    key={idx}
                    className={`chat-message ${isCurrentUser ? 'chat-message-sent' : 'chat-message-received'}`}
                  >
                    <div className="chat-message-bubble">
                      <p className="chat-message-text">{msg.message}</p>
                      <span className="chat-message-time">
                        {formatDateTime(msg.timestamp)}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}

          <form onSubmit={handleSend} className="chat-input-form">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="chat-input"
              disabled={loading || sending || !chat}
            />
            <button
              type="submit"
              className="chat-send-btn"
              disabled={loading || sending || !message.trim() || !chat}
            >
              {sending ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
