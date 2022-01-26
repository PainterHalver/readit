import { Request, Response, NextFunction } from "express";
import { isEmpty } from "class-validator";

import User from "../entities/User";
import catchAsync from "../utils/catchAsync";
import Sub from "../entities/Sub";
import Post from "../entities/Post";
import AppError from "../utils/appError";

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
