import { User } from "../../models/User";
import { api } from "./Api";

interface Response {
  refresh: string;
  access: string;
}
class AuthService {
  async signIn(email: string, password: string): Promise<Response | undefined> {
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
      console.log("sign out");
    } catch (error) {
      console.log(error);
    }
  }
}

const authService = new AuthService();
export default authService;
