import { AppProps } from "next/app";
import Axios from "axios";
import { useRouter } from "next/router";
import { SWRConfig } from "swr";

import { AuthProvider } from "../context/auth";

import "../styles/tailwind.css";
import "../styles/icons.css";

import NavBar from "./../components/Navbar";

Axios.defaults.baseURL = "http://localhost:5000/api";
Axios.defaults.withCredentials = true; // Allow cookies to be sent

const fetcher = async (url: string) => {
  try {
    const res = await Axios.get(url);
    return res.data.data;
  } catch (error) {
    throw error.response.data.errors;
  }
};

function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const authRoutes = ["/register", "/login"];
  const authRoute = authRoutes.includes(pathname);

  return (
    <SWRConfig
      value={{
        fetcher,
        dedupingInterval: 10000, // don't call within 10s after leaving the page
      }}
    >
      {/* Now the app has access to stateContext and dispatch method */}
      <AuthProvider>
        {/* Not showing Navbar in login or register page */}
        {!authRoute && <NavBar />}
        <div className={authRoute ? "" : "pt-12"}>
          <Component {...pageProps} />
        </div>
      </AuthProvider>
    </SWRConfig>
  );
}

export default App;
