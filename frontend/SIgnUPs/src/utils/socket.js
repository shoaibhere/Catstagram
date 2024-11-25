// src/socket.js
import io from "socket.io-client";

const socket = io(process.env.REACT_APP_SOCKET_URL || "http://localhost:8000", {
  withCredentials: true, // To handle cookies and authentication
});

export default socket;
