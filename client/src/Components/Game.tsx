import React, { useEffect, useState } from "react";
import DrawingView from "./DrawingView";
import GuessingView from "./GuessingView";
import { Socket } from "socket.io-client";
import { Notyf } from "notyf";

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

interface EndGame {
  winner: string;
  loser: string;
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
  const notyf = new Notyf();

  useEffect(() => {
    // When you join the game
    socket && socket.emit("join_room", { username });

    // When the server approve two person in room:
    socket &&
      socket.on("start_game", (data: GameStarted) => {
        setWaitingForOpponent(data.started);
        setPlayerOne(data.players[0]);
        setPlayerTwo(data.players[1]);
        notyf.success("The game has officially started good luck!");
      });

    // When the server declare who first:
    socket &&
      socket.on("who_first", (data: FirstTurn) => {
        setCurrentTurn(data.first);
      });

    // When server got "change turn" this when you can play
    socket &&
      socket.on("your_turn", () => {
        setCurrentTurn(true);
      });

    // When server got "change turn" this when you can play
    socket &&
      socket.on("not_your_turn", () => {
        setCurrentTurn(false);
      });

    socket &&
      socket.on("player_has_won", (data: EndGame) => {
        notyf.success(
          ` 🏆  🏆  🏆 we have a winner - ${data.winner} 🏆  🏆  🏆 `
        );
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      });

    socket &&
      socket.on("player_has_disconnected", (data: EndGame) => {
        notyf.success(
          ` 🏆  🏆  🏆 we have a winner - ${data.winner} 🏆  🏆  🏆 `
        );
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      });

    socket &&
      socket.on("lost_connection", () => {
        notyf.error(`connection has lost with your partner`);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
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
            drawingImg={drawingImg}
            selectedWord={selectedWord}
            setSelectedWord={setSelectedWord}
            setSelectedLevel={setSelectedLevel}
            selectedLevel={selectedLevel}
            socket={socket}
            setCurrentTurn={setCurrentTurn}
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
            username={username}
            socket={socket}
            setSelectedWord={setSelectedWord}
          />
        </div>
      </div>
    </div>
  );
}
