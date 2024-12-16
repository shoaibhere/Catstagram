import React, { useState, useEffect } from "react";
import EditProfileModal from "../components/EditProfileModal";
import UserPosts from "../components/UserPosts";
import { useParams, useNavigate } from "react-router-dom";
import { User as UserIcon } from "lucide-react";
import {
  getProfileById,
  getUserStats,
  deleteAccount,
} from "../services/profile.services";
import { useAuthStore } from "../store/authStore";
import Layout from "../pages/Layout";

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const [profile, setProfile] = useState({});
  const [stats, setStats] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { user, logout } = useAuthStore();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const data = await getProfileById(id);
        setProfile(data);
        const stats = await getUserStats(id);
        setStats(stats);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    fetchProfileData();
  }, [id]);

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount(id);
      logout();
      navigate("/");
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  return (
    <Layout>
      <div className="p-8">
        {/* Profile Header */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-8 mb-8 mx-[150px]">
          <div className="flex items-center space-x-6">
            {/* Profile Image */}
            <div className="w-32 h-32 rounded-full border-4 border-blue-600 flex items-center justify-center overflow-hidden">
              {profile.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon className="w-16 h-16 text-gray-400" />
              )}
            </div>
            <div className="flex-grow">
              <div className="flex space-x-6 mt-4">
                <div className="text-center">
                  <p className="text-xl font-semibold">
                    {stats.postCount || 0}
                  </p>
                  <p className="text-gray-400">Posts</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-semibold">
                    {stats.friendsCount || 0}
                  </p>
                  <p className="text-gray-400">Friends</p>
                </div>
              </div>
              <h1 className="text-3xl font-bold mt-2">{profile.name}</h1>
              {profile.bio && (
                <p className="text-gray-300 mt-2">{profile.bio}</p>
              )}
            </div>

            {/* Buttons visible only to the profile owner */}
            {id === user._id && (
              <div className="flex flex-col space-y-4">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition duration-300"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition duration-300"
                >
                  Delete Account
                </button>
              </div>
            )}
          </div>
        </div>

        {/* User Posts Section */}
        <UserPosts userId={id} />
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
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Confirm Account Deletion</h2>
            <p className="mb-6">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={handleDeleteAccount}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
              >
                Delete Account
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
