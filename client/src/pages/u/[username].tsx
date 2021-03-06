import dayjs from "dayjs";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";
import PostCard from "../../components/PostCard";
import { Comment } from "../../types";

export default function User() {
  const router = useRouter();
  const { username } = router.query;

  const { data, error } = useSWR<any>(username ? `/users/${username}` : null);

  if (error) {
    router.push("/");
  }

  return (
    <>
      <Head>
        <title>{data?.user.username}</title>
      </Head>
      {data && (
        <div className="container flex pt-5">
          <div className="w-160">
            {data.submissions.map((submission: any) => {
              if (submission.type === "Post") {
                const post = submission;
                return (
                  <PostCard
                    key={post.identifier}
                    post={post}
                    atIndexPage={false}
                  />
                );
              } else {
                const comment: Comment = submission;
                return (
                  <div
                    key={comment.identifier}
                    className="flex my-4 bg-white rounded dark:bg-dark-card dark:border-dark-border dark:border"
                  >
                    <div className="flex-shrink-0 w-10 py-4 text-center bg-gray-200 rounded-l dark:bg-dark-vote">
                      <i className="text-gray-500 dark:text-gray-400 fas fa-comment-alt fa-xs"></i>
                    </div>
                    <div className="w-full p-2">
                      <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                        /u/{comment.username.username}
                        <span> commented on </span>
                        <Link href={comment.post.url}>
                          <a className="font-semibold cursor-pointer hover:underline">
                            {comment.post.title}
                          </a>
                        </Link>
                        <Link href={`/r/${comment.post.subName}`}>
                          <a className="text-black cursor-pointer hover:underline">
                            /r/{comment.post.subName}
                          </a>
                        </Link>
                      </p>
                      <hr />
                      <p>{comment.body}</p>
                    </div>
                  </div>
                );
              }
            })}
          </div>
          <div className="ml-6 w-80">
            <div className="bg-white border rounded dark:bg-dark-card dark:border-dark-border">
              <div className="p-3 bg-blue-500 rounded-t dark:bg-dark-vote">
                <img
                  src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                  alt="user profile"
                  className="w-16 h-16 mx-auto border border-white rounded-full"
                />
              </div>
              <div className="p-3 text-center">
                <h1 className="mb-2 text-xl">{data.user.username}</h1>
                <hr />
                <p className="mt-3">
                  Joined {dayjs(data.user.createdAt).format("MMM YYYY")}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
