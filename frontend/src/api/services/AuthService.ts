import { AxiosResponse } from "axios";
import { User } from "../../models/User";
import { UserInput } from "../../routes/SignUp";
import { api } from "./Api";

class AuthService {
  async signIn(email: string, password: string) {
    try {
      const response = await api.post("/token/", {
        email: email,
        password: password,
      });
      const data = await response.data;
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async signUp(user: UserInput): Promise<string | null> {
    try {
      const response = await api.post("/register/", user);
      if (response.status !== 200) return null;
      return (await response.data) as string;
    } catch (error) {
      console.log(error);
    }

    return null;
  }

  async refreshToken(token: string | undefined) {
    try {
      const response = await api.post("/token/refresh/", {
        refresh: token,
      });
      const data = await response.data;
      return data;
    } catch (error) {
      console.log(error);
    }
  }
}

const authService = new AuthService();
export default authService;
