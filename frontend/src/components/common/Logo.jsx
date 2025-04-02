import React from "react";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2">
      <img src={logo} />
      <h1 className="name text-2xl">JobHuntly</h1>
    </Link>
  );
};

export default Logo;
