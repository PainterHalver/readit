import { AppProps } from "next/app";
import { Fragment } from "react";
import Axios from "axios";
import { useRouter } from "next/router";

import "../styles/tailwind.css";
import "../styles/icons.css";

import NavBar from "./../components/Navbar";

Axios.defaults.baseURL = "http://localhost:5000/api";
Axios.defaults.withCredentials = true; // Allow cookies to be sent

function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const authRoutes = ["/register", "/login"];
  const authRoute = authRoutes.includes(pathname);

  return (
    <Fragment>
      {!authRoute && <NavBar />}
      <Component {...pageProps} />
    </Fragment>
  );
}

export default App;
