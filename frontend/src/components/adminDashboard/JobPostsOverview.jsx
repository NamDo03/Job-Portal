import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getJobStats } from "../../services/job";
import { HiOutlineClipboardList } from "react-icons/hi";

const COLORS = ["#82ca9d", "#8884d8", "#ff7f50"];

const JobPostsOverview = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getJobStats();
      if (data) {
        setStats(data);
      }
    };

    fetchStats();
  }, []);

  const jobPostsByMonth = stats?.monthlyPosts || [];
  const jobStatusDistribution =
    stats?.statusCounts.map((status) => ({
      name: status.status,
      value: status.count,
    })) || [];

  return (
    <div className="flex gap-10">
      {/* Job Posts Over Time (Stacked Bar Chart) */}
      <div className="p-4 bg-white shadow rounded-xl w-[70%] border border-text-footer">
        <h2 className="mb-10 text-xl font-semibold">Job Posts Over Time</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={jobPostsByMonth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="PENDING" fill="#82ca9d" stackId="a" />
            <Bar dataKey="APPROVED" fill="#8884d8" stackId="a" />
            <Bar dataKey="REJECTED" fill="#ff7f50" stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Job Status Pie Chart */}
      <div className="w-[30%] rounded-xl flex flex-col gap-5">
        {/* Total Jobs */}
        <div className="p-4 bg-white border shadow rounded-xl border-text-footer">
          <div className="flex items-center justify-between">
            <h2 className="mb-2 text-xl font-semibold text-text-2">
              Total Jobs
            </h2>
            <div className="p-2 text-white rounded-full bg-primary">
              <HiOutlineClipboardList size={22} />
            </div>
          </div>
          <div className="flex items-end gap-3 mt-6">
            <p className="text-5xl font-bold text-blue-600">
              {stats?.totalJobs ?? 0}
            </p>
            <p className="text-xl font-semibold">Jobs</p>
          </div>
        </div>

        {/* Job Distribution Pie */}
        <div className="p-4 bg-white border shadow rounded-xl border-text-footer">
          <h2 className="mb-4 text-xl font-semibold">
            Job Status Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={jobStatusDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {jobStatusDistribution.map((entry, index) => (
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

export default JobPostsOverview;
