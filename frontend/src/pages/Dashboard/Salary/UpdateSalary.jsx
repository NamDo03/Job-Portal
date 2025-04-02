import React, { useEffect, useState } from "react";
import Input from "../../../components/common/Input";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../../components/loader/Loader";
import { getSalaryById, updateSalary } from "../../../services/salary";

const UpdateSalary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSalary = async () => {
      setLoading(true);
      try {
        const data = await getSalaryById(id);
        if (data) {
          setMin(data.min);
          setMax(data.max);
        } else {
          toast.error("Failed to load salary");
        }
      } catch (error) {
        console.error("API error:", error);
        toast.error("Failed to load salary list");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchSalary();
    }
  }, [id]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const minValue = Number(min);
    const maxValue = Number(max);

    if (isNaN(minValue) || isNaN(maxValue)) {
      setError("Min & Max must be numbers!");
      return;
    }

    try {
      const updatedSalary = await updateSalary(id, minValue, maxValue);
      if (updatedSalary) {
        toast.success("Salary updated successfully!");
        navigate("/admin/salary/list");
      }
    } catch (err) {
      setMin("");
      setMax("");
      console.error("Error updating salary:", err.message);
      setError(err.message);
    }
  };
  return (
    <div className="flex flex-col gap-3">
      {loading && <Loader />}
      <h2 className="text-3xl font-semibold">Update Salary</h2>
      <form className="flex flex-col w-1/2 gap-5" onSubmit={handleSubmit}>
        <Input
          label="Min"
          type="text"
          name="min"
          value={min}
          onChange={(e) => setMin(e.target.value)}
        />
        <Input
          label="Max"
          type="text"
          name="max"
          value={max}
          onChange={(e) => setMax(e.target.value)}
        />
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex justify-end mt-5">
          <button
            type="submit"
            className="px-4 py-2 font-medium text-white transition-all duration-300 ease-out bg-blue-500 rounded-sm min-w-24 hover:bg-blue-600"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateSalary;
