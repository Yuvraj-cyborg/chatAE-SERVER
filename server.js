const express = require('express');
const app = express();
const { createServer } = require('http');
const server = createServer(app);
const { Server } = require('socket.io');

const port = 3001;

const io = new Server(server, {
  cors: {
    origin: "https://chat-ae.vercel.app", // Allow requests only from your frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true // Enable this if you need to handle cookies or sessions
  },
  transports: ['websocket', 'polling'] // Ensure both WebSocket and polling work
});

io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  socket.on("join_room", ({ user, room }) => {
    socket.join(room);
    console.log(`${user} joined room ${room}`);
  });

  socket.on("send_msg", (data) => {
    const { room, user, message } = data;
    const msgData = { user, message };
    socket.to(room).emit("receive_msg", msgData);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
