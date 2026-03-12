import React from 'react';

const LandingPage = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 relative">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6 drop-shadow-[0_0_15px_rgba(56,189,248,0.3)]">
          Master Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Career Path</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
          Great careers aren't built in a day; <br className="hidden md:block" />
          <span className="text-blue-400 italic">They are built in the moments you choose to start.</span>
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
