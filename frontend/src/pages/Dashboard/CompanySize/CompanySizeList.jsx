import React, { useEffect, useState } from "react";
import Table from "../../../components/common/Table";
import { IoMdSearch } from "react-icons/io";
import { toast } from "react-toastify";
import Loader from "../../../components/loader/Loader";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../../components/modal/ConfirmModal";
import { AnimatePresence } from "framer-motion";
import { deleteComanySize, getComanySize } from "../../../services/companySize";
import { useDebounce } from "../../../hooks/useDebounce";

const CompanySizeList = () => {
  const navigate = useNavigate();
  const [companySize, setCompanySize] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedCompanySize, setSelectedCompanySize] = useState(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  const fetchCompanySize = async () => {
    setLoading(true);
    try {
      const data = await getComanySize(currentPage, debouncedSearchTerm);
      if (data && data.companySizes) {
        setCompanySize(data.companySizes);
        setTotalPages(data.totalPages || 1);
        setTotalEntries(data.totalCompanySizes || 0);
      } else {
        setCompanySize([]);
        toast.error("Failed to load Company Size list");
      }
    } catch (error) {
      console.error("API error:", error);
      toast.error("Failed to load Company Size list");
      setCompanySize([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanySize();
  }, [debouncedSearchTerm, currentPage]);

  const handleEdit = (companySize) => {
    navigate(`/admin/companySize/edit/${companySize.id}`);
  };

  const handleDelete = async () => {
    if (!selectedCompanySize) return;
    setLoading(true);
    try {
      const data = await deleteComanySize(selectedCompanySize.id);
      if (data) {
        toast.success("Company Size deleted successfully!");
        setCompanySize((prevCompanySize) =>
          prevCompanySize.filter(
            (companySize) => companySize.id !== selectedCompanySize.id
          )
        );
        setIsConfirmOpen(false);
        setSelectedCompanySize(null);
        fetchCompanySize();
      } else {
        toast.error("Failed to delete company size");
      }
    } catch (error) {
      console.error("API error:", error);
      toast.error("Failed to delete company size");
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
      <h2 className="text-3xl font-semibold">Company size List</h2>
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
      {companySize.length > 0 ? (
        <Table
          columns={["Company size"]}
          data={companySize.map((companySize) => ({
            id: companySize.id,
            "Company size": `${companySize.minEmployees} - ${companySize.maxEmployees}`,
          }))}
          pageSize={8}
          currentPage={currentPage}
          totalPages={totalPages}
          totalEntries={totalEntries}
          onPageChange={setCurrentPage}
          onEdit={handleEdit}
          onDelete={(companySize) => {
            setSelectedCompanySize(companySize);
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

export default CompanySizeList;
