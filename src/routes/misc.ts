import { Router } from "express";
import { topSubs, vote } from "../controllers/miscController";
import auth from "../middlewares/auth";
import user from "../middlewares/user";

const router = Router();

router.post("/vote", user, auth, vote);
router.get("/top-subs", topSubs);

export default router;
