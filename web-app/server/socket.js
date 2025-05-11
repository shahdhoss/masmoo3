// socket.js
const { Server } = require('socket.io');

const connected_users = new Map();
const rooms = new Map();

function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
  origin: ["https://masmoo3-git-main-alhusseains-projects.vercel.app"],
  methods: ["GET", "POST"],
  credentials: true}
  });

  io.on("connection", (socket) => {
    console.log(`User connected ${socket.id}`);
    
    socket.on("register_user", (userdata) => {
      connected_users.set(socket.id, {
        ...userdata,
        socketId: socket.id
      });
      console.log(`User registered: ${socket.id}`, userdata);
    });
    
    socket.on("room:join", (streamId) => {
      socket.join(streamId);
      console.log(`User ${socket.id} joined ${streamId}`);
      
      if (!rooms.has(streamId)) {
        rooms.set(streamId, new Set());
      }
      rooms.get(streamId).add(socket.id);
      
      const usersInRoom = io.sockets.adapter.rooms.get(streamId);
      
      if (usersInRoom.size > 1) {
        const streamerId = [...usersInRoom][0];
        
        const listenerInfo = connected_users.get(socket.id) || {
          id: socket.id,
          first_name: `User ${socket.id.slice(0, 4)}`,
          profile_pic: ""
        };
        
        io.to(streamerId).emit("room:listener-joined", socket.id, listenerInfo);
        io.to(socket.id).emit("room:streamer-connected", streamerId);
      }
    });
    
    socket.on("peer:signal", (targetId, data) => {
      socket.to(targetId).emit("peer:signal", socket.id, data);
      console.log(`Signal from ${socket.id} to ${targetId}`);
    });
    
    socket.on("get_peers", () => {
      let userRoom = null;
      for (const [roomId, users] of rooms.entries()) {
        if (users.has(socket.id)) {
          userRoom = roomId;
          break;
        }
      }
      
      if (userRoom) {
        const roomUsers = rooms.get(userRoom);
        const peers = [];
        
        roomUsers.forEach(userId => {
          if (userId !== socket.id) {
            const userData = connected_users.get(userId) || {
              id: userId,
              first_name: `User ${userId.slice(0, 4)}`,
              profile_pic: "",
              socketId: userId
            };
            peers.push(userData);
          }
        });
        
        socket.emit("peers_list", peers);
      } else {
        socket.emit("peers_list", []);
      }
    });
    
    socket.on("chat:message", ({roomId, message, timestamp, senderName}) => {
      const userData = connected_users.get(socket.id) || {};
      const userName = senderName || userData.first_name || `User ${socket.id.slice(0, 4)}`;
      
      socket.to(roomId).emit("chat:message", {
        senderId: socket.id,
        message,
        timestamp: timestamp || new Date().toISOString(),
        senderName: userName
      });
    });
    
    socket.on("disconnect", () => {
      for (const [roomId, users] of rooms.entries()) {
        if (users.has(socket.id)) {
          socket.to(roomId).emit("room:listener-left", socket.id);
          users.delete(socket.id);
          if (users.size === 0) {
            rooms.delete(roomId);
          }
        }
      }
      
      connected_users.delete(socket.id);
      console.log(`User disconnected ${socket.id}`);
    });
  });

  return io;
}

module.exports = initializeSocket;