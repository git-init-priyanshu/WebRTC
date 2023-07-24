const express = require("express");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");

const io = new Server({
  cors: {
    origin: "http://127.0.0.1:5173",
  },
});
const app = express();

app.use(bodyParser.json());

// Creating a mapping to store emailId, socketId as key-value
const mapping = new Map();

io.on("connection", (socket) => {
  console.log("connected");
  socket.on("join-room", (data) => {
    const { roomId, emailId } = data;
    console.log("user joined", emailId, "room id", roomId);
    mapping.set(emailId, socket.id);

    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user-joined", emailId);
  });
});

app.listen(8000, () => {
  console.log("server listening on port 8000");
});

io.listen(8001);
