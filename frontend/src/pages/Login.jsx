import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import HowToUse from '../components/HowToUse.jsx';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useContext(AuthContext);
  const toast = useToast();
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      console.error('Login failed', error);
      toast.error('Login failed. Please check your email and password.');
    }
  };

  return (
    <div className="page-container flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-md">
        <div className="card p-8 md:p-10">
          <h1 className="heading-1 text-center mb-2">Welcome back</h1>
          <p className="text-stone-500 text-center mb-8">
            Sign in to hire workers or manage your jobs.
          </p>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                name="email"
                value={email}
                onChange={onChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                name="password"
                value={password}
                onChange={onChange}
                className="input-field"
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full py-3">
              Sign in
            </button>
          </form>

          <p className="mt-6 text-center text-stone-600">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-semibold text-orange-600 hover:text-orange-700">
              Register
            </Link>
          </p>

          <HowToUse />
        </div>
      </div>
    </div>
  );
};

export default Login;
