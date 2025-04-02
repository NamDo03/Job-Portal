import React from "react";

const Input = React.forwardRef(
  ({ label, type = "text", error, required = false, ...props }, ref) => {
    return (
      <div className={`flex w-full gap-1 flex-col`}>
        {label && (
          <label className="text-base font-medium text-text-primary">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <input
          type={type}
          ref={ref}
          className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            props.disabled ? "bg-gray-200 cursor-not-allowed opacity-50" : ""
          } ${error ? "border-red-500" : "border-gray-300"}`}
          {...props}
        />
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
    );
  }
);

export default Input;
