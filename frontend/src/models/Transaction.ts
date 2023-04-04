export interface Transaction {
  value: number;
  date: string;
  to_user?: string;
  title: string;
  type: TypeOption;
  description?: string;
}

export enum TypeOption {
  EXPENSE = "EXPENSE",
  TRANSFER = "TRANSFER",
  INCOME = "INCOME",
}

export type TypeOptionType = typeof TypeOption[keyof typeof TypeOption]