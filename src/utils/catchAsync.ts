import { NextFunction, Request, Response } from "express";

export default (wrappedFunction: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    wrappedFunction(req, res, next).catch(next); // === .catch((error) => next(error))
  };
};
