import React, { useState } from "react";
import img from "../assets/login.svg";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/common/Logo";
import { useForm } from "react-hook-form";
import { signup, verifyEmail } from "../services/auth";
import { toast } from "react-toastify";
import logo from "../assets/logo.png";

const SignUp = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await signup(data);
      if (response.error) {
        toast.error(response.error);
      } else {
        setStep(2);
        setFormData(data);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    setIsLoading(true);
    try {
      const response = await verifyEmail(formData, code);
      if (response.success === true) {
        toast.success("Account created successfully!");
        navigate("/login");
      } else {
        toast.error(response.message || "Verification failed!");
      }
    } catch (error) {
      console.error(error.response?.data?.message || "Verification failed");
      toast.error(
        error.response?.data?.message ||
          "Verification failed. Please try again!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const password = watch("password");
  return (
    <div className="flex items-center justify-center w-screen h-screen bg-white">
      {step === 1 && (
        <div className="w-full lg:w-[80%] h-fit lg:h-[90%] flex flex-col lg:flex-row bg-white p-4 rounded-lg shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)]">
          <div className="w-full lg:w-[60%] px-2 md:px-6 lg:px-20 xl:px-28 py-3 lg:py-10 flex flex-col gap-4 lg:gap-6 justify-center">
            <div className="block lg:hidden">
              <Logo />
            </div>
            <h3 className="text-xl text-center text-text-primary lg:text-3xl">
              Get more opportunities
            </h3>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-3 lg:gap-5"
            >
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="name"
                  className="text-base font-medium text-text-primary"
                >
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-primary"
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
                />
                <span className="text-sm text-red-500">
                  {errors.fullname?.message}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="text-base font-medium text-text-primary"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="text"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-primary"
                  {...register("email", {
                    required: "Email is required...",
                    pattern: {
                      value:
                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                      message: "Email must be valid",
                    },
                  })}
                />
                <span className="text-sm text-red-500">
                  {errors.email?.message}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="password"
                  className="text-base font-medium text-text-primary"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-primary"
                  {...register("password", {
                    required: "Password is Required...",
                    pattern: {
                      value: /^.{6,}$/,
                      message: "Password Must Contain Atleast 6 Characters",
                    },
                  })}
                />
                <span className="text-sm text-red-500">
                  {errors.password?.message}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-base font-medium text-text-primary"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  className="w-full px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-primary"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                />
                <span className="text-sm text-red-500">
                  {errors.confirmPassword?.message}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="gender"
                  className="text-base font-medium text-text-primary"
                >
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  className="w-full px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-primary"
                  {...register("gender", { required: "Gender is required" })}
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
                <span className="text-sm text-red-500">
                  {errors.gender?.message}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="role"
                  className="text-base font-medium text-text-primary"
                >
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  className="w-full px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-primary"
                  {...register("role", { required: "Role is required" })}
                >
                  <option value="CANDIDATE">Candidate</option>
                  <option value="RECRUITER">Recruiter</option>
                </select>
                <span className="text-sm text-red-500">
                  {errors.role?.message}
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 font-semibold text-white transition bg-primary hover:bg-primary/85"
                disabled={isLoading}
              >
                {isLoading ? "Signing Up..." : "Sign Up"}
              </button>
            </form>
            <div className="flex flex-row gap-2">
              <span className="font-medium text-neutral-400">
                Already have an account??
              </span>
              <Link
                to="/login"
                className="font-semibold text-primary hover:underline"
              >
                Login
              </Link>
            </div>
          </div>

          <div className="h-full w-[40%] bg-sub-primary hidden lg:flex flex-col justify-center">
            <div className="mt-5 ml-20">
              <Logo />
            </div>
            <img src={img} />
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="flex flex-col items-center gap-6 px-16 py-6 bg-white border rounded-lg shadow-xl">
          <img src={logo} alt="logo" />
          <h3 className="text-xl text-center text-text-primary">
            Please check your email.
          </h3>
          <p className="text-base font-medium text-center text-text-2">
            We sent a code to{" "}
            <strong className="font-medium text-text-primary">
              {formData.email}
            </strong>
          </p>
          <div className="flex gap-2">
            {[...Array(6)].map((_, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className="w-12 h-12 text-lg text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary ring-offset-1"
                value={code[index] || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  if (!/^\d?$/.test(val)) return;
                  const newCode = code.split("");
                  newCode[index] = val;
                  setCode(newCode.join(""));
                  if (val && index < 5) {
                    const next = document.getElementById(
                      `code-input-${index + 1}`
                    );
                    next?.focus();
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !code[index] && index > 0) {
                    const prev = document.getElementById(
                      `code-input-${index - 1}`
                    );
                    prev?.focus();
                  }
                }}
                id={`code-input-${index}`}
              />
            ))}
          </div>

          <button
            onClick={handleVerify}
            disabled={code.length < 6 || isLoading}
            className={`w-full px-6 py-2 font-semibold text-white transition rounded ${
              code.length < 6
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary hover:bg-primary/85"
            }`}
          >
            {isLoading ? "Verifying..." : "Verify and Register"}
          </button>

          <p className="text-base font-medium text-center text-text-2">
            Didn't receive an email?{" "}
            <strong
              className="font-medium cursor-pointer text-text-primary hover:underline"
              onClick={() => signup(formData)}
            >
              Resend
            </strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default SignUp;
