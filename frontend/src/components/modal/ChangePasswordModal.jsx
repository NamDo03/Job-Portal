import React, { useState } from "react";
import Modal from "./Modal";
import Input from "../common/Input";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { changePassword } from "../../services/user";
import Loader from "../loader/Loader";
import { useSelector } from "react-redux";

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const newPassword = watch("newPassword");

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await changePassword(
        currentUser.id,
        data.oldPassword,
        data.newPassword
      );
      if (response.error) {
        setError(response.error);
        reset();
      } else {
        toast.success("Account successfully created!");
        onClose();
        reset();
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again!");
      reset();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="">
          <h2 className="mb-4 text-xl font-bold">Change Password</h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6 mt-4"
          >
            {/* Password */}
            <Input
              label="Old Password"
              type="password"
              {...register("oldPassword", {
                required: "Old password is required",
              })}
              placeholder="Enter your password"
              error={errors.oldPassword?.message}
            />
            {/*New Password */}
            <Input
              label="New Password"
              type="password"
              {...register("newPassword", {
                required: "New password is required",
              })}
              placeholder="Enter your new password"
              error={errors.newPassword?.message}
            />

            {/* Confirm Password */}
            <Input
              label="Confirm New Password"
              type="password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === newPassword || "Passwords do not match",
              })}
              placeholder="Re-enter your new password"
              error={errors.confirmPassword?.message}
            />
            {error && <p className="text-red-500">{error}</p>}

            <div className="flex justify-end col-span-2">
              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default ChangePasswordModal;
