import React, { useState } from "react";
import Checkbox from "../common/Checkbox";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import RadioButton from "../common/RadioButton";

const CompanyFilter = ({
  filters,
  onFilterChange,
  onClearAll,
  companySizes,
}) => {
  const [openedSections, setOpenedSections] = useState({
    companySize: false,
  });

  const toggleSection = (section) => {
    setOpenedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <aside className="hidden lg:flex flex-col w-[30%] 2xl:w-[20%] p-6 sticky top-24 h-full">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-lg font-semibold">Filters</h4>
        <button
          onClick={onClearAll}
          className="text-sm text-primary hover:text-primary-dark"
          disabled={
            !filters.companyName && !filters.location && !filters.companySize
          }
        >
          Clear all
        </button>
      </div>

      {/* Company Size Filter Section */}
      <div className="mb-6">
        <div
          className="flex items-center justify-between mb-3 cursor-pointer"
          onClick={() => toggleSection("companySize")}
          aria-expanded={openedSections.companySize}
        >
          <h5 className="text-base font-semibold text-text-primary">
            Company Size
          </h5>
          {openedSections.companySize ? <IoChevronDown /> : <IoChevronUp />}
        </div>

        {!openedSections.companySize && companySizes.length > 0 && (
          <div className="space-y-2">
            {companySizes.map((size) => (
              <div
                key={`companySize-${size.value}`}
                className="flex items-center w-full p-0 transition-all rounded-lg hover:bg-slate-100"
              >
                <RadioButton
                  label={size.label}
                  name="companySize"
                  value={size.value}
                  checked={filters.companySize === size.value}
                  onChange={() => onFilterChange("companySize", size.value)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default CompanyFilter;
