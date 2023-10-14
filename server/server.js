const express = require("express");
const app = express();
const http = require("http").Server(app);
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(bodyParser.json());
app.use(cors());

const io = require("socket.io")(http, {
  cors: {
    origin: "http://127.0.0.1:5173",
  },
});

// Creating a mapping to store emailId, socketId as key-value
const mapping = new Map();
const reverseMapping = new Map();

io.on("connection", (socket) => {
  console.log("connected");
  socket.on("join-room", (data) => {
    const { emailId, roomId } = data;

    socket.join(roomId);

    mapping.set(emailId, socket.id);
    reverseMapping.set(socket.id, emailId);

    // socket.broadcast.to(roomId).emit("user-joined", data);
    io.to(socket.id).emit("user-joined",data);
  });
});

http.listen(8000, () => {
  console.log("server listening on port 8000");
});
