import { createContext, useState } from "react";
import { api } from "../api/services/Api";
import authService from "../api/services/AuthService";
import { User } from "../models/User";

interface AuthContextData {
  user: User | null;
  setLoggedUser: any;
  SignIn(username: string, password: string): void;
  SignOut(): void;
  isAuthenticated: boolean;
}

interface Props {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);
export const AuthProvider = ({ children }: Props) => {
  let [loggedUser, setLoggedUser] = useState<User | null>(null);

  async function SignIn(username: string, password: string) {
    const response = await authService.signIn(username, password);
    if (response != null) {
      setLoggedUser({
        firstname: response.firstname,
        lastname: response.lastname,
        token: response.token,
        email: response.email,
        avatar: response.avatar,
      } as User);
      api.defaults.headers.Authorization = `Bearer ${response.token}`;
    }
  }

  async function SignOut() {
    setLoggedUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user: loggedUser,
        setLoggedUser,
        isAuthenticated: Boolean(loggedUser),
        SignIn,
        SignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
