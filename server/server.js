const express = require("express");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");

const io = new Server();
const app = express();

app.use(bodyParser.json());

io.on("connnection", (socket) => {
  console.log("connected");
});

app.listen(8000, () => {
  console.log("server listening on port 8000");
});

io.listen(8001);
