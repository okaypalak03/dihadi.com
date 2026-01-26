import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';
import ChatModal from '../components/ChatModal.jsx';
import { formatDateTime, formatDate, formatTimeDisplay } from '../utils/inputFormatters.js';
import API_BASE from '../config/api.js';

const WorkerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [removeModalJobId, setRemoveModalJobId] = useState(null);
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

    if (user) {
      fetchJobs();
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
        <h1 className="heading-1 mb-2">Job requests</h1>
        <p className="text-stone-600">
          Manage your job requests and respond to hiring requests.
        </p>
      </header>

      <div className="space-y-4">
            {jobs.length === 0 ? (
              <div className="card p-12 text-center">
                <p className="text-stone-500">No job requests yet.</p>
              </div>
            ) : (
              jobs.map((job) => (
                <div key={job._id} className="card p-6">
                  <p className="text-stone-800 font-medium mb-2">{job.description}</p>
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
                      {(job.status === 'Accepted' || job.status === 'Pending') && (
                        <button
                          onClick={() => setChatModalJobId(job._id)}
                          className="px-4 py-2 rounded-xl text-sm font-semibold bg-teal-100 text-teal-700 border border-teal-300 hover:bg-teal-200 transition-colors"
                        >
                          💬 Chat
                        </button>
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

export default WorkerDashboard;
