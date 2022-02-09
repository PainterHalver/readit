import { Request, Response, NextFunction } from "express";
import Comment from "../entities/Comment";
import Post from "../entities/Post";
import Sub from "../entities/Sub";
import User from "../entities/User";
import Vote from "../entities/Vote";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";

export const vote = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { identifier, slug, commentIdentifier, value } = req.body;
    // Validate vote value
    if (![-1, 0, 1].includes(value)) {
      return res.status(400).json({
        status: "Error when voting!",
        errors: {
          value: "Value must be -1, 0 or 1!",
        },
      });
    }

    const user: User = res.locals.user;
    let post = await Post.findOne({ identifier, slug });
    let vote: Vote | undefined;
    let comment: Comment | undefined;
    if (!post) {
      return next(new AppError("No post found!", 404));
    }

    if (commentIdentifier) {
      // Find vote by comment
      comment = await Comment.findOneOrFail({ identifier: commentIdentifier });
      vote = await Vote.findOne({
        where: {
          username: user.username,
          "comment.identifier": comment.identifier,
        },
      });
    } else {
      // Find vote by post
      vote = await Vote.findOne({
        where: { username: user.username, "post.identifier": post.identifier },
      });
    }

    if (!vote && value === 0) {
      // return error
      return res.status(404).json({
        status: "Error when voting!",
        errors: {
          error: "Vote not found!",
        },
      });
    } else if (!vote) {
      // post or comment is not voted yet
      vote = new Vote({ username: user.username, value });
      // figure out it's a vote on comment or post
      if (comment) vote.comment = comment;
      else vote.post = post;
      await vote.save();
    } else if (value === 0) {
      // vote exists and value = 0 remove vote from db
      await vote.remove();
    } else if (vote.value !== value) {
      // vote exists but value changed (eg. upvote changed to downvote)
      vote.value = value;
      await vote.save();
    }

    post = await Post.findOne(
      { identifier, slug }
      //   { relations: ["comment", "sub", "votes"] }
    );
    if (!post) {
      return next(new AppError("No post found!", 404));
    }
    await post.populateComments();
    await post.populateSub();
    await post.populateVotes();
    await post.setUserVote(user);
    await Promise.all(
      post.comments.map(async (c) => {
        await c.populateVotes();
        await c.setUserVote(user);
      })
    );
    if (comment) {
      await comment.populateVotes();
      await comment.setUserVote(user);
    }

    return res.status(200).json({
      status: "success",
      data: {
        userVote: comment ? comment.userVote : post.userVote,
        voteScore: comment ? comment.voteScore : post.voteScore,
      },
    });
  }
);

// EXTREMELY BAD AGGREGATION :(
export const topSubs = catchAsync(
  async (req: Request, res: Response, _: NextFunction) => {
    req;
    res;
    const allPosts = await Post.find();

    const allSubs = await Sub.find();

    const subs: any = {};
    allSubs.forEach((sub) => {
      subs[sub.name] = 0;
    });

    allPosts.forEach((post) => {
      subs[post.subName] += 1;
    });

    var sortable = [];
    for (var sub in subs) {
      sortable.push([sub, subs[sub]]);
    }

    sortable.sort(function (a, b) {
      return b[1] - a[1];
    });

    const sortedSubs: any = {};
    sortable.forEach(function (item) {
      sortedSubs[item[0]] = item[1];
    });

    const finalSubs = await Promise.all(
      Object.keys(sortedSubs).map(async (subName) => {
        const sub = await Sub.findOne({ name: subName });
        return {
          title: sub?.title,
          name: subName,
          imageUrl: sub?.imageUrn
            ? `${process.env.APP_URL}/images/${sub.imageUrn}`
            : "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
          postCount: sortedSubs[subName],
        };
      })
    );

    res.json({
      status: "success",
      data: finalSubs,
    });
  }
);
