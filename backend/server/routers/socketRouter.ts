import { Socket } from "socket.io";
import app from "./app";
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket: Socket) => {
  console.log(`user ${socket.id} connected main hub`);

  socket.on("disconnect", () => {
    console.log(`user ${socket.id} disconnected`);
  });
});

export default server;
