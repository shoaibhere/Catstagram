import { motion } from "framer-motion";
import { useTheme } from "../contexts/themeContext";

const FloatingShape = ({ size, top, left, delay }) => {
  const { theme } = useTheme();

  // Define theme-based colors
  const color = theme === "dark" ? "bg-purple-400" : "bg-blue-300";

  return (
    <motion.div
      className={`absolute rounded-full ${color} ${size} opacity-20 blur-xl`}
      style={{ top, left }}
      animate={{
        y: ["0%", "100%", "0%"],
        x: ["0%", "100%", "0%"],
        rotate: [0, 360],
      }}
      transition={{
        duration: 20,
        ease: "linear",
        repeat: Infinity,
        delay,
      }}
      aria-hidden="true"
    />
  );
};

export default FloatingShape;
