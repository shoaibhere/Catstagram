import React from "react";
import { useNavigate } from "react-router-dom";

const RequestCard = ({
  request,
  isSentRequest,
  onUnsend,
  onApprove,
  onDecline,
  loading,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center space-y-4">
      {/* Requester Info */}
      <div className="w-full">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          {request.sentBy.profileImage ? (
            <img
              src={request.sentBy.profileImage}
              alt={request.sentBy.name}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-purple-200"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center">
              {/* Placeholder if no profile image */}
              <div className="w-7 h-7 text-purple-600">?</div>
            </div>
          )}

          {/* User Details */}
          <div className="flex-grow">
            <h3 className="text-lg font-medium text-gray-900">
              {request.sentBy.name}
            </h3>
            <p className="text-sm text-gray-500 mb-2">{request.sentBy.email}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full flex justify-center gap-4">
        {isSentRequest ? (
          <>
            {/* Sent Request Actions */}
            <button
              onClick={() => onUnsend(request._id)}
              className="px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 w-full"
              disabled={loading}
            >
              {loading ? "..." : "Unsend Request"}
            </button>
            <button
              onClick={() => navigate(`/profile/${request.sentBy._id}`)}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full"
              disabled={loading}
            >
              View Profile
            </button>
          </>
        ) : (
          <>
            {/* Received Request Actions */}
            <button
              onClick={() => onApprove(request._id)}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 w-full"
              disabled={loading}
            >
              {loading ? "..." : "Approve"}
            </button>
            <button
              onClick={() => onDecline(request._id)}
              className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 w-full"
              disabled={loading}
            >
              {loading ? "..." : "Decline"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default RequestCard;
