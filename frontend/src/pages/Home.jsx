import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WorkerCard from '../components/WorkerCard';

const Home = () => {
  const [workers, setWorkers] = useState([]);
  const [area, setArea] = useState('');

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/workers?area=${area}`);
        setWorkers(data);
      } catch (error) {
        console.error('Error fetching workers:', error);
      }
    };
    fetchWorkers();
  }, [area]);

  return (
    <div className="page-container">
      <header className="text-center mb-12">
        <h1 className="heading-1 mb-3">
          Find & hire <span className="text-gradient">local workers</span>
        </h1>
        <p className="text-stone-600 text-lg max-w-xl mx-auto">
          Plumbers, electricians, carpenters & more. Trusted help in your area.
        </p>
      </header>

      <div className="max-w-2xl mx-auto mb-10">
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

      <section>
        <h2 className="heading-2 mb-6">
          {workers.length ? `Workers in ${area || 'your area'}` : 'Available workers'}
        </h2>
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
