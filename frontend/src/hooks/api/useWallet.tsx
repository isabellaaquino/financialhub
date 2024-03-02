import useAxiosPrivate from "../useAxiosPrivate";
import { Wallet } from "../../models/Wallet";

export function useWallet() {
  const axiosPrivate = useAxiosPrivate();

  async function getWallet() {
    try {
      const response = await axiosPrivate.get("/wallet/");
      const data = (await response.data) as Wallet;
      return data;
    } catch (error) {
      console.log(error);
      return {
        current_amount: 0,
        monthly_expenses: 0,
        monthly_incomes: 0,
      } as Wallet;
    }
  }

  async function updateWallet({ value }: { value: number }) {
    try {
      const response = await axiosPrivate.put("/wallet/", value);
      const data = await response.data;
      return data;
    } catch (error: any) {
      return error.response.data;
    }
  }

  return { getWallet, updateWallet };
}
