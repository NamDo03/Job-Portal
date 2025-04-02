import React from "react";
import { Link } from "react-router-dom";
import parse from "html-react-parser";
import company_default from "../../assets/company_default.png";

const CompanyCard = ({ company }) => {
  const backgroundImage = company.images?.[0]?.imageUrl || company_default;
  const logoImage = company.logo || "";
  const jobCount = company.job?.length || 0;
  const description = company.description || "";
  return (
    <div className="flex flex-col gap-4 transition-shadow bg-white border hover:shadow-md">
      <div className="relative">
        <Link to={`/companies/${company.id}`}>
          <img
            src={backgroundImage}
            alt={`${company.name} background`}
            className="object-cover w-full h-64 cursor-pointer"
          />
        </Link>
        <Link to={`/companies/${company.id}`}>
          <img
            src={logoImage}
            alt={`${company.name} logo`}
            className="absolute object-cover w-20 h-20 bg-white border cursor-pointer -bottom-5 left-5"
          />
        </Link>

        {jobCount > 0 && (
          <div className="absolute px-3 py-1 font-semibold border border-primary text-primary bg-sub-primary top-3 right-3">
            {jobCount} {jobCount === 1 ? "Job" : "Jobs"}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 p-5">
        <h4 className="text-xl font-semibold cursor-pointer text-text-primary">
          <Link to={`/companies/${company.id}`}>{company.name}</Link>
        </h4>
        <p className="text-base text-text-2 line-clamp-3">
          {parse(description) || ""}
        </p>
      </div>
    </div>
  );
};

export default CompanyCard;
