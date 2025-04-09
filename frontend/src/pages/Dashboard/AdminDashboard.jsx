import React, { useState, useRef, useEffect } from "react";
import UsersOverview from "../../components/adminDashboard/UsersOverview";
import JobPostsOverview from "../../components/adminDashboard/JobPostsOverview";
import CompaniesOverview from "../../components/adminDashboard/CompaniesOverview";

const tabs = [
  { id: "users", label: "Users Overview" },
  { id: "jobs", label: "Job Posts" },
  { id: "companies", label: "Companies" },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [underlineStyle, setUnderlineStyle] = useState({});
  const tabRefs = useRef({});

  useEffect(() => {
    const currentTab = tabRefs.current[activeTab];
    if (currentTab) {
      setUnderlineStyle({
        left: currentTab.offsetLeft -15,
        width: currentTab.offsetWidth,
      });
    }
  }, [activeTab]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="relative flex pb-1.5 space-x-4 border-b-2 border-text-footer">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            ref={(el) => (tabRefs.current[tab.id] = el)}
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-4 py-2 font-semibold transition-colors duration-300 ${
              activeTab === tab.id ? "text-text-primary" : "text-text-2"
            }`}
          >
            {tab.label}
          </button>
        ))}

        {/* Underline */}
        <span
          className="absolute bottom-0 h-[3px] transition-all duration-300 bg-primary rounded-full"
          style={{
            left: underlineStyle.left || 0,
            width: underlineStyle.width || 0,
          }}
        />
      </div>

      {/* Tab content */}
      {activeTab === "users" && <UsersOverview />}
      {activeTab === "jobs" && <JobPostsOverview />}
      {activeTab === "companies" && <CompaniesOverview />}
    </div>
  );
};

export default AdminDashboard;
