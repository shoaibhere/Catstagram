import { useState } from "react";
import { Dialog } from "@headlessui/react"; // Headless UI Dialog for notifications
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Bell, ChevronDown, User, LogOut } from "lucide-react";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import ProfileModal from "./ProfileModal";
import UserListItem from "../userAvatar/UserListItem";
import { ChatState } from "../../Context/ChatProvider";

function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [toastMessage, setToastMessage] = useState(""); // State for toast message
  const [toastOpen, setToastOpen] = useState(false); // State for toast visibility

  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      setToastMessage("Please Enter something in search");
      setToastOpen(true);
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      setToastMessage("Error Occured! Failed to Load the Search Results");
      setToastOpen(true);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      setToastMessage("Error fetching the chat: " + error.message);
      setToastOpen(true);
    }
  };

  // State for drawer open/close
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return (
    <>
      <div className="flex justify-between items-center bg-white p-4 border-2">
        <button onClick={onOpen} className="flex items-center">
          <User className="mr-2" />
          <span className="hidden md:block">Search User</span>
        </button>

        <span className="text-2xl font-sans">Talk-A-Tive</span>

        <div className="flex items-center">
          <button className="p-1">
            <NotificationBadge
              count={notification.length}
              effect={Effect.SCALE}
            />
            <Bell className="text-xl" />
          </button>

          <div className="relative">
            <button className="bg-white p-2 flex items-center space-x-2">
              <img
                className="rounded-full h-8 w-8"
                src={user.pic}
                alt="profile"
              />
              <ChevronDown className="text-lg" />
            </button>
            <div className="absolute right-0 bg-white shadow-lg rounded-lg p-2">
              <ProfileModal user={user}>
                <button className="py-1">My Profile</button>
              </ProfileModal>
              <button
                onClick={logoutHandler}
                className="py-1 flex items-center space-x-2"
              >
                <LogOut className="mr-2" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Drawer Modal */}
      <Dialog open={isOpen} onClose={onClose}>
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          aria-hidden="true"
        ></div>
        <div className="fixed inset-0 flex justify-center items-center">
          <div className="bg-white p-4 w-80 h-96 rounded-lg">
            <h3 className="font-bold text-xl mb-4">Search Users</h3>
            <div className="flex mb-4">
              <input
                type="text"
                className="p-2 border border-gray-300 rounded-l-md w-full"
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                onClick={handleSearch}
                className="p-2 bg-blue-500 text-white rounded-r-md"
              >
                Go
              </button>
            </div>
            {loading ? (
              <div>Loading...</div>
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <div>Loading chat...</div>}
          </div>
        </div>
      </Dialog>

      {/* Toast Notification Modal */}
      <Dialog open={toastOpen} onClose={() => setToastOpen(false)}>
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          aria-hidden="true"
        ></div>
        <div className="fixed inset-0 flex justify-center items-center">
          <div className="bg-white p-4 w-80 h-32 rounded-lg flex items-center justify-center">
            <p>{toastMessage}</p>
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default SideDrawer;
