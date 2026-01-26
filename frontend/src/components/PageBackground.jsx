import React from 'react';

const PageBackground = ({ children }) => {
  return (
    <div className="relative min-h-full">
      {/* Background image with blur overlay - fixed so it stays in place when scrolling */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop')`,
            backgroundAttachment: 'fixed',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/70 via-stone-800/60 to-stone-900/80 backdrop-blur-lg" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default PageBackground;
