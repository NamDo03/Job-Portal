import React, { useEffect, useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { toast } from "react-toastify";
import { AnimatePresence } from "framer-motion";
import Table from "../../../components/common/Table";
import Loader from "../../../components/loader/Loader";
import ConfirmModal from "../../../components/modal/ConfirmModal";
import { useDebounce } from "../../../hooks/useDebounce";
import Select from "../../../components/common/Select";
import { useSelector } from "react-redux";
import {
  changeApplicationStatus,
  getApplicationsByCompanyId,
} from "../../../services/application";
import { getJobsByCompany } from "../../../services/job";

const CandidateList = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [jobFilter, setJobFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [jobPostings, setJobPostings] = useState([]);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [newStatus, setNewStatus] = useState(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 1000);
  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const data = await getApplicationsByCompanyId(
        currentUser.companyMemberships[0].companyId,
        debouncedSearchTerm,
        jobFilter,
        statusFilter,
        currentPage
      );
      if (data) {
        const formattedCandidates = data.data.map((candidate) => ({
          id: candidate.id,
          email: candidate.email,
          fullname: candidate.fullname,
          jobId: candidate.jobId,
          jobTitle: candidate.job?.title || "N/A",
          status: candidate.status,
        }));
        setCandidates(formattedCandidates);
        setTotalPages(data.meta.totalPages || 1);
        setTotalEntries(data.meta.total || 0);
      } else {
        setCandidates([]);
        toast.error("Failed to load candidate list");
      }
    } catch (error) {
      console.error("API error:", error);
      toast.error("Failed to load candidate list");
    } finally {
      setLoading(false);
    }
  };
  const fetchJobPostings = async () => {
    if (
      !currentUser ||
      !currentUser.companyMemberships ||
      currentUser.companyMemberships.length === 0
    ) {
      toast.error("User is not associated with any company.");
      return;
    }
    setLoading(true);
    try {
      const data = await getJobsByCompany(
        currentUser.companyMemberships[0].companyId,
        1,
        false,
        "APPROVED",
        true
      );
      if (data) {
        setJobPostings(data.data);
      } else {
        setJobPostings([]);
        toast.error("Failed to load job posting list");
      }
    } catch (error) {
      console.error("API error:", error);
      toast.error("Failed to load job posting list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [debouncedSearchTerm, statusFilter, currentPage, jobFilter]);

  useEffect(() => {
    fetchJobPostings();
  }, []);
  const handleChangeStatus = async () => {
    if (!selectedApplication || !newStatus) return;
    setLoading(true);
    try {
      const data = await changeApplicationStatus(
        selectedApplication.id,
        newStatus
      );
      if (data) {
        toast.success(`Candidate status changed to ${newStatus} successfully!`);
        setIsConfirmOpen(false);
        setSelectedApplication(null);
        setNewStatus(null);
        fetchCompanies();
      } else {
        toast.error("Failed to change status candidate");
      }
    } catch (error) {
      console.error("API error:", error);
      toast.error("Failed to change status candidate");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col gap-3 bg-white">
      {loading && <Loader />}
      <h2 className="text-3xl font-semibold">Candidate List</h2>
      {/* Searching */}
      <div className="flex flex-row justify-between w-full">
        <div className="max-w-[35%] min-w-[35%]">
          <div className="flex items-center">
            <label htmlFor="simple-search" className="sr-only">
              Search
            </label>
            <div className="relative w-full h-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <IoMdSearch size={23} />
              </div>
              <input
                type="text"
                id="simple-search"
                name="search"
                className="block w-full p-2 pl-10 text-base text-gray-900 border border-gray-300 rounded bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter name or email candidates..."
                value={searchTerm}
                onChange={handleSearchInputChange}
              />
            </div>
          </div>
        </div>

        {/* Select Filter */}
        <div className="flex gap-20">
          <div className="flex items-center justify-center gap-5">
            <span className="text-lg font-normal">Job</span>
            <Select
              options={[
                { label: "All", value: "" },
                ...jobPostings.map((posting) => ({
                  label: posting.title,
                  value: posting.id,
                })),
              ]}
              value={jobFilter}
              onChange={(e) => {
                setJobFilter(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="flex items-center justify-center gap-5">
            <span className="text-lg font-normal">Status</span>
            <Select
              options={[
                { label: "All", value: "" },
                { label: "Pending", value: "PENDING" },
                { label: "Accepted", value: "ACCEPTED" },
                { label: "Viewed", value: "VIEWED" },
                { label: "Rejected", value: "REJECTED" },
              ]}
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      {candidates.length > 0 ? (
        <Table
          columns={["email", "fullname", "jobId", "jobTitle", "status"]}
          data={candidates}
          pageSize={8}
          currentPage={currentPage}
          totalPages={totalPages}
          totalEntries={totalEntries}
          onPageChange={setCurrentPage}
          onChangeStatus={(row, newStatus) => {
            setSelectedApplication(row);
            setNewStatus(newStatus);
            setIsConfirmOpen(true);
          }}
          actions={["applicationStatus"]}
        />
      ) : (
        <p className="mt-5 text-lg font-medium text-center text-gray-500">
          No results found.
        </p>
      )}
      <AnimatePresence mode="wait">
        {isConfirmOpen && (
          <ConfirmModal
            isOpen={isConfirmOpen}
            onClose={() => setIsConfirmOpen(false)}
            onConfirm={handleChangeStatus}
            title={`Confirm ${newStatus.toLowerCase()}`}
            message={`Are you sure you want to ${newStatus.toLowerCase()} this candidate?`}
            confirmText={newStatus}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CandidateList;
