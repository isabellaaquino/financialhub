import axios from "axios";
import { Transaction } from "../../models/Transaction";
import { api } from "./Api";
import { TransactionInput } from "../../components/AddTransaction";

class TransactionService {
  async getUserLoggedTransactions(accessToken: string, year: number = 0) {
    try {
      const endpoint =
        year === 0 ? "/transactions/" : `/transactions?year=${year}`;
      const response = await api.get(endpoint, {
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

  async createTransactionAPI(transaction: TransactionInput): Promise<string | null> {
    try {
      const response = await api.post("/create_transaction/", transaction);
      if (response.status !== 200) return null;
      return (await response.data) as string;
    } catch (error) {
      console.log(error);
    }

    return null;
  }
}

const transactionService = new TransactionService();
export default transactionService;
