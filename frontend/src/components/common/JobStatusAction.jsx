import React from "react";
import { IoMdCheckmarkCircleOutline, IoMdCloseCircle } from "react-icons/io";
import { FaInfo } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

const JobStatusAction = ({ row, onChangeStatus }) => {
  const navigate = useNavigate();

  const onViewDetails = (jobId) => {
    navigate(`/admin/job/${jobId}`);
  };

  const statusActions = {
    PENDING: [
      {
        status: "APPROVED",
        icon: <IoMdCheckmarkCircleOutline />,
        className: "bg-green-500 hover:bg-green-600",
        tooltip: "approve",
      },
      {
        status: "REJECTED",
        icon: <IoMdCloseCircle />,
        className: "bg-red-500 hover:bg-red-600",
        tooltip: "reject",
      },
    ],
    APPROVED: [
      {
        status: "REJECTED",
        icon: <IoMdCloseCircle />,
        className: "bg-red-500 hover:bg-red-600",
        tooltip: "reject",
      },
    ],
    REJECTED: [
      {
        status: "APPROVED",
        icon: <IoMdCheckmarkCircleOutline />,
        className: "bg-green-500 hover:bg-green-600",
        tooltip: "approve",
      },
    ],
  };

  const actions = statusActions[row.status] || [];
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onViewDetails(row.id)}
        className="p-2 text-white bg-blue-500 rounded hover:bg-blue-600"
      >
        <FaInfo />
      </button>
      {actions.map((action, index) => (
        <Tippy content={`${action.tooltip}`} key={index}>
          <button
            onClick={() => onChangeStatus(action.status)}
            className={`p-2 text-white rounded ${action.className}`}
          >
            {action.icon}
          </button>
        </Tippy>
      ))}
    </div>
  );
};

export default JobStatusAction;
