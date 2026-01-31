const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

let rooms = {};

io.on("connection", socket => {

  socket.on("joinRoom", ({ room, name }) => {
    socket.join(room);

    if (!rooms[room]) {
      rooms[room] = { players: [] };
    }

    rooms[room].players.push({
      id: socket.id,
      name: name,
      role: null
    });

    io.to(room).emit(
      "playersList",
      rooms[room].players.map(p => p.name)
    );
  });

  socket.on("startGame", room => {
    let players = rooms[room].players;

    // توزيع الأدوار
    players[0].role = "خائن";

    let spiesCount = Math.floor(players.length / 3);
    for (let i = 1; i <= spiesCount; i++) {
      players[i].role = "جاسوس";
    }

    players.forEach(p => {
      if (!p.role) p.role = "مواطن";
    });

    // خلط اللاعبين
    players.sort(() => Math.random() - 0.5);

    // إرسال الدور سريًا لكل لاعب
    players.forEach(p => {
      io.to(p.id).emit("yourRole", p.role);
    });
  });

});

http.listen(process.env.PORT || 3000, () => {
  console.log("Server running...");
});
