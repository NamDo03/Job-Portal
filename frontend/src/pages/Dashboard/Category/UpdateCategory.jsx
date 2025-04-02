import React, { useEffect, useState } from "react";
import Input from "../../../components/common/Input";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../../components/loader/Loader";
import { getCategoryById, updateCategory } from "../../../services/category";
import FileUpload from "../../../components/common/FileUpload";

const UpdateCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      try {
        const data = await getCategoryById(id);
        if (data) {
          setName(data.name);
          setImage(data.image);
        } else {
          toast.error("Failed to load category");
        }
      } catch (error) {
        console.error("API error:", error);
        toast.error("Failed to load category list");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchCategory();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!name.trim()) {
      setError("Category name is required!");
      return;
    }
    const formData = new FormData();
    formData.append("name", name);
    if (image) {
      formData.append("image", image);
    }
    try {
      const updatedCategory = await updateCategory(id, formData);
      if (updatedCategory) {
        toast.success("Category updated successfully!");
        navigate("/admin/category/list");
      }
    } catch (err) {
      setName("");
      setImage(null);
      console.error("Error updating category:", err.message);
      setError(err.message || "Failed to update category");
    } finally {
      setLoading(false)
    }
  };
  return (
    <div className="flex flex-col gap-3">
      {loading && <Loader />}
      <h2 className="text-3xl font-semibold">Update Category</h2>
      <form className="flex flex-col w-1/2 gap-5" onSubmit={handleSubmit}>
        <Input
          label="Name"
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <FileUpload
          label="Image"
          accept="image/*"
          onChange={setImage}
          initialFile={image}
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

export default UpdateCategory;
