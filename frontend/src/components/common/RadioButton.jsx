import React from "react";

const RadioButton = ({
  label,
  description,
  name,
  value,
  checked,
  onChange,
}) => {
  return (
    <label className="flex flex-col space-y-1 cursor-pointer">
      <div className="flex space-x-3">
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={() => onChange(value)}
          className="hidden"
        />
        <div
          className={`w-5 h-5 rounded-full flex items-center justify-center ${
            checked
              ? "border-primary border-[6px]"
              : "border-gray-400 border-2 "
          }`}
        >
          {checked && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
        </div>
        <div className="">
          <span className="font-medium text-text-primary">{label}</span>
          {description && (
            <p className="text-base text-text-1">{description}</p>
          )}
        </div>
      </div>
    </label>
  );
};

export default RadioButton;
