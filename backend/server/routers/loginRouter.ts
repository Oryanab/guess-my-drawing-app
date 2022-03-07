import express, { Router } from "express";
require("dotenv").config();
import User from "../schema/userSchema";

// Start Router
const router: Router = express.Router();

router.get(
  "/get-users",
  async (_req: express.Request, res: express.Response) => {
    const allUsers = await User.find();
    res.status(200).json({ statusCode: 200, message: allUsers });
  }
);

router.post(
  "/single-user",
  async (_req: express.Request, res: express.Response) => {
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
      const currentUser = await User.findOne({ key });
      res
        .status(200)
        .json({ statusCode: 200, confirm: true, message: currentUser });
    } catch (err) {
      res
        .status(404)
        .json({ statusCode: 404, confirm: false, message: "user not found" });
    }
  }
);

router.post(
  "/get-user",
  async (_req: express.Request, res: express.Response) => {
    const { username, key } = _req.body;
    const currentUser = await User.findOne({ username, key });
    if (!currentUser) {
      res.status(403).json({ statusCode: 403, message: "user not exist" });
    } else {
      res.status(200).json({
        statusCode: 200,
        message: "user found successfully",
        key: currentUser.key,
      });
    }
  }
);

router.post(
  "/new-user",
  async (_req: express.Request, res: express.Response) => {
    const { username } = _req.body;
    const currentUser = await User.findOne({ username });
    if (!currentUser) {
      const key = require("crypto").randomBytes(12).toString("hex");
      await User.insertMany({
        username,
        key,
        wins: 0,
        losses: 0,
        date_signed: new Date(),
      })
        .then(() =>
          res.status(200).json({
            statusCode: 200,
            message: "User was added successfully",
            key,
          })
        )
        .catch(() =>
          res
            .status(500)
            .json({ statusCode: 500, message: "internal server error" })
        );
    } else {
      res
        .status(403)
        .json({ statusCode: 403, message: "username already exist" });
    }
  }
);

router.put(
  "/update-score",
  async (_req: express.Request, res: express.Response) => {
    const { username, win } = _req.body;
    if (win)
      await User.findByIdAndUpdate({ username }, { $inc: { wins: 1 } }).then(
        () => res.status(200).json({ message: `update 1 win for ${username}` })
      );
    else
      await User.findByIdAndUpdate({ username }, { $inc: { losses: 1 } }).then(
        () => res.status(200).json({ message: `update 1 loss for ${username}` })
      );
  }
);

export default router;
