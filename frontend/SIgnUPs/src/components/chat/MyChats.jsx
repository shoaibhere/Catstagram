import { Dialog } from "@headlessui/react";
import { useToast } from "react-toastify"; // You can use react-toastify for toast notifications
import axios from "axios";
import { useEffect, useState } from "react";
import { getSender } from "../../config/ChatLogic";
import ChatLoading from "../chat/ChatLoading";
import GroupChatModal from "../misc/GroupChatModal";
import { ChatState } from "../../Context/ChatProvider";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast.error("Failed to load chats", { position: "bottom-left" });
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    if (storedUser) {
      setLoggedUser(storedUser);
    }
  }, []);

  useEffect(() => {
    if (loggedUser) {
      fetchChats();
    }
  }, [loggedUser, fetchAgain]);

  return (
    <div
      className={`${
        selectedChat ? "hidden" : "flex"
      } flex-col items-center p-3 bg-white w-full md:w-1/3 rounded-lg border border-gray-200`}
    >
      <div className="pb-3 px-3 text-2xl font-semibold flex justify-between items-center w-full">
        <span>My Chats</span>
        <GroupChatModal>
          <button className="px-4 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center">
            <AddIcon className="mr-2" />
            New Group Chat
          </button>
        </GroupChatModal>
      </div>

      <div className="flex flex-col p-3 bg-gray-100 w-full h-full rounded-lg overflow-y-hidden">
        {chats ? (
          <div className="space-y-2 overflow-y-scroll">
            {chats.map((chat) => (
              <div
                onClick={() => setSelectedChat(chat)}
                key={chat._id}
                className={`px-3 py-2 rounded-lg cursor-pointer ${
                  selectedChat === chat
                    ? "bg-teal-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                <p>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </p>
                {chat.latestMessage && (
                  <p className="text-xs">
                    <b>{chat.latestMessage.sender.name}: </b>
                    {chat.latestMessage.content.length > 50
                      ? `${chat.latestMessage.content.substring(0, 51)}...`
                      : chat.latestMessage.content}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <ChatLoading />
        )}
      </div>
    </div>
  );
};

export default MyChats;
