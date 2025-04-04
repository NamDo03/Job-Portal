import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Loader from "../components/loader/Loader";
import JobCard from "../components/card/JobCard";
import { toast } from "react-toastify";
import EmptyState from "../components/common/EmptyState";
import { FaCheckCircle } from "react-icons/fa";
import { getApplicationsByUserId } from "../services/application";
import Pagination from "../components/common/Pagination";
import { formatDate } from "../utils/dateUtils";
const AppliedJobs = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      if (!currentUser) {
        navigate("/login", { state: { from: "/applied-jobs" } });
        return;
      }

      try {
        setLoading(true);
        const applications = await getApplicationsByUserId(
          currentUser.id,
          currentPage
        );
        setAppliedJobs(applications.data);
        setTotalPages(applications.meta.totalPages);
      } catch (error) {
        console.error("Failed to fetch applied jobs:", error);
        toast.error("Failed to load applied jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, [currentUser, navigate, currentPage]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="py-8 min-h-[80vh] main-container">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary md:text-3xl">
          Your Applied Jobs
        </h1>
        <p className="text-text-2">
          {appliedJobs.length} {appliedJobs.length === 1 ? "job" : "jobs"}{" "}
          applied
        </p>
      </div>

      {appliedJobs.length === 0 ? (
        <EmptyState
          title="No applied jobs yet"
          description="Jobs you have applied to will appear here"
          icon={<FaCheckCircle size={48} className="text-gray-400" />}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
          {appliedJobs.map((application) => (
            <div
              key={application.id}
              className="relative bg-white border rounded-lg shadow-sm"
            >
              <JobCard job={application.job} hoverShadow={false} />
              <div className="py-3 mx-6 mt-2 text-base font-medium border-t-2 lg:mx-10">
                {application.status === "PENDING" && (
                  <span className="text-yellow-500">
                    You applied on {formatDate(application.appliedAt)}
                  </span>
                )}
                {application.status === "VIEWED" && (
                  <span className="text-blue-500">
                    Your application has been viewed
                  </span>
                )}
                {application.status === "ACCEPTED" && (
                  <span className="text-green-500">
                    Congratulations! Your application was accepted
                  </span>
                )}
                {application.status === "REJECTED" && (
                  <span className="text-red-500">
                    Unfortunately, your application was rejected
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default AppliedJobs;
