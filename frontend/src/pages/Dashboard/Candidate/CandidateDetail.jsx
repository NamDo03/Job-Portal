import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../../../components/loader/Loader";
import { getApplicationById } from "../../../services/application";
import { formatDate } from "../../../utils/dateUtils";
import { formatJobType } from "../../../utils/jobTypeFormatter";
import { BsDot } from "react-icons/bs";
import { LuUser, LuPenLine } from "react-icons/lu";
import { MdOutlineEmail } from "react-icons/md";
const CandidateDetail = () => {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchCandidate = async () => {
      setLoading(true);
      const data = await getApplicationById(id);
      if (data) {
        setCandidate(data);
      } else {
        setError("Không tìm thấy ứng viên!");
      }
      setLoading(false);
    };

    if (id) {
      fetchCandidate();
    }
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Candidate Details</h2>
      <div className="flex gap-8">
        <div className="border w-[30%] p-6">
          {candidate ? (
            <div>
              <p>
                <span className="mr-2 font-medium">Status:</span>{" "}
                <span
                  className={`px-5 py-1.5 rounded-xl text-white font-medium ${
                    candidate.status.toLowerCase() === "accepted"
                      ? "bg-green-600"
                      : candidate.status.toLowerCase() === "pending"
                      ? "bg-yellow-500"
                      : candidate.status.toLowerCase() === "rejected"
                      ? "bg-red-500"
                      : candidate.status.toLowerCase() === "viewed"
                      ? "bg-blue-500"
                      : "bg-gray-500"
                  }`}
                >
                  {candidate.status}
                </span>
              </p>
              <div className="p-4 my-5 bg-sub-primary ">
                <div className="flex items-center justify-between pb-2 text-sm border-b-2">
                  <span className="text-text-primary">Applied Job</span>
                  <span className="text-text-2">
                    {formatDate(candidate.appliedAt)}
                  </span>
                </div>
                <div className="pt-3">
                  <strong> {candidate.job?.title}</strong>
                  <p className="flex items-center gap-1 text-sm">
                    {candidate.job?.category.name}
                    <BsDot />
                    <span className="text-text-1">
                      {formatJobType(candidate.job?.jobType)}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <MdOutlineEmail size={24} className="text-text-2" />
                <div className="flex flex-col">
                  <span className="text-text-2">Email</span>
                  <span className="text-text-primary">
                    {candidate.user.email}
                  </span>
                </div>
              </div>

              <div className="flex gap-4 mt-3 mb-5">
                <LuUser size={24} className="text-text-2" />
                <div className="flex flex-col">
                  <span className="text-text-2">Full Name</span>
                  <span className="text-text-primary">
                    {candidate.user.fullname}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p>No candidate information available.</p>
          )}
        </div>
        <div className="border w-[70%]">
          <h4 className="px-5 py-3 border-b">Resume</h4>
          <iframe
            src={candidate.resume}
            width="100%"
            height="700px"
            title="PDF Resume Preview"
            className="rounded-md"
          />
        </div>
      </div>
      {candidate.coverLetter && (
        <div className="mt-8">
          <span className="flex gap-3 mb-3 text-text-2">
            <LuPenLine size={24} />
            Cover Letter:
          </span>
          <p>{candidate.coverLetter}</p>
        </div>
      )}
    </div>
  );
};

export default CandidateDetail;
