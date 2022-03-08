export interface joinedUserData {
  username: string;
}

export interface getDrawingData {
  level: string;
  word: string;
  drawing: string;
  scorePlayerOne: number;
  scorePlayerTwo: number;
}

export interface SinglePlayer {
  username: string;
  socketId: string;
  room: string;
}

export interface CheckScore {
  playerOne: string;
  playerOneScore: number;
  playerTwo: string;
  playerTwoScore: number;
}
