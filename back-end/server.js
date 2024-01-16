const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: "https://shell-game-drab.vercel.app/",
});

const allUser = {};
const chatRoom = [];
io.on("connection", (socket) => {
  allUser[socket.id] = {
    socket: socket,
    online: true,
  };
  socket.emit("start-chat", { room: chatRoom });
  socket.on("userName-from-client", (data) => {
    allUser[socket.id].userName = data.userName;
  });
  socket.on("chat-from-client", (data) => {
    const newMess = {
      userName: allUser[socket.id].userName,
      content: data.content,
      idUserName: allUser[socket.id].socket.id,
    };
    chatRoom.push(newMess);
    for (const key in allUser) {
      const currentUser = allUser[key];
      if (currentUser.online) {
        currentUser.socket.emit("chat-from-server", {
          room: newMess,
        });
      }
    }
  });
  socket.on("disconnect", () => {
    allUser[socket.id] = {
      socket: socket,
      online: false,
    };
  });
});
httpServer.listen(4000);
