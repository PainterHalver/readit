import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import User from "../entities/User";
import catchAsync from "../utils/catchAsync";

export default catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({
        errors: {
          error: "Unauthenticated!",
        },
      });
    }
    const { username }: any = jwt.verify(token, process.env.JWT_SECRET!);

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        errors: {
          error: "Unauthenticated!",
        },
      });
    }

    // add data to either req.body or res.locals
    res.locals.user = user;

    return next();
  }
);
