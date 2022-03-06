import React, { useEffect, useState } from "react";
import { Users } from "../types";
import { Button } from "react-bootstrap";
import Game from "./Game";

export default function HomePage({ user }: { user: Users }) {
  //const handlePlayNow = (e: React.MouseEvent<HTMLButtonElement>) => {};

  const [profileBlock, setProfileBlock] = useState<string>("block");
  const [gameBlock, setGameBlock] = useState<boolean>(true);

  return (
    <div>
      <div className="profile block" style={{ display: profileBlock }}>
        <h1>Hello {user && user.username}</h1>
        <h2>
          your current record {user && user.wins}:{user && user.losses} since
          the
          {user && user.date_signed}
        </h2>

        {gameBlock ? (
          <Game
            username={user && user.username}
            wins={user && user.wins}
            losses={user && user.losses}
          />
        ) : (
          <Button variant="outline-primary">play now!</Button>
        )}
      </div>
    </div>
  );
}
