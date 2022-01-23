import { Router } from "express";

import { createPost } from "../controllers/postController";
import auth from "../middlewares/auth";

const router = Router();

router.post("/", auth, createPost);

export default router;
