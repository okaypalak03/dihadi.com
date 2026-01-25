import React, { useState } from 'react';

const HowToUse = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-8 border-t border-amber-200 pt-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left text-stone-700 hover:text-orange-600 transition-colors"
      >
        <span className="font-semibold flex items-center gap-2">
          <span className="text-xl">📖</span>
          How to use Dihadi.com
        </span>
        <span className={`text-2xl transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="mt-4 space-y-4 text-sm text-stone-600">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <h4 className="font-semibold text-stone-800 mb-2 flex items-center gap-2">
              <span>👤</span> For Users (Hiring Workers)
            </h4>
            <ol className="list-decimal list-inside space-y-1.5 ml-2">
              <li>Register or login to your account</li>
              <li>Search for workers by entering your area (e.g., Patna, Gaya)</li>
              <li>Browse available workers and their details</li>
              <li>Click &quot;Hire now&quot; on a worker card</li>
              <li>Describe the work and required time</li>
              <li>Track your hiring requests in your dashboard</li>
            </ol>
          </div>

          <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
            <h4 className="font-semibold text-stone-800 mb-2 flex items-center gap-2">
              <span>🔧</span> For Workers (Getting Hired)
            </h4>
            <ol className="list-decimal list-inside space-y-1.5 ml-2">
              <li>Register as a &quot;Worker&quot; during signup</li>
              <li>Go to your dashboard and update your profile</li>
              <li>Add your category (Plumber, Electrician, etc.)</li>
              <li>Set your charges (e.g., ₹500/day)</li>
              <li>Specify your work timings (e.g., 9 AM – 6 PM)</li>
              <li>Accept or reject job requests from users</li>
              <li>Mark jobs as completed when done</li>
            </ol>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
            <h4 className="font-semibold text-stone-800 mb-2 flex items-center gap-2">
              <span>💡</span> Tips
            </h4>
            <ul className="list-disc list-inside space-y-1.5 ml-2">
              <li>Keep your profile updated with accurate information</li>
              <li>Respond to job requests promptly</li>
              <li>Use clear descriptions when hiring workers</li>
              <li>Specify time requirements (e.g., &quot;2h 30m&quot; or &quot;2:30&quot;)</li>
              <li>Charges can include ₹ symbol (e.g., &quot;₹500/day&quot;)</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default HowToUse;
