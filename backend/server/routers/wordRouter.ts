import express, { Router } from "express";
require("dotenv").config();
import {
  easyWordsList,
  mediumWordsList,
  hardWordsList,
  getThreeRandomWords,
} from "../utils/seedWords";

// Start Router
const router: Router = express.Router();

router.get("/easy", (_req: express.Request, res: express.Response) => {
  try {
    res
      .status(200)
      .json({ statusCode: 200, message: getThreeRandomWords(easyWordsList) });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: "our server is down at the moment please comeback later",
    });
  }
});

router.get("/medium", (_req: express.Request, res: express.Response) => {
  try {
    res
      .status(200)
      .json({ statusCode: 200, message: getThreeRandomWords(mediumWordsList) });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: "our server is down at the moment please comeback later",
    });
  }
});

router.get("/hard", (_req: express.Request, res: express.Response) => {
  try {
    res
      .status(200)
      .json({ statusCode: 200, message: getThreeRandomWords(hardWordsList) });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: "our server is down at the moment please comeback later",
    });
  }
});

export default router;
