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
    socket.broadcast.to(roomID).emit("untyping", msg);
  });
  socket.on("typing", (msg) => {
    console.log("yazıyor", msg);
    const roomID = msg["roomID"];
    const senderName = msg["senderName"];
    socket.broadcast.to(roomID).emit("typing", msg);
    console.log(io.sockets.adapter.rooms);
  });
  socket.on("join_room", (msg) => {
    socket.join(msg["roomID"]);
  });

  socket.on("disconnect", (reason) => {
    console.log("disconnect");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});
