import React from "react";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import avatar_default from "../../assets/default_user_avatar.png";
import { MdBlock } from "react-icons/md";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import CompanyStatusAction from "./CompanyStatusAction";
import JobStatusAction from "./JobStatusAction";
import { FaInfo } from "react-icons/fa";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import ApplicationStatus from "./ApplicationStatus";

const Table = ({
  columns,
  data,
  pageSize,
  currentPage,
  totalPages,
  totalEntries,
  onPageChange,
  onEdit,
  onDelete,
  onChangeStatus,
  onInfo,
  actions,
}) => {
  const generatePageNumbers = () => {
    const range = [];
    const maxPagesToShow = 5;
    let start = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let end = Math.min(totalPages, start + maxPagesToShow - 1);

    if (end - start + 1 < maxPagesToShow) {
      start = Math.max(1, end - maxPagesToShow + 1);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  };

  return (
    <>
      <div className="relative overflow-x-auto border shadow-[0_2px_10px_rgb(0,0,0,0.2)] rounded-xl border-text-footer mt-3">
        <table className="w-full text-base text-left text-gray-500">
          <thead className="text-base capitalize border-b text-text-1 border-blue-gray-100 bg-[#ECEFF1]">
            <tr>
              <th className="px-6 py-3 font-semibold text-left">#</th>
              {columns.map((col) => (
                <th key={col} className="px-6 py-3 font-semibold">
                  {col}
                </th>
              ))}
              {actions && actions.length > 0 && (
                <th className="px-6 py-3 font-semibold">Action</th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={row.id || index}
                className="bg-white border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="px-6 py-4 text-gray-800">
                  {(currentPage - 1) * pageSize + index + 1}
                </td>
                {/* Index */}
                {columns.map((col, colIndex) => (
                  <td key={`${col}-${index}`} className="px-6 py-4 font-medium">
                    {col === "image" || col === "avatar" || col === "logo" ? (
                      <img
                        src={row[col] || avatar_default}
                        alt={col}
                        className="object-cover w-24 h-20 rounded"
                      />
                    ) : col === "status" ? (
                      <span
                        className={`px-5 py-1.5 rounded-xl text-white ${
                          row[col].toLowerCase() === "active" ||
                          row[col].toLowerCase() === "accepted" ||
                          row[col].toLowerCase() === "approved"
                            ? "bg-green-600"
                            : row[col].toLowerCase() === "pending"
                            ? "bg-yellow-500"
                            : row[col].toLowerCase() === "blocked" ||
                              row[col].toLowerCase() === "rejected"
                            ? "bg-red-500"
                            : row[col].toLowerCase() === "viewed"
                            ? "bg-blue-500"
                            : "bg-gray-500"
                        }`}
                      >
                        {row[col]}
                      </span>
                    ) : (
                      row[col]
                    )}
                  </td>
                ))}

                {actions && actions.length > 0 && (
                  <td className="flex items-center gap-5 px-6 py-4">
                    {actions.includes("info") && (
                      <Tippy content="Info">
                        <button
                          onClick={() => onInfo(row)}
                          className="p-2 text-white transition bg-blue-500 rounded hover:bg-blue-600"
                        >
                          <FaInfo />
                        </button>
                      </Tippy>
                    )}
                    {actions.includes("edit") && (
                      <Tippy content="Edit">
                        <button
                          onClick={() => onEdit(row)}
                          className="p-2 text-white transition bg-blue-500 rounded hover:bg-blue-600"
                        >
                          <FiEdit />
                        </button>
                      </Tippy>
                    )}
                    {actions.includes("delete") && (
                      <Tippy content="Delete">
                        <button
                          onClick={() => onDelete(row)}
                          disabled={row.role === "OWNER"}
                          className={`p-2 text-white transition bg-red-500 rounded hover:bg-red-600 ${
                            row.role === "OWNER"
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <FiTrash2 />
                        </button>
                      </Tippy>
                    )}
                    {actions.includes("blocked") &&
                      (row.status === "BLOCKED" ? (
                        <Tippy content="Approve">
                          <button
                            onClick={() => onChangeStatus(row)}
                            className="p-2 text-white transition bg-green-500 rounded hover:bg-green-600"
                          >
                            <IoMdCheckmarkCircleOutline />
                          </button>
                        </Tippy>
                      ) : (
                        <Tippy content="Block">
                          <button
                            onClick={() => onChangeStatus(row)}
                            className="p-2 text-white transition bg-orange-500 rounded hover:bg-orange-600"
                          >
                            <MdBlock />
                          </button>
                        </Tippy>
                      ))}

                    {actions.includes("jobStatus") && (
                      <JobStatusAction
                        row={row}
                        onChangeStatus={(newStatus) => {
                          if (onChangeStatus) {
                            onChangeStatus(row, newStatus);
                          }
                        }}
                      />
                    )}

                    {actions.includes("companyStatus") && (
                      <CompanyStatusAction
                        row={row}
                        onChangeStatus={(newStatus) => {
                          if (onChangeStatus) {
                            onChangeStatus(row, newStatus);
                          }
                        }}
                      />
                    )}

                    {actions.includes("applicationStatus") && (
                      <ApplicationStatus
                        row={row}
                        onChangeStatus={(newStatus) => {
                          if (onChangeStatus) {
                            onChangeStatus(row, newStatus);
                          }
                        }}
                      />
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination  */}
      <nav
        className="flex flex-col items-start justify-between p-4 space-y-3 md:flex-row md:items-center md:space-y-0"
        aria-label="Table navigation"
      >
        <span className="text-sm font-normal text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-900">
            {(currentPage - 1) * pageSize + 1} -{" "}
            {Math.min(currentPage * pageSize, totalEntries)}
          </span>{" "}
          of <span className="font-semibold text-gray-900">{totalEntries}</span>
        </span>
        {totalPages > 1 && (
          <ul className="inline-flex items-stretch -space-x-px">
            <li>
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center justify-center h-full py-1.5 px-3 ml-0 border border-gray-300 rounded-l-lg ${
                  currentPage === 1
                    ? "text-gray-400 bg-gray-200"
                    : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700"
                }`}
              >
                <IoChevronBackOutline />
              </button>
            </li>
            {generatePageNumbers().map((page) => (
              <li key={page}>
                <button
                  onClick={() => onPageChange(page)}
                  className={`px-3 py-2 text-sm border font-medium ${
                    currentPage === page
                      ? "text-white bg-primary border-primary"
                      : "text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                  }`}
                >
                  {page}
                </button>
              </li>
            ))}

            <li>
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center justify-center h-full py-1.5 px-3 border border-gray-300 rounded-r-lg ${
                  currentPage === totalPages
                    ? "text-gray-400 bg-gray-200"
                    : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700"
                }`}
              >
                <IoChevronForwardOutline />
              </button>
            </li>
          </ul>
        )}
      </nav>
    </>
  );
};

export default Table;
