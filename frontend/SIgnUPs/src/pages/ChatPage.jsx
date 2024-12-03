import React from "react";
import { ChatState } from "../Context/ChatProvider";
import SideDrawer from "../components/misc/SideDrawer";
import MyChats from "../components/MyChats";
import Chatbox from "../components/Chatbox";

const ChatPage = () => {
  const { user, loading } = ChatState();
  console.log("User in ChatPage:", user); // Log the user to verify it's correct

  if (loading) {
    return <div>Loading user information...</div>; // Wait until loading is complete
  }

  if (!user) {
    return <div>Error: User information could not be loaded.</div>; // Fallback if user is null after loading
  }

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <div style={styles.container}>
        {user && <MyChats />}
        {user && <Chatbox />}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    height: "91.5vh",
    padding: "10px",
  },
};

export default ChatPage;
