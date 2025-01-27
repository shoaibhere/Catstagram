import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../pages/Layout";
import RequestCard from "../components/RequestCard";
import { useAuthStore } from "../store/authStore";
import { useTheme } from "../contexts/themeContext";

const Requests = () => {
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]); // State for filtered requests
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();
  const { theme } = useTheme();

  const API_URL ="https://catstagram-backend.vercel.app/api/friends"

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const receivedResponse = await axios.get(`${API_URL}/requests/pending`);
      console.log("Received Response", receivedResponse.data);
      setReceivedRequests(receivedResponse.data);
      setFilteredRequests(receivedResponse.data); // Initialize filtered list
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = receivedRequests.filter((request) =>
      request.sentBy.name.toLowerCase().includes(term)
    );
    setFilteredRequests(filtered);
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

  const inputClass =
    theme === "dark"
      ? "bg-gray-800 text-white border-gray-600 placeholder-gray-400"
      : "bg-gray-100 text-gray-800 border-gray-300 placeholder-gray-500";

  return (
    <Layout>
      <div
        className={`w-full min-h-[calc(100vh-4rem)] flex flex-col items-center justify-start py-8 ${mainContentClasses}`}
      >
        {/* Stylish Requests Heading */}
        <h2 className="text-5xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-teal-500 to-blue-500 drop-shadow-lg mb-10 pe-20 p-10 leading-tight">
          Pending Friend Requests
        </h2>

        {/* Search Bar */}
        <div className="mb-8 w-full md:w-1/2">
          <input
            type="text"
            placeholder="Search requests by name..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={`w-full p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${inputClass}`}
          />
        </div>

        {/* Received Requests Only */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <RequestCard
                key={request._id}
                request={request} // Pass the full request object here
                isSentRequest={false} // This is a received request
                onApprove={() => handleApproveRequest(request._id)} // Passing request id to approve
                onDecline={() => handleDeclineRequest(request._id)} // Passing request id to decline
                loading={loading} // Pass loading state
              />
            ))
          ) : (
            <div className="flex justify-center items-center w-full col-span-2">
              <p className="text-gray-500 text-lg">
                No Requests Found.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Requests;
