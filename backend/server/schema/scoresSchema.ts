import mongoose, { Schema } from "mongoose";
import { Scores } from "../types/mongo_types";

const scoresSchema: mongoose.Schema = new Schema<Scores>({
  username: { type: String, required: true },
  wins: { type: Number, required: true },
});

const Score = mongoose.model("score", scoresSchema);

export default Score;
