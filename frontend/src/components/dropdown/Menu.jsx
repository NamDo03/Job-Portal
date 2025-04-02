import { motion } from "framer-motion";
import React from "react";
import { TbLogout } from "react-icons/tb";
import { menuVariants } from "../../animations/motionVariants";
import { Link } from "react-router-dom";
import avatar_default from "../../assets/default_user_avatar.png";

const Menu = ({ currentUser, onLogout, setOpenedMenu }) => {
  return (
    <motion.div
      variants={menuVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="absolute right-0 flex flex-col gap-3 p-3 mt-3 bg-white shadow-lg rounded-xl"
    >
      <div className="flex flex-row items-center gap-3 pb-3 border-b-2">
        <img
          src={currentUser?.avatar || avatar_default}
          alt={currentUser?.fullname || "User avatar"}
          className="object-cover w-12 h-12 rounded-lg "
        />
        <div className="flex flex-col min-w-[250px]">
          <h4 className="text-sm font-semibold text-text-primary heading">
            {currentUser.fullname}
          </h4>
          <span className="text-sm font-normal text-gray-600">
            {currentUser.email}
          </span>
        </div>
      </div>

      <ul className="text-base font-normal">
        <Link to="/profile" onClick={() => setOpenedMenu(false)}>
          <li className="px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100">
            Profile
          </li>
        </Link>
        <Link to="/applied-jobs" onClick={() => setOpenedMenu(false)}>
          <li className="px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100">
            Applied Jobs
          </li>
        </Link>
        <Link to="/saved-jobs" onClick={() => setOpenedMenu(false)}>
          <li className="px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100">
            Saved Jobs
          </li>
        </Link>
        {(currentUser.role === "ADMIN" || currentUser.role === "RECRUITER") && (
          <Link
            to={
              currentUser.role === "RECRUITER"
                ? "/recruiter-dashboard"
                : "/admin"
            }
            onClick={() => setOpenedMenu(false)}
          >
            <li className="px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100">
              Admin
            </li>
          </Link>
        )}
      </ul>

      <button
        onClick={onLogout}
        className="flex items-center justify-center gap-2 px-3 py-2 font-medium text-white bg-red-600 rounded-md cursor-pointer hover:bg-red-500"
      >
        <TbLogout size={22} /> Logout
      </button>
    </motion.div>
  );
};

export default Menu;
