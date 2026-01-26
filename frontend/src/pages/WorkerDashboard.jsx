import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import ProfilePhotoUpload from '../components/ProfilePhotoUpload.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';
import { handleCurrencyInputChange, handleTimeInputChange } from '../utils/inputFormatters.js';
import API_BASE from '../config/api.js';

const WorkerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [profile, setProfile] = useState({
    workTiming: '',
    charges: '',
    category: '',
  });
  const [showPersonalForm, setShowPersonalForm] = useState(false);
  const [removeModalJobId, setRemoveModalJobId] = useState(null);
  const [personal, setPersonal] = useState({
    name: '',
    address: '',
    area: '',
    contactNumber: '',
  });
  const { user, setUser } = useContext(AuthContext);
  const toast = useToast();
  const location = useLocation();
  const token = () => localStorage.getItem('token');
  const headers = () => ({ 'x-auth-token': token() });

  useEffect(() => {
    if (location.state?.openProfile) setShowPersonalForm(true);
  }, [location.state?.openProfile]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/jobs`, { headers: headers() });
        setJobs(data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };
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
    const fetchUserProfile = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/auth/me`, { headers: headers() });
        setPersonal({
          name: data.name || '',
          address: data.address || '',
          area: data.area || '',
          contactNumber: data.contactNumber || '',
        });
      } catch (error) {
        console.error('Could not fetch user profile.');
      }
    };

    if (user) {
      fetchJobs();
      fetchWorkerProfile();
      fetchUserProfile();
    }
  }, [user]);

  const handleStatusChange = async (jobId, status) => {
    try {
      await axios.put(`${API_BASE}/jobs/${jobId}`, { status }, { headers: headers() });
      setJobs((prev) =>
        prev.map((j) => (j._id === jobId ? { ...j, status } : j))
      );
    } catch (error) {
      console.error('Error updating job status:', error);
    }
  };

  const handleRemoveJobClick = (jobId) => setRemoveModalJobId(jobId);

  const handleRemoveJobConfirm = async () => {
    const jobId = removeModalJobId;
    await axios.delete(`${API_BASE}/jobs/${jobId}`, { headers: headers() });
    setJobs((prev) => prev.filter((j) => j._id !== jobId));
  };

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePersonalChange = (e) => {
    setPersonal({ ...personal, [e.target.name]: e.target.value });
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
      await axios.post(`${API_BASE}/workers`, profile, { headers: headers() });
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile.');
    }
  };

  const handlePersonalSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`${API_BASE}/users/profile`, personal, { headers: headers() });
      setUser(data);
      setShowPersonalForm(false);
      toast.success('Personal details updated successfully!');
    } catch (error) {
      console.error('Error updating personal details:', error);
      toast.error('Failed to update personal details.');
    }
  };

  const handlePhotoUpdate = async (base64OrNull) => {
    try {
      const { data } = await axios.put(
        `${API_BASE}/users/profile`,
        { profilePhoto: base64OrNull ?? null },
        { headers: headers() }
      );
      setUser(data);
      toast.success(base64OrNull ? 'Profile photo updated!' : 'Profile photo removed.');
    } catch (error) {
      console.error('Error updating profile photo:', error);
      toast.error('Failed to update profile photo.');
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Accepted':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Rejected':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-200';
    }
  };

  return (
    <div className="page-container">
      <header className="mb-10">
        <div className="flex items-center justify-between mb-2">
          <h1 className="heading-1">Worker dashboard</h1>
          <button
            onClick={() => setShowPersonalForm(!showPersonalForm)}
            className="btn-secondary text-sm"
          >
            {showPersonalForm ? 'Cancel' : 'Update Personal Details'}
          </button>
        </div>
        <p className="text-stone-600">
          Manage your profile, personal details, and job requests.
        </p>
      </header>

      {showPersonalForm && (
        <div className="card p-6 mb-8">
          <h2 className="heading-2 mb-4">Update Personal Details</h2>
          <form onSubmit={handlePersonalSubmit} className="space-y-4">
            <div className="flex flex-col items-center pb-4 border-b border-amber-100">
              <ProfilePhotoUpload
                profilePhoto={user?.profilePhoto}
                name={personal.name || user?.name}
                onUpdate={handlePhotoUpdate}
              />
            </div>
            <div>
              <label htmlFor="pd-name" className="block text-sm font-medium text-stone-700 mb-1.5">Name</label>
              <input id="pd-name" name="name" value={personal.name} onChange={handlePersonalChange} placeholder="Your name" required className="input-field" />
            </div>
            <div>
              <label htmlFor="pd-address" className="block text-sm font-medium text-stone-700 mb-1.5">Address</label>
              <input id="pd-address" name="address" value={personal.address} onChange={handlePersonalChange} placeholder="Your address" className="input-field" />
            </div>
            <div>
              <label htmlFor="pd-area" className="block text-sm font-medium text-stone-700 mb-1.5">Area</label>
              <input id="pd-area" name="area" value={personal.area} onChange={handlePersonalChange} placeholder="e.g. Patna, Gaya" required className="input-field" />
            </div>
            <div>
              <label htmlFor="pd-contact" className="block text-sm font-medium text-stone-700 mb-1.5">Contact Number</label>
              <input id="pd-contact" name="contactNumber" value={personal.contactNumber} onChange={handlePersonalChange} placeholder="Phone number" className="input-field" />
            </div>
            <button type="submit" className="btn-primary">Save Changes</button>
          </form>
        </div>
      )}

      <div className="grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="card p-6 sticky top-24">
            <h2 className="heading-2 mb-4">Update profile</h2>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-stone-700 mb-1.5">
                  Category
                </label>
                <input
                  id="category"
                  name="category"
                  value={profile.category}
                  onChange={handleProfileChange}
                  placeholder="e.g. Plumber, Electrician"
                  className="input-field"
                />
              </div>
              <div>
                <label htmlFor="charges" className="block text-sm font-medium text-stone-700 mb-1.5">
                  Charges (₹ per day) <span className="text-stone-400 text-xs">— default Rs per day</span>
                </label>
                <div className="relative">
                  <input
                    id="charges"
                    name="charges"
                    value={profile.charges}
                    onChange={handleChargesChange}
                    placeholder="e.g. 500"
                    className="input-field"
                  />
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Enter amount only. Displayed as ₹ per day in your profile.
                </p>
              </div>
              <div>
                <label htmlFor="workTiming" className="block text-sm font-medium text-stone-700 mb-1.5">
                  Work timings <span className="text-stone-400 text-xs">(hours/min format)</span>
                </label>
                <input
                  id="workTiming"
                  name="workTiming"
                  value={profile.workTiming}
                  onChange={handleWorkTimingChange}
                  placeholder="e.g. 9h 6m or 9:00 AM - 6:00 PM"
                  className="input-field"
                />
                <p className="text-xs text-stone-500 mt-1">
                  Examples: 9h 6m, 2h 30m, 9:00 AM - 6:00 PM
                </p>
              </div>
              <button type="submit" className="btn-primary w-full">
                Update profile
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-3">
          <h2 className="heading-2 mb-4">Job requests</h2>
          <div className="space-y-4">
            {jobs.length === 0 ? (
              <div className="card p-12 text-center">
                <p className="text-stone-500">No job requests yet.</p>
              </div>
            ) : (
              jobs.map((job) => (
                <div key={job._id} className="card p-6">
                  <p className="text-stone-800 font-medium mb-3">{job.description}</p>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <span
                      className={`px-4 py-2 rounded-xl text-sm font-semibold border ${getStatusStyle(
                        job.status
                      )}`}
                    >
                      {job.status}
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      {job.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(job._id, 'Accepted')}
                            className="btn-primary py-2 px-4 text-sm"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleStatusChange(job._id, 'Rejected')}
                            className="bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2 px-4 rounded-xl text-sm transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {job.status === 'Accepted' && (
                        <button
                          onClick={() => handleStatusChange(job._id, 'Completed')}
                          className="btn-primary py-2 px-4 text-sm"
                        >
                          Mark completed
                        </button>
                      )}
                      <button
                        onClick={() => handleRemoveJobClick(job._id)}
                        className="px-4 py-2 rounded-xl text-sm font-semibold border border-stone-300 text-stone-600 hover:bg-stone-100 hover:border-stone-400 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={!!removeModalJobId}
        onClose={() => setRemoveModalJobId(null)}
        title="Remove job request?"
        message="Remove this job request? This cannot be undone."
        confirmLabel="Remove"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleRemoveJobConfirm}
      />
    </div>
  );
};

export default WorkerDashboard;
