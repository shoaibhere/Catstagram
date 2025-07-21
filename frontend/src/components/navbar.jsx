import React, { useState } from "react";
import logo from "../assets/images/logo.jpg";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useTheme } from '../contexts/themeContext';
import ChangePasswordModal from "./ChangePasswordModal";  // Ensure this is the correct path
import {
  LogOut,
  Users,
  MessageCircleMore,
  Lock,
  Menu as HamburgerIcon, // Added hamburger icon import
  X as CloseIcon,
  UserPlus, // Added close icon for the menu
} from "lucide-react";
import ThemeToggle from "./themeToggle"; // Ensure the path is correct and matches your file structure

const Navbar = () => {
  const { theme } = useTheme();
  const { logout } = useAuthStore();
  const [isChangePasswordOpen, setChangePasswordOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false); // New state for mobile menu

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
    : "group flex items-center text-black text-black bg-white hover:bg-gradient-to-r from-purple-600 to-pink-600 hover:text-white rounded-full px-3 py-2";

  const iconClasses = theme === "dark" ? "w-5 h-5 mr-1 text-white" : "w-5 h-5 mr-1 text-black";

  // Mobile menu toggle handler
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={`${navbarClasses} border-b border-gray-500`}>
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex items-center justify-between gap-10">
             {/* Mobile Hamburger Icon */}
            <div className="md:hidden flex items-center justify-center">
              <button onClick={toggleMobileMenu} className={iconClasses}>
                {isMobileMenuOpen ? <CloseIcon className="w-6 h-6"/> : <HamburgerIcon className="w-8 h-8"/>}
              </button>
            </div>
            
            <Link className="flex flex-shrink-0 items-center justify-center mr-4" to="/">
              <img className="h-10 w-auto rounded-full" src={logo} alt="Catstagram"/>
              <span className="text-2xl font-billabong ml-2">Catstagram</span>
            </Link>

            <Link to="/chats" className={`w-14 h-14 sm:hidden ${buttonClasses}`}><MessageCircleMore className={`w-full h-full sm:hidden ${iconClasses}`}/></Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:ml-auto items-center">
            <Link to="/friends" className={buttonClasses}><Users className={iconClasses}/> My Friends</Link>
            <Link to="/chats" className={buttonClasses}><MessageCircleMore className={iconClasses}/> Chats</Link>
            <Link to="/friend-requests" className={buttonClasses}><UserPlus className={iconClasses}/>Friend Requests</Link>
              <button onClick={handleChangePassword} className={buttonClasses}><Lock className={iconClasses}/> Change Password</button>
              <button onClick={handleLogout} className={buttonClasses}><LogOut className={iconClasses}/> Logout</button>
              <ThemeToggle className="top-0 right-0"/>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu (visible only when isMobileMenuOpen is true) */}
      {isMobileMenuOpen && (
        <div className={`${navbarClasses} md:hidden p-4 absolute top-20 left-0 right-0 z-20`}>
          <Link to="/friends" className={buttonClasses}><Users className={iconClasses}/> My Friends</Link>
          <Link to="/friend-requests" className={buttonClasses}><UserPlus className={iconClasses}/>Friend Requests</Link>
          <button onClick={() => { handleChangePassword(); toggleMobileMenu(); }} className={buttonClasses}><Lock className={iconClasses}/> Change Password</button>
          <button className={buttonClasses} onClick={() => { handleLogout(); toggleMobileMenu(); }}><LogOut className={iconClasses}/> Logout</button>
          <button className={buttonClasses}> <span className="pr-4">Change Theme </span><ThemeToggle/></button>
        </div>  
        
      )}

      {/* Change Password Modal */}
      {isChangePasswordOpen && <ChangePasswordModal onClose={handleCloseChangePassword} />}
    </nav>
  );
};

export default Navbar;
