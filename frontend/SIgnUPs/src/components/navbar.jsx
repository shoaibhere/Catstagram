import React, { useState, useEffect } from "react";
import logo from "../assets/images/logo.jpg";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import {
  Home,
  LogOut,
  Cat,
  Settings,
  Sun,
  Moon,
  Lock,
  ChevronDown,
} from "lucide-react";
import ChangePassword from "../pages/ChangePasswordPage";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isChangePasswordOpen, setChangePasswordOpen] = useState(false);

  // Apply theme from localStorage and persist it
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleLogout = () => {
    logout();
  };

  const handleThemeSwitch = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "dark" ? "light" : "dark";
      localStorage.setItem("theme", newTheme); // Update theme in localStorage
      window.location.reload();
      return newTheme;
    });
  };

  const handleChangePassword = () => {
    setChangePasswordOpen(true);
  };

  const handleCloseChangePassword = () => {
    setChangePasswordOpen(false);
  };

  // Conditional theme classes
  const navbarClasses =
    theme === "dark" ? "bg-black text-white" : "bg-white text-black";
  const buttonClasses =
    theme === "dark"
      ? "group flex items-center text-white bg-black hover:bg-gray-600 hover:text-white rounded-full px-3 py-2"
      : "group flex items-center text-black bg-white hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white rounded-full px-3 py-2";

  const dropdownMenuClasses =
    theme === "dark" ? "bg-black text-white" : "bg-white text-black";

  const iconClasses =
    theme === "dark"
      ? "w-5 h-5 mr-1 group-hover:text-black"
      : "w-5 h-5 mr-1 group-hover:text-white";

  return (
    <nav className={`${navbarClasses} border-b border-gray-500`}>
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
              <span className="hidden md:block text-2xl font-billabong ml-2">{`Catstagram`}</span>
            </a>

            <div className="md:ml-auto">
              <div className="flex space-x-2">
                <Link to="/" className={buttonClasses}>
                  <Home className={iconClasses} />
                  Home
                </Link>

                <a href="/website" className={buttonClasses}>
                  <Cat className={iconClasses} />
                  Website
                </a>

                <button onClick={handleLogout} className={buttonClasses}>
                  <LogOut className={iconClasses} />
                  Logout
                </button>

                {/* Settings Icon with Dropdown */}
                <div className="relative flex items-center">
                  <button
                    onClick={() => setDropdownOpen(!isDropdownOpen)}
                    className={buttonClasses}
                  >
                    <Settings className={iconClasses} />
                    <ChevronDown
                      className={
                        theme === "dark"
                          ? "w-4 h-4 ml-1 text-white"
                          : "w-4 h-4 ml-1 text-black"
                      }
                    />
                  </button>

                  {/* Dropdown menu */}
                  {isDropdownOpen && (
                    <div
                      className={`absolute right-0 top-12 mt-2 w-48 rounded-md shadow-lg z-10 ${dropdownMenuClasses}`}
                    >
                      <div className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-600 hover:text-white">
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
                        className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-600 hover:text-white"
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
