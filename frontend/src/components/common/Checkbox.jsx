import React from "react";

const Checkbox = ({ content, checked, onChange, id = content }) => {
  return (
    <label
      htmlFor={id}
      className="flex items-center w-full px-3 py-2 cursor-pointer"
    >
      <div className="inline-flex items-center">
        <label
          className="relative flex items-center cursor-pointer"
          htmlFor={id}
        >
          <input
            type="checkbox"
            className="w-5 h-5 transition-all border-2 rounded shadow appearance-none cursor-pointer peer hover:shadow-md border-text-footer checked:bg-primary checked:border-primary"
            id={id}
            checked={checked}
            onChange={onChange}
          />
          <span className="absolute text-white transform -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 top-1/2 left-1/2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              viewBox="0 0 20 20"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
          </span>
        </label>
        <label
          className="ml-2 text-base cursor-pointer text-text-1"
          htmlFor={id}
        >
          {content}
        </label>
      </div>
    </label>
  );
};

export default Checkbox;
