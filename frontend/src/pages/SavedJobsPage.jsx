import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { getSavedJobsByUser, unsaveJob } from "../services/savedJob";
import JobCard from "../components/card/JobCard";
import { toast } from "react-toastify";
import EmptyState from "../components/common/EmptyState";
import JobCardSkeleton from "../components/skeleton/JobCardSkeleton";

const SavedJobsPage = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unsavingId, setUnsavingId] = useState(null);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (!currentUser) {
        navigate("/login", { state: { from: "/saved-jobs" } });
        return;
      }

      try {
        setLoading(true);
        const jobs = await getSavedJobsByUser(currentUser.id);
        setSavedJobs(jobs);
      } catch (error) {
        console.error("Failed to fetch saved jobs:", error);
        toast.error("Failed to load saved jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, [currentUser, navigate]);

  const handleUnsaveJob = async (jobId) => {
    if (!currentUser) return;

    try {
      setUnsavingId(jobId);
      await unsaveJob(currentUser.id, jobId);
      setSavedJobs(savedJobs.filter((savedJob) => savedJob.job.id !== jobId));
      toast.success("Job removed from saved list");
    } catch (error) {
      console.error("Failed to unsave job:", error);
      toast.error("Failed to remove job from saved list");
    } finally {
      setUnsavingId(null);
    }
  };

  return (
    <div className="py-8 min-h-[80vh] main-container">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary md:text-3xl">
          Your Saved Jobs
        </h1>
        <p className="text-text-2">
          {savedJobs.length} {savedJobs.length === 1 ? "job" : "jobs"} saved
        </p>
      </div>

      {savedJobs.length === 0 ? (
        <EmptyState
          title="No saved jobs yet"
          description="Save jobs you're interested in to view them here later"
          icon={<FaRegBookmark size={48} className="text-gray-400" />}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <JobCardSkeleton key={index} />
              ))
            : savedJobs.map((savedJob) => (
                <div
                  key={savedJob.id}
                  className="relative bg-white border rounded-lg shadow-sm"
                >
                  <JobCard job={savedJob.job} />
                  <button
                    onClick={() => handleUnsaveJob(savedJob.job.id)}
                    disabled={unsavingId === savedJob.job.id}
                    className="absolute flex items-center gap-2 p-2 text-sm text-gray-600 transition-colors rounded-md top-4 right-4 hover:bg-gray-50 hover:text-primary"
                    aria-label="Unsave job"
                  >
                    {unsavingId === savedJob.job.id ? (
                      "Removing..."
                    ) : (
                      <>
                        <FaBookmark className="text-primary" size={22} />
                        <span className="hidden sm:inline">Saved</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobsPage;
