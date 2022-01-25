import { Router } from "express";
import { vote } from "../controllers/miscController";
import auth from "../middlewares/auth";
import user from "../middlewares/user";

const router = Router();

router.post("/vote", user, auth, vote);

export default router;
