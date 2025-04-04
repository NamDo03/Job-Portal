import React from "react";

const JobCardSkeleton = () => {
  return (
    <div
      className={`bg-white py-4 lg:py-6 px-6 lg:px-10 flex flex-col sm:flex-row gap-5 justify-between items-start sm:items-center border shadow w-full`}
    >
      <div className="flex flex-col w-full gap-3 sm:flex-row lg:gap-6">
        <div className="flex items-center justify-center w-20 h-20 bg-gray-200 rounded-sm">
          <svg
            className="w-10 h-10 text-gray-300"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 18"
          >
            <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
          </svg>
        </div>

        <div className="flex flex-col flex-1 gap-3">
          <div className="w-48 h-3 mb-2 bg-gray-200 rounded-full"></div>
          <div className="h-2 bg-gray-200 rounded"></div>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="h-2 col-span-2 bg-gray-200 rounded"></div>
              <div className="h-2 col-span-1 bg-gray-200 rounded"></div>
            </div>
            <div className="h-2 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCardSkeleton;
