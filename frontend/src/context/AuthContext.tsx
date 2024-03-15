import { jwtDecode } from "jwt-decode";
import { createContext, useState } from "react";
import { api } from "../api/services/Api";
import { User } from "../models/User";
import { UserInput } from "../routes/SignUp";

interface AuthContextData {
  user: User | null;
  SignIn({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<void>;
  SignUp({ user }: { user: UserInput }): Promise<string | null>;
  SignOut(): void;
  refresh: () => Promise<void>;
  authTokens: AuthTokens | null;
}

interface Props {
  children: React.ReactNode;
}

interface AuthTokens {
  access: string;
  refresh: string;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);
export const AuthProvider = ({ children }: Props) => {
  let [authTokens, setAuthTokens] = useState<AuthTokens | null>(null);
  let [loggedUser, setLoggedUser] = useState<User | null>(null);

  async function SignIn({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    try {
      const response = await api.post(
        "/token/",
        {
          email: email,
          password: password,
        },
        {
          withCredentials: true,
        }
      );
      const data = await response.data;
      setAuthTokens(data);
      setLoggedUser(jwtDecode(data.access));
    } catch (error) {
      console.log(error);
    }
  }

  async function SignUp({ user }: { user: UserInput }) {
    try {
      const response = await api.post("/register/", user);
      if (response.status !== 200) return null;
      return (await response.data) as string;
    } catch (error) {
      console.log(error);
    }

    return null;
  }

  function SignOut() {
    setAuthTokens(null);
    setLoggedUser(null);
  }

  async function refresh() {
    console.log("old aT: " + authTokens?.access);
    const response = await api.post(
      "/token/refresh/",
      { refresh: authTokens?.refresh },
      {
        withCredentials: true,
      }
    );
    setAuthTokens({
      access: response.data.access_token,
      refresh: response.data.refresh_token,
    });
    setLoggedUser(jwtDecode(response.data.access_token));
    return response.data.access_token;
  }

  return (
    <AuthContext.Provider
      value={{
        user: loggedUser,
        SignIn,
        SignUp,
        SignOut,
        refresh,
        authTokens,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
