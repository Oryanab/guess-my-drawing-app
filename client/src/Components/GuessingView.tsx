import React, { useEffect, useRef, useState } from "react";
import { Button, Card, ListGroup, ListGroupItem, Form } from "react-bootstrap";
import { Socket } from "socket.io-client";
import { Notyf } from "notyf";
import { getDrawingData } from "../types";

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
  const notyf = new Notyf();

  const checkWinnerStatus = () => {
    if (scorePlayerOne >= 5 || scorePlayerTwo >= 5) {
      socket.emit("check_score", {
        playerOne,
        playerOneScore: scorePlayerOne,
        playerTwo,
        playerTwoScore: scorePlayerTwo,
      });
      return;
    }
  };

  const quitMatch = () => {
    socket.emit("quit_game");
  };

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
          checkWinnerStatus();
          break;
        case "medium":
          username === playerOne
            ? setScorePlayerOne((prev) => prev + 3)
            : setScorePlayerTwo((prev) => prev + 3);
          checkWinnerStatus();
          break;
        case "hard":
          username === playerOne
            ? setScorePlayerOne((prev) => prev + 5)
            : setScorePlayerTwo((prev) => prev + 5);
          checkWinnerStatus();
          break;
        default:
          return;
      }
      notyf.success("Correct");
      socket.emit("switch_turn");
      setWaitingView(true);
      setSelectedWord("");
      setUserGuess("");
    } else {
      notyf.error(
        "your guess is wrong, please continue guessing or quit match"
      );
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
          <Card.Title>Waiting for your opponent to finish his play</Card.Title>
          <Card.Text>
            Once the opponent finish drawing, the drawing will be displayed
            bellow
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
                  onChange={(e) =>
                    setUserGuess(e.target.value.toLocaleLowerCase().trim())
                  }
                  type="text"
                  placeholder="my guess is..."
                  value={userGuess}
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
          <Button onClick={quitMatch} variant="outline-danger">
            Quit Match
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
}
