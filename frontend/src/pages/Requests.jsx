import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../pages/Layout";
import RequestCard from "../components/RequestCard";
import { useAuthStore } from "../store/authStore";
import { useTheme } from "../contexts/themeContext";

const Requests = () => {
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [loading, setLoading] = useState(false); // Centralized loading state
  const { user } = useAuthStore();
  const { theme } = useTheme();

  const API_URL =
    import.meta.env.MODE === "development"
      ? "https://catstagram-backend.onrender.com/api/friends"
      : "/api/friends";

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const receivedResponse = await axios.get(`${API_URL}/requests/pending`);
      console.log("Received Response", receivedResponse.data);
      setReceivedRequests(receivedResponse.data);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (requestId) => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/request/approve/${requestId}`);
      fetchRequests(); // Refresh the list after approval
    } catch (error) {
      console.error("Error approving friend request:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeclineRequest = async (requestId) => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/request/decline/${requestId}`);
      fetchRequests(); // Refresh the list after declining
    } catch (error) {
      console.error("Error declining friend request:", error);
    } finally {
      setLoading(false);
    }
  };

  const mainContentClasses = theme === "dark" ? "text-white" : "text-black";

  return (
    <Layout>
      <div
        className={`w-full min-h-[calc(100vh-4rem)] flex flex-col items-center justify-start py-8 ${mainContentClasses}`}
      >
        {/* Stylish Requests Heading */}
        <h2 className="text-5xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-teal-500 to-blue-500 drop-shadow-lg mb-10 pe-20 p-10 leading-tight">
          Pending Friend Requests
        </h2>

        {/* Received Requests Only */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center">
          {receivedRequests.map((request) => (
            <RequestCard
              key={request._id}
              request={request} // Pass the full request object here
              isSentRequest={false} // This is a received request
              onApprove={() => handleApproveRequest(request._id)} // Passing request id to approve
              onDecline={() => handleDeclineRequest(request._id)} // Passing request id to decline
              loading={loading} // Pass loading state
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Requests;
