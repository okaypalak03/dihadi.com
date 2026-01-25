import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';
import { formatChargesDisplay } from '../utils/inputFormatters.js';
import HireModal from './HireModal.jsx';

const API = 'http://localhost:5000/api';

const WorkerCard = ({ worker }) => {
  const { user } = useContext(AuthContext);
  const [hireModalOpen, setHireModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const photo = worker.user?.profilePhoto;
  const initial = worker.user?.name?.trim().charAt(0).toUpperCase() || '?';

  const handleHireSubmit = async ({ description, requiredTime }) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API}/jobs`,
        { workerId: worker._id, description, requiredTime },
        { headers: { 'x-auth-token': token } }
      );
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const categoryColors = {
    Plumber: 'bg-teal-100 text-teal-800 border-teal-200',
    Electrician: 'bg-amber-100 text-amber-800 border-amber-200',
    Carpenter: 'bg-rose-100 text-rose-800 border-rose-200',
    Painter: 'bg-violet-100 text-violet-800 border-violet-200',
    default: 'bg-stone-100 text-stone-800 border-stone-200',
  };
  const catStyle = categoryColors[worker.category] || categoryColors.default;

  return (
    <>
      <div className="card p-6 flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-xl font-bold shadow-md ring-1 ring-amber-200">
            {photo ? (
              <img src={photo} alt={worker.user?.name} className="w-full h-full object-cover" />
            ) : (
              initial
            )}
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${catStyle}`}
          >
            {worker.category || 'Worker'}
          </span>
        </div>

        <h3 className="text-lg font-bold text-stone-800 mb-1">
          {worker.user?.name}
        </h3>
        <div className="space-y-2 text-sm text-stone-600 flex-1">
          <p className="flex items-center gap-2">
            <span className="text-stone-400">📍</span> {worker.user?.area || '—'}
          </p>
          <p className="flex items-center gap-2">
            <span className="text-stone-400">💰</span>{' '}
            <span className="font-semibold text-orange-600">{formatChargesDisplay(worker.charges)}</span>
          </p>
          <p className="flex items-center gap-2">
            <span className="text-stone-400">🕐</span> {worker.workTiming || '—'}
          </p>
          {worker.user?.contactNumber && (
            <p className="flex items-center gap-2">
              <span className="text-stone-400">📞</span>{' '}
              <a
                href={`tel:${worker.user.contactNumber}`}
                className="text-teal-600 hover:text-teal-700 font-medium"
              >
                {worker.user.contactNumber}
              </a>
            </p>
          )}
        </div>

        {user && user.role === 'User' && (
          <button
            onClick={() => setHireModalOpen(true)}
            className="btn-primary w-full mt-5"
          >
            Hire now
          </button>
        )}
      </div>

      <HireModal
        isOpen={hireModalOpen}
        onClose={() => setHireModalOpen(false)}
        workerName={worker.user?.name}
        onSubmit={handleHireSubmit}
        loading={loading}
      />
    </>
  );
};

export default WorkerCard;
