import { Socket } from "socket.io";
import app from "./app";
const http = require("http");
import * as socketIO from "socket.io";
const { v4: uuidv4 } = require("uuid");

const server = http.createServer(app);

const io = new socketIO.Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

let ROOM_ID = uuidv4();
const staticPlayersObject: any = {};

/*
    Goal:
    - Join_room
    - disconnect

    - end_game
    - player_won
    - disconnect
    - switch_turn
*/

interface joinedUserData {
  username: string;
}

interface getDrawingData {
  level: string;
  word: string;
  drawing: string;
  scorePlayerOne: number;
  scorePlayerTwo: number;
}

interface SinglePlayer {
  username: string;
  socketId: string;
  room: string;
}
let usersInRoom: string[] = [];
io.on("connection", (socket: Socket) => {
  socket.on("join_room", (data: joinedUserData) => {
    if (
      io.sockets.adapter.rooms.get(ROOM_ID) === undefined ||
      io.sockets.adapter.rooms.get(ROOM_ID)!.size < 2
    ) {
      socket.join(ROOM_ID);
      usersInRoom.push(data.username);

      if (io.sockets.adapter.rooms.get(ROOM_ID)!.size === 1) {
        io.to(socket.id).in(ROOM_ID).emit("who_first", { first: true });
      }
      if (io.sockets.adapter.rooms.get(ROOM_ID)!.size === 2) {
        io.in(ROOM_ID).emit("start_game", {
          started: false,
          players: usersInRoom,
        });
        usersInRoom.length = 0;
      }

      staticPlayersObject[socket.id] = {
        username: data.username,
        socketId: socket.id,
        room: ROOM_ID,
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
        username: data.username,
        socketId: socket.id,
        room: ROOM_ID,
      };
      console.log(
        `User with ID: ${
          staticPlayersObject[socket.id].username
        } joined room: ${ROOM_ID}`
      );
    }
  });

  socket.on("end_game", () => {
    const currentUser = staticPlayersObject[socket.id];
    io.sockets.in(currentUser.room).socketsLeave(currentUser.room);
    const allSocketsInRoom = io.sockets.in(currentUser.room).allSockets();
    console.log(allSocketsInRoom);
  });

  socket.on("switch_turn", () => {
    const currentUser = staticPlayersObject[socket.id];
    const valuesStaticPlayerObject: SinglePlayer[] =
      Object.values(staticPlayersObject);
    const secondPlayerInRoom = valuesStaticPlayerObject.find(
      (user: SinglePlayer) =>
        user.room === currentUser.room && user.socketId !== currentUser.socketId
    );
    io.to(socket.id).in(currentUser.room).emit("your_turn");
    socket.to(secondPlayerInRoom!.room).emit("not_your_turn");
  });

  socket.on("sent_drawing", (data: getDrawingData) => {
    const currentUser = staticPlayersObject[socket.id];
    socket.to(currentUser.room).emit("receive_drawing", data);
  });

  socket.on("disconnect", () => {
    const currentUser = staticPlayersObject[socket.id];
    io.sockets
      .in(currentUser && currentUser.room)
      .socketsLeave(currentUser && currentUser.room);
    const allSocketsInRoom = io.sockets
      .in(currentUser && currentUser.room)
      .allSockets();
    console.log(allSocketsInRoom);
  });
});

export default server;
