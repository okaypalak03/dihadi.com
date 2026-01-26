import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WorkerCard from '../components/WorkerCard';
import API_BASE from '../config/api.js';

const Workers = () => {
  const [workers, setWorkers] = useState([]);
  const [area, setArea] = useState('');

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/workers?area=${area}`);
        setWorkers(data);
      } catch (error) {
        console.error('Error fetching workers:', error);
      }
    };
    fetchWorkers();
  }, [area]);

  return (
    <div className="page-container">
      <section>
        <h2 className="heading-2 mb-4">Find workers near you</h2>
        <div className="max-w-2xl mb-8">
          <label htmlFor="area-search" className="sr-only">
            Search by area
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" aria-hidden>
              📍
            </span>
            <input
              id="area-search"
              type="text"
              placeholder="Enter your area (e.g. Patna, Gaya)"
              className="input-field pl-12 text-lg"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
          </div>
        </div>

        <h3 className="text-lg font-semibold text-stone-800 mb-4">
          {workers.length ? `Workers in ${area || 'your area'}` : 'Available workers'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workers.map((worker) => (
            <WorkerCard key={worker._id} worker={worker} />
          ))}
        </div>
        {!workers.length && (
          <div className="card p-12 text-center">
            <p className="text-stone-500 text-lg">
              No workers found for this area. Try a different location or check back later.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Workers;
