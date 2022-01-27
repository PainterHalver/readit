import { Request, Response, NextFunction } from "express";
import { isEmpty } from "class-validator";
import multer from "multer";

import User from "../entities/User";
import catchAsync from "../utils/catchAsync";
import Sub from "../entities/Sub";
import Post from "../entities/Post";
import AppError from "../utils/appError";
import { makeId } from "../utils/helpers";
import path from "path";
import fs from "fs";

export const createSub = catchAsync(
  async (req: Request, res: Response, _: NextFunction) => {
    const { name, title, description } = req.body;
    const user: User = res.locals.user;

    let errors: any = {};
    if (isEmpty(name)) errors.name = "Name must not be empty!";
    if (isEmpty(title)) errors.title = "Name must not be empty!";
    if (isEmpty(name)) errors.name = "Name must not be empty!";

    const sub = await Sub.findOne({
      where: {
        name: new RegExp(`${name}`, "i"), // 'i': case insensitive
      },
    });

    if (sub && !errors.name) errors.name = "Sub name already exists!";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        status: "Error from creating subs!",
        errors,
      });
    }

    // Everything is valid, creating subs
    const newSub = new Sub({ name, description, title, user });
    await newSub.save();

    return res.status(200).json({
      status: "success",
      data: newSub,
    });
  }
);

export const getSub = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const name = req.params.name;

    const sub = await Sub.findOne({ name });

    if (!sub) {
      return next(new AppError("No subs found!", 404));
    }

    const posts: Post[] = await Post.find({
      where: { subName: sub.name },
      order: { createdAt: "DESC" },
    });

    await Promise.all(
      posts.map(async (post) => {
        await post.populateComments();
        await post.populateVotes();
      })
    );

    sub.posts = posts;

    if (res.locals.user) {
      await Promise.all(
        sub.posts.map(async (post) => await post.setUserVote(res.locals.user))
      );
    }

    return res.status(200).json({
      status: "success",
      data: sub,
    });
  }
);

export const ownSub = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user: User = res.locals.user;

    const sub = await Sub.findOne({
      where: {
        name: req.params.name,
      },
    });

    if (!sub) {
      return next(new AppError("No subs found!", 404));
    }

    if (sub.username !== user.username) {
      return next(new AppError("You don't own this sub!", 403));
    }

    res.locals.sub = sub;
    return next();
  }
);

export const upload = multer({
  storage: multer.diskStorage({
    destination: "public/images",
    filename: (_, file, callback) => {
      const name = makeId(15);
      callback(null, name + path.extname(file.originalname)); // adsfabsdfabiefkjb + .png
    },
  }),
  fileFilter: (_, file: any, callback: multer.FileFilterCallback) => {
    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
      callback(null, true);
    } else {
      callback(new AppError("Not an image", 400));
    }
  },
});

export const uploadSubImage = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const sub: Sub = res.locals.sub;

    const type = req.body.type;

    if (type !== "image" && type !== "banner") {
      // delete uploaded file
      fs.unlinkSync(String(req.file?.path));
      return next(new AppError("Invalid type", 400));
    }

    let oldImageUrn: string = "";
    if (type === "image") {
      oldImageUrn = sub.imageUrn || "";
      sub.imageUrn = req.file?.filename;
    } else if (type === "banner") {
      oldImageUrn = sub.bannerUrn || "";
      sub.bannerUrn = req.file?.filename;
    }
    await sub.save();

    if (oldImageUrn !== "") {
      fs.unlinkSync(`public\\images\\${oldImageUrn}`);
    }

    return res.status(200).json({
      status: "success",
      data: sub,
    });
  }
);

export const searchSub = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const name = req.params.name;

    if (isEmpty(name)) {
      return next(new AppError("Name must not be empty!", 400));
    }

    const subs = await Sub.find({
      where: {
        name: new RegExp(`${name.trim()}.*`, "i"),
      },
    });

    return res.status(200).json({
      status: "success",
      data: subs,
    });
  }
);
