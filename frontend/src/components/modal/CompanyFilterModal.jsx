import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import RadioButton from "../common/RadioButton";
import { motion } from "framer-motion";
import {
  modalVariants,
  overlayVariants,
} from "../../animations/motionVariants";

const CompanyFilterModal = ({
  onClose,
  filters,
  onFilterChange,
  companySizes,
}) => {
  const [tempFilters, setTempFilters] = useState({
    companySize: filters.companySize || null,
  });

  const handleRadioChange = (value) => {
    setTempFilters({
      companySize: value === tempFilters.companySize ? null : value,
    });
  };

  const resetFilters = () => {
    setTempFilters({
      companySize: null,
    });
  };

  const handleApplyFilters = () => {
    onFilterChange("companySize", tempFilters.companySize);
    onClose();
  };

  return (
    <motion.div
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]"
    >
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white w-[95%] max-w-md h-[80%] p-6 rounded-lg shadow-lg relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Filter Modal Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-text-primary">Filters</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <MdClose size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Company Size Filter */}
          <div className="mb-6">
            <h5 className="mb-3 text-base font-semibold text-text-primary">
              Company Size
            </h5>
            <div className="space-y-2">
              {companySizes.map((size) => (
                <div key={`modal-${size.value}`} className="flex items-center">
                  <RadioButton
                    label={size.label}
                    name="companySize"
                    value={size.value}
                    checked={tempFilters.companySize === size.value}
                    onChange={() => handleRadioChange(size.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer with action buttons */}
        <div className="flex items-center justify-between pt-4 border-t">
          <button
            onClick={resetFilters}
            className="font-semibold text-blue-600 hover:text-blue-800"
          >
            Reset Filters
          </button>
          <button
            onClick={handleApplyFilters}
            className="px-5 py-2 font-semibold text-white rounded-lg bg-primary hover:bg-primary/80"
          >
            Apply Filters
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CompanyFilterModal;
