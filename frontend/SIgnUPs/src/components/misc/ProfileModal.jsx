import { useState } from "react";
import axios from "axios";
import ChatLoading from "../chat/ChatLoading";
import ProfileModal from "./ProfileModal";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import { getSender } from "../../config/ChatLogic";
import UserListItem from "../userAvatar/UserListItem";
import { ChatState } from "../../Context/ChatProvider";
import { Dialog } from "@headlessui/react"; // Headless UI Dialog import
import { ChevronDown, Bell } from "lucide-react"; // Import Lucide icons

function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Track drawer state

  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const handleSearch = async () => {
    if (!search) {
      alert("Please Enter something in search");
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
      alert("Error Occurred! Failed to Load the Search Results");
    }
  };

  const accessChat = async (userId) => {
    console.log(userId);

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
      setIsDrawerOpen(false); // Close the drawer after selecting a chat
    } catch (error) {
      alert("Error fetching the chat: " + error.message);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "white",
          width: "100%",
          padding: "5px 10px",
          borderWidth: "5px",
        }}
      >
        <button
          onClick={() => setIsDrawerOpen(true)}
          style={{ background: "none", border: "none" }}
        >
          <i className="fas fa-search"></i>
          <span style={{ display: "none", fontSize: "14px" }}>Search User</span>
        </button>
        <span style={{ fontSize: "2rem", fontFamily: "Work sans" }}>
          Talk-A-Tive
        </span>
        <div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <button
              style={{
                background: "none",
                border: "none",
                position: "relative",
              }}
            >
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <Bell size={24} />
            </button>

            {/* Profile Menu */}
            <div>
              <button
                style={{ background: "white", border: "none" }}
                onClick={() => setIsDrawerOpen(true)}
              >
                <img
                  src={user.pic}
                  alt={user.name}
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    cursor: "pointer",
                  }}
                />
              </button>
              <div style={{ display: "none" }}>
                <ProfileModal user={user}>
                  <div>My Profile</div>
                </ProfileModal>
                <div onClick={logoutHandler}>Logout</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Headless UI Dialog as Drawer */}
      <Dialog open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <div className="fixed inset-0 bg-black bg-opacity-50" />
        <div className="fixed inset-0 flex justify-center items-center">
          <div className="bg-white w-1/3 rounded-lg p-4">
            <div className="border-b pb-4">
              <span style={{ fontSize: "1.25rem" }}>Search Users</span>
            </div>
            <div className="mt-4">
              <div style={{ display: "flex", paddingBottom: "10px" }}>
                <input
                  placeholder="Search by name or email"
                  style={{ marginRight: "10px" }}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button onClick={handleSearch}>Go</button>
              </div>
              {loading ? (
                <ChatLoading />
              ) : (
                searchResult?.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                ))
              )}
              {loadingChat && <div>Loading...</div>}
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default SideDrawer;
