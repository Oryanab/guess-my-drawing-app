import React, { useEffect, useState } from "react";
import { Users } from "../types";
import { Button } from "react-bootstrap";

export default function HomePage({ user }: { user: Users }) {
  const [userData, setUserData] = useState({});

  const handlePlayNow = (e: React.MouseEvent<HTMLButtonElement>) => {};
  useEffect(() => {}, []);
  return (
    <div>
      <h1>Hello {user && user.username}</h1>
      <h2>
        your current record {user && user.wins}:{user && user.losses} since the
        {user && user.date_signed}
      </h2>
      <Button onClick={(e) => handlePlayNow(e)} variant="outline-primary">
        play now!
      </Button>
    </div>
  );
}
