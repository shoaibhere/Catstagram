import React, { useState, useEffect } from "react";
import axios from "axios";
import Factsbar from "../components/factsbar";
import SideNav from "../components/sideNav";
import Navbar from "../components/navbar";
import { useAuthStore } from "../store/authStore";
import RequestCard from "../components/RequestCard";

const Requests = () => {
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [loading, setLoading] = useState(false); // Centralized loading state
  const { user } = useAuthStore();

  const API_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:8000/api/friends"
      : "/api/friends";

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const receivedResponse = await axios.get(`${API_URL}/requests/pending`);
      console.log("Received Response", receivedResponse.data);
      // Filter out duplicates based on _id
      const received = receivedResponse.data;

      setReceivedRequests(received);
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
        <div
          className="w-[70%] min-h-[calc(100vh-4rem)] flex flex-col items-center justify-start py-8
        "
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

        {/* Right Sidebar */}
        <div className="fixed right-0 top-16 bottom-0 w-[22%] bg-gray-800 p-4 z-40">
          <Factsbar />
        </div>
      </div>
    </div>
  );
};

export default Requests;
