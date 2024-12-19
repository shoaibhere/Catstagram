import React, { useState, useEffect } from "react";
import logo from "../assets/images/logo.jpg";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Home, LogOut, Cat, Settings, Sun, Moon, Lock } from "lucide-react"; // Import Lucide icons
import ChangePassword from "../pages/ChangePasswordPage"; // Import the ChangePassword component

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isChangePasswordOpen, setChangePasswordOpen] = useState(false); // Track ChangePassword component visibility

  // Effect to apply theme on page load
  useEffect(() => {
    localStorage.setItem("theme", theme); // Persist theme in localStorage
  }, [theme]);

  const handleLogout = () => {
    logout();
  };

  const handleThemeSwitch = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme); // Update theme state
  };

  const handleChangePassword = () => {
    setChangePasswordOpen(true); // Open the ChangePassword component
  };

  const handleCloseChangePassword = () => {
    setChangePasswordOpen(false); // Close the ChangePassword component
  };

  return (
    <nav
      className={
        theme === "dark"
          ? "bg-black border-b border-gray-500"
          : "bg-white border-b border-gray-500"
      }
    >
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
              <span
                className={
                  theme === "dark"
                    ? "hidden md:block text-white text-2xl font-billabong ml-2"
                    : "hidden md:block text-black text-2xl font-billabong ml-2"
                }
              >
                Catstagram
              </span>
            </a>

            <div className="md:ml-auto">
              <div className="flex space-x-2">
                <Link
                  to="/"
                  className={
                    theme === "dark"
                      ? "group flex items-center text-white bg-black hover:bg-gray-600 hover:text-white rounded-full px-3 py-2"
                      : "group flex items-center text-black bg-white hover:bg-gray-200 hover:text-black rounded-full px-3 py-2"
                  }
                >
                  <Home
                    className={
                      theme === "dark"
                        ? "w-5 h-5 mr-1 group-hover:text-black"
                        : "w-5 h-5 mr-1 group-hover:text-white"
                    }
                  />
                  Home
                </Link>

                <a
                  href="/website"
                  className={
                    theme === "dark"
                      ? "group flex items-center text-white bg-black hover:bg-gray-600 hover:text-white rounded-full px-3 py-2"
                      : "group flex items-center text-black bg-white hover:bg-gray-200 hover:text-black rounded-full px-3 py-2"
                  }
                >
                  <Cat
                    className={
                      theme === "dark"
                        ? "w-5 h-5 mr-1 group-hover:text-black"
                        : "w-5 h-5 mr-1 group-hover:text-white"
                    }
                  />
                  Website
                </a>

                <button
                  className={
                    theme === "dark"
                      ? "group flex items-center text-white bg-black hover:bg-gray-600 hover:text-white rounded-full px-3 py-2"
                      : "group flex items-center text-black bg-white hover:bg-gray-200 hover:text-black rounded-full px-3 py-2"
                  }
                  onClick={handleLogout}
                >
                  <LogOut
                    className={
                      theme === "dark"
                        ? "w-5 h-5 mr-1 group-hover:text-black"
                        : "w-5 h-5 mr-1 group-hover:text-white"
                    }
                  />
                  Logout
                </button>

                {/* Gear Icon for settings dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!isDropdownOpen)}
                    className={
                      theme === "dark"
                        ? "group flex items-center text-white bg-black hover:bg-gray-600 hover:text-white rounded-full px-3 py-2"
                        : "group flex items-center text-black bg-white hover:bg-gray-200 hover:text-black rounded-full px-3 py-2"
                    }
                  >
                    <Settings
                      className={
                        theme === "dark"
                          ? "w-5 h-5 mr-1 group-hover:text-black"
                          : "w-5 h-5 mr-1 group-hover:text-white"
                      }
                    />
                  </button>

                  {/* Dropdown menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-black text-white rounded-md shadow-lg">
                      <div className="flex items-center px-4 py-2 cursor-pointer">
                        {/* Theme switch button */}
                        <button
                          onClick={handleThemeSwitch}
                          className="flex items-center space-x-2 w-full"
                        >
                          {theme === "dark" ? (
                            <Sun className="w-5 h-5" />
                          ) : (
                            <Moon className="w-5 h-5" />
                          )}
                          <span>Toggle Theme</span>
                        </button>
                      </div>
                      <div className="border-t border-gray-600"></div>
                      <div
                        className="flex items-center px-4 py-2 cursor-pointer"
                        onClick={handleChangePassword}
                      >
                        <Lock className="w-5 h-5 mr-2" />
                        <span>Change Password</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-1/3">
            <ChangePassword onClose={handleCloseChangePassword} />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
