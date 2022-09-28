import { NextFunction, Request, Response } from "express";
import Comment from "../entities/Comment";
import Post from "../entities/Post";
import Sub from "../entities/Sub";
import catchAsync from "../utils/catchAsync";

import { client } from "../server";

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

function isPost(arg: any): arg is Post {
  return arg && arg.prop && typeof arg.prop == "number";
}
export const getPosts = catchAsync(
  async (req: Request, res: Response, _: NextFunction) => {
    const currentPage: number = (req.query.page || 0) as number;
    const postsPerPage: number = (req.query.count || 8) as number;

    let posts: Post[] = [];
    const postsRedisString: string = (await client.get("posts")) ?? "";
    posts = JSON.parse(postsRedisString) as Post[];

    // TODO: Cache this properly
    if (posts.length === 0) {
      posts = await Post.find({
        order: { createdAt: "DESC" },
        // relations: ["sub"], // NOT WORKING WITH MONGODB
        skip: currentPage * postsPerPage,
        take: Number(postsPerPage),
      });

      // Fake populating sub in posts
      await Promise.all(
        posts.map(async (post) => {
          await post.populateSub();
          await post.populateVotes();
          await post.populateComments();
        })
      );

      await client.setEx("posts", 300, JSON.stringify(posts));
    }

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
    comment.username = { username: res.locals.user.username }; // bad things happened :(
    await comment.save();

    return res.status(200).json({
      status: "success",
      data: comment,
    });
  }
);

export const getPostComments = catchAsync(
  async (req: Request, res: Response) => {
    const { identifier, slug } = req.params;
    const post = await Post.findOneOrFail({ identifier, slug });

    const comments = await Comment.find({
      where: { "post.identifier": identifier },
      order: { createdAt: "DESC" },
      // relations: ['votes'],
    });

    await Promise.all(
      comments.map(async (cmt) => {
        await cmt.populateVotes();
      })
    );

    if (res.locals.user) {
      await Promise.all(
        comments.map(async (cmt) => {
          await cmt.setUserVote(res.locals.user);
        })
      );
    }

    return res.status(200).json({
      status: "success",
      data: comments,
    });
  }
);
