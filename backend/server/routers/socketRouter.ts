import { Socket } from "socket.io";
import app from "./app";
const http = require("http");
import * as socketIO from "socket.io";
const { v4: uuidv4 } = require("uuid");
import User from "../schema/userSchema";
import {
  joinedUserData,
  getDrawingData,
  SinglePlayer,
  CheckScore,
} from "../types/socket_types";

const server = http.createServer(app);

const io = new socketIO.Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

let ROOM_ID = uuidv4();
const staticPlayersObject: any = {};

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
    } else {
      ROOM_ID = uuidv4();
      socket.join(ROOM_ID);

      staticPlayersObject[socket.id] = {
        username: data.username,
        socketId: socket.id,
        room: ROOM_ID,
      };
    }
  });

  socket.on("check_score", async (data: CheckScore) => {
    const currentUser = staticPlayersObject[socket.id];
    if (data.playerOneScore >= 5) {
      await User.findOneAndUpdate(
        { username: data.playerOne },
        { $inc: { wins: 1 } }
      );
      await User.findOneAndUpdate(
        { username: data.playerTwo },
        { $inc: { losses: 1 } }
      );
      io.in(currentUser && currentUser.room).emit("player_has_won", {
        winner: data.playerOne,
        loser: data.playerTwo,
      });
      io.sockets
        .in(currentUser && currentUser.room)
        .socketsLeave(currentUser.room);
    } else if (data.playerTwoScore >= 5) {
      await User.findOneAndUpdate(
        { username: data.playerTwo },
        { $inc: { wins: 1 } }
      );
      await User.findOneAndUpdate(
        { username: data.playerOne },
        { $inc: { losses: 1 } }
      );
      io.in(currentUser && currentUser.room).emit("player_has_won", {
        winner: data.playerTwo,
        loser: data.playerOne,
      });
      io.sockets
        .in(currentUser && currentUser.room)
        .socketsLeave(currentUser.room);
    }
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

  socket.on("quit_game", async () => {
    const currentUser: SinglePlayer = staticPlayersObject[socket.id];
    const valuesStaticPlayerObject: SinglePlayer[] =
      Object.values(staticPlayersObject);
    const secondPlayerInRoom = valuesStaticPlayerObject.find(
      (user: SinglePlayer) =>
        user.room === currentUser.room && user.username !== currentUser.username
    );

    await User.findOneAndUpdate(
      { username: secondPlayerInRoom && secondPlayerInRoom.username },
      { $inc: { wins: 1 } }
    );
    await User.findOneAndUpdate(
      { username: currentUser && currentUser.username },
      { $inc: { losses: 1 } }
    );

    socket.in(currentUser && currentUser.room).emit("player_has_disconnected", {
      winner: secondPlayerInRoom && secondPlayerInRoom.username,
    });
  });

  socket.on("disconnect", async () => {
    const currentUser: SinglePlayer = staticPlayersObject[socket.id];
    socket.in(currentUser && currentUser.room).emit("lost_connection");
    io.sockets
      .in(currentUser && currentUser.room)
      .socketsLeave(currentUser && currentUser.room);
  });
});

export default server;
