import { Transaction } from "../../models/Transaction";
import useAxiosPrivate from "../useAxiosPrivate";
import { NewTransactionFormData } from "../../schemas/newTransactionSchema";

export function useTransactions() {
  const axiosPrivate = useAxiosPrivate();

  async function getTransactions(year: number = 0): Promise<Transaction[]> {
    try {
      const endpoint =
        year === 0 ? "/transactions/" : `/transactions?year=${year}`;
      const response = await axiosPrivate.get(endpoint);
      const data = response.data as Transaction[];
      return data;
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
        date: transaction.date.toDate(),
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
