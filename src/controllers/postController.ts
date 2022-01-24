import { NextFunction, Request, Response } from "express";
import Comment from "../entities/Comment";
import Post from "../entities/Post";
import Sub from "../entities/Sub";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";

export const createPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, body, sub } = req.body;
    const user = res.locals.user;

    if (title.trim === "") {
      return next(new AppError("Title must not be empty!", 400));
    }

    const subDoc = await Sub.findOneOrFail({ name: sub });

    const post = new Post({ title, body, user, sub: subDoc });
    // delete post.sub["_id"];
    await post.save();

    return res.status(200).json({
      status: "success",
      data: post,
    });
  }
);

export const getPosts = catchAsync(
  async (_req: Request, res: Response, _: NextFunction) => {
    const posts = await Post.find({
      order: { createdAt: "DESC" },
      // relations: ["sub"], // NOT WORKING WITH MONGODB
    });

    // Fake populating sub in posts
    posts.forEach(async (post) => {
      post.sub = post.getSubWithoutId();
    });

    return res.status(200).json({
      status: "success",
      data: posts,
    });
  }
);

export const getPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { identifier, slug } = req.params;

    const post = await Post.findOneOrFail({
      identifier,
      slug,
    });
    post.sub = post.getSubWithoutId();

    if (!post) {
      return next(new AppError("Post not found!", 404));
    }

    // Populate Comments as alternative for relations
    // post.comments = await Comment.find({
    //   where: { "post.identifier": post.identifier },
    // });

    return res.status(200).json({
      status: "success",
      data: post,
    });
  }
);

export const commentOnPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { identifier, slug } = req.params;
    const { body } = req.body;

    let post = await Post.findOneOrFail({
      identifier,
      slug,
    });

    if (!post) {
      return next(new AppError("No posts found!", 404));
    }
    post = post.excludeSub();

    const comment = new Comment({
      body,
      user: res.locals.user,
      post,
    });
    await comment.save();

    return res.status(200).json({
      status: "success",
      data: comment,
    });
  }
);
