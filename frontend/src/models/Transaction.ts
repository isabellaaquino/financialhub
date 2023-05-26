export interface Transaction {
  id: number;
  value: number;
  date: string;
  to_user?: string;
  title: string;
  type: TypeOption;
  description?: string;
  recurrent: boolean;
  amount?: number;
  duration?: DurationOption;
}

export enum TypeOption {
  EXPENSE = "EXPENSE",
  TRANSFER = "TRANSFER",
  INCOME = "INCOME",
}

export enum DurationOption {
  DAYS = "days",
  MONTHS = "months",
  YEARS = "years"
}

export type TypeOptionType = typeof TypeOption[keyof typeof TypeOption]