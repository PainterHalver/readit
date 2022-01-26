import { Router } from "express";

import { createSub, getSub } from "../controllers/subController";
import auth from "../middlewares/auth";
import user from "../middlewares/user";

const router = Router();

router.post("/", user, auth, createSub);

router.get("/:name", user, getSub);

export default router;
