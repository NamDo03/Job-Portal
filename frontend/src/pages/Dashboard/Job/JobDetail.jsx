import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getJobById } from "../../../services/job";
import Loader from "../../../components/loader/Loader";
import { formatDate } from "../../../utils/dateUtils";
import parse from "html-react-parser";

const JobDetail = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const data = await getJobById(jobId);
        setJob(data);
      } catch (error) {
        console.error("Failed to fetch job details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  if (loading) return <Loader />;
  if (!job) return <div>Job not found</div>;

  return (
    <div className="flex gap-6 p-6">
      {/* Job Posting Details */}
      <div className="flex-1">
        {/* Job Title */}
        <div className="mb-4">
          <h3 className="text-lg font-bold">Job title</h3>
          <span className="text-2xl font-normal">{job.title}</span>
        </div>

        {/* Job Description */}
        <div className="mb-6">
          <h3 className="mb-2 text-xl font-semibold">Job Description</h3>
          <div className="text-gray-700">{parse(job.jobDescription)}</div>
        </div>

        {/* Candidate Requirements */}
        <div className="mb-6">
          <h3 className="mb-2 text-xl font-semibold">Candidate Requirements</h3>
          <div className="text-gray-700">
            {parse(job.candidateRequirements)}
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-6">
          <h3 className="mb-2 text-xl font-semibold">Benefits</h3>
          <div className="text-gray-700 rich-text-content">
            {parse(job.benefits)}
          </div>
        </div>

        {/* Working Hours */}
        <div className="mb-6">
          <h3 className="mb-2 text-xl font-semibold">
            Working Hours
          </h3>
          <div className="text-gray-700 rich-text-content">{parse(job.workingHours)}</div>
        </div>

        {/* Additional Information */}
        <div className="mb-6">
          <h3 className="mb-2 text-xl font-semibold">Additional Information</h3>
          <div className="text-gray-700">
            <p>
              <span className="font-semibold">Category:</span>{" "}
              {job.category.name}
            </p>
            <p>
              <span className="font-semibold">Position:</span>{" "}
              {job.position.name}
            </p>
            <p>
              <span className="font-semibold">Salary:</span> ${job.salary.min} -
              ${job.salary.max}
            </p>
            <p>
              <span className="font-semibold">Experience Level:</span>{" "}
              {job.experienceLevel.name}
            </p>
            <p>
              <span className="font-semibold">Required Skills:</span>{" "}
              {job.skills.map((item) => (
                <span
                  key={item.skillId}
                  className="px-2 py-1 mr-2 rounded bg-third text-primary"
                >
                  {item.skill.name}
                </span>
              ))}
            </p>
          </div>
        </div>

        {/* Basic Information */}
        <div className="mb-6">
          <p className="text-gray-600">
            <span className="font-semibold">Job Type:</span> {job.jobType}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Location:</span> {job.location}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Application Deadline:</span>{" "}
            {formatDate(job.expiresAt)}
          </p>
        </div>
      </div>

      {/* Company Information */}
      <div className="w-1/3">
        <div className="p-6 rounded-lg shadow-md bg-gray-50">
          <h2 className="mb-4 text-2xl font-semibold">Company Information</h2>
          <div className="flex flex-col gap-4 text-gray-700">
            <img
              src={job.company.logo}
              alt={`${job.company.name} logo`}
              className="object-cover w-40 h-40"
            />
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-semibold text-text-2">
                Company Name:
              </h3>
              <span className="text-xl font-medium">{job.company.name}</span>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-semibold text-text-2">Address:</h3>
              <span className="text-xl font-medium">
                {job.company.location}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-semibold text-text-2">Website:</h3>
              <a
                href={job.company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl font-medium hover:underline"
              >
                {job.company.website}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
