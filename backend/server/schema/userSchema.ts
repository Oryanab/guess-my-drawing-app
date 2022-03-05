import mongoose, { Schema } from "mongoose";
import { Users } from "../types/mongo_types";

const usersSchema: mongoose.Schema = new Schema<Users>({
  username: { type: String, required: true },
  key: { type: String, required: true },
  wins: { type: Number, required: true },
  losses: { type: Number, required: true },
  date_signed: { type: Date, required: true },
});

const User = mongoose.model("user", usersSchema);

export default User;
