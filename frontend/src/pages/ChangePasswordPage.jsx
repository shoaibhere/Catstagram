import { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { Lock, X } from "lucide-react"; // Import X icon for cancel button
import toast from "react-hot-toast";
import Input from "../components/Input";

const ChangePasswordPage = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const { changePassword, error, isLoading, message } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      alert("New passwords do not match");
      return;
    }

    try {
      // Call the change password function with the current and new passwords
      await changePassword(currentPassword, newPassword);

      toast.success("Password changed successfully");

      // Reload the page after successful password change
    } catch (error) {
      toast.error(error.message || "Error changing password");
    }
  };

  // Function to close the page (cancel button)
  const handleCancel = () => {
    window.location.reload(); // Reload the page when cancel is clicked
  };

  return (
    <div className="max-w-md w-full bg-gradient-to-r from-purple-700 to-purple-800 text-white rounded-3xl shadow-2xl overflow-hidden p-8 relative">
      {/* Cancel Button */}
      <button
        onClick={handleCancel}
        className="absolute top-4 right-4 text-white hover:text-gray-400 focus:outline-none"
      >
        <X size={24} />
      </button>

      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-pink-500 via-orange-500 to-purple-600 text-transparent bg-clip-text">
        Change Password
      </h2>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      {message && <p className="text-green-500 text-sm mb-4">{message}</p>}

      <form onSubmit={handleSubmit}>
        <Input
          icon={Lock}
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />

        <Input
          icon={Lock}
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <Input
          icon={Lock}
          type="password"
          placeholder="Confirm New Password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          required
        />

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 px-4 bg-gradient-to-r from-green-400 to-green-500 text-white font-bold rounded-lg shadow-lg hover:from-green-500 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Changing..." : "Change Password"}
        </motion.button>
      </form>
    </div>
  );
};

export default ChangePasswordPage;
