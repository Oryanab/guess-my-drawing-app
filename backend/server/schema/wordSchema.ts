import mongoose, { Schema } from "mongoose";
import { SingleWord } from "../types/mongo_types";

const wordSchema: mongoose.Schema = new Schema<SingleWord>({
  word: { type: String, required: true },
  difficulty: { type: String, required: true },
});

const Word = mongoose.model("word", wordSchema);

export default Word;
