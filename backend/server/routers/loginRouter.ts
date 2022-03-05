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
  "/get-user",
  async (_req: express.Request, res: express.Response) => {
    const { username } = _req.body;
    const currentUser = await User.findOne({ username });
    if (!currentUser) {
      await User.insertMany({
        username,
        key: require("crypto").randomBytes(64).toString("hex"),
        wins: 0,
        losses: 0,
        date_signed: new Date(),
      })
        .then(() =>
          res
            .status(200)
            .json({ statusCode: 200, message: "User was added successfully" })
        )
        .catch(() =>
          res
            .status(403)
            .json({ statusCode: 403, message: "username already exist" })
        );
    } else {
      res.status(200).json({ user: currentUser });
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
