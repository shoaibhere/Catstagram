import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "../contexts/themeContext";
import { User } from "lucide-react";

const RequestCard = ({
  request,
  isSentRequest,
  onUnsend,
  onApprove,
  onDecline,
  loading,
}) => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Theme-based styles
  const cardClassName =
    theme === "dark"
      ? "bg-gradient-to-br from-gray-900 via-purple-900 to-black border-purple-600 text-white"
      : "bg-gradient-to-br from-gray-100 via-gray-200 to-white border-gray-300 text-gray-800";
  const buttonApproveClassName =
    theme === "dark"
      ? "bg-green-600 hover:bg-green-700 text-white"
      : "bg-green-400 hover:bg-green-500 text-gray-800";
  const buttonDeclineClassName =
    theme === "dark"
      ? "bg-red-600 hover:bg-red-700 text-white"
      : "bg-red-400 hover:bg-red-500 text-gray-800";
  const buttonUnsendClassName =
    theme === "dark"
      ? "bg-yellow-600 hover:bg-yellow-700 text-white"
      : "bg-yellow-400 hover:bg-yellow-500 text-gray-800";
  const buttonViewProfileClassName =
    theme === "dark"
      ? "bg-blue-600 hover:bg-blue-700 text-white"
      : "bg-blue-400 hover:bg-blue-500 text-gray-800";
  const avatarPlaceholderClassName =
    theme === "dark"
      ? "bg-purple-300 text-purple-800 ring-purple-400"
      : "bg-gray-100 text-gray-600 ring-gray-300";

  // Determine whether to show sentBy or sentTo info based on isSentRequest
  const userInfo = isSentRequest ? request.sentTo : request.sentBy;

  return (
    <div
      className={`w-full rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border ${cardClassName}`}
    >
      <div className="flex flex-col md:flex-row items-center gap-4">
        {/* Avatar */}
        {userInfo.profileImage ? (
          <img
            src={userInfo.profileImage}
            alt={userInfo.name}
            className={`w-16 h-16 md:w-20 md:h-20 rounded-full object-cover ring-4 shadow-md ${
              theme === "dark" ? "ring-purple-400" : "ring-gray-300"
            }`}
          />
        ) : (
          <div
            className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center ring-4 shadow-md ${avatarPlaceholderClassName}`}
          >
            <User className="w-8 h-8 md:w-10 md:h-10" />
          </div>
        )}

        {/* User Details */}
        <div className="flex-grow text-center md:text-left">
          <Link to={`/profile/${userInfo._id}`}>
            <h3
              className={`text-xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-800"
              }`}
            >
              {userInfo?.name}
            </h3>
          </Link>
          <p
            className={`text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            } mb-2`}
          >
            {userInfo?.email}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-2 mt-4">
            {isSentRequest ? (
              <>
                {/* Unsend Request Button */}
                <button
                  onClick={() => onUnsend(request._id)}
                  className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${buttonUnsendClassName}`}
                  disabled={loading}
                >
                  {loading ? "..." : "Unsend Request"}
                </button>
                {/* View Profile Button */}
                <button
                  onClick={() => navigate(`/profile/${userInfo?._id}`)}
                  className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${buttonViewProfileClassName}`}
                  disabled={loading}
                >
                  View Profile
                </button>
              </>
            ) : (
              <>
                {/* Approve Request Button */}
                <button
                  onClick={() => onApprove(request._id)}
                  className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${buttonApproveClassName}`}
                  disabled={loading}
                >
                  {loading ? "..." : "Approve"}
                </button>
                {/* Decline Request Button */}
                <button
                  onClick={() => onDecline(request._id)}
                  className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${buttonDeclineClassName}`}
                  disabled={loading}
                >
                  {loading ? "..." : "Decline"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestCard;
