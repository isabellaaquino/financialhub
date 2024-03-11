import { AggregatedExpense, Transaction } from "../../models/Transaction";
import { NewTransactionFormData } from "../../schemas/newTransactionSchema";
import useAxiosPrivate from "../useAxiosPrivate";

export function useTransactions() {
  const axiosPrivate = useAxiosPrivate();

  async function getTransactions(
    limit: number = 0,
    chartType: number = 0,
    startDate?: Date,
    endDate?: Date
  ): Promise<Transaction[] | AggregatedExpense[]> {
    try {
      let endpoint = `/transactions?limit=${limit}&chart_type=${chartType}`;
      if (startDate)
        endpoint += `&start_date=${startDate.toISOString().split("T")[0]}`;
      if (endDate)
        endpoint += `&end_date=${endDate.toISOString().split("T")[0]}`;
      const response = await axiosPrivate.get(endpoint);

      if (chartType === 2) {
        return response.data as AggregatedExpense[];
      }
      return response.data as Transaction[];
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async function createTransaction({
    transaction,
  }: {
    transaction: NewTransactionFormData;
  }): Promise<{ [key: string]: string } | null> {
    try {
      const newTransaction = {
        ...transaction,
        date: transaction.date,
      };
      const response = await axiosPrivate.post("/transaction/", newTransaction);
      if (response.status !== 200) return null;
      return await response.data;
    } catch (error) {
      console.log(error);
    }

    return null;
  }

  async function deleteTransaction({
    transactionId,
  }: {
    transactionId: number;
  }): Promise<{ [key: string]: string } | null> {
    try {
      const response = await axiosPrivate.delete(
        `/transaction/${transactionId}`
      );
      return await response.data;
    } catch (error) {
      console.log(error);
    }
    return null;
  }

  return { getTransactions, createTransaction, deleteTransaction };
}
