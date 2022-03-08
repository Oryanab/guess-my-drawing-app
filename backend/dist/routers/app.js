"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv").config();
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const errorhandlers_1 = require("../middlewares/errorhandlers");
//const http = require("http");
const cors = require("cors");
const loginRouter_1 = __importDefault(require("./loginRouter"));
const wordRouter_1 = __importDefault(require("./wordRouter"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(cors());
app.use(errorhandlers_1.middlewareServerError);
app.use(errorhandlers_1.middlewarePageNotFound);
app.use("/api/login", loginRouter_1.default);
app.use("/api/words", wordRouter_1.default);
// Connect to Db
mongoose_1.default
    .connect(process.env.MONGOURI)
    .then(() => {
    console.log("connected");
})
    .catch((error) => {
    console.log(error);
});
app.use("/", express_1.default.static("build"));
app.get("/", (_req, res) => {
    res.sendFile(path_1.default.resolve("build/index.html"));
});
exports.default = app;
