import { Wallet } from "../../models/Wallet";
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
      const data = (await response.data) as Wallet;
      return data;
    } catch (error) {
      console.log(error);
      return {
        current_amount: 0,
        monthly_expenses: 0,
        monthly_incomes: 0,
        aggregated_expenses: [],
        labels: [],
      } as Wallet;
    }
  }

  async updateWallet({
    accessToken,
    value,
  }: {
    accessToken: string;
    value: number;
  }) {
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
