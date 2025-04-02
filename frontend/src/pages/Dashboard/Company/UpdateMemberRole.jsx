import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../../components/loader/Loader";
import Input from "../../../components/common/Input";
import { toast } from "react-toastify";
import { getUserById } from "../../../services/user";
import Select from "../../../components/common/Select";
import { roleMembership } from "../../../constants/constants";
import { updateMemberRole } from "../../../services/company";

const UpdateMemberRole = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    fullname: "",
    email: "",
    role: "",
    companyId: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userData = await getUserById(Number(id));
        if (userData) {
          setUser({
            fullname: userData.fullname,
            email: userData.email,
            role: userData.companyMemberships?.[0]?.role || "",
            companyId: userData.companyMemberships?.[0]?.companyId || null,
          });
        } else {
          toast.error("Error loading user information!");
        }
      } catch (error) {
        console.error("API error:", error);
        toast.error("Error loading data!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateMemberRole(Number(user.companyId), Number(id), user.role);
      toast.success("Role updated successfully!");
      navigate("/recruiter-dashboard/company/employees");
    } catch (error) {
      console.error("API error:", error);
      toast.error("Error updating role!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col gap-3">
      {loading && <Loader />}
      <h2 className="text-3xl font-semibold">Update Member Role</h2>
      <form className="flex flex-col w-1/2 gap-5" onSubmit={handleSubmit}>
        <Input
          label="Fullname"
          type="text"
          name="fullname"
          value={user.fullname}
          disabled
        />
        <Input
          label="Email"
          type="email"
          name="email"
          value={user.email}
          disabled
        />
        <Select
          label="Role"
          name="role"
          options={roleMembership}
          value={user.role}
          onChange={handleChange}
          disabled={false}
        />

        <div className="flex justify-end mt-5">
          <button
            type="submit"
            className="px-4 py-2 font-medium text-white transition-all duration-300 ease-out bg-blue-500 rounded-sm min-w-24 hover:bg-blue-600"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateMemberRole;
