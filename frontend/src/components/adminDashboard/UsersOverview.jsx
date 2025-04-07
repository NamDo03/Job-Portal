import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { LuUserRound } from "react-icons/lu";
import { getUserStats } from "../../services/user";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

const UsersOverview = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getUserStats();
      if (data) {
        setStats(data);
      }
    };

    fetchStats();
  }, []);

  const userGrowthData = stats?.monthlyRegistrations || [];
  const userRolesData =
    stats?.usersByRole.map((role) => ({
      name: role.role,
      value: role.count,
    })) || [];

  return (
    <div className="flex gap-10">
      {/* User Growth Over Time Line */}
      <div className="p-4 bg-white shadow rounded-xl w-[70%] border border-text-footer">
        <h2 className="mb-10 text-xl font-semibold">User Growth Over Time</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={userGrowthData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="users" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="w-[30%]  rounded-xl flex flex-col gap-5">
        {/* Total Users */}
        <div className="p-4 bg-white border shadow rounded-xl border-text-footer">
          <div className="flex items-center justify-between">
            <h2 className="mb-2 text-xl font-semibold text-text-2">
              Total Users
            </h2>
            <div className="p-2 text-white rounded-full bg-primary">
              <LuUserRound size={20} />
            </div>
          </div>
          <div className="flex items-end gap-3 mt-6">
            <p className="text-5xl font-bold text-blue-600">
              {stats?.totalUsers ?? 0}
            </p>
            <p className="text-xl font-semibold">Users</p>
          </div>
        </div>

        {/*User Roles Distribution Pie */}
        <div className="p-4 bg-white border shadow rounded-xl border-text-footer">
          <h2 className="mb-4 text-xl font-semibold">
            User Roles Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userRolesData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {userRolesData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default UsersOverview;
