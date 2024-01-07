const express = require("express");
const app = express();
const socketio = require("socket.io");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

let playerArr = [];
let count = 1;

app.use(
  cors({
    origin: ["https://tic-tac-toe-frontend-one.vercel.app"],
    methods: "*",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.json("Hello");
});

const expressServer = app.listen(8000, () => {
  console.log("Server Up");
});

const io = socketio(expressServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connect", (socket) => {
  socket.on("join_room", ({ roomId, playerName }) => {
    socket.join(roomId);

    playerArr.push(playerName);

    if (playerArr.length >= 2) {
      io.to(roomId).emit("startGame", { message: roomId, playerArr });
    }
  });

  socket.on("disconnect", () => {
    console.log("Disconnected");
    playerArr = [];
  });

  socket.on("markX", ({ id, roomId }) => {
    io.to(roomId).emit("moveX", { id });
  });

  socket.on("gameWinner", ({ winner }) => {
    count++;
    if (count % 2 == 0) {
      if (winner == "X") {
        io.emit("winnerGame", { name: playerArr[0] });
      } else if (winner == "O") {
        io.emit("winnerGame", { name: playerArr[1] });
      }
    }
  });

  socket.on("draw", () => {
    io.emit("drawGame");
  });

  socket.on("PlayAgain", ({ id }) => {
    io.to(id).emit("restartGame");
  });
});
