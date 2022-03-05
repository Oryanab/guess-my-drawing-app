import { Socket } from "socket.io";
import app from "./app";
const http = require("http");
const { Server } = require("socket.io");
const { v4: uuidv4 } = require("uuid");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

let ROOM_ID = uuidv4();
const staticPlayersObject: any = {};

io.on("connection", (socket: Socket) => {
  socket.on("join_room", async (username) => {
    if (
      io.sockets.adapter.rooms.get(ROOM_ID) === undefined ||
      io.sockets.adapter.rooms.get(ROOM_ID).size < 2
    ) {
      socket.join(ROOM_ID);

      if (io.sockets.adapter.rooms.get(ROOM_ID).size === 1) {
        io.to(socket.id).in(ROOM_ID).emit("who_first", { first: false });
      }

      if (io.sockets.adapter.rooms.get(ROOM_ID).size === 2) {
        io.in(ROOM_ID).emit("start_game", "start");
      }

      staticPlayersObject[socket.id] = {
        username,
        socketId: socket.id,
        room: ROOM_ID,
        record: "10-0",
      };
      console.log(
        `User with ID: ${
          staticPlayersObject[socket.id].username
        } joined room: ${ROOM_ID}`
      );
    } else {
      ROOM_ID = uuidv4();
      socket.join(ROOM_ID);

      staticPlayersObject[socket.id] = {
        username,
        socketId: socket.id,
        room: ROOM_ID,
        record: "10-0",
      };
      console.log(
        `User with ID: ${
          staticPlayersObject[socket.id].username
        } joined room: ${ROOM_ID}`
      );
    }
  });

  socket.on("change_turn", (data) => {
    const currentUser = staticPlayersObject[socket.id];
    // const otherPlayerInRoom = Object.values(staticPlayersObject).find(
    //   (user: any) =>
    //     user.room === currentUser.room && user.socketId !== currentUser.socketId
    // );
    socket.to(currentUser.room).emit("your_turn", data);
  });

  socket.on("end_game", () => {
    const currentUser = staticPlayersObject[socket.id];
    io.sockets.in(currentUser.room).socketsLeave(currentUser.room);
    const allSocketsInRoom = io.sockets.in(currentUser.room).allSockets();
    console.log(allSocketsInRoom);
  });

  socket.on("disconnect", () => {
    const currentUser = staticPlayersObject[socket.id];
    io.sockets.in(currentUser.room).socketsLeave(currentUser.room);
    const allSocketsInRoom = io.sockets.in(currentUser.room).allSockets();
    console.log(allSocketsInRoom);
  });
});

export default server;
