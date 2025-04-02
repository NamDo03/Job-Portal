import React, { useEffect, useState } from "react";
import Table from "../../../components/common/Table";
import { IoMdSearch } from "react-icons/io";
import { deleteSkill, getSkills } from "../../../services/skill";
import { toast } from "react-toastify";
import Loader from "../../../components/loader/Loader";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../../components/modal/ConfirmModal";
import { AnimatePresence } from "framer-motion";
import { useDebounce } from "../../../hooks/useDebounce";

const SkillList = () => {
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const data = await getSkills(currentPage, 8, debouncedSearchTerm);
      if (data && data.skills) {
        setSkills(data.skills);
        setTotalPages(data.totalPages || 1);
        setTotalEntries(data.totalSkills || 0);
      } else {
        setSkills([]);
        toast.error("Failed to load skill list");
      }
    } catch (error) {
      console.error("API error:", error);
      toast.error("Failed to load skill list");
      setSkills([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, [debouncedSearchTerm, currentPage]);

  const handleEdit = (skill) => {
    navigate(`/admin/skill/edit/${skill.id}`);
  };

  const handleDelete = async () => {
    if (!selectedSkill) return;
    setLoading(true);
    try {
      const data = await deleteSkill(selectedSkill.id);
      if (data) {
        toast.success("Skill deleted successfully!");
        setSkills((prevSkills) =>
          prevSkills.filter((skill) => skill.id !== selectedSkill.id)
        );
        setIsConfirmOpen(false);
        setSelectedSkill(null);
        fetchSkills();
      } else {
        toast.error("Failed to delete skill");
      }
    } catch (error) {
      console.error("API error:", error);
      toast.error("Failed to delete skill");
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
      <h2 className="text-3xl font-semibold">Skill List</h2>
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
      {skills.length > 0 ? (
        <Table
          columns={["name"]}
          data={skills}
          pageSize={8}
          currentPage={currentPage}
          totalPages={totalPages}
          totalEntries={totalEntries}
          onPageChange={setCurrentPage}
          onEdit={handleEdit}
          onDelete={(skill) => {
            setSelectedSkill(skill);
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

export default SkillList;
