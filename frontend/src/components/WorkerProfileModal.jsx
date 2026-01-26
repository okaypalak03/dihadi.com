import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { handleCurrencyInputChange, handleTimeInputChange } from '../utils/inputFormatters.js';
import API_BASE from '../config/api.js';

const WorkerProfileModal = ({ isOpen, onClose }) => {
  const [profile, setProfile] = useState({
    workTiming: '',
    charges: '',
    category: '',
  });
  const { user } = useContext(AuthContext);
  const toast = useToast();
  const token = () => localStorage.getItem('token');
  const headers = () => ({ 'x-auth-token': token() });

  useEffect(() => {
    if (isOpen) {
      const fetchWorkerProfile = async () => {
        try {
          const { data } = await axios.get(`${API_BASE}/workers/me`, { headers: headers() });
          if (data) {
            setProfile({
              workTiming: data.workTiming || '',
              charges: data.charges || '',
              category: data.category || '',
            });
          }
        } catch (error) {
          console.error('Could not fetch worker profile.');
        }
      };
      fetchWorkerProfile();
    }
  }, [isOpen]);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleChargesChange = (e) => {
    handleCurrencyInputChange(e, (value) => {
      setProfile({ ...profile, charges: value });
    });
  };

  const handleWorkTimingChange = (e) => {
    handleTimeInputChange(e, (value) => {
      setProfile({ ...profile, workTiming: value });
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE}/workers/me`, profile, { headers: headers() });
      toast.success('Worker profile updated successfully!');
      onClose();
    } catch (error) {
      console.error('Error updating worker profile:', error);
      toast.error('Failed to update worker profile.');
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const onEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="hire-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="worker-profile-modal-title"
    >
      <div className="hire-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="hire-modal-header">
          <h2 id="worker-profile-modal-title" className="hire-modal-title">
            Update Worker Profile
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="hire-modal-close"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="hire-modal-body">
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label htmlFor="category" className="input-label">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={profile.category}
                onChange={handleProfileChange}
                className="input-field"
                required
              >
                <option value="">Select category</option>
                <option value="Plumber">Plumber</option>
                <option value="Electrician">Electrician</option>
                <option value="Carpenter">Carpenter</option>
                <option value="Painter">Painter</option>
                <option value="Cleaner">Cleaner</option>
                <option value="Mechanic">Mechanic</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="workTiming" className="input-label">
                Work Timing (e.g., 9:00 AM - 6:00 PM)
              </label>
              <input
                type="text"
                id="workTiming"
                name="workTiming"
                value={profile.workTiming}
                onChange={handleWorkTimingChange}
                className="input-field"
                placeholder="9:00 AM - 6:00 PM"
              />
            </div>

            <div>
              <label htmlFor="charges" className="input-label">
                Charges (₹)
              </label>
              <input
                type="text"
                id="charges"
                name="charges"
                value={profile.charges}
                onChange={handleChargesChange}
                className="input-field"
                placeholder="500"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button type="submit" className="btn-primary flex-1">
                Save Changes
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WorkerProfileModal;
