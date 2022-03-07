import React, { useRef, useState } from "react";
import CanvasDraw from "react-canvas-draw";

export default function Board({
  brushColor,
  canvas,
}: {
  brushColor: string;
  canvas: any;
}) {
  return (
    <CanvasDraw
      style={{ border: "0.5vh solid black" }}
      brushRadius={1}
      brushColor={brushColor}
      hideGrid={true}
      canvasWidth={400}
      canvasHeight={400}
      ref={canvas}
    />
  );
}
