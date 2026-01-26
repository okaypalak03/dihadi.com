import React, { useState, useEffect, useCallback } from 'react';

const HireModal = ({ isOpen, onClose, workerName, onSubmit, loading }) => {
  const [description, setDescription] = useState('');
  const [requiredTime, setRequiredTime] = useState('');
  const [workDate, setWorkDate] = useState('');
  const [workTimeFrom, setWorkTimeFrom] = useState('');
  const [workTimeTo, setWorkTimeTo] = useState('');
  const [message, setMessage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const reset = () => {
    setDescription('');
    setRequiredTime('');
    setWorkDate('');
    setWorkTimeFrom('');
    setWorkTimeTo('');
    setMessage(null);
    setIsSuccess(false);
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
    setMessage(null);
    if (!description.trim() || !requiredTime.trim()) {
      setMessage({ type: 'error', text: 'Please fill in both work description and required time.' });
      return;
    }
    if (!workDate || !workTimeFrom.trim() || !workTimeTo.trim()) {
      setMessage({ type: 'error', text: 'Work date, time from, and time to are required.' });
      return;
    }
    if (workTimeFrom >= workTimeTo) {
      setMessage({ type: 'error', text: 'Time "to" must be after time "from".' });
      return;
    }
    try {
      await onSubmit({
        description: description.trim(),
        requiredTime: requiredTime.trim(),
        workDate: workDate,
        workTimeFrom: workTimeFrom.trim(),
        workTimeTo: workTimeTo.trim(),
      });
      setIsSuccess(true);
      setMessage({ type: 'success', text: 'Hiring request sent! The worker will respond shortly.' });
      setDescription('');
      setRequiredTime('');
      setWorkDate('');
      setWorkTimeFrom('');
      setWorkTimeTo('');
      setTimeout(handleClose, 1500);
    } catch (err) {
      const errorMsg = err?.response?.data?.msg || 'Failed to send request. Make sure you're logged in as a user.';
      if (err?.response?.status === 409) {
        // Conflict - worker is busy
        const conflict = err?.response?.data?.conflict;
        let conflictText = errorMsg;
        if (conflict) {
          const conflictDate = new Date(conflict.date).toLocaleDateString('en-IN');
          conflictText = `Worker is busy on ${conflictDate} from ${conflict.timeFrom} to ${conflict.timeTo}. Please choose a different date or time.`;
        }
        setMessage({ type: 'error', text: conflictText });
      } else {
        setMessage({ type: 'error', text: errorMsg });
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="hire-modal-overlay"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="hire-modal-title"
    >
      <div
        className="hire-modal-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="hire-modal-header">
          <h2 id="hire-modal-title" className="hire-modal-title">
            Hire {workerName || 'worker'}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="hire-modal-close"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="hire-modal-body">
          <div>
            <label htmlFor="hire-desc" className="hire-modal-label">
              Describe the work
            </label>
            <textarea
              id="hire-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Fix leaking tap in kitchen, paint bedroom walls"
              rows={3}
              className="input-field resize-none"
              disabled={loading || isSuccess}
            />
          </div>
          <div>
            <label htmlFor="hire-time" className="hire-modal-label">
              Required time
            </label>
            <input
              id="hire-time"
              type="text"
              value={requiredTime}
              onChange={(e) => setRequiredTime(e.target.value)}
              placeholder="e.g. 2 hours, 1 day, 2h 30m"
              className="input-field"
              disabled={loading || isSuccess}
            />
          </div>
          <div>
            <label htmlFor="hire-date" className="hire-modal-label">
              Work date <span className="text-rose-500">*</span>
            </label>
            <input
              id="hire-date"
              type="date"
              value={workDate}
              onChange={(e) => setWorkDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="input-field"
              required
              disabled={loading || isSuccess}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="hire-time-from" className="hire-modal-label">
                Time from <span className="text-rose-500">*</span>
              </label>
              <input
                id="hire-time-from"
                type="time"
                value={workTimeFrom}
                onChange={(e) => setWorkTimeFrom(e.target.value)}
                className="input-field"
                required
                disabled={loading || isSuccess}
              />
            </div>
            <div>
              <label htmlFor="hire-time-to" className="hire-modal-label">
                Time to <span className="text-rose-500">*</span>
              </label>
              <input
                id="hire-time-to"
                type="time"
                value={workTimeTo}
                onChange={(e) => setWorkTimeTo(e.target.value)}
                className="input-field"
                required
                disabled={loading || isSuccess}
              />
            </div>
          </div>

          {message && (
            <div
              className={
                message.type === 'success'
                  ? 'hire-modal-msg hire-modal-msg-success'
                  : 'hire-modal-msg hire-modal-msg-error'
              }
              role="alert"
            >
              {message.text}
            </div>
          )}

          <div className="hire-modal-actions">
            <button type="button" onClick={handleClose} className="btn-secondary" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading || isSuccess}>
              {loading ? 'Sending…' : isSuccess ? 'Sent!' : 'Send request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HireModal;
