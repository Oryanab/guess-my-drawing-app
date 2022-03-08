import React, { useEffect, useState } from "react";
import { Users } from "../types";
import { Button } from "react-bootstrap";
import Game from "./Game";
import io, { Socket } from "socket.io-client";
import axios from "axios";
const socket: Socket = io("http://localhost:4000");

interface LeaderBoard {
  username: string;
  wins: number;
}

export default function HomePage({ user }: { user: Users }) {
  //const handlePlayNow = (e: React.MouseEvent<HTMLButtonElement>) => {};

  const [profileBlock, setProfileBlock] = useState<string>("block");
  const [gameBlock, setGameBlock] = useState<boolean>(false);
  const [leadBoardUsers, setLeadBoardUsers] = useState<LeaderBoard[]>([]);

  const getLeadBoard = async () => {
    axios.get("http://localhost:4000/api/login/leadboard").then((res) => {
      setLeadBoardUsers(res.data.message);
    });
  };

  useEffect(() => {
    getLeadBoard();
  }, []);

  return (
    <div className="homepage">
      <div className="profile-block" style={{ display: profileBlock }}>
        <h1 className="player-username">
          Welcome Back, <b>{user && user.username}</b>
        </h1>
        <div className="player-info">
          <h4>
            Your Record: {user && user.wins}:{user && user.losses}
          </h4>
          <h4>
            Playing since: {user && user.date_signed.toString().split("T")[0]}
          </h4>
          <h4>
            your secret key: <input type="text" value={user && user.key} />
          </h4>
          <p>
            make sure you save your secret key in order to sign in your account
          </p>
        </div>
        <br />
      </div>

      <h3>Start a new Game!</h3>
      <div className="login-instructions">
        <b> Instructions</b>
        <p>
          Sign up with a unique user name, make sure you save your secret key,
          enter a game and wait for your partner to come, once arrive one of the
          players will select a word and draw it, then, send it to the other
          player, that player has to guess what is the word the other player
          draw. winner is the first player to reach 5 points!
        </p>
      </div>
      {gameBlock ? (
        <Game username={user && user.username} socket={user && socket} />
      ) : (
        <Button
          onClick={() => {
            setGameBlock(true);
            setProfileBlock("none");
          }}
          variant="outline-primary"
        >
          play now!
        </Button>
      )}
      <div style={{ display: profileBlock }}>
        <br />
        <h1>Leaders Board</h1>
        <div className="leader-board">
          {leadBoardUsers.map((item) => (
            <div className="leader-item">
              <b>
                Player: {item.username} - wins: {item.wins}
              </b>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
