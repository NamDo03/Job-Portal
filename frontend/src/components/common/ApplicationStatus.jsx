import React, { useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { FaInfo } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { changeApplicationStatus } from "../../services/application";
import Loader from "../loader/Loader";

const ApplicationStatus = ({ row, onChangeStatus }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChangeViewStatus = async (candidateId) => {
    setLoading(true);
    try {
      await changeApplicationStatus(candidateId, "VIEWED");
    } catch (error) {
      console.error("API error:", error);
    } finally {
      setLoading(false);
    }
  };

  const statusActions = {
    PENDING: [
      {
        status: "ACCEPTED",
        icon: <IoMdCheckmarkCircleOutline />,
        className: "bg-green-500 hover:bg-green-600",
        tooltip: "accept",
      },
      {
        status: "REJECTED",
        icon: <IoMdCloseCircle />,
        className: "bg-red-500 hover:bg-red-600",
        tooltip: "reject",
      },
    ],
    VIEWED: [
      {
        status: "ACCEPTED",
        icon: <IoMdCheckmarkCircleOutline />,
        className: "bg-green-500 hover:bg-green-600",
        tooltip: "accept",
      },
      {
        status: "REJECTED",
        icon: <IoMdCloseCircle />,
        className: "bg-red-500 hover:bg-red-600",
        tooltip: "reject",
      },
    ],
    ACCEPTED: [],
    REJECTED: [],
  };
  const onViewDetails = (candidateId, status) => {
    navigate(`/recruiter-dashboard/candidate/${candidateId}`);
    if (status !== "ACCEPTED" && status !== "REJECTED" && status !== "VIEWED") {
      handleChangeViewStatus(candidateId);
    }
  };

  if (loading) {
    return <Loader />;
  }
  const actions = statusActions[row.status] || [];
  return (
    <div className="flex items-center gap-2">
      <Tippy content="info">
        <button
          onClick={() => onViewDetails(row.id, row.status)}
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

export default ApplicationStatus;
