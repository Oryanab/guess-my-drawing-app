import React, { useEffect, useRef, useState } from "react";
import { Button, Card, ListGroup, ListGroupItem, Form } from "react-bootstrap";
import Board from "./Board";
import CanvasDraw from "react-canvas-draw";
import axios from "axios";
import { Socket } from "socket.io-client";

export default function DrawingView({
  playerOne,
  playerTwo,
  scorePlayerOne,
  scorePlayerTwo,
  setDrawingImg,
  drawingImg,
  selectedWord,
  setSelectedWord,
  setSelectedLevel,
  selectedLevel,
  socket,
  setCurrentTurn,
}: {
  playerOne: string;
  playerTwo: string;
  scorePlayerOne: number;
  scorePlayerTwo: number;
  setDrawingImg: React.Dispatch<React.SetStateAction<string>>;
  drawingImg: string;
  selectedWord: string;
  setSelectedWord: React.Dispatch<React.SetStateAction<string>>;
  setSelectedLevel: React.Dispatch<React.SetStateAction<string>>;
  selectedLevel: string;
  socket: Socket;
  setCurrentTurn: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [displayedWords, setDisplayedWords] = useState<string[]>([]);
  const [displayCanvasDiv, setDisplayCanvasDiv] = useState<string>("none");
  const [brushColor, setBrushColor] = useState("#130f40");
  let canvas: any = useRef(null);

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

  // Utils
  const handleClickSaveUrl = () => {
    if (canvas.current!.getDataURL().length < 7000) {
      alert("Your drawing isn't sufficient please keep on drawing");
      return;
    }
    setDrawingImg(canvas.current!.getDataURL());
  };

  const handleClickEraseAll = () => {
    canvas.current.eraseAll();
  };

  const handleClickUndo = () => {
    canvas.current.undo();
  };

  const handleClickReset = () => {
    canvas.current.clear();
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
  }, [selectedLevel]);

  function resetSelectElement() {
    const elem = document.getElementById("difficulty") as HTMLSelectElement;
    const elem2 = document.getElementById("words") as HTMLSelectElement;
    elem!.selectedIndex = 0; // first option is selected, or
    elem2!.selectedIndex = 0;
    // -1 for no option selected
  }

  const quitMatch = () => {
    socket.emit("quit_game");
  };

  const handleSwitchTurn = (e: any) => {
    e.preventDefault();
    checkWinnerStatus();
    if (drawingImg !== "") {
      socket.emit("sent_drawing", {
        level: selectedLevel,
        word: selectedWord,
        drawing: drawingImg,
        scorePlayerOne,
        scorePlayerTwo,
      });

      setCurrentTurn(false);
      setSelectedWord("");
      resetSelectElement();
      canvas = null;
    } else {
      alert("Your drawing isn't saved please save your drawing");
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
        <ListGroup className="list-group-flush">
          <ListGroupItem>
            <Form.Label>Please select difficulty level:</Form.Label>
            <Form.Select
              id="difficulty"
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
              id="words"
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
            Please carefully draw the word you have chosen, you may pick any
            color as your wish, when you finish make sure to save your drawing,
            and the hit "Send Drawing"!
          </Card.Text>
          <div>
            {/* <CanvasDraw
              style={{ width: "85vw", border: "0.5vh solid black" }}
              brushRadius={1}
              brushColor={brushColor}
              hideGrid={true}
              canvasWidth={400}
              canvasHeight={400}
              ref={canvas}
            /> */}
            {selectedWord.length > 1 && (
              <Board brushColor={brushColor} canvas={canvas} />
            )}

            <div
              style={{
                display: "flex",
                margin: "2vh",
                padding: "2vh",
                justifyContent: "space-evenly",
                backgroundColor: "#b983ff",
                borderRadius: "1vh",
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
          <Button
            onClick={(e) => handleSwitchTurn(e)}
            variant="outline-success"
          >
            Send Drawing
          </Button>
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
