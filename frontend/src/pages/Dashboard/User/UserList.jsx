import React, { useEffect, useState } from "react";
import Table from "../../../components/common/Table";
import { IoMdSearch } from "react-icons/io";
import { toast } from "react-toastify";
import Loader from "../../../components/loader/Loader";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../../components/modal/ConfirmModal";
import { AnimatePresence } from "framer-motion";
import { changeUserStatus, getUsers } from "../../../services/user";
import Select from "../../../components/common/Select";
import { useDebounce } from "../../../hooks/useDebounce";

const UserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers(
        currentPage,
        debouncedSearchTerm,
        statusFilter
      );
      if (data?.users) {
        setUsers(data.users);
        setTotalPages(data.totalPages || 1);
        setTotalEntries(data.totalUsers || 0);
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
  }, [debouncedSearchTerm, statusFilter, currentPage]);

  const handleEdit = (user) => {
    navigate(`/admin/user/edit/${user.id}`);
  };

  const handleChangeStatus = async () => {
    if (!selectedUser) return;
    setLoading(true);
    try {
      const data = await changeUserStatus(selectedUser.id);
      if (data) {
        toast.success("Changed status user successfully!");
        setIsConfirmOpen(false);
        setSelectedUser(null);
        fetchUsers();
      } else {
        toast.error("Failed to change status user");
      }
    } catch (error) {
      console.error("API error:", error);
      toast.error("Failed to change status user");
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
      <h2 className="text-3xl font-semibold">User List</h2>
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
              { label: "Active", value: "ACTIVE" },
              { label: "Blocked", value: "BLOCKED" },
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
      {users.length > 0 ? (
        <Table
          columns={["avatar", "email", "fullname", "gender", "role", "status"]}
          data={users}
          pageSize={8}
          currentPage={currentPage}
          totalPages={totalPages}
          totalEntries={totalEntries}
          onPageChange={setCurrentPage}
          onEdit={handleEdit}
          onChangeStatus={(user) => {
            setSelectedUser(user);
            setIsConfirmOpen(true);
          }}
          actions={["edit", "blocked"]}
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
            title={
              selectedUser?.status === "BLOCKED"
                ? "Confirm Unblock"
                : "Confirm Block"
            }
            message={
              selectedUser?.status === "BLOCKED"
                ? "Are you sure you want to unblock this user?"
                : "Are you sure you want to block this user?"
            }
            confirmText={
              selectedUser?.status === "BLOCKED" ? "Unblock" : "Block"
            }
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserList;
