import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import RadioButton from "../common/RadioButton";
import { motion } from "framer-motion";
import {
  modalVariants,
  overlayVariants,
} from "../../animations/motionVariants";

const FilterModal = ({ onClose, filters, onFilterChange, dynamicOptions }) => {
  const [tempFilters, setTempFilters] = useState({
    employmentType: filters.employmentType,
    categories: filters.categories,
    levels: filters.levels,
    salaries: filters.salaries,
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const filterSections = [
    {
      key: "employmentType",
      title: "Type of Employment",
      options: [
        { label: "Full-Time", value: "FULL_TIME" },
        { label: "Part-Time", value: "PART_TIME" },
        { label: "Internship", value: "INTERNSHIP" },
        { label: "Remote", value: "REMOTE" },
      ],
    },
    {
      key: "categories",
      title: "Categories",
      options: dynamicOptions.categories || [],
    },
    {
      key: "levels",
      title: "Job Level",
      options: dynamicOptions.levels || [],
    },
    {
      key: "salaries",
      title: "Salary Range",
      options: dynamicOptions.salaries || [],
    },
  ];

  const handleOptionChange = (filterType, value) => {
    setTempFilters((prev) => ({
      ...prev,
      [filterType]: value === prev[filterType] ? null : value,
    }));
  };
  const handleApplyFilters = () => {
    const filtersToApply = {
      employmentType: tempFilters.employmentType,
      categories: tempFilters.categories,
      levels: tempFilters.levels,
      salaries: tempFilters.salaries,
    };

    onFilterChange(filtersToApply);
    onClose();
  };

  const handleClearAll = () => {
    const clearedFilters = {
      employmentType: null,
      categories: null,
      levels: null,
      salaries: null,
    };
    setTempFilters(clearedFilters);
  };

  return (
    <motion.div
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onClose}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]"
    >
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white w-[95%] h-[95%] p-4 rounded-lg shadow-lg relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Filter Modal Header - Cố định */}
        <div className="flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute text-gray-500 top-4 right-4 hover:text-black"
          >
            <MdClose size={30} />
          </button>
          <h2 className="mb-2 text-xl font-bold">Filters</h2>
        </div>

        {/* Filter Sections - Có thể scroll */}
        <div className="flex-1 py-2 overflow-y-auto">
          <div className="flex flex-col gap-6">
            {filterSections.map((section) => (
              <div key={section.key} className="flex flex-col gap-2">
                <h5 className="text-base font-semibold text-text-primary">
                  {section.title}
                </h5>
                <div className="flex flex-col gap-2">
                  {section.options.length > 0 ? (
                    section.options.map((option) => (
                      <div
                        key={`${section.key}-${option.value}`}
                        className="flex items-center w-full p-0 transition-all rounded-lg hover:bg-slate-100"
                      >
                        <RadioButton
                          label={option.label}
                          name={section.key}
                          value={option.value}
                          checked={tempFilters[section.key] === option.value}
                          onChange={() =>
                            handleOptionChange(section.key, option.value)
                          }
                        />
                      </div>
                    ))
                  ) : (
                    <div className="flex justify-center py-2">
                      <span className="text-text-2">No options available</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer với nút Apply - Cố định */}
        <div className="flex-shrink-0 pt-4 border-t">
          <div className="flex items-center justify-between mt-2">
            <button
              onClick={handleClearAll}
              className="px-4 py-2 font-semibold text-blue-600 rounded-lg hover:bg-blue-50"
            >
              Reset Filters
            </button>
            <button
              onClick={handleApplyFilters}
              className="px-6 py-2 font-semibold text-white rounded-lg bg-primary hover:bg-primary/80"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FilterModal;
