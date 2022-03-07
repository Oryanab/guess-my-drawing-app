import React, { useEffect, useState } from "react";
import DrawingView from "./DrawingView";
import GuessingView from "./GuessingView";
import { Socket } from "socket.io-client";

interface GameStarted {
  started: boolean;
  players: string[];
}

interface FirstTurn {
  first: boolean;
}

interface Drawing {
  image: string;
  word: string;
}

export default function Game({
  username,
  socket,
}: {
  username: string;
  socket: Socket;
}) {
  const [waitingForOpponent, setWaitingForOpponent] = useState<boolean>(true);
  const [currentTurn, setCurrentTurn] = useState<boolean>(false);
  const [playerOne, setPlayerOne] = useState<string>("");
  const [playerTwo, setPlayerTwo] = useState<string>("");
  const [scorePlayerOne, setScorePlayerOne] = useState<number>(0);
  const [scorePlayerTwo, setScorePlayerTwo] = useState<number>(0);
  const [drawingImg, setDrawingImg] = useState<string>("");
  const [selectedWord, setSelectedWord] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("easy");

  useEffect(() => {
    // When you join the game
    socket && socket.emit("join_room", { username });

    // When the server approve two person in room:
    socket &&
      socket.on("start_game", (data: GameStarted) => {
        setWaitingForOpponent(data.started);
        setPlayerOne(data.players[0]);
        setPlayerTwo(data.players[1]);
        console.log("started game");
      });

    // When the server declare who first:
    socket &&
      socket.on("who_first", (data: FirstTurn) => {
        setCurrentTurn(data.first);
      });

    // When server got "change turn" this when you can play
    socket &&
      socket.on("your_turn", () => {
        setCurrentTurn(false);
      });

    // When server get sent a photo
    socket &&
      socket.on("player_sent_drawing", (data) => {
        console.log(data);
      });
  }, [socket]);
  return (
    <div>
      <h1>Welcome to the game</h1>
      <div
        style={{
          display: waitingForOpponent ? "block" : "none",
        }}
        className="wait-div"
      >
        <h3>waiting for opponent...</h3>
      </div>
      <div className="game-div">
        <div
          style={{
            display: !waitingForOpponent && currentTurn ? "block" : "none",
          }}
          className="drawing-view-div"
        >
          <DrawingView
            playerOne={playerOne}
            playerTwo={playerTwo}
            scorePlayerOne={scorePlayerOne}
            scorePlayerTwo={scorePlayerTwo}
            setDrawingImg={setDrawingImg}
            selectedWord={selectedWord}
            setSelectedWord={setSelectedWord}
            selectedLevel={selectedLevel}
            setSelectedLevel={setSelectedLevel}
          />
        </div>
        <div
          style={{
            display: !waitingForOpponent && !currentTurn ? "block" : "none",
          }}
          className="guessing-view-div"
        >
          <GuessingView
            playerOne={playerOne}
            playerTwo={playerTwo}
            scorePlayerOne={scorePlayerOne}
            scorePlayerTwo={scorePlayerTwo}
            setScorePlayerOne={setScorePlayerOne}
            setScorePlayerTwo={setScorePlayerTwo}
            selectedWord={selectedWord}
            drawingImg={drawingImg}
            selectedLevel={selectedLevel}
          />
        </div>
      </div>
    </div>
  );
}
