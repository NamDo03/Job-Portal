import React, { useState } from "react";
import img from "../assets/login.svg";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/common/Logo";
import { useForm } from "react-hook-form";
import { login } from "../services/auth";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { loginFailure, loginStart, loginSuccess } from "../redux/userSlice";
import Modal from "../components/modal/Modal";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [isLoading, setIsLoading] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    setIsLoading(true);
    dispatch(loginStart());
    try {
      const response = await login(data);
      if (response.status === "BLOCKED") {
        setIsBlocked(true);
        return;
      }
      if (response.error) {
        toast.error(response.error);
        dispatch(loginFailure());
      } else {
        toast.success("Login successful!");
        dispatch(loginSuccess(response));
        if (response.role === "ADMIN") {
          navigate("/admin");
        }
        if (response.role === "RECRUITER") {
          navigate("/recruiter-dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again!");
      dispatch(loginFailure());
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center w-screen h-screen bg-white">
      <div className="w-full lg:w-[80%] h-fit lg:h-[80%] flex flex-col lg:flex-row bg-white p-4 rounded-lg shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)]">
        <div className="h-full w-[40%] bg-sub-primary hidden lg:flex flex-col justify-center">
          <div className="mt-5 ml-20">
            <Logo />
          </div>
          <img src={img} />
        </div>
        <div className="w-full lg:w-[60%] px-2 md:px-6 lg:px-20 xl:px-28 py-10 flex flex-col gap-6 justify-center">
          <div className="block lg:hidden">
            <Logo />
          </div>
          <h3 className="text-3xl text-center text-text-primary">
            Welcome Back
          </h3>
          {/* <button className="flex items-center justify-center gap-2 px-6 py-2 text-lg font-semibold transition border text-primary hover:bg-gray-100">
            <FcGoogle size={28} />
            Login with Google
          </button>
          <div className="flex items-center gap-4">
            <hr className="flex-grow border-gray-300" />
            <p className="text-sm font-medium text-neutral-400">
              Or login with email
            </p>
            <hr className="flex-grow border-gray-300" />
          </div> */}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
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
            <button
              disabled={isLoading}
              className="w-full py-3 font-semibold text-white transition bg-primary hover:bg-primary/85"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
          <div className="flex flex-row gap-2">
            <span className="font-medium text-neutral-400">
              Don’t have an account?
            </span>
            <Link
              to="/signup"
              className="font-semibold text-primary hover:underline"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
      {isBlocked && (
        <Modal isOpen={isBlocked} onClose={() => setIsBlocked(false)}>
          <h2 className="mb-4 text-xl font-bold">Account Blocked</h2>
          <p>
            Your account has been locked. Please contact the administrator for
            more details.
          </p>
        </Modal>
      )}
    </div>
  );
};

export default Login;
