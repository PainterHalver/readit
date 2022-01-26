import Axios from "axios";
import { createContext, useContext, useEffect, useReducer } from "react";
import { User } from "./../types";

interface State {
  authenticated: boolean;
  user: User | undefined;
  loading: boolean;
}

interface Action {
  type: string;
  payload: any;
}

const StateContext = createContext<State>({
  authenticated: false,
  user: null,
  loading: true, // loading to wait before rendering the nav bar button
});

const DispatchContext = createContext(null);

const reducer = (state: State, { type, payload }: Action) => {
  switch (type) {
    case "LOGIN":
      return {
        ...state,
        authenticated: true,
        user: payload,
      };
    case "LOGOUT":
      return { ...state, authenticated: false, user: null };
    case "STOP_LOADING":
      return { ...state, loading: false };
    default:
      throw new Error(`Unknow action type: ${type}`);
  }
};

// Component for the context
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, defaultDispatch] = useReducer(reducer, {
    user: null,
    authenticated: false,
    loading: true,
  });

  // just to make it easier to call dispatch
  const dispatch = (type: string, payload?: any) =>
    defaultDispatch({ type, payload });

  // fetch the user data when the page (re)loads
  // because we only know about the jwt in the first place
  useEffect(() => {
    // call back should not be async
    async function loadUser() {
      try {
        const res = await Axios.get("/auth/me");
        dispatch("LOGIN", res.data);
      } catch (err) {
        console.log(err);
      } finally {
        dispatch("STOP_LOADING");
      }
    }
    loadUser();
  }, []);

  return (
    // All children have access to dispatch method and the state of the app (authenticated or not,...)
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

// Export custom hooks for each state so that we can use those context variable in children.
// Not returning the context but return the function to get the context.
export const useAuthState = () => useContext(StateContext);
export const useAuthDispatch = () => useContext(DispatchContext);
