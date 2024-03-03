import { useQuery } from "@tanstack/react-query";
import walletService from "../api/services/WalletService";

export function useWallet(accessToken: string) {
  return useQuery({
    queryKey: ["wallet", accessToken],
    queryFn: () => walletService.getUserLoggedWallet(accessToken),
  });
}
