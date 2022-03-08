import React, { useEffect, useState } from "react";
import { Users } from "../types";
import { Button } from "react-bootstrap";
import Game from "./Game";
import io, { Socket } from "socket.io-client";
import axios from "axios";
import { LeaderBoard } from "../types";
import { Notyf } from "notyf";
const socket: Socket = io("/");

export default function HomePage({ user }: { user: Users }) {
  //const handlePlayNow = (e: React.MouseEvent<HTMLButtonElement>) => {};

  const [profileBlock, setProfileBlock] = useState<string>("block");
  const [gameBlock, setGameBlock] = useState<boolean>(false);
  const [leadBoardUsers, setLeadBoardUsers] = useState<LeaderBoard[]>([]);
  const notyf = new Notyf();
  const getLeadBoard = async () => {
    axios.get("/api/login/leadboard").then((res) => {
      setLeadBoardUsers(res.data.message);
    });
  };

  const handleLogOut = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    document.cookie =
      "user_key=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    notyf.success("Logout successfully");
    setTimeout(() => {
      window.location.reload();
    }, 2000);
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
      <div style={{ display: profileBlock }}>
        <h3>Start a new Game!</h3>
        <div className="login-instructions">
          <b> Instructions</b>
          <p>
            Sign up with a unique user name, make sure you save your secret key,
            enter a game and wait for your partner to come, once arrive one of
            the players will select a word and draw it, then, send it to the
            other player, that player has to guess what is the word the other
            player draw. winner is the first player to reach 5 points!
          </p>
        </div>
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
          <b>play now!</b>
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
      <div style={{ display: profileBlock }} className="logout">
        <Button onClick={(e) => handleLogOut(e)} variant="outline-danger">
          <b>Logout</b>
        </Button>
      </div>
    </div>
  );
}
