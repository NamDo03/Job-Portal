import React from "react";
import { BsDot } from "react-icons/bs";
import { Link } from "react-router-dom";
import parse from "html-react-parser";
import { formatJobType } from "../../utils/jobTypeFormatter";
import { formatLocation } from "../../utils/locationFormatter";
import { tagColors } from "../../constants/constants";

const CardItem = ({ job }) => {
  const tagClass =
    tagColors[job.category.name] ||
    "border border-emerald-600 text-emerald-600 bg-white";

  return (
    <div className="flex flex-col gap-4 p-6 transition-shadow bg-white border hover:shadow-md">
      <div className="flex flex-row items-center justify-between">
        <Link to={`/jobs/${job.id}`}>
          <img
            src={job.company.logo}
            alt={`${job.company.name} logo`}
            className="object-cover cursor-pointer w-14 h-14"
          />
        </Link>

        <div className="px-3 py-1 border border-primary text-primary">
          {formatJobType(job.jobType)}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h4 className="text-xl font-semibold cursor-pointer text-text-primary">
          <Link to={`/jobs/${job.id}`}>{job.title}</Link>
        </h4>
        <p className="flex flex-row flex-wrap items-center text-sm text-text-1">
          <Link
            to={`/companies/1`}
            className="cursor-pointer hover:text-primary"
          >
            {job.company.name}
          </Link>{" "}
          <BsDot className="mx-1" /> {formatLocation(job.company.location)}
        </p>
      </div>
      <span className="text-sm text-text-2 line-clamp-2">
        {parse(job.jobDescription)}
      </span>

      <div className="flex flex-wrap gap-2">
        <span
          className={`px-4 py-1 text-sm font-semibold rounded-full ${tagClass}`}
        >
          {job.category.name}
        </span>
      </div>
    </div>
  );
};

export default CardItem;
