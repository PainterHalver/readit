import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import classNames from "classnames";
import Axios from "axios";

import { Comment, Post } from "../../../../types";
import Sidebar from "../../../../components/SideBar";
import { useAuthState } from "../../../../context/auth";
import ActionButton from "../../../../components/ActionButton";
import NotFound from "../../../404";
import { FormEvent, useEffect, useState } from "react";
import Vote from "../../../../components/Vote";

dayjs.extend(relativeTime);

export default function PostPage() {
  const [newComment, setNewComment] = useState("");
  const [description, setDescription] = useState("");

  const { authenticated, user } = useAuthState();
  const router = useRouter();
  const { identifier, sub, slug } = router.query;
  const {
    data: post,
    error,
    revalidate: revalidatePost,
  } = useSWR<Post>(identifier && slug ? `/posts/${identifier}/${slug}` : null);
  const { data: comments, revalidate: revalidateComments } = useSWR<Comment[]>(
    identifier && slug ? `/posts/${identifier}/${slug}/comments` : null
  );

  useEffect(() => {
    if (!post) return;
    let desc = post.body || post.title;
    // Google recommends description to have length from 160-250 chars?
    desc = desc.substring(0, 158).concat("..");
    setDescription(desc);
  }, [post]);

  if (error) {
    return <NotFound />;
    // router.push("/");
  }

  const submitComment = async (event: FormEvent) => {
    event.preventDefault();
    if (newComment.trim() === "") return;

    try {
      await Axios.post(`/posts/${post.identifier}/${post.slug}/comments`, {
        body: newComment,
      });
      revalidateComments();
      setNewComment("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Head>
        <title>{post?.title}</title>
        <meta name="description" content={description}></meta>
        <meta property="og:title" content={post?.title} />
        <meta property="og:description" content={description} />
        <meta property="twitter:title" content={post?.title} />
        <meta property="twitter:description" content={description} />
      </Head>
      <Link href={`/r/${sub}`}>
        <a>
          <div className="flex items-center w-full h-20 p-8 bg-blue-500">
            <div className="container flex">
              {post && (
                <div className="w-8 h-8 mr-2 overflow-hidden rounded-full">
                  <Image
                    src={post.sub.imageUrl}
                    height={(8 * 16) / 4}
                    width={(8 * 16) / 4}
                  />
                </div>
              )}
              <p className="text-xl font-semibold text-white">/r/{sub}</p>
            </div>
          </div>
        </a>
      </Link>
      <div className="container flex pt-5">
        {/* Post */}
        <div className="w-160">
          <div className="bg-white rounded">
            {post && (
              <>
                <div className="flex">
                  {/* Vote section */}
                  <Vote
                    userVote={post.userVote}
                    voteScore={post.voteScore}
                    post={post}
                    className="flex-shrink-0 w-10 py-2 text-center rounded-l"
                  />
                  <div className="py-2 pr-2">
                    <div className="flex items-center">
                      <p className="text-xs text-gray-500">
                        Posted by
                        <Link href={`/u/${post.username}`}>
                          <a className="mx-1 hover:underline">
                            /u/{post.username}
                          </a>
                        </Link>
                        <Link href={post.url}>
                          <a className="mx-1 hover:underline">
                            {dayjs(post.createdAt).fromNow()}
                          </a>
                        </Link>
                      </p>
                    </div>
                    {/* Post title */}
                    <h1 className="my-1 text-xl font-medium">{post.title}</h1>
                    {/* Post body */}
                    <p className="my-3 text-sm">{post.body}</p>
                    {/* Actions */}
                    <div className="flex">
                      <Link href={post.url}>
                        <a>
                          <ActionButton>
                            <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                            <span className="font-bold">
                              {post.commentCount} Comments
                            </span>
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
                {/* Comment Input Area */}
                <div className="pl-10 mb-4 mr-6">
                  {authenticated ? (
                    <div>
                      <p className="mb-1 text-xs">
                        Comment as{" "}
                        <Link href={`/u/${user.username}`}>
                          <a className="font-semibold text-blue-500">
                            {user.username}
                          </a>
                        </Link>
                      </p>
                      <form onSubmit={submitComment}>
                        <textarea
                          className="w-full p-3 border border-gray-300 rounded resize-none focus:outline-none focus:border-gray-600"
                          onChange={(e) => setNewComment(e.target.value)}
                          value={newComment}
                        ></textarea>
                        <div className="flex justify-end">
                          <button
                            className="px-3 py-1 blue button"
                            disabled={newComment.trim() === ""}
                          >
                            Comment
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between px-2 py-4 border border-gray-200 rounded">
                      <p className="font-semibold text-gray-400">
                        Log in or sign up to leave a comment!
                      </p>
                      <div>
                        <Link href="/login">
                          <a className="px-4 py-1 mr-4 hollow blue button">
                            Login
                          </a>
                        </Link>
                        <Link href="/register">
                          <a className="px-4 py-1 blue button">Signup</a>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
                <hr />
                {/* Comment feed */}
                {comments?.map((comment) => (
                  <div className="flex" key={comment.identifier}>
                    {/* Vote */}
                    <Vote
                      className="flex-shrink-0 w-10 py-2 text-center rounded-l"
                      userVote={comment.userVote}
                      voteScore={comment.voteScore}
                      comment={comment}
                      post={post}
                    />
                    <div className="py-2 pr-2">
                      <p className="mb-1 text-xs leading-none">
                        <Link href={`/u/${comment.username.username}`}>
                          <a className="mr-1 font-bold hover:underline">
                            {comment.username.username}
                          </a>
                        </Link>
                        <span className="text-gray-600">
                          {`
                            ${comment.voteScore}
                            points •
                            ${dayjs(comment.createdAt).fromNow()}
                          `}
                        </span>
                      </p>
                      <p>{comment.body}</p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
        {/* Sidebar */}
        {post && <Sidebar sub={post.sub} />}
      </div>
    </>
  );
}
