import { Router } from "express";
import { register, login, me, logout } from "../controllers/authController";
import auth from "../middlewares/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, me);
router.get("/logout", auth, logout);

export default router;
