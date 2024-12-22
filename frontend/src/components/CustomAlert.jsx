import React from "react";
import { X, Lock } from "lucide-react";
import { useTheme } from "../contexts/themeContext";

export const CustomAlert = ({ message, onClose }) => {
  const { theme } = useTheme();

  return (
    <div className="fixed inset-x-0 inset-y-0 top-4 mx-auto w-fit z-50">
      <div
        className={`rounded-lg p-4 shadow-lg flex items-center justify-between
        ${
          theme === "dark"
            ? "bg-yellow-900 text-yellow-100 border border-yellow-800"
            : "bg-yellow-100 text-yellow-800 border border-yellow-200"
        }`}
      >
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-4 p-1 hover:opacity-70 transition-opacity"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
