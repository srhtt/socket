const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

io.on("connection", (socket) => {
  socket.on("untyping", (msg) => {
    console.log("yazmıyor", msg);
    const roomID = msg["roomID"];
    const senderName = msg["senderName"];
    msg = { ...msg, socketID: socket.id };
    socket.to(roomID).emit("untyping", msg);
  });
  socket.on("typing", (msg) => {
    console.log("yazıyor", msg);
    const roomID = msg["roomID"];
    const senderName = msg["senderName"];
    msg = { ...msg, socketID: socket.id };
    socket.broadcast.to(roomID).emit("typing", msg);
    console.log(io.sockets.adapter.rooms);
  });
  socket.on("join_room", (msg) => {
    socket.join(msg["roomID"]);
    msg = { ...msg, socketID: socket.id };
    console.log("odaya katıldı", msg);
  });

  socket.on("disconnect", (reason) => {
    console.log("disconnect", socket.id);
    msg = { socketID: socket.id };
    // socket.to(roomID).emit("untyping", msg);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});
