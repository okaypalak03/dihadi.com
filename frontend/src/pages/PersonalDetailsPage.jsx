import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import ProfilePhotoUpload from '../components/ProfilePhotoUpload.jsx';
import API_BASE from '../config/api.js';

const PersonalDetailsPage = () => {
  const [profile, setProfile] = useState({
    name: '',
    address: '',
    area: '',
    contactNumber: '',
  });
  const { user, setUser } = useContext(AuthContext);
  const toast = useToast();
  const navigate = useNavigate();
  const token = () => localStorage.getItem('token');
  const headers = () => ({ 'x-auth-token': token() });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchUserProfile = async () => {
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
    fetchUserProfile();
  }, [user, navigate]);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`${API_BASE}/users/profile`, profile, { headers: headers() });
      setUser(data);
      toast.success('Personal details updated successfully!');
      // Navigate back to appropriate dashboard
      if (user?.role === 'User') {
        navigate('/user-dashboard');
      } else if (user?.role === 'Worker') {
        navigate('/worker-dashboard');
      } else {
        navigate('/admin-dashboard');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
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

  const handleCancel = () => {
    if (user?.role === 'User') {
      navigate('/user-dashboard');
    } else if (user?.role === 'Worker') {
      navigate('/worker-dashboard');
    } else {
      navigate('/admin-dashboard');
    }
  };

  return (
    <div className="page-container">
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <header className="mb-10 text-center w-full">
          <h1 className="heading-1 mb-2">Update Personal Details</h1>
          <p className="text-stone-600">
            Update your personal information and profile photo.
          </p>
        </header>

        <div className="card p-6 w-full max-w-2xl">
        <div className="mb-6">
          <ProfilePhotoUpload
            profilePhoto={user?.profilePhoto}
            name={profile.name || user?.name}
            onUpdate={handlePhotoUpdate}
          />
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="input-label">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={profile.name}
              onChange={handleProfileChange}
              className="input-field"
              required
            />
          </div>

          <div>
            <label htmlFor="address" className="input-label">
              Address
            </label>
            <textarea
              id="address"
              name="address"
              value={profile.address}
              onChange={handleProfileChange}
              className="input-field"
              rows="3"
            />
          </div>

          <div>
            <label htmlFor="area" className="input-label">
              Area
            </label>
            <input
              type="text"
              id="area"
              name="area"
              value={profile.area}
              onChange={handleProfileChange}
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="contactNumber" className="input-label">
              Contact Number
            </label>
            <input
              type="tel"
              id="contactNumber"
              name="contactNumber"
              value={profile.contactNumber}
              onChange={handleProfileChange}
              className="input-field"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn-primary flex-1">
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetailsPage;
