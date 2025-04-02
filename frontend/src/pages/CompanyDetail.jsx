import React, { useCallback, useEffect, useState } from "react";
import { AiOutlineGlobal } from "react-icons/ai";
import { FaUsers } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import CompanyDescription from "../components/companyDetail/CompanyDescription";
import CompanyLocation from "../components/companyDetail/CompanyLocation";
import { getCompanyById } from "../services/company";
import Loader from "../components/loader/Loader";
import company_default from "../assets/company_default.png";

const CompanyDetail = () => {
  const { id } = useParams();
  const [company, setCompany] = useState({});
  const [loading, setLoading] = useState(false);
  const fetchCompanyDetails = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCompanyById(Number(id));
      setCompany(data);
    } catch (error) {
      console.error("Failed to fetch company details:", error);
      toast.error("Failed to load company details");
      navigate("/not-found", { replace: true });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCompanyDetails();
  }, [fetchCompanyDetails]);

  const getEmployeeRange = () => {
    if (!company.size) return "Not specified";
    return `${company.size.minEmployees} - ${company.size.maxEmployees}`;
  };

  if (loading) {
    return <Loader />;
  }
  return (
    <div>
      <div className="py-8 bg-sub-primary main-container md:py-14 lg:py-20">
        <div className="flex flex-row flex-wrap gap-6">
          <img
            src={company.logo || company_default}
            alt={`${company.name} logo`}
            className="object-cover w-40 h-40"
          />
          <div className="flex flex-col justify-center gap-5">
            <div className="flex flex-row items-center gap-3">
              <h2 className="text-3xl font-semibold text-text-primary">
                {company.name}
              </h2>
              {company.job?.length > 0 && (
                <span className="px-3 py-1 text-base font-medium border border-primary bg-sub-primary text-primary w-fit">
                  {company.job.length}{" "}
                  {company.job.length === 1 ? "Job" : "Jobs"}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-5 sm:flex-row sm:gap-10">
              <div className="flex flex-row gap-4">
                <div className="p-[10px] bg-white text-ocean w-fit rounded-full">
                  <AiOutlineGlobal size={24} />
                </div>
                <div className="flex flex-col">
                  <span className="text-base text-text-1">Website</span>
                  {company.website ? (
                    <a
                      href={
                        company.website.startsWith("http")
                          ? company.website
                          : `https://${company.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base font-semibold break-all hover:text-primary/80 text-primary"
                    >
                      {company.website.replace(/^https?:\/\//, "")}
                    </a>
                  ) : (
                    <p className="text-base text-text-2">Not specified</p>
                  )}
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <div className="p-[10px] bg-white text-ocean w-fit rounded-full">
                  <FaUsers size={24} />
                </div>
                <div className="flex flex-col">
                  <span className="text-base text-text-1">Employees</span>
                  <span className="text-base font-semibold text-text-primary">
                    {getEmployeeRange()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="main-container">
        <div className="flex flex-col gap-12 py-10 border-b-2 md:py-14 lg:py-16 lg:flex-row xl:gap-16">
          <div className="w-full lg:w-[65%] xl:w-[70%]">
            <CompanyDescription
              imgs={company.images}
              description={company.description}
            />
          </div>
          <div className="w-full lg:w-[35%] xl:w-[30%]">
            <CompanyLocation location={company.location} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;
