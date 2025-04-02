import React from "react";
import Logo from "../common/Logo";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaDribbble,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-dark text-white main-container pt-16">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-10 xl:gap-20 mb-8">
        <div className="mb-5">
          <div className="mb-5">
            <Logo />
          </div>
          <p className="text-text-footer max-w-sm">
            Great platform for the job seeker that passionate about startups.
            Find your dream job easier.
          </p>
        </div>
        <div className="flex flex-row justify-start md:justify-around gap-20 md:gap-0 mb-5">
          <div className="">
            <h4 className="mb-5 text-lg">About</h4>
            <ul className="text-text-footer flex flex-col gap-4">
              <li className="cursor-pointer hover:text-sub-primary">
                Companies
              </li>
              <li className="cursor-pointer hover:text-sub-primary">Pricing</li>
              <li className="cursor-pointer hover:text-sub-primary">Terms</li>
              <li className="cursor-pointer hover:text-sub-primary">Advice</li>
              <li className="cursor-pointer hover:text-sub-primary">
                Privacy Policy
              </li>
            </ul>
          </div>
          <div className="">
            <h4 className="mb-5 text-lg">Resources</h4>
            <ul className="text-text-footer flex flex-col gap-4">
              <li className="cursor-pointer hover:text-sub-primary">
                Help Docs
              </li>
              <li className="cursor-pointer hover:text-sub-primary">Guide</li>
              <li className="cursor-pointer hover:text-sub-primary">Updates</li>
              <li className="cursor-pointer hover:text-sub-primary">
                Contact Us
              </li>
            </ul>
          </div>
        </div>

        <div className="mb-5">
          <h4 className="mb-5 text-lg">Get job notifications</h4>
          <p className="text-text-footer max-w-xs mb-6">
            The latest job news, articles, sent to your inbox weekly.
          </p>
          <form className="flex gap-2 flex-wrap">
            <input
              type="text"
              name=""
              placeholder="Email Address"
              className="py-3 px-4"
            />
            <button className="py-3 px-6 bg-primary hover:bg-primary/75">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="border-t-2 border-[#363944] py-5 flex flex-col-reverse md:flex-row justify-between items-start md:items-center gap-6">
        <span>2025 @ NamDo. All rights reserved.</span>
        <ul className="flex gap-5">
          <li className="bg-[#363944] text-white rounded-full p-3 text-xl hover:bg-sub-primary hover:text-primary cursor-pointer duration-200">
            <FaFacebookF />
          </li>
          <li className="bg-[#363944] text-white rounded-full p-3 text-xl hover:bg-sub-primary hover:text-primary cursor-pointer duration-200">
            <FaInstagram />
          </li>
          <li className="bg-[#363944] text-white rounded-full p-3 text-xl hover:bg-sub-primary hover:text-primary cursor-pointer duration-200">
            <FaDribbble />
          </li>
          <li className="bg-[#363944] text-white rounded-full p-3 text-xl hover:bg-sub-primary hover:text-primary cursor-pointer duration-200">
            <FaLinkedinIn />
          </li>
          <li className="bg-[#363944] text-white rounded-full p-3 text-xl hover:bg-sub-primary hover:text-primary cursor-pointer duration-200">
            <FaTwitter />
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
