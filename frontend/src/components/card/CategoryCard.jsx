import React from "react";
import { FaArrowRight } from "react-icons/fa6";
import { Link } from "react-router-dom";

export const CategoryCard = ({ data }) => {
  const path = `/jobs?categories=${data.id}`;

  return (
    <Link
      to={path}
      className="flex flex-col gap-8 p-8 duration-500 ease-in-out bg-white border cursor-pointer hover:bg-primary group"
    >
      <img src={data.image} className="object-cover w-12 h-12" alt={`${data.name} img`}/>
      <div className="flex flex-col gap-4">
        <h4 className="text-xl font-semibold text-text-primary group-hover:text-white">
          {data.name}
        </h4>
        <span className="flex items-center gap-4 text-lg text-text-2 group-hover:text-white">
          {data.jobCount} jobs available{" "}
          <FaArrowRight className="text-text-primary group-hover:text-white" />
        </span>
      </div>
    </Link>
  );
};
