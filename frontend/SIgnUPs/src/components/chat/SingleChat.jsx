import { useEffect, useState } from "react";
import { getSender, getSenderFull } from "../../config/ChatLogic";
import axios from "axios";
import { ArrowLeftIcon } from "lucide-react"; // Importing Lucide icons
import ProfileModal from "../misc/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../../animations/typing.json";
import io from "socket.io-client";
import UpdateGroupChatModal from "../misc/UpdateGroupChatModal";
import { ChatState } from "../../Context/ChatProvider";
import { Dialog } from "@headlessui/react"; // Headless UI dialog for modals

const ENDPOINT = "http://localhost:8000"; // "https://talk-a-tive.herokuapp.com"; -> After deployment
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // State to manage modal

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      alert("Failed to load the messages");
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        alert("Failed to send the message");
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    return () => {
      socket.off("connected");
      socket.off("typing");
      socket.off("stop typing");
    };
  }, []);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  // Modal close function
  function closeModal() {
    setIsOpen(false);
  }

  // Modal open function
  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      {selectedChat ? (
        <>
          <div className="flex justify-between items-center text-2xl font-semibold px-4 py-3">
            <ArrowLeftIcon
              className="cursor-pointer md:hidden"
              onClick={() => setSelectedChat(null)}
            />
            {messages && !selectedChat.isGroupChat ? (
              <div className="flex items-center">
                <span>{getSender(user, selectedChat.users)}</span>
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </div>
            ) : (
              <div className="flex items-center">
                <span>{selectedChat.chatName.toUpperCase()}</span>
                <UpdateGroupChatModal
                  fetchMessages={fetchMessages}
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              </div>
            )}
          </div>

          <div className="flex flex-col justify-end bg-gray-200 h-full p-4 rounded-lg">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full border-t-2 border-gray-500 w-16 h-16"></div>
              </div>
            ) : (
              <ScrollableChat messages={messages} />
            )}

            <div className="mt-3">
              {istyping && (
                <div className="w-20 mx-auto mb-4">
                  <Lottie options={defaultOptions} width={70} />
                </div>
              )}
              <input
                type="text"
                placeholder="Enter a message.."
                className="w-full p-3 bg-gray-300 rounded-lg"
                value={newMessage}
                onChange={typingHandler}
                onKeyDown={sendMessage}
              />
            </div>
          </div>

          {/* Headless UI Modal for other actions */}
          <Dialog open={isOpen} onClose={closeModal}>
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
              <div className="flex justify-center items-center min-h-screen">
                <Dialog.Panel className="bg-white p-4 rounded-lg shadow-lg">
                  <Dialog.Title>Update Group</Dialog.Title>
                  <Dialog.Description>
                    Modify group settings here
                  </Dialog.Description>
                  {/* Add your modal content here */}
                  <button
                    onClick={closeModal}
                    className="mt-4 p-2 bg-blue-500 text-white rounded-lg"
                  >
                    Close
                  </button>
                </Dialog.Panel>
              </div>
            </div>
          </Dialog>
        </>
      ) : (
        <div className="flex justify-center items-center h-full">
          <span className="text-3xl">Click on a user to start chatting</span>
        </div>
      )}
    </>
  );
};

export default SingleChat;
