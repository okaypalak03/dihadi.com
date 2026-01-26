import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { handleCurrencyInputChange, handleTimeInputChange } from '../utils/inputFormatters.js';
import API_BASE from '../config/api.js';

const WorkerProfilePage = () => {
  const [profile, setProfile] = useState({
    workTiming: '',
    charges: '',
    category: '',
  });
  const { user } = useContext(AuthContext);
  const toast = useToast();
  const navigate = useNavigate();
  const token = () => localStorage.getItem('token');
  const headers = () => ({ 'x-auth-token': token() });

  useEffect(() => {
    if (!user || user.role !== 'Worker') {
      navigate('/worker-dashboard');
      return;
    }

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
  }, [user, navigate]);

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
      navigate('/worker-dashboard');
    } catch (error) {
      console.error('Error updating worker profile:', error);
      toast.error('Failed to update worker profile.');
    }
  };

  const handleCancel = () => {
    navigate('/worker-dashboard');
  };

  return (
    <div className="page-container">
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <header className="mb-10 text-center w-full">
          <h1 className="heading-1 mb-2">Update Worker Profile</h1>
          <p className="text-stone-600">
            Update your work category, timing, and charges.
          </p>
        </header>

        <div className="card p-6 w-full max-w-2xl">
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
              onClick={handleCancel}
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

export default WorkerProfilePage;
