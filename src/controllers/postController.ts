import { NextFunction, Request, Response } from "express";
import Comment from "../entities/Comment";
import Post from "../entities/Post";
import Sub from "../entities/Sub";
import catchAsync from "../utils/catchAsync";

export const createPost = catchAsync(
  async (req: Request, res: Response, _: NextFunction) => {
    const { title, body, sub } = req.body;
    const user = res.locals.user;

    if (title.trim === "") {
      return res.status(400).json({
        errors: {
          username: "Title must not be empty",
        },
      });
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
    await Promise.all(
      posts.map(async (post) => {
        await post.populateSub();
        await post.populateVotes();
        await post.populateComments();
      })
    );

    if (res.locals.user) {
      await Promise.all(
        posts.map(async (p) => await p.setUserVote(res.locals.user))
      );
    }

    return res.status(200).json({
      status: "success",
      results: posts.length,
      data: posts,
    });
  }
);

export const getPost = catchAsync(
  async (req: Request, res: Response, _: NextFunction) => {
    const { identifier, slug } = req.params;

    const post = await Post.findOneOrFail({
      identifier,
      slug,
    });
    await post.populateSub();
    await post.populateVotes();
    await post.populateComments();

    if (!post) {
      return res.status(404).json({
        errors: {
          username: "Post not found!",
        },
      });
    }

    if (res.locals.user) {
      await post.setUserVote(res.locals.user);
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
  async (req: Request, res: Response, _: NextFunction) => {
    const { identifier, slug } = req.params;
    const { body } = req.body;

    let post = await Post.findOneOrFail({
      identifier,
      slug,
    });

    if (!post) {
      return res.status(404).json({
        errors: {
          username: "No posts found!",
        },
      });
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
