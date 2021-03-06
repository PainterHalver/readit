import Axios from "axios";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import useSWR from "swr";
import SideBar from "../../../components/SideBar";
import { useAuthState } from "../../../context/auth";
import { Post, Sub } from "../../../types";

export default function Submit() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const { authenticated } = useAuthState();
  const router = useRouter();
  const { sub: subName } = router.query;

  const { data: sub, error } = useSWR<Sub>(subName ? `/subs/${subName}` : null);

  useEffect(() => {
    if (!authenticated) {
      router.push("/login");
    }
  }, []);

  if (error) {
    router.push("/");
  }

  const submitPost = async (event: FormEvent) => {
    event.preventDefault();

    if (title.trim() === "") return;

    try {
      const {
        data: { data: post },
      } = await Axios.post("/posts", {
        title: title.trim(),
        body,
        sub: subName,
      });

      router.push(post.url);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container flex pt-5">
      <Head>
        <title>Submit to readit</title>
      </Head>
      <div className="w-160">
        <div className="p-4 bg-white rounded dark:bg-dark-card">
          <h1 className="mb-3 text-lg">Submit a post to /r/{subName}</h1>
          <form onSubmit={submitPost}>
            <div className="relative mb-2">
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-600 dark:border-dark-border"
                placeholder="Title"
                maxLength={300}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div
                className="absolute mb-2 text-sm text-gray-500 select-none focus:border-gray-600 dark:border-dark-border"
                style={{
                  top: "-22px",
                  right: "5px",
                }}
              >
                {title.trim().length}/300
              </div>
            </div>
            <textarea
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-600 dark:border-dark-border"
              value={body}
              placeholder="Text (optional)"
              rows={4}
              onChange={(e) => setBody(e.target.value)}
            ></textarea>
            <div className="flex justify-end">
              <button
                className="px-3 py-1 blue button"
                type="submit"
                disabled={title.trim().length === 0}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      {sub && <SideBar sub={sub} />}
    </div>
  );
}

// export async function getServerSideProps(context) {
//   return {
//     props: {}, // will be passed to the page component as props
//   }
// }

// REDIRECT TO LOGIN PAGE IF NOT LOGGED IN
// req, res are the same as from nodejs
// export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
//   try {
//     const cookie = req.headers.cookie;
//     if (!cookie) throw new Error("Missing auth token cookie");

//     await Axios.get("/auth/me", { headers: { cookie } });

//     return { props: {} };
//   } catch (err) {
//     return {
//       redirect: {
//         destination: "/login",
//         statusCode: 307,
//       },
//     };
//   }
// };
