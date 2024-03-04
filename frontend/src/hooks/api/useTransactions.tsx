import { Transaction } from "../../models/Transaction";
import useAxiosPrivate from "../useAxiosPrivate";
import { NewTransactionFormData } from "../../schemas/newTransactionSchema";

export function useTransactions() {
  const axiosPrivate = useAxiosPrivate();

  async function getTransactions(
    limit: number = 0,
    startDate?: Date,
    endDate?: Date,
    formatDataForCharts: boolean = false
  ): Promise<Transaction[]> {
    try {
      let endpoint = `/transactions?limit=${limit}&chart_data=${
        formatDataForCharts ? 1 : 0
      }`;
      if (startDate)
        endpoint += `&start_date=${startDate.toISOString().split("T")[0]}`;
      if (endDate)
        endpoint += `&end_date=${endDate.toISOString().split("T")[0]}`;
      const response = await axiosPrivate.get(endpoint);
      const transactions = response.data.map((t: Transaction) => {
        return { ...t, value: Number(t.value) } as Transaction;
      });
      return transactions;
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

  async function deleteTransaction(
    transaction_pk: number
  ): Promise<{ [key: string]: string } | null> {
    try {
      const response = await axiosPrivate.delete(
        `/transaction/${transaction_pk}`
      );
      return await response.data;
    } catch (error) {
      console.log(error);
    }
    return null;
  }

  // const query = useQuery({
  //   queryKey: ["transactions", currentYear],
  //   queryFn: () => getTransactions(currentYear),
  // });

  return { getTransactions, createTransaction, deleteTransaction };
}
