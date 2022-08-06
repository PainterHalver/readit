import Axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { FormEvent, useState } from "react";
import classNames from "classnames";
import { useRouter } from "next/router";

import InputGroup from "../components/inputGroup";
import { useAuthDispatch, useAuthState } from "../context/auth";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<any>({});

  // using the dispatch to update user authentication state
  // hooks are used at top-level of Function Component
  const dispatch = useAuthDispatch();
  const { authenticated } = useAuthState();

  const router = useRouter();

  // Get back to the home page if already authenticated
  if (authenticated) router.push("/");

  const submitForm = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const res = await Axios.post("/auth/login", {
        password,
        username,
      });

      dispatch("LOGIN", res.data.data);

      router.push("/");
    } catch (error) {
      console.log(error);
      setErrors(error.response.data.errors);
    }
  };

  return (
    <div className="flex bg-white dark:bg-dark-vote">
      <Head>
        <title>Login</title>
      </Head>

      <div
        className="h-screen bg-center bg-cover w-36" // get the center of the image displayed
        style={{ backgroundImage: "url('/images/bricks.jpg')" }}
      ></div>
      <div className="flex flex-col justify-center pl-6">
        <div className="w-70">
          <h1 className="mb-2 text-lg font-medium">Login</h1>
          <p className="mb-10 text-xs">
            By continuing, you are setting up a Reddit account and agree to our
            User Agreement and Privacy Policy.
          </p>

          <a
            href={`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/auth/google`}
            className="flex items-center justify-between w-full p-1 mb-4 font-bold text-blue-500 uppercase border border-blue-500 rounded hover:bg-blue-500 hover:text-white text-md"
          >
            <div className="p-3 bg-white rounded">
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                className="w-5 h-5"
              >
                <g>
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  ></path>
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  ></path>
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  ></path>
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  ></path>
                  <path fill="none" d="M0 0h48v48H0z"></path>
                </g>
              </svg>
            </div>{" "}
            <p className="mr-5">CONTINUE WITH GOOGLE</p>
          </a>

          <div className="flex items-center justify-between w-full mb-4 divider">
            <span className="w-2/5 border-t divider-line"></span>
            <span className="font-medium text-gray-400">OR</span>
            <span className="w-2/5 border-t divider-line"></span>
          </div>

          <form onSubmit={submitForm}>
            <InputGroup
              className="mb-2"
              type="text"
              value={username}
              setValue={setUsername}
              placeholder="USERNAME"
              error={errors.username}
            />

            <InputGroup
              className="mb-4"
              type="password"
              value={password}
              setValue={setPassword}
              placeholder="PASSWORD"
              error={errors.password}
            />
            <button className="w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border border-blue-500 rounded">
              Log in
            </button>
          </form>
          <small>
            New to Readit?
            <Link href="/register">
              <a className="ml-1 text-blue-500 uppercase">Sign up</a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}
