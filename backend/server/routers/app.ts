const express = require("express");
require("dotenv").config();
import mongoose from "mongoose";
import {
  middlewareServerError,
  middlewarePageNotFound,
} from "../middlewares/errorhandlers";
//const http = require("http");
const cors = require("cors");
import loginRoute from "./loginRouter";

const app = express();
app.use(express.json());
app.use(cors());
app.use(middlewareServerError);
app.use(middlewarePageNotFound);
app.use("/api/login", loginRoute);

// Connect to Db
mongoose
  .connect(process.env.MONGOURI!)
  .then(() => {
    console.log("connected");
  })
  .catch((error) => {
    console.log(error);
  });

export default app;
