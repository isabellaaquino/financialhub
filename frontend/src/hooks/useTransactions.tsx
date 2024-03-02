import { useQuery } from "@tanstack/react-query";
import transactionService from "../api/services/TransactionService";

export function useTransactions(accessToken: string, currentYear: number) {
  return useQuery({
    queryKey: ["transactions", accessToken, currentYear],
    queryFn: () =>
      transactionService.getUserLoggedTransactions(accessToken, currentYear),
  });
}
