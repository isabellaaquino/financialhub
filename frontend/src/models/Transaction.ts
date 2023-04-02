export interface Transaction {
  value: number;
  date: string;
  to_user: string;
  description: string;
  type: TypeOption;
}

export enum TypeOption {
  EXPENSE = "Expense",
  TRANSFER = "Transfer",
  INCOME = "Income",
}

export type TypeOptionType = typeof TypeOption[keyof typeof TypeOption]