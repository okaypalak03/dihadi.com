import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import ProfilePhotoUpload from '../components/ProfilePhotoUpload.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';
import RatingModal from '../components/RatingModal.jsx';
import { formatDateTime, formatDate, formatTimeDisplay } from '../utils/inputFormatters.js';
import API_BASE from '../config/api.js';

const UserDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [removeModalJobId, setRemoveModalJobId] = useState(null);
  const [ratingModalJobId, setRatingModalJobId] = useState(null);
  const [profile, setProfile] = useState({
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
    if (location.state?.openProfile) setShowProfileForm(true);
  }, [location.state?.openProfile]);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!user) return;
      try {
        const { data } = await axios.get(`${API_BASE}/jobs`, { headers: headers() });
        setJobs(data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };
    const fetchUserProfile = async () => {
      if (!user) return;
      try {
        const { data } = await axios.get(`${API_BASE}/auth/me`, { headers: headers() });
        setProfile({
          name: data.name || '',
          address: data.address || '',
          area: data.area || '',
          contactNumber: data.contactNumber || '',
        });
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchJobs();
    fetchUserProfile();
  }, [user]);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`${API_BASE}/users/profile`, profile, { headers: headers() });
      setUser(data);
      setShowProfileForm(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile.');
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

  const handleRemoveJobClick = (jobId) => setRemoveModalJobId(jobId);

  const handleRemoveJobConfirm = async () => {
    const jobId = removeModalJobId;
    await axios.delete(`${API_BASE}/jobs/${jobId}`, { headers: headers() });
    setJobs((prev) => prev.filter((j) => j._id !== jobId));
  };

  const handleRatingSubmitted = async () => {
    // Refresh jobs to get updated rating
    try {
      const { data } = await axios.get(`${API_BASE}/jobs`, { headers: headers() });
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
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
    <div className="page-container py-8">
      <header className="mb-10">
        <div className="flex items-center justify-between mb-2">
          <h1 className="heading-1">My hiring requests</h1>
          <button
            onClick={() => setShowProfileForm(!showProfileForm)}
            className="btn-secondary text-sm"
          >
            {showProfileForm ? 'Cancel' : 'Update Profile'}
          </button>
        </div>
        <p className="text-stone-600">
          Track your job requests and manage your profile.
        </p>
      </header>

      {showProfileForm && (
        <div className="card p-6 mb-8">
          <h2 className="heading-2 mb-4">Update Personal Details</h2>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="flex flex-col items-center pb-4 border-b border-amber-100">
              <ProfilePhotoUpload
                profilePhoto={user?.profilePhoto}
                name={profile.name || user?.name}
                onUpdate={handlePhotoUpdate}
              />
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1.5">
                Name
              </label>
              <input
                id="name"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                placeholder="Your name"
                required
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-stone-700 mb-1.5">
                Address
              </label>
              <input
                id="address"
                name="address"
                value={profile.address}
                onChange={handleProfileChange}
                placeholder="Your address"
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="area" className="block text-sm font-medium text-stone-700 mb-1.5">
                Area
              </label>
              <input
                id="area"
                name="area"
                value={profile.area}
                onChange={handleProfileChange}
                placeholder="e.g. Patna, Gaya"
                required
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="contactNumber" className="block text-sm font-medium text-stone-700 mb-1.5">
                Contact Number
              </label>
              <input
                id="contactNumber"
                name="contactNumber"
                value={profile.contactNumber}
                onChange={handleProfileChange}
                placeholder="Phone number"
                className="input-field"
              />
            </div>
            <button type="submit" className="btn-primary">
              Save Changes
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {jobs.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-stone-500 text-lg mb-4">
              You haven&apos;t hired anyone yet.
            </p>
            <Link to="/" className="btn-primary inline-flex">
              Find workers
            </Link>
          </div>
        ) : (
          jobs.map((job) => (
            <div key={job._id} className="card p-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-stone-800 font-medium mb-2">
                  {job.description}
                </p>
                <div className="space-y-1.5 text-sm text-stone-600 mb-3">
                  {job.workDate && (
                    <p className="flex items-center gap-2">
                      <span className="text-stone-400">📅</span>
                      <span>Work date: {formatDate(job.workDate)}</span>
                      {job.workTimeFrom && job.workTimeTo && (
                        <span className="text-stone-500">
                          ({formatTimeDisplay(job.workTimeFrom)} - {formatTimeDisplay(job.workTimeTo)})
                        </span>
                      )}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-3 text-xs text-stone-500">
                    <span>Request sent: {formatDateTime(job.createdAt)}</span>
                    {job.acceptedAt && <span>Accepted: {formatDateTime(job.acceptedAt)}</span>}
                    {job.completedAt && <span>Completed: {formatDateTime(job.completedAt)}</span>}
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-stone-500 mb-2">
                  <span>Status: {job.status}</span>
                  <span>Payment: {job.paymentStatus || '—'}</span>
                  {job.rating && (
                    <span className="flex items-center gap-1">
                      <span>⭐</span>
                      <span className="font-semibold text-amber-600">{job.rating}/5</span>
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border ${getStatusStyle(
                    job.status
                  )}`}
                >
                  {job.status}
                </span>
                {job.status === 'Completed' && !job.rating && (
                  <button
                    onClick={() => setRatingModalJobId(job._id)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold bg-amber-100 text-amber-700 border border-amber-300 hover:bg-amber-200 transition-colors"
                  >
                    Rate work
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
          ))
        )}
      </div>

      <ConfirmModal
        isOpen={!!removeModalJobId}
        onClose={() => setRemoveModalJobId(null)}
        title="Remove hiring request?"
        message="Remove this hiring request? This cannot be undone."
        confirmLabel="Remove"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleRemoveJobConfirm}
      />

      {ratingModalJobId && (
        <RatingModal
          isOpen={!!ratingModalJobId}
          onClose={() => setRatingModalJobId(null)}
          job={jobs.find(j => j._id === ratingModalJobId)}
          onRatingSubmitted={handleRatingSubmitted}
        />
      )}
    </div>
  );
};

export default UserDashboard;
