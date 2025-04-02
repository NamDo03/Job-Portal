import React, { useEffect, useState } from "react";
import Table from "../../../components/common/Table";
import { IoMdSearch } from "react-icons/io";
import { toast } from "react-toastify";
import Loader from "../../../components/loader/Loader";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../../components/modal/ConfirmModal";
import { AnimatePresence } from "framer-motion";
import { deleteLevel, getLevels } from "../../../services/level";
import { useDebounce } from "../../../hooks/useDebounce";

const LevelList = () => {
  const navigate = useNavigate();
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  const fetchLevels = async () => {
    setLoading(true);
    try {
      const data = await getLevels(currentPage, debouncedSearchTerm);
      if (data && data.levels) {
        setLevels(data.levels);
        setTotalPages(data.totalPages || 1);
        setTotalEntries(data.totalLevels || 0);
      } else {
        setLevels([]);
        toast.error("Failed to load level list");
      }
    } catch (error) {
      console.error("API error:", error);
      toast.error("Failed to load level list");
      setLevels([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLevels();
  }, [debouncedSearchTerm, currentPage]);

  const handleEdit = (level) => {
    navigate(`/admin/level/edit/${level.id}`);
  };

  const handleDelete = async () => {
    if (!selectedLevel) return;
    setLoading(true);
    try {
      const data = await deleteLevel(selectedLevel.id);
      if (data) {
        toast.success("Level deleted successfully!");
        setLevels((prevLevels) =>
          prevLevels.filter((level) => level.id !== selectedLevel.id)
        );
        setIsConfirmOpen(false);
        setSelectedLevel(null);
        fetchLevels();
      } else {
        toast.error("Failed to delete level");
      }
    } catch (error) {
      console.error("API error:", error);
      toast.error("Failed to delete level");
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
      <h2 className="text-3xl font-semibold">Level List</h2>
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
      </div>

      {/* Table */}
      {levels.length > 0 ? (
        <Table
          columns={["name"]}
          data={levels}
          pageSize={8}
          currentPage={currentPage}
          totalPages={totalPages}
          totalEntries={totalEntries}
          onPageChange={setCurrentPage}
          onEdit={handleEdit}
          onDelete={(level) => {
            setSelectedLevel(level);
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

export default LevelList;
