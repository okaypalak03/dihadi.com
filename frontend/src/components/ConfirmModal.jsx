import React, { useState, useEffect, useCallback } from 'react';

const ConfirmModal = ({
  isOpen,
  onClose,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleClose = useCallback(() => {
    setError(null);
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

  const handleConfirm = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onConfirm();
      handleClose();
    } catch (err) {
      setError(err?.response?.data?.msg || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const confirmClass =
    variant === 'danger'
      ? 'bg-rose-500 hover:bg-rose-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-60'
      : 'btn-primary';

  return (
    <div
      className="confirm-modal-overlay"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div className="confirm-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-modal-header">
          <h2 id="confirm-modal-title" className="confirm-modal-title">
            {title}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="confirm-modal-close"
            aria-label="Close"
            disabled={loading}
          >
            ×
          </button>
        </div>
        <div className="confirm-modal-body">
          <p className="text-stone-600">{message}</p>
          {error && (
            <div className="confirm-modal-msg confirm-modal-msg-error" role="alert">
              {error}
            </div>
          )}
          <div className="confirm-modal-actions">
            <button
              type="button"
              onClick={handleClose}
              className="btn-secondary"
              disabled={loading}
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className={confirmClass}
              disabled={loading}
            >
              {loading ? 'Please wait…' : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
