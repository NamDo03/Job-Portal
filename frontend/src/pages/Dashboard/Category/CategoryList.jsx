import React, { useEffect, useState } from "react";
import Table from "../../../components/common/Table";
import { IoMdSearch } from "react-icons/io";
import { toast } from "react-toastify";
import Loader from "../../../components/loader/Loader";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../../components/modal/ConfirmModal";
import { AnimatePresence } from "framer-motion";
import { deleteCategory, getCategories } from "../../../services/category";
import { useDebounce } from "../../../hooks/useDebounce";

const CategoryList = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories(currentPage, debouncedSearchTerm);
      if (data && data.categories) {
        setCategories(data.categories);
        setTotalPages(data.totalPages || 1);
        setTotalEntries(data.totalCategories || 0);
      } else {
        setCategories([]);
        toast.error("Failed to load category list");
      }
    } catch (error) {
      console.error("API error:", error);
      toast.error("Failed to load category list");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [debouncedSearchTerm, currentPage]);

  const handleEdit = (category) => {
    navigate(`/admin/category/edit/${category.id}`);
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;
    setLoading(true);
    try {
      const data = await deleteCategory(selectedCategory.id);
      if (data) {
        toast.success("Category deleted successfully!");
        setIsConfirmOpen(false);
        setSelectedCategory(null);
        fetchCategories();
      } else {
        toast.error("Failed to delete category");
      }
    } catch (error) {
      console.error("API error:", error);
      toast.error("Failed to delete category");
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
      <h2 className="text-3xl font-semibold">Category List</h2>
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
      {categories.length > 0 ? (
        <Table
          columns={["name", "image"]}
          data={categories}
          pageSize={8}
          currentPage={currentPage}
          totalPages={totalPages}
          totalEntries={totalEntries}
          onPageChange={setCurrentPage}
          onEdit={handleEdit}
          onDelete={(category) => {
            setSelectedCategory(category);
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

export default CategoryList;
