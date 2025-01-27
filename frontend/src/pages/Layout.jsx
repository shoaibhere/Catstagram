import React from "react";
import SideNav from "../components/sideNav";
import Navbar from "../components/navbar"
import Factsbar from "../components/factsbar";
import { useAuthStore } from "../store/authStore";
import { useTheme } from "../contexts/themeContext";

const Layout = ({ children }) => {
  const { user } = useAuthStore()
  const { theme } = useTheme()
  const sidebarClasses = theme === "dark" ? "bg-black" : "bg-white"
  const navbarClasses = theme === "dark" ? "bg-gray-900" : "bg-gray-100"
  const factsbarClasses = theme === "dark" ? "bg-black" : "bg-white"

  return (
    <div className="min-h-screen w-full flex flex-col text-white">
      {/* Top Navbar (Fixed) */}
      <div className={`fixed top-0 left-0 right-0 z-20 ${navbarClasses}`}>
        <Navbar />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 pt-16 pb-16 sm:pb-0">
        {/* Left Sidebar (Fixed on the Left Side for desktop, Bottom for mobile) */}
        <div className={`sm:fixed sm:left-0 sm:top-16 sm:bottom-0 sm:w-1/5 sm:p-4 z-10 ${sidebarClasses}`}>
          <SideNav user={user} />
        </div>

        {/* Main Content Area (Dynamic children) */}
        <div className="flex-grow sm:ml-[20%] sm:mr-[20%] p-4 overflow-y-auto">{children}</div>

        {/* Right Sidebar (Fixed on the Right Side, hidden on mobile) */}
        <div className={`hidden sm:block fixed right-7 top-16 h-full bottom-0 w-1/5 p-4 z-10 ${factsbarClasses}`}>
          <Factsbar />
        </div>
      </div>
    </div>
  )
}

export default Layout

