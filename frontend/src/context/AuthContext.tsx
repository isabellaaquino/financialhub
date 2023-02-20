import { createContext, useEffect, useState } from "react";
import { api } from "../api/services/Api";
import authService from "../api/services/AuthService";
import { User } from "../models/User";
import jwt_decode from "jwt-decode";

interface AuthContextData {
  user: User | null;
  SignIn(email: string, password: string): void;
  SignOut(): void;
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
  let [loading, setLoading] = useState(true);
  let [authTokens, setAuthTokens] = useState<AuthTokens | null>(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens")!)
      : null
  );
  let [loggedUser, setLoggedUser] = useState<User | null>(() =>
    localStorage.getItem("authTokens")
      ? jwt_decode(localStorage.getItem("authTokens")!)
      : null
  );

  async function SignIn(email: string, password: string) {
    const response = (await authService.signIn(email, password)) as AuthTokens;
    setAuthTokens(response);
    setLoggedUser(jwt_decode(response.access));
    localStorage.setItem("authTokens", JSON.stringify(response));
  }

  function SignOut() {
    setAuthTokens(null);
    setLoggedUser(null);
    localStorage.removeItem("authTokens");
  }

  async function RefreshToken() {
    try {
      const response = (await authService.refreshToken(
        authTokens?.refresh
      )) as AuthTokens;

      setAuthTokens(response);
      setLoggedUser(jwt_decode(response.access));
      localStorage.setItem("authTokens", JSON.stringify(response));
    } catch {
      SignOut();
    }

    if (loading) setLoading(false);
  }

  useEffect(() => {
    if (loading) RefreshToken();

    let interval = setInterval(() => {
      if (authTokens) RefreshToken();
    }, 1000 * 60 * 4); //5 minutes

    return () => clearInterval(interval);
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider
      value={{
        user: loggedUser,
        SignIn,
        SignOut,
        authTokens,
      }}
    >
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
