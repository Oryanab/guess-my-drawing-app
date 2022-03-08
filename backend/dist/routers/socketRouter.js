"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const http = require("http");
const socketIO = __importStar(require("socket.io"));
const { v4: uuidv4 } = require("uuid");
const userSchema_1 = __importDefault(require("../schema/userSchema"));
const server = http.createServer(app_1.default);
const io = new socketIO.Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});
let ROOM_ID = uuidv4();
const staticPlayersObject = {};
let usersInRoom = [];
io.on("connection", (socket) => {
    socket.on("join_room", (data) => {
        if (io.sockets.adapter.rooms.get(ROOM_ID) === undefined ||
            io.sockets.adapter.rooms.get(ROOM_ID).size < 2) {
            socket.join(ROOM_ID);
            usersInRoom.push(data.username);
            if (io.sockets.adapter.rooms.get(ROOM_ID).size === 1) {
                io.to(socket.id).in(ROOM_ID).emit("who_first", { first: true });
            }
            if (io.sockets.adapter.rooms.get(ROOM_ID).size === 2) {
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
        }
        else {
            ROOM_ID = uuidv4();
            socket.join(ROOM_ID);
            staticPlayersObject[socket.id] = {
                username: data.username,
                socketId: socket.id,
                room: ROOM_ID,
            };
        }
    });
    socket.on("check_score", (data) => __awaiter(void 0, void 0, void 0, function* () {
        const currentUser = staticPlayersObject[socket.id];
        if (data.playerOneScore >= 5) {
            yield userSchema_1.default.findOneAndUpdate({ username: data.playerOne }, { $inc: { wins: 1 } });
            yield userSchema_1.default.findOneAndUpdate({ username: data.playerTwo }, { $inc: { losses: 1 } });
            io.in(currentUser && currentUser.room).emit("player_has_won", {
                winner: data.playerOne,
                loser: data.playerTwo,
            });
            io.sockets
                .in(currentUser && currentUser.room)
                .socketsLeave(currentUser.room);
        }
        else if (data.playerTwoScore >= 5) {
            yield userSchema_1.default.findOneAndUpdate({ username: data.playerTwo }, { $inc: { wins: 1 } });
            yield userSchema_1.default.findOneAndUpdate({ username: data.playerOne }, { $inc: { losses: 1 } });
            io.in(currentUser && currentUser.room).emit("player_has_won", {
                winner: data.playerTwo,
                loser: data.playerOne,
            });
            io.sockets
                .in(currentUser && currentUser.room)
                .socketsLeave(currentUser.room);
        }
    }));
    socket.on("switch_turn", () => {
        const currentUser = staticPlayersObject[socket.id];
        const valuesStaticPlayerObject = Object.values(staticPlayersObject);
        const secondPlayerInRoom = valuesStaticPlayerObject.find((user) => user.room === currentUser.room && user.socketId !== currentUser.socketId);
        io.to(socket.id).in(currentUser.room).emit("your_turn");
        socket.to(secondPlayerInRoom.room).emit("not_your_turn");
    });
    socket.on("sent_drawing", (data) => {
        const currentUser = staticPlayersObject[socket.id];
        socket.to(currentUser.room).emit("receive_drawing", data);
    });
    socket.on("quit_game", () => __awaiter(void 0, void 0, void 0, function* () {
        const currentUser = staticPlayersObject[socket.id];
        const valuesStaticPlayerObject = Object.values(staticPlayersObject);
        const secondPlayerInRoom = valuesStaticPlayerObject.find((user) => user.room === currentUser.room && user.username !== currentUser.username);
        yield userSchema_1.default.findOneAndUpdate({ username: secondPlayerInRoom && secondPlayerInRoom.username }, { $inc: { wins: 1 } });
        yield userSchema_1.default.findOneAndUpdate({ username: currentUser && currentUser.username }, { $inc: { losses: 1 } });
        socket.in(currentUser && currentUser.room).emit("player_has_disconnected", {
            winner: secondPlayerInRoom && secondPlayerInRoom.username,
        });
    }));
    socket.on("disconnect", () => __awaiter(void 0, void 0, void 0, function* () {
        const currentUser = staticPlayersObject[socket.id];
        socket.in(currentUser && currentUser.room).emit("lost_connection");
        io.sockets
            .in(currentUser && currentUser.room)
            .socketsLeave(currentUser && currentUser.room);
    }));
});
exports.default = server;
