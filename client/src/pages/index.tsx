import Head from "next/head";
import { Fragment, useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import useSWR, { useSWRInfinite } from "swr";

import { Post, Sub } from "./../types";
import PostCard from "./../components/PostCard";
import Image from "next/image";
import Link from "next/link";
import { useAuthState } from "../context/auth";

dayjs.extend(relativeTime);

export default function Home() {
  // keep track of the current last post of the page
  const [observedPost, setObservedPost] = useState("");

  // const { data: posts, error } = useSWR<Post[]>("/posts");
  // const [posts, setPosts] = useState<Post[]>([]);

  // useEffect(() => {
  //   Axios.get("/posts")
  //     .then((res) => setPosts(res.data.data))
  //     .catch(console.log);
  // }, []);

  const { data: topSubs } = useSWR<Sub[]>("/misc/top-subs");

  const title = "readit: the front page of the internet";
  const description =
    "Reddit is a network of communities where people can dive into their interests, hobbies and passions. There's a community for whatever you're interested in on Reddit.";

  const { authenticated } = useAuthState();

  const {
    data,
    error,
    size: page,
    setSize: setPage,
    isValidating,
    revalidate,
  } = useSWRInfinite<Post[]>((index) => `/posts?page=${index}`);

  const posts = data ? [].concat(...data) : [];
  const isLoadingInitialData = !data && !error; // only true at the first page request

  useEffect(() => {
    if (!posts || posts.length === 0) return;

    // id of the bottom post of the page
    const id = posts[posts.length - 1].identifier;

    if (id !== observedPost) {
      setObservedPost(id);
      observeElement(document.getElementById(id));
    }
  }, [posts]);

  const observeElement = (element: HTMLElement) => {
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage(page + 1);
          observer.unobserve(element);
        }
      },
      { threshold: 1 }
    );
    observer.observe(element);
  };

  return (
    <Fragment>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description}></meta>
        {/* facebook */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        {/* twitter */}
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
      </Head>
      <div className="container flex pt-4">
        {/* Posts */}
        <div className="w-full px-4 md:w-160 md:p-0">
          {isLoadingInitialData && (
            <p className="text-lg text-center">Loading..</p>
          )}
          {posts?.map((post) => (
            <PostCard
              post={post}
              key={post.identifier}
              atIndexPage={true}
              revalidate={revalidate}
            />
          ))}
          {isValidating && posts.length > 0 && (
            <p className="text-lg text-center">Loading..</p>
          )}
        </div>
        {/* Sidebar */}
        <div className="hidden ml-6 md:block w-80">
          <div className="bg-white rounded">
            <div className="p-4 border-b-2">
              <p className="text-lg font-semibold text-center">
                Top Communities
              </p>
            </div>
            <div>
              {/* TOP SUBS */}
              {topSubs?.map((sub, index: number) => {
                if (index < 5)
                  return (
                    <div
                      key={sub.name}
                      className="flex items-center px-4 py-2 text-xs border-b"
                    >
                      <div className="mr-2">
                        <Link href={`/r/${sub.name}`}>
                          <a>
                            <Image
                              src={sub.imageUrl}
                              alt="TopSub"
                              width={(6 * 16) / 4}
                              height={(6 * 16) / 4}
                              className="rounded-full cursor-pointer "
                            />
                          </a>
                        </Link>
                      </div>
                      <Link href={`/r/${sub.name}`}>
                        <a className="font-bold hover:cursor-pointer hover:underline">
                          /r/{sub.name}
                        </a>
                      </Link>
                      <p className="ml-auto font-medium">{sub.postCount}</p>
                    </div>
                  );
              })}
            </div>
            {authenticated && (
              <div className="p-4 border-t-2">
                <Link href="/subs/create">
                  <a className="w-full px-2 py-1 blue button">
                    Create Community
                  </a>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
}

// This gets called on every request
// export const getServerSideProps: GetServerSideProps = async (context) => {
//   try {
//     const res = await Axios.get("/posts");
//     return { props: { posts: res.data.data } };
//   } catch (error) {
//     return { props: { error } };
//   }
// };
