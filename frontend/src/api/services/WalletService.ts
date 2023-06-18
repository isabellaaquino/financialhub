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

  async updateWallet(accessToken: string, value: number) {
    try {
      const response = await api.put("/wallet/", value, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.data;
      return data;
    } catch (error: any) {
      return error.response.data;
    }
  }
}

const walletService = new WalletService();
export default walletService;
