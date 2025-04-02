import React from "react";
import { Link } from "react-router-dom";
import img from "../assets/404-computer.svg";

const NotFounded = () => {
  return (
    <section className="bg-white">
      <div className="max-w-screen-xl px-4 py-8 mx-auto lg:py-16 lg:px-6">
        <div className="max-w-screen-sm mx-auto text-center">
          <div className="flex items-center justify-center ">
            <img src={img} alt="Image Not Founded" className="object-cover" />
          </div>

          <h1 className="mb-4 font-extrabold tracking-tight text-indigo-600 text-7xl lg:text-8xl text-indigo">
            404
          </h1>
          <p className="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Something's missing.
          </p>
          <p className="mb-4 text-lg font-light text-gray-500">
            Sorry, we can't find that page. You'll find lots to explore on the
            home page.{" "}
          </p>
          <Link
            to="/"
            className="inline-flex text-white bg-indigo-600 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-base px-5 py-2.5 text-center my-4"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFounded;
