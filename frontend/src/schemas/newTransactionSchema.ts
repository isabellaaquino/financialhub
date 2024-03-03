import dayjs, { Dayjs } from "dayjs";
import { z } from "zod";
import { TypeOption } from "../models/Transaction";

export const newTransactionFormSchema = z.object({
  title: z.string().min(1, "Invalid email"),
  value: z.coerce.number(),
  label: z.object({
    id: z.number(),
    name: z.string(),
    color: z.string(),
  }),
  date: z.instanceof(dayjs as unknown as typeof Dayjs),
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
