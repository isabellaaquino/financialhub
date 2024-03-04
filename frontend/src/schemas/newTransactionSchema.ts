import { z } from "zod";
import { TypeOption } from "../models/Transaction";
import dayjs, { Dayjs } from "dayjs";

export const newTransactionFormSchema = z.object({
  title: z.string().min(1, "Title must be at least 1 character long."),
  value: z.string().min(1, "Please select an amount >= 1.").transform((value) => {
    const normalizedValue = value.replace(',', '.');
    return parseFloat(normalizedValue);
  }),
  label: z.object({
    id: z.number(),
    name: z.string().min(1, "Please select a label."),
    color: z.string(),
  }),
  date: z.custom<Dayjs>((val) => val instanceof dayjs, "Please select a date"),
  type: z.nativeEnum(TypeOption).default(TypeOption.EXPENSE),
  updateWallet: z.boolean().default(false),
  recurring: z.boolean().default(false),
});

// title?: string;
// description?: string;
// label_id?: Number;
// value: number;
// date?: string;
// updateWallet: boolean;
// type: TypeOption;
// recurrent: boolean;
// amount?: number;
// duration?: DurationOption;

export type NewTransactionFormData = z.infer<typeof newTransactionFormSchema>;
