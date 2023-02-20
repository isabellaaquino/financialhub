import axios from "axios";
import { api } from "./Api";

class WalletService {
  async getUserLoggedWallet(accessToken: string) {
    try {
      const response = await api.get("/wallet/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.data;
      return data;
    } catch (error) {
      console.log(error);
    }
  }
}

const walletService = new WalletService();
export default walletService;
