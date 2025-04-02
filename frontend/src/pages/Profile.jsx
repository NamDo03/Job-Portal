import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import avatar_default from "../assets/default_user_avatar.png";
import Input from "../components/common/Input";
import Select from "../components/common/Select";
import MultiSelect from "../components/common/MultiSelect";
import FileUpload from "../components/common/FileUpload";
import ChangePasswordModal from "../components/modal/ChangePasswordModal";
import { AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { updateUser } from "../services/user";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../redux/userSlice";
import Loader from "../components/loader/Loader";
import { gender } from "../constants/constants";
import { getSkills } from "../services/skill";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [resume, setResume] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [skills, setSkills] = useState([]);

  const fileInputRef = useRef(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      fullname: currentUser?.fullname || "",
      email: currentUser?.email || "",
      gender: currentUser?.gender || "MALE",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const skillsData = await getSkills(1, 8, "", true);
        setSkills(skillsData?.skills || []);
      } catch (error) {
        console.error("API error:", error);
        toast.error("Error loading data!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    if (currentUser) {
      reset({
        fullname: currentUser.fullname || "",
        email: currentUser.email || "",
        gender: currentUser.gender || "MALE",
      });
      setSelectedSkills(currentUser.skills || []);
      setResume(currentUser.resume || null);
      setAvatar(currentUser.avatar || null);
    }
  }, [currentUser, reset]);

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const avatarUrl = URL.createObjectURL(file);
      setAvatar(avatarUrl);
      setAvatarFile(file);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    return () => {
      if (avatar && typeof avatar === "string") {
        URL.revokeObjectURL(avatar);
      }
    };
  }, [avatar]);
  const onSubmit = async (data) => {
    const formData = new FormData();
    if (data.fullname) formData.append("fullname", data.fullname);
    if (data.gender) formData.append("gender", data.gender);

    if (avatar) formData.append("avatar", avatar);
    if (avatarFile) formData.append("avatar", avatarFile);
    if (resume) formData.append("resume", resume);
    selectedSkills.forEach((skill, index) => {
      formData.append(`skills[${index}]`, skill.id);
    });
    setIsLoading(true);
    try {
      const response = await updateUser(currentUser.id, formData);
      if (response.error) {
        toast.error(response.error);
      } else {
        dispatch(updateProfile(response));
        toast.success("Profile updated successfully!");
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again!");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {isLoading && <Loader />}
      <div className="main-container bg-[#F9F9F9] py-5">
        <div className="bg-white rounded-lg shadow">
          <div className="w-full h-24 rounded-t-lg bg-gradient-to-r from-purple-200 via-indigo-400 to-violet-600"></div>
          <div className="flex flex-col items-start gap-5 px-6 py-5 mt-3 lg:px-10 lg:justify-between lg:items-center lg:flex-row">
            <div className="flex flex-row gap-5 ">
              {/* Avatar */}
              <div
                className="relative w-20 h-20 rounded-full cursor-pointer group"
                onClick={handleAvatarClick}
              >
                <img
                  src={avatar || avatar_default}
                  alt={currentUser?.fullname || "User avatar"}
                  className="object-cover w-full h-full rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center w-full h-full transition-opacity duration-200 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100">
                  <span className="text-sm font-semibold text-center text-white">
                    Change Avatar
                  </span>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </div>

              {/* Information */}
              <div className="flex flex-col justify-center gap-1">
                <h4 className="text-xl font-semibold text-text-primary heading">
                  {currentUser.fullname}
                </h4>
                <span className="text-lg font-normal text-gray-600">
                  {currentUser.email}
                </span>
              </div>
            </div>
            <button onClick={() => openModal()} className="btn-primary">
              Change Password
            </button>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-6 px-6 py-5 lg:px-10 lg:grid-cols-2 lg:gap-x-12"
          >
            {/* Email */}
            <Input
              label="Email"
              type="email"
              name="Email"
              disabled
              {...register("email")}
              error={errors.email?.message}
            />
            {/* Full Name */}
            <Input
              label="Full Name"
              {...register("fullname", { required: "Full name is required" })}
              placeholder="Enter your full name"
              error={errors.fullname?.message}
            />

            <Select
              label="Gender"
              {...register("gender")}
              options={gender}
              disabled={false}
            />

            <MultiSelect
              label="Skills"
              options={skills}
              selectedValues={selectedSkills}
              onChange={setSelectedSkills}
            />
            <FileUpload
              label="Upload Resume (PDF)"
              accept=".pdf"
              onChange={setResume}
              initialFile={currentUser.resume}
            />
            <div className="flex justify-end lg:col-span-2">
              <button type="submit" className="btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </div>

        <AnimatePresence mode="wait">
          {isModalOpen && (
            <ChangePasswordModal isOpen={isModalOpen} onClose={closeModal} />
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Profile;
