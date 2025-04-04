import React, { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import { Link } from "react-router-dom";
import JobCard from "../card/JobCard";
import { getLatestJobs } from "../../services/job";
import { toast } from "react-toastify";
import JobCardSkeleton from "../skeleton/JobCardSkeleton";

const LastestJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const latest = await getLatestJobs();
        setJobs(latest || []);
      } catch (error) {
        console.error("Error:", error);
        toast.error(error.message || "Failed to load latest jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="mt-20 main-container bg-sub-primary py-14">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h2 className="text-2xl sm:text-3xl lg:text-5xl text-text-primary">
          Latest <span className="text-ocean heading">jobs open</span>
        </h2>
        <Link
          to="/jobs"
          className="flex items-center self-end gap-3 text-lg font-semibold text-primary sm:text-xl hover:text-primary/70"
        >
          Show all jobs <FaArrowRight />
        </Link>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 gap-8 mt-12 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <JobCardSkeleton key={index} />
          ))}
        </div>
      ) : jobs.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 mt-12 sm:grid-cols-2">
          {jobs.map((job) => (
            <JobCard job={job} key={job.id} />
          ))}
        </div>
      ) : (
        <div className="mt-12 text-center text-gray-500">
          No latest jobs available at the moment
        </div>
      )}
    </div>
  );
};

export default LastestJobs;
