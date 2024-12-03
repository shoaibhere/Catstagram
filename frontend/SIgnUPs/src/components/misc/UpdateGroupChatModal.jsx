import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";
import { useToast } from "react-toastify";
import { XIcon, UserPlusIcon } from "lucide-react"; // Importing Lucide icons

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const toast = useToast();

  const { selectedChat, setSelectedChat, user } = ChatState();
  const [isOpen, setIsOpen] = useState(false); // Added state for modal open/close

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;

    try {
      setLoading(true);
      const { data } = await axios.get(`/api/user?search=${search}`, {
        withCredentials: true, // Automatically sends the JWT cookie
      });
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast.error("Failed to Load the Search Results");
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const { data } = await axios.put(
        `/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        { withCredentials: true } // Automatically sends the JWT cookie
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast.error("User Already in group!");
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast.error("Only admins can add someone!");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.put(
        `/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        { withCredentials: true } // Automatically sends the JWT cookie
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast.error("Only admins can remove someone!");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.put(
        `/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        { withCredentials: true } // Automatically sends the JWT cookie
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className="flex items-center justify-center bg-teal-500 text-white p-2 rounded-full"
        onClick={() => setIsOpen(true)} // Open modal
      >
        <UserPlusIcon className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-11/12 md:w-1/3">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">
                {selectedChat.chatName}
              </h2>
              <button
                className="text-gray-500"
                onClick={() => setIsOpen(false)} // Close modal
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col items-center mt-3">
              <div className="w-full flex flex-wrap pb-3">
                {selectedChat.users.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    admin={selectedChat.groupAdmin}
                    handleFunction={() => handleRemove(u)}
                  />
                ))}
              </div>
              <div className="flex">
                <input
                  className="p-2 border rounded-l-lg"
                  placeholder="Chat Name"
                  value={groupChatName}
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
                <button
                  className="bg-teal-500 text-white p-2 rounded-r-lg"
                  onClick={handleRename}
                  disabled={renameloading}
                >
                  {renameloading ? "Updating..." : "Update"}
                </button>
              </div>
              <div className="mt-3">
                <input
                  className="p-2 border rounded-lg"
                  placeholder="Add User to group"
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>

              {loading ? (
                <div className="mt-3">Loading...</div>
              ) : (
                searchResult.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAddUser(user)}
                  />
                ))
              )}
            </div>

            <div className="mt-4 flex justify-between">
              <button
                className="bg-red-500 text-white p-2 rounded-lg"
                onClick={() => handleRemove(user)}
              >
                Leave Group
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateGroupChatModal;
