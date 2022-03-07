import React, { useEffect, useRef, useState } from "react";
import { Button, Card, ListGroup, ListGroupItem, Form } from "react-bootstrap";
import { Socket } from "socket.io-client";

export default function GuessingView({
  playerOne,
  playerTwo,
  scorePlayerOne,
  scorePlayerTwo,
  setScorePlayerOne,
  setScorePlayerTwo,
  selectedWord,
  drawingImg,
  selectedLevel,
  username,
  socket,
}: {
  playerOne: string;
  playerTwo: string;
  scorePlayerOne: number;
  scorePlayerTwo: number;
  setScorePlayerOne: React.Dispatch<React.SetStateAction<number>>;
  setScorePlayerTwo: React.Dispatch<React.SetStateAction<number>>;
  selectedWord: string;
  drawingImg: string;
  selectedLevel: string;
  username: string;
  socket: Socket;
}) {
  const [waitingView, setWaitingView] = useState<boolean>(false);
  const [userGuess, setUserGuess] = useState<string>("");

  const scoreIncrement = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (userGuess.length < 0 && userGuess === selectedWord) {
      switch (selectedLevel) {
        case "easy":
          username === playerOne
            ? setScorePlayerOne((prev) => prev + 1)
            : setScorePlayerTwo((prev) => prev + 1);
          break;
        case "medium":
          username === playerOne
            ? setScorePlayerOne((prev) => prev + 2)
            : setScorePlayerTwo((prev) => prev + 2);
          break;
        case "hard":
          username === playerOne
            ? setScorePlayerOne((prev) => prev + 3)
            : setScorePlayerTwo((prev) => prev + 3);
          break;
        default:
          return;
      }
    } else {
      alert("your guess is wrong, please continue guessing or quit match");
    }
  };
  return (
    <div>
      <Card style={{ width: "100vw" }}>
        <Card.Header>
          <>
            <div style={{ textAlign: "center" }}>
              <h3>Match</h3>
              <h5>
                {playerOne} vs {playerTwo}
              </h5>
              <h5>
                {scorePlayerOne} : {scorePlayerTwo}
              </h5>
              <p>Remember! winner is the first one who reach 5 points</p>
            </div>
          </>
        </Card.Header>
        <Card.Body>
          <Card.Title>
            The the opponent has sent you a word with difficulty level{" "}
            {selectedLevel}
          </Card.Title>
          <Card.Text>
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </Card.Text>
          <div>
            <img
              src={
                waitingView
                  ? drawingImg
                  : "https://franklinchristianchurch.com/wp-content/uploads/2017/11/Waiting_web.jpg"
              }
              alt=""
              width="280vw"
              style={{ border: "0.5vh solid black", marginBottom: "1vh" }}
            />
            <Form style={{ display: waitingView ? "block" : "none" }}>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Enter your guess:</Form.Label>
                <Form.Control
                  onChange={(e) => setUserGuess(e.target.value)}
                  type="text"
                  placeholder="my guess is..."
                />
              </Form.Group>
              <Button onClick={scoreIncrement} variant="outline-success">
                Send Guess
              </Button>
            </Form>
          </div>
        </Card.Body>
        <Card.Body>
          <Button variant="outline-danger">Quit Match</Button>
        </Card.Body>
      </Card>
    </div>
  );
}
