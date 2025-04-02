import React from "react";
import SearchSection from "../components/common/SearchSection";
import CompanyList from "../components/companyList/CompanyList";

const Companies = () => {
  return (
    <div>
      <SearchSection
        heading="Find your"
        textHighlight="dream companies"
        subHeading="Find the dream companies you dream work for"
        job={false}
      />
      <CompanyList />
    </div>
  );
};

export default Companies;
