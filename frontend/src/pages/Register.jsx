import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import HowToUse from '../components/HowToUse.jsx';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'User',
    address: '',
    area: '',
    contactNumber: '',
  });
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const { name, email, password, role, address, area, contactNumber } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate('/');
    } catch (error) {
      console.error('Registration failed', error);
      alert('Registration failed');
    }
  };

  return (
    <div className="page-container py-12">
      <div className="max-w-md mx-auto">
        <div className="card p-8 md:p-10">
          <h1 className="heading-1 text-center mb-2">Create account</h1>
          <p className="text-stone-500 text-center mb-8">
            Join Dihadi.com as a user or worker.
          </p>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1.5">
                Name
              </label>
              <input
                id="name"
                name="name"
                value={name}
                onChange={onChange}
                placeholder="Your name"
                required
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1.5">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={onChange}
                placeholder="you@example.com"
                required
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-1.5">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={onChange}
                placeholder="••••••••"
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
                value={address}
                onChange={onChange}
                placeholder="Address"
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
                value={area}
                onChange={onChange}
                placeholder="e.g. Patna, Gaya"
                required
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="contactNumber" className="block text-sm font-medium text-stone-700 mb-1.5">
                Contact number
              </label>
              <input
                id="contactNumber"
                name="contactNumber"
                value={contactNumber}
                onChange={onChange}
                placeholder="Phone number"
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-stone-700 mb-1.5">
                I am a
              </label>
              <select
                id="role"
                name="role"
                value={role}
                onChange={onChange}
                className="input-field"
              >
                <option value="User">User (hire workers)</option>
                <option value="Worker">Worker (get hired)</option>
              </select>
            </div>
            <button type="submit" className="btn-primary w-full py-3 mt-2">
              Register
            </button>
          </form>

          <p className="mt-6 text-center text-stone-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-orange-600 hover:text-orange-700">
              Sign in
            </Link>
          </p>

          <HowToUse />
        </div>
      </div>
    </div>
  );
};

export default Register;
