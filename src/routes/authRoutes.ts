import { Router } from "express";
import {
  register,
  login,
  me,
  logout,
  loginWithGoogle,
  googleLoginCallback,
} from "../controllers/authController";
import auth from "../middlewares/auth";
import user from "../middlewares/user";

import passport from "passport";
const GoogleStrategy = require("passport-google-oauth2").Strategy;

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", user, auth, me);
router.get("/logout", user, auth, logout);

// Google OAUTH Setup
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
      scope: ["profile", "email"],
    },
    loginWithGoogle
  )
);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleLoginCallback
);

export default router;
