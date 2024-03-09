import { CustomLabel } from "./CustomLabel";
import { AggregatedExpense } from "./Transaction";

export interface Wallet {
  current_amount: number;
  monthly_earnings: number;
  monthly_expenses: number;
  aggregated_expenses: AggregatedExpense[];
  labels?: CustomLabel[];
}
