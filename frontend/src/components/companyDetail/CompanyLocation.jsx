import React from "react";
import { FaLocationDot } from "react-icons/fa6";
import { FaMapMarkedAlt } from "react-icons/fa";
const CompanyLocation = ({ location }) => {
  return (
    <div>
      <h3 className="mb-3 text-xl lg:text-3xl text-text-primary">Location</h3>
      <span className="flex items-center gap-2 text-base font-medium text-text-1">
        <FaLocationDot size={20} className="text-primary" /> {location}
      </span>
      <div className="bg-gray-200 w-full h-[1px] my-4"></div>

      <div className="">
        <span className="flex items-center gap-2 text-base font-medium text-text-1">
          <FaMapMarkedAlt size={24} className="text-primary" /> See on map
        </span>
        <iframe
          className="w-full h-64 rounded-lg lg:h-96"
          src="https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=123+Main+Street,City,Country"
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default CompanyLocation;
