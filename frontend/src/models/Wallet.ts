import { CustomLabel } from "./CustomLabel";

export interface Wallet {
  current_amount: number;
  monthly_earnings: number;
  monthly_expenses: number;
  labels?: CustomLabel[];
}
