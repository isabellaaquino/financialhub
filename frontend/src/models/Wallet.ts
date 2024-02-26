import { CustomLabel } from "./CustomLabel";

export interface Wallet {
  current_amount: number;
  monthly_incomes: number;
  monthly_expenses: number;
  labels?: CustomLabel[];
}
