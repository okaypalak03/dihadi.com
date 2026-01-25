import React, { useId } from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ className = '' }) => {
  const gradId = 'logo-grad-' + useId().replace(/:/g, '');
  return (
  <Link to="/" className={`flex items-center gap-2 no-underline group ${className}`}>
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0 transition-transform group-hover:scale-105"
      aria-hidden
    >
      <rect width="40" height="40" rx="10" fill={`url(#${gradId})`} />
      <path
        d="M12 14h4v12h-4V14zm12 0h4v12h-4V14zM10 22h20v2H10v-2z"
        fill="white"
        fillOpacity="0.95"
      />
      <circle cx="20" cy="18" r="3" fill="white" fillOpacity="0.9" />
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6B35" />
          <stop offset="0.5" stopColor="#F59E0B" />
          <stop offset="1" stopColor="#EF4444" />
        </linearGradient>
      </defs>
    </svg>
    <span className="font-bold text-xl tracking-tight">
      <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 bg-clip-text text-transparent group-hover:from-orange-600 group-hover:via-amber-600 group-hover:to-rose-600">Dihadi</span>
      <span className="text-stone-500">.com</span>
    </span>
  </Link>
  );
};

export default Logo;
