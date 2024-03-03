import { CustomLabel } from "./CustomLabel";

export interface Transaction {
  id: number;
  value: number;
  date: string;
  label?: CustomLabel;
  to_user?: string;
  title: string;
  type: TypeOption;
  description?: string;
  recurrent: boolean;
  amount?: number;
  duration?: DurationOption;
}

export interface AggregatedExpense {
  label_name: string;
  label_color: string;
  total_amount: number;
}

export enum TypeOption {
  EXPENSE = "EXPENSE",
  TRANSFER = "TRANSFER",
  INCOME = "INCOME",
}

export function typeOptionMask(type: TypeOption) {
  return type.slice(0, 1) + type.slice(1, type.length).toLowerCase();
}

export function typeOptionColor(type: TypeOption) {
  let color = "";
  let bgColor = "";
  switch (type) {
    case TypeOption.EXPENSE:
      color = "#f25659";
      bgColor = "#f2565936";
      break;
    case TypeOption.INCOME:
      color = "#48cc90";
      bgColor = "#48cc9030";
      break;
    case TypeOption.TRANSFER:
      color = "#d16bff";
      bgColor = "#d16bff3d";
      break;
  }
  return { bgColor, color };
}

export enum DurationOption {
  DAYS = "days",
  MONTHS = "months",
  YEARS = "years",
}

export type TypeOptionType = (typeof TypeOption)[keyof typeof TypeOption];
