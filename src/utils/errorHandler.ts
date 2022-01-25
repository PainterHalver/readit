import { NextFunction, Request, Response } from "express";

export default (error: any, _req: Request, res: Response, _: NextFunction) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  console.log("ERROR COMING FROM ERROR HANDLER:", error);

  res.status(error.statusCode).json({
    status: "Error captured to errorHandler!",
    message: error.message,
    errors: {
      error: "Something went really wrong!",
    },
  });
};
