import React, { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import { Link } from "react-router-dom";
import CardItem from "../card/CardItem";
import { getFeaturedJobs } from "../../services/job";
import { toast } from "react-toastify";
import Loader from "../loader/Loader";

const FeaturedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const latest = await getFeaturedJobs();
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

  if (loading) return <Loader />;
  return (
    <div className="mt-20 main-container">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h2 className="text-2xl sm:text-3xl lg:text-5xl text-text-primary">
          Featured <span className="text-ocean heading">jobs</span>
        </h2>
        <Link
          to="/jobs"
          className="flex items-center self-end gap-3 text-lg font-semibold text-primary sm:text-xl hover:text-primary/70"
        >
          Show all jobs <FaArrowRight />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 mt-12 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {jobs.map((job) => (
          <CardItem job={job} key={job.id} />
        ))}
      </div>
    </div>
  );
};

export default FeaturedJobs;
