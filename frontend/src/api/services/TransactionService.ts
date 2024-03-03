import { Transaction } from "../../models/Transaction";
import { NewTransactionFormData } from "../../schemas/newTransactionSchema";
import { api } from "./Api";

class TransactionService {
  async getUserLoggedTransactions(
    accessToken: string,
    year: number = 0
  ): Promise<Transaction[]> {
    try {
      const endpoint =
        year === 0 ? "/transactions/" : `/transactions?year=${year}`;
      const response = await api.get(endpoint, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = response.data as Transaction[];
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async createTransactionAPI({
    accessToken,
    transaction,
  }: {
    accessToken: string;
    transaction: NewTransactionFormData;
  }): Promise<{ [key: string]: string } | null> {
    try {
      const newTransaction = {
        ...transaction,
        date: transaction.date.toDate(),
      };
      const response = await api.post("/transaction/", newTransaction, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status !== 200) return null;
      return await response.data;
    } catch (error) {
      console.log(error);
    }

    return null;
  }

  async deleteTransactionAPI({
    accessToken,
    transaction_pk,
  }: {
    accessToken: string;
    transaction_pk: Number;
  }): Promise<{ [key: string]: string } | null> {
    try {
      const response = await api.delete(`/transaction/${transaction_pk}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return await response.data;
    } catch (error) {
      console.log(error);
    }
    return null;
  }
}

const transactionService = new TransactionService();
export default transactionService;
