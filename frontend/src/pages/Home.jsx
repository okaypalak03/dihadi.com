import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import WorkerCard from '../components/WorkerCard';
import API_BASE from '../config/api.js';

const Home = () => {
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
      {/* 1. What is Dihadi.com + Login / Register */}
      <header className="text-center mb-16 pt-4">
        <h1 className="heading-1 mb-4">
          What is <span className="text-gradient">Dihadi.com</span>?
        </h1>
        <p className="text-stone-600 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
          Dihadi.com connects you with trusted local workers—plumbers, electricians, carpenters, painters, and more.
          Think Zomato or Swiggy, but for hiring help in your area. Search by location, compare workers, and book
          with a few clicks.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link to="/login" className="btn-secondary px-6 py-3 text-base">
            Login
          </Link>
          <Link to="/register" className="btn-primary px-6 py-3 text-base">
            Register
          </Link>
        </div>
      </header>

      {/* 2. How it works */}
      <section id="how-it-works" className="mb-16 scroll-mt-8">
        <h2 className="heading-2 text-center mb-8">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="card p-6">
            <h3 className="font-semibold text-stone-800 mb-3 flex items-center gap-2">
              <span className="text-xl" aria-hidden>👤</span> For users (hiring workers)
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-stone-600 text-sm">
              <li>Register or log in</li>
              <li>Search workers by your area (e.g. Patna, Gaya)</li>
              <li>Browse profiles and click &quot;Hire now&quot;</li>
              <li>Describe the work and time needed</li>
              <li>Track requests in your dashboard</li>
            </ol>
          </div>
          <div className="card p-6">
            <h3 className="font-semibold text-stone-800 mb-3 flex items-center gap-2">
              <span className="text-xl" aria-hidden>🔧</span> For workers (getting hired)
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-stone-600 text-sm">
              <li>Register as a worker</li>
              <li>Update your profile: category, charges, timings</li>
              <li>Accept or reject job requests</li>
              <li>Mark jobs completed when done</li>
            </ol>
          </div>
        </div>
      </section>

      {/* 3. Search & workers */}
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

export default Home;
