import React from "react";
import Banner from "../components/home/Banner";
import Categories from "../components/home/Categories";
import FeaturedJobs from "../components/home/FeaturedJobs";
import LastestJobs from "../components/home/LastestJobs";

const Home = () => {
  return (
    <div>
      <Banner />
      <Categories />
      <FeaturedJobs />
      <LastestJobs />
    </div>
  );
};

export default Home;
