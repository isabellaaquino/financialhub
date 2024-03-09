import { z } from "zod";

const MAX_FILE_SIZE = 300000;
const ACCEPTED_DOC_TYPES = ["application/pdf"];

export const newInvoiceImportSchema = z.object({
  invoices: z
    .instanceof(FileList)
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`
    )
    .refine(
      (files) => ACCEPTED_DOC_TYPES.includes(files?.[0]?.type),
      "Only .PDF files are accepted."
    ),
  institution: z.string(),
});

export type NewInvoiceImportFormData = z.infer<typeof newInvoiceImportSchema>;
