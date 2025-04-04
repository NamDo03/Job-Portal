import React, { useCallback, useEffect, useState } from "react";
import { BsDot } from "react-icons/bs";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import JobDescription from "../components/jobDetail/JobDescription";
import JobInfo from "../components/jobDetail/JobInfo";
import CompanyInfo from "../components/jobDetail/CompanyInfo";
import ApplyJobModal from "../components/modal/ApplyJobModal";
import { AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getJobById } from "../services/job";
import Loader from "../components/loader/Loader";
import { formatJobType } from "../utils/jobTypeFormatter";
import { formatLocation } from "../utils/locationFormatter";
import { isJobSavedByUser, saveJob, unsaveJob } from "../services/savedJob";
import { toast } from "react-toastify";
import { hasUserApplied } from "../services/application";

const JobDetail = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { id } = useParams();

  const [job, setJob] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  const fetchJobDetails = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getJobById(Number(id));
      setJob(data);
    } catch (error) {
      console.error("Failed to fetch job details:", error);
      toast.error("Failed to load job details");
      navigate("/not-found", { replace: true });
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  const checkSavedStatus = useCallback(async () => {
    if (!currentUser?.id || !job?.id) return;

    try {
      const saved = await isJobSavedByUser(currentUser.id, job.id);
      setIsSaved(saved);
    } catch (error) {
      console.error("Failed to check saved status:", error);
      toast.error("Failed to check saved status");
    }
  }, [currentUser?.id, job?.id]);

  const checkApplicationStatus = useCallback(async () => {
    if (!currentUser?.id || !job?.id) return;

    try {
      const applied = await hasUserApplied(job.id);
      setHasApplied(applied);
    } catch (error) {
      console.error("Failed to check application status:", error);
      toast.error("Failed to check application status");
    }
  }, [currentUser?.id, job?.id]);

  useEffect(() => {
    fetchJobDetails();
  }, [fetchJobDetails]);

  useEffect(() => {
    checkSavedStatus();
  }, [checkSavedStatus]);

  useEffect(() => {
    checkApplicationStatus();
  }, [checkApplicationStatus]);

  const handleSaveToggle = async () => {
    if (!currentUser) {
      navigate("/login", { state: { from: `/jobs/${id}` } });
      return;
    }

    setSaving(true);
    try {
      if (isSaved) {
        await unsaveJob(currentUser.id, job.id);
        setIsSaved(false);
        toast.success("Job removed from saved list");
      } else {
        await saveJob(currentUser.id, job.id);
        setIsSaved(true);
        toast.success("Job saved successfully");
      }
    } catch (error) {
      console.error("Failed to toggle save:", error);
      toast.error(isSaved ? "Failed to unsave job" : "Failed to save job");
    } finally {
      setSaving(false);
    }
  };

  const handleApplyClick = () => {
    if (!currentUser) {
      navigate("/login", { state: { from: `/jobs/${id}` } });
    } else {
      setIsModalOpen(true);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!job) {
    return (
      <div className="flex items-center justify-center py-20 main-container">
        <p className="text-lg text-text-primary">Job not found</p>
      </div>
    );
  }
  return (
    <div>
      <div className="py-20 bg-sub-primary main-container">
        <div className="flex flex-col items-center justify-center gap-4 p-4 bg-white border lg:p-6 md:flex-row md:justify-between md:items-center">
          <div className="flex flex-row gap-6">
            <img
              src={job.company?.logo}
              alt={`${job.company?.name} Logo`}
              className="object-cover w-12 h-12 md:w-14 md:h-14 lg:w-20 lg:h-20"
            />
            <div className="flex flex-col justify-center">
              <h2 className="text-lg font-semibold md:text-xl lg:text-3xl text-text-primary">
                {job.title || "Job Title"}
              </h2>
              <span className="flex flex-row flex-wrap items-center text-lg text-text-1">
                {job.company?.name || "Company Name"}
                <BsDot />
                {formatLocation(job.company?.location) || "Location"} <BsDot />
                {formatJobType(job.jobType) || "Not specified"}
              </span>
            </div>
          </div>
          <div className="flex flex-row items-center gap-7">
            <button
              onClick={handleSaveToggle}
              disabled={loading}
              className="save-button"
            >
              {isSaved ? (
                <FaBookmark size={28} className="text-primary" />
              ) : (
                <FaRegBookmark size={28} className="text-text-2" />
              )}
            </button>
            <div className="w-[1px] h-11 bg-gray-200"></div>
            {!hasApplied ? (
              <button
                onClick={handleApplyClick}
                className="py-3 font-semibold text-white bg-primary px-14 hover:bg-primary/80"
              >
                Apply
              </button>
            ) : (
              <span className="py-3 font-semibold text-green-600">Applied</span>
            )}
          </div>
        </div>
      </div>
      <div className="main-container">
        <div className="flex flex-col gap-12 py-10 border-b-2 md:py-14 lg:py-16 lg:flex-row xl:gap-16">
          <div className="w-full lg:w-[65%] xl:w-[70%]">
            <JobDescription
              description={job.jobDescription || ""}
              requirements={job.candidateRequirements || ""}
              benefits={job.benefits || ""}
              workingHours={job.workingHours || ""}
            />
          </div>
          <div className="w-full lg:w-[35%] xl:w-[30%]">
            <JobInfo
              postedAt={job.postedAt}
              expiresAt={job.expiresAt}
              jobType={job.jobType}
              salary={job.salary}
              category={job.category}
              skills={job.skills}
              position={job.position}
              experienceLevel={job.experienceLevel}
            />
          </div>
        </div>
      </div>
      <div className="main-container">
        <CompanyInfo company={job.company} />
      </div>
      {isModalOpen && (
        <AnimatePresence>
          <ApplyJobModal
            onClose={() => setIsModalOpen(false)}
            job={job}
            setHasApplied={setHasApplied}
          />
        </AnimatePresence>
      )}
    </div>
  );
};

export default JobDetail;
