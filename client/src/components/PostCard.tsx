import Link from "next/link";
import { Fragment } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { Post } from "./../types";
import Axios from "axios";
import classNames from "classnames";
import ActionButton from "./ActionButton";
import { useRouter } from "next/router";
import { useAuthState } from "../context/auth";
import Vote from "./Vote";

dayjs.extend(relativeTime);

interface PostCardProps {
  post: Post;
  atIndexPage?: boolean;
  revalidate?: Function;
}

export default function PostCard({
  post: {
    identifier,
    slug,
    title,
    body,
    subName,
    createdAt,
    updatedAt,
    voteScore,
    userVote,
    commentCount,
    url,
    username,
    sub,
  },
  atIndexPage,
  revalidate,
}: PostCardProps) {
  const { authenticated } = useAuthState();

  const router = useRouter();

  const isInSubPage = router.pathname === "/r/[sub]"; // /r/[sub]

  const vote = async (value: number) => {
    if (!authenticated) {
      router.push("/login");
    }

    if (value === userVote) value = 0;

    try {
      const res = await Axios.post("/misc/vote", {
        identifier,
        slug,
        value,
      });

      if (revalidate) {
        revalidate();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      key={identifier}
      className={classNames("flex mb-4 bg-white rounded", {
        "hover:border-black border cursor-pointer transition-all duration-75":
          atIndexPage,
      })}
      // onClick={(e) => {
      //   if (e.target["href"]) return router.push(e.target["href"]);
      //   atIndexPage ? router.push(url) : null;
      // }}
      id={identifier}
    >
      {/* Vote */}
      <Vote
        className="w-10 py-1 text-center bg-gray-200 rounded-l"
        userVote={userVote}
        voteScore={voteScore}
        post={{
          identifier,
          slug,
          title,
          body,
          subName,
          createdAt,
          updatedAt,
          voteScore,
          userVote,
          commentCount,
          url,
          username,
          sub,
        }}
      />
      {/* Post data */}
      <div className="w-full p-2">
        <div className="flex items-center">
          {!isInSubPage && (
            <Fragment>
              <Link href={`/r/${subName}`}>
                <img
                  src={sub.imageUrl}
                  alt="userIMG"
                  className="w-6 h-6 mr-1 rounded-full cursor-pointer"
                />
              </Link>
              <Link href={`/r/${subName}`}>
                <a className="text-xs font-bold cursor-pointer hover:underline">
                  /r/{subName}
                </a>
              </Link>
              <span className="mx-1 text-xs text-gray-500">•</span>
            </Fragment>
          )}
          <p className="text-xs text-gray-600">
            {" "}
            Posted by
            <Link href={`/u/${username}`}>
              <a className="mx-1 hover:underline">/u/{username}</a>
            </Link>
            <Link href={`${url}`}>
              <a className="mx-1 hover:underline" target="_blank">
                {dayjs(createdAt).fromNow()}
              </a>
            </Link>
          </p>
        </div>
        <Link href={url}>
          <a className="my-1 text-lg font-medium">{title}</a>
        </Link>
        {body && <p className="my-1 text-sm">{body}</p>}
        <div className="flex">
          <Link href={url}>
            <a>
              <ActionButton>
                <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                <span className="font-bold">{commentCount} Comments</span>
              </ActionButton>
            </a>
          </Link>
          <ActionButton>
            <i className="mr-1 fas fa-share fa-xs"></i>
            <span className="font-bold">Share</span>
          </ActionButton>
          <ActionButton>
            <i className="mr-1 fas fa-bookmark fa-xs"></i>
            <span className="font-bold">Save</span>
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
