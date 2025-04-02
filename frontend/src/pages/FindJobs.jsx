import React from "react";
import SearchSection from "../components/common/SearchSection";
import JobList from "../components/jobList/JobList";

const FindJobs = () => {
  return (
    <div>
      <SearchSection
        heading="Find your"
        subHeading="Find your next career at companies like HubSpot, Nike, and Dropbox"
        textHighlight="dream job"
      />
      <JobList />
    </div>
  );
};

export default FindJobs;
