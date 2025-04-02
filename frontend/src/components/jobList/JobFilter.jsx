// JobFilter.jsx
import React, { useState } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import RadioButton from "../common/RadioButton";

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
  },
  {
    key: "levels",
    title: "Job Level",
  },
  {
    key: "salaries",
    title: "Salary Range",
  },
];

const JobFilter = ({ filters, onFilterChange, onClearAll, dynamicOptions }) => {
  const [openedSections, setOpenedSections] = useState({
    employmentType: false,
    categories: false,
    levels: false,
    salaries: false,
  });

  const toggleSection = (section) => {
    setOpenedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getSectionOptions = (section) => {
    if (section.key === "employmentType") return section.options;
    return dynamicOptions[section.key] || [];
  };

  return (
    <aside className="hidden lg:flex flex-col w-[30%] 2xl:w-[20%] p-6 sticky top-24 h-full">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-lg font-semibold">Filters</h4>
        <button
          onClick={onClearAll}
          className="text-sm text-primary hover:text-primary-dark"
          disabled={!Object.values(filters).some(Boolean)}
        >
          Clear all
        </button>
      </div>

      {filterSections.map((section) => {
        const options = getSectionOptions(section);
        const isOpen = openedSections[section.key];

        return (
          <div key={section.key} className="mb-6">
            <div
              className="flex items-center justify-between mb-3 cursor-pointer"
              onClick={() => toggleSection(section.key)}
              aria-expanded={isOpen}
            >
              <h5 className="text-base font-semibold text-text-primary">
                {section.title}
              </h5>
              {isOpen ? <IoChevronDown /> : <IoChevronUp />}
            </div>

            {!isOpen && (
              <div className="space-y-2">
                {options.length > 0 ? (
                  options.map((option) => (
                    <div
                      key={`${section.key}-${option.value}`}
                      className="flex items-center w-full p-0 transition-all rounded-lg hover:bg-slate-100"
                    >
                      <RadioButton
                        label={option.label}
                        name={section.key}
                        value={option.value}
                        checked={filters[section.key] === option.value}
                        onChange={() =>
                          onFilterChange(section.key, option.value)
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
            )}
          </div>
        );
      })}
    </aside>
  );
};

export default JobFilter;