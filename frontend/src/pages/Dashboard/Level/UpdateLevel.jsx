import React, { useEffect, useState } from "react";
import Input from "../../../components/common/Input";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../../components/loader/Loader";
import { getLevelById, updateLevel } from "../../../services/level";

const UpdateLevel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLevel = async () => {
      setLoading(true);
      try {
        const data = await getLevelById(id);
        if (data) {
          setName(data.name);
        } else {
          toast.error("Failed to load level");
        }
      } catch (error) {
        console.error("API error:", error);
        toast.error("Failed to load level list");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchLevel();
    }
  }, [id]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Level name is required!");
      return;
    }

    try {
      const updatedLevel = await updateLevel(id, name);
      if (updatedLevel) {
        toast.success("Level updated successfully!");
        navigate("/admin/level/list");
      }
    } catch (err) {
      setName("");
      console.error("Error updating level:", err.message);
      setError(err.message);
    }
  };
  return (
    <div className="flex flex-col gap-3">
      {loading && <Loader />}
      <h2 className="text-3xl font-semibold">Update Level</h2>
      <form className="w-1/2" onSubmit={handleSubmit}>
        <Input
          label="Name"
          type="text"
          name="name"
          value={name}
          error={error}
          onChange={(e) => setName(e.target.value)}
        />
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

export default UpdateLevel;
