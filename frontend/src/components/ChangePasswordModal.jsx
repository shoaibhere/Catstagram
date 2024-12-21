import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore"; // Ensure the path is correct
import { useTheme } from '../contexts/themeContext'; // Adjust this path according to your project structure
import { X } from "lucide-react";
import toast from "react-hot-toast";

const ChangePasswordModal = ({ onClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const { changePassword, isLoading } = useAuthStore();
  const { theme } = useTheme(); // Use theme from ThemeContext

  const modalClassName = theme === 'dark' ? "bg-gray-800 text-white" : "bg-white text-gray-800";
  const buttonClassName = theme === 'dark' ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-700 hover:bg-blue-300";
  const inputStyle = theme === 'dark' ? "bg-gray-700 text-white focus:ring-blue-500" : "bg-white text-gray-800 focus:ring-blue-300";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      await changePassword(currentPassword, newPassword);
      toast.success("Password changed successfully");
      onClose(); // Close modal on success
    } catch (error) {
      toast.error("Error changing password");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${modalClassName} rounded-lg p-8 w-full max-w-md relative`}>
        <button
          onClick={onClose}
          className={`absolute top-2 right-2 text-gray-400 focus:outline-none`}
        >
          <X size={24} />
        </button>
        <h2 className="text-3xl font-bold mb-6 text-center">
          Change Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Current Password" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required inputStyle={inputStyle} />
          <Input label="New Password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required inputStyle={inputStyle} />
          <Input label="Confirm New Password" type="password" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} required inputStyle={inputStyle} />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`${buttonClassName} w-full py-2 rounded-md transition duration-300 text-white`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Changing..." : "Change Password"}
          </motion.button>
        </form>
      </div>
    </div>
  );
};

const Input = ({ label, type, value, onChange, required, inputStyle }) => (
  <div>
    <label className="block text-sm font-medium mb-2">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 border-2 rounded-md focus:outline-none focus:ring-2 ${inputStyle}`}
      required={required}
    />
  </div>
);

export default ChangePasswordModal;
