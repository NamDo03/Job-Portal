import React, { useState } from "react";
import { MdClose } from "react-icons/md";

const MultiSelect = ({ label, options, selectedValues, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleSelect = (option) => {
    if (!selectedValues.some((item) => item.id === option.id)) {
      onChange([...selectedValues, option]);
    }
    setIsOpen(false);
  };

  const handleRemove = (id) => {
    onChange(selectedValues.filter((item) => item.id !== id));
  };
  return (
    <div className="relative w-full">
      {label && (
        <label className="text-base font-medium text-text-primary">
          {label}
        </label>
      )}
      <div
        className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[40px] bg-white cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedValues.length > 0 ? (
          selectedValues.map((item) => (
            <span
              key={item.id}
              className="flex items-center gap-1 px-2 py-1 text-base rounded-md bg-secondary text-primary"
            >
              {item.name}
              <button
                type="button"
                className="text-text-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(item.id);
                }}
              >
                <MdClose />
              </button>
            </span>
          ))
        ) : (
          <span className="text-gray-400">Select options...</span>
        )}
      </div>

      {/* Danh sách các lựa chọn */}
      {isOpen && (
        <ul className="absolute left-0 right-0 z-10 mt-1 overflow-y-auto bg-white border rounded-md shadow-md max-h-40">
          {options.map((option) => (
            <li
              key={option.id}
              className="p-2 cursor-pointer hover:bg-indigo-100"
              onClick={() => handleSelect(option)}
            >
              {option.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MultiSelect;
