import { User } from "../../models/User";
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

  async signUp(user: User) {
    try {
      console.log("sign up");
    } catch (error) {
      console.log(error);
    }
  }

  async refreshToken(token: string) {
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
