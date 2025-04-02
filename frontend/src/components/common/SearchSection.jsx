import React, { useEffect, useState } from "react";
import underline from "../../assets/underline.svg";
import { FiSearch } from "react-icons/fi";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { apiGetProvinces } from "../../services/app";
import { useSearchParams } from "react-router-dom";

const SearchSection = ({ heading, textHighlight, subHeading, job = true }) => {
  const [provinces, setProvinces] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const provincesData = await apiGetProvinces();
        setProvinces(provincesData);
      } catch (error) {
        console.error("Failed to fetch provinces:", error);
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    const keywordParam = job ? "jobTitle" : "companyName";
    setKeyword(searchParams.get(keywordParam) || "");
    setLocation(searchParams.get("location") || "");
  }, [searchParams, job]);

  const handleSearch = () => {
    const keywordParam = job ? "jobTitle" : "companyName";

    const params = Object.fromEntries(searchParams.entries());

    params[keywordParam] = keyword;
    params.location = location;

    Object.keys(params).forEach((key) => {
      if (!params[key]) delete params[key];
    });

    setSearchParams(params);
  };
  return (
    <div className="py-16 bg-sub-primary main-container">
      <div className="flex flex-col items-center justify-center mb-10 gap-7">
        <div className="flex flex-row gap-1.5">
          <h2 className="text-2xl lg:text-5xl xl:text-7xl text-text-primary">
            {heading}
          </h2>
          <div className="relative text-2xl lg:text-5xl xl:text-7xl">
            <span className="text-ocean heading">{textHighlight}</span>
            <img
              src={underline}
              alt="underline"
              className="absolute left-0 w-full h-auto -bottom-3 lg:-bottom-6"
            />
          </div>
        </div>
        <span className="text-lg text-text-1/80">{subHeading}</span>
      </div>

      {/* Search */}
      <div className="flex flex-col items-center w-full gap-6 p-4 bg-white shadow-lg lg:flex-row">
        <div className="flex items-center w-full gap-2">
          <FiSearch size={24} />
          <input
            type="text"
            placeholder="Enter keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full py-2 border-b border-gray-300 focus:outline-none focus:border-primary focus:ring-0"
          />
        </div>
        <div className="flex items-center w-full gap-2">
          <HiOutlineLocationMarker size={24} />
          <select
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full py-2 border-b border-gray-300 cursor-pointer focus:outline-none focus:border-primary focus:ring-0"
          >
            <option value="" disabled>
              Select Location
            </option>
            {provinces.map((province) => (
              <option key={province.code} value={province.name}>
                {province.name}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleSearch}
          className="w-full py-4 text-xl font-semibold text-white bg-primary px-7 hover:bg-primary/90"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchSection;
