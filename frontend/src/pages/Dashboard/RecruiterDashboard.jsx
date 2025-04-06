import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FiChevronRight } from "react-icons/fi";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as BarTooltip,
} from "recharts";
import { HiOutlineClipboardList } from "react-icons/hi";
import { getJobCountByStatus } from "../../services/job";
import { getApplicationsCountByStatus } from "../../services/application";
import { getCompanyMembers } from "../../services/company";
import Loader from "../../components/loader/Loader";
import { useNavigate } from "react-router-dom";

const RecruiterDashboard = () => {
  const { currentUser } = useSelector((state) => state.user);
  const companyId = currentUser.companyMemberships[0].companyId;
  const navigate = useNavigate();

  const [jobCount, setJobCount] = useState([]);
  const [applicationsOverTime, setApplicationsOverTime] = useState([]);
  const [applicationCount, setApplicationCount] = useState(0);
  const [applicationPendingCount, setApplicationPendingCount] = useState(0);
  const [companyMembers, setCompanyMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchJobCount = async () => {
      try {
        const data = await getJobCountByStatus(companyId);
        const countData = data.map((item) => ({
          name: item.status,
          value: item._count,
        }));
        setJobCount(countData);
      } catch (error) {
        setError("Failed to load job count");
      } finally {
        setLoading(false);
      }
    };

    const fetchApplicationsData = async () => {
      try {
        const data = await getApplicationsCountByStatus(companyId);
        setApplicationsOverTime(data.data);
        setApplicationCount(data.totalApplications);
        setApplicationPendingCount(data.totalPendingApplications);
      } catch (error) {
        console.error("Error fetching applications over time:", error);
      }
    };

    const fetchCompanyMember = async () => {
      try {
        const data = await getCompanyMembers(companyId, 1, "", true);
        setCompanyMembers(data.data);
      } catch (error) {
        console.error("Error fetching company members:", error);
      }
    };

    fetchJobCount();
    fetchApplicationsData();
    fetchCompanyMember();
  }, []);

  const ownerCount = companyMembers.filter(
    (member) => member.role === "OWNER"
  ).length;
  const reviewerCount = companyMembers.filter(
    (member) => member.role === "REVIEWER"
  ).length;

  const totalMembers = companyMembers.length;
  const ownerPercentage = totalMembers ? (ownerCount / totalMembers) * 100 : 0;
  const reviewerPercentage = totalMembers
    ? (reviewerCount / totalMembers) * 100
    : 0;

  const COLORS = ["#FFB836", "#56CDAD", "#FF6550"];

  if (loading) return <Loader />;
  return (
    <div>
      <h2 className="text-xl font-semibold text-text-primary">
        Good morning, {currentUser.fullname}
      </h2>
      <p className="mb-8 text-base text-text-2">
        Here is your job listings statistic report.
      </p>

      <div
        onClick={() => navigate("/recruiter-dashboard/candidate/list")}
        className="flex gap-3.5 p-6 text-white w-fit bg-primary items-center cursor-pointer hover:opacity-95"
      >
        <div className="text-5xl font-semibold">{applicationPendingCount}</div>
        <div className="text-base font-medium">New candidates to review</div>
        <FiChevronRight size={24} />
      </div>

      <div className="flex gap-10 mt-8">
        {/* Left part */}
        <div className="p-6 border border-text-footer w-[70%]">
          <div className="flex justify-between">
            <div>
              <h3 className="mb-4 text-lg font-semibold text-text-primary">
                Candidates statistic
              </h3>
              <p className="mb-8 text-base text-text-2">
                Showing Jobstatistic Jul 19-25
              </p>
            </div>
            <div className="w-[25%] border border-text-footer p-4 flex flex-col max-h-fit">
              <div className="flex items-center justify-between">
                <h4 className="mb-4 text-lg font-semibold text-text-primary">
                  Job Applied
                </h4>
                <div className="p-2 text-white rounded-full bg-primary w-fit">
                  <HiOutlineClipboardList size={22} />
                </div>
              </div>
              <div className="mt-2">
                <div className="text-3xl font-semibold">{applicationCount}</div>
                <div className="text-lg font-semibold text-text-2">
                  This week
                </div>
              </div>
            </div>
          </div>

          <div className="h-[480px] mt-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={applicationsOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <BarTooltip />
                <Bar dataKey="pending" stackId="a" fill="#FFB836" />
                <Bar dataKey="approved" stackId="a" fill="#56CDAD" />
                <Bar dataKey="rejected" stackId="a" fill="#FF6550" />
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  wrapperStyle={{
                    top: 40,
                    right: 20,
                    lineHeight: "40px",
                    paddingLeft: "80px",
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right part */}
        <div className="w-[30%] flex flex-col gap-6">
          <div className="p-6 border border-text-footer">
            <h3 className="mb-4 text-lg font-semibold text-text-primary">
              Job Status Overview
            </h3>
            <div className="mx-auto ">
              <PieChart width={350} height={300}>
                <Pie
                  data={jobCount}
                  dataKey="value"
                  nameKey="name"
                  cx="40%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={0}
                >
                  {jobCount.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                />
              </PieChart>
            </div>
          </div>

          <div className="p-6 border border-text-footer">
            <h3 className="mb-4 text-lg font-semibold text-text-primary">
              Employees Summary
            </h3>
            <div className="flex items-end gap-3">
              <span className="text-5xl font-semibold">
                {companyMembers.length}
              </span>
              <span className="text-lg text-text-2">Employees</span>
            </div>

            {/* Progress bar */}
            <div className="flex w-full h-4 mt-6 overflow-hidden bg-gray-200">
              <div
                className="h-full bg-primary"
                style={{ width: `${ownerPercentage}%` }}
              ></div>
              <div
                className="h-full bg-[#56CDAD]"
                style={{ width: `${reviewerPercentage}%` }}
              ></div>
            </div>

            {/* Legend */}
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-text-primary">
                <span className="inline-block w-3 h-3 rounded-sm bg-primary"></span>
                Owner ({ownerCount})
              </div>
              <div className="flex items-center gap-2 text-text-primary">
                <span className="inline-block w-3 h-3 bg-[#56CDAD] rounded-sm"></span>
                Reviewer ({reviewerCount})
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
