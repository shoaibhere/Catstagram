import React, { useState } from "react";
import { updateProfile } from "../services/profile.services";
import { useAuthStore } from "../store/authStore";
import { Upload, User as UserIcon, Lock, Unlock } from "lucide-react";
import { useTheme } from "../contexts/themeContext";

export default function EditProfileModal({ profile, onClose, onUpdate }) {
  const [name, setName] = useState(profile.name || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [isPrivate, setIsPrivate] = useState(profile.isPrivate || false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(profile.profileImage || "");
  const [errorMessage, setErrorMessage] = useState("");
  const { user } = useAuthStore();
  const { theme } = useTheme();

  // Theme-based styles
  const modalBackground = theme === "dark" ? "bg-gray-800" : "bg-white";
  const textColor = theme === "dark" ? "text-white" : "text-gray-800";
  const inputBackground = theme === "dark" ? "bg-gray-700" : "bg-gray-100";
  const borderColor = theme === "dark" ? "border-blue-600" : "border-blue-400";
  const focusRingColor =
    theme === "dark" ? "focus:ring-blue-600" : "focus:ring-blue-400";
  const buttonPrimary =
    theme === "dark"
      ? "bg-blue-600 hover:bg-blue-700"
      : "bg-blue-500 hover:bg-blue-600";
  const buttonSecondary =
    theme === "dark"
      ? "bg-gray-600 hover:bg-gray-700"
      : "bg-gray-400 hover:bg-gray-500";

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("File size should be less than 5MB");
        return;
      }

      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        setErrorMessage("Only JPEG, PNG, and GIF images are allowed");
        return;
      }

      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setErrorMessage("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("bio", bio);
    formData.append("isPrivate", isPrivate);
    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    try {
      const updatedProfile = await updateProfile(formData, user._id);
      onUpdate(updatedProfile);
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage(
        error.response?.data?.error || "Failed to update profile"
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${modalBackground} rounded-lg p-8 w-full max-w-md`}>
        <h2 className={`text-2xl font-bold mb-6 ${textColor}`}>Edit Profile</h2>

        {errorMessage && (
          <div className="bg-red-600 text-white p-3 rounded-md mb-4">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center mb-4">
            <label className="relative cursor-pointer group">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <div
                className={`w-32 h-32 rounded-full ${borderColor} border-4 flex items-center justify-center overflow-hidden`}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-16 h-16 text-gray-400" />
                )}
              </div>
              <div
                className={`absolute bottom-0 right-0 ${buttonPrimary} rounded-full p-2 group-hover:bg-blue-700 transition duration-300`}
              >
                <Upload className="h-5 w-5 text-white" />
              </div>
            </label>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${textColor}`}>
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-3 py-2 ${inputBackground} ${textColor} rounded-md border ${focusRingColor} focus:outline-none focus:ring-2`}
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${textColor}`}>
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className={`w-full px-3 py-2 ${inputBackground} ${textColor} rounded-md border ${focusRingColor} focus:outline-none focus:ring-2`}
              rows="3"
              placeholder="Tell us about yourself"
            />
          </div>

          {/* Profile Privacy Radio Buttons */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${textColor}`}>
              Profile Privacy
            </label>
            <div className="flex space-x-4">
              <label
                className={`flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-opacity-10 hover:bg-gray-500`}
              >
                <input
                  type="radio"
                  name="privacy"
                  checked={!isPrivate}
                  onChange={() => setIsPrivate(false)}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <div className="flex items-center space-x-2">
                  <Unlock className={`h-5 w-5 ${textColor}`} />
                  <span className={textColor}>Public Profile</span>
                </div>
              </label>

              <label
                className={`flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-opacity-10 hover:bg-gray-500`}
              >
                <input
                  type="radio"
                  name="privacy"
                  checked={isPrivate}
                  onChange={() => setIsPrivate(true)}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <div className="flex items-center space-x-2">
                  <Lock className={`h-5 w-5 ${textColor}`} />
                  <span className={textColor}>Private Profile</span>
                </div>
              </label>
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className={`flex-grow ${buttonPrimary} text-white py-2 rounded-md transition duration-300`}
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className={`flex-grow ${buttonSecondary} text-white py-2 rounded-md transition duration-300`}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
