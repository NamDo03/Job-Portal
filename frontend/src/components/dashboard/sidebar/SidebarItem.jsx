import React from "react";
import { IoChevronDown } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

const SidebarItem = ({ children, name, link, subLinks, isActive, onClick }) => {
  const Wrapper = link ? Link : "div";
  const location = useLocation();
  return (
    <>
      <Wrapper
        {...(link ? { to: link } : {})}
        onClick={onClick}
        className={`flex items-center px-3 py-2 font-medium rounded-md cursor-pointer gap-3 stroke-[1.5] hover:bg-secondary transition-colors duration-100   ${
          isActive
            ? "bg-secondary text-primary stroke-primary"
            : "text-text-2 hover:text-primary hover:bg-secondary hover:stroke-primary stroke-text-2 "
        }`}
      >
        {children}
        <p className="min-w-0 text-lg tracking-wide text-inherit overflow-clip whitespace-nowrap">
          {name}
        </p>
        {subLinks && (
          <motion.div
            animate={{ rotate: isActive ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <IoChevronDown />
          </motion.div>
        )}
      </Wrapper>
      <AnimatePresence>
        {subLinks && isActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-col gap-2 mt-1 ml-6"
          >
            {subLinks.map((sub) => {
              const isSubActive = location.pathname === sub.to;
              return (
                <Link
                  key={sub.to}
                  to={sub.to}
                  className={`px-5 py-2 font-medium transition-colors duration-100 rounded-md 
                    ${
                      isSubActive
                        ? "text-primary bg-secondary"
                        : "text-text-2 hover:text-primary hover:bg-secondary"
                    }`}
                >
                  {sub.name}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
export default SidebarItem;
