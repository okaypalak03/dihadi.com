import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';
import RatingModal from '../components/RatingModal.jsx';
import ChatModal from '../components/ChatModal.jsx';
import { formatDateTime, formatDate, formatTimeDisplay } from '../utils/inputFormatters.js';
import API_BASE from '../config/api.js';

const UserDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [removeModalJobId, setRemoveModalJobId] = useState(null);
  const [ratingModalJobId, setRatingModalJobId] = useState(null);
  const [chatModalJobId, setChatModalJobId] = useState(null);
  const { user } = useContext(AuthContext);
  const toast = useToast();
  const token = () => localStorage.getItem('token');
  const headers = () => ({ 'x-auth-token': token() });

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

    fetchJobs();
  }, [user]);

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
    <div className="page-container">
      <header className="mb-10">
        <h1 className="heading-1 mb-2">My hiring requests</h1>
        <p className="text-stone-600">
          Track your job requests and manage your hiring.
        </p>
      </header>

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
                {(job.status === 'Accepted' || job.status === 'Completed') && (
                  <button
                    onClick={() => setChatModalJobId(job._id)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold bg-teal-100 text-teal-700 border border-teal-300 hover:bg-teal-200 transition-colors"
                  >
                    💬 Chat
                  </button>
                )}
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

      {chatModalJobId && (
        <ChatModal
          isOpen={!!chatModalJobId}
          onClose={() => setChatModalJobId(null)}
          job={jobs.find(j => j._id === chatModalJobId)}
          currentUser={user}
        />
      )}
    </div>
  );
};

export default UserDashboard;
