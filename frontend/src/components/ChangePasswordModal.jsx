import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore"; // Adjust path as needed
import { useTheme } from "../contexts/themeContext"; // Adjust path as needed
import { X, Eye, EyeOff } from "lucide-react";

const ChangePasswordModal = ({ onClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [validationError, setValidationError] = useState("");
  const { changePassword, isLoading, error, message } = useAuthStore();
  const { theme } = useTheme();

  const modalClassName =
    theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800";
  const buttonClassName =
    theme === "dark"
      ? "bg-blue-600 hover:bg-blue-700"
      : "bg-blue-700 hover:bg-blue-300";
  const inputStyle =
    theme === "dark"
      ? "bg-gray-700 text-white focus:ring-blue-500"
      : "bg-white text-gray-800 focus:ring-blue-300";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");

    // Minimum password length check (e.g., at least 8 characters)
    if (newPassword.length < 8) {
      setValidationError("New password must be at least 8 characters long");
      return;
    }

    // Check if new password is different from the current password
    if (currentPassword === newPassword) {
      setValidationError(
        "New password must be different from the current password"
      );
      return;
    }

    // Confirm new password match check
    if (newPassword !== confirmNewPassword) {
      setValidationError("New passwords do not match");
      return;
    }

    try {
      await changePassword(currentPassword, newPassword);
      if (!error) {
        onClose(); // Close modal on success
      }
    } catch (error) {
      // Error is handled in the store
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`${modalClassName} rounded-lg p-8 w-full max-w-md relative`}
      >
        <button
          onClick={onClose}
          className={`absolute top-2 right-2 text-gray-400 focus:outline-none`}
        >
          <X size={24} />
        </button>
        <h2 className="text-3xl font-bold mb-6 text-center">Change Password</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {message && <div className="text-green-500 mb-4">{message}</div>}
        {validationError && (
          <div className="text-red-500 mb-4">{validationError}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Current Password"
            type={showCurrentPassword ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            toggleVisibility={() =>
              setShowCurrentPassword(!showCurrentPassword)
            }
            showPassword={showCurrentPassword}
            required
            inputStyle={inputStyle}
          />
          <Input
            label="New Password"
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            toggleVisibility={() => setShowNewPassword(!showNewPassword)}
            showPassword={showNewPassword}
            required
            inputStyle={inputStyle}
          />
          <Input
            label="Confirm New Password"
            type={showConfirmNewPassword ? "text" : "password"}
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            toggleVisibility={() =>
              setShowConfirmNewPassword(!showConfirmNewPassword)
            }
            showPassword={showConfirmNewPassword}
            required
            inputStyle={inputStyle}
          />

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

const Input = ({
  label,
  type,
  value,
  onChange,
  required,
  inputStyle,
  toggleVisibility,
  showPassword,
}) => (
  <div className="relative">
    <label className="block text-sm font-medium mb-2">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 border-2 rounded-md focus:outline-none focus:ring-2 ${inputStyle}`}
      required={required}
    />
    <button
      type="button"
      onClick={toggleVisibility}
      className="absolute inset-y-[47px] right-0 pr-3 flex items-center text-sm leading-5"
    >
      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
    </button>
  </div>
);

export default ChangePasswordModal;
