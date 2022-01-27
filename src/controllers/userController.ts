import { Request, Response, NextFunction } from "express";
import Comment from "../entities/Comment";
import Post from "../entities/Post";
import User from "../entities/User";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";

export const getUserSubmissions = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOne({
      where: {
        username: req.params.username,
      },
      select: ["username", "createdAt"],
    });

    if (!user) {
      return next(new AppError("User not found!", 404));
    }

    const posts = await Post.find({
      where: { username: req.params.username },
    });
    await Promise.all(
      posts.map(async (post) => {
        await post.populateSub();
        await post.populateVotes();
        await post.populateComments();
      })
    );
    const comments = await Comment.find({
      where: { "username.username": req.params.username },
    });
    await Promise.all(
      comments.map(async (comment) => {
        await comment.populateVotes();
      })
    );

    if (res.locals.user) {
      await Promise.all(
        posts.map(async (post) => {
          await post.setUserVote(res.locals.user);
        })
      );
      await Promise.all(
        comments.map(async (comment) => {
          await comment.setUserVote(res.locals.user);
        })
      );
    }

    let submissions: any[] = [];
    // toJSON because p also has a model?
    posts.forEach((p) => submissions.push({ type: "Post", ...p.toJSON() }));
    comments.forEach((c) =>
      submissions.push({ type: "Comment", ...c.toJSON() })
    );
    submissions.sort((a, b) => {
      if (b.createdAt > a.createdAt) return 1;
      if (b.createdAt < a.createdAt) return -1;
      return 0;
    });

    return res.status(200).json({
      status: "success",
      data: {
        user,
        submissions,
      },
    });
  }
);
