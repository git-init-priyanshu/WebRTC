const { Server } = require("socket.io");

const io = new Server(8000, {
  cors: true,
});

// Creating a mapping to store emailId, socketId as key-value
const mapping = new Map();
const reverseMapping = new Map();

io.on("connection", (socket) => {
  console.log("user joined with socket id:", socket.id);
  socket.on("join-room", (data) => {
    const { emailId } = data;

    mapping.set(emailId, socket.id);
    reverseMapping.set(socket.id, emailId);
  });

  socket.on("room-joined", (roomId) => {
    socket.join(roomId);
    // To broadcast the event
    socket.to(roomId).emit("room:joined", { id: socket.id });
    // To emit event to ourselves only
    io.to(roomId).emit("room:joined");
  });

  socket.on("call-user", (data) => {
    const { to, offer } = data;
    io.to(to).emit("incomming-call", { from: socket.id, offer });
  });

  socket.on("call-accepted", (data) => {
    const { to, ans } = data;
    io.to(to).emit("call-accepted", { from: socket.id, ans });
  });

  socket.on("nagotiation", (data) => {
    const { to, offer } = data;
    io.to(to).emit("nagotiation", { from: socket.id, offer });
  });

  socket.on("nagotiation-done", (data) => {
    const { to, ans } = data;
    io.to(to).emit("nagotiation-done", { from: socket.id, ans });
  });
});
