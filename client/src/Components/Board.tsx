import React, { useRef, useState } from "react";
import CanvasDraw from "react-canvas-draw";

export default function Board() {
  const [brushColor, setBrushColor] = useState("#130f40");
  const canvas: any = useRef(null);

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

  return (
    <div>
      <input type="color" onChange={(e) => setBrushColor(e.target.value)} />
      <CanvasDraw
        style={{ border: "0.5vh solid black" }}
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
  );
}
