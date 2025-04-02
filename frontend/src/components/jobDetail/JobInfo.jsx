import React from "react";
import { formatDate } from "../../utils/dateUtils";
import { formatJobType } from "../../utils/jobTypeFormatter";
import { tagColors } from "../../constants/constants";

const JobInfo = ({
  postedAt,
  expiresAt,
  jobType,
  salary,
  category,
  skills,
  position,
  experienceLevel,
}) => {
  const tagClass =
    tagColors[category] ||
    "border border-emerald-600 text-emerald-600 bg-white";

  return (
    <div>
      <h3 className="mb-6 text-xl lg:text-3xl text-text-primary">
        About this role
      </h3>
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <span className="text-base text-text-1">Apply Before</span>
          <span className="text-base font-semibold text-text-primary">
            {formatDate(expiresAt) || "Not specified"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-base text-text-1">Job Posted On</span>
          <span className="text-base font-semibold text-text-primary">
            {formatDate(postedAt) || "Not specified"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-base text-text-1">Job Type</span>
          <span className="text-base font-semibold capitalize text-text-primary">
            {formatJobType(jobType) || "Not specified"}
          </span>
        </div>

        {position && (
          <div className="flex items-center justify-between">
            <span className="text-base text-text-1">Position</span>
            <span className="text-base font-semibold capitalize text-text-primary">
              {position.name?.toLowerCase()}
            </span>
          </div>
        )}
        {experienceLevel && (
          <div className="flex items-center justify-between">
            <span className="text-base text-text-1">Experience Level</span>
            <span className="text-base font-semibold text-text-primary">
              {experienceLevel.name}{" "}
              {experienceLevel.name === "1" ? "year" : "years"}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-base text-text-1">Salary</span>
          <span className="text-base font-semibold text-text-primary">
            {salary ? `$${salary.min} - $${salary.max}` : "Not specified"}
          </span>
        </div>
      </div>
      <div className="bg-gray-200 w-full h-[1px] my-10"></div>
      <h3 className="mb-6 text-xl lg:text-3xl text-text-primary">Categories</h3>
      <div className="flex flex-wrap gap-3">
        {category ? (
          <span
            className={`px-4 py-1 text-sm font-semibold rounded-full ${tagClass}`}
          >
            {category.name}
          </span>
        ) : (
          <span className="text-text-2">No categories specified</span>
        )}
      </div>
      <div className="bg-gray-200 w-full h-[1px] my-10"></div>
      <h3 className="mb-6 text-xl lg:text-3xl text-text-primary">
        Required Skills
      </h3>
      <div className="flex flex-wrap gap-3">
        {skills?.length > 0 ? (
          skills.map((skill) => (
            <span
              key={skill.id}
              className="px-3 py-1 text-sm rounded-md bg-sub-primary text-primary"
            >
              {skill.skill.name}
            </span>
          ))
        ) : (
          <span className="text-text-2">No skills specified</span>
        )}
      </div>
    </div>
  );
};

export default JobInfo;
