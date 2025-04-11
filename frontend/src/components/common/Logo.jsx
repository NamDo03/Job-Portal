import React from "react";
import logo from "../../assets/logo2.png";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2">
      <img src={logo} className="h-12" />
    </Link>
  );
};

export default Logo;
