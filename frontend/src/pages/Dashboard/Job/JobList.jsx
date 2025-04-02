import React, { useEffect, useState } from "react";
import Table from "../../../components/common/Table";
import { IoMdSearch } from "react-icons/io";
import { toast } from "react-toastify";
import Loader from "../../../components/loader/Loader";
import ConfirmModal from "../../../components/modal/ConfirmModal";
import { AnimatePresence } from "framer-motion";
import { changeJobStatus, getJobs } from "../../../services/job";
import { useDebounce } from "../../../hooks/useDebounce";
import Select from "../../../components/common/Select";

const JobList = () => {
  const [jobPostings, setJobPostings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [newStatus, setNewStatus] = useState(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  const fetchJobPostings = async () => {
    setLoading(true);
    try {
      const data = await getJobs(
        currentPage,
        debouncedSearchTerm,
        statusFilter
      );
      if (data) {
        setJobPostings(data.data);
        setTotalPages(data.pagination.totalPages || 1);
        setTotalEntries(data.pagination.total || 0);
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
    fetchJobPostings();
  }, [debouncedSearchTerm, statusFilter, currentPage]);

  const handleChangeStatus = async () => {
    if (!selectedJob || !newStatus) return;
    setLoading(true);
    try {
      const data = await changeJobStatus(selectedJob.id, newStatus);
      if (data) {
        toast.success(`Job status changed to ${newStatus} successfully!`);
        setIsConfirmOpen(false);
        setSelectedJob(null);
        setNewStatus(null);
        fetchJobPostings();
      } else {
        toast.error("Failed to change status job");
      }
    } catch (error) {
      console.error("API error:", error);
      toast.error("Failed to change status job");
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
      <h2 className="text-3xl font-semibold">Job List</h2>
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
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchInputChange}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-5">
          <span className="text-lg font-normal">Status</span>
          <Select
            options={[
              { label: "All", value: "" },
              { label: "Pending", value: "PENDING" },
              { label: "Approved", value: "APPROVED" },
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

      {/* Table */}
      {jobPostings.length > 0 ? (
        <Table
          columns={["title", "amount", "jobType", "status"]}
          data={jobPostings}
          pageSize={8}
          currentPage={currentPage}
          totalPages={totalPages}
          totalEntries={totalEntries}
          onPageChange={setCurrentPage}
          onChangeStatus={(row, newStatus) => {
            setSelectedJob(row);
            setNewStatus(newStatus);
            setIsConfirmOpen(true);
          }}
          actions={["jobStatus"]}
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
            title="Change Status Confirmation"
            message={`Are you sure you want to change the status of this job to ${newStatus}?`}
            confirmText="Change Status"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobList;
