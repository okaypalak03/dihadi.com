import React from 'react';

const Home = () => {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Background image with blur overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/80 via-stone-800/70 to-stone-900/90 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-20 animate-fade-in">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo/Brand */}
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg animate-slide-up">
            What is <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">Dihadi.com</span>?
          </h1>

          {/* Description with blur effect */}
          <div className="backdrop-blur-md bg-white/10 rounded-2xl p-8 md:p-12 border border-white/20 shadow-2xl mb-8">
            <p className="text-lg md:text-xl text-white/95 leading-relaxed mb-6">
              Dihadi.com connects you with trusted local workers—plumbers, electricians, carpenters, painters, and more.
              Think Zomato or Swiggy, but for hiring help in your area.
            </p>
            <p className="text-base md:text-lg text-white/85 leading-relaxed">
              Search by location, compare workers, and book with a few clicks. Quality service, trusted professionals, right at your doorstep.
            </p>
          </div>

          {/* How it works section */}
          <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 md:p-8 border border-white/20 shadow-xl mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">How it works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2 text-lg">
                  <span className="text-2xl" aria-hidden>👤</span> For users (hiring workers)
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-white/90 text-sm">
                  <li>Register or log in</li>
                  <li>Search workers by your area</li>
                  <li>Browse profiles and click &quot;Hire now&quot;</li>
                  <li>Describe the work and time needed</li>
                  <li>Track requests in your dashboard</li>
                </ol>
              </div>
              <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2 text-lg">
                  <span className="text-2xl" aria-hidden>🔧</span> For workers (getting hired)
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-white/90 text-sm">
                  <li>Register as a worker</li>
                  <li>Update your profile: category, charges, timings</li>
                  <li>Accept or reject job requests</li>
                  <li>Mark jobs completed when done</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
