import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import Logo from './Logo.jsx';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-sm">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          <Logo />

          <div className="flex items-center gap-2 md:gap-4">
            {user ? (
              <>
                {(user.role === 'User' || user.role === 'Worker' || user.role === 'Admin') && (
                  <Link
                    to={
                      user.role === 'User'
                        ? '/user-dashboard'
                        : user.role === 'Worker'
                        ? '/worker-dashboard'
                        : '/admin-dashboard'
                    }
                    state={{ openProfile: true }}
                    title="Go to profile – update photo & details"
                    className="hidden sm:flex w-9 h-9 rounded-xl overflow-hidden bg-gradient-to-br from-orange-400 to-amber-500 flex-shrink-0 ring-1 ring-amber-200 hover:ring-2 hover:ring-orange-400 transition-all focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
                  >
                    {user.profilePhoto ? (
                      <img src={user.profilePhoto} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="w-full h-full flex items-center justify-center text-white text-sm font-bold">
                        {user.name?.trim().charAt(0).toUpperCase() || '?'}
                      </span>
                    )}
                  </Link>
                )}
                {(user.role === 'User' || user.role === 'Worker' || user.role === 'Admin') && (
                  <Link
                    to={
                      user.role === 'User'
                        ? '/user-dashboard'
                        : user.role === 'Worker'
                        ? '/worker-dashboard'
                        : '/admin-dashboard'
                    }
                    className="px-4 py-2 rounded-xl font-medium text-stone-600 hover:bg-amber-100 hover:text-orange-600 transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="btn-secondary text-sm py-2 px-4"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl font-medium text-stone-600 hover:bg-amber-100 hover:text-orange-600 transition-colors"
                >
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
