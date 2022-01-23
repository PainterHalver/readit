import { NextFunction, Request, Response, Router } from "express";
import { validate } from "class-validator";

// separate relative imports from absolute import as a convention
import { User } from "../entities/User";
import catchAsync from "../utils/catchAsync";

const register = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, username, password } = req.body;

    // TODO: Create the user
    const user = new User({ email, username, password });

    const errors = await validate(user);
    if (errors.length > 0)
      return res.status(400).json({
        status: "failed",
        errors,
      });

    await user.save();

    // TODO: Return the user
    return res.json({
      status: "success",
      user,
    });
  }
);

const router = Router();

router.post("/register", register);
export default router;
