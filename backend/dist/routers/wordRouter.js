"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv").config();
const seedWords_1 = require("../utils/seedWords");
// Start Router
const router = express_1.default.Router();
router.get("/easy", (_req, res) => {
    try {
        res
            .status(200)
            .json({ statusCode: 200, message: (0, seedWords_1.getThreeRandomWords)(seedWords_1.easyWordsList) });
    }
    catch (err) {
        res.status(500).json({
            statusCode: 500,
            message: "our server is down at the moment please comeback later",
        });
    }
});
router.get("/medium", (_req, res) => {
    try {
        res
            .status(200)
            .json({ statusCode: 200, message: (0, seedWords_1.getThreeRandomWords)(seedWords_1.mediumWordsList) });
    }
    catch (err) {
        res.status(500).json({
            statusCode: 500,
            message: "our server is down at the moment please comeback later",
        });
    }
});
router.get("/hard", (_req, res) => {
    try {
        res
            .status(200)
            .json({ statusCode: 200, message: (0, seedWords_1.getThreeRandomWords)(seedWords_1.hardWordsList) });
    }
    catch (err) {
        res.status(500).json({
            statusCode: 500,
            message: "our server is down at the moment please comeback later",
        });
    }
});
exports.default = router;
