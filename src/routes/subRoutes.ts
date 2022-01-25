import { Router } from "express";

import { createSub } from "../controllers/subController";
import auth from "../middlewares/auth";
import user from "../middlewares/user";

const router = Router();

router.post("/", user, auth, createSub);

export default router;
