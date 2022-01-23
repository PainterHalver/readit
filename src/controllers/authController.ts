import { isEmpty, validate } from "class-validator";
import { Request, Response, NextFunction } from "express";
import { getMongoRepository } from "typeorm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { User } from "../entities/User";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";

export const register = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, username, password } = req.body;

    // Create the user
    const user = new User({ email, username, password });

    const errors = await validate(user);
    if (errors.length > 0)
      return res.status(400).json({
        status: "failed",
        errors,
      });

    await user.save();

    // Return the user
    return res.status(200).json({
      status: "success",
      user,
    });
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    // Check for empty keys in body
    let errors: any = {};
    if (isEmpty(username)) errors.username = "Username must not be empty!";
    if (isEmpty(password)) errors.password = "Password must not be empty!";
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        status: "Error from login!",
        errors,
      });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return next(new AppError("User not found!", 404));
    }
    const passwordCorrect = await bcrypt.compare(password, user.password);
    if (!passwordCorrect) {
      return next(new AppError("Password is incorrect!", 401));
    }

    // Generate token
    const token = jwt.sign({ id: user._id, username }, process.env.JWT_SECRET);

    // Send jwt to browser as cookie
    res.cookie("jwt", token, {
      httpOnly: true, // cannot be changed in anyway by browser
      secure: process.env.NODE_ENV === "production" ? true : false, // hard to https in development
      sameSite: "strict",
      maxAge: 360000, // 100 hours
      //   path: "/", // all routes (but here is from /api/auth/)
    });

    return res.status(200).json({
      status: "success",
      token,
      data: user,
    });
  }
);

export const me = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;

    if (!token) {
      return next(new AppError("Unauthenticated!", 401));
    }
    const { username }: any = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ username });
    if (!user) {
      return next(new AppError("Unauthenticated!", 401));
    }

    return res.json({
      status: "success",
      data: user,
    });
  }
);
