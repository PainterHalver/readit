import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import User from "../entities/User";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";

export default catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;

    if (!token) {
      return next();
    }
    const { username }: any = jwt.verify(token, process.env.JWT_SECRET!);

    const user = await User.findOne({ username });

    if (!user) {
      return next(new AppError("No user found!", 404));
    }

    // add data to either req.body or res.locals
    res.locals.user = user;

    return next();
  }
);
