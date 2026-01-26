import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '../context/ToastContext.jsx';
import axios from 'axios';
import API_BASE from '../config/api.js';

const RatingModal = ({ isOpen, onClose, job, onRatingSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const reset = () => {
    setRating(0);
    setHoverRating(0);
    setComment('');
  };

  const handleClose = useCallback(() => {
    reset();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      toast.error('Please select a rating (1-5 stars)');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_BASE}/jobs/${job._id}/rating`,
        { rating, ratingComment: comment.trim() || null },
        { headers: { 'x-auth-token': token } }
      );
      toast.success('Rating submitted successfully!');
      if (onRatingSubmitted) onRatingSubmitted();
      handleClose();
    } catch (err) {
      toast.error(err?.response?.data?.msg || 'Failed to submit rating');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="hire-modal-overlay"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="rating-modal-title"
    >
      <div className="hire-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="hire-modal-header">
          <h2 id="rating-modal-title" className="hire-modal-title">
            Rate this work
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="hire-modal-close"
            aria-label="Close"
            disabled={loading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="hire-modal-body">
          <div>
            <label className="hire-modal-label mb-3 block">
              How would you rate this work? <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-2 justify-center py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-4xl focus:outline-none transition-transform hover:scale-110"
                  disabled={loading}
                >
                  <span
                    className={
                      star <= (hoverRating || rating)
                        ? 'text-amber-400'
                        : 'text-stone-300'
                    }
                  >
                    ★
                  </span>
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center text-sm text-stone-600 mt-2">
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent'}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="rating-comment" className="hire-modal-label">
              Comment (optional)
            </label>
            <textarea
              id="rating-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              rows={3}
              className="input-field resize-none"
              disabled={loading}
            />
          </div>

          <div className="hire-modal-actions">
            <button type="button" onClick={handleClose} className="btn-secondary" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading || rating === 0}>
              {loading ? 'Submitting…' : 'Submit rating'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RatingModal;
