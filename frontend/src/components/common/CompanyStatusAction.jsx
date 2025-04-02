import React from "react";
import { MdBlock } from "react-icons/md";
import { IoMdCloseCircle } from "react-icons/io";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { FaInfo } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CompanyStatusAction = ({ row, onChangeStatus }) => {
  const navigate = useNavigate();

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
        className: "bg-gray-500 hover:bg-gray-600",
        tooltip: "reject",
      },
    ],
    APPROVED: [
      {
        status: "BLOCKED",
        icon: <MdBlock />,
        className: "bg-orange-500 hover:bg-orange-600",
        tooltip: "block",
      },
    ],
    BLOCKED: [
      {
        status: "APPROVED",
        icon: <IoMdCheckmarkCircleOutline />,
        className: "bg-green-500 hover:bg-green-600",
        tooltip: "approve",
      },
    ],
  };
  const onViewDetails = (companyId) => {
    navigate(`/admin/company/${companyId}`);
  };

  const actions = statusActions[row.status] || [];
  return (
    <div className="flex items-center gap-2">
      <Tippy content="info">
        <button
          onClick={() => onViewDetails(row.id)}
          className="p-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          <FaInfo />
        </button>
      </Tippy>
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

export default CompanyStatusAction;
