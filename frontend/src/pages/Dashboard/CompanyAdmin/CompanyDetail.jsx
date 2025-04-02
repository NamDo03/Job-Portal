import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCompanyById } from "../../../services/company";
import Loader from "../../../components/loader/Loader";

const CompanyDetail = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const data = await getCompanyById(id);
        setCompany(data);
      } catch (error) {
        console.error("Failed to fetch company details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyDetails();
  }, [id]);
  console.log(company);
  if (loading) return <Loader />;

  if (!company) return <div>Company not found</div>;
  return (
    <div className="max-w-6xl px-4 py-8 mx-auto">
      {/* Company Header */}
      <div className="flex flex-col items-center gap-8 mb-10 md:flex-row md:items-start">
        <img
          src={company.logo}
          alt={`${company.name} logo`}
          className="object-contain w-48 h-48 border border-gray-200 rounded-lg"
        />
        <div className="flex-1">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">
            {company.name}
          </h1>
          <div className="space-y-1 text-gray-600">
            <p>
              <span className="font-semibold">Location:</span>{" "}
              {company.location}
            </p>
            <p>
              <span className="font-semibold">Website:</span>{" "}
              <a
                href={company.website}
                target="_blank"
                className="text-blue-600 hover:underline"
              >
                {company.website}
              </a>
            </p>
            <p>
              <span className="font-semibold">Status:</span>
              <span
                className={`ml-1 px-2.5 py-1 text-base rounded-full ${
                  company.status === "PENDING"
                    ? "bg-yellow-100 text-yellow-800"
                    : company.status === "APPROVED"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {company.status}
              </span>
            </p>
            <p>
              <span className="font-semibold">Owner:</span>{" "}
              {company.owner?.fullname || "N/A"} (
              {company.owner?.email || "N/A"})
            </p>
          </div>
        </div>
      </div>

      {/* Company Description */}
      <div className="mb-10">
        <h2 className="pb-2 mb-4 text-2xl font-semibold text-gray-800 border-b border-gray-200">
          About Us
        </h2>
        <div
          className="max-w-none"
          dangerouslySetInnerHTML={{ __html: company.description }}
        />
      </div>

      {/* Company Gallery */}
      {company.images?.length > 0 && (
        <div className="mb-10">
          <h2 className="pb-2 mb-4 text-2xl font-semibold text-gray-800 border-b border-gray-200">
            Gallery
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {company.images.map((image) => (
              <div
                key={image.id}
                className="overflow-hidden transition-shadow rounded-lg shadow-md hover:shadow-lg"
              >
                <img
                  src={image.imageUrl}
                  alt={`Company gallery ${image.id}`}
                  className="object-cover w-full h-48 transition-transform hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Company Team */}
      {company.members?.length > 0 && (
        <div className="mb-10">
          <h2 className="pb-2 mb-4 text-2xl font-semibold text-gray-800 border-b border-gray-200">
            Our Team
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {company.members.map((member) => (
              <div
                key={member.id}
                className="flex items-center p-3 space-x-4 border border-gray-200 rounded-lg"
              >
                {member.user.avatar ? (
                  <img
                    src={member.user.avatar}
                    className="object-cover w-12 h-12 rounded-full"
                    alt={member.userId}
                  />
                ) : (
                  <div className="flex items-center justify-center w-12 h-12 text-gray-600 bg-gray-300 rounded-full">
                    {member.user.fullname?.charAt(0) || "?"}
                  </div>
                )}

                <div>
                  <h3 className="font-medium text-gray-800">
                    {member.user.fullname || "Unnamed Member"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {member.role || "Team Member"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDetail;
