import { Router } from "express";

import {
  createPost,
  getPosts,
  getPost,
  commentOnPost,
} from "../controllers/postController";
import auth from "../middlewares/auth";
import user from "../middlewares/user";

const router = Router();

router.post("/", user, auth, createPost);
router.get("/", user, getPosts);
router.get("/:identifier/:slug", getPost);
router.post("/:identifier/:slug/comments", user, auth, commentOnPost);

export default router;
