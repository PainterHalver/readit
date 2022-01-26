import { AppProps } from "next/app";
import Axios from "axios";
import { useRouter } from "next/router";

import { AuthProvider } from "../context/auth";

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
    // Now the app has access to stateContext and dispatch method
    <AuthProvider>
      {/* Not showing Navbar in login or register page */}
      {!authRoute && <NavBar />}
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default App;
