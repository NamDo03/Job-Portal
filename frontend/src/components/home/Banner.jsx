import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { HiOutlineLocationMarker } from "react-icons/hi";
import underline from "../../assets/underline.svg";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiGetProvinces } from "../../services/app";
const Banner = () => {
  const navigate = useNavigate();
  const [provinces, setProvinces] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

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
  const handleSearch = () => {
    navigate(`/jobs?jobTitle=${keyword}&location=${location}`);
  };
  return (
    <div className="relative h-full bg-sub-primary">
      <div className="pt-16 pb-16 main-container lg:pt-28 lg:pb-40">
        <h2 className="text-5xl lg:text-7xl leading-[80px] text-text-primary max-w-lg">
          Discover more than{" "}
          <span className="text-ocean heading">5000+ Jobs</span>
          <img src={underline} alt="underline" />
        </h2>
        <p className="max-w-xl py-6 text-xl text-text-1/70">
          Great platform for the job seeker that searching for new career
          heights and passionate about startups.
        </p>
        <div className="bg-white flex flex-col lg:flex-row items-center p-4 w-full lg:w-[85%] xl:w-[75%] gap-6 shadow-lg">
          <div className="flex items-center w-full gap-2">
            <FiSearch size={24} />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Job title or keyword"
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
            Search my job
          </button>
        </div>
      </div>
      <div
        className=" hidden lg:flex absolute bg-white bottom-0 right-0 w-96 h-32 xl:w-[400px] xl:h-48"
        style={{
          clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
        }}
      ></div>
    </div>
  );
};

export default Banner;
