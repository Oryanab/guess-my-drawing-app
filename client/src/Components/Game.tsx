import React from "react";
import DrawingView from "./DrawingView";
import GuessingView from "./GuessingView";
import io, { Socket } from "socket.io-client";
const socket: Socket = io("http://localhost:4000");

export default function Game({
  username,
  wins,
  losses,
}: {
  username: string;
  wins: number;
  losses: number;
}) {
  return (
    <div>
      <h1>Welcome to the game</h1>
      <DrawingView />
    </div>
  );
}
