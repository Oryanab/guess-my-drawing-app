import React from "react";
import io, { Socket } from "socket.io-client";
const socket: Socket = io("http://localhost:4000");

export default function Game() {
  return <div>Game</div>;
}
