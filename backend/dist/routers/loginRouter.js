"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv").config();
const userSchema_1 = __importDefault(require("../schema/userSchema"));
// Start Router
const router = express_1.default.Router();
router.get("/get-users", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allUsers = yield userSchema_1.default.find();
    res.status(200).json({ statusCode: 200, message: allUsers });
}));
router.get("/leadboard", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const leaderBoard = [];
    const leaders = yield userSchema_1.default.find().sort({ wins: -1 }).limit(5);
    leaders.forEach((item) => {
        leaderBoard.push({ username: item.username, wins: item.wins });
    });
    res.status(200).json({ statusCode: 200, message: leaderBoard });
}));
router.post("/single-user", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { key } = _req.body;
    if (key.length < 1) {
        res.status(403).json({
            statusCode: 403,
            confirm: false,
            message: "user key not provided",
        });
        return;
    }
    try {
        const currentUser = yield userSchema_1.default.findOne({ key });
        res
            .status(200)
            .json({ statusCode: 200, confirm: true, message: currentUser });
    }
    catch (err) {
        res
            .status(404)
            .json({ statusCode: 404, confirm: false, message: "user not found" });
    }
}));
router.post("/get-user", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, key } = _req.body;
    const currentUser = yield userSchema_1.default.findOne({ username, key });
    if (!currentUser) {
        res.status(403).json({ statusCode: 403, message: "user not exist" });
    }
    else {
        res.status(200).json({
            statusCode: 200,
            message: "user login successfully",
            key: currentUser.key,
        });
    }
}));
router.post("/new-user", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = _req.body;
    const currentUser = yield userSchema_1.default.findOne({ username });
    if (!currentUser) {
        const key = require("crypto").randomBytes(12).toString("hex");
        yield userSchema_1.default.insertMany({
            username,
            key,
            wins: 0,
            losses: 0,
            date_signed: new Date(),
        })
            .then(() => res.status(200).json({
            statusCode: 200,
            message: "User was added successfully",
            key,
        }))
            .catch(() => res
            .status(500)
            .json({ statusCode: 500, message: "internal server error" }));
    }
    else {
        res
            .status(403)
            .json({ statusCode: 403, message: "username already exist" });
    }
}));
router.put("/update-score", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, win } = _req.body;
    if (win)
        yield userSchema_1.default.findByIdAndUpdate({ username }, { $inc: { wins: 1 } }).then(() => res.status(200).json({ message: `update 1 win for ${username}` }));
    else
        yield userSchema_1.default.findByIdAndUpdate({ username }, { $inc: { losses: 1 } }).then(() => res.status(200).json({ message: `update 1 loss for ${username}` }));
}));
exports.default = router;
