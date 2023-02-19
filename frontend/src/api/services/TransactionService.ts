import axios from "axios";
import { api } from "./Api";

export interface Transaction {
  value: number;
  date: string;
  to_user: string;
  description: string;
  type: "EXPENSE" | "TRANSFER" | "INCOME";
}

class TransactionService {
  async getUserLoggedTransactions(accessToken: string) {
    try {
      const response = await api.get("/transactions/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = (await response.data) as Transaction[];
      return data;
    } catch (error) {
      console.log(error);
    }
  }
}

const transactionService = new TransactionService();
export default transactionService;
