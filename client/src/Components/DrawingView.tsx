import React, { useEffect, useRef, useState } from "react";
import { Button, Card, ListGroup, ListGroupItem, Form } from "react-bootstrap";
import Board from "./Board";
import CanvasDraw from "react-canvas-draw";
import axios from "axios";

export default function DrawingView({
  playerOne,
  playerTwo,
  scorePlayerOne,
  scorePlayerTwo,
  setDrawingImg,
  selectedWord,
  setSelectedWord,
  setSelectedLevel,
  selectedLevel,
}: {
  playerOne: string;
  playerTwo: string;
  scorePlayerOne: number;
  scorePlayerTwo: number;
  setDrawingImg: React.Dispatch<React.SetStateAction<string>>;
  selectedWord: string;
  setSelectedWord: React.Dispatch<React.SetStateAction<string>>;
  setSelectedLevel: React.Dispatch<React.SetStateAction<string>>;
  selectedLevel: string;
}) {
  const [displayedWords, setDisplayedWords] = useState<string[]>([]);
  const [displayCanvasDiv, setDisplayCanvasDiv] = useState<string>("none");
  const [brushColor, setBrushColor] = useState("#130f40");
  const canvas: any = useRef(null);

  // Utils
  const handleClickSaveUrl = () => {
    const data = canvas.current!.getDataURL();
    console.log(data);
  };

  const handleClickEraseAll = () => {
    const data = canvas.current.eraseAll();
    console.log(data);
  };

  const handleClickUndo = () => {
    const data = canvas.current.undo();
    console.log(data);
  };

  const handleClickReset = () => {
    const data = canvas.current.clear();
    console.log(data);
  };

  const handleChangeDifficultyLevel = async (selectedLevel: string) => {
    axios
      .get(`http://localhost:4000/api/words/${selectedLevel}`)
      .then((res) => {
        setDisplayedWords(res.data.message);
      })
      .catch((err) => {
        alert(err.data.message);
      });
  };

  // Effects
  useEffect(() => {
    handleChangeDifficultyLevel(selectedLevel);
    console.log(displayedWords);
  }, [selectedLevel]);

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
        <ListGroup className="list-group-flush">
          <ListGroupItem>
            <Form.Label>Please select difficulty level:</Form.Label>
            <Form.Select
              onChange={(e) => {
                setSelectedLevel(e.target.value);
                setSelectedWord("");
              }}
              size="sm"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </Form.Select>
          </ListGroupItem>
          <ListGroupItem>
            <Form.Label>Please select a Word:</Form.Label>
            <Form.Select
              onChange={(e) => setSelectedWord(e.target.value)}
              size="sm"
            >
              <option></option>
              {displayedWords.map((item) => (
                <option value={item}>{item}</option>
              ))}
            </Form.Select>
          </ListGroupItem>
        </ListGroup>
        <Card.Body style={{ display: selectedWord === "" ? "none" : "block" }}>
          <Card.Title>The word you have selected is {selectedWord}</Card.Title>
          <Card.Text>
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </Card.Text>
          <div>
            <CanvasDraw
              style={{ width: "85vw", border: "0.5vh solid black" }}
              brushRadius={1}
              brushColor={brushColor}
              hideGrid={true}
              canvasWidth={400}
              canvasHeight={400}
              ref={canvas}
            />

            <div
              style={{
                display: "flex",
                margin: "2vh",
                padding: "2vh",
                justifyContent: "space-evenly",
                backgroundColor: "lightgreen",
              }}
              className="color-options"
            >
              <input
                type="color"
                onChange={(e) => setBrushColor(e.target.value)}
              />
              <button onClick={handleClickSaveUrl}>save</button>
              <button onClick={handleClickEraseAll}>clear</button>
              <button onClick={handleClickUndo}>undo</button>
              <button onClick={handleClickReset}>reset</button>
            </div>
          </div>
          <Button variant="outline-success">Send Drawing</Button>
        </Card.Body>
        <Card.Body>
          <Button variant="outline-danger">Quit Match</Button>
        </Card.Body>
      </Card>
    </div>
  );
}
