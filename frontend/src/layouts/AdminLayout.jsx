import React from "react";
import Sidebar from "../components/dashboard/sidebar/Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex flex-row w-full h-screen">
      <Sidebar />
      <div className="flex flex-col w-full h-screen gap-5 px-10 py-6 overflow-y-auto bg-bg-admin">
        <div className="px-6 py-5 bg-white border rounded-md shadow">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
