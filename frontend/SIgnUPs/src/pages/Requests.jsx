import React, { useState, useEffect } from "react";
import axios from "axios";
import UserCard from "../components/UserCard";
import Navbar from "../components/navbar";
import Factsbar from "../components/factsbar";
import SideNav from "../components/sideNav";
import { useAuthStore } from "../store/authStore";

const Requests = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const { user } = useAuthStore();

  const API_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:8000"
      : "/api/friends";

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/friends/requests`);
      setPendingRequests(response.data);
    } catch (error) {
      console.error("Error fetching pending friend requests:", error);
    }
  };

  const handleApproveRequest = async (requestId) => {
    try {
      await axios.post(`${API_URL}/api/friends/request/approve/${requestId}`);
      fetchPendingRequests(); // Refresh the list after approval
    } catch (error) {
      console.error("Error approving friend request:", error);
    }
  };

  const handleDeclineRequest = async (requestId) => {
    try {
      await axios.post(`${API_URL}/api/friends/request/decline/${requestId}`);
      fetchPendingRequests(); // Refresh the list after declining
    } catch (error) {
      console.error("Error declining friend request:", error);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col text-white bg-gradient-to-b from-gray-900 via-black to-gray-900">
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      <div className="flex pt-16 relative justify-center">
        {/* Left Sidebar */}
        <div className="fixed left-0 top-16 bottom-0 w-[15%] bg-black p-4 z-40">
          <SideNav user={user} />
        </div>

        {/* Main Content */}
        <div className="w-[70%] min-h-[calc(100vh-4rem)] flex flex-col items-center justify-start p-4">
          {/* Stylish Requests Heading */}
          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-teal-500 to-blue-500 drop-shadow-lg mb-10 text-center">
            Pending Friend Requests
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center">
            {pendingRequests.map((request) => (
              <div
                key={request._id}
                className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center space-y-4"
              >
                {/* User Card */}
                <div className="w-full">
                  <UserCard user={request.sentBy} isFriend={false} />
                </div>

                {/* Buttons */}
                <div className="w-full flex justify-center gap-4">
                  <button
                    onClick={() => handleApproveRequest(request._id)}
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 w-[48%]"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleDeclineRequest(request._id)}
                    className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 w-[48%]"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="fixed right-0 top-16 bottom-0 w-[15%] bg-gray-800 p-4 z-40">
          <Factsbar />
        </div>
      </div>
    </div>
  );
};

export default Requests;
