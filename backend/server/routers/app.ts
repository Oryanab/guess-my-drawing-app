import express, { Request, Response } from "express";
require("dotenv").config();
import path from "path";
import mongoose from "mongoose";
import {
  middlewareServerError,
  middlewarePageNotFound,
} from "../middlewares/errorhandlers";
//const http = require("http");
const cors = require("cors");
import loginRoute from "./loginRouter";
import wordRoute from "./wordRouter";

const app = express();
app.use(express.json());
app.use(cors());
app.use(middlewareServerError);
app.use(middlewarePageNotFound);
app.use("/api/login", loginRoute);
app.use("/api/words", wordRoute);

// Connect to Db
mongoose
  .connect(process.env.MONGOURI!)
  .then(() => {
    console.log("connected");
  })
  .catch((error) => {
    console.log(error);
  });

app.use("/", express.static("build"));
app.get("/", (_req: Request, res: Response) => {
  res.sendFile(path.resolve("build/index.html"));
});

export default app;
