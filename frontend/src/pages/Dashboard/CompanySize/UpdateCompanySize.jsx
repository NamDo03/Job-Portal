import React, { useEffect, useState } from "react";
import Input from "../../../components/common/Input";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../../components/loader/Loader";
import {
  getCompanySizeById,
  updateComanySize,
} from "../../../services/companySize";

const UpdateCompanySize = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCompanySize = async () => {
      setLoading(true);
      try {
        const data = await getCompanySizeById(id);
        if (data) {
          setMin(data.minEmployees);
          setMax(data.maxEmployees);
        } else {
          toast.error("Failed to load Company Size");
        }
      } catch (error) {
        console.error("API error:", error);
        toast.error("Failed to load Company Size list");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchCompanySize();
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
      const updatedCompanySize = await updateComanySize(id, minValue, maxValue);
      if (updatedCompanySize) {
        toast.success("Company Size updated successfully!");
        navigate("/admin/companySize/list");
      }
    } catch (err) {
      setMin("");
      setMax("");
      console.error("Error updating Company Size:", err.message);
      setError(err.message);
    }
  };
  return (
    <div className="flex flex-col gap-3">
      {loading && <Loader />}
      <h2 className="text-3xl font-semibold">Update Company Size</h2>
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

export default UpdateCompanySize;
