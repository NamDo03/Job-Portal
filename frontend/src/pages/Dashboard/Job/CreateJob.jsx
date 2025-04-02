import React, { useState } from "react";
import Loader from "../../../components/loader/Loader";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { TbBriefcase } from "react-icons/tb";
import { LuClipboardList, LuGift } from "react-icons/lu";
import Step3 from "../../../components/dashboard/job/Step3";
import Step1 from "../../../components/dashboard/job/Step1";
import Step2 from "../../../components/dashboard/job/Step2";
import { createJob } from "../../../services/job";

const CreateJob = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1
  const [title, setTitle] = useState("");
  const [jobType, setJobType] = useState("FULL_TIME");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [salary, setSalary] = useState(null);
  const [position, setPosition] = useState(null);
  const [level, setLevel] = useState(null);
  const [category, setCategory] = useState(null);
  const [amount, setAmount] = useState(1);
  const [location, setLocation] = useState("");
  const [workingHours, setWorkingHours] = useState("");

  // Step 2
  const [description, setDescription] = useState("");
  const [candidateRequirements, setCandidateRequirements] = useState("");

  // Step 3
  const [benefits, setBenefits] = useState("");

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        if (!title || !location || !workingHours) {
          toast.error("Please fill in all required fields in Step 1.");
          return false;
        }
        break;
      case 2:
        if (!description || !candidateRequirements) {
          toast.error("Please fill in all required fields in Step 2.");
          return false;
        }
        break;
      case 3:
        if (!benefits) {
          toast.error("Please fill in all required fields in Step 3.");
          return false;
        }
        break;
      default:
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep()) {
      return;
    }

    setLoading(true);
    try {
      const skillIds = selectedSkills.map((skill) => skill.id);
      const jobData = {
        companyId: currentUser.companyMemberships[0].companyId,
        categoryId: category,
        positionId: position,
        salaryId: salary,
        experienceLevelId: level,
        title: title,
        jobDescription: description,
        candidateRequirements: candidateRequirements,
        benefits: benefits,
        workingHours: workingHours,
        location: location,
        jobType: jobType,
        amount: amount,
        skillIds: skillIds,
      };
      await createJob(jobData);
      toast.success("Job created successfully!");
      navigate("/recruiter-dashboard/job/list");
    } catch (error) {
      console.error("Error creating job:", error);
      toast.error(error.message || "Failed to create job. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col gap-3">
      {loading && <Loader />}
      <h2 className="text-3xl font-semibold">Post a Job</h2>
      {/* Step Indicator */}
      <div className="px-6 py-3.5 border-2 border-text-footer flex justify-between items-center">
        {/* Step 1 */}
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center justify-center rounded-full w-14 h-14 ${
              currentStep >= 1
                ? "bg-primary text-white"
                : "bg-secondary text-text-2"
            }`}
          >
            <TbBriefcase size={24} />
          </div>
          <div className="">
            <span
              className={`text-base ${
                currentStep >= 1 ? "text-primary" : "text-[#A8ADB7]"
              }`}
            >
              Step 1/3
            </span>
            <h3
              className={`text-lg ${
                currentStep >= 1 ? "text-text-primary" : "text-text-2"
              }`}
            >
              Job Information
            </h3>
          </div>
        </div>

        <div className="h-12 mx-4 border-l-2 border-gray-300"></div>

        {/* Step 2 */}
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center justify-center rounded-full w-14 h-14 ${
              currentStep >= 2
                ? "bg-primary text-white"
                : "bg-secondary text-text-2"
            }`}
          >
            <LuClipboardList size={24} />
          </div>
          <div className="">
            <span
              className={`text-base ${
                currentStep >= 2 ? "text-primary" : "text-[#A8ADB7]"
              }`}
            >
              Step 2/3
            </span>
            <h3
              className={`text-lg ${
                currentStep >= 2 ? "text-text-primary" : "text-text-2"
              }`}
            >
              Job Description
            </h3>
          </div>
        </div>

        <div className="h-12 mx-4 border-l-2 border-gray-300"></div>

        {/* Step 3 */}
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center justify-center rounded-full w-14 h-14 ${
              currentStep >= 3
                ? "bg-primary text-white"
                : "bg-secondary text-text-2"
            }`}
          >
            <LuGift size={24} />
          </div>
          <div className="">
            <span
              className={`text-base ${
                currentStep >= 3 ? "text-primary" : "text-[#A8ADB7]"
              }`}
            >
              Step 3/3
            </span>
            <h3
              className={`text-lg ${
                currentStep >= 3 ? "text-text-primary" : "text-text-2"
              }`}
            >
              Perks & Benefit
            </h3>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter" && currentStep < 3) {
            e.preventDefault();
          }
        }}
      >
        {currentStep === 1 && (
          <Step1
            title={title}
            setTitle={setTitle}
            location={location}
            setLocation={setLocation}
            jobType={jobType}
            setJobType={setJobType}
            selectedSkills={selectedSkills}
            setSelectedSkills={setSelectedSkills}
            salary={salary}
            setSalary={setSalary}
            position={position}
            setPosition={setPosition}
            level={level}
            setLevel={setLevel}
            category={category}
            setCategory={setCategory}
            amount={amount}
            setAmount={setAmount}
            workingHours={workingHours}
            setWorkingHours={setWorkingHours}
          />
        )}
        {currentStep === 2 && (
          <Step2
            description={description}
            setDescription={setDescription}
            candidateRequirements={candidateRequirements}
            setCandidateRequirements={setCandidateRequirements}
          />
        )}
        {currentStep === 3 && (
          <Step3 benefits={benefits} setBenefits={setBenefits} />
        )}

        {/* Button */}
        <div className="flex justify-between w-full mt-5">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 font-medium text-white transition-all duration-300 ease-out bg-blue-500 rounded-sm min-w-24 hover:bg-blue-600"
            >
              Back
            </button>
          )}
          <div className="flex-1"></div>
          {currentStep < 3 && (
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 font-medium text-white transition-all duration-300 ease-out bg-blue-500 rounded-sm min-w-24 hover:bg-blue-600"
            >
              Next
            </button>
          )}
          {currentStep === 3 && (
            <button
              type="submit"
              className="px-4 py-2 font-medium text-white transition-all duration-300 ease-out bg-blue-500 rounded-sm min-w-24 hover:bg-blue-600"
            >
              Create
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateJob;
