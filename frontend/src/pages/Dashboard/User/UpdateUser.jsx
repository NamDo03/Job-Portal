import React, { useEffect, useState } from "react";
import Input from "../../../components/common/Input";
import FileUpload from "../../../components/common/FileUpload";
import { gender } from "../../../constants/constants";
import Select from "../../../components/common/Select";
import MultiSelect from "../../../components/common/MultiSelect";
import { getSkills } from "../../../services/skill";
import { toast } from "react-toastify";
import RadioButton from "../../../components/common/RadioButton";
import Loader from "../../../components/loader/Loader";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { getUserById, updateUser } from "../../../services/user";

const UpdateUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedRole, setSelectedRole] = useState("CANDIDATE");
  const [resume, setResume] = useState(null);
  const [avatar, setAvatar] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      fullname: "",
      password: "",
      gender: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const skillsData = await getSkills(1, 8, "", true);
        setSkills(skillsData?.skills || []);

        const userData = await getUserById(id);
        if (userData) {
          setValue("email", userData.email);
          setValue("fullname", userData.fullname);
          setValue("gender", userData.gender);
          setSelectedRole(userData.role);
          setSelectedSkills(userData.skills || []);
          setAvatar(userData.avatar);
          setResume(userData.resume);
        } else {
          toast.error("Error loading data!");
        }
      } catch (error) {
        console.error("API error:", error);
        toast.error("Error loading data!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    const formData = new FormData();

    formData.append("email", data.email);
    formData.append("fullname", data.fullname);
    formData.append("password", data.password);
    formData.append("gender", data.gender);
    formData.append("role", selectedRole);

    selectedSkills.forEach((skill, index) => {
      formData.append(`skills[${index}]`, skill.id);
    });
    if (avatar) {
      formData.append("avatar", avatar);
    }

    if (resume) {
      formData.append("resume", resume);
    }
    setLoading(true);
    try {
      const response = await updateUser(id, formData);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("User updated successfully!");
        navigate("/admin/user/list");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col gap-3">
      {loading && <Loader />}
      <h2 className="text-3xl font-semibold">Update User</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="pb-6 border-b-2">
          <h3 className="text-lg text-text-primary">Basic Information</h3>
          <span className="text-base text-text-1">
            This is your personal information that you can update anytime.
          </span>
        </div>
        <div className="flex py-6 border-b-2 gap-36">
          <div className="w-[30%]">
            <h3 className="text-lg text-text-primary">Profile Photo</h3>
            <span className="text-base text-text-1">
              This image will be shown publicly as your profile picture, it will
              help recruiters recognize you!
            </span>
          </div>
          <div className="w-[70%]">
            <div className="w-[30%]">
              <FileUpload
                accept="image/*"
                onChange={setAvatar}
                id="avatar"
                initialFile={avatar}
              />
            </div>
          </div>
        </div>
        <div className="flex py-6 border-b-2 gap-36">
          <div className="w-[30%]">
            <h3 className="text-lg text-text-primary">Personal Details</h3>
          </div>
          <div className="w-[70%] grid grid-cols-2 gap-x-5 gap-y-5">
            {/* Email */}
            <Input
              label="Email"
              type="email"
              name="email"
              required={true}
              {...register("email", {
                required: "Email is required...",
                pattern: {
                  value:
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: "Email must be valid",
                },
              })}
              error={errors.email?.message}
              disabled
            />

            {/* Full Name */}
            <Input
              label="Full Name"
              name="fullName"
              placeholder="Enter your full name"
              required={true}
              {...register("fullname", {
                required: "Username is Required...",
                minLength: {
                  value: 3,
                  message: "Username must be atleast 3 characters long...",
                },
                maxLength: {
                  value: 30,
                  message: "Username must be atmost 30 characters long...",
                },
              })}
              error={errors.fullname?.message}
            />

            {/* Gender */}
            <Select
              label="Gender"
              name="gender"
              options={gender}
              disabled={false}
              {...register("gender", { required: "Gender is required" })}
            />
            {/* Skills */}
            <MultiSelect
              label="Skills"
              options={skills}
              selectedValues={selectedSkills}
              onChange={setSelectedSkills}
            />
            {/* Resume */}
            <div className="col-span-2">
              <FileUpload
                label="Resume"
                accept=".pdf"
                onChange={setResume}
                id="resume"
                initialFile={resume}
              />
            </div>
          </div>
        </div>
        <div className="flex py-6 border-b-2 gap-36">
          <div className="w-[30%]">
            <h3 className="text-lg text-text-primary">Account Role</h3>
            <span className="text-base text-text-1">
              You can update your account role!
            </span>
          </div>
          <div className="w-[70%] flex flex-col gap-5">
            <RadioButton
              label="Candidate"
              description="Looking for a job."
              name="candidate"
              value="CANDIDATE"
              checked={selectedRole === "CANDIDATE"}
              onChange={setSelectedRole}
            />
            <RadioButton
              label="Recruiter"
              description="Hiring, sourcing candidates, or posting a jobs"
              name="recruiter"
              value="RECRUITER"
              checked={selectedRole === "RECRUITER"}
              onChange={setSelectedRole}
            />
            <RadioButton
              label="Admin"
              description="Manage users and platform settings"
              name="admin"
              value="ADMIN"
              checked={selectedRole === "ADMIN"}
              onChange={setSelectedRole}
            />
          </div>
        </div>
        <div className="flex justify-end mt-5">
          <button
            type="submit"
            className="px-4 py-2 font-medium text-white transition-all duration-300 ease-out bg-blue-500 rounded-sm min-w-24 hover:bg-blue-600"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};
export default UpdateUser;
