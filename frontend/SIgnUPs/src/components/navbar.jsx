import React from "react";
import logo from "../assets/images/logo.jpg";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Home, LogOut, Cat } from "lucide-react"; // Import Lucide icons

const Navbar = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

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
                  to="/"
                  className="group flex items-center text-white bg-black hover:bg-gray-600 hover:text-white rounded-full px-3 py-2"
                >
                  <Home className="w-5 h-5 mr-1 group-hover:text-black" />
                  Home
                </Link>

                <Link
                  to="/website"
                  className="group flex items-center text-white bg-black hover:bg-gray-600 hover:text-white rounded-full px-3 py-2"
                >
                  <Cat className="w-5 h-5 mr-1 group-hover:text-black" />
                  Website
                </Link>

                <a
                  href="/"
                  className="group flex items-center text-white bg-black hover:bg-gray-600 hover:text-white rounded-full px-3 py-2"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5 mr-1 group-hover:text-black" />
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
