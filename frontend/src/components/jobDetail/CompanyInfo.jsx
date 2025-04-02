import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import company_default from "../../assets/company_default.png";
import parse from "html-react-parser";

const CompanyInfo = ({ company }) => {
  const defaultImage = company_default;
  if (!company) {
    return (
      <div className="py-16 text-center">
        <p>Company information not available</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-between gap-3 py-16 lg:flex-row">
      <div className="max-w-full lg:max-w-[35vw] flex flex-col gap-8">
        <div className="flex flex-row gap-6">
          <img
            src={company?.logo || company_default}
            alt={`${company.name} Logo`}
            className="object-cover w-20 h-20"
          />
          <div className="flex flex-col justify-center gap-2">
            <h3 className="text-3xl font-semibold text-text-primary">
              {company.name || "Company Name"}
            </h3>
            <Link
              to={`/companies/${company.id}`}
              className="flex items-center gap-3 text-base font-semibold text-primary hover:text-primary/80 group "
            >
              Read more about {company.name || "this company"}{" "}
              <FaArrowRight className="transition duration-300 ease-in-out group-hover:translate-x-3" />
            </Link>
          </div>
        </div>
        <div className="text-base text-text-1">
          {company.description ? (
            parse(company.description)
          ) : (
            <p>No company description available.</p>
          )}
        </div>
      </div>

      <div className="w-full lg:w-[35vw] xl:w-[25vw]">
        {company.images?.length > 0 ? (
          <div className="flex gap-2 h-[300px]">
            <div className="w-2/3">
              <img
                src={company.images[0]?.imageUrl || defaultImage}
                alt="Main company image"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex flex-col w-1/3 h-full gap-2">
              {[1, 2].map((index) =>
                company.images[index] ? (
                  <div
                    key={company.images[index].id || index}
                    className="h-1/2"
                  >
                    <img
                      src={company.images[index].imageUrl}
                      alt={`Company image ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div
                    key={`placeholder-${index}`}
                    className="bg-gray-100 rounded-lg h-1/2"
                  ></div>
                )
              )}
            </div>
          </div>
        ) : (
          <img
            src={defaultImage}
            alt="Default company image"
            className="w-full h-[400px] object-cover rounded-lg"
          />
        )}
      </div>
    </div>
  );
};

export default CompanyInfo;
