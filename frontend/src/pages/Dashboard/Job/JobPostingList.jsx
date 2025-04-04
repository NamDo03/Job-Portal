import React, { useEffect, useState } from "react";
import Table from "../../../components/common/Table";
import { IoMdSearch } from "react-icons/io";
import { toast } from "react-toastify";
import Loader from "../../../components/loader/Loader";
import ConfirmModal from "../../../components/modal/ConfirmModal";
import { AnimatePresence } from "framer-motion";
import { deleteJob, getJobsByCompany } from "../../../services/job";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../../../hooks/useDebounce";
import Select from "../../../components/common/Select";

const JobPostingList = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [jobPostings, setJobPostings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedPosting, setSelectedPosting] = useState(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

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

  const handleDelete = async () => {
    if (!selectedPosting || !selectedPosting.id) {
      toast.error("No posting selected for deletion.");
      return;
    }
    setLoading(true);
    console.log(selectedPosting.id);
    try {
      const data = await deleteJob(selectedPosting.id);
      if (data) {
        toast.success("Posting deleted successfully!");
        setIsConfirmOpen(false);
        setSelectedPosting(null);
        fetchJobPostings();
      } else {
        toast.error("Failed to delete posting");
      }
    } catch (error) {
      console.error("API error:", error);
      toast.error("Failed to delete posting");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleInfo = (posting) => {
    navigate(`/recruiter-dashboard/job/${posting.id}`);
  };
  return (
    <div className="flex flex-col gap-3 bg-white">
      {loading && <Loader />}
      <h2 className="text-3xl font-semibold">Job Posting List</h2>
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
              { label: "Approved", value: "APPROVED" },
              { label: "Rejected", value: "REJECTED" },
              { label: "Pending", value: "PENDING" },
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
          columns={["id","title", "amount", "jobType", "status"]}
          data={jobPostings}
          pageSize={8}
          currentPage={currentPage}
          totalPages={totalPages}
          totalEntries={totalEntries}
          onPageChange={setCurrentPage}
          onInfo={(posting) => handleInfo(posting)}
          onDelete={(posting) => {
            setSelectedPosting(posting);
            setIsConfirmOpen(true);
          }}
          actions={["info", "delete"]}
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
            onConfirm={handleDelete}
            title="Delete Confirmation"
            message="Are you sure you want to delete this item?"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobPostingList;
