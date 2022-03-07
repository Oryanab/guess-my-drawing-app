import React, { useEffect, useRef, useState } from "react";
import { Button, Card, ListGroup, ListGroupItem, Form } from "react-bootstrap";

export default function GuessingView({
  playerOne,
  playerTwo,
  scorePlayerOne,
  scorePlayerTwo,
  setScorePlayerOne,
  setScorePlayerTwo,
  selectedWord,
  drawingImg,
}: {
  playerOne: string;
  playerTwo: string;
  scorePlayerOne: number;
  scorePlayerTwo: number;
  setScorePlayerOne: React.Dispatch<React.SetStateAction<number>>;
  setScorePlayerTwo: React.Dispatch<React.SetStateAction<number>>;
  selectedWord: string;
  drawingImg: string;
}) {
  const [selectedLevel, setSelectedLevel] = useState<string>("easy");
  const [waitingView, setWaitingView] = useState<boolean>(true);
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
            The the opponent has sent you a word with diffculty level{" "}
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
                  ? "https://franklinchristianchurch.com/wp-content/uploads/2017/11/Waiting_web.jpg"
                  : ""
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
                <Form.Control type="text" placeholder="my guess is..." />
              </Form.Group>
              <Button variant="outline-success">Send Guess</Button>
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
