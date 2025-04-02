import React, { useState } from "react";
import Input from "../../../components/common/Input";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { createSalary } from "../../../services/salary";

const AddSalary = () => {
  const navigate = useNavigate();
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    const minValue = Number(min);
    const maxValue = Number(max);

    if (isNaN(minValue) || isNaN(maxValue)) {
      setError("Min & Max must be numbers!");
      return;
    }

    try {
      const newSalary = await createSalary(minValue, maxValue);
      if (newSalary) {
        toast.success("Salary added successfully!");
        setMin("");
        setMax("");
        setError("");
        navigate("/admin/salary/list");
      }
    } catch (err) {
      console.error("Error adding salary:", err.message);
      setError(err.message);
    }
  };
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-3xl font-semibold">Create Salary</h2>
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
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSalary;
