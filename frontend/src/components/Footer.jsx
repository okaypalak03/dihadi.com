import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-800 text-stone-200 mt-auto">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Logo className="mb-4" />
            <p className="text-stone-400 text-sm">
              Dihadi.com connects you with trusted local workers. Find plumbers, electricians, carpenters, and more.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-stone-400 hover:text-orange-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-stone-400 hover:text-orange-400 transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-stone-400 hover:text-orange-400 transition-colors">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-white mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:support@dihadi.com" className="text-stone-400 hover:text-orange-400 transition-colors">
                  support@dihadi.com
                </a>
              </li>
              <li>
                <a href="tel:+911234567890" className="text-stone-400 hover:text-orange-400 transition-colors">
                  +91 123 456 7890
                </a>
              </li>
              <li>
                <span className="text-stone-400">Mon - Sat: 9 AM - 6 PM</span>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-bold text-white mb-4">Help & Info</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#how-it-works" className="text-stone-400 hover:text-orange-400 transition-colors">
                  How it works
                </a>
              </li>
              <li>
                <a href="#faq" className="text-stone-400 hover:text-orange-400 transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#privacy" className="text-stone-400 hover:text-orange-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="text-stone-400 hover:text-orange-400 transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-stone-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-stone-400 text-sm">
            © {currentYear} Dihadi.com. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#privacy" className="text-stone-400 hover:text-orange-400 transition-colors">
              Privacy
            </a>
            <a href="#terms" className="text-stone-400 hover:text-orange-400 transition-colors">
              Terms
            </a>
            <a href="#cookies" className="text-stone-400 hover:text-orange-400 transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
