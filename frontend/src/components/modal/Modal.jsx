import React, { useEffect } from "react";
import { MdClose } from "react-icons/md";
import { motion } from "framer-motion";
import {
  modalVariants,
  overlayVariants,
} from "../../animations/motionVariants";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);
  return (
    <motion.div
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onClose}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]"
    >
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="bg-white max-w-[90%] max-h-[90%] min-w-[85%] md:min-w-[60%] lg:min-w-[30%] p-6 rounded-lg shadow-lg relative overflow-hidden transition-all duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute text-gray-500 top-6 right-6 hover:text-black"
        >
          <MdClose size={30} />
        </button>
        <div className="mt-4">{children}</div>
      </motion.div>
    </motion.div>
  );
};

export default Modal;
