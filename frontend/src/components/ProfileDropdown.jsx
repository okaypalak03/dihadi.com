import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

const ProfileDropdown = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  const handlePersonalDetails = () => {
    navigate('/personal-details');
    setIsOpen(false);
  };

  const handleWorkerProfile = () => {
    navigate('/worker-profile');
    setIsOpen(false);
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-9 h-9 rounded-xl overflow-hidden bg-gradient-to-br from-orange-400 to-amber-500 flex-shrink-0 ring-1 ring-amber-200 hover:ring-2 hover:ring-orange-400 transition-all focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
          aria-label="Profile menu"
        >
          {user.profilePhoto ? (
            <img src={user.profilePhoto} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <span className="w-full h-full flex items-center justify-center text-white text-sm font-bold">
              {user.name?.trim().charAt(0).toUpperCase() || '?'}
            </span>
          )}
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-amber-100 py-2 z-50">
            <button
              onClick={handlePersonalDetails}
              className="w-full text-left px-4 py-2.5 text-sm text-stone-700 hover:bg-amber-50 transition-colors flex items-center gap-2"
            >
              <span>👤</span>
              <span>Update Personal Details</span>
            </button>
            {user.role === 'Worker' && (
              <button
                onClick={handleWorkerProfile}
                className="w-full text-left px-4 py-2.5 text-sm text-stone-700 hover:bg-amber-50 transition-colors flex items-center gap-2"
              >
                <span>⚙️</span>
                <span>Update Profile</span>
              </button>
            )}
            <div className="border-t border-amber-100 my-1"></div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfileDropdown;
