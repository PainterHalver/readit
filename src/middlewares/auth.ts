import { NextFunction, Request, Response } from "express";

import User from "../entities/User";
import catchAsync from "../utils/catchAsync";

export default catchAsync(
  async (_: Request, res: Response, next: NextFunction) => {
    const user: User | undefined = res.locals.user;

    if (!user) {
      return res.status(401).json({
        status: "failed",
        errors: {
          error: "Unauthenticated!",
        },
      });
    }

    return next();
  }
);
