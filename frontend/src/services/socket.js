import io from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.currentUser = null;
    this.connectedUsers = new Map();
    this.heartbeatInterval = null;
    this.eventListeners = new Map(); // Track all active listeners
  }

  setupPresenceTracking() {
    this._addListener('user-online', (userId) => {
      this.connectedUsers.set(userId, { status: 'online' });
    });

    this._addListener('user-offline', (userId) => {
      if (this.connectedUsers.has(userId)) {
        const user = this.connectedUsers.get(userId);
        user.status = 'offline';
        this.connectedUsers.set(userId, user);
      }
    });

    this._addListener('presence-update', (onlineUsers) => {
      onlineUsers.forEach(id => {
        this.connectedUsers.set(id, { status: 'online' });
      });
    });
  }

  // Helper method to track listeners
  _addListener(event, callback) {
    this.socket.on(event, callback);
    this.eventListeners.set(event, callback);
  }

  startHeartbeat(userId) {
    this.stopHeartbeat(); // Clear any existing interval
    
    this.heartbeatInterval = setInterval(() => {
      if (this.socket?.connected) {
        this.socket.emit('heartbeat', userId);
      }
    }, 30000);
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  getOnlineStatus(userId) {
    if (!this.connectedUsers.has(userId)) return 'offline';
    return this.connectedUsers.get(userId).status;
  }

  connect(userId, userName) {
    // Prevent duplicate connections
    if (this.socket && this.currentUser?._id === userId) {
      return;
    }

    // Cleanup previous connection if exists
    this.disconnect();

    console.log("Connecting to socket server...");
    this.currentUser = { _id: userId, name: userName };

    this.socket = io("https://catstagram-production.up.railway.app", {
      transports: ["websocket"],
      timeout: 60000,
      forceNew: true,
    });

    this._addListener("connect", () => {
      console.log("Connected to server with socket ID:", this.socket.id);
      this.isConnected = true;
      this.socket.emit("setup", { _id: userId, name: userName });
    });

    this._addListener("connected", () => {
      console.log("User setup complete for:", userName);
    });

    this._addListener("disconnect", () => {
      console.log("Disconnected from server");
      this.isConnected = false;
    });

    this._addListener("connect_error", (error) => {
      console.log("Connection error:", error);
      this.isConnected = false;
    });

    this.setupPresenceTracking();
    this.startHeartbeat(userId);
  }

  disconnect() {
    // Clear all listeners
    this.eventListeners.forEach((callback, event) => {
      this.socket?.off(event, callback);
    });
    this.eventListeners.clear();

    this.stopHeartbeat();

    if (this.socket) {
      console.log("Disconnecting socket...");
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.currentUser = null;
      this.connectedUsers.clear();
    }
  }


  joinChat(chatId) {
    if (this.socket && this.isConnected) {
      console.log("Joining chat:", chatId);
      this.socket.emit("join chat", chatId);
    } else {
      console.log("Socket not connected, cannot join chat");
    }
  }

  sendMessage(message) {
    if (this.socket && this.isConnected) {
      console.log("Sending message via socket:", message);
      this.socket.emit("new message", message);
    } else {
      console.log("Socket not connected, cannot send message");
    }
  }

  onMessageReceived(callback) {
    if (this.socket) {
      this.socket.on("message recieved", (message) => {
        console.log("Message received via socket:", message);
        callback(message);
      });
    }
  }

  offMessageReceived() {
    if (this.socket) {
      this.socket.off("message recieved");
    }
  }

  startTyping(chatId) {
    if (this.socket && this.isConnected && this.currentUser) {
      console.log("Start typing in chat:", chatId);
      this.socket.emit("typing", {
        chatId,
        user: this.currentUser,
      });
    }
  }

  stopTyping(chatId) {
    if (this.socket && this.isConnected && this.currentUser) {
      console.log("Stop typing in chat:", chatId);
      this.socket.emit("stop typing", {
        chatId,
        user: this.currentUser,
      });
    }
  }

  onTyping(callback) {
    if (this.socket) {
      this.socket.on("typing", (data) => {
        console.log("Typing event received:", data);
        callback(data);
      });
    }
  }

  onStopTyping(callback) {
    if (this.socket) {
      this.socket.on("stop typing", (data) => {
        console.log("Stop typing event received:", data);
        callback(data);
      });
    }
  }

  offTyping() {
    if (this.socket) {
      this.socket.off("typing");
      this.socket.off("stop typing");
    }
  }

  getConnectionStatus() {
    return this.isConnected;
  }
}

export default new SocketService();
