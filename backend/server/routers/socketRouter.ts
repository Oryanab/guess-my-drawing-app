import { Socket } from "socket.io";
import app from "./app";
const http = require("http");
const { Server } = require("socket.io");
// const { v4: uuidv4 } = require("uuid");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// let ROOM_ID = uuidv4();
// const staticPlayersObject: any = {};

io.on("connection", (socket: Socket) => {
  console.log(`user ${socket.id} connected main hub`);

  socket.on("disconnect", () => {
    console.log(`user ${socket.id} left main hub`);
  });
});

export default server;
