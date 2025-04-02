import React from "react";

const Select = React.forwardRef(
  ({ label, options, error, onChange, ...props }, ref) => {
    return (
      <div className="flex flex-col w-full gap-1">
        {label && (
          <label className="text-base font-medium text-text-primary">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            props.disabled ? "bg-gray-200 cursor-not-allowed" : "bg-white"
          }`}
          onChange={onChange}
          {...props}
        >
          {options.map((option, index) => (
            <option
              key={option.value || index}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

export default Select;
