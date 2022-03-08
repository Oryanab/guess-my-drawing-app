// Users Interface
import CanvasDraw from "react-canvas-draw";
export interface Users {
  username: string;
  key: string;
  wins: number;
  losses: number;
  date_signed: Date;
}

export interface CanvasDrawProps {
  onChange?: ((canvas: CanvasDraw) => void) | null | undefined;
  loadTimeOffset?: number | undefined;
  lazyRadius?: number | undefined;
  brushRadius?: number | undefined;
  brushColor?: string | undefined;
  catenaryColor?: string | undefined;
  gridColor?: string | undefined;
  backgroundColor?: string | undefined;
  hideGrid?: boolean | undefined;
  canvasWidth?: number | string | undefined;
  canvasHeight?: number | string | undefined;
  disabled?: boolean | undefined;
  imgSrc?: string | undefined;
  saveData?: string | undefined;
  immediateLoading?: boolean | undefined;
  hideInterface?: boolean | undefined;
  className?: string | undefined;
  style?: React.CSSProperties | undefined;
}

export interface GameStarted {
  started: boolean;
  players: string[];
}

export interface FirstTurn {
  first: boolean;
}

export interface EndGame {
  winner: string;
  loser: string;
}

export interface getDrawingData {
  level: string;
  word: string;
  drawing: string;
  scorePlayerOne: number;
  scorePlayerTwo: number;
}

export interface LeaderBoard {
  username: string;
  wins: number;
}
