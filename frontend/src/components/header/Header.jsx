import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MdMenu, MdClose } from "react-icons/md";
import { TbLogout } from "react-icons/tb";
import { IoChevronDown } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "../common/Logo";
import { menuSlide } from "../../animations/motionVariants";
import { logout } from "../../services/auth";
import { useDispatch, useSelector } from "react-redux";
import Menu from "../dropdown/Menu";
import { logoutAccount } from "../../redux/userSlice";
import avatar_default from "../../assets/default_user_avatar.png";

const Header = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [openedSideBar, setOpenedSideBar] = useState(false);
  const [openedMenu, setOpenedMenu] = useState(false);

  const toggleMenu = () => setOpenedSideBar((prevState) => !prevState);
  const toggleSetting = () => setOpenedMenu((prevState) => !prevState);

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenedMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openedMenu]);

  const handleLogout = async () => {
    const response = await logout();
    if (response.error) {
      console.error(response.error);
    } else {
      dispatch(logoutAccount());
      setOpenedSideBar(false);
      setOpenedMenu(false);
    }
  };
  return (
    <header className="main-container flex py-6 justify-between items-center w-full bg-white z-[99] fixed top-0 left-0 shadow-md">
      <div className="flex gap-12">
        <Logo />
        <ul className="items-center hidden gap-4 text-base font-medium lg:flex">
          <li className="hover:text-primary">
            <Link to="/jobs">Find Jobs</Link>
          </li>
          <li className="hover:text-primary">
            <Link to="/companies">Browse Companies</Link>
          </li>
        </ul>
      </div>
      <div
        ref={menuRef}
        className="items-center hidden gap-4 text-base font-bold lg:flex"
      >
        {currentUser ? (
          <div className="relative">
            <div
              onClick={toggleSetting}
              className="flex flex-row items-center gap-3 py-1 pl-1 pr-3 border rounded-full cursor-pointer"
            >
              <img
                src={currentUser?.avatar || avatar_default}
                alt={currentUser?.fullname || "User avatar"}
                className="rounded-full w-9 h-9"
              />

              <IoChevronDown className="text-text-1" />
            </div>
            <AnimatePresence mode="wait">
              {openedMenu && (
                <Menu
                  currentUser={currentUser}
                  onLogout={handleLogout}
                  setOpenedMenu={setOpenedMenu}
                />
              )}
            </AnimatePresence>
          </div>
        ) : (
          <>
            <Link
              to="/login"
              className="px-6 py-3 bg-transparent border-r text-primary hover:opacity-75 border-r-slate-300"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-6 py-3 text-white bg-primary hover:bg-primary/75"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>

      {/* Mobile menu toggle */}
      <button className="flex lg:hidden">
        <MdMenu size={36} onClick={toggleMenu} />
      </button>

      {/* Mobile menu */}
      <AnimatePresence mode="wait">
        {openedSideBar && (
          <div
            className="fixed top-0 right-0 w-screen h-screen bg-black/60 lg:hidden"
            onClick={toggleMenu}
          >
            <motion.div
              variants={menuSlide}
              initial="initial"
              animate="enter"
              exit="exit"
              className="bg-white h-screen w-[80%] absolute top-0 right-0 p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4"
                aria-label="Close menu"
              >
                <MdClose size={32} onClick={toggleMenu} />
              </button>
              {currentUser && (
                <div className="flex flex-row items-center gap-3 pb-3 border-b-2">
                  <img
                    src={currentUser.avatar || avatar_default}
                    alt={currentUser.fullname || "User avatar"}
                    className="object-cover rounded-lg w-14 h-14"
                  />
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold text-text-primary heading">
                      {currentUser.fullname}
                    </span>
                    <span className="text-lg font-normal text-gray-600">
                      {currentUser.email}
                    </span>
                  </div>
                </div>
              )}

              <ul className="flex flex-col items-start gap-2 mt-3 text-xl font-medium md:text-2xl">
                <li className="w-full">
                  <Link
                    to="/jobs"
                    onClick={toggleMenu}
                    className="block w-full p-2 hover:text-primary hover:bg-sub-primary"
                  >
                    Find Jobs
                  </Link>
                </li>
                <li className="w-full">
                  <Link
                    to="/companies"
                    onClick={toggleMenu}
                    className="block w-full p-2 hover:text-primary hover:bg-sub-primary"
                  >
                    Browse Companies
                  </Link>
                </li>
                {currentUser ? (
                  <>
                    <li className="w-full">
                      <Link
                        to="/"
                        onClick={toggleMenu}
                        className="block w-full p-2 hover:text-primary hover:bg-sub-primary"
                      >
                        Profile
                      </Link>
                    </li>
                    <li className="w-full">
                      <Link
                        to="/"
                        onClick={toggleMenu}
                        className="block w-full p-2 hover:text-primary hover:bg-sub-primary"
                      >
                        Applied Jobs
                      </Link>
                    </li>
                    <li
                      onClick={handleLogout}
                      className="flex items-center justify-center w-full gap-2 px-3 py-2 font-medium text-white bg-red-600 rounded-md cursor-pointer hover:bg-red-500"
                    >
                      <TbLogout size={22} /> Logout
                    </li>
                  </>
                ) : (
                  <>
                    <li className="w-full">
                      <Link
                        to="/login"
                        onClick={toggleMenu}
                        className="block w-full p-2 hover:text-primary hover:bg-sub-primary"
                      >
                        Login
                      </Link>
                    </li>
                    <li className="w-full">
                      <Link
                        to="/signup"
                        onClick={toggleMenu}
                        className="block w-full p-2 hover:text-primary hover:bg-sub-primary"
                      >
                        Sign Up
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
