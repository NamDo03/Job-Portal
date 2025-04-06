import React, { useEffect, useState } from "react";
import logo from "../../../assets/logo.png";
import { motion, useAnimationControls } from "framer-motion";
import {
  containerVariants,
  svgVariants,
} from "../../../animations/motionVariants";
import { VscArrowRight } from "react-icons/vsc";
import { HiOutlineChartBar, HiOutlineClipboardList } from "react-icons/hi";
import { HiOutlineUsers, HiOutlineUserGroup } from "react-icons/hi2";
import { TbBuildingSkyscraper, TbCategory } from "react-icons/tb";
import {
  FaRegListAlt,
  FaLevelUpAlt,
  FaMoneyCheckAlt,
  FaUsers,
} from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";
import { IoBriefcaseSharp, IoLogOutOutline } from "react-icons/io5";
import SidebarItem from "./SidebarItem";
import avatar_default from "../../../assets/default_user_avatar.png";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../../services/auth";
import { logoutAccount } from "../../../redux/userSlice";
import Modal from "../../modal/Modal";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(true);
  const [activeLink, setActiveLink] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const containerControls = useAnimationControls();
  const svgControls = useAnimationControls();

  useEffect(() => {
    if (isOpen) {
      containerControls.start("open");
      svgControls.start("open");
    } else {
      containerControls.start("close");
      svgControls.start("close");
      setActiveLink(null);
    }
  }, [isOpen]);

  const handleOpenClose = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigationClick = (name) => {
    if (!isOpen) {
      setIsOpen(true);
    }
    setActiveLink((prev) => (prev === name ? null : name));
  };

  const handleLogout = async () => {
    const response = await logout();
    if (response.error) {
      console.error(response.error);
    } else {
      navigate("/login");
      dispatch(logoutAccount());
    }
  };

  const isCompanyOwner =
    currentUser?.companyMemberships?.length > 0 &&
    currentUser.companyMemberships[0].role === "OWNER";

  const companyStatus = currentUser?.companyMemberships?.[0]?.company?.status;

  const handleJobPostingsClick = () => {
    if (companyStatus === "PENDING" || companyStatus === "REJECTED") {
      setIsModalOpen(true);
    } else {
      handleNavigationClick("Job postings");
    }
  };
  return (
    <motion.aside
      variants={containerVariants}
      animate={containerControls}
      initial="close"
      className="sticky top-0 left-0 z-10 flex flex-col h-screen gap-5 p-5 overflow-hidden bg-white shadow-neutral-600"
    >
      <div className="flex flex-row justify-between w-full place-items-center">
        <div className="w-8 h-8">
          <Link to="/">
            <img src={logo} alt="logo" className="object-cover w-full h-full" />
          </Link>
        </div>
        <button onClick={handleOpenClose} className="flex p-1 rounded-full">
          <motion.div
            variants={svgVariants}
            animate={svgControls}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
            }}
            className="flex items-center justify-center w-12 h-12 text-text-2 hover:text-text-primary"
          >
            <VscArrowRight size={28} />
          </motion.div>
        </button>
      </div>

      <div className="flex flex-col flex-1 gap-3 overflow-scroll no-scrollbar">
        {currentUser.role === "RECRUITER" && (
          <>
            <SidebarItem
              name="Dashboard"
              isActive={activeLink === "Dashboard"}
              onClick={() => handleNavigationClick("Dashboard")}
              link="/recruiter-dashboard"
            >
              <LuLayoutDashboard
                size={28}
                className="stroke-inherit stroke-[1.5] min-w-8 w-8"
              />
            </SidebarItem>
            {isCompanyOwner && (
              <SidebarItem
                name="Company"
                isActive={activeLink === "Company"}
                onClick={() => handleNavigationClick("Company")}
                subLinks={
                  currentUser.companyMemberships.length > 0
                    ? [
                        {
                          name: "Manage Company",
                          to: `/recruiter-dashboard/company/manage`,
                        },
                        {
                          name: "Recruit for Company",
                          to: `/recruiter-dashboard/company/recruitment`,
                        },
                        {
                          name: "Employees",
                          to: `/recruiter-dashboard/company/employees`,
                        },
                      ]
                    : [
                        {
                          name: "Create Company",
                          to: "/recruiter-dashboard/company/create",
                        },
                      ]
                }
              >
                <HiOutlineChartBar
                  size={28}
                  className="stroke-inherit stroke-[1.5] min-w-8 w-8"
                />
              </SidebarItem>
            )}
            {currentUser?.companyMemberships?.length === 0 ? (
              <SidebarItem
                name="Company"
                isActive={activeLink === "Company"}
                onClick={() => handleNavigationClick("Company")}
                subLinks={[
                  {
                    name: "Create Company",
                    to: "/recruiter-dashboard/company/create",
                  },
                ]}
              >
                <HiOutlineChartBar
                  size={28}
                  className="stroke-inherit stroke-[1.5] min-w-8 w-8"
                />
              </SidebarItem>
            ) : (
              <>
                <SidebarItem
                  name="Job postings"
                  isActive={activeLink === "Job postings"}
                  onClick={handleJobPostingsClick}
                  subLinks={[
                    {
                      name: "Create new postings",
                      to: "/recruiter-dashboard/job/create",
                    },
                    {
                      name: "Posting list",
                      to: "/recruiter-dashboard/job/list",
                    },
                  ]}
                >
                  <HiOutlineClipboardList
                    size={28}
                    className="stroke-inherit stroke-[1.5] min-w-8 w-8"
                  />
                </SidebarItem>
                <SidebarItem
                  name="Candidate list"
                  isActive={activeLink === "Candidate list"}
                  onClick={() => handleNavigationClick("Candidate list")}
                  link="/recruiter-dashboard/candidate/list"
                >
                  <HiOutlineUserGroup
                    size={28}
                    className="stroke-inherit stroke-[1.5] min-w-8 w-8"
                  />
                </SidebarItem>
              </>
            )}
          </>
        )}
        {currentUser.role === "ADMIN" && (
          <>
            <SidebarItem
              name="Dashboard"
              isActive={activeLink === "Dashboard"}
              onClick={() => handleNavigationClick("Dashboard")}
              link="/admin"
            >
              <LuLayoutDashboard
                size={28}
                className="stroke-inherit stroke-[1.5] min-w-8 w-8"
              />
            </SidebarItem>
            <SidebarItem
              name="Users"
              isActive={activeLink === "Users"}
              onClick={() => handleNavigationClick("Users")}
              subLinks={[
                { name: "User List", to: "/admin/user/list" },
                { name: "Add User", to: "/admin/user/create" },
              ]}
            >
              <HiOutlineUsers
                size={28}
                className="stroke-inherit stroke-[1.5] min-w-8 w-8"
              />
            </SidebarItem>

            <SidebarItem
              name="Companies"
              isActive={activeLink === "Companies"}
              onClick={() => handleNavigationClick("Companies")}
              link="/admin/company"
            >
              <TbBuildingSkyscraper
                size={28}
                className="stroke-inherit stroke-[1.5] min-w-8 w-8"
              />
            </SidebarItem>
            <SidebarItem
              name="Job posts"
              isActive={activeLink === "Job posts"}
              onClick={() => handleNavigationClick("Job posts")}
              link="/admin/job"
            >
              <HiOutlineClipboardList
                size={28}
                className="stroke-inherit stroke-[1.5] min-w-8 w-8"
              />
            </SidebarItem>
            <SidebarItem
              name="Categories"
              isActive={activeLink === "Categories"}
              onClick={() => handleNavigationClick("Categories")}
              subLinks={[
                { name: "Category List", to: "/admin/category/list" },
                { name: "Add Category", to: "/admin/category/create" },
              ]}
            >
              <TbCategory
                size={28}
                className="stroke-inherit stroke-[1.5] min-w-8 w-8"
              />
            </SidebarItem>
            <SidebarItem
              name="Skills"
              isActive={activeLink === "Skills"}
              onClick={() => handleNavigationClick("Skills")}
              subLinks={[
                { name: "Skill List", to: "/admin/skill/list" },
                { name: "Add Skill", to: "/admin/skill/create" },
              ]}
            >
              <FaRegListAlt
                size={28}
                className="stroke-inherit stroke-[1.5] min-w-8 w-8"
              />
            </SidebarItem>
            <SidebarItem
              name="Levels"
              isActive={activeLink === "Levels"}
              onClick={() => handleNavigationClick("Levels")}
              subLinks={[
                { name: "Level List", to: "/admin/level/list" },
                { name: "Add Level", to: "/admin/level/create" },
              ]}
            >
              <FaLevelUpAlt
                size={28}
                className="stroke-inherit stroke-[1.5] min-w-8 w-8"
              />
            </SidebarItem>
            <SidebarItem
              name="Positions"
              isActive={activeLink === "Positions"}
              onClick={() => handleNavigationClick("Positions")}
              subLinks={[
                { name: "Position List", to: "/admin/position/list" },
                { name: "Add Position", to: "/admin/position/create" },
              ]}
            >
              <IoBriefcaseSharp
                size={28}
                className="stroke-inherit stroke-[1.5] min-w-8 w-8"
              />
            </SidebarItem>
            <SidebarItem
              name="Salary range"
              isActive={activeLink === "Salary range"}
              onClick={() => handleNavigationClick("Salary range")}
              subLinks={[
                { name: "Salary range List", to: "/admin/salary/list" },
                { name: "Add Salary range", to: "/admin/salary/create" },
              ]}
            >
              <FaMoneyCheckAlt
                size={28}
                className="stroke-inherit stroke-[1.5] min-w-8 w-8"
              />
            </SidebarItem>
            <SidebarItem
              name="Company size"
              isActive={activeLink === "Company size"}
              onClick={() => handleNavigationClick("Company size")}
              subLinks={[
                { name: "Company size List", to: "/admin/companySize/list" },
                { name: "Add Company size", to: "/admin/companySize/create" },
              ]}
            >
              <FaUsers
                size={28}
                className="stroke-inherit stroke-[1.5] min-w-8 w-8"
              />
            </SidebarItem>
          </>
        )}
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center px-3 py-2 font-medium rounded-md cursor-pointer stroke-[1.5] hover:stroke-red-600 stroke-red-500 text-red-500 hover:text-red-600 gap-3  hover:bg-red-100 transition-colors duration-100"
      >
        <IoLogOutOutline
          size={28}
          className="stroke-inherit stroke-[1.5] min-w-8 w-8"
        />
        <p className="min-w-0 text-lg tracking-wide text-inherit overflow-clip whitespace-nowrap">
          Logout
        </p>
      </button>

      <div className="flex flex-row gap-5 pt-5 pl-1 border-t-2 ">
        <img
          src={currentUser?.avatar || avatar_default}
          alt={currentUser?.fullname || "User avatar"}
          className="object-cover w-12 h-12 rounded-lg"
        />
        <div className="flex flex-col justify-between">
          <h4 className="text-lg font-semibold text-text-primary heading">
            {currentUser.fullname}
          </h4>
          <span className="text-base font-normal text-gray-600">
            {currentUser.email}
          </span>
        </div>
      </div>

      {/* Modal notification */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="text-center">
          <h2 className="mb-4 text-xl font-semibold">Notification</h2>
          <p className="mb-4">
            Your company is currently in the{" "}
            <span className="font-bold">{companyStatus}</span> status. Please
            wait for administrator approval or contact the administrator for
            further details.
          </p>
        </div>
      </Modal>
    </motion.aside>
  );
};

export default Sidebar;
