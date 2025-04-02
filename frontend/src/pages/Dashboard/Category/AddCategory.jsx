import React, { useState } from "react";
import Input from "../../../components/common/Input";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { createCategory } from "../../../services/category";
import FileUpload from "../../../components/common/FileUpload";
import Loader from "../../../components/loader/Loader";

const AddCategory = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!name.trim()) {
      setError("Category name is required!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    if (name) formData.append("name", name);
    if (image) formData.append("image", image);

    try {
      const newCategory = await createCategory(formData);
      if (newCategory) {
        toast.success("Category added successfully!");
        setName("");
        setImage(null);
        setError("");
        navigate("/admin/category/list");
      }
    } catch (err) {
      setName("");
      console.error("Error adding category:", err.message);
      setError(err.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col gap-3">
      {loading && <Loader />}
      <h2 className="text-3xl font-semibold">Create Category</h2>
      <form className="flex flex-col w-1/2 gap-5" onSubmit={handleSubmit}>
        <Input
          label="Name"
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <FileUpload label="Image" accept="image/*" onChange={setImage} />
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

export default AddCategory;
