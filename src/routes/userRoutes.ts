import { Router } from "express";
import { getUserSubmissions } from "../controllers/userController";
import user from "../middlewares/user";

const router = Router();

router.get("/:username", user, getUserSubmissions);

export default router;
