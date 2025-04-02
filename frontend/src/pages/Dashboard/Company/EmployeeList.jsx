import React, { useEffect, useState } from "react";
import Table from "../../../components/common/Table";
import { IoMdSearch } from "react-icons/io";
import { toast } from "react-toastify";
import Loader from "../../../components/loader/Loader";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../../components/modal/ConfirmModal";
import { AnimatePresence } from "framer-motion";
import { deleteMember, getCompanyMembers } from "../../../services/company";
import { useSelector } from "react-redux";
import { useDebounce } from "../../../hooks/useDebounce";

const EmployeeList = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  const fetchUsers = async () => {
    if (!currentUser?.companyMemberships?.[0]?.companyId) {
      toast.error("Invalid company ID!");
      return;
    }
    setLoading(true);
    try {
      const data = await getCompanyMembers(
        currentUser.companyMemberships[0].companyId,
        currentPage,
        debouncedSearchTerm
      );
      if (data && data.data) {
        const formattedUsers = data.data.map((user) => ({
          avatar: user.user.avatar,
          email: user.user.email,
          fullname: user.user.fullname,
          gender: user.user.gender,
          role: user.role,
          id: user.user.id,
          companyId: user.companyId,
        }));
        setUsers(formattedUsers);
        setTotalPages(data.pagination.totalPages || 1);
        setTotalEntries(data.pagination.total || 0);
      } else {
        setUsers([]);
        toast.error("Failed to load user list");
      }
    } catch (error) {
      console.error("API error:", error);
      toast.error("Failed to load user list");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [debouncedSearchTerm, currentPage]);

  const handleEdit = (userId) => {
    navigate(`/recruiter-dashboard/company/employees/edit/${userId.id}`);
  };

  const removeMember = async () => {
    if (!selectedUser) return;

    try {
      if (selectedUser.role === "OWNER") {
        toast.error("Cannot delete the owner of the company!");
        setIsConfirmOpen(false);
        return;
      }

      await deleteMember(selectedUser.companyId, selectedUser.id);
      toast.success("Member deleted successfully!");

      setIsConfirmOpen(false);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting member:", error.message);
      toast.error("Failed to delete member");
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  return (
    <div className="flex flex-col gap-3 bg-white">
      {loading && <Loader />}
      <h2 className="text-3xl font-semibold">Member List</h2>
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
      {users.length > 0 ? (
        <Table
          columns={["avatar", "email", "fullname", "gender", "role"]}
          data={users}
          pageSize={8}
          currentPage={currentPage}
          totalPages={totalPages}
          totalEntries={totalEntries}
          onPageChange={setCurrentPage}
          onEdit={handleEdit}
          onDelete={(user) => {
            setSelectedUser(user);
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
            onConfirm={removeMember}
            title="Confirm Delete"
            message="Are you sure you want to delete this member?"
            confirmText="Delete"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmployeeList;
