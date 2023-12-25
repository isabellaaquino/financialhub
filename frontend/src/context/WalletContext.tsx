import { createContext, useEffect, useState } from "react";
import { Wallet } from "../models/Wallet";
import { Transaction } from "../models/Transaction";
import transactionService from "../api/services/TransactionService";
import walletService from "../api/services/WalletService";
import dateService from "../api/services/DateService";

interface WalletContextData {
  wallet: string;
  transactions: string;
	getWallet(authTokens: string): Promise<void>;
	getTransactions(authTokens: string): Promise<void>;
}

interface Props {
  children: React.ReactNode;
}

const WalletContext = createContext<WalletContextData>({} as WalletContextData);
export const WalletProvider = ({ children }: Props) => {
  let [wallet, setWallet] = useState<string | null>(() =>  localStorage.getItem("wallet"));
  let [transactions, setTransactions] = useState<string | null>(() => localStorage.getItem("wallet"));


  async function getWallet(authTokens: string) {
    const wallet = await walletService.getUserLoggedWallet(authTokens);
    //setWallet(wallet)
  }

  async function getTransactions(authTokens: string) {
    const transactions = await transactionService.getUserLoggedTransactions(
      authTokens,
      dateService.currentYear()
    );
    //setTransactions(transactions);
  }

  // return (
  //   <WalletContext.Provider
  //     value={{
  //       wallet,
  //       transactions,
  //       getWallet,
  //       getTransactions
  //     }}
  //   >
  //   </WalletContext.Provider>
  // );
};
export default WalletContext;
