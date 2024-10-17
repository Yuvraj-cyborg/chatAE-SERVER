const express = require('express');
const app = express();
const { createServer } = require('http');
const server = createServer(app);
const { Server } = require('socket.io');

const port = 3001;

const io = new Server(server, {
  cors: {
    origin: "https://chat-ae.vercel.app", // Allow requests from your frontend
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  // User joining a specific room
  socket.on("join_room", ({ user, room }) => {
    socket.join(room);
    console.log(`${user} joined room ${room}`);
    // Optional: Emit confirmation back to the user
    socket.emit('join_confirmation', `Welcome to room ${room}, ${user}!`);
  });

  // Handle sending messages
  socket.on("send_msg", (data) => {
    const { room, user, message } = data;
    const msgData = { user, message };
    io.to(room).emit("receive_msg", msgData); // Send to everyone in the room
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
