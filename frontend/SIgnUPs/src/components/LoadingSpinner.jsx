import { motion } from "framer-motion";
import logo from "../assets/images/logo.png"; // Adjust the path to your logo file

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center relative overflow-hidden">
      {/* Animated Logo */}
      <motion.img
        src={logo} // Your logo image
        alt="Loading Logo"
        className="w-16 h-16"
        animate={{ scale: [2.5, 2.45, 2.5] }} // Scale animation: small -> big -> small
        transition={{
          duration: 1, // Animation duration
          repeat: Infinity, // Infinite repetition
          ease: "easeInOut", // Smooth easing
        }}
      />
    </div>
  );
};

export default LoadingSpinner;
