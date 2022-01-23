import { NextFunction, Request, Response } from "express";

export default (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  res.status(error.statusCode).json({
    status: "Error captured to errorHandler!",
    error,
  });
};
