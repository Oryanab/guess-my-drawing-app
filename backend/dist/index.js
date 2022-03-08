"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socketRouter_1 = __importDefault(require("./routers/socketRouter"));
const PORT = 4000;
socketRouter_1.default.listen(PORT, () => console.log("running on port " + PORT));
