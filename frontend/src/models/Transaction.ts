export interface Transaction {
  value: number;
  date: string;
  to_user: string;
  description: string;
  type: TypeOption;
}

export enum TypeOption {
  EXPENSE = "EXPENSE",
  TRANSFER = "TRANSFER",
  INCOME = "INCOME",
}
