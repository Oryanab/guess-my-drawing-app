import React, { useEffect, useRef, useState } from "react";
import { Button, Card, ListGroup, ListGroupItem, Form } from "react-bootstrap";
import { Socket } from "socket.io-client";

interface getDrawingData {
  level: string;
  word: string;
  drawing: string;
  scorePlayerOne: number;
  scorePlayerTwo: number;
}

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
  setSelectedWord,
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
  setSelectedWord: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [waitingView, setWaitingView] = useState<boolean>(true);
  const [userGuess, setUserGuess] = useState<string>("");
  const [returnedImage, setReturnedImage] = useState<string>("");
  const [returnedLevel, setReturnedLevel] = useState<string>("");
  const [returnedWord, setReturnedWord] = useState<string>("");

  useEffect(() => {
    socket.on("receive_drawing", (data: getDrawingData) => {
      setWaitingView(false);
      setReturnedImage(data.drawing);
      setReturnedLevel(data.level);
      setReturnedWord(data.word);
      setScorePlayerOne(data.scorePlayerOne);
      setScorePlayerTwo(data.scorePlayerTwo);
    });
  }, [socket]);

  const scoreIncrement = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (userGuess.length > 0 && userGuess === returnedWord) {
      switch (returnedLevel) {
        case "easy":
          username === playerOne
            ? setScorePlayerOne((prev) => prev + 1)
            : setScorePlayerTwo((prev) => prev + 1);
          break;
        case "medium":
          username === playerOne
            ? setScorePlayerOne((prev) => prev + 3)
            : setScorePlayerTwo((prev) => prev + 3);
          break;
        case "hard":
          username === playerOne
            ? setScorePlayerOne((prev) => prev + 5)
            : setScorePlayerTwo((prev) => prev + 5);
          break;
        default:
          return;
      }
      alert("Correct");
      socket.emit("switch_turn");
      setWaitingView(true);
      setSelectedWord("");
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
            {returnedLevel}
          </Card.Title>
          <Card.Text>
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </Card.Text>
          <div>
            <img
              src={
                waitingView
                  ? "https://franklinchristianchurch.com/wp-content/uploads/2017/11/Waiting_web.jpg"
                  : returnedImage
              }
              alt=""
              width="280vw"
              style={{ border: "0.5vh solid black", marginBottom: "1vh" }}
            />
            <Form style={{ display: waitingView ? "none" : "block" }}>
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
              <Button
                onClick={(e) => scoreIncrement(e)}
                variant="outline-success"
              >
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
