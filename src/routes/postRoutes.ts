import { Router } from "express";

import { createPost, getPosts } from "../controllers/postController";
import auth from "../middlewares/auth";

const router = Router();

router.post("/", auth, createPost);
router.get("/", auth, getPosts);

export default router;
