import React from "react";
import SideNav from "../components/sideNav";
import Navbar from "../components/navbar";
import Factsbar from "../components/factsbar";
import { useAuthStore } from "../store/authStore";
import { useTheme } from "../contexts/themeContext";

const Layout = ({ children }) => {
  const { user } = useAuthStore();
  const {theme} = useTheme();
  const sidebarClasses = theme === "dark" ? "bg-black" : "bg-white";
  const navbarClasses = theme === "dark" ? "bg-gray-900" : "bg-gray-100";
  const factsbarClasses = theme === "dark" ? "bg-black" : "bg-white";

  return (
    <div className="h-screen w-full flex flex-col text-white">
      {/* Top Navbar (Fixed) */}
      <div className={`fixed top-0 left-0 right-0 z-20 ${navbarClasses}`}>
        <Navbar />
      </div>

      {/* Main Content Area */}
      <div className="flex h-full pt-16">
        {/* Left Sidebar (Fixed on the Left Side) */}
        <div
          className={`fixed left-0 top-16 bottom-0 w-1/5 p-4 z-10 ${sidebarClasses}`}
        >
          <SideNav user={user} />
        </div>

        {/* Main Content Area (Dynamic children) */}
        <div className="flex-grow ml-[20%] mr-[20%] p-4 overflow-y-auto">
          {children}
        </div>

        {/* Right Sidebar (Fixed on the Right Side) */}
        <div className={`fixed right-7 top-16 h-full bottom-0 w-1/5 p-4 z-10 ${factsbarClasses}`}>
          <Factsbar />
        </div>
      </div>
    </div>
  );
};

export default Layout;