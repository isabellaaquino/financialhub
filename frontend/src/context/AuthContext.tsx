import { createContext, useState } from "react";
import { User } from "../models/User";
import { jwtDecode } from "jwt-decode";
import { UserInput } from "../routes/SignUp";
import { api } from "../api/services/Api";

interface AuthContextData {
  user: User | null;
  SignIn({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<void>;
  SignUp(user: UserInput): Promise<string | null>;
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
  // let [loading, setLoading] = useState(true);
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

  async function SignUp(user: UserInput) {
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
    const response = await api.post(
      "/token/refresh/",
      { refresh: authTokens?.refresh },
      {
        withCredentials: true,
      }
    );
    setAuthTokens((prev) => {
      if (prev) {
        console.log(prev);
        console.log(response.data);
        return response.data;
      }
      return null;
    });
    setLoggedUser(jwtDecode(response.data.access));

    return response.data.access;
  }
  // async function RefreshToken() {
  //   try {
  //     const response = (await authService.refreshToken(
  //       authTokens?.refresh
  //     )) as AuthTokens;

  //     setAuthTokens(response);
  //     setLoggedUser(jwtDecode(response.access));
  //   } catch {
  //     SignOut();
  //   }

  //   if (loading) setLoading(false);
  // }

  // async refreshToken(token: string | undefined) {
  //   try {
  //     const response = await api.post("/token/refresh/", {
  //       refresh: token,
  //     });
  //     const data = await response.data;
  //     return data;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // useEffect(() => {
  //   if (loading) RefreshToken();

  //   let interval = setInterval(() => {
  //     if (authTokens) RefreshToken();
  //   }, 1000 * 60 * 4); //5 minutes

  //   return () => clearInterval(interval);
  // }, [authTokens, loading]);

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
