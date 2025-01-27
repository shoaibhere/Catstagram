import React, { useState, useEffect } from "react";
import EditProfileModal from "../components/EditProfileModal";
import UserPosts from "../components/UserPosts";
import { useParams, useNavigate } from "react-router-dom";
import { User as UserIcon } from "lucide-react";
import {
  getProfileById,
  getUserStats,
  deleteAccount,
  checkIfBlocked,
} from "../services/profile.services";
import { useAuthStore } from "../store/authStore";
import Layout from "../pages/Layout";
import { useTheme } from "../contexts/themeContext";
import FriendsListModal from "../components/FriendsListModal";
import FriendProtectedContent from "../components/FriendStatus";

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});
  const [stats, setStats] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showFriendsModal, setShowFriendsModal] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const { user, logout } = useAuthStore();
  const { theme } = useTheme();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [profileData, statsData, blockedStatus] = await Promise.all([
          getProfileById(id),
          getUserStats(id),
          checkIfBlocked(user._id, id),
        ]);
        setProfile(profileData);
        setStats(statsData);
        setIsBlocked(blockedStatus);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    fetchProfileData();
  }, [id, user._id]);

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount(id);
      logout();
      navigate("/");
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  // Theme-based styling
  const containerClasses =
    theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-black";
  const buttonPrimaryClasses =
    theme === "dark" ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600";
  const buttonDangerClasses =
    theme === "dark" ? "bg-red-600 hover:bg-red-700" : "bg-red-500 hover:bg-red-600";
  const modalClasses = theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black";

  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center pt-8">
        {/* Profile Header */}
        <div className={`${containerClasses} rounded-lg shadow-lg p-8 mb-8 mx-auto max-w-xl`}>
          <div className="flex flex-col md:flex-row items-center md:space-x-6">
            {/* Profile Image */}
            <div className="w-32 h-32 rounded-full border-4 border-blue-600 flex items-center justify-center overflow-hidden mb-6 md:mb-0">
              {profile.profileImage && !isBlocked ? (
                <img
                  src={profile.profileImage}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon className="w-16 h-16 text-gray-400" />
              )}
            </div>

            {/* Profile Details */}
            <div className="flex-grow text-center md:text-left">
              <div className="flex justify-center md:justify-start space-x-6 mb-4">
                <div className="text-center">
                  <p className="text-xl font-semibold">{stats.postCount || 0}</p>
                  <p className="text-gray-400">Posts</p>
                </div>

                <div
                  className="text-center cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setShowFriendsModal(true)}
                >
                  <p className="text-xl font-semibold">
                    {stats.friendsCount || 0}
                  </p>
                  <p className="text-gray-400">Friends</p>
                </div>
              </div>
              <h1 className="text-3xl font-bold mt-2">{isBlocked ? "Catstagram User" : profile.name}</h1>
              {profile.bio && !isBlocked && (
                <p
                  className={`mt-4 text-lg ${
                    theme === "dark" ? "text-gray-300" : "text-black"
                  } max-w-xl mx-auto md:mx-0`}
                  style={{
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                  }}
                >
                  {profile.bio}
                </p>
              )}
            </div>

            {/* Profile Owner Buttons */}
            {id === user._id && !isBlocked && (
              <div className="flex flex-col space-y-4 mt-6 md:mt-0">
                <button
                  onClick={() => setShowEditModal(true)}
                  className={`${buttonPrimaryClasses} px-4 py-2 rounded transition duration-300`}
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className={`${buttonDangerClasses} px-4 py-2 rounded transition duration-300`}
                >
                  Delete Account
                </button>
              </div>
            )}
          </div>
        </div>
 
        {/* Protected Content */}
        <FriendProtectedContent
          userId={id}
          fallbackMessage="Only friends can view this user's posts and friends list"
        >
          <>
            {/* User Posts Section */}
        {!isBlocked && <UserPosts userId={id} />}
          </>

          <FriendsListModal
            isOpen={showFriendsModal}
            onClose={() => setShowFriendsModal(false)}
            userId={id}
          />
        </FriendProtectedContent>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEditModal(false)}
          onUpdate={(updatedProfile) => {
            setProfile(updatedProfile);
            setShowEditModal(false);
          }}
        />
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${modalClasses} p-6 rounded-lg`}>
            <h2 className="text-xl font-bold mb-4">Confirm Account Deletion</h2>
            <p className="mb-6">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button onClick={handleDeleteAccount} className={`${buttonDangerClasses} px-4 py-2 rounded`}>
                Delete Account
              </button>
              <button onClick={() => setShowDeleteConfirm(false)} className={`${buttonPrimaryClasses} px-4 py-2 rounded`}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
