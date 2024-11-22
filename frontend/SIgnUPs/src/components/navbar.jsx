import React from "react";
import logo from "../assets/images/logo.jpg";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-black border-b border-gray-500">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
            <a
              className="flex flex-shrink-0 items-center mr-4"
              href="/index.html"
            >
              <img
                className="h-10 w-auto rounded-full"
                src={logo}
                alt="Catstagram"
              />
              <span className="hidden md:block text-white text-2xl font-billabong ml-2">
                Catstagram
              </span>
            </a>

            <div className="md:ml-auto">
              <div className="flex space-x-2">
                <Link
                  to="/home"
                  className="text-white bg-black hover:bg-gray-600 hover:text-white rounded-full px-3 py-2"
                >
                  Home
                </Link>

                <a
                  href="/website"
                  className="text-white bg-black hover:bg-gray-600 hover:text-white rounded-full px-3 py-2"
                >
                  Website
                </a>

                <a
                  href="/"
                  className="text-white bg-black hover:bg-gray-600 hover:text-white rounded-full px-3 py-2"
                >
                  Logout
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
