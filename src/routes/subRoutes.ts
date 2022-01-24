import { Router } from "express";

import { createSub } from "../controllers/subController";
import auth from "../middlewares/auth";

const router = Router();

router.post("/", auth, createSub);

export default router;
