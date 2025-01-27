import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";

const FriendProtectedContent = ({ userId, children, fallbackMessage }) => {
  const [canView, setCanView] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  const API_URL ="https://catstagram-backend.vercel.app/"

  useEffect(() => {
    const checkAccess = async () => {
      try {
        // Only check friend status if we're looking at someone else's profile
        if (userId === user._id) {
          setCanView(true);
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}api/friends/check/${userId}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to check friend status");
        }

        const data = await response.json();

        // If user is blocked, they can't view the content
        if (data.isBlocked) {
          setCanView(false);
          setLoading(false);
          return;
        }

        setCanView(data.isFriend || data.isOwnProfile || data.isPublic);
      } catch (error) {
        console.error("Error checking friend status:", error);
        setCanView(false);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      checkAccess();
    }
  }, [userId, user._id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  if (!canView) {
    return (
      <div className="flex justify-center items-center w-full col-span-2">
              <p className="text-gray-500 text-lg">
              {fallbackMessage}
              </p>
            </div>
    );
  }

  return children;
};

export default FriendProtectedContent;
