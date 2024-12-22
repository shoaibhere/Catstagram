import React, { useState } from "react";
import logo from "../assets/images/logo.jpg";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useTheme } from '../contexts/themeContext';
import ChangePasswordModal from "../components/ChangePasswordModal";  // Ensure this is the correct path
import {
  Home,
  LogOut,
  Cat,
  Lock,
} from "lucide-react";
import ThemeToggle from "./themeToggle"; // Ensure the path is correct and matches your file structure

const Navbar = () => {
  const { theme } = useTheme();
  const { logout } = useAuthStore();
  const [isChangePasswordOpen, setChangePasswordOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const handleChangePassword = () => {
    setChangePasswordOpen(true);
  };

  const handleCloseChangePassword = () => {
    setChangePasswordOpen(false);
  };

  // Conditional theme classes
  const navbarClasses = theme === "dark" ? "bg-black text-white" : "bg-white text-black";
  const buttonClasses = theme === "dark"
    ? "group flex items-center text-white bg-black hover:bg-gray-600 hover:text-white rounded-full px-3 py-2"
    : "group flex items-center text-black bg-white hover:bg-gradient-to-r from-purple-600 to-pink-600 hover:text-white rounded-full px-3 py-2";

  const iconClasses = theme === "dark" ? "w-5 h-5 mr-1 text-white" : "w-5 h-5 mr-1 text-black";

  return (
    <nav className={`${navbarClasses} border-b border-gray-500`}>
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <a className="flex flex-shrink-0 items-center mr-4" href="/index.html">
              <img className="h-10 w-auto rounded-full" src={logo} alt="Catstagram"/>
              <span className="hidden md:block text-2xl font-billabong ml-2">Catstagram</span>
            </a>
            <div className="md:ml-auto flex items-center">
              <Link to="/" className={buttonClasses}><Home className={iconClasses}/> Home</Link>
              <Link to="/website" className={buttonClasses}><Cat className={iconClasses}/> Website</Link>
              <button onClick={handleChangePassword} className={buttonClasses}><Lock className={iconClasses}/> Change Password</button>
              <button onClick={handleLogout} className={buttonClasses}><LogOut className={iconClasses}/> Logout</button>
              <ThemeToggle className="top-0 right-0"/>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {isChangePasswordOpen && <ChangePasswordModal onClose={handleCloseChangePassword} />}
    </nav>
  );
};

export default Navbar;
