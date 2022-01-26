import { useRouter } from "next/router";
import useSWR from "swr";
import PostCard from "../../components/PostCard";

// because we name the file [sub].tsx, nextjs knows how to use this file for the route
export default function Sub() {
  const router = useRouter();

  const subName = router.query.sub;

  // subName could be null when page loads
  const { data: sub, error } = useSWR(subName ? `/subs/${subName}` : null); // fetch when we get subName

  if (error) router.push("/");

  let postsMarkup;
  if (!sub) {
    postsMarkup = <p className="text-lg text-center">Loading...</p>;
  } else if (sub.posts.length === 0) {
    postsMarkup = (
      <p className="text-lg text-center">No posts submitted yet!.</p>
    );
  } else {
    postsMarkup = sub.posts.map((post) => (
      <PostCard key={post.identifier} post={post} />
    ));
  }

  return (
    <div className="container flex pt-5">
      {sub && <div className="w-160">{postsMarkup}</div>}
    </div>
  );
}
