import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import { CategoryCard } from "../card/CategoryCard";
import Loader from "../loader/Loader";
import { getTopCategories } from "../../services/category";
import { toast } from "react-toastify";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getTopCategories();
        setCategories(data || []);
      } catch (error) {
        console.error("Error:", error);
        toast.error(error.message || "Failed to load top categories");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <Loader />;
  return (
    <div className="mt-16 main-container">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h2 className="text-2xl sm:text-3xl lg:text-5xl text-text-primary">
          Explore by <span className="text-ocean heading">category</span>
        </h2>
        <Link
          to="/jobs"
          className="flex items-center self-end gap-3 text-lg font-semibold text-primary sm:text-xl hover:text-primary/70"
        >
          Show all jobs <FaArrowRight />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 mt-12 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {categories.map((category) => (
          <CategoryCard data={category} key={category.id} />
        ))}
      </div>
    </div>
  );
};

export default Categories;
