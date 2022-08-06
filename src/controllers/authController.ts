import { isEmpty, validate } from "class-validator";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie";

import User from "../entities/User";
import catchAsync from "../utils/catchAsync";

const mapErrors = (errors: Object[]) => {
  // let mappedErrors: any = {};
  // errors.forEach((err: any) => {
  //   const key = err.property;
  //   const value = Object.entries(err.constraints)[0][1]; // convert object to array
  //   mappedErrors[key] = value;
  // });

  // cooler way
  return errors.reduce((prev: any, err: any) => {
    prev[err.property] = Object.entries(err.constraints)[0][1];
    return prev;
  }, {});
};

export const register = catchAsync(
  async (req: Request, res: Response, _: NextFunction) => {
    const { email, username, password } = req.body;

    // Should check for empty or duplicate
    let errors: any = {};
    const emailUser = await User.findOne({ email });
    const usernameUser = await User.findOne({ username });

    if (emailUser) errors.email = "Email has already been taken!";
    if (usernameUser) errors.username = "Username has already been taken!";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        status: "failed",
        errors,
      });
    }
    // Create the user
    const user = new User({ email, username, password });

    errors = await validate(user);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        status: "failed",
        errors: mapErrors(errors),
      });
    }

    await user.save();

    // Return the user
    return res.status(200).json({
      status: "success",
      user,
    });
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, _: NextFunction) => {
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
      return res.status(404).json({
        errors: {
          username: "User not found!",
        },
      });
    }

    const passwordCorrect = await bcrypt.compare(password, user.password);
    if (!passwordCorrect) {
      return res.status(401).json({
        errors: {
          password: "Password is incorrect!",
        },
      });
    }

    // Generate token
    const token = jwt.sign({ id: user._id, username }, process.env.JWT_SECRET!); // ! for required (removing null check)

    // Send jwt to browser as cookie
    res.status(200).cookie("jwt", token, {
      httpOnly: true, // cannot be changed in anyway by browser
      secure: true, // hard to https in development
      maxAge: 360000, // 100 hours
      sameSite: "none",
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
  async (_req: Request, res: Response, _: NextFunction) => {
    return res.status(200).json(res.locals.user);
  }
);

export const logout = catchAsync(
  async (_req: Request, res: Response, _: NextFunction) => {
    // Reset cookie === no more authentication
    res.cookie("jwt", "", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: new Date(0), // expires immediately
    });

    res.status(200).json({
      status: "success",
    });
  }
);

export const loginWithGoogle = async (
  _accessToken: String,
  _refreshToken: String,
  profile: any,
  done: any
) => {
  try {
    const email = profile.email;
    const user = await User.findOne({ username: email });

    if (!user) {
      const newUser = new User({
        username: email,
        email,
        password: process.env.DEFAULT_GOOGLE_PASSWORD,
      });
      await newUser.save();
      return done(null, newUser);
    }

    return done(null, user);
  } catch (error) {
    console.log(error);
    done(error);
  }
};

export const googleLoginCallback = (req: Request, res: Response) => {
  const user: any = req.user;

  if (!user) {
    return res.status(400).json({
      status: "fail",
      message: "User not found!",
    });
  }

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET!
  );

  // Send jwt to browser as cookie
  res.status(200).cookie("jwt", token, {
    httpOnly: true,
    secure: true,
    maxAge: 360000,
    sameSite: "none",
  });

  return res.redirect(process.env.FRONT_END_URL!);

  // return res.status(200).json({
  //   status: "success",
  //   token,
  //   data: user,
  // });
};
