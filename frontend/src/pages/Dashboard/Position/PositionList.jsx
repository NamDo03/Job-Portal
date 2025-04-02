import React, { useEffect, useState } from "react";
import Table from "../../../components/common/Table";
import { IoMdSearch } from "react-icons/io";
import { toast } from "react-toastify";
import Loader from "../../../components/loader/Loader";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../../components/modal/ConfirmModal";
import { AnimatePresence } from "framer-motion";
import { deletePosition, getPositions } from "../../../services/position";
import { useDebounce } from "../../../hooks/useDebounce";

const PositionList = () => {
  const navigate = useNavigate();
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  const fetchPositions = async () => {
    setLoading(true);
    try {
      const data = await getPositions(currentPage, debouncedSearchTerm);
      if (data && data.positions) {
        setPositions(data.positions);
        setTotalPages(data.totalPages || 1);
        setTotalEntries(data.totalPositions || 0);
      } else {
        setPositions([]);
        toast.error("Failed to load position list");
      }
    } catch (error) {
      console.error("API error:", error);
      toast.error("Failed to load position list");
      setPositions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, [debouncedSearchTerm, currentPage]);

  const handleEdit = (position) => {
    navigate(`/admin/position/edit/${position.id}`);
  };

  const handleDelete = async () => {
    if (!selectedPosition) return;
    setLoading(true);
    try {
      const data = await deletePosition(selectedPosition.id);
      if (data) {
        toast.success("Position deleted successfully!");
        setPositions((prevPositions) =>
          prevPositions.filter(
            (position) => position.id !== selectedPosition.id
          )
        );
        setIsConfirmOpen(false);
        setSelectedPosition(null);
        fetchPositions();
      } else {
        toast.error("Failed to delete position");
      }
    } catch (error) {
      console.error("API error:", error);
      toast.error("Failed to delete position");
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
      <h2 className="text-3xl font-semibold">Position List</h2>
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
      {positions.length > 0 ? (
        <Table
          columns={["name"]}
          data={positions}
          pageSize={8}
          currentPage={currentPage}
          totalPages={totalPages}
          totalEntries={totalEntries}
          onPageChange={setCurrentPage}
          onEdit={handleEdit}
          onDelete={(position) => {
            setSelectedPosition(position);
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

export default PositionList;
