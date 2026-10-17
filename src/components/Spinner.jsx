import React from 'react';

const Spinner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[45vh] gap-5">
      <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-yellow-50 animate-spin shadow-[0_0_15px_rgba(255,214,10,0.35)]" />
      <p className="text-richblack-5 font-semibold text-[1.1rem] tracking-[0.02em] font-heading">
        Loading...
      </p>
    </div>
  );
};

export default Spinner;