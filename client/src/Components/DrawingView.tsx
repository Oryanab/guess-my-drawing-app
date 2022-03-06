import React, { useEffect, useRef, useState } from "react";
import { Button, Card, ListGroup, ListGroupItem, Form } from "react-bootstrap";
import Board from "./Board";
import CanvasDraw from "react-canvas-draw";

export default function DrawingView() {
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [selectedWord, setSelectedWord] = useState<string>("");
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

  const handleChangeDifficultyLevel = async () => {};

  // Effects
  useEffect(() => {}, [selectedLevel]);
  return (
    <div>
      <Card style={{ width: "100vw" }}>
        <Card.Header>
          <>
            <div>
              <h3>Featured</h3>
            </div>
          </>
        </Card.Header>
        <ListGroup className="list-group-flush">
          <ListGroupItem>
            <Form.Label>Please select difficulty level:</Form.Label>
            <Form.Select size="sm">
              <option></option>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </Form.Select>
          </ListGroupItem>
          <ListGroupItem>
            <Form.Label>Please select a Word:</Form.Label>
            <Form.Select size="sm">
              <option></option>
            </Form.Select>
          </ListGroupItem>
        </ListGroup>
        <Card.Body>
          <Card.Title>The word you have selected is</Card.Title>
          <Card.Text>
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </Card.Text>
          <div>
            <input
              type="color"
              onChange={(e) => setBrushColor(e.target.value)}
            />
            <CanvasDraw
              style={{ width: "30vw", border: "0.5vh solid black" }}
              brushRadius={1}
              brushColor={brushColor}
              hideGrid={true}
              canvasWidth={400}
              canvasHeight={400}
              ref={canvas}
            />

            <button onClick={handleClickSaveUrl}>save Drawing</button>
            <button onClick={handleClickEraseAll}>Erase All</button>
            <button onClick={handleClickUndo}>undo</button>
            <button onClick={handleClickReset}>reset Drawing</button>
          </div>
        </Card.Body>
        <Card.Body>
          <Card.Link href="#">Card Link</Card.Link>
          <Card.Link href="#">Another Link</Card.Link>
        </Card.Body>
      </Card>
    </div>
  );
}
