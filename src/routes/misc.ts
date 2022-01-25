import { Router } from "express";
import { vote } from "../controllers/miscController";
import auth from "../middlewares/auth";

const router = Router();

router.post("/vote", auth, vote);

export default router;
