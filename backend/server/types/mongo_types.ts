// Scores Interface
export interface Scores {
  username: string;
  wins: number;
}

// Users Interface
export interface Users {
  username: string;
  key: string;
  wins: number;
  losses: number;
  date_signed: Date;
}
