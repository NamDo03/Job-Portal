import React from "react";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-70">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-gray-300 rounded-full border-[6px] border-t-primary animate-spin"></div>
        <p className="mt-4 text-lg font-semibold text-white">Loading...</p>
      </div>
    </div>
  );
};

export default Loader;
