const { createServer } = require("http");
const { Server } = require("socket.io");
const { v4: uuidv4 } = require("uuid");
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: "serveo.net:8914",
});
let time = 0;
setTimeout(() => {
  time = (time + 1) % 45;
}, 1000);
let bet = {
  shrimp: [],
  crab: [],
  gourd: [],
  fish: [],
  chicken: [],
  Deer: [],
};
const allUser = {};
const chatRoom = [];
io.on("connection", (socket) => {
  allUser[socket.id] = {
    socket: socket,
    online: true,
  };
  // chat
  socket.emit("start-chat", { room: chatRoom });
  //
  socket.on("userName-from-client", (data) => {
    allUser[socket.id].userName = data.userName;
  });
  //
  socket.on("chat-from-client", (data) => {
    const newMess = {
      userName: allUser[socket.id].userName,
      content: data.content,
      idUserName: allUser[socket.id].socket.id,
      idMess: `${allUser[socket.id].socket.id.slice(4)}-${uuidv4()}`,
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
  // end chat

  // handle bet
  socket.emit("start-bet", { time: time });
  socket.on("bet-coin-from-client", (data) => {
    if (time < 40) {
      bet[data.type].push({
        userName: allUser[socket.id].userName,
        userId: socket.id,
        coin: data.coin,
      });
    }
  });

  // end

  socket.on("disconnect", () => {
    allUser[socket.id] = {
      socket: socket,
      online: false,
    };
  });
});
httpServer.listen(4000);
