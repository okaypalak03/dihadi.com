import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import Logo from './Logo.jsx';
import ProfileDropdown from './ProfileDropdown.jsx';

const Navbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-sm">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          <Logo />

          <div className="flex items-center gap-2 md:gap-4">
            {user ? (
              <>
                <Link
                  to="/workers"
                  className="px-4 py-2 rounded-xl font-medium text-stone-600 hover:bg-amber-100 hover:text-orange-600 transition-colors"
                >
                  Find Workers
                </Link>
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
                {(user.role === 'User' || user.role === 'Worker' || user.role === 'Admin') && (
                  <ProfileDropdown user={user} />
                )}
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
