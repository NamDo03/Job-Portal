import React, { useState } from "react";
import Input from "../../../components/common/Input";
import { toast } from "react-toastify";
import { createSkill } from "../../../services/skill";
import { useNavigate } from "react-router-dom";

const AddSkill = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Skill name is required!");
      return;
    }

    try {
      const newSkill = await createSkill(name);
      if (newSkill) {
        toast.success("Skill added successfully!");
        setName("");
        setError("");
        navigate("/admin/skill/list");
      }
    } catch (err) {
      setName("");
      console.error("Error adding skill:", err.message);
      setError(err.message);
    }
  };
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-3xl font-semibold">Create Skill</h2>
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
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSkill;
