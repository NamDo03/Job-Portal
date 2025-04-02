import React, { useEffect, useState } from "react";
import Table from "../../../components/common/Table";
import { IoMdSearch } from "react-icons/io";
import { toast } from "react-toastify";
import Loader from "../../../components/loader/Loader";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../../components/modal/ConfirmModal";
import { AnimatePresence } from "framer-motion";
import { deleteSalary, getSalaries } from "../../../services/salary";
import { useDebounce } from "../../../hooks/useDebounce";

const SalaryList = () => {
  const navigate = useNavigate();
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  const fetchSalaries = async () => {
    setLoading(true);
    try {
      const data = await getSalaries(currentPage, debouncedSearchTerm);
      if (data && data.salaries) {
        setSalaries(data.salaries);
        setTotalPages(data.totalPages || 1);
        setTotalEntries(data.totalSalaries || 0);
      } else {
        setSalaries([]);
        toast.error("Failed to load salary list");
      }
    } catch (error) {
      console.error("API error:", error);
      toast.error("Failed to load salary list");
      setSalaries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, [debouncedSearchTerm, currentPage]);

  const handleEdit = (salary) => {
    navigate(`/admin/salary/edit/${salary.id}`);
  };

  const handleDelete = async () => {
    if (!selectedSalary) return;
    setLoading(true);
    try {
      const data = await deleteSalary(selectedSalary.id);
      if (data) {
        toast.success("Salary deleted successfully!");
        setSalaries((prevSalaries) =>
          prevSalaries.filter((salary) => salary.id !== selectedSalary.id)
        );
        setIsConfirmOpen(false);
        setSelectedSalary(null);
        fetchSalaries();
      } else {
        toast.error("Failed to delete salary");
      }
    } catch (error) {
      console.error("API error:", error);
      toast.error("Failed to delete salary");
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
      <h2 className="text-3xl font-semibold">Salary List</h2>
      {/* Searching */}
      <div className="max-w-[40%]">
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
      {/* Table */}
      {salaries.length > 0 ? (
        <Table
          columns={["Salary Range"]}
          data={salaries.map((salary) => ({
            id: salary.id,
            "Salary Range": `${salary.min} - ${salary.max}`,
          }))}
          pageSize={8}
          currentPage={currentPage}
          totalPages={totalPages}
          totalEntries={totalEntries}
          onPageChange={setCurrentPage}
          onEdit={handleEdit}
          onDelete={(salary) => {
            setSelectedSalary(salary);
            setIsConfirmOpen(true);
          }}
          actions={["edit", "delete"]}
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

export default SalaryList;
