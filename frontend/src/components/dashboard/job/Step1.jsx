import React, { useEffect, useRef, useState } from "react";
import Input from "../../common/Input";
import { jobTypeData } from "../../../constants/constants";
import { getSalaries } from "../../../services/salary";
import { getCategories } from "../../../services/category";
import { getSkills } from "../../../services/skill";
import { getPositions } from "../../../services/position";
import { getLevels } from "../../../services/level";
import RadioButton from "../../common/RadioButton";
import Checkbox from "../../common/Checkbox";
import Select from "../../../components/common/Select";
import { GoPlus } from "react-icons/go";
import { MdClose } from "react-icons/md";
import Loader from "../../loader/Loader";
import RichTextEditor from "../../common/TextEditor/RichTextEditor";
import { toast } from "react-toastify";

const Step1 = ({
  title,
  setTitle,
  jobType,
  setJobType,
  selectedSkills,
  setSelectedSkills,
  salary,
  setSalary,
  position,
  setPosition,
  level,
  setLevel,
  category,
  setCategory,
  amount,
  setAmount,
  location,
  setLocation,
  workingHours,
  setWorkingHours,
}) => {
  const skillDropdownRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const [salaryData, setSalaryData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [skillData, setSkillData] = useState([]);
  const [positionData, setPositionData] = useState([]);
  const [levelData, setLevelData] = useState([]);

  const [isSkillDropdownOpen, setIsSkillDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSkills = skillData.filter((skill) =>
    skill.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [salaries, categories, skills, positions, levels] =
          await Promise.all([
            getSalaries(1, "", true),
            getCategories(1, "", true),
            getSkills(1, 8, "", true),
            getPositions(1, "", true),
            getLevels(1, "", true),
          ]);
        setSalaryData(salaries.salaries);
        setCategoryData(categories.categories);
        setSkillData(skills.skills);
        setPositionData(positions.positions);
        setLevelData(levels.levels);

        setSalary(salaries.salaries.length > 0 ? salaries.salaries[0].id : "");
        setCategory(
          categories.categories.length > 0 ? categories.categories[0].id : ""
        );
        setPosition(
          positions.positions.length > 0 ? positions.positions[0].id : ""
        );
        setLevel(levels.levels.length > 0 ? levels.levels[0].id : "");
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        skillDropdownRef.current &&
        !skillDropdownRef.current.contains(event.target)
      ) {
        setIsSkillDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddSkills = () => {
    setIsSkillDropdownOpen(!isSkillDropdownOpen);
  };

  const handleSelectSkill = (skill) => {
    const isSkillSelected = selectedSkills.some((s) => s.id === skill.id);
    if (isSkillSelected) {
      setSelectedSkills(selectedSkills.filter((s) => s.id !== skill.id));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
    setIsSkillDropdownOpen(false);
    setSearchTerm("");
  };

  const handleRemoveSkill = (skillId) => {
    setSelectedSkills(selectedSkills.filter((s) => s.id !== skillId));
  };
  return (
    <>
      {loading && <Loader />}

      <div className="pb-6 border-b-2">
        <h3 className="text-lg text-text-primary">Basic Information</h3>
        <span className="text-base text-text-1">
          This information will be displayed publicly
        </span>
      </div>
      {/* Title */}
      <div className="flex py-6 border-b-2 gap-36">
        <div className="w-[30%]">
          <h3 className="text-lg text-text-primary">Job Title</h3>
          <span className="text-base text-text-1">
            Job titles must be describe one position
          </span>
        </div>
        <div className="w-[70%]">
          <div className="w-[70%]">
            <Input
              name="title"
              placeholder="Enter job title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required={true}
            />
          </div>
        </div>
      </div>
      {/* Type of job */}
      <div className="flex py-6 border-b-2 gap-36">
        <div className="w-[30%]">
          <h3 className="text-lg text-text-primary">Type of Employment</h3>
          <span className="text-base text-text-1">
            Choose the type of employment for this job. Only one option can be
            selected.
          </span>
        </div>
        <div className="w-[70%] flex flex-col gap-3">
          {jobTypeData.map((type) => (
            <div key={type.value}>
              <RadioButton
                label={type.label}
                name={type.value}
                value={type.value}
                checked={jobType === type.value}
                onChange={() => setJobType(type.value)}
              />
            </div>
          ))}
        </div>
      </div>
      {/* Required skills */}
      <div className="flex py-6 border-b-2 gap-36">
        <div className="w-[30%]">
          <h3 className="text-lg text-text-primary">Required Skills</h3>
          <span className="text-base text-text-1">
            Add required skills for the job
          </span>
        </div>
        <div className="w-[70%]">
          <div className="w-[70%] relative">
            <button
              type="button"
              className="flex flex-row items-center justify-center gap-2 px-4 py-3 text-base font-semibold transition-colors duration-200 ease-in border text-primary border-third hover:bg-secondary"
              onClick={handleAddSkills}
            >
              <GoPlus size={20} />
              Add Skills
            </button>
            {isSkillDropdownOpen && (
              <div
                ref={skillDropdownRef}
                className="absolute top-0 left-0 z-10 w-56 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg max-h-60"
              >
                <input
                  type="text"
                  placeholder="Search skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300"
                />
                {filteredSkills.map((skill) => (
                  <div key={skill.id}>
                    <Checkbox
                      content={skill.name}
                      checked={selectedSkills.some((s) => s.id === skill.id)}
                      onChange={() => handleSelectSkill(skill)}
                      id={skill.id}
                    />
                  </div>
                ))}
              </div>
            )}
            {selectedSkills.length > 0 && (
              <div className="mt-3">
                <ul className="flex flex-wrap gap-3">
                  {selectedSkills.map((skill) => (
                    <li
                      key={skill.id}
                      className="px-2.5 py-1 bg-sub-primary text-primary flex gap-2 justify-center items-center font-medium"
                    >
                      {skill.name}{" "}
                      <MdClose
                        className="cursor-pointer"
                        onClick={() => handleRemoveSkill(skill.id)}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Salary */}
      <div className="flex py-6 border-b-2 gap-36">
        <div className="w-[30%]">
          <h3 className="text-lg text-text-primary">Salary</h3>
          <span className="text-base text-text-1">
            Select the salary range for this job
          </span>
        </div>
        <div className="w-[70%]">
          <div className="w-[70%]">
            <Select
              options={salaryData.map((salary) => ({
                label: `${salary.min}-${salary.max}`,
                value: salary.id,
              }))}
              value={salary || ""}
              onChange={(e) => setSalary(e.target.value)}
            />
          </div>
        </div>
      </div>
      {/* Position */}
      <div className="flex py-6 border-b-2 gap-36">
        <div className="w-[30%]">
          <h3 className="text-lg text-text-primary">Position</h3>
          <span className="text-base text-text-1">
            Choose the position for this job.
          </span>
        </div>
        <div className="w-[70%]">
          <div className="w-[70%]">
            <Select
              options={positionData.map((position) => ({
                label: `${position.name}`,
                value: position.id,
              }))}
              value={position || ""}
              onChange={(e) => setPosition(e.target.value)}
            />
          </div>
        </div>
      </div>
      {/* Level */}
      <div className="flex py-6 border-b-2 gap-36">
        <div className="w-[30%]">
          <h3 className="text-lg text-text-primary">Level</h3>
          <span className="text-base text-text-1">
            Select the experience level required for this job.
          </span>
        </div>
        <div className="w-[70%]">
          <div className="w-[70%]">
            <Select
              options={levelData.map((level) => ({
                label: `${level.name}`,
                value: level.id,
              }))}
              value={level || ""}
              onChange={(e) => setLevel(e.target.value)}
            />
          </div>
        </div>
      </div>
      {/* Category  */}
      <div className="flex py-6 border-b-2 gap-36">
        <div className="w-[30%]">
          <h3 className="text-lg text-text-primary">Categories</h3>
          <span className="text-base text-text-1">
            Choose the category that best describes this job.
          </span>
        </div>
        <div className="w-[70%]">
          <div className="w-[70%]">
            <Select
              options={categoryData.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
              value={category || ""}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
        </div>
      </div>
      {/* Amount */}
      <div className="flex py-6 border-b-2 gap-36">
        <div className="w-[30%]">
          <h3 className="text-lg text-text-primary">Amount</h3>
          <span className="text-base text-text-1">
            Enter the number of openings available for this position.
          </span>
        </div>
        <div className="w-[70%]">
          <div className="w-[70%]">
            <Input
              name="amount"
              placeholder="Enter job title"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required={true}
              type="number"
            />
          </div>
        </div>
      </div>
      {/* Location */}
      <div className="flex py-6 border-b-2 gap-36">
        <div className="w-[30%]">
          <h3 className="text-lg text-text-primary">Location</h3>
          <span className="text-base text-text-1">
            Enter the location where this job will be based.
          </span>
        </div>
        <div className="w-[70%]">
          <div className="w-[70%]">
            <Input
              name="location"
              placeholder="Enter location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required={true}
            />
          </div>
        </div>
      </div>
      {/* Working Hours */}
      <div className="flex py-6 border-b-2 gap-36">
        <div className="w-[30%]">
          <h3 className="text-lg text-text-primary">Working Hours</h3>
          <span className="text-base text-text-1">
            Enter the working hours for this job.
          </span>
        </div>
        <div className="w-[70%]">
          <div className="w-[70%]">
            <RichTextEditor
              value={workingHours}
              onChange={(value) => setWorkingHours(value)}
              placeholder="Enter working hours"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Step1;
