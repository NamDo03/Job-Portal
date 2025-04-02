import React, { useState } from "react";
import { toast } from "react-toastify";
import Input from "../../../components/common/Input";
import { hireUserByEmail } from "../../../services/company";
import { useSelector } from "react-redux";

const Recruitment = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleHireEmployee = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email) {
      toast.error("Please enter the employee's email.");
      setLoading(false);
      return;
    }

    try {
      const newMember = await hireUserByEmail(
        currentUser.companyMemberships[0].companyId,
        email
      );
      if (newMember) {
        toast.success("Employee hired successfully!");
        setEmail("");
        setError("");
        navigate("/recruiter-dashboard/company/employees");
      }
    } catch (err) {
      console.error("Error hiring employee:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-3xl font-semibold">Hire Employee</h2>
      <form onSubmit={handleHireEmployee} className="w-1/2">
        <Input
          label="Employee Email"
          type="email"
          name="email"
          value={email}
          error={error}
          placeholder="Enter employee's email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="flex justify-end mt-5">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 font-medium text-white transition-all duration-300 ease-out bg-blue-500 rounded-sm min-w-24 hover:bg-blue-600"
          >
            {loading ? "Hiring..." : "Hire Employee"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Recruitment;
