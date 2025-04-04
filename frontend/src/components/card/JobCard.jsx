import React from "react";
import { BsDot } from "react-icons/bs";
import { Link } from "react-router-dom";
import { formatJobType } from "../../utils/jobTypeFormatter";
import { formatLocation } from "../../utils/locationFormatter";
import { tagColors } from "../../constants/constants";

const JobCard = ({ job, haveBtn = false, hoverShadow = true }) => {
  const tagClass =
    tagColors[job.category.name] ||
    "border border-emerald-600 text-emerald-600 bg-white";

  return (
    <div
      className={`bg-white py-4 lg:py-6 px-6 lg:px-10 ${
        hoverShadow && "hover:shadow-md"
      }  transition-shadow flex flex-col sm:flex-row gap-5 justify-between items-start sm:items-center ${
        haveBtn && "border"
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row lg:gap-6">
        <Link to={`/jobs/${job.id}`}>
          <img
            src={job.company.logo}
            alt={`${job.company.name} logo`}
            className="object-cover w-16 h-16 cursor-pointer "
          />
        </Link>

        <div className="flex flex-col gap-3">
          <h4 className="text-xl font-semibold cursor-pointer text-text-primary">
            <Link to={`/jobs/${job.id}`}>{job.title}</Link>
          </h4>
          <span className="flex flex-row flex-wrap items-center text-sm text-text-1">
            <Link
              to={`/jobs/${job.id}`}
              className="cursor-pointer hover:text-primary"
            >
              {job.company.name}
            </Link>
            <BsDot className="mx-1" /> {formatLocation(job.company.location)}
          </span>
          <div className="flex flex-wrap gap-2">
            <span className="px-4 py-1 text-sm font-semibold rounded-full text-accents-green bg-accents-green/10">
              {formatJobType(job.jobType)}
            </span>
            <div className="w-[1px] bg-gray-200"></div>

            <span
              className={`px-4 py-1 text-sm font-semibold rounded-full ${tagClass}`}
            >
              {job.category.name}
            </span>
          </div>
        </div>
      </div>
      {haveBtn && (
        <Link to={`/jobs/${job.id}`}>
          <button className="w-full px-10 py-3 text-base font-semibold text-white bg-primary lg:px-16 hover:bg-primary/90 sm:w-fit">
            Apply
          </button>
        </Link>
      )}
    </div>
  );
};

export default JobCard;
