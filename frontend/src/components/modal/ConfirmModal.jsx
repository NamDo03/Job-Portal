import React from "react";
import Modal from "./Modal";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
}) => {
  if (!isOpen) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-lg font-semibold">{title || "Confirm Deletion"}</h2>
      <p className="mt-2">
        {message || "Are you sure you want to delete this item?"}
      </p>
      <div className="flex justify-end mt-4 space-x-4">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
        >
          {confirmText || "Delete"}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
