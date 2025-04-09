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
import { LuBuilding } from "react-icons/lu";
import { getCompaniesStatics } from "../../services/company";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00C49F"];

const CompaniesOverview = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCompaniesStatics();

        setStats(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const companyGrowthData = stats?.monthlyRegistrations || [];
  const companySizeData =
    stats?.companiesByCompanySize.map((size) => ({
      name: size.companySize,
      value: size.count,
    })) || [];
  return (
    <div className="flex gap-10">
      {/* Company Growth Over Time Line */}
      <div className="p-4 bg-white shadow rounded-xl w-[70%] border border-text-footer">
        <h2 className="mb-10 text-xl font-semibold">
          Company Growth Over Time{" "}
          <span className="text-sm text-gray-500">
            ({new Date().getFullYear()})
          </span>
        </h2>

        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={companyGrowthData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="companies" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="w-[30%] rounded-xl flex flex-col gap-5">
        {/* Total Companies */}
        <div className="p-4 bg-white border shadow rounded-xl border-text-footer">
          <div className="flex items-center justify-between">
            <h2 className="mb-2 text-xl font-semibold text-text-2">
              Total Companies
            </h2>
            <div className="p-2 text-white rounded-full bg-primary">
              <LuBuilding size={20} /> {/* Use an appropriate icon */}
            </div>
          </div>
          <div className="flex items-end gap-3 mt-6">
            <p className="text-5xl font-bold text-blue-600">
              {stats?.totalCompanies ?? 0}
            </p>
            <p className="text-xl font-semibold">Companies</p>
          </div>
        </div>

        {/* Company Categories Distribution Pie */}
        <div className="p-4 bg-white border shadow rounded-xl border-text-footer">
          <h2 className="mb-4 text-xl font-semibold">
            Company Size Distribution
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={companySizeData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {companySizeData.map((entry, index) => (
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

export default CompaniesOverview;
