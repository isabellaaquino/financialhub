import axios from "axios";
import { api, axiosPrivate } from "../api/services/Api";
import { User } from "../models/User";
import { useAuth } from "./useAuth";

export function useRefreshToken() {
  const authContext = useAuth();

  async function refresh() {
    const response = await axios.get("https://localhost:7191/api/auth/refreshToken");
    console.log(response.data);
    authContext.setLoggedUser((prevState: User) => {
      return { ...prevState, token: response.data };
    });

    return response.data;
  }

  return refresh;
}
