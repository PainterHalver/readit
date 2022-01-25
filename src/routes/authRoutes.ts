import { Router } from "express";
import { register, login, me, logout } from "../controllers/authController";
import auth from "../middlewares/auth";
import user from "../middlewares/user";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", user, auth, me);
router.get("/logout", user, auth, logout);

export default router;
