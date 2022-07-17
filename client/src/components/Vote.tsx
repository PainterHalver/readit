import Axios from "axios";
import classNames from "classnames";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuthState } from "../context/auth";
import { Comment, Post } from "../types";

export default function Vote({
  userVote,
  voteScore,
  comment,
  post,
  className,
}: {
  userVote: number;
  voteScore: number;
  comment?: Comment;
  post: Post;
  className?: string;
}) {
  const [currentVote, setCurrentVote] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);

  const { authenticated } = useAuthState();
  const router = useRouter();
  const { identifier, sub, slug } = post;

  useEffect(() => {
    console.log({ userVote, voteScore });
    setCurrentScore(voteScore);
    setCurrentVote(userVote);
  }, []);

  const vote = async (value: number) => {
    // If not logged in go to login
    if (!authenticated) router.push("/login");

    if (
      (value === 1 && currentVote === 1) ||
      (value === -1 && currentVote === -1)
    ) {
      setCurrentVote(0);
      if (value === 1) {
        setCurrentScore(currentScore - 1);
      } else {
        setCurrentScore(currentScore + 1);
      }
    } else {
      setCurrentVote(value);
      if (value === 1 && currentVote === -1) {
        setCurrentScore(currentScore + 2);
      } else if (value === -1 && currentVote == 1) {
        setCurrentScore(currentScore - 2);
      } else if (value === 1 && currentVote === 0) {
        setCurrentScore(currentScore + 1);
      } else if (value === -1 && currentVote === 0) {
        setCurrentScore(currentScore - 1);
      }
    }

    // If vote is the same reset vote
    // if (
    //   (!comment && value === post.userVote) ||
    //   (comment && comment.userVote === value)
    // )
    if (currentVote === value) value = 0;

    try {
      const res = await Axios.post("/misc/vote", {
        identifier,
        slug,
        commentIdentifier: comment?.identifier,
        value,
      });

      const { data } = res.data;
      if (!data) return;

      setCurrentVote(data.userVote);
      setCurrentScore(data.voteScore);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={className}>
      {/* Upvote */}
      <div
        className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700 hover:text-red-500"
        onClick={() => vote(1)}
      >
        <i
          className={classNames("icon-arrow-up", {
            "text-red-500": currentVote === 1,
          })}
        ></i>
      </div>
      <p className="text-xs font-bold">{currentScore}</p>
      {/* Downvote */}
      <div
        className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700 hover:text-blue-600"
        onClick={() => vote(-1)}
      >
        <i
          className={classNames("icon-arrow-down", {
            "text-blue-600": currentVote === -1,
          })}
        ></i>
      </div>
    </div>
  );
}
