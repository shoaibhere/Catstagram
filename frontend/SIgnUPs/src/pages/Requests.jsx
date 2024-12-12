import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/navbar";
import Factsbar from "../components/factsbar";
import SideNav from "../components/sideNav";
import RequestCard from "../components/RequestCard";
import { useAuthStore } from "../store/authStore";

const Requests = () => {
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [isSentTab, setIsSentTab] = useState(true);
  const [loading, setLoading] = useState(false); // Centralized loading state
  const { user } = useAuthStore();

  const API_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:8000"
      : "/api/friends";

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/friends/requests`);
      const allRequests = response.data;

      const sent = allRequests.filter(
        (request) => request.sentBy._id === user._id
      );
      const received = allRequests.filter(
        (request) => request.sentBy._id !== user._id
      );

      setSentRequests(sent);
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
      await axios.post(`${API_URL}/api/friends/request/approve/${requestId}`);
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
      await axios.post(`${API_URL}/api/friends/request/decline/${requestId}`);
      fetchRequests(); // Refresh the list after declining
    } catch (error) {
      console.error("Error declining friend request:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsendRequest = async (requestId) => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/friends/request/unsend/${requestId}`);
      fetchRequests(); // Refresh the list after unsending
    } catch (error) {
      console.error("Error unsending friend request:", error);
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
        <div className="w-[70%] min-h-[calc(100vh-4rem)] flex flex-col items-center justify-start p-4">
          {/* Stylish Requests Heading */}
          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-teal-500 to-blue-500 drop-shadow-lg mb-10 text-center">
            Pending Friend Requests
          </h2>

          {/* Tabs */}
          <div className="flex justify-center gap-8 mb-6">
            <button
              onClick={() => setIsSentTab(true)}
              className={`px-6 py-2 rounded-md w-40 ${
                isSentTab
                  ? "bg-blue-600 text-white"
                  : "bg-gray-600 text-gray-300"
              }`}
            >
              Sent Requests
            </button>
            <button
              onClick={() => setIsSentTab(false)}
              className={`px-6 py-2 rounded-md w-40 ${
                !isSentTab
                  ? "bg-blue-600 text-white"
                  : "bg-gray-600 text-gray-300"
              }`}
            >
              Received Requests
            </button>
          </div>

          {/* Requests List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center">
            {isSentTab
              ? sentRequests.map((request) => (
                  <RequestCard
                    key={request._id}
                    request={request}
                    isSentRequest={true}
                    onUnsend={handleUnsendRequest}
                    loading={loading} // Pass loading state
                  />
                ))
              : receivedRequests.map((request) => (
                  <RequestCard
                    key={request._id}
                    request={request}
                    isSentRequest={false}
                    onApprove={handleApproveRequest}
                    onDecline={handleDeclineRequest}
                    loading={loading} // Pass loading state
                  />
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
