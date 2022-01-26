import { Router } from "express";

import {
  createSub,
  getSub,
  ownSub,
  upload,
  uploadSubImage,
} from "../controllers/subController";
import auth from "../middlewares/auth";
import user from "../middlewares/user";

const router = Router();

router.post("/", user, auth, createSub);

router.get("/:name", user, getSub);

router.post(
  "/:name/image",
  user,
  auth,
  ownSub,
  upload.single("file"),
  uploadSubImage
);

export default router;
