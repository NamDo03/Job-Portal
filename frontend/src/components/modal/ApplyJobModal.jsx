import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { BsDot } from "react-icons/bs";
import { RiAttachment2 } from "react-icons/ri";
import { FaRegFileAlt, FaRegTrashAlt, FaEye } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  modalVariants,
  overlayVariants,
} from "../../animations/motionVariants";
import company_default from "../../assets/company_default.png";
import { formatLocation } from "../../utils/locationFormatter";
import { formatJobType } from "../../utils/jobTypeFormatter";
import { useSelector } from "react-redux";

const ApplyJobModal = ({ job, onClose }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [option, setOption] = useState("manual");
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState(null);
  const [profileError, setProfileError] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleRemoveResume = () => {
    setResume(null);
  };

  const onSubmit = (data) => {
    if (option === "profile") {
      if (!currentUser.resume) {
        setProfileError(true);
        return;
      }
      console.log("Ứng tuyển bằng hồ sơ cá nhân", coverLetter);
    } else {
      console.log("Thông tin ứng tuyển:", data);
    }
    onClose();
  };

  return (
    <motion.div
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onClose}
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-[100]"
    >
      <motion.form
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.5, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-lg shadow-lg w-[35%] h-[85%]  flex flex-col"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 p-6 bg-white border-b">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-text-primary hover:text-text-primary/70"
          >
            <MdClose size={30} />
          </button>
          <div className="flex flex-row gap-6">
            <img
              src={job.company.logo || company_default}
              alt="Company Logo"
              className="object-cover w-12 h-12 md:w-14 md:h-14 lg:w-20 lg:h-20"
            />
            <div className="flex flex-col justify-center gap-2">
              <h2 className="text-lg font-semibold md:text-xl lg:text-2xl text-text-primary">
                {job.title}
              </h2>
              <span className="flex flex-row flex-wrap items-center text-lg text-text-1">
                {job.company.name}
                <BsDot />
                {formatLocation(job.company?.location) || "Location"} <BsDot />
                {formatJobType(job.jobType) || "Not specified"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <h2 className="mx-6 my-2 text-xl font-semibold text-text-primary">
            Submit your application
          </h2>
          <p className="mx-6 mb-3 text-base text-text-2">
            Please provide the required information
          </p>

          <div className="flex flex-col gap-3 mx-6 mb-6">
            <label
              className={`flex flex-col justify-center border py-2.5 px-4 rounded-lg transition ease-in-out duration-300 hover:text-primary hover:border-primary
              ${
                option === "profile"
                  ? "border-primary text-primary"
                  : "border-text-footer"
              }`}
            >
              <div className="flex items-center gap-2 font-semibold cursor-pointer">
                <input
                  type="radio"
                  value="profile"
                  checked={option === "profile"}
                  onChange={() => {
                    setOption("profile");
                    setProfileError(false);
                  }}
                  className="accent-primary"
                />
                Use Profile Info
              </div>

              <div
                className={`transition-all ease-in-out duration-300 overflow-hidden ${
                  option === "profile"
                    ? "max-h-20 mt-3 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-base text-text-primary">
                  Fullname:{" "}
                  <span className="font-semibold">{currentUser.fullname}</span>
                </p>
                <p className="text-base text-text-primary">
                  Email:{" "}
                  <span className="font-semibold">{currentUser.email}</span>
                </p>
                {currentUser.resume && (
                  <p className="flex items-center gap-2 text-base text-text-primary">
                    CV: <span className="font-semibold">MyResume.pdf</span>{" "}
                    <a
                      href={currentUser.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-pointer hover:opacity-80"
                    >
                      <FaEye size={20} />
                    </a>
                  </p>
                )}
              </div>
            </label>

            <label
              className={`flex flex-col justify-center  cursor-pointer border py-2.5 px-4 rounded-lg transition ease-in-out duration-300 hover:text-primary hover:border-primary
              ${option === "manual" ? "border-primary" : "border-text-footer"}`}
            >
              <div className="flex items-center gap-2 font-semibold">
                <input
                  type="radio"
                  value="manual"
                  checked={option === "manual"}
                  onChange={() => setOption("manual")}
                  className="accent-primary text-primary"
                />
                Enter Manually
              </div>

              <div
                className={`transition-all ease-in-out duration-300 overflow-hidden flex flex-col gap-5 ${
                  option === "manual"
                    ? "max-h-[400px] mt-3 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="flex flex-col gap-1">
                  <label className="text-base font-medium text-text-primary">
                    Fullname <span className="text-xl text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    {...register("name", {
                      required:
                        option === "manual" ? "Fullname is required" : false,
                    })}
                    placeholder="Fullname"
                    className="p-3 border border-text-1 text-text-primary"
                  />
                  {errors.name && (
                    <p className="text-red-500">{errors.name.message}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-base font-medium text-text-primary">
                    Email address{" "}
                    <span className="text-xl text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="email"
                    {...register("email", {
                      required:
                        option === "manual" ? "Email is required" : false,
                      pattern:
                        option === "manual"
                          ? {
                              value:
                                /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                              message: "Invalid email format",
                            }
                          : undefined,
                    })}
                    placeholder="Email"
                    className="p-3 border border-text-1 text-text-primary"
                  />
                  {errors.email && (
                    <p className="text-red-500">{errors.email.message}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-base font-medium text-text-primary">
                    Attach your resume{" "}
                    <span className="text-xl text-red-500">*</span>
                  </label>
                  <div className="flex">
                    {resume ? (
                      <div className="flex flex-row items-center gap-2">
                        <FaRegFileAlt size={22} className="text-primary" />
                        <span className="text-primary">{resume.name}</span>
                        <button
                          onClick={handleRemoveResume}
                          className="p-2 text-red-600 bg-red-100 rounded-lg hover:bg-red-200"
                        >
                          <FaRegTrashAlt size={18} />
                        </button>
                      </div>
                    ) : (
                      <label
                        htmlFor="resume"
                        className="flex flex-col items-center justify-center w-full px-5 py-5 border-2 border-dashed rounded-lg cursor-pointer border-primary bg-sub-primary"
                      >
                        <div className="flex flex-row items-center justify-center gap-4">
                          <RiAttachment2 size={28} className="text-primary" />
                          <span className="ml-3 text-base font-medium text-gray-500">
                            Attach Resume/CV
                          </span>
                        </div>
                        <input
                          id="resume"
                          type="file"
                          className="hidden"
                          accept=".pdf"
                          {...register("resume", {
                            required:
                              option === "manual"
                                ? "Resume is required"
                                : false,
                          })}
                          onChange={(e) => setResume(e.target.files[0])}
                        />
                      </label>
                    )}
                  </div>
                  {errors.resume && (
                    <p className="text-red-500">{errors.resume.message}</p>
                  )}
                </div>
              </div>
            </label>
          </div>

          <div className="mx-6">
            <h2 className="mb-2 text-xl font-semibold text-text-primary">
              A short cover letter
            </h2>
            <p className="mb-3 text-base text-text-2 ">
              Briefly describe why you are interested in this position.
            </p>
            <textarea
              name="coverLetter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Add a cover letter or anything else you want to share"
              className="w-full p-3 border text-text-primary border-text-1 min-h-32"
            ></textarea>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-10 px-5 bg-white border-t py-7">
          {profileError && (
            <p className="mb-4 font-medium text-red-500">
              Please{" "}
              <a href="/profile" className="underline text-primary">
                add your resume
              </a>{" "}
              in your profile before applying
            </p>
          )}

          <button
            type="submit"
            className="bg-primary text-white text-base font-semibold px-6 py-2.5 rounded hover:bg-primary/80 w-full"
            onClick={handleSubmit}
          >
            Apply Now
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
};

export default ApplyJobModal;
